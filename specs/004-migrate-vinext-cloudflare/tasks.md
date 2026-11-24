# Tasks: Migrate Vinext sang Cloudflare

**Input**: Design documents from `/specs/004-migrate-vinext-cloudflare/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Executable verification, fixture, browser, manifest, and preview-gate tasks are required because the feature specification defines measurable release criteria. Safe test modes must never create real orders, notifications, uploads, or production Sanity writes.

**Constitution Gates**: Security, privacy, commerce, persistence, analytics, SEO, accessibility, performance, Worker limits, and DNS contracts are release blockers. Browser/device claims require retained browser evidence; static parsing alone is insufficient.

## Phase 1: Setup and Baseline Capture

**Purpose**: Capture immutable evidence and create migration-only tooling before any runtime or contract change.

- [X] T001 Create `scripts/migration/README.md` with the evidence locations, safe-fixture rule, owner-gate rule, and no-secret-output policy
- [X] T002 [P] Create `scripts/migration/capture-baseline.mjs` to record source commit, tool versions, lockfile hash, route inventory, redirects, sitemap, robots, and HTTP expectations under `artifacts/migration/baseline/`
- [X] T003 [P] Create `scripts/migration/verify-route-manifest.mjs` to diff the 74 public page modules and their canonical/status/redirect/header expectations against `artifacts/migration/baseline/routes.json`
- [X] T004 [P] Create `scripts/migration/verify-api-manifest.mjs` to require exactly 22 API records with method, auth, body limit, side effect, idempotency, and semantic response expectations in `artifacts/migration/baseline/apis.json`
- [X] T005 [P] Create `scripts/migration/inventory-dependencies.mjs` to record direct versions, peers, consumers, license, runtime scope, and migration action in `artifacts/migration/baseline/dependencies.json`
- [X] T006 [P] Create `scripts/migration/inventory-env.mjs` to record environment names, scope, callers, visibility, and required stage without values in `artifacts/migration/baseline/env-names.json`
- [X] T007 [P] Create `scripts/migration/inventory-call-sites.mjs` for the Image, Link, carousel, React Three, `Buffer`, Node crypto, filesystem, path, raw-body, and public-secret call sites in `artifacts/migration/baseline/call-sites.json`
- [X] T008 [P] Create `scripts/migration/slug-manifest.mjs` to reconcile blog, service, lighters, laptop, macnut, and Creativa source slugs into `artifacts/migration/baseline/slugs.json`
- [X] T009 [P] Create `scripts/migration/api-fixtures/` with safe fixtures for every route in `pages/api/` and explicit mock/no-op downstream modes
- [X] T010 [P] Add raw-body fixtures under `scripts/migration/api-fixtures/creativa/` for 0, 1, 64 KiB−1, 64 KiB, 64 KiB+1, malformed JSON, malformed UTF-8, chunked transfer, and mismatched length cases
- [X] T011 [P] Add upload fixtures under `scripts/migration/api-fixtures/uploads/` for valid PNG/JPEG/WebP, wrong MIME/signature, malformed Base64, trailing bytes, polyglot, decompression-bomb metadata, and over-limit dimensions or bytes
- [X] T012 [P] Create `scripts/migration/browser-baseline.mjs` to capture representative desktop/mobile screenshots, console errors, network requests, keyboard interactions, and analytics event sequences in `artifacts/migration/baseline/browser/`
- [X] T013 Capture the approved baseline route, API, timing, analytics, screenshot, SEO, env-name, slug, and dependency evidence by running the scripts in `scripts/migration/`
- [X] T014 Save the `pnpm dlx vinext check` output and current two hard issues plus three partial areas in `artifacts/migration/baseline/vinext-check.txt`

**Checkpoint**: Baseline manifests, fixture boundaries, and no-production-side-effect rules exist before implementation begins.

## Phase 2: Foundational Migration Infrastructure

**Purpose**: Build the shared verification and safe-test infrastructure that blocks every user story.

**CRITICAL**: No user story is releasable until this phase is complete.

- [X] T015 Add `pnpm` scripts for migration inventory, route/API verification, secret scan, Worker graph check, and safe regression in `package.json`
- [X] T016 [P] Create `scripts/migration/run-safe-regression.mjs` to route order, quote, contact, upload, notification, design, and SPX flows through explicit mock/test adapters without production side effects
- [X] T017 [P] Create `scripts/migration/compare-runtime-contracts.mjs` to compare semantic status, headers, and bodies between `start` and `start:vinext` using `artifacts/migration/baseline/apis.json`
- [X] T018 [P] Create `scripts/migration/check-manifests.mjs` to reject missing, duplicate, unsorted, or unexplained route, slug, API, sitemap, redirect, and search-index deltas
- [X] T019 [P] Create `scripts/migration/check-secrets.mjs` to fail on secret-like values, exposed legacy credential names, and server-only environment names in browser chunks, source maps, public artifacts, and logs
- [X] T020 [P] Create `scripts/migration/check-worker-graph.mjs` to fail on native `sharp`, request-time filesystem/path modules, disabled IMG.LY/ONNX assets, test generators, or dev-only packages
- [X] T021 [P] Create `scripts/migration/types.ts` for baseline, manifest, verification result, dependency decision, upload, release gate, and rollback evidence records
- [X] T022 [P] Create `scripts/migration/schema.ts` to validate every artifact from `scripts/migration/types.ts` and fail on secret values or unsupported state transitions
- [X] T023 Create `artifacts/migration/README.md` documenting generated versus operator-retained evidence, redaction, and immutable commit/deployment identifiers
- [X] T024 Update `.gitignore` for generated `artifacts/migration/runtime/`, `.vinext/`, Cloudflare local state, and source maps without excluding reviewed manifest fixtures

**Checkpoint**: Shared manifests, fixture execution, secret scanning, Worker graph checking, and redacted evidence storage are operational.

## Phase 3: User Story 1 — Restore Production Website Behavior (Priority: P1) - MVP

**Goal**: Make the complete public and API surface build and run on the Next 15 + Vinext/Workers path while retaining routes, static content, search, commerce, upload, analytics, and accessibility contracts.

**Independent Test**: Run normal Next and built Vinext locally, compare all route/API manifests, execute safe commerce/search/upload regressions, and prove browser/device parity on the production-like candidate without a real external write.

### Toolchain and Dependency Compatibility

- [X] T025 [US1] Pin Node `>=22 <26` and `packageManager` to `pnpm@11.5.3` in `package.json`
- [X] T026 [US1] Regenerate and review the peer graph in `pnpm-lock.yaml` with pnpm 11.5.3 and no unexplained peer override
- [X] T027 [US1] Upgrade Next 15.5.x, React/ReactDOM 19.3.1, matching React types, `eslint-config-next`, bundle analyzer, and Next third-party tooling together in `package.json`
- [X] T028 [US1] Keep MUI 5 and upgrade the compatible MUI/Emotion patch set while preserving the providers in `pages/_app.tsx` and style extraction in `pages/_document.tsx`
- [X] T029 [US1] Upgrade or replace the five `react-material-ui-carousel` consumers from `artifacts/migration/baseline/call-sites.json` with one supported shared pattern in `components/`
- [X] T030 [US1] Upgrade React Three Fiber, Drei, Three, and types as one unit for `components/lighters/LighterCanvas.tsx` and `components/keychain-builder/preview/`
- [X] T031 [US1] Audit and fix React 19 call-site compatibility for React Hook Form, SWR, Zustand, block content rendering, lightbox, and date range in the consumers listed by `scripts/migration/inventory-call-sites.mjs`
- [X] T032 [US1] Fix the `GetStaticProps` import in `pages/blog/index.tsx` to import from `next`
- [X] T033 [US1] Replace the CommonJS path assumption in `sanity/scripts/report.mjs` with ESM-safe path resolution
- [X] T034 [US1] Preserve TypeScript `strict: false` and the current Pages Router plus `Component.Layout` behavior in `tsconfig.json` and `pages/_app.tsx`

### Next 15 and Vinext Runtime

- [X] T035 [P] [US1] Migrate legacy `next/image` props in all 44 inventoried consumers while preserving dimensions, object fit, priority, loading, and responsive layout under `pages/` and `components/`
- [X] T036 [P] [US1] Migrate the affected `next/link`, `passHref`, and `legacyBehavior` compositions from `artifacts/migration/baseline/call-sites.json` under `pages/` and `components/`
- [X] T037 [US1] Remove `<Analytics />` and `@vercel/analytics` from `pages/_app.tsx` and `package.json` while retaining GA4/GTM and Umami wrappers
- [X] T038 [US1] Replace every runtime `VERCEL_ENV` branch with a neutral deployment-channel helper in `utils/` and its consumers
- [X] T039 [US1] Run Vinext init with Cloudflare, no CDN/data cache, and no image optimizer to add `vite.config.ts`, `cloudflare.config.ts`, and Vinext scripts/dependencies to the repository
- [X] T040 [US1] Add generated Cloudflare/Vinext type declarations and ignore rules in `next-env.d.ts`, `tsconfig.json`, and `.gitignore`
- [X] T041 [US1] Translate required IMG.LY alias behavior, browser `fs` fallback, temporary `sharp` externalization, analyzer behavior, headers, cache rules, and redirects into `vite.config.ts` and `next.config.js`
- [X] T042 [US1] Add `dev:vinext`, `build:vinext`, and `start:vinext` commands to `package.json` and prove the normal Next commands remain available
- [X] T043 [US1] Add build-time fail-closed validation for required environment variable names without values in `scripts/migration/validate-env.mjs`
- [X] T044 [US1] Run `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, `pnpm build:vinext`, and local built-Worker smoke checks, saving sanitized results in `artifacts/migration/runtime/framework/`

