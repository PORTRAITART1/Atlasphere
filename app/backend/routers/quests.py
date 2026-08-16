import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.database import get_db
from services.quests import QuestsService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/quests", tags=["quests"])


# ---------- Pydantic Schemas ----------
class QuestsData(BaseModel):
    """Entity data schema (for create/update)"""
    quest_id: str
    title: str
    description: str = None
    quest_type: str
    requirement_type: str
    requirement_target: int
    reward_reputation: int = None
    reward_pi_amount: float = None
    reward_badge: str = None
    active: bool = None


class QuestsUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    quest_id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    quest_type: Optional[str] = None
    requirement_type: Optional[str] = None
    requirement_target: Optional[int] = None
    reward_reputation: Optional[int] = None
    reward_pi_amount: Optional[float] = None
    reward_badge: Optional[str] = None
    active: Optional[bool] = None


class QuestsResponse(BaseModel):
    """Entity response schema"""
    id: int
    quest_id: str
    title: str
    description: Optional[str] = None
    quest_type: str
    requirement_type: str
    requirement_target: int
    reward_reputation: Optional[int] = None
    reward_pi_amount: Optional[float] = None
    reward_badge: Optional[str] = None
    active: Optional[bool] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QuestsListResponse(BaseModel):
    """List response schema"""
    items: List[QuestsResponse]
    total: int
    skip: int
    limit: int


class QuestsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[QuestsData]


class QuestsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: QuestsUpdateData


class QuestsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[QuestsBatchUpdateItem]


class QuestsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=QuestsListResponse)
async def query_questss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query questss with filtering, sorting, and pagination"""
    logger.debug(f"Querying questss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = QuestsService(db)
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
        logger.debug(f"Found {result['total']} questss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying questss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=QuestsListResponse)
async def query_questss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query questss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying questss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = QuestsService(db)
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
        logger.debug(f"Found {result['total']} questss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying questss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=QuestsResponse)
async def get_quests(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single quests by ID"""
    logger.debug(f"Fetching quests with id: {id}, fields={fields}")
    
    service = QuestsService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Quests with id {id} not found")
            raise HTTPException(status_code=404, detail="Quests not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching quests {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=QuestsResponse, status_code=201)
async def create_quests(
    data: QuestsData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new quests"""
    logger.debug(f"Creating new quests with data: {data}")
    
    service = QuestsService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create quests")
        
        logger.info(f"Quests created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating quests: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating quests: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[QuestsResponse], status_code=201)
async def create_questss_batch(
    request: QuestsBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple questss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} questss")
    
    service = QuestsService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} questss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[QuestsResponse])
async def update_questss_batch(
    request: QuestsBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple questss in a single request"""
    logger.debug(f"Batch updating {len(request.items)} questss")
    
    service = QuestsService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} questss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=QuestsResponse)
async def update_quests(
    id: int,
    data: QuestsUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing quests"""
    logger.debug(f"Updating quests {id} with data: {data}")

    service = QuestsService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Quests with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Quests not found")
        
        logger.info(f"Quests {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating quests {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating quests {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_questss_batch(
    request: QuestsBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple questss by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} questss")
    
    service = QuestsService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} questss successfully")
        return {"message": f"Successfully deleted {deleted_count} questss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_quests(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single quests by ID"""
    logger.debug(f"Deleting quests with id: {id}")
    
    service = QuestsService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"Quests with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Quests not found")
        
        logger.info(f"Quests {id} deleted successfully")
        return {"message": "Quests deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting quests {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
