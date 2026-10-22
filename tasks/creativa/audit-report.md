# Creativa Staff Audit

**Overall:** FAIL — actionable implementation issues and external readiness blockers remain.
**Phase:** Read-only audit round 1 completed; rework follows separately.
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
| I-01 | Applied; targeted probe passes, awaiting read-only re-audit | Server emits `terminal: true` only for confirmed rejected intent; client clears only that signal. Actual resolver probe retains a 503 pending capability and clears confirmed terminal rejection. |
| I-02 | Applied; targeted probe passes, awaiting read-only re-audit | Completion re-reads current shared journal/flags; persisted-and-cleared journals do not fall back to stale volatile state. Two actual source completion instances cannot resurrect forgotten history or repeat cleanup. |
| I-03 | Applied; targeted probe passes, awaiting read-only re-audit | Per-entry quarantine keeps healthy items accessible and blocks submit; explicit invalid-only discard preserves healthy instance/quantity. Whole malformed container still requires explicit reset. |
| I-04 | Applied; isolated transport/SDK probes pass, awaiting read-only re-audit | Complete HTML/Unicode-safe message parts have revision-guarded per-part progress; retry skips known sent parts, progresses failed/budget-deferred parts and requires acknowledgment for uncertain delivery. Original valid 4,417-character case covered without external sends. |
| I-05 | Applied; actual updater probe passes, awaiting read-only re-audit | Untouched initial coverage uses first current active option; valid deliberate choice survives reordering; invalid deliberate choice requires reselection. Four updater cases pass. |
| I-06 | Applied; actual handler probe passes, awaiting read-only re-audit | Additional responses emit impressions for newly presented deduplicated cards only, with batch and current layout context; a duplicate next response emits no repeat impression. |

No external blocker may be marked resolved solely because an actionable code defect is fixed. Subsequent read-only audit rounds must identify their reviewed revision and preserve this history.

## Rework round 1

**Resolved implementation issues:** I-01 through I-06 have changes and targeted isolated evidence; they remain subject to the next read-only audit.

**Remaining issues:** E-01 through E-04 remain open. No requirement was changed to manufacture launch data, authorize production I/O, replace native-device evidence or assert hosted privacy.

**Files modified:** `models/creativa.ts`; `api-client/creativa-checkout.ts`; `utils/creativa/{contracts,api.server,orders.server,storage,notifications.server,records.server}.ts`; `store/cart/creativaCart.ts`; `pages/creativa/{cart,checkout}.tsx`; `pages/creativa/skin-laptop/{index,[slug]}.tsx`; `sanity/schemas/creativa/index.js`; `scripts/retry-creativa-notification.mjs`; related plan/test/design/report records.

**Repository stop gate after all fixes:** lint and TypeScript pass; existing SPX 42 checks pass; application production build/postbuild SEO and current Studio build pass. The catalog's missing-configuration state is explicit and expected while E-01 is unresolved.

**Evidence limit:** Source-function/SDK/transport probes are isolated, not real target/native/hosted acceptance. A probe setup initially omitted its callee stub; that setup failure was corrected without weakening the retained-capability assertion. No existing passing regression test was rewritten.
