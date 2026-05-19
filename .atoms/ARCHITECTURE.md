---
last_updated: 2026-05-19T02:22:20Z
---

# Architecture Design

## System Overview
Pi Network Marketplace - a frontend-only prototype simulating a decentralized marketplace where Pioneers buy/sell goods and services using Pi cryptocurrency. Includes simulated Pi SDK authentication, payment flows, subscription management, and multi-language support.

## Tech Stack
- React 18 + TypeScript
- Vite build tool
- shadcn/ui + Tailwind CSS
- React Router v6
- Tanstack React Query

## Module Design
| Module | Responsibility | Key Files |
|--------|---------------|-----------|
| Pi SDK Simulation | Auth, payments, user management | src/lib/pi-sdk.ts |
| Store | State management, cart, products data | src/lib/store.ts |
| i18n | Multi-language support (EN/FR/ES/ZH/AR) | src/lib/i18n.ts |
| Navigation | App-wide navbar with auth/cart/language | src/components/Navbar.tsx |
| Homepage | Hero, stats, categories, featured products | src/pages/Index.tsx |
| Marketplace | Product grid with search/filter/sort | src/pages/Marketplace.tsx |
| Product Detail | Single product view with payment | src/pages/ProductDetail.tsx |
| Cart | Shopping cart with Pi checkout | src/pages/Cart.tsx |
| Subscriptions | Plans with smart contract info | src/pages/Subscriptions.tsx |
| Profile | User stats, transactions, reputation | src/pages/Profile.tsx |
| Seller | Dashboard with listings management | src/pages/Seller.tsx |

## Tech Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| No real Pi SDK | Simulated SDK layer | Prototype phase, no mainnet access |
| Frontend-only | No backend needed | All data is mock/simulated |
| Simple state | Module-level state with listeners | Lightweight, no Redux needed |
| Multi-language | Custom i18n with 5 languages | Simple, no heavy library needed |

## File Tree Plan
```
src/
├── lib/
│   ├── pi-sdk.ts          # Pi Network SDK simulation
│   ├── store.ts           # State, products, cart, transactions
│   └── i18n.ts            # Internationalization
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── Footer.tsx          # Footer
│   └── ProductCard.tsx     # Reusable product card
├── pages/
│   ├── Index.tsx           # Homepage
│   ├── Marketplace.tsx     # Product listing
│   ├── ProductDetail.tsx   # Single product
│   ├── Cart.tsx            # Shopping cart
│   ├── Subscriptions.tsx   # Plans
│   ├── Profile.tsx         # User profile
│   └── Seller.tsx          # Seller dashboard
└── App.tsx                 # Routes
```

## Implementation Guide
The Pi SDK simulation layer mirrors the real @pinetwork-js/sdk API structure (init, authenticate, createPayment) with simulated delays and mock data. The subscription page references the PiRC2 Soroban smart contract design for recurring payments. All payments simulate the full flow: pending → server approval → completion.

