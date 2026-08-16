import json
import logging
import os
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.database import get_db
from dependencies.auth import get_current_user
from schemas.auth import UserResponse
from app.backend.models.projects import Projects
from app.backend.models.contributions import Contributions
from app.backend.models.pi_profiles import Pi_profiles

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/pi-payments", tags=["pi-payments"])

PI_API_BASE = "https://api.minepi.com"


class ApprovePaymentRequest(BaseModel):
    payment_id: str


class CompletePaymentRequest(BaseModel):
    payment_id: str
    txid: str
    project_id: int
    amount: float
    pi_uid: str


class PaymentStatusRequest(BaseModel):
    payment_id: str


class A2UPaymentRequest(BaseModel):
    recipient_uid: str
    amount: float
    memo: str = "PoliGov reward"


class PaymentResponse(BaseModel):
    status: str
    payment_id: Optional[str] = None
    txid: Optional[str] = None
    message: str = ""


@router.post("/approve", response_model=PaymentResponse)
async def approve_payment(
    data: ApprovePaymentRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Approve a Pi payment (called by frontend after Pi.createPayment)"""
    pi_api_key = os.environ.get("PI_API_KEY", "")

    if not pi_api_key:
        raise HTTPException(status_code=500, detail="PI_API_KEY not configured")

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                f"{PI_API_BASE}/v2/payments/{data.payment_id}/approve",
                headers={
                    "Authorization": f"Key {pi_api_key}",
                    "Content-Type": "application/json"
                }
            )

        if response.status_code == 200:
            return PaymentResponse(
                status="approved",
                payment_id=data.payment_id,
                message="Payment approved successfully"
            )
        else:
            error_detail = response.text
            logger.error(f"Pi API approve error: {error_detail}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Pi API error: {error_detail}"
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment approval error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Payment approval failed: {str(e)}")


@router.post("/complete", response_model=PaymentResponse)
async def complete_payment(
    data: CompletePaymentRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Complete a Pi payment and update project funding"""
    pi_api_key = os.environ.get("PI_API_KEY", "")

    if not pi_api_key:
        raise HTTPException(status_code=500, detail="PI_API_KEY not configured")

    try:
        # Call Pi API to complete the payment
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                f"{PI_API_BASE}/v2/payments/{data.payment_id}/complete",
                headers={
                    "Authorization": f"Key {pi_api_key}",
                    "Content-Type": "application/json"
                },
                json={"txid": data.txid}
            )

        if response.status_code != 200:
            error_detail = response.text
            logger.error(f"Pi API complete error: {error_detail}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Pi API error: {error_detail}"
            )

        # Update project raised amount
        project_stmt = select(Projects).where(Projects.id == data.project_id)
        project_result = await db.execute(project_stmt)
        project = project_result.scalar_one_or_none()

        if project:
            project.raised = (project.raised or 0) + data.amount
            # Check if project is fully funded
            if project.raised >= project.budget:
                project.status = "funded"

        # Create contribution record
        contribution = Contributions(
            project_id=data.project_id,
            amount=data.amount,
            transaction_id=data.txid,
            payment_id=data.payment_id,
            status="completed",
            pi_uid=data.pi_uid,
            user_id=str(current_user.id)
        )
        db.add(contribution)
        await db.commit()

        return PaymentResponse(
            status="completed",
            payment_id=data.payment_id,
            txid=data.txid,
            message=f"Payment completed. {data.amount} π contributed to project."
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment completion error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Payment completion failed: {str(e)}")


@router.post("/status")
async def get_payment_status(
    data: PaymentStatusRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    """Get payment status from Pi API"""
    pi_api_key = os.environ.get("PI_API_KEY", "")

    if not pi_api_key:
        raise HTTPException(status_code=500, detail="PI_API_KEY not configured")

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(
                f"{PI_API_BASE}/v2/payments/{data.payment_id}",
                headers={
                    "Authorization": f"Key {pi_api_key}",
                    "Content-Type": "application/json"
                }
            )

        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Pi API error: {response.text}"
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment status error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get payment status: {str(e)}")


@router.post("/a2u", response_model=PaymentResponse)
async def create_a2u_payment(
    data: A2UPaymentRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create an App-to-User payment (for rewards/refunds)"""
    pi_api_key = os.environ.get("PI_API_KEY", "")

    if not pi_api_key:
        raise HTTPException(status_code=500, detail="PI_API_KEY not configured")

    try:
        # Create A2U payment via Pi API
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                f"{PI_API_BASE}/v2/payments",
                headers={
                    "Authorization": f"Key {pi_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "amount": data.amount,
                    "memo": data.memo,
                    "metadata": {"type": "reward", "app": "poligov"},
                    "uid": data.recipient_uid
                }
            )

        if response.status_code in (200, 201):
            payment_data = response.json()
            return PaymentResponse(
                status="created",
                payment_id=payment_data.get("identifier", ""),
                message=f"A2U payment of {data.amount} π created for {data.recipient_uid}"
            )
        else:
            error_detail = response.text
            logger.error(f"Pi API A2U error: {error_detail}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Pi API error: {error_detail}"
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"A2U payment error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"A2U payment failed: {str(e)}")
