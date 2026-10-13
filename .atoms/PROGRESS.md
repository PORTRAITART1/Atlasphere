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

## Progress Log
- 2026-10-13 Alex : mur de témoignages Pioneers livré sur `/feedback` — identité Pi vérifiée côté serveur, badge de paiement calculé depuis le registre, statistiques publiques, formulaire multilingue et accès navigation ; py_compile + lint + build OK.
- 2026-08-30 Alex : paiement Pi U2A réel durci — vérification autoritaire Pi Platform, idempotence par verrou transactionnel, complétion conditionnée à une approbation locale cohérente, contrôle d'identité payeur/compte, registre en lecture seule authentifiée, page `/payment-test` ; py_compile + lint + build OK.
- 2026-08-30 Alex : 10 visuels store régénérés sans texte IA, puis composition du vrai logo Atlasphere (colonne + π + globe + laurier) à côté du mot « Atlasphere » ; script reproductible `scripts/build_store_assets.py` ; sections INTRO 400×400 et PREVIEW 750×1500 affichées dans la page de téléchargement ; lint + build OK.
- 2026-08-29 Alex : 7 langues actives (EN/AR/ZH/RU/FR/PT/ES), ordre d'affichage conforme à la demande.
- 2026-08-29 Alex : store des propositions entièrement basé sur clés i18n + 4 projets inédits ajoutés (10 au total).
- 2026-08-29 Alex : 10 projets insérés en base ; la couche API traduit titres, descriptions, jalons, statuts et catégories.
- 2026-08-29 Alex : menu refondu (mega-menus filtrables, sections mobiles repliables, aria-expanded, fermeture via Échap).