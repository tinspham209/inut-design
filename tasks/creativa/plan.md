# INUT Creativa — Implementation Plan

**SDD gate:** Plan and test-plan refinement.
**Status:** Baseline plan and test strategy accepted by the owner on 2026-10-23; this reverse-validated refinement is pending review. All implementation tasks are **not started**.
**Date:** 2026-10-22.
**Refinement date:** 2026-10-23.
**Source of truth:** This revised plan governs implementation scope, task dependencies, exit evidence and the dispositions below. [test-plan.md](./test-plan.md) supplies the linked procedures. Earlier documents supply the approved business requirements; an older implementation detail does not override an explicit refinement here. No acceptance criterion is silently removed or weakened.
**Verification amendment:** The owner's next-gate instruction requires a test plan, not test code, without a new unit-test suite, tooling or invented coverage target. [test-plan.md](./test-plan.md) governs verification methods; earlier proposed test-script names are not required quality gates.
**Authority:** [Approved technical design](./technical-design.md), [approved specification](./specs.md) and [approved idea](./idea.md).
**Boundary:** Execution order, dependencies, completion criteria and verification/release gates. Creating this plan does not implement features, approve production deployment, authorize test orders or request a multi-agent workflow.

## 1. Delivery contract

Deliver the approved MacBook-skin launch on a shared Creativa commerce foundation:

- `/creativa/skin-laptop` and readable product details, with the approved image-first light UI, mobile one/two-column switch and existing-style gallery interactions.
- One `/creativa/cart`, `/creativa/checkout` and `/creativa/order-tracking/[slug]`, ready for future typed Creativa categories without building those categories now.
- Dedicated Creativa schemas/configuration and private server-side order records, independent of lighters.
- Authoritative quote/order acceptance, atomic 10-character prefix-free public-ID allocation, idempotent recovery and immutable order snapshots.
- Uncapped browser-local saved-ID history, one-tap tags from both tracking search pages, copy controls and safe storage-failure handling.
- Manual sales/fulfillment handoff and dual analytics with the approved privacy/deduplication limits.
- Legacy SEO continuity, honest guide placeholders and no regression to lighter commerce.

Preserve the final owner decisions: no preselected MacBook model, first active coverage selected initially as Lưng, quantity 1, catalog from-price initially 100,000 VND and selected Lưng price 120,000 VND. Only name and a 10-digit phone are required; address/email/note remain optional. Public IDs have no category/brand prefix.

Do not introduce accounts, another order schema per category, a universal INUT/lighter cart, a product-builder framework, a queue, a new dataset/service, payment gateways, custom artwork editing, automated fulfillment or a real guide CMS.

## Gap Report

**Reverse-review result:** the baseline named all 116 requirements and 52 AC IDs, but naming them did not establish task-level sufficiency. A coded but empty catalog, inaccessible print master, unprovable fault case or replayed local completion could still miss the business goal. These are planning/evidence gaps, not findings about implemented application code.

“Addressed” below means assigned an enforceable task/test exit, **not** that the runtime behavior is verified.

| Gap | Finding and affected outcome | Revised disposition / owner |
| --- | --- | --- |
| GAP-01 | Grouped traceability did not give every AC an observable exit. CR-19 could be read as complete with “an explicit blocking failure.” | Replace that wording with pass-only completion and add the one-row-per-AC reverse matrix. CR-19 remains blocked for any required missing/failing evidence; CR-20 cannot override it. |
| GAP-02 | G-02/G-03 listed content/configuration as inputs, but no task owned loading, validating and publishing a usable launch catalog. Schemas/UI alone could ship empty or misconfigured. | Add CR-21 with engineering + owner acceptance of designs, images, model/coverage order, fees, bank, support and recipients. No automatic activation of unverified models. |
| GAP-03 | A design/model/coverage label did not prove staff can obtain the right printable artwork/cut template or handle an omitted address. | Add CR-22: an authorized synthetic-order production/payment/delivery handoff rehearsal. Staff must open the retained correct assets and explain manual follow-up without inventing fulfillment automation. |
| GAP-04 | Collision exhaustion, commit loss, exact race interleavings and native Safari were expected without demonstrated controls/access. Source review cannot substitute for AC-45 or a native-device run. | Add CR-23's evidence-feasibility ledger early. CR-07, CR-10 and CR-19 carry the relevant unresolved blockers, with no public fault endpoint, new test suite or “simulated pass.” |
| GAP-05 | Automatic collectors, outgoing referrers, page/data/API caching and host logs had broad policy prose but incomplete shared-file ownership. Noindex alone does not prevent disclosure. | CR-10 owns pre-bootstrap collector/URL/referrer policy and scoped header integration; CR-04 owns API no-store/private projections; CR-18 owns metadata/indexing. Add CT-11/BDD-27 for direct load, SPA exit, data/API and cache evidence. |
| GAP-06 | Canonical quote/fingerprint bytes and volatile fields were unspecified; timestamps or cosmetic `_rev` changes could make every submit conflict or require pointless reconfirmation. | CR-02/CR-06 define versioned canonical business fields; CR-07 consumes the same rules. Generated time, request IDs and cosmetic revisions are not digest inputs; production/price/availability/payment meaning changes still require review. |
| GAP-07 | Acceptance completion mixed cart/history handling with optional analytics. Reload between side effects could subtract twice, resurrect a forgotten shortcut, or keep confirmation waiting on a collector. | CR-08/CR-17 add replay-safe local checkpoints; CR-16 is outside the required navigation path. Add DB-11, NE-11, BDD-24 and BDD-25. Accepted checkout remains usable even when ancillary work stalls. |
| GAP-08 | One recovery journal could be overwritten by a new checkout while the original outcome was unknown; “duplicate prevention” did not distinguish same versus different capabilities. | CR-08/CR-17 must resolve a recognized existing attempt before replacement. Add CT-12/NE-12/BDD-26. Do not promise semantic deduplication across independently created capabilities or devices. |
| GAP-09 | AN-04 mapped to analytics work but no task explicitly delivered the existing analytics guide update or per-event producer ownership. | CR-10 owns the event/producer/property map and `docs/ANALYTICS_GUIDE.md` update; UI tasks bind that map, CR-16 owns only conversion permission/payloads. CT-14 checks the entire approved catalog, not only purchase. |
| GAP-10 | A passing build, log-only browser script or mocked namespace could be mistaken for native UX, actual permissions or runtime success. | CR-01 records gate limits; CR-23 identifies actual access; CR-19 requires the evidence class named in each oracle, including real target denial and iPhone/Safari. No new coverage percentage/tooling. |
| GAP-11 | Pause/rollback continuity was described but not explicitly rehearsed with an already accepted order. | Add BDD-29 and CR-19/CR-20 exits: pause fresh purchases while accepted lookup/recovery survives; no return to a pre-Creativa deployment or deletion of intent/index barriers. |
| GAP-12 | Cross-surface configuration details lacked focused oracles: equal option sort order, negative/non-finite prices, missing-image behavior and correctness after a harmless content edit. | CR-02/CR-03/CR-05/CR-06/CR-12 define deterministic option ordering, invalid-money rejection and honest asset/error states. CT-13/NE-13 and CR-21 verify launch data. No unapproved free-product or stock policy is inferred. |

## Assumption Report

An assumption is not closed by listing it. Each unverified enablement assumption needs its stated witness before the affected task can be called complete. A decision marked confirmed is a scope boundary, not an untested runtime pass.

