# INUT Creativa — Test Plan

**SDD gate:** Plan and test-plan refinement.
**Status:** Baseline strategy accepted by the owner on 2026-10-23; the amendments below are pending refinement review. No test execution or implementation pass is claimed.
**Date:** 2026-10-23.
**Authority:** The [revised plan](./plan.md) is the implementation/task/exit source of truth; this document supplies procedures for its reverse-validation matrix. The approved [specification](./specs.md) and [technical design](./technical-design.md) retain business context, subject to explicit refinement dispositions.
**Constraint:** This is test documentation, not test code. Do not introduce a unit-test suite, runner, dependency, framework, CI job or coverage-percentage target. Existing focused assertions may be used where relevant; hypothetical Creativa test scripts are not existing quality gates.

## 1. Objectives and expected coverage

Demonstrate that the implemented Creativa journey accepts the right configuration and price, creates at most one complete order for one intent, preserves cart/history state appropriately and never leaks private order/customer data or breaks the existing lighter journey.

Expected coverage is **behavioral and contract-based**, not a line/branch percentage:

- Every applicable approved requirement has a verification method and an evidence owner.
- Each of the specification's 52 acceptance scenarios has an actual result: not run, pass, fail or blocked.
- Critical invariants are checked through API responses **and persisted Sanity state**, not success toasts alone.
- Customer journeys are observed in a browser, with real iPhone/Safari verification for the primary mobile platform.
- Existing lint/build/Studio and relevant regression checks are recorded with their actual scope and limitations.
- Faults that cannot be reproduced with authorized existing controls stay blocked; absence of an observed failure is not proof that a hard-to-trigger branch works.

No code-coverage measurement, performance score or defect-rate target is invented. This plan does not require every check to be automated.

### Refinement rule

The earlier matrix referenced every AC ID, but grouped references alone did not establish sufficiency. The revised plan now owns one observable exit/task/witness row for each of the 52 ACs, plus business outcomes BO-01 through BO-06. CT-11 through CT-14, DB-11, NE-11 through NE-13 and BDD-24 through BDD-29 close newly identified gaps; they are procedures, not new test code or new product features.

CR-23 records evidence feasibility early. If a required native-device/vendor/fault witness cannot be obtained, that check and its producing task remain blocked; CR-19 cannot be marked done merely for documenting the limitation.

## 2. Strategy, priorities and evidence

| Layer | Method with current facilities | What it establishes | What it does not establish |
| --- | --- | --- | --- |
| Repository quality gates | Existing pnpm scripts and build output inspection. | Lint, compilation/build and existing smoke assertions within their actual scope. | Successful ordering, real CMS privacy or correct external analytics delivery. |
| API/contract checks | Requests from the existing HTTP client/browser Network tools against the implemented same-origin endpoints. | Validation, statuses/envelopes, server-authoritative amounts and safe projections. | Atomic persistence unless database state is also inspected. |
| Sanity integration/database checks | Authorized server/direct-document/Studio observations before and after requests. | Private namespaces, document/reference/key integrity, transitions, atomicity, replay and snapshots. | Real notification receipt or browser behavior by itself. |
| Browser/manual BDD | Existing `agent-browser` workflow and manual browser/device actions. | Visible behavior, navigation, storage, recovery, accessibility and responsive composition. | Native Safari behavior when executed only in a Chromium mobile viewport. |
| Telemetry/operations | Browser Network inspection, allowed tracker/container inspection and authorized staff-destination observation. | Effective dispatch/context, privacy boundaries and known handoff outcomes. | Exactly-once external delivery under every interruption. |
| Focused review | Inspect the implemented contracts/guards against the approved design. | Intended cryptographic source, exhaustive type ownership, server-only imports and scope preservation. | Runtime behavior of an unexecuted failure/race case. |

**Blocking priorities:** wrong price/fee, duplicate or partial acceptance, lost/overwritten cart items, broken accepted-order recovery, leaked lookup/customer/credential data, ineffective private storage, wrong bank/recipient domain and lighter regression. Resolve these before release.

Run the smallest applicable checks after each coherent implementation change. At CR-19, combine evidence into the full acceptance matrix. Repeat broader checks only when new changes/failures warrant it; do not rerun unrelated suites to increase a test count.

## 3. Quality gates that already exist

Sources: [application manifest](../../package.json), [Next configuration](../../next.config.js), [ESLint configuration](../../.eslintrc.json), [TypeScript configuration](../../tsconfig.json) and [Studio manifest](../../sanity/package.json).

