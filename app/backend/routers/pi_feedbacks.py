"""Pioneer feedback collected after the real Pi Network payment tests.

Security model
--------------
A testimonial is only trustworthy if it really comes from a Pi Network
Pioneer, so this router deliberately does NOT expose the generic public CRUD
routes: anybody could otherwise forge dozens of five-star reviews.

* Writing requires a **Pi Network access token**, verified server-side through
  ``GET /v2/me``. The ``pi_uid`` is taken from Pi Network, never from the
  request body, and one Pioneer owns exactly one feedback entry (re-submitting
  updates it instead of inflating the counters).
* ``verified_payment`` is computed server-side from the payment ledger, so the
  "verified tester" badge cannot be faked by the client.
* Reading published feedback is public (it is the testimonial wall), but only
  a safe projection of the row is returned.
"""

import logging
import re
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from models.pi_feedbacks import Pi_feedbacks
from models.pi_payments import Pi_payments
from services.pi_platform import PiPlatformError, PiPlatformService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/pi-feedback", tags=["pi-feedback"])

MAX_COMMENT_LENGTH = 600
MAX_DEVICE_LENGTH = 120
SUPPORTED_LANGUAGES = ("en", "ar", "zh", "ru", "fr", "pt", "es")
ALLOWED_NETWORKS = ("Pi Testnet", "Pi Mainnet")

_CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


# ------------------------------------------------------------------ schemas


class FeedbackSubmitRequest(BaseModel):
    """A Pioneer testimonial. Identity always comes from the Pi token."""

    pi_access_token: str = Field(..., min_length=8, description="Pi Network access token")
    rating: int = Field(..., ge=1, le=5, description="Star rating from 1 to 5")
    comment: str = Field("", description="Free-text testimonial")
    language: str = Field("en", description="UI language used by the Pioneer")
    device_info: str = Field("", description="Optional device / browser hint")


class FeedbackPublicItem(BaseModel):
    """Safe projection of a published testimonial."""

    id: int
    pi_username: str
    rating: int
    comment: str
    language: str
    network: Optional[str] = None
    verified_payment: bool
    created_at: Optional[str] = None


class FeedbackListResponse(BaseModel):
    items: List[FeedbackPublicItem]
    total: int
    skip: int
    limit: int


class FeedbackSummaryResponse(BaseModel):
    total: int
    verified_total: int
    average_rating: float
    positive_rate: float
    distribution: Dict[str, int]


class FeedbackMineResponse(BaseModel):
    submitted: bool
    feedback: Optional[FeedbackPublicItem] = None


class FeedbackSubmitResponse(BaseModel):
    status: str
    created: bool
    feedback: FeedbackPublicItem
    message: str


# ------------------------------------------------------------------ helpers


def _clean_text(value: Optional[str], max_length: int) -> str:
    """Strip control characters and clamp the length of user-supplied text."""
    text = _CONTROL_CHARS.sub("", str(value or "")).strip()
    return text[:max_length]


def _clean_language(value: Optional[str]) -> str:
    code = str(value or "").strip().lower()[:2]
    return code if code in SUPPORTED_LANGUAGES else "en"


def _public_username(row: Pi_feedbacks) -> str:
    """Public display name of the author, resolved from the stored Pi profile."""
    name = (row.pi_username or "").strip()
    if name:
        return name
    uid = (row.pi_uid or "").strip()
    return f"pioneer-{uid[:6]}" if uid else "pioneer"


def _serialize(row: Pi_feedbacks) -> Dict[str, Any]:
    return {
        "id": row.id,
        "pi_username": _public_username(row),
        "rating": int(row.rating or 0),
        "comment": row.comment or "",
        "language": row.language or "en",
        "network": row.network,
        "verified_payment": bool(row.verified_payment),
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }


async def _authenticate_pioneer(access_token: str) -> Dict[str, str]:
    """Resolve a Pi access token to its owner. The only accepted identity proof."""
    service = PiPlatformService()
    try:
        me = await service.verify_access_token(access_token)
    except PiPlatformError as exc:
        logger.warning("Feedback rejected, invalid Pi token: %s", exc.detail)
        raise HTTPException(
            status_code=401,
            detail="Your Pi Network session could not be verified. Reopen Atlasphere in Pi Browser and sign in again.",
        )

    pi_uid = str(me.get("uid") or "").strip()
    if not pi_uid:
        raise HTTPException(status_code=401, detail="The Pi Network token carries no Pioneer identity.")

    return {"pi_uid": pi_uid, "pi_username": str(me.get("username") or "").strip()}


async def _payment_context(db: AsyncSession, pi_uid: str) -> Dict[str, Any]:
    """Look up the Pioneer's latest completed payment to certify the feedback."""
    result = await db.execute(
        select(Pi_payments)
        .where(Pi_payments.pi_uid == pi_uid, Pi_payments.status == "completed")
        .order_by(Pi_payments.id.desc())
        .limit(1)
    )
    row = result.scalars().first()
    if row is None:
        return {"verified_payment": False, "payment_id": None, "network": None}

    network = row.network if row.network in ALLOWED_NETWORKS else None
    return {"verified_payment": True, "payment_id": row.payment_id, "network": network}


