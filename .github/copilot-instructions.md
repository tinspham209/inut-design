# Copilot Instructions for Inut Design

## Project Snapshot (2026)

Inut Design is a production e-commerce/printing website for laptop skins, macbook key skins (macnut), sticker/decal, and print services in Da Nang, Vietnam.

- Website: https://inutdesign.com
- CMS Studio: https://inut-design.sanity.studio/
- Frontend stack: Next.js 12 pages router + React 18 + TypeScript (non-strict)
- UI stack: MUI v5 + Framer Motion
- Data/CMS: Sanity v2 (`@sanity/client` + GROQ)
- State: Zustand + localStorage persistence
- Package manager: pnpm (required)
- Runtime baseline: Node.js 22+

## AI Coding Mission in This Repo

When generating or modifying code in this repository, prioritize:

1. Reuse existing patterns before introducing new abstractions.
2. Keep changes minimal and scoped.
3. Preserve business-critical flows (cart, checkout, Sanity order writes, dual analytics events).
4. Prefer `@/` path aliases for imports.
5. Keep TypeScript compatible with `strict: false` project setup.

## Architecture and Data Flow

1. Content and product/order data come from Sanity via `api-client/*` wrappers.
2. Most pages render with `getStaticProps` (SSG) and page-level layout assignment.
3. Client state lives in Zustand stores (`/store`) with selected persistence.
4. Checkout writes order data into Sanity and redirects to confirmation flows.

Core folders:

- `pages/`: routes and page-level composition
- `components/`: reusable UI units
- `api-client/`: Sanity and API wrappers
- `store/`: Zustand slices and cart state
- `utils/`: shared utilities (pricing, analytics, helpers)
- `sanity/`: CMS studio config and schemas
- `blog/`: markdown blog content with frontmatter

## Required Coding Patterns

### 1) Lighters cart and checkout are critical

- Store reference: `store/cart/lightersCart.ts`
- Pricing reference: `utils/priceCalculator.ts`
- Checkout reference: `pages/checkout/lighters.tsx`
- Sanity write reference: `api-client/sanity-client.ts`

Every Sanity array item in order payloads must include `_key`.

Canonical order item shape:

```ts
{
  _key: `${productId}-${lighterTypeId}-${timestamp}-${index}`,
  product: { _ref: productId, _type: "reference" },
  lighterType: { _ref: lighterTypeId, _type: "reference" },
  quantity: number,
  unitPrice: number,
  subtotal: number,
}
```

### 2) Data fetching and API access

- Prefer existing `api-client/*` modules over ad-hoc Sanity calls in page components.
- Keep GROQ queries targeted; avoid over-fetching.
- For frontend reads, preserve existing client/cache strategy in project conventions.

### 3) Analytics and tracking

- **MANDATORY**: Automatically implement tracking when adding new behaviors, pages, or user paths.
- Use `utils/analytics.ts` and `utils/umamiAnalytics.ts` as the tracking entry points for GA4 and UmamiJS.
- Reuse existing event names where possible.
- Track at user action source (click/submit/view), avoid duplicate firing.

### 4) Blog content pipeline

- Blog posts live in `/blog/*.md` and are processed by unified/remark/rehype.
- Maintain frontmatter conventions: `slug`, `title`, `tags`, `date`.
- Follow `YYYY-MM-DD-slug.md` naming convention.

### 5) Image handling

- Sanity images: use `urlFor()` from `api-client/sanity-client.ts`.
- External image domains must remain compatible with `next.config.js`.

## Environment and Secrets

Environment template exists at `.env.example`.

Common keys used by app features include:

- Sanity: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_TOKEN`
- Analytics: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_ENABLE_UMAMI`
- Social/chat: `NEXT_PUBLIC_FACEBOOK_PAGE_ID`, `NEXT_PUBLIC_ENABLE_FB_CHAT`
- Notifications/integrations: `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN`, `NEXT_PUBLIC_TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_X_API_KEY`

Never hardcode secrets in source files.

## Code Style and Conventions

- TypeScript is intentionally non-strict (`strict: false`); avoid strict-only refactors unless requested.
- Prefer small, low-risk edits over broad rewrites.
- Keep component organization aligned with existing feature folders.
- Avoid introducing new state libraries or new styling paradigms.

## Verification Checklist for AI Changes

After changes, prefer this order:

1. `pnpm lint`
2. `pnpm build` (for changes that can affect routing/runtime)
3. Manual flow checks for touched features (cart/checkout/blog/contact)

For cart or checkout changes, validate:

1. Cart persists in localStorage (`inut-lighters-cart`)
2. Unit/subtotal calculations update correctly when quantity changes
3. Sanity order creation succeeds
4. Confirmation flow displays expected order data

## AI Customization Files in This Repo

Use these files together:

- `AGENTS.md`: editor-agnostic baseline for both Copilot and Antigravity workflows
- `.github/copilot-instructions.md` (this file): repo-wide baseline rules
- `.github/instructions/*.instructions.md`: scoped instructions by file pattern
- `.github/skills/*/SKILL.md`: on-demand multi-step workflows
- `.github/agents/*.agent.md`: specialized agent modes
- `.github/prompts/*.prompt.md`: reusable prompt templates
- `docs/ai/*`: human-facing AI workflow documentation

For cross-editor operation, see:

- `docs/ai/DUAL_EDITOR_WORKFLOW.md`
- `docs/ai/PORTABLE_PROMPTS.md`

Antigravity-native mirrors are kept under `.agents/*`.

Canonical structure:

- `.agents/agents/*.agent.md`
- `.agents/prompts/*.prompt.md`
- `.agents/skills/*/SKILL.md`
- `.agents/workflows/*.md`

## References

- `README.md`
- `docs/ANALYTICS_GUIDE.md`
- `sanity/docs/ARCHITECTURE.md`
