---
name: inut-design-workflow
description: "Use for Inut Design engineering changes: Next.js pages/components/hooks/store/utils, frontend UI, Sanity schemas/GROQ/api-client/models, GA4/GTM + Umami analytics, blog parsing/rendering, feature delivery, root-cause bug fixes, checkout regression audits and shared contracts. Read before changing order payloads, localStorage, pricing or tracking, even for small changes. Vietnamese blog/product prose also uses inut-content-writer."
---

# Safe engineering workflow

## Load relevant references

- All engineering: [project conventions](references/project-conventions.md).
- Sanity schemas, GROQ, clients, models or writes: [Sanity](references/sanity.md).
- New behaviors/pages/interactions or tracking: [analytics](references/analytics.md).
- Cart, pricing, checkout, confirmation or audit: [checkout](references/checkout.md).
- Features/bugs: [input recipes](references/task-recipes.md).
- Blog rendering: [pipeline](references/blog-pipeline.md); prose also uses
  [writer](../inut-content-writer/SKILL.md).

## Execute

1. Inspect existing behavior, nearby patterns, call sites and shared contracts.
2. Plan a small verifiable change, surfacing risks early; preserve user edits.
3. Implement incrementally using wrappers/helpers and compatible public shapes.
4. Validate code with `rtk pnpm lint`, then `rtk pnpm build` when runtime/routing
   changes. Run focused regressions and touched-flow QA using the
   [browser skill](../agent-browser-automation/SKILL.md) for visual proof.
5. Customization/prose-only changes use architecture/metadata/Markdown checks,
   not app lint/build. Do not claim parsing proves browser rendering.
6. Report changes, rationale, evidence, risk and remaining manual checks.

## Invariants

Retain `inut-lighters-cart`, pricing recalculation, unique Sanity array `_key`,
reference integrity, order writes/confirmation and dual action-source tracking.
Use `api-client/*`, `utils/analytics.ts`, `utils/umamiAnalytics.ts`,
`utils/priceCalculator.ts`; preserve `@/`, `strict: false`, SSG/layout conventions.
No broad rewrites, new state libraries, hardcoded secrets or unapproved production
orders for tests. Never commit user changes without authorization.
