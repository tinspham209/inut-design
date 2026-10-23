# Creativa Sales / Tracking Final Verification

## Current Firefox / Telegram correction — verified

**Current source `fa13d7a`:** Focused direct read-only Staff audit PASS; no-op rework/unchanged-source confirmation. Lint without warnings/types/app229/SEO221 and Studio build pass. Final production checkout200/no-store and every referenced local script200; approved server alias resolves with no value output. Both previews restarted on3000/3001 with current environment and HTTP200 verified. User `.env.example` rearrangement is preserved unstaged, and local `.env` remains ignored.

| Current issue | Result / evidence |
| --- | --- |
| Firefox checkout popup | PASS in owner Firefox: portaled Select/Autocomplete failed, native workaround worked, requested final inline Autocomplete explicitly confirmed fixed after full reload. Exact foreign event target is unproven; no extension blame/global suppression/package patch. |
| Form/payment regression | PASS guarded Chromium: all text fields retained, RHF real input ref/enum quote change, inline listbox/clear disabled. Fresh coherent missing-primary fixture defaults COD/disables transfer. No actual submit; viewport proof reviewed. |
| Notification cause | CONFIRMED: published sales active/valid1/no draft; existing receipt failed TOKEN_MISSING with attempts1. Local env had only legacy NEXT_PUBLIC token; sender deliberately requires server-only CREATIVA key. CMS recipient configuration alone was not sufficient. |
| Approved local correction | PASS readiness: ignored alias explicitly authorized, resolves and Telegram getMe authenticates; getChat confirms readable **private** recipient, not a Telegram channel. No token/chat ID/message body printed. Tracked code never falls back to public key; hosting must set its own server key. |
| Actual existing delivery | NOT SENT / RETRY DECLINED: final read confirms failed TOKEN_MISSING/attempts1 unchanged. No real send/retarget/reset/CMS mutation/new order; actual sender with fake credentials/network proves missing key/fetch0 and explicit key/one request. Bot/chat reads do not prove actual message delivery. |
| CMS/ops clarity | PASS source/Studio build: visible credential-versus-recipient/private-versus-channel/publish guidance, readable safe Sales Destinations preview, saved receipt semantics. Actual operator publishing/delivery remains external. |

Current source issue is resolved; configuration readiness is corrected locally while existing delivery intentionally remains failed. Earlier evidence below is retained for its stated scopes; E-01..E-04 actual private/host/native-wide/operator witnesses are not closed.

## Current transient-toast refinement — verified

**Source `4bf42c0`:** Focused direct read-only audit PASS for all three transient surfaces. Rework is no-op/unchanged confirmation; current lint without warnings/types/app229/SEO221 pass. No actionable code issue, new provider/dependency/API or legacy-flow change.

| Current behavior | Result / evidence |
| --- | --- |
| ID/link/memo copy results | PASS in guarded Chromium: exact values, generic fixed success/error toast replacing previous copy toast, no extra inline Alert/card-height change, no copied ID/URL/contact in toast/metrics. Success only after clipboard resolves; denial honest. Clipboard mocked, native E-04 unchanged. |
| Manual fallback / navigation | PASS: ID/memo remain selectable; copy-link real canonical href supports native menu/long press, normal click copies without navigation. Error guidance matches available fallback. |
| Product add success / CTA | PASS: invalid quantity remains inline/no success; valid1 adds exactly1 with one add event/provider, toast keeps `Xem giỏ`, dismisses/navigates and emits one safe CTA/provider. No persistent error/financial/order state removed. |
| Visual / privacy proof | Mobile header-only screenshot reviewed; toast fixed above header, no card/banner expansion and no contact/payment data captured. Closing-menu/hidden-tab automation interruptions resolved before assertions, not by source edits. |
| Current gates / restoration | PASS: source formatting/lint/types/build229/SEO221, complete direct diff review/no-op rework/routing/final reconciliation. Both owned previews restored on3000/3001, HTTP200 verified. No real order/CMS mutation/send/deployment. External E-01..E-04 remain release gates. |

Historical source/evidence matrices below retain unaffected behavior. Current TRACK-09/AC-51 are reconciled with toast feedback; no copy notice state/inline success banner remains in Creativa.

## Current direct transfer memo correction — verified

**Current source:** `589acbe`, focused direct read-only code audit PASS; no actionable findings and no-op rework/unchanged confirmation. Owner explicitly approved direct/shared/reloaded eligible link-holder tracking showing saved full name + phone, one-space/no-hyphen separator, never an order-ID memo fallback. Older buyer-only assurances below are historical.

| Current correction | Result / evidence |
| --- | --- |
| Canonical memo / eligibility | PASS: actual projection normalizes saved Unicode name whitespace, preserves leading-zero phone, reflects edits and matches accepted nested order DTO. COD/paid/refunded/cancelled/no-bank cases omit it; invalid contact fails explicitly. |
| Supplied direct URL / reload | PASS in Chromium: actual3001 URL renders memo matching API rather than ID; reload still correct, no buyer-session dependency or overflow. Actual contacts were not printed/captured unnecessarily. |
| Copy / telemetry / storage | PASS: mocked clipboard copies exact memo and denial stays honest/selectable; one event/provider/action, no memo in telemetry/storage/URL. All GA4/Umami purchase payload branches omit memo/contact. |
| Removed obsolete plumbing | PASS: buyer Provider/RAM/version token removed with all imports/callers aligned; component requires memo/no ID fallback; stale copying disabled. Other customer/private fields remain excluded; name/phone memo visibility is the explicit approved exception. |
| Current stop gate / production | PASS: lint no warnings, types, app build229/SEO221; production public API/page200 with no-store/no-referrer and correct memo, raw customer/path/measurement identity excluded. Studio/schema unchanged, so no Studio rebuild required for this correction. |
| Audit / routing / previews | PASS focused source scope; prior policy mismatch clarified/implemented/verified. Both approved previews restored on3000/3001, HTTP200 verified. No real order/CMS mutation/send/migration/deployment. E-01..E-04 remain external release gates. |

