# INUT Creativa — Product Specification

## Current sales / tracking amendment

Follow [S-01..S-06](./plan.md#sales--tracking-refinement--2026-10-23): tracking first-image thumbnails/status chips; compact Creativa saved chips without visible history heading/disclaimer/clear-all (main root unchanged); sales-editable working records with hidden technical fields and no attention menu. Notification retry receipts remain server-only, separate from analytics.

Owner approved GA4 + Umami without new Sanity analytics IDs/receipts/claim writes. Accepted/recovered private responses supply a non-lookup transaction identity and buyer transfer content. Full `Name - Phone` exists only in authorized accepted/recovery and same-SPA memory; public/shared/reloaded tracking keeps the order ID. No contact text in browser persistence/URL/telemetry. Browser-session best-effort conversion dedup replaces durable cross-browser claims; prior stronger claim guarantees are intentionally superseded.

**Subsequent explicit CMS decision:** Saved sales records are editable like Lighters, with no extra permanent original copy. Protect only order identity/technical recovery barriers. Staff can change order date, operational/payment status, production items/customer details, monetary totals/discount, notes and tracking; public tracking/recovery reflect saved values. The production-row editor exposes product name/image, model name, coverage, quantity and print path, not identifiers/revisions. Staff-added rows may lack per-item prices; omit unknown line money, never synthesize free items. Manual final-total recalculation is explicitly the staff workflow. These decisions override earlier immutable snapshot/editor requirements, not initial customer quote validation or idempotent identity.

## Current compact-client amendment

The [UI-01..UI-07 amendment](./plan.md#compact-ui--form-and-request-amendment--2026-10-23) is approved implementation scope: cart/checkout display the first product image to the left of its name; every live Creativa page has linked ancestor breadcrumbs and a text-only current item; compact typography/spacing prioritizes imagery without reducing input readability or interaction targets. Owner-confirmed contained-primary buttons use white text on `#ae3500`, retaining brand primary `#fd4d01`.

Creativa form ownership uses React Hook Form + Yup; API orchestration uses SWR/SWRMutation hooks, not request chains in render pages. Existing server validation, recovery/acceptance/storage/privacy/measurement semantics remain authoritative. Prefer event/request handlers to effects where a user action owns the trigger; genuine lifecycle/external synchronization remains allowed. This amends implementation/presentation of existing 116 requirements/52 ACs, not a new order flow or a weakened acceptance oracle.

**SDD gate:** Specification.
**Status:** Owner-approved CMS/runtime/compact-client amendments are implemented; cumulative code audit PASS through `7918095` after C-01 rework. [Final verification](./final-verification.md) records all nine current requests, 116 requirements/52 AC results and E-01..E-04 blockers; production activation remains unapproved.
**Date:** 2026-10-22.
**Latest amendment:** Exact orange/light UI, active-primary bank and amended CMS/runtime shapes, preserving prefix-free 10-character public IDs and browser-local shortcuts.
**Authority:** [Approved idea](./idea.md), subsequent owner answers recorded below, and [supplied references](#10-visual-and-interaction-requirements).
**Implementation authority:** The [revised plan](./plan.md) is the task/dependency/evidence source of truth after cross-document refinement. All requirements and 52 ACs below remain in scope; the refinement does not turn a blocked witness into a pass.
**Deliverable boundary:** Requirements, business/data contracts, analytics and acceptance criteria. No application implementation, final API/schema design or implementation task plan is included.

## CMS-first amendment — 2026-10-23

The owner initially selected CMS-only, then accepted that flow and authorized storefront/API integration. [The amended plan](./plan.md#cms-first-amendment-and-required-next-actions) defines the schema contract and CM-03 through CM-08 integration/evidence tasks.

Root titles alone retain `Creative - `; all Creativa entries follow legacy content. Model code is a generated slug with no fit fields. Shipping/bank are independent per-record fee/profile editors, not singletons. Skin laptop is active by default, uses `blockContent` and an absolute `printAssetPath`; removed product approval/artwork/upload fields are not publication requirements. The authorized runtime continuation implements those readers/snapshots without migrating existing data; historical compatibility is retained in code/probes, with actual historical-record witnesses still required before release.

**Runtime/color decisions:** Creativa remains light with exact primary `#fd4d01`; accessible darker text/hover variants are allowed. The customer bank is the sole profile matching both active and primary flags, with no fallback to another active profile. New accepted orders snapshot those payment details; old orders/recovery retain their original values. Production paths remain internal staff metadata, excluded from public application responses and telemetry; direct CMS dataset visibility is a separate known boundary.

## 1. Objective and scope

Launch INUT Creativa as a separately branded storefront for ready-made MacBook skins. Customers choose an artwork, supported model and coverage, then place a guest order at known CMS-configured prices. Staff print and fulfill manually.

The commerce boundary is **Creativa**, not Skin Laptop: one shared cart, checkout, order and tracking detail must accommodate future Creativa product types. Only laptop skins are implemented as orderable products in this launch. The existing lighter business remains separate.

### Confirmed specification refinements

| Decision | Required behavior |
| --- | --- |
| Initial model | Unselected; the customer must choose a supported model. |
| Initial coverage | First active coverage in CMS display order; seed Lưng first. Do not preselect an inactive option. |
| Initial quantity | 1. |
| Card price | From-price calculated from the lowest active skin-coverage price; initially `Từ 100.000₫`. |
| Detail price | Exact selected-coverage price; initially Lưng at `120.000₫`, despite the lower catalog from-price. |
| Required checkout fields | Name and a phone containing exactly 10 digits, matching the lighter form's validation rule. |
| Optional checkout fields | Address, email and note. No new required-address rule, +84 normalization or Zalo-registration check. |
| Public order ID | Exactly 10 case-sensitive, cryptographically random URL-safe characters; no product/brand prefix. Shared by all Creativa order compositions. |
| Local order history | Uncapped array of successfully created/recovered public IDs; deduplicated, with unseen IDs inserted first and no automatic expiry. |
| Saved-ID action | One tap from either tracking search page opens that Creativa order; offer individual remove and clear-history controls. |

### Requirement language

**MUST** is an acceptance requirement. **MUST NOT** is prohibited behavior. Items explicitly deferred or listed as launch inputs are not permission to invent missing business facts.

## 2. Routes, branding and navigation

| Route | Purpose | Shell |
| --- | --- | --- |
| `/creativa` | Neutral multi-product placeholder; Skin Laptop is the first live category. | Creativa |
| `/creativa/skin-laptop` | Published skin catalog and search. | Creativa |
| `/creativa/skin-laptop/[slug]` | Readable artwork URL and product configuration. | Creativa |
| `/creativa/cart` | Shared Creativa cart. | Creativa |
| `/creativa/checkout` | Guest checkout for the complete Creativa cart. | Creativa |
| `/creativa/order-tracking` | Search any Creativa order by reference without a category selector; saved-ID tags below the input. | Creativa |
| `/creativa/order-tracking/[slug]` | Confirmation/tracking using the immutable prefix-free 10-character public order ID. | Creativa |
| `/order-tracking` | Existing search, adding the Skin Laptop option and labeled Creativa saved-ID tags. | Existing main brand |
| `/order-tracking/lighters/[slug]` | Existing lighter order detail, unchanged. | Existing main brand |
| `/creativa/skin-laptop/huong-dan-su-dung` | Honest guide/coming-soon entry point. | Creativa |
| `/creativa/skin-laptop/huong-dan-su-dung/[slug]` | Reserved guide article family, not a published content system. | Creativa |

- **BRAND-01:** Every Creativa route MUST use its dedicated header/footer. Its cart, checkout and tracking links MUST stay inside the Creativa namespace.
- **BRAND-02:** The root Creativa page MUST replace running/trail/trekking-specific positioning with neutral subbrand content and a working Skin Laptop entry. It MUST NOT advertise other categories as orderable.
- **BRAND-03:** Start from duplicated existing header/footer and cart/checkout/tracking implementations, then adapt for Creativa. Header/footer content MUST use configurable constant arrays. Do not refactor or replace the main brand's commerce flow as a prerequisite.
- **ROUTE-01:** Shared cart, checkout and order-detail URLs MUST NOT depend on a product category. Product catalog/detail URLs remain category-specific.
- **ROUTE-02:** Product slugs MUST be unique within the skin catalog; `huong-dan-su-dung` is reserved. Unpublished or unknown product slugs MUST NOT expose drafts or pretend to be available products.

## 3. Discovery and product configuration

### 3.1 Catalog

- **CAT-01:** List one card per published, active Creativa skin artwork. Do not automatically include legacy product documents or create cards for every model/coverage permutation.
- **CAT-02:** Cards MUST show the primary image, readable design name and accurate from-price. Where a secondary image exists, desktop hover follows the existing image-swap behavior; touch users MUST NOT need hover to understand or open a product.
- **CAT-03:** Search MUST match design names case-insensitively after trimming the query. Empty search restores all eligible designs. Results MUST be newest-first with a deterministic tie-breaker so incremental pages do not duplicate/skip equal-date records.
- **CAT-04:** The catalog MUST use bounded incremental loading/pagination. Changing search starts a fresh result set; stale responses from an earlier query MUST NOT replace current results. A failed additional page MUST preserve already loaded cards and offer retry.
- **CAT-05:** Mobile defaults to two columns and offers a visible one/two-column toggle with an accessible selected state. Changing layout MUST preserve the search, loaded records and ordering; it MUST NOT recreate the cart or trigger fresh product views merely because cards move.
- **CAT-06:** Distinguish initial loading, genuinely empty catalog, no search results, initial-load failure, additional-load failure and end of results. Errors MUST NOT masquerade as an empty catalog.
- **CAT-07:** No price facets, collection/tag filters, advanced sorting or nonfunctional filter controls are required in this release.

### 3.2 Gallery and configuration

- **PDP-01:** Every launch design MUST have at least three approved images covering lưng, đáy and interior/kê tay, with meaningful image descriptions. Gallery order is CMS-controlled.
- **PDP-02:** Preserve the existing interaction baseline: carousel, indicators/navigation, selectable thumbnails and click-to-open lightbox. Closing the lightbox returns to the product; essential interactions MUST work on touch and keyboard.
- **PDP-03:** Model and coverage choices MUST NOT generate images, require per-model photography or automatically synchronize gallery position. Use the design-level supplied gallery.
- **PDP-04:** Models and coverages MUST come from active Creativa CMS configuration, not an embedded storefront list. Every active design offers every active model/coverage in this release.
- **PDP-05:** Start with no model, the first active coverage selected and quantity 1. Seed coverage order with Lưng first. Model selection is mandatory before adding an item; do not silently choose a MacBook for the customer.
- **PDP-06:** Quantity MUST be a positive safe integer. Reject blank, fractional, negative, non-finite or otherwise invalid quantities without silently replacing them with a different order quantity.
- **PDP-07:** Display the selected coverage's exact VND unit price. Changing model MUST NOT change it; changing coverage MUST update it. Show the selected quantity/subtotal clearly where a subtotal is presented.
- **PDP-08:** Add to cart MUST require an available product, active model, active coverage, valid price and valid quantity. Show a specific reason when configuration is incomplete or unavailable. Missing CMS data MUST NOT be replaced with a hardcoded product, model or price.

### 3.3 Models and coverage

The initial model labels/grouping/order are the 16 entries in the approved idea's [MacBook support section](./idea.md#macbook-support), taken from the [model screenshot](./references/uniqfind-macbook-models.png). They are reference labels, not verified physical compatibility.

- **MODEL-01:** CMS operators control model label, generated slug code, ordering and activation without `fitVerified` or `fitReference` fields. Physical compatibility remains a manual owner responsibility, including the screenshot's questionable `MacBook Pro 12"` wording/grouped generations; the schema does not certify fit.
- **MODEL-02:** No Windows laptop or free-text custom model is orderable. Unsupported-model help may use existing support channels but MUST NOT bypass model validation.

| Coverage | Initial price | Rule |
| --- | --- | --- |
| Lưng | 120,000 VND | Top/lid skin; first seeded active option. |
| Đáy | 100,000 VND | Bottom skin. |
| Interior | 150,000 VND | The owner's “Phím + kê tay” option; exact physical cut template requires production approval. |
| Full | 310,000 VND | Lưng + Đáy + Interior as one configured bundle. |

- **PRICE-01:** Coverage presets are mutually exclusive. Full MUST use its own configured price, not the 370,000 VND sum of the three individual options. No arbitrary area combinations or extra Lưng + Đáy preset are in scope.
- **PRICE-02:** One shared skin-coverage price configuration applies across designs and models. There are no artwork surcharges, model surcharges or quantity tiers in this release.
- **PRICE-03:** The catalog from-price MUST equal the minimum valid active coverage price. Product details with a selected coverage MUST show its exact price, not keep advertising the lower minimum as the price of that selection.
- **PRICE-04:** Customer quotes/acceptance use exact safe-integer VND, line quantity × authoritative price and summed totals, with zero initial discount. Authorized sales edits may set working totals/discount under the explicit manual final-recalculation note; no automatic correction or false item-price inference. Reject unsafe/negative saved money/quantities. No coupon/tax/extra-fee product feature is added.
- **PRICE-05:** A missing, invalid or unavailable price is an error, not free merchandise. A configured zero shipping fee is valid; missing shipping configuration MUST NOT be interpreted as zero.
- **PRICE-06:** If merchandise prices or shipping fees change after the customer's review, show the changed quote and require review/resubmission before creating the order. Revalidate on the server; do not silently accept stale totals or silently charge more.

## 4. Shared cart and extension contract

- **CART-01:** Use one Creativa-wide persisted cart under `inut-creativa-cart`. Preserve `inut-lighters-cart` unchanged. Main-brand/legacy carts MUST NOT be implicitly imported, cleared or combined with Creativa.
- **CART-02:** Each line MUST identify its product type, product, type-specific selections, quantity, display information and reviewed price. Skin line identity is `product type + design + model + coverage`.
- **CART-03:** Adding the same identity increases its quantity. A different model, coverage, design or product type remains a separate line, even if display names or identifiers overlap.
- **CART-04:** Support quantity editing, explicit removal and combined totals. All Creativa add actions and header cart indicators MUST use the same cart; the indicator represents total units, not distinct-line count.
- **CART-05:** Reload and navigation MUST preserve valid cart contents. Hydration MUST NOT briefly overwrite an existing persisted cart with an empty default or produce a false empty-checkout redirect.
- **CART-06:** Revalidate current availability and prices before checkout. Mark affected lines and preserve unaffected ones. Block submission until invalid lines are corrected/removed; do not silently drop an item or submit a partial order.
- **CART-07:** Empty cart/checkout states MUST explain that there are no items to order and provide a return-to-shopping action. Empty orders MUST be rejected server-side.
- **CART-08:** Corrupt or unsupported persisted data MUST produce a recoverable notice rather than a crash or success-shaped empty fallback. Never silently coerce an unknown product type into a skin.
- **EXT-01:** Product type MUST be an explicit, validated discriminator. Skin model/coverage fields MUST be required only for skins, not for the whole cart/order or every possible future line type.
- **EXT-02:** Adding a future category may introduce its catalog and configuration/pricing behavior, but MUST reuse these cart/checkout/tracking URLs, customer/payment form, order schema and typed-line boundary. No unknown future category needs to be implemented or published now.
- **EXT-03:** Unknown/unimplemented product types MUST be rejected clearly at cart recovery/order validation. Extensibility is not permission to trust arbitrary client-defined attributes or prices.

## 5. Guest checkout, order creation and fulfillment

### 5.1 Form and shipping

| Field | Validation/behavior |
| --- | --- |
| Customer name | Required; whitespace-only is invalid. |
| Phone | Required; exactly 10 ASCII digits, matching the lighter checkout's existing rule. Preserve leading zeroes; do not treat it as a number. |
| Email | Optional; validate format if supplied. |
| Delivery address | Optional; preserve when supplied and use for configured shipping detection. |
| Note | Optional; display as customer input, not executable markup. |
| Payment method | `bank_transfer` or `cod`; default to bank transfer as in the existing journey when valid bank configuration is available. |

- **CHECKOUT-01:** One guest form MUST apply to all submitted lines. Do not add account creation, +84 normalization, Zalo-registration verification, pickup selection or a mandatory address.
- **CHECKOUT-02:** Client and server MUST enforce the same required-field, quantity and option rules. Invalid email MUST block submission only when an email was supplied.
- **CHECKOUT-03:** Preserve the existing shipping detection/default behavior using **only Creativa shipping data**: prefer the configured Đà Nẵng rule for matching addresses; otherwise the configured nationwide/default rule. With no address, use the valid configured default and display the selected fee. The technical design MUST make fallback ordering deterministic, not depend on an accidental query order.
- **CHECKOUT-04:** No address is a valid checkout condition. The order/staff summary MUST represent it honestly as not supplied; do not fabricate an address or claim delivery details are complete.
- **CHECKOUT-05:** Apply shipping once to the combined order, not once per product category. Show the selected shipping rule, amount, merchandise total and final amount before submission. If no valid shipping configuration can be resolved, explain the issue and block submission rather than defaulting to free delivery.
- **CHECKOUT-06:** COD and bank transfer MUST be supported. Use exactly one valid Creativa profile with `isActive == true` and `isPrimary == true`. No arbitrary active/nonprimary or main-brand fallback and no customer profile selector. Missing/invalid/multiple primary profiles explicitly disable transfer; valid COD remains available. Accepted orders retain their selected bank snapshot.
- **CHECKOUT-07:** Retain entered fields and the cart on validation, availability, repricing or order-creation errors. Keep the submit state/focus/error messaging understandable and prevent competing submit actions while a request is unresolved.

### 5.2 Authoritative order transaction

- **ORDER-01:** A successful checkout MUST create one complete Creativa order with all accepted lines, one reference, one customer/delivery record, one payment method and order-level totals. Never silently split by category or report partially accepted items as full success.
- **ORDER-02:** The server MUST load the relevant published/active Creativa data, validate the product-type-specific selections, recompute prices/fees and compare them with the reviewed quote. Client-supplied names, unit prices, subtotals, totals, payment status or order status are not authoritative.
- **ORDER-03:** Invalid or stale lines, changed quotes and unresolved fees MUST return actionable validation/conflict information without creating an order. A newly reviewed quote may be submitted as a new purchase attempt.
- **ORDER-04:** Each submission intent MUST have an idempotency identity bound to the canonical purchase intent. Repeated/concurrent submissions or retries of the same intent MUST resolve to one order/reference. Reusing that identity for a different intent MUST be rejected.
- **ORDER-05:** If the order was saved but the response was lost, retrying the original intent MUST recover the existing order, not create a second one. Later catalog/fee changes MUST NOT invalidate recovery of that already accepted order or rewrite its snapshot.
- **ORDER-06:** Show confirmation only after durable order acceptance. Navigate to `/creativa/order-tracking/[slug]` and remove only the submitted items/quantities from the Creativa cart, preserving unrelated later additions and all lighter-cart contents.
- **ORDER-07:** Creation starts with operational status `pending` and payment status `pending`. Staff use the existing vocabulary: operational `pending`, `confirmed`, `processing`, `in_transit`, `completed`, `cancelled`; payment `pending`, `paid`, `failed`, `refunded`. These are distinct states; an order or COD selection is not proof of payment.
- **ORDER-08:** Persist complete server-derived customer-checkout lines, production context and money at acceptance. Catalog/configuration edits MUST NOT automatically rewrite accepted records. Authorized staff may directly edit saved production/customer/financial working values under the approved sales workflow; no extra immutable original copy is promised. Manual production additions may omit itemized price/refs; omit unknown/inconsistent line money, never invent zero. A path does not version/copy its file; actual retention/fit remains manual.
- **ORDER-09:** All lines MUST have unique `_key` values. Server-created product/option refs target Creativa records; staff-authored production rows need no fabricated refs. Technical order/intent/lookup identities and existing legacy data remain protected; direct staff production corrections do not silently reconfigure catalog identities.
- **ORDER-10:** The public reference MUST be exactly 10 case-sensitive characters matching `^[A-Za-z0-9_-]{10}$`, generated server-side with cryptographically secure randomness. There is no product/brand prefix, timestamp or sequential component. The same format applies to skin-only and future mixed-product orders; the route/data source identifies Creativa.
- **ORDER-11:** Keep the public reference distinct from Sanity's internal document ID, the analytics transaction identifier and the idempotency identity. Once accepted, it MUST remain unchanged through retries, recovery, status changes and later product edits. Product-type filtering MUST use stored line types, never infer them from this ID.
- **ORDER-12:** Enforce public-reference uniqueness atomically at acceptance. A random collision MUST trigger a bounded generation/retry path, not overwrite or resolve to another customer's order. Exhausted/unavailable allocation must fail explicitly without accepting duplicate identities; replay of an already accepted intent MUST return its original ID.

### 5.3 Sales handoff and manual operations

- **OPS-01:** Accepted orders MUST be available in the Creativa CMS and generate a staff notification using Creativa recipients. The handoff MUST include the order reference, every line's type/configuration/quantity, shared contact details, optional address/note, payment method and totals.
- **OPS-02:** A notification failure after the order is persisted MUST NOT turn acceptance into a failed order or invite duplicate checkout. Record a diagnosable operational failure and provide a defined way for staff to discover/retry the handoff without creating another order. A new queue/service is not required by this specification.
- **OPS-03:** Retry/recovery MUST NOT generate another purchase conversion or routine duplicate staff notification. Handle uncertain notification delivery explicitly; do not promise exactly-once external message delivery.
- **OPS-04:** Fulfillment remains manual. No automatic SPX shipment creation, bank reconciliation, category-based order splitting, split payments or partial-shipment orchestration is included.
- **OPS-05:** Do not promise automatic email/SMS confirmation, recovery campaigns, delivery SLAs or stock/material/warranty terms that were not supplied. An optional email field alone does not create a messaging feature.

## 6. Tracking and confirmation

- **TRACK-01:** `/creativa/order-tracking` MUST accept the full public reference without requiring a product category. Trim surrounding whitespace, require the 10-character URL-safe format, preserve case and safely encode navigation. Do not uppercase/lowercase the random ID. Root Skin Laptop input uses these Creativa rules without changing lighter-reference validation.
- **TRACK-02:** Root `/order-tracking` MUST retain its current lighter option and add Skin Laptop as an entry into the **Creativa order domain**. Selecting it routes to `/creativa/order-tracking/[slug]`, without filtering out future mixed orders.
- **TRACK-03:** Both search entry points and fresh-checkout confirmation MUST use the same order-detail destination and data. Existing `/order-tracking/lighters/[slug]` behavior remains unchanged.
- **TRACK-04:** Detail MUST show reference/date, labeled colored operational/payment chips, first-image thumbnails, saved production configurations/quantities, known itemized prices and saved order totals/discount. Reflect staff edits; omit unavailable/inconsistent itemized money rather than invent free lines. Show supplied carrier reference only when present; no carrier integration implied.
- **TRACK-05:** Bank instructions use saved Creativa bank details/current saved payable amount and only unpaid/failed bank-transfer states, never paid/refunded/cancelled. Explicit copy uses full saved `Name - Phone` only in authorized accepted/recovery same-SPA memory matching the current opaque contact version; changed contacts/shared/reloaded tracking fall back to public ID. Do not persist/leak contact text. Changing an original COD record to bank does not invent a missing bank snapshot: show explicit support guidance if none exists.
- **TRACK-06:** Fresh acceptance may show a success message; later direct visits/searches MUST NOT claim a new order was just created. Neither case creates another order or conversion.
- **TRACK-07:** Distinguish loading, invalid/not-found and service-error states with an appropriate recovery action. Lighter references MUST NOT resolve through the Creativa data source or vice versa.
- **TRACK-08:** Public lookup responses MUST exclude internal notes, recipients, credentials and unnecessary customer data. Use a deliberate masked/minimal customer-information projection; do not expose raw CMS order documents. Reference-only access and abuse protections must be addressed in technical design without adding a customer account requirement.
- **TRACK-09:** Confirmation/detail MUST show the full 10-character public ID and separate actions to copy the ID or its tracking URL. Confirm successful copying only when the operation succeeds; otherwise keep the ID/selectable link available with an actionable explanation. Never copy an internal ID or analytics identifier in place of the public reference.

### 6.1 Browser-local order-ID history

- **HISTORY-01:** Use localStorage key `inut-creativa-order-history` containing a JSON array of public-ID strings only, separate from cart state. Do not store customer fields, order payloads, payment details or analytics/idempotency identifiers in this array.
- **HISTORY-02:** After the server confirms durable creation or recovery of an accepted checkout intent, insert a previously unseen public ID at the front. An already saved ID MUST remain a single entry in its existing relative position. Failed/unconfirmed checkout, manual search, direct/shared links and saved-tag navigation MUST NOT add an ID.
- **HISTORY-03:** There MUST be no application count cap, TTL, status-based expiry or automatic pruning of valid IDs. All saved IDs remain reachable in the interface even if presentation uses accessible expansion/pagination. Browser quota, user clearing and browser eviction remain possible and MUST NOT be described as permanent account history.
- **HISTORY-04:** Both entries read current history and show accessible saved-ID chips below the reference input without prefetching orders/inventing statuses. Creativa shows compact chips only (no heading/disclaimer/clear-all); main-root retains its labeled disclosure and controls. Empty valid history is not an error.
- **HISTORY-05:** Activating a saved tag MUST perform one lookup journey to `/creativa/order-tracking/[id]`. On the root page it selects the Creativa domain without another dropdown/input/submit step, even if Lighters was previously selected. Manual lighter search remains unchanged.
- **HISTORY-06:** Provide individual removal on saved chips; retain clear-history controls on main-root tracking only, not the compact Creativa entry. Mutations persist across reloads and affect only this history key, never server orders, carts or unrelated storage. Stale IDs remain available for explicit local removal.
- **HISTORY-07:** Local storage is untrusted: guard access for SSR/browser availability, validate JSON shape and ID strings, deduplicate repeated values, and safely render/encode valid tags. Corruption or invalid entries MUST have a visible recovery path; do not silently overwrite the whole history with an empty array during hydration or error handling.
- **HISTORY-08:** Storage read/write failures, blocked access and quota exhaustion MUST be nonfatal to order acceptance and manual tracking. After an accepted order cannot be remembered, show a local-history warning and preserve its reference/copy actions; do not report checkout failure, regenerate its ID or request another purchase.
- **HISTORY-09:** Main-root tracking retains browser/shared-device limitations; owner-approved compact Creativa entry omits that visible copy and clear-all control. Do not claim login, identity verification, cross-device sync or cloud backup; local possession is not order ownership or authority to access buyer-only contact data.
- **HISTORY-10:** Keep history independent of cart cleanup and order-status changes. Read the latest valid stored list before a local append/remove mutation so an old in-memory snapshot does not casually replace newer entries. Do not introduce realtime cross-device history as an implied requirement.

## 7. CMS and logical data requirements

Only root Creativa document titles MUST use **`Creative - `**; fields/nested objects/options/subordinate lists use human-readable unprefixed labels. All Creativa root entries follow legacy content without changing legacy sales defaults. The public brand is **INUT Creativa**.

| Logical record | Minimum required business information |
| --- | --- |
| Skin design | Stable document identity, unique readable slug, name, ordered images, `blockContent` description, active default true, creation ordering and absolute `printAssetPath` metadata. No production flag/artwork ID/version/upload field. |
| MacBook model | Stable document identity, customer label, generated slug `code`, display order and active state; no fit fields. |
| Skin coverage | Stable identity, label, coverage meaning, order, active state and integer VND price shared across skin designs/models. |
| Creativa order | Separate internal identity and immutable unique prefix-free 10-character public reference, time, typed snapshot lines with unique keys, customer/optional delivery fields, merchandise/shipping/final totals, payment method/state and operational state. |
| Creativa shipping | Independent records like `shippingFee`: name, generated slug, nonnegative fee and optional note. Runtime regional/default selection must be adapted explicitly next. |
| Creativa bank information | Independent profiles like `bankInfo`, with QR/logo, account/holder/bank fields, active/primary/display-order controls and internal notes. Never share legacy records or expose internal notes. |
| Creativa sales configuration | Separate recipient/destination ownership; credentials and private configuration remain server-only. |

- **CMS-01:** New Creativa documents MUST NOT reuse legacy product/order/shipping/bank/recipient documents as their business source of truth. Common infrastructure/utilities may be reused; configuration ownership may not.
- **CMS-02:** Admin changes to Creativa records MUST NOT change lighter/main-brand data, or vice versa. Future Creativa categories share the Creativa order/shipping/bank/recipient domain, not separate order schemas per category.
- **CMS-03:** Admin validation catches required/readable product/model slugs, required imagery, absolute print-path syntax, prices and shipping/bank fields. Removed fit/product flags are not activation gates. Server orderability validation must be adapted to this contract before launch; a valid Studio form alone is not order acceptance.
- **CMS-04:** Do not seed unverified models as supported or auto-migrate every legacy artwork. Screenshots and artwork are inputs, not authority to invent compatibility or commercial claims.
- **CMS-05:** Historical orders MUST be interpreted using their snapshots, not only current dereferenced labels/prices. Missing old assets/options MUST NOT crash tracking or substitute a newer design.
- **CMS-06:** No guide/article schema, new Sanity project/dataset, duplicated deployment or general-purpose product-builder framework is required.

## 8. Legacy SEO and placeholder content

- **SEO-01:** Preserve the legacy skin-laptop and skin-nut-phim index/detail URL families, useful content, indexability and internal discovery. Do not blanket redirect, remove or canonicalize all legacy pages to the new catalog.
- **SEO-02:** Audit ordering CTAs on both legacy index and detail surfaces, including cards/customization entry actions presented there as ordering, and route them to `/creativa/skin-laptop`. Do not leave a second manual ordering path on those surfaces. General support remains distinguishable from ordering.
- **SEO-03:** Do not rebuild/remove the separate customization service pages themselves, migrate unrelated products or assume a new counterpart exists for each legacy design.
- **SEO-04:** New published product pages MUST have accurate self-referencing canonical URLs, product titles/descriptions, image metadata and truthful offer information consistent with active CMS prices. Do not copy legacy placeholder prices, ratings/review counts or unsupported claims.
- **SEO-05:** Cart, checkout, order-search and order-detail pages MUST be excluded from search indexing/sitemaps. Never place public order references or customer data in SEO metadata or social previews.
- **GUIDE-01:** Guide entry surfaces MUST honestly indicate that instructions are coming later. Do not render invented articles or a full CMS/library.
- **GUIDE-02:** Reserve the article route family but do not generate links/sitemap records for arbitrary or fake article slugs. Unknown article slugs MUST return a proper not-found outcome; any intentional coming-soon preview MUST be non-indexable and not masquerade as a published guide.

## 9. Analytics contract

### 9.1 Dispatch and context

- **AN-01:** Instrument the funnel through the existing GA4/GTM and Umami architecture. An action MUST have one effective emission per intended destination; do not add a second Umami call when a shared helper already dispatches there, or double-count GA4 through both direct `gtag` and a GTM tag.
- **AN-02:** Common context is `storefront=creativa`, journey surface and entry source. Item context includes product type, stable product identity, quantity and VND price; skin items add model and coverage identifiers. Root Skin Laptop search events also identify the Creativa order domain.
- **AN-03:** Preserve available campaign/referrer attribution and existing browser/device reporting. Compare mobile/iOS and one/two-column behavior without fingerprinting or collecting new device identifiers.
- **AN-04:** Preserve established mappings such as GA4 `view_item` → Umami `product_view` and GA4 `select_item` → Umami `product_click`. New events below MUST be documented in `docs/ANALYTICS_GUIDE.md` during implementation; do not rename unrelated existing events.

### 9.2 Event catalog

“Both” means the same named event in GA4 and Umami unless a different mapping is shown. Fields below are in addition to applicable common context; monetary fields are VND.

| Event / destinations | Trigger and permitted event-specific context |
| --- | --- |
| Existing page-view lifecycle / both | One logical page navigation, using a sanitized URL/title; do not add competing per-component page views. |
| `view_item_list` / both | Newly presented catalog batch; list identity, page/batch, grid columns and shown product identities/positions, bounded to provider limits. |
| `select_item` / GA4; `product_click` / Umami | Open a product from a list; product identity, list, position and displayed price basis. |
| `view_item` / GA4; `product_view` / Umami | One product-view lifecycle; product identity, price, `price_basis` and current coverage if selected. Selector changes do not create new product views. |
| `search` / both | Completed catalog search/result update; query length, results count and `search_context=catalog`. Do not send raw free text. |
| `catalog_pagination` / both | Successful user/load-triggered additional batch; catalog, page and added-record count. |
| `catalog_load_error` / both | Catalog request fails; phase and allowlisted error category, never response bodies. |
| `catalog_layout_change` / both | User switches layout; previous/new column count. |
| `gallery_interaction` / both | User navigates an image or opens/closes lightbox; action and image index, not autoplay ticks. |
| `product_option_change` / both | User changes model/coverage; option kind and selected stable identifier. Initial defaults are view context, not fabricated user actions. |
| `quantity_change` / both | User commits a different valid quantity; surface, previous/new quantities and line/product identity. |
| `add_to_cart` / both | Cart addition succeeds; configured item, added quantity and added merchandise value. |
| `add_to_cart_error` / both | Addition fails or is blocked after an attempted action; safe reason category and configuration completeness. |
| `cart_view` / both | One cart-view lifecycle after hydration; distinct lines, total units and merchandise value. |
| `remove_from_cart` / both | Remove a line or set its quantity to zero; removed configured item/quantity/value. Do not also emit a second removal for the same operation. |
| `cart_revalidation` / both | Revalidation finds changed prices/options; affected-line count and safe reason, not every successful background refresh. |
| `begin_checkout` / both | Enter a nonempty checkout attempt; typed items, units and merchandise value. Address/fee rerenders do not repeat it. |
| `add_shipping_info` / both | Shipping rule is committed/changed for the quote; rule identity and fee, not address. |
| `add_payment_info` / both | Customer commits/changes payment method; method only, never banking credentials or contact data. |
| `checkout_validation_error` / both | A submission is blocked by form/line/configuration validation; field/reason codes without values. |
| `checkout_submit` / both | Submit a valid reviewed checkout intent; counts and reviewed totals. Automatic retries are not new user submissions. |
| `checkout_error` / both | Submit/resolve fails; safe category such as repricing, unavailable item, network, configuration or server error. |
| `abandoned_checkout` / both | An entered checkout is observably left without known acceptance; stage and counts/value only. Deduplicate per observed attempt; do not fabricate certainty after an unresolved submission. |
| `purchase` / both | Durable acceptance or recovery of an unreported accepted order; opaque analytics transaction ID, accepted totals and counts, with GA4 typed line items. Never one purchase per category. |
| `purchase_item` / Umami | Non-conversion companion once per accepted order line, carrying the same non-sensitive transaction ID and typed item/quantity/unit-price/subtotal. GA4 already carries these in `purchase.items`; do not add duplicate GA4 revenue events. |
| `order_tracking_search` / both | Submit a manual reference or activate a saved-ID tag; entry point, `lookup_source=manual` or `history` and order domain where applicable, never the reference. One tag activation is one lookup intent, not both a manual submission and history submission. |
| `order_tracking_result` / both | Lookup resolves to found/not-found/error; entry point, lookup source and outcome. No customer/order-lookup data. |
| `order_history_action` / both | User removes an entry or clears local history; action, counts before/after and success/failure, never the entry or array contents. |
| `order_history_storage_error` / both | History read/parse/write fails; safe operation/error category only, not stored values or exception payloads. |
| `order_reference_copy` / both | ID/link copy is attempted; target kind and success/failure, never copied text or URL. |
| Existing `contact_click`, `zalo_click`, `cta_click` / both as applicable | Actual support/legacy-to-Creativa/navigation conversion action; method, surface and CTA identity, never typed customer content. |

### 9.3 Conversion, value and privacy

- **AN-05:** Purchase uses saved accepted/recovered order values, never the cart. GA4 `value` is saved merchandise total excluding shipping, with shipping/discount separate; Umami also records saved final payable amount. New checkout discount is zero; staff may edit discount/totals. Do not recalculate their manual final amount or invent unknown item prices.
- **AN-06:** Purchase is an **order-placed** conversion, including COD/unpaid bank transfer, not settled revenue. Payment received is a separate operational fact. Mixed orders count once; never emit another purchase on tracking visits, back navigation, reloads or submission retries.
- **AN-07:** Use a non-sensitive identity distinct from public lookup reference, supplied only by accepted/recovered checkout. Do not create Sanity analytics IDs/receipts or claim mutations. Consent-aware browser/session dedup suppresses repeated authorized callbacks where storage is available; blocked storage uses in-memory best effort. Mark-before-send may undercount; cross-browser/restarted-session duplicate prevention and exactly-once delivery are not promised. Disabled collectors do not block commerce.
- **AN-08:** Do not send names, phone/email, addresses, notes, raw search/order references, idempotency keys, internal notes or raw errors to analytics. Do not call existing search/abandonment helpers with such values simply because the lighter flow does.
- **AN-09:** Automatic page tracking, query strings, titles and referrers MUST also be considered: normalize the order-detail URL to a reference-free template and exclude customer/order secrets before transmission. Sanitizing only custom events is insufficient.
- **AN-10:** Analytics failure/disabled scripts MUST NOT block shopping or tracking. No new consent behavior, recovery messaging campaign, abandoned-contact collection, dashboard or warehouse is introduced.
- **AN-11:** Saved-history IDs/arrays and copied reference/link values MUST NOT be sent to analytics. Track tag usage through lookup source and history/copy operations through safe action/count/outcome fields. Local saving or shortcut lookup is never another purchase conversion.

## 10. Visual and interaction requirements

| Supplied reference | Required direction, not additional feature scope |
| --- | --- |
| [Desktop product](./references/uniqfind-product-desktop.png) | Broad image area beside a narrower purchase panel; restrained borders and clear model/coverage/action hierarchy. |
| [Mobile product](./references/uniqfind-product-mobile.png) | Large gallery first, then name/price and stacked full-width controls. |
| [Desktop catalog](./references/uniqfind-catalog-desktop.png) | Image-led grid, consistent image treatment and minimal card decoration. |
| [Mobile catalog](./references/uniqfind-catalog-mobile.png) | Two-column default and visible one/two-column control. |
| [Model selector](./references/uniqfind-macbook-models.png) | Single-choice scrollable model list and CMS-controlled grouped labels. |

- **UX-01:** Use a light, clean, professional INUT direction with brand primary exactly `#fd4d01`, light off-white/white surfaces, compact image-first spacing and smaller readable typography. Contained-primary buttons MUST use white text on owner-approved `#ae3500`; retain accessible hover/touch/disabled contrast and readable text variants without changing the root brand's theme.
- **UX-02:** Essential content/actions MUST work on iPhone/Safari and other touch devices without hover, horizontal page overflow or controls hidden behind the header/footer. Check layouts at representative mobile widths, tablet and desktop.
- **UX-03:** Selectors, layout toggle, gallery, quantity controls and forms MUST have meaningful labels, visible focus, keyboard operation and perceivable selected/error states. A disabled action needs an understandable reason.
- **UX-04:** Use original/approved assets and copy. Do not copy the reference's ratings, currency selector, account system, filter features, Shop Pay or case upsell into the product scope.

## 11. Reliability, privacy and regression constraints

- **NFR-01:** Preserve Next.js pages-router/layout conventions, MUI/Zustand/Sanity patterns, `@/` imports and current TypeScript configuration. No framework/state-management migration or general platform rewrite.
- **NFR-02:** Keep writes/credentials/recipients in server/admin boundaries and use explicit public projections. Public order creation MUST enforce validation and abuse/rate limits; customers cannot set privileged statuses or perform arbitrary CMS writes.
- **NFR-03:** Persisted cart, availability reads, order creation and tracking MUST have explicit loading/error handling. Network/configuration failures cannot be silently mapped to empty lists, zero prices or successful acceptance.
- **NFR-04:** Initial catalog reads MUST be bounded; use existing image URL/preset conventions and responsive rendering. Do not make browsing depend on loading the whole catalog or unrelated heavy customizer code.
- **NFR-05:** Existing lighter pricing tiers, cart key, API payloads, order format, checkout, tracking, shipping/bank configuration and analytics behavior MUST remain compatible.
- **NFR-06:** Implementation verification MUST use authorized test data/mocks, not unapproved production orders. Run existing targeted checks, lint and runtime/routing build checks, then browser QA of the touched mobile/checkout flows using the repository browser skill.

## 12. Acceptance scenarios

These scenarios define acceptance, not automatic passing claims. Per-scenario results and unexecuted witnesses are in [final-verification.md](./final-verification.md).

| ID | Given / when | Required outcome | Requirements |
| --- | --- | --- | --- |
| AC-01 | Visit any Creativa purchase route directly or via internal navigation. | Dedicated header/footer and links remain in Creativa; root lighter surfaces retain their shell. | BRAND-01, ROUTE-01 |
| AC-02 | Open mobile catalog with no chosen layout, toggle to one column, then back. | Default is two; query/results/order remain unchanged; selected state is accessible. | CAT-05, UX-03 |
| AC-03 | Search a mixed-case design name, clear it, and quickly change queries during loading. | Correct newest-first results; clearing restores catalog; stale responses do not overwrite current search. | CAT-03, CAT-04 |
| AC-04 | Catalog is empty, search has no match, or a request fails. | Correct distinct state; retry preserves loaded cards where applicable. | CAT-06 |
| AC-05 | Open a valid design with all initial coverage options active. | No selected model, quantity 1, Lưng selected and exact price 120,000 VND; card advertised from 100,000 VND. | PDP-05, PRICE-03 |
| AC-06 | Attempt add without a model, then choose an active model. | First attempt cannot add and explains why; valid configuration can be added. | PDP-08 |
| AC-07 | Select each coverage and change model/quantity. | Prices remain 120k/100k/150k/310k by coverage across models/designs; Full is not 370k; quantity multiplies without tiers. | PRICE-01, PRICE-02, PRICE-04, PDP-07 |
| AC-08 | CMS deactivates Lưng or changes coverage order before a fresh product visit. | First active ordered coverage becomes the default and shows its exact price; inactive options cannot be purchased. | PDP-04, PDP-05 |
| AC-09 | Navigate gallery/thumbnails/lightbox on touch and desktop. | Approved design images and existing interaction behavior work; selectors do not synthesize/switch images. | PDP-01, PDP-02, PDP-03 |
| AC-10 | Add identical skin configuration twice and another model/coverage once. | Identical identity merges quantity; distinct configurations remain separate lines. | CART-02, CART-03 |
| AC-11 | Change quantity, remove an item, reload or navigate away/back. | Accurate persisted contents/totals; no hydration overwrite; correct total-unit badge. | CART-04, CART-05 |
| AC-12 | Lighter and Creativa carts both contain items; complete/edit either journey. | The other cart, configuration and workflow remain untouched. | CART-01, NFR-05 |
| AC-13 | Cart contains a deactivated/deleted option or corrupt/unknown-type data. | Explicit recoverable error; unaffected lines retained; no silent conversion or partial checkout. | CART-06, CART-08, EXT-03 |
| AC-14 | Visit checkout with an empty cart after hydration. | Honest empty state; server rejects empty order creation. | CART-07 |
| AC-15 | Submit name and 10-digit phone with address/email/note blank. | Form permits optional blanks and uses a valid Creativa default shipping fee; summary says address not supplied. | CHECKOUT-01, CHECKOUT-03, CHECKOUT-04 |
| AC-16 | Submit missing name, a non-10-digit phone, or an invalid supplied email. | Specific client/server validation; no accepted order. No new +84/Zalo requirement. | CHECKOUT-02 |
| AC-17 | Detect Đà Nẵng/default shipping, use configured zero fee, or remove all valid fee configuration. | Correct domain-specific rule; deliberate zero accepted; missing configuration blocks rather than becoming free shipping. | CHECKOUT-03, CHECKOUT-05, PRICE-05 |
| AC-18 | Bank config is absent or user chooses COD/bank transfer. | No main-brand fallback; bank-transfer method explains unavailability; valid COD can proceed. | CHECKOUT-06 |
| AC-19 | CMS price/fee changes between review and submission, or client tampers with totals. | Server recomputes; changed quote requires review; no stale/forged-price order is accepted. | PRICE-06, ORDER-02, ORDER-03 |
| AC-20 | Double-click, concurrent submit, lost response, retry or reuse key with altered intent. | One accepted order for the same intent; recovery returns its snapshot; altered-intent reuse conflicts. | ORDER-04, ORDER-05 |
| AC-21 | Order write fails, versus succeeds but staff notification fails. | Write failure preserves checkout/cart; accepted order remains accepted despite notification failure and is operationally discoverable. | CHECKOUT-07, OPS-02 |
| AC-22 | Checkout succeeds while unrelated new cart items were added during the request. | One combined accepted order; only submitted quantities removed; later additions and lighter items preserved. | ORDER-01, ORDER-06 |
| AC-23 | Change/deactivate a catalog design/option after purchase. | Order history retains agreed artwork/configuration and amounts; tracking does not crash or reinterpret it. | ORDER-08, CMS-05 |
| AC-24 | Staff inspect the order or receive its notification. | Every line, selection, quantity and shared customer/payment/shipping context is identifiable; status begins pending/unpaid. | OPS-01, ORDER-07 |
| AC-25 | Search same reference from root Skin Laptop option and Creativa search. | Both reach the same generic Creativa detail without a category filter; lighter option still uses lighter routes. | TRACK-01, TRACK-02, TRACK-03 |
| AC-26 | Reload tracking, use an unknown reference, or simulate lookup failure. | No new order/conversion; distinct found/not-found/error states; no internal/private data exposed. | TRACK-06, TRACK-07, TRACK-08 |
| AC-27 | Staff change payment/operational state and add a manual carrier reference. | Tracking shows the reference/date, every line/configuration/amount, current states and supplied carrier reference; no bank-payment prompt for paid/refunded/cancelled orders. | ORDER-07, TRACK-04, TRACK-05 |
| AC-28 | Edit Creativa shipping, bank or recipient configuration. | Main-brand/lighter settings stay unchanged; no implicit cross-domain fallback. | CMS-01, CMS-02 |
| AC-29 | Follow ordering CTAs from both legacy catalog/detail families. | Existing pages remain indexable/reachable; ordering enters Creativa, not the old manual order path. | SEO-01, SEO-02 |
| AC-30 | Inspect guide placeholders, unknown article slugs and sitemap/indexing behavior. | Honest coming-soon index, no fake published articles, proper unknown-slug result and no transaction/order secrets indexed. | GUIDE-01, GUIDE-02, SEO-05 |
| AC-31 | Perform catalog/configuration/cart/checkout/tracking actions with both trackers enabled. | Event catalog/context matches actions once per destination; no render-driven duplicate views or conversions. | AN-01, AN-02, AN-04 |
| AC-32 | Accept/recover an order, interrupt client event delivery, reload tracking, or test a synthetic multi-type order contract. | One logical order conversion with correct values and a non-lookup analytics identity; typed lines remain distinguishable; implemented recovery/deduplication meets the documented transport limits without per-category purchase duplication. | AN-05, AN-06, AN-07, EXT-01 |
| AC-33 | Inspect events, automatic page views, titles and referrers for a checkout/tracking journey. | No customer input, raw lookup reference or private configuration reaches analytics. | AN-08, AN-09 |
| AC-34 | Block tracker scripts or reject relevant tracking through existing controls. | Shopping, submission and lookup continue; no claim that invisible abandoned sessions were measured. | AN-10 |
| AC-35 | Review the cart/order boundary with a synthetic future-type fixture, not a new storefront product. | Product type prevents collisions; future lines do not require MacBook fields or new cart/checkout/order routes/schema. Unknown production types still reject. | EXT-01, EXT-02, EXT-03 |
| AC-36 | Review the homepage, header/footer configuration and adapted commerce implementations. | Neutral positioning and working Skin Laptop entry; configurable Creativa shell built from existing patterns, with no main-brand commerce rewrite or framework migration. | BRAND-02, BRAND-03, NFR-01 |
| AC-37 | Browse published/inactive/draft designs and open unknown/reserved slugs on desktop/touch. | Only eligible designs appear, once each; primary/hover images and names/from-prices work without touch-hover dependency; reserved/unknown slugs never expose drafts; no out-of-scope filter controls. | ROUTE-02, CAT-01, CAT-02, CAT-07 |
| AC-38 | Enter blank, fractional, negative, non-finite or overflowing quantities through UI and direct submission. | Explicit validation, no coerced quantity, no unsafe arithmetic and no accepted invalid order. | PDP-06, PRICE-04 |
| AC-39 | Configure required fields with missing imagery, invalid/missing print path, model slug, duplicate/reserved product slug or invalid prices; attempt free-text/non-MacBook ordering. | Studio validates the amended fields without removed approval flags; adapted runtime rejects invalid/unregistered inputs. Model order/labels remain CMS-owned, physical fit is manually approved; no legacy wholesale migration, guide CMS, new dataset or speculative category. | MODEL-01, MODEL-02, CMS-03, CMS-04, CMS-06 |
| AC-40 | Inspect accepted orders, references and public create/lookup boundaries. | Unique array keys and valid case-sensitive 10-character prefix-free public references; cryptographically random identity and protected public projections; privileged fields cannot be client-set and documented abuse controls remain enforced. | ORDER-09, ORDER-10, NFR-02 |
| AC-41 | Retry an accepted intent/notification failure and inspect production integration behavior. | No routine duplicate notification/conversion; failure is diagnosable; no automatic shipment, payment reconciliation, category split or unpromised email/SMS/recovery service. | OPS-03, OPS-04, OPS-05 |
| AC-42 | Review legacy service URLs and new product metadata/offer output. | Separate service pages remain intact; new canonical/title/images/offers reflect current valid data with no fabricated prices, ratings or policies. | SEO-03, SEO-04 |
| AC-43 | Compare representative iPhone/Safari, other mobile, tablet and desktop layouts with supplied references. | Light image-first INUT treatment with exact `#fd4d01` primary and readable control/text contrast; usable gallery/controls without overflow or obscured actions; no copied account/review/Shop Pay/case features. | UX-01, UX-02, UX-04 |
| AC-44 | Inspect attribution/device reports, bounded catalog/network reads and simulated configuration/network failures; review release evidence. | Existing attribution/device context works without fingerprinting; bounded image/catalog loading and explicit errors; required targeted/lint/build/browser evidence uses authorized data, not production orders. | AN-03, NFR-03, NFR-04, NFR-06 |
| AC-45 | Force an ID collision, concurrent acceptance, exhausted allocation and replay of an accepted checkout; later change status/catalog data. | Collision never overwrites another order; allocation failure is explicit; accepted intent always retains the original public ID, separate from internal/analytics/idempotency identities; no product type is inferred from it. | ORDER-10, ORDER-11, ORDER-12 |
| AC-46 | Accept/recover checkout, repeat recovery, fail a fresh checkout, manually search and visit a shared link. | Only confirmed checkout creation/recovery inserts an unseen ID first; repeated ID stays once/in place; other flows do not add entries; storage contains public-ID strings only under the history key. | HISTORY-01, HISTORY-02 |
| AC-47 | Save more than 50 valid order IDs, reload and revisit both search pages after time/status changes. | No count cap, TTL or status pruning; all IDs remain reachable as labeled tags without prefetching every order. Browser limitations are communicated rather than promising cloud history. | HISTORY-03, HISTORY-04 |
| AC-48 | Click a saved tag from Creativa and from root while Lighters is selected; then test a stale ID. | One direct Creativa lookup without another submit/category step; stale ID uses normal tracking error/removal flow; root lighter manual lookup is unchanged. | HISTORY-05, TRACK-01, TRACK-02, TRACK-07 |
| AC-49 | Remove one shortcut, clear history and reload with a populated cart and existing server orders. | Only the intended history entries/key change; orders/cart/other storage remain untouched; no silent removal merely because an order is not found. | HISTORY-06, HISTORY-10 |
| AC-50 | Use SSR, malformed/non-array JSON, invalid/duplicate IDs, blocked storage and exhausted quota before/after acceptance. | Safe non-injected tags and visible recovery/warnings; no hydration reset, lost accepted order or request to repurchase; valid manual tracking/copy remains usable. | HISTORY-07, HISTORY-08 |
| AC-51 | Open tracking in another browser/shared device, inspect local-history messaging, and copy ID/link with allowed or denied clipboard access. | Browser-only/privacy limits are clear; no sync/auth claim; exact public ID or correct tracking URL copied on success, honest selectable fallback on failure. | HISTORY-09, TRACK-09 |
| AC-52 | Inspect telemetry for accepted-history save, tag activation, remove/clear, storage error and copy actions. | Lookup source/action/count/outcome fields only; no IDs/history/copied URLs or duplicate purchase conversions; automatic page telemetry remains sanitized. | AN-08, AN-09, AN-11 |

## 13. Exclusions and launch dependencies

The approved non-goals remain: other orderable categories, non-MacBooks, standalone keycap skins, artwork upload/editor, generated/model-specific previews, arbitrary coverage combinations, quantity discounts, universal INUT/lighter cart, accounts, reviews, coupons, payment gateways, fulfillment automation and a real guide publishing system.

| Owner/operational input | Gate affected |
| --- | --- |
| Production-approved model identifiers/groupings and Interior cut meaning | Required before enabling the corresponding products/options for real orders. |
| Curated owned/licensed designs and at least three approved images per design | Required before commerce catalog publication. |
| Independent shipping defaults/rules/fees | Required before checkout launch, including address-omitted behavior. |
| Creativa bank instructions and sales destinations | Required before enabling bank transfer/staff handoff in production. |
| Final brand/menu/footer wording and any displayed policies/claims | Required for final content/visual acceptance; no invented promises. |
| Supplied screenshot references | Already available; use for UI design/review, not as storefront assets. |
| Future guide content | Deferred; not a blocker for honest placeholders. |

No extra product type, stock promise, material statement, MOQ, shipping SLA or legal policy is inferred from an absent input.

## 14. Specification exit gate

**Gate outcome:** The specification and subsequent refinements are approved, including the documented CMS/color/bank amendments. All 116 requirement IDs and 52 AC IDs remain in scope. Full acceptance/deployment still require their actual authorized witnesses; earlier wording/results do not override the amendments.

Technical design must resolve the implementation of these requirements: internal schema/types and safe product-type extension, explicit public/server projections, configuration/cache freshness and quote review, idempotent write/recovery semantics, cryptographic short-ID allocation/uniqueness, snapshot/reference retention, deterministic shipping fallback, safe public order access, browser-history validation/storage failure and cross-tab mutation limitations, notification failure/retry visibility, cart hydration/cleanup and actual GA4/GTM/Umami dispatch/deduplication/privacy behavior.

Record design decisions against the requirement IDs and acceptance scenarios above. Then derive implementation tasks and verification coverage. Do not introduce a queue, new service, generalized product engine, migration or new commercial behavior merely to close a design detail without evidence that the existing stack cannot satisfy it.

### Repository evidence

- [Lighter checkout](../../pages/checkout/lighters.tsx): field optionality, payment default, shipping behavior and submit/notification pattern.
- [Lighter cart](../../store/cart/lightersCart.ts) and [order types](../../models/cart.ts): persistence, line identity and existing operational/payment vocabulary; not the Creativa business data source.
- [Lighter order API](../../pages/api/orders/lighters.ts) and [Sanity order schema](../../sanity/schemas/ordersLighter.js): existing order-write/idempotency and unique-array-key/reference patterns.
- [Shipping detection](../../utils/shippingDetection.ts) and [shipping schema](../../sanity/schemas/shippingFee.js): matching/default/fee reference, to be duplicated/configured independently for Creativa.
- [Analytics wrappers](../../utils/analytics.ts), [Umami mappings](../../utils/umamiAnalytics.ts) and [analytics guide](../../docs/ANALYTICS_GUIDE.md): existing event names/dispatch behavior. Do not assume direct reuse already meets this document's privacy or deduplication requirements.
- [Shared search](../../pages/order-tracking/index.tsx), [Creativa layout](../../components/layout/creativa.tsx) and [legacy product imagery](../../components/product/product-item.tsx): current routing, shell and image-interaction baselines.
