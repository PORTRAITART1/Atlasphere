# -*- coding: utf-8 -*-
# app/backend/seeds/unified_projects.py
# UNIFIED PROJECTS DATA SOURCE — Unique source of truth for all 10 projects
# Merge of former DEMO_PROJECTS, trackedProjects, and seed_projects

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
        "pioneer_name": "MarketPioneer",
        "author": "MarketPioneer",
        "avatar": "🛍️",
        "progress": 36,
        "team": ["Dev1", "Dev2", "Marketing"],
        "region": "Pan-African",
        "deadline": "2025-12-31",
        "milestones": [
            {
                "id": "m1_1",
                "title": "MVP Marketplace",
                "description": "Plateforme MVP avec listing produits",
                "status": "in-progress",
                "due_date": "2025-06-01",
                "budget": 15000,
                "spent": 8000,
                "proof": []
            },
            {
                "id": "m1_2",
                "title": "Intégration Pi Payments",
                "description": "Paiements directs en Pi",
                "status": "pending",
                "due_date": "2025-09-01",
                "budget": 20000,
                "spent": 0,
                "proof": []
            },
            {
                "id": "m1_3",
                "title": "Onboarding 100 vendeurs",
                "description": "Formation et activation des vendeurs",
                "status": "pending",
                "due_date": "2025-12-01",
                "budget": 15000,
                "spent": 0,
                "proof": []
            }
        ],
        "updates": [
            {"date": "2024-12-15", "text": "MVP en phase de test. 50 marchands pré-inscrits!", "author": "MarketPioneer"},
            {"date": "2024-12-01", "text": "Campagne de sensibilisation lancée en Afrique de l'Ouest", "author": "MarketPioneer"}
        ]
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
        "pioneer_name": "EduPioneer",
        "author": "EduPioneer",
        "avatar": "📚",
        "progress": 100,
        "team": ["Instructor1", "Instructor2", "TechLead"],
        "region": "Global",
        "deadline": "2025-06-30",
        "milestones": [
            {
                "id": "m2_1",
                "title": "Plateforme en ligne",
                "description": "Développement du site web éducatif",
                "status": "completed",
                "due_date": "2024-10-01",
                "completed_at": "2024-09-28",
                "budget": 8000,
                "spent": 8000,
                "proof": [{"type": "link", "url": "pilearn.app", "label": "Site en ligne"}]
            },
            {
                "id": "m2_2",
                "title": "10 Modules Blockchain",
                "description": "Création de 10 modules interactifs",
                "status": "completed",
                "due_date": "2024-11-15",
                "completed_at": "2024-11-10",
                "budget": 15000,
                "spent": 14500,
                "proof": [{"type": "document", "url": "#", "label": "Modules listing"}]
            },
            {
                "id": "m2_3",
                "title": "Système de certification",
                "description": "Certificats on-chain pour apprenants",
                "status": "in-progress",
                "due_date": "2025-03-01",
                "budget": 7000,
                "spent": 2500,
                "proof": []
            }
        ],
        "updates": [
            {"date": "2024-12-10", "text": "Franchir la barre de 1000 apprenants inscrits!", "author": "EduPioneer"},
            {"date": "2024-11-20", "text": "Partenariat avec Université de Genève validé", "author": "EduPioneer"}
        ]
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
        "pioneer_name": "GreenPioneer",
        "author": "GreenPioneer",
        "avatar": "🌱",
        "progress": 55,
        "team": ["Environment", "Carbon", "Reporting"],
        "region": "Africa",
        "deadline": "2025-09-30",
        "milestones": [
            {
                "id": "m3_1",
                "title": "Plateforme de contribution",
                "description": "Système de paiement et tracking",
                "status": "completed",
                "due_date": "2024-11-01",
                "completed_at": "2024-10-28",
                "budget": 20000,
                "spent": 19500,
                "proof": [{"type": "link", "url": "pigreen.app", "label": "Platform live"}]
            },
            {
                "id": "m3_2",
                "title": "5000 arbres plantés",
                "description": "Reforestation Kolda, Senegal",
                "status": "in-progress",
                "due_date": "2025-06-01",
                "budget": 30000,
                "spent": 12000,
                "proof": []
            },
            {
                "id": "m3_3",
                "title": "Panneaux solaires pour 10 villages",
                "description": "Installation énergie solaire",
                "status": "pending",
                "due_date": "2025-12-31",
                "budget": 25000,
                "spent": 0,
                "proof": []
            }
        ],
        "updates": [
            {"date": "2024-12-12", "text": "2500 arbres plantés dans Kolda, Senegal", "author": "GreenPioneer"},
            {"date": "2024-11-30", "text": "Accord avec gouvernement Sénégal pour expansion", "author": "GreenPioneer"}
        ]
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
        "pioneer_name": "HealthPioneer",
        "author": "HealthPioneer",
        "avatar": "⚕️",
        "progress": 16,
        "team": ["Doctor1", "Developer", "Support"],
        "region": "Sub-Saharan Africa",
        "deadline": "2026-03-31",
        "milestones": [
            {
                "id": "m4_1",
                "title": "App téléconsultation MVP",
                "description": "Application mobile pour consultations",
                "status": "in-progress",
                "due_date": "2025-04-01",
                "budget": 25000,
                "spent": 5000,
                "proof": []
            },
            {
                "id": "m4_2",
                "title": "Réseau 50 médecins",
                "description": "Onboarding praticiens certifiés",
                "status": "pending",
                "due_date": "2025-07-01",
                "budget": 20000,
                "spent": 0,
                "proof": []
            },
            {
                "id": "m4_3",
                "title": "Couverture 5 pays",
                "description": "Expansion géographique",
                "status": "pending",
                "due_date": "2026-03-01",
                "budget": 15000,
                "spent": 0,
                "proof": []
            }
        ],
        "updates": [
            {"date": "2024-12-05", "text": "Approbation réglementaire reçue pour Senegal et Mali", "author": "HealthPioneer"}
        ]
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
        "pioneer_name": "TreePioneer",
        "author": "TreePioneer",
        "avatar": "🌳",
        "progress": 25,
        "team": ["Forestry", "Community", "Logistics"],
        "region": "Kolda, Senegal",
        "deadline": "2025-12-31",
        "milestones": [
            {
                "id": "m5_1",
                "title": "2500 arbres plantés Phase 1",
                "description": "Plantation initiale et irrigation",
                "status": "completed",
                "due_date": "2024-10-31",
                "completed_at": "2024-10-25",
                "budget": 15000,
                "spent": 14800,
                "proof": [{"type": "photo", "url": "#", "label": "Photos Phase 1"}]
            },
            {
                "id": "m5_2",
                "title": "5000 arbres plantés Phase 2",
                "description": "Expansion zone plantée",
                "status": "in-progress",
                "due_date": "2025-06-30",
                "budget": 20000,
                "spent": 3500,
                "proof": []
            },
            {
                "id": "m5_3",
                "title": "2500 arbres Phase 3 + maintenance",
                "description": "Finalisation et maintenance 2 ans",
                "status": "pending",
                "due_date": "2025-12-31",
                "budget": 15000,
                "spent": 0,
                "proof": []
            }
        ],
        "updates": [
            {"date": "2024-12-08", "text": "2500 arbres atteint! Taux de survie 95%", "author": "TreePioneer"},
            {"date": "2024-11-10", "text": "50 jobs créés pour communauté locale", "author": "TreePioneer"}
        ]
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
        "pioneer_name": "MobileEduPioneer",
        "author": "MobileEduPioneer",
        "avatar": "📱",
        "progress": 83,
        "team": ["AppDev", "Education", "Hardware"],
        "region": "West Africa",
        "deadline": "2025-08-31",
        "milestones": [
            {
                "id": "m6_1",
                "title": "App offline développée",
                "description": "App d'apprentissage sans connexion",
                "status": "completed",
                "due_date": "2024-11-30",
                "completed_at": "2024-11-25",
                "budget": 25000,
                "spent": 24500,
                "proof": [{"type": "link", "url": "#", "label": "App Store link"}]
            },
            {
                "id": "m6_2",
                "title": "100 tablettes achetées",
                "description": "Achat et configuration tablettes",
                "status": "in-progress",
                "due_date": "2025-02-28",
                "budget": 30000,
                "spent": 28000,
                "proof": []
            },
            {
                "id": "m6_3",
                "title": "Formation 50 enseignants",
                "description": "Formation et déploiement écoles",
                "status": "pending",
                "due_date": "2025-06-30",
                "budget": 20000,
                "spent": 0,
                "proof": []
            }
        ],
        "updates": [
            {"date": "2024-12-14", "text": "30 écoles équipées, 500 enfants apprennent déjà", "author": "MobileEduPioneer"}
        ]
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
        "pioneer_name": "SolarHealthPioneer",
        "author": "SolarHealthPioneer",
        "avatar": "🏥",
        "progress": 4,
        "team": ["Doctor", "Engineer", "Nurse"],
        "region": "Mali, Burkina Faso",
        "deadline": "2026-06-30",
        "milestones": [
            {
                "id": "m7_1",
                "title": "Van équipé + panneaux solaires",
                "description": "Modification van et installation solaire",
                "status": "in-progress",
                "due_date": "2025-03-31",
                "budget": 50000,
                "spent": 3000,
                "proof": []
            },
            {
                "id": "m7_2",
                "title": "Équipement médical",
                "description": "Achat équipement de base (tensiomètre, etc)",
                "status": "pending",
                "due_date": "2025-05-31",
                "budget": 30000,
                "spent": 0,
                "proof": []
            },
            {
                "id": "m7_3",
                "title": "5000 consultations gratuites",
                "description": "Déploiement terrain et campagne",
                "status": "pending",
                "due_date": "2026-06-30",
                "budget": 40000,
                "spent": 0,
                "proof": []
            }
        ],
        "updates": [
            {"date": "2024-11-20", "text": "Accord avec ministères santé Mali et Burkina", "author": "SolarHealthPioneer"}
        ]
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
        "pioneer_name": "CraftPioneer",
        "author": "CraftPioneer",
        "avatar": "🎨",
        "progress": 95,
        "team": ["Marketplace", "Design", "Logistics"],
        "region": "Pan-African",
        "deadline": "2025-06-30",
        "milestones": [
            {
                "id": "m8_1",
                "title": "Plateforme e-commerce",
                "description": "Site de vente artisanat",
                "status": "completed",
                "due_date": "2024-10-15",
                "completed_at": "2024-10-10",
                "budget": 10000,
                "spent": 9500,
                "proof": [{"type": "link", "url": "picraft.shop", "label": "Store live"}]
            },
            {
                "id": "m8_2",
                "title": "Onboarding 50 artisans",
                "description": "Formation et activation vendeurs",
                "status": "completed",
                "due_date": "2024-11-30",
                "completed_at": "2024-11-28",
                "budget": 10000,
                "spent": 9800,
                "proof": [{"type": "document", "url": "#", "label": "List artisans"}]
            },
            {
                "id": "m8_3",
                "title": "1000 commandes",
                "description": "Atteindre milestone de ventes",
                "status": "in-progress",
                "due_date": "2025-06-30",
                "budget": 10000,
                "spent": 2500,
                "proof": []
            }
        ],
        "updates": [
            {"date": "2024-12-13", "text": "650 commandes livrées! Revenus artisans: 95K π", "author": "CraftPioneer"},
            {"date": "2024-11-15", "text": "Article BBC sur Pi-Craft et commerce équitable", "author": "CraftPioneer"}
        ]
    },

    # ============================================================================
    # PROJECT 9: Pi Academy – Excellence Éducative (Tracked)
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
        "pioneer_name": "AcademyPioneer",
        "author": "AcademyPioneer",
        "avatar": "🎓",
        "progress": 65,
        "team": ["Dean", "Instructor1", "Instructor2"],
        "region": "Dakar, Senegal",
        "deadline": "2026-12-31",
        "milestones": [
            {
                "id": "m9_1",
                "title": "Campus physique",
                "description": "Ouverture centre de formation",
                "status": "completed",
                "due_date": "2024-09-01",
                "completed_at": "2024-08-28",
                "budget": 15000,
                "spent": 14200,
                "proof": [{"type": "photo", "url": "#", "label": "Campus opening"}]
            },
            {
                "id": "m9_2",
                "title": "Curriculum 12 modules",
                "description": "Programme complet certifiant",
                "status": "completed",
                "due_date": "2024-11-01",
                "completed_at": "2024-10-25",
                "budget": 20000,
                "spent": 18500,
                "proof": [{"type": "document", "url": "#", "label": "Curriculum PDF"}]
            },
            {
                "id": "m9_3",
                "title": "250 étudiants gradués",
                "description": "Certification et placements",
                "status": "in-progress",
                "due_date": "2026-06-30",
                "budget": 15000,
                "spent": 4200,
                "proof": []
            }
        ],
        "updates": [
            {"date": "2024-12-16", "text": "150 étudiants gradués! 85% placement rate", "author": "AcademyPioneer"},
            {"date": "2024-12-01", "text": "Partenariat Microsoft pour curriculum", "author": "AcademyPioneer"}
        ]
    },

    # ============================================================================
    # PROJECT 10: Pi Commerce Hub – Économie Numérique (Tracked)
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
        "pioneer_name": "HubPioneer",
        "author": "HubPioneer",
        "avatar": "🏪",
        "progress": 40,
        "team": ["CEO", "CTO", "CFO"],
        "region": "Pan-African",
        "deadline": "2026-03-31",
        "milestones": [
            {
                "id": "m10_1",
                "title": "MVP Marketplace",
                "description": "Plateforme core avec listing",
                "status": "completed",
                "due_date": "2024-10-15",
                "completed_at": "2024-10-10",
                "budget": 25000,
                "spent": 23000,
                "proof": [{"type": "link", "url": "pihub.app", "label": "MVP live"}]
            },
            {
                "id": "m10_2",
                "title": "Intégration Pi Payments",
                "description": "Paiements natifs en Pi",
                "status": "in-progress",
                "due_date": "2025-08-01",
                "budget": 20000,
                "spent": 8000,
                "proof": []
            },
            {
                "id": "m10_3",
                "title": "App mobile iOS/Android",
                "description": "Applications natives",
                "status": "pending",
                "due_date": "2025-12-31",
                "budget": 20000,
                "spent": 0,
                "proof": []
            },
            {
                "id": "m10_4",
                "title": "Réseau 50 marchands",
                "description": "Onboarding local business",
                "status": "pending",
                "due_date": "2026-03-31",
                "budget": 10000,
                "spent": 0,
                "proof": []
            }
        ],
        "updates": [
            {"date": "2024-12-17", "text": "12 marchands actifs, 500+ transactions", "author": "HubPioneer"},
            {"date": "2024-12-05", "text": "Première transaction réelle en Pi !", "author": "HubPioneer"}
        ]
    }
]