### Static Publication and Search

- [X] T045 [P] [US1] Remove `revalidate` from the 11 approved ISR page modules inventoried in `artifacts/migration/baseline/routes.json`
- [X] T046 [US1] Implement all published path enumeration with duplicate, blank, invalid, draft, and missing-relation failure checks in `pages/index.tsx`, `pages/blog/`, `pages/creativa/`, `pages/san-pham/`, and `pages/services/`
- [X] T047 [US1] Change blog, service, product, and Creativa dynamic pages to `fallback: false` in `pages/blog/`, `pages/creativa/`, `pages/san-pham/`, and `pages/services/`
- [X] T048 [US1] Create `scripts/migration/generate-static-manifest.mjs` to compare all generated public paths with `artifacts/migration/baseline/slugs.json`
- [X] T049 [P] [US1] Split pure parse, rank, and filter logic into browser-safe modules under `server/search/` and preserve the retained API model
- [X] T050 [P] [US1] Implement allow-listed public search-index generation in `scripts/migration/generate-search-index.mjs` from routes, typed product data, Markdown, and approved Sanity records
- [X] T051 [US1] Add schema version, document count, source hash, duplicate ID/URL checks, and prohibited-field validation to the search index generator in `scripts/migration/generate-search-index.mjs`
- [X] T052 [US1] Emit the versioned public search artifact under `public/` and wire it into the static `/search` shell in `pages/search/index.tsx`
- [X] T053 [US1] Remove request-time `getServerSideProps` and `/api/search` dependency from `pages/search/index.tsx` while retaining the endpoint at `pages/api/search.ts`
- [X] T054 [US1] Preserve search filters, pagination, ranking, result excerpts, keyboard behavior, and loading/error/empty UX in `pages/search/index.tsx` and `components/`
- [X] T055 [US1] Make sitemap, SEO verification, static manifest, and search-index generation explicit for both build paths in `package.json`, `next-sitemap.config.js`, and `scripts/verify-seo.mjs`
- [X] T056 [US1] Run standard and Vinext builds, verify the 74-module route manifest, all approved slugs, fallback behavior, sitemap, redirects, and zero ISR/SSR public page, and retain evidence under `artifacts/migration/runtime/static/`

