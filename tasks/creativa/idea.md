# INUT Creativa — Product Idea

## Latest checkout / delivery correction

Retain searchable payment selection through Firefox-safe inline Autocomplete, not error suppression. Clarify setup: published Sales Destination chooses recipients while a server-only token authenticates the bot. Local setup is corrected/readiness-verified with owner approval; existing failed order remains unresent by instruction.

## Latest transient-feedback refinement

Use global toasts for copy and cart-add outcomes so confirmations do not expand/shift the image-first page. Keep copied data out of toast text, preserve cart navigation/manual clipboard fallback and retain persistent warnings/order information inline.

## Latest transfer-memo decision

Direct/shared/reloaded eligible bank-transfer tracking now shows saved customer name + phone, separated by a space. Owner explicitly accepts link-holder visibility; the former buyer-only/ID-fallback choice is superseded. Copy matches displayed memo; no raw customer object, telemetry/URL/persistent storage copy or new payment/order behavior.

## Current sales / tracking refinement

Make saved orders image-first with readable colored status chips and compact local shortcut chips. Use the owner's sales-editable working order/production/financial fields while protecting private identity/recovery metadata. Owner chose buyer-only saved `Name - Phone` bank-transfer copy; shared/fresh tracking remains reference-only. Remove the attention menu, not notification retry safety. GA4 + Umami use client/session best effort without new Sanity analytics storage. See [S-01..S-06](./plan.md#sales--tracking-refinement--2026-10-23).

Subsequent explicit clarification supersedes that immutable-field wording: sales edits saved order/customer/date/production/totals/payment data directly, like Lighters, with no extra original copy. Private identities/recovery barriers remain protected; public tracking reflects saved working values and never invents unknown manual-row prices.

## Current owner refinement — compact purchase journey

Show the selected design's first image beside cart/checkout names; keep all live pages easy to backtrack through clickable breadcrumb ancestors/current text. Reduce type and whitespace to prioritize design images. White contained-primary text uses owner-approved dark orange `#ae3500` while brand primary stays `#fd4d01`. RHF/Yup and hook-owned SWR APIs streamline client ownership without changing prices, guest ordering, recovery or privacy. See [UI-01..UI-07](./plan.md#compact-ui--form-and-request-amendment--2026-10-23).

**SDD phase:** Approved idea; implementation and verification status are tracked in the revised plan and final report.
**Source:** [Original brief](./brief.md), owner clarification answers, and the supplied Uniqfind screenshots.
**Status:** Approved by the owner for the specification gate on 2026-10-22. See [specs.md](./specs.md) for detailed requirements and the subsequent selection, price-display and checkout-field clarifications.
**Latest revision:** Sales-editable human production records, buyer-only transfer copy, tracking/status/history refinements and no-Sanity-analytics session measurement, preserving the shared Creativa/ID/lighter boundary and orange/light style.
**Execution authority:** The [revised plan](./plan.md) is the implementation source of truth after reverse validation; the business goals and scope in this idea remain unchanged.

## Storefront continuation — 2026-10-23

