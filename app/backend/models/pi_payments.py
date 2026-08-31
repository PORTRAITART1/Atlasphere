from core.database import Base
from datetime import datetime
from sqlalchemy import Column, DateTime, Float, Integer, String


class Pi_payments(Base):
    """Server-authoritative ledger of Pi Network U2A payments.

    ``payment_id`` is the idempotency key of the whole payment flow: the Pi
    Platform returns it at approval time and replays it at completion time, so
    exactly one row must exist per Pi payment. Uniqueness is enforced by the
    ledger service (transaction-scoped advisory lock + status guard) so a
    project can never be credited twice.

    ``user_id`` is the authenticated Atlasphere account that signed the payment
    request; ``pi_uid`` is the payer identity re-read from the Pi Platform API.
    """

    __tablename__ = "pi_payments"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, index=True, nullable=False)
    payment_id = Column(String, index=True, nullable=False)
    txid = Column(String, nullable=True)
    pi_uid = Column(String, nullable=True)
    pi_username = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    memo = Column(String, nullable=True)
    purpose = Column(String, nullable=True)
    project_id = Column(Integer, index=True, nullable=True)
    status = Column(String, nullable=False)
    network = Column(String, nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)