| Existing check | Command / entry point | Use and limitation |
| --- | --- | --- |
| Application lint | `rtk pnpm lint` | Existing `next lint` rules. Run separately: `next.config.js` sets `eslint.ignoreDuringBuilds: true`, so a build pass is not a lint pass. |
| Application build | `rtk pnpm build` | Existing `next build`, followed by `next-sitemap` and `scripts/verify-seo.mjs` through `postbuild`. Check errors/output; `strict: false` is the existing TS policy, not a claim of strict typing or functional correctness. |
| SEO smoke | Included in build; existing `scripts/verify-seo.mjs` | Checks selected robots rules, required legacy URLs and absence of `/search`/query URLs in the generated sitemap. It does not currently prove Creativa transaction exclusions or page metadata; inspect those explicitly. |
| Studio build | `rtk pnpm --dir sanity build` | Existing `sanity build`; validates Studio bundling/schema/action integration. It does not prove Content Lake server enforcement or anonymous-access denial. |
| General browser regression | `rtk pnpm regression` → `scripts/regression-test.sh` | Defaults to localhost/basic mode; can exercise broader cart mode through its documented arguments. It logs failures without reliably aggregating a failing process status and uses legacy routes. Read each finding and validate canonical routes manually. |
| Lighter builder/browser smoke | `rtk pnpm regression:lighter` | Defaults to `http://localhost:3000`; captures snapshots/screenshots. `check_element` only prints descriptions and upload/interaction steps are partly simulated. Its “passed” output is not evidence of those actions succeeding. Supplement with observed manual steps. |
| Existing SPX regression | `rtk pnpm regression:spx` | Existing Node assertions/fixtures and injected-dependency checks. Use only if actual shared order/SPX/Telegram changes justify it; it does not establish Creativa database integration or shipment behavior. |
| Quote-form regression | `rtk pnpm regression:quote-form` | **Conditional, not routine:** successful submits write Sanity records and send Telegram notifications. Run only if affected and with explicit authorization/isolated configuration; inspect backend effects separately. |
| Existing browser skill | [agent-browser-automation](../../.agents/skills/agent-browser-automation/SKILL.md) | Use already available browser facilities for snapshots, interactions and screenshots. If unavailable, report the prerequisite rather than adding tooling in this gate. |

The package manifest has no dedicated `test`/`coverage` command. Do not invent one or present proposed `test-creativa-*` files as already runnable.

The [Sanity deployment workflow](../../.github/workflows/deploy-sanity.yml) is a manually dispatched deployment, **not a test gate**. Do not trigger it to validate a schema build or count its success as acceptance evidence.

## 4. Environments, fixtures and authorization

### Entry conditions

- The corresponding CR task and connected consumers are implemented; the approved API paths below are not claimed to exist today.
- Test URL, actual Sanity dataset/project and server permissions are identified. A localhost UI can still point to production; hostname alone is not isolation.
- Mutations, private-record reads, recipient use and any third-party event delivery are explicitly authorized.
- Existing lighter/legacy behavior is recorded before touching its shared surfaces.
- Relevant G-01 through G-06 prerequisites and the CR-23 control/permission ledger are verified. Missing access is a blocker, not a pretend pass.

### Fixture set

| Fixture | Required variation |
| --- | --- |
| Catalog | Multiple approved-looking synthetic designs, more than one 24-card batch, equal creation timestamps, inactive/draft records, unknown/reserved slugs and missing/invalid imagery. |
| Models/coverage | At least two verified synthetic models; all four initial coverages; inactive/reordered entries and invalid/unverified options. No claim that screenshot labels prove real hardware fit. |
| Shipping/payment | Independent regional/default rules, deliberate zero fee, missing/ambiguous default and separate fake bank/sales settings. |
| Cart/browser | Both cart domains populated; identical/different skin selections; pending submitted quantities plus later additions; empty/corrupt/unknown-type data. |
| Orders | Pending/paid/failed/refunded/cancelled examples, manual carrier reference, retained snapshots and independent internal/public/analytics/capability identities. |
| History | Empty, repeated, partially invalid and malformed arrays; more than 50 valid-format synthetic IDs; blocked/full storage and stale/not-found IDs. |
| Failures | Available network blocking/throttling/request replay, service unavailability and authorized nonproduction control of timing/provider outcomes where supported. |

Use fake contact values, owned assets and authorized test destinations. History-volume checks do not require creating dozens of real orders: valid-format local synthetic IDs can test rendering, while a separately accepted fixture tests actual lookup.

Keep a restricted ledger of exact fixture record IDs for inspection/authorized cleanup. Do not bulk-delete namespaces, remove real orders or erase accepted-intent barriers to reset a test. Redact capabilities/customer/lookup values from shared screenshots, reports and telemetry captures; use harmless fixture references when demonstrating redaction.

There is no SQL database/migration gate here. Sanity checks concern document IDs, `_type`, `_key`, `_ref`, `_rev`, private paths and transaction behavior.

## 5. Contract and integration scenarios

Exercise the planned endpoints using current HTTP/browser facilities. Record request category, response status/envelope, visible effect and relevant persisted-state check; do not publish raw capability/customer bodies.

