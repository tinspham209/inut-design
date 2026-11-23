# Tasks: Optimize Vercel Usage

**Input**: Design documents from `/specs/003-optimize-vercel-usage/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/`, `quickstart.md`

**Tests**: No TDD unit tests were requested. Validation tasks use builds,
instrumented query counts, browser evidence, protected-flow regressions, and
Production-only Vercel evidence because performance and routing acceptance
requires executable proof.

**Organization**: Tasks are grouped by user story. Complete Setup and
Foundational before story work, then deliver P1 stories independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other `[P]` tasks on different files.
- **[Story]**: User story traceability (`US1`, `US2`, `US3`, `US4`).
- Every task includes an exact repository or artifact path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish safe, comparable baselines and working artifacts.

- [x] T001 Capture the pre-change build route summary from `rtk pnpm build` in `specs/003-optimize-vercel-usage/evidence/baseline-build.md`
- [x] T002 [P] Record the supplied Vercel baseline and sample limitations from `specs/003-optimize-vercel-usage/inputs/INUT_VERCEL_CPU_HANDOFF.md` in `specs/003-optimize-vercel-usage/evidence/baseline-vercel.md`
- [x] T003 [P] Snapshot current homepage, `/contact`, `/contact/form`, `/search`, Creativa, blog, and representative product routes with agent-browser into `test-results/003-baseline/`
- [x] T004 [P] Inventory all 17 page modules with data exports from `pages/` in `specs/003-optimize-vercel-usage/evidence/page-workload-inventory.md`
- [x] T005 [P] Inventory all 22 API Function modules from `pages/api/` in `specs/003-optimize-vercel-usage/evidence/api-workload-inventory.md`
- [x] T006 [P] Record the current `/contact` CMS document and asset identity without secrets in `specs/003-optimize-vercel-usage/evidence/contact-banner-source.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared read shapes, classification rules, and evidence conventions
that block all route work.

**⚠️ CRITICAL**: No user story implementation starts until this phase passes.

- [x] T007 Validate that all grouped-read designs preserve existing Sanity projections and reference shapes documented in `specs/003-optimize-vercel-usage/data-model.md`
- [x] T008 [P] Add a typed normalized result contract for grouped homepage data in `api-client/homepage.ts`
- [x] T009 [P] Define reusable grouped-result types for search, listing, detail, and workload evidence in `specs/003-optimize-vercel-usage/contracts/data-shapes.md`
- [x] T010 Classify each API inventory row against `specs/003-optimize-vercel-usage/contracts/api-workload-contract.md` in `specs/003-optimize-vercel-usage/evidence/api-workload-inventory.md`
- [x] T011 Add route/evidence naming and normalization rules from `specs/003-optimize-vercel-usage/contracts/evidence-contract.md` to `specs/003-optimize-vercel-usage/evidence/README.md`
- [x] T012 [P] Define owner-triggered urgent publication steps for Creativa and search in `specs/003-optimize-vercel-usage/quickstart.md`
- [x] T013 Confirm no task in `specs/003-optimize-vercel-usage/tasks.md` changes protected order, quote, upload, notification, or synchronization contracts
- [x] T014 Record the five-route Production freeze and 40% comparison formula, preserving an explicit gap if Production baseline data is unavailable, in `specs/003-optimize-vercel-usage/evidence/baseline-vercel.md`
- [x] T015 [P] Define the 12-hour/25-request latency sampling rule, affected route set, and synthetic fallback in `specs/003-optimize-vercel-usage/contracts/evidence-contract.md`
- [x] T016 [P] Define a normal-request CPU baseline and comparison method for malformed, missing, and unavailable-content classes in `specs/003-optimize-vercel-usage/contracts/evidence-contract.md`
- [x] T017 [P] Define temporary local-only timing points for complete page-data work and external content-source work in `specs/003-optimize-vercel-usage/evidence/render-vs-fetch-method.md`
- [x] T018 [P] Define document, Next data, and script/chunk request counting for `/contact/form` in `specs/003-optimize-vercel-usage/contracts/evidence-contract.md`
- [x] T019 [P] Define class-specific protected API fixtures for read-only, order/checkout, contact/quote, upload/design, notification, synchronization/cron, and validation endpoints in `specs/003-optimize-vercel-usage/contracts/api-workload-contract.md`
- [x] T020 Define the approved-commit Production redeploy trigger, new-deployment selection, cache check, and 15-minute urgent visibility check in `specs/003-optimize-vercel-usage/quickstart.md`
- [x] T021 [P] Define isolated-function and Production-aggregate search corpus rebuild evidence rules in `specs/003-optimize-vercel-usage/contracts/evidence-contract.md`
- [x] T022 [P] Define the contact migration source as the current live 1200px/quality-80 Sanity rendition and record its canonical URL parameters in `specs/003-optimize-vercel-usage/evidence/contact-banner-source.md`
- [x] T023 [P] Add a one-external-operation-per-blog-refresh measurement requirement to `specs/003-optimize-vercel-usage/contracts/evidence-contract.md`
- [x] T024 [P] Define within-budget, warning, escalated, failed, and recommended operator-action thresholds in `specs/003-optimize-vercel-usage/evidence/README.md`
- [x] T025 Reconcile the resolved requirement terms across `specs/003-optimize-vercel-usage/spec.md`, `specs/003-optimize-vercel-usage/plan.md`, and `specs/003-optimize-vercel-usage/contracts/`

**Checkpoint**: Query shapes, API dispositions, publication steps, and evidence
rules, including all analysis-remediation gates, are explicit.

---

## Phase 3: User Story 1 — Keep the Public Website Available All Month (P1) 🎯 MVP

**Goal**: Remove the confirmed P0 compute paths and keep monthly CPU below budget.

**Independent Test**: `pnpm build` marks `/contact` static, homepage uses one CMS
operation per regeneration, and equivalent P0 route evidence projects below the
3-hour monthly CPU limit.

### Contact Static Migration

- [x] T026 [US1] Download the current quality-80 1200px contact rendition from the published Sanity asset to `public/branding/contacts/contact-page-banner.jpg`
- [x] T027 [US1] Record the source identity, dimensions, byte size, and hash for `public/branding/contacts/contact-page-banner.jpg` in `specs/003-optimize-vercel-usage/evidence/contact-banner-source.md`
- [x] T028 [US1] Replace `/contact` CMS banner URLs with `/branding/contacts/contact-page-banner.jpg` in `pages/contact/index.tsx`
- [x] T029 [US1] Remove `getStaticProps`, banner props, and Sanity imports from `pages/contact/index.tsx` so the route is fully static
- [x] T030 [US1] Confirm title, description, canonical URL, contact links, tracking callbacks, and MainLayout remain unchanged in `pages/contact/index.tsx`
- [x] T031 [US1] Capture desktop and mobile `/contact` screenshots after migration in `test-results/003-after/contact/`
- [x] T032 [US1] Compare baseline and migrated contact images and record objective differences in `specs/003-optimize-vercel-usage/evidence/contact-banner-comparison.md`

### Homepage P0 Cost Reduction

- [x] T033 [P] [US1] Implement one grouped homepage Sanity query for banner and three featured product groups in `api-client/homepage.ts`
- [x] T034 [US1] Replace four homepage Sanity calls with `getHomepageContent` in `pages/index.tsx`
- [x] T035 [US1] Change homepage ISR from 300 to 600 seconds in `pages/index.tsx`
- [x] T036 [US1] Preserve existing ordering, limits, reference/image fields, fallbacks, and local blog reads in `pages/index.tsx`
- [x] T037 [US1] Instrument a local query-count check for 85 equivalent homepage regenerations in `specs/003-optimize-vercel-usage/evidence/homepage-query-count.md`
- [x] T038 [US1] Validate homepage content and navigation at desktop/mobile viewports using agent-browser in `test-results/003-after/home/`

### P0 Validation

- [x] T039 [US1] Run `rtk pnpm lint` and record output in `specs/003-optimize-vercel-usage/evidence/lint-us1.md`
- [x] T040 [US1] Run `rtk pnpm build` and verify `/contact` is static and `/` is ISR 600 seconds in `specs/003-optimize-vercel-usage/evidence/build-us1.md`
- [x] T041 [US1] Inspect `/contact` browser network activity and record zero runtime Sanity requests in `specs/003-optimize-vercel-usage/evidence/contact-network.md`
- [x] T042 [US1] Update the normalized P0 CPU projection for homepage and contact in `specs/003-optimize-vercel-usage/evidence/p0-budget-projection.md`

**Checkpoint**: P0 route cost is removed or consolidated and the MVP can be
validated without US2–US4.

---

## Phase 4: User Story 2 — Reduce Expensive Public-Page Work (P1)

**Goal**: Remove confirmed repeated read/render work across search, Creativa,
product, blog, and quote-navigation routes.

**Independent Test**: Search uses one grouped corpus refresh, Creativa is
24-hour fresh, product read fan-out is ≥25% lower, blog remains 10-minute fresh,
and idle `/contact/form` traffic no longer repeats automatically.

### Search Corpus

- [x] T043 [P] [US2] Replace five dynamic search queries with one aliased grouped query in `server/search/sources.ts`
- [x] T044 [US2] Bound search projections to searchable fields and preserve facet compatibility in `server/search/sources.ts`
- [x] T045 [US2] Change corpus TTL to 24 hours while retaining pending-promise coalescing in `server/search/sources.ts`
- [x] T046 [US2] Align repeatable search response cache policy with the 24-hour corpus policy without caching malformed requests in `pages/search/index.tsx`
- [x] T047 [US2] Compare common, category, empty, static-route, and malformed search outcomes in `specs/003-optimize-vercel-usage/evidence/search-parity.md`
- [x] T048 [US2] Measure grouped search source operations and cold/warm corpus behavior in `specs/003-optimize-vercel-usage/evidence/search-query-count.md`

### Creativa

- [x] T049 [P] [US2] Change homepage Creativa revalidation from 60 to 86,400 seconds while preserving explicit unavailable state in `pages/creativa/index.tsx`
- [x] T050 [P] [US2] Change Creativa catalog revalidation from 60 to 86,400 seconds while preserving explicit unavailable state in `pages/creativa/skin-laptop/index.tsx`
- [x] T051 [P] [US2] Change Creativa detail revalidation and not-found revalidation from 60 to 86,400 seconds in `pages/creativa/skin-laptop/[slug].tsx`
- [x] T052 [US2] Preserve blocking fallback for uncached Creativa slugs in `pages/creativa/skin-laptop/[slug].tsx`
- [x] T053 [US2] Consolidate any duplicate catalog/option source work that preserves existing shapes in `api-client/creativa-catalog.ts`
- [x] T054 [US2] Validate Creativa homepage, catalog, existing slug, unavailable state, and uncached-slug behavior in `specs/003-optimize-vercel-usage/evidence/creativa-regression.md`

### Product Listings and Details

- [x] T055 [P] [US2] Add a grouped laptop listing read for items/count, types, and banner in `api-client/products.ts`
- [x] T056 [US2] Add a grouped Macnut listing read for items/count, types, and banner in `api-client/products.ts`
- [x] T057 [P] [US2] Add a grouped lighter listing read for items/count, types, and banner in `api-client/lighters.ts`
- [x] T058 [US2] Use the grouped read while preserving sorting and 24-hour freshness in `pages/san-pham/skin-laptop/index.tsx`
- [x] T059 [US2] Use the grouped read while preserving sorting and 24-hour freshness in `pages/san-pham/skin-nut-phim/index.tsx`
- [x] T060 [US2] Use the grouped read while preserving sorting and 24-hour freshness in `pages/san-pham/lighters/index.tsx`
- [x] T061 [P] [US2] Consolidate primary/related/static-content reads while preserving shapes in `pages/san-pham/skin-laptop/[slug].tsx`
- [x] T062 [P] [US2] Consolidate primary/related/static-content reads while preserving shapes in `pages/san-pham/skin-nut-phim/[slug].tsx`
- [x] T063 [US2] Reuse lighter type details from the primary result instead of re-fetching by reference in `pages/san-pham/lighters/[slug].tsx`
- [x] T064 [US2] Preserve first-10 pre-generation, blocking fallback, and new-slug availability in `pages/san-pham/skin-laptop/[slug].tsx`, `pages/san-pham/skin-nut-phim/[slug].tsx`, and `pages/san-pham/lighters/[slug].tsx`
- [x] T065 [US2] Compare product content, references, image counts, related products, and read counts in `specs/003-optimize-vercel-usage/evidence/product-parity.md`

### Blog and Quote Prefetch

- [x] T066 [P] [US2] Change blog listing ISR from 300 to 600 seconds while preserving post sorting in `pages/blog/index.tsx`
- [x] T067 [P] [US2] Add a non-prefetch metadata field for `/contact/form` in `components/common/header/routes.ts`
- [x] T068 [US2] Propagate the non-prefetch route setting to desktop header Next Links in `components/common/header/header-desktop.tsx`
- [x] T069 [US2] Propagate the non-prefetch route setting to mobile header Next Links in `components/common/header/header-mobile.tsx`
- [x] T070 [P] [US2] Disable automatic prefetch for the quote CTA in `components/home/hero.tsx`
- [x] T071 [P] [US2] Disable automatic prefetch for the quote CTA in `components/home/chot-don.tsx`
- [x] T072 [US2] Verify product-template quote anchors remain ordinary links with preserved query parameters in `components/product-template/v1/ContactSection.tsx` and `components/product-template/v2/ContactSection.tsx`
- [x] T073 [US2] Capture an idle browser session and quote-link navigation to prove bounded `/contact/form` background traffic in `specs/003-optimize-vercel-usage/evidence/contact-form-network.md`

### US2 Validation

- [x] T074 [US2] Run `rtk pnpm lint` after all US2 route and read changes in `specs/003-optimize-vercel-usage/evidence/lint-us2.md`
- [x] T075 [US2] Run `rtk pnpm build` and verify route revalidation classes in `specs/003-optimize-vercel-usage/evidence/build-us2.md`
- [x] T076 [US2] Run focused browser regressions for search, Creativa, blog, product listing/detail, and quote navigation in `specs/003-optimize-vercel-usage/evidence/browser-us2.md`

**Checkpoint**: Repeated public-page work is reduced and every changed route
preserves content and navigation.

---

## Phase 5: User Story 3 — Preserve Freshness, Discovery, and Core Conversions (P2)

**Goal**: Keep CMS publication, SEO, accessibility, analytics, contact, cart, and
checkout behavior stable while server work is reduced.

**Independent Test**: Urgent Creativa/search publication is visible within
15 minutes, normal updates respect route freshness, and protected regressions
preserve visitor outcomes without creating real orders or quote submissions.

### Freshness and Publication

- [x] T077 [US3] Document the owner-triggered Creativa publication command and completion check in `specs/003-optimize-vercel-usage/quickstart.md`
- [x] T078 [US3] Document the owner-triggered search corpus publication command and completion check in `specs/003-optimize-vercel-usage/quickstart.md`
- [x] T079 [US3] Define the normal and urgent freshness matrix for homepage, blog, product, Creativa, search, and `/contact` in `specs/003-optimize-vercel-usage/contracts/public-route-contract.md`
- [x] T080 [US3] Validate an urgent Creativa publication within 15 minutes without browser-cache dependence in `specs/003-optimize-vercel-usage/evidence/creativa-publish.md`
- [x] T081 [US3] Validate an urgent search catalog publication within 15 minutes without process-cache dependence in `specs/003-optimize-vercel-usage/evidence/search-publish.md`
- [x] T082 [US3] Confirm local blog and CMS homepage changes remain visible within 10 minutes in `specs/003-optimize-vercel-usage/evidence/content-freshness.md`

### SEO, Accessibility, Analytics, and Protected Flows

- [x] T083 [P] [US3] Re-run sitemap and SEO smoke validation from `scripts/verify-seo.mjs` and record results in `specs/003-optimize-vercel-usage/evidence/seo.md`
- [x] T084 [P] [US3] Capture keyboard, responsive, and reduced-motion evidence for `/`, `/contact`, `/search`, `/blog`, Creativa, and representative product routes in `test-results/003-after/accessibility/`
- [x] T085 [P] [US3] Compare existing dual analytics event sources and confirm no duplicate or renamed events in `specs/003-optimize-vercel-usage/evidence/analytics.md`
- [x] T086 [US3] Run homepage and public-navigation browser regression with `scripts/regression-test.sh` in `specs/003-optimize-vercel-usage/evidence/public-navigation.md`
- [x] T087 [US3] Validate quote-form navigation, invalid-input blocking, and no successful real submission in `specs/003-optimize-vercel-usage/evidence/contact-form-regression.md`
- [x] T088 [US3] Validate cart persistence, pricing recalculation, builders, and checkout UI without creating a real order in `specs/003-optimize-vercel-usage/evidence/commerce-regression.md`
- [x] T089 [US3] Confirm protected API authorization, methods, response shape, and sensitive-data handling remain unchanged using fixtures in `specs/003-optimize-vercel-usage/evidence/protected-api-regression.md`
- [x] T090 [US3] Record any content-unavailable, malformed-input, missing-slug, or partial-read behavior against the explicit failure contract in `specs/003-optimize-vercel-usage/evidence/failure-states.md`

**Checkpoint**: Freshness and user-facing contracts are independently validated
without production side effects.

---

## Phase 6: User Story 4 — Maintain an Enforceable CPU Budget (P2)

**Goal**: Inventory all remaining work, distinguish environments/workload
classes, and retain a repeatable before/after budget process.

**Independent Test**: All 17 data-fetch page modules and 22 API endpoints have a
documented disposition, and Production-only evidence supports the monthly CPU
budget and warning threshold.

### Complete Route Inventory

- [x] T091 [US4] Finalize all 17 page route rows, refresh windows, source-read counts, render modes, and dispositions in `specs/003-optimize-vercel-usage/evidence/page-workload-inventory.md`
- [x] T092 [US4] Finalize all 22 API endpoint rows, methods, callers, sensitivity, retry behavior, and dispositions in `specs/003-optimize-vercel-usage/evidence/api-workload-inventory.md`
- [x] T093 [US4] Mark read-only cache-safe API candidates with evidence or explicit `investigate` disposition in `specs/003-optimize-vercel-usage/evidence/api-workload-inventory.md`
- [x] T094 [US4] Record why protected write/upload/order/contact/notification/sync endpoints remain guardrail-only in `specs/003-optimize-vercel-usage/evidence/api-workload-inventory.md`

### Evidence and Budget

- [x] T095 [P] [US4] Add Production-only route CPU/invocation fields for the complete comparison window in `specs/003-optimize-vercel-usage/evidence/production-after.md`
- [x] T096 [US4] Add Production-only external Sanity call, 5xx, cache-status, and workload-class fields in `specs/003-optimize-vercel-usage/evidence/production-after.md`
- [x] T097 [US4] Normalize before/after traffic and compute the monthly CPU projection in `specs/003-optimize-vercel-usage/evidence/cpu-budget.md`
- [x] T098 [US4] Verify the warning threshold is raised before 90% usage and the safety target remains ≤75% in `specs/003-optimize-vercel-usage/evidence/cpu-budget.md`
- [x] T099 [US4] Separate shared page-render CPU from external content-fetch timing in `specs/003-optimize-vercel-usage/evidence/render-vs-fetch.md`
- [x] T100 [US4] Document unresolved evidence gaps without converting them into success-shaped assumptions in `specs/003-optimize-vercel-usage/evidence/open-gaps.md`
- [x] T101 [US4] Confirm every in-scope optimized path has a measurable before/after field matching `specs/003-optimize-vercel-usage/contracts/evidence-contract.md`

**Checkpoint**: The owner can classify within-budget, warning, or failed using one
privacy-safe, Production-only evidence set.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final release gates, documentation, and evidence retention.

- [x] T102 [P] Update performance and publication operational guidance in `specs/003-optimize-vercel-usage/quickstart.md`
- [x] T103 [P] Update `specs/003-optimize-vercel-usage/contracts/public-route-contract.md` if final measured behavior differs without changing accepted requirements
- [x] T104 [P] Update `specs/003-optimize-vercel-usage/contracts/api-workload-contract.md` with final endpoint inventory outcomes
- [x] T105 Re-run all unchecked reviewer items in `specs/003-optimize-vercel-usage/checklists/performance.md` against the final spec/plan/evidence and record findings inline
- [x] T106 Re-run `rtk pnpm lint` after all implementation work in `specs/003-optimize-vercel-usage/evidence/final-lint.md`
- [x] T107 Re-run `rtk pnpm build` after all implementation work in `specs/003-optimize-vercel-usage/evidence/final-build.md`
- [x] T108 Run the final focused browser regression suite without real order or quote submission in `specs/003-optimize-vercel-usage/evidence/final-browser.md`
- [x] T109 Verify no secrets, customer data, uploaded assets, order payloads, or sensitive URLs appear in `specs/003-optimize-vercel-usage/evidence/`
- [x] T110 Summarize completed success criteria and unresolved manual monitoring in `specs/003-optimize-vercel-usage/evidence/final-acceptance.md`
- [x] T111 Collect p95/p99 latency and request counts for the frozen five-route set plus `/search` in `specs/003-optimize-vercel-usage/evidence/latency-percentiles.md`
- [x] T112 Measure malformed, missing, and unavailable-content Active CPU against one normal request per route in `specs/003-optimize-vercel-usage/evidence/failure-cpu.md`
- [x] T113 Record external operation count and 10-minute freshness for each blog listing regeneration in `specs/003-optimize-vercel-usage/evidence/blog-refresh.md`
- [x] T114 Execute the class-specific protected API fixture matrix and retain pass/fail evidence in `specs/003-optimize-vercel-usage/evidence/protected-api-matrix.md`
- [x] T115 Calculate the SC-002 before/after aggregate Active CPU reduction for the frozen five-route set in `specs/003-optimize-vercel-usage/evidence/five-route-cpu.md`
- [x] T116 Record isolated search corpus refresh count, Production aggregate cold-start grouped reads, and deployment epoch in `specs/003-optimize-vercel-usage/evidence/search-production-refresh.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: Starts immediately and establishes immutable evidence.
- **Phase 2 Foundational**: Depends on T001–T006 and blocks all story work.
- **US1 (Phase 3)**: Depends on T007–T025 and is the recommended MVP.
- **US2 (Phase 4)**: Depends on the same foundation; route groups may run in
  parallel after the grouped-read contracts are stable.
