# 📊 Inut Design Analytics Guide

A single, comprehensive reference for Google Analytics 4 (GA4), Google Tag Manager (GTM), and Umami.js setup, architecture, implementation, and troubleshooting for the Inut Design e-commerce platform.

---

## 🚀 Quick Start

1. **Update Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Set your GA4 Measurement ID (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)
   - Set your GTM Container ID (`NEXT_PUBLIC_GTM_ID`)
   - Set your Umami Website ID (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`)
   - Enable/Disable Umami (`NEXT_PUBLIC_ENABLE_UMAMI=true`)

2. **Build & Deploy**
   ```bash
   pnpm build
   git add .
   git commit -m "feat: enhance analytics tracking"
   git push origin main
   ```

3. **Verify Tracking**
   - **GA4/GTM**: Visit your site, open Chrome DevTools → Network tab → filter by `collect`.
   - **Umami**: Open DevTools → Network tab → filter by `send`.
   - **Console**: In development, look for `[GA Debug]` and `[Umami Debug]` logs.

4. **Mark Conversions**
   - In GA4: Mark `order_button_click`, `contact_click`, `form_submit`, `purchase` as conversions.
   - In Umami: Events are automatically available for filtering and reporting.

---

## 🏗️ Analytics Architecture

- **Single source of truth:** All tracking is handled via `utils/analytics.ts` which wraps both GA4 (via `gtag`) and Umami (via `umamiAnalytics.ts`).
- **Event flow:**
  - User action (click, view, submit)
  - React handler calls tracking function (e.g., `trackAddToCart`)
  - Tracking function sends event to:
    - **GA4/GTM** via `window.gtag`/`window.dataLayer`
    - **Umami** via `window.umami.track`
- **Tracked events:**
  - **E-commerce**: `view_item`, `select_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `purchase`
  - **Conversion**: `order_button_click`, `contact_click`, `phone_click`, `zalo_click`, `form_submit`, `social_click`, `cta_click`
  - **Engagement**: `page_view`, `search`, `outbound_click`, `download`, `video_engagement`, `time_on_page`, `scroll_depth`, `cart_view`
  - **Content**: `service_click`, `blog_post_click`, `blog_post_view`

---

## 💻 How to Implement Analytics for New Functions

- **Import the relevant function from `@/utils/analytics`** (which exports from `utils/index.ts`)
- **Call the function at the source of user action** (onClick, onSubmit, useEffect, etc.)
- **Include meaningful context** (product name, category, value, etc.)

### Examples

#### Product Card Click
```tsx
import { trackSelectProduct } from "@/utils";
<ProductCard onClick={() => trackSelectProduct({ id: product._id, name: product.name, category: "Laptop Skin" }, "Homepage List")} />
```

#### Product Detail View
```tsx
import { trackViewProduct } from "@/utils";
useEffect(() => {
  trackViewProduct({ id: product._id, name: product.name, category: "Laptop Skin", brand: "INUT Design", price: product.price });
}, [product]);
```

#### Add to Cart
```tsx
import { trackAddToCart } from "@/utils";
<Button onClick={() => { 
  trackAddToCart({ id: product._id, name: product.name, category: "Laptop Skin", price: unitPrice, quantity: qty }); 
  /* ...add to cart logic... */ 
}}>Thêm vào giỏ</Button>
```

#### Service Navigation
```tsx
import { trackEvent } from "@/utils";
<ServiceCard onClick={() => trackEvent("service_click", { service_title: title, service_path: href })} />
```

#### Blog Interaction
```tsx
import { trackEvent } from "@/utils";
// View post
trackEvent("blog_post_view", { post_title: post.title, post_slug: post.slug });
// Click post in list
trackEvent("blog_post_click", { post_title: post.title, post_slug: post.slug });
```

#### Custom Event
```tsx
import { trackEvent } from "@/utils";
trackEvent("custom_event_name", { category: "engagement", label: "button_label", value: 1 });
```

#### See `/docs/ANALYTICS_QUICK_REFERENCE.md` for more code patterns (now merged here).

---

## 🔔 Reminders & Best Practices

- **Track at the source of user action** (not after API success)
- **Use specific, meaningful event names**
- **Always include product/context info**
- **Test in development** (look for `[GA Debug]` in console)
- **Avoid duplicate events** (track once per action)
- **Check GTM ID format** (`GTM-XXXXXXX`)
- **Verify events in GA4 Realtime and Tag Assistant**
- **Currency tracked is VND**
- **Consider GDPR if serving EU users**

---

## 🐛 Troubleshooting

- **No events in GA4?**
  - Check `.env.local` for correct IDs
  - GTM ID must start with `GTM-`
  - Build and deploy again
  - Check browser console for errors
  - Use Tag Assistant extension
- **Duplicate events?**
  - Old gtag scripts must be removed (already fixed)
- **GTM not loading?**
  - Container must be published
  - ID must match GTM dashboard
- **Events not firing?**
  - Check for `[GA Debug]` messages
  - Check network requests to `google-analytics.com/g/collect`

---

## 📈 What You Can Track

- Product views, clicks, add-to-cart, checkout, purchases
- Conversion funnel (view → click → order)
- Contact clicks, form submissions, Messenger/phone/social engagement
- Traffic sources, campaign effectiveness
- User journey, drop-off points, time on page
- Custom events for any new feature

---

## 📚 Documentation Index (Merged)

- **Quick Start** (this section)
- **Architecture** (see above)
- **Implementation Patterns** (see above)
- **Reminders & Troubleshooting** (see above)
- **What You Can Track** (see above)

---

## ✨ Success Criteria

- All events tracked in GA4
- Conversions marked in GA4
- No console errors
- Real-time events visible
- Week 1 data looks reasonable
- Actionable insights for marketing and product decisions

---

**For further help, see this file or ask your friendly Copilot!**

## INUT Creativa: isolated commerce measurement

Creativa uses `utils/creativa/analytics.ts` with the existing guarded GA4 and
Umami primitives. Do not additionally call the legacy combined ecommerce helpers
for the same Creativa action. Keep changes on `feat/creativa`; this feature's
workflow does not authorize a push or merge to `main`.

Common context is `storefront=creativa`, `currency=VND`, the journey surface and
public catalog identifiers. Model/coverage identifiers belong to skin items.
GA4 discovery/cart events include `items`; Umami receives bounded scalar context.
`view_item` maps to Umami `product_view`, and `select_item` to `product_click`.

| Event | Producer and trigger | Safe context |
| --- | --- | --- |
| `page_view` | Creativa app route lifecycle for GA4; automatic Umami lifecycle only | Sanitized path/location/referrer, generic tracking title |
| `view_item_list`, `select_item` | Initial cached/new batch presentation / card click; unchanged refreshes and cancelled debounces deduplicated | Public design/list identities, zero-based shown positions, count and price basis; bounded scalar positions for Umami |
| `search`, `catalog_pagination`, `catalog_load_error` | Completed user query / additional batch / failed request | `search_context=catalog`, query length and result counts, phase; no raw search |
| `catalog_layout_change` | User switches one/two columns | Previous/current column count |
| `view_item`, `gallery_interaction`, `product_option_change` | Product lifecycle / user gallery or selector action | Design, model/coverage, image position; no autoplay/default action |
| `quantity_change`, `add_to_cart`, `add_to_cart_error` | Committed quantity / successful addition / rejected attempt | Configured public item, delta/value or safe reason |
| `cart_view`, `remove_from_cart`, `cart_revalidation` | One hydrated cart lifecycle including empty/invalid/failed quote / removal / changed quote | Counts, current-quote merchandise value; unavailable money omitted with explicit price basis |
| `begin_checkout` | One nonempty checkout lifecycle; failed quote or exit while quote is pending still counts | Current-quote items/merchandise total when available; otherwise unavailable basis with amount/item prices omitted |
| `add_shipping_info`, `add_payment_info` | Current quote rule/fee signature changes / explicit method selection or unchanged default committed at valid submit | Rule and fee / method, never address/account input; unchanged commits deduplicated |
| `checkout_validation_error`, `checkout_submit`, `checkout_error` | Shared-validator rejection / reviewed submit / one classified submit or resolve failure | Field/reason/phase categories and reviewed totals |
| `abandoned_checkout` | Once per observed entered lifecycle, not once per effect/quote | Stage/count/known value only; unknown money omitted; synchronous in-flight/accepted guards prevent false abandonment |
| `purchase`, `purchase_item` | Checkout-capability-authorized claim after acceptance/recovery | Separate opaque analytics transaction ID; saved amounts and typed lines |
| `order_tracking_search`, `order_tracking_result` | Manual submission/tag click / resolved lookup | `entry_point`, `lookup_source`, found/not_found/error outcome; never lookup reference |
| `order_history_action`, `order_history_storage_error` | Explicit forget/clear / read, parse, save, remove or clear failure | Entry/action/count/outcome or safe operation/category; unchanged read failure deduplicated, no stored array |
| `order_reference_copy` | Confirmed/failed ID or URL copy | Target kind/outcome only; never copied content |
| `cta_click`, `contact_click` | Creativa navigation / actual support action | Named CTA, surface and method |

Purchase is **order placed**, not payment received. GA4 `value` is merchandise
total excluding shipping; shipping is separate. Umami also receives merchandise,
shipping and final payable values. Its `purchase_item` companions are not extra
conversions. Public tracking visits never create purchase events.

`POST /api/creativa/orders/analytics-claim` uses a private checkout capability
and revision-guarded receipts. Claims grant at-most-once dispatch permission,
not exactly-once external delivery: interruption after a claim can undercount.
Disabled/unavailable collectors or failed claims must not block confirmation.

Never send customer names/contact/address/notes, public order IDs, recovery
capabilities, history arrays or raw exception payloads. The pre-bootstrap
`creativaBeforeSend` hook also sanitizes automatic Umami URL/referrer context.
Vercel analytics is suppressed for Creativa routes. GTM is not newly bootstrapped
on direct Creativa entry; an already loaded root container's automatic tags still
require an authorized real-container inspection and Creativa exclusions before
release. Do not infer hosted privacy/deduplication from development logs.

Owner-provided launch data, native Safari behavior, actual Sanity privacy and
real GA4/GTM/Umami settings remain separate verification gates in
`tasks/creativa/plan.md` and `tasks/creativa/test-plan.md`.

The 2026-10-23 CMS-first amendment changes Studio schemas only. Existing runtime
producers/readers are not yet adapted to those new records; follow
[CM-03 through CM-07](../tasks/creativa/plan.md#cms-first-amendment-and-required-next-actions)
next. Keep absolute print-file paths and internal bank notes out of public
projections and telemetry; no new analytics event or collector is introduced.
