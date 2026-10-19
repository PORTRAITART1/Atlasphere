"""Pi Network domain validation endpoint.

Returns the validation key as plain text for Pi Network to verify domain ownership.
"""
from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

router = APIRouter(prefix="/api/v1/pi", tags=["pi-validation"])

VALIDATION_KEY = "25dc632ee73613220f39faf97edfeda5f8b28f161a03f4bdf45db3a8de3ab6ba92a603053fbdb14118c47bc514d4a6755e1e8c0f1920871a528e9cd9c3bba7ab"


@router.get("/validation-key", response_class=PlainTextResponse)
async def get_validation_key():
    """Return the Pi Network validation key as plain text."""
    return PlainTextResponse(content=VALIDATION_KEY, media_type="text/plain")


@router.get("/validation-key.txt", response_class=PlainTextResponse)
async def get_validation_key_txt():
    """Return the Pi Network validation key as plain text (alternate .txt path)."""
    return PlainTextResponse(content=VALIDATION_KEY, media_type="text/plain")

@router.get("/validation-key.txt", response_class=PlainTextResponse, include_in_schema=False)
async def get_validation_key_root():
    """Serve the validation key at the domain root (Pi Network requirement)."""
    return PlainTextResponse(content=VALIDATION_KEY, media_type="text/plain")
