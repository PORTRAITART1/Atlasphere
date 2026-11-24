import asyncio

import pytest
from fastapi import HTTPException

from app.backend.routers import pi_pay


class FakePiPlatformService:
    def __init__(self, payment):
        self.payment = payment
        self.approved = False

    async def get_payment(self, payment_id):
        return self.payment

    async def approve_payment(self, payment_id):
        self.approved = True


class FakeResult:
    def __init__(self, value):
        self.value = value

    def scalar_one_or_none(self):
        return self.value


class FakeDatabase:
    def __init__(self, project=None):
        self.project = project

    async def execute(self, statement):
        return FakeResult(self.project)


class FakeLedger:
    def __init__(self, db):
        self.errors = []

    async def record_error(self, payment_id, message):
        self.errors.append((payment_id, message))


def _payment(amount=0.1, purpose="payment_test", project_id=None):
    metadata = {"purpose": purpose}
    if project_id is not None:
        metadata["project_id"] = project_id
    return {
        "identifier": "payment-123",
        "user_uid": "pioneer-123",
        "amount": amount,
        "metadata": metadata,
        "direction": "user_to_app",
        "status": {},
        "network": "Pi Mainnet",
    }


def test_approval_rejects_amount_over_purpose_limit(monkeypatch):
    service = FakePiPlatformService(_payment(amount=3.0))
    monkeypatch.setattr(pi_pay, "PiPlatformService", lambda: service)
    monkeypatch.setattr(pi_pay, "PiPaymentLedger", FakeLedger)

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(
            pi_pay.approve_payment(
                pi_pay.PaymentIdRequest(payment_id="payment-123"),
                current_user=None,
                db=FakeDatabase(),
            )
        )

    assert exc_info.value.status_code == 400
    assert service.approved is False


def test_approval_rejects_unknown_project_before_signing(monkeypatch):
    service = FakePiPlatformService(
        _payment(amount=1.0, purpose="project_funding", project_id=42)
    )
    monkeypatch.setattr(pi_pay, "PiPlatformService", lambda: service)
    monkeypatch.setattr(pi_pay, "PiPaymentLedger", FakeLedger)

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(
            pi_pay.approve_payment(
                pi_pay.PaymentIdRequest(payment_id="payment-123"),
                current_user=None,
                db=FakeDatabase(),
            )
        )

    assert exc_info.value.status_code == 404
    assert service.approved is False


def test_approval_allows_valid_payment(monkeypatch):
    service = FakePiPlatformService(_payment())
    monkeypatch.setattr(pi_pay, "PiPlatformService", lambda: service)
    monkeypatch.setattr(pi_pay, "PiPaymentLedger", FakeLedger)

    result = asyncio.run(
        pi_pay.approve_payment(
            pi_pay.PaymentIdRequest(payment_id="payment-123"),
            current_user=None,
            db=FakeDatabase(),
        )
    )

    assert result.status == "approved"
    assert service.approved is True
