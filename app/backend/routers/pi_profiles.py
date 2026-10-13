import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.database import get_db
from app.backend.services.pi_profiles import Pi_profilesService
from app.backend.dependencies.auth import get_current_user
from app.backend.schemas.auth import UserResponse

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/pi_profiles", tags=["pi_profiles"])


# ---------- Pydantic Schemas ----------
class Pi_profilesData(BaseModel):
    """Entity data schema (for create/update)"""
    pi_uid: str
    username: str
    display_name: str = None
    reputation: int = None
    voting_power: float = None
    pi_locked: float = None
    streak_days: int = None
    kyc_verified: bool = None
    language: str = None
    badges: str = None
    level: str = None
    last_active: str = None


class Pi_profilesUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    pi_uid: Optional[str] = None
    username: Optional[str] = None
    display_name: Optional[str] = None
    reputation: Optional[int] = None
    voting_power: Optional[float] = None
    pi_locked: Optional[float] = None
    streak_days: Optional[int] = None
    kyc_verified: Optional[bool] = None
    language: Optional[str] = None
    badges: Optional[str] = None
    level: Optional[str] = None
    last_active: Optional[str] = None


class Pi_profilesResponse(BaseModel):
    """Entity response schema"""
    id: int
    pi_uid: str
    username: str
    display_name: Optional[str] = None
    reputation: Optional[int] = None
    voting_power: Optional[float] = None
    pi_locked: Optional[float] = None
    streak_days: Optional[int] = None
    kyc_verified: Optional[bool] = None
    language: Optional[str] = None
    badges: Optional[str] = None
    level: Optional[str] = None
    last_active: Optional[str] = None
    user_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Pi_profilesListResponse(BaseModel):
    """List response schema"""
    items: List[Pi_profilesResponse]
    total: int
    skip: int
    limit: int


class Pi_profilesBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Pi_profilesData]


class Pi_profilesBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Pi_profilesUpdateData


class Pi_profilesBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Pi_profilesBatchUpdateItem]


class Pi_profilesBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Pi_profilesListResponse)
async def query_pi_profiless(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Query pi_profiless with filtering, sorting, and pagination (user can only see their own records)"""
    logger.debug(f"Querying pi_profiless: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Pi_profilesService(db)
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
        logger.debug(f"Found {result['total']} pi_profiless")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying pi_profiless: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Pi_profilesListResponse)
async def query_pi_profiless_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query pi_profiless with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying pi_profiless: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Pi_profilesService(db)
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
        logger.debug(f"Found {result['total']} pi_profiless")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying pi_profiless: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Pi_profilesResponse)
async def get_pi_profiles(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single pi_profiles by ID (user can only see their own records)"""
    logger.debug(f"Fetching pi_profiles with id: {id}, fields={fields}")
    
    service = Pi_profilesService(db)
    try:
        result = await service.get_by_id(id, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Pi_profiles with id {id} not found")
            raise HTTPException(status_code=404, detail="Pi_profiles not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching pi_profiles {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Pi_profilesResponse, status_code=201)
async def create_pi_profiles(
    data: Pi_profilesData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new pi_profiles"""
    logger.debug(f"Creating new pi_profiles with data: {data}")
    
    service = Pi_profilesService(db)
    try:
        result = await service.create(data.model_dump(), user_id=str(current_user.id))
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create pi_profiles")
        
        logger.info(f"Pi_profiles created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating pi_profiles: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating pi_profiles: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Pi_profilesResponse], status_code=201)
async def create_pi_profiless_batch(
    request: Pi_profilesBatchCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create multiple pi_profiless in a single request"""
    logger.debug(f"Batch creating {len(request.items)} pi_profiless")
    
    service = Pi_profilesService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump(), user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} pi_profiless successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Pi_profilesResponse])
async def update_pi_profiless_batch(
    request: Pi_profilesBatchUpdateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update multiple pi_profiless in a single request (requires ownership)"""
    logger.debug(f"Batch updating {len(request.items)} pi_profiless")
    
    service = Pi_profilesService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict, user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} pi_profiless successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Pi_profilesResponse)
async def update_pi_profiles(
    id: int,
    data: Pi_profilesUpdateData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing pi_profiles (requires ownership)"""
    logger.debug(f"Updating pi_profiles {id} with data: {data}")

    service = Pi_profilesService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Pi_profiles with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Pi_profiles not found")
        
        logger.info(f"Pi_profiles {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating pi_profiles {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating pi_profiles {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_pi_profiless_batch(
    request: Pi_profilesBatchDeleteRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple pi_profiless by their IDs (requires ownership)"""
    logger.debug(f"Batch deleting {len(request.ids)} pi_profiless")
    
    service = Pi_profilesService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id, user_id=str(current_user.id))
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} pi_profiless successfully")
        return {"message": f"Successfully deleted {deleted_count} pi_profiless", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_pi_profiles(
    id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a single pi_profiles by ID (requires ownership)"""
    logger.debug(f"Deleting pi_profiles with id: {id}")
    
    service = Pi_profilesService(db)
    try:
        success = await service.delete(id, user_id=str(current_user.id))
        if not success:
            logger.warning(f"Pi_profiles with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Pi_profiles not found")
        
        logger.info(f"Pi_profiles {id} deleted successfully")
        return {"message": "Pi_profiles deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting pi_profiles {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
