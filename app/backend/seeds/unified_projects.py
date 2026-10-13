# -*- coding: utf-8 -*-
# app/backend/seeds/unified_projects.py
# UNIFIED PROJECTS DATA SOURCE â€” Unique source of truth for all 10 projects
# Merge of former DEMO_PROJECTS, trackedProjects, and seed_projects
# REMOVED INVALID FIELDS: pioneer_name, author, avatar, progress, updates (not in Projects model)

unified_projects = [
    # ============================================================================
    # PROJECT 1: PiMarket â€“ Marketplace Pi Network (Commerce)
    # ============================================================================
    {
        "id": 1,
        "title": "PiMarket â€“ Marketplace Pi Network",
        "description": "Une plateforme dÃ©centralisÃ©e permettant aux Pionniers d'acheter et vendre des produits et services directement en Pi. ZÃ©ro frais bancaires, 100% communautaire.",
        "category": "commerce",
        "budget": 50000.0,
        "raised": 18000.0,
        "status": "voting",
        "voter_count": 342,
        "votes_for": 289,
        "votes_against": 53,
        "user_id": "pi_pioneer_market",
        "team": '["Dev1", "Dev2", "Marketing"]',
        "region": "Pan-African",
        "deadline": "2025-12-31",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 2: PiLearn â€“ Ã‰ducation Blockchain
    # ============================================================================
    {
        "id": 2,
        "title": "PiLearn â€“ Ã‰ducation Blockchain",
        "description": "Plateforme d'apprentissage en ligne dÃ©diÃ©e Ã  la blockchain et au Web3. Les apprenants sont rÃ©compensÃ©s en Pi pour chaque cours complÃ©tÃ©. AccÃ¨s mondial, contenu multilingue.",
        "category": "education",
        "budget": 30000.0,
        "raised": 30000.0,
        "status": "funded",
        "voter_count": 518,
        "votes_for": 470,
        "votes_against": 48,
        "user_id": "pi_pioneer_learn",
        "team": '["Instructor1", "Instructor2", "TechLead"]',
        "region": "Global",
        "deadline": "2025-06-30",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 3: PiGreen â€“ Financement Ã‰cologique
    # ============================================================================
    {
        "id": 3,
        "title": "PiGreen â€“ Financement Ã‰cologique",
        "description": "Initiative de financement participatif pour des projets environnementaux : reforestation, Ã©nergie solaire, eau potable. Chaque don en Pi plante un arbre rÃ©el.",
        "category": "environment",
        "budget": 75000.0,
        "raised": 41200.0,
        "status": "funding",
        "voter_count": 621,
        "votes_for": 590,
        "votes_against": 31,
        "user_id": "pi_pioneer_green",
        "team": '["Environment", "Carbon", "Reporting"]',
        "region": "Africa",
        "deadline": "2025-09-30",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 4: PiHealth â€“ TÃ©lÃ©consultation MÃ©dicale
    # ============================================================================
    {
        "id": 4,
        "title": "PiHealth â€“ TÃ©lÃ©consultation MÃ©dicale",
        "description": "Application de tÃ©lÃ©mÃ©decine accessible aux communautÃ©s isolÃ©es. Les consultations mÃ©dicales sont payÃ©es en Pi, rendant la santÃ© accessible Ã  tous les Pionniers.",
        "category": "social",
        "budget": 60000.0,
        "raised": 9500.0,
        "status": "voting",
        "voter_count": 198,
        "votes_for": 161,
        "votes_against": 37,
        "user_id": "pi_pioneer_health",
        "team": '["Doctor1", "Developer", "Support"]',
        "region": "Sub-Saharan Africa",
        "deadline": "2026-03-31",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 5: Pi-Tree â€“ Reforestation Communautaire
    # ============================================================================
    {
        "id": 5,
        "title": "Pi-Tree â€“ Reforestation Communautaire",
        "description": "Planter 10,000 arbres indigÃ¨nes dans la rÃ©gion de Kolda pour lutter contre la dÃ©sertification et crÃ©er des emplois locaux. Ce projet financÃ© en Pi permettra d'acheter les plants et de rÃ©munÃ©rer les travailleurs.",
        "category": "environment",
        "budget": 50000.0,
        "raised": 12500.0,
        "status": "active",
        "voter_count": 0,
        "votes_for": 0,
        "votes_against": 0,
        "user_id": "pi_pioneer_tree",
        "team": '["Forestry", "Community", "Logistics"]',
        "region": "Kolda, Senegal",
        "deadline": "2025-12-31",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 6: Ã‰ducation NumÃ©rique Mobile
    # ============================================================================
    {
        "id": 6,
        "title": "Ã‰ducation NumÃ©rique Mobile",
        "description": "DÃ©velopper une application mobile d'apprentissage hors ligne pour les enfants des zones rurales. Le financement couvrira le dÃ©veloppement de l'app et l'achat de 100 tablettes reconditionnÃ©es.",
        "category": "education",
        "budget": 75000.0,
        "raised": 62000.0,
        "status": "active",
        "voter_count": 0,
        "votes_for": 0,
        "votes_against": 0,
        "user_id": "pi_pioneer_mobile_edu",
        "team": '["AppDev", "Education", "Hardware"]',
        "region": "West Africa",
        "deadline": "2025-08-31",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 7: SantÃ© Solaire Mobile
    # ============================================================================
    {
        "id": 7,
        "title": "SantÃ© Solaire Mobile",
        "description": "Ã‰quiper une camionnette de panneaux solaires et de matÃ©riel mÃ©dical de base pour fournir des consultations et des vaccinations gratuites dans les villages isolÃ©s.",
        "category": "health",
        "budget": 120000.0,
        "raised": 5000.0,
        "status": "active",
        "voter_count": 0,
        "votes_for": 0,
        "votes_against": 0,
        "user_id": "pi_pioneer_health_mobile",
        "team": '["Doctor", "Engineer", "Nurse"]',
        "region": "Mali, Burkina Faso",
        "deadline": "2026-06-30",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 8: Pi-Craft â€“ Artisanat Ã‰quitable
    # ============================================================================
    {
        "id": 8,
        "title": "Pi-Craft â€“ Artisanat Ã‰quitable",
        "description": "CrÃ©er une plateforme e-commerce permettant aux artisans locaux de vendre leurs produits directement au niveau international, avec des paiements intÃ©grÃ©s en Pi.",
        "category": "commerce",
        "budget": 30000.0,
        "raised": 28500.0,
        "status": "active",
        "voter_count": 0,
        "votes_for": 0,
        "votes_against": 0,
        "user_id": "pi_pioneer_craft",
        "team": '["Marketplace", "Design", "Logistics"]',
        "region": "Pan-African",
        "deadline": "2025-06-30",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 9: Pi Academy â€“ Excellence Ã‰ducative
    # ============================================================================
    {
        "id": 9,
        "title": "Pi Academy â€“ Excellence Ã‰ducative",
        "description": "Centre d'excellence d'Ã©ducation blockchain avec programme de certification avancÃ©e. Formation continue pour dÃ©veloppeurs et entrepreneurs.",
        "category": "education",
        "budget": 50000.0,
        "raised": 32500.0,
        "status": "active",
        "voter_count": 0,
        "votes_for": 0,
        "votes_against": 0,
        "user_id": "pi_pioneer_academy",
        "team": '["Dean", "Instructor1", "Instructor2"]',
        "region": "Dakar, Senegal",
        "deadline": "2026-12-31",
        "milestones": "[]"
    },

    # ============================================================================
    # PROJECT 10: Pi Commerce Hub â€“ Ã‰conomie NumÃ©rique
    # ============================================================================
    {
        "id": 10,
        "title": "Pi Commerce Hub â€“ Ã‰conomie NumÃ©rique",
        "description": "Hub d'Ã©conomie numÃ©rique avec marchÃ© intÃ©grÃ©, portefeuille Pi et programme de fidÃ©litÃ©. Plateforme complÃ¨te pour achats/ventes entre Pionniers.",
        "category": "commerce",
        "budget": 75000.0,
        "raised": 30000.0,
        "status": "active",
        "voter_count": 0,
        "votes_for": 0,
        "votes_against": 0,
        "user_id": "pi_pioneer_hub",
        "team": '["CEO", "CTO", "CFO"]',
        "region": "Pan-African",
        "deadline": "2026-03-31",
        "milestones": "[]"
    }
]

