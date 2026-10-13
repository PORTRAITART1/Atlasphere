"""Secure Pi Network payment endpoints for Atlasphere.

Implements the four-step Pi U2A (User-to-App) payment flow mandated by the Pi
Platform:

  1. Frontend calls ``Pi.createPayment`` inside Pi Browser.
  2. ``onReadyForServerApproval`` -> ``POST /api/v1/pi-pay/approve``
  3. The Pioneer signs the transaction in the Pi Wallet.
  4. ``onReadyForServerCompletion`` -> ``POST /api/v1/pi-pay/complete``

Security rules enforced here:
  * The browser only ever sends a ``payment_id`` (and the ``txid`` given by the
    Pi SDK). Amount, payer identity, direction and metadata are re-read from the
    Pi Platform API before any decision is taken.
  * Purpose and amount are validated against a server-side whitelist/ceiling.
  * Completion is idempotent, so a project can never be credited twice.
  * ``PI_API_KEY`` stays on the server; it is never returned to the frontend.
"""

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.database import get_db
from app.backend.dependencies.auth import get_current_user, get_optional_user
from app.backend.models.pi_profiles import Pi_profiles
from app.backend.schemas.auth import UserResponse
from app.backend.services import pi_platform
from app.backend.services.pi_payment_ledger import PiPaymentLedger
from app.backend.services.pi_platform import PiPlatformError, PiPlatformService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/pi-pay", tags=["pi-pay"])

# Number of distinct Pioneers Pi Network requires before reviewing the app.
REQUIRED_TESTERS = 5


# ------------------------------------------------------------------ schemas


class PaymentIdRequest(BaseModel):
    payment_id: str = Field(..., min_length=3, max_length=200)
    # Pi Browser always holds a Pi access token; it proves the payer identity
    # even when the Pioneer has no Atlasphere platform session.
    pi_access_token: str = Field("", max_length=4000)


class CompletePaymentRequest(BaseModel):
    payment_id: str = Field(..., min_length=3, max_length=200)
    txid: str = Field(..., min_length=3, max_length=200)
    pi_access_token: str = Field("", max_length=4000)


class CancelPaymentRequest(BaseModel):
    payment_id: str = Field(..., min_length=3, max_length=200)
    reason: str = Field("", max_length=300)


class PaymentResult(BaseModel):
    status: str
    payment_id: str
    txid: Optional[str] = None
    amount: Optional[float] = None
    purpose: Optional[str] = None
    project_id: Optional[int] = None
    already_completed: bool = False
    message: str = ""


class ConfigResponse(BaseModel):
    server_ready: bool
    allowed_purposes: Dict[str, float]
    min_amount: float
    test_amounts: List[float]
    required_testers: int
    message: str


class TestStatsResponse(BaseModel):
    unique_testers: int
    completed_payments: int
    total_amount: float
    required_testers: int
    requirement_met: bool
    testers: List[Dict[str, Any]]


class MyPaymentsResponse(BaseModel):
    items: List[Dict[str, Any]]
    total: int


# ------------------------------------------------------------------ helpers


def _mask_username(username: Optional[str]) -> str:
    """Show enough of a Pi username to identify a tester without exposing it."""
    name = (username or "").strip()
    if not name:
        return "pioneer***"
    if len(name) <= 3:
        return f"{name[0]}***"
    return f"{name[:3]}***{name[-1]}"


def _serialize(row) -> Dict[str, Any]:
    return {
        "payment_id": row.payment_id,
        "txid": row.txid,
        "amount": float(row.amount or 0),
        "memo": row.memo,
        "purpose": row.purpose,
        "project_id": row.project_id or 0,
        "status": row.status,
        "network": row.network,
        "completed_at": row.completed_at.isoformat() if row.completed_at else None,
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }


async def _resolve_username(db: AsyncSession, pi_uid: str) -> str:
    """Resolve a Pi username from the stored profile, never from the request."""
    if not pi_uid:
        return ""
    result = await db.execute(select(Pi_profiles).where(Pi_profiles.pi_uid == pi_uid))
    profile = result.scalars().first()
    return (profile.username or "") if profile else ""