| Assumption | Status | Witness / responsible task |
| --- | --- | --- |
| ASM-01 — Existing Sanity permissions, Studio v2 actions and server SDK support the designed private namespace/atomic operations on the actual target. | Unverified deployment capability. | CR-23 inventories access; CR-03/CR-07/CR-19 supply authenticated/anonymous and transaction evidence. No customer data before denial is proven. |
| ASM-02 — Deterministic collision/exhaustion, interrupted-commit and claim/notification race controls are available without new tooling. | Unverified; potential blocker. | CR-23 names an authorized existing method for each hard case. If unavailable, stop its acceptance claim and seek an explicit verification/design amendment; do not silently substitute review for execution. |
| ASM-03 — Real GA4/GTM/Umami/Vercel configuration permits pre-send filtering and one effective transport on direct and SPA loads. | Unverified external capability. | CR-23 feasibility record, CR-10 integration and CR-19 network/container witness. Inability to prevent raw lookup capture blocks launch, not an excuse to suppress required measurements silently. |
| ASM-04 — A real iPhone/Safari and owner/operator reviewers are available. | Unverified access. | CR-23 books the evidence route; CR-19/CR-22 record actual device and operator results. Mobile emulation is not the substitute. |
| ASM-05 — The supplied labels and images identify supported hardware and a printable, retainable design version. | Not established by screenshots. | Owner supplies fit/assets/rights; CR-21 validates publication data and CR-22 opens the correct production master/template from the accepted snapshot. |
| ASM-06 — Independent shipping/default fee, bank instructions, sales/support destinations and final wording are complete and approved. | Owner input still required. | CR-21 configuration checklist and CR-22 operational rehearsal; optional address uses the configured fee and manual follow-up, not fabricated delivery data. |
| ASM-07 — localStorage is durable, unlimited or transactional across keys/tabs. | Explicitly false. | CR-08/CR-09/CR-17 implement observable failure/checkpoints; CR-19 tests denial/quota/reload and stated best-effort cross-tab limits. No account/cloud sync is implied. |
| ASM-08 — Two independent capabilities necessarily represent the same purchase. | Not promised. | Idempotency binds one canonical intent to one capability. CR-17 prevents knowingly replacing an unresolved journal; separate deliberate intents may create separate orders. |
| ASM-09 — A quote reserves price forever or every CMS edit changes its commercial meaning. | Neither is promised. | CR-06/CR-07 evaluate current business state at the documented validation point; no price-hold service. Cosmetic edits must not cause false conflicts; changed artwork/fit/price/fee still does. |
| ASM-10 — Notification/conversion permission proves exactly-once external receipt. | Explicitly false; approved delivery limit. | CR-15/CR-16 retain sent/failed/unknown or at-most-once permission semantics. CR-19 distinguishes dispatch permission, observed receipt and interruption loss. |
| ASM-11 — Process-local LRU counters are a distributed host-wide abuse control. | Explicitly false. | CR-04 plus CR-23/CR-19 verify trusted proxy/host controls and disclose the actual limit. No Redis/service is authorized by inference. |
| ASM-12 — An existing script's “passed” line or a green deploy job proves its named journey. | Explicitly false. | CR-01/CR-19 use the actual lint/build/script scope and observed contract/database/browser evidence; deployment is not a test gate. |

## Over-engineering Report

| Item | Decision | Boundary |
| --- | --- | --- |
| OE-01 — Generic multi-product framework, plugin registry or another active category just to prove scale. | Exclude. | One typed skin implementation with a narrow extension boundary; inspect a synthetic contract fixture and reject unregistered production types. |
| OE-02 — Separate carts/orders by category or a universal main-brand cart. | Exclude. | One Creativa domain; lighters remain separate. Do not weaken the shared-cart business goal in the name of a smaller implementation. |
| OE-03 — Intent/order/lookup records and cryptographic ID allocation. | Retain the minimal safeguard. | They enforce accepted recovery and atomic short-ID uniqueness in this stack. Do not add a second database, allocation service, extra audit store or speculative generic transaction engine. |
| OE-04 — Whole-document revision/time hashes and signed price-reservation services. | Simplify/exclude. | Hash canonical commercial/production meaning, not incidental metadata. Store source revisions for audit without forcing all cosmetic edits into quote conflicts. No signed hold/TTL service is required. |
| OE-05 — Cart contribution tracking expanding into inventory/stock reservations, replicated logs or distributed browser locking. | Keep only what ORDER-06 needs. | Stable contribution identity and replay-safe cleanup; no stock system, undo engine or global cross-device “exactly once” claim. |
| OE-06 — Analytics/notification outbox, new queue, server measurement platform or retry-until-delivered guarantee. | Exclude. | Compact revision-guarded state in existing records, explicit manual reconciliation and nonblocking browser dispatch. Preserve the approved durable deduplication requirement rather than deleting it as “just analytics.” |
| OE-07 — Empty article scaffolding, guide CMS, fake content or copied competitor features. | Exclude unnecessary machinery. | Ship the honest guide index and reserved-slug/404 behavior; no dynamic article file is needed before real articles. No account/review/currency/case feature. |
| OE-08 — New unit framework, CI/coverage platform, production debug endpoint or compulsory hypothetical test scripts. | Exclude. | Existing gates and described contract/database/manual BDD evidence only. Missing hard-case control is an explicit blocker, not permission to add tools or fake proof. |

## Reverse validation: business outcomes

| Outcome | “Complete” must visibly mean | Implementation and decisive evidence |
| --- | --- | --- |
| BO-01 — Self-service mobile discovery/configuration | Owner-approved, nonempty live category; correct images/model/coverage, compact mobile views and understandable selected/from-prices. | CR-05/CR-11/CR-12/CR-21; CT-01/CT-02/CT-13, BDD-02/BDD-03/BDD-23. |
| BO-02 — One correct Creativa purchase | All reviewed lines accepted once at server-derived values; one public ID and immutable snapshots; no lighter mutation or partial purchase. | CR-06/CR-07/CR-08/CR-17; DB-01/DB-02/DB-04/DB-05, AC-19/AC-20/AC-22/AC-45. |
| BO-03 — Find/recover without login | Accepted recovery, copy actions and uncapped browser shortcuts work without repeating side effects or blocking confirmation on analytics. | CR-08/CR-09/CR-14/CR-17; DB-09/DB-11, CT-12, BDD-14 through BDD-18 and BDD-24 through BDD-26. |
| BO-04 — Staff can actually print and fulfill manually | Staff can identify/open the retained design and correct cut template, read all selections, handle payment/unknown delivery and obtain an omitted address manually. | CR-15/CR-21/CR-22; BDD-28 and a signed synthetic handoff, not a notification screenshot alone. |
| BO-05 — Separate brand, expandable domain, preserved SEO | Dedicated shell/shared Creativa routes, independent settings, unchanged lighter journey, legacy discovery and honest guide placeholder. | CR-03/CR-11/CR-14/CR-18; DB-07, RG-01 through RG-06, BDD-22. |
| BO-06 — Useful and private ecommerce measurement | Approved event catalog/attribution and accepted-order values are observable once per destination without reference/customer leakage or new dashboard infrastructure. | CR-10/CR-16/CR-19; CT-11/CT-14, BDD-19/BDD-20/BDD-27 and actual collector evidence. |

Completing code alone does not establish these outcomes. Under the revised exits, **all tasks complete** implies that every outcome above and every row of the AC reverse matrix below has its required passing witness. Unknown inputs or blocked witnesses therefore prevent that completion claim. This is a planning-level closure argument, not a runtime test result.

## 2. Execution rules and external gates

### Task completion

A task is done only when its scoped implementation/operational deliverable, connected consumers and required passing witnesses are complete. Code-complete with a failed, not-run or blocked required witness is not done. CR-23's discovery deliverable can document a capability gap, but the affected implementation/acceptance task remains blocked. No new unit-test suite is required; simulated responses cannot establish actual permissions, delivery or browser behavior.

Use the dependency table as the source of execution prerequisites, not numerical order alone. Independent tasks may proceed separately when their write surfaces do not conflict. This is an ordinary implementation plan, not authorization to launch agents or run a workflow.

Do not commit, deploy, seed production data, send production notifications or create real orders without authorization. Preserve unrelated worktree changes. Resolve implementation discoveries against the approved design; ask for an amendment rather than silently changing a contract.

### External gates

| Gate | Owner/input | Needed before |
| --- | --- | --- |
| G-01 | Authorized isolated Sanity target, server token permissions and synthetic-data/notification authorization. | CR-23 feasibility and actual private-data/transaction witnesses; no customer data before denial is proven. |
| G-02 | Approved model/Interior fits, retained printable masters/templates, three-view gallery assets, wording and any displayed claims. | CR-21 publication readiness and CR-22 handoff; not merely a final code review. |
| G-03 | Independent shipping/default fee, bank, sales/support destinations and server-only bot credential. | CR-21 configuration and CR-22 operational readiness; earlier tests use explicitly authorized fake values. |
| G-04 | Actual collector/container, proxy/edge/log access and permitted fault-control methods. | CR-23 feasibility, affected task witnesses and CR-19/CR-20; source assumptions are insufficient. |
| G-05 | Baseline plan/test strategy accepted; refined plan/test plan are the current review, then separate release authorization. | Implementation execution, then production activation respectively. |
| G-06 | Real iPhone/Safari and owner/staff review availability. | Native-device CR-19 evidence and CR-22's operational signoff; viewport emulation is not the substitute. |

These inputs are **unconfirmed until supplied/verified**, not assumed available and not invented. Missing external access does not prevent isolated pure/mock work, but it does block the corresponding integration/release claim.

## 3. Task graph

Dependencies below are explicit prerequisite tasks; inherited prerequisites also apply. The implementation checkpoint below records work actually performed; it is not an AC/release signoff.

