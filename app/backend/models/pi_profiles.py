from app.backend.core.database import Base
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String


class Pi_profiles(Base):
    __tablename__ = "pi_profiles"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    pi_uid = Column(String, nullable=False)
    username = Column(String, nullable=False)
    display_name = Column(String, nullable=True)
    reputation = Column(Integer, nullable=True, default=0, server_default='0')
    voting_power = Column(Float, nullable=True, default=1.0, server_default='1.0')
    pi_locked = Column(Float, nullable=True, default=0, server_default='0')
    streak_days = Column(Integer, nullable=True, default=0, server_default='0')
    kyc_verified = Column(Boolean, nullable=True, default=False, server_default='false')
    language = Column(String, nullable=True, default='fr', server_default='fr')
    badges = Column(String, nullable=True, default='[]', server_default='[]')
    level = Column(String, nullable=True, default='bronze', server_default='bronze')
    last_active = Column(String, nullable=True)
    user_id = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)