async def _bind_pi_profile(db: AsyncSession, user_id: str, pi_uid: str, username: str) -> None:
    """Best-effort binding between an Atlasphere account and a Pi identity."""
    if not user_id or user_id.startswith("pi:") or not pi_uid:
        return
    try:
        result = await db.execute(
            select(Pi_profiles).where(
                Pi_profiles.user_id == user_id,
                Pi_profiles.pi_uid == pi_uid,
            )
        )
        profile = result.scalars().first()
        if profile is None:
            db.add(
                Pi_profiles(
                    pi_uid=pi_uid,
                    username=username or pi_uid[:12],
                    display_name=username or None,
                    user_id=user_id,
                    last_active="now",
                )
            )
        elif username and profile.username != username:
            profile.username = username
        await db.commit()
    except Exception as exc:  # pragma: no cover - never block a real payment
        logger.warning("Could not bind Pi profile for account %s: %s", user_id, exc)
        await db.rollback()


async def _resolve_caller_identity(
    db: AsyncSession,
    service: PiPlatformService,
    current_user: Optional[UserResponse],
    payer_uid: str,
    access_token: str,
) -> Dict[str, str]:
    """Authenticate the payer of a Pi payment.

    Two proofs of identity are accepted, in this order:

    1. A Pi Network access token whose ``uid`` equals the payer uid returned by
       the Pi Platform API. This is the proof Pi Browser always has, so a
       Pioneer can pay even without an Atlasphere platform session. The Pi
       wallet only waits a few seconds for the server approval, therefore this
       path must never depend on a pre-existing local profile.
    2. An Atlasphere session already bound to that ``pi_uid`` in ``pi_profiles``.

    Anything else is refused, so a payment can never be claimed by somebody
    else (which would inflate the distinct-tester count).
    """
    if not payer_uid:
        raise HTTPException(status_code=400, detail="The Pi payment has no payer identity.")

    token_uid = ""
    token_username = ""
    if access_token:
        try:
            me = await service.verify_access_token(access_token)
            token_uid = str(me.get("uid") or "")
            token_username = str(me.get("username") or "")
        except PiPlatformError as exc:
            logger.warning("Pi access token rejected during payment: %s", exc.detail)

    if token_uid and token_uid == payer_uid:
        user_id = str(current_user.id) if current_user else f"pi:{payer_uid}"
        await _bind_pi_profile(db, user_id, payer_uid, token_username)
        username = token_username or await _resolve_username(db, payer_uid)
        return {"user_id": user_id, "pi_uid": payer_uid, "pi_username": username}

    if current_user is None:
        raise HTTPException(
            status_code=403,
            detail="Sign in with Pi Network before submitting a Pi payment.",
        )

    result = await db.execute(
        select(Pi_profiles).where(Pi_profiles.user_id == str(current_user.id))
    )
    profiles = list(result.scalars().all())

    if payer_uid not in {(profile.pi_uid or "") for profile in profiles}:
        logger.warning("Pi payer %s does not belong to account %s", payer_uid, current_user.id)
        raise HTTPException(
            status_code=403,
            detail="This Pi payment belongs to a different Pi Network account.",
        )

    return {
        "user_id": str(current_user.id),
        "pi_uid": payer_uid,
        "pi_username": await _resolve_username(db, payer_uid),
    }


async def _load_authoritative_payment(
    service: PiPlatformService, payment_id: str
) -> Dict[str, Any]:
    """Fetch the payment from Pi Network and run all server-side validations."""
    payment = await service.get_payment(payment_id)
    pi_platform.assert_user_to_app(payment)

    purpose = pi_platform.resolve_purpose(payment.get("metadata"))
    amount = pi_platform.validate_amount(purpose, payment.get("amount"))
    project_id = pi_platform.resolve_project_id(payment.get("metadata"))

    if purpose in pi_platform.PROJECT_PURPOSES and project_id <= 0:
        raise PiPlatformError(400, "A project id is required for a project funding payment.")

    return {
        "payment": payment,
        "purpose": purpose,
        "amount": amount,
        "project_id": project_id,
        "flags": pi_platform.payment_flags(payment),
        "network": pi_platform.detect_network(payment),
        "pi_uid": str(payment.get("user_uid") or ""),
        "memo": str(payment.get("memo") or "")[:300],
        "txid": pi_platform.payment_txid(payment),
    }


# ------------------------------------------------------------------- routes


