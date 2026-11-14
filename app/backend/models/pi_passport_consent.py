from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, String

from app.backend.core.database import Base


class Pi_passport_consent(Base):
    """Explicit per-Pioneer opt-in for the public Atlasphere Passport."""

    __tablename__ = "pi_passport_consents"
    __table_args__ = {"extend_existing": True}

    pi_uid = Column(String(200), primary_key=True, nullable=False)
    is_public = Column(Boolean, nullable=False, default=False, server_default="false")
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)
