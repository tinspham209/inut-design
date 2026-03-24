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
