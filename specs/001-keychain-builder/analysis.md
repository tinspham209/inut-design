# Specification Analysis Report: Keychain Builder

**Scope**: `spec.md`, `plan.md`, `tasks.md`, and `.specify/memory/constitution.md`

## Post-implementation convergence (2026-11-20)

The original design-time analysis below is retained as historical evidence.
Current convergence compares the present source and evidence with the same
governing intent:

| Finding | Gap | Severity | Current disposition |
|---------|-----|----------|---------------------|
| F1 | Focused Node suite is 21/23 pass while T084 is marked complete | CRITICAL | T095 |
| F2 | Lazy 3D modules exist but the 3D control is disabled | HIGH | T096 |
| F3 | Edge/sheen state and render support lack complete UI controls | HIGH | T097 |
| F4 | Several mobile controls remain below 44×44 px despite historical evidence | HIGH | T098 |
| F5 | Custom-back upload is not consistently included in Export/save gating | HIGH | T099 |
| F6 | Quote CTA creates a snapshot before PNG Export and was not in original intent | HIGH | T100 |
| F7 | T036's independent back-image editor/crop warning is not present | MEDIUM | T101 |
| F8 | Browser regression selectors/evidence do not match current DOM/state | MEDIUM | T102 |
| F9 | Spec Kit and release docs contain stale constitution, suite and completion claims | MEDIUM | T103 |

**Current metrics:** 40 buildable FR/SC items and 29 acceptance scenarios
reviewed; 9 core plan decisions and 5 constitution principles checked. Phase 9
contains 9 traceable remediation tasks. Existing release gates T086, T087 and
T091 remain open. No requirements were rewritten to match implementation gaps.
T103 updates documentation and is not a release-pass claim for T095–T102.

## Original design-time analysis (2026-11-18)

## Remediation Status

| Finding | Status | Resolution |
|---------|--------|------------|
| A1 | Resolved | `.specify/memory/constitution.md` is ratified at v1.0.0 with five testable principles and synchronized plan/spec/task gates. |
| C1 | Resolved in plan | `tasks.md` adds executable responsive/browser/device checks and retained Android/iPhone FPS evidence in T085–T087. |
| C2 | Resolved in plan | T082 defines 30/90/365-day lifecycle, manual deletion, invalid-link, and shared-asset retention checks; T092 requires retained evidence. |
| C3 | Resolved in plan | T024–T025 require `{ image, url }`; T082 verifies direct unauthenticated URL use for Canvas/3D/PNG. |
| C4 | Resolved in plan | T023 requires one CORS-safe loader with iOS negotiation and tainted-canvas handling; T081/T086 verify render and Safari behavior. |
| D1 | Resolved in plan | T001 pins and records `@imgly/background-removal`; T091 is a blocking owner license/deployment decision gate. |
| A2 | Resolved in plan | T080–T083 split geometry, render, API/lifecycle, and privacy suites; T084 executes them separately with focused failures. |
| I1 | Resolved | T002 now identifies all 18 supplied SVGs as unapproved demo/draft assets and forbids production approval metadata. |
| C5 | Resolved in plan | T094 defines and verifies a global no-auto-motion and reduced-motion policy across 2D, 3D, loading, and optional playback. |
| C6 | Resolved | T016 explicitly prohibits localStorage, sessionStorage, IndexedDB, cookies, Cache API, and persistent-worker restoration. |
| D2 | Resolved | FR-024 now references the canonical save-before-link rule in FR-014 instead of duplicating it. |
| I2 | Resolved | The earlier restricted-access clarification is explicitly marked as superseded by the later public-asset clarification. |

These historical resolutions closed design-level coverage gaps at planning
time. They do not supersede the post-implementation convergence findings above.

`inputs/mockup-preview.png` is now an explicit visual reference for the
responsive hierarchy. FR-030 and updated T005/T017/T020/T029/T085 bind desktop
two-column composition, mobile preview-first flow, numbered control order, and
prominent Export without changing geometry, privacy, or production constraints.