- **US3 (Phase 5)**: Depends on relevant US1/US2 route changes and preserves
  user-facing/protected behavior.
- **US4 (Phase 6)**: Depends on deployed or locally reproducible outcomes from
  US1–US3; inventory tasks T091–T094 can begin earlier.
- **Polish (Phase 7)**: Depends on all desired stories and final evidence.

### User Story Dependencies

- **US1**: Independent MVP; no dependency on US2–US4.
- **US2**: Can proceed after foundation, with parallel search, Creativa,
  product, blog, and prefetch workstreams.
- **US3**: Integrates the outputs of US1/US2 but retains independent freshness
  and protected-flow acceptance scenarios.
- **US4**: Uses completed route outcomes for budget evidence; inventory setup is
  independently runnable.

### Within Each User Story

- Source migration/shared read shape before page integration.
- Route integration before browser/build evidence.
- Protected flow regressions before release evidence.
- No task may mark unavailable evidence as success.

### Parallel Opportunities

- Setup: T002–T006 can run in parallel.
- Foundation: T008, T009, T012 can run in parallel.
- US1: T026/T027 precede T028; T033 can proceed independently of contact work.
- US2: T043–T048 (search), T049–T054 (Creativa), T055–T065 (products),
  T066–T073 (blog/prefetch) are four parallel workstreams.