### Worker API, Upload, and Secret Boundary

- [X] T057 [P] [US1] Add Worker-safe raw request byte reading for `/api/creativa/orders.ts`, `/api/creativa/orders/resolve.ts`, `/api/creativa/orders/analytics-claim.ts`, and `/api/creativa/quote.ts`
- [X] T058 [US1] Replace incompatible `Buffer`, Node `crypto`, stream, filesystem, and path use in Worker-reachable code under `pages/api/` and `utils/` with Web/Worker-safe equivalents
- [X] T059 [US1] Preserve timing-safe scheduler auth with server-only `SPX_SYNC_SECRET` in `pages/api/cron/sync-spx-orders.ts`
- [X] T060 [P] [US1] Define strict Base64, MIME, signature, decoded byte, dimension, pixel, filename, and persistence validation in `utils/keychain/imageValidation.ts`
- [X] T061 [P] [US1] Keep bounded browser resize/encode for PNG/JPEG/WebP in `api-client/sanity-upload.ts`, `api-client/keychain.ts`, and `components/keychain-builder/`
- [X] T062 [US1] Remove native `sharp` from `pages/api/keychain/uploads.ts` and its Worker import graph while retaining the mocked Sanity upload shape
- [X] T063 [US1] Enforce the 14 MB encoded and 10 MB decoded upload limits plus explicit 400/413/415/429/500 outcomes in `pages/api/keychain/uploads.ts`
- [X] T064 [US1] Remove `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN`, `NEXT_PUBLIC_TELEGRAM_CHAT_ID`, and `NEXT_PUBLIC_X_API_KEY` imports from `utils/env-const.ts` and `api-client/axios-client.ts`
- [X] T065 [US1] Use `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` server-side only in notification routes under `pages/api/telegram/`
- [X] T066 [US1] Replace the browser-exposed API-key assumption with strict origin, JSON content type, method, field, size, and per-isolate rate checks in `pages/api/validate-phone.ts` and `pages/api/telegram/`
- [X] T067 [US1] Add an explicit preview/production origin allow-list and reject disallowed or wildcard CORS configuration in `pages/api/` and `utils/`
- [X] T068 [US1] Preserve Sanity `_ref`, `_type`, unique `_key`, pricing recalculation, customer fields, idempotency, and confirmation behavior in order-related code under `pages/api/orders/`, `server/`, and `api-client/`
- [X] T069 [US1] Run the safe 22-route matrix against standard Next and the built Vinext Worker, including side-effect counts, and save evidence in `artifacts/migration/runtime/apis/`
- [X] T070 [US1] Run raw-body boundary, malformed transport, duplicate/absent idempotency, downstream timeout, and abort fixtures and save evidence in `artifacts/migration/runtime/raw-body/`
- [X] T071 [US1] Run all upload validation, mocked persistence, failure-before-write, size/dimension, and visual-output cases and save evidence in `artifacts/migration/runtime/uploads/`
- [X] T072 [US1] Verify the Worker graph and browser/source-map output contain no `sharp`, filesystem/path runtime modules, IMG.LY/ONNX when disabled, old public secrets, or test-only generators under `artifacts/migration/runtime/security/`