| ID | Exercise | Expected result / evidence |
| --- | --- | --- |
| CT-01 | Catalog/product/options: empty and mixed-case query, page boundary, equal dates, malformed or wrong-query cursor, rapid successive queries, inactive/draft/reserved/unknown slug. | Only eligible Creativa data, stable ordering, bounded batches, correct cursor/search ownership and distinct no-results/not-found/error outcomes. No private projections or legacy wholesale inclusion. |
| CT-02 | Quote every coverage across different designs/models and quantities. | Unit prices initially 120k/100k/150k/310k; Full is not 370k; exact safe-integer arithmetic, one combined shipping fee, zero discount and no model/artwork surcharge. |
| CT-03 | Omit address/email/note; vary regional/default shipping and bank availability. | Blank optional fields allowed; valid default fee shown; explicit zero accepted; missing default blocks instead of free delivery; no main-brand fallback. Valid COD remains possible when bank transfer is unavailable. |
| CT-04 | Submit invalid fields/types/options; separately spoof product display labels, prices, statuses and reviewed totals. | Invalid requests reject without an accepted order. Client fields cannot set product snapshots or privileged/financial authority; tampered reviewed amounts follow the quote-conflict contract. Any accepted request contains server-derived values, not spoofed labels/statuses/prices. |
| CT-05 | Change price/fee/availability/production meaning between review and submit. | Safe conflict/review response; cart/form retained; no silent increase, stale accepted quote or partial acceptance. New reviewed intent is distinguished from an unresolved old intent. |
| CT-06 | Submit/replay the same capability and then reuse it with changed intent. | One accepted snapshot/reference for the original intent; changed intent conflicts; later catalog edits do not rewrite recovery. Rejected intent remains terminal. |
| CT-07 | Lookup known/unknown/malformed/wrong-case references from both entry points. | Exactly ten URL-safe case-sensitive characters; surrounding whitespace trimmed without case folding; correct domain mapping; minimal no-cache projection and distinct not-found/service error. |
| CT-08 | Wrong HTTP method/origin, oversized/invalid body, disabled server config and rate-limit boundary. | Appropriate designed failure/headers, safe messages and retry guidance. No mutation or customer/credential disclosure. Process-local limits are not claimed to prove distributed enforcement. |
| CT-09 | Conversion-claim requests with valid checkout capability, absent/wrong capability, duplicate/unknown event key, disabled destination or oversized provider payload. | Only allowed accepted-order claims; stable non-sensitive analytics identity; no public-lookup conversion authority. Unrepresentable payload is diagnosed before claim; accepted checkout remains successful. |
| CT-10 | Staff handoff with known failure, timeout/uncertain result and replay. | Accepted order survives; correct recipient domain and state; no routine duplicate message, raw error leakage, customer messaging or automatic shipment. Actual delivery needs destination evidence, not a UI toast. |
| CT-11 | Inspect initial/direct/SPA order navigation, outgoing referrers, page/data/API responses, caching, error bodies and actual collector/host capture with synthetic canary values. | No private snapshots are shared/reused between references; sensitive responses are no-store, titles/index metadata are generic, and canary lookup/customer/capability values do not reach telemetry/log paths that must be protected. Noindex alone is not the proof. |
| CT-12 | Start with a recognized unresolved journal; attempt replacement/new checkout, changed customer/payment data on the same capability and separate deliberately new capabilities. | Resolve/retain the known attempt instead of silently overwriting it; submitted intent remains frozen. Same-capability conflict/replay rules hold. Do not expect global semantic deduplication across separate intentional capabilities. |
| CT-13 | Repeat identical quote evaluations at different times/request IDs; make harmless versus commercial CMS edits; tie option sort values; supply invalid configured money or failed image records. | Stable commercial digest despite incidental metadata/revision changes; actual artwork/fit/price/fee/availability/payment change requires review. Option choice is deterministic and invalid data is rejected/shown honestly, never a fabricated available/free product. |
| CT-14 | Use the delivered analytics-guide producer map to exercise each applicable approved event, including searches/no-results, additional loads, gallery, options, cart, validation/errors, abandonment, history and copy actions. | Correct trigger/property/destination once per intended action; attribution and amount fields agree with source state. Verify the entire applicable event catalog rather than infer it from a successful purchase event. |
| CT-15 | Use a valid long note/address and many/escaped/Unicode field values that exceed one staff message; interrupt part delivery and retry failed/unknown/deferred cases. | All required content remains complete in bounded parts; known sent parts are not routinely resent, failed/deferred parts make progress and unknown delivery requires acknowledgment. Do not truncate immutable customer data to make a test pass. |

CT-14 explicitly includes initial cached catalog cards when revalidation fails, unchanged refresh/additional-page/layout deduplication, hydrated empty/invalid/failed-quote carts, default shipping without address interaction, unchanged default payment at valid submit, cancelled stale quote responses, typed 404 versus service-error lookups from both sources, and history read/parse/remove/clear failures. Unavailable cart money is omitted with an unavailable price basis, not reported as a fabricated zero. Isolated source probes establish local producer logic only; actual intended destinations remain a separate required witness.

Also type and clear a catalog query before the debounce commits: continuously displayed cards must not receive another impression, while a genuinely committed new query still does. A single repricing rejection carrying a replacement quote must emit one specifically classified checkout error, retain that quote for review and preserve terminal-attempt cleanup.

Do not expose a new public fault-injection/test endpoint to make these checks convenient.

## 6. Sanity integration and database scenarios

Observe exact documents before/after an authorized run using direct authenticated reads and Studio. Database observations are separate from a browser screenshot or an HTTP 2xx.

