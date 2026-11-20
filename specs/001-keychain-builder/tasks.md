---
description: "Implementation tasks for the Keychain Builder feature"
---

# Tasks: Keychain Builder

**Input**: Design documents from `/specs/001-keychain-builder/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/keychain-builder.md, quickstart.md

**Tests**: No TDD tasks are generated because the specification does not explicitly request test-first development. Validation tasks execute the prescribed behavior, API, geometry, browser, analytics, and lighter-regression checks.

**Organization**: Tasks are grouped by user story so each increment can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files with no dependency on incomplete work
- **[Story]**: Maps to US1–US5 in spec.md
- Every task includes the file path or paths it changes

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install compatible dependencies and establish the route, UI shell, and supplied demo/draft assets.

- [X] T001 Evaluate contour/union options, evaluate and pin `@imgly/background-removal`, and update `package.json` and `pnpm-lock.yaml` only with Next.js 12-compatible dependencies whose license terms are recorded in `docs/keychain-builder-release.md`
- [X] T002 [P] Copy the 18 supplied, unapproved demo/draft SVG inputs from `specs/001-keychain-builder/inputs/frames/` into `public/keychain/frames/` with stable filenames and no production approval metadata
- [X] T003 [P] Copy the 10 supplied PNG inputs from `specs/001-keychain-builder/inputs/ring/` into `public/keychain/rings/` with stable filenames
- [X] T004 Create the SEO page entry, MainLayout assignment, and no-SSR builder loading state in `pages/builder/keychain/index.tsx`
- [X] T005 Create the responsive dark-theme shell from `specs/001-keychain-builder/inputs/mockup-preview.png`, with desktop preview-left/control-right composition, mobile preview-before-controls flow, DEMO/disclaimer hierarchy, and site layout integration in `components/keychain-builder/KeychainBuilder.tsx`

**Checkpoint**: `/builder/keychain` renders through the existing layout without changing lighter-builder behavior.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared session state, catalogs, geometry, validation, rendering contracts, and privacy behavior required by every story.

**CRITICAL**: Complete this phase before beginning any user-story phase.

- [X] T006 Define `KeychainConfig`, face, transform, material, shape, geometry, revision, and API response types in `components/keychain-builder/types.ts`
- [X] T007 [P] Define the 18 frame records, demo metadata, estimated anchors, and 30–100 mm constraints in `data/keychain/frames.ts`
- [X] T008 [P] Define the 10 ring records, eight acrylic options, size catalog, and public asset paths in `data/keychain/catalog.ts`
- [X] T009 [P] Implement finite-number bounds, catalog lookups, transform limits, and legal acrylic/side/back-mode validation in `utils/keychain/validation.ts`
- [X] T010 Implement the in-memory reducer with initial clear acrylic, one-sided front design, view selection, and revision counters in `components/keychain-builder/hooks/useKeychainState.ts`
- [X] T011 Implement millimeter-space conversion, 4 mm hole reconstruction, frame scaling, and size-envelope checks in `components/keychain-builder/geometry/mm.ts`
- [X] T012 Implement SVG loading and normalization of `#cut`, `#print`, and `#hole` data into shared geometry inputs in `components/keychain-builder/geometry/frameSvg.ts`
- [X] T013 Define the shared front/back render-source model and one-time mirror direction rules in `components/keychain-builder/render/renderModel.ts`
- [X] T014 Implement retryable operation status, user-facing error messages, and stale-operation guards in `components/keychain-builder/hooks/useOperationStatus.ts`
- [X] T015 Implement allow-listed, privacy-safe keychain action tracking for GA4 and Umami in `utils/keychainAnalytics.ts`
- [X] T016 Establish the no-storage session boundary and reject localStorage, sessionStorage, IndexedDB, cookie, cache API, and persistent-worker restoration of design state in `components/keychain-builder/hooks/useKeychainState.ts`

**Checkpoint**: The shared catalogs and geometry/state contracts are complete, and all user stories can consume the same configuration without persistent browser storage.

---

