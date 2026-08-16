from app.backend.core.database import Base
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String


class Quests(Base):
    __tablename__ = "quests"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    quest_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    quest_type = Column(String, nullable=False)
    requirement_type = Column(String, nullable=False)
    requirement_target = Column(Integer, nullable=False)
    reward_reputation = Column(Integer, nullable=True, default=0, server_default='0')
    reward_pi_amount = Column(Float, nullable=True, default=0, server_default='0')
    reward_badge = Column(String, nullable=True)
    active = Column(Boolean, nullable=True, default=True, server_default='true')
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)