### Story 1 Acceptance

- [X] T073 [US1] Run protected cart, checkout, quote, contact, keychain, Creativa, order tracking, and confirmation flows with safe mocks through `scripts/migration/run-safe-regression.mjs`
- [X] T074 [US1] Run desktop/mobile keyboard, responsive, hydration, carousel, 3D normal/context-loss/fallback, image, reduced-motion, and critical-flow browser checks through `scripts/migration/browser-baseline.mjs`
- [X] T075 [US1] Compare GA4/GTM and Umami page/action/initial-load/navigation/bfcache sequences for exact-once behavior and prohibited fields, saving sanitized evidence in `artifacts/migration/runtime/analytics/`
- [X] T076 [US1] Measure representative public page timing and all 22 APIs, prove no timeout, 95% of pages within +10%, and Worker memory below 128 MB in `artifacts/migration/runtime/performance/`
- [X] T077 [US1] Assemble the US1 gate report with route, API, commerce, static, search, upload, analytics, accessibility, performance, and security evidence in `artifacts/migration/gates/us1.md`

**Checkpoint**: Standard Next and local built Vinext reproduce the production surface safely, with static public rendering and Worker-safe APIs.

## Phase 4: User Story 2 — Safe Preview, Cutover, and Rollback (Priority: P2)

**Goal**: Provide owner-triggered preview and production flows, immutable release evidence, approval gates, and a layer-specific Cloudflare rollback drill.

**Independent Test**: A qualified operator can dry-run, deploy a noindex preview, execute the complete release gate, and restore the last verified Cloudflare version from the runbook without using Vercel.

