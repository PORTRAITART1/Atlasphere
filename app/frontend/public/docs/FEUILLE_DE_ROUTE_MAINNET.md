# 🗺️ FEUILLE DE ROUTE COMPLÈTE
## De la Campagne Marketing à l'Acceptation Mainnet Pi Network

---

## 📋 RÉSUMÉ EXÉCUTIF

**Objectif** : Faire accepter Atlasphere sur le Mainnet Pi Network
**Durée estimée** : 16-20 semaines
**KPI principal** : 1000+ testeurs actifs avec métriques d'engagement solides
**Prérequis technique** : Pi SDK v2.0 conforme (✅ déjà implémenté)

---

## 🔑 CRITÈRES D'ACCEPTATION MAINNET (Ce que Pi Network évalue)

1. **Utilité réelle** — L'app résout un vrai problème pour les Pionniers
2. **Adoption** — Nombre significatif d'utilisateurs actifs sur le réseau Pi
3. **Conformité SDK** — Intégration correcte de Pi.init(), authenticate(), payments
4. **Qualité** — App stable, performante, sans bugs critiques
5. **Sécurité** — Pas de failles, tokens validés côté serveur
6. **Monétisation Pi** — Utilisation réelle des paiements Pi (pas juste cosmétique)
7. **Engagement communautaire** — Feedback positif des Pionniers

---

## PHASE 1 : PRÉPARATION MARKETING (Semaine 1-2)

### Étape 1.1 — Finalisation des Assets Marketing
| Action | Détail | Statut |
|--------|--------|--------|
| Pack images (10) | Images marketing professionnelles EN | ✅ Généré |
| Bannières (8) | 4 animées + 4 statiques EN | ✅ Généré |
| Textes Fireside | Message promotionnel FR | ✅ Rédigé |
| Textes Corptime | Message promotionnel FR | ✅ Rédigé |
| Textes Chat Pi | Message court FR | ✅ Rédigé |
| Annonce Pionniers | Message complet FR | ✅ Rédigé |
| Brand Kit | Couleurs, typo, éléments | ✅ Défini |

### Étape 1.2 — Configuration Technique Pre-Marketing
- [ ] **Vérifier le flux complet en sandbox** :
  1. Ouvrir l'app dans Pi Browser sandbox
  2. Tester l'auth auto (Pi.init → Pi.authenticate → /v2/me)
  3. Tester un paiement U2A (approve → complete)
  4. Tester une quête complète (start → progress → claim)
  5. Tester le feedback form
- [ ] **Configurer le tracking** :
  - Compteur de testeurs uniques (via pi_profiles table)
  - Compteur d'actions (votes, paiements, quêtes)
  - Compteur de feedbacks reçus
- [ ] **Préparer le badge "Pioneer Alpha"** :
  - Badge automatique pour les 500 premiers testeurs
  - Non-transférable, permanent, visible sur le profil

### Étape 1.3 — Créer les Canaux de Communication
- [ ] Créer un groupe Telegram "Atlasphere Pioneers"
- [ ] Créer un compte Twitter/X @AtlasphereDAO
- [ ] Préparer un mini-site landing page (optionnel)
- [ ] Configurer un canal Discord (optionnel)

---

## PHASE 2 : BETA PRIVÉE — AMBASSADEURS (Semaine 3-4)

### Étape 2.1 — Recrutement des Ambassadeurs
- [ ] Identifier 50 Pionniers actifs dans la communauté Pi
- [ ] Les contacter individuellement (DM ou Fireside)
- [ ] Leur donner accès prioritaire + badge "Ambassador"
- [ ] Leur demander de tester TOUTES les fonctionnalités

### Étape 2.2 — Collecte de Feedback Initial
- [ ] Créer un Google Form / Typeform dédié (en plus du feedback in-app)
- [ ] Questions clés :
  - "L'app s'est-elle connectée automatiquement ?" (auth)
  - "Avez-vous pu voter sur une proposition ?" (governance)
  - "Le paiement Pi a-t-il fonctionné ?" (payments)
  - "Quelle fonctionnalité préférez-vous ?" (product-market fit)
  - "Qu'est-ce qui manque ?" (roadmap)
  - "Note globale /10" (satisfaction)

