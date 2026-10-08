# Project conventions

Next.js 12 pages router, React 18, TypeScript `strict: false`, MUI v5,
Framer Motion, Sanity v2, Zustand + selected localStorage persistence.
Use pnpm (version from `package.json`). Node 22+ is the working baseline;
`package.json` engines are authoritative for the supported range (currently
`>=20.0.0 <26.0.0`), not an obsolete prompt's runtime assumption.

Inspect dependencies and consumers before small incremental edits. Reuse
`api-client/*` wrappers rather than direct page fetches; preserve client/cache
strategy, targeted result shapes, SSG `getStaticProps`, and
`Component.Layout = MainLayout`. Preserve loading/empty states, SEO, navigation,
click tracking, `@/` imports, and existing component organization. Avoid broad
formatting churn, strict-only refactors, new state libraries or styling paradigms.

Data flows from Sanity via wrappers to pages; Zustand stores client state;
checkout writes via server API routes then displays confirmation. Protect those
contracts and surface risks early. Report changes, rationale, verification,
remaining manual QA and optional follow-ups concisely.

Use `sanityImageUrl()` / presets from `api-client/sanity-image.ts`. External
image domains must remain compatible with `next.config.js`.

## Environment and secrets

Check `.env.example` and whether root `.env` exists when a task requires config.
For a new required variable, use a placeholder if `.env` is absent and report it;
never overwrite secrets or modify environment files for unrelated tasks.
Sanity keys: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
`SANITY_TOKEN` (server only). Analytics keys: `NEXT_PUBLIC_GA_MEASUREMENT_ID`,
`NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_ENABLE_UMAMI`. Social/chat:
`NEXT_PUBLIC_FACEBOOK_PAGE_ID`, `NEXT_PUBLIC_ENABLE_FB_CHAT`.
Legacy notification config includes `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN`,
`NEXT_PUBLIC_TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_X_API_KEY`; do not perpetuate public
secret exposure in new code. Inspect server integration contracts first and
report existing exposure separately. Never hardcode project IDs/datasets/tokens.

## Verification

Code: lint → build when runtime/routing affected → touched flow QA. Check compile
diagnostics and add focused regressions. Customization: architecture validator;
prose: writer scoped validator. Never claim a parse check proves rendered UI.