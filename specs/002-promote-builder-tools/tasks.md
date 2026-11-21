# Tasks: Promote Builder Tools

**Input**: Design documents from `/specs/002-promote-builder-tools/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/builder-promotion.md, quickstart.md

**Tests**: Focused static contract checks and browser evidence are required by the approved plan, quickstart, constitution, and release-review checklist. No new test framework is introduced.

**Constitution Gates**: Tasks include privacy-safe analytics, de-duplication, accessibility, responsive behavior, image-failure behavior, lint/build validation, and evidence for all browser-visible claims.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches a different file and has no dependency on an incomplete task
- **[Story]**: Maps the task to US1, US2, or US3
- Every implementation task includes an exact repository path

---

## Phase 1: Setup (Shared Preparation)

**Purpose**: Establish the executable contract checks and preserve evidence locations before implementation

- [X] T001 Create the focused contract-test harness for Builder count, ID/route order, Hero label/destination, and analytics allow-lists in `scripts/tests/builder-promotion.test.mjs`
- [X] T002 [P] Create the browser-evidence directory `docs/builder-promotion-evidence/` and add `.gitkeep` so later responsive, accessibility, fallback, and analytics evidence have a stable location

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the canonical Builder model and privacy-safe event contract before any UI story is implemented

**⚠️ CRITICAL**: No user story work can begin until the canonical data and analytics tasks are complete

- [X] T003 Define the shared Builder ID, title, description, image, badge, and priority shape with Keychain first and exact `/builder/keychain` and `/builder/lighters` destinations in `data/builders.ts`
- [X] T004 [P] Implement fixed Builder action, placement, and event-property types plus runtime allow-listing for `builder_id`, `placement`, and `action` in `utils/builderAnalytics.ts`
- [X] T005 Wire the Builder analytics helper to emit exactly once per call to both existing GA4/GTM and Umami wrappers while isolating unavailable-provider and provider-exception failures in `utils/builderAnalytics.ts`
- [X] T006 [P] Export the Builder analytics helper through `utils/index.ts` for repository-standard imports
- [X] T007 Update `scripts/tests/builder-promotion.test.mjs` to assert exactly two canonical definitions, Keychain-first priority, exact routes, Hero CTA contract, fixed analytics values, and no payload property outside the allow-list
- [X] T008 Run `node scripts/tests/builder-promotion.test.mjs` and confirm the expected failure against the still-unimplemented Hero and promotion UI before proceeding, retaining the failure context in `docs/builder-promotion-evidence/contract-baseline.md`

**Checkpoint**: Canonical content and analytics contracts exist, and the focused contract test is ready to drive UI implementation.

---

## Phase 3: User Story 1 - Recognize and Enter the Builder Area from the Hero (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor sees “Tự thiết kế ngay” in the Hero and reaches `/builder` in one same-tab action

**Independent Test**: At 360 px and 1440 px, read the primary Hero CTA as “Tự thiết kế ngay”, activate it once, and arrive at `/builder`; analytics records one overview click per available provider without blocking navigation

### Implementation for User Story 1

- [X] T009 [US1] Replace the Hero primary CTA label with “Tự thiết kế ngay”, set its default destination to `/builder`, and preserve the quote CTA as the secondary action in `components/home/hero.tsx`
- [X] T010 [US1] Add a Hero-specific click handler that emits `builder_promotion_click` with `builder_id: overview`, `placement: home_hero`, and `action: click`, without preventing ordinary link navigation, in `components/home/hero.tsx`
- [X] T011 [P] [US1] Add a release-review note defining the objective first-screen visibility and label/destination hierarchy for the Hero CTA in `specs/002-promote-builder-tools/checklists/release-review.md`
- [X] T012 [US1] Validate the Hero journey and event contract with browser evidence at 360 px and 1440 px, recording CTA visibility, exact label, route, keyboard activation, and one-event-per-provider counts in `docs/builder-promotion-evidence/hero.md`

**Checkpoint**: US1 is independently usable and testable: the Hero promotes Builder access and opens `/builder` without changing either Builder.

---

## Phase 4: User Story 2 - Compare Both Builders on the Homepage (Priority: P2)

**Goal**: Users see a Keychain-first two-Builder promotion after the first homepage content section and can open either exact Builder route directly

**Independent Test**: At 360 px and 1440 px, verify the homepage promotion follows `#featured-gift-products` and precedes services, reads Keychain before Lighter, exposes a text “Mới” marker, preserves useful text when images fail, and records one impression/click per placement/provider

