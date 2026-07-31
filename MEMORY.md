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
- Framework: Next.js 16 + React 19
- Styling: Tailwind CSS + Framer Motion + Lucide React
- Database / ORM: Prisma + PostgreSQL / Neon adapter
- Auth: NextAuth.js + bcryptjs
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
