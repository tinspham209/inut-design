# Implementation Plan: Optimize Vercel Usage

**Branch**: `003-optimize-vercel-usage` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification and whole-project audit from
`/specs/003-optimize-vercel-usage/`

## Summary

Fix confirmed repository-wide sources of avoidable Vercel Function work rather
than limiting the release to the three routes visible in the 12-hour sample.
The release converts `/contact` to static output, consolidates homepage CMS
reads, makes Creativa and search publication-driven/24-hour-fresh, reduces
product and blog data fan-out, and bounds quote-form prefetch. All 17 page
data-fetch modules and 22 API Function endpoints receive an explicit
inventory/disposition. Protected write, upload, order, contact, notification,
and synchronization contracts are not optimized without endpoint-specific
evidence.

## Technical Context

**Language/Version**: TypeScript 5.0.4, React 18.2, non-strict TypeScript;
Node `>=20.0.0 <26.0.0`; pnpm 10.32.1

**Primary Dependencies**: Next.js 12.3.1, MUI 5, Sanity client 3.4, SWR 2.1.5;
no new runtime dependency planned

**Storage**: Sanity public CMS, repository Markdown, and one migrated contact
banner under `public/`

**Testing**: focused browser regressions, `pnpm lint`, `pnpm build`, route-manifest
inspection, query-count harnesses, image/hash comparison, and Vercel
Production-only evidence

**Target Platform**: Vercel Fluid Functions on Next.js Pages Router;
`inutdesign.com`

**Project Type**: Single web application with public SSG/ISR pages and protected
server API routes

**Performance Goals**: ≤3 normalized CPU hours/month; ≥40% aggregate CPU
reduction on the highest-cost public paths; homepage 4→1 content operation;
search 5→1 corpus operation per 24h refresh; zero `/contact` Function
invocations; product read fan-out ≥25% lower

**Constraints**: 15-minute owner-triggered urgent publication for Creativa/search;
24-hour normal freshness for them and existing product pages; 10-minute
homepage/blog freshness; zero contract change for protected APIs; no production
order/contact side effects in automated tests

**Scale/Scope**: 233 generated pages; 17 page modules with data fetching; 22
server API Function endpoints; 207–210 invocations in the supplied 12-hour
all-environment sample

**Publication Mechanism**: Urgent Creativa/search updates use a Production
redeploy of the approved commit. Acceptance requires the new deployment to show
the update within 15 minutes without relying on browser cache or an old warmed
function instance.

## Constitution Check

- **Evidence-bounded scope**: PASS. `WHOLE_PROJECT_AUDIT.md` and a full production
  build identify confirmed route classes and explicit evidence gaps.
- **Server/data integrity**: PASS. Sanity reads remain behind `api-client/*`;
  no server token moves to the browser; projections/references remain validated.
- **Commerce/contact stability**: PASS. Protected endpoints and form/order
  behavior are regression-only unless endpoint evidence proves a read-only,
  cache-safe optimization.
- **Privacy-safe observability**: PASS. Evidence excludes customer, order,
  contact, upload, and share data; analytics wrappers and event semantics remain.
- **Verifiable delivery**: PASS. Each workstream has build, query-count, browser,
  or Production metric gates.
- **Technology constraints**: PASS. Existing Pages Router, TypeScript, Sanity,
  pnpm, MUI, SSG/ISR patterns, and `@/` imports are preserved.

**Pre-design gate result**: PASS. No constitution violation requires exception.

## Project Structure

### Documentation (this feature)

```text
specs/003-optimize-vercel-usage/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── public-route-contract.md
│   ├── api-workload-contract.md
│   └── evidence-contract.md
├── checklists/
│   └── requirements.md
└── inputs/
    ├── INUT_VERCEL_CPU_HANDOFF.md
    ├── REPOSITORY_AUDIT.md
    └── WHOLE_PROJECT_AUDIT.md
```

### Source Code (repository root)