## Phase 3: User Story 1 - Thiết kế và tải ảnh móc khóa (Priority: P1) — MVP

**Goal**: Let a mobile user configure a framed keychain, upload and transform the front image, preview it in 2D, and download a showcase PNG.

**Independent Test**: At 320–430 px, select a ring/frame/size/acrylic, upload a valid synthetic image, transform it, and download all six face/scope/scale combinations while the preview matches the PNG.

### Implementation for User Story 1

- [X] T017 [P] [US1] Build five numbered control groups in mockup order—shape/ring, front image, back, acrylic, Export—and expose ring, frame, size, eight acrylic options, edge, thickness, and sheen in `components/keychain-builder/controls/AppearanceControls.tsx`
- [X] T018 [P] [US1] Build a validated client upload input and progress/error presentation for PNG, JPEG, and WebP in `components/keychain-builder/controls/ImageUpload.tsx`
- [X] T019 [US1] Implement bounded 2D image pan, scale, rotate, flip controls, Fit, and Reset in `components/keychain-builder/hooks/useImageTransform.ts`
- [X] T020 [US1] Create the mockup-style canvas editor with front/back and 2D/3D toolbar slots, left-side edit tools, Fit/Reset controls, touch pointer capture isolated from page scrolling, and keyboard alternatives in `components/keychain-builder/preview/Preview2D.tsx`
- [X] T021 [US1] Render frame cut/print/hole geometry at physical proportions with the selected acrylic material in `components/keychain-builder/render/render2d.ts`
- [X] T022 [US1] Clip the transformed front image to the print region and composit the ring outside the charm without distorting the 4 mm hole in `components/keychain-builder/render/render2d.ts`
- [X] T023 [US1] Implement a shared anonymous-CORS Sanity image loader with negotiated-format fallback for iOS and rejection of tainted canvases in `components/keychain-builder/image/loadSanityImage.ts`, then reuse it from `components/keychain-builder/hooks/useImageUpload.ts`
- [X] T024 [US1] Implement `POST /api/keychain/uploads` with 10 MB/body limits, real image validation, process rate limiting, no sensitive logging, and a `200` response containing the Sanity image object plus an immediately usable public preview URL in `pages/api/keychain/uploads.ts`
- [X] T025 [US1] Add typed upload calls, the `{ image, url }` response shape, and safe response/error mapping in `api-client/keychain.ts`
- [X] T026 [US1] Render a viewport-independent PNG with transparent exterior, 100 px/cm baseline, 1x/2x/3x scaling, and full-keychain/charm-only scopes in `components/keychain-builder/render/renderPng.ts`
- [X] T027 [US1] Add PNG scope/scale selection, download state, and resource-limit fallback messaging in `components/keychain-builder/ExportDialog.tsx`
- [X] T028 [US1] Wire selection, upload, transform, view, and PNG-download actions to the reducer and safe analytics without duplicate events in `components/keychain-builder/KeychainBuilder.tsx`
- [X] T029 [US1] Adapt the mockup to mobile-safe stacked flow with preview first, ordered controls second, an accessible non-obscuring Export action, 44 px targets, 16 px inputs, safe-area spacing, and explicit illustration/non-production notices in `components/keychain-builder/KeychainBuilder.tsx`

**Checkpoint**: US1 is independently usable in 2D and can download correct PNGs even before persistence or 3D features exist.

---

## Phase 4: User Story 2 - Chọn và chỉnh mặt sau (Priority: P1)

**Goal**: Support the four valid clear-acrylic back modes, custom back images, opaque one-sided material, and the exact confirmation/reset behavior.

**Independent Test**: With asymmetric text art, verify all clear back modes, preserve a custom back across mode/opaque changes, cancel and confirm the opaque dialog, and confirm the opaque back is unprinted in 2D and PNG.

### Implementation for User Story 2

