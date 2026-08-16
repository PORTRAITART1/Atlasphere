import json
import logging
import math
import os
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.database import get_db
from dependencies.auth import get_current_user
from schemas.auth import UserResponse
from app.backend.models.pi_profiles import Pi_profiles
from app.backend.models.votes import Votes
from app.backend.models.contributions import Contributions

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/pi-auth", tags=["pi-auth"])

PI_API_BASE = "https://api.minepi.com"


class PiAuthRequest(BaseModel):
    access_token: str


class PiProfileResponse(BaseModel):
    pi_uid: str
    username: str
    display_name: Optional[str] = None
    reputation: int = 0
    voting_power: float = 1.0
    pi_locked: float = 0
    streak_days: int = 0
    kyc_verified: bool = False
    language: str = "fr"
    badges: list = []
    level: str = "bronze"


@router.post("/verify", response_model=PiProfileResponse)
async def verify_pi_auth(
    data: PiAuthRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Verify Pi Network access token and create/update user profile"""
    pi_api_key = os.environ.get("PI_API_KEY", "")

    try:
        # Call Pi API to verify the token
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(
                f"{PI_API_BASE}/v2/me",
                headers={"Authorization": f"Bearer {data.access_token}"}
            )

        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Pi access token")

        pi_data = response.json()
        pi_uid = pi_data.get("uid", "")
        username = pi_data.get("username", "")

        if not pi_uid or not username:
            raise HTTPException(status_code=401, detail="Invalid Pi user data")

        # Check if profile exists for this user
        stmt = select(Pi_profiles).where(
            Pi_profiles.user_id == str(current_user.id),
            Pi_profiles.pi_uid == pi_uid
        )
        result = await db.execute(stmt)
        profile = result.scalar_one_or_none()

        if profile:
            # Update existing profile
            profile.username = username
            profile.last_active = "now"
            await db.commit()
            await db.refresh(profile)
        else:
            # Create new profile
            profile = Pi_profiles(
                pi_uid=pi_uid,
                username=username,
                display_name=username,
                reputation=0,
                voting_power=1.0,
                pi_locked=0,
                streak_days=0,
                kyc_verified=False,
                language="fr",
                badges="[]",
                level="bronze",
                last_active="now",
                user_id=str(current_user.id)
            )
            db.add(profile)
            await db.commit()
            await db.refresh(profile)

        # Calculate reputation
        reputation = await _calculate_reputation(db, pi_uid, profile)
        voting_power = math.log10(reputation + 10) * 10

        # Parse badges
        badges = []
        try:
            badges = json.loads(profile.badges) if profile.badges else []
        except (json.JSONDecodeError, TypeError):
            badges = []

        return PiProfileResponse(
            pi_uid=profile.pi_uid,
            username=profile.username,
            display_name=profile.display_name or profile.username,
            reputation=reputation,
            voting_power=round(voting_power, 2),
            pi_locked=profile.pi_locked or 0,
            streak_days=profile.streak_days or 0,
            kyc_verified=profile.kyc_verified or False,
            language=profile.language or "fr",
            badges=badges,
            level=profile.level or "bronze"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Pi auth verification error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")


@router.get("/profile")
async def get_pi_profile(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current user's Pi profile"""
    stmt = select(Pi_profiles).where(Pi_profiles.user_id == str(current_user.id))
    result = await db.execute(stmt)
    profile = result.scalar_one_or_none()

    if not profile:
        raise HTTPException(status_code=404, detail="Pi profile not found. Please authenticate with Pi Network first.")

    badges = []
    try:
        badges = json.loads(profile.badges) if profile.badges else []
    except (json.JSONDecodeError, TypeError):
        badges = []

    reputation = await _calculate_reputation(db, profile.pi_uid, profile)
    voting_power = math.log10(reputation + 10) * 10

    return {
        "pi_uid": profile.pi_uid,
        "username": profile.username,
        "display_name": profile.display_name or profile.username,
        "reputation": reputation,
        "voting_power": round(voting_power, 2),
        "pi_locked": profile.pi_locked or 0,
        "streak_days": profile.streak_days or 0,
        "kyc_verified": profile.kyc_verified or False,
        "language": profile.language or "fr",
        "badges": badges,
        "level": profile.level or "bronze"
    }


async def _calculate_reputation(db: AsyncSession, pi_uid: str, profile: Pi_profiles) -> int:
    """Calculate reputation based on formula: (pi_locked * 0.4) + (votes_cast * 0.3) + (projects_funded * 0.2) + (streak_days * 0.1)"""
    # Count votes cast
    votes_stmt = select(func.count()).select_from(Votes).where(Votes.pi_uid == pi_uid)
    votes_result = await db.execute(votes_stmt)
    votes_cast = votes_result.scalar() or 0

    # Count projects funded
    contrib_stmt = select(func.count(func.distinct(Contributions.project_id))).where(
        Contributions.pi_uid == pi_uid,
        Contributions.status == "completed"
    )
    contrib_result = await db.execute(contrib_stmt)
    projects_funded = contrib_result.scalar() or 0

    pi_locked = profile.pi_locked or 0
    streak_days = profile.streak_days or 0

    reputation = int(
        (pi_locked * 0.4) +
        (votes_cast * 30 * 0.3) +
        (projects_funded * 50 * 0.2) +
        (streak_days * 10 * 0.1)
    )

    # Update level based on reputation
    level = "bronze"
    if reputation > 1000:
        level = "silver"
    if reputation > 5000:
        level = "gold"
    if reputation > 20000:
        level = "diamond"
    if reputation > 100000:
        level = "platinum"

    # Update profile if level changed
    if profile.level != level or profile.reputation != reputation:
        profile.reputation = reputation
        profile.level = level
        profile.voting_power = round(math.log10(reputation + 10) * 10, 2)
        await db.commit()

    return reputation
