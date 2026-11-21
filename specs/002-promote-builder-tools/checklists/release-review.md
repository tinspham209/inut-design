# Release Review Checklist: Promote Builder Tools

**Purpose**: Formal release-gate review of the requirement quality for Hero and Builder promotion UX, responsive accessibility, and privacy-safe analytics
**Created**: 2026-11-20
**Feature**: [spec.md](../spec.md)

**Audience / depth**: Another agent reviewer / formal release gate

**Note**: This checklist validates whether the requirements are complete, clear,
consistent, measurable, and release-ready. It does not validate implementation
behavior.

## Requirement Completeness

- [x] CHK001 Are all homepage surfaces that promote the Builder capability explicitly identified, including the Hero CTA, the section below the Hero, and the existing navigation entry? [Completeness, Spec §FR-003, §FR-015]
- [x] CHK002 Are the exact destination and visible label of the Hero CTA specified together so “Tự thiết kế ngay” cannot be associated with the wrong route? [Completeness, Spec §FR-003, §FR-005]
- [ ] CHK003 Are both Builder cards required to have product-specific title, value description, visual asset, badge state, and destination rather than relying on a generic shared label? [Completeness, Spec §FR-004, §FR-007, Key Entities]
- [x] CHK004 Is the required position of the shared Builder section after `#featured-gift-products` and before `ServicesSection` explicit enough to prevent it from moving above the Hero or far below unrelated homepage content? [Completeness, Spec §US-1, §Plan Summary]
- [x] CHK005 Are requirements defined for the Builder overview page `/builder` as a distinct journey, including its content order and direct destinations? [Completeness, Spec §US-3, §FR-007]
- [ ] CHK006 Are view-impression and click-conversion requirements both defined for every placement, including the Hero overview action? [Completeness, Spec §FR-011, Contract: Analytics Contract]
- [ ] CHK007 Are content requirements for Keychain Builder limited to capabilities that already exist, and is the evidence source for those capability claims identified? [Completeness, Spec §FR-014, Assumptions]

## Requirement Clarity

- [ ] CHK008 Is “được ưu tiên thị giác” defined with objective hierarchy rules such as order, relative size, emphasis, or placement rather than an unconstrained subjective judgment? [Clarity, Ambiguity, Spec §FR-002]
- [ ] CHK009 Is “hiển thị rõ ràng” for the Hero CTA on mobile quantified by viewport position, minimum readable area, or first-screen visibility criteria? [Clarity, Spec §US-1 Acceptance 4, §SC-004]
- [ ] CHK010 Is the intended scope of “màn hình đầu tiên” defined across the supported viewport range and device/browser chrome differences? [Clarity, Spec §US-1]
- [ ] CHK011 Are “mô tả đủ giá trị” and “phân biệt được” constrained to specific information users must learn before choosing a Builder? [Clarity, Spec §FR-004, §US-2]
- [x] CHK012 Is the duration and campaign boundary for the “Mới” label defined, or is removal timing explicitly outside this feature? [Clarity, Assumption]
- [ ] CHK013 Is the term “lượt xem promotion đủ điều kiện” operationally defined with a visibility threshold and placement scope for SC-008? [Clarity, Gap, Spec §SC-008]
- [x] CHK014 Are viewport requirements expressed consistently as named breakpoints or ranges rather than only “common viewports”? [Clarity, Spec §SC-004]

## Requirement Consistency

- [x] CHK015 Are the Hero CTA requirements consistent between the spec, plan, data model, analytics contract, and quickstart: `/builder`, label “Tự thiết kế ngay”, placement `home_hero`, and ID `overview`? [Consistency, Spec §FR-003, Contract: Homepage/Analytics]
- [x] CHK016 Are direct Builder-card requirements consistent across the homepage, `/builder`, data model, and public-destination contract for `/builder/keychain` and `/builder/lighters`? [Consistency, Spec §FR-005, §FR-007, Contract: Public Destinations]
- [x] CHK017 Do the Keychain-first ordering requirements align between visual order, DOM order, keyboard order, and analytics iteration order? [Consistency, Spec §FR-002, §FR-008, §FR-009]
- [x] CHK018 Is the statement that Hero navigation goes to `/builder` consistent with SC-003 and with the separate requirement that direct promotion cards require only one selection to reach each Builder? [Consistency, Spec §SC-003]
- [x] CHK019 Are “at most once” requirements consistent with the impression-state lifetime defined as once per mounted placement, including remounts and SPA returns? [Consistency, Spec §FR-011, Data Model: Impression State]
- [x] CHK020 Are the requirements for provider failure consistent: analytics must be non-blocking while provider exceptions are still observable rather than silently ignored? [Consistency, Edge Cases, Contract: Failure Behavior, Plan Design Decision 6]