### Implementation for User Story 2

- [X] T013 [US2] Create the reusable homepage Builder promotion component with two cards, Keychain-first visual and DOM order, text “Mới” badge, fixed image geometry, meaningful link names, and direct card destinations in `components/home/builder-promotion.tsx`
- [X] T014 [US2] Add visible focus treatment, single-primary-link keyboard behavior, responsive stacking, and reduced-motion-safe hover/image transitions to `components/home/builder-promotion.tsx`
- [X] T015 [US2] Add once-per-mounted-placement impression tracking for the `home_feature` placement using an `IntersectionObserver` ref guard and the allow-listed analytics helper in `components/home/builder-promotion.tsx`
- [X] T016 [US2] Add direct click tracking for each card with its canonical Builder ID and `home_feature` placement in `components/home/builder-promotion.tsx`
- [X] T017 [P] [US2] Export the Builder promotion component from `components/home/index.ts`
- [X] T018 [US2] Render the Builder promotion after `ServiceChildrenGrid` and before `ServicesSection`, preserving the remaining homepage section order in `pages/index.tsx`
- [X] T019 [US2] Simulate failed thumbnails and validate stable geometry, readable title/description/badge, direct routes, 360/768/1440 px layout, reduced motion, and keyboard order, retaining evidence in `docs/builder-promotion-evidence/home-promotion.md`

**Checkpoint**: US2 works independently on the homepage with direct Keychain and Lighter destinations, accessible priority, resilient imagery, and de-duplicated dual analytics.

---

## Phase 5: User Story 3 - Keep Builder Access Consistent Beyond the Homepage (Priority: P3)

**Goal**: Users who enter through navigation or `/builder` see the same Keychain-first names, descriptions, badge state, and destinations

**Independent Test**: Open `/builder` from the existing site navigation, confirm exactly two cards in Keychain/Lighter order with matching homepage content and direct routes, and confirm `builder_index` impressions/clicks follow the same analytics contract

### Implementation for User Story 3

- [X] T020 [US3] Replace the `/builder` page's direct `ServiceCard` mapping with the shared Builder promotion component while preserving SEO, breadcrumbs, layout, and the page's existing two-route scope in `pages/builder/index.tsx`
- [X] T021 [US3] Pass `builder_index` placement into the shared promotion so impressions and clicks are distinguishable from homepage promotion events in `components/home/builder-promotion.tsx` and `pages/builder/index.tsx`
- [X] T022 [US3] Confirm the existing “Tự thiết kế” navigation entry remains present and points to `/builder`; update only its metadata copy or “Mới” badge if needed for consistency with the canonical Builder content in `components/common/header/routes.ts`
- [X] T023 [US3] Compare homepage and `/builder` titles, descriptions, badge state, order, accessible names, and exact routes in browser evidence, and record navigation entry behavior plus `builder_index` analytics counts in `docs/builder-promotion-evidence/builder-index.md`

**Checkpoint**: All three discovery paths are consistent and users can enter the Builder group from the existing navigation or the updated Hero, then choose either direct Builder destination.

---

## Phase 6: Polish & Cross-Cutting Release Gates

**Purpose**: Complete documentation, executable validation, and retained evidence for the full feature