### Étape 2.3 — Corrections Rapides
- [ ] Corriger les bugs critiques remontés en < 48h
- [ ] Améliorer l'UX selon les retours les plus fréquents
- [ ] Documenter chaque correction (changelog public)

### Objectifs Phase 2 :
- ✅ 50 ambassadeurs actifs
- ✅ 0 bug critique non résolu
- ✅ Score satisfaction > 7/10

---

## PHASE 3 : BETA PUBLIQUE — CROISSANCE (Semaine 5-8)

### Étape 3.1 — Lancement Marketing Massif

**Jour 1 — Fireside**
- [ ] Poster le message Fireside (voir pack marketing)
- [ ] Joindre 2 images : Hero + Beta Launch CTA
- [ ] Répondre aux commentaires dans les 2 premières heures

**Jour 2 — Corptime/Corpfm**
- [ ] Poster le message Corptime
- [ ] Joindre l'image Feature Grid
- [ ] Taguer des Pionniers influents

**Jour 3 — Chats Communautaires**
- [ ] Poster le message court dans 5+ groupes Pi
- [ ] Demander aux ambassadeurs de relayer

**Jour 5 — Annonce Officielle**
- [ ] Poster l'annonce complète "Appel aux Pionniers"
- [ ] Partager sur tous les canaux simultanément

### Étape 3.2 — Activation Virale
- [ ] Activer le système de parrainage (/referral)
  - Parrain : +100 XP par filleul actif
  - Filleul : +50 XP bonus au premier login
- [ ] Créer un défi "Invite 3 Pionniers" (quête spéciale)
- [ ] Leaderboard des meilleurs parrains (visibilité)

### Étape 3.3 — Événements Communautaires
- [ ] **"Test Day"** (Jour 10) :
  - Objectif : 200 nouveaux testeurs en 24h
  - Récompense : Badge "Test Day" pour tous les participants
  - Annonce 48h avant sur tous les canaux
- [ ] **"Vote Marathon"** (Jour 20) :
  - Objectif : 500 votes en une journée
  - Récompense : +200 XP pour les 50 premiers votants
- [ ] **"Funding Sprint"** (Jour 28) :
  - Objectif : 100 contributions Pi sandbox
  - Récompense : Badge "Early Funder"

### Étape 3.4 — Communication Continue
- [ ] 1 post par semaine minimum sur chaque canal
- [ ] Partager les métriques publiquement (transparence)
- [ ] Mettre en avant les témoignages positifs
- [ ] Répondre à CHAQUE feedback reçu

### Objectifs Phase 3 :
- ✅ 500+ testeurs actifs
- ✅ 2000+ votes cast
- ✅ 200+ paiements sandbox
- ✅ 50+ feedbacks structurés

---

## PHASE 4 : PREUVE D'ADOPTION (Semaine 9-12)

### Étape 4.1 — Accélérer la Croissance
- [ ] Lancer la Saison 1 (/seasons) avec missions exclusives
- [ ] Activer les guildes écologiques (compétition inter-équipes)
- [ ] Organiser un AMA (Ask Me Anything) sur Fireside
- [ ] Créer une vidéo démo 2 min (screen recording + voiceover)

### Étape 4.2 — Documenter les Métriques
Créer un tableau de bord public avec :
- [ ] **Utilisateurs** : Total inscrits, DAU (Daily Active Users), WAU
- [ ] **Engagement** : Votes/jour, propositions créées, quêtes complétées
- [ ] **Paiements** : Nombre de transactions Pi sandbox, volume total
- [ ] **Rétention** : J1, J7, J30 retention rates
- [ ] **Satisfaction** : Score moyen feedback, NPS

### Étape 4.3 — Collecter des Preuves Sociales
- [ ] Screenshots de témoignages positifs (avec permission)
- [ ] Citations de Pionniers satisfaits
- [ ] Statistiques d'engagement (graphiques)
- [ ] Nombre de pays représentés (diversité)

### Étape 4.4 — Optimisations Finales
- [ ] Audit de performance (temps de chargement < 3s)
- [ ] Audit d'accessibilité (WCAG 2.1 AA)
- [ ] Audit sécurité (pas de failles XSS, CSRF, injection)
- [ ] Test sur différents appareils (mobile, tablet, desktop)

