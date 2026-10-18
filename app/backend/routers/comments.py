import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.database import get_db
from app.backend.models.pi_profiles import Pi_profiles
from app.backend.services.comments import CommentsService
from app.backend.dependencies.auth import get_current_user
from app.backend.schemas.auth import UserResponse

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/comments", tags=["comments"])


# ---------- Pydantic Schemas ----------
class CommentsCreateData(BaseModel):
    """Client-controlled fields accepted when creating a comment."""
    project_id: int
    content: str
    pi_username: str
    parent_id: Optional[int] = None


class CommentsUpdateData(BaseModel):
    """Owner-controlled comment fields (partial updates allowed)."""
    content: Optional[str] = None


class CommentsResponse(BaseModel):
    """Entity response schema"""
    id: int
    project_id: int
    content: str
    pi_uid: str
    pi_username: str
    parent_id: Optional[int] = None
    likes: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CommentsListResponse(BaseModel):
    """List response schema"""
    items: List[CommentsResponse]
    total: int
    skip: int
    limit: int


class CommentsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[CommentsCreateData]


class CommentsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: CommentsUpdateData


class CommentsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[CommentsBatchUpdateItem]


class CommentsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
async def get_pi_identity(db: AsyncSession, current_user: UserResponse) -> tuple[str, str]:
    """Resolve the authoritative Pi identity linked to the Atlasphere JWT."""
    result = await db.execute(
        select(Pi_profiles).where(Pi_profiles.user_id == str(current_user.id))
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=403, detail="A linked Pi profile is required")
    return profile.pi_uid, profile.username


@router.get("", response_model=CommentsListResponse)
async def query_commentss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query commentss with filtering, sorting, and pagination"""
    logger.debug(f"Querying commentss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = CommentsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")
        
        result = await service.get_list(
            skip=skip, 
            limit=limit,
            query_dict=query_dict,
            sort=sort,
        )
        logger.debug(f"Found {result['total']} commentss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying commentss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=CommentsListResponse)
async def query_commentss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query commentss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying commentss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = CommentsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")

        result = await service.get_list(
            skip=skip,
            limit=limit,
            query_dict=query_dict,
            sort=sort
        )
        logger.debug(f"Found {result['total']} commentss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying commentss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=CommentsResponse)
async def get_comments(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single comments by ID"""
    logger.debug(f"Fetching comments with id: {id}, fields={fields}")
    
    service = CommentsService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Comments with id {id} not found")
            raise HTTPException(status_code=404, detail="Comments not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching comments {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=CommentsResponse, status_code=201)
async def create_comments(
    data: CommentsCreateData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a comment owned by the authenticated user."""
    logger.debug("Creating a comment for project %s", data.project_id)

    service = CommentsService(db)
    try:
        payload = data.model_dump()
        pi_uid, pi_username = await get_pi_identity(db, current_user)
        payload["pi_uid"] = pi_uid
        payload["pi_username"] = pi_username
        payload["likes"] = 0
        result = await service.create(payload)
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create comments")
        
        logger.info(f"Comments created successfully with id: {result.id}")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error creating comments: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating comments: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[CommentsResponse], status_code=201)
async def create_commentss_batch(
    request: CommentsBatchCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create multiple comments owned by the authenticated user."""
    logger.debug(f"Batch creating {len(request.items)} commentss")

    service = CommentsService(db)
    results = []

    try:
        pi_uid, pi_username = await get_pi_identity(db, current_user)
        for item_data in request.items:
            payload = item_data.model_dump()
            payload["pi_uid"] = pi_uid
            payload["pi_username"] = pi_username
            payload["likes"] = 0
            result = await service.create(payload)
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} commentss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[CommentsResponse])
async def update_commentss_batch(
    request: CommentsBatchUpdateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update multiple comments owned by the authenticated user."""
    logger.debug(f"Batch updating {len(request.items)} commentss")

    service = CommentsService(db)
    results = []

    try:
        owner_pi_uid, _ = await get_pi_identity(db, current_user)
        for item in request.items:
            comment = await service.get_by_id(item.id)
            if not comment:
                raise HTTPException(status_code=404, detail="Comment not found")
            if comment.pi_uid != owner_pi_uid:
                raise HTTPException(status_code=403, detail="You can only update your own comments")
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} commentss successfully")
        return results
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.post("/{id}/like", response_model=CommentsResponse)
async def like_comment(
    id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Atomically increment a comment's public like counter."""
    service = CommentsService(db)
    result = await service.increment_likes(id)
    if not result:
        raise HTTPException(status_code=404, detail="Comment not found")
    return result


@router.put("/{id}", response_model=CommentsResponse)
async def update_comments(
    id: int,
    data: CommentsUpdateData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a comment owned by the authenticated user."""
    logger.debug(f"Updating comments {id} with data: {data}")

    service = CommentsService(db)
    try:
        comment = await service.get_by_id(id)
        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")
        owner_pi_uid, _ = await get_pi_identity(db, current_user)
        if comment.pi_uid != owner_pi_uid:
            raise HTTPException(status_code=403, detail="You can only update your own comments")
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Comments with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Comments not found")
        
        logger.info(f"Comments {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating comments {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating comments {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_commentss_batch(
    request: CommentsBatchDeleteRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple comments owned by the authenticated user."""
    logger.debug(f"Batch deleting {len(request.ids)} commentss")

    service = CommentsService(db)
    deleted_count = 0

    try:
        owner_pi_uid, _ = await get_pi_identity(db, current_user)
        for item_id in request.ids:
            comment = await service.get_by_id(item_id)
            if not comment:
                raise HTTPException(status_code=404, detail="Comment not found")
            if comment.pi_uid != owner_pi_uid:
                raise HTTPException(status_code=403, detail="You can only delete your own comments")
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} commentss successfully")
        return {"message": f"Successfully deleted {deleted_count} commentss", "deleted_count": deleted_count}
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_comments(
    id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a comment owned by the authenticated user."""
    logger.debug("Deleting comment %s", id)

    service = CommentsService(db)
    try:
        comment = await service.get_by_id(id)
        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")
        owner_pi_uid, _ = await get_pi_identity(db, current_user)
        if comment.pi_uid != owner_pi_uid:
            raise HTTPException(status_code=403, detail="You can only delete your own comments")
        success = await service.delete(id)
        if not success:
            logger.warning(f"Comments with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Comments not found")
        
        logger.info(f"Comments {id} deleted successfully")
        return {"message": "Comments deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting comments {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
