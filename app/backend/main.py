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


@app.get("/")
def root():
    index_path = Path("/app/app/backend/static/index.html")
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"message": "Frontend not built yet"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/validation-key.txt")
def pi_validation_key():
    """Serve Pi Network validation key as plain text at root path."""
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse(
        content="25dc632ee73613220f39faf97edfeda5f8b28f161a03f4bdf45db3a8de3ab6ba92a603053fbdb14118c47bc514d4a6755e1e8c0f1920871a528e9cd9c3bba7ab",
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


@app.get("/debug-files")
async def debug_files():
    """Liste les fichiers dans les dossiers clés pour diagnostiquer le 404."""
    import os
    paths = [
        "/app/app/frontend/public/",
        "/app/app/frontend/",
        "/app/",
    ]
    result = {}
    for path in paths:
        if os.path.exists(path):
            try:
                result[path] = os.listdir(path)[:20]
            except Exception as e:
                result[path] = f"Erreur: {e}"
        else:
            result[path] = "N'existe pas"
    return result


@app.get("/debug-db")
async def debug_db():
    from app.backend.core.database import Base, db_manager
    from sqlalchemy import text
    result = {}
    async with db_manager.async_session_maker() as db:
        for table_name in Base.metadata.tables.keys():
            try:
                r = await db.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
                result[table_name] = r.scalar()
            except Exception as e:
                result[table_name] = f"ERREUR: {e}"
    return result


@app.get("/debug-insert-profile")
async def debug_insert_profile():
    from app.backend.core.database import db_manager
    from app.backend.models.pi_profiles import Pi_profiles
    async with db_manager.async_session_maker() as db:
        try:
            test = Pi_profiles(
                pi_uid="debug_test_uid", username="debug_test",
                display_name="Debug", reputation=42, voting_power=1.5,
                pi_locked=0, streak_days=0, kyc_verified=False,
                language="fr", badges="[]", level="bronze",
                last_active="now", user_id="debug_test_uid",
            )
            db.add(test)
            await db.commit()
            return {"status": "ok", "inserted": "debug_test_uid"}
        except Exception as e:
            return {"status": "error", "error": str(e)}


@app.get("/debug-list-profiles")
async def debug_list_profiles():
    from app.backend.core.database import db_manager
    from app.backend.models.pi_profiles import Pi_profiles
    from sqlalchemy import select
    async with db_manager.async_session_maker() as db:
        result = await db.execute(select(Pi_profiles))
        return [{"id": p.id, "pi_uid": p.pi_uid, "username": p.username, "user_id": p.user_id} for p in result.scalars().all()]


@app.get("/debug-cleanup-profiles")
async def debug_cleanup_profiles():
    from app.backend.core.database import db_manager
    from sqlalchemy import text
    async with db_manager.async_session_maker() as db:
        r = await db.execute(text("DELETE FROM pi_profiles WHERE pi_uid LIKE 'debug_%'"))
        await db.commit()
        return {"deleted": r.rowcount}


@app.get("/debug-passport/{pi_uid}")
async def debug_passport(pi_uid: str):
    from app.backend.core.database import db_manager
    from app.backend.models.pi_profiles import Pi_profiles
    from app.backend.models.votes import Votes
    from app.backend.models.contributions import Contributions
    from sqlalchemy import select, func
    from app.backend.core.reputation_model import WEIGHTS, level_from_score
    async with db_manager.async_session_maker() as db:
        profile = (await db.execute(select(Pi_profiles).where(Pi_profiles.pi_uid == pi_uid))).scalars().first()
        if not profile:
            return {"detail": "Pi profile not found"}
        votes_cast = (await db.execute(select(func.count()).select_from(Votes).where(Votes.pi_uid == pi_uid))).scalar() or 0
        projects_funded = (await db.execute(select(func.count(func.distinct(Contributions.project_id))).where(Contributions.pi_uid == pi_uid, Contributions.status == "completed"))).scalar() or 0
        breakdown = {
            "governance": min(100, votes_cast * 5),
            "community_trust": 50,
            "contribution": min(100, projects_funded * 20),
            "verification": 15 if profile.kyc_verified else 0,
            "solohost_integration": 0,
            "risk": 0,
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


@app.post("/debug-seed-translated-projects")
async def debug_seed_translated_projects():
    """Seed 5 visionary projects with full translations in 10 languages."""
    from app.backend.core.database import db_manager
    from app.backend.models.projects import Projects
    from sqlalchemy import select
    import datetime, json

    MY_USER_ID = "portraitart"
    projects_data = [
        {
            "title": "Pi Neural Grid — Compute-to-Earn DAO",
            "description": "Decentralized GPU compute network for AI training. $50B market.",
            "translations": {
                "en": {"title": "Pi Neural Grid — Compute-to-Earn DAO", "description": "Decentralized GPU compute network for AI training. Rewards Pioneers in Pi."},
                "fr": {"title": "Pi Neural Grid — DAO du Calcul Rémunéré", "description": "Réseau décentralisé de calcul GPU pour l'IA. Récompense les Pioneers en Pi."},
                "es": {"title": "Pi Neural Grid — DAO de Computación Recompensada", "description": "Red descentralizada de cómputo GPU para IA. Recompensa a los Pioneers en Pi."},
                "de": {"title": "Pi Neural Grid — Compute-to-Earn DAO", "description": "Dezentrales GPU-Computing-Netzwerk für KI-Training. Belohnt Pioneers mit Pi."},
                "it": {"title": "Pi Neural Grid — DAO del Calcolo Remunerato", "description": "Rete decentralizzata di calcolo GPU per l'IA. Ricompensa i Pioneers in Pi."},
                "pt": {"title": "Pi Neural Grid — DAO de Computação Recompensada", "description": "Rede descentralizada de computação GPU para IA. Recompensa Pioneers em Pi."},
                "ru": {"title": "Pi Neural Grid — DAO вычислений с вознаграждением", "description": "Децентрализованная сеть GPU-вычислений для ИИ. Вознаграждение Pioneers в Pi."},
                "ar": {"title": "Pi Neural Grid — DAO للحوسبة المكافأة", "description": "شبكة حوسبة GPU لامركزية للذكاء الاصطناعي. تكافئ الرواد بعملة Pi."},
                "zh": {"title": "Pi Neural Grid — 计算即赚取 DAO", "description": "去中心化GPU计算网络用于AI训练。以Pi奖励先锋。"},
                "ja": {"title": "Pi Neural Grid — コンピュート・トゥ・アーンDAO", "description": "AIトレーニング用の分散型GPUコンピューティングネットワーク。PioneersにPiで報酬。"},
            },
            "category": "technology", "budget": 250000.0,
        },
        {
            "title": "AtlasPulse — Real-Time Global Sentiment Oracle",
            "description": "Decentralized oracle for Pi community sentiment, sold to institutions.",
            "translations": {
                "en": {"title": "AtlasPulse — Real-Time Global Sentiment Oracle", "description": "Decentralized sentiment oracle for institutions and governments."},
                "fr": {"title": "AtlasPulse — Oracle de Sentiment Mondial en Temps Réel", "description": "Oracle décentralisé de sentiment pour institutions et gouvernements."},
                "es": {"title": "AtlasPulse — Oráculo de Sentimiento Global en Tiempo Real", "description": "Oráculo descentralizado de sentimiento para instituciones y gobiernos."},
                "de": {"title": "AtlasPulse — Echtzeit-Weltstimmungs-Orakel", "description": "Dezentrales Stimmungs-Orakel für Institutionen und Regierungen."},
                "it": {"title": "AtlasPulse — Oracolo del Sentiment Globale in Tempo Reale", "description": "Oracolo decentralizzato del sentiment per istituzioni e governi."},
                "pt": {"title": "AtlasPulse — Oráculo de Sentimento Global em Tempo Real", "description": "Oráculo descentralizado de sentimento para instituições e governos."},
                "ru": {"title": "AtlasPulse — Оракул глобальных настроений в реальном времени", "description": "Децентрализованный оракул настроений для институтов и правительств."},
                "ar": {"title": "AtlasPulse — أوراكل المشاعر العالمية في الوقت الفعلي", "description": "أوراكل لامركزي للمشاعر للمؤسسات والحكومات."},
                "zh": {"title": "AtlasPulse — 实时全球情绪预言机", "description": "面向机构和政府的去中心化情绪预言机。"},
                "ja": {"title": "AtlasPulse — リアルタイム世界感情オラクル", "description": "機関や政府向けの分散型感情オラクル。"},
            },
            "category": "technology", "budget": 180000.0,
        },
        {
            "title": "PiScribe — AI-to-Pi Content Marketplace",
            "description": "Marketplace where AIs buy human-curated data, paid in Pi. $12B market.",
            "translations": {
                "en": {"title": "PiScribe — AI-to-Pi Content Marketplace", "description": "AI models buy human-curated data, paid in Pi. EU AI Act compliant."},
                "fr": {"title": "PiScribe — Place de Marché de Contenu IA-vers-Pi", "description": "Les IA achètent du contenu humain, payé en Pi. Conforme à l'EU AI Act."},
                "es": {"title": "PiScribe — Mercado de Contenido IA-a-Pi", "description": "Los modelos de IA compran contenido humano, pagado en Pi. Cumple con la EU AI Act."},
                "de": {"title": "PiScribe — KI-zu-Pi-Inhaltsmarktplatz", "description": "KI-Modelle kaufen menschliche Inhalte, bezahlt in Pi. EU AI Act-konform."},
                "it": {"title": "PiScribe — Marketplace di Contenuti IA-a-Pi", "description": "I modelli IA acquistano contenuti umani, pagati in Pi. Conforme all'EU AI Act."},
                "pt": {"title": "PiScribe — Marketplace de Conteúdo IA-para-Pi", "description": "Modelos de IA compram conteúdo humano, pago em Pi. Em conformidade com a EU AI Act."},
                "ru": {"title": "PiScribe — Рынок контента ИИ-в-Pi", "description": "Модели ИИ покупают человеческий контент, оплата в Pi. Соответствует EU AI Act."},
                "ar": {"title": "PiScribe — سوق المحتوى من الذكاء الاصطناعي إلى Pi", "description": "نماذج الذكاء الاصطناعي تشتري محتوى بشري، مدفوع بـ Pi. متوافق مع EU AI Act."},
                "zh": {"title": "PiScribe — AI到Pi内容市场", "description": "AI模型购买人类精选内容，以Pi支付。符合EU AI Act。"},
                "ja": {"title": "PiScribe — AIからPiへのコンテンツマーケット", "description": "AIモデルが人間のコンテンツをPiで購入。EU AI Act準拠。"},
            },
            "category": "technology", "budget": 150000.0,
        },
        {
            "title": "AtlasChain Sentinel — Post-Quantum Security Layer",
            "description": "Post-quantum security for Pi dApps, community-voted standards.",
            "translations": {
                "en": {"title": "AtlasChain Sentinel — Post-Quantum Security Layer", "description": "Post-quantum cryptographic layer for all Pi dApps. Community-certified."},
                "fr": {"title": "AtlasChain Sentinel — Couche de Sécurité Post-Quantique", "description": "Couche cryptographique post-quantique pour toutes les dApps Pi. Certifiée par la communauté."},
                "es": {"title": "AtlasChain Sentinel — Capa de Seguridad Post-Cuántica", "description": "Capa criptográfica post-cuántica para todas las dApps Pi. Certificada por la comunidad."},
                "de": {"title": "AtlasChain Sentinel — Post-Quanten-Sicherheitsschicht", "description": "Post-quanten-kryptografische Schicht für alle Pi-dApps. Von der Community zertifiziert."},
                "it": {"title": "AtlasChain Sentinel — Livello di Sicurezza Post-Quantistica", "description": "Livello crittografico post-quantistico per tutte le dApp Pi. Certificato dalla community."},
                "pt": {"title": "AtlasChain Sentinel — Camada de Segurança Pós-Quântica", "description": "Camada criptográfica pós-quântica para todas as dApps Pi. Certificada pela comunidade."},
                "ru": {"title": "AtlasChain Sentinel — Пост-квантовый уровень безопасности", "description": "Пост-квантовый криптографический слой для всех dApps Pi. Сертифицирован сообществом."},
                "ar": {"title": "AtlasChain Sentinel — طبقة أمان ما بعد الكم", "description": "طبقة تشفير ما بعد الكم لجميع تطبيقات Pi. معتمدة من المجتمع."},
                "zh": {"title": "AtlasChain Sentinel — 后量子安全层", "description": "面向所有Pi dApp的后量子密码层。社区认证。"},
                "ja": {"title": "AtlasChain Sentinel — ポスト量子セキュリティ層", "description": "すべてのPi dApp向けのポスト量子暗号層。コミュニティ認証。"},
            },
            "category": "technology", "budget": 200000.0,
        },
        {
            "title": "Gaia Protocol — Planetary Climate Oracle",
            "description": "IoT sensor network for CO2, air quality, biodiversity. $30B market.",
            "translations": {
                "en": {"title": "Gaia Protocol — Planetary Climate Oracle", "description": "IoT sensor network for CO2, air quality, biodiversity. Data sold to governments."},
                "fr": {"title": "Gaia Protocol — Oracle Climatique Planétaire", "description": "Réseau de capteurs IoT pour CO2, qualité de l'air, biodiversité. Données vendues aux gouvernements."},
                "es": {"title": "Gaia Protocol — Oráculo Climático Planetario", "description": "Red de sensores IoT para CO2, calidad del aire, biodiversidad. Datos vendidos a gobiernos."},
                "de": {"title": "Gaia Protocol — Planetarisches Klima-Orakel", "description": "IoT-Sensornetzwerk für CO2, Luftqualität, Biodiversität. Daten an Regierungen verkauft."},
                "it": {"title": "Gaia Protocol — Oracolo Climatico Planetario", "description": "Rete di sensori IoT per CO2, qualità dell'aria, biodiversità. Dati venduti ai governi."},
                "pt": {"title": "Gaia Protocol — Oráculo Climático Planetário", "description": "Rede de sensores IoT para CO2, qualidade do ar, biodiversidade. Dados vendidos a governos."},
                "ru": {"title": "Gaia Protocol — Планетарный климатический оракул", "description": "Сеть IoT-датчиков для CO2, качества воздуха, биоразнообразия. Данные продаются правительствам."},
                "ar": {"title": "Gaia Protocol — أوراكل المناخ الكوكبي", "description": "شبكة أجهزة استشعار إنترنت الأشياء لـ CO2 وجودة الهواء والتنوع البيولوجي. البيانات تُباع للحكومات."},
                "zh": {"title": "Gaia Protocol — 行星气候预言机", "description": "用于CO2、空气质量和生物多样性的物联网传感器网络。数据出售给政府。"},
                "ja": {"title": "Gaia Protocol — 惑星気候オラクル", "description": "CO2、大気質、生物多様性のためのIoTセンサーネットワーク。データは政府に販売。"},
            },
            "category": "environment", "budget": 220000.0,
        },
    ]

    async with db_manager.async_session_maker() as db:
        created = []
        for data in projects_data:
            existing = (await db.execute(select(Projects).where(Projects.title == data["title"]))).scalars().first()
            if existing:
                continue
            now = datetime.datetime.utcnow()
            p_obj = Projects(
                title=data["title"], description=data["description"], category=data["category"],
                budget=data["budget"], raised=0.0, status="voting",
                votes_for=0, votes_against=0, voter_count=0,
                milestones=json.dumps(data["translations"]),
                team='["portraitart"]', region="Global",
                deadline="2027-12-31", quorum=1000.0, threshold=60.0,
                user_id=MY_USER_ID, created_at=now, updated_at=now,
            )
            db.add(p_obj)
            created.append(data["title"])
        await db.commit()
        return {"created": created, "total": len(created), "languages": 10}


@app.post("/debug-test-insert-1")
async def debug_test_insert_1():
    from app.backend.core.database import db_manager
    from app.backend.models.projects import Projects
    import datetime, json
    try:
        async with db_manager.async_session_maker() as db:
            now = datetime.datetime.utcnow()
            p = Projects(
                title="TEST MINIMAL", description="test", category="technology",
                budget=1000.0, raised=0.0, status="voting",
                votes_for=0, votes_against=0, voter_count=0,
                milestones=json.dumps({"en": "test"}),
                team='["portraitart"]', region="Global",
                deadline="2027-12-31", quorum=1000.0, threshold=60.0,
                user_id="portraitart", created_at=now, updated_at=now,
            )
            db.add(p)
            await db.commit()
            return {"status": "ok"}
    except Exception as e:
        import traceback
        return {"status": "error", "type": type(e).__name__, "msg": str(e), "tb": traceback.format_exc()[-500:]}


@app.post("/debug-test-insert-long")
async def debug_test_insert_long():
    from app.backend.core.database import db_manager
    from app.backend.models.projects import Projects
    import datetime, json
    try:
        long_json = json.dumps({f"lang{i}": "x" * 500 for i in range(10)})
        async with db_manager.async_session_maker() as db:
            now = datetime.datetime.utcnow()
            p = Projects(
                title="TEST LONG", description="test", category="technology",
                budget=1000.0, raised=0.0, status="voting",
                votes_for=0, votes_against=0, voter_count=0,
                milestones=long_json, team='["portraitart"]', region="Global",
                deadline="2027-12-31", quorum=1000.0, threshold=60.0,
                user_id="portraitart", created_at=now, updated_at=now,
            )
            db.add(p)
            await db.commit()
            return {"status": "ok", "json_len": len(long_json)}
    except Exception as e:
        import traceback
        return {"status": "error", "type": type(e).__name__, "msg": str(e), "tb": traceback.format_exc()[-500:]}


@app.post("/debug-fix-sequence")
async def debug_fix_sequence():
    """Resynchronize PostgreSQL sequence for projects table."""
    from app.backend.core.database import db_manager
    from sqlalchemy import text
    try:
        async with db_manager.async_session_maker() as db:
            await db.execute(text("""
                SELECT setval(
                    pg_get_serial_sequence('projects', 'id'),
                    COALESCE((SELECT MAX(id) FROM projects), 0) + 1,
                    false
                )
            """))
            await db.commit()
            r = await db.execute(text("SELECT MAX(id) FROM projects"))
            max_id = r.scalar()
            return {"status": "ok", "max_id": max_id, "next_id": (max_id or 0) + 1}
    except Exception as e:
        import traceback
        return {"status": "error", "msg": str(e), "tb": traceback.format_exc()[-300:]}


@app.post("/debug-cleanup-test-projects")
async def debug_cleanup_test_projects():
    from app.backend.core.database import db_manager
    from sqlalchemy import text
    async with db_manager.async_session_maker() as db:
        r = await db.execute(text("DELETE FROM projects WHERE title LIKE 'TEST%'"))
        await db.commit()
        return {"deleted": r.rowcount}


# --- SERVIR LE FRONTEND REACT (dossier dist) ---
import os
frontend_dist = Path("/app/app/backend/static")
if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Si le fichier existe dans dist, on le sert
        file_path = frontend_dist / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        # Sinon, on renvoie index.html (pour React Router)
        index_path = frontend_dist / "index.html"
        if index_path.exists():
            return FileResponse(str(index_path))
        return HTMLResponse(content="<h1>Frontend not built</h1>", status_code=404)