| Task | Deliverable | Depends on |
| --- | --- | --- |
| CR-01 | Baseline, authorized fixtures, quality-gate inventory and scope safeguards | — |
| CR-02 | Pure typed contracts, validation and identity/money helpers | CR-01 |
| CR-03 | Separate Sanity schemas and Studio controls | CR-02 |
| CR-04 | Server/public adapters, response contracts and API guards | CR-02, CR-03 |
| CR-05 | Cursor catalog, product and options reads | CR-04 |
| CR-06 | Authoritative quote, shipping and payment availability | CR-04 |
| CR-07 | Short IDs, durable intents, atomic acceptance and recovery | CR-06, CR-23 |
| CR-08 | Shared persisted cart, contribution reservations and recovery journal | CR-02 |
| CR-09 | Uncapped plain-array history helpers and hook | CR-02 |
| CR-10 | Safe event facade, producer documentation and pre-bootstrap privacy | CR-02, CR-23 |
| CR-11 | Creativa shell, neutral home and guide placeholders | CR-05, CR-08, CR-10 |
| CR-12 | Catalog/detail UI and purchase configuration | CR-05, CR-08, CR-11 |
| CR-13 | Shared cart page and current-quote review | CR-06, CR-08, CR-11 |
| CR-14 | Safe tracking API, both search entry points and saved tags | CR-07, CR-09, CR-11 |
| CR-15 | Durable sales handoff and operator retry path | CR-07 |
| CR-16 | Durable conversion claims and accepted-order event payloads | CR-07, CR-10 |
| CR-17 | Checkout page and complete accepted/rejected/recovery journey | CR-07, CR-13, CR-14, CR-15, CR-16 |
| CR-18 | Legacy CTA migration, metadata and sitemap continuity | CR-11, CR-12, CR-14 |
| CR-19 | Passing business/AC acceptance, native privacy/telemetry and regression evidence | CR-17, CR-18, CR-22 |
| CR-20 | Owner acceptance, operational readiness and controlled release | CR-19 |
| CR-21 | Owner-backed launch data/configuration and publication validation | CR-03, CR-05, CR-06, CR-11 |
| CR-22 | End-to-end manual production/payment/delivery handoff rehearsal | CR-14, CR-15, CR-17, CR-21 |
| CR-23 | Early assumption, permission, vendor and hard-case evidence feasibility | CR-01 |

Task numbers preserve earlier references, not execution order: CR-23 starts after CR-01, while CR-21/CR-22 occur before final acceptance. CR-02 and CR-23 can proceed independently. After CR-02, schema and browser-state work can proceed separately; privacy/acceptance work additionally consumes CR-23's findings. An unavailable vendor does not block unrelated pure contracts, but it does block the witness that actually needs that vendor.

### Implementation checkpoint

Checked means the task's scoped witness is available, not merely that files were created. Unchecked implementation-present entries retain their external or later-phase acceptance work. No AC has been transitioned by this implementation checkpoint.

- [x] CR-01 — Read supplied documents/local rules; existing lint baseline passed; isolated local port and browser-only response fixtures used; no production mutations/sends.
- [x] CR-02 — Typed contracts, canonical ordering, exact phone/optional fields, merge identity and safe arithmetic exercised with the existing Node loader; TypeScript passes.
- [ ] CR-03 — Schemas/actions implemented; current Studio build passes. Actual authoring/permission witnesses remain pending.
- [ ] CR-04 — API adapters/guards implemented and read-only HTTP integration exercised; actual private-target evidence pending.
- [ ] CR-05 — Cursor/public reads implemented. The configured dataset returns no active Creativa options; catalog explicitly reports missing configuration, not invented products.
- [ ] CR-06 — Authoritative quote/semantic digest implemented; synthetic-record calculation and malformed configuration checks exercised. Real approved configuration pending.
- [ ] CR-07 — Atomic service/recovery implemented; in-memory SDK acceptance/claim race checks reported by implementation worker. Actual Sanity transaction/anonymous-access witnesses not executed.
- [ ] CR-08 — Cart/journal implemented; repeated contribution cleanup preserves later additions in local checks; quota failure keeps an explicitly warned live-tab cart. Exact interruption/native witnesses pending.
- [ ] CR-09 — Plain uncapped history implemented; 61 IDs/dedup/forget and one accepted browser-only fixture exercised. Full browser failure/device matrix pending.
- [ ] CR-10 — Facade/bootstrap and documentation implemented; Node VM verifies page/API/data URL policy parity. Hosted collector/container/log evidence pending.
- [ ] CR-11 — Dedicated shell/home/guide implemented and mobile Chromium development rendering exercised; owner/native visual acceptance pending.
- [ ] CR-12 — Catalog/detail implemented; browser-only fixtures exercised columns, explicit model, coverage defaults and addition. Browser CDN requests returned 403; actual asset/fit evidence is not claimed.
- [ ] CR-13 — Shared cart implemented; browser-only quote fixture reviewed at selected quantity/price. Full real configuration/error matrix pending.
- [ ] CR-14 — Tracking implemented; root history tag reached Creativa with Lighters selected. Public lookup was browser-intercepted for the synthetic order; no actual private read is claimed.
- [ ] CR-15 — Server handoff/operator retry implemented. No dedicated credential/approved destination supplied; no real send performed.
- [ ] CR-16 — Durable claims implemented and bounded payloads exercised in isolated worker checks; actual hosted delivery/interruption evidence pending.
- [ ] CR-17 — Guest form/browser-only accepted response exercised with blank optional fields; cart became empty, history stayed one entry and journal cleared. No real order was created.
- [ ] CR-18 — Legacy ordering destinations and SEO exclusions implemented; production build/postbuild SEO smoke pass. Complete browser/owner crawl pending.
- [ ] CR-19 — Reserved for the separate verification phase; no complete AC pass claimed.
- [ ] CR-20 — No deployment, activation, real order or main-branch operation authorized/performed.
- [ ] CR-21 — Blocked on approved new catalog/model/print/fee/bank/recipient content; legacy artwork was read only for a clearly labeled local UI fixture.
- [ ] CR-22 — Blocked on actual operator/production-fit/asset handoff authorization and inputs.
- [x] CR-23 — Evidence feasibility recorded below; discovery completion does not discharge its downstream blockers.

### Evidence feasibility checkpoint

| Witness | Current implementation evidence / remaining prerequisite |
| --- | --- |
| Pure request/quote/state contracts | Existing Node + repository TS loader used; no new unit runner or test files added. Root loader extended for `.server.ts` imports; existing 42-check SPX regression passes. |
| Application race/collision/claim control | In-memory SDK controls used by the implementation worker, not a real Sanity transaction. Actual target/authorization and deterministic database witness remain unverified. |
| Browser integration | Chromium at 390×844, local-only intercepted CMS/quote/order responses; accepted UI/history/cart cleanup observed. This is not a database/production-order test. |
| Actual Creativa configuration | Read-only options response has empty model/coverage lists; catalog returns explicit configuration error. No production data was seeded. |
| Asset access | Existing public legacy image references were used only in a local fixture. Browser CDN responses were 403; cause/real publication readiness unverified. |
| Local storage | Manual Node state checks included 61 IDs and quota failure; exact browser crash windows/multiple-device/native behavior remain unexecuted. |
| Telemetry policy | Runtime/static bootstrap URL and property guards checked with harmless canaries in Node VM; actual GA4/GTM/Umami/Vercel container/network/log gate remains open. |
| Staff delivery | Dedicated bot credential/approved recipients absent; no external notifications sent. |
| Native/owner acceptance | No actual iPhone/Safari or owner/operator signoff performed. |
| Repository stop gates | Lint and TypeScript pass; SPX 42 checks pass; application production build, postbuild SEO smoke and Studio build pass. Browserslist/formatter deprecation notices are pre-existing tooling warnings. |

### Rework checkpoint — audit round 1

These boxes record the actionable finding's applied fix plus its targeted isolated witness, not closure of its parent CR task or any external acceptance gate. See [audit-report.md](./audit-report.md) for historical evidence and subsequent audit status.

- [x] I-01 — Confirmed-terminal rejection is an explicit server envelope signal; transient configuration/service errors retain the pending capability.
- [x] I-02 — Fresh journal ownership/checkpoints suppress stale completion side effects after history was forgotten; isolated independent-instance probe passes.
- [x] I-03 — Invalid cart entries are quarantined individually; explicit repair retains healthy entries and checkout stays blocked until repair.
- [x] I-04 — Valid long staff handoffs use complete bounded parts with per-part resume/reconciliation, not permanent `MESSAGE_TOO_LARGE`.
- [x] I-05 — Untouched coverage defaults follow current active order; deliberate valid selection is preserved.
- [x] I-06 — Newly appended deduplicated products receive their own list impressions/batch/layout context; duplicate pages do not replay old impressions.

The post-rework repository stop gate passes. E-01 through E-04 remain open; no production send/order/write or native/hosted witness is inferred from these checkboxes.

### Shared-file ownership

