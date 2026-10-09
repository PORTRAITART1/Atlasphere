@asynccontextmanager
async def lifespan(app: FastAPI):
    logger = logging.getLogger(__name__)
    logger.info("=== Application startup initiated ===")

    # MODULE_STARTUP_START
    await initialize_database()
    await initialize_mock_data()
    
    # Try seed_projects but don't block startup if it fails
    try:
        await seed_projects()
    except Exception as e:
        logger.error(f"⚠️ Seed projects failed (non-blocking): {str(e)}")
    
    await initialize_admin_user()
    # MODULE_STARTUP_END

    logger.info("=== Application startup completed successfully ===")
    yield

    # MODULE_SHUTDOWN_START
    await close_database()
    # MODULE_SHUTDOWN_END
