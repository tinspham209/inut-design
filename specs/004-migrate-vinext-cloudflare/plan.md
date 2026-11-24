# Implementation Plan: Migrate Vinext sang Cloudflare

**Branch**: `004-migrate-vinext-cloudflare` | **Date**: 2026-11-24 | **Spec**: `spec.md`

**Input**: Feature specification from `/specs/004-migrate-vinext-cloudflare/spec.md`

## Summary

Feature này tạo một parallel Cloudflare deployment path bằng **Vinext** trong khi giữ Pages Router, route, SEO, 22 API contracts và các commerce invariants hiện tại. Target runtime là Next.js 15.5.x + React 19.3.1 + Vinext 1.4.6 + Vite 8 trên Node 22. Public content pages chuyển sang full-static build; `/search` dùng build-time public index + browser filtering. Worker giữ API routes và Worker side chỉ validate upload output đã được browser resize/encode — không chạy native `sharp`.

Release sequence bắt buộc là: baseline capture → upgrade & compatibility → local Vinext verification → preview deploy → release gate → hard DNS cutover → stabilization → rollback point Cloudflare. Planning phase không deploy, không upgrade account, không đổi DNS, không move registrar, và không phát sinh Cloudflare/domain charge.

## Technical Context

**Language/Version**: TypeScript 5.x, `strict: false`; JavaScript/ESM cho config/scripts; Node `>=22 <26`  
**Current Application Baseline**: Next.js 12.3.1, React 18.2, Pages Router, MUI 5, Sanity v2  
**Target Framework Runtime**: Next.js 15.5.x, React/ReactDOM 19.3.1, Vinext 1.4.6, Vite 8  
**Primary Dependencies**: MUI 5, Zustand, SWR, React Hook Form, Sanity client/image helpers, GA4/GTM + Umami, `@vinext/cloudflare`/`cf` CLI sau khi implementation phase chạy `vinext init`  
**Storage**: Sanity v2 là system of record; localStorage key `inut-lighters-cart` giữ nguyên; baseline Cloudflare không dùng R2/KV/D1/Durable Objects/Queue  
**Testing**: `pnpm lint`, `pnpm build`, `pnpm build:vinext`, route/headers/curl checks, Node regression scripts, API fixtures/mocks, browser/device regression via `agent-browser`, SEO verifier hiện có  
**Target Platform**: Cloudflare Workers Paid, static assets, preview hostname trước, production custom domain sau release gate  
**Project Type**: Full-stack Next.js Pages Router web application, không phải static-only  
**Performance Goals**: 100% release-gate routes không timeout; 95% representative pages không chậm hơn baseline quá 10%; 100% API parity; rollback Cloudflare version trong 15 phút sau approval  
**Constraints**: Worker isolate 128 MB; bundle size 64 MiB; Paid CPU limit và spending controls; API/public contract parity; 0 production side effect trong test; exact-once analytics; preview non-indexable; immediate hard cutover, no traffic split  
**Scale/Scope**: 74 public page modules, 22 API routes, 11 ISR pages, 1 SSR search route cần static hóa, 35 files dùng `next/image`, 58 static shells, DNS/email/verification records and deferred registrar transfer

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Plan Enforcement |
|---|---|---|
| Evidence-bounded requirements and claims | PASS | Runtime, route counts, five compatibility gaps, package versions và pricing đều có evidence; unknown behavior-changing gap phải được logged, not silently accepted |
| Server-only secrets and validated references | PASS | Secrets inventory là prerequisite; browser bundle/source-map scan; `_ref`, `_type`, `_key`, upload signature/size/dimension validation được giữ trong contracts |
| Protected commerce/contact contracts | PASS | Existing cart key, pricing recalc, API/order/contact/confirmation behaviors are regression-gated; tests dùng fixture/mock và không tạo real order/notification |
| Privacy-safe GA4/GTM + Umami | PASS | Remove only `@vercel/analytics`; preserve wrappers, de-duplicate page/action events, prohibit sensitive payload additions |
| Independent executable increments | PASS | Phase gates tách build, Worker runtime, static search, upload, preview, DNS và deferred registrar |
| Existing stack/dependency constraints | PASS WITH APPROVED MIGRATION | Spec 004 explicitly requires Next 15.5 + React 19 + Vinext; Pages Router, `strict: false`, pnpm, MUI 5 and `@/` imports remain; no unrelated rewrite |
| Accessibility/SEO continuity | PASS | Keyboard/query/empty/error states, responsive rendering, canonical, robots, sitemap, redirects và headers are browser/HTTP gates |