```text
pages/
├── index.tsx
├── search/index.tsx
├── contact/
│   ├── index.tsx
│   └── form/index.tsx
├── blog/index.tsx
├── creativa/
│   ├── index.tsx
│   └── skin-laptop/
│       ├── index.tsx
│       └── [slug].tsx
└── san-pham/
    ├── lighters/{index.tsx,[slug].tsx}
    ├── skin-laptop/{index.tsx,[slug].tsx}
    └── skin-nut-phim/{index.tsx,[slug].tsx}

api-client/
├── homepage.ts                  # consolidated homepage read
├── products.ts
├── lighters.ts
├── productType.ts
├── creativa-catalog.ts
├── staticContentEachPage.ts
└── sanity-browser.ts

server/search/sources.ts

components/
├── common/header/{routes.ts,header-desktop.tsx,header-mobile.tsx}
└── home/{hero.tsx,chot-don.tsx}

public/branding/contacts/contact-page-banner.jpg
```

**Structure Decision**: Keep one Pages Router application. Introduce focused
shared read boundaries only where one route currently fans out to multiple
independent reads. Keep contracts and evidence in Spec Kit artifacts rather than
adding production diagnostic endpoints.

## Phase 0: Research Decisions

Research is complete in [research.md](./research.md):

1. `/contact` becomes fully static with the current 1200×630 quality-80 banner.
2. Homepage CMS data is one grouped query; local blog data remains separate.
3. Homepage/blog normal revalidation becomes 600 seconds.
4. Creativa normal freshness becomes 86,400 seconds, with owner-triggered deploy
   or publication for urgent updates.
5. Search corpus becomes one grouped content read, cached for up to 24 hours
   with owner-triggered deploy/publication for urgent catalog changes.
6. Product list/detail routes keep 24-hour freshness and blocking new-slug
   support while consolidating related reads.
7. Quote-form automatic prefetch is disabled narrowly.
8. Read-only API optimization requires evidence; protected APIs are
   inventory/guardrail scope only.
9. Shared `_document` rendering is measured before any broad refactor.

Measurement boundaries are fixed before implementation:

- The five highest aggregate-CPU public routes in the Production baseline are
  frozen as the SC-002 comparison set; later traffic changes cannot substitute
  a different route set.
- Latency evidence covers the frozen set plus `/search` for at least 12
  continuous Production hours and 25 normal requests per route, with a
  documented synthetic repeat only when traffic volume is insufficient.
- Render/fetch separation uses temporary local-only timers around the complete
  page-data operation and its external content-source operation for the same
  request. The instrumentation is removed after evidence collection and never
  records values or payloads.
- Protected API evidence is classed separately: read-only; order/checkout;
  contact/quote; upload/design; notification; synchronization/cron; validation.

## Phase 1: Design

### Workstream 1 — `/contact` and banner migration

- Download the live 1200px/quality-80 contact rendition to
  `public/branding/contacts/contact-page-banner.jpg`.
- Replace CMS hero/SEO URLs with the local path.
- Remove page-data fetching so build output classifies `/contact` as static.
- Preserve visual crop, canonical metadata, contact links, analytics, layout,
  and keyboard behavior.

### Workstream 2 — Homepage and blog bounded refresh

- Add a grouped homepage read returning banner, laptop specials, Macnut specials,
  and lighter specials in one operation.
- Preserve existing result ordering, limits, reference/image shapes, and local
  Markdown handling.
- Move homepage and blog ISR from 300 to 600 seconds.
- For blog, keep the post list local and one banner lookup per 10-minute refresh.

### Workstream 3 — Creativa 24-hour publication model

- Move the three Creativa `revalidate: 60` values to 86,400.
- Ensure a failed read remains explicit and does not publish a
  success-shaped fallback.
- Preserve blocking fallback for new product slugs and two current catalog
  read groups.