| ID | Setup/action | Required database invariant |
| --- | --- | --- |
| DB-01 | Accept one valid reviewed checkout. | One complete `creativaOrder`, one lookup mapping to it and one accepted intent. All lines/configurations/quantities/money/statuses are correct; unique `_key` values and valid Creativa references. No category split or `ordersLighter` write. |
| DB-02 | Concurrent same-intent submissions; replay after lost response. | Single terminal accepted intent and original public ID/snapshot. No orphan order/index or second notification/conversion caused by replay. Verify counts/relations, not only equal response text. |
| DB-03 | Read private order/intent/lookup/sales namespaces anonymously, before and after permitted Studio edits. | Anonymous direct CMS access is denied/omits private records, even if the dataset is public; public API projections do not include raw documents. An authenticated read alone is not evidence of denial. |
| DB-04 | Use a controlled duplicate lookup candidate/transaction failure in the isolated target. | Whole acceptance transaction fails together; unrelated index/order is not overwritten. Application allocation retries are bounded to five and exhaustion is explicit. A duplicate-index transaction alone does not prove the application's retry branch. |
| DB-05 | Race accepted/rejected transitions, or fail after some mutations would have been issued. | Revision guard determines one terminal outcome; no partially accepted lines or accepted intent without its complete order/index. Use direct records because search visibility can lag. |
| DB-06 | Edit/deactivate product/model/coverage/artwork after acceptance; inspect Studio deletion controls and tracking. | Snapshots and amounts/production meaning remain intact; required historical assets/references remain interpretable; no newer design substitution. |
| DB-07 | Change Creativa shipping, bank and recipient settings; inspect main-brand/lighter records. | Independent configuration ownership and schema types. Typed order lines—not public-ID prefixes—identify categories. Unsupported future submit types still reject. |
| DB-08 | Race notification dispatch/analytics claims; simulate known and ambiguous delivery outcomes where controls exist. | One permission owner per event/destination, correct sent/failed/unknown state, immutable accepted order, no false claim of exactly-once external delivery. |
| DB-09 | Recover an unbound capability, then replay its delayed original submit; also test the original binding winning first. | Tombstone/intent binding race permits one terminal result. A confirmed pre-binding rejection prevents late acceptance; a winning bound intent can resume. No new capability is silently substituted during ambiguity. |
| DB-10 | Inspect terminal data retention and customer-body removal after acceptance/rejection; reload recovery. | Duplicate pending customer body removed as designed; terminal fingerprint/identity barriers and accepted lookup mapping retained. Internal/public/analytics/capability values remain separate. |
| DB-11 | With a known accepted order, interrupt browser completion between cart mutation/history handling/journal checkpoints; resume the same accepted attempt and compare server plus local state. | Server still has one order/lookup/accepted intent; repeated cleanup cannot subtract twice or erase new contributions. Finished/dismissed history handling is not replayed after explicit forget; stalled metrics do not retain/replay unrelated local side effects. Storage refusal is an honest limitation, not a duplicate purchase. |

**Controllability rule:** deterministic random collision, commit-loss and exact race interleavings may not be triggerable through the normal UI/API. Use only an already available, authorized nonproduction control or explicit database experiment. If none exists, mark the application branch **blocked** and escalate the evidence gap. Do not claim source review, “no collisions in my sample” or manual status editing proves that branch executed. Do not add a unit harness/tool in this documentation gate.

CR-23 must record, separately for each hard case, the available control, exact application entry point, target/permission, expected persisted-state witness and owner. It is not enough to mark a single generic “fault injection available” assumption. CR-07 cannot claim its application collision/exhaustion path verified from an index-only experiment; the same distinction applies to interrupted local completion and dispatch races.

## 7. Negative tests and edge cases

These variations apply across the contract/database/BDD cases; record the selected values and observed result rather than ticking a generic “negative tests passed” box.

| ID | Inputs/conditions | Expected boundary |
| --- | --- | --- |
| NE-01 | Empty/whitespace name; phone with 9/11 digits, `+84`, letters or formatted separators; leading-zero valid 10-digit phone; blank versus malformed email. | Required/optional rules match the owner's lighter-style decision. No added normalization/Zalo check; leading zeroes preserved. |
| NE-02 | Blank, zero, negative, fractional, non-finite or unsafe/overflow quantity/total; unsupported product type; another domain's IDs. | Correct rejection or explicit cart removal action for quantity zero; no coerced order quantity, overflow, cross-domain reference or free-price fallback. |
| NE-03 | No active model/coverage, Lưng inactive, reordered coverage, zero/missing fee, missing bank or ambiguous default shipping. | Valid first-active/default behavior, correct displayed price and explicit unavailability. Do not silently choose a MacBook or arbitrary shipping record. |
| NE-04 | Missing/draft/reserved slug, same timestamp, search maximum/beyond-boundary input, wildcard characters, stale response arriving last. | No draft leak, skipped equal-date records, query injection/reset, misleading filter controls or old-query overwrite. |
| NE-05 | Short/long/invalid-character/wrong-case public ID; internal/analytics ID entered as lookup; malformed capability. | Strict role/format validation; correct not-found versus invalid response; no case normalization or identifier interchange. Format sampling does not prove cryptographic randomness—review the secure source too. |
| NE-06 | Storage key absent, malformed/non-array data, duplicate/invalid IDs, denied/quota-full storage, reload during hydration, multi-tab append/remove/clear. | Distinct recoverable states, no destructive fallback, no artificial history cap/TTL, no stale clear resurrection. Do not promise atomic cross-tab storage. |
| NE-07 | Network offline/timeout before binding, after commit and during local completion; double click; new additions of the same configuration while pending. | Stable capability and explicit resolution; accepted order not reclassified; only submitted contributions removed; lighter/unrelated additions preserved. |
| NE-08 | Clipboard denied/unavailable, stale history ID, shared browser, another device, remove click inside tag. | Honest copy fallback, proper not-found handling, local privacy explanation; remove does not navigate/cancel and no cross-device history is implied. |
| NE-09 | Block/disable/delay trackers, change consent under existing policy, initial versus SPA navigation, raw referrer/query/hash, interrupted claim delivery. | Commerce remains usable, no sensitive payload/automatic page leak, no duplicate purchase and no unsupported exactly-once-delivery claim. |
| NE-10 | Notification failure/unknown result, paid/refunded/cancelled order, safe manual carrier reference, deactivated catalog during historical recovery. | Correct independent operational/payment display, no inappropriate payment prompt, no blind external resend, history preserved and no automatic SPX action. |
| NE-11 | Claim/provider hangs after known acceptance; crash before/after cart/history checkpoint writes; forget after history handling while an old callback is outstanding. | Confirmation/recovery stays usable, cleanup is idempotent and forgotten history is not resurrected by the old completion. No exactly-once transaction across browser keys is assumed. |
| NE-12 | Known unresolved attempt in another tab/journal; edited submitted form during uncertainty; intentionally different capabilities. | No knowingly destructive replacement or mutation of the frozen submitted intent; resolve first. Distinct deliberate intents remain distinct, not a claimed cross-device duplicate-prevention feature. |
| NE-13 | Cosmetic `_rev`/timestamp change, reordered equivalent request fields, meaningful artwork/fit change, tied option order, negative/non-finite configured money or failed image. | Canonical meaning/order is stable, meaningful changes require review and bad config has explicit boundaries. Do not infer a new free-product, stock or hardware-support policy. |

