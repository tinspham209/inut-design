# Whole-Project Audit: Vercel Function and Data Work

**Date**: 2026-11-23

**Repository revision**: `206a986`

**Scope**: Every route under `pages/`, shared server rendering, public Sanity
reads, API Function inventory, and client background request behavior.

## Audit Limits

- The supplied Vercel sample covers at most 12 hours, selected as **All
  Environments**, and is not a complete monthly attribution.
- The current Production deployment is ready, but Hobby runtime logs retain only
  about one hour; historical requester identity and per-operation traces for the
  incident are unavailable.
- A full local production build generated 233 pages and validates that route
  classification, not monthly CPU attribution.

## Confirmed Function and ISR Inventory

| Priority | Route(s) | Confirmed pattern | Risk basis |
|---|---|---|---|
| P0 | `/` | ISR 300s; four independent Sanity reads plus local blog reads | 85 observed invocations / 37s in supplied sample; `85 × 4` exactly matches 340 observed Sanity calls |
| P0 | `/contact` | ISR 300s for one banner | 4 observed invocations / about 35s; exact CPU operation remains unlocalized |
| P1 | `/search` | `getServerSideProps`; on corpus-cache miss it runs five parallel Sanity reads and processes unbounded result sets | Repeats per uncached query/function process; only first 12h table visible |
| P1 | `/creativa`, `/creativa/skin-laptop`, `/creativa/skin-laptop/[slug]` | ISR 60s; two Sanity reads per generation; detail slugs use blocking fallback | Up to 1,440 regeneration opportunities per active path/day; same short-interval pattern as homepage |
| P2 | `/blog` | ISR 300s; one banner read plus local Markdown reads | Up to 288 regeneration opportunities per active day; same short-interval pattern as `/contact` |
| P2 | Product listing pages | ISR 24h; each generation performs item/count, type, and banner reads | Four Sanity operations per route refresh; low frequency but repeated fan-out |
| P2 | Product detail pages | 24h ISR with blocking fallback; laptop/macnut/lighter details perform 3–4 reads; lighter duplicate type resolution is present | First uncached slug and each 24h stale refresh; observed individual CPU was modest |
| P2 | API routes | 22 Function endpoints, including write, upload, search, notifications, validation, and external sync | Invocation volume is unknown; no blanket change is safe without endpoint-specific evidence |
| P2 | `/contact/form` | Static route; no app polling; Next Link prefetch can create background route/data requests | Plausible CDN traffic, not a Function-loop explanation |

## Page Patterns Requiring One Release

### 1. Homepage fan-out

- `pages/index.tsx:158-176`
- Four Sanity operations per regeneration.
- Change: one logical homepage content operation and 600-second revalidation.

### 2. Contact static migration

- `pages/contact/index.tsx:204-211`
- One CMS banner forces ISR for mostly static content.
- Change: download the currently served banner into `public/`, remove
  page-data fetching, and serve the route with zero Function invocations.

### 3. Search corpus work

- `pages/search/index.tsx:346-371`
- `server/search/sources.ts:111-112`, `340-355`, `463-480`
- Five parallel Sanity reads on a cold corpus cache; process-local cache does not
  guarantee shared reuse.
- Change: bounded corpus projections, a measurable corpus build budget, and
  preservation of query freshness/search availability.

### 4. Creativa short ISR

- `pages/creativa/index.tsx:33-54`
- `pages/creativa/skin-laptop/index.tsx:120-139`
- `pages/creativa/skin-laptop/[slug].tsx:591-611`
- `api-client/creativa-catalog.ts:263-272`, `303-329`, `358-366`
- Listing and detail pages perform two reads for each 60-second regeneration.
- Change: align normal revalidation with the 15-minute freshness target unless
  evidence proves stricter timing is required.

### 5. Product listing/detail fan-out

- Listings: `pages/san-pham/skin-laptop/index.tsx:368-418`,
  `pages/san-pham/skin-nut-phim/index.tsx:362-404`,
  `pages/san-pham/lighters/index.tsx:47-88`
- Details: `pages/san-pham/skin-laptop/[slug].tsx:391-419`,
  `pages/san-pham/skin-nut-phim/[slug].tsx:390-416`,
  `pages/san-pham/lighters/[slug].tsx:215-254`
- Change: combine related reads without altering shapes, preserve blocking
  fallback/new-slug availability, and eliminate duplicate type resolution.

### 6. Blog short ISR

- `pages/blog/index.tsx:80-89`
- One banner read plus local Markdown reads every 300 seconds.
- Change: align banner regeneration with CMS freshness policy and preserve local
  post publication behavior.

### 7. Client background request bounds

- Default Next Links in mobile/desktop headers and homepage CTAs target
  `/contact/form`.
- Custom speculation/fallback prefetch is disabled.
- No first-party `setInterval`, automatic route reload, or fixed form polling was
  found.
- Change: disable automatic prefetch for quote-form destinations only and
  preserve click navigation/query strings.

## Routes Confirmed Not Requiring Page-Compute Optimization

- `/contact/form`
- Builder, cart, checkout, policy, about, and static service leaf pages without a
  page-data export
- `/services` and `/services/[...slug]` build-time SSG with `fallback: false`
- `/san-pham` build-time SSG

## API Function Boundary

The repository has 22 API endpoints that remain Function-backed by design. The
optimization release must inventory, classify, and add safe workload limits for
read-heavy endpoints, but must not rewrite commerce/contact/upload/security
contracts without endpoint-specific evidence.

## Root Cause Summary

1. **Confirmed recurring pattern**: short ISR intervals multiply server
   rendering plus repeated CMS reads across multiple public entry routes.
2. **Confirmed multiplier**: homepage and listing/detail routes perform
   multiple independent reads per regeneration.
3. **Confirmed runtime SSR outlier**: `/search` is the only request-time page
   renderer and builds a process-local corpus from five external reads.
4. **Unresolved incident detail**: `/contact` 7–9-second CPU cannot be localized
   by source alone; static conversion removes the path while retained
   instrumentation verifies the result.
5. **Unconfirmed traffic source**: fixed-interval `/contact/form` GETs are not
   produced by repository polling. Prefetch may add requests but cannot explain a
   stable 10-second cadence by itself.
# Historical audit note

This audit predates the authoritative user clarification. Its 15-minute
freshness recommendation is not normative. Current requirements are 10 minutes
for homepage/blog, 24 hours for Creativa/search/product, and an owner-triggered
Production redeploy with 15-minute visibility for urgent Creativa/search
updates; see `../spec.md` and `../analysis-report.md`.
