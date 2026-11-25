# Phase Readiness Checklist: Migrate Vinext sang Cloudflare

**Purpose**: Assess whether each migration phase has complete, clear, consistent and measurable requirements before task generation and implementation.
**Created**: 2026-11-24
**Feature**: [spec.md](../spec.md), [plan.md](../plan.md)

**Note**: This checklist tests requirements quality; it does not test implementation behavior.

## Phase 0 — Baseline & Compatibility Research

- [ ] CHK001 Are the authoritative baseline inputs for routes, APIs, headers, redirects, cache, SEO, analytics and performance fully enumerated? [Completeness, Spec §FR-011; Plan Phase 0]
- [ ] CHK002 Is "production baseline" defined with an exact source revision, capture time and approved comparison scope? [Clarity, Spec §User Story 1; Spec §Production Baseline]
- [ ] CHK003 Are all 22 API contracts required to include method, body limit, auth, validation, idempotency, status, headers, side effects and test mode? [Coverage, Spec §FR-004, §FR-014; Plan Phase 0]
- [ ] CHK004 Are the representative route/performance sample and percentile window quantified so the +10% comparison is reproducible? [Measurability, Spec §SC-004; Gap]
- [ ] CHK005 Are the pnpm 11.5.3 prerequisites explicit about exact runtime version, lockfile regeneration, frozen installs and peer-resolution review? [Completeness, Spec §FR-035; Plan Phase 1]
- [ ] CHK006 Are direct dependencies classified consistently by browser, Worker, build and test-only scope, including license/peer/call-site evidence? [Completeness, Plan Dependency & Integration Impact Matrix]
- [ ] CHK007 Are requirements for classifying and remediating existing public credentials separated from generic missing-secret inventory requirements? [Security, Spec §FR-007; Gap]
- [ ] CHK008 Is the distinction between a Vinext scanner finding and required runtime evidence stated as an acceptance rule rather than only guidance? [Clarity, Spec §SC-018]
- [ ] CHK009 Are owner waivers limited to documented non-security behavioral gaps and prohibited for secret/data/security failures? [Consistency, Spec §FR-016; Plan Constitution Check]
- [ ] CHK010 Are baseline fixtures and safe mock boundaries defined so production orders, notifications, uploads and Sanity writes cannot be mistaken for valid evidence? [Completeness, Spec §FR-014, §SC-003]

## Phase 1 — Runtime Upgrade & Vinext Parallel Path

- [ ] CHK011 Are exact target versions and version-selection evidence aligned across spec, plan, package metadata and release gates for Next, React, Node, Vinext, Vite and pnpm? [Consistency, Spec §FR-035; Plan Technical Context]
- [ ] CHK012 Is the approved package transaction ordered clearly enough to prevent mixed React 18/19, unsupported peer overrides and partial companion upgrades? [Clarity, Spec §Next.js / React Upgrade Decision]
- [ ] CHK013 Are the five carousel surfaces and two React Three/Fiber surfaces covered by explicit parity requirements rather than only package-level compatibility statements? [Coverage, Gap]
- [ ] CHK014 Is the source-count conflict resolved between the spec's "51 legacy image usages" / "5 Link<a>" and the plan's 44-image/28-file/99-legacy-Link inventory? [Conflict, Spec §Công việc bắt buộc khi upgrade; Plan Migration Inventory]
- [ ] CHK015 Are image, Link and custom Document requirements specific about layout, dimensions, focus, nested-anchor semantics, click tracking and hydration acceptance? [Completeness, Spec §FR-003; Gap]
- [ ] CHK016 Are custom webpack behaviors translated into requirement-level equivalence for IMG.LY aliasing, browser fallbacks, externalization, headers and redirects? [Coverage, Spec §FR-023; Plan Phase 1]
- [ ] CHK017 Is the phase boundary for keeping the normal Next path parallel to Vinext clear enough to define when it may be removed or retired? [Ambiguity, Spec §FR-002; Plan Phase 1]
- [ ] CHK018 Are exact-once GA4/GTM and Umami requirements reconciled with Strict Mode, initial load, SPA navigation, bfcache and Vercel Analytics removal? [Consistency, Spec §FR-008, §FR-022]
- [ ] CHK019 Can the Phase 1 gate distinguish dependency/tooling success from visual, hydration, route and Worker-runtime parity? [Acceptance Criteria, Plan Phase 1 Gate]

## Phase 2 — Full-Static Public Rendering