### Objectifs Phase 4 :
- ✅ 1000+ testeurs actifs
- ✅ 100+ feedbacks positifs
- ✅ Rétention J7 > 30%
- ✅ 0 bug critique
- ✅ Temps de chargement < 3s

---

## PHASE 5 : PRÉPARATION CANDIDATURE (Semaine 13-14)

### Étape 5.1 — Compiler le Dossier Mainnet

Le dossier doit contenir :

#### A. Description de l'Application
```
Nom : Atlasphere
Catégorie : Governance / Crowdfunding / Climate Tech
Description : Plateforme DAO décentralisée permettant aux Pionniers Pi de 
voter sur des projets communautaires, financer des initiatives locales, 
et contribuer à l'action climatique via EcoChain AI.
```

#### B. Proposition de Valeur Unique
- Gouvernance quadratique (équitable)
- Paiements Pi natifs (U2A + escrow + milestones)
- EcoChain AI (impact climatique mesurable)
- Gamification (quêtes, badges, saisons, guildes)
- Multilingue (6 langues)

#### C. Métriques d'Adoption (à remplir)
| Métrique | Valeur | Objectif |
|----------|--------|----------|
| Testeurs uniques | {X} | 1000+ |
| DAU moyen | {X} | 100+ |
| Votes totaux | {X} | 5000+ |
| Paiements sandbox | {X} | 500+ |
| Feedbacks reçus | {X} | 100+ |
| Score satisfaction | {X}/10 | 7+/10 |
| Pays représentés | {X} | 10+ |
| Rétention J7 | {X}% | 30%+ |

#### D. Conformité Technique Pi SDK
| Critère | Statut | Preuve |
|---------|--------|--------|
| Pi.init() avec await | ✅ | pi-sdk.ts ligne X |
| Pi.authenticate() avec scopes | ✅ | scopes: payments, username, wallet_address |
| Validation serveur GET /v2/me | ✅ | backend pi_auth router |
| Payments U2A (approve/complete) | ✅ | pi_payments router |
| onIncompletePaymentFound | ✅ | pi-sdk.ts |
| PiRC2 subscriptions | ✅ | Subscriptions page |
| sandbox configurable | ✅ | Settings page toggle |
| Pas de clé API côté client | ✅ | Audit sécurité |

#### E. Plan de Monétisation
1. **Abonnements Premium** (EcoChain Pro) — 5-20 Pi/mois
2. **Marketplace données** (EcoMarket) — Commission 5%
3. **Éco-publicités opt-in** — Revenus partagés avec utilisateurs
4. **API Entreprises** — Plans payants en Pi
5. **Crédits carbone** — Commission sur échanges

#### F. Sécurité
- Tokens Pi validés côté serveur uniquement
- Row Level Security sur toutes les tables
- Pas de données sensibles côté client
- HTTPS obligatoire
- Rate limiting sur les API

### Étape 5.2 — Checklist Technique Finale
- [ ] Vérifier que `sandbox: false` fonctionne (switch dans Settings)
- [ ] Tester le flux auth complet en mode production
- [ ] Tester un paiement réel (si possible avec petit montant)
- [ ] Vérifier que onIncompletePaymentFound reprend correctement
- [ ] S'assurer que le backend valide TOUS les tokens via /v2/me
- [ ] Vérifier que les scopes sont corrects (payments, username, wallet_address)
- [ ] Tester sur Pi Browser dernière version

### Étape 5.3 — Audit Sécurité Final
- [ ] Aucune clé API Pi dans le code frontend
- [ ] Variables d'environnement pour toutes les configs sensibles
- [ ] Validation des inputs côté serveur
- [ ] Protection CSRF/XSS
- [ ] Logs d'audit pour les actions critiques

---

## PHASE 6 : SOUMISSION MAINNET (Semaine 15-16)

### Étape 6.1 — Soumettre sur Pi Develop Portal
- [ ] Accéder à https://develop.pi (Pi Developer Portal)
- [ ] Remplir le formulaire de soumission :
  - Nom de l'app
  - Description
  - URL de l'app
  - Screenshots (utiliser les images marketing)
  - Catégorie
  - Lien vers documentation
- [ ] Joindre le dossier de métriques
- [ ] Soumettre la candidature