- [X] T078 [US2] Add the owner-triggered `workflow_dispatch` preview/production workflow with distinct environments and production approval in `.github/workflows/deploy-web.yml`
- [X] T079 [US2] Configure `.github/workflows/deploy-web.yml` to install exact pnpm 11.5.3 with Corepack, use `--frozen-lockfile`, cancel per-environment stale runs, and mask secrets
- [X] T080 [US2] Add one local release command in `package.json` that runs install verification, lint/type/build, static manifests, safe regressions, secret scan, Worker graph, and deploy dry-run
- [X] T081 [US2] Create `scripts/migration/release-manifest.mjs` to capture commit, lockfile hash, runtime versions, route/slug/API/env-name/search/redirect/sitemap hashes, Worker module graph, and immutable deployment version
- [X] T082 [US2] Implement the preview channel in `cloudflare.config.ts` and `next.config.js` so every preview page emits `X-Robots-Tag: noindex, nofollow` while canonical/sitemap remain on `https://inutdesign.com`
- [X] T083 [US2] Add `scripts/migration/check-preview-seo.mjs` to reject preview hostnames in production index, canonical, sitemap, or robots artifacts and require preview noindex
- [X] T084 [US2] Add the Cloudflare deploy dry-run and owner-controlled preview deploy steps to `.github/workflows/deploy-web.yml` after all local gates
- [X] T085 [US2] Run the full route, API, browser, upload, analytics, SEO, performance, secret, and Worker-graph matrix on an approved preview deployment and retain evidence in `artifacts/migration/preview/`
- [X] T086 [US2] Create `scripts/migration/release-gate.mjs` to require pass status for every mandatory compatibility, route, API, commerce, search, upload, analytics, accessibility, Worker, security, secret, cost, and operations gate
- [X] T087 [US2] Define owner approval evidence fields and production artifact delta checks in `artifacts/migration/templates/production-approval.json`
- [X] T088 [US2] Create the deploy, immediate hard cutover, health verification, and Cloudflare-version rollback procedure in `docs/operations/cloudflare-release.md`
- [X] T089 [US2] Add separate Worker, DNS, TLS, email, and preview-index rollback procedures and failure-boundary checks in `docs/operations/cloudflare-release.md`
- [ ] T090 [US2] Conduct an approved dry run that deploys, identifies, and restores a verified Cloudflare version within 15 minutes, recording timings in `artifacts/migration/operations/rollback-drill.json`
- [ ] T091 [US2] Verify production artifact deltas are channel-only, rerun production smoke/SEO/security gates, and block DNS approval until `scripts/migration/release-gate.mjs` passes

**Checkpoint**: Preview and production are distinguishable, repeatable, approved, evidenced, and rollbackable within the same Cloudflare platform.

## Phase 5: User Story 4 — Move DNS and Domain Routing Without SEO Loss (Priority: P2)

**Goal**: Prepare an owner-approved DNS inventory and cutover that preserves HTTPS, URL, SEO, email, verification records, and registrar boundaries.

**Independent Test**: The approved inventory reconciles source and Cloudflare records record-by-record; after an approved cutover, production routes, TLS, canonical, sitemap, email records, and critical flows pass while Squarespace remains registrar.