- Define and verify an owner-triggered rebuild/publication workflow for urgent
  updates as a Production redeploy; verify the new deployment rather than
  requiring a manual browser refresh for all users.

### Workstream 4 — Search corpus

- Replace five independent dynamic-data reads with one grouped read containing
  products, Macnuts, lighters, and both type/facet groups.
- Keep static routes, static pages, product/service pages, and local blogs in the
  existing corpus assembly.
- Bound projections to searchable fields and validate result parity for
  representative common, category, empty, and malformed queries.
- Raise corpus cache policy to 24 hours; set `getServerSideProps` response cache
  policy to match without over-promising per-instance reuse.
- Define owner-triggered publication for urgent searchable catalog changes.
  as a Production redeploy and verify new-deployment cache invalidation.

### Workstream 5 — Product list/detail fan-out

- Consolidate item/count/type/banner data in each listing page into a shared
  grouped read while retaining limits, sorting, drafts exclusion, and 24-hour
  freshness.
- Consolidate laptop and Macnut detail primary/related/static-content reads
  where shapes remain unchanged.
- For lighter detail, use the type details already returned with the primary
  product instead of re-fetching the same type by `_ref`.
- Preserve only-first-10 pre-generation and blocking fallback for other slugs.

### Workstream 6 — Quote-form prefetch

- Add route metadata for non-prefetching `/contact/form`.
- Propagate it to desktop/mobile header Next Links and direct Next Links in
  homepage CTAs.
- Confirm MUI product-template links are ordinary anchors and do not receive an
  invalid Next-only `prefetch` prop.
- Preserve click navigation, `from` query, `noindex`, analytics, and form state.

### Workstream 7 — Function API inventory

- Create an evidence record for all 22 endpoints with method, purpose, caller,
  sensitive fields, caching eligibility, retry behavior, and measured/unknown
  CPU.
- Optimize only public read-only/cache-safe endpoints when a route-level metric
  or repeatable local benchmark demonstrates unnecessary work.
- For order, quote, upload, notification, cron, phone validation, and write
  endpoints, perform contract/regression validation and add workload guardrails
  or metrics only.

### Verification

- `rtk pnpm lint` and `rtk pnpm build`.
- Build classification: `/contact` static; homepage/blog ISR 600s; Creativa ISR
  86400s; product routes remain 86400s; `/search` remains server-backed.
- Query-count tests: homepage 4→1, search 5→1, product listings 4→1, lighter
  detail 4→3 or lower without shape changes.
- Browser: homepage, blog, product details, Creativa, search, contact, and quote
  navigation; desktop/mobile banner comparison.
- Protected regressions: form validation/navigation only, cart/checkout UI,
  builder entry, and class-specific API contract fixtures for read-only,
  order/checkout, contact/quote, upload/design, notification, synchronization/
  cron, and validation endpoints. Do not submit real orders or quote requests by
  default.
- Post-deploy Production-only evidence: all 17 data-fetch page modules and
  22 API endpoints represented, route CPU/invocations, external calls, 5xx, and
  cache behavior.

## Contracts

- [Public route contract](./contracts/public-route-contract.md)
- [API workload contract](./contracts/api-workload-contract.md)
- [Operational evidence contract](./contracts/evidence-contract.md)

## Post-Design Constitution Check

- **Evidence-bounded scope**: PASS; low-frequency/unknown routes are inventory
  and measured reduction, not speculative rewrite.
- **Server/data integrity**: PASS; grouped public reads retain explicit fields
  and references, while secrets stay server-only.
- **Commerce/contact stability**: PASS; protected APIs and workflows retain
  existing contracts and side effects.
- **Privacy-safe observability**: PASS; no customer/payload fields enter evidence.
- **Verifiable delivery**: PASS; all route groups and API endpoints have a gate.
- **Technology constraints**: PASS; no framework/dependency migration.

**Post-design gate result**: PASS. Ready for `/speckit-tasks`.

## Complexity Tracking

No constitution violations require exceptions.