- CR-03 owns new schema registration and Studio action integration.
- CR-10 owns route-aware `_app.tsx`, `_document.tsx`, collector initialization, scoped referrer/header integration in `next.config.js` where needed and `docs/ANALYTICS_GUIDE.md`.
- CR-11 owns `CreativaLayout` and new/copied shell components; do not rewrite main-brand headers.
- CR-14 owns root `/order-tracking` changes.
- CR-18 owns sitemap/SEO/shared optional metadata changes and legacy CTA surfaces.
- CR-21 owns approved content/configuration population; CR-22 owns operator evidence, not a new automated print/delivery subsystem.

Coordinate any necessary cross-task edit through that owner. Do not parallelize writes to the same shared file or duplicate a shared helper to avoid coordination.

## 4. Revised implementation tasks

### CR-01 — Establish a safe baseline and verification setup

**Scope:** Recheck the worktree, manifests, existing helpers and approved source assumptions before editing. Record pre-existing relevant failures separately. Confirm G-01/G-04 availability without printing credentials or calling production mutation APIs.

**Surfaces:** Existing manifests/regression scripts and the approved test plan; existing browser/HTTP/CMS inspection facilities.

**Completion:** Identify authorized synthetic records, browser-state conditions and available request/failure controls. Use the current repository commands and contract/database/browser verification approach. Do not create a unit framework, test-code files or new tooling merely to satisfy this setup task; record unavailable fault controls as blockers for the affected checks.

**Verification:** Establish a targeted lighter/cart/route baseline suitable for later comparison; inspect prerequisites and side effects before running any existing script. Nonproduction fixtures must not be confused with production authorization.

### CR-02 — Define the common contracts and pure validators

**Scope:** Implement `models/creativa.ts` and bounded helpers under `utils/creativa/` for typed purchase/cart/quote/order views, errors, canonicalization, safe arithmetic and reference validation.

**Completion:** `skin-laptop` is the only real discriminated union member. Identity includes type/design/model/coverage. Reject unknown types, invalid options/quantities and unsafe arithmetic. Define the public 10-character format and independent 43-character checkout capability contract. Share client/server field validation without importing server code into React.

**Refined exit:** Define versioned canonical field sets and deterministic ordering for both intent fingerprint and quote digest. Include selected commercial/production meaning, quantities, authoritative money, shipping and payment availability. Exclude generated timestamps, request/analytics IDs and harmless display-only edits; retain source revisions as audit data. Define stable option tie-breaking and reject negative/non-finite/unsafe configured money rather than relying on Studio alone. No new free-product policy is inferred from an invalid/zero test value.

**Verification:** Cover all four prices and Full's independent bundle rule, from-price versus selected price, model-independent pricing, required name/exact 10-digit phone and optional fields, canonical ordering, overlapping identifiers and synthetic future-type boundary checks. No Zalo/+84 behavior is introduced.

### CR-03 — Add independent schemas and staff-safe Studio controls

**Scope:** Add the nine document types and embedded objects in the design's [schema contracts](./technical-design.md#42-schema-contracts); register them in `sanity/schemas/schema.js`.

**Completion:** All titles use `Creative - `. Catalog/options/shipping/bank are independent; sales/orders/intents/lookup records use the designed private namespaces. Add authoring validation, server-managed/read-only financial fields, protected support records and manual status/payment/tracking edits. Prevent deletion/duplication that would break order history.

**Verification:** Validate reserved/duplicate slugs, three required gallery views, safe prices, exactly one default shipping rule, verified model activation and unique array keys. Build the Studio after schema/action edits. Use fixtures, not automatic production seeding or active unverified screenshot models; actual access denial is proven in CR-19.

### CR-04 — Implement explicit adapters and API infrastructure

**Scope:** Create `api-client/creativa-server.ts`, public/browser wrappers, shared envelopes/errors and Next-compatible request guards. Keep server-only helpers in explicit server modules.

**Completion:** Authenticated direct reads use `useCdn: false`. Browser bundles never import tokens/private projections. Add method/origin/body validation, request-specific rate-limit tokens, safe logs and no-store policies for checkout/orders. Keep not-found, configuration error and service failure distinct.

**Verification:** Test public/private projection separation, wrong types/domains, disabled credentials/configuration, oversized/invalid requests, origin rejection and rate-limit responses. Do not copy existing broad order reads, unsafe response casts or constant-token limits.

### CR-05 — Deliver catalog/product/options read contracts

**Scope:** Implement `GET /api/creativa/catalog`, `products/[slug]`, `options` and the explicit catalog query wrapper.

**Completion:** Only active published Creativa designs appear. First batch is 24; cursor uses creation time/ID and normalized search identity. Search is parameterized, case-insensitive and visibly limited to the approved 80-character convention. Public projections have only required card/detail/option fields.

**Verification:** Equal-date boundaries, inserted/removed records, malformed/wrong-query cursors, duplicate IDs, draft/unavailable slugs, no active prices, genuine empty results and CMS failures. Preserve a deterministic order and do not normalize failures into empty success.

### CR-06 — Implement current authoritative quotes

**Scope:** Implement `POST /api/creativa/quote` and server quote/shipping/payment helpers.

**Completion:** Directly validate product/model/coverage ownership, active state and fit; compute all money safely; apply the selected coverage price and one combined shipping fee. Optional address selects the configured default; Đà Nẵng matching prefers its active rule. Resolve valid COD/bank availability without main-brand fallbacks. Return canonical amounts/revisions/digest.

**Refined exit:** With unchanged business inputs, repeated evaluations produce the same digest despite evaluation time/request ID changes. A harmless text/alt/sort edit does not force a price conflict; an actual artwork/fit/coverage meaning, availability, unit-price, shipping or selected-payment availability change does. Evaluate current records at the documented server read point; do not add a price-hold service or claim retroactive protection from later edits.

**Verification:** Full is 310,000 rather than 370,000 VND; designs/models share coverage prices; deliberate zero shipping differs from missing configuration; invalid email only fails if supplied; default/regional rule absence and missing bank configuration produce the approved outcomes. Client totals never become authority.

### CR-07 — Implement atomic acceptance and capability recovery

**Scope:** Implement secure allocation, private intent/order/lookup writes, `POST /api/creativa/orders` and `orders/resolve`.

**Completion:** Use the approved `pending`/`accepted`/`rejected` lifecycle, immutable request fingerprint, quote re-evaluation, revision-guarded terminal transitions and one create-order/create-lookup/accept-intent transaction. Generate public IDs cryptographically; retry collisions up to five candidates without overwriting another order. Preserve terminal barriers and separate internal/public/analytics/capability identities.

**Refined exit:** Consume the canonical field definitions from CR-02/CR-06, not independent JSON/hash implementations. Same-intent replay does not depend on today's availability; cosmetic quote metadata does not cause a false conflict. The application collision/exhaustion and tombstone cases need CR-23's executable evidence method; a separate raw Sanity transaction experiment is not enough to mark those application branches verified.

**Verification:** Concurrent same/different intents, quote changes, forced collisions/exhaustion, lost response after commit, concurrent rejection/acceptance and direct-document recovery. Explicitly test the unbound-resolution tombstone racing a delayed submit. Replays return the original accepted ID/snapshot after later catalog changes; failures never claim partial acceptance.

### CR-08 — Build the shared cart and recovery journal

**Scope:** Implement `store/cart/creativaCart.ts`, hydration/validation helpers and `inut-creativa-checkout-attempt` journal handling.

**Completion:** Use `inut-creativa-cart` independently of `inut-lighters-cart`. Merge matching configurations visually while tracking contribution identities. Reserve submitted quantities until resolution; preserve subsequent same/different-product additions. Hydration, quarantine/error state and journal recovery must not silently empty the cart. Never persist customer fields/full request bodies in the journal.

**Refined exit:** Local completion must be replay-safe after interruption between cart mutation, history handling and journal checkpoint updates. Removing a submitted contribution twice is a no-op; a newer contribution is never mistaken for the old one. Do not knowingly overwrite an existing unresolved capability with a new checkout. Track history-handling separately from cart reconciliation and optional metrics; do not retain/replay local side effects solely because analytics is unavailable.

**Verification:** Add/merge/edit/remove, unit badge, reload, unknown/corrupt persisted data, storage denial, exact contribution cleanup and remove/re-add ambiguity. Use browser/storage observations and contract review without publishing another category. An unavailable backend must produce an observed error, not a simulated pass.

### CR-09 — Implement uncapped local order history

**Scope:** Add plain storage helpers and `useCreativaOrderHistory` under the proposed utility/hook areas.

**Completion:** `inut-creativa-order-history` is a JSON string array only. Unseen accepted IDs are prepended; existing IDs stay once/in place. No cap, TTL or status pruning. Read current storage before mutation; observe storage/focus refresh; preserve the documented best-effort cross-tab limitation.

**Refined exit:** Once an accepted attempt's local history handling is finished or explicitly dismissed, a delayed analytics/recovery callback must not re-add an ID the customer subsequently forgot. This sequencing belongs to the CR-08/CR-17 completion ledger; do not add a second history database, hidden permanent history tombstone set or account sync.