- [ ] CHK020 Does the spec resolve its wording conflict between preserving "cache, ISR, revalidation" and the later no-ISR/no-SSR baseline? [Conflict, Spec §FR-009, §FR-037]
- [ ] CHK021 Are all 74 public page modules mapped to a static, SSG, retained runtime, or explicitly approved exception state? [Completeness, Spec §Public Route Rendering Matrix; §SC-025]
- [ ] CHK022 Are complete-slug requirements defined for every dynamic family, including blog, services, lighters, laptop, macnut and Creativa? [Coverage, Spec §FR-039; Plan Phase 2]
- [ ] CHK023 Are duplicate, invalid, reserved, draft, unpublished, missing-related-data and source-outage outcomes specified as release-blocking states? [Edge Cases, Spec §Edge Cases; Plan Phase 2]
- [ ] CHK024 Is "fallback: false" behavior for removed or unpublished slugs specified consistently across status, redirect, canonical and sitemap requirements? [Consistency, Spec §FR-003, §FR-039]
- [ ] CHK025 Are the public search-index field allow-list, privacy exclusions, schema version, document uniqueness and source provenance sufficiently defined? [Completeness, Spec §FR-038, §SC-028]
- [ ] CHK026 Is search ranking/result parity measurable for query, facet, pagination, error, empty and keyboard scenarios? [Measurability, Spec §SC-028]
- [ ] CHK027 Is the owner-triggered rebuild requirement clear about actor authorization, concurrency, failure handling and allowed publication sources? [Clarity, Spec §FR-037, §FR-039]
- [ ] CHK028 Is the absence of a freshness SLA balanced with a defined operational expectation for how soon an approved Sanity publication reaches production? [Ambiguity, Spec §Assumptions; Gap]

## Phase 3 — Worker API & Upload Hardening

- [ ] CHK029 Are the 22 routes classified by caller, transport, side effect, cache, timeout and safe-test mode without relying on a generic API template? [Completeness, Spec §FR-004; Plan Phase 0]
- [ ] CHK030 Are anonymous-browser and trusted scheduler/internal authentication requirements distinct enough to avoid treating a `NEXT_PUBLIC_*` value as a secret? [Security, Spec §FR-007, §FR-010; Plan Phase 3]
- [ ] CHK031 Are the credential-removal and rotation requirements measurable for Telegram token, chat ID and exposed API key while preserving outward API behavior? [Acceptance Criteria, Spec §FR-007; Plan Secret and Caller Migration]
- [ ] CHK032 Are raw-body requirements complete for all four Creativa POST routes, including chunk boundaries, UTF-8, content type, body size and abort behavior? [Coverage, Spec §API Route Decision]
- [ ] CHK033 Are numeric upload bounds for browser output and Worker validation specified consistently, including decoded size, width, height, pixel count and Base64 envelope? [Clarity, Spec §FR-023a; Runtime Contract]
- [ ] CHK034 Are malformed Base64, signature mismatch, polyglot content, decompression metadata and persistence failure mapped to explicit response/error requirements? [Edge Cases, Spec §FR-023a; Runtime Contract]
- [ ] CHK035 Is the requirement that native `sharp` be absent from the Worker module graph distinguishable from allowing it only as development/test tooling? [Consistency, Spec §SC-027; Plan Phase 3]
- [ ] CHK036 Are SPX scheduler endpoint, timeout, concurrency, idempotency, retry and notification requirements quantified for Worker cold starts and duplicate delivery? [Completeness, Spec §FR-010; User Story 3]
- [ ] CHK037 Is the per-isolate rate-limit limitation documented as a degraded-security assumption with a defined abuse-escalation trigger? [Assumption, Spec §API Route Decision; Gap]

## Phase 4 — Preview, Release Gate & Cloudflare Readiness

- [ ] CHK038 Are preview `noindex` requirements defined independently from production canonical, sitemap and robots generation? [Consistency, Spec §FR-025, §FR-026; Deployment Contract]
- [ ] CHK039 Are preview and production artifact-delta requirements constrained so only approved channel-specific differences are permitted? [Clarity, Plan Phase 4 Gate]
- [ ] CHK040 Is "owner repeat by one command" reconciled with the separate dry-run, preview, approval and production actions required by the release sequence? [Ambiguity, Spec §SC-026, §FR-040]
- [ ] CHK041 Are release-gate ownership, evidence retention, approval record and blocker/escalation rules explicitly defined for every mandatory gate? [Completeness, Spec §FR-011, §FR-012]
- [ ] CHK042 Are Worker memory, CPU, request, bundle-size and log-volume limits mapped to measurable preview evidence and failure thresholds? [Measurability, Spec §SC-013, §SC-015]
- [x] CHK043 Does the spec state the current Free-first mode, preview hostname, zone and owner-notification response for quota/plan warnings, without implying automatic Paid upgrade? [Dependency, Spec §FR-018, §FR-020, §FR-024]
- [x] CHK044 Are earlier Paid cost estimates marked superseded, with no Paid price or usage-block assumption used as a current cutover requirement? [Clarity, Spec §SC-011, §SC-012; Cost Policy]
- [ ] CHK045 Are optional Images, KV, R2, Durable Object, D1 and Queue activation requirements defined by a documented compatibility/performance/cost evidence threshold? [Completeness, Spec §FR-019, §SC-014]