- [X] T030 [US2] Add print-side and acrylic-transition reducer actions that preserve front and custom-back image state in `components/keychain-builder/hooks/useKeychainState.ts`
- [X] T031 [P] [US2] Build the clear-acrylic side/back-mode controls and disable invalid opaque options in `components/keychain-builder/controls/BackControls.tsx`
- [X] T032 [P] [US2] Implement the exact warning copy, cancel, close, and confirm behavior for clear-to-opaque transitions in `components/keychain-builder/controls/OpaqueAcrylicDialog.tsx`
- [X] T033 [US2] Render through-acrylic and mirrored two-sided front art exactly once from the rear in `components/keychain-builder/render/renderModel.ts`
- [X] T034 [US2] Render the one-sided white back as a clipped, hole-excluding mask in `components/keychain-builder/render/render2d.ts`
- [X] T035 [US2] Add independent back-image upload, source/processed references, transform state, and stale-upload cancellation in `components/keychain-builder/hooks/useBackImage.ts`
- [X] T036 [US2] Build back-image cropping controls, crop warning, and separate edit/reset actions in `components/keychain-builder/controls/BackImageEditor.tsx`
- [X] T037 [US2] Add front/back preview switching while keeping the custom back at the user-authored orientation in `components/keychain-builder/preview/Preview2D.tsx`
- [X] T038 [US2] Apply the selected back mode and opaque material to PNG output without rendering hidden custom-back art for opaque acrylic in `components/keychain-builder/render/renderPng.ts`
- [X] T039 [US2] Enforce every acrylic/print-side/back-mode pair and custom-back requirements before UI transitions and submission in `utils/keychain/validation.ts`
- [X] T040 [US2] Track back-mode, print-side, custom-back, and acrylic-transition actions exactly once with allow-listed parameters in `utils/keychainAnalytics.ts`

**Checkpoint**: US2 satisfies all clear/opaque state transitions and preserves hidden custom-back edits for reuse.

---

## Phase 5: User Story 3 - Xem thiết kế từ nhiều góc (Priority: P2)

**Goal**: Provide a lazy 3D view that uses the same geometry and face content as 2D, without letting camera controls mutate the design.

**Independent Test**: Open an asymmetric framed design in 3D, rotate to both faces, compare it to 2D/PNG, then simulate WebGL failure and confirm a state-preserving return to 2D.

### Implementation for User Story 3

- [X] T041 [P] [US3] Create the dynamic no-SSR 3D entry component and lazy-load Three/R3F/Drei only when requested in `components/keychain-builder/preview/Preview3D.tsx`
- [X] T042 [P] [US3] Build a millimeter-scaled extruded charm mesh, bevel/edge material, and correctly subtracted 4 mm hole in `components/keychain-builder/preview/KeychainMesh.tsx`
- [X] T043 [US3] Create 2D-compatible front/back textures from the shared render model for the 3D mesh in `components/keychain-builder/render/render3dTexture.ts`
- [X] T044 [US3] Attach the selected ring PNG to a flat plane with the catalog anchor and fixed demo metadata in `components/keychain-builder/preview/RingPlane.tsx`
- [X] T045 [US3] Add orbit, zoom, Fit/Reset, reduced-motion, and demand-render controls that never modify design transforms in `components/keychain-builder/preview/Preview3D.tsx`
- [X] T046 [US3] Add WebGL/context-creation and runtime error fallback that preserves state and returns to 2D in `components/keychain-builder/preview/Preview3DFallback.tsx`
- [X] T047 [US3] Add the 2D/3D toggle, lazy-load loading status, and one-shot view-change analytics in `components/keychain-builder/KeychainBuilder.tsx`
- [X] T048 [US3] Dispose geometries, textures, canvas resources, and lazy 3D listeners on close/unmount in `components/keychain-builder/preview/Preview3D.tsx`

**Checkpoint**: The 3D preview is consistent with 2D/PNG and degrades cleanly without changing the edited design.

---

## Phase 6: User Story 4 - Tạo charm theo viền ảnh (Priority: P2)

**Goal**: Derive a valid die-cut contour from front-image alpha, support optional local background removal, and gate rendering/export on the latest geometry revision.

