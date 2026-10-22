# Creativa Staff Audit

**Code re-audit:** Round 3 FAIL at `918134b`; I-12 and I-13 require another rework cycle.
**Overall acceptance:** FAIL / BLOCKED — E-01 through E-04 still lack their required external witnesses.
**Phase:** Read-only audit rounds 1 and 2 completed; no code was changed by either audit.
**Baseline:** `551ab8e`; implementation reviewed through `a98bb7e` on `feat/creativa`.
**Scope:** Approved idea, specs, technical design, revised plan/test plan and repository rules.
**Runtime boundary:** No production order, CMS mutation or notification was authorized/performed. Chromium response fixtures and mocked SDK probes are not real Sanity/native/hosted acceptance.

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

## External blockers

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
