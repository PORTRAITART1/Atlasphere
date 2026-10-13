# -*- coding: utf-8 -*-
# app/backend/core/database.py

import importlib
import logging
import os

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

logger = logging.getLogger(__name__)

# Charger les variables d'environnement
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set.")

# Remplacer les URLs PostgreSQL synchrones par le driver asyncpg
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

Base = declarative_base()


MODEL_MODULES = (
    "app.backend.models.auth",
    "app.backend.models.quest_progress",
    "app.backend.models.quests",
    "app.backend.models.pi_profiles",
    "app.backend.models.votes",
    "app.backend.models.contributions",
    "app.backend.models.notifications",
    "app.backend.models.projects",
    "app.backend.models.comments",
)


class DatabaseManager:
    def __init__(self):
        self.engine = None
        self.async_session_maker = None

    async def init_db(self):
        """Initialize async database engine and session maker."""
        if self.engine and self.async_session_maker:
            return

        sql_echo = os.getenv("SQL_ECHO", "false").lower() == "true"

        self.engine = create_async_engine(
            DATABASE_URL,
            echo=sql_echo,
            pool_pre_ping=True,
        )

        self.async_session_maker = async_sessionmaker(
            self.engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )

    def import_models(self):
        """Import all SQLAlchemy models so Base.metadata is populated."""
        for module_name in MODEL_MODULES:
            importlib.import_module(module_name)

    async def create_tables(self):
        """Create database tables if they do not already exist."""
        if not self.engine:
            await self.init_db()

        self.import_models()

        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        logger.info("Database tables created or already exist")

    async def close_db(self):
        """Close database engine connections."""
        if self.engine:
            await self.engine.dispose()
            self.engine = None
            self.async_session_maker = None


# Exporter une instance unique
db_manager = DatabaseManager()


from typing import AsyncGenerator

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get async database session."""
    if not db_manager.async_session_maker:
        await db_manager.init_db()
    async with db_manager.async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