- US3: SEO, accessibility, analytics, and API fixture evidence can run in
  parallel after affected route implementation.
- US4: page inventory, API inventory, and evidence formatting can run in
  parallel until final normalization.

### Parallel Example: US2

```text
Agent A: T043–T048 in server/search/sources.ts and pages/search/index.tsx
Agent B: T049–T054 in pages/creativa/ and api-client/creativa-catalog.ts
Agent C: T055–T065 in pages/san-pham/ and api-client products/lighters
Agent D: T066–T073 in blog/header/home link surfaces
```

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Setup and Foundation (T001–T025).
2. Complete US1 contact and homepage P0 work (T026–T042).
3. **STOP and VALIDATE**: static `/contact`, one homepage CMS read, preserved
   visuals/navigation, and normalized P0 CPU evidence.
4. Deploy or proceed to US2 only if the MVP gates pass.

### Incremental Delivery

1. US1 removes P0 recurring compute.
2. US2 removes whole-project repeated public data work.
3. US3 validates publication/freshness and protected behavior.
4. US4 completes inventory and monthly budget evidence.
5. Polish preserves reviewer/release artifacts without broad refactors.

## Notes

- All tasks use exact paths.
- `[P]` means different files and no incomplete dependency conflict.
- Protected order/contact submissions are not automated by default.
- Evidence must remain free of secrets and customer, upload, order, or share data.
- A route not present in the 12-hour sample remains in scope if the repository
  audit confirms the same costly pattern.