**Pre-Phase-0 gate result**: PASS. No unresolved NEEDS CLARIFICATION remains in the approved spec.

## Phase Plan

### Phase 0 — Baseline & Compatibility Research

1. Capture a production baseline before migration:
   - Public route inventory, statuses, canonical/robots/sitemap, redirects and cache/security headers.
   - 22 API route method/schema/status/error/body-limit/auth/idempotency matrix.
   - Representative page timings, analytics events, browser screenshots and critical journey behavior.
   - Sanity content snapshot/approved public fields for static search generation.
   - Current environment variable inventory with classification `public`, `server`, `scheduler`, `build-only`.
2. Re-run and retain `pnpm dlx vinext check`; fix the two hard issues:
   - `pages/blog/index.tsx`: import type from `next`, not `next/types`.
   - `sanity/scripts/report.mjs`: replace CommonJS global assumption with ESM-safe path resolution.
3. Convert the three partial areas into explicit verification contracts:
   - `next/image`: use `image-optimization=none` baseline, preserve rendered output and no 404/visual regression.
   - custom webpack: move only required alias/external behavior to Vinext/Vite equivalents.
   - React Strict Mode: verify Pages Router root behavior and duplicate side-effect absence.

**Evidence produced**: `research.md`, baseline command outputs/manifest retained outside secrets, compatibility gap records.

### Phase 1 — Runtime Upgrade & Vinext Parallel Path

1. Upgrade framework packages incrementally:
   - Next `15.5.29` is the current 15.5 registry candidate; pin after local compatibility evidence.
   - React, ReactDOM and types to compatible 19.3.1 versions.
   - MUI 5 to latest compatible major version; audit `react-material-ui-carousel`.
   - Audit React Three Fiber/Drei, `@next/third-parties`, bundle analyzer, SWR, React Hook Form and ESLint config.
   - Node engine remains `>=22 <26`; package manager remains `pnpm@10.32.1`.
2. Complete Next 15 codemod-style fixes:
   - migrate legacy `next/image` props and 5 `<Link><a>` patterns;
   - keep Pages Router APIs and `Component.Layout`;
   - replace/retire `next export` and `next lint` assumptions if tooling behavior changes;
   - keep TypeScript `strict: false`.
3. Preserve normal Next path as a parallel path until Cloudflare release:
   - `dev`, `build`, `start` continue.
   - `vinext init --platform=cloudflare --name inutdesign-web --cdn-cache=none --data-cache=none --image-optimization=none` adds `dev:vinext`, `build:vinext`, `start:vinext`, `cloudflare.config.ts`, `vite.config.ts` and Vinext dependencies.
   - Add generated Cloudflare types and build-output ignores; no duplicate `wrangler.jsonc`.
4. Remove Vercel-only runtime:
   - remove `<Analytics />` and `@vercel/analytics`;
   - replace `VERCEL_ENV` with neutral environment label;
   - retain GA4/GTM and Umami wrappers.

**Gate**: existing Next dev/build and Vinext dev/built-worker run must both pass before static conversion continues.

### Phase 2 — Full-Static Public Rendering

1. Convert the 11 ISR routes to deploy-driven static generation:
   - remove `revalidate` from `/`, `/blog` and product/Creativa paths;
   - enumerate every published slug at build time;
   - use `fallback: false` for blog, services, product and Creativa detail pages;
   - approved Sanity publication triggers an explicit rebuild/deploy; no freshness SLA.
2. Replace `/search` SSR:
   - build one public search index from approved searchable fields at build time;
   - preserve query parsing, filters, pagination, result shape, keyboard interaction and loading/error/empty states;
   - browser filtering becomes the `/search` critical path; no runtime `/api/search` call;
   - keep `/api/search` contract for compatibility and independent parity tests.
3. Use static asset configuration:
   - `--cdn-cache=none --data-cache=none`;
   - no Response Store, R2, DO, KV, D1, Queue or Cloudflare Images;
   - optimize/generate only evidence-backed static image variants if Vinext rendering requires it.

