# Requirements & Progress

## Requirements Overview
Build PiDAO - A decentralized governance platform for Pi Network Pioneers where they can vote on community projects, fund local initiatives, and participate in building the Pi ecosystem.

## User Stories
- As a Pioneer, I can browse and vote on community proposals
- As a Pioneer, I can submit my own project proposals for community funding
- As a Pioneer, I can contribute Pi to approved projects (crowdfunding)
- As a Pioneer, I can track my votes, contributions, and reputation
- As a Pioneer, I can comment and discuss proposals

## Task Breakdown
- [x] Generate 4 images for the platform
- [x] Create Pi SDK simulation and data store (pi-sdk.ts, store.ts)
- [x] Build Navbar and Footer components
- [x] Build Homepage with hero, stats, featured proposals
- [x] Build Proposals listing page with filters and search
- [x] Build Proposal Detail page with voting and comments
- [x] Build Create Proposal form page
- [x] Build Crowdfunding page for approved projects
- [x] Build Personal Dashboard (votes, proposals, contributions, reputation)
- [x] Update App.tsx routes and run lint/build
- [x] Create AI Proposal Assistant component using client.ai.gentxt
- [x] Integrate AI assistant into CreateProposal page
- [x] Add AuthCallback route for backend auth
- [x] Run lint/build
- [x] Phase 1: Database tables (pi_profiles, projects, votes, contributions, quests, quest_progress, notifications)
- [x] Phase 1: Real Pi SDK v2.0 wrapper (auth, payments U2A, sandbox fallback)
- [x] Phase 1: Backend Pi Auth API (verify token via Pi /v2/me, create/update profile)
- [x] Phase 1: Backend Pi Payments API (approve, complete, A2U, status)
- [x] Phase 1: Backend Governance API (vote with weighted power, finalize with quorum/threshold, reputation calc)
- [x] Phase 1: Backend Quest System API (available quests, check-progress, claim rewards)
- [x] Phase 1: Internationalization i18n (FR/EN/ES/PT/ZH with 100+ translation keys)
- [x] Phase 1: LanguageSelector component with auto-detection
- [x] Phase 1: PiPaymentButton component (real Pi SDK payment flow)
- [x] Phase 1: Quests page with progress tracking and reward claiming
- [x] Phase 1: Updated Navbar with i18n + language selector + quests link
- [x] Rename: PiPolis → Polis (all frontend + backend references, logo file, localStorage keys)
- [x] Add Arabic (AR) language support to Privacy and Terms pages with full RTL support
- [x] Rename: Polis → PolisGo (all frontend pages, components, i18n translations, backend references)
- [x] Connect Proposals page to backend API (list, filter, search, pagination)
- [x] Connect ProposalDetail page to backend (load project, vote via API)
- [x] Connect Funding page to backend (list funded projects, contribute via API)
- [x] Connect Dashboard page to backend (my proposals, votes, contributions)
- [x] Connect CreateProposal page to backend (POST new project)
- [x] Add notifications system in Navbar (badge + dropdown)

- [x] Improve Pi SDK auth flow - connect to backend /api/v1/pi-auth/verify after Pi.authenticate
- [x] Improve payment flow - wire Pi SDK payments to /api/v1/pi-payments/approve and /complete
- [x] Connect Quests page to real backend /api/v1/quests/* APIs
- [x] Add comments/discussion system for proposals (social feature)

## Progress Log
- 2026-05-24: Plan approved, starting PiDAO development
- 2026-06-21: Frontend connected to backend APIs (proposals, voting, funding, dashboard, notifications)
- 2026-06-21: Starting Phase 2 - Auth, Payments, Quests, Social features integration
- 2026-06-21: Phase 2 complete - Pi SDK auth verified with backend, payments wired to approve/complete APIs, quests connected, comments/discussion system added to proposals