**Verification:** More than 50 IDs, exact ordering/deduplication, malformed/non-array/partially invalid input, SSR, blocked/full storage, failed writes and explicit reset/remove/clear. Nothing clears orders/carts/other keys. Direct lookup/navigation does not call remember; checkout wiring is completed in CR-17.

### CR-10 — Establish safe analytics before live-flow integration

**Scope:** Implement `utils/creativa/analytics.ts`, URL/title/referrer policy, scoped cache/referrer protections and route-aware bootstrap changes. Update the existing `docs/ANALYTICS_GUIDE.md`.

**Completion:** Use the approved event names, allowlisted fields and one effective transport per destination. Creativa events use one guarded GA4 dispatch plus Umami, not duplicate combined helpers/data-layer tags. Install Umami before-send sanitization before loading its script. Preserve root behavior and existing consent/enabled-tracker semantics.

**Refined exit:** Deliver a producer/trigger/property/destination map for every approved event. Apply privacy before the first collector can inspect the route and on SPA entry/exit, page/data/API responses and referrers; inspect actual hosting log capture too. CR-04 retains API-header ownership and CR-18 metadata ownership. Unsupported required vendor filtering is a recorded blocker; neither noindex nor silently dropping all required telemetry is the substitute.

**Verification:** Sanitization on initial load, SPA entry/exit, delayed script load, query/hash/referrer capture and root history/search actions. Do not transmit raw IDs, recovery capabilities, customer fields or history arrays. Record vendor-hook/container feasibility early; G-04 network/container evidence remains a mandatory CR-19 gate, not an assumption.

### CR-11 — Deliver the dedicated shell and honest entry pages

**Scope:** Adapt `components/layout/creativa.tsx`, add copied Creativa header/footer components and configurable navigation constants, update `pages/creativa/index.tsx`, and add the guide entry placeholder.

**Completion:** Scoped light theme, `/creativa` logo destination, Creativa-only search, shared cart unit badge and correct footer/navigation on every subbrand route. Replace running/trail positioning. Leave root headers/global lighter cart wrapper unchanged. Reserve guide article routes without fake articles or a CMS.

**Refined exit:** Ship the guide index and unknown-article 404/reserved-slug behavior. Do not scaffold an otherwise empty dynamic article page merely to satisfy a filename list.

**Instrumentation:** Use the safe facade for relevant Creativa navigation/support CTAs; do not accidentally inherit a root-only single-tracker call in copied components.

**Verification:** Direct navigation, shell links, responsive menu/focus, no account/currency/Shop Pay/case controls and proper unknown guide results. Use owner-approved wording for final acceptance, not fabricated policy/product claims.

### CR-12 — Implement the image-led catalog and product pages

**Scope:** Add catalog/detail pages and Creativa-local cursor/search/gallery/configuration components/hooks.

**Completion:** Bounded SSG/ISR entry reads, 60-second regeneration target, current state revalidation and explicit unavailable/error behavior. Mobile defaults to two columns; toggle changes layout only. Preserve query/results across it and ignore stale query responses. Detail initializes no model, quantity 1 and first active coverage (Lưng seed), with exact selected price and valid add-to-cart gating.

**Instrumentation:** Wire the CR-10 facade at list/product impressions, search results, additional batches, card selection, layout changes, gallery actions, option/quantity changes and add-to-cart outcomes. Default selections, autoplay and rerenders must not fabricate user actions.

**Verification:** All discovery/product scenarios, hover versus touch behavior, three approved views, carousel/thumbnails/lightbox, reserved/unpublished slugs and no selection-linked generated images. Use the provided screenshot references; perform visual browser proof after UI changes.

**Refined exit:** CR-21 owns real publication data, but CR-12 must also prove deterministic first-active option ordering and an honest missing/failed-image state. Placeholder fixtures are not final owner visual acceptance.

### CR-13 — Implement one cart page and quote review

**Scope:** Add `/creativa/cart`, typed line presentation and revalidation/quote-review UI.

**Completion:** Show every line with its correct model/coverage/quantity, merchandise total and shared checkout action. Support edits/removal without affecting lighters; distinguish empty/hydrating/error states. Changed prices/options identify affected lines and require correction/review; do not silently remove items or submit a partial cart.

**Instrumentation:** Emit the approved hydrated cart view, committed quantity/removal actions and meaningful revalidation/friction outcomes through CR-10, without counting background refreshes or one removal twice.

**Verification:** Reload persistence, unavailable line alongside valid lines, reviewed price changes, safe quantity errors, pending reservations and continuing-shopping behavior. The only checkout destination is `/creativa/checkout`.

### CR-14 — Implement tracking, root entry and saved-ID tags

**Scope:** Add the safe order-read endpoint, Creativa search/detail pages, reusable `RecentCreativaOrders` component and narrowly scoped root `/order-tracking` edits.

**Completion:** Both manual Creativa search and root Skin Laptop selection use the generic route and case-sensitive ID validation. Root Lighters keeps its existing validation/path. Tags below both inputs open Creativa in one tap even with Lighters selected; a 20-tag display batch never caps stored/reachable history. Remove/clear do not trigger navigation. Show safe snapshots/status/payment instructions and honest copy outcomes.

**Instrumentation:** Bind lookup intent/result with manual/history source, local remove/clear, storage-error and ID/link-copy outcomes. Emit safe counts/categories only; never IDs, array contents, copied text or raw URLs.

**Verification:** Masked minimal public projection, no internal/private fields, current status versus immutable values, paid/refunded/cancelled bank prompt rules, stale/not-found/error states and clipboard failure. Do not call legacy raw-reference analytics helpers on the new Creativa branch. Visiting/copying/tracking does not create/save another order.

### CR-15 — Implement sales handoff and staff recovery

**Scope:** Add the server Creativa formatter/dispatcher, saved notification receipts/Studio visibility and `scripts/retry-creativa-notification.mjs`.

**Completion:** Use `CREATIVA_TELEGRAM_BOT_TOKEN` server-side and private Creativa destinations; update `.env.example` with a placeholder only. Claim per-destination dispatch via revision guards, await bounded sends and preserve `pending`/`dispatching`/`sent`/`failed`/`unknown` meaning. Unknown delivery requires explicit operator reconciliation, not blind replay.

**Verification:** Escaped user text, all line/customer/optional address/payment/total context, concurrent/replayed sends, timeout/crash ambiguity and safe diagnostics. A notification failure cannot invalidate accepted checkout. External sends require G-01 authorization; otherwise use transport fakes. No customer messaging/automated SPX feature is added.

**Refined exit:** Staff can discover pending/failed/unknown handoffs without relying on a browser that stayed open. CR-22 rehearses the operator procedure, including missing address and finding the retained production assets; this is not satisfied by setting a notification status manually.

### CR-16 — Implement durable conversion dispatch permissions

**Scope:** Add `POST /api/creativa/orders/analytics-claim` and accepted-order payload/receipt helpers.

**Completion:** Only the checkout capability claims allowlisted destination/event keys. Build payloads from the accepted snapshot, not cart/live catalog; use the independent analytics transaction ID. One GA4 purchase, one Umami purchase and non-conversion Umami line companions. Claims are revision-guarded and checked only for enabled/allowed/representable destinations.

**Verification:** Concurrent claims, repeated recovery, disabled/blocked transports, provider payload limits and interruption after claim. Demonstrate the approved at-most-once permission/possible-undercount limit without asserting exactly-once provider delivery. Tracking/public lookup cannot claim or emit another purchase.

**Refined exit:** A hung/failed claim or absent collector never holds required confirmation navigation/cart recovery open. No capability is kept indefinitely just to wait for future consent or receipt, and no retry silently unclaims an event. Preserve the documented undercount limit and make it visible to the acceptance reviewer.

### CR-17 — Wire the complete guest checkout journey

**Scope:** Add `/creativa/checkout`, the mutation/resolve hooks and one accepted/rejected/unresolved client completion path.

**Completion:** Name/10-digit phone required, address/email/note optional; bank transfer defaults only when valid. Submit the reviewed server quote with a stable capability and preserve original intent during uncertainty. Acceptance displays the ID, remembers history once, reconciles only submitted quantities, requests eligible conversion claims and navigates to the generic tracking detail. Sales handoff stays server-owned.

**Refined exit:** Lock the submitted customer/payment/configuration intent while its result is unknown; later browsing additions are not mutations of that submitted request. Resolve a recognized existing attempt before replacing its journal. After known acceptance, show/navigate to the order promptly, checkpoint replay-safe cart/history handling and handle metrics separately. Repeated completion after reload cannot subtract twice or resurrect a shortcut forgotten after history handling finished. When storage refuses a checkpoint, preserve acceptance and show an explicit recovery/copy limitation rather than manufacture a guarantee.

