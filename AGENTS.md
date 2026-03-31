# Inut Design — AI Agent Playbook

> Editor-agnostic baseline for GitHub Copilot, Trae, Antigravity, and Codex. Treat this as the primary behavior contract if your editor supports `AGENTS.md`.

**Stack:** Next.js 12 · React 18 · TypeScript (`strict: false`) · MUI v5 · Sanity v2 · Zustand · **pnpm** · Node 22+

---

## Mission

Ship safe, minimal, production-friendly changes for Inut Design.

## Core Priorities

1. Protect business-critical flows: cart, checkout, order confirmation, contact.
2. Preserve Sanity data contracts and reference integrity.
3. Keep dual analytics (GA4 + UmamiJS) consistent — add tracking for every new behavior, page, or element. Never duplicate events.
4. Reuse existing project patterns before introducing abstractions.
5. Keep TypeScript compatible with `strict: false`.

## Implementation Rules

- Investigate before editing — read dependents and contracts first.
- Make small, incremental edits. No broad rewrites.
- Use existing helpers: `api-client/*`, `utils/analytics.ts`, `utils/umamiAnalytics.ts`, `utils/priceCalculator.ts`.
- Import alias: `@/`. Never hardcode secrets.

---

## Domain Guardrails

### Cart / Checkout
- localStorage key is `inut-lighters-cart` — do not change.
- Every Sanity array item must include `_key`.
- Canonical order item: `{ _key, product: { _ref, _type }, lighterType: { _ref, _type }, quantity, unitPrice, subtotal }`.

### Analytics
- **Always** add tracking events for new behaviors, pages, and interactive elements.
- Gateway: `utils/analytics.ts` (GA4) and `utils/umamiAnalytics.ts` (UmamiJS).
- Fire at action source (click/submit/view). Never from effects/rerenders.
- Critical events that must never regress: `order_button_click`, `contact_click`, `zalo_click`, `form_submit`, `purchase`, `cta_click`.

### Blog
- Required frontmatter: `slug`, `title`, `tags`, `date`. Filename: `YYYY-MM-DD-slug.md`.
- Do not rename existing files without redirect handling.

### Sanity
- Never hardcode project id, dataset, or tokens.
- Keep GROQ projections explicit and minimal. Maintain `_ref` / `->` integrity.

---

## Verification

```
pnpm lint → pnpm build (if routing/runtime changed) → manual flow check
```

---

## Skills & Workflows

Skills: `.agents/skills/<name>/SKILL.md` · Workflows: `.agents/workflows/<name>.md`

| Name                           | Type     | Use when                                             |
| ------------------------------ | -------- | ---------------------------------------------------- |
| `inut-design-workflow`         | skill    | Any cart, Sanity, analytics, or blog change          |
| `inut-content-writer`          | skill    | Writing Vietnamese SEO product content               |
| `inut-product-page-automation` | skill    | New product page from scratch (no content.md yet)    |
| `product-page-generator`       | skill    | Convert existing `content.md` → route                |
| `agent-browser-automation`     | skill    | Browser verification, screenshots, regression checks |
| `autoresearch`                 | skill    | Autonomous metric-driven optimization loop           |
| `skill-creator`                | skill    | Create or improve skills                             |
| `add-feature`                  | workflow | Safe feature implementation plan                     |
| `fix-bug`                      | workflow | Root-cause-first bug fix                             |
| `checkout-regression-check`    | workflow | Audit cart/checkout risk before merge                |

---

## Governance

All AI files are **authored in `.agents/`** and symlinked to IDEs. Never create files directly in `.github/`, `.trae/`, or `.codex/`.

| IDE            | Reads from                                                            |
| -------------- | --------------------------------------------------------------------- |
| GitHub Copilot | `.github/` → symlink → `.agents/`                                     |
| Trae / Cursor  | `.cursorrules`, `.traerules` → `.agents/instructions/global-rules.md` |
| Antigravity    | `.agents/{agents,prompts,skills,workflows,instructions}/`             |
| Codex          | `.codex/` → symlink → `.agents/`                                      |

