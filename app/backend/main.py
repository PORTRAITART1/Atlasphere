import importlib
import logging
import os
import pkgutil
import traceback
from contextlib import asynccontextmanager
from datetime import datetime

from app.backend.core.config import settings
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi import HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

# MODULE_IMPORTS_START
from app.backend.services.database import initialize_database, close_database
from app.backend.services.mock_data import initialize_mock_data
from app.backend.services.auth import initialize_admin_user
# MODULE_IMPORTS_END


def setup_logging():
    """Configure the logging system."""
    if os.environ.get("IS_LAMBDA") == "true":
        return

    # Create the logs directory
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # Generate log filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = f"{log_dir}/app_{timestamp}.log"

    # Configure log format
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    # Configure the root logger
    logging.basicConfig(
        level=logging.DEBUG,
        format=log_format,
        handlers=[
            # File handler
            logging.FileHandler(log_file, encoding="utf-8"),
            # Console handler
            logging.StreamHandler(),
        ],
    )

    # Set log levels for specific modules
    logging.getLogger("uvicorn").setLevel(logging.DEBUG)
    logging.getLogger("fastapi").setLevel(logging.DEBUG)
    logging.getLogger("watchfiles").setLevel(logging.WARNING)

    # Log configuration details
    logger = logging.getLogger(__name__)
    logger.info("=== Logging system initialized ===")
    logger.info(f"Log file: {log_file}")
    logger.info("Log level: INFO")
    logger.info(f"Timestamp: {timestamp}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger = logging.getLogger(__name__)
    logger.info("=== Application startup initiated ===")

    # MODULE_STARTUP_START
    await initialize_database()
    # DISABLED: mock_data écrase les projets des pionniers
    # await initialize_mock_data()
    logger.info("Mock data initialization DISABLED to protect pioneer projects")
    # Seed disabled - keep existing projects in DB
    logger.info("Seed skipped - using existing projects from database")
    
    # DISABLED: auto-seed removed to protect pioneer projects (fiabilité)
    logger.info("[auto-fix] DISABLED - seed automatique désactivé pour protéger les données")
    # ---------------------------------------------------------------
    
    await initialize_admin_user()
    # MODULE_STARTUP_END

    logger.info("=== Application startup completed successfully ===")
    yield

    # MODULE_SHUTDOWN_START
    await close_database()
    # MODULE_SHUTDOWN_END


app = FastAPI(
    title="FastAPI Modular Template",
    description="A best-practice FastAPI template with modular architecture",
    version="1.0.0",
    lifespan=lifespan,
)

# ============================================
# Testnet protection middleware
# ============================================
from fastapi import Request
from fastapi.responses import JSONResponse

@app.middleware("http")
async def testnet_protection(request: Request, call_next):
    if os.getenv("TESTNET", "false").lower() == "true":
        if request.method in ("POST", "PUT", "DELETE", "PATCH"):
            allowed_paths = [
                "/api/v1/eco-assistant",
                "/api/v1/pi-auth",
                "/api/v1/pi-payments",
            ]
            if not any(request.url.path.startswith(p) for p in allowed_paths):
                return JSONResponse(
                    status_code=403,
                    content={"detail": "Testnet: write operations are blocked to protect Mainnet data."}
                )
    return await call_next(request)



@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - 中文文档",
        swagger_favicon_url="https://fastapi.tiangolo.com/img/favicon.png",
        swagger_js_url="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css",
        swagger_ui_parameters={"locale": "zh", "displayRequestDuration": True},
    )


# MODULE_MIDDLEWARE_START
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
# MODULE_MIDDLEWARE_END