**Instrumentation:** Bind begin-checkout once per attempt, committed shipping/payment choices, validation/submit/error outcomes and observable abandonment using the CR-10 contract. Accepted-order conversion uses CR-16; no purchase comes from the tracking render or from merely saving local history.

**Verification:** Both payment methods, omitted address/default fee, stale/tampered quotes, errors without state loss, duplicate click, response loss/reload, unbound tombstone race, new cart additions during submit, local history quota failure and storage-disabled fallback. Never turn local failure into failed/duplicate order creation. Recovery after accepted catalog deactivation must still return its original order.

### CR-18 — Complete legacy conversion and SEO continuity

**Scope:** Audit both legacy skin index/detail families and their ordering/customization entry cards; update approved ordering destinations. Add accurate Creativa metadata and transaction/guide sitemap exclusions.

**Completion:** Existing legacy URLs/content/indexability remain; ordering enters the new catalog without blanket redirects or invented one-to-one mappings. Separate service pages remain intact. New offers reflect valid coverage prices. Transaction metadata is reference/customer-free and non-indexable. Any new optional `Seo` site-name field defaults to the old main-brand value.

**Instrumentation:** Preserve measurable legacy-to-Creativa ordering entry and available acquisition context through the approved dual-tracking contract, without adding duplicate conversion emissions.

**Verification:** Crawl the affected CTA/link set; check canonical/title/offer output, missing-slug behavior, fake guide avoidance and generated sitemap/robots/noindex behavior. Stage the legacy CTA change with the complete launch, not a premature production link to an unavailable checkout.

### CR-19 — Prove integrated acceptance and preserve lighters

**Scope:** Execute every approved acceptance scenario using the completed implementation, authorized fixtures and real browser/network evidence where needed.

**Completion:** G-01 private-namespace denial and transaction races are proven on the actual authorized target. G-04 and G-06 have actual collector/host and native-device witnesses. All 52 original ACs and required refinement cases have passing evidence for their applicable variants. CR-21 data and CR-22 handoff are accepted. Any required fail/not-run/blocked result leaves CR-19 incomplete; recording the blocker is honest progress, not task completion.

**Verification:** Run the focused helper/state/order/analytics cases once per coherent change, existing lint/build/Studio checks and touched-flow browser QA. Test representative iPhone/Safari, other mobile, tablet and desktop. Do not claim mocked headers, link checks or screenshot inspection proves live authorization, delivery or telemetry.

**Refined exit:** Use the one-row-per-AC reverse matrix as the acceptance checklist and record the exact implementation revision. Rehearse pausing fresh purchases while accepted lookup/recovery survives. Code/ID inventories are not behavioral proof, and CR-20 cannot waive an unresolved required oracle by labeling it “coverage complete.”

### CR-20 — Obtain release acceptance and activate safely

**Scope:** Review all evidence, owner-supplied launch content/configuration, staff retry/reconciliation procedures and deployment authorization.

**Completion:** No open privacy, duplicate-order, wrong-price, cart-loss, unresolved recovery or lighter-regression blocker. Owner approves final content/visuals and release. Validate configuration/secrets in the deployment environment without exposing them. Deploy/activate only the reviewed release; do not seed/activate unverified models or send unapproved real test orders.

**Verification:** Safe post-deploy read/shell/configuration checks, order lookup for an authorized existing fixture where applicable and monitoring of safe error/dispatch categories. Record the released revision and rollback/continuity procedure; retain orders, lookup indexes, terminal intent barriers and existing browser keys.

### CR-21 — Populate and validate the actual launch catalog/configuration

**Depends on:** CR-03, CR-05, CR-06, CR-11.

**Scope:** Engineering and owner/staff jointly turn G-02/G-03 inputs into a reviewed publication checklist and authorized configuration, not another content platform or automatic migration.

**Completion:** Record the owner-approved launch roster, containing at least one real design, and validate every included design's three views and durable artwork/master identity; any exclusion needs owner acknowledgment. Every activated model/coverage has an unambiguous approved fit/meaning, available template mapping and display order. Initial prices match the approved four presets. Exactly one valid default shipping fee, independent bank/sales/support data and final shell wording are configured. Preserve stable identifiers and old assets/versions needed by accepted orders; do not activate the screenshot list by assumption.

**Verification:** Catalog identities across all batches match the approved roster; product detail, quote, SEO and staff readback agree on the same approved versions. Review equal-sort ties, missing images, invalid money and attempted unverified publication. Production writes/activation still require authorization; a synthetic fixture or one passing design is not signoff for an omitted roster item.

### CR-22 — Rehearse the complete manual production/payment/delivery handoff

**Depends on:** CR-14, CR-15, CR-17, CR-21.

**Scope:** Owner/operator observes an authorized synthetic accepted order using the final approved configuration. No unapproved physical manufacture, real customer contact or automated fulfillment is introduced.

**Completion:** Staff retrieve the accepted artwork version/printable master and the right model/coverage cut template, not merely a thumbnail/current product label. They identify every quantity/amount/payment state and their manual handling of missing address, bank/COD status and failed/unknown notification. The customer can find the same order from either tracking entry point without a new purchase. Staff acknowledge the documented support/reconciliation path.

**Verification:** BDD-28 records the asset/template readback and operator signoff, including one address-omitted case and retained meaning after a harmless catalog edit. If source assets, fit or operational ownership are missing, the business handoff is not complete even if all code compiles.

### CR-23 — Establish evidence feasibility before relying on assumptions

**Depends on:** CR-01.

**Scope:** Inventory actual permissions, hosted collector/device access and existing authorized methods for deterministic collision/exhaustion, commit loss, late binding and dispatch races. No new test code/tool/framework or public fault endpoint.

**Completion:** For each relevant ASM item, record owner, current status, exact available verification method, required environment/control and which downstream task is blocked if unavailable. Distinguish a raw database constraint experiment from execution of the application's collision/retry branch. Inspect vendor/version and native-device feasibility early rather than assume CR-19 can obtain it.

**Verification:** The ledger itself can be complete while a capability remains unverified, but the consuming implementation/acceptance task cannot then be done. Resolve the blocker through authorized existing evidence or an explicit reviewed amendment; do not silently change an AC, add tooling or provision a service/dataset.

## 5. Milestones and evidence gates

| Milestone | Required tasks | Exit evidence |
| --- | --- | --- |
| M-01 — Safe contracts/backend | CR-01, CR-02, CR-03, CR-04, CR-05, CR-06, CR-07, CR-23 | Feasibility ledger plus required domain/schema/API/transaction witnesses; capability blockers remain visible, not declared solved. |
| M-02 — Storefront and basket | CR-08, CR-09, CR-10, CR-11, CR-12, CR-13 | Hydrated shared cart, real read/quote consumers, approved mobile interaction structure and safe event facade. |
| M-03 — Complete guest order | CR-14, CR-15, CR-16, CR-17 | End-to-end accepted/rejected/recovered order, saved-ID tags, staff handoff state and conversion permission behavior. |
| M-04 — Launch acceptance | CR-18, CR-21, CR-22, CR-19 | Real data, manual business handoff, legacy continuity and all required AC/refinement witnesses, including CMS/vendor/native-device checks. |
| M-05 — Authorized release | CR-20 | G-01 through G-06 satisfied and explicit release signoff; operational continuity retained. |

Milestones summarize readiness; the task DAG remains authoritative. Do not wait for all backend work to begin independent state/analytics work, or treat a milestone grouping as permission to ignore a dependency.

## 6. Requirement and acceptance coverage

Every approved requirement has an implementation owner below. CR-19 independently verifies integrated behavior; it does not replace task-local completion checks.