**Gate**: all published slugs build; zero ISR/SSR public page; search index contains no prohibited/private field; production search remains browser-complete.

### Phase 3 — Worker API & Upload Hardening

1. Preserve all 22 API method/body/auth/validation/error/status contracts.
2. Group changes by risk:
   - write paths: orders, quote, cost, income, uploads, keychain designs, notifications, Creativa submit/resolve, SPX cron;
   - read paths: catalog/options/product/search/phone/order tracking/claim;
   - enforce `Buffer`/stream body behavior with Worker fixture tests.
3. Replace keychain upload normalization:
   - browser canvas/codec path resizes to bounded dimensions and emits PNG/JPEG/WebP;
   - Worker validates Base64 shape, declared MIME, byte signature, decoded size, dimensions/pixel count and persistence outcome;
   - Worker uploads the accepted browser output to Sanity without native `sharp`;
   - do not weaken filename, 10 MB, format, rate-limit or 4xx/5xx contract.
4. Scheduler and abuse controls:
   - keep external SPX scheduler and canonical authenticated endpoint;
   - retain in-memory LRU only as parity/per-isolate control, not distributed security;
   - log timing, memory/CPU evidence and safe error details without payload secrets.
5. Define a public-origin allow-list for preview and production, never wildcard.

**Gate**: 100% contract matrix passes under the built Worker; zero real order/write/notification/upload side effect.

### Phase 4 — Cloudflare Package, Preview & Release Gate

1. Add a one-command local release flow around:
   - dependency/install check;
   - lint and type/build;
   - normal Next build;
   - Vinext build;
   - safe regression/API matrix;
   - `pnpm dlx @vinext/cloudflare deploy --dry-run`;
   - owner-triggered preview deploy and verification;
   - owner-triggered production deploy.
2. Inventory secrets and variables; inject `NEXT_PUBLIC_*` at build time and server secrets as Worker secrets. Build must fail visibly on required values, but never print secret values.
3. Preview:
   - `X-Robots-Tag: noindex, nofollow` on all preview pages;
   - production canonical and sitemap host remain `https://inutdesign.com`;
   - no preview hostname in built sitemap/robots/canonical.
4. Establish Workers Paid, preview subdomain, zone and spend policy only before a separately approved production cutover. Baseline warning at $2 usage-over-base and hard usage block at $10 usage excluding the $5 subscription.
5. Release evidence must include route/API, analytics, browser, upload, scheduler, SEO, CPU/memory/logs, asset/image parity and cost checks.

**Gate**: every FR/SC release gate passes, unsupported Vinext behavior is resolved or owner-accepted with retained evidence.

### Phase 5 — DNS Cutover & Operations

1. Export and classify every Squarespace/Vercel DNS record with owner, target, TTL, priority, proxy mode and disposition.
2. Create Cloudflare zone and validate apex, `www`, email, SPF, DKIM, DMARC, TXT, verification and subdomain records.
3. After owner approval:
   - lower TTL when appropriate;
   - handle DNSSEC disable/wait if active at Squarespace;
   - activate Cloudflare authoritative DNS;
   - attach custom domain only after zone and Worker health;
   - verify HTTPS, redirects, robots, sitemap, canonical and indexed paths.
4. Immediate hard cutover; monitor critical journeys and indexed URLs. Do not split traffic.
5. Roll back to a verified Cloudflare version through version/traffic routing and DNS recovery runbook; Vercel is not a rollback target.

### Phase 6 — Deferred Registrar Transfer

Registrar remains at Squarespace through preview, DNS cutover and stabilization. No auth-code request, unlock, submission or charge is part of this feature. If owner issues a separate explicit trigger later, a new runbook/approval gate checks the 60-day rule, lock status, DNSSEC, registrant email, eligibility, renewal/payment, stable Cloudflare DNS and Worker health.

## Project Structure

### Documentation (this feature)

```text
specs/004-migrate-vinext-cloudflare/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── deployment-release.md
│   ├── dns-registrar.md
│   └── runtime-api.md
└── tasks.md                 # future /speckit-tasks output
```

### Source Code (implementation phase)