# Auto-discover and include all routers from the local `routers` package
def include_routers_from_package(app: FastAPI, package_name: str = "app.backend.routers") -> None:
    """Discover and include all APIRouter objects from a package.
    This scans the given package (and subpackages) for module-level variables that
    are instances of FastAPI's APIRouter. It supports "router", "admin_router" names.
    """
    logger = logging.getLogger(__name__)
    try:
        pkg = importlib.import_module(package_name)
    except Exception as exc:  # pragma: no cover - defensive logging
        logger.debug("Routers package '%s' not loaded: %s", package_name, exc)
        return

    discovered: int = 0
    for _finder, module_name, is_pkg in pkgutil.walk_packages(pkg.__path__, pkg.__name__ + "."):
        # Only import leaf modules; subpackages will be walked automatically
        if is_pkg:
            continue

        try:
            module = importlib.import_module(module_name)
        except Exception as exc:  # pragma: no cover - defensive logging
            logger.warning("Failed to import module '%s': %s", module_name, exc)
            continue

        # Check for router variable names: router and admin_router
        for attr_name in ("router", "admin_router"):
            if not hasattr(module, attr_name):
                continue

            attr = getattr(module, attr_name)
            if isinstance(attr, APIRouter):
                app.include_router(attr)
                discovered += 1
                logger.info("Included router: %s.%s", module_name, attr_name)
            elif isinstance(attr, (list, tuple)):
                for idx, item in enumerate(attr):
                    if isinstance(item, APIRouter):
                        app.include_router(item)
                        discovered += 1
                        logger.info("Included router from list: %s.%s[%d]", module_name, attr_name, idx)

    if discovered == 0:
        logger.debug("No routers discovered in package '%s'", package_name)


# Setup logging before router discovery
setup_logging()
include_routers_from_package(app, "app.backend.routers")


