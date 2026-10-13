import json
import logging
import math
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.database import get_db
from app.backend.dependencies.auth import get_current_user
from app.backend.schemas.auth import UserResponse
from app.backend.models.projects import Projects
from app.backend.models.votes import Votes
from app.backend.models.pi_profiles import Pi_profiles
from app.backend.models.contributions import Contributions
from app.backend.models.notifications import Notifications

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/governance", tags=["governance"])


class VoteRequest(BaseModel):
    project_id: int
    vote_type: str  # "for", "against", "abstain"
    pi_uid: str


class FinalizeRequest(BaseModel):
    project_id: int


class VoteResponse(BaseModel):
    status: str
    vote_type: str
    weight: float
    project_votes_for: int
    project_votes_against: int
    message: str


class ReputationResponse(BaseModel):
    pi_uid: str
    reputation: int
    level: str
    voting_power: float
    votes_cast: int
    projects_funded: int
    pi_locked: float
    streak_days: int


class FinalizeResponse(BaseModel):
    status: str
    project_status: str
    votes_for: int
    votes_against: int
    voter_count: int
    quorum_met: bool
    threshold_met: bool
    message: str


@router.post("/vote", response_model=VoteResponse)
async def submit_vote(
    data: VoteRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Submit a vote on a project with reputation-weighted power"""
    if data.vote_type not in ("for", "against", "abstain"):
        raise HTTPException(status_code=400, detail="vote_type must be 'for', 'against', or 'abstain'")

    try:
        # Check if user already voted on this project
        existing_vote_stmt = select(Votes).where(
            Votes.project_id == data.project_id,
            Votes.pi_uid == data.pi_uid
        )
        existing_result = await db.execute(existing_vote_stmt)
        existing_vote = existing_result.scalar_one_or_none()

        if existing_vote:
            raise HTTPException(status_code=400, detail="You have already voted on this project")

        # Get project
        project_stmt = select(Projects).where(Projects.id == data.project_id)
        project_result = await db.execute(project_stmt)
        project = project_result.scalar_one_or_none()

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        if project.status not in ("proposed", "voting"):
            raise HTTPException(status_code=400, detail=f"Project is not in voting phase (current: {project.status})")

        # Get user's reputation to calculate vote weight
        profile_stmt = select(Pi_profiles).where(Pi_profiles.pi_uid == data.pi_uid)
        profile_result = await db.execute(profile_stmt)
        profile = profile_result.scalar_one_or_none()

        reputation = 0
        if profile:
            reputation = profile.reputation or 0

        # Calculate weight using logarithmic formula
        weight = round(math.log10(reputation + 10) * 10, 2)

        # Create vote record
        vote = Votes(
            project_id=data.project_id,
            vote_type=data.vote_type,
            weight=weight,
            pi_uid=data.pi_uid,
            user_id=str(current_user.id)
        )
        db.add(vote)

        # Update project vote counts
        if data.vote_type == "for":
            project.votes_for = (project.votes_for or 0) + int(weight)
        elif data.vote_type == "against":
            project.votes_against = (project.votes_against or 0) + int(weight)

        project.voter_count = (project.voter_count or 0) + 1

        # Update project status to voting if it was proposed
        if project.status == "proposed":
            project.status = "voting"

        await db.commit()

        return VoteResponse(
            status="success",
            vote_type=data.vote_type,
            weight=weight,
            project_votes_for=project.votes_for or 0,
            project_votes_against=project.votes_against or 0,
            message=f"Vote '{data.vote_type}' recorded with weight {weight}"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Vote submission error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Vote submission failed: {str(e)}")


@router.post("/finalize", response_model=FinalizeResponse)
async def finalize_proposal(
    data: FinalizeRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Finalize a proposal - check quorum and threshold"""
    try:
        # Get project
        project_stmt = select(Projects).where(Projects.id == data.project_id)
        project_result = await db.execute(project_stmt)
        project = project_result.scalar_one_or_none()

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        if project.status != "voting":
            raise HTTPException(status_code=400, detail=f"Project is not in voting phase (current: {project.status})")

        # Get total active pioneers (users with profiles)
        active_stmt = select(func.count()).select_from(Pi_profiles)
        active_result = await db.execute(active_stmt)
        active_pioneers = active_result.scalar() or 1

        voter_count = project.voter_count or 0
        votes_for = project.votes_for or 0
        votes_against = project.votes_against or 0
        total_weight = votes_for + votes_against

        # Check quorum (default 5%)
        quorum = project.quorum or 0.05
        quorum_met = (voter_count / max(active_pioneers, 1)) >= quorum

        # Check threshold (default 66%)
        threshold = project.threshold or 0.66
        threshold_met = (votes_for / max(total_weight, 1)) >= threshold if total_weight > 0 else False

        # Determine outcome
        if not quorum_met:
            project.status = "failed"
            message = "Proposal failed: quorum not met"
        elif threshold_met:
            project.status = "funded"
            message = "Proposal approved! Moving to funding phase."
            # Create notification for project creator
            notification = Notifications(
                pi_uid="system",
                notification_type="project_funded",
                title="Projet Approuvé !",
                body=f"Le projet '{project.title}' a été approuvé par la communauté.",
                data=json.dumps({"project_id": project.id}),
                read=False,
                user_id=project.user_id
            )
            db.add(notification)
        else:
            project.status = "failed"
            message = "Proposal rejected: threshold not met"

        await db.commit()

        return FinalizeResponse(
            status="finalized",
            project_status=project.status,
            votes_for=votes_for,
            votes_against=votes_against,
            voter_count=voter_count,
            quorum_met=quorum_met,
            threshold_met=threshold_met,
            message=message
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Finalization error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Finalization failed: {str(e)}")


@router.get("/reputation/{pi_uid}", response_model=ReputationResponse)
async def get_reputation(
    pi_uid: str,
    db: AsyncSession = Depends(get_db),
):
    """Get user reputation and voting power"""
    try:
        # Get profile
        profile_stmt = select(Pi_profiles).where(Pi_profiles.pi_uid == pi_uid)
        profile_result = await db.execute(profile_stmt)
        profile = profile_result.scalar_one_or_none()

        if not profile:
            raise HTTPException(status_code=404, detail="Pi profile not found")

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

        # Calculate reputation
        reputation = int(
            (pi_locked * 0.4) +
            (votes_cast * 30 * 0.3) +
            (projects_funded * 50 * 0.2) +
            (streak_days * 10 * 0.1)
        )

        # Determine level
        level = "bronze"
        if reputation > 1000:
            level = "silver"
        if reputation > 5000:
            level = "gold"
        if reputation > 20000:
            level = "diamond"
        if reputation > 100000:
            level = "platinum"

        voting_power = round(math.log10(reputation + 10) * 10, 2)

        return ReputationResponse(
            pi_uid=pi_uid,
            reputation=reputation,
            level=level,
            voting_power=voting_power,
            votes_cast=votes_cast,
            projects_funded=projects_funded,
            pi_locked=pi_locked,
            streak_days=streak_days
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Reputation calculation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get reputation: {str(e)}")