```text
package.json
pnpm-lock.yaml
tsconfig.json
next.config.js
vite.config.ts               # added by Vinext init
cloudflare.config.ts         # added by Vinext init

pages/
├── _app.tsx                 # remove Vercel Analytics, retain GA4/GTM + Umami
├── index.tsx                # ISR removed
├── search/index.tsx         # static shell + build-time index
├── blog/                    # SSG fallback false, no ISR
├── creativa/                # prebuilt slugs, no ISR
├── san-pham/                # prebuilt slugs, no ISR
└── api/                     # 22 Worker-parity routes

api-client/
server/search/               # shared build/search and retained API model
utils/keychain/              # browser/Worker-safe image validation split
components/keychain-builder/  # browser resize/encode path
scripts/
└── migration/               # inventories, safe regression and release checks

public/                      # static assets and optional public search artifact
```

**Structure Decision**: keep the existing single Next.js repository. Cloudflare is a parallel build/deploy adapter, not a second app. Add generated root config and focused migration scripts only; do not create a `wrangler.jsonc` or separate OpenNext project.

## Validation Strategy

1. **Static analysis**: `pnpm lint`, type diagnostics, dependency audit and secret scan.
2. **Build parity**: standard Next build and `build:vinext`; compare route manifest, page count, slugs, headers, redirects and output classes.
3. **Runtime parity**: `start:vinext` local Worker plus curl/fixture/browser tests for all 22 APIs and representative public paths.
4. **Safe business-flow regression**: cart persistence, pricing, design, quote/contact and checkout confirmation use test fixtures/mocks with no production write.
5. **Cloudflare preview**: exact same matrix on preview hostname, with `noindex` and production canonical.
6. **Cutover checks**: DNS, TLS, route/API, canonical/sitemap, email records, logs, CPU/memory, analytics and spend.
7. **Operational drill**: deploy → identify verified rollback point → restore in ≤15 minutes from runbook.

## Key Risks & Controls

| Risk | Control / Gate |
|---|---|
| Next 12 → 15.5 / React 19 breaks MUI or Three.js | Incremental compatibility phase, peer-dependency audit, focused component/browser tests |
| 85% Vinext scan leaves runtime differences | Treat scan as filter, not proof; built-Worker local and preview regression are mandatory |
| Worker 128 MB isolate limit | Browser-offload image transform, no `sharp` runtime, measure upload/write and heavy API routes |
| Vite misses custom webpack behavior | Port only current alias/external behavior and prove affected feature toggles |
| Static pages become stale | Owner-triggered rebuild/deploy is explicit publication model and operational runbook |
| Search index leaks draft/private data | Build allow-list, draft exclusion, index audit and no raw Sanity objects |
| Upload body/Buffer semantics differ | Fixture matrix for type/signature/size/dimension/error and persistence mocks |
| In-memory rate limit is not distributed | Preserve for parity only; document limitation and adopt native rate limiting only with abuse evidence |
| Preview index pollution | Force noindex and compare canonical/sitemap host to production |
| DNS/email record omission | Owner-approved typed inventory, record-by-record verification and propagation checks |
| Accidental registrar transfer or cost | No transfer/account upgrade/cutover tooling executes without explicit owner step |
| Analytics duplicate/sensitive events | Existing wrappers, exact-once browser evidence, prohibited-field payload audit |

## Post-Design Constitution Check

| Gate | Result | Design Evidence |
|---|---|---|
| Evidence-bounded scope | PASS | `research.md` records decisions and rejected alternatives; spec-derived route/API counts and package evidence are explicit |
| Server/data integrity | PASS | `data-model.md` and `runtime-api.md` define secrets, references, upload and idempotency boundaries |
| Commerce stability | PASS | `deployment-release.md` requires cart/order/pricing/contact/upload/confirmation parity with safe mocks |
| Privacy-safe observability | PASS | Analytics parity, de-duplication and sensitive-field prohibition are release-gate evidence |
| Verifiable delivery | PASS | `quickstart.md` gives runnable phase gates and expected outcomes; no success-shaped fallback |
| Stack and dependency migration | PASS | Spec-approved upgrade is isolated, Vercel rollback is excluded, and no secondary framework is introduced |
| Accessibility + SEO | PASS | Browser/keyboard/responsive and canonical/robots/sitemap/preview indexing are explicit acceptance checks |

## Complexity Tracking

No constitution violation. The framework/runtime migration and domain runbook complexity are directly required by feature 004, not speculative expansion.