The owner accepted the CMS authoring flow and authorized runtime/UI integration. Preserve a **light theme with primary `#fd4d01`**, using accessible text/hover variants without changing the root theme. Show the single **active primary** Creativa bank, never an arbitrary active account, and retain its accepted-order snapshot. Connect the new slug/rich-text/fee/profile/production-path shapes while preserving old orders and browser history. Follow the [plan's continuation](./plan.md#runtime-and-orange-light-continuation--2026-10-23) and requested audit/rework/routing/final-verification loop; real data mutation and launch approval remain separate.

**Current result:** Current Firefox/payment setup refinement focused audit/verification PASS at `fa13d7a`, with earlier scopes preserved historically. Existing Telegram retry remains declined. [Final verification](./final-verification.md) records current editable-record/direct-memo/session-only analytics decisions and keeps release blocked on E-01..E-04 rather than substituting fixtures for real deployment/owner/native evidence.

## CMS-first amendment — 2026-10-23

The owner approved a simpler Studio authoring workflow, implemented before adapting the storefront/API. Keep all legacy content first and Creativa last; prefix only root schema titles, not fields. Models use generated slug codes without fit fields. Creativa shipping and bank use independent records like the existing editors, including multiple bank profiles. Skin laptop uses a rich description, active default true and an absolute filesystem/shared-drive print path instead of approval/artwork-version/upload fields.

The path is metadata only, not browser storage or an uploaded/versioned file. Existing documents and accepted order snapshots are not migrated. Scoped CM-03..CM-06/CM-08 implementation and evidence are complete; CM-07 retains required external integration witnesses. Manual fit/asset ownership and production readiness remain owner responsibilities, not the removed CMS flags.

## 1. What we are building

INUT Creativa is a subbrand storefront on `inutdesign.com/creativa`, starting with ecommerce for ready-made MacBook skin designs.

Customers browse artwork, choose their MacBook model and skin coverage, see the configured price, and place an order without contacting sales to establish the product or price first. Staff receive the selected design, model, coverage and quantity, then print and fulfill the order manually.

The purchase journey follows the existing lighter ecommerce workflow, but uses Creativa branding, separate business data and configuration, and a clean, image-first interface inspired by Uniqfind.

**The commerce boundary is Creativa, not an individual product category.** Launch with laptop skins, but use one shared Creativa cart, checkout and order structure so customers can later buy skins and other Creativa products together in a single purchase.

**The central commercial rule:** artwork changes the appearance, not the price. Coverage determines the unit price; every supported MacBook model and design uses the same coverage-price configuration.

That pricing rule belongs to laptop skins; it does not impose coverage-based pricing on future Creativa product types.

This document defines the intended product and boundaries. It does not authorize implementation or prescribe final schema identifiers, API payloads, component architecture or task sequencing.

## 2. Why this exists

Today, `/san-pham/skin-laptop` and `/san-pham/skin-nut-phim` primarily help visitors choose a design and contact sales. Ordering, design coordination and delivery are handled manually.

Creativa introduces direct ordering for a deliberately simpler offer: ready-made laptop artwork with explicit model and coverage selections and predictable pricing. Production and fulfillment remain staff-operated.

The owner reports more than 70% mobile traffic and more than 60% iOS traffic. Mobile browsing and iPhone/Safari ordering are therefore primary experiences, not reduced versions of a desktop-first design.

## 3. Brand and expansion boundary

- Replace the current running/trail/trekking positioning on `/creativa` with a neutral INUT Creativa multi-product placeholder.
- Show Skin Laptop as the first live product category, with a clear link to its catalog.
- Keep the Creativa root suitable for future product types; do not make the whole subbrand synonymous with laptop skins.
- Use `/creativa/cart` and `/creativa/checkout` for every Creativa product type. Customers do not switch carts or repeat checkout just because they add another Creativa category.
- Do not build or advertise additional orderable categories in this MVP.
- Use a dedicated Creativa header and footer. Start with duplicated/configurable versions of the existing header/footer patterns and constant arrays, as requested; final content will be supplied later.
- Duplicate the existing cart, checkout and tracking implementations as starting points, then add Creativa-specific logic and data. Do not first refactor the root journey into a universal storefront or change its behavior to accommodate Creativa.
- Retain the existing main-brand header/footer behavior outside the Creativa journey.

Expansion means another Creativa category can join the same cart, checkout and order journey without overwriting existing items or forcing category-specific purchases. Product-specific selection and pricing rules stay with their category; customer, delivery, payment and order identity are shared within Creativa.

This is a shared **Creativa** commerce foundation, not a universal cart across the whole INUT website. Lighters remain independent. Build the common journey now, but do not implement speculative future categories, a configurable ecommerce framework or a new platform.

## 4. Audience and primary journey

The initial customer owns a supported MacBook, wants an existing skin design, and needs confidence about appearance, fit, coverage and total cost before ordering.

The primary journey is:

1. Enter the new catalog directly, through `/creativa`, or from a legacy ordering CTA.
2. Browse/search designs and open a product.
3. Inspect the gallery, choose a supported MacBook model, choose one coverage option and select quantity.
4. Add the configured item to the shared `/creativa/cart`; continue browsing without losing existing items.
5. Review the combined cart and proceed through guest checkout at `/creativa/checkout`.
6. Provide customer/delivery information, review shipping and choose COD or bank transfer.
7. Submit one Creativa order, receive one prefix-free 10-character reference, save it to this browser's local order-ID history and view `/creativa/order-tracking/[slug]`.
8. Staff receive the order through Creativa-specific sales notifications and process it manually.

No account, artwork upload, design editor or design-approval exchange is required for this journey.

When another Creativa product category launches, customers can add it alongside skins, review every line together and complete one checkout with one customer/delivery form, one payment selection and one order reference. That future category's product-specific features are not being built in this MVP.

Returning customers can search from `/creativa/order-tracking` within the subbrand, or enter through the root site's `/order-tracking` page. Both entry points resolve Creativa orders to the same category-neutral order-detail route, including future mixed-product orders.

## 5. Storefront and route scope

These are public URL patterns, not literal filenames. Use readable product slugs rather than internal Sanity document IDs.

| Route | Intended experience |
| --- | --- |
| `/creativa` | Neutral multi-product subbrand placeholder; Skin Laptop is the first live entry. |
| `/creativa/skin-laptop` | All published Creativa laptop-skin designs, with search and incremental browsing. |
| `/creativa/skin-laptop/[slug]` | Design gallery, MacBook model, coverage, price, quantity and add-to-cart action. |
| `/creativa/cart` | One Creativa-wide cart, ready for items from different Creativa categories, using the Creativa header/footer. |
| `/creativa/checkout` | One guest checkout for the combined Creativa cart, using the Creativa header/footer. |
| `/creativa/order-tracking` | Dedicated Creativa tracking search by order reference, with saved-ID tags below the input and no product-category selector. |
| `/creativa/order-tracking/[slug]` | Confirmation/tracking for one Creativa order and all its lines; the slug is its prefix-free 10-character public ID, not a product/category. |
| `/order-tracking` | Existing main-brand search; add the Skin Laptop option plus labeled Creativa saved-ID tags that enter Creativa directly. |
| `/creativa/skin-laptop/huong-dan-su-dung` | Usage-guide placeholder/index entry point. |
| `/creativa/skin-laptop/huong-dan-su-dung/[slug]` | Reserved article route/placeholder surface; real article publishing comes later. |

The entire Creativa storefront and purchase/tracking journey lives under `/creativa` and uses its dedicated header/footer. Cart links, checkout actions, order-success navigation and subbrand tracking links stay in this namespace. Product browsing remains category-specific, but cart, checkout and order detail are category-neutral.

The shared routes supersede the earlier category-specific cart, checkout and tracking proposal; do not implement parallel per-category purchase journeys.

### Tracking from either brand

- `/creativa/order-tracking` is a separate, Creativa-branded copy of the tracking-search experience, adapted to find any Creativa order by reference without asking which product category it contains.
- `/order-tracking` retains the existing main-brand shell and lighter lookup behavior, while adding a Skin Laptop dropdown item.
- From the root screen, selecting Skin Laptop and submitting an order reference navigates to `/creativa/order-tracking/[slug]`. This option selects the Creativa order domain; it must not restrict lookup to orders containing only skins.
- Submitting a reference from `/creativa/order-tracking` navigates to the same `/creativa/order-tracking/[slug]` route.
- A customer arriving through the root website can therefore find a skin order without first knowing the Creativa storefront exists.
- Keep the existing `/order-tracking/lighters/[slug]` journey unchanged.
- Confirmation after checkout and later lookups use the same Creativa order-detail route, showing every order line with its own product type and selections.
- Adding another Creativa category must not require another cart, checkout, order-detail URL or mandatory tracking-category choice. Root dropdown wording can evolve to describe Creativa's broader catalog without changing order lookup.

### Short order IDs and browser-local shortcuts

- Use one **prefix-free public order ID of exactly 10 cryptographically random URL-safe characters** from `A-Z`, `a-z`, `0-9`, `_` and `-`; for example, `q7Km_2xP9a`.
- The full public ID is 10 characters, not a product/brand prefix plus a suffix. It is case-sensitive and works for skin-only and future mixed-product orders. The route/data source identifies Creativa; do not infer product types from the ID.
- Generate/check uniqueness on the server. The accepted ID is permanent and unchanged by submission retries, recovery or status updates. Keep it distinct from the internal Sanity document ID and analytics transaction identity.
- Show the ID and a way to copy either the ID or its tracking URL on confirmation/detail, so the customer can save it outside the browser too.
- After confirmed order creation or recovery of an accepted checkout, remember the ID in a dedicated localStorage **array of IDs only**. Add a previously unseen ID at the front; do not duplicate or reorder an already saved ID.
- There is **no application-imposed count cap or automatic expiry**. IDs remain until the customer removes them, clears history or the browser clears/evicts storage. Browser storage capacity is not unlimited.
- Offer removal of an individual saved shortcut and clearing of the local history. These actions never cancel/delete an order or change the cart.
- Both tracking search pages show clearly labeled saved Creativa ID tags below the input. One tap opens `/creativa/order-tracking/[id]`; root-page tags resolve the Creativa domain directly without another dropdown choice.
- Read the latest saved history when entering either search page. No login, cross-device synchronization or cloud history is implied; anyone sharing this browser may see the shortcuts.
- Do not automatically save manually searched/shared references, preload every saved order, or create another order/purchase event when a tag is opened. A stale/not-found ID follows the normal tracking error flow and remains removable.
- If localStorage is blocked, full or corrupt, explain that local history could not be read/saved and preserve normal tracking. A saved order remains successful; its ID/copy actions stay available. Never ask the customer to resubmit an accepted order merely because local saving failed.

Reserve `huong-dan-su-dung` so it cannot also become a product slug.

### Catalog

- Compact, image-first grid with **two columns by default on mobile**.
- Provide a visible mobile toggle between **one-column** and **two-column** layouts, with a clear selected state, following the supplied catalog screenshot.
- Switching layout changes presentation only: keep the current search, loaded products and ordering rather than resetting the browsing journey.
- One card represents one artwork/design, not a separate card for every MacBook/coverage combination.
- Search by design name, with newest-first default ordering.
- Incremental loading/pagination makes all published designs reachable without requiring one unbounded initial load.
- Loading, empty, search-no-results and retryable error states are part of the experience.
- No price filters, complex facets, collection/tag filters or additional sorting in MVP.

### Product detail and imagery

- At least three owner-supplied images per design: lưng, đáy and kê tay/interior.
- Follow the existing `/san-pham/skin-laptop` image behavior: primary catalog image and a secondary image on desktop hover when available.
- Follow the existing detail-gallery behavior: carousel, indicators/navigation, selectable thumbnails and click-to-open lightbox.
- Retain an understandable touch experience; essential information must not depend on hover.
- MacBook and coverage selectors determine the ordered item. They do not introduce coverage-linked gallery switching, per-model photography requirements or generated previews in MVP.
- The light visual treatment changes the presentation, not the established gallery interaction model.
- Product, model and coverage must be available and valid before the customer can add the configured item.
- Start with no selected MacBook model, quantity 1 and the first active coverage selected; the initial coverage order puts Lưng first.
- Catalog cards show the lowest active coverage price as a from-price. Product detail shows the selected coverage's exact price, initially Lưng rather than the catalog minimum.

## 6. Product, model and pricing rules

### Product identity

A product is a ready-made artwork/design with its own name, readable slug and ordered image gallery.

MacBook model and coverage are selections attached to the design. They are not separate artwork products. Launch designs are curated and published into the new Creativa catalog; legacy products do not become orderable automatically.

### MacBook support

- MacBook only at launch.
- The supported-model list is configured in the CMS, not hardcoded into the storefront.
- Use the supplied Uniqfind model dropdown as the initial label/grouping/order reference, with a single selected model and a scrollable option list.
- All published designs offer all active supported models and active coverage options in MVP.
- Unsupported devices are not orderable through an arbitrary free-text model field.
- Exact production identifiers and compatible cut templates still require confirmation before a model is made orderable; a screenshot label is not proof of production compatibility.

Initial CMS model choices, transcribed from the [supplied model screenshot](./references/uniqfind-macbook-models.png):

| Order | Reference display label |
| --- | --- |
| 1 | MacBook Air 13" (M2/M3/M4/M5) |
| 2 | MacBook Air 15" (M2/M3/M4/M5) |
| 3 | MacBook Neo |
| 4 | MacBook Pro 14" (M1/M2/M3/M4/M5) |
| 5 | MacBook Pro 16" (M1/M2/M3/M4/M5) |
| 6 | MacBook Pro 13" (2020/M1/M2) |
| 7 | MacBook Air 13" (2018-2020/M1) |
| 8 | MacBook Pro 13" (Touch Bar 2016-2019) |
| 9 | MacBook Pro 13" (No Touch Bar 2016-2019) |
| 10 | MacBook Pro 16" (2019) |
| 11 | MacBook Pro 15" (2016-2019) |
| 12 | MacBook Air 13" (2012-2017) |
| 13 | MacBook Air 11" |
| 14 | MacBook Pro 12" (2015-2017) |
| 15 | MacBook Pro 13" (Retina, 2012-2015) |
| 16 | MacBook Pro 15" (Retina, 2012-2015) |

These are reference labels, not independently verified Apple model names or interchangeable cutting templates. In particular, validate the screenshot's “MacBook Pro 12"” wording and grouped generations before publishing them as supported. Do not silently replace the supplied labels or assume every grouped generation shares an identical physical fit. The CMS remains authoritative for the final labels, order and active choices.

### Coverage and initial prices

Coverage is one mutually exclusive preset, not an arbitrary checklist of independently priced areas.

| Coverage | Meaning in this idea | Initial unit price |
| --- | --- | --- |
| Lưng | Exterior top/lid skin. | 120,000 VND |
| Đáy | Exterior bottom skin. | 100,000 VND |
| Interior | The coverage option described in the brief as “Phím + kê tay”; use Interior as the reference concept. | 150,000 VND |
| Full | Lưng + Đáy + Interior. | 310,000 VND |

These are owner-confirmed initial prices. The CMS is the source of truth after configuration; the numbers are not per-product constants.

- All designs and supported models use the same coverage prices.
- Quantity multiplies the selected coverage price; there are no quantity-price tiers in MVP.
- Full is its own configured bundle price, not the sum of the other prices.
- No separate Lưng + Đáy preset or other combinations are included unless the scope is changed.
- Interior is an option within a laptop-skin product, not a standalone skin-nut-phim category.
- The precise physical Interior cut template, including what is and is not covered around/on the keyboard, must be approved with production assets. The label alone must not be treated as confirmation of individual key stickers.

### Price and availability changes

If CMS prices change while an item is in a cart, show the updated amount for customer review before submission. Do not silently submit a higher or stale amount.

Inactive/deleted products, models or coverage options must not remain purchasable through an old cart. Explain the affected selection and let the customer correct/remove it.

Once placed, an order retains each line's product identity, type-specific selections and prices agreed at submission. For skins, that includes design/model/coverage. Later catalog edits must not rewrite the production meaning or financial history of an existing order.

## 7. Cart, checkout and operations

### One shared Creativa cart

- All Creativa categories use the same cart, checkout and order domain. Only laptop skins are orderable at launch; future categories join this foundation rather than receiving separate carts.
- Creativa and lighters still have separate carts, checkouts and orders.
- Each cart line carries an explicit product type, product identity, selected configuration, quantity, display information and price. Product type prevents identifier collisions and determines which selection/pricing rules apply.
- A skin line is identified by **product type + design + MacBook model + coverage**. Different selections remain separate lines; adding the same combination increases its quantity. Future categories use their own relevant configuration, not mandatory MacBook/coverage fields.
- Display the correct type-specific details for each line within one consistent cart and order summary.
- Support quantity changes, removal, combined totals and persistence across reloads and navigation between categories.
- Every Creativa add-to-cart action and header cart indicator targets the same cart. Visiting another category must not replace the cart or hide items from other categories.
- Adding, changing, submitting or clearing the Creativa cart never changes the lighter cart.
- Preserve the existing `inut-lighters-cart` persistence key and behavior. The specification sets a distinct **Creativa-wide**, not skin-specific, persistence key.
- If a line becomes unavailable or unsupported, identify it clearly and preserve the other lines. Require correction/removal before checkout rather than silently dropping it or accepting an incomplete order.

### One checkout and one order

Reuse the existing lighter journey's business pattern, not its product assumptions or quantity-tier pricing:

- One guest checkout with shared customer/contact, delivery and optional note fields for the entire cart. Match the lighter form: name and a 10-digit phone are required; address, email and note are optional.
- One Creativa order containing all submitted lines, with a single customer-facing order reference, payment selection and order-level totals. Do not silently split the cart into category-specific orders.
- Shipping selection/detection and fee calculation using Creativa's own configured shipping rules, applied to the combined order. Do not automatically add a separate shipping charge per category; any future category-specific shipping constraints need an explicit policy.
- COD and bank transfer; no new online payment gateway.
- Line totals, combined merchandise total, shipping and final payable amount are visible before submission.
- Validate every line using its product type's selections and authoritative pricing, then validate order-level fees/totals. Skin coverage pricing applies only to skin lines; a browser-supplied total is not sufficient.
- Prevent repeated submissions/retries from creating duplicate orders.
- Preserve the cart and show an actionable error if order creation fails.
- Accept the submitted cart as one complete order, or show a failure without reporting partial success. Duplicate protection applies to the whole order, not independently to each product category.
- After successful creation, show the order reference and confirmation/tracking screen; clear only the successfully submitted Creativa cart, never the lighter cart.
- Remember the accepted public ID in the separate local history without treating localStorage success as a condition for order acceptance.
- Keep cart, checkout, confirmation and subsequent tracking navigation under `/creativa`; no root-branded transaction screen is part of this purchase flow.
- Bank-transfer instructions use Creativa's configured bank details. Order creation does not itself mean payment was received.
- Successful-order notifications use Creativa-configured recipients.

The production handoff, notification and tracking summary must preserve every line's product type and relevant configuration. For skins, staff must unambiguously see each design, MacBook model, coverage and quantity, plus the shared customer, delivery and payment information.

Staff confirm, print and fulfill orders manually. Follow the existing operational status pattern where appropriate, without automatically connecting Creativa to the lighter carrier/shipping integration or claiming new fulfillment automation. Multi-warehouse routing, automatic order splitting, split payments and partial-shipment orchestration are not part of this MVP.

## 8. CMS and configuration separation

**Owner decision: separate everything in the Creativa business domain, including shipping, banking and sales recipients.**

Use new Sanity schemas rather than reusing legacy product or order schemas. Clone the relevant existing patterns and adapt them for this domain. Keep skin catalog/model/coverage data product-specific, but make Creativa cart, checkout and order records shared across its product types.

Only root Creativa document titles use the exact requested prefix **`Creative - `**. Fields, nested objects and subordinate lists use readable unprefixed labels. The public brand remains **INUT Creativa**. The CMS-first amendment governs the current internal field/record shapes.

| Separate Creativa data/configuration | Purpose |
| --- | --- |
| Laptop-skin products/designs | Name, slug, ordered images, rich description, active default true and absolute `printAssetPath` metadata; no production flag/artwork ID/version/upload field. |
| Supported MacBook models | Skin-specific orderable model names/identifiers and activation. |
| Skin coverage and shared prices | Initial four presets, VND prices and activation, shared across skin designs only. |
| Creativa orders | One immutable prefix-free 10-character public reference, separate internal identity, typed product lines, selection snapshots, shared customer/delivery information, financial snapshots and operational/payment state. |
| Shipping settings | Independent Creativa fee records with name, slug, fee and note, like the existing Shipping Fee editor. |
| Bank information | Independent Creativa bank profiles with the legacy editor's active/primary/display-order controls. |
| Sales-notification configuration | Creativa-specific notification destinations/recipients. |

An admin change to Creativa's shipping, bank details or recipients must not change the main brand/lighter settings, or vice versa. The actual values may happen to match, but their configuration ownership is independent.

“Separate” does not require another Sanity project, dataset, deployment or duplicated secrets. Existing infrastructure and safe utilities may be reused; business schemas/configuration must remain independent. Credentials remain server-side and are not exposed through browser configuration.

Future product categories may introduce their own catalog data and selection/pricing rules, while using the same Creativa order structure and shared checkout configuration. Do not make new order schemas per category or force future products into skin-specific fields. The next specification should define this explicit, type-safe extension boundary without implementing unknown product types now.

Do not create a guide/article CMS now. That content system is explicitly deferred.

## 9. Legacy pages and SEO continuity

Keep these existing families available, including existing detail pages:

- `/san-pham/skin-laptop` and `/san-pham/skin-laptop/[slug]`
- `/san-pham/skin-nut-phim` and `/san-pham/skin-nut-phim/[slug]`

They become legacy discovery/SEO surfaces rather than the active ordering journey.

- Preserve reachable URLs, useful content, internal discovery and indexability; do not remove them or blanket-redirect them to Creativa.
- Ordering-related CTAs on those surfaces lead to `/creativa/skin-laptop`, not the old manual order/contact flow.
- This includes actions framed as requesting/placing an order; general support links should not be mistaken for a second checkout.
- Do not assume a one-to-one mapping between old designs and the curated new catalog.
- Do not invent redirects, product availability, offer prices or structured-data claims to make legacy pages appear to sell the new catalog.
- New product URLs describe the new commerce-ready products with their own accurate metadata.

The intent is to preserve existing discovery while shifting conversion to Creativa. Keeping URLs alone cannot guarantee unchanged search rankings.

Separate customization service pages outside these legacy catalog families are not being rebuilt or removed by this idea.

## 10. Visual direction and guide placeholders

### Visual direction

The owner's desired impression is **clean, clear and professional**:

- Light theme; product images lead the page.
- Use the supplied screenshots as the visual reference: warm off-white page surfaces, white image areas, restrained dark reddish-brown text/accents, thin borders and minimal card decoration, adapted to final INUT branding.
- Compact, purposeful spacing rather than oversized editorial gaps.
- Clear hierarchy for design imagery, model, coverage, price and purchase action.
- Desktop product composition places a broad image area beside a narrower purchase-information panel. Mobile places the large gallery and pagination indicators above the title, price and stacked selection controls.
- Use a clearly labeled model dropdown, full-width bordered radio-style coverage choices and an obvious add-to-cart action; preserve the confirmed four coverage presets rather than copying Uniqfind's different option bundles.
- Catalog cards emphasize large consistent product imagery, readable names and accurate VND price information; the mobile layout controls remain easy to reach.
- Close reference to Uniqfind's shopping structure, adapted to INUT branding and the confirmed feature set.
- Mobile-first controls and layouts, with iOS/Safari treated as a primary environment.
- INUT-owned/licensed artwork, photos and approved copy; do not import Uniqfind's assets, claims, reviews, delivery terms or warranty promises.
- No Uniqfind-style case/protection upsell: this launch sells skins.

Reference URLs:

- [Uniqfind product detail](https://www.uniqfind.com/products/hot-toddy-plaid-macbook-skin-case?variant=51274338959492)
- [Uniqfind collection](https://www.uniqfind.com/collections/macbook-cases?page=1#db05f66c669805d21858d2a5dc8daa95)

Owner-supplied visual evidence is preserved beside this document:

| Reference | Intended use |
| --- | --- |
| [MacBook model dropdown](./references/uniqfind-macbook-models.png) | Initial model labels, grouping and selector structure. |
| [Desktop product detail](./references/uniqfind-product-desktop.png) | Image/purchase-panel balance and selection hierarchy. |
| [Mobile product detail](./references/uniqfind-product-mobile.png) | Large image-first carousel and stacked product information. |
| [Desktop catalog](./references/uniqfind-catalog-desktop.png) | Image-led product grid and restrained card treatment. |
| [Mobile catalog](./references/uniqfind-catalog-mobile.png) | Compact two-column default and one/two-column toggle. |

The screenshots now provide the visual basis that was missing during initial clarification. They are design references, not storefront assets or a requirement to add every pictured feature. Accounts, reviews, currency switching, advanced filters, Shop Pay/accelerated payment and case upsells remain outside the confirmed scope. Existing gallery interactions remain the functional baseline; final responsive composition belongs in the UI specification.

### Guides

Reserve the guide index and article route family now and show honest placeholder/coming-soon messaging. A usable article publishing system, real guide library and guide CMS are **not** part of this MVP.

Do not publish invented application instructions, fake article lists or indexable article placeholders that imply substantive guidance already exists. Guide content and its management approach will be defined in a later phase.

## 11. Ecommerce analytics

Track the data needed to understand discovery, product decisions, checkout friction and order conversion across both brands' entry points. Use the repository's dual GA4/GTM and Umami conventions, not a separate analytics stack.

| Business question | Signals to capture |
| --- | --- |
| Where do skin shoppers enter the journey? | Creativa/legacy/root entry source, catalog/product views and legacy-to-Creativa ordering CTA clicks, with available campaign/referrer attribution. |
| Can customers find designs? | Catalog/list impressions, product selections, design searches, result counts/no-results and incremental-load success/failure. |
| How do customers browse visually? | Mobile one/two-column toggle changes, gallery navigation and lightbox opens, with image position where useful. |
| Which product configurations are wanted? | Product type and its relevant selections; for skins, design, MacBook model and coverage; quantity changes and valid add-to-cart attempts/outcomes. |
| Where does cart intent drop? | Cart views, quantity changes, removals, begin-checkout actions and unavailable-selection/price-change friction. |
| Where does checkout fail or stop? | Shipping/payment selections, validation error categories, submit attempts, order-creation errors and abandoned checkout where observable. |
| Which sessions become orders? | Confirmed combined-order creation, each line's product type/configuration, quantities, VND merchandise value, shipping and final amount, deduplicated per order. |
| Can customers find their orders? | Tracking entry point (`root` or `creativa`), order domain selected at the root when applicable, search submissions and lookup success/not-found/error outcomes. |
| Do local shortcuts help customers return? | Manual versus saved-tag lookup source, history removal/clear actions, copy-action outcomes and safe local-storage error categories; never the saved IDs or array contents. |
| When is support needed? | Relevant support/contact CTA clicks with their journey step. |

### Measurement rules

- Include consistent subbrand, product type/category, product identifier, quantity, VND value and journey step where relevant. Design/model/coverage identifiers are skin-line properties, not required fields on every future product or the order as a whole.
- Preserve acquisition attribution and the browsing context needed to compare mobile/iOS behavior and one-column versus two-column use. Prefer existing device/browser reporting rather than introducing fingerprinting.
- Track meaningful user actions at their source, not on every render. Product/list impressions need a deliberate view lifecycle; layout changes must not accidentally inflate product-view or purchase counts.
- Emit one successful-order conversion per accepted order in each tracker, including after retries, reloads or return visits to tracking. A mixed-product order is one conversion containing multiple typed line items, not one purchase event per category. Searching for an existing order is not a new purchase.
- Distinguish an **order placed** from **payment received**, especially for COD and bank transfer. Report submitted-order value honestly; do not label it settled revenue.
- Use only non-sensitive transaction identifiers for conversion deduplication, not public order-lookup credentials.
- Do not send customer names, phone numbers, email addresses, delivery addresses, notes, raw order-search references or raw error payloads to analytics. Mask order references in tracked URLs/page titles; sanitize or omit free-text search terms that may contain personal data.
- Treat stored public order IDs as sensitive lookup references, not analytics properties. Record shortcut/copy usage without transmitting the ID, tracking URL or local history contents.
- Analytics unavailability must not block cart, checkout or tracking. Respect the existing consent/disabled-tracker behavior, and do not promise complete abandoned-session visibility when browser restrictions prevent it.
- Reuse established event names where possible. Final event names, triggers, allowed properties and any additions to `docs/ANALYTICS_GUIDE.md` belong in the next specification.

The intended reporting outcomes are funnel conversion/drop-off, popular designs/models/coverage, submitted order value and average order value, mobile layout usage, checkout error rates and tracking-search success by entry point. A new reporting dashboard or data warehouse is not implied.

## 12. Explicit non-goals

- Running/trail/trekking merchandise functionality or other new Creativa categories.
- Windows/non-MacBook ordering.
- Standalone skin-nut-phim products.
- Customer artwork uploads, a visual customizer, generated mockups or design approval.
- Model-specific live imagery or coverage-synchronized image switching.
- Arbitrary coverage combinations, per-design pricing or quantity discounts.
- A universal cart/order across Creativa and the main-brand lighter business. The shared cart across Creativa's own categories is explicitly in scope.
- Accounts, loyalty, wishlists, reviews, coupon tooling or payment gateways.
- New automated carrier fulfillment, promised automatic bank-payment reconciliation, automatic category-based order splitting, split payments or partial-shipment orchestration.
- A full usage-guide library, guide CMS, comments or video/course platform.
- Rebuilding unrelated service pages or migrating the legacy catalog wholesale.

## 13. What successful delivery looks like

These are product outcomes to carry into the next specification, not a completed test report:

1. A mobile visitor can browse/search designs, switch between one/two columns without losing browsing state, inspect the existing-style gallery, choose a valid MacBook and coverage, and place an order without manual price negotiation.
2. The four configured coverage prices apply consistently across every published design/model; quantities and shipping produce an understandable final total.
3. The same design ordered for different models/coverage remains distinguishable in the shared cart, combined order, sales handoff and tracking view.
4. CMS edits to shared prices/options affect current shopping appropriately without altering placed orders.
5. Creativa products, orders, carts, shipping, banking and recipients remain isolated from the existing lighter business flow.
6. One cart at `/creativa/cart`, one checkout at `/creativa/checkout` and one order-detail route at `/creativa/order-tracking/[slug]` use the Creativa header/footer. Both tracking entry points reach that order detail without changing lighter lookup.
7. Legacy URLs remain useful and reachable while their ordering CTAs enter the new catalog.
8. Guide surfaces accurately communicate that content is coming later.
9. GA4/GTM and Umami reveal the ecommerce funnel, configuration preferences and tracking outcomes without duplicate conversions, personal-data leakage, mislabeling skin purchases as lighters or treating unpaid orders as settled revenue.
10. The cart/order contract distinguishes product types and their own selections, allowing a future Creativa category to join the same customer/payment/order journey without creating another cart, checkout or order schema. Launch verification uses the actual skin catalog; no invented future category needs to be published to demonstrate this boundary.
11. Every accepted Creativa order has one stable, unique, prefix-free 10-character public ID; retries do not create another ID or order.
12. Successful creation/recovery remembers the ID once in uncapped browser-local history. Both tracking search pages expose one-tap saved-ID tags, with local removal/clear controls and graceful storage-failure behavior.

## 14. Inputs and next SDD gate

The following are owner-provided inputs, not permission to invent missing facts:

| Input | Needed for |
| --- | --- |
| Production verification of the supplied model labels, exact identifiers and cut-template compatibility | Safe activation of the screenshot-based CMS model list. |
| Initial curated designs and owned/licensed gallery assets | Catalog population and visual review. |
| Interior physical coverage/cut-template confirmation | Accurate product descriptions and production handoff. |
| Supplied Uniqfind screenshots, now preserved in `references/` | Visual reference is available; detailed UI acceptance still belongs to the next phase. |
| Final Creativa brand/navigation/footer wording | Dedicated storefront shell. |
| Independent shipping rules/fees, bank details and sales destinations | Operational checkout configuration before launch. |
| Approved material, availability, delivery, warranty or policy claims, if displayed | Truthful product and checkout messaging. |
| Future guide content | Later guide/content phase, not a blocker for honest placeholders. |

**Gate outcome:** The owner approved the idea, specification, design, plan, test strategy and refinement, then authorized feature-branch implementation. Code and audit work are recorded in [plan.md](./plan.md); [final-verification.md](./final-verification.md) retains the unresolved launch/acceptance witnesses. Approval is not deployment or production-data authorization.

### Repository evidence consulted at idea clarification

- [Creativa homepage](../../pages/creativa/index.tsx): originally had the running/trail positioning now replaced by the implementation.
- [Creativa layout](../../components/layout/creativa.tsx) and [header entry](../../components/common/header/index.tsx): the original layout shared the root footer; the delivered Creativa layout now has its own shell.
- [Legacy catalog](../../pages/san-pham/skin-laptop/index.tsx), [product card imagery](../../components/product/product-item.tsx) and [detail gallery](../../pages/san-pham/skin-laptop/[slug].tsx): the image-interaction baseline, not the new light-theme styling.
- [Lighter cart](../../store/cart/lightersCart.ts), [checkout](../../pages/checkout/lighters.tsx), [order API](../../pages/api/orders/lighters.ts) and [order models](../../models/cart.ts): workflow reference and contracts to keep isolated.
- [Shared tracking search](../../pages/order-tracking/index.tsx) and [lighter tracking detail](../../pages/order-tracking/lighters/[slug].tsx): existing lookup/confirmation pattern to extend without regression.