**Independent Test**: Use transparent, black/white-background, near multi-island, distant multi-island, and empty-alpha images; verify solid backgrounds are removed, near islands join within the cut border, distant islands and empty alpha fail safely, stale work cannot win, valid die-cut includes the ear/hole, and changing the back never changes the contour.

### Implementation for User Story 4

- [X] T049 [P] [US4] Implement bounded image alpha extraction and decoded-image/CORS failure handling in `components/keychain-builder/geometry/imageAlpha.ts`
- [X] T050 [P] [US4] Implement cut-border mask expansion and island joining, contour simplification, signed-area checks, distant-disjoint/empty rejection, and physical size normalization in `components/keychain-builder/geometry/dieCut.ts`
- [X] T051 [US4] Implement polygon union for the image silhouette plus ear and fixed 4 mm hole in `components/keychain-builder/geometry/dieCut.ts`
- [X] T052 [US4] Move contour extraction to an isolated revision-aware Web Worker entry in `components/keychain-builder/geometry/dieCut.worker.ts`
- [X] T053 [US4] Implement worker startup, cancellation, timeout, old-result rejection, and geometry-revision publication in `components/keychain-builder/hooks/useDieCutGeometry.ts`
- [X] T054 [US4] Add frame/die-cut shape controls, transparent-image guidance, and invalid-contour recovery actions in `components/keychain-builder/controls/ShapeControls.tsx`
- [X] T055 [US4] Recompute back-image crop after every front image/transform geometry change without using the back image to derive the cut in `components/keychain-builder/geometry/dieCut.ts`
- [X] T056 [US4] Dynamically import `@imgly/background-removal` only on demand and keep processing local in `components/keychain-builder/image/removeBackground.ts`
- [X] T057 [US4] Preserve original/processed image references, expose Use Original/Use Processed, and discard stale results in `components/keychain-builder/hooks/useBackgroundRemoval.ts`
- [X] T058 [US4] Add front/back background-removal status, retry, reuse-original, and unsupported-device guidance in `components/keychain-builder/controls/RemoveBackground.tsx`
- [X] T059 [US4] Block 2D/3D/PNG export until the latest valid die-cut geometry revision is ready and surface worker/processing errors without losing state in `components/keychain-builder/KeychainBuilder.tsx`
- [X] T060 [US4] Feed valid die-cut geometry into 2D, 3D, and PNG renderers through the shared millimeter model in `components/keychain-builder/render/renderModel.ts`

**Checkpoint**: Die-cut produces validated, latest-revision geometry across all renderers, with optional recoverable local background removal.

---

## Phase 7: User Story 5 - Export và mở lại thiết kế (Priority: P2)

**Goal**: Persist immutable snapshots after successful Export, reopen them by link in a fresh session, preserve retry idempotency, and sanitize all analytics paths.

**Independent Test**: Export a synthetic two-sided design, reopen it on a clean browser, edit and Export again, verify the old link remains unchanged, retry the same request without duplication, and verify deleted/invalid links and all analytics requests are safe.

### Implementation for User Story 5

