import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.models.quests import Quests

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class QuestsService:
    """Service layer for Quests operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Quests]:
        """Create a new quests"""
        try:
            obj = Quests(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created quests with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating quests: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Quests]:
        """Get quests by ID"""
        try:
            query = select(Quests).where(Quests.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching quests {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of questss"""
        try:
            query = select(Quests)
            count_query = select(func.count(Quests.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Quests, field):
                        query = query.where(getattr(Quests, field) == value)
                        count_query = count_query.where(getattr(Quests, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Quests, field_name):
                        query = query.order_by(getattr(Quests, field_name).desc())
                else:
                    if hasattr(Quests, sort):
                        query = query.order_by(getattr(Quests, sort))
            else:
                query = query.order_by(Quests.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching quests list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Quests]:
        """Update quests"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Quests {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated quests {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating quests {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete quests"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Quests {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted quests {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting quests {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Quests]:
        """Get quests by any field"""
        try:
            if not hasattr(Quests, field_name):
                raise ValueError(f"Field {field_name} does not exist on Quests")
            result = await self.db.execute(
                select(Quests).where(getattr(Quests, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching quests by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Quests]:
        """Get list of questss filtered by field"""
        try:
            if not hasattr(Quests, field_name):
                raise ValueError(f"Field {field_name} does not exist on Quests")
            result = await self.db.execute(
                select(Quests)
                .where(getattr(Quests, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Quests.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching questss by {field_name}: {str(e)}")
            raise
