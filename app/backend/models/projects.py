from app.backend.core.database import Base
from datetime import datetime
from sqlalchemy import Column, DateTime, Float, Integer, String


class Projects(Base):
    __tablename__ = "projects"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    budget = Column(Float, nullable=False)
    raised = Column(Float, nullable=True, default=0, server_default='0')
    status = Column(String, nullable=True, default='proposed', server_default='proposed')
    votes_for = Column(Integer, nullable=True, default=0, server_default='0')
    votes_against = Column(Integer, nullable=True, default=0, server_default='0')
    voter_count = Column(Integer, nullable=True, default=0, server_default='0')
    milestones = Column(String, nullable=True, default='[]', server_default='[]')
    team = Column(String, nullable=True, default='[]', server_default='[]')
    region = Column(String, nullable=True)
    deadline = Column(String, nullable=True)
    escrow_contract_id = Column(String, nullable=True)
    quorum = Column(Float, nullable=True, default=0.05, server_default='0.05')
    threshold = Column(Float, nullable=True, default=0.66, server_default='0.66')
    user_id = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)