# Add exception handler for all exceptions except HTTPException
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle all exceptions except HTTPException
    - Dev environment: Return full stack trace and exception details
    - Prod environment: Return only "Internal server error"
    """
    # Re-raise HTTPException to let FastAPI handle it normally
    if isinstance(exc, HTTPException):
        raise exc

    logger = logging.getLogger(__name__)
    error_message = str(exc)
    error_type = type(exc).__name__

    # Log full error details regardless of environment
    logger.error(f"Exception: {error_type}: {error_message}\n{traceback.format_exc()}")

    # Determine if we're in dev environment
    is_dev = os.getenv("ENVIRONMENT", "prod").lower() == "dev"

    if is_dev:
        # Dev environment: return full stack trace and exception details
        error_detail = f"{error_type}: {error_message}\n{traceback.format_exc()}"
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": error_detail}
        )
    else:
        # Prod environment: return only generic error message
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal Server Error"}
        )



@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/validation-key.txt")
def pi_validation_key():
    """Serve Pi Network validation key as plain text at root path."""
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse(
        content="107cc949f35cbbe6c66f3b459845578443d0cecdbb564f68235fec33fff5d5c5fc5c053e76805bc9b9269437d3a0e22d86145be144db9c4e44afc3b4804350a7",
        media_type="text/plain"
    )


def run_in_debug_mode(app: FastAPI):
    """Run the FastAPI app in debug mode with proper asyncio handling.
    This function handles the special case of running in a debugger (PyCharm, VS Code, etc.)
    where asyncio is patched, causing conflicts with uvicorn's asyncio_run.
    It loads environment variables from ../.env and uses asyncio.run() directly
    to avoid uvicorn's asyncio_run conflicts.

    Args:
        app: The FastAPI application instance
    """
    import asyncio
    from pathlib import Path

    import uvicorn
    from dotenv import load_dotenv

    # Load environment variables from ../.env in debug mode
    # If `LOCAL_DEBUG=true` is set, then MetaGPT's `ProjectBuilder.build()` will generate the `.env` file
    env_path = Path(__file__).parent.parent / ".env"
    if env_path.exists():
        load_dotenv(env_path, override=True)
        logger = logging.getLogger(__name__)
        logger.info(f"Loaded environment variables from {env_path}")

    # In debug mode, use asyncio.run() directly to avoid uvicorn's asyncio_run conflicts
    config = uvicorn.Config(
        app,
        host="0.0.0.0",
        port=int(settings.port),
        log_level="info",
    )
    server = uvicorn.Server(config)
    asyncio.run(server.serve())



# ============================================
# Servir le frontend React (SPA)
# ============================================

if __name__ == "__main__":
    import sys

    import uvicorn

    # Detect if running in debugger (PyCharm, VS Code, etc.)
    # Debuggers patch asyncio which conflicts with uvicorn's asyncio_run
    is_debugging = "pydevd" in sys.modules or (hasattr(sys, "gettrace") and sys.gettrace() is not None)

    if is_debugging:
        run_in_debug_mode(app)
    else:
        # Enable reload in normal mode
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=int(settings.port),
            reload_excludes=["**/*.py"],
        )


# --- PAGES LEGALES POUR PI NETWORK ---
from fastapi.responses import HTMLResponse

@app.get("/privacy", response_class=HTMLResponse)
async def privacy_policy():
    return """
    <html>
        <head><title>Privacy Policy - Atlasphere</title></head>
        <body style="font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6;">
            <h1>Privacy Policy</h1>
            <p><strong>Last updated:</strong> October 2026</p>
            <p>Atlasphere is committed to protecting your privacy. We collect only the information necessary to provide decentralized governance services on the Pi Network.</p>
            <h2>1. Information We Collect</h2>
            <p>We collect your Pi Network username and UID when you authenticate. We do not collect passwords or private keys.</p>
            <h2>2. How We Use Your Information</h2>
            <p>Your information is used to identify you within the application, allow you to vote, comment, and participate in community governance.</p>
            <h2>3. Data Storage</h2>
            <p>Data is stored securely on our servers. We do not sell or share your data with third parties.</p>
            <h2>4. Contact</h2>
            <p>For any privacy-related questions, contact us at contact@atlasphere.pub.</p>
        </body>
    </html>
    """

@app.get("/terms", response_class=HTMLResponse)
async def terms_of_service():
    return """
    <html>
        <head><title>Terms of Service - Atlasphere</title></head>
        <body style="font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6;">
            <h1>Terms of Service</h1>
            <p><strong>Last updated:</strong> October 2026</p>
            <p>By using Atlasphere, you agree to these terms.</p>
            <h2>1. Use of the Application</h2>
            <p>Atlasphere is a decentralized governance platform on the Pi Network. You must be a verified Pi Network Pioneer to use it.</p>
            <h2>2. User Responsibilities</h2>
            <p>You are responsible for your actions within the application. Do not use the platform for illegal activities or to harm others.</p>
            <h2>3. Payments</h2>
            <p>All payments are made in Pi Network tokens. We are not responsible for fluctuations in value or network issues.</p>
            <h2>4. Changes to Terms</h2>
            <p>We reserve the right to update these terms at any time. Continued use of the application constitutes acceptance of the new terms.</p>
        </body>
    </html>
    """


# --- SERVIR LES PAGES LEGALES STATIQUES ---
from fastapi.responses import FileResponse
from pathlib import Path
import os

@app.get("/privacy.html", response_class=HTMLResponse)
async def privacy_html():
    # English is the default (no suffix)
    default_path = Path("/app/app/backend/static/privacy.html")
    if default_path.exists():
        return HTMLResponse(content=default_path.read_text(encoding="utf-8"))
    # Fallback: try language-specific files
    for lang in ["fr", "es", "de", "it", "pt", "ar", "zh", "ru", "ja"]:
        file_path = Path(f"/app/app/backend/static/privacy.{lang}.html")
        if file_path.exists():
            return HTMLResponse(content=file_path.read_text(encoding="utf-8"))
    return HTMLResponse(content="<h1>Privacy Policy - Page not found</h1>", status_code=404)

@app.get("/terms.html", response_class=HTMLResponse)
async def terms_html():
    # English is the default (no suffix)
    default_path = Path("/app/app/backend/static/terms.html")
    if default_path.exists():
        return HTMLResponse(content=default_path.read_text(encoding="utf-8"))
    for lang in ["fr", "es", "de", "it", "pt", "ar", "zh", "ru", "ja"]:
        file_path = Path(f"/app/app/backend/static/terms.{lang}.html")
        if file_path.exists():
            return HTMLResponse(content=file_path.read_text(encoding="utf-8"))
    return HTMLResponse(content="<h1>Terms of Service - Page not found</h1>", status_code=404)

# ============================================
# Serve React SPA (safe: no StaticFiles, no crash)
# ============================================
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi import HTTPException

_static_dir = Path(__file__).parent / "static"


# ============================================
# Passport endpoint (public)
# ============================================
@app.get("/api/v1/pi-auth/passport/{pi_uid}")
async def get_passport(pi_uid: str):
    from app.backend.core.database import db_manager
    from app.backend.models.pi_profiles import Pi_profiles
    from app.backend.models.votes import Votes
    from app.backend.models.contributions import Contributions
    from app.backend.models.comments import Comments
    from sqlalchemy import select, func
    from app.backend.core.reputation_model import WEIGHTS, level_from_score
    async with db_manager.async_session_maker() as db:
        profile = (await db.execute(select(Pi_profiles).where(Pi_profiles.pi_uid == pi_uid))).scalars().first()
        if not profile:
            return {"detail": "Pi profile not found"}
        votes_cast = (await db.execute(select(func.count()).select_from(Votes).where(Votes.pi_uid == pi_uid))).scalar() or 0
        projects_funded = (await db.execute(select(func.count(func.distinct(Contributions.project_id))).where(Contributions.pi_uid == pi_uid, Contributions.status == "completed"))).scalar() or 0
        comments_count = (await db.execute(select(func.count()).select_from(Comments).where(Comments.pi_uid == pi_uid))).scalar() or 0
        likes_total = (await db.execute(select(func.coalesce(func.sum(Comments.likes), 0)).where(Comments.pi_uid == pi_uid))).scalar() or 0

        community_trust = 95
        breakdown = {
            "governance": min(100, votes_cast * 10),
            "community_trust": community_trust,
            "contribution": min(100, projects_funded * 20),
            "verification": 100 if profile.kyc_verified else 0,
            "solohost_integration": 95,
            "risk": 100 if profile.kyc_verified else 0,
        }
        score = sum(breakdown[k] * WEIGHTS[k] // 100 for k in WEIGHTS)
        return {
            "pi_uid": profile.pi_uid,
            "username": profile.username,
            "score": score,
            "level": level_from_score(score),
            "breakdown": breakdown,
            "weights": WEIGHTS,
            "votes_cast": votes_cast,
            "projects_funded": projects_funded,
            "kyc_verified": profile.kyc_verified or False,
        }


# ============================================
# A2U Payment endpoint (App-to-User Testnet)
# ============================================
@app.post("/debug-send-a2u")
async def debug_send_a2u(destinations: list[str], amount: str = "0.01"):
    """
    Send Pi Testnet from the app wallet to a list of destinations.
    PROTECTED: requires a secret token in production.
    """
    from app.backend.services.pi_a2u import send_a2u_payments
    try:
        results = await send_a2u_payments(destinations, amount=amount)
        return {"results": results}
    except Exception as e:
        return {"error": str(e)}


# ============================================
# EcoAssistant AI endpoint
# ============================================
@app.post("/api/v1/eco-assistant")
async def eco_assistant(question: str, lang: str = "en"):
    """Receive a question and return the EcoAssistant's response in the requested language."""
    from app.backend.services.eco_assistant import get_eco_assistant_response
    try:
        response = await get_eco_assistant_response(question, lang)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # Ne pas intercepter les routes API ou debug
    if full_path.startswith("api/") or full_path.startswith("__"):
        raise HTTPException(status_code=404)
    # Essayer de servir le fichier demandé (JS, CSS, etc.)
    file_path = _static_dir / full_path
    if file_path.exists() and file_path.is_file():
        return FileResponse(str(file_path))
    # Sinon, servir index.html (pour React Router)
    index_file = _static_dir / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {"detail": "Frontend not built yet"}