## 8. Browser/manual BDD scenarios

Execute these as human-readable **Given / When / Then** checks, not a generated test-code suite. Use the repository browser skill for available automated interactions, then manually verify anything it does not actually exercise.

| ID | Given | When | Then |
| --- | --- | --- | --- |
| BDD-01 | A mobile visitor opens root and Creativa pages. | Navigate through home, catalog, cart, checkout and tracking. | Dedicated Creativa shell/links stay in its namespace; main-brand header/footer/lighter wrapper remain unchanged. Neutral home shows only the live category. |
| BDD-02 | Catalog has multiple batches and a query. | Switch two columns to one/back, load more and rapidly change the search. | Default is two; layout changes preserve query/results/order; stale responses cannot replace current results; retry preserves loaded cards. |
| BDD-03 | All four initial coverage presets are active. | Open a design, inspect gallery, change coverage/model and quantity. | No model initially, Lưng selected, quantity 1; card from-price 100k versus exact Lưng 120k; 120k/100k/150k/310k apply; no generated/selector-switched images. |
| BDD-04 | Product has no chosen model or invalid quantity. | Attempt to add, then choose a valid model and quantity. | Invalid attempt explains why; valid addition works. Same identity merges, another model/coverage stays separate. |
| BDD-05 | Both lighter and Creativa carts contain items. | Reload, change/remove Creativa items and inspect its badge and lighter checkout. | Valid contents/totals persist after hydration; badge counts units; lighter state/pricing remains untouched. |
| BDD-06 | Cart/checkout is empty or contains an invalidated line beside a valid line. | Open checkout or revalidate after option deactivation. | Honest empty or affected-line state; no partial order or silent dropping; valid lines stay available for correction. |
| BDD-07 | A valid cart and default fee exist. | Submit name and a valid 10-digit phone by COD, leaving address/email/note blank. | Optional blanks are accepted, displayed default fee is applied once and staff summary says address not supplied; one accepted order/reference results. |
| BDD-08 | A valid cart uses bank transfer. | Review instructions and later inspect staff-set paid/refunded/cancelled states. | Independent Creativa bank data/accepted amount; instructions only when appropriate; order placement is not represented as payment received. |
| BDD-09 | Name/phone/email or quantities are invalid. | Submit through UI and compare the direct contract outcome. | Specific understandable validation; no backend acceptance or state loss; no added +84/Zalo requirement. |
| BDD-10 | A quote has been reviewed. | Change price/fee/availability before submitting. | Review/conflict is explicit; form/cart remain; no silently increased charge or stale accepted snapshot. |
| BDD-11 | Checkout is submitted and its response is lost after acceptance. | Retry/resolve the same attempt and reload. | Original accepted order/10-character ID is recovered; no duplicate order, history entry, staff handoff or purchase conversion. |
| BDD-12 | A recovery journal exists but no intent bound before the interruption. | Resolve while the original is delayed, then replay that original with the same capability. | Confirmed tombstone rejection blocks late creation; user can re-review a new attempt only after a terminal result. If exact control is unavailable, record blocked rather than simulated pass. |
| BDD-13 | Submitted cart contributions are pending. | Add more of the same design/configuration and an unrelated item before acceptance. | Accepted completion removes only submitted quantities; new additions and lighter items survive. Ambiguous cleanup shows a notice instead of destructive reset. |
| BDD-14 | An order has just been accepted/recovered. | Visit both tracking searches, reload, open a tag, manually search and open a shared link. | Created/recovered ID saved once, unseen IDs first; tag/manual/shared navigation does not add it again or create a purchase. |
| BDD-15 | Local history contains more than 50 valid-format IDs. | Expand tags, remove one, clear history and reload with a populated cart. | Every saved ID remains reachable; 20 displayed tags is only a rendering batch; no cap/TTL; forget actions change only history, not orders/cart. |
| BDD-16 | Root tracking currently has Lighters selected. | Tap a saved Creativa tag, then separately use the manual lighter option. | Tag opens generic Creativa detail in one step; lighter validator/route remains unchanged. Wrong-case/stale IDs follow honest not-found/error behavior. |
| BDD-17 | History/cart/journal storage is corrupt, blocked or full. | Open tracking, reload checkout and accept an authorized fixture where possible. | Explicit recovery/local-save warning; accepted order/ID/copy remain usable; no request to repurchase, false empty overwrite or global storage clearing. |
| BDD-18 | An ID/link can be copied and the clipboard may deny access. | Copy each, forget a tag and use another/shared browser. | Exact public ID/correct URL only on confirmed success; selectable fallback on failure; remove does not navigate; same-browser/shared-device limits are explained. |
| BDD-19 | Both enabled collectors and real approved container configuration are observable. | Perform discovery/configuration/cart/checkout/history/tracking actions and direct/SPA navigation. | Approved event names/context and one effective emission per destination; no ID/customer/history/referrer leak. Purchase comes from the accepted snapshot, not tracking renders. |
| BDD-20 | Trackers are blocked/delayed/disabled under existing controls. | Complete authorized shopping/lookup and interrupt a claimed event before transmission. | Commerce works; no new purchase on return; document possible undercount and distinguish disabled versus failed evidence. |
| BDD-21 | Staff handoff has a known failure or an uncertain external result. | Inspect the accepted order, notification state and authorized retry procedure. | Order remains accepted; staff can discover/reconcile; unknown delivery is not blindly resent; no unpromised email/SMS/shipment appears. |
| BDD-22 | Legacy skin/keycap index/details and separate service pages are available. | Follow ordering versus support CTAs, inspect new product metadata/sitemap and guide routes. | Legacy pages stay useful/indexable; ordering enters Creativa; separate services remain; transaction pages are non-indexable and no fake guide content/ratings/offers appear. |
| BDD-23 | Approved screenshots and a real iPhone/Safari plus other available browsers are accessible. | Use menu, grid, gallery, selectors, quantity, forms, tags, copy and keyboard/focus navigation. | Clean compact image-first UI with no obscured actions/overflow or hover dependency; meaningful labels/errors/selection states. No copied account/currency/Shop Pay/case feature. |
| BDD-24 | Checkout acceptance is known, but the claim endpoint or a collector hangs/fails/is absent. | Continue through confirmation, copy/tracking and reload/recovery. | Navigation and required local completion do not wait indefinitely on metrics; accepted order remains accepted and no extra conversion is fabricated on return. |
| BDD-25 | An accepted attempt has partly or fully reconciled its cart/history. | Reload/resume again at controlled checkpoints, then forget its saved tag while an old completion can still return. | Submitted contributions are removed at most once, newer additions remain, and finished history handling does not re-add the forgotten ID. If the checkpoint cannot be reproduced, record the witness blocked. |
| BDD-26 | A known unresolved checkout capability is already stored. | Open another checkout view/tab or try to edit/resubmit its frozen contact/payment/configuration. | The app retains/resolves the recognized attempt instead of silently replacing it; no claim of semantic deduplication across independent capabilities/devices. |
| BDD-27 | Synthetic canary reference/customer values and actual permitted collectors/hosting observations are available. | Direct-load, SPA-enter/exit, trigger an error, follow/copy links and inspect response/referrer/cache plus automatic/custom telemetry. | Protected canaries are absent from those transmissions/captures; no private response is reused for another reference. Page metadata/noindex alone cannot pass this scenario. |
| BDD-28 | Staff have an authorized synthetic order using CR-21's approved launch assets/configuration. | Read every selection/quantity, open the retained printable master and correct model/coverage template, inspect payment/notification and handle an omitted address. | Operator can perform the intended manual handoff without guessing design/fit or negotiating the configured price; missing-address/reconciliation steps are owned. Record asset readback and signoff, not unapproved manufacture/customer contact. |
| BDD-29 | An authorized accepted order exists in a staging release candidate. | Rehearse pausing fresh purchases through availability controls and the documented corrective-release continuity path. | Fresh purchasing is unavailable honestly while accepted lookup/recovery still works; no order/index/terminal barrier is deleted, no public ID reset and no forced rollback to missing tracking routes. |

