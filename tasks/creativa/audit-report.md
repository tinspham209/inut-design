# Creativa Staff Audit

## Current Firefox / delivery setup correction — PASS

**Focused direct read-only Staff audit PASS** for the complete checkout/CMS delta from `2333503`. Final requested RHF Autocomplete keeps popup inline, stable enum values/ref/disabled-option rules and current quote handlers; no error suppression/library patch. Visible CMS guidance distinguishes recipients/credentials/private/channel and non-retroactive receipt behavior; preview contains no secret.

**Evidence:** Owner explicitly confirmed Firefox after final `disablePortal` change; Chrome all fields/payment enum/listbox ancestry/no-error plus fresh missing-primary COD/disabled option pass. Actual sender function in fake sandbox demonstrates TOKEN_MISSING/fetch0 with only legacy key, explicit server key sends exactly once to the intended fake recipient. Current lint/types/app229/SEO221 and Studio build pass. Real getMe/getChat authenticated local alias and readable private chat, no message.

**Rework:** No actionable source finding; no-op/unchanged-code confirmation retains PASS. Local `.env` alias is explicit owner-approved/ignored, never printed/staged. Concurrent user `.env.example` rearrangement left unstaged. User declined existing-order retry; failed receipt not repaired/reset/sent. Exact foreign event target remains unproven, so only observed popup compatibility is claimed. E-01..E-04 actual delivery/host/private/native-wide/owner publication witnesses remain external.

## Current transient-toast refinement — PASS

**Focused direct read-only Staff audit PASS at `4bf42c0`** for the complete three-source-file delta from `b5689c7`. Existing one global Toaster reused; transient local states/banners removed, success only after completed clipboard/cart action, generic content/static IDs, error/manual fallback and cart CTA preserved. Link copy prevents navigation but retains a real canonical href; persistent financial/validation/service/storage states remain. All event names/current action ownership retained, with one safe CTA event on the preserved toast link.

**Evidence:** Current lint without warnings/types/app229/SEO221 pass; guarded browser exact copy success/denial, no inline banner/card shift, one shared fixed toast/no copied contents, memo selection, invalid quantity stays inline, exactly one valid add and working dismiss/navigate cart CTA with one event/provider. Screenshot limited to header/copy feedback, excluding contact/payment details.

**Rework:** No actionable issue; no-op and unchanged-source confirmation retains PASS. Automation closing-menu/hidden-tab interruptions were resolved by proper activation, not application edits. No new provider/dependency/API, no order/CMS mutation/send. Earlier phases below are historical; external E-01..E-04 remain.

## Direct tracking memo correction — PASS

**Current code PASS at `589acbe`:** Focused direct read-only Staff review of the complete seven-source-file delta from `d5e2a71`. Owner explicitly approves eligible link-holder name/full-phone visibility. Canonical shared DTO uses saved normalized name + one space + phone; no private context/version or order-ID memo fallback remains. All callers/types align; copied stale cache is disabled, memo changes reset feedback, other private fields/telemetry/persistent storage stay excluded.

**Evidence:** Actual-source eligible/ineligible/saved-edit/invalid-contact/analytics-payload checks; exact supplied3001 direct/reload and copy success/denial without printing contacts; lint/types/app229/SEO221 pass. Current production public API/page200 preserves no-store/no-referrer and correct memo. Both approved previews restored on3000/3001 and HTTP200 verified.

**Rework:** No actionable source finding, no-op; unchanged-source confirmation retains PASS. No Studio/server data mutation/send/migration. Earlier source audits below are historical; E-01..E-04 actual release witnesses remain open.

## Current sales / tracking refinement — PASS

**Code PASS:** Independent read-only review of `6e71574..21b7b06`, including current S-01..S-05 owner decisions, found no significant actionable issue. The reviewer reran the isolated actual-source SDK/purchase/CMS/privacy/contrast probe successfully. Current application lint/types/build229/SEO221 and Studio build pass.

**Approved contract:** Editable saved working records/human-only production rows, no extra immutable original copy; buyer-only Name-Phone/current contact-version RAM with public ID fallback; no new Sanity analytics writes and browser-best-effort dispatch; notification safety retained hidden, no attention menu.

**Rework:** No-op, because no actionable audit finding exists. No passing oracle was rewritten and no arbitrary source edit/re-audit manufactured. **Confirmation:** unchanged `21b7b06` retains the independent PASS and proceeds to issue routing/read-only final verification.

**Remaining:** E-01..E-04 only: actual CDN/operator/notification, deployed private permission/transaction, hosted collector/log and native/manual/Studio publishing evidence. Source PASS does not close these. No real order/CMS mutation/send/deployment performed. All sections below retain historical scope.

## Current compact-client audit

