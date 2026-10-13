# 🛠️ Guide Développeur Atlasphere

## Architecture

### Frontend (React + TypeScript)

```
src/
├── components/          # Composants UI réutilisables
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx      # Navigation principale
│   ├── Footer.tsx      # Pied de page
│   ├── GlobalSearch.tsx # Recherche globale
│   ├── PiPaymentButton.tsx # Bouton paiement Pi
│   └── ...
├── pages/              # Pages (lazy-loaded)
│   ├── Index.tsx       # Homepage
│   ├── Proposals.tsx   # Liste des propositions
│   ├── ProposalDetail.tsx # Détail d'une proposition
│   ├── CreateProposal.tsx # Création de projet
│   ├── Funding.tsx     # Crowdfunding
│   ├── Dashboard.tsx   # Tableau de bord personnel
│   ├── Admin.tsx       # Administration
│   ├── Analytics.tsx   # Analytics avancées
│   └── ...
├── lib/                # Utilitaires
│   ├── api.ts         # Client API backend
│   ├── pi-sdk.ts      # Wrapper Pi SDK v2.0
│   ├── i18n.ts        # Internationalisation
│   ├── store.ts       # State management
│   └── config.ts      # Configuration runtime
└── contexts/
    └── AuthContext.tsx  # Contexte d'authentification
```

### Backend (FastAPI + SQLAlchemy)

```
backend/
├── main.py             # Point d'entrée FastAPI
├── core/
│   ├── config.py      # Configuration
│   ├── auth.py        # Authentification Pi
│   └── database.py    # Connexion DB
├── models/             # Modèles SQLAlchemy
│   ├── projects.py
│   ├── votes.py
│   ├── contributions.py
│   └── ...
├── routers/            # Routes API
│   ├── projects.py    # CRUD projets
│   ├── votes.py       # Système de vote
│   ├── governance.py  # Gouvernance (quorum, finalize)
│   ├── pi_auth.py     # Auth Pi SDK
│   ├── pi_payments.py # Paiements Pi
│   └── ...
└── services/           # Logique métier
    ├── projects.py
    ├── votes.py
    └── payment.py
```

## API Endpoints

### Authentification
- `POST /api/v1/pi-auth/verify` — Vérifier token Pi
- `GET /api/v1/user/me` — Profil utilisateur courant

### Projets
- `GET /api/v1/projects` — Liste des projets (pagination, filtres)
- `POST /api/v1/projects` — Créer un projet
- `GET /api/v1/projects/:id` — Détail d'un projet
- `PUT /api/v1/projects/:id` — Modifier un projet

### Votes
- `POST /api/v1/votes` — Voter sur un projet
- `GET /api/v1/votes/all` — Tous les votes

### Contributions
- `POST /api/v1/contributions` — Contribuer à un projet
- `GET /api/v1/contributions` — Mes contributions

### Gouvernance
- `POST /api/v1/governance/finalize/:id` — Finaliser un vote
- `GET /api/v1/governance/stats` — Statistiques globales

### Paiements Pi
- `POST /api/v1/pi-payments/approve` — Approuver un paiement
- `POST /api/v1/pi-payments/complete` — Compléter un paiement

## Contribuer au Code

### Conventions
- TypeScript strict mode
- ESLint + Prettier
- Commits conventionnels (feat:, fix:, docs:)
- Pull requests avec description claire

### Ajouter une nouvelle page

1. Créer `src/pages/MaPage.tsx`
2. Ajouter le lazy import dans `App.tsx`
3. Ajouter la route dans `<Routes>`
4. Ajouter le lien dans la navigation si nécessaire

### Ajouter un endpoint API

1. Créer/modifier le router dans `backend/routers/`
2. Ajouter le modèle dans `backend/models/` si nécessaire
3. Ajouter la logique dans `backend/services/`
4. Documenter dans `/api-docs`

## Variables d'Environnement

```env
# Frontend (.env)
VITE_API_BASE_URL=http://127.0.0.1:8000

# Backend
PI_API_KEY=your_pi_api_key
DEVELOPER_PUBLIC_KEY=GXXX...
DEVELOPER_SECRET_SEED=SXXX...
DATABASE_URL=postgresql://...
NODE_ENV=development
NETWORK=Pi Mainnet
```

## Tests

```bash
# Lint
pnpm run lint

# Build
pnpm run build

# Type check
pnpm run typecheck
```