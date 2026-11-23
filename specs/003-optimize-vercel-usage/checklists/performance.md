# Performance and Reliability Requirements Checklist: Optimize Vercel Usage

**Purpose**: Assess whether whole-project performance, freshness, workload, and
protected-contract requirements are complete and reviewable before implementation.
**Created**: 2026-11-23
**Feature**: [spec.md](../spec.md)

**Note**: Reviewer checklist for requirement quality, not implementation behavior.

## Requirement Completeness

- [x] CHK001 Are monthly CPU-budget, warning-threshold, and pause-prevention requirements explicitly defined together? [Completeness, Spec §FR-013, Spec §SC-001, Spec §SC-009]
- [x] CHK002 Are all confirmed route classes in the whole-project audit represented by an actionable requirement or explicit disposition? [Completeness, Spec §FR-020, Spec §SC-017]
- [x] CHK003 Are requirements defined for both page Function work and API Function work rather than only public page regeneration? [Coverage, Spec §FR-026, Spec §FR-025]
- [x] CHK004 Are the 17 page modules and 22 API endpoints individually traceable in the required workload inventory, or is only aggregate inventory required? [Traceability, Spec §SC-017, Gap]
- [x] CHK005 Are baseline fields sufficient to distinguish invocations, Active CPU, source-read count, errors, and cache state for every in-scope route? [Completeness, Spec §FR-001, Spec §FR-014]
- [x] CHK006 Are owner-triggered urgent publication requirements defined for both initiating the update and making it globally visible? [Completeness, Spec §FR-021, Spec §FR-022, Spec §SC-018, Spec §SC-019]
- [x] CHK007 Are requirements defined for the contact-banner migration's file identity, dimensions, rendition, and visual preservation? [Completeness, Spec §FR-019, Spec §SC-016]
- [x] CHK008 Are all protected commerce/contact workflows named consistently enough to define regression scope without relying on implementation knowledge? [Completeness, Spec §FR-011, Spec §SC-007]

## Requirement Clarity

- [x] CHK009 Is "one logical refresh operation" defined so grouped source reads and page-level rendering work cannot be counted ambiguously? [Clarity, Spec §FR-004, Spec §FR-024]
- [x] CHK010 Is the phrase "normal warm search workload" bounded by request mix, instance model, or cache-window assumptions? [Clarity, Spec §FR-021, Spec §SC-018]
- [x] CHK011 Is "common search workload" quantified sufficiently to reproduce the claimed corpus-refresh limit? [Measurability, Spec §SC-018, Ambiguity]
- [x] CHK012 Is "routine 60-second regeneration is prohibited" scoped separately for each Creativa route, including blocking fallback generations? [Clarity, Spec §FR-022]
- [x] CHK013 Is the 24-hour Creativa freshness requirement clear about whether elapsed time starts at publish, build trigger, or last regeneration? [Clarity, Spec §FR-022, Gap]
- [x] CHK014 Are the terms "content-source read," "Sanity operation," "corpus refresh," and "external content operation" normalized or explicitly mapped? [Terminology, Ambiguity]
- [x] CHK015 Is "visitor-visible compute" defined sufficiently to distinguish CDN delivery, page regeneration, and client navigation? [Clarity, Spec §FR-015, Gap]
- [x] CHK016 Is the 0% 5xx baseline qualified by route, environment, and time window rather than implied as a project-wide guarantee? [Clarity, Spec §SC-005, Spec §SC-015]

## Requirement Consistency

- [x] CHK017 Are SC-006 and the assumptions' separate "15-minute normal content freshness" statement consistent with the per-content 24-hour Creativa/search policy? [Conflict, Spec §SC-006, Assumptions]
- [x] CHK018 Are the 15-minute urgent-publication requirements consistent with SC-019's routine interval of at least 3,600 seconds? [Consistency, Spec §SC-019, Spec §FR-022]
- [x] CHK019 Are product-page 24-hour freshness requirements consistent between FR-007, FR-023, SC-006, and SC-020? [Consistency]
- [x] CHK020 Does the homepage fan-out criterion of ≤85 reads for 85 regenerations reconcile with owner-triggered rebuilds or changed regeneration frequency? [Consistency, Spec §SC-011, Spec §SC-015]
- [x] CHK021 Are the "zero `/contact` Function invocation" criterion and the general allowance for retained function-based content refresh mutually exclusive or consistently scoped? [Consistency, Spec §FR-005, Spec §SC-013]
- [x] CHK022 Are protected API "contract unchanged" requirements consistent with allowing read-only endpoint optimization when evidence exists? [Consistency, Spec §FR-025, Spec §SC-022]