- [X] T092 [US4] Create `artifacts/migration/dns/source-inventory.csv` with apex, `www`, NS/DS, CAA, MX, SPF, DKIM, DMARC, TXT, verification, third-party, and known subdomain records including owner, TTL, priority, proxy mode, purpose, and disposition
- [X] T093 [US4] Create `scripts/migration/verify-dns-inventory.mjs` to require complete fields, unique record identities, explicit disposition, and no unsupported blind copy
- [X] T094 [US4] Record the approved Squarespace/Vercel source targets and pre-cutover authoritative nameserver, DNSSEC, certificate, and resolution snapshot in `artifacts/migration/dns/pre-cutover.json`
- [X] T095 [US4] Add the Cloudflare zone, target Worker, custom-domain attachment, nameserver, DNSSEC, and certificate preparation checklist to `docs/operations/cloudflare-dns-cutover.md`
- [ ] T096 [US4] Validate every Cloudflare DNS inventory record against the approved `artifacts/migration/dns/source-inventory.csv`, including email and verification continuity
- [X] T097 [US4] Add the DNSSEC disable/wait/re-enable decision and propagation evidence procedure to `docs/operations/cloudflare-dns-cutover.md`
- [X] T098 [US4] Add the immediate hard-cutover procedure, owner approval checkpoint, no-traffic-split rule, and custom-domain order to `docs/operations/cloudflare-dns-cutover.md`
- [X] T099 [US4] Add apex, `www`, TLS, redirect, robots, canonical, sitemap, indexed path, 22-API, and critical-journey post-cutover checks to `scripts/migration/verify-dns-cutover.mjs`
- [X] T100 [US4] Add MX/SPF/DKIM/DMARC/TXT/CAA/DS continuity checks and owner-visible evidence to `scripts/migration/verify-dns-cutover.mjs`
- [X] T101 [US4] Add DNS-only, Worker-only, TLS-only, email-only, and preview-indexing rollback branches with healthy-layer preservation to `docs/operations/cloudflare-dns-cutover.md`
- [ ] T102 [US4] Record post-cutover resolution, certificate, Worker version, custom-domain, email, canonical, sitemap, and indexed URL evidence in `artifacts/migration/dns/post-cutover.json`
- [ ] T103 [US4] Verify operator-caused downtime is under five minutes excluding external propagation and retain the measurement in `artifacts/migration/dns/cutover-timing.json`
- [ ] T104 [US4] Prove Squarespace remains registrar and no unlock, auth-code request, submission, payment, or registrant change occurred in `artifacts/migration/dns/registrar-boundary.json`
- [X] T105 [US4] Create the future, explicitly gated registrar-transfer checklist without executable transfer credentials in `docs/operations/cloudflare-registrar-transfer.md`

**Checkpoint**: Cloudflare authoritative DNS serves the existing domain contracts while registrar transfer remains deferred and zero-action.

## Phase 6: User Story 3 — Operate Integrations and Cost Safely (Priority: P3)

**Goal**: Give operators safe environment setup, secret rotation evidence, scheduler parity, redacted logs, and enforced cost/usage controls.

**Independent Test**: A fresh approved environment can be configured by name and scope only, SPX runs safely with unchanged auth/idempotency behavior, browser output exposes no secret, and warning/block policies plus logs are evidenced.

- [X] T106 [US3] Finalize the environment scope inventory with browser-build, Worker-secret, scheduler, and local-test classifications in `artifacts/migration/operations/env-inventory.json`
- [X] T107 [US3] Update `.env.example` to remove public credential names, include only approved public values, and document server-only replacement names without values
- [X] T108 [US3] Add a pre-preview secret migration and rotation checklist proving the exposed legacy Telegram credential was rotated in `artifacts/migration/operations/secret-rotation.json`
- [X] T109 [US3] Add fail-closed server-only secret lookup and variable-name-only diagnostics for Telegram, Sanity, SPX, and internal callers in `utils/env-const.ts` and `server/`
- [X] T110 [US3] Preserve external scheduler targeting, auth, timeout, idempotency, concurrency, response, and notification behavior for `pages/api/cron/sync-spx-orders.ts`
- [X] T111 [US3] Add safe SPX duplicate, timeout, concurrent, partial failure, and notification-mock fixtures under `scripts/migration/api-fixtures/spx/`
- [X] T112 [US3] Add redacted Worker logging for timing, status, memory/CPU context, and route identity without request bodies, credentials, contacts, uploads, or analytics secrets under `pages/api/` and `utils/`
- [X] T113 [US3] Configure Workers Paid readiness and warning at $2 usage over base plus a hard block target at $10 in `artifacts/migration/operations/spend-policy.md`
- [X] T114 [US3] Add the account capability check and owner confirmation for actual warning/block enforcement support in `docs/operations/cloudflare-cost-controls.md`
- [X] T115 [US3] Add Worker request, CPU, and log-volume alert procedures with approval owners and sanitization notes in `docs/operations/cloudflare-cost-controls.md`
- [X] T116 [US3] Create `scripts/migration/measure-usage.mjs` to compare request/CPU/log volume evidence to the $5 base and approved modeled $5–$6 range without assuming Vercel invocation parity
- [X] T117 [US3] Add the operator runbook for initial environment setup, secret injection by reference, deploy verification, log inspection, and cost escalation in `docs/operations/cloudflare-operations.md`
- [X] T118 [US3] Verify a fresh environment through name-only configuration and save redacted successful checks in `artifacts/migration/operations/fresh-environment.json`
- [X] T119 [US3] Run safe SPX fixtures and compare auth, timeout, idempotency, response, and side-effect counts in Next and Vinext under `artifacts/migration/operations/spx/`
- [X] T120 [US3] Record warning/block readiness, Worker usage alerts, sanitized logs, and secret-scan status in the release gate report generated by `scripts/migration/release-gate.mjs`
- [ ] T121 [US3] Validate the seven-day post-cutover monitoring period for at least 99.9% availability and zero unresolved critical security/data incident in `artifacts/migration/operations/stabilization.json`

