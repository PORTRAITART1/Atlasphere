from app.backend.core.database import Base
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String


class Pi_feedbacks(Base):
    __tablename__ = "pi_feedbacks"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    pi_uid = Column(String, nullable=False)
    pi_username = Column(String, nullable=True)
    rating = Column(Integer, nullable=False)
    comment = Column(String, nullable=True)
    language = Column(String, nullable=True)
    network = Column(String, nullable=True)
    payment_id = Column(String, index=True, nullable=True)
    verified_payment = Column(Boolean, nullable=True)
    is_published = Column(Boolean, nullable=True)
    device_info = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)