- [X] T024 [P] Document `builder_promotion_view` and `builder_promotion_click`, including allowed Builder IDs, placements, action values, privacy exclusions, and one-per-provider expectations in `docs/ANALYTICS_GUIDE.md`
- [X] T025 [P] Update `specs/002-promote-builder-tools/quickstart.md` if implementation evidence introduces command or browser-observation changes, while keeping routes and expected event schema unchanged
- [X] T026 Run `node scripts/tests/builder-promotion.test.mjs` and record the passing contract result in `docs/builder-promotion-evidence/contract-final.md`
- [X] T027 Run `pnpm lint` and record the complete result, including any unrelated pre-existing failure, in `docs/builder-promotion-evidence/lint.md`
- [X] T028 Run `pnpm build` and record the complete result, generated-route status, and any environment-related blocker in `docs/builder-promotion-evidence/build.md`
- [X] T029 [P] Review each modified UI file for grounded copy and verify no new price, MOQ, delivery, login, or production claim appears in `components/home/hero.tsx`, `components/home/builder-promotion.tsx`, and `pages/builder/index.tsx`
- [X] T030 [P] Review analytics emissions for fixed allow-listed properties and de-duplication across initial render, rerender, observer re-entry, mouse, touch, keyboard, SPA return, and provider failure in `utils/builderAnalytics.ts` and `components/home/builder-promotion.tsx`
- [X] T031 Complete the formal release checklist and annotate any unresolved ambiguity or conflict as release-blocking in `specs/002-promote-builder-tools/checklists/release-review.md`
- [X] T032 Capture a concise cross-viewport browser summary covering Hero, homepage promotion, `/builder`, image fallback, keyboard order, reduced motion, and exact analytics event counts in `docs/builder-promotion-evidence/release-summary.md`
- [X] T033 Review `components/home/hero.tsx`, `components/home/builder-promotion.tsx`, `pages/index.tsx`, `pages/builder/index.tsx`, `utils/builderAnalytics.ts`, and `data/builders.ts` to confirm no Builder state, cart, checkout, contact, pricing, or order contract was changed, and record that review in `docs/builder-promotion-evidence/compatibility.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001 and T002 can run in parallel
- **Foundational (Phase 2)**: Depends on T001; T003–T006 define the contracts, T007 refines the harness, and T008 proves the pre-implementation baseline
- **US1 (Phase 3)**: Depends on Foundational completion
- **US2 (Phase 4)**: Depends on Foundational completion and can proceed after or alongside US1
- **US3 (Phase 5)**: Depends on the shared component from T013–T016
- **Polish (Phase 6)**: Depends on all desired story increments

### User Story Dependencies

- **US1 (P1)**: Independent after Foundation; delivers the MVP Hero-to-`/builder` journey
- **US2 (P2)**: Uses the same canonical data and analytics as US1 but is independently testable on the homepage
- **US3 (P3)**: Reuses the US2 shared component, then verifies consistency across `/builder` and navigation

### Within Each User Story

- Contracts and canonical data before UI integration
- Component behavior before page insertion
- Page insertion before browser evidence
- Analytics documentation and final evidence after all UI work
- No story claims completion from static checks alone

### Parallel Opportunities

- T001 and T002 can run in parallel
- T003, T004, and T006 can start together once the file responsibilities are understood; T005 follows T004 in the same analytics file
- T011 can be prepared in parallel with US1 implementation
- T017 can run in parallel with final component work because it only updates the export barrel after the component path exists
- T024, T025, T029, and T030 can run in parallel after implementation is stable
- T027 and T028 should run sequentially only if the lint/build evidence workflow requires the same environment; otherwise they may run independently after story completion

---

## Parallel Example: User Story 2

```text
Agent A: T013–T016 in components/home/builder-promotion.tsx
Agent B: T017 in components/home/index.ts after the component path is stable
Agent C: T019 browser-evidence scenario design in docs/builder-promotion-evidence/home-promotion.md after the UI is integrated
```

## Parallel Example: Final Release Evidence

```text
Agent A: T024 analytics documentation in docs/ANALYTICS_GUIDE.md
Agent B: T029 claim and copy review across specified UI files
Agent C: T030 analytics privacy and de-duplication review in specified analytics/component files
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 and Phase 2
2. Complete US1
3. Validate the Hero CTA, `/builder` route, keyboard operation, and exact dual analytics counts
4. Stop for review before adding the homepage comparison section

### Incremental Delivery

1. Add the canonical Builder/analytics foundation
2. Deliver US1: Hero-to-overview discovery
3. Deliver US2: Keychain-first homepage comparison and direct destinations
4. Deliver US3: `/builder` and navigation consistency
5. Complete release gates, docs, and browser evidence

### Release Gate

The feature is ready only when:

- contract checks pass;
- lint and production build pass or expose a documented unrelated blocker;
- the Hero and direct Builder routes are correct;
- 360/768/1440 px browser evidence has no horizontal overflow or obscured actions;
- keyboard order and the text “Mới” are retained;
- failed images and disabled analytics do not block content or navigation;
- GA4/GTM and Umami event counts and allow-listed payloads match the contract;
- no protected commerce or Builder-state contract changed.

---

## Notes

- Task IDs are sequential and every task has an exact file path
- `[P]` tasks touch different files or independent evidence artifacts
- `[US1]`, `[US2]`, and `[US3]` labels map directly to the specification stories
- Static checks supplement but never replace responsive, keyboard, fallback, and analytics browser evidence
- Preserve existing user work and stop if a target file has conflicting concurrent changes
- Do not create real orders or expose uploaded design/customer data while validating this feature
