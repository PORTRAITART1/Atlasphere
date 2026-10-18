"""Authentication dependency for Pi Browser protected actions."""

import logging

import httpx
from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.auth import AccessTokenError, decode_access_token
from app.backend.core.database import get_db
from app.backend.dependencies.auth import get_bearer_token
from app.backend.models.pi_profiles import Pi_profiles
from app.backend.schemas.auth import UserResponse

logger = logging.getLogger(__name__)
PI_API_ME_URL = "https://api.minepi.com/v2/me"


async def get_pi_browser_user(
    token: str = Depends(get_bearer_token),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Accept an Atlasphere JWT or verify a Pi access token on Mainnet."""
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if user_id:
            return UserResponse(
                id=str(user_id),
                email=payload.get("email", ""),
                name=payload.get("name"),
                role=payload.get("role", "user"),
            )
    except AccessTokenError:
        pass

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                PI_API_ME_URL,
                headers={"Authorization": f"Bearer {token}"},
            )
    except httpx.HTTPError as exc:
        logger.warning("Pi access-token verification unavailable: %s", type(exc).__name__)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Pi authentication service is temporarily unavailable",
        ) from exc

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Pi or Atlasphere authentication token",
        )

    pi_data = response.json()
    pi_uid = str(pi_data.get("uid", ""))
    username = str(pi_data.get("username", ""))
    if not pi_uid or not username:
        raise HTTPException(status_code=401, detail="Invalid Pi user data")

    result = await db.execute(select(Pi_profiles).where(Pi_profiles.pi_uid == pi_uid))
    profile = result.scalar_one_or_none()
    if profile is None:
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
            user_id=pi_uid,
        )
        db.add(profile)
    else:
        profile.username = username
        profile.display_name = username
        profile.last_active = "now"
    await db.commit()

    return UserResponse(id=str(profile.user_id), email="", name=username, role="user")
