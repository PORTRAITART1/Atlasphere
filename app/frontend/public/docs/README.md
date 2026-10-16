# Atlasphere — Plateforme de Gouvernance Décentralisée Pi Network

![Atlasphere](https://img.shields.io/badge/Pi%20Network-Governance-purple)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-PiOS-green)

## 🎯 Présentation

**Atlasphere** est une plateforme de gouvernance décentralisée construite sur Pi Network, permettant aux Pionniers de :
- 🗳️ Voter sur les projets communautaires
- 💰 Financer les initiatives locales en Pi (π)
- ⭐ Construire leur réputation et influence
- 📜 Participer à la gouvernance de l'écosystème

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+
- pnpm (recommandé) ou npm
- Compte Pi Developer Portal

### Installation locale

```bash
# Cloner le dépôt
git clone https://github.com/portraitart1/atlasphere.git
cd atlasphere

# Installer les dépendances frontend
cd app/frontend
pnpm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés

# Lancer en mode développement
pnpm run dev
```

### Installation backend

```bash
cd app/backend
pip install -r requirements.txt

# Lancer le serveur
python main.py
```

## 🏗️ Architecture

```
atlasphere/
├── app/
│   ├── frontend/          # React + TypeScript + Vite
│   │   ├── src/
│   │   │   ├── components/  # Composants réutilisables
│   │   │   ├── pages/       # Pages de l'application
│   │   │   ├── lib/         # Utilitaires (Pi SDK, API, i18n)
│   │   │   └── contexts/    # Contextes React (Auth)
│   │   └── public/          # Assets statiques
│   └── backend/           # FastAPI + SQLAlchemy
│       ├── routers/        # Routes API
│       ├── models/         # Modèles de données
│       ├── services/       # Logique métier
│       └── core/           # Configuration, auth, DB
└── docs/                  # Documentation
```

## 🔧 Stack Technique

| Composant | Technologie |
|-----------|------------|
| Frontend | React 18 + TypeScript + Vite |
| UI | shadcn/ui + Tailwind CSS |
| State | TanStack React Query |
| Routing | React Router v6 |
| Backend | FastAPI + SQLAlchemy |
| Database | PostgreSQL |
| Auth | Pi Network SDK v2.0 |
| Payments | Pi SDK (U2A + A2U) |
| Smart Contracts | PiRC2 (Soroban) |
| i18n | Custom (FR/EN/ES/PT/ZH/AR) |

## 📱 Fonctionnalités

- **Gouvernance** : Propositions, votes pondérés, quorum, seuils
- **Crowdfunding** : Financement participatif en Pi avec escrow
- **Réputation** : Score, badges, niveaux, poids de vote
- **Quêtes** : Gamification avec récompenses
- **Smart Contracts** : Escrow PiRC2, gouvernance on-chain
- **Admin** : Modération, gestion VIP, analytics
- **PWA** : Application installable, service worker
- **Multilingue** : 6 langues (FR, EN, ES, PT, ZH, AR)

## 🌐 Liens

- [Pi Developer Portal](https://minepi.com/developers/)
- [Pi SDK Documentation](https://pi-apps.github.io/community-developer-guide/)
- [PiRC2 Smart Contracts](https://github.com/pi-apps)

## 📄 Licence

Ce projet est sous licence [PiOS](https://github.com/pi-apps/pi-os-license).

---

© 2026 Atlasphere — Gouvernance par les Pionniers, pour les Pionniers.