**Checkpoint**: Operations are repeatable and secret-safe, SPX behavior is preserved, and cost/usage controls are observable before cutover.

## Phase 7: Polish and Cross-Cutting Verification

**Purpose**: Close documentation, evidence, accessibility, and release completeness gaps across all user stories.

- [X] T122 [P] Update `specs/004-migrate-vinext-cloudflare/quickstart.md` with final script names and exact artifact paths while preserving owner-action boundaries
- [X] T123 [P] Update `specs/004-migrate-vinext-cloudflare/research.md` with accepted dependency units, compatibility decisions, rejected overrides, and retained evidence references
- [X] T124 [P] Document every approved non-security compatibility gap or waiver with owner, rationale, affected files, and evidence in `specs/004-migrate-vinext-cloudflare/compatibility-decisions.md`
- [X] T125 [P] Verify all 44 Image consumers and 57 Link consumer files in `artifacts/migration/baseline/call-sites.json` have focused source and browser evidence
- [X] T126 [P] Verify five carousel surfaces and two React Three canvases with keyboard/pointer, forced fallback/context-loss, responsive, and no-hydration-error evidence in `artifacts/migration/runtime/browser/`
- [X] T127 [P] Verify preview and production docs contain no secret values, auth codes, customer data, upload bytes, share links, or production credential names in `artifacts/migration/release/`
- [X] T128 Run `scripts/migration/check-manifests.mjs` and require all reviewed deltas from the baseline to reference a change record in `specs/004-migrate-vinext-cloudflare/compatibility-decisions.md`
- [X] T129 Run `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, `pnpm build:vinext`, safe regressions, browser checks, SEO verification, secret scan, and Worker graph check from the final candidate
- [X] T130 Generate the final immutable release report with every FR/SC result, explicit pass/fail/block/waive state, evidence reference, owner, and Cloudflare rollback version in `artifacts/migration/release/final-report.json`
- [ ] T131 Verify `artifacts/migration/release/final-report.json` has no unresolved blocker, no security/data waiver, all mandatory gates passed, and registrar actions absent

---

## Dependencies & Execution Order

## Implementation Stop Boundary (2026-11-24)

Implementation is complete for all local, source-controlled work. The remaining
unchecked tasks require one of the following owner/external states and were not
silently marked complete:

- **Sanity owner action resolved (2026-11-24)**: owner updated the three records to
  `skt-t1-2`, `grey-marble`, and `bat-lua-mini-in-thuong-mau-muoi-mot`. T044,
  T056, T074 and T129 now pass, including 714 static pages, 710 public paths,
  706 sitemap URLs, 22-route parity and 24 browser/viewport checks.
- **Approved preview/production owner action**: T085, T090, T091 — no deploy,
  production artifact or rollback drill was executed without explicit approval.
- **Preview-only measurement**: T076 — local timing is 100% within +10% and APIs
  have no timeout, but peak isolate memory requires Cloudflare preview telemetry.
- **Approved DNS inventory/cutover**: T096, T102, T103 — no DNS change was made;
  current public DNS is already Cloudflare-authoritative and returns HTTP 402,
  so post-cutover health is not valid.
- **Registrar owner action/evidence**: T104 — public RDAP says Squarespace
  registrar with `pending transfer`, contradicting the required “no transfer”
  completion condition; this implementation initiated no registrar action.
- **Credential owner action**: T108 — legacy public Telegram exposure is removed,
  but actual credential rotation requires owner confirmation.
- **Elapsed monitoring window**: T121 — seven-day availability and incident
  evidence cannot be created in this session.
- **Release completion**: T131 — `final-report.json` intentionally remains
  `blocked` while mandatory gates above are unresolved.

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; captures the evidence every later phase compares against.
- **Foundational (Phase 2)**: Depends on Setup and blocks all story release; shared fixtures, schemas, scans, and artifact rules cannot be bypassed.
- **US1 (Phase 3)**: Depends on Foundational and is the MVP restore path.
- **US2 (Phase 4)**: Depends on US1; requires approved preview access but contains no DNS change by itself.
- **US4 (Phase 5)**: Depends on a passed US2 release gate plus DNS inventory owner approval; requires a separate production cutover approval.
- **US3 (Phase 6)**: Depends on Foundational and can implement in parallel with US1 after shared artifacts exist; its secret/cost gates must pass before US2 preview and US4 cutover.
- **Polish (Phase 7)**: Depends on all desired user stories and produces the final release evidence.

### User Story Dependency Graph

```text
Setup
  -> Foundational
       -> US1 (P1, MVP)
       -> US3 (P3, may run in parallel; must gate preview)
