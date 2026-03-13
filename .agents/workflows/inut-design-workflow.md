---
description: "Use when working on Inut Design features (cart, checkout, Sanity, analytics, blog), or when you need a safe implementation + verification workflow"
---

# Inut Design Workflow Skill

## When to use

Use this skill for:

- cart/checkout updates
- Sanity schema/query/client changes
- analytics instrumentation changes
- blog content pipeline changes
- medium/large refactors requiring safe incremental validation

## Step-by-step workflow

1. **Discover context quickly**

   - Identify feature area (`pages`, `components`, `store`, `api-client`, `sanity`, `utils`).
   - Read existing nearby code before introducing new patterns.

2. **Map dependencies**

   - Find call sites and consumers before changing shared utilities.
   - Confirm payload contracts between frontend and Sanity.

3. **Plan minimal edits**

   - Prefer low-risk, incremental updates.
   - Keep public interfaces stable unless explicitly changing contract.

4. **Implement safely**

   - Reuse existing helpers (`api-client/*`, `utils/analytics.ts`, `utils/priceCalculator.ts`).
   - Preserve `@/` path alias style and existing naming conventions.

5. **Validate in this order**

   - `pnpm lint`
   - `pnpm build` for routing/runtime-impacting changes
   - Manual checks for touched user flows

6. **Domain-specific checks**

### Cart/Checkout checks

- localStorage key remains `inut-lighters-cart`
- quantity updates recalculate `unitPrice` and `subtotal`
- order payload array items include `_key`
- Sanity order write still succeeds

### Sanity checks

- GROQ query output shape matches consumer expectations
- no hardcoded secrets/project config
- references resolve correctly (`->` usage where needed)

### Analytics checks

- no duplicate events
- events fired at action source for BOTH GA4 and UmamiJS
- conversion-critical events preserved

### Blog checks

- frontmatter includes `slug`, `title`, `tags`, `date`
- markdown remains parseable by current remark/rehype pipeline

## Guardrails

- Do not introduce new state management libraries.
- Do not do broad rewrites when a local fix is sufficient.
- Do not break existing checkout/confirmation flows.
- Keep TypeScript compatible with non-strict setup.

## Suggested output format for coding tasks

1. What changed
2. Why it changed
3. How it was verified
4. Follow-up recommendations (optional)
