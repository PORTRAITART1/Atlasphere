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
- [x] Traduction des pages secondaires : Settings, Subscriptions, EcoNFT, Community
- [x] Traduction des pages du menu Communauté du pied de page : ApiDocs, Security, Reputation
- [x] Traduction des pages Badges et Notifications
- [x] Clés `set.*`, `sub.*`, `nft.*`, `com.*`, `bdg.*`, `ntf.*`, `adoc.*`, `sec.*`, `rep.*` présentes dans les 7 langues
- [x] Lint + build revalidés après traduction des pages secondaires

## Paiement Pi Network réel (U2A)
- [x] Flux serveur `/api/v1/pi-pay/approve|complete|cancel|status|config|test-stats|my-payments`
- [x] Vérification autoritaire via `GET /v2/payments/{payment_id}` (montant, direction, but, réseau, txid)
- [x] `PI_API_KEY` conservée exclusivement côté serveur
- [x] Idempotence : verrou consultatif transactionnel + `SELECT ... FOR UPDATE` + garde de statut
- [x] Complétion refusée sans approbation locale cohérente (but, projet, montant)
- [x] Cohérence `txid` SDK vs `transaction.txid` Pi vérifiée
- [x] Identité vérifiée : le `pi_uid` payeur doit appartenir au compte authentifié
- [x] Colonne `user_id` ajoutée au registre `pi_payments` via le schéma backend
- [x] Accès CRUD public à `pi_payments` remplacé par une lecture seule authentifiée
- [x] Faux paiement sandbox supprimé du frontend (Pi Browser obligatoire)
- [x] Page `/payment-test` (0.1 / 0.5 / 1.0 π), progression 5 testeurs, historique
- [x] Traductions paiement en EN, AR, ZH, RU, FR, PT, ES
- [x] `python -m py_compile` backend OK, `pnpm run lint` OK, `pnpm run build` OK
- [ ] Tests réels par 5 Pioneers distincts dans Pi Browser (action côté propriétaire de l'app)

## Correctif « Paiement expiré / développeur n'a pas approuvé » (2026-09-01)
Cause racine (3 défauts cumulés dans la fenêtre d'approbation de ~10 s du wallet Pi) :
- [x] `Pi.init({ sandbox })` était calculé sur le nom de domaine : `atlasphere.pub.atoms.world` ne contenant ni `.pi` ni `mainnet`, le SDK démarrait en **sandbox à l'intérieur de Pi Browser** → le wallet réel n'a jamais reçu d'approbation valide. Corrigé : `sandbox = !isInPiBrowser()`.
- [x] `/approve` exigeait une session plateforme (`get_current_user` → 401) **et** un profil Pi déjà enregistré (→ 403). Un testeur externe était donc systématiquement refusé. Corrigé : le jeton d'accès Pi est accepté comme preuve d'identité (`uid` du token comparé au `user_uid` renvoyé par l'API Pi), avec liaison de profil automatique.
- [x] Les erreurs d'approbation/complétion étaient avalées côté frontend (`console.error` seulement) : le testeur ne voyait aucune cause. Corrigé : remontée du message serveur réel dans l'interface + enregistrement de l'annulation wallet.
- [x] Délai Pi Platform réduit de 20 s à 6 s pour échouer vite au lieu de dépasser la fenêtre du wallet.
- [x] Le jeton Pi est désormais obtenu **avant** l'ouverture du wallet, et transmis à `/approve` et `/complete`.
- [x] Complétion : la propriété du paiement est décidée sur le `pi_uid` renvoyé par Pi, plus sur l'identifiant de compte local.
- [x] `python -m py_compile` OK, `pnpm run lint` OK, `pnpm run build` OK
- [ ] Nouveau test réel dans Pi Browser à refaire par le testeur

## Conformité Pi SDK v2.0 (vérifiée 2026-09-03)
- [x] Script officiel chargé : `https://sdk.minepi.com/pi-sdk.js` dans `index.html`
- [x] `Pi.init({ version: '2.0', sandbox })` appelé une seule fois, Promise attendue avant tout autre appel
- [x] Mode réseau désormais **explicite et déterministe** via `VITE_PI_SANDBOX` (défaut `false` = paiements réels) ; suppression de la déduction par nom de domaine/user-agent qui provoquait un démarrage sandbox involontaire
- [x] `Pi.authenticate(scopes, onIncompletePaymentFound)` avec scopes `payments`, `username`, `wallet_address`
- [x] `onIncompletePaymentFound` implémenté : reprise d'un paiement annulé / à approuver / à compléter
- [x] `Pi.createPayment` avec les 4 callbacks obligatoires : `onReadyForServerApproval`, `onReadyForServerCompletion`, `onCancel`, `onError`
- [x] Vérification du token via `GET /v2/me`, paiements via `GET/POST /v2/payments/{id}[/approve|/complete]`
- [x] Détection Pi Browser fiabilisée : sonde `Pi.nativeFeaturesList()` (autoritaire) avec repli user-agent, au lieu du user-agent seul
- [x] Utilitaires natifs déclarés : `openShareDialog`, `openConversation`, `nativeFeaturesList`, `requestPermission`, `copyText`, `openUrlInSystemBrowser`, `Ads`
- [x] `pnpm run lint` OK, `pnpm run build` OK

## Accès administrateur
- [x] `VITE_ADMIN_USERNAMES=portraitart` configuré dans `app/frontend/.env`
- [x] Routes `/settings` et `/admin` réservées à ce compte Pi
- [x] Lint + build revalidés après configuration admin
- Note : hors Pi Browser, le nom d'utilisateur provient du compte Atoms Cloud, donc l'accès admin doit être testé connecté avec Pi.

## Audit i18n (textes FR en dur détectés)
34 pages + 8 composants contiennent encore des libellés FR en dur (~408 occurrences).
Priorité haute (pages liées au menu principal) : Settings, Subscriptions, ProjectTracking,
Predictions, EcoSensors, EcoNFT, QuadraticVoting, ClimateDashboard, CarbonCredits, EcoApi.

## Témoignages Pioneers
- [done] API sécurisée et table `pi_feedbacks`
- [done] Page multilingue `/feedback` avec note, commentaire, statistiques et mur public
- [done] Accès depuis la navigation et le pied de page
- [done] Validation backend, lint et build ; contrôle visuel automatisé indisponible (capture non générée)

## Correctif démarrage backend (2026-10-13)
- [done] Cause identifiée : `uvicorn main:app` lancé depuis `app/backend` ne pouvait pas résoudre `app.backend.*`
- [done] Démarrage aligné sur `app.backend.main:app` avec `PYTHONPATH` compatible paquet et modèles générés
- [done] Imports des routeurs Pi harmonisés et authentification optionnelle restaurée
- [done] Syntaxe shell, `py_compile`, import FastAPI et routes OpenAPI `/health`, `/api/v1/pi-pay/config`, `/api/v1/pi-feedback/list` validés

## Configuration wallet et pages juridiques (2026-10-13)
- [done] Adresse wallet Atlasphere configurée côté backend : `GA2JQ5C2QXIY3DRWCOYIAHYBEJFXLYURIG3XQD7G4HUZY4EPFPGA443G`
- [done] Anciennes routes SPA `/terms` et `/privacy` supprimées
- [done] Liens juridiques remplacés par `/terms.html` et `/privacy.html`
- [done] `py_compile`, lint et build validés

## Barre multilingue des pages juridiques (2026-10-14)
- [done] Barre supérieure ajoutée aux 20 pages Privacy et Terms
- [done] Accueil et 10 langues affichés avec drapeaux, langue active signalée
- [done] Navigation mobile horizontale, lint et build validés
- [done] Vérification directe de `/privacy.html` et contrôle des 20 fichiers compilés réussis

## Feuille de route marketing mondiale (2026-10-14)
- [done] Roadmap en 5 phases avec micro-tâches, durées et livrables
- [done] Briefs de 17 visuels répartis entre Pionniers, Fireside, professionnels, réseaux sociaux et Chat Pi
- [done] Storyboard anglais de 10 secondes pour formats vertical et horizontal
- [done] 10 publications bilingues et cadre complet de KPIs
- [done] Pseudo officiel uniformisé dans le livrable : `portraitart`

## Progress Log
- 2026-10-17 Alex : correctif paiement Pi Mainnet terminé — flux frontend consolidé sur un seul appel d’approbation et de complétion via `/api/v1/pi-pay/*`, jeton Pi transmis, métadonnées normalisées (`purpose`, `project_id`), reprise des paiements incomplets alignée et financement configuré en `project_funding` ; lint, build et rendu principal validés.
- 2026-10-17 Alex : correctif renforcé Pi Browser — les routes de vote et de discussion acceptent désormais soit le JWT Atlasphere, soit directement le jeton Pi Mainnet vérifié côté serveur ; création/mise à jour automatique du profil Pi et repli frontend sur le jeton Pi si `/pi-auth/exchange` échoue. Test isolé `jeton Pi direct → vote + commentaire` réussi avec nettoyage ; py_compile, lint et build validés.
- 2026-10-17 Alex : authentification Pi Browser finalisée pour votes et commentaires — échange du jeton Pi Mainnet contre un JWT Atlasphere avant chaque action protégée, sujet JWT aligné sur `pi_profiles.user_id`, identité Pi autoritaire côté serveur et SDK configuré en Mainnet ; test isolé complet `Pi token → JWT → vote → commentaire` réussi avec nettoyage, py_compile, lint, build et routes OpenAPI validés, sans modification du flux de paiement.
- 2026-10-17 Alex : 3 jalons structurés ajoutés à chacun des 5 projets avec statuts `completed`, `in_progress`, `upcoming`, synchronisés en base et affichés avec badges multilingues ; vote réparé via API Atoms authentifiée, identité Pi résolue côté serveur, verrou transactionnel, doublon refusé et compteurs mis à jour immédiatement ; py_compile, lint, build, persistance et route OpenAPI validés. Le contrôle visuel automatisé est resté bloqué sur l’accueil après ses deux tentatives.
- 2026-10-17 Alex : budgets des 5 projets ramenés dans la plage demandée de 500 à 15 000 Pi — projets 1 à 5 : 12 000, 4 500, 15 000, 6 000 et 9 500 Pi ; source JSON et base active synchronisées, JSON validé.
- 2026-10-17 Alex : titres et descriptions des 5 projets localisés dynamiquement dans les 10 langues sur l’accueil, la liste et le détail ; discussion repassée en API même origine, lecture publique et interactions authentifiées rétablies, mutations sécurisées par propriété ; py_compile, lint, build et rendu principal validés.
- 2026-10-17 Alex : audit i18n général terminé et livré dans `I18N_AUDIT.md` — 10 langues et 49 routes analysées ; dictionnaires modulaires/russe/contenu reconnectés, statuts et catégories rendus multilingues, défauts par page priorisés ; lint, build et rendu principal validés.
- 2026-10-17 Alex : audit i18n général démarré — inventaire des routes, pages, composants, dictionnaires et contenus backend en cours ; validation séparée à venir.
- 2026-10-17 Alex : table `projects` remplacée atomiquement en base de développement par les 5 projets Atlasphere fournis (IDs 1–5), avec `created_at`/`updated_at` UTC renseignés et catégorie `technology` conservée ; source de redéploiement alignée et chargeur d’horodatage sécurisé. L’endpoint public reste sur l’ancien déploiement jusqu’à publication.
- 2026-10-17 Alex : source historique des 10 projets restaurée dans `mock_data/projects.json` (Pi Academy, PiHealth, GreenPi, PiCommerce SDK, PiMesh, PiKids, PiRemit, PiCredit, PiVault, PiGrid) ; JSON, unicité et syntaxe backend validés, remplacement exact prévu au prochain déploiement.
- 2026-10-17 Alex : affichage des projets fiabilisé dans l’App Viewer — appels API sur l’origine courante avec fallback vers l’endpoint public Atlasphere (5 projets confirmés) ; lint et build validés.
- 2026-10-17 Alex : projets restaurés sur l’accueil avec priorité aux statuts `voting`/`funding` et fallback sur les trois premiers projets ; tous les bandeaux et états de debug retirés, lint et build validés.
- 2026-10-14 Alex : 17 visuels marketing corrigés avec le logo officiel fourni par l’utilisateur, archive vérifiée et prête au téléchargement.
- 2026-10-14 Alex : feuille de route marketing Atlasphere complète livrée avec campagnes, briefs créatifs, storyboard, publications et KPIs.
- 2026-10-14 Alex : lien « 🏠 Accueil » retiré de la barre linguistique des 20 pages juridiques ; lint et build OK.
- 2026-10-14 Alex : barre de navigation juridique harmonisée sur 20 pages avec accueil, dix langues et drapeaux ; rendu statique vérifié, lint et build OK.
- 2026-10-13 Alex : wallet Atlasphere enregistré dans la configuration Pi ; pages juridiques basculées vers les fichiers HTML publics demandés.
- 2026-10-13 Alex : clé publique `validation-key.txt` remplacée par la valeur demandée ; lint et build frontend validés.
- 2026-10-13 Alex : démarrage backend réparé — commande Uvicorn et chemins Python alignés, routeurs Pi de nouveau chargés, validations shell/Python/OpenAPI réussies.
- 2026-10-13 Alex : mur de témoignages Pioneers livré sur `/feedback` — identité Pi vérifiée côté serveur, badge de paiement calculé depuis le registre, statistiques publiques, formulaire multilingue et accès navigation ; py_compile + lint + build OK.
- 2026-08-30 Alex : paiement Pi U2A réel durci — vérification autoritaire Pi Platform, idempotence par verrou transactionnel, complétion conditionnée à une approbation locale cohérente, contrôle d'identité payeur/compte, registre en lecture seule authentifiée, page `/payment-test` ; py_compile + lint + build OK.
- 2026-08-30 Alex : 10 visuels store régénérés sans texte IA, puis composition du vrai logo Atlasphere (colonne + π + globe + laurier) à côté du mot « Atlasphere » ; script reproductible `scripts/build_store_assets.py` ; sections INTRO 400×400 et PREVIEW 750×1500 affichées dans la page de téléchargement ; lint + build OK.
- 2026-08-29 Alex : 7 langues actives (EN/AR/ZH/RU/FR/PT/ES), ordre d'affichage conforme à la demande.
- 2026-08-29 Alex : store des propositions entièrement basé sur clés i18n + 4 projets inédits ajoutés (10 au total).
- 2026-08-29 Alex : 10 projets insérés en base ; la couche API traduit titres, descriptions, jalons, statuts et catégories.
- 2026-08-29 Alex : menu refondu (mega-menus filtrables, sections mobiles repliables, aria-expanded, fermeture via Échap).