"""Read-only access to the Pi payment ledger.

The ledger is written exclusively by the server-side Pi payment flow in
``routers/pi_pay.py`` after the Pi Platform API has been queried. Exposing
public create/update/delete routes would let a browser forge a "completed"
payment, so this router only offers authenticated read access, scoped to the
records owned by the caller.
"""

import logging
from typing import List, Optional

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from dependencies.auth import get_current_user
from models.pi_payments import Pi_payments
from schemas.auth import UserResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/pi_payments", tags=["pi_payments"])


class Pi_paymentsResponse(BaseModel):
    """Public projection of a ledger row."""

    id: int
    payment_id: str
    txid: Optional[str] = None
    pi_uid: Optional[str] = None
    pi_username: Optional[str] = None
    amount: float
    memo: Optional[str] = None
    purpose: Optional[str] = None
    project_id: Optional[int] = None
    status: str
    network: Optional[str] = None
    approved_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Pi_paymentsListResponse(BaseModel):
    items: List[Pi_paymentsResponse]
    total: int
    skip: int
    limit: int


@router.get("", response_model=Pi_paymentsListResponse)
async def list_own_pi_payments(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=200, description="Max number of records to return"),
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    """List the ledger rows owned by the authenticated account."""
    user_id = str(current_user.id)
    try:
        base = select(Pi_payments).where(Pi_payments.user_id == user_id)
        rows = await db.execute(base.order_by(Pi_payments.id.desc()).offset(skip).limit(limit))
        items = list(rows.scalars().all())

        counted = await db.execute(base)
        total = len(list(counted.scalars().all()))

        return {"items": items, "total": total, "skip": skip, "limit": limit}
    except Exception as exc:  # pragma: no cover - defensive
        logger.error("Error listing pi_payments: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{id}", response_model=Pi_paymentsResponse)
async def get_own_pi_payment(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user),
):
    """Fetch a single ledger row owned by the authenticated account."""
    user_id = str(current_user.id)
    result = await db.execute(
        select(Pi_payments).where(
            Pi_payments.id == id,
            Pi_payments.user_id == user_id,
        )
    )
    row = result.scalars().first()
    if row is None:
        raise HTTPException(status_code=404, detail="Pi payment not found")
    return row