@router.get("/config", response_model=ConfigResponse)
async def get_payment_config():
    """Tell the frontend whether real Pi payments can be processed."""
    ready = pi_platform.is_configured()
    return ConfigResponse(
        server_ready=ready,
        allowed_purposes=pi_platform.ALLOWED_PURPOSES,
        min_amount=pi_platform.MIN_AMOUNT,
        test_amounts=[0.1, 0.5, 1.0],
        required_testers=REQUIRED_TESTERS,
        message=(
            "Pi Platform server key detected. Real payments are enabled."
            if ready
            else "Pi Platform server key missing. Real payments are disabled."
        ),
    )


@router.post("/approve", response_model=PaymentResult)
async def approve_payment(
    data: PaymentIdRequest,
    current_user: Optional[UserResponse] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Step 2 of the Pi U2A flow: server-side approval."""
    service = PiPlatformService()
    ledger = PiPaymentLedger(db)

    try:
        info = await _load_authoritative_payment(service, data.payment_id)
        flags = info["flags"]

        if flags["cancelled"]:
            await ledger.record_cancellation(data.payment_id, "Cancelled on the Pi Network side")
            raise HTTPException(status_code=409, detail="This Pi payment was cancelled.")

        identity = await _resolve_caller_identity(
            db, service, current_user, info["pi_uid"], data.pi_access_token
        )

        if not flags["developer_approved"]:
            await service.approve_payment(data.payment_id)

        row = await ledger.record_approval(
            payment_id=data.payment_id,
            user_id=identity["user_id"],
            pi_uid=identity["pi_uid"],
            pi_username=identity["pi_username"],
            amount=info["amount"],
            memo=info["memo"],
            purpose=info["purpose"],
            project_id=info["project_id"],
            network=info["network"],
        )

        return PaymentResult(
            status="approved",
            payment_id=row.payment_id,
            amount=float(row.amount),
            purpose=row.purpose,
            project_id=row.project_id or 0,
            message=f"Payment of {row.amount} \u03c0 approved by the Atlasphere server.",
        )

    except PiPlatformError as exc:
        await ledger.record_error(data.payment_id, exc.detail)
        raise HTTPException(status_code=exc.status_code, detail=exc.detail)
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - defensive
        logger.error("Pi payment approval failed: %s", exc, exc_info=True)
        await ledger.record_error(data.payment_id, str(exc))
        raise HTTPException(status_code=500, detail="Payment approval failed.")


@router.post("/complete", response_model=PaymentResult)
async def complete_payment(
    data: CompletePaymentRequest,
    current_user: Optional[UserResponse] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Step 4 of the Pi U2A flow: verify on-chain, then complete and credit."""
    service = PiPlatformService()
    ledger = PiPaymentLedger(db)

    try:
        info = await _load_authoritative_payment(service, data.payment_id)
        flags = info["flags"]

        if flags["cancelled"]:
            await ledger.record_cancellation(data.payment_id, "Cancelled on the Pi Network side")
            raise HTTPException(status_code=409, detail="This Pi payment was cancelled.")

        identity = await _resolve_caller_identity(
            db, service, current_user, info["pi_uid"], data.pi_access_token
        )

        existing = await ledger.get(data.payment_id)

        # Ownership is decided on the Pi identity, which the Pi Platform API
        # returns, never on a value sent by the browser.
        if existing is not None and existing.pi_uid and existing.pi_uid != identity["pi_uid"]:
            raise HTTPException(
                status_code=403,
                detail="This Pi payment belongs to a different Pi Network account.",
            )

        if existing is not None and existing.status == "completed":
            return PaymentResult(
                status="completed",
                payment_id=existing.payment_id,
                txid=existing.txid,
                amount=float(existing.amount or 0),
                purpose=existing.purpose,
                project_id=existing.project_id or 0,
                already_completed=True,
                message="This Pi payment was already completed.",
            )

        # Pi Network is the authority: a payment may only be completed once Pi
        # itself reports the developer approval.
        if not flags["developer_approved"]:
            raise HTTPException(
                status_code=409,
                detail="This Pi payment is not approved on the Pi Network side.",
            )

        # When a local approval row exists, its recorded purpose, project and
        # amount must still match the authoritative payment.
        if existing is not None and existing.status != "cancelled" and (
            existing.purpose != info["purpose"]
            or (existing.project_id or 0) != info["project_id"]
            or round(float(existing.amount or 0), 7) != round(float(info["amount"]), 7)
        ):
            raise HTTPException(
                status_code=409,
                detail="The Pi payment details changed after approval and cannot be completed.",
            )

        # The transaction id must match what Pi Network recorded on-chain.
        chain_txid = info["txid"]
        if chain_txid and chain_txid != data.txid:
            raise HTTPException(
                status_code=400,
                detail="The provided transaction id does not match the Pi Network record.",
            )

        if not flags["transaction_verified"]:
            raise HTTPException(
                status_code=409,
                detail="The Pi blockchain transaction is not verified yet. Please retry shortly.",
            )

        if not flags["developer_completed"]:
            await service.complete_payment(data.payment_id, data.txid)

        outcome = await ledger.record_completion(
            payment_id=data.payment_id,
            user_id=identity["user_id"],
            pi_uid=identity["pi_uid"],
            pi_username=identity["pi_username"],
            amount=info["amount"],
            memo=info["memo"],
            purpose=info["purpose"],
            project_id=info["project_id"],
            network=info["network"],
            txid=chain_txid or data.txid,
        )
        row = outcome["row"]

        return PaymentResult(
            status="completed",
            payment_id=row.payment_id,
            txid=row.txid,
            amount=float(row.amount),
            purpose=row.purpose,
            project_id=row.project_id or 0,
            already_completed=bool(outcome["already_completed"]),
            message=f"Payment of {row.amount} \u03c0 completed and verified on the Pi blockchain.",
        )

    except PiPlatformError as exc:
        await ledger.record_error(data.payment_id, exc.detail)
        raise HTTPException(status_code=exc.status_code, detail=exc.detail)
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - defensive
        logger.error("Pi payment completion failed: %s", exc, exc_info=True)
        await ledger.record_error(data.payment_id, str(exc))
        raise HTTPException(status_code=500, detail="Payment completion failed.")


@router.post("/cancel", response_model=PaymentResult)
async def cancel_payment(
    data: CancelPaymentRequest,
    current_user: Optional[UserResponse] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Record a payment the Pioneer cancelled in the Pi Wallet."""
    ledger = PiPaymentLedger(db)
    row = await ledger.record_cancellation(data.payment_id, data.reason)
    return PaymentResult(
        status=row.status if row else "cancelled",
        payment_id=data.payment_id,
        amount=float(row.amount) if row else None,
        purpose=row.purpose if row else None,
        message="Payment cancellation recorded.",
    )


@router.post("/status")
async def payment_status(
    data: PaymentIdRequest,
    current_user: Optional[UserResponse] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Return the authoritative Pi Network status plus the local ledger row."""
    ledger = PiPaymentLedger(db)
    row = await ledger.get(data.payment_id)
    remote: Dict[str, Any] = {}

    if pi_platform.is_configured():
        try:
            payment = await PiPlatformService().get_payment(data.payment_id)
            remote = {
                "amount": payment.get("amount"),
                "direction": payment.get("direction"),
                "status": pi_platform.payment_flags(payment),
                "txid": pi_platform.payment_txid(payment),
            }
        except PiPlatformError as exc:
            remote = {"error": exc.detail}

    return {
        "payment_id": data.payment_id,
        "ledger": _serialize(row) if row else None,
        "pi_network": remote,
    }


@router.get("/my-payments", response_model=MyPaymentsResponse)
async def my_payments(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Payment history of the signed-in Pioneer."""
    ledger = PiPaymentLedger(db)
    rows = await ledger.list_for_user(str(current_user.id))
    return MyPaymentsResponse(items=[_serialize(row) for row in rows], total=len(rows))


@router.get("/test-stats", response_model=TestStatsResponse)
async def test_stats(db: AsyncSession = Depends(get_db)):
    """Progress towards the Pi Developer requirement of 5 distinct testers."""
    ledger = PiPaymentLedger(db)
    stats = await ledger.stats("payment_test")
    rows = await ledger.list_completed("payment_test", limit=100)

    seen: Dict[str, Dict[str, Any]] = {}
    for row in rows:
        key = row.pi_uid or row.payment_id
        if key not in seen:
            seen[key] = {
                "tester": _mask_username(row.pi_username),
                "amount": float(row.amount or 0),
                "network": row.network,
                "completed_at": row.completed_at.isoformat() if row.completed_at else None,
            }

    return TestStatsResponse(
        unique_testers=stats["unique_testers"],
        completed_payments=stats["completed_payments"],
        total_amount=stats["total_amount"],
        required_testers=REQUIRED_TESTERS,
        requirement_met=stats["unique_testers"] >= REQUIRED_TESTERS,
        testers=list(seen.values())[:20],
    )