| Requirements | Implementation owner(s) |
| --- | --- |
| BRAND-01, BRAND-02, BRAND-03, ROUTE-01 | CR-11, CR-12, CR-13, CR-14, CR-17 |
| ROUTE-02 | CR-03, CR-05, CR-12, CR-18 |
| CAT-01, CAT-02, CAT-03, CAT-04, CAT-05, CAT-06, CAT-07 | CR-05, CR-12 |
| PDP-01, PDP-02, PDP-03, PDP-04, PDP-05, PDP-06, PDP-07, PDP-08 | CR-02, CR-03, CR-06, CR-12 |
| MODEL-01, MODEL-02 | CR-03, CR-06, CR-12, CR-21, CR-22 |
| PRICE-01, PRICE-02, PRICE-03, PRICE-04, PRICE-05, PRICE-06 | CR-02, CR-05, CR-06, CR-07, CR-12, CR-13, CR-17 |
| CART-01, CART-02, CART-03, CART-04, CART-05, CART-06, CART-07, CART-08 | CR-08, CR-11, CR-13, CR-17 |
| EXT-01, EXT-02, EXT-03 | CR-02, CR-03, CR-07, CR-08, CR-13, CR-14 |
| CHECKOUT-01, CHECKOUT-02, CHECKOUT-03, CHECKOUT-04, CHECKOUT-05, CHECKOUT-06, CHECKOUT-07 | CR-02, CR-06, CR-17 |
| ORDER-01, ORDER-02, ORDER-03, ORDER-04, ORDER-05, ORDER-06, ORDER-07, ORDER-08, ORDER-09, ORDER-10, ORDER-11, ORDER-12 | CR-03, CR-04, CR-06, CR-07, CR-08, CR-17 |
| OPS-01, OPS-02, OPS-03, OPS-04, OPS-05 | CR-03, CR-15, CR-17, CR-21, CR-22, CR-20 |
| TRACK-01, TRACK-02, TRACK-03, TRACK-04, TRACK-05, TRACK-06, TRACK-07, TRACK-08, TRACK-09 | CR-04, CR-07, CR-14, CR-17 |
| HISTORY-01, HISTORY-02, HISTORY-03, HISTORY-04, HISTORY-05, HISTORY-06, HISTORY-07, HISTORY-08, HISTORY-09, HISTORY-10 | CR-09, CR-14, CR-17 |
| CMS-01, CMS-02, CMS-03, CMS-04, CMS-05, CMS-06 | CR-03, CR-04, CR-07, CR-14, CR-21, CR-23, CR-20 |
| SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, GUIDE-01, GUIDE-02 | CR-11, CR-12, CR-14, CR-18 |
| AN-01, AN-02, AN-03, AN-04, AN-05 | CR-10, CR-12, CR-13, CR-14, CR-16, CR-17, CR-23 |
| AN-06, AN-07, AN-08, AN-09, AN-10, AN-11 | CR-10, CR-14, CR-16, CR-17, CR-19 |
| UX-01, UX-02, UX-03, UX-04 | CR-11, CR-12, CR-13, CR-14, CR-17, CR-19 |
| NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06 | CR-01, CR-02, CR-04, CR-10, CR-18, CR-19, CR-20 |

### AC reverse-validation matrix

