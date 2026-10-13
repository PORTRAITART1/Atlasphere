import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.database import get_db
from app.backend.services.quest_progress import Quest_progressService
from app.backend.dependencies.auth import get_current_user
from app.backend.schemas.auth import UserResponse

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/quest_progress", tags=["quest_progress"])


# ---------- Pydantic Schemas ----------
class Quest_progressData(BaseModel):
    """Entity data schema (for create/update)"""
    quest_id: str
    pi_uid: str
    progress: int = None
    completed: bool = None
    claimed: bool = None


class Quest_progressUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    quest_id: Optional[str] = None
    pi_uid: Optional[str] = None
    progress: Optional[int] = None
    completed: Optional[bool] = None
    claimed: Optional[bool] = None


class Quest_progressResponse(BaseModel):
    """Entity response schema"""
    id: int
    quest_id: str
    pi_uid: str
    progress: Optional[int] = None
    completed: Optional[bool] = None
    claimed: Optional[bool] = None
    user_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Quest_progressListResponse(BaseModel):
    """List response schema"""
    items: List[Quest_progressResponse]
    total: int
    skip: int
    limit: int


class Quest_progressBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Quest_progressData]


class Quest_progressBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Quest_progressUpdateData


class Quest_progressBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Quest_progressBatchUpdateItem]


class Quest_progressBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Quest_progressListResponse)
async def query_quest_progresss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Query quest_progresss with filtering, sorting, and pagination (user can only see their own records)"""
    logger.debug(f"Querying quest_progresss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Quest_progressService(db)
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
            user_id=str(current_user.id),
        )
        logger.debug(f"Found {result['total']} quest_progresss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying quest_progresss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Quest_progressListResponse)
async def query_quest_progresss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query quest_progresss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying quest_progresss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Quest_progressService(db)
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
        logger.debug(f"Found {result['total']} quest_progresss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying quest_progresss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Quest_progressResponse)
async def get_quest_progress(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single quest_progress by ID (user can only see their own records)"""
    logger.debug(f"Fetching quest_progress with id: {id}, fields={fields}")
    
    service = Quest_progressService(db)
    try:
        result = await service.get_by_id(id, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Quest_progress with id {id} not found")
            raise HTTPException(status_code=404, detail="Quest_progress not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching quest_progress {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Quest_progressResponse, status_code=201)
async def create_quest_progress(
    data: Quest_progressData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new quest_progress"""
    logger.debug(f"Creating new quest_progress with data: {data}")
    
    service = Quest_progressService(db)
    try:
        result = await service.create(data.model_dump(), user_id=str(current_user.id))
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create quest_progress")
        
        logger.info(f"Quest_progress created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating quest_progress: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating quest_progress: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Quest_progressResponse], status_code=201)
async def create_quest_progresss_batch(
    request: Quest_progressBatchCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create multiple quest_progresss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} quest_progresss")
    
    service = Quest_progressService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump(), user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} quest_progresss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Quest_progressResponse])
async def update_quest_progresss_batch(
    request: Quest_progressBatchUpdateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update multiple quest_progresss in a single request (requires ownership)"""
    logger.debug(f"Batch updating {len(request.items)} quest_progresss")
    
    service = Quest_progressService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict, user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} quest_progresss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Quest_progressResponse)
async def update_quest_progress(
    id: int,
    data: Quest_progressUpdateData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing quest_progress (requires ownership)"""
    logger.debug(f"Updating quest_progress {id} with data: {data}")

    service = Quest_progressService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Quest_progress with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Quest_progress not found")
        
        logger.info(f"Quest_progress {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating quest_progress {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating quest_progress {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_quest_progresss_batch(
    request: Quest_progressBatchDeleteRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple quest_progresss by their IDs (requires ownership)"""
    logger.debug(f"Batch deleting {len(request.ids)} quest_progresss")
    
    service = Quest_progressService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id, user_id=str(current_user.id))
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} quest_progresss successfully")
        return {"message": f"Successfully deleted {deleted_count} quest_progresss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_quest_progress(
    id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a single quest_progress by ID (requires ownership)"""
    logger.debug(f"Deleting quest_progress with id: {id}")
    
    service = Quest_progressService(db)
    try:
        success = await service.delete(id, user_id=str(current_user.id))
        if not success:
            logger.warning(f"Quest_progress with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Quest_progress not found")
        
        logger.info(f"Quest_progress {id} deleted successfully")
        return {"message": "Quest_progress deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting quest_progress {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
