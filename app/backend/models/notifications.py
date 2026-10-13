from app.backend.core.database import Base
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String


class Notifications(Base):
    __tablename__ = "notifications"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    pi_uid = Column(String, nullable=False)
    notification_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    body = Column(String, nullable=False)
    data = Column(String, nullable=True, default='{}', server_default='{}')
    read = Column(Boolean, nullable=True, default=False, server_default='false')
    user_id = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)
