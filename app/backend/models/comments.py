from app.backend.core.database import Base
from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String


class Comments(Base):
    __tablename__ = "comments"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    project_id = Column(Integer, nullable=False)
    content = Column(String, nullable=False)
    pi_uid = Column(String, nullable=False)
    pi_username = Column(String, nullable=False)
    parent_id = Column(Integer, nullable=True)
    likes = Column(Integer, nullable=True, default=0, server_default='0')
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)