## Acceptance Criteria Quality

- [x] CHK023 Can the representative monthly CPU comparison be normalized objectively across different Production traffic volumes? [Measurability, Spec §SC-001, Spec §FR-014]
- [x] CHK024 Is the five-route 40% CPU reduction criterion unambiguous about whether routes are selected before or after optimization? [Measurability, Spec §SC-002, Gap]
- [x] CHK025 Are latency targets defined for the specific affected route set rather than only the broad "highest-volume public pages" class? [Measurability, Spec §SC-003, Ambiguity]
- [x] CHK026 Are the minimum sample duration and event volume defined for the Production window used by SC-012 through SC-014? [Acceptance Criteria, Gap]
- [x] CHK027 Is 25% product read reduction measurable with a stated baseline refresh workload and included route set? [Measurability, Spec §SC-020]
- [x] CHK028 Are the visual-equivalence criteria for the migrated contact banner quantified beyond "no material difference"? [Clarity, Spec §SC-016, Ambiguity]
- [x] CHK029 Is "one grouped content-read operation" mapped to observable request counts or only to implementation grouping? [Measurability, Spec §SC-018, Spec §SC-021]
- [x] CHK030 Are warning-state thresholds, failure-state thresholds, and post-warning actions all explicitly assigned? [Acceptance Criteria, Spec §SC-009, Gap]

## Scenario Coverage

- [x] CHK031 Are primary, alternate, degraded, and recovery requirements distinguished for content-source unavailability? [Coverage, Spec §FR-008, Edge Cases]
- [x] CHK032 Are stale-cache, concurrent-refresh, and first-request-after-expiry scenarios specified for ISR routes? [Coverage, Gap]
- [x] CHK033 Are cold-function and warm-function corpus behaviors both covered for the search 24-hour requirement? [Coverage, Spec §FR-021, Gap]
- [x] CHK034 Are on-demand new-slug scenarios defined for Creativa and all three product detail route families? [Coverage, Spec §FR-022, Spec §FR-023]
- [x] CHK035 Are owner-triggered urgent publication scenarios defined independently for homepage/blog, Creativa, search, and product content? [Scenario Coverage, Gap]
- [x] CHK036 Are legitimate crawler, Preview, Development, monitor, and background-navigation traffic classes covered without conflating them with visitor traffic? [Coverage, Spec §FR-015, Edge Cases]
- [x] CHK037 Are protected order/contact/upload flows covered by negative, retry, and duplicate-submission requirements rather than only happy-path regression wording? [Exception Flow, Spec §FR-011, Gap]
- [x] CHK038 Are rollback requirements defined if a route becomes stale, slower, or incorrectly static after publication? [Recovery, Gap]

## Edge Case Coverage

- [x] CHK039 Are requirements defined for simultaneous refreshes of homepage, search, Creativa, listing, detail, and blog workloads? [Edge Cases, Concurrency Gap]
- [x] CHK040 Are requirements defined when a grouped read succeeds partially but a sub-result is absent or malformed? [Exception Flow, Gap]
- [x] CHK041 Are requirements defined when the migrated local banner is missing, corrupt, or replaced by an unintended asset? [Edge Cases, Spec §FR-019, Gap]
- [x] CHK042 Are requirements defined for search data added immediately before or during a 24-hour cache period? [Edge Cases, Spec §FR-021, Spec §SC-018]
- [x] CHK043 Are requirements defined for a removed or archived product that remains in a stale search/cached page? [Edge Cases, Gap]
- [x] CHK044 Are requirements defined for bursty unknown-route discovery or invalid dynamic slugs so fallback generation cannot consume the budget unboundedly? [Edge Cases, Spec §FR-023, Gap]
- [x] CHK045 Are query-parameter variants and cache fragmentation addressed for both search and contact-form navigation? [Edge Cases, Spec §FR-016, Spec §FR-021]

## Non-Functional Requirements

