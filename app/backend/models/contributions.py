from app.backend.core.database import Base
from datetime import datetime
from sqlalchemy import Column, DateTime, Float, Integer, String


class Contributions(Base):
    __tablename__ = "contributions"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    project_id = Column(Integer, nullable=False)
    amount = Column(Float, nullable=False)
    transaction_id = Column(String, nullable=True)
    payment_id = Column(String, nullable=True)
    status = Column(String, nullable=True, default='pending', server_default='pending')
    pi_uid = Column(String, nullable=False)
    user_id = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)
