# Memory & Project State - Family Finance

> Quick Context: Self-hosted private financial intelligence dashboard for Carlos & family. Dark native (Vercel/Linear style), data-dense, privacy-first.

---

## 1. Project Identity & Purpose
- App Name: Family Finance / Bank App
- Primary User: Carlos (technical, multi-account manager) + 2-4 family members.
- JTBD: Tell me exactly where I stand financially in under 30 seconds, and show me the fastest path out of debt.
- Core Features:
  1. Net Worth calculation (Assets - Liabilities).
  2. Plaid integration for auto-syncing bank accounts & credit cards.
  3. Debt Payoff Simulator (Avalanche vs. Snowball + extra payment sliders).
  4. Credit utilization monitoring.
  5. Category spending & monthly burn tracking.

---

## 2. Technical Stack
- Framework: Next.js 16 + React 19 (Standalone Output Mode)
- Containerization: Multi-stage Docker build
- Deployment Platform: Coolify PaaS (Self-hosted on VPS `13.140.181.29`)
- Database: PostgreSQL (Managed inside Coolify)
- ORM: Prisma
- Styling: Tailwind CSS v4 + Framer Motion + Lucide React
- Integrations: Plaid API, Resend, Stripe
- Charts: Recharts

---

## 3. Design System & Aesthetics
- Aesthetic: Private / Precise / Premium
- Reference UIs: Vercel Dashboard, Linear
- Color Rules: Dark mode native (#09090b / #0a0a0a), high-contrast typography, subtle borders.

---

## 4. Memory Index & File Map
- PRODUCT.md: Vision, user personas, brand voice, design rules.
- CLAUDE.md & AGENTS.md: Routing rules for skills and Next.js guidelines.
- graphify-out/: Knowledge Graph index (graph.html, GRAPH_REPORT.md, graph.json).
- MEMORY.md: Persistent memory and progress tracking.
- Dockerfile & .dockerignore: Production Docker configuration for Coolify.

---

## 5. Current Progress & Roadmap
- [x] Initialized project dependencies and environment setup.
- [x] Defined product vision in PRODUCT.md.
- [x] Built Graphify Knowledge Graph in graphify-out/.
- [x] Created persistent MEMORY.md.
- [x] Design Prisma Database Schema (prisma/schema.prisma).
- [x] Implement Net Worth & Monthly Burn Dashboard (src/app/page.tsx).
- [x] Implement Debt Payoff Simulator (src/app/debt-payoff/page.tsx).
- [x] Connect Plaid Link integration & API routes (src/app/api/plaid/*).
- [x] Implement Accounts & Credit Utilization (src/app/accounts/page.tsx).
- [x] Implement Transaction Feed (src/app/transactions/page.tsx).
- [x] Pushed code to GitHub (https://github.com/guaricool/Bank-app.git).
- [x] Provisioned & Deployed on Coolify (Project, PostgreSQL DB, Application & Env vars).

---

## 6. Coolify Deployment Info
- Project Name: `Bank App (Family Finance)` (UUID: `kdvns7ag87o73htwv5ecpfhm`)
- Database: PostgreSQL `bank-app-db` (UUID: `mk0xxdquhc72l0h8zy0hkc3w`)
- Application: `bank-app-frontend` (UUID: `cruaownacjx753dlh2i3dpev`)
- Assigned Domain: `http://cruaownacjx753dlh2i3dpev.13.140.181.29.sslip.io`
- Environment Variables: `DATABASE_URL` linked to internal PostgreSQL instance.
