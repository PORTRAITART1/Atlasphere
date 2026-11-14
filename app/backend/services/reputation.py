"""Shared, deterministic reputation calculation for Pi profiles."""

import math
from typing import Any, Dict

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.models.contributions import Contributions
from app.backend.models.pi_profiles import Pi_profiles
from app.backend.models.votes import Votes


def level_for_reputation(score: int) -> str:
    """Map the shared numeric reputation score to its established level."""
    if score > 100000:
        return "platinum"
    if score > 20000:
        return "diamond"
    if score > 5000:
        return "gold"
    if score > 1000:
        return "silver"
    return "bronze"


async def calculate_reputation(
    db: AsyncSession,
    pi_uid: str,
    profile: Pi_profiles,
    *,
    persist: bool = False,
) -> Dict[str, Any]:
    """Calculate reputation from the existing governance and contribution records.

    Set ``persist=True`` on authenticated profile refresh to keep the stored
    profile score synchronized. Public reads remain read-only by default.
    """
    votes_result = await db.execute(
        select(func.count()).select_from(Votes).where(Votes.pi_uid == pi_uid)
    )
    votes_cast = int(votes_result.scalar() or 0)

    contributions_result = await db.execute(
        select(func.count(func.distinct(Contributions.project_id))).where(
            Contributions.pi_uid == pi_uid,
            Contributions.status == "completed",
        )
    )
    projects_funded = int(contributions_result.scalar() or 0)

    pi_locked = float(profile.pi_locked or 0)
    streak_days = int(profile.streak_days or 0)
    reputation = int(
        (pi_locked * 0.4)
        + (votes_cast * 30 * 0.3)
        + (projects_funded * 50 * 0.2)
        + (streak_days * 10 * 0.1)
    )

    level = level_for_reputation(reputation)
    voting_power = round(math.log10(reputation + 10) * 10, 2)

    if persist and (
        profile.reputation != reputation
        or profile.level != level
        or profile.voting_power != voting_power
    ):
        profile.reputation = reputation
        profile.level = level
        profile.voting_power = voting_power
        await db.commit()

    return {
        "reputation": reputation,
        "level": level,
        "voting_power": voting_power,
        "votes_cast": votes_cast,
        "projects_funded": projects_funded,
        "pi_locked": pi_locked,
        "streak_days": streak_days,
    }
