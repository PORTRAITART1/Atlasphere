"""Pi Network domain validation endpoint.

Returns the validation key as plain text for Pi Network to verify domain ownership.
"""
from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

router = APIRouter(prefix="/api/v1/pi", tags=["pi-validation"])

VALIDATION_KEY = "107cc949f35cbbe6c66f3b459845578443d0cecdbb564f68235fec33fff5d5c5fc5c053e76805bc9b9269437d3a0e22d86145be144db9c4e44afc3b4804350a7"


@router.get("/validation-key", response_class=PlainTextResponse)
async def get_validation_key():
    """Return the Pi Network validation key as plain text."""
    return PlainTextResponse(content=VALIDATION_KEY, media_type="text/plain")


@router.get("/validation-key.txt", response_class=PlainTextResponse)
async def get_validation_key_txt():
    """Return the Pi Network validation key as plain text (alternate .txt path)."""
    return PlainTextResponse(content=VALIDATION_KEY, media_type="text/plain")