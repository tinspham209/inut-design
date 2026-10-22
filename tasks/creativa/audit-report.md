# Creativa Staff Audit

**Code re-audit:** Round 5 FAIL at `bb7676a`; I-14, I-17 and I-18 need connected-contract rework.
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
