import json
import logging
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.database import get_db
from app.backend.dependencies.auth import get_current_user
from app.backend.schemas.auth import UserResponse
from app.backend.models.quests import Quests
from app.backend.models.quest_progress import Quest_progress
from app.backend.models.pi_profiles import Pi_profiles
from app.backend.models.votes import Votes
from app.backend.models.contributions import Contributions

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/quests", tags=["quests"])


class QuestItem(BaseModel):
    id: int
    quest_id: str
    title: str
    description: Optional[str] = None
    quest_type: str
    requirement_type: str
    requirement_target: int
    reward_reputation: int = 0
    reward_pi_amount: float = 0
    reward_badge: Optional[str] = None
    progress: int = 0
    completed: bool = False
    claimed: bool = False


class QuestListResponse(BaseModel):
    quests: List[QuestItem]
    total: int


class CheckProgressRequest(BaseModel):
    pi_uid: str
    action_type: str  # "vote", "fund", "login", "proposal"


class CheckProgressResponse(BaseModel):
    updated_quests: List[str]
    newly_completed: List[str]
    message: str


class ClaimRequest(BaseModel):
    quest_id: str
    pi_uid: str


class ClaimResponse(BaseModel):
    status: str
    reputation_gained: int
    pi_amount: float
    badge_earned: Optional[str] = None
    message: str