The older source/evidence matrices retain unaffected mechanisms and historical scope. Current TRACK-05/TRACK-08/AC-51 rows below are reconciled with this explicit privacy amendment; no private-context guarantee remains.

## Sales / tracking continuation — earlier verified scope

[S-01..S-06](./plan.md#sales--tracking-refinement--2026-10-23) is implemented and independently code-audited through `21b7b06`. Rework is a justified no-op; unchanged-code confirmation retains PASS. Current read-only final verification reconciles the 116/52 matrix against explicitly approved editable sales records, buyer-only contact copy and client/session analytics limits. Durable analytics claims/immutable-original-copy promises are retired, not missing implementation. Real database/private permission/native/hosted/operator evidence stays blocked where unexecuted.

| Current request / decision | Result | Evidence / limit |
| --- | --- | --- |
| Tracking thumbnails and colored statuses | PASS code/local; CDN BLOCKED | Supplied existing order read-only lookup has first-image metadata; shared left-slot/fallback and order/payment labels verified. Four semantic text colors meet4.5 contrast; pending warning text explicitly darkened. CDN403 remains E-01. |
| Buyer Name - Phone transfer and copy | PASS | Synthetic accepted response from actual form populates same-SPA private RAM; copy exact/denied cases work with selectable fallback. No contact in storage/URL/telemetry. Current opaque contact-version match required; changed customer/reload/shared tracking uses public ID. Clipboard mocked, not native proof. |
| Compact Creativa history | PASS | Only accessible chips/individual forget; no heading/disclaimer/clear-all. Main-root disclosure and clear controls verified unchanged. Delete stays on search page, never cancels an order. |
| Exact sales editor / previews | PASS source/build; owner publish BLOCKED | `[Status] ID`, customer-date-price preview; order number protected and requested date/status/items/customer/payment/totals/notes/tracking editable. Item popup only product name/image, model, coverage, quantity and print path; hidden optional technical refs do not block manual rows. Studio build and actual definitions pass; authenticated owner publishing remains E-04. |
| No Sanity analytics storage | PASS | Actual service/fake SDK creates no analytics ID/receipt fields; private identity derived/reused without new write. Client sends once/provider in supported session with zero claim requests. Actual retired POST returns410; no order read/patch. Legacy fields preserved hidden. Real vendor delivery remains E-03. |
| Remove attention view / retain safety | PASS source/build | Filtered desk view removed; it stored no documents. Hidden notification/part receipts and operator retry retained, not analytics. No actual send/reconciliation witness; E-01/E-02 remain. |
| Editable working record | PASS local contract | Staff edits reflected by public/private reads, discount/fees/final preserved. Initial customer pricing stays strict. Manual rows need no fabricated catalog IDs/prices; missing/inconsistent itemized money is omitted. No extra original copy or automatic total recalculation/notification resend promised. |

## Compact-client continuation — verified code scope

The [UI-01..UI-07 amendment](./plan.md#compact-ui--form-and-request-amendment--2026-10-23) is implemented, audited, reworked and locally verified. The 116/52 inventory below is reconciled using current evidence for changed surfaces and explicitly retained evidence for unchanged contracts. No actual database/order/send/native/vendor proof has been added.

**Audited application revision:** `fa13d7a` on `feat/creativa` for current Firefox/setup correction. Prior toast/memo/sales scopes retain historical evidence.
**Audit lineage:** Earlier runtime/R-01/C-01 closures retained historically; independent current audit `6e71574..21b7b06` PASS, with isolated probe rerun. No actionable issue; no-op rework/unchanged-source confirmation.
**Code result:** PASS within the recorded scope; no remaining actionable source finding.
**Repository stop gate:** PASS.
**Full acceptance / release:** FAIL / BLOCKED by E-01 through E-04.
**Phase:** Read-only application verification; subsequent changes reconcile documents only.

Authority: [specs](./specs.md), [plan](./plan.md), [test plan](./test-plan.md), [audit](./audit-report.md), [routing](./issue-routing.md). Earlier baseline results remain in Git/audit history; they are not substituted for the current amended contract.

### Earlier compact-client requests — retained scope

| Request | Implementation result | Current evidence / limit |
| --- | --- | --- |
| 1 — cart image zero at left of name | PASS, asset access BLOCKED | Shared 64/76px thumbnail uses first authoritative quote/cart image; hydration/update no longer discard safe public metadata. Left slot/name layout and explicit failed/absent fallback observed. Actual CDN loading remains E-01, not a visual image-success claim. |
| 2 — checkout image at left | PASS, asset access BLOCKED | Same shared thumbnail with quote/cart first-image metadata; compact desktop/mobile left/name alignment verified. CDN limit remains E-01. |
| 3 — white contained-primary text | PASS | Owner explicitly approved `#ae3500` background/white 14px text (6.35:1) rather than compact white on low-contrast `#fd4d01`. Brand primary remains exact `#fd4d01`; hover/touch variants and root brand stay scoped. |
| 4 — RHF + Yup form ownership | PASS | Checkout/customer/payment, product configuration/quantity, cart quantity, header/catalog search and tracking-reference inputs use RHF/Yup. Twenty-three customer variants agree with unchanged server parsing; quantity/reference bounds, invalid focus and no invalid journal/order pass. Only required Yup/resolver dependencies added; no new testing framework. |
| 5 — SWR API hooks / thin pages | PASS | SWR public reads/SWRInfinite catalog and SWRMutation quote/create/resolve remain; current owner decision removes claim hooks/API writes. No raw page request chains or private arguments in keys; accepted recovery does not need current catalog/options. |
| 6 — breadcrumb on every new page | PASS | All eight live routes render navigation/current markup in current production HTML; product-unavailable branch includes source-checked breadcrumb. Actual home/catalog/cart/checkout/guide/tracking journeys observed. |
| 7 — clickable ancestors, last text | PASS | Shared Next/MUI anchors; real breadcrumb clicks and final `span[aria-current=page]` observed. Tracking current label is generic, with no reference in breadcrumb telemetry. Full native keyboard matrix remains E-04. |
| 8 — smaller type / reduced spacing | PASS in Chromium | Body14/secondary13, mobile catalog heading24, product22/28, smaller hero/footer and gaps; actual inputs16px with 44px field height. No overflow at 390x844/1440x1000. Native Safari/owner final visual signoff remains E-04; no performance benchmark improvement claimed. |
| 9 — handler ownership / fewer avoidable effects | PASS | Search commit/change/add/quantity/submit/retry/pagination API actions are handler-owned. One catalog presentation effect covers SSR/cached/fresh list/search results; retained hydration/router/view/exit effects synchronize genuine external lifecycles with cleanup. No render-time request/event dispatch or artificial zero-effect target. |

C-01 is resolved: storage-denied retries are red before and green after rework with exactly one fresh quote, error cleared/action enabled and persistence warning retained. The complete source delta is code-audited; full release still requires E-01..E-04.

## Current requirements and boundaries

The owner accepted the CMS flow and authorized storefront/runtime integration with exact primary **`#fd4d01` in a light theme**. Model slug codes, Portable Text, independent fee records and the sole **active AND primary** bank are connected. No arbitrary active-account fallback or customer bank selector exists.

New private lines retain `production.printAssetPath`; public product/quote/tracking/analytics payloads exclude it. Old artwork/fit/bank data remains readable without migration; staff may directly correct working production/customer/financial fields under the new owner decision. A filesystem path is metadata, not an upload, existence check, file server or immutable copy. Direct visibility of fields on public Sanity product documents is a separate acknowledged boundary; application DTO filtering does not make the underlying field private.

All 116 requirement IDs and 52 AC IDs have individual results below. PASS is limited to the suitable recorded evidence for that requirement. FAIL includes **blocked/not fully verified**, with its missing witness identified; it is not a claim that every such row reproduced a code defect. Full criteria retain all applicable oracles, especially real database, native-device, vendor and operator evidence.

## Evidence register

| ID | Evidence / limits |
| --- | --- |
| V-01 | Current sales-source lint without warnings, TypeScript `--noEmit --incremental false`, app build229/postbuild SEO221 and formatter pass; session tool evidence retained. |
| V-02 | Current sales Studio build passes, including reused status guide/editor/desk. Prior SPX42 retained only for unchanged SPX/loader mechanisms, not an actual order/publishing proof. |
| V-03 | Earlier 17 groups and 23 Yup/customer variants remain scoped historical evidence for unchanged quote/validation/cart mechanisms. Current server/schema/analytics changes are verified by V-11..V-14, not the obsolete claim/immutable-record oracle. No new repository test suite/tool/dependency. |
| V-04 | Earlier CMS inventory found one active product, 16 slug models/15 active, four coverages, nationwide fee/primary bank and no detected format migration. Current read-only catalog/browser observed five published designs and valid current options/prices/quotes. Roster is mutable owner data, not frozen by this report. No path/account values printed, migration/seed performed. |
| V-05 | Current Chromium390x844/1440x1000: actual catalog/product/model/quantity/live cart/checkout quotes, compact linked breadcrumbs/type/spacing, first-image identity/retention and honest CDN fallback. Body14/secondary13; inputs16px/44px; white CTA RGB255,255,255 on174,53,0; brand253,77,1; contrast6.35. Populated lighter fixture bytes preserved. Earlier gallery/merge/remove evidence is retained for unchanged underlying mechanisms; not native proof. |
| V-06 | Prior compact-client guarded/intercepted acceptance/recovery and missing-primary/quote/search/pagination fixtures: normal completion clears submitted cart/journal, appends one ID and shows saved bank. Current claim logic is intentionally retired; current accepted/private transfer/analytics checks are V-11..V-14. Fresh response loss retains journal; same-capability resolve uses no options/quote, clears submitted content and appends its ID once, with zero false abandonment in the fresh action capture. No-primary defaults COD/disables transfer; invalid name/phone focus emits once/provider with no journal/create. Unchanged root-history shortcut retains earlier evidence. No actual persistence/collector proof. |
| V-07 | Current `21b7b06` production HTTP: tracking search/detail, checkout/cart200 with no-store/no-referrer; supplied public order200 excludes customer/contact/measurement/private fields; retired analytics POST410 with configured Origin. Prior eight-route/breadcrumb/404/bounded-catalog checks retain unchanged-route evidence. Prior `715aa79` broader API/header/token/sitemap sweep remains scoped evidence for unchanged server/header/SEO implementations (including quote200 with configured Origin, submitGET405, malformed reference400); it is not a new actual order test. |
| V-08 | Unchanged facade/bootstrap public projection, consent and reference-free URL evidence retained. Current local captures prove latest delayed quote wins/no stale shipping event, latest query wins after old response, 2/1/2 layout no extra API/impression, cached Hot/Country/Hot presentation one event/provider, and additional503 retains2 cards then explicit retry yields3 with only one new item at position2. Actual hosted containers/logs remain unverified. |
| V-09 | Owner accepted revised CMS authoring only. Last safe staff-readiness check found one destination and no dedicated bot credential; no new private readiness claim. No message/production order/deployment/third-party settings change. Physical print/template/rights/handoff approval remains unverified. |
| V-10 | C-01 current-client storage-denied browser oracle: both hydrate-only retries red before fix; both green afterward with exactly one new quote, cleared error/enabled action and persistence warning retained. Independent initial audit plus targeted complete two-hook re-audit PASS. No schema/financial/order protocol change. |
| V-11 | Actual current order service under completely fake SDK/notification transports: create has no analytics fields; accepted/recovery stable identity, no new analytics writes; public contact/path exclusion; editable discount/fees/current customer changes; salted contact-version invalidation; manual row identity/image/unpriced projection; negative money rejection and paid suppression. No actual Content Lake atomicity/permission claim. |
| V-12 | Chromium390x844/1440x1000: supplied real order read-only first-image/status/public privacy; synthetic form acceptance has exact buyer transfer, zero private text in storage/events,0 claim requests, one purchase/provider and0 false abandonment. Copy success/denial via mocked clipboard; changed contact clears old content/notice; reload defaults ID. Root history controls retained, compact chips/forget verified. CDN remains403. |
| V-13 | Actual transpiled Studio definitions confirm all requested editable fields, only order identity protected, hidden technical/legacy data, only human production fields, no hidden required refs for new manual rows, reused guide, exact preview including zero amount and no attention menu. Current Studio build passes; no authenticated edit/publish action executed. |
| V-14 | Actual client purchase helper: GA4/Umami saved values, optional manual-row prices/IDs omitted, exact session replays/module reload suppressed, denied consent/blocked storage nonblocking with memory fallback. Legacy valid UUID reused, malformed identity derives safe hash; transfer privacy/bootstrap parity and semantic chip contrast pass. Current independent audit reran the isolated probe. |

Earlier development images loaded; subsequent headless CDN requests returned403 despite direct same-URL requests200. Current thumbnail metadata/left-slot/fallback checks do not resolve that access discrepancy. E-01 remains open; no global image policy/CDN authentication change or image-success claim.

Browser synchronization limitations were kept separate from app defects: tab activation resolved a hidden automation target; a stale ref was refreshed; a layout assertion initially ran during pending search and was repeated only after a no-match-to-match transition. Settled-query toggles preserve query, exact loaded links/order and selected state with no overflow. No code was changed to satisfy those setup issues.

## Remaining external findings

| ID | Current missing witness / next work |
| --- | --- |
| E-01 | Local server-key alias/bot authentication/private-recipient readability now verified, but existing retry explicitly declined and actual delivery unexecuted. Hosting must set its own server key. Physical files/fit/rights/operator/CDN witnesses remain open; readiness is not delivery. |
| E-02 | Authorized isolated actual Sanity private-access denial, record/ref integrity, transaction atomicity, collision/exhaustion, concurrent acceptance/recovery and retention evidence. Fake SDK state is not Content Lake proof. Review direct dataset metadata access separately. |
| E-03 | Authorized actual collector/container/root exclusions and proxy/cache/referrer/log/abuse controls. Local stubs/canaries do not prove hosted effective delivery or privacy. |
| E-04 | Real iPhone/Safari and remaining complete interruption/storage/keyboard/clipboard/lighter-regression/operator/device matrix. Chromium viewport and owner CMS review are not these witnesses. |

## Requirement results

| Requirement | Result | Evidence / missing witness |
| --- | --- | --- |
| BRAND-01 | PASS | Dedicated layout/source plus current direct HTML and exercised SPA commerce/root-history journeys. V-05/V-07. |
| BRAND-02 | PASS | Neutral home and live first-category entry; no extra orderable category. V-07/source. |
| BRAND-03 | PASS | Dedicated configurable adapted shell, no prerequisite main-brand commerce rewrite. Source/V-05. |
| ROUTE-01 | PASS | Shared category-independent cart/checkout/tracking and category product paths. V-05/V-07. |
| ROUTE-02 | FAIL | Current slug guards/unknown 404 pass; complete actual Studio uniqueness/publication negatives remain E-02. |
| CAT-01 | PASS | Current active published Creativa roster count agrees with returned design cards; no legacy wholesale inclusion. V-04/V-05. |
| CAT-02 | FAIL | Live card/name/minimum/hover behavior observed; later production-browser CDN discrepancy remains E-01. |
| CAT-03 | FAIL | Current trim/case/no-match/cached-query and delayed-response ownership pass locally; actual full equal-date/publication/multi-batch matrix remains E-02/E-04. |
| CAT-04 | FAIL | Current SWRInfinite delayed-response and additional503/retained-page retry/dedup pass with controlled fixtures; complete actual cursor/network matrix remains E-04. |
| CAT-05 | PASS | Current settled mixed-case query survives 2-to-1-to-2 toggles with identical loaded links/order and accessible state. V-05/V-07. |
| CAT-06 | FAIL | No-match/loading/fallback paths covered partially; all empty/config/initial/additional error variants remain E-04. |
| CAT-07 | PASS | No facets/tag filters/advanced sorting/inert controls added. Source. |
| PDP-01 | FAIL | Three-view/alt structure and live images observed; rights/physical-production approval and later browser-CDN readiness remain E-01. |
| PDP-02 | FAIL | Actual gallery/lightbox interaction works in Chromium; complete native touch/keyboard matrix remains E-04. |
| PDP-03 | PASS | Model/four coverage changes preserve selected gallery image; no synthesized imagery. V-05. |
| PDP-04 | PASS | Published CMS supplies 15 active slug-coded models and four coverages, independent of removed fit fields. V-03/V-04. |
| PDP-05 | PASS | Current no-model, quantity-one, first ordered active top coverage/120k default; deliberate/default updater retained. V-05/source. |
| PDP-06 | PASS | Shared safe positive integer guards; committed quantity edit and invalid boundary probes. V-03/V-05. |
| PDP-07 | PASS | Actual four prices/model selection/quantity display and shared coverage-only computation agree. V-03/V-05. |
| PDP-08 | PASS | Missing model disables with reason; valid configured additions work; current-data failures block with retry/no fabricated product. V-03/V-05/source. |
| MODEL-01 | PASS | Owner-approved CMS slug/name/order/active flow, no removed fit flags; physical fit remains explicitly manual, not certified here. V-04/V-09/source. |
| MODEL-02 | PASS | Configured MacBook document/selection boundary; no customer free-text/custom Windows category. V-03/source. |
| PRICE-01 | PASS | Independent Full 310k versus 370k sum, exclusive presets and current four configured prices. V-03/V-05. |
| PRICE-02 | PASS | Shared coverage-price source, no design/model surcharge or quantity tier. V-03/source. |
| PRICE-03 | PASS | Actual catalog minimum 100k versus initially selected top 120k and exact option updates. V-05. |
| PRICE-04 | PASS | Initial customer quote remains exact/discount0; current fake-SDK saved edits preserve manual fees/discount/final, reject unsafe/negative money and omit unknown line prices. V-11. |
| PRICE-05 | PASS | Explicit invalid/missing configuration, deliberate zero shipping valid, no free fallback. V-03. |
| PRICE-06 | FAIL | v2 semantic changes/repricing comparison implemented; actual controlled edit/no-stale-acceptance witness remains E-02. |
| CART-01 | PASS | Independent key/domain; populated lighter fixture bytes preserved through Creativa actions/accepted interception. V-05/V-06. |
| CART-02 | PASS | Typed configuration/prices and first-image safe persistence/left-name display contract; real CDN access remains E-01. V-03/V-05. |
| CART-03 | PASS | Actual same configuration 2+1 merges to 3; changed coverage adds a separate line. V-05. |
| CART-04 | PASS | Actual edit/remove/badge/current total behavior observed. V-05. |
| CART-05 | PASS | Valid cart survives navigation/reloads without initial empty overwrite; normal current flow observed. V-05/V-06/source. |
| CART-06 | PASS | Complete invalid/unavailable map and healthy-row/blocking contract retained; no partial client submit. V-03/source; real DB acceptance separate. |
| CART-07 | PASS | Honest hydrated empty-state actions and shared empty-line rejection before mutation. Source/V-03. |
| CART-08 | PASS | Existing per-entry quarantine/explicit repair, unsupported type rejection and no destructive coercion retained. Source/unchanged helper evidence. |
| EXT-01 | PASS | Explicit skin discriminator/type-local selection, not an arbitrary client attribute bag. V-03/source. |
| EXT-02 | PASS | Common routes/customer/payment/order ownership; no new category/domain/framework. Source. |
| EXT-03 | PASS | Unregistered types reject; existing quarantine preserves healthy entries. Source/V-03. |
| CHECKOUT-01 | PASS | One guest form, name/10-digit phone required; optional address/email/note and no added account/+84/Zalo/pickup. V-05/V-06. |
| CHECKOUT-02 | PASS | Shared client/server parser with exact ASCII phone/email/field metadata and observed invalid-name/phone focus. V-03/V-06. |
| CHECKOUT-03 | PASS | Per-record regional/nationwide/blank-address deterministic selection, no main-brand fallback. V-03/V-04/V-07. |
| CHECKOUT-04 | PASS | Blank address allowed; private fixture snapshot/formatter honestly represents omission, no invented address. V-03/V-06. Actual operator handoff remains E-01. |
| CHECKOUT-05 | PASS | One order-level fee, explicit missing/duplicate/unsafe/default errors and pre-submit amounts. V-03/V-05/V-07. |
| CHECKOUT-06 | PASS | Sole active-primary bank, no account selector/nonprimary fallback; explicit unavailable transfer with COD, saved bank snapshot. V-03/V-06. |
| CHECKOUT-07 | FAIL | Current owner-confirmed Firefox inline Autocomplete plus Chrome fields/enum/disabled-bank cases pass; prior quote/recovery/C-01 evidence retained. Full native/storage/error matrix remains E-04. |
| ORDER-01 | FAIL | Actual service/fake SDK produces one complete order; actual persisted relation proof remains E-02. |
| ORDER-02 | FAIL | Current direct evaluator is authoritative; complete actual configured acceptance witness remains E-02. |
| ORDER-03 | FAIL | Invalid/changed conditions reject in code/probes; actual no-order delta cases remain E-02. |
| ORDER-04 | FAIL | Fingerprint/revision/idempotent replay implementation and fake-store pass; real concurrency/conflict witness remains E-02. |
| ORDER-05 | FAIL | Accepted recovery bypasses current catalog in probes; actual commit-loss/catalog-change recovery remains E-02. |
| ORDER-06 | FAIL | Intercepted completion removes submitted content only; real acceptance plus crash/contribution matrix remains E-02/E-04. |
| ORDER-07 | FAIL | Fake service confirms pending/unpaid; actual saved/staff-edited states remain E-02. |
| ORDER-08 | FAIL | New checkout values/legacy data preserved without migration, direct staff working edits explicitly allowed. Fake saved-edit readback passes; actual retained-file/operator/private-target proof remains E-01/E-02/E-04. No original-copy promise. |
| ORDER-09 | FAIL | Server-created refs/keys and stable ref-free manual rows pass locally; actual persisted/permission/action/deletion witness remains E-02. |
| ORDER-10 | PASS | Unchanged uniform cryptographic 10-character case-sensitive URL-safe allocator, no prefix/time/sequence. Source. |
| ORDER-11 | FAIL | Separate identity roles/source invariance; permanence through actual recovery/edits remains E-02. |
| ORDER-12 | FAIL | Atomic bounded allocator code retained; actual collision/exhaustion target/control remains E-02. |
| OPS-01 | FAIL | Current local server-key mismatch corrected; bot authenticated/private chat readable, CMS guidance/build pass. Actual send/operator handoff not performed (retry declined), so E-01 remains. |
| OPS-02 | FAIL | Actual supplied failure diagnosed TOKEN_MISSING and preserved; fake transport tests verify explicit key/no public fallback. Actual operator delivery/retry rehearsal declined/unexecuted, E-01/E-02. |
| OPS-03 | FAIL | Receipt/claim dedup semantics retained; real race/uncertain receipt evidence remains E-02/E-03. |
| OPS-04 | PASS | Manual fulfillment, no automatic shipment/bank reconciliation/order splitting. Source. |
| OPS-05 | PASS | No unapproved email/SMS/recovery campaign/material/stock/delivery promises. Source. |
| TRACK-01 | PASS | Strict trim/case/encoding, generic Creativa reference handling and isolated lighter rules retained. Source/V-06. |
| TRACK-02 | PASS | Root dropdown and Lighters-selected saved-tag journey reach generic Creativa domain. V-06. |
| TRACK-03 | FAIL | Shared route/data source works locally; complete real-record/manual-entry comparison remains E-02/E-04. |
| TRACK-04 | FAIL | Supplied real public order, thumbnails/chips and fake saved sales edits/discount/manual prices pass. Full authenticated staff/carrier/status matrix remains E-02/E-04. |
| TRACK-05 | PASS | Current approved direct/manual/shared/reloaded eligible memo format, saved edits, copy success/denial, payment-state/no-bank suppression and no-ID fallback pass in actual source/browser/production checks. Native clipboard/vendor/operator delivery remains external, not claimed. |
| TRACK-06 | PASS | Tracking/revisits do not create orders/conversions; intercepted acceptance produces no false abandonment. V-03/V-06/source. |
| TRACK-07 | PASS | Distinct invalid/not-found/service behavior retained; actual malformed-ID and unknown route HTTP outcomes observed. V-07/source. |
| TRACK-08 | FAIL | Current eligible lookup deliberately includes approved saved name/phone memo only, not raw customer/address/email/note/path/measurement identity. No-store/referrer/telemetry/storage guards pass; actual private dataset/host protections remain E-02/E-03. |
| TRACK-09 | FAIL | Current generic toast success/denial, exact copy, no banner/card shift and selectable ID/memo/canonical native-link fallback verified in Chromium mocks; actual/native clipboard/keyboard matrix remains E-04. |
| HISTORY-01 | PASS | Separate plain ID-string array, no new customer/path/account/capability content. V-06/source. |
| HISTORY-02 | PASS | Validation does not append; intercepted acceptance saves one, root tag does not append again; ownership/dedup retained. V-06/source. |
| HISTORY-03 | FAIL | Existing uncapped/no-TTL helpers unchanged; complete >50 expanded-tag/revisit matrix not rerun. E-04. |
| HISTORY-04 | PASS | Compact accessible Creator chips and labeled main-root variant verified; no all-order prefetch. V-12. |
| HISTORY-05 | PASS | Actual root tag bypasses selected Lighters domain without another submit. V-06. |
| HISTORY-06 | PASS | Creator per-chip forget verified without navigation; main-root clear retained. Existing fresh checkpoint/forget safety unchanged; no server/cart mutation. V-12/source. |
| HISTORY-07 | PASS | SSR/shape/ID/dedup/encoded rendering and explicit recovery remain unchanged. Source/previous helper evidence. |
| HISTORY-08 | FAIL | Nonfatal guards retained; full accepted-storage-denial/quota/native matrix remains E-04. |
| HISTORY-09 | PASS | Main-root disclosure remains; compact Creator intentionally omits visible copy per owner. No account/sync/ownership claim or buyer-contact privilege from local ID. V-12. |
| HISTORY-10 | PASS | Fresh storage mutations and independent history/cart/checkpoints retained; no cross-key/tab atomicity promise. Source. |
| CMS-01 | PASS | Separate Creativa type/configuration sources; no legacy bank/fee/product fallback. V-03/V-04/source. |
| CMS-02 | FAIL | Legacy-first isolated code preserved; actual cross-domain admin before/after edit witness remains E-02. |
| CMS-03 | FAIL | Current sales schema/build/definitions pass exact editability/hidden/required production rules; earlier owner catalog approval is not new sales-publishing proof. Actual current owner/negative publish matrix remains E-02/E-04. |
| CMS-04 | PASS | No unverified bulk activation/migration performed; active data remains owner-controlled/manual fit responsibility. V-04/V-09. |
| CMS-05 | FAIL | Legacy/new/manual saved-record projection/formatter and no automatic catalog substitution pass; actual historical files/authenticated edits remain E-01/E-02/E-04. Working sales fields are explicitly editable. |
| CMS-06 | PASS | Same nine root types/dataset, no guide CMS/new platform/service/test framework. Source/V-02. |
| SEO-01 | PASS | Legacy URL/content/sitemap families preserved, no blanket redirect/canonical migration. V-01/source. |
| SEO-02 | FAIL | Existing ordering targets remain migrated in source; full legacy CTA enumeration/crawl remains E-04. |
| SEO-03 | PASS | Separate service/customization pages unchanged. Source/V-01. |
| SEO-04 | PASS | Current product canonical/title/plain-text description/structured prices/images, escaped JSON and no fake ratings/claims. V-05/V-07/source. |
| SEO-05 | PASS | Transaction noindex/no-store/generic metadata and explicit sitemap exclusions. V-07. |
| GUIDE-01 | PASS | Honest coming-soon index, no invented library. V-07/source. |
| GUIDE-02 | PASS | Proper unknown-article 404 and no fake article sitemap/links. V-07/source. |
| AN-01 | FAIL | Local one-per-action producers pass; actual Root/GTM/vendor effective dispatch remains E-03. |
| AN-02 | FAIL | R-01 local context parity fixed/verified; entire actual provider/context catalog remains E-03/E-04. |
| AN-03 | FAIL | Attribution/device architecture retained; hosted campaign/iOS reports remain E-03. |
| AN-04 | PASS | Existing mappings/names retained; guide/producers updated, view/lightbox/R-01 local closure verified. V-03/V-05/V-08. |
| AN-05 | FAIL | Current saved working totals/discount/manual-row omission verified in source/browser; actual Content Lake/hosted provider-value witness remains E-02/E-03. |
| AN-06 | FAIL | Accepted-only purchase once/provider, public reload no purchase and session replay suppression pass locally; full actual interrupted/provider matrix remains E-02/E-03. |
| AN-07 | PASS | Current approved requirement: private opaque derived/legacy identity, zero new Sanity analytics fields/writes, retired route410, explicit session/memory/consent limits verified. Durable cross-browser permission intentionally retired. Hosted delivery still E-03. V-11/V-14. |
| AN-08 | FAIL | Public projections/allowlist/canaries pass; full automatic/hosted capture inspection remains E-03. |
| AN-09 | FAIL | Local URL/title/referrer/header policy passes; actual collector/proxy/log chain remains E-03. |
| AN-10 | FAIL | Direct client dispatch has no awaited claim; consent/blocked-storage failures nonblocking in current helper/browser evidence. Full actual blocked/delayed/disabled collector matrix remains E-03/E-04. |
| AN-11 | FAIL | Local safe history/source/context guards pass; complete real custom/automatic telemetry remains E-03/E-04. |
| UX-01 | PASS | Brand exact-orange/light, owner-approved white-on-dark-orange contained buttons, smaller type/spacing and linked breadcrumbs; 16px/44px mobile inputs. V-05/V-07/source. |
| UX-02 | FAIL | Chromium dimensions are not actual iPhone/Safari/other native touch proof. E-04. |
| UX-03 | FAIL | Current labels/focus/gallery interactions observed; full keyboard/clipboard/accessibility matrix remains E-04. |
| UX-04 | PASS | No account/review/currency/case/Shop Pay feature or fabricated commercial copy added; CMS content remains owner-provided. Source. |
| NFR-01 | PASS | Existing Next/MUI/Zustand/Sanity/import/TS conventions, no platform migration. V-01/source. |
| NFR-02 | FAIL | Server-only boundaries/projections/token scan pass; actual private permissions/host abuse controls remain E-02/E-03. |
| NFR-03 | FAIL | Explicit failure/retry/image fallback paths observed; complete all-surface failure matrix remains E-04 and CDN readiness E-01. |
| NFR-04 | PASS | 24-plus-sentinel catalog, two-image cards, bounded relevant settings, existing responsive image presets and no whole-catalog client dependency. Source/V-07. |
| NFR-05 | FAIL | Legacy source/domain preserved and SPX passes; full reverse-direction lighter/analytics regression remains E-03/E-04. |
| NFR-06 | PASS | Existing gates/browser skill, read-only real data and isolated mocks only; no production order/send/migration/deployment/new tooling. V-01..V-09. |

## Acceptance criterion results

Full applicable variants and their decisive oracle are retained. Partial local success does not close an actual database/native/vendor/operator requirement.

| AC | Result | Evidence / remaining witness |
| --- | --- | --- |
| AC-01 | PASS | Registered direct routes/layout source and exercised SPA cart/checkout/tracking/root-shell journey. V-05/V-07. |
| AC-02 | PASS | Settled nonempty query survives 2/1/2 with same exact card links/order, selected state and no overflow. V-05/V-07. |
| AC-03 | FAIL | Actual trim/case/no-match, cached presentations and delayed-query ownership pass; full actual equal-date/multi-batch oracle remains E-02/E-04. |
| AC-04 | FAIL | Current additional503 retains pages/retries/dedups with fixture; all actual empty/config/initial/additional variants remain E-04. |
| AC-05 | PASS | Actual unselected model, quantity 1, top coverage 120k, card minimum 100k. V-05. |
| AC-06 | PASS | Missing model disabled with explanation, valid configured addition succeeds once per action. V-05. |
| AC-07 | PASS | Four actual coverage prices, unchanged model-based price source and linear quantity math agree with shared evaluator. V-03/V-05. |
| AC-08 | FAIL | Default updater/active guards retained; actual controlled CMS reorder/deactivation/revisit remains E-02. |
| AC-09 | FAIL | Real images/gallery/lightbox observed in development Chromium; full touch/native and production-browser asset access remain E-01/E-04. |
| AC-10 | PASS | Actual same configuration merges 2+1 to 3; changed coverage becomes another line. V-05. |
| AC-11 | PASS | Current quantity/remove/badge/persisted navigation and hydration normal paths observed. V-05/V-06. |
| AC-12 | FAIL | Populated lighter fixture bytes preserved through Creativa actions; full reverse-domain journey remains E-04. |
| AC-13 | FAIL | Complete maps/quarantine/blocking contract verified locally; actual no-partial-acceptance DB witness remains E-02. |
| AC-14 | FAIL | Honest empty/parse rejection exists; combined direct empty-order API/DB oracle not executed. E-02/E-04. |
| AC-15 | FAIL | Blank optional-field intercepted flow and default fee work; actual persisted/operator readback remains E-01/E-02. |
| AC-16 | FAIL | Actual name/phone UI and shared parser pass; full email/direct API/no-order DB matrix remains E-02/E-04. |
| AC-17 | FAIL | Fee selection/zero/error helper cases pass; actual configured edits/saved-fee readback remains E-02. |
| AC-18 | PASS | Real valid primary readiness and consistent missing-primary UI/service fixtures show no fallback, disabled transfer and viable COD quote/action. V-03/V-06/V-07. |
| AC-19 | FAIL | Semantic/repricing comparison/source safe; actual controlled-change/no-stale-order witness remains E-02. |
| AC-20 | FAIL | Fake SDK actual service replay/recovery passes; real concurrency/terminal relations remain E-02. |
| AC-21 | FAIL | Local failure/state mechanisms; actual saved-versus-failed write/handoff/operator witness remains E-01/E-02. |
| AC-22 | FAIL | Contribution/normal intercepted cleanup works; actual accepted record plus crash/new-addition matrix remains E-02/E-04. |
| AC-23 | FAIL | No automatic catalog rewrite and compatible legacy/current working data pass; actual physical asset/template/edit readback remains E-01/E-02. Direct staff corrections are authorized. |
| AC-24 | FAIL | Complete formatter/private schema support; actual notification/CMS/operator handoff remains E-01/E-02. |
| AC-25 | FAIL | Root shortcut/generic routes work; complete same real record/manual entry/lighter oracle remains E-02/E-04. |
| AC-26 | FAIL | Current local projection/error/no-conversion paths; real protected lookup/capture variants remain E-02/E-03. |
| AC-27 | FAIL | Current working status/money and private-context/bank suppression variants pass locally; actual staff/carrier publishing remains E-02/E-04. |
| AC-28 | FAIL | Independent sources/source guard; actual cross-domain admin edit comparison remains E-02. |
| AC-29 | FAIL | Legacy source/build paths preserved; full enumerated ordering CTA crawl remains E-04. |
| AC-30 | PASS | Actual guide 200/unknown article 404, no fake article/transaction sitemap and generic sensitive metadata. V-07. |
| AC-31 | FAIL | Seventeen local groups/selected per-destination actions pass; entire actual collector catalog remains E-03/E-04. |
| AC-32 | FAIL | Current saved-value/opaque identity/session limits/no-Sanity-write behavior passes locally; actual accepted target/provider interruption evidence remains E-02/E-03. Retired durable claims are not an outstanding oracle. |
| AC-33 | FAIL | Application payload/HTML/token/path guards pass; actual automatic/vendor/host capture remains E-03. |
| AC-34 | FAIL | Intercepted acceptance survives blocked claims, consent denial guards; full hung/delayed collector matrix remains E-03/E-04. |
| AC-35 | FAIL | Typed boundary/rejection reviewed; complete required synthetic future-contract plus ownership witness is not recorded. E-02. No new category authorized. |
| AC-36 | PASS | Neutral home/configurable dedicated shell, scoped theme and unchanged platform/main-brand commerce structure. Source/V-05/V-07. |
| AC-37 | FAIL | Current eligible card/unknown slug cases work; full draft/inactive/hover/touch and production-CDN matrix remains E-01/E-02/E-04. |
| AC-38 | FAIL | Shared integer/overflow guards and normal UI quantities pass; full UI/API/no-order variant matrix remains E-02/E-04. |
| AC-39 | FAIL | Amended schema/runtime guards and owner flow accepted; full negative authoring/publication/custom-input target matrix remains E-02. |
| AC-40 | FAIL | Secure ID/key/ref and safe DTO construction reviewed; actual private access/persisted/host abuse chain remains E-02/E-03. |
| AC-41 | FAIL | New/legacy formatter/multipart/claim mechanisms; actual allowed send/replay/operator evidence remains E-01/E-02. |
| AC-42 | FAIL | New metadata/services source passes; complete owner content/image rights/offer/release evidence remains E-01. |
| AC-43 | FAIL | Current compact exact-brand/light Chromium layouts, white contained buttons/contrast and breadcrumbs pass; native Safari/all devices/owner final visual signoff remain E-04 plus CDN E-01. |
| AC-44 | FAIL | Actual read-only API/build/bounds/error evidence; hosted attribution/device reports/full network matrix remain E-03/E-04. |
| AC-45 | FAIL | Bounded secure allocator retained; actual collision/exhaustion/concurrency application controls remain E-02. |
| AC-46 | FAIL | Current intercepted save/no-validation-save and isolated accepted replay pass; complete real terminal-state/browser variants remain E-02/E-04. |
| AC-47 | FAIL | Existing 61-ID/no cap/no TTL helper evidence; full expanded/revisit/both-entry inventory remains E-04. |
| AC-48 | FAIL | Actual root Lighters-selected chip bypass observed; full stale-ID/manual-lighter regression remains E-04. |
| AC-49 | FAIL | Creator individual forget/root-only clear and existing checkpoint safety retained; actual accepted-record interruption matrix remains E-02/E-04. |
| AC-50 | FAIL | Normal local warnings/quarantine source; full denial/quota/post-acceptance/native matrix remains E-02/E-04. |
| AC-51 | FAIL | Current direct memo and ID/link/memo toast success/denial/privacy/manual fallback pass in Chromium; root disclosure retained/Creator compact. Actual native clipboard/device proof remains E-04. |
| AC-52 | FAIL | Local source/context/history/privacy checks pass; complete actual custom/automatic destination catalog remains E-03/E-04. |

## Current task / release disposition

S-01..S-06 have current scoped implementation/audit/routing/verification at `21b7b06`; prior UI-01..UI-07/C-01 evidence remains scoped history through `7918095`. CM-01..CM-06/CM-08 retain their earlier evidence; CM-07 and CR-19/20 remain open for required external/integration witnesses. No detected published-format migration was needed or performed. All six business outcomes remain blocked as **complete launch outcomes**, especially durable real ordering/recovery, actual staff production and hosted measurement/native acceptance.

Next work is exactly the classified Clarify/Plan → Verify work in [issue-routing.md](./issue-routing.md), not blind code rework or weakening an AC. Provide the dedicated bot token through private server configuration, authorize an isolated real test target/handoff, resolve CDN access and obtain native/vendor evidence. No request for a secret in chat is implied.

Known limits remain: localStorage is finite/browser-local/nontransactional; analytics mark-before-send may undercount and unsupported session/browser contexts may duplicate, with no Sanity claim barrier. Eligible link holders now deliberately see saved name/phone memo per owner approval; there is no buyer-context/reload restriction or ID substitution. Other customer details and telemetry/storage remain excluded. Staff working edits require manual final-total recalculation and do not automatically resend notifications. COD→bank without saved bank details gives support guidance. Uncertain notification receipts still require reconciliation; private namespace/host controls and real asset/version/fit are external witnesses. Only `feat/creativa` publication is authorized, not main merge/push, deployment or real data mutation.