## Original Findings

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| A1 | Ambiguity | **HIGH** | `.specify/memory/constitution.md:1-49`, `plan.md:33-37` | The constitution is entirely placeholders, so no operative governance rules can be validated. | Run `/speckit-constitution` before declaring constitutional compliance. |
| C1 | Coverage | **HIGH** | `spec.md:179-181` (SC-003/004), `tasks.md:188-195` | T081 and T086 document or summarize browser/mobile results, but no task executes the four viewport, Android/iOS, keyboard, rotation, safe-area, and ≥30 FPS checks. | Add executable browser/device tasks and required evidence artifacts. |
| C2 | Coverage | **HIGH** | `spec.md:151` (FR-017), `spec.md:187` (SC-010), `tasks.md:161-175` | No-expiry, simulated 30/90/365-day behavior, manual deletion, and retaining assets still referenced by snapshots lack explicit validation. | Add lifecycle tests and a documented manual cleanup procedure covering shared assets. |
| C3 | Coverage | **HIGH** | `spec.md:150` (FR-016), `spec.md:188` (SC-011), `tasks.md:72-75,161-168` | Upload implementation is tasked, but returning the usable public asset URL and proving unauthenticated CDN access is not explicit. | Make the upload response contract and direct-URL integration assertion explicit. |
| C4 | Coverage | **HIGH** | `quickstart.md:40-47`, `tasks.md:69-76,136` | CORS/tainted-canvas and iOS fallback checks are required, but only die-cut alpha loading mentions CORS; normal 2D/PNG render paths lack an explicit task. | Add a shared CORS-safe image loader and Safari/tainted-canvas validation. |
| D1 | Dependency | **HIGH** | `plan.md:17`, `tasks.md:25,143` | T056 imports `@imgly/background-removal`, but dependency installation/pinning is absent from T001, which only covers contour/union libraries. License verification is also deferred to generic documentation. | Expand T001 to pin IMG.LY and add an explicit deployment-license gate. |
| A2 | Underspecification | **HIGH** | `tasks.md:189-191` | T080 bundles geometry, rendering, API mocks, immutability, and privacy into one Node runner; T081 calls documentation “executable checks.” Completion evidence is ambiguous. | Split into focused test modules and a browser/device command. |
| I1 | Inconsistency | MEDIUM | `spec.md:41`, `spec.md:198`, `tasks.md:26` | T002 calls the SVGs “approved demo” assets, while the specification says they are unapproved manufacturing drafts. | Rename them “supplied demo/draft SVGs” and retain production disclaimers. |
| C5 | Coverage | MEDIUM | `spec.md:154` (FR-020), `tasks.md:120` | Reduced motion is covered only in the 3D component; the cross-builder “no automatic motion” and optional stop/play behavior is not explicit. | Add a global motion policy task covering all preview modes. |
| C6 | Coverage | MEDIUM | `spec.md:159` (FR-025), `tasks.md:51,174` | T016 names localStorage/sessionStorage, but the plan also prohibits IndexedDB and cookies for restoration. T074 is broad but not auditable. | Explicitly prohibit IndexedDB, cookies, caches, and persistent workers from storing design state. |
| D2 | Duplication | LOW | `spec.md:148,158` | FR-014 and FR-024 repeat the same save-before-link requirement. | Keep one canonical rule and reference it from persistence/link acceptance criteria. |
| I2 | Inconsistency | LOW | `spec.md:15,21` | The first access clarification conflicts verbally with the later public Sanity URL clarification; the later answer supersedes it. | Annotate the historical clarification as superseded to prevent future reinterpretation. |

## Coverage Summary