## Acceptance Criteria Quality

- [ ] CHK021 Can SC-001 be objectively reproduced with a defined participant sample, task wording, timing method, and success rubric for “nhận ra”? [Acceptance Criteria, Spec §SC-001]
- [ ] CHK022 Can SC-002 be objectively measured without letting users inspect the Builder pages before judging which Builder matches their intent? [Acceptance Criteria, Ambiguity, Spec §SC-002]
- [ ] CHK023 Does SC-004 define the precise conditions for “văn bản cắt mất ý nghĩa” and “thao tác chồng lấn,” so different reviewers reach the same release decision? [Acceptance Criteria, Clarity, Spec §SC-004]
- [ ] CHK024 Does SC-005 define the supported keyboard sequence, screen-reader expectations, and assistive-technology scope needed for a repeatable pass/fail result? [Acceptance Criteria, Spec §SC-005]
- [x] CHK025 Does SC-006 define the exact expected event names and property schema, so “one event” cannot exclude a duplicate channel or unrelated event? [Acceptance Criteria, Spec §SC-006, Contract: Analytics Contract]
- [ ] CHK026 Does SC-008 define the denominator, conversion attribution window, placement inclusion rules, and how to separate Keychain versus Lighter clicks? [Acceptance Criteria, Spec §SC-008]
- [x] CHK027 Are release-blocking criteria distinguished from post-launch business outcomes that cannot determine implementation readiness at code-review time? [Acceptance Criteria, Gap, Spec §SC-008, Quickstart §7]

## Scenario Coverage

- [x] CHK028 Are primary, alternate, and keyboard-only flows specified for entering via the Hero, entering via the promotion section, and entering through existing navigation? [Coverage, Spec §US-1, §US-2, §US-3, §SC-005]
- [x] CHK029 Are requirements defined for users who ignore the Hero and scroll directly to the Builder comparison section? [Coverage, Spec §US-2]
- [ ] CHK030 Are requirements defined for users who open links in a new tab or return through browser history, including analytics and state expectations? [Coverage, Gap, Edge Cases]
- [x] CHK031 Are requirements defined for users revisiting the homepage after initially viewing the promotion, including whether a new impression is expected after an SPA remount? [Coverage, Gap, Data Model: Impression State]
- [ ] CHK032 Are requirements defined for the Hero CTA and Builder cards when text wraps, zoom increases, or a user increases font size? [Coverage, Gap, Spec §FR-008, §SC-004]

## Edge Case Coverage

- [x] CHK033 Are fallback requirements specified for failed Hero or card imagery, including accessible name retention, fixed geometry, and absence of misleading broken-image text? [Edge Case, Spec §FR-010, §SC-007]
- [x] CHK034 Are requirements specified for providers or browser features being unavailable, including `IntersectionObserver`, GA4/GTM, and Umami independently? [Edge Case, Gap, Spec §Observability, Contract: Failure Behavior]
- [x] CHK035 Are requirements defined for analytics payload validation failure, invalid placement values, or an unrecognized Builder ID without interrupting navigation? [Edge Case, Gap, Data Model: BuilderPromotionEvent]
- [x] CHK036 Are requirements defined for reduced-motion users across all hover, image-scale, transition, or ticker-like effects inherited by the homepage? [Edge Case, Spec §Accessibility and motion, Contract: Accessibility Contract]
- [x] CHK037 Are requirements defined for a Builder destination that is temporarily unavailable, including the boundary between promotion availability and destination-owned error messaging? [Edge Case, Spec Edge Cases, Spec §Compatibility]

## Non-Functional Requirements

- [ ] CHK038 Are performance requirements sufficient to prevent promotion imagery or analytics initialization from delaying the Hero CTA, without relying only on implementation intent? [Non-Functional, Gap, Plan Performance Goals]
- [ ] CHK039 Are accessibility requirements complete for link names, heading hierarchy, text contrast, visible focus, keyboard order, touch-target usability, and non-color status cues? [Non-Functional, Spec §FR-009, Cross-Cutting: Accessibility]
- [x] CHK040 Are privacy requirements explicit that event values may only be fixed `builder_id`, `placement`, and `action` identifiers, with every prohibited data class documented? [Non-Functional, Spec §FR-012, Contract: Analytics Contract]
- [x] CHK041 Are analytics de-duplication requirements complete for mouse, touch, keyboard, observer re-entry, rerenders, SPA navigation, and automatic page-view tracking? [Non-Functional, Spec §FR-011, §SC-006, Contract: Analytics]
- [x] CHK042 Are content requirements sufficient to prevent unsupported claims, prices, MOQ, delivery promises, or production guarantees from entering the promotion? [Non-Functional, Spec §FR-014, Constitution: Evidence-Bounded Scope]
- [x] CHK043 Are compatibility requirements explicit that no Builder design state, cart, pricing, checkout, contact, or order behavior may change as a result of promotion work? [Non-Functional, Spec §FR-013, Compatibility, Constitution: Commerce Contract Stability]

