# INUT Creativa — Technical Design

**SDD gate:** Technical design.
**Status:** Owner accepted the CMS flow and authorized runtime/UI integration with light theme/primary `#fd4d01` on 2026-10-23. The target mechanisms below now govern the implementation and its fresh audit; older verification is historical.
**Date:** 2026-10-22.
**Authority:** [Approved specification](./specs.md) and [approved idea](./idea.md).
**Boundary:** Architecture, data ownership, interfaces, algorithms, failure behavior and verification design. Delivered paths are evidenced by source and the final report, not by this design's existence alone.
**Refinement precedence:** Follow the plan's explicit Gap/Assumption/Over-engineering dispositions: canonical business-value digests, replay-safe local completion, nonblocking analytics, early evidence feasibility and an actual production handoff. These clarify implementation sufficiency without removing business requirements.

## CMS-first amendment — staged architecture

The earlier Studio-only stage is complete and accepted by the owner. [CM-03 through CM-08](./plan.md#cms-first-amendment-and-required-next-actions) now cover application integration and orange/light UI. No stored records or accepted orders are automatically migrated.

Current target: normalize model `code.current`; validate/render Portable Text and derive text SEO; fetch per-record fee settings and the sole active-primary bank; generate `creativa-quote-v2` with private production-path meaning but path-free public lines; retain old artwork/fit snapshots. Bank absence/ambiguity is a transfer-unavailable state, not permission to choose another account. Payment instructions are snapshotted, not reloaded from current configuration during accepted recovery.

Next integration must normalize model `code.current`, support Portable Text description rendering through existing tooling, remove obsolete product/model approval/artwork-field guards, and read fee/bank profiles by type rather than fixed singleton IDs. Production path metadata belongs in private staff snapshots/handoff, not public product/tracking/SEO/analytics projections; direct dataset permissions still need review. Existing stored artwork/fit/order snapshots must remain interpretable. A local path is neither an uploaded asset nor an immutable/versioned file.

The schema contracts below describe the new target. Runtime algorithms elsewhere in this document remain a baseline until adapted; do not treat their old verified-fit, artwork-version or shipping/bank singleton assumptions as current authorization to write new-format orders.

## 1. Design decisions

| Area | Selected mechanism |
| --- | --- |
| Application | Existing Next.js 12 pages router, React 18, MUI 5, Zustand, SWR and Sanity v2. No platform migration or new state library. |
| Storefront | Dedicated Creativa layout/light theme and copied/adapted header, footer, cart, checkout and tracking presentation. |
| Commerce domain | One typed Creativa cart/order pipeline; only `skin-laptop` is registered initially. Lighters stay unchanged. |
| Catalog | Separate public Creativa schemas, bounded cursor pagination, SSG/ISR entry pages and explicit client revalidation. |
| Pricing | Server-built quote from current published records; client-reviewed digest/amounts are compared again at acceptance. |
| Public order ID | Exactly 10 cryptographically random URL-safe characters; no prefix; permanent after acceptance. |
| Atomic acceptance | One Sanity transaction creates the order and public-ID lookup record and conditionally accepts a durable checkout intent. |
| Privacy | Non-root Sanity namespaces for orders, intents, lookup records and sales settings; no browser Sanity access to these records. |
| Recovery | A browser-held random checkout capability resolves/resumes its server-stored intent without persisting customer fields in browser storage. |
| Local shortcuts | Plain JSON string array at `inut-creativa-order-history`, no cap/TTL, independent of cart/recovery. |
| Sales handoff | Server-owned notification state with revision-guarded claims; explicit manual retry/reconciliation, no new queue. |
| Analytics | Creativa-specific sanitized event facade, explicit transport ownership and durable conversion claims with documented delivery limits. |

## 2. Existing foundations and change boundary

At design approval, the repository provided the following baseline. This historical comparison explains the change boundary; it does not describe the delivered Creativa layout as still sharing the root footer:

- [CreativaLayout](../../components/layout/creativa.tsx) already uses a Creativa header but still shares the root footer. Existing header components retain main-brand visual/link assumptions.
- [Lighter checkout](../../pages/checkout/lighters.tsx) provides the guest form, bank/COD UI and workflow. Its client-computed order body and lighter types are not the new server-authoritative contract.
- [Server order creation](../../api-client/sanity-server.ts) uses an idempotency-derived document ID and `createIfNotExists`; it does not implement the new short-ID uniqueness index, intent fingerprint or typed combined-order transaction.
- [Existing order reads](../../api-client/orders.ts) use browser Sanity queries. Creativa tracking must instead use a safe server projection; simply copying that query would not establish the required privacy boundary.
- [Infinite catalog](../../hooks/useInfiniteCatalog.ts) and [product queries](../../api-client/products.ts) provide prior art. Their offset pagination and request lifecycle need a Creativa-local cursor/generation implementation to satisfy the approved behavior.
- [Analytics](../../utils/analytics.ts) dispatches some actions through both `gtag` and custom data-layer objects and already calls Umami. [Global initialization](../../pages/_app.tsx), [tracker scripts](../../pages/_document.tsx) and [Google scripts](../../components/scripts/google-tag-manager.tsx) must be considered before adding more calls.

Do not change existing lighter schemas, storage keys, pricing tiers, API responses, references, SPX behavior or public routes. Shared-file edits are limited to route-aware integration, optional backwards-compatible SEO data and registration of new schemas.

### Source ownership

| Surface | Location/responsibility |
| --- | --- |
| Pure domain contracts | `models/creativa.ts`: discriminated line types, quotes, public views and error codes; no server imports. |
| Public catalog wrapper | `api-client/creativa-catalog.ts`: explicit public projections and parameterized catalog queries. |
| Browser API wrapper | `api-client/creativa-checkout.ts`: quote, submit, resolve and tracking HTTP calls; no CMS token. |
| Server adapter | `api-client/creativa-server.ts`: authenticated, non-CDN Sanity operations; never re-export from a browser barrel. |
| Domain helpers | `utils/creativa/`: validation, line identity, money, quote construction, order identity/transaction, shipping, history and analytics policy. Keep server-only helpers in explicit `*.server.ts` modules. |
| Browser hooks/state | `hooks/creativa/`, `store/cart/creativaCart.ts`: fetch/view lifecycles, cart hydration, checkout journal and local-history hook. |
| UI | `components/creativa/`: copied/adapted shell and purchase components; public pages remain thin. |
| Sanity | New files under `sanity/schemas/creativa/`, registered through the existing schema entry. |
| Verification | Existing repository quality gates plus contract, Sanity integration/database and browser/manual checks described in `test-plan.md`; no new unit-test tooling is required. |

These are bounded module responsibilities, not a requirement to create one file per small function or build a plugin framework.

## 3. Pages, shell and visual composition

### Route/file ownership

| Public route | Proposed page |
| --- | --- |
| `/creativa` | Update `pages/creativa/index.tsx`. |
| `/creativa/skin-laptop` | `pages/creativa/skin-laptop/index.tsx`. |
| `/creativa/skin-laptop/[slug]` | `pages/creativa/skin-laptop/[slug].tsx`. |
| `/creativa/cart` | `pages/creativa/cart.tsx`. |
| `/creativa/checkout` | `pages/creativa/checkout.tsx`. |
| `/creativa/order-tracking` | `pages/creativa/order-tracking/index.tsx`. |
| `/creativa/order-tracking/[slug]` | `pages/creativa/order-tracking/[slug].tsx`. |
| `/order-tracking` | Extend only Creativa selection/history handling in the existing page. |
| Guide index | `pages/creativa/skin-laptop/huong-dan-su-dung/index.tsx`, honest coming-soon content. |
| Reserved guide articles | If scaffolded now, an empty `getStaticPaths` with `fallback: false`; no published article URLs. Otherwise leave the family unimplemented and returning 404. |

All Creativa pages set `Page.Layout = CreativaLayout`. The scoped MUI light theme uses `primary.main = #fd4d01`, dark readable foreground on orange fills, darker-orange normal text/hover variants and light surfaces. It must not replace the main-brand theme. Mobile/desktop headers retain Creativa constants, home/search/cart routes and unit badge. No account/currency/case controls are copied.

The existing global [cart wrapper](../../components/cart/CartWrapper.tsx) only renders on lighter product routes; leave that condition intact. Creativa's badge belongs to its shell, not a second root floating cart.

Use the supplied [desktop product](./references/uniqfind-product-desktop.png), [mobile product](./references/uniqfind-product-mobile.png), [desktop catalog](./references/uniqfind-catalog-desktop.png) and [mobile catalog](./references/uniqfind-catalog-mobile.png) for composition, not their commercial features. Retain carousel/thumbnails/lightbox interactions; selectors never control imagery.

Mobile grid state is local to the catalog session, initialized to two columns. Switching to one column changes CSS layout only; it is not a search/reset key. Desktop uses responsive columns suitable for its available width. Controls have visible focus, accessible names, touch targets and selected/error feedback.

Product configuration initializes with no selected model, quantity 1 and the first active coverage in CMS order, initially Lưng. Cards show the minimum active coverage from-price; detail shows the selected option's exact price immediately. These are independent values, not a price swap hidden until submission.

## 4. Sanity storage and privacy

### 4.1 Dataset and namespaces

Use the existing configured project/dataset and API version `2022-09-19`; no SDK major upgrade or new dataset is required.

Sanity's [document-ID rules](https://www.sanity.io/docs/content-lake/ids) state that IDs containing a dot are outside the anonymously readable root path. Use that documented distinction deliberately:

| Data | ID convention | Access |
| --- | --- | --- |
| Published designs/models/coverages | Root IDs without dots. | Public projected commerce content. |
| Shipping configuration | Normal per-fee Sanity IDs, type `creativaShippingSettings`; no fixed singleton. | Explicit public fee/slug fields only. |
| Bank configuration | Normal per-profile Sanity IDs, type `creativaBankSettings`; no fixed singleton. | Explicit public payment fields only; internal notes excluded by the next adapter. |
| Sales destinations | `creativa.settings.sales`. | Authenticated server/Studio only. |
| Checkout intent | `creativa.intent.<sha256(capability)>`. | Authenticated server/Studio only. |
| Accepted order | `creativa.order.<randomUUID>`. | Authenticated server/Studio only. |
| Public-ID index | `creativa.lookup.<sha256(publicId)>`. | Authenticated server/Studio only. |

Do not use `drafts.` or `versions.` as application namespaces. Hash lookup/capability values before including them in internal IDs: Sanity retains document-ID history, and public lookup references should not themselves become internal path identifiers.

Verify unauthenticated direct fetches/queries against all private namespaces in the actual staging dataset before launch. Server projections alone are not sufficient if direct CMS reads can bypass them. Studio queries require authenticated permissions; no customer token is shipped.

### 4.2 Schema contracts

Only root document titles use **`Creative - `**. Fields, nested objects, option labels and subordinate lists are human-readable without that prefix. All Creativa registration/navigation follows the untouched legacy entries. Internal names remain:

| Schema | Key fields and constraints |
| --- | --- |
| `creativaSkinProduct` | Title `Creative - Skin laptop`; name, unique nonreserved slug, active default true, `blockContent` description, required absolute `printAssetPath`, ordered top/bottom/interior images with alt/view. Removed production/artwork/upload fields and their old root guards. |
| `creativaMacbookModel` | Name, native slug `code` generated from name, sort order and active. No `fitVerified`/`fitReference` or fit-flag activation validator; manual owner fit approval remains outside the schema. |
| `creativaSkinCoverage` | `code` in `top`, `bottom`, `interior`, `full`; `name`, `description`, `sortOrder`, `active`, safe integer VND `price`. Seed Lưng first; Full is independently priced. |
| `creativaShippingSettings` | Ordinary fee documents reusing the `shippingFee` editor definition: name, generated slug, nonnegative fee, note and existing preview/orderings. No singleton/rules array. Runtime default/region handling must be adapted next. |
| `creativaBankSettings` | Ordinary profiles based on `bankInfo`; exactly one profile may be both active and primary. Queries and independent server guards enforce that selection; duplicates/invalid/missing primary disable transfer, not COD. Internal notes never enter public DTOs. |
| `creativaSalesSettings` | Private singleton: active destinations/channel configuration; no browser projection. Bot credentials live in server environment. |
| `creativaCheckoutIntent` | Private internal record: fingerprint, immutable canonical submitted request while pending, state, eventual order reference, revision-guarded transition/error summary. |
| `creativaOrder` | Private accepted snapshot: public ID, analytics ID, timestamp, typed lines, customer/optional delivery data, money, operational/payment state, notification state and analytics-claim receipts. |
| `creativaOrderLookup` | Private, server-created mapping from public-ID digest to one strong order reference. |
| Embedded typed objects | Skin selection/snapshot, image metadata, shipping rule/snapshot, notification receipt and analytics receipt. Every written array item has a unique `_key`. |

The intent and lookup schemas are technical support records, not extra customer/order categories. Hide them from normal content creation and mark server-managed fields read-only. Orders are server-created; expose only operational/payment/manual tracking edits to staff. Hide create/duplicate/delete actions for orders/support records using Sanity v2 document-action configuration.

Studio validation improves authoring but is not a server enforcement boundary. Next API adaptation must independently validate the amended types/ownership/arithmetic/active records without requiring the removed fit/product flags. Shipping/bank have ordinary authoring actions; private sales/order/intent/lookup protections remain.

### 4.3 Historical meaning

Existing orders retain their original artwork/version/asset/fit snapshots without rewriting them. New-format snapshots must instead retain agreed product/model/coverage identity/display, the private production path, relevant source revisions, quantities and amounts. CM-05 must update quote/snapshot/Studio readback compatibly before acceptance of new-format records. CR-21/CR-22 still require staff to locate the correct physical files/template; the path field cannot prove existence or prevent file replacement.

Preserve old references/assets and snapshots needed by accepted orders. For the new filesystem flow, document the operator's retained-file/version process rather than claiming Sanity copied/versioned the file. Tracking never substitutes current labels/prices/paths for an accepted snapshot. Private paths must not appear in public tracking.

## 5. Domain types and extension boundary

The following is a contract sketch, not application code:

```ts
type SkinSelection = {
  modelId: string;
  coverageId: string;
};

type SkinPurchaseLine = {
  productType: "skin-laptop";
  productId: string;
  selection: SkinSelection;
  quantity: number;
};

type CreativaPurchaseLine = SkinPurchaseLine;

type CheckoutCustomer = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
};

type CheckoutRequest = {
  lines: CreativaPurchaseLine[];
  customer: CheckoutCustomer;
  paymentMethod: "cod" | "bank_transfer";
  reviewedQuote: {
    digest: string;
    merchandiseTotal: number;
    shippingFee: number;
    finalAmount: number;
  };
};
```

Additional validated types cover cart presentation/quantity lots, quote lines, accepted snapshots, safe tracking views and API errors. They are not one permissive object with every future field optional.

For launch, validation and rendering use an exhaustive `productType` branch for `skin-laptop`. A future category adds a discriminated union member plus its validation/price/snapshot/presentation branch. The common cart, order, form, storage and route contracts stay unchanged. Do not build dynamic schema execution, arbitrary attributes or a third-party plugin registry.

Skin identity is an unambiguous serialization of `[productType, productId, modelId, coverageId]`; never concatenate ambiguous unescaped identifiers. Use that identity for merging, and independent random stable keys for cart instances and order-array items.

All amounts and quantities pass `Number.isSafeInteger` checks. Quantities are positive; merchandise prices are valid configured integers and cannot become zero through an error fallback; shipping may deliberately be zero. Detect overflow before accepting multiplication/sums.

## 6. Catalog, configuration and rendering reads

### Public queries

The adapter uses explicit server-side source reads excluding drafts/inactive records and obsolete approval/artwork predicates. It validates path metadata internally, then builds public product DTOs without that field. List responses retain only two card images/identity/cursor; detail adds gallery/validated Portable Text. Normalize model slug codes for public options. Internal source reads are not browser DTOs and do not make a public Sanity field private; direct dataset visibility still needs its separate review.

Order catalog results by `_createdAt desc, _id desc`. The first page has 24 records. Subsequent cursors encode the last timestamp/ID and normalized-query identity; validate the cursor server-side and fetch strictly after that pair. Bind cursors to the current search. This avoids offset drift from newly inserted designs and equal-date ties; live removal/activation still requires deduplication by product ID.

Search trims input and performs case-insensitive design-name matching with GROQ parameters, escaping wildcard syntax rather than interpolating user text. Use a bounded search length matching the existing 80-character convention and expose the limit in the UI. Changing search increments a request generation, cancels obsolete requests where possible and ignores results from older generations.

A Creativa-local catalog hook follows the existing observer/retry pattern but uses cursors and request generations. Failures retain previous cards; do not convert failed reads into empty lists or zero counts.

### Entry pages and cache policy

- Catalog/product entry pages use existing SSG conventions; initial catalog reads are bounded. Product paths use blocking generation rather than requiring all products at build time.
- Use an initial ISR revalidation interval of 60 seconds. This is a refresh target, not a freshness guarantee when regeneration fails.
- Revalidate public product/options/configuration through the same-origin API on mount/focus and before purchase steps. Cached markup may show older information; errors disable affected purchase actions and surface an explanation.
- Quote/order evaluation uses authenticated, `useCdn: false` direct document reads for supplied product/option/configuration IDs. Do not use a CDN catalog result as acceptance authority.
- Metadata derives from the same valid product/coverage view: accurate from-price and no invented ratings/material/policy claims.
- Use existing `sanityImageUrl` `card`, `thumbnail`, `hero` and `seo` presets; prioritize the leading image, lazy-load secondary media and reserve image dimensions. Do not alter the site's global image configuration merely for this feature.

## 7. Quote, shipping and API contracts

### 7.1 Same-origin API surface

| Endpoint | Input | Result / authority |
| --- | --- | --- |
| `GET /api/creativa/catalog` | Query, optional cursor. | Bounded public cards, cursor, options-derived from-price; no private data. |
| `GET /api/creativa/products/[slug]` | Readable product slug. | Current public product/options state or proper not-found/error. |
| `GET /api/creativa/options` | None. | Active ordered model/coverage options and safe public payment availability. |
| `POST /api/creativa/quote` | Typed lines, optional address, payment method. | Canonical line identities/amounts, shipping and quote digest; no order creation. |
| `POST /api/creativa/orders` | Canonical `CheckoutRequest`; `Idempotency-Key`. | Accepted checkout response, replay, actionable rejection or unresolved service error. |
| `POST /api/creativa/orders/resolve` | The original random checkout capability in body. | Resolve/resume that intent only; never search by customer data. |
| `GET /api/creativa/orders/[publicId]` | Valid public ID. | Minimal no-cache tracking view only. |
| `POST /api/creativa/orders/analytics-claim` | Checkout capability, allowed destination/event key. | Atomic non-sensitive conversion payload claim, or already claimed/disabled outcome. |

Keep wrappers in `api-client/*`; React code never imports the authenticated client. Validate Origin for mutation requests against configured site/development origins. Retain Next's bounded body handling and report oversized payloads explicitly.

Return a typed envelope: success with data, or error with allowlisted `code`, localized user message, optional field/line errors and safe current quote when review is needed. Suggested status mapping:

| Status | Meaning |
| --- | --- |
| 200 / 201 | Recovered/accepted intent, ordinary read or newly accepted order. `created` is explicit, not inferred from navigation. |
| 400 / 422 | Invalid syntax/body, fields, quantities, types, selections or configuration. |
| 404 | Product/order not found; distinguish from service failure. Recovery does not treat an absent intent as permission to create another purchase. |
| 409 | `QUOTE_CHANGED`, `ITEM_UNAVAILABLE`, `INTENT_CONFLICT` or terminal rejected intent, including confirmed `INTENT_NOT_BOUND`; provide appropriate recovery information. |
| 413 / 429 | Oversized input or rate limit; preserve client state and honor retry guidance. |
| 503 | CMS/configuration/allocation temporarily unavailable or acceptance outcome cannot yet be resolved. Retry/resolve the same capability. |

All checkout/order responses and tracking responses use `Cache-Control: no-store`; never send secrets in query strings, exception messages or response diagnostics. Error `terminal: true` is emitted only after an intent is durably rejected; the browser does not infer rejection from a configuration code or 5xx response.

### 7.2 Quote evaluation

1. Parse/validate typed lines and merge identical configurations deterministically. Reject unknown types and empty orders.
2. After CM adaptation, read published product/model/coverage records and validate type, active state, model slug and domain membership without removed approval/fit fields. Physical fit is an operator responsibility.
3. Compute each skin line from the selected coverage's shared price. Full reads its own 310,000 VND seed value; it never sums the other prices.
4. Adapt reads to independent fee/bank profile records. Normalize only the address for matching; map fee slugs and bank active/primary/display-order fields explicitly. No fixed singleton read or main-brand fallback.
5. Preserve regional/default behavior using the intended `da-nang`/`toan-quoc` fee slugs and deterministic selection. Verify the actual configured records during CM-04; missing valid default configuration is an error, not arbitrary query-order/free delivery. The CMS-only change does not seed these records.
6. Optional blank address is valid and receives the displayed default fee. Do not claim shipping information is complete. Apply one fee to the combined order.
7. Bank transfer requires the sole valid active-primary Creativa profile. Normalize its holder to the stable accepted `accountName` field and retain optional QR/logo/public bank metadata; never substitute another active profile or internal notes. Save the accepted snapshot and suppress instructions for paid/refunded/cancelled orders.
8. Build an immutable quote with safe-integer totals and selected commercial/production meaning. Compute `digest = SHA256(canonicalQuote)` with CR-02's versioned field ordering; the digest is a change detector, not an authorization token. Store source revisions for audit separately. Exclude generated time, request IDs, analytics IDs and harmless display-only/revision changes from the digest.

On submit, independently repeat evaluation and compare the reviewed digest/amounts. A changed price, fee, selected-payment availability or production meaning requires review before a new submission. A harmless cosmetic/source-revision edit alone must not create a false quote conflict. Audit revisions do not replace validation of current business values.

The authoritative snapshot is the server's successful validation read. Catalog edits after that evaluation apply to subsequent evaluations, not retroactively to an accepted snapshot. No financial field supplied by the client becomes authoritative merely because it was included in a digest.

Name and exactly 10 ASCII phone digits are required; email/address/note remain optional. Use the same pure validator on client and server. Preserve leading zeroes. Do not call the Vietnamese-prefix/+84 normalization or Zalo-registration logic for this checkout.

## 8. Short IDs and atomic order acceptance

### 8.1 Independent identities

| Identity | Generation/use | Exposure |
| --- | --- | --- |
| Public ID | Ten secure random characters from `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-`; validate `^[A-Za-z0-9_-]{10}$`. | Confirmation, history, tracking path, copy actions. |
| Internal order ID | Private namespace plus Node `randomUUID()`. | Server/Studio only. |
| Checkout capability | Browser secure random 32-byte base64url value, exactly 43 characters; validate `^[A-Za-z0-9_-]{43}$` and use as idempotency key. | Request header/body and private local recovery journal only. |
| Intent fingerprint | SHA-256 of a stable, versioned canonical submitted request. | Private server state; no analytics. |
| Analytics transaction ID | Independent server random UUID. | Authorized conversion payload only; never usable for lookup. |

Public characters can be produced uniformly from secure random bytes by indexing the 64-character alphabet with `byte & 63`; 256 divides evenly by 64. Do not use `Math.random`, timestamps or a base64 slice with undocumented entropy. The complete public ID is exactly ten characters, including any `_` or `-`, and is case-sensitive.

### 8.2 Durable intent state

States are `pending`, `accepted`, `rejected`; transitions out of accepted/rejected are prohibited. Keep customer/quote request data private while pending, enabling recovery without putting those fields in localStorage. On terminal transition, remove the duplicate pending customer request body; accepted data belongs in the order, rejected state retains only safe rejection/quote metadata and fingerprint. The unbound-resolution tombstone described below is the sole rejected form without a submitted-request fingerprint.

Retain terminal identity/fingerprint barriers and accepted public-ID mappings; do not apply an automatic TTL that lets an old capability create another order later. Administrative abandonment of a pending intent is a revision-guarded terminal rejection, not document deletion. Support-record delete actions remain disabled.

On a valid submission, create the private intent with `createIfNotExists` at its capability-derived ID, then read it directly. A pre-binding tombstone returns its terminal rejection without binding the late request. For originally bound intents, compare fingerprints before doing anything else:

- Different request on the same capability: conflict; never overwrite intent data.
- Accepted: return its accepted snapshot without revalidating today's catalog/prices.
- Rejected: return its terminal rejection; a refreshed, customer-approved purchase uses a new capability.
- Pending: resume the original immutable request.

`resolve` requires the capability and can resume a bound pending intent using its stored request. No customer re-entry is needed after a response loss.

If an explicit resolution arrives before the original request bound an intent, atomically `createIfNotExists` a terminal rejected tombstone at the same capability-derived ID, with reason `INTENT_NOT_BOUND`. Then read the winning record. If the original binding won, resume it; if the tombstone won, a delayed original submit must observe that terminal rejection and cannot create an order. Read/commit ambiguity returns unresolved, not permission to use a new capability.

Only after a terminal rejection is confirmed may the customer review/re-enter checkout and submit a new capability. This closes the interrupted-before-binding race without storing customer fields locally or assuming that an absent query result proves the original request can never arrive.

### 8.3 Transaction

For a pending intent:

1. Evaluate the original request and compare its reviewed quote. Reject terminally through a revision-guarded intent patch if invalid/changed, or proceed.
2. Allocate a candidate public ID and independent internal/analytics IDs.
3. Submit one Sanity transaction containing **create** order, **create** public-ID lookup record and an intent patch guarded by the pending `_rev`, setting accepted order reference and clearing pending request data.
4. Use `visibility: "sync"` and direct document reads for acceptance/recovery; do not rely on a GROQ search becoming immediately consistent.
5. If another request accepted/rejected the intent first, the guarded transaction fails atomically. Reload the intent and return its terminal result.
6. If only the candidate lookup ID collided, retry allocation up to five candidates. Never use `createIfNotExists` for the order/index pair: an existing unrelated lookup must abort, not be mistaken for successful creation.
7. On transport ambiguity, resolve the intent using the same capability. Do not classify a timeout as definite rejection or expose a new order ID before acceptance is known.

Sanity [transactions](https://www.sanity.io/docs/content-lake/transactions) provide all-or-nothing mutations, unique document IDs and revision guards. This establishes one complete order, one lookup and one terminal intent, including concurrent retries. Concurrent rejection versus acceptance is resolved by the same intent revision guard.

The order starts `pending` / `pending`, stores all typed production/financial snapshots with unique array keys and remains distinct from `ordersLighter`. Publication of another product type does not create a new order schema or ID format.

## 9. Cart hydration, cleanup and checkout recovery

### Cart

Use Zustand's existing persistence pattern with versioned payload at `inut-creativa-cart`; do not reuse its lighter domain model. Validate entries individually: retain healthy lines, quarantine invalid/unknown rows and block checkout until explicit invalid-only repair. An entirely unreadable container has a separate explicit-reset path. Never overwrite unread corruption with a default empty success.

Each displayed configuration line has a stable instance ID and quantity contributions with random contribution IDs. New additions merge visually but retain their contribution identity. At submit, capture/reserve the exact submitted contributions/quantities. While outcome is unknown, block editing/removal of reserved quantities, but allow unrelated/new additions. This is the minimum ledger needed for accepted cleanup, not a generic reservation/stock or replicated-cart engine.

After acceptance, remove only the submitted contribution quantities. Newly added quantities, including additions of the same configuration, survive. A removed/re-added instance must not be confused with the old instance. Release reservations after known rejection. Reconcile against the latest persisted cart; ambiguous/corrupt reconciliation produces a notice instead of deleting unrelated data.

These internal quantity markers implement the approved concurrent-cleanup requirement; they are not stock reservations, server inventory or separate order lines.

### Recovery journal

Use a separate local key `inut-creativa-checkout-attempt` for the current unresolved/locally unreconciled attempt: capability, submitted contribution identities/quantities and completion flags. Do not persist customer input, full order payload or raw analytics data there. The immutable request lives only in memory and the private server intent.

Before network submission, preserve the capability/journal. Do not knowingly overwrite a recognized unresolved attempt with another checkout; lock the submitted customer/payment/configuration intent until resolved. This is not semantic deduplication across unrelated capabilities/devices.

On reload with a journal, resolve first; do not redirect to empty checkout before hydration/recovery. Known acceptance uses one replay-safe local completion path:

1. Display/retain the accepted public ID and safe order view immediately.
2. Reconcile only the submitted contribution identities with repeat-safe checkpoints. Repeating a previously applied cleanup is a no-op, not another quantity subtraction.
3. Handle history remembering/warnings independently and record that handling separately. Once handled/dismissed, a delayed callback does not resurrect an ID subsequently forgotten by the customer.
4. Navigate/show generic order detail without waiting for claim/provider availability. Required cart/history failures remain visible as local recovery limitations; they do not undo server acceptance.
5. Dispatch permitted conversion work separately using accepted context. Do not retain/replay cart/history solely to wait for metrics or future consent; never emit purchase from an ordinary public tracking render.

The completion ledger distinguishes critical local reconciliation from ancillary measurement. Browser keys are not an atomic transaction: denied checkpoint writes require a visible limitation, not an exactly-once local-storage claim. CR-08/CR-17 must prove the interruption windows in DB-11/BDD-25 of the refined test plan.

An accepted callback first checks the current shared attempt rather than trusting captured flags. A missing/replaced/completed journal cannot be recreated by a delayed component merely to repeat local side effects. Volatile fallback is reserved for a never-persisted live-tab attempt, not an already-cleared persisted journal.

Local-storage failure must not reclassify a server-accepted order. Fall back to in-memory capability during the live tab, show a storage/recovery limitation and keep copy actions available. Do not promise reload/tab-close recovery when the browser refused to retain the capability.

A journal without a bound server intent uses the tombstone resolution in section 8. Once that terminal rejection is confirmed, preserve cart contents, explain that no order was accepted and let the customer re-enter/review checkout. If resolution itself is unavailable, retain the journal and offer retry; do not silently start another intent.

## 10. Local order history and tracking UX

### Storage contract

`inut-creativa-order-history` contains exactly a JSON array such as `["q7Km_2xP9a", "B8n_4Kx2pQ"]`, not a Zustand envelope. No cap, timestamp, TTL, status or customer data is stored in this array.

Provide pure/result-returning `readHistory`, `rememberAcceptedId`, `removeHistoryId` and `clearHistory` helpers, plus a client hook. Guard `window`/storage access. Parse shape, validate ID syntax, deduplicate in first-seen order and report corruption without unprompted destructive rewriting. Valid entries remain usable when individual entries are invalid; wholesale malformed JSON needs an explicit reset action.

Append by reading the latest valid array, prepending only a previously unseen accepted ID, then writing. Repeated accepted recovery leaves an existing ID's relative position unchanged. Only checkout acceptance/recovery calls this helper. Direct/shared detail visits, searches and tag clicks never append.

The completion ledger calls this only while that accepted attempt's history handling is unfinished. Explicit forgetting after handling finished takes precedence over a delayed repeat completion; do not introduce a separate permanent history tombstone store to achieve it.

Each mutation reads current storage rather than a stale React snapshot. Observe `storage`/focus events to refresh another tab's changes. LocalStorage does not offer atomic compare-and-swap; concurrent cross-tab mutations are best effort, not cloud synchronization. Avoid re-merging stale arrays after explicit clear/removal. Surface failed writes without deleting the previous saved value.

### Presentation

- Reuse one `RecentCreativaOrders` component below the input on both search pages.
- Label it as saved orders in this browser; show IDs as accessible tags, with individual forget controls and clear-history confirmation.
- Render an initial batch of 20 tags with accessible “show more” increments. This is a rendering batch only: every saved ID remains reachable and storage has no cap.
- One tag activation emits one lookup-intent event with `lookup_source=history`, then opens `/creativa/order-tracking/<id>`. On root search, no extra dropdown/submit step is required.
- Remove-button events stop propagation so forgetting an ID does not open it.
- Never prefetch all saved order details or imply ownership/status from local possession. A not-found ID stays removable, not automatically pruned.
- Empty valid history, loading history and storage corruption/blocking are distinct states. Explain same-browser/shared-device visibility and browser-clearing limitations.

### Public tracking projection

Validate/trim without case-folding. Hash the public ID, read the private lookup document, then its order directly. Return only public ID/date, order/payment status, immutable display line snapshots, amounts, optional manual carrier reference, safe bank instructions and masked minimal customer context. Exclude internal IDs, customer note/address/email/phone values, admin notes, receipts, capabilities and sales configuration. The live checkout can display its own already-entered fields without widening the public response.

Use no-store responses, reference-free titles/metadata and `noindex`. Include copy-ID/copy-link controls with success only after clipboard confirmation and selectable fallback on failure. Fresh-checkout success styling is a transient client acceptance signal, not a query parameter that creates another purchase.

The root manual form maps its selected domain explicitly: Lighters retains its existing validator/path; Skin Laptop uses the Creativa validator/path. Random public IDs never determine a product category or domain by prefix.

## 11. Sales notification and operational recovery

Use a dedicated server environment variable `CREATIVA_TELEGRAM_BOT_TOKEN` and the private Creativa sales settings for recipients. Do not copy browser-facing notification credentials or use the main-brand destination as a fallback. Document the variable in `.env.example` only during implementation; never write secrets into source/Studio/browser props.

Accepted orders contain notification state `pending`, `dispatching`, `sent`, `failed` or `unknown`, plus per-destination safe attempt metadata. The creator/authorized resolver claims pending delivery with a revision-guarded patch and a random dispatch nonce. Only its owner sends. Replays seeing sent/dispatching do not routinely send again.

Invoke the existing Telegram transport server-side with a Creativa-specific formatter, escaping all user text for the chosen format. Read the saved order, not client notification bodies. Bound the HTTP timeout/request budget; do not launch an unawaited serverless background promise.

Persist sent/message identity on known success. Known rejection is failed; a network timeout/crash after possible delivery is unknown. An accepted checkout remains accepted in all cases. Do not automatically retry uncertain delivery as though it were definitely not sent.

Valid input can exceed one provider message. Split complete escaped content into bounded Unicode/entity-safe parts and persist per-part progress within the destination receipt. Known sent parts are skipped on replay; failed/deferred parts can progress in another bounded invocation, and uncertain parts require explicit operator acknowledgment. Current send budget is at most four sends and 15 seconds per invocation; actual hosting duration remains a deployment verification prerequisite, not an assumed guarantee.

Staff can filter failed/unknown/stale-dispatching states in authenticated Studio. A proposed `scripts/retry-creativa-notification.mjs` uses server credentials and the same claim routine; unknown delivery needs explicit operator reconciliation/confirmation before retry. No public “send arbitrary order notification” API, queue or new cron service is introduced.

Retain manual operational/payment editing and optional carrier reference only. Do not promise customer email/SMS or abandoned-contact campaigns, and do not activate SPX synchronization for Creativa.

## 12. Analytics transport, conversion claims and privacy

### 12.1 Event facade

Create `utils/creativa/analytics.ts` with the approved event names/mappings and allowlisted property types. Use `storefront=creativa`, product type and stable catalog identifiers; only skin items carry model/coverage. No raw search terms, public IDs, history arrays, customer fields, idempotency capabilities or arbitrary exception objects are accepted by its interfaces.

For Creativa commerce/custom actions choose **one direct GA4 dispatch through the existing guarded `gtag` primitive**, plus one Umami dispatch. Do not call legacy combined helpers and then separately call Umami, or also push the same custom ecommerce object for a GTM tag to resend. Root event names/paths keep their existing branches.

Preserve `view_item`/`product_view` and `select_item`/`product_click` mappings. Use user-action sources and stable lifecycle IDs: catalog query-generation/batch/product impressions, product route visit, hydrated cart view and checkout attempt. Layout rerenders, initial defaults, autoplay and fee rerenders do not create false actions.

GA4 purchase `value` is merchandise total, with shipping separate. Umami receives merchandise/shipping/final fields, one aggregate `purchase` and non-conversion `purchase_item` companions. Provider payload limits are enforced through bounded scalar/item representations rather than silently dropping product-type context. Validate representability before a conversion claim; if a provider cannot represent the accepted payload under its verified limits, leave that destination unclaimed, record a safe diagnostic and keep the accepted checkout successful. Do not split one purchase into multiple revenue events merely to bypass a transport limit.

### 12.2 Durable conversion claims

Only the live accepted/recovered checkout capability may request conversion claims. Public tracking lookup never supplies the analytics ID or claims a conversion.

Store per-destination/per-event receipts on the private accepted order. Claim with revision guards before dispatch: one GA4 purchase, one Umami purchase and each Umami item companion have stable event keys. Parallel effects/tabs/retries cannot acquire the same event twice.

Claim only when the destination is enabled/allowed and its transport is available. Dispatch from the saved accepted snapshot, independently of required confirmation navigation/local reconciliation. A hung/failed claim never keeps the customer waiting on a known accepted order. Do not use the current cart or make an extra claim merely by opening history/tracking.

This is durable **at-most-once dispatch permission**, not exactly-once external delivery. A browser crash after claiming but before transmission can undercount; an interrupted provider response is not safely distinguishable from receipt. Do not silently unclaim/replay uncertain events. Document this limit alongside analytics diagnostics; there is no new analytics queue or server measurement service.

### 12.3 Automatic URL capture

Custom-event sanitization alone is insufficient. Introduce one pure URL/title/referrer policy that converts order detail to `/creativa/order-tracking/[id]`, strips non-allowlisted query/hash values and removes raw search/reference values before any telemetry send. Normalized page context must not reuse the browser's raw `location.href`.

Specific integrations:

1. `_app.tsx`: branch Creativa page/engagement reporting through the safe facade with one route-completion lifecycle, not an effect that repeats initial view when `router.pathname` changes. Root dispatch retains its existing branch.
2. Google initialization: supply sanitized `page_location`, `page_path` and `page_referrer`; suppress duplicate initialization page views for the Creativa branch. GTM must not resend its direct GA4 ecommerce events.
3. GA4/GTM workspace configuration: add Creativa exclusions/guards for automatic history/page/commerce triggers that bypass the facade. Verify enhanced-measurement and third-party tags do not independently capture raw lookup URLs. This is a deployment prerequisite requiring real container/network inspection, not something proven by editing a helper.
4. Umami: install a named `window` `data-before-send` hook **before** the script loads; sanitize `url`, `referrer`, title and properties for Creativa context, including default URL context on custom events. Keep Umami automatic tracking as the sole Creativa Umami page-view owner; the new Creativa branch must not additionally call the legacy manual Umami page-view helper.
5. Vercel analytics and other globally mounted collectors: use supported pre-send filtering to suppress sensitive Creativa transaction URLs, or omit that collector from those routes if the installed API cannot safely filter. Verify already-loaded SPA navigation behavior too; conditional rendering alone may be insufficient.
6. Scope reference-free/no-referrer handling to transaction pages and their responses; keep lookup metadata generic. Do not rely on sanitizing event fields while another tracker or outgoing referrer leaks the same reference.

Umami's [documented before-send hook](https://docs.umami.is/docs/tracker-configuration) can modify/cancel payloads and must exist before initialization. The actual hosted tracker/container versions and Vercel hook signature must be verified during implementation; do not assert privacy/deduplication based on assumed vendor settings.

Respect existing consent/enabled-tracker policy. Do not add identification/fingerprinting or clear consent/preferences alongside cart/history. A blocked tracker never blocks ordering.

## 13. SEO, legacy surfaces and release safety

Use existing `Seo` support for `noindex`/canonical metadata. If adding a `siteName` option for Creativa, default it to the current main-brand value so existing consumers are unchanged. Order titles/descriptions/social previews contain no reference/customer data; generic tracking-search metadata is sufficient.

Exclude Creativa cart, checkout and the entire order-tracking family from sitemap generation. Retain noindex response/page controls; robots exclusion alone is not an authorization mechanism. Guide placeholders do not create fake article sitemap entries.

Review legacy index/detail CTAs and embedded customization cards in both skin families. Ordering actions enter `/creativa/skin-laptop`; support remains distinguishable. Preserve existing page content/URLs/indexability and separate service-page destinations outside these catalog surfaces. Do not invent per-artwork redirects or canonicalize all legacy pages to Creativa.

Rate-limit catalog/quote/create/recovery/lookup endpoints with request-specific tokens, not a shared constant. Use the existing LRU dependency and request-token helper with a Next-compatible adapter rather than unsafe response casts. Initial limits: 60 quotes, 10 submit/resolve attempts and 30 lookups per minute per trusted client token; return retry guidance. Process-local counters are not a distributed guarantee: verify trusted proxy identity and applicable host/edge protections before launch, with no claim that a new Redis/service was introduced.

Logs use safe error categories, correlation IDs and internal operational context, not request bodies, capabilities, full public lookup URLs or customer/contact values. Restrict hosting access-log/telemetry retention for lookup paths as part of deployment review.

## 14. Verification and requirement traceability

Use the approved [acceptance scenarios](./specs.md#12-acceptance-scenarios) as the implementation acceptance source. This document does not claim that implementation tests or browser verification have run.

| Design mechanism | Specification coverage |
| --- | --- |
| Dedicated shell, route ownership and scoped light UI | BRAND-01, BRAND-02, BRAND-03, ROUTE-01, ROUTE-02, UX-01, UX-02, UX-03, UX-04 |
| Public catalog/cursor/query-generation reads | CAT-01, CAT-02, CAT-03, CAT-04, CAT-05, CAT-06, CAT-07 |
| Product/gallery/options, type and quantity guards | PDP-01, PDP-02, PDP-03, PDP-04, PDP-05, PDP-06, PDP-07, PDP-08, MODEL-01, MODEL-02 |
| Quote computation, configuration reads and review comparison | PRICE-01, PRICE-02, PRICE-03, PRICE-04, PRICE-05, PRICE-06 |
| Persisted typed cart, contributions and hydration/reconciliation | CART-01, CART-02, CART-03, CART-04, CART-05, CART-06, CART-07, CART-08, EXT-01, EXT-02, EXT-03 |
| Guest validator, default shipping and payment availability | CHECKOUT-01, CHECKOUT-02, CHECKOUT-03, CHECKOUT-04, CHECKOUT-05, CHECKOUT-06, CHECKOUT-07 |
| Intent/transaction/recovery and immutable order snapshots | ORDER-01, ORDER-02, ORDER-03, ORDER-04, ORDER-05, ORDER-06, ORDER-07, ORDER-08, ORDER-09 |
| Secure public ID and atomic private lookup index | ORDER-10, ORDER-11, ORDER-12 |
| Durable notification claim and manual operations | OPS-01, OPS-02, OPS-03, OPS-04, OPS-05 |
| Generic lookup projection, manual/root mapping and copy controls | TRACK-01, TRACK-02, TRACK-03, TRACK-04, TRACK-05, TRACK-06, TRACK-07, TRACK-08, TRACK-09 |
| Plain history array, recent tags, mutation/error/privacy behavior | HISTORY-01, HISTORY-02, HISTORY-03, HISTORY-04, HISTORY-05, HISTORY-06, HISTORY-07, HISTORY-08, HISTORY-09, HISTORY-10 |
| Independent schemas/private namespace and historical retention | CMS-01, CMS-02, CMS-03, CMS-04, CMS-05, CMS-06 |
| Metadata, sitemap, CTA continuity and honest placeholders | SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, GUIDE-01, GUIDE-02 |
| Facade, payload/context mappings and transport ownership | AN-01, AN-02, AN-03, AN-04, AN-05 |
| Durable conversion claims and URL/history privacy policy | AN-06, AN-07, AN-08, AN-09, AN-10, AN-11 |
| Existing stack/domain isolation, explicit errors and safe release checks | NFR-01, NFR-02, NFR-03, NFR-04, NFR-05, NFR-06 |

Verification layers:

- Pure/helper cases: validation, safe money, seeded coverage/from-price, optional-address default fee, canonical line/fingerprint identity, short-ID format and history parsing/mutations.
- Sanity integration with an authorized fixture: forced public-ID collision, concurrent acceptance/rejection/replay, lost commit response, direct-document recovery, private anonymous-read denial, snapshot retention and notification/analytics claim races.
- Browser flows: mobile one/two-column state, selectors/gallery, both carts populated, reload hydration, storage blocked/corrupt/full, uncapped history beyond 50 IDs, root tag click while Lighters selected, clipboard rejection, stale saved ID and pending-checkout recovery.
- Telemetry network evidence: direct load and SPA entry/exit of lookup routes, delayed tracker initialization, retries/back/reload, automatic and custom payloads, GTM duplicate inspection, no public references/customer/history leakage and documented interrupted-dispatch loss behavior.
- Existing scoped regression checks, `pnpm lint`, runtime `pnpm build` and authorized-data browser QA. Do not create production orders or run unrelated broad suites merely to validate this documentation.

## 15. Known limits, prerequisites and next gate

| Item | Treatment |
| --- | --- |
| Exact MacBook/Interior production compatibility | Owner-approved fit/content before activation; screenshot labels are not authority. |
| Shipping/bank/recipient values and brand wording | Independent owner configuration before production acceptance. |
| Private namespace enforcement | Verify against actual project permissions and Studio before customer data is written. |
| External tracker/container behavior | Required real-container/version/network review before declaring telemetry safe; no credentials/container access was assumed here. |
| Conversion delivery | At-most-once permission can undercount after interruption; no exactly-once external guarantee. |
| Notification ambiguity | Unknown external delivery needs reconciliation; no blind repeated send. |
| Browser history | No application cap/TTL; finite quota and cross-tab races remain browser limitations. |
| Storage-disabled checkout | Live-tab fallback works; persistent recovery/history cannot be promised. |
| Unbound interrupted checkout | Resolve via a terminal tombstone/intent binding race; permit a new reviewed attempt only after rejection is confirmed. |
| Public reference access | Reference is a lookup capability, not customer authentication. Short IDs require masking, rate/abuse controls and careful sharing/logging. |
| Cache/concurrent CMS edits | Cached views may be stale; server validation defines the accepted snapshot, not retroactive catalog reads. |

**Gate outcome:** Design, plan, test strategy and refinement were approved; the owner subsequently authorized implementation/commits/publication on `feat/creativa`. The revised plan governs exits and [final-verification.md](./final-verification.md) records actual results. Production deployment, data activation, real orders and third-party changes still require separate authorization.

### Evidence and authoritative references

- [Project manifest](../../package.json), [Studio manifest](../../sanity/package.json), [schema registration](../../sanity/schemas/schema.js).
- [Server Sanity client/order write](../../api-client/sanity-server.ts), [public client](../../api-client/sanity-browser.ts), [current public order adapter](../../api-client/orders.ts).
- [Lighter cart](../../store/cart/lightersCart.ts), [checkout](../../pages/checkout/lighters.tsx), [mutation hook](../../hooks/useCreateLighterOrder.ts), [root tracking](../../pages/order-tracking/index.tsx).
- [Catalog wrapper](../../api-client/products.ts), [infinite hook](../../hooks/useInfiniteCatalog.ts), [image presets](../../api-client/sanity-image.ts), [Creativa layout](../../components/layout/creativa.tsx).
- [Telegram transport](../../utils/telegram/index.ts), [notification route](../../pages/api/telegram/send-order-notification.ts), [rate helper](../../utils/rateLimit.ts).
- [App integration](../../pages/_app.tsx), [document/tracker initialization](../../pages/_document.tsx), [Google initialization](../../components/scripts/google-tag-manager.tsx), [analytics](../../utils/analytics.ts), [Umami](../../utils/umamiAnalytics.ts), [data layer](../../utils/dataLayer.ts), [consent](../../utils/consent.ts).
- [SEO component](../../components/common/seo.tsx), [sitemap configuration](../../next-sitemap.config.js), [Next configuration](../../next.config.js).
- [Sanity IDs/private paths](https://www.sanity.io/docs/content-lake/ids) and [transactions/consistency](https://www.sanity.io/docs/content-lake/transactions), read from official documentation.
- [Umami tracker configuration/before-send](https://docs.umami.is/docs/tracker-configuration), read from official documentation after browser access to the older URL returned 403.