### Device and execution matrix

- **Primary:** real iPhone/Safari for purchase, reload/recovery, storage, clipboard and mobile navigation. Record actual browser/OS/device, not a guessed support-version promise.
- **Complement:** available Android/Chromium mobile, desktop keyboard/mouse and a tablet-width layout.
- **Viewport changes:** use representative narrow/wide mobile and desktop layouts to find overflow; screenshots are qualitative reference evidence, not an invented pixel-diff threshold.
- **Limitation:** Chromium mobile emulation supports layout evidence only. If native Safari is unavailable, its required verification is blocked/manual follow-up, not marked passed.

## 9. Regression scope

| ID | Trigger/surface | Required unchanged behavior and evidence |
| --- | --- | --- |
| RG-01 | Shared app/document/layout/analytics integration. | Root navigation/branding, lighter product discovery/builder/cart/checkout and canonical lighter tracking route; existing browser scripts are aids, not substitute assertions. |
| RG-02 | Cart, history, recovery storage. | `inut-lighters-cart`, main-brand cart/consent preferences and unrelated keys remain untouched. Local history removal cannot delete a server order. |
| RG-03 | CMS/order/API/notification integration. | Existing lighter tiers, payloads, order-number format, `_type` selectors, snapshots and bank/shipping/recipient config remain independent. No Creativa item enters SPX/light-order processing. |
| RG-04 | Root order search and telemetry. | Lighter dropdown/validation/path remains; Creativa's branch/history never passes raw references to the legacy analytics helper. Event names/disabled-tracker behavior for unrelated surfaces are not silently migrated. |
| RG-05 | Legacy CTAs/SEO changes. | Both legacy index/detail families, separate customization/service URLs, root/blog/contact discovery and required sitemap entries remain reachable; no blanket redirect/canonical change. |
| RG-06 | Shared phone/contact or Telegram/SPX helpers actually changed. | Use the existing relevant quote-form/SPX check only with its required authorization and prerequisites. Quote-form +84/Zalo behavior must not be imposed on Creativa checkout, nor broken by it. Do not run real submits simply to prove an unrelated page. |

A previously failing legacy route/script check is recorded as baseline evidence and assessed for relevance. Do not fix unrelated defects, hide them with a success banner or treat them as a new Creativa regression without comparison.

## 10. Expected requirement and scenario coverage

