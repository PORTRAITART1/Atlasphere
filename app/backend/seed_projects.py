# -*- coding: utf-8 -*-
# app/backend/seed_projects.py
import asyncio
import os
import sys
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Ajouter le chemin du backend pour importer les modules core
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.backend.core.database import AsyncSessionLocal
from app.backend.models.projects import Projects

# Définition des projets exemple
sample_projects = [
    {
        "title": "Reforestation Communautaire 'Pi-Tree'",
        "description": "Planter 10 000 arbres indigènes dans la région de Kolda pour lutter contre la désertification et créer des emplois locaux. Ce projet financé en Pi permettra d'acheter les plants et de rémunérer les travailleurs via le SDK Pi.",
        "budget": 50000.0,
        "raised": 12500.0,
        "status": "active",
        "category": "Environnement",
        "creator_id": "pi_pioneer_1", # ID fictif pour le créateur
    },
    {
        "title": "Plateforme d'Éducation Numérique Mobile",
        "description": "Développer une application mobile d'apprentissage hors ligne pour les enfants des zones rurales. Le financement couvrira le développement de l'app et l'achat de 100 tablettes reconditionnées.",
        "budget": 75000.0,
        "raised": 62000.0,
        "status": "active",
        "category": "Éducation",
        "creator_id": "pi_pioneer_2",
    },
    {
        "title": "Unité Mobile de Soins de Santé Solaire",
        "description": "Équiper une camionnette de panneaux solaires et de matériel médical de base pour fournir des consultations et des vaccinations gratuites dans les villages isolés.",
        "budget": 120000.0,
        "raised": 5000.0,
        "status": "active",
        "category": "Santé",
        "creator_id": "pi_pioneer_3",
    },
    {
        "title": "Coopérative d'Artisanat Équitable 'Pi-Craft'",
        "description": "Créer une plateforme e-commerce permettant aux artisans locaux de vendre leurs produits directement au niveau international, avec des paiements intégrés en Pi. Le budget servira à la formation, au packaging et au marketing.",
        "budget": 30000.0,
        "raised": 28500.0,
        "status": "active",
        "category": "Économie",
        "creator_id": "pi_pioneer_4",
    }
]

async def seed_projects():
    print("Début du peuplement de la base de données avec des projets...")
    
    async with AsyncSessionLocal() as session:
        async with session.begin():
            # Vérifier si des projets existent déjà pour éviter les doublons
            result = await session.execute(select(Projects).limit(1))
            existing_project = result.scalar_one_or_none()
            
            if existing_project:
                print("⚠️ La table des projets n'est pas vide. Peuplement annulé pour éviter les doublons.")
                return

            # Créer les objets de projet
            for proj_data in sample_projects:
                # Ajouter des dates de création/mise à jour
                now = datetime.utcnow()
                project = Projects(
                    **proj_data,
                    created_at=now,
                    updated_at=now
                )
                session.add(project)
                print(f"➕ Projet ajouté : {proj_data['title']}")

        # Valider les modifications
        await session.commit()
        print("✅ Base de données peuplée avec succès !")

if __name__ == "__main__":
    asyncio.run(seed_projects())