## Phase 8: Convergence

- [x] T117 CRITICAL Block release acceptance until every measurable Production gate has retained evidence or an explicit failed/unverified result per Constitution V and FR-017 (partial)
- [x] T118 Replace the three Creativa unavailable-state `revalidate: 60` values with the approved bounded 24-hour refresh and urgent-publication behavior per FR-022 and SC-019 (contradicts)
- [x] T119 Change search response caching so stale corpus responses cannot remain visitor-visible beyond the approved 24-hour freshness limit per FR-021 and SC-018 (contradicts)
- [x] T120 Establish an approved comparable Production baseline/post window, retain normalized five-route CPU and monthly safety-budget results, and preserve a failed status if the required pre-implementation freeze cannot be proven per FR-001, FR-014, SC-001, SC-002, SC-004, and SC-009 (missing)
- [ ] T121 Capture Production p95/p99 latency, 5xx rate, malformed/missing/unavailable Active CPU, and separate content-fetch versus shared-render timing per SC-003, SC-005, SC-008, and FR-027 (missing)
- [ ] T122 Validate Production `/contact` Function invocations and CMS reads, the `/contact/form` 10-minute automatic request classes, and explicit Production/Preview/Development workload separation per SC-012, SC-013, SC-014, and SC-015 (missing)
- [ ] T123 Execute and retain Production normal-freshness, urgent-publication, search corpus refresh, and blog external-operation evidence per SC-006, SC-018, SC-019, and SC-021 (missing)
- [ ] T124 Execute the class-specific protected API fixture matrix in an isolated environment and retain authorization, method, response, retry/idempotency, and sensitive-data results per FR-025 and SC-022 (partial)

## Phase 9: Convergence

- [ ] T125 CRITICAL Capture and retain qualifying Production p95/p99 latency, 5xx, failure-class Active CPU, and separate render-versus-content-fetch evidence per Constitution V, SC-003, SC-005, SC-008, and FR-027 (missing)
- [ ] T126 Validate and retain Production-only `/contact` invocation and CMS-read counts, `/contact/form` automatic request classes, and Production/Preview/Development workload separation per SC-012, SC-013, SC-014, and SC-015 (missing)
- [ ] T127 Execute and retain Production normal-freshness, urgent Creativa/search publication, search cold-start/deployment-epoch, and blog regeneration operation evidence per SC-006, SC-018, SC-019, and SC-021 (missing)
- [ ] T128 Execute the protected API class-specific fixture matrix in an isolated environment and retain method, authorization, response, retry/idempotency, and sensitive-data outcomes per FR-025 and SC-022 (partial)

## Completion semantics for Production-only evidence

Tasks T014, T080–T081, and T095–T116 may record an explicit unknown where the required
Production deployment, retention window, route ranking, or metrics are
unavailable. Completing the evidence-recording task does not pass the associated
acceptance criterion. Never substitute local or All-Environments observations.