Start with the expected outcome, then ask which task creates it and which observation proves it. Each row below must pass at CR-19; the linked [specification](./specs.md#12-acceptance-scenarios) retains its full criterion and applicable variants. Test-plan IDs name procedures, not already-run tests. A source/readiness review supplements but does not replace a required runtime witness.

| AC | Required observable exit | Producing task(s) | Decisive evidence |
| --- | --- | --- | --- |
| AC-01 | Every direct/internal Creativa journey uses its shell and correct routes; lighter shell unchanged. | CR-11, CR-14, CR-17 | BDD-01, RG-01; direct and SPA navigation. |
| AC-02 | Mobile defaults to two columns; toggling preserves query, loaded records/order and accessible selection. | CR-12 | BDD-02; recorded state before/after each toggle. |
| AC-03 | Trimmed case-insensitive searches, clear and rapid changes return the correct stable result, not a stale response. | CR-05, CR-12 | CT-01, BDD-02; controlled response order and record IDs. |
| AC-04 | Empty catalog, no match, initial failure and additional-page failure remain distinct; retry retains loaded cards. | CR-05, CR-12 | CT-01, BDD-02; actual error/empty variants. |
| AC-05 | No initial model, quantity 1, selected Lưng 120k, catalog minimum 100k. | CR-06, CR-12, CR-21 | CT-02, BDD-03; configured data and visible state. |
| AC-06 | Missing-model addition fails with reason; valid selected configuration adds once. | CR-12 | BDD-04 and the observed cart delta. |
| AC-07 | Four prices are 120k/100k/150k/310k independent of design/model and without quantity tiers. | CR-02, CR-06, CR-12 | CT-02, DB-01; UI quote and saved arithmetic agree. |
| AC-08 | Deactivated/reordered options produce deterministic first-active default and exclude inactive purchase. | CR-03, CR-05, CR-12 | CT-13, NE-03, BDD-03; real option edit/revisit. |
| AC-09 | Touch/keyboard carousel, thumbnails and lightbox work; selectors do not alter/generate images. | CR-12 | BDD-03, BDD-23; actual interactions, not simulated logs. |
| AC-10 | Same type/design/model/coverage merges quantity; changed configuration remains separate. | CR-02, CR-08, CR-12 | BDD-04; cart identities/quantities inspected. |
| AC-11 | Quantity/remove/badge remain correct after reload and hydration without empty overwrite. | CR-08, CR-11, CR-13 | BDD-05 and browser storage/state observations. |
| AC-12 | Creativa operations do not mutate a populated lighter cart/flow or vice versa. | CR-08, CR-13, CR-17 | BDD-05, RG-01, RG-02; both domains before/after. |
| AC-13 | Invalid/deactivated/unknown-type data is recoverable, preserves valid lines and prevents partial submit. | CR-08, CR-13, CR-17 | CT-04, BDD-06, BDD-17; no accepted partial DB order. |
| AC-14 | Empty checkout is honest after hydration and rejected by the server. | CR-07, CR-13, CR-17 | CT-04, BDD-06; zero accepted order delta. |
| AC-15 | Name/10-digit phone without address/email/note is valid, with configured default fee and honest missing-address summary. | CR-06, CR-17, CR-21, CR-22 | CT-03, BDD-07, BDD-28; saved record and staff readback. |
| AC-16 | Missing name, invalid phone or malformed supplied email fail consistently with no order; no added Zalo/+84 rule. | CR-02, CR-07, CR-17 | CT-04, NE-01, BDD-09; UI/API/DB observations. |
| AC-17 | Regional/default/explicit-zero fees work; absent valid configuration blocks, never becomes free by fallback. | CR-03, CR-06, CR-21 | CT-03, BDD-07; configuration, quote and saved fee. |
| AC-18 | Missing bank config is explained/disabled without root fallback; valid COD can proceed. | CR-06, CR-17, CR-21 | CT-03, BDD-08; separate bank/COD variants. |
| AC-19 | Price/fee/meaning change or forged reviewed total requires reconfirmation; server-derived values are the only accepted values. | CR-02, CR-06, CR-07, CR-17 | CT-04, CT-05, CT-13, BDD-10; no stale-price order. |
| AC-20 | Same-intent concurrency/retry/lost response returns one order; changed intent on same capability conflicts. | CR-07, CR-17, CR-23 | CT-06, DB-02, DB-05, DB-09; real terminal-state relations. |
| AC-21 | Failed write preserves checkout/cart; post-acceptance notification failure cannot undo success. | CR-07, CR-15, CR-17 | CT-10, BDD-21; failed-write and saved-but-handoff-failed variants. |
| AC-22 | One complete order is accepted; later same-configuration and unrelated additions survive repeat completion/reload. | CR-08, CR-17 | DB-11, BDD-13, BDD-25; contribution IDs and one order. |
| AC-23 | Later product/asset/option edits cannot rewrite accepted display/production meaning or amounts. | CR-03, CR-07, CR-14, CR-21 | DB-06, BDD-28; retained asset/template and snapshot readback. |
| AC-24 | Staff can identify every line/quantity/configuration, optional address and payment/totals; initial states pending. | CR-03, CR-15, CR-22 | DB-01, BDD-21, BDD-28; actual CMS/handoff and operator signoff. |
| AC-25 | Root Skin Laptop and Creativa manual search reach one generic detail; lighter search remains correct. | CR-14 | CT-07, BDD-16, RG-04. |
| AC-26 | Reload, invalid/not-found and service failures are distinct; no new order/conversion or private fields. | CR-14, CR-16 | CT-07, DB-03, BDD-16; API projection and event evidence. |
| AC-27 | Manual operational/payment/tracking changes display correctly; paid/refunded/cancelled bank prompts are suppressed. | CR-03, CR-14 | BDD-08; actual controlled staff edits and display. |
| AC-28 | Creativa shipping/bank/recipient edits leave main-brand/lighter settings unchanged. | CR-03, CR-04, CR-21 | DB-07, RG-03; separate before/after values. |
| AC-29 | Legacy index/detail URLs remain indexable/useful; every ordering action enters Creativa. | CR-18 | BDD-22, RG-05; enumerated CTA/URL evidence. |
| AC-30 | Guide index is honest, unknown articles 404, fake articles absent and transaction secrets not indexed. | CR-11, CR-18 | BDD-22, CT-11; built sitemap and page/response metadata. |
| AC-31 | Every approved action has the right producer/name/context once per intended destination, not per render. | CR-10, CR-12, CR-13, CR-14, CR-17 | CT-14, BDD-19; event guide and actual network catalog. |
| AC-32 | One accepted typed order produces correct merchandise/shipping/final measurement and no category/reload duplicate. | CR-07, CR-16, CR-17 | CT-09, DB-08, BDD-19, BDD-20; independent analytics identity and receipts. |
| AC-33 | Automatic/custom payloads, titles, referrers and capture paths contain no customer/history/lookup secrets. | CR-04, CR-10, CR-18, CR-23 | CT-11, BDD-27; initial/SPA/data/API/host evidence. |
| AC-34 | Disabled, delayed, failing or hung trackers do not stop confirmation/recovery/tracking. | CR-10, CR-16, CR-17 | BDD-20, BDD-24; observed nonblocking completion and undercount limit. |
| AC-35 | Typed boundaries prevent collisions and skin-only mandatory fields on future contracts; unknown production types reject. | CR-02, CR-03, CR-07, CR-08 | CT-04, DB-07; synthetic contract/source witness, no published extra category. |
| AC-36 | Neutral home and configurable copied shell/commerce patterns exist without root framework rewrite. | CR-11 | BDD-01 and scoped source/change review. |
| AC-37 | Only valid published designs appear once, with real card/hover/touch data and no out-of-scope filters. | CR-03, CR-05, CR-12, CR-21 | CT-01, BDD-02, BDD-03, BDD-22; eligible-record/card comparison. |
| AC-38 | Bad quantities and unsafe arithmetic are rejected in UI/API, never coerced into an accepted order. | CR-02, CR-06, CR-07, CR-17 | NE-02, BDD-09; rejected request and no accepted DB delta. |
| AC-39 | Schema/server guards reject bad imagery/slugs/prices/fit/custom models without inferred support or new category/CMS scope. | CR-03, CR-04, CR-06, CR-21 | CT-04, CT-13; actual Studio/API negative variants. |
| AC-40 | Accepted records have unique keys/correct references and secure independent IDs; privileged/private boundaries hold. | CR-03, CR-04, CR-07, CR-23 | DB-01, DB-03, NE-05; real access evidence plus secure-source review. |
| AC-41 | Replays/uncertain handoff do not routinely resend or add unpromised payment/shipping/customer-messaging automation. | CR-15, CR-16, CR-22 | CT-10, DB-08, BDD-21; operator procedure and actual allowed send evidence. |
| AC-42 | Service URLs remain; new canonical/title/image/offer data is accurate with no fake prices/ratings/policies. | CR-12, CR-18, CR-21 | BDD-22, RG-05; generated metadata and owner-approved data. |
| AC-43 | Actual native mobile/other layouts and keyboard/touch flows match the clean image-first brief without added competitor features. | CR-11, CR-12, CR-14, CR-17, CR-21 | BDD-23; real iPhone/Safari and owner visual signoff, not viewport emulation alone. |
| AC-44 | Bounded catalog/image reads, safe failure states, acquisition/device context and authorized existing quality gates are evidenced. | CR-04, CR-05, CR-10, CR-19 | CT-01, CT-08, CT-14, RG checks and actual lint/build/network evidence. |
| AC-45 | Forced application collision/exhaustion/concurrency/replay preserves one original ID and never overwrites another order. | CR-07, CR-23 | DB-04, DB-05; approved deterministic application control, not sampling or DB constraint alone. |
| AC-46 | Only accepted create/recovery saves an unseen ID first; duplicates stay in place; lookup/share/failure do not append. | CR-09, CR-17 | BDD-14, BDD-25; raw history array and completion-ledger transitions. |
| AC-47 | More than 50 saved IDs remain reachable with no cap/TTL/status pruning or all-order prefetch. | CR-09, CR-14 | BDD-15; entire stored/reachable list and request inventory. |
| AC-48 | Root tag opens Creativa once even with Lighters selected; stale ID is recoverable/removable. | CR-14 | BDD-16; navigation and one history-source lookup event. |
| AC-49 | Forget/clear changes history only and persists without replayed local completion resurrecting it. | CR-09, CR-14, CR-17 | BDD-15, BDD-25, RG-02; reload/server/cart comparison. |
| AC-50 | SSR/corruption/denial/quota produce safe recovery; known accepted order is never lost/reported failed by local completion. | CR-08, CR-09, CR-17 | BDD-17, DB-11, NE-11; accepted record plus local warning/checkpoint evidence. |
| AC-51 | Copy actions return exact public ID/link only on success; denied clipboard/shared-device limits are honest. | CR-14 | BDD-18, BDD-23; actual native clipboard success/failure and messaging. |
| AC-52 | Save/tag/forget/clear/storage/copy telemetry contains safe source/count/outcome only and no extra purchase. | CR-10, CR-14, CR-16, CR-17 | CT-14, BDD-19, BDD-27; actual payloads and conversion receipts. |

Additional mandatory refinement witnesses are CT-11 through CT-14, DB-11, NE-11 through NE-13 and BDD-24 through BDD-29 in the test plan. They close the report findings without adding a new unit suite, product category or infrastructure service.

## 7. Verification commands and artifacts

Do not run app builds/tests merely for this documentation change. The existing commands below and the contract/database/browser procedures in [test-plan.md](./test-plan.md) govern later verification. No new unit-test suite, test script or test framework is required by this plan.

| Check | Command/convention | When |
| --- | --- | --- |
| Contracts/quote/history/state | Described HTTP, CMS and browser/manual checks; no hypothetical script is presented as an existing runner | CR-02, CR-06, CR-08, CR-09 changes. |
| Orders/recovery/notification/claims | Authorized integration/database observations and documented failure/race procedures | CR-07, CR-15, CR-16 and CR-19. |
| Payload/URL/event lifecycle | Existing browser network inspection and real-container checks | CR-10, CR-16, CR-19. |
| Application lint | `rtk pnpm lint` | At coherent implementation checkpoints and before final acceptance. |
| Runtime/routes/build/sitemap | `rtk pnpm build` | After routing/runtime integration, then at CR-19; this includes the existing postbuild checks. |
| Studio schema/actions | `rtk pnpm --dir sanity build` | After CR-03 and any later schema/action edit. |
| Existing lighter coverage | Inspect prerequisites, then the relevant existing runner such as `rtk pnpm regression:lighter`, plus touched browser flows | Shared app/shell/tracking/SEO integration where regression risk justifies it. |
| Browser/visual proof | Repository `agent-browser-automation` skill with authorized local/preview routes and synthetic fixtures | Every material UI change and integrated mobile checkout/tracking acceptance. |

Keep source/task evidence concise in this plan or session artifacts: command/result, fixture/environment identity without secrets, relevant screenshot/network evidence and unresolved blocker. Do not create a new test platform or blanket-run unrelated SPX/full suites unless actual shared changes/failures justify them.

## 8. Release and continuity checklist

CR-20 cannot finish until:

- Every other CR task has its scoped passing witness; CR-19 has passed the full AC/refinement matrix, not merely recorded unresolved blockers.
- Private Sanity namespace denial, direct-read/transaction behavior, immutable snapshots and accepted-intent recovery are demonstrated on the actual authorized target.
- CR-21 has owner-approved launch data and CR-22 has an operator-signed printable-asset/fit/payment/address handoff; no automatic activation of the screenshot list.
- Independent shipping/default fee, bank instructions, server bot token and staff destinations are verified without main-brand fallbacks.
- Actual GA4/GTM and hosted collectors meet the approved privacy/dispatch rules, including direct/SPA tracking URLs and raw-reference protection.
- Required ASM capability blockers are discharged with evidence; process-local limits, trusted proxy/edge behavior and actual native-device results are recorded.
- Staff understand pending/failed/unknown notification states, manual payment/fulfillment and authorized retry/reconciliation.
- BDD-29 has rehearsed purchase pause with accepted lookup/recovery intact.
- Owner approves release. That approval is separate from approving this refinement; deployment/real test orders are not implied.

### Failure response and rollback

If fresh purchasing must be paused, deactivate orderable Creativa products/coverages through the existing availability controls and retain order lookup/recovery/support. Requests already accepted remain accepted; do not imply all in-flight validations were retroactively cancelled.

After accepting real orders, do not roll the entire app back to a revision with no Creativa tracking/recovery routes. Prefer a corrective release retaining those contracts. Keep order documents, lookup mappings, terminal intent/tombstone guards, snapshots and history keys; never reset public IDs or remove idempotency barriers as a rollback shortcut.

Do not blindly restore old manual-order CTAs or point legacy users at a broken new route. Use an explicitly reviewed availability/support response if necessary while preserving legacy URLs/content. Never globally clear localStorage, delete orders to “clean up,” replay unknown notifications or re-emit claimed purchases to make dashboards look complete.

## 9. Plan exit gate

**Current state:** the business idea/specification and prior design/plan/test strategy have been accepted. This refined plan and its test-plan amendments are the current review gate and source of truth. None of CR-01 through CR-23 has been executed by writing these documents.

After refinement approval, start with CR-01 and proceed through dependency-ready tasks, including early CR-23 feasibility. Update actual evidence, not just task checkboxes. Any missing required witness leaves its task and CR-19 incomplete; there is no “all tasks done, AC still blocked” success state. Production activation remains subject to CR-20 and explicit authorization.
