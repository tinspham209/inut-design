# 📊 Inut Design Analytics Guide

A single, comprehensive reference for Google Analytics 4 (GA4) and Google Tag Manager (GTM) setup, architecture, implementation, and troubleshooting for the Inut Design e-commerce platform.

---

## 🚀 Quick Start

1. **Update Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Set your GA4 Measurement ID (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)
   - Set your GTM Container ID (`NEXT_PUBLIC_GTM_ID`, must start with `GTM-`)
   - Example:
     ```bash
     NEXT_PUBLIC_GA_MEASUREMENT_ID=G-0FFVD3N1QG
     NEXT_PUBLIC_GTM_ID=GTM-KDTMJQL
     ```
   - Get your GTM ID from https://tagmanager.google.com/

2. **Build & Deploy**
   ```bash
   pnpm build
   git add .
   git commit -m "fix: improve Google Analytics tracking setup"
   git push origin main
   ```
   - Vercel will auto-deploy.

3. **Verify Tracking**
   - Visit your site, open Chrome DevTools → Network tab → filter by `collect`
   - Click around, verify requests to `google-analytics.com`
   - Check GA4 Realtime for events

4. **Mark Conversions in GA4**
   - Go to Admin → Events
   - Mark `order_button_click`, `contact_click`, `form_submit`, `purchase` as conversions

---

## 🏗️ Analytics Architecture

- **Single source of truth:** All tracking is handled via `utils/analytics.ts` utilities and Next.js third-party integration.
- **Event flow:**
  - User action (click, view, submit)
  - React handler calls tracking function (e.g., `trackAddToCart`)
  - Tracking function sends event to GA4/GTM via `window.gtag`/`window.dataLayer`
  - GTM can forward events to other marketing pixels (Facebook, TikTok, etc.)
- **Tracked events:**
  - E-commerce: `view_item`, `select_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `purchase`
  - Conversion: `order_button_click`, `contact_click`, `phone_click`, `form_submit`, `social_click`
  - Engagement: `page_view`, `search`, `outbound_click`, `download`, `video_engagement`, `time_on_page`, custom events
- **Debug mode:** In development, events log to console as `[GA Debug]`

---

## 💻 How to Implement Analytics for New Functions

- **Import the relevant function from `@/utils/analytics`**
- **Call the function at the source of user action (onClick, onSubmit, useEffect, etc.)**
- **Include meaningful context (product name, category, value, etc.)**

### Examples

#### Product Card Click
```tsx
import { trackSelectProduct } from "@/utils/analytics";
<ProductCard onClick={() => trackSelectProduct({ id: product._id, name: product.name, category: "Laptop Skin" }, "Homepage List")} />
```

#### Product Detail View
```tsx
import { trackViewProduct } from "@/utils/analytics";
useEffect(() => {
  trackViewProduct({ id: product._id, name: product.name, category: "Laptop Skin", brand: "INUT Design", price: product.price });
}, [product]);
```

#### Add to Cart
```tsx
import { trackAddToCart } from "@/utils/analytics";
<Button onClick={() => { trackAddToCart({ id: product._id, name: product.name, category: "Laptop Skin", price: unitPrice, quantity: qty }); /* ...add to cart logic... */ }}>Thêm vào giỏ</Button>
```

#### Custom Event
```tsx
import { trackEvent } from "@/utils/analytics";
trackEvent("custom_event_name", { category: "engagement", label: "button_label", value: 1, custom_param: "any_value" });
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