- [X] T061 [P] [US5] Define the Sanity v2 `keychainDesign` document with immutable config, image references, request ID/fingerprint, and timestamp in `sanity/schemas/keychainDesign.js`
- [X] T062 [US5] Register `keychainDesign` without altering existing lighter schemas in `sanity/schemas/schema.js`
- [X] T063 [US5] Implement strict server config, UUID, image-reference, finite-bound, and 4 mm-hole validation using shared catalog/version rules in `utils/keychain/serverValidation.ts`
- [X] T064 [US5] Implement deterministic request fingerprinting that excludes transient view/camera state in `utils/keychain/requestFingerprint.ts`
- [X] T065 [US5] Add server-only immutable create-if-absent, request replay comparison, and direct-read helpers in `api-client/keychain-server.ts`
- [X] T066 [US5] Implement `POST /api/keychain/designs` with `201`, `400`, `409`, `413`, `429`, and `500` contracts plus retry idempotency in `pages/api/keychain/designs/index.ts`
- [X] T067 [US5] Implement `GET /api/keychain/designs/[id]` with direct Sanity reads, `Cache-Control: no-store`, `400`, `404`, and `500` behavior in `pages/api/keychain/designs/[id].ts`
- [X] T068 [US5] Add typed snapshot create/read methods and Vietnamese retryable error mapping in `api-client/keychain.ts`
- [X] T069 [US5] Implement one Export action that waits for uploads and latest geometry, saves the snapshot before returning a link, and downloads the already-rendered PNG only after success in `components/keychain-builder/hooks/useExportDesign.ts`
- [X] T070 [US5] Generate one random request UUID per Export action and reuse it only for retries of that unchanged fingerprint in `components/keychain-builder/hooks/useExportDesign.ts`
- [X] T071 [US5] Add copy/open link controls and never show a link as successful before the POST snapshot response in `components/keychain-builder/ExportDialog.tsx`
- [X] T072 [US5] Read `?design=<id>` on route entry and load snapshot data into a new session with 2D selected by default in `components/keychain-builder/hooks/useLoadDesign.ts`
- [X] T073 [US5] Restore front, custom back, acrylic/material, shape, transforms, and image references from a valid snapshot without patching the source document in `components/keychain-builder/hooks/useLoadDesign.ts`
- [X] T074 [US5] Keep editing session-only: remove all design/link/image persistence from browser storage while allowing an explicit exported URL to hydrate once in `components/keychain-builder/hooks/useKeychainState.ts`
- [X] T075 [US5] Show unavailable/deleted/invalid link errors and a clear “start new design” path without rendering stale or partial configuration in `components/keychain-builder/KeychainBuilder.tsx`
- [X] T076 [US5] Sanitize keychain page paths, query strings, referrers, asset URLs, design IDs, and request/link identifiers in `utils/keychain/privacy.ts`
- [X] T077 [US5] Integrate keychain-safe URLs into initial and SPA GA4/GTM page views without adding duplicate page-view events in `pages/_app.tsx` and `components/scripts/google-tag-manager.tsx`
- [X] T078 [US5] Integrate keychain-safe Umami and Vercel page/location behavior while preserving analytics-disabled operation in `pages/_app.tsx` and `pages/_document.tsx`

**Checkpoint**: Export creates immutable, retry-safe snapshots; links restore clean sessions; analytics never emit images, URLs, links, design IDs, or query data.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Document evidence, validate acceptance criteria, and protect existing lighter/checkout behavior before release.

