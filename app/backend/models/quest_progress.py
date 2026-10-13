from app.backend.core.database import Base
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String


class Quest_progress(Base):
    __tablename__ = "quest_progress"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    quest_id = Column(String, nullable=False)
    pi_uid = Column(String, nullable=False)
    progress = Column(Integer, nullable=True, default=0, server_default='0')
    completed = Column(Boolean, nullable=True, default=False, server_default='false')
    claimed = Column(Boolean, nullable=True, default=False, server_default='false')
    user_id = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)
