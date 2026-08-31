"""Pi Network Platform API client and server-side payment security rules.

This module is the ONLY place where Atlasphere talks to the Pi Platform API
(https://api.minepi.com). It exists so that every payment decision is taken from
data returned by Pi Network itself, never from data sent by the browser.

Security model required by the Pi Developer review:
  * The server re-reads each payment with ``GET /v2/payments/{payment_id}``
    before approving or completing it. Amount, payer uid and metadata are read
    from that authoritative response.
  * Amounts are validated against a per-purpose whitelist/ceiling.
  * The ``PI_API_KEY`` never leaves the backend.
"""

import logging
import os
from typing import Any, Dict, Optional

import httpx

logger = logging.getLogger(__name__)

PI_API_BASE = "https://api.minepi.com"
DEFAULT_TIMEOUT = 20.0

# Smallest amount Atlasphere will ever approve (avoids dust / zero payments).
MIN_AMOUNT = 0.01

# Business purposes accepted by Atlasphere and the maximum amount, in Pi, the
# server is willing to approve for each of them. A payment whose purpose is not
# listed here is rejected before any call to the Pi Platform API.
ALLOWED_PURPOSES: Dict[str, float] = {
    "payment_test": 2.0,
    "project_funding": 10000.0,
    "subscription": 500.0,
    "premium": 500.0,
    "donation": 10000.0,
}

# Purposes that credit a project treasury and therefore require a project id.
PROJECT_PURPOSES = ("project_funding",)


class PiPlatformError(Exception):
    """Raised when the Pi Platform API rejects a request or is misconfigured."""

    def __init__(self, status_code: int, detail: str):
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


def get_api_key() -> str:
    """Return the server-side Pi Platform API key."""
    return os.environ.get("PI_API_KEY", "").strip()


def is_configured() -> bool:
    """True when the Pi Platform API key is available on the server."""
    return bool(get_api_key())


class PiPlatformService:
    """Thin, defensive wrapper around the Pi Platform payment endpoints."""

    def __init__(self, api_key: Optional[str] = None, timeout: float = DEFAULT_TIMEOUT):
        self.api_key = (api_key or get_api_key()).strip()
        self.timeout = timeout

    # ------------------------------------------------------------------ utils

    def _require_key(self) -> None:
        if not self.api_key:
            raise PiPlatformError(
                503,
                "PI_API_KEY is not configured on the server. "
                "Add the Atlasphere server key from the Pi Developer portal.",
            )

    @property
    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Key {self.api_key}",
            "Content-Type": "application/json",
        }

    @staticmethod
    def _fail(action: str, response: httpx.Response) -> PiPlatformError:
        body = (response.text or "")[:500]
        logger.error("Pi Platform %s failed (%s): %s", action, response.status_code, body)
        # Do not leak the raw upstream payload beyond a short, safe excerpt.
        return PiPlatformError(502, f"Pi Platform API {action} failed ({response.status_code}): {body}")

    # ----------------------------------------------------------- api requests

    async def get_payment(self, payment_id: str) -> Dict[str, Any]:
        """Read the authoritative payment object from Pi Network."""
        self._require_key()
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(
                f"{PI_API_BASE}/v2/payments/{payment_id}",
                headers=self._headers,
            )
        if response.status_code == 404:
            raise PiPlatformError(404, "Unknown Pi payment identifier.")
        if response.status_code != 200:
            raise self._fail("payment lookup", response)
        return response.json()

    async def approve_payment(self, payment_id: str) -> Dict[str, Any]:
        """Server-side approval (step 2 of the Pi U2A payment flow)."""
        self._require_key()
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{PI_API_BASE}/v2/payments/{payment_id}/approve",
                headers=self._headers,
            )
        if response.status_code not in (200, 201):
            raise self._fail("approve", response)
        return response.json() if response.content else {}

    async def complete_payment(self, payment_id: str, txid: str) -> Dict[str, Any]:
        """Server-side completion (step 4 of the Pi U2A payment flow)."""
        self._require_key()
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{PI_API_BASE}/v2/payments/{payment_id}/complete",
                headers=self._headers,
                json={"txid": txid},
            )
        if response.status_code not in (200, 201):
            raise self._fail("complete", response)
        return response.json() if response.content else {}

    async def verify_access_token(self, access_token: str) -> Dict[str, Any]:
        """Resolve a Pi access token to its owner via ``GET /v2/me``."""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(
                f"{PI_API_BASE}/v2/me",
                headers={"Authorization": f"Bearer {access_token}"},
            )
        if response.status_code != 200:
            raise PiPlatformError(401, "Invalid Pi access token.")
        return response.json()


# --------------------------------------------------------------- validation


def resolve_purpose(metadata: Optional[Dict[str, Any]]) -> str:
    """Extract and validate the business purpose carried by a payment."""
    raw = ""
    if isinstance(metadata, dict):
        raw = str(metadata.get("purpose") or metadata.get("type") or "").strip().lower()
    if raw not in ALLOWED_PURPOSES:
        raise PiPlatformError(
            400,
            f"Unsupported payment purpose '{raw or 'unknown'}'. "
            f"Allowed purposes: {', '.join(sorted(ALLOWED_PURPOSES))}.",
        )
    return raw


def resolve_project_id(metadata: Optional[Dict[str, Any]]) -> int:
    """Extract the project id from payment metadata (0 when absent)."""
    if not isinstance(metadata, dict):
        return 0
    raw = metadata.get("project_id")
    try:
        return int(raw)
    except (TypeError, ValueError):
        return 0


def validate_amount(purpose: str, amount: Any) -> float:
    """Validate the authoritative amount against the per-purpose ceiling."""
    try:
        value = float(amount)
    except (TypeError, ValueError):
        raise PiPlatformError(400, "Pi payment amount is not a valid number.")
    if value < MIN_AMOUNT:
        raise PiPlatformError(400, f"Pi payment amount must be at least {MIN_AMOUNT} Pi.")
    ceiling = ALLOWED_PURPOSES[purpose]
    if value > ceiling:
        raise PiPlatformError(
            400,
            f"Pi payment amount {value} Pi exceeds the {ceiling} Pi limit allowed for '{purpose}'.",
        )
    return value


def assert_user_to_app(payment: Dict[str, Any]) -> None:
    """Reject anything that is not an inbound (User-to-App) payment."""
    direction = str(payment.get("direction") or "").strip()
    if direction and direction != "user_to_app":
        raise PiPlatformError(400, f"Only user_to_app payments are accepted (got '{direction}').")


def payment_flags(payment: Dict[str, Any]) -> Dict[str, bool]:
    """Normalize the Pi payment status flags."""
    status = payment.get("status") or {}
    return {
        "developer_approved": bool(status.get("developer_approved")),
        "transaction_verified": bool(status.get("transaction_verified")),
        "developer_completed": bool(status.get("developer_completed")),
        "cancelled": bool(status.get("cancelled")),
    }


def payment_txid(payment: Dict[str, Any]) -> str:
    """Return the on-chain transaction id when Pi Network has recorded one."""
    transaction = payment.get("transaction") or {}
    if isinstance(transaction, dict):
        return str(transaction.get("txid") or "")
    return ""


def detect_network(payment: Dict[str, Any]) -> str:
    """Best-effort network label stored for the audit trail."""
    raw = str(payment.get("network") or "").strip()
    if raw:
        return raw.lower().replace("pi ", "").replace(" ", "_")
    return "testnet"