@router.get("/available", response_model=QuestListResponse)
async def get_available_quests(
    pi_uid: str = "",
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all active quests with user's progress"""
    try:
        # Get all active quests
        quests_stmt = select(Quests).where(Quests.active == True)
        quests_result = await db.execute(quests_stmt)
        quests = quests_result.scalars().all()

        quest_items = []
        for quest in quests:
            # Get user progress if pi_uid provided
            progress = 0
            completed = False
            claimed = False

            if pi_uid:
                progress_stmt = select(Quest_progress).where(
                    Quest_progress.quest_id == quest.quest_id,
                    Quest_progress.pi_uid == pi_uid
                )
                progress_result = await db.execute(progress_stmt)
                user_progress = progress_result.scalar_one_or_none()

                if user_progress:
                    progress = user_progress.progress or 0
                    completed = user_progress.completed or False
                    claimed = user_progress.claimed or False

            quest_items.append(QuestItem(
                id=quest.id,
                quest_id=quest.quest_id,
                title=quest.title,
                description=quest.description,
                quest_type=quest.quest_type,
                requirement_type=quest.requirement_type,
                requirement_target=quest.requirement_target,
                reward_reputation=quest.reward_reputation or 0,
                reward_pi_amount=quest.reward_pi_amount or 0,
                reward_badge=quest.reward_badge if quest.reward_badge else None,
                progress=progress,
                completed=completed,
                claimed=claimed
            ))

        return QuestListResponse(quests=quest_items, total=len(quest_items))

    except Exception as e:
        logger.error(f"Error fetching quests: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch quests: {str(e)}")


@router.post("/check-progress", response_model=CheckProgressResponse)
async def check_quest_progress(
    data: CheckProgressRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Check and update quest progress after a user action"""
    try:
        updated_quests = []
        newly_completed = []

        # Get relevant quests based on action type
        action_to_requirement = {
            "vote": "vote_count",
            "fund": "fund_amount",
            "login": "streak_days",
            "proposal": "vote_count",
        }

        requirement_type = action_to_requirement.get(data.action_type, "")

        # Get all active quests matching this requirement type
        quests_stmt = select(Quests).where(
            Quests.active == True,
            Quests.requirement_type == requirement_type
        )
        quests_result = await db.execute(quests_stmt)
        quests = quests_result.scalars().all()

        # Calculate current user stats
        current_value = 0
        if requirement_type == "vote_count":
            vote_stmt = select(func.count()).select_from(Votes).where(Votes.pi_uid == data.pi_uid)
            vote_result = await db.execute(vote_stmt)
            current_value = vote_result.scalar() or 0
        elif requirement_type == "fund_amount":
            fund_stmt = select(func.coalesce(func.sum(Contributions.amount), 0)).where(
                Contributions.pi_uid == data.pi_uid,
                Contributions.status == "completed"
            )
            fund_result = await db.execute(fund_stmt)
            current_value = int(fund_result.scalar() or 0)
        elif requirement_type == "streak_days":
            profile_stmt = select(Pi_profiles).where(Pi_profiles.pi_uid == data.pi_uid)
            profile_result = await db.execute(profile_stmt)
            profile = profile_result.scalar_one_or_none()
            current_value = profile.streak_days if profile else 0

        # Update progress for each quest
        for quest in quests:
            # Get or create progress record
            progress_stmt = select(Quest_progress).where(
                Quest_progress.quest_id == quest.quest_id,
                Quest_progress.pi_uid == data.pi_uid
            )
            progress_result = await db.execute(progress_stmt)
            user_progress = progress_result.scalar_one_or_none()

            if not user_progress:
                user_progress = Quest_progress(
                    quest_id=quest.quest_id,
                    pi_uid=data.pi_uid,
                    progress=0,
                    completed=False,
                    claimed=False,
                    user_id=str(current_user.id)
                )
                db.add(user_progress)

            # Update progress
            if not user_progress.completed:
                user_progress.progress = min(current_value, quest.requirement_target)
                updated_quests.append(quest.quest_id)

                # Check if quest is now completed
                if current_value >= quest.requirement_target:
                    user_progress.completed = True
                    newly_completed.append(quest.quest_id)

        await db.commit()

        message = f"Updated {len(updated_quests)} quests."
        if newly_completed:
            message += f" Completed: {', '.join(newly_completed)}!"

        return CheckProgressResponse(
            updated_quests=updated_quests,
            newly_completed=newly_completed,
            message=message
        )

    except Exception as e:
        logger.error(f"Quest progress check error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to check progress: {str(e)}")


@router.post("/claim", response_model=ClaimResponse)
async def claim_quest_reward(
    data: ClaimRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Claim a completed quest reward"""
    try:
        # Get quest
        quest_stmt = select(Quests).where(Quests.quest_id == data.quest_id)
        quest_result = await db.execute(quest_stmt)
        quest = quest_result.scalar_one_or_none()

        if not quest:
            raise HTTPException(status_code=404, detail="Quest not found")

        # Get progress
        progress_stmt = select(Quest_progress).where(
            Quest_progress.quest_id == data.quest_id,
            Quest_progress.pi_uid == data.pi_uid
        )
        progress_result = await db.execute(progress_stmt)
        user_progress = progress_result.scalar_one_or_none()

        if not user_progress:
            raise HTTPException(status_code=400, detail="No progress found for this quest")

        if not user_progress.completed:
            raise HTTPException(status_code=400, detail="Quest not yet completed")

        if user_progress.claimed:
            raise HTTPException(status_code=400, detail="Reward already claimed")

        # Mark as claimed
        user_progress.claimed = True

        # Award reputation
        reputation_gained = quest.reward_reputation or 0
        pi_amount = quest.reward_pi_amount or 0
        badge_earned = quest.reward_badge if quest.reward_badge else None

        # Update user profile
        profile_stmt = select(Pi_profiles).where(Pi_profiles.pi_uid == data.pi_uid)
        profile_result = await db.execute(profile_stmt)
        profile = profile_result.scalar_one_or_none()

        if profile and reputation_gained > 0:
            profile.reputation = (profile.reputation or 0) + reputation_gained

            # Add badge if earned
            if badge_earned:
                badges = []
                try:
                    badges = json.loads(profile.badges) if profile.badges else []
                except (json.JSONDecodeError, TypeError):
                    badges = []

                if badge_earned not in badges:
                    badges.append(badge_earned)
                    profile.badges = json.dumps(badges)

        await db.commit()

        return ClaimResponse(
            status="claimed",
            reputation_gained=reputation_gained,
            pi_amount=pi_amount,
            badge_earned=badge_earned,
            message=f"Reward claimed! +{reputation_gained} reputation"
            + (f" + {pi_amount} π" if pi_amount > 0 else "")
            + (f" + badge '{badge_earned}'" if badge_earned else "")
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Quest claim error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to claim reward: {str(e)}")
