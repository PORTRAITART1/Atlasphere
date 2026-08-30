# Progress

## Task Breakdown
- [x] Ordre des langues : EN, AR, ZH, RU, FR, PT, ES
- [x] Ajout de la 7e langue (Russe) + dictionnaire complet
- [x] Contenu multilingue des projets (titres/descriptions/jalons) dans les 7 langues
- [x] 4 nouveaux projets Pi Network (PiRemit, PiCredit, PiVault, PiGrid)
- [x] Localisation des projets côté backend (clés i18n traduites dans la couche API)
- [x] Amélioration ergonomique du menu (mega-menus + filtre rapide + sections mobiles repliables + accessibilité clavier)
- [x] Optimisation tokens : jalons factorisés en clés réutilisables `ms.*`
- [x] Lint + build final OK
- [ ] Reste : textes FR en dur des pages avancées secondaires (Settings, EcoNFT, Subscriptions, etc.)

## Audit i18n (textes FR en dur détectés)
34 pages + 8 composants contiennent encore des libellés FR en dur (~408 occurrences).
Priorité haute (pages liées au menu principal) : Settings, Subscriptions, ProjectTracking,
Predictions, EcoSensors, EcoNFT, QuadraticVoting, ClimateDashboard, CarbonCredits, EcoApi.

## Progress Log
- 2026-08-29 Alex : 7 langues actives (EN/AR/ZH/RU/FR/PT/ES), ordre d'affichage conforme à la demande.
- 2026-08-29 Alex : store des propositions entièrement basé sur clés i18n + 4 projets inédits ajoutés (10 au total).
- 2026-08-29 Alex : 10 projets insérés en base ; la couche API traduit titres, descriptions, jalons, statuts et catégories.
- 2026-08-29 Alex : menu refondu (mega-menus filtrables, sections mobiles repliables, aria-expanded, fermeture via Échap).