## Phase 5 — DNS Cutover & Operations

- [ ] CHK046 Does the DNS inventory requirement cover apex, `www`, NS/DS, CAA, MX, SPF, DKIM, DMARC, verification TXT, email/subdomains and third-party ownership metadata? [Completeness, Spec §FR-027, §FR-028; DNS Contract]
- [ ] CHK047 Are DNS record target, TTL, priority, proxy mode, owner, disposition and verification ownership measurable and owner-approved before nameserver change? [Acceptance Criteria, Spec §FR-027, §FR-028]
- [ ] CHK048 Is the DNSSEC disable/wait/re-enable sequence complete for unknown, enabled and disabled starting states? [Scenario Coverage, Spec §FR-033]
- [ ] CHK049 Are hard-cutover requirements consistent with DNS propagation uncertainty and the claimed operator-caused downtime limit? [Measurability, Spec §FR-015; §SC-005]
- [ ] CHK050 Are TLS, canonical, sitemap, redirects, indexed paths and email continuity requirements tied to explicit pre/post-cutover snapshots? [Completeness, Spec §FR-029; DNS Contract]
- [ ] CHK051 Are Worker rollback, DNS rollback, certificate recovery, email recovery and preview-index recovery independently scoped? [Recovery, Spec §FR-034; User Story 2]
- [ ] CHK052 Is the 15-minute rollback requirement clear about approval start, operator work, DNS propagation exclusion and healthy-layer preservation? [Clarity, Spec §SC-006]
- [ ] CHK053 Are the stabilization duration, availability window and unresolved-incident criteria defined consistently with the 7-day success criterion? [Consistency, Spec §SC-007]

## Phase 6 — Deferred Registrar Transfer

- [ ] CHK054 Are requirements explicit that no unlock, auth-code request, registrant change, submission or payment occurs without a separate owner trigger? [Completeness, Spec §FR-030]
- [ ] CHK055 Are the 60-day rule, lock/privacy lock, DNSSEC, auth-code validity, contact email, renewal and payment checks each assigned a pass/fail requirement? [Coverage, Spec §FR-031, §SC-023]
- [ ] CHK056 Is "Cloudflare DNS authoritative and Worker healthy" quantified with stabilization/evidence prerequisites before transfer eligibility? [Clarity, Spec §FR-032]
- [ ] CHK057 Are registrar-transfer pending, failure, rejection and approval-delay scenarios required to preserve Worker, DNS, HTTPS, canonical, sitemap and indexed paths? [Recovery, Spec §FR-034, §SC-024]
- [ ] CHK058 Are sensitive auth-code and registrant-contact handling requirements explicit about storage, disclosure, logging and expiry? [Security, Spec §Key Entities; DNS Contract]
- [ ] CHK059 Is the feature-boundary requirement clear that registrar transfer is a separate future operation and not an implicit completion condition for feature 004? [Consistency, Spec §FR-030, §SC-022]

## Cross-Phase Ambiguities & Acceptance Quality

- [ ] CHK060 Are all success criteria traceable to a named phase gate with a defined evidence artifact and accountable owner? [Traceability, Spec §SC-001–SC-028; Gap]
- [ ] CHK061 Are remaining "approved runtime exceptions" constrained by an objective decision record so they cannot silently expand static-first scope? [Ambiguity, Spec §SC-025]
- [ ] CHK062 Is the phrase "no regression" decomposed into objective route, API, commerce, analytics, accessibility, SEO and performance outcomes? [Clarity, Spec §User Story 1; §SC-001–SC-028]
- [ ] CHK063 Are requirements consistent on whether public Creativa GET caching may change from `no-store` to 24h while route/API parity is required? [Conflict, Spec §API Route Decision; §FR-004, §FR-009]
- [ ] CHK064 Is the source-of-truth relationship among spec, plan, contracts, data model and quickstart defined when statements differ? [Traceability, Gap]

## Notes

- Phase 0–3 should be complete before task generation; Phase 4–6 may require owner-account and domain evidence not available during code implementation.
- Requirements gaps or conflicts should be resolved in `spec.md`/`plan.md`; implementation tests belong in `tasks.md` and later validation artifacts.
