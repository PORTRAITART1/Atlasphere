# -*- coding: utf-8 -*-
# app/backend/seed_projects.py
# Seeds database with unified projects data
# This now imports from unified source instead of hardcoding projects

import asyncio
import os
import sys
from datetime import datetime
from sqlalchemy import select, delete

# Add root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.backend.core.database import db_manager
from app.backend.models.projects import Projects
from app.backend.seeds.unified_projects import unified_projects

async def seed_projects():
    """Populate database with unified projects data"""
    print("🌱 Début du peuplement avec projets unifiés...")
    
    # Initialize the database manager
    await db_manager.init_db()
    
    async with db_manager.async_session_maker() as session:
        async with session.begin():
            # Delete existing projects to replace with unified data
            await session.execute(delete(Projects))
            print("🗑️  Anciens projets supprimés. Insertion des projets unifiés...")

            # Create projects from unified source
            for proj_data in unified_projects:
                now = datetime.utcnow()
                project = Projects(
                    **proj_data,
                    created_at=now,
                    updated_at=now
                )
                session.add(project)
                print(f"✅ Projet #{proj_data['id']:2d} : {proj_data['title'][:50]}")

        # Commit all changes
        await session.commit()
        print(f"\n🎉 {len(unified_projects)} projets insérés avec succès !")
        print("✨ Cohérence garantie : même source de vérité pour tous les projets")

if __name__ == "__main__":
    asyncio.run(seed_projects())