| Requirement Key | Has Task? | Task IDs | Notes |
|-----------------|-----------|----------|-------|
| FR-001 | Yes | T004–T005, T010, T029 | |
| FR-002 | Yes | T002–T003, T007–T008, T054 | Supplied SVGs are explicitly unapproved demo/draft assets. |
| FR-003 | Yes | T007–T008, T011, T017 | |
| FR-004 | Yes | T011, T021–T022, T042, T051 | |
| FR-005 | Yes | T018–T024 | Shared CORS-safe loading and tainted-canvas recovery are explicit. |
| FR-006 | Yes | T030–T039 | |
| FR-007 | Yes | T013, T033 | |
| FR-008 | Yes | T030, T035–T039 | |
| FR-009 | Yes | T037–T047 | |
| FR-010 | Yes | T049–T055, T059–T060 | |
| FR-011 | Yes | T001, T056–T058, T091 | Dependency compatibility and owner license/deployment approval are explicit. |
| FR-012 | Yes | T026–T027 | |
| FR-013 | Yes | T014, T018, T023, T058–T059, T069, T075 | |
| FR-014 | Yes | T023–T024, T069 | |
| FR-015 | Yes | T072–T074 | |
| FR-016 | Yes | T024–T025, T065–T067, T073, T082 | Public URL response and unauthenticated access are explicit. |
| FR-017 | Yes | T061, T067, T075, T082, T092 | Lifecycle, deletion, and shared-asset evidence are explicit. |
| FR-018 | Yes | T019–T020, T029, T085–T087 | Browser and device validation are executable. |
| FR-019 | Yes | T019–T020, T045 | |
| FR-020 | Yes | T045, T094 | Global no-auto-motion and reduced-motion behavior is explicit. |
| FR-021 | Yes | T015, T028, T040, T047, T077–T078 | |
| FR-022 | Yes | T005, T029 | |
| FR-023 | Yes | T006, T017, T021, T042–T043, T061, T073 | |
| FR-024 | Yes | T069–T071 | |
| FR-025 | Yes | T016, T074 | All persistence surfaces are explicitly prohibited. |
| FR-026 | Yes | T008, T017 | |
| FR-027 | Yes | T008, T021, T038, T042–T043, T073 | |
| FR-028 | Yes | T032 | |
| FR-029 | Yes | T030, T032, T039, T073 | |
| FR-030 | Yes | T005, T017, T020, T029, T085 | Mockup hierarchy is explicit and testable. |
| SC-002 | Yes | T011, T021, T033–T034, T038, T042, T080–T081 | Geometry and cross-render assertions are split into focused suites. |
| SC-003 | Yes | T086–T087 | Android/iPhone and FPS measurements are executable and retain evidence. |
| SC-004 | Yes | T029, T085–T086 | Four viewports, keyboard, safe area, rotation, and iOS/Android checks are explicit. |
| SC-005 | Yes | T069–T075, T082 | |
| SC-006 | Yes | T026–T027, T081, T085 | |
| SC-007 | Yes | T015, T076–T078, T083, T093 | Network and property assertions are explicit. |
| SC-008 | Yes | T064–T075, T082 | |
| SC-009 | Yes | T008, T030–T040, T073 | |
| SC-010 | Yes | T061, T067, T075, T082, T092 | Simulated retention, deletion, and shared asset handling are explicit. |
| SC-011 | Yes | T024–T025, T067, T082, T086 | Direct unauthenticated asset access and canvas use are explicit. |

SC-001 is a post-launch usability KPI and is excluded from buildable implementation coverage.

## Constitution Alignment Issues

The previous constitution gap is resolved by ratified `.specify/memory/constitution.md` v1.0.0. Current artifacts must comply with its five principles; later implementation review must verify execution evidence rather than infer compliance from the task list.

## Unmapped Tasks

None. All 94 tasks map at least nominally to a story, functional requirement, plan constraint, or release-quality gate.

## Metrics

- **Total requirements**: 40 buildable FR/SC items
- **Total tasks**: 94
- **Nominal coverage**: 100% (40/40)
- **Requirements with verification task gaps**: 0
- **Ambiguity count**: 0
- **Duplication count**: 0
- **Critical issues**: 0
- **High issues unresolved**: 0

## Next Actions

All identified high and medium findings are resolved at the design level.
Run `/speckit-implement` against `specs/001-keychain-builder/tasks.md`.
Implementation and release gates remain pending execution, including owner
confirmation of the IMG.LY deployment license and measured Android/iPhone
evidence. No extension hooks were registered.