- [x] CHK046 Are CPU, latency, request-count, and source-read targets assigned to the correct metric rather than treated as interchangeable? [NFR Clarity, Spec §FR-027]
- [x] CHK047 Are privacy constraints explicit about excluding sensitive values from evidence while preserving sufficient operational traceability? [Security, Spec §FR-012, Spec §FR-014]
- [x] CHK048 Are authentication, authorization, method validation, and idempotency requirements preserved for every protected API class? [Security, Spec §FR-025, Spec §SC-022]
- [x] CHK049 Are accessibility, SEO, canonical identity, image, and responsive requirements defined as release constraints for all optimized routes? [Coverage, Spec §FR-009, Spec §SC-010]
- [x] CHK050 Are GA4/GTM and Umami de-duplication requirements clear for page changes, CTA prefetch changes, and urgent publication paths? [Consistency, Spec §FR-010]
- [x] CHK051 Are dependency-failure requirements clear enough to distinguish safe stale content from a misleading success response? [Reliability, Spec §FR-008, Spec §FR-018]
- [x] CHK052 Is the requirement to measure shared rendering overhead assigned a measurable acceptance threshold or only a comparison obligation? [Measurability, Spec §FR-027, Gap]

## Dependencies & Assumptions

- [x] CHK053 Is the assumption that the 12-hour all-environment sample is sufficient for initial normalization bounded by an explicit follow-up Production measurement? [Assumption, Spec §SC-015]
- [x] CHK054 Is the owner-triggered deploy/publication capability a validated operational dependency rather than an undocumented manual convention? [Dependency, Spec §FR-021, Spec §FR-022, Gap]
- [x] CHK055 Are Sanity projection/reference constraints documented for grouped homepage, search, listing, and detail reads? [Dependency, Spec §FR-023, Constitution]
- [x] CHK056 Are Vercel Hobby log-retention limits reflected in how long evidence must be captured and retained? [Dependency, Gap]
- [x] CHK057 Are assumptions about no new infrastructure, dependencies, or hosting-plan upgrade traceable to the budget and deployment model? [Assumption, Spec §Compatibility, Gap]

## Ambiguities & Conflicts

- [x] CHK058 Does the spec resolve the apparent conflict between "15-minute normal CMS freshness" and the clarified 24-hour Creativa/search/product policies? [Conflict, Spec §FR-007, Assumptions]
- [x] CHK059 Does the spec distinguish "exact published banner" from the later "1200px/quality-80 live rendition" without creating two competing visual sources of truth? [Conflict, Spec §FR-019, Plan §Decision 2]
- [x] CHK060 Are unknown per-endpoint API baselines allowed to pass completion, or must each remain explicitly unresolved despite the 100% inventory criterion? [Ambiguity, Spec §FR-026, Spec §SC-017, Spec §SC-022]
- [x] CHK061 Are any low-priority route optimizations intended to be deferred explicitly rather than implied by their P2 audit priority? [Scope Ambiguity, Spec §FR-020, Spec §SC-017]
- [x] CHK062 Is the `/contact/form` target of "one automatic background request" defined as document, data, chunk, or all three to prevent inconsistent interpretation? [Ambiguity, Spec §SC-014]

## Notes

- Focus: whole-project CPU performance, freshness policy, API workload safety,
  and protected commerce/contact reliability.
- Depth: Standard reviewer gate with release-readiness emphasis.
- Audience/timing: PR and release reviewer before `/speckit-tasks` and
  implementation approval.
- All checklist items test requirement quality; they do not test implementation
  behavior.


## Resolution record

All CHK001–CHK062 were reviewed against the user clarification and the final
spec, plan, contracts, tasks, and analysis report. The accepted policies are:
10-minute homepage/blog freshness; 24-hour Creativa/search/product freshness;
15-minute owner-triggered Production redeploy visibility; a 75% safety target
with 75–89.9% warning, 90% escalation, and 100% failure; a frozen five-route
Production CPU comparison with a 40% reduction target; and latency sampling over
12 continuous Production hours with at least 25 normal requests per route and a
documented synthetic supplement when needed. Contact banner migration and
request-class counting are explicit. All 22 APIs are classified; only read-only
paths with route evidence may be optimized, while protected writes remain
guardrail/regression scope. The isolated search environment and Production
aggregate evidence are separate requirements. Evidence collection is assigned to
T111–T116. Missing Production observations remain named evidence gaps and are
not acceptance passes. No product decision remains open.
