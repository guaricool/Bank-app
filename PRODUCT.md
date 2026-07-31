# Product

## Register

product

## Users

Carlos first — a technical user who manages multiple real bank accounts via Plaid and opens the app to get a complete financial picture fast: net worth, monthly burn, debt payoff trajectory. Goal is eventually shared with 2-4 family members who may be less technical, so the core data must be legible without explanation.

Primary job to be done: "Tell me exactly where I stand financially in under 30 seconds, and show me the fastest path out of debt."

## Product Purpose

Family Finance is a self-hosted financial intelligence dashboard. It aggregates real bank account data (Plaid), computes net worth (assets minus liabilities), tracks spending by category, monitors credit card utilization, and runs debt payoff simulations (avalanche and snowball strategies with extra-payment sliders). Success means Carlos opens the app and knows what to do with his money — no ambiguity, no cheerful approximations.

## Brand Personality

Private · Precise · Premium

Voice: Confident and quiet. The data speaks. The interface doesn't explain itself or celebrate you for opening it. References: Vercel dashboard, Linear, private banking portals. Not Bloomberg dense, but not a consumer app either — a professional tool owned by one family.

## References

- **Vercel dashboard**: Dark native, data-dense, clean hierarchy. Tool confidence — never decorative.
- **Linear**: Precise typography, controlled information density, keyboard-navigable, calm dark palette.

## Anti-references

- **Mint / generic bank apps**: Institutional green, corporate border radius, no personality. Makes money feel like paperwork.
- **Crypto dashboards**: Aggressive red/green, too many numbers competing for attention, trading anxiety baked into the layout.
- **Generic SaaS dashboards**: White or cream backgrounds, identical card grids, eyebrows on every section, hero-metric template (big number + small label + gradient accent). This is the AI-generated default. Avoid it.
- **Decorative AI-generated UIs**: Glassmorphism as ambient decoration, gradient text, warm-neutral backgrounds labeled "premium." Every visual element must earn its presence — if it doesn't serve comprehension, remove it.

## Design Principles

1. **Data at the front.** Numbers are the UI. Visual elements exist to give context to data, not to decorate the page. If removing an element would hurt comprehension, keep it. If not, remove it.
2. **Confidence through precision.** Exact figures, real date ranges, no rounding that obscures reality. The app should never make the user feel like they're being sold to.
3. **Tool, not toy.** Interactions are efficient. No flourishes that add time-to-task. Motion communicates state, not excitement.
4. **Dark by design.** Dark mode is the primary mode because financial dashboards are used during extended sessions and often at night. The palette reduces eye strain and frames data without noise — not because "tools look cool dark."
5. **Progressive clarity.** The critical metric appears first, context on demand. Complexity lives one interaction below the surface.

## Accessibility & Inclusion

WCAG AA minimum: ≥4.5:1 contrast for body text, ≥3:1 for large text, keyboard navigation throughout, ARIA labels on icon-only buttons and charts. As family members are added, support for slightly larger base font size (consider `1rem = 17px` as the family-mode option).