# ------------------------------------------------------------------- routes


@router.get("/list", response_model=FeedbackListResponse)
async def list_feedback(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    min_rating: int = Query(1, ge=1, le=5, description="Keep only ratings >= this value"),
    verified_only: bool = Query(False, description="Keep only Pioneers with a completed payment"),
    db: AsyncSession = Depends(get_db),
):
    """Public testimonial wall: published feedback, newest first."""
    conditions = [
        Pi_feedbacks.is_published.is_(True),
        Pi_feedbacks.rating >= min_rating,
    ]
    if verified_only:
        conditions.append(Pi_feedbacks.verified_payment.is_(True))

    base = select(Pi_feedbacks).where(*conditions)
    try:
        rows = await db.execute(base.order_by(Pi_feedbacks.id.desc()).offset(skip).limit(limit))
        items = [_serialize(row) for row in rows.scalars().all()]

        counted = await db.execute(base)
        total = len(list(counted.scalars().all()))
    except Exception as exc:  # pragma: no cover - defensive
        logger.error("Error listing Pioneer feedback: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Feedback could not be loaded.")

    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/summary", response_model=FeedbackSummaryResponse)
async def feedback_summary(db: AsyncSession = Depends(get_db)):
    """Aggregated satisfaction indicators shown next to the testimonial wall."""
    try:
        result = await db.execute(
            select(Pi_feedbacks).where(Pi_feedbacks.is_published.is_(True))
        )
        rows = list(result.scalars().all())
    except Exception as exc:  # pragma: no cover - defensive
        logger.error("Error aggregating Pioneer feedback: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Feedback summary could not be computed.")

    distribution = {str(star): 0 for star in range(1, 6)}
    ratings: List[int] = []
    verified_total = 0

    for row in rows:
        rating = int(row.rating or 0)
        if 1 <= rating <= 5:
            distribution[str(rating)] += 1
            ratings.append(rating)
        if row.verified_payment:
            verified_total += 1

    total = len(ratings)
    average = round(sum(ratings) / total, 2) if total else 0.0
    positive = len([value for value in ratings if value >= 4])
    positive_rate = round(positive / total * 100, 1) if total else 0.0

    return {
        "total": total,
        "verified_total": verified_total,
        "average_rating": average,
        "positive_rate": positive_rate,
        "distribution": distribution,
    }


@router.post("/mine", response_model=FeedbackMineResponse)
async def my_feedback(
    payload: Dict[str, str],
    db: AsyncSession = Depends(get_db),
):
    """Return the feedback already submitted by the authenticated Pioneer."""
    identity = await _authenticate_pioneer(str(payload.get("pi_access_token") or ""))

    result = await db.execute(
        select(Pi_feedbacks).where(Pi_feedbacks.pi_uid == identity["pi_uid"])
    )
    row = result.scalars().first()
    if row is None:
        return {"submitted": False, "feedback": None}
    return {"submitted": True, "feedback": _serialize(row)}


@router.post("/submit", response_model=FeedbackSubmitResponse)
async def submit_feedback(
    data: FeedbackSubmitRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create or update the testimonial owned by the authenticated Pioneer."""
    identity = await _authenticate_pioneer(data.pi_access_token)
    pi_uid = identity["pi_uid"]

    comment = _clean_text(data.comment, MAX_COMMENT_LENGTH)
    language = _clean_language(data.language)
    device_info = _clean_text(data.device_info, MAX_DEVICE_LENGTH)
    context = await _payment_context(db, pi_uid)

    try:
        result = await db.execute(select(Pi_feedbacks).where(Pi_feedbacks.pi_uid == pi_uid))
        row = result.scalars().first()
        created = row is None

        if row is None:
            row = Pi_feedbacks(
                pi_uid=pi_uid,
                pi_username=identity["pi_username"] or None,
                rating=data.rating,
                comment=comment,
                language=language,
                network=context["network"],
                payment_id=context["payment_id"],
                verified_payment=context["verified_payment"],
                is_published=True,
                device_info=device_info or None,
            )
            db.add(row)
        else:
            row.rating = data.rating
            row.comment = comment
            row.language = language
            row.is_published = True
            if identity["pi_username"]:
                row.pi_username = identity["pi_username"]
            if device_info:
                row.device_info = device_info
            # The verified badge can only be granted, never revoked by a client.
            if context["verified_payment"]:
                row.verified_payment = True
                row.payment_id = context["payment_id"]
                row.network = context["network"]

        await db.commit()
        await db.refresh(row)
    except Exception as exc:  # pragma: no cover - defensive
        await db.rollback()
        logger.error("Error saving Pioneer feedback: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Your feedback could not be saved.")

    return {
        "status": "saved",
        "created": created,
        "feedback": _serialize(row),
        "message": (
            "Thank you! Your feedback is published on the Atlasphere testimonial wall."
            if created
            else "Your feedback has been updated."
        ),
    }