## Dependencies & Assumptions

- [x] CHK044 Is the assumption that the two existing thumbnail assets are sufficient documented with acceptable aspect-ratio, accessibility, and failure expectations? [Assumption, Spec Assumptions, §FR-010]
- [x] CHK045 Is the dependency on `/builder`, `/builder/keychain`, and `/builder/lighters` remaining public and account-free explicitly validated as a release precondition? [Dependency, Spec Assumptions, Contract: Public Destinations]
- [x] CHK046 Is the relationship between generic navigation click tracking and the new Builder-specific events defined so one activation does not produce competing conversion interpretations? [Dependency, Gap, Spec §FR-011, Plan Design Decision 4]
- [ ] CHK047 Is ownership defined for updating the “Mới” marker after the launch campaign and for maintaining the canonical Builder descriptions across pages? [Dependency, Gap, Assumption]

## Ambiguities & Conflicts

- [ ] CHK048 Does the spec resolve the difference between “Hero reaches `/builder`” and “users understand Keychain is the promoted priority” before they choose a direct Builder card? [Ambiguity, Spec §US-1, §FR-002, §FR-003]
- [x] CHK049 Does placing the promotion after the first homepage content section preserve the Hero CTA's direct route to the full Builder overview? [Conflict, Plan Summary, Spec §FR-003]
- [ ] CHK050 Is the exact hierarchy rule clear when “Keychain first” could be represented by order, card size, visual contrast, copy prominence, or multiple simultaneous signals? [Ambiguity, Spec §FR-002, Plan Design Decision 2]
- [ ] CHK051 Are the `builder_id = overview` and `builder_id = keychain/lighter` semantics unambiguous for downstream conversion reporting and the 70% Keychain share criterion? [Ambiguity, Gap, Spec §SC-008, Data Model: BuilderPromotionEvent]
- [ ] CHK052 Are all release gates traceable to a requirement ID and an objective acceptance criterion, rather than relying on reviewer preference or undocumented visual taste? [Traceability, Gap]

## Notes

- Mandatory release focus: Hero and Builder hierarchy, responsive accessibility,
  and analytics de-duplication/privacy.
- Reviewer should record unresolved answers inline and treat any unchecked
  acceptance, privacy, accessibility, or routing ambiguity as release-blocking
  until the requirements are clarified.

## Implementation review disposition — 2026-11-21

Reviewed all 52 requirement-quality questions against the spec, plan, contract,
implementation, and local browser evidence. The 30 checked items have a direct
answer in those artifacts. The 22 unchecked items remain open and are
release-blocking; implementation approval did not close these requirement gaps.

| Open items | Disposition |
| --- | --- |
| CHK003, CHK007 | Define whether both cards require assets/badge states and name the authoritative source for capability claims. |
| CHK006, CHK013, CHK026, CHK051 | Define Hero view measurement, qualified-view denominator, attribution window, and `overview` versus Builder conversion semantics. |
| CHK008–CHK011, CHK048, CHK050 | Specify objective Keychain visual hierarchy, first-screen scope across devices, and what information distinguishes the two Builders before selection. |
| CHK021–CHK024 | Define reproducible participant tasks and rubrics for awareness, correct choice, layout, and assistive-technology acceptance. |
| CHK030, CHK032 | Specify new-tab/history behavior and text wrapping/zoom expectations. |
| CHK038–CHK039 | Add measurable performance and complete accessibility criteria, including contrast and touch targets. |
| CHK047 | Assign ownership for retiring “Mới” and maintaining canonical descriptions. |
| CHK052 | Trace each release gate to a requirement ID and objective pass/fail evidence. |

The implementation itself was checked for responsive layout, keyboard order,
routes, image fallback, reduced motion, and local analytics dispatch. Those
observations do not resolve the requirement-quality gaps above.

## Hero CTA implementation review note

- Objective viewport check: at 360 × 800 CSS pixels, the Hero primary link must
  be fully inside the initial viewport, have a rendered height of at least 44
  CSS pixels, and remain unobscured. Record its bounding rectangle after fonts
  and layout settle; browser chrome is outside the CSS viewport measurement.
- Hierarchy check: within the Hero CTA row, “Tự thiết kế ngay” is the first
  keyboard stop and the only filled orange primary action; “Báo giá ngay” stays
  the outlined secondary action. The primary link destination is `/builder`.
- Responsive evidence must also record the same label, destination and order at
  1440 px. This is an implementation observation and does not resolve the
  separate wording and participant-method gaps in CHK021–CHK024.