- [X] T079 [P] Create synthetic, non-personal geometry/API/browser fixtures for frame directions, face modes, opaque colors, transparent/empty/multi-island images, and retry fingerprints in `public/keychain/fixtures/`
- [X] T080 Create focused geometry and configuration checks for 18 frames × eight sizes, 4 mm holes, legal modes, disjoint contours, and latest-revision rejection in `scripts/tests/keychain-geometry.test.mjs`
- [X] T081 Create focused render checks for mirrored faces, opaque backs, acrylic material, 2D/3D texture parity, CORS/tainted-canvas failure, and all six PNG variants in `scripts/tests/keychain-render.test.mjs`
- [X] T082 Create API and lifecycle checks for upload URL usability, validation errors, idempotent retry/conflict behavior, immutable snapshots, 30/90/365-day simulated reads, manual deletion, invalid links, and shared asset retention in `scripts/tests/keychain-api.test.mjs`
- [X] T083 Create privacy and analytics checks for initial/SPA page views, one emission per action/system, disabled providers, allow-listed properties, and absent image/link/design/query/referrer payloads in `scripts/tests/keychain-privacy.test.mjs`
- [X] T084 Run the four focused Node suites with `rtk proxy node --test --import ./scripts/register-typescript-loader.mjs ./scripts/tests/keychain-*.test.mjs` and resolve each suite's failures in `scripts/tests/keychain-*.test.mjs`
- [X] T085 Add and execute browser automation for 320/360/390/430 px, desktop preview-left/control-right hierarchy, mobile preview-first control order, keyboard controls, 44 px targets, 16 px inputs, safe area, landscape, page scrolling, WebGL fallback, and all six exports in `scripts/test-keychain-browser.mjs`
- [ ] T086 Execute the mobile browser flow on one recorded Android Chrome model and one recorded iPhone/iOS Safari model; verify CORS-safe canvas/PNG at 3x, iOS image negotiation, reduced motion, and no horizontal overflow in `docs/keychain-builder-evidence/mobile-browser.md`
- [ ] T087 Measure drag/pinch performance with ≤2048 px images for fixed-frame and die-cut designs on the recorded Android and iPhone; require at least 30 FPS and record model, browser, sample duration, FPS, and resource limits in `docs/keychain-builder-evidence/performance.md`
- [X] T088 Run `rtk pnpm lint` and fix only regressions or issues attributable to Keychain Builder files in `components/keychain-builder/`, `pages/api/keychain/`, `pages/builder/keychain/`, `utils/keychain/`, `scripts/tests/`, and `sanity/schemas/keychainDesign.js`
- [X] T089 Run `rtk pnpm build` and resolve Keychain Builder bundle, SSR, type, worker, route, and test-only import failures without weakening checks in `next.config.js` or `tsconfig.json`
- [X] T090 Execute the lighter upload/cart/order regression command from `scripts/test-lighter-builder.sh` and preserve `inut-lighters-cart`, pricing, order payloads, and unique Sanity `_key` values in `components/lighter-builder/` and `utils/`
- [ ] T091 Verify the selected IMG.LY package, model, deployment environment, redistribution, and production-use terms with the responsible owner before enabling public background removal, and record the decision and package version in `docs/keychain-builder-release.md`
- [X] T092 Document measured mobile/device/browser outcomes, 3x ring quality, public-asset behavior, retention/manual deletion evidence, and remaining release gates in `docs/keychain-builder-release.md`
- [X] T093 Document GA4/GTM, Umami, Vercel, unauthenticated public-asset, and no-ID/privacy verification commands and evidence in `docs/ANALYTICS_GUIDE.md`
- [X] T094 Define and verify a cross-preview no-auto-motion and `prefers-reduced-motion` policy for 2D controls, lazy 3D, loading indicators, and optional animation playback in `components/keychain-builder/KeychainBuilder.tsx` and `scripts/tests/keychain-render.test.mjs`

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1: Setup
    ↓
Phase 2: Foundational
    ↓
 ┌────────────┬────────────┬────────────┬────────────┐
 │ US1 (P1)   │ US2 (P1)   │ US3 (P2)   │ US4 (P2)   │
 └─────┬──────┴──────┬─────┴──────┬─────┴──────┬─────┘
       └─────────────┴────────────┴────────────┘
                         ↓
                     US5 (P2)
                         ↓
             Polish & Cross-Cutting
