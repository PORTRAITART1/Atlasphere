# Project Context

## Project Overview
PiDAO - A decentralized governance and crowdfunding platform for Pi Network Pioneers. Pioneers can submit project proposals, vote on community initiatives, fund approved projects with Pi, and build their reputation through active participation.

## Key Decisions
| Date | Decision | By | Rationale |
|------|----------|-----|-----------|
| 2026-05-24 | Rebuild as PiDAO governance platform | Alex | User chose option F |
| 2026-05-24 | Purple/Gold/Indigo color scheme | Alex | Pi Network branding + governance authority feel |
| 2026-10-15 | Pi Testnet payment integration | Gordon | Frontend SDK and backend Pi payment routes target Testnet for controlled validation; Mainnet is not enabled. |
| 2026-05-24 | Reputation-weighted voting system | Alex | Fairer than token-weighted voting |

## Constraints
- Color Palette: Deep Indigo (#312E81, #4338CA), Purple (#7C3AED, #6D28D9), Gold (#F59E0B, #D97706), Emerald (#059669), Dark (#0F172A, #1E293B), White
- Typography: System fonts, bold headings, clean readable body text
- Layout: Modern card-based, responsive grid, glassmorphism effects
- Pi payments target Pi Testnet/Sandbox during validation; Mainnet is not enabled.
- Pi prices and votes use the application data model; payment validation is performed through the Pi Testnet integration.
- Authentication uses Pi Network SDK in Sandbox/Testnet mode.
- Test transactions must use Testnet Pi only; never use Mainnet funds during validation.
- Categories: Education, Commerce, Technology, Social, Environment
- Proposal states: Draft, Voting, Approved, Funding, Funded, Completed, Rejected