The following maps **planned evidence**, not completed automated coverage. CT/DB checks and BDD/manual observations complement each other; RG checks and repository gates protect existing behavior. The revised plan's one-row-per-AC reverse matrix is the authoritative task/oracle mapping; this grouped table is a procedure index, not a competing completion checklist.

| Requirement group | Expected verification |
| --- | --- |
| BRAND-01, BRAND-02, BRAND-03, ROUTE-01, ROUTE-02 | CT-01; BDD-01, BDD-22, BDD-23; RG-01, RG-05; scoped source/build review. |
| CAT-01, CAT-02, CAT-03, CAT-04, CAT-05, CAT-06, CAT-07 | CT-01; NE-04; BDD-02, BDD-03; bounded network reads and page-state evidence. |
| PDP-01, PDP-02, PDP-03, PDP-04, PDP-05, PDP-06, PDP-07, PDP-08, MODEL-01, MODEL-02 | CT-01, CT-02, CT-04; NE-02, NE-03; BDD-03, BDD-04, BDD-23; Studio checks. |
| PRICE-01, PRICE-02, PRICE-03, PRICE-04, PRICE-05, PRICE-06 | CT-02, CT-03, CT-04, CT-05; DB-01; BDD-03, BDD-10. |
| CART-01, CART-02, CART-03, CART-04, CART-05, CART-06, CART-07, CART-08 | NE-02, NE-06, NE-07; BDD-04, BDD-05, BDD-06, BDD-13, BDD-17; RG-02. |
| EXT-01, EXT-02, EXT-03 | CT-04; DB-07; typed-contract review and synthetic fixture inspection. Reject unregistered production types; do not build an extra category to claim this coverage. |
| CHECKOUT-01, CHECKOUT-02, CHECKOUT-03, CHECKOUT-04, CHECKOUT-05, CHECKOUT-06, CHECKOUT-07 | CT-03, CT-04, CT-05; NE-01, NE-03; BDD-07, BDD-08, BDD-09, BDD-10, BDD-17. |
| ORDER-01, ORDER-02, ORDER-03, ORDER-04, ORDER-05, ORDER-06, ORDER-07, ORDER-08, ORDER-09 | CT-04, CT-05, CT-06; DB-01, DB-02, DB-05, DB-06, DB-09, DB-10; BDD-11, BDD-12, BDD-13. |
| ORDER-10, ORDER-11, ORDER-12 | DB-01, DB-04, DB-10; NE-05; BDD-11; secure-random source review plus controlled collision evidence where available. |
| OPS-01, OPS-02, OPS-03, OPS-04, OPS-05 | CT-10; DB-08; NE-10; BDD-21; RG-03. |
| TRACK-01, TRACK-02, TRACK-03, TRACK-04, TRACK-05, TRACK-06, TRACK-07, TRACK-08, TRACK-09 | CT-07; DB-03, DB-06; BDD-08, BDD-14, BDD-16, BDD-18; RG-04. |
| HISTORY-01, HISTORY-02, HISTORY-03, HISTORY-04, HISTORY-05, HISTORY-06, HISTORY-07, HISTORY-08, HISTORY-09, HISTORY-10 | NE-06, NE-08; BDD-14, BDD-15, BDD-16, BDD-17, BDD-18, BDD-19; RG-02. |
| CMS-01, CMS-02, CMS-03, CMS-04, CMS-05, CMS-06 | CT-01, CT-04; DB-03, DB-06, DB-07, DB-10; Studio authoring/action review and existing build. |
| SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, GUIDE-01, GUIDE-02 | BDD-22; RG-05; existing postbuild SEO smoke plus explicit Creativa sitemap/metadata/404 inspection. |
| AN-01, AN-02, AN-03, AN-04, AN-05, AN-06, AN-07, AN-08, AN-09, AN-10, AN-11 | CT-09; DB-08; NE-09; BDD-19, BDD-20; actual collector/container network inspection. |
| UX-01, UX-02, UX-03, UX-04 | BDD-01, BDD-02, BDD-03, BDD-18, BDD-23; native-device/manual accessibility evidence. |
| NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06 | Existing lint/build/Studio checks; CT-08; DB-03; negative cases, regression matrix and authorization/evidence review. |

### Mandatory refinement evidence

| Closure | Procedures / implementation witness |
| --- | --- |
| Stable quote/fingerprint business meaning, not volatile time/revision noise | CT-13, NE-13; CR-02/CR-06/CR-07 and the AC-19 oracle. |
| Acceptance independent of optional measurement | CT-09, NE-11, BDD-24; CR-16/CR-17 and AC-34. |
| Repeat-safe cleanup/history handling after partial local completion | DB-11, NE-11, BDD-25; CR-08/CR-09/CR-17 and AC-22/AC-49/AC-50. |
| Recognized unresolved capability not silently replaced | CT-12, NE-12, BDD-26; CR-08/CR-17. Do not add a global duplicate-detection feature. |
| Entire collector/header/cache/referrer path and documented event producers | CT-11, CT-14, BDD-27; CR-04/CR-10/CR-18/CR-23 and AC-31/AC-33/AC-52. |
| Actual launch data and usable manual fulfillment handoff | BDD-28, CT-13; CR-21/CR-22, BO-01/BO-04 and AC-15/AC-23/AC-24/AC-39. |
| Purchase pause with historical continuity | BDD-29; CR-19/CR-20. |
| Audit round 1 regression closure | I-01: transient 503 retains journal, confirmed rejection clears. I-02: independent late completion cannot restore forgotten ID. I-03: healthy line survives invalid sibling/explicit repair. I-04: CT-15. I-05: current untouched versus deliberate coverage updater. I-06: additional deduplicated batch impressions and duplicate-page suppression. |

### Acceptance scenario traceability

Use the detailed [approved AC definitions](./specs.md#12-acceptance-scenarios) and record each result independently, including each applicable variant.

| Approved scenarios | Planned evidence |
| --- | --- |
| AC-01, AC-36, AC-43 | BDD-01, BDD-23; RG-01; shell/source review and build. |
| AC-02, AC-03, AC-04, AC-37 | CT-01; NE-04; BDD-02, BDD-22. |
| AC-05, AC-06, AC-07, AC-08, AC-09 | CT-02; NE-03; BDD-03, BDD-04. |
| AC-10, AC-11, AC-12, AC-13, AC-14 | NE-02, NE-06; BDD-04, BDD-05, BDD-06; RG-02. |
| AC-15, AC-16, AC-17, AC-18, AC-19, AC-38 | CT-02, CT-03, CT-04, CT-05; NE-01, NE-02; BDD-07, BDD-08, BDD-09, BDD-10. |
| AC-20, AC-22, AC-23, AC-45 | CT-06; DB-02, DB-04, DB-05, DB-06, DB-09; NE-07; BDD-11, BDD-12, BDD-13. |
| AC-21, AC-24, AC-41 | CT-10; DB-01, DB-08; BDD-21; authorized staff observation. |
| AC-25, AC-26, AC-27, AC-48, AC-51 | CT-07; NE-05, NE-08; BDD-08, BDD-16, BDD-18. |
| AC-28, AC-39, AC-40 | CT-04, CT-08; DB-01, DB-03, DB-07, DB-10; Studio/source review; RG-03. |
| AC-29, AC-30, AC-42 | BDD-22; RG-05; existing SEO gate plus actual metadata/URL inspection. |
| AC-31, AC-32, AC-33, AC-34, AC-44, AC-52 | CT-09; DB-08; NE-09; BDD-19, BDD-20; actual telemetry/build/network evidence. |
| AC-35 | CT-04; DB-07; typed-line/source review and a synthetic common-contract fixture, not another active product type. |
| AC-46, AC-47, AC-49, AC-50 | DB-10; NE-06; BDD-14, BDD-15, BDD-17; RG-02. |

## 11. Evidence, execution order and exit criteria

### Result record

For each case/variant record: ID, related AC/requirement/CR task, app revision, environment/browser, synthetic setup, action, expected versus observed result, status, evidence location and blocker/defect owner. Keep sensitive request/database values in restricted local evidence, not a shared report.

- **Not run:** implemented path has not been exercised.
- **Pass:** observed outcome and required supporting evidence agree.
- **Fail:** an actual mismatch or side effect occurred; preserve the failure.
- **Blocked:** access, implementation, target, device or deterministic control is missing.

Script exit status, a screenshot count and a “PASSED” log do not override these definitions.

### Execution order

1. After refinement approval/implementation begins, CR-01 establishes current quality gates/baseline; CR-23 identifies actual permission, vendor, native-device and hard-case controls early. Do not create test tooling.
2. Verify connected contracts and actual Sanity invariants as CR-03 through CR-07 become available. Prove private access before handling customer data.
3. Exercise browser/cart/history/shell behavior as CR-08 through CR-14 are wired, using explicit real interactions instead of simulated script descriptions.
4. Verify handoff/claims/checkout integration in CR-15 through CR-17, including interruption and optional-address variants.
5. Complete CR-21 launch-data validation and CR-22's operator handoff, then legacy/SEO and every original/refinement witness in CR-18/CR-19. Independently inspect actual collector/container and native-device behavior.
6. CR-19 passes only when every required oracle has its expected witness. A blocked/failing/not-run required case leaves it incomplete; CR-20 receives passing evidence plus explicit known limits, not permission to hide a missing criterion. No live test order/deployment/third-party change is implied.

### Exit criteria

The owner accepted the baseline strategy; the current gate exits on review of this refined plan/test plan and its source-of-truth/closure rules. **No runtime tests need to be run merely to approve these documents.**

Later implementation acceptance requires passing evidence for all applicable original and refinement oracles, the business handoff and existing quality gates, with no unresolved required criterion. Native-device/vendor/database/control gaps keep the relevant task and CR-19 blocked; do not relabel them as passed, mark all tasks done or assign an unsupported coverage percentage. Documentation completeness here is not runtime verification.

Known limits stay explicit: at-most-once conversion permission can undercount after interruption, external notifications can have unknown delivery, localStorage is finite/browser-local and process-local rate limits are not distributed guarantees.

### Repository references

- [Current quality commands](../../package.json), [Studio commands](../../sanity/package.json), [Next build settings](../../next.config.js), [ESLint](../../.eslintrc.json), [TypeScript](../../tsconfig.json).
- [General browser regression](../../scripts/regression-test.sh), [lighter smoke](../../scripts/test-lighter-builder.sh), [quote-form regression and side effects](../../scripts/regression-test-quote-form.sh).
- [Existing SPX assertion runner](../../scripts/test-spx-sync.mjs), [SEO smoke](../../scripts/verify-seo.mjs), [manual Studio deploy workflow](../../.github/workflows/deploy-sanity.yml).
- [Browser skill](../../.agents/skills/agent-browser-automation/SKILL.md), [implementation responsibilities](./plan.md), [technical mechanisms/limits](./technical-design.md).