```

- **Setup**: No prerequisites.
- **Foundational**: Depends on Setup and blocks every user story.
- **US1**: Can complete independently after Foundation; supplies the 2D and PNG baseline used by later stories.
- **US2**: Depends on Foundation and integrates with US1's 2D/PNG renderers.
- **US3**: Depends on Foundation and US1's shared geometry/face render model; remains optional at runtime through lazy loading.
- **US4**: Depends on Foundation and US1's image/render pipeline; US2 custom-back crop behavior is integrated without reverse dependency on the contour.
- **US5**: Depends on Foundation and the configuration outputs of US1–US4; a framed, non-3D, non-die-cut design can still be snapshotted.
- **Polish**: Depends on all desired story work and validates the existing lighter path remains intact.

### User Story Completion Order

1. **US1 (P1)**: First MVP slice; supports fixed-frame design and local PNG export.
2. **US2 (P1)**: Adds the remaining face/acrylic combinations and reset preservation.
3. **US3 or US4 (P2)**: Independent visual extensions after US1/US2; can be parallelized by separate developers.
4. **US5 (P2)**: Adds immutable persistence and reopen-by-link after the canonical config is stable.
5. **Polish**: Completes measurement, privacy, analytics, and lighter regression evidence.

### Parallel Opportunities

- Setup can copy frame assets and ring assets concurrently after T001.
- Foundational catalog, frame metadata, validation, and analytics modules can proceed concurrently after T006 establishes types.
- US1 `AppearanceControls`, `ImageUpload`, and PNG/export UI modules can proceed after the corresponding state/render contracts are stable.
- US2 controls and modal UI can proceed in parallel with independent back-render model work.
- US3 3D entry and mesh files can proceed in parallel after shared geometry is stable.
- US4 alpha extraction and contour utilities can proceed in parallel before worker integration.
- US5 schema and client/server validation can proceed in parallel after `types.ts` and `validation.ts` are stable.
- Polish fixture creation and the four focused Node suites can proceed in parallel, followed by browser and device execution.
- Mobile browser and performance evidence can be collected in parallel on separate approved devices, followed by documentation and release-gate review.

---

## Parallel Example: User Story 1

```text
Task T017: AppearanceControls.tsx
Task T018: ImageUpload.tsx
Task T026: renderPng.ts
Task T027: ExportDialog.tsx
```

These files do not share incomplete dependencies once `types.ts`, `catalog.ts`, and the reducer contract from Phase 2 are complete.

## Parallel Example: User Story 2

```text
Task T031: BackControls.tsx
Task T032: OpaqueAcrylicDialog.tsx
Task T033: renderModel.ts mirror logic
```

The controls and dialog can be built in parallel with the non-UI render-model change, then integrated sequentially.

## Parallel Example: User Story 5

```text
Task T061: sanity/schemas/keychainDesign.js
Task T063: utils/keychain/serverValidation.ts
Task T064: utils/keychain/requestFingerprint.ts
```

After the shared types and catalog are stable, schema, validation, and fingerprint modules can be authored independently.

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: US1 and validate fixed-frame PNG design on mobile.
4. Complete Phase 4: US2 and validate every acrylic/back-mode transition.
5. **STOP and VALIDATE**: Demo the mobile builder with the complete 2D material and back-face contract.

### Incremental Delivery

1. Add US3 to enable lazy 3D without changing the base 2D path.
2. Add US4 to enable worker-based die-cut and optional local background removal.
3. Add US5 to make successful exports immutable and reopenable.
4. Complete Polish to verify focused geometry/render/API/privacy suites, browser/device behavior, retention, IMG.LY license coverage, lint/build, and lighter regression.

### Release Constraints

- Do not describe the demo rings, SVG frames, preview, or PNG as production-cut files.
- Do not add login, checkout, cart, or persistent browser design storage.
- Do not move Sanity write tokens into browser code or alter lighter upload/order contracts.
- Do not treat public asset URLs or opaque design IDs as authorization.
- Complete data-protection, IMG.LY license, asset-rights, mobile-performance, and ring/frame production checks before public release.

## Notes

- `[P]` means parallelizable without changing the same file or relying on an incomplete task.
- Story labels identify the user story responsible for the task; Setup, Foundational, and Polish phases intentionally have none.
- All geometry is expressed in millimeters; screen pixels and device DPR never define physical hole or charm dimensions.
- PNG export is showcase-only, uses a transparent exterior, and must never silently lower the requested scale.
- Every Export creates a new immutable snapshot; only retries with the same request ID and unchanged fingerprint can return the prior result.
- Keychain analytics must remain dual GA4 + Umami, de-duplicated, and free of image/link/design/query identifiers.

## Phase 9: Convergence

- [X] T095 **CRITICAL** Restore the focused verification baseline by fixing the failing snapshot lifecycle fixture and canvas render fixture/implementation mismatch, then rerun `rtk proxy node --test --import ./scripts/register-typescript-loader.mjs ./scripts/tests/keychain-*.test.mjs` until all suites pass and refresh the completion evidence for T084 in `scripts/tests/keychain-*.test.mjs` and `docs/keychain-builder-release.md` per Constitution V (partial)
- [X] T096 Re-enable the current lazy 3D preview control, preserve a working WebGL-to-2D fallback, and add source/browser regression checks plus retained evidence for both faces and camera-only interaction in `components/keychain-builder/preview/Preview2D.tsx`, `components/keychain-builder/preview/Preview3D.tsx`, `scripts/test-keychain-browser.mjs`, and `docs/keychain-builder-evidence/browser-viewports.md` per US3, FR-009, and T041–T048 (partial)
- [X] T097 Add usable edge, thickness, and sheen controls to the material panel and verify that all three values affect 2D/3D/PNG behavior and persisted snapshots in `components/keychain-builder/controls/AppearanceControls.tsx`, `components/keychain-builder/render/`, `scripts/tests/keychain-*.test.mjs`, and `docs/keychain-builder-release.md` per US1/AC5 and FR-023 (partial)
- [X] T098 Enforce at least 44×44 CSS px touch targets for every mobile builder action (including preview tools, size, frame/ring, acrylic, back-mode, upload, remove-background, and material controls) and strengthen the browser assertion to report offending elements in `components/keychain-builder/`, `scripts/test-keychain-browser.mjs`, and `docs/keychain-builder-evidence/browser-viewports.md` per FR-018 and T029/T085 (partial)
- [X] T099 Gate PNG Export and every snapshot-creating action on both front and custom-back upload/processing completion, block local/blob-only or stale image references, and add regression coverage in `components/keychain-builder/KeychainBuilder.tsx`, `components/keychain-builder/hooks/useExportDesign.ts`, and `scripts/tests/keychain-*.test.mjs` per FR-013–FR-014 (partial)
- [X] T100 Resolve the pre-Export quote-request path in `components/keychain-builder/ExportDialog.tsx`, `pages/api/quote-request.ts`, `components/contact/QuoteRequestForm.tsx`, and `sanity/schemas/formNhanBaoGia.js`: remove it or add an approved spec/plan/task amendment and preserve the rule that a link/snapshot is not promised before successful Export per FR-014 and FR-024 (unrequested)
- [X] T101 Restore an explicit independent custom-back crop/editor experience with aspect-ratio preservation, crop status, edit/reset controls, and stale-state recovery in `components/keychain-builder/controls/`, `components/keychain-builder/hooks/useBackImage.ts`, and `components/keychain-builder/preview/Preview2D.tsx`, with focused checks matching T036 and US2/AC4–5 (partial)
- [X] T102 Refresh `scripts/test-keychain-browser.mjs` against the current five-group DOM and enabled 3D control, retain actual command output for viewport, upload/die-cut, six Export variants, WebGL fallback, and reduced-motion checks, and update `docs/keychain-builder-evidence/browser-viewports.md` without overstating mocked Sanity or device coverage per T085–T086 and Constitution V (partial)
- [X] T103 Synchronize the feature documentation to current implementation and evidence: update constitution status and five focused suites in `specs/001-keychain-builder/{plan,research,quickstart,contracts/keychain-builder,data-model,analysis,checklists/requirements}.md`; list actual source modules, solid-background removal, quote-flow disposition, remaining T086/T087/T091 gates, and verified/pending evidence in `docs/keychain-builder-release.md`; keep `spec.md` as the governing intent rather than rewriting requirements to match gaps per Constitution I and V (partial)
- [ ] T104 **NEXT ENHANCEMENT — DEFERRED BY USER** Resolve the remaining 3D frame/artwork silhouette mismatch at oblique viewing angles in `components/keychain-builder/preview/KeychainMesh.tsx` and `components/keychain-builder/geometry/`. Compare the same uploaded asymmetric artwork and SVG cut/print paths in 2D and 3D; retain one visually unified frame with physical thickness, do not cover the design with an opaque duplicate face, and require fresh desktop browser visual acceptance before marking complete. Current cap-material experiment is not accepted as final evidence. Resume after the user's higher-priority work.
