"""Server-authoritative ledger for Pi Network U2A payments.

Every state transition of a Pi payment is written here, and every business
effect (project funding credit, contribution record) is applied exactly once.

Guarantees required for the Pi Developer payment review:
  * Idempotency: a payment identifier can only be credited once, even if the Pi
    SDK replays ``onReadyForServerCompletion`` or the Pioneer reopens the app.
  * Authority: amount, payer uid and metadata always come from the Pi Platform
    API response, never from the browser request body.
  * Auditability: approval/completion timestamps, txid and errors are persisted.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.contributions import Contributions
from models.pi_payments import Pi_payments
from models.projects import Projects

logger = logging.getLogger(__name__)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class PiPaymentLedger:
    """Persistence layer for the Pi payment lifecycle."""

    def __init__(self, db: AsyncSession):
        self.db = db

    # ------------------------------------------------------------------ reads

    async def get(self, payment_id: str, for_update: bool = False) -> Optional[Pi_payments]:
        stmt = select(Pi_payments).where(Pi_payments.payment_id == payment_id)
        if for_update:
            stmt = stmt.with_for_update()
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def lock_payment(self, payment_id: str) -> None:
        """Serialise concurrent writers for a single Pi payment.

        A transaction-scoped Postgres advisory lock protects the whole
        read-then-write sequence, including the very first INSERT, so two
        simultaneous ``onReadyForServerCompletion`` callbacks can never create
        two rows or credit a project twice. The lock is released automatically
        when the transaction commits or rolls back.
        """
        try:
            await self.db.execute(
                select(func.pg_advisory_xact_lock(func.hashtext(payment_id)))
            )
        except Exception as exc:  # pragma: no cover - non-Postgres fallback
            logger.warning("Advisory lock unavailable for %s: %s", payment_id, exc)

    async def list_for_user(self, user_id: str, limit: int = 50) -> list:
        result = await self.db.execute(
            select(Pi_payments)
            .where(Pi_payments.user_id == user_id)
            .order_by(Pi_payments.id.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def list_completed(self, purpose: Optional[str] = None, limit: int = 200) -> list:
        stmt = select(Pi_payments).where(Pi_payments.status == "completed")
        if purpose:
            stmt = stmt.where(Pi_payments.purpose == purpose)
        stmt = stmt.order_by(Pi_payments.id.desc()).limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def count_unique_testers(self, purpose: str = "payment_test") -> int:
        """Number of distinct Pioneers who completed a real payment."""
        result = await self.db.execute(
            select(func.count(func.distinct(Pi_payments.pi_uid))).where(
                Pi_payments.status == "completed",
                Pi_payments.purpose == purpose,
                Pi_payments.pi_uid.isnot(None),
            )
        )
        return int(result.scalar() or 0)

    async def stats(self, purpose: str = "payment_test") -> Dict[str, Any]:
        completed = await self.db.execute(
            select(func.count(), func.coalesce(func.sum(Pi_payments.amount), 0.0)).where(
                Pi_payments.status == "completed",
                Pi_payments.purpose == purpose,
            )
        )
        count, total = completed.one()
        return {
            "unique_testers": await self.count_unique_testers(purpose),
            "completed_payments": int(count or 0),
            "total_amount": round(float(total or 0.0), 7),
        }

    # ----------------------------------------------------------------- writes

    async def record_approval(
        self,
        *,
        payment_id: str,
        user_id: str,
        pi_uid: str,
        pi_username: str,
        amount: float,
        memo: str,
        purpose: str,
        project_id: int,
        network: str,
    ) -> Pi_payments:
        """Create or refresh the ledger row for an approved payment."""
        await self.lock_payment(payment_id)
        row = await self.get(payment_id, for_update=True)
        now = _utcnow()

        if row is None:
            row = Pi_payments(
                payment_id=payment_id,
                pi_uid=pi_uid or None,
                pi_username=pi_username or None,
                amount=amount,
                memo=memo or None,
                purpose=purpose,
                project_id=project_id,
                status="approved",
                network=network,
                approved_at=now,
                user_id=user_id,
            )
            self.db.add(row)
        else:
            # Never downgrade a completed payment.
            if row.status != "completed":
                row.status = "approved"
                row.approved_at = row.approved_at or now
            row.pi_uid = row.pi_uid or (pi_uid or None)
            row.pi_username = row.pi_username or (pi_username or None)
            row.amount = amount
            row.purpose = purpose
            row.project_id = project_id
            row.network = network
            row.error_message = None

        await self.db.commit()
        await self.db.refresh(row)
        return row

    async def record_completion(
        self,
        *,
        payment_id: str,
        user_id: str,
        pi_uid: str,
        pi_username: str,
        amount: float,
        memo: str,
        purpose: str,
        project_id: int,
        network: str,
        txid: str,
    ) -> Dict[str, Any]:
        """Persist a completed payment and apply its business effect once.

        Returns a dict with ``row`` and ``already_completed`` so the caller can
        avoid crediting a project twice.
        """
        await self.lock_payment(payment_id)
        row = await self.get(payment_id, for_update=True)
        now = _utcnow()

        if row is not None and row.status == "completed":
            logger.info("Pi payment %s already completed, skipping side effects", payment_id)
            return {"row": row, "already_completed": True}

        if row is None:
            row = Pi_payments(
                payment_id=payment_id,
                purpose=purpose,
                project_id=project_id,
                user_id=user_id,
                amount=amount,
                status="completed",
            )
            self.db.add(row)

        row.pi_uid = pi_uid or row.pi_uid
        row.pi_username = pi_username or row.pi_username
        row.amount = amount
        row.memo = memo or row.memo
        row.purpose = purpose
        row.project_id = project_id
        row.network = network
        row.txid = txid or row.txid
        row.status = "completed"
        row.approved_at = row.approved_at or now
        row.completed_at = now
        row.error_message = None

        await self._apply_business_effect(
            purpose=purpose,
            project_id=project_id,
            amount=amount,
            payment_id=payment_id,
            txid=txid,
            pi_uid=pi_uid,
            user_id=user_id,
        )

        await self.db.commit()
        await self.db.refresh(row)
        return {"row": row, "already_completed": False}

    async def record_cancellation(self, payment_id: str, reason: str = "") -> Optional[Pi_payments]:
        row = await self.get(payment_id)
        if row is None:
            return None
        if row.status != "completed":
            row.status = "cancelled"
            row.error_message = (reason or "Cancelled by the Pioneer")[:500]
            await self.db.commit()
            await self.db.refresh(row)
        return row

    async def record_error(self, payment_id: str, message: str) -> None:
        row = await self.get(payment_id)
        if row is None or row.status == "completed":
            return
        row.status = "error"
        row.error_message = (message or "")[:500]
        await self.db.commit()

    # ------------------------------------------------------- business effects

    async def _apply_business_effect(
        self,
        *,
        purpose: str,
        project_id: int,
        amount: float,
        payment_id: str,
        txid: str,
        pi_uid: str,
        user_id: str,
    ) -> None:
        """Credit the funded project and record the contribution, once."""
        if purpose != "project_funding" or not project_id:
            return

        existing = await self.db.execute(
            select(Contributions).where(Contributions.payment_id == payment_id)
        )
        if existing.scalars().first() is not None:
            logger.info("Contribution for Pi payment %s already exists", payment_id)
            return

        project_result = await self.db.execute(
            select(Projects).where(Projects.id == project_id)
        )
        project = project_result.scalar_one_or_none()
        if project is not None:
            project.raised = float(project.raised or 0) + amount
            if project.budget and project.raised >= float(project.budget):
                project.status = "funded"

        self.db.add(
            Contributions(
                project_id=project_id,
                amount=amount,
                transaction_id=txid or None,
                payment_id=payment_id,
                status="completed",
                pi_uid=pi_uid or "unknown",
                user_id=user_id,
            )
        )