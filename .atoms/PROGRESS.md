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

## Progress Log
- 2026-05-24: Plan approved, starting PiDAO development