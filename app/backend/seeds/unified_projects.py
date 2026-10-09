# -*- coding: utf-8 -*-
# app/backend/seeds/unified_projects.py
# UNIFIED PROJECTS DATA SOURCE — Unique source of truth for all 10 projects
# Merge of former DEMO_PROJECTS, trackedProjects, and seed_projects
# REMOVED INVALID FIELDS: pioneer_name, author, avatar, progress, updates (not in Projects model)

unified_projects = [
    # ============================================================================
    # PROJECT 1: PiMarket – Marketplace Pi Network (Commerce)
    # ============================================================================
    {
        "id": 1,
        "title": "PiMarket – Marketplace Pi Network",
        "description": "Une plateforme décentralisée permettant aux Pionniers d'acheter et vendre des produits et services directement en Pi. Zéro frais bancaires, 100% communautaire.",
        "category": "commerce",
        "budget": 50000.0,
        "raised": 18000.0,
        "status": "voting",
        "voter_count": 342,
        "votes_for": 289,
        "votes_against": 53,
        "user_id": "pi_pioneer_market",
        "team": ["Dev1", "Dev2", "Marketing"],
        "region": "Pan-African",
        "deadline": "2025-12-31",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 2: PiLearn – Éducation Blockchain
    # ============================================================================
    {
        "id": 2,
        "title": "PiLearn – Éducation Blockchain",
        "description": "Plateforme d'apprentissage en ligne dédiée à la blockchain et au Web3. Les apprenants sont récompensés en Pi pour chaque cours complété. Accès mondial, contenu multilingue.",
        "category": "education",
        "budget": 30000.0,
        "raised": 30000.0,
        "status": "funded",
        "voter_count": 518,
        "votes_for": 470,
        "votes_against": 48,
        "user_id": "pi_pioneer_learn",
        "team": ["Instructor1", "Instructor2", "TechLead"],
        "region": "Global",
        "deadline": "2025-06-30",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 3: PiGreen – Financement Écologique
    # ============================================================================
    {
        "id": 3,
        "title": "PiGreen – Financement Écologique",
        "description": "Initiative de financement participatif pour des projets environnementaux : reforestation, énergie solaire, eau potable. Chaque don en Pi plante un arbre réel.",
        "category": "environment",
        "budget": 75000.0,
        "raised": 41200.0,
        "status": "funding",
        "voter_count": 621,
        "votes_for": 590,
        "votes_against": 31,
        "user_id": "pi_pioneer_green",
        "team": ["Environment", "Carbon", "Reporting"],
        "region": "Africa",
        "deadline": "2025-09-30",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 4: PiHealth – Téléconsultation Médicale
    # ============================================================================
    {
        "id": 4,
        "title": "PiHealth – Téléconsultation Médicale",
        "description": "Application de télémédecine accessible aux communautés isolées. Les consultations médicales sont payées en Pi, rendant la santé accessible à tous les Pionniers.",
        "category": "social",
        "budget": 60000.0,
        "raised": 9500.0,
        "status": "voting",
        "voter_count": 198,
        "votes_for": 161,
        "votes_against": 37,
        "user_id": "pi_pioneer_health",
        "team": ["Doctor1", "Developer", "Support"],
        "region": "Sub-Saharan Africa",
        "deadline": "2026-03-31",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 5: Pi-Tree – Reforestation Communautaire
    # ============================================================================
    {
        "id": 5,
        "title": "Pi-Tree – Reforestation Communautaire",
        "description": "Planter 10,000 arbres indigènes dans la région de Kolda pour lutter contre la désertification et créer des emplois locaux. Ce projet financé en Pi permettra d'acheter les plants et de rémunérer les travailleurs.",
        "category": "environment",
        "budget": 50000.0,
        "raised": 12500.0,
        "status": "active",
        "voter_count": 0,
        "votes_for": 0,
        "votes_against": 0,
        "user_id": "pi_pioneer_tree",
        "team": ["Forestry", "Community", "Logistics"],
        "region": "Kolda, Senegal",
        "deadline": "2025-12-31",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 6: Éducation Numérique Mobile
    # ============================================================================
    {
        "id": 6,
        "title": "Éducation Numérique Mobile",
        "description": "Développer une application mobile d'apprentissage hors ligne pour les enfants des zones rurales. Le financement couvrira le développement de l'app et l'achat de 100 tablettes reconditionnées.",
        "category": "education",
        "budget": 75000.0,
        "raised": 62000.0,
        "status": "active",
        "voter_count": 0,
        "votes_for": 0,
        "votes_against": 0,
        "user_id": "pi_pioneer_mobile_edu",
        "team": ["AppDev", "Education", "Hardware"],
        "region": "West Africa",
        "deadline": "2025-08-31",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 7: Santé Solaire Mobile
    # ============================================================================
    {
        "id": 7,
        "title": "Santé Solaire Mobile",
        "description": "Équiper une camionnette de panneaux solaires et de matériel médical de base pour fournir des consultations et des vaccinations gratuites dans les villages isolés.",
        "category": "health",
        "budget": 120000.0,
        "raised": 5000.0,
        "status": "active",
        "voter_count": 0,
        "votes_for": 0,
        "votes_against": 0,
        "user_id": "pi_pioneer_health_mobile",
        "team": ["Doctor", "Engineer", "Nurse"],
        "region": "Mali, Burkina Faso",
        "deadline": "2026-06-30",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 8: Pi-Craft – Artisanat Équitable
    # ============================================================================
    {
        "id": 8,
        "title": "Pi-Craft – Artisanat Équitable",
        "description": "Créer une plateforme e-commerce permettant aux artisans locaux de vendre leurs produits directement au niveau international, avec des paiements intégrés en Pi.",
        "category": "commerce",
        "budget": 30000.0,
        "raised": 28500.0,
        "status": "active",
        "voter_count": 0,
        "votes_for": 0,
        "votes_against": 0,
        "user_id": "pi_pioneer_craft",
        "team": ["Marketplace", "Design", "Logistics"],
        "region": "Pan-African",
        "deadline": "2025-06-30",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 9: Pi Academy – Excellence Éducative
    # ============================================================================
    {
        "id": 9,
        "title": "Pi Academy – Excellence Éducative",
        "description": "Centre d'excellence d'éducation blockchain avec programme de certification avancée. Formation continue pour développeurs et entrepreneurs.",
        "category": "education",
        "budget": 50000.0,
        "raised": 32500.0,
        "status": "active",
        "voter_count": 0,
        "votes_for": 0,
        "votes_against": 0,
        "user_id": "pi_pioneer_academy",
        "team": ["Dean", "Instructor1", "Instructor2"],
        "region": "Dakar, Senegal",
        "deadline": "2026-12-31",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 10: Pi Commerce Hub – Économie Numérique
    # ============================================================================
    {
        "id": 10,
        "title": "Pi Commerce Hub – Économie Numérique",
        "description": "Hub d'économie numérique avec marché intégré, portefeuille Pi et programme de fidélité. Plateforme complète pour achats/ventes entre Pionniers.",
        "category": "commerce",
        "budget": 75000.0,
        "raised": 30000.0,
        "status": "active",
        "voter_count": 0,
        "votes_for": 0,
        "votes_against": 0,
        "user_id": "pi_pioneer_hub",
        "team": ["CEO", "CTO", "CFO"],
        "region": "Pan-African",
        "deadline": "2026-03-31",
        "milestones": "[]"
    }
]