US1 + US3 -> US2 (P2 preview/production/rollback)
US2 + approved DNS inventory -> US4 (P2 DNS/SEO)
All required stories -> Polish
```

### Story Independence

- **US1** is independently testable on standard Next and a local built Vinext Worker with safe fixtures.
- **US2** is independently testable on an approved preview without changing production DNS.
- **US3** is independently testable through name-only environment configuration, mock scheduler calls, and cost-policy evidence.
- **US4** is independently testable by DNS inventory reconciliation and approved layer-specific cutover/rollback checks.

## Parallel Opportunities

- Setup inventory tasks T002–T012 can run concurrently after T001 because they write distinct evidence files.
- Foundational manifest, secret, Worker graph, schema, and regression tasks T016–T022 can run concurrently after the task scripts are named in T015.
- In US1, Image and Link migrations T035–T036 can run concurrently but merge only with DOM/browser evidence.
- Search generation T049–T054 can run concurrently with API transport hardening T057–T068 after shared schemas exist.
- Upload validation T060/T063, browser transform T061, and Worker graph proof T072 can proceed independently until the final upload integration checkpoint.
- US3 environment, scheduler, logging, and cost work T106–T117 can run in parallel with US1 after Foundational.
- Polish evidence tasks T122–T127 can run in parallel after implementation stabilizes.

### Parallel Example: User Story 1

```bash
# Separate source-compatible migration units after baseline evidence:
Task: "Migrate all inventoried next/image consumers in pages/ and components/"
Task: "Migrate all affected next/link compositions in pages/ and components/"
Task: "Generate the allow-listed public search index in scripts/migration/generate-search-index.mjs"
Task: "Add Worker-safe raw-body fixtures and readers for Creativa APIs"
```

## Implementation Strategy

### MVP First: User Story 1

1. Complete Setup and Foundational.
2. Complete the dependency/core runtime and Vinext local path.
3. Complete static rendering, search, APIs, upload, secret boundary, analytics, and commerce gates.
4. **STOP and VALIDATE**: run standard Next and built Vinext; all US1 evidence must pass.
5. Do not deploy or change DNS from the MVP implementation step.

### Incremental Delivery

1. Setup + Foundational -> repeatable evidence and safe fixtures.
2. US1 -> production-like restore candidate passes locally.
3. US3 parallel work -> secure operations and cost controls are ready to gate preview.
4. US2 -> approved preview, immutable evidence, production automation, and Cloudflare rollback.
5. US4 -> approved DNS cutover and SEO/email preservation; registrar remains unchanged.
6. Polish -> final evidence report and no unresolved blocker.

### Safety and Approval Strategy

- Planning and implementation tasks never silently subscribe to Cloudflare, deploy to production, change DNS, unlock a registrar domain, request an auth code, submit a transfer, or make a payment.
- Real preview deployment, production deployment, DNS cutover, account subscription, spend controls, and any future registrar action each require a separate explicit owner approval.
- Every validation write path uses fixtures, mocks, or read-only access and must retain a zero-production-side-effect assertion.