**Current result:** PASS through `7918095` within cumulative scope: independent audit at `f0a2aef` found C-01, now resolved and confirmed by targeted read-only review of its complete two-hook rework. Full acceptance remains blocked by E-01..E-04.
**Scope:** [UI-01..UI-07](./plan.md#compact-ui--form-and-request-amendment--2026-10-23), all nine owner requests, shared validation/checkout recovery/privacy/analytics invariants and browser expectations. No real order/send or schema/server acceptance change.

Current supplied evidence includes red-to-green retained thumbnail metadata, 23 Yup/server variants, current lint/types/build/SEO and guarded browser quote/search races, cached presentation, pagination error/retry/dedup, validation focus, missing-primary COD and fresh lost-response recovery. The prior code PASS below is historical, not approval of this client refactor. E-01..E-04 remain release blockers.

| Issue | Severity | Evidence | Recommendation / resolution |
| --- | --- | --- | --- |
| C-01 — memory-only quote retry is inert | Medium | `hooks/creativa/useCart.ts:92`, `hooks/creativa/useCheckout.ts:494-497` at `f0a2aef`: cart retry only hydrates, checkout hydrates/refreshes options. Actual store with `SecurityError` keeps the same hydrated/error/items dependencies because memory-only hydration returns early (`store/cart/creativaCart.ts:187-189`). Ordinary options success does not refresh quotes, so supported storage-denied checkout can remain disabled after transient quote recovery. | Missing Implementation → Implement → Verify. Both retry actions must explicitly request current quotes independent of hydration, retaining latest-response guards and no automatic order retry. No other actionable source finding from this bounded audit. |

### C-01 rework evidence

**Resolved:** Cart and checkout retry explicitly request a quote independently of hydration, using the latest store snapshot. Cart shares the same action between external-state synchronization and retry. Existing quote generation/source guards remain unchanged; bank-default refresh does not schedule redundant already-selected COD work.

**Red → green:** Before changes, actual browser storage-denied cart retry kept quote-call count 1 and its error; checkout kept count 2 and submit disabled. With the same fixture and current active/reloaded client, each retry adds exactly one quote, clears its error and restores Proceed/Submit while retaining the storage warning. No order action or data mutation was used. After a server restart, a stale/background automation tab required reload/activation before current-client assertions; that was not a source fix.

**Remaining:** E-01..E-04 only. **Files modified:** `hooks/creativa/useCart.ts`, `hooks/creativa/useCheckout.ts`, plan/audit/routing/test evidence. No passing test oracle was rewritten.

### Targeted C-01 read-only confirmation

**PASS:** Reviewed the complete two-hook delta from `f0a2aef` after rework. Explicit retry reaches the shared SWRMutation quote coordinator even with unchanged memory-only state; latest cart snapshots and existing generation/matching guards are retained. External cart state still drives synchronization; no form-input effect or new order/resolve/claim retry was added. View/shipping signatures continue to deduplicate telemetry. Current lint without warnings, TypeScript and production build/postbuild SEO pass (229 pages, 221 URLs).

No remaining actionable source finding in the cumulative independent-plus-targeted scope. This review changes no application code. Route C-01 as resolved; E-01..E-04 require Clarify/Plan → Verify, not speculative code edits.

## Previous runtime/orange-light loop — retained history

**Code audit at that checkpoint:** PASS through `5a8cff8`: independent runtime audit at `715aa79`, followed by R-01 rework and targeted read-only confirmation. These rounds remain evidence for their stated former contract, not a replacement for the current compact-client audit.
**Overall acceptance:** FAIL / BLOCKED — E-01 through E-04 still lack their required external witnesses.
**Phase:** Seven historical rounds plus current independent amended-runtime audit and targeted R-01 confirmation completed; application changes occurred only in implementation/rework phases. Final verification and issue routing are recorded.
**Baseline:** `551ab8e`; cumulative implementation/rework reviewed through `7fedd01` on `feat/creativa`. Exact per-round scope/revision is retained below.
**Scope:** Approved idea, specs, technical design, revised plan/test plan and repository rules.
**Runtime boundary:** No production order, CMS mutation or notification was authorized/performed. Chromium response fixtures and mocked SDK probes are not real Sanity/native/hosted acceptance.

## Current runtime/orange-light amendment — 2026-10-23

Owner CMS-flow review is accepted. The current implementation connects amended records and exact `#fd4d01` primary in a light theme, with the clarified **active AND primary** bank rule (no arbitrary active-account fallback). Current code includes new/legacy snapshot compatibility and path-safe public projections. Its independent audit and R-01 confirmation are recorded below; the old round-7 PASS is not the authority for this changed implementation.

Implementation evidence: four amended-contract baseline cases were red before changes, then green against actual read-only published CMS data; isolated new/legacy contract groups pass. No order/data/notification mutation was used. The current audit, R-01 rework and final result are recorded without overwriting historical rounds.

Implementation/browser checks also exposed two connected producer gaps before audit: product views repeated during the development lifecycle, and lightbox arrow navigation was unmeasured/close used the old index. Per-component view ownership and guarded viewer-index events now yield one view and open/navigation/close per local destination, with the chosen image restored after closing. No existing passing repository test was rewritten.

**Supplied stop-gate evidence:** current lint without warnings, TypeScript, 15 isolated contract groups, SPX 42, application build 229/postbuild SEO 221 and current Studio build pass. Browser findings are described in the plan's implementation checkpoint; source/SDK/interception proofs remain distinct from real database/native/hosted/operator evidence.

### Runtime amendment read-only Staff audit

**Code result:** PASS at `715aa79086863dd50275c55e5056ef2b121fc5e5`, reviewing `f4b7efa..715aa79` and connected contracts. The independent Staff reviewer found no significant actionable code issue. It independently reran all 15 supplied isolated contract groups using dummy configuration and TypeScript; both passed without mutations.

**Rework:** No-op: there is no actionable finding to fix and no failing passing-test oracle to rewrite. The audited source revision is unchanged; its read-only confirmation retains the same PASS rather than manufacturing a code edit/review cycle.

**Full acceptance:** FAIL/BLOCKED for actual retained print/template/operator/notification readiness, actual Sanity privacy/atomicity/collision/concurrency proof, hosted collectors/proxy/logs and native Safari/remaining manual cases. Raw Sanity metadata visibility is the acknowledged separate owner-review boundary, not a newly found application DTO leak.

**Current readiness refinement:** Published amended catalog/options/fee/primary-bank records exist and read successfully. Development browser images loaded, but later production-headless image requests returned CDN 403 while direct same-URL requests returned 200; the explicit fallback works. This access discrepancy remains E-01, not a proven code defect or production-image pass. Sales has one configured destination, but no dedicated Creativa bot credential. No message was sent and physical file/template/handoff signoff remains missing. Route these prerequisites through Clarify/Plan → Verify, not speculative code rework.

### Final-verification interruption — R-01

**Result:** FAIL for a connected analytics-context variant at `715aa79`; final verification stopped before application edits.

| Issue | Severity | Evidence | Requirement / recommendation |
| --- | --- | --- | --- |
| R-01 — single-item context dropped in Umami | Medium | `utils/creativa/analytics.ts:116-119` copies only product identity/name/type from measurement items. Actual source facade invocation for a configured removal retained GA4 `model_id`/`coverage_id` but omitted both in Umami. PDP initial view also has the selected coverage available at `pages/creativa/skin-laptop/[slug].tsx:140`. | AN-02/04, AC-31, CT-14: retain known public model/coverage/quantity/unit-price/variant context for a single configured item in both destinations; include known initial coverage without inventing a selected model. Do not add events or bank/production fields. |

Route: Missing Implementation → Implement → Verify, continuation YES. This does not invalidate the earlier independent review's stated scope, but it reopens the concrete source variant before final signoff.

### R-01 rework

Resolved implementation: the facade projects only public item fields for GA4 and carries known single-item model/coverage/variant/quantity/unit price into Umami without adding a destination call. Explicit caller quantity remains authoritative; unknown price is omitted. PDP view includes its known initial coverage, not a fabricated model choice.

Actual facade checks are now green: one emission each, configured identifiers/price/variant retained, index zero preserved, injected private extra item properties absent, unknown price omitted and consent denial suppresses both calls. All original 15 amended groups remain green. Files changed: facade, PDP view and related guide/test/plan/report records. Post-rework build and read-only confirmation are recorded below; E-01 through E-04 are unchanged.

Targeted read-only inspection of `0cd7414` confirms the facade fix but identifies one remaining R-01 edge: the PDP labels its price basis `selected_coverage` even when no coverage exists. Rework must use unavailable basis in that branch, without inventing price/coverage/model. This stays within the same context finding and returns to rework before final verification.

The zero-coverage callback probe was red, then green after conditional unavailable-basis handling. All 17 groups now pass, including repeated actual view-callback invocation, known/no coverage and all prior groups. Current lint without warnings, TypeScript and production application/postbuild SEO gates pass. Unchanged Studio/SPX source retains its passing evidence. Targeted read-only confirmation follows the final correction; no order, bank, storage or theme behavior changed.

### Targeted R-01 read-only confirmation

**Code result:** PASS at `5a8cff8`, reviewing the complete `715aa79..5a8cff8` source delta and connected facade/PDP context. Public item projection preserves legitimate identifiers/index/price, excludes unknown private extras, emits once per destination and respects consent. Known coverage is explicit; empty coverage reports unavailable basis with no invented model/price. No remaining actionable finding in this bounded confirmation.

R-01 is resolved. No source was changed by this confirmation. [Final verification](./final-verification.md) records current per-requirement/AC evidence at `5a8cff8`; external E-01 through E-04 remain open. Latest production search/layout checks preserve query/cards/order without overflow; image fallback plus CDN discrepancy are recorded explicitly, not hidden by the earlier development image pass.

## CMS-first amendment — 2026-10-23

The owner approved Studio-only schema/editor changes and explicitly deferred storefront/API adaptation. See [CM-03 through CM-07](./plan.md#cms-first-amendment-and-required-next-actions). Legacy order/actions, root-only title prefixes, model slug codes, independent fee/bank records and rich product description/absolute print path supersede the old schema details.

**Historical staged gap:** At the CMS-only checkpoint application guards/queries/snapshots still required removed fields/singletons. The subsequent authorized runtime integration at `715aa79` resolves that code gap without invented fit approvals/artwork versions/main-brand fallback or data migration.

**Current disposition:** Amended integration/inventory/re-audit is complete within its scoped evidence; CM-07/E-01..E-04 actual release witnesses remain open. The rounds below are historical evidence.

**CMS-only checks:** Studio build and isolated schema/navigation/action/template/label/path checks passed with zero CMS I/O. The agent preview reached sign-in, not authenticated editing. The owner subsequently accepted the CMS flow; no agent CORS/credential/data changes were made. That attestation does not close actual private-access/transaction gates.

## Round 1 findings

| ID | Severity | Evidence at reviewed revision | Requirement / issue | Recommendation |
| --- | --- | --- | --- | --- |
| I-01 | High | `pages/creativa/checkout.tsx:173-185`; `utils/creativa/orders.server.ts:152-153` | Recovery clears `CONFIGURATION_ERROR`/`INVALID_PRICE` attempts even though a ≥500 backend error leaves the intent pending. Another resolver can still accept the discarded capability. ORDER-04/05, CHECKOUT-07. | Clear only a confirmed terminal rejection; retain/resolve the capability for transient/unknown errors. |
| I-02 | Medium | `pages/creativa/checkout.tsx:117-154` | Independent completion instances trust captured flags; a delayed instance can recreate a cleared journal and re-add an explicitly forgotten ID. HISTORY-06/10, AC-49. | Coordinate completion ownership, re-read current journal/checkpoints and reject stale side-effect callbacks without hiding acceptance. |
| I-03 | Medium | `store/cart/creativaCart.ts:44-55,227-232`; `pages/creativa/cart.tsx:197-209` | One malformed/unsupported entry rejects the entire cart; fresh hydration hides healthy entries and reset removes them all. CART-06/08, EXT-03, AC-13. | Quarantine per-entry failures, retain validated lines and explicitly discard/recover only invalid entries; keep checkout blocked until resolved. |
| I-04 | Medium | `utils/creativa/notifications.server.ts:196-201` | Valid maximum-length address/note produced 4,417 characters; initial dispatch and operator retry both fail permanently with `MESSAGE_TOO_LARGE`. OPS-01/02, AC-24/41. | Bounded complete messages with progress/reconciliation state; preserve all required data and allow retry to advance without duplicate known sends. |
| I-05 | Medium | `pages/creativa/skin-laptop/[slug].tsx:91-93` | Current revalidation removes ISR-selected coverage by setting an empty value, even when another active option exists. PDP-05, AC-08. | Track deliberate user selection; untouched defaults must follow the first current active option. |
| I-06 | Medium | `pages/creativa/skin-laptop/index.tsx:176-185` | Additional batches emit pagination but no required list impressions. AN-01/04, AC-31. | Emit one bounded impression for newly appended deduplicated records with batch/list/layout context, never for old cards or layout rerenders. |

The reviewer reproduced I-01, I-02, I-03, I-04 and I-05 through actual source functions with in-memory inputs and inspected/invoked the additional-page producer for I-06. These reproductions do not establish actual external delivery/permissions.

## External blockers — historical baseline

| ID | Severity | Evidence / affected gates | Required next input |
| --- | --- | --- | --- |
| E-01 | High | Plan checkpoint: empty actual Creativa options; no approved roster/fits/masters/settings/recipient credential/operator signoff; browser CDN returned 403. G-02/G-03, CR-21/22. | Owner-approved data/asset access and separately authorized configuration plus production handoff rehearsal. No invented/seeding fallback. |
| E-02 | High | Studio/mocked races are not actual anonymous denial or atomic transaction proof. G-01, CR-03/04/07/19, AC-20/40/45. | Authorized isolated target and permitted deterministic controls; direct private-read/transaction/collision/recovery witnesses. |
| E-03 | High | Policy probes do not prove hosted GTM/GA4/Umami/Vercel, root-container exclusions, proxy/edge or host logs. G-04, CR-10/16/19. | Authorized real-container/network/host evidence with harmless canaries. |
| E-04 | Medium | Chromium fixture flow is not native Safari or the complete manual/storage/interruption/accessibility/clipboard/regression matrix. G-06, CR-19/22. | Real iPhone/Safari and owner/operator execution of remaining required scenarios. |

## Quality-gate evidence supplied to audit

- Existing application lint and TypeScript compilation pass.
- Existing SPX regression: 42 deterministic checks pass.
- Production build: 229 generated pages; postbuild sitemap/SEO smoke passes with 221 URLs.
- Current Studio build passes.
- Local manual contracts cover typed input/safe money/canonicalization, 61-ID history, contribution replay/quota behavior and runtime/static privacy-policy parity.
- Browser-only intercepted synthetic flow exercised model selection, add/cart, blank-optional-field COD completion, one history ID/empty cart/cleared journal and root saved-tag navigation while Lighters was selected.

## Rework resolution ledger

| Issue | Resolution | Current evidence |
| --- | --- | --- |
| I-01 | Resolved; round 2 code re-audit PASS | Server emits `terminal: true` only for confirmed rejected intent; client clears only that signal. Actual resolver probe retains a 503 pending capability and clears confirmed terminal rejection. |
| I-02 | Resolved; round 2 code re-audit PASS | Completion re-reads current shared journal/flags; persisted-and-cleared journals do not fall back to stale volatile state. Two actual source completion instances cannot resurrect forgotten history or repeat cleanup. |
| I-03 | Resolved; round 2 code re-audit PASS | Per-entry quarantine keeps healthy items accessible and blocks submit; explicit invalid-only discard preserves healthy instance/quantity. Whole malformed container still requires explicit reset. |
| I-04 | Resolved; round 2 code re-audit PASS | Complete HTML/Unicode-safe message parts have revision-guarded per-part progress; retry skips known sent parts, progresses failed/budget-deferred parts and requires acknowledgment for uncertain delivery. Original valid 4,417-character case covered without external sends. |
| I-05 | Resolved; round 2 code re-audit PASS | Untouched initial coverage uses first current active option; valid deliberate choice survives reordering; invalid deliberate choice requires reselection. Four updater cases pass. |
| I-06 | Resolved; round 2 code re-audit PASS | Additional responses emit impressions for newly presented deduplicated cards only, with batch and current layout context; a duplicate next response emits no repeat impression. |

No external blocker may be marked resolved solely because an actionable code defect is fixed. Subsequent read-only audit rounds must identify their reviewed revision and preserve this history.

## Rework round 1

**Resolved implementation issues:** I-01 through I-06 have changes and targeted isolated evidence; they remain subject to the next read-only audit.

**Remaining issues:** E-01 through E-04 remain open. No requirement was changed to manufacture launch data, authorize production I/O, replace native-device evidence or assert hosted privacy.

**Files modified:** `models/creativa.ts`; `api-client/creativa-checkout.ts`; `utils/creativa/{contracts,api.server,orders.server,storage,notifications.server,records.server}.ts`; `store/cart/creativaCart.ts`; `pages/creativa/{cart,checkout}.tsx`; `pages/creativa/skin-laptop/{index,[slug]}.tsx`; `sanity/schemas/creativa/index.js`; `scripts/retry-creativa-notification.mjs`; related plan/test/design/report records.

**Repository stop gate after all fixes:** lint and TypeScript pass; existing SPX 42 checks pass; application production build/postbuild SEO and current Studio build pass. The catalog's missing-configuration state is explicit and expected while E-01 is unresolved.

**Evidence limit:** Source-function/SDK/transport probes are isolated, not real target/native/hosted acceptance. A probe setup initially omitted its callee stub; that setup failure was corrected without weakening the retained-capability assertion. No existing passing regression test was rewritten.

## Read-only audit round 2

**Code result:** PASS at `d3b0cdb`, reviewing `a98bb7e..d3b0cdb` and connected requirements/source.

The independent staff reviewer judged all six findings resolved and found no further actionable defect/regression in the reviewed changes. Evidence includes confirmed-terminal propagation; fresh journal/checkpoint handling; per-entry quarantine and submit blocking; complete bounded notification parts/progress; explicit-user versus untouched coverage defaults; and new-only batch impressions.

**Full acceptance result:** FAIL / BLOCKED remains. The reviewer explicitly retained E-01 through E-04 and did not treat mocked SDK/transport, browser-only fixtures, mobile viewport emulation or repository builds as actual Sanity/native/hosted/operator proof.

No additional implementation work is justified solely to “remove” those external findings. Their next phase is recorded in [issue-routing.md](./issue-routing.md). If authorized external verification later exposes a code defect, reopen Implement → Audit → Rework for that concrete issue.

## Final-verification interruption / round 3 findings

**Result:** FAIL at `d3b0cdb`. Read-only verification stopped before any application change. These are approved-event implementation defects, not new requirements or external blockers.

| ID | Severity | Evidence at reviewed revision | Requirement / issue | Recommendation |
| --- | --- | --- | --- | --- |
| I-07 | Medium | `pages/creativa/order-tracking/[slug].tsx:60-64`; invoking the actual catch callback with a 404 produced `{outcome:"error"}`. | Not-found lookup is mislabeled as service error; failure results omit entry/source. AN-02/04, AC-31. | Classify typed 404 as `not_found`; retain safe entry/source context for both failure classes. |
| I-08 | Medium | `components/creativa/RecentOrders.tsx:26-37,67-80,106-120` | Read/parse failure only displays a warning; failed forget/clear lacks the required history-storage-error event. AN-11, AC-52, CT-14. | Emit safe operation/category errors at their sources, deduplicating unchanged read failures; never send stored values or raw errors. |
| I-09 | Medium | `pages/creativa/cart.tsx:129-150,173-178` | Cart view is emitted only after a successful nonempty quote. Empty hydrated carts and visible carts with failed quotes have no view lifecycle. AN-01/04, AC-31. | Cover hydrated empty/invalid and failed-quote views once; retain authoritative value on successful quotes and omit unavailable money instead of inventing it. |
| I-10 | Medium | `pages/creativa/checkout.tsx:246-270,366-369,513-520,540-546` | Shipping is measured only on address blur, potentially from a stale quote; blank-address default shipping is not measured. Unchanged default payment can be submitted without a commit event. AN-04, AC-31. | Measure committed current quote rule/fee changes; measure default payment on valid submit without repeating an already measured selection. |
| I-11 | Medium | `pages/creativa/skin-laptop/index.tsx:107-110,145-166,174-179` | Visible initial ISR cards get no list impression if fresh revalidation fails. AN-01/04, AC-31. | Include initially displayed cards in the impression lifecycle, deduplicating unchanged refreshes, additional batches and layout rerenders. Preserve I-06. |

All five findings route to **Missing Implementation → Implement → Verify**. Existing CT-14 already requires these producer paths; the rework adds explicit negative/default witnesses, not tooling or a changed acceptance bar.

## Rework round 2

**Resolved issues:** I-07 through I-11 have applied fixes and targeted evidence; read-only round 3 must audit them before final verification resumes.

| Issue | Resolution / evidence |
| --- | --- |
| I-07 | Typed 404 produces `not_found`; service failure produces `error`. Four actual-source combinations retain root entry and manual/history source without lookup IDs. |
| I-08 | Read/parse failure is deduplicated until recovery/change; remove/clear failures have safe operation/category events. Actual-source probes verify no stored ID/raw canary payload. Chromium malformed-history navigation produced one event per locally stubbed destination; confirmed clear removed only the history key. |
| I-09 | Hydrated empty/invalid/quote-failure views occur once. Successful quote keeps authoritative merchandise value; unavailable money and item prices are omitted. Four isolated branches/rerenders pass. Chromium empty cart produced one GA4 and one Umami event into local stubs, with zero counts/value and explicit empty basis. |
| I-10 | Shipping comes from successful current quote rule/fee signatures, not blur; identical signatures and cancelled old responses do not emit. Valid submit commits an unchanged default payment; explicit selection is not repeated. Both actual-source probe groups pass. |
| I-11 | Initial cached cards, fresh results and additional batches share per-query impression deduplication. Failed initial refresh still measures cached cards; unchanged refresh, duplicate additional records and layout changes do not replay them. I-06's new-only batch behavior remains covered. |

**Remaining issues:** E-01 through E-04. Local collector stubs are not actual hosted GA4/Umami proof. No real order, Sanity mutation or notification was performed.

**Files modified:** `components/creativa/RecentOrders.tsx`; `pages/creativa/{cart,checkout}.tsx`; `pages/creativa/order-tracking/[slug].tsx`; `pages/creativa/skin-laptop/index.tsx`; analytics guide and related plan/test/audit/routing records.

**Red → green:** All six new isolated actual-source probe groups failed on `d3b0cdb`, then all six passed after rework. No passing repository test was rewritten; no test runner, dependency or repository test-code file was added.

**Repository stop gate:** Lint without warnings, TypeScript, existing SPX 42 checks, application production build (229 pages), postbuild SEO (221 sitemap URLs) and Studio build all pass after these fixes. The missing real catalog configuration still renders the expected explicit unavailable state. A browser reference expired during the dialog-close animation; refreshing the snapshot completed the check without changing code or weakening its oracle.

## Read-only audit round 3

**Code result:** FAIL at `918134b448098a40092b5d7351042ce9c9f4d225`, reviewing `d3b0cdb..918134b` and connected requirements/source. The independent reviewer found two additional actionable cases; no code was changed by the audit.

| ID | Severity | Evidence at reviewed revision | Requirement / issue | Recommendation |
| --- | --- | --- | --- | --- |
| I-12 | Medium | `pages/creativa/skin-laptop/index.tsx:166-168,185`; actual-source controlled timers produced requests `["",""]`, no completed search, but two impressions for one continuously visible product. | Deduplication resets on transient input before its debounce commits. Typing and clearing within 250 ms replays unchanged cards. AN-01/04, AC-31, CT-14. | Reset only when the query commits/presentation changes; preserve cancelled-input and unchanged-refresh deduplication plus new-query/batch impressions. |
| I-13 | Medium | `pages/creativa/checkout.tsx:390-403`; actual submit handler with a typed terminal 409/updated quote produced both `quote_changed` and `submit_failed` checkout errors. | One repricing rejection is counted twice per destination. Connected pre-existing producer defect, not introduced by round 2 rework. AN-01/04, AC-31, CT-14. | Classify and emit the failure once, preserving updated quote review and confirmed-terminal cleanup. |

**Overall acceptance:** FAIL / BLOCKED. E-01 through E-04 remain unchanged. Route both new findings as Missing Implementation → Implement → Verify; do not restart final verification until their re-audit passes.

## Rework round 3

**Resolved issues:** I-12 now clears impression ownership only inside the committed debounce callback when the active query changes; its extra transient-query ref was removed. I-13 now retains a replacement quote but classifies/emits its failure once, preserving terminal cleanup.

**Evidence:** Both new probes failed with duplicate counts on `918134b`, then passed after the fixes. All eight actual-source probe groups pass, including the six already passing groups; no passing assertion was replaced or weakened. The cancelled-input probe observes only two empty-query requests and one impression for continuously displayed cards, then a second impression for a genuinely committed query. The repricing probe observes one submit, one `quote_changed` error, the replacement quote and a cleared terminal journal.

**Remaining issues:** E-01 through E-04 only, pending read-only re-audit of these fixes.

**Files modified:** Catalog query effect; checkout submit catch; plan/test/audit/routing records. No API, pricing, schema, storage or provider contract was changed.

**Repository stop gate:** Current lint without warnings, TypeScript, SPX 42, production application build (229 pages) and postbuild SEO (221 URLs) pass. Studio's previous passing build is retained for unchanged Studio/schema source. No external mutations or native/vendor acceptance were performed.

## Read-only audit round 4

**Code result:** PASS at `2eb5af0153b7c5e3caf7a823b9b69aa26cc71bdf`, reviewing `918134b..2eb5af0` and connected lifecycle/cleanup behavior. The independent reviewer found I-12/I-13 resolved and no regression requiring reopening I-01 through I-11 in that bounded review. Overall acceptance remains FAIL/BLOCKED for E-01 through E-04.

## Final-verification interruption / additional contract gaps

Re-reading the exact requirement/event catalog at `2eb5af0` found the following source gaps outside round 4's bounded fixes. Final verification stopped before source changes; these route to Missing Implementation → Implement → Verify, not external-evidence substitutions.

| ID | Severity | Evidence | Requirement / recommendation |
| --- | --- | --- | --- |
| I-14 | Medium | Quote server supplies `fieldErrors[lineIdentity]` for unavailable items, but cart catch discards it and rows receive no availability error. Price revalidation reports every cart line as affected, even if only one changed. | CART-06, AN-04, CT-14: map existing identity-keyed errors to affected rows, retain healthy lines, block checkout and report actual affected counts. |
| I-15 | Medium | Catalog list/click items omit explicit position/list context; click omits displayed price basis; completed search uses `surface` but not the specified `search_context`. Facade lacks these context keys. | AN-02/04 and section 9.2: populate bounded public list/position/price-basis/search context, without new collectors or raw queries. |
| I-16 | Medium | Checkout `resolve()` catch updates UI but emits no approved `checkout_error`; only submit catch emits it. | AN-04, CT-14: emit one safe resolve-failure category per failed resolution without leaking the capability/error body. |
| I-17 | Medium | Native required/pattern/email validation can stop the checkout form before its submit handler, bypassing `checkout_validation_error`. | CHECKOUT-02/07, AN-04: route validation through the existing shared client/server validator with labeled errors/focus; do not weaken field rules or add another validator. |
| I-18 | Medium | `begin_checkout` requires successful quote; quote failure leaves a visible nonempty form unmeasured. Abandonment registration depends on that ref and its local deduplication resets with quote rerenders; unavailable value becomes zero. | AN-01/04: measure the entered nonempty lifecycle on quote failure with unavailable money omitted; keep one abandonment owner across rerenders and never classify unresolved acceptance as abandonment. |

## Rework round 4

**Resolved issues:** I-14 maps existing identity-keyed server errors onto cart rows and measures actual affected counts. I-15 carries explicit bounded public list/position/price-basis/search context through the existing facade. I-16 measures safe resolver failures. I-17 uses the existing shared parser for form validation (`noValidate` disables only competing native submission validation, not required labels or parser rules), with named-field focus. I-18 retains authoritative quote value when available, records failed/pending-exit entry otherwise, omits unknown money and uses stable abandonment ownership plus synchronous in-flight/known-acceptance guards.

**Red → green:** Six new groups reproduced the I-14..I-18 gaps on `2eb5af0`, then passed alongside the original eight. An added pending-exit/acceptance-boundary group was red during rework, then passed after callback ownership/guards were completed. All 15 actual-source isolated groups now pass; no existing passing assertion was removed or weakened.

**Browser evidence:** Current production preview, Chromium 390×844, local synthetic API/collector stubs and aborted order endpoints. Invalid phone shows localized helper text and `aria-invalid`, focuses `phone`, emits one validation event per local destination, and creates no submit/journal. Correct form's `noValidate` is true (an initial generic selector inspected the separate header-search form; the selector was corrected, not the code/oracle). Two cart rows remain visible, only the targeted row has its availability warning, checkout action is absent, affected count is one per local destination and measured horizontal overflow is false. Screenshots are session artifacts, not public product data or native-device proof.

**Files modified:** Creativa cart, checkout and catalog pages; existing analytics measurement type/allowlist; guide and plan/test/audit/routing records.

**Stop gate:** Current lint without warnings, TypeScript, application build (229 pages) and postbuild SEO (221 URLs) pass. Previously passing SPX 42 and Studio builds cover unchanged SPX/loader/Studio/schema source. E-01 through E-04 remain; read-only audit of these changes is next.

## Read-only audit round 5

**Code result:** FAIL at `bb7676ab7f1a23ce626a04fa832e69300e90c987`, reviewing `2eb5af0..bb7676a` and connected providers. I-15/I-16 have no reported unresolved source defect; the following variants reopen their existing issue IDs. No code was changed by the audit.

| Issue | Severity | Evidence | Recommendation |
| --- | --- | --- | --- |
| I-17 | Medium | Shared `requireText` rejects an empty name without `fieldErrors.name`; actual submit rejected but did not mark/focus the required name. Phone path did. CHECKOUT-07, UX-03. | Give shared customer-validation failures their localized field metadata; keep one parser/event, no competing native validator. |
| I-14 | Medium | `quoteFromRecords` throws during the first unavailable mapping entry. Actual pure helper with one healthy/two unavailable identities returned only one error key. CART-06, AN-04. | Collect the complete unavailable-identity map before rejecting; preserve whole-order blocking and all healthy rows. |
| I-18 | Medium | After a one-line quote, a changed two-line cart begins requoting but abandonment uses the previous quote's amount with the new count and `current_quote` basis. AN-01/04. | Associate quote and its input snapshot; omit money when they no longer match, retaining stable lifecycle/acceptance guards. |

These remain Missing Implementation → Implement → Verify with continuation YES. E-01 through E-04 are still external prerequisites, not excuses to skip these concrete source fixes.

## Rework round 5

I-17 adds optional localized field metadata to the existing text helpers and supplies customer field keys; existing rules/code/status remain unchanged. Actual parser cases reject empty/whitespace/non-string/overlong name with `fieldErrors.name`, and oversized email/address/note with their own fields; valid trimmed name remains valid.

I-14 resolves every requested record tuple first, collects the complete unavailable identity map and rejects before snapshot construction. Actual pure `quoteFromRecords` first reproduced one error for two unavailable lines, then reports exactly two while excluding the healthy line; the healthy-only quote retains 120,000₫ merchandise/final with configured zero shipping.

I-18 associates a quote with its cart-array/address/payment inputs and checks that association before abandonment money is used. The new changed-cart/pending-quote probe first reproduced stale 200,000₫ with two new lines, then correctly omits value with unavailable basis. All 16 source-lifecycle groups pass, retaining all earlier passing assertions. No actual database/provider I/O was used.

Files changed: `utils/creativa/{contracts,quote.server}.ts`, checkout snapshot association/dependencies, related plan/test/report records. Full required external witnesses remain E-01 through E-04; read-only re-audit follows the post-fix stop gate.

**Post-fix stop gate:** Lint without warnings, TypeScript, all 16 source-lifecycle groups, application build (229 pages) and postbuild SEO (221 URLs) pass. Unchanged SPX/Studio source retains its prior passing checks. The dependency warning observed during rework was resolved by explicitly depending on the cart array used by the snapshot association.

**Current browser witness:** Chromium 390×844 with local options/quote/collector stubs and aborted order endpoints: empty name plus a valid synthetic phone marks the name invalid, shows its localized helper, focuses `name`, emits one validation event per local destination and leaves submit count zero/journal absent. This supplements the earlier invalid-phone witness; it is not native or real-database proof.

## Read-only audit round 6

**Code result:** FAIL at `eb8ce71cd0705db37817b3b5389767f2c60d9cb6`. I-17/I-18 have no remaining actionable finding in this review. I-14's pure helper is correct, but `evaluateQuote()` rejects invalid/draft identifiers before reaching it, without an identity-keyed map.

**I-14, Medium:** `quote.server.ts:372-373`; actual source with a healthy line, `drafts.bad-product` and a missing valid identifier yields `ITEM_UNAVAILABLE` with no field errors/affected measurement. CART-06/08, AN-04 and CT-14 require recoverable affected rows. Filter disallowed identifiers out of SDK reads, then let the complete-map path reject their original identities alongside unavailable valid IDs. Never fetch drafts/private IDs.

This remains Missing Implementation → Implement → Verify, continuation YES. E-01 through E-04 remain unchanged.

## Rework round 6

I-14's wrapper now filters disallowed identifiers out of SDK reads and passes the original lines into the already complete authoritative map. Draft/private identifiers are never fetched; malformed and missing valid identifiers are reported together, with the healthy identity excluded.

The actual wrapper with a fully stubbed SDK was red at `eb8ce71` (zero fields/zero reads), then green (two affected identities, one root-only SDK read). No real SDK network request occurred. Current lint without warnings, TypeScript and application build/postbuild SEO pass; the source-lifecycle/UI/Studio/SPX evidence for unchanged surfaces remains as recorded above. Final read-only re-audit is required before verification resumes.

## Read-only audit round 7 / final disposition

**Code result:** PASS at `7fedd0116edf5fbdaa1001c9577d068a199d2533`, reviewing `eb8ce71..7fedd01` and connected quote-boundary behavior. No significant issue found; I-14's wrapper repair closes the last recorded actionable source finding. Earlier reviews retain the other fixes' evidence; this is cumulative closure, not a claim that one narrow review exercised every product scenario.

**Issue routing:** I-01 through I-18 are resolved Missing Implementation findings. E-01 is Clarify → Verify; E-02 through E-04 are Plan → Verify. None is erased by feature-branch publication.

**Final verification:** [final-verification.md](./final-verification.md) records all 116 requirements and 52 ACs. Repository/local evidence passes within its scope, while full acceptance remains FAIL/BLOCKED. No real order, CMS mutation, notification or deployment was used to manufacture a pass.