### Étape 6.2 — Suivi Post-Soumission
- [ ] Vérifier quotidiennement les emails/notifications Pi
- [ ] Répondre en < 24h à toute question de l'équipe Pi
- [ ] Préparer des réponses aux questions fréquentes :
  - "Comment gérez-vous les paiements incomplets ?" → onIncompletePaymentFound
  - "Comment validez-vous l'identité ?" → GET /v2/me côté serveur
  - "Quel est votre modèle économique ?" → Abonnements + marketplace + API
  - "Combien d'utilisateurs actifs ?" → Métriques documentées

### Étape 6.3 — Continuer la Croissance
- [ ] Ne PAS arrêter le marketing pendant la review
- [ ] Continuer à poster sur les canaux communautaires
- [ ] Lancer la Saison 2 pour maintenir l'engagement
- [ ] Atteindre 2000+ testeurs si possible

---

## PHASE 7 : POST-ACCEPTATION (Semaine 17+)

### Si ACCEPTÉ ✅
- [ ] Annonce officielle sur tous les canaux
- [ ] Switch `sandbox: false` en production
- [ ] Activer les paiements Pi réels
- [ ] Lancer la campagne "Mainnet Launch"
- [ ] Nouvelles bannières "Now on Pi Mainnet!"
- [ ] Migrer les données sandbox → production
- [ ] Célébrer avec la communauté 🎉

### Si REFUSÉ ❌ (plan B)
- [ ] Analyser les raisons du refus
- [ ] Corriger les points soulevés
- [ ] Augmenter la base utilisateurs
- [ ] Re-soumettre dans 4-6 semaines
- [ ] Demander un feedback détaillé à l'équipe Pi

---

## 📊 TABLEAU DE SUIVI GLOBAL

| Semaine | Phase | Objectif Principal | KPI Cible |
|---------|-------|-------------------|-----------|
| 1-2 | Préparation | Assets marketing prêts | 100% assets créés |
| 3-4 | Beta Privée | 50 ambassadeurs | 50 testeurs, 0 bug critique |
| 5-6 | Beta Publique | Lancement massif | 300 testeurs |
| 7-8 | Croissance | Événements + viral | 500 testeurs |
| 9-10 | Adoption | Métriques solides | 800 testeurs, 30% rétention |
| 11-12 | Preuve | Documentation | 1000+ testeurs |
| 13-14 | Candidature | Dossier complet | Soumission envoyée |
| 15-16 | Review | Suivi + croissance | Réponses rapides |
| 17+ | Post | Lancement/Correction | Mainnet actif |

---

## 💡 CONSEILS STRATÉGIQUES

### Ce qui AUGMENTE vos chances :
1. **Volume d'utilisateurs** — Plus vous avez de testeurs actifs, mieux c'est
2. **Engagement réel** — Des utilisateurs qui reviennent, pas juste un signup
3. **Paiements fonctionnels** — Prouver que les Pi sont réellement utilisés
4. **Feedback positif** — Témoignages de Pionniers satisfaits
5. **Conformité parfaite** — Zéro erreur SDK, zéro faille sécurité
6. **Utilité claire** — L'app résout un vrai problème
7. **Réactivité** — Répondre vite aux questions de Pi Network

### Ce qui DIMINUE vos chances :
1. ❌ App instable / bugs fréquents
2. ❌ Peu d'utilisateurs (< 100)
3. ❌ Paiements non fonctionnels
4. ❌ Clés API exposées côté client
5. ❌ Pas de validation serveur des tokens
6. ❌ App qui ne fonctionne pas dans Pi Browser
7. ❌ Pas de réponse aux questions de l'équipe Pi

---

## 🔄 ACTIONS IMMÉDIATES (Cette semaine)

1. ✅ Pack marketing généré (images + bannières + textes)
2. [ ] Tester le flux complet dans Pi Browser sandbox
3. [ ] Poster le premier message sur Fireside
4. [ ] Recruter 10 premiers ambassadeurs
5. [ ] Configurer le tracking des métriques
6. [ ] Créer le groupe Telegram Atlasphere

---

*Feuille de route générée le 2026-08-03 — Atlasphere v1.0*
*Durée estimée jusqu'au Mainnet : 16-20 semaines*
*Facteur clé de succès : Volume de testeurs actifs + conformité SDK parfaite*