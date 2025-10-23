# 📊 Umami Event Tracking Implementation Proposal

A comprehensive guide for implementing effective event tracking with Umami.is alongside existing Google Analytics in the Inut Design e-commerce platform.

---

## 🎯 Overview

**Current State (Updated):**
- ✅ Umami script installed (`data-website-id: 2d970e4e-411e-4b9e-b6ee-c48c2b040f56`)
- ✅ SPA page view tracking integrated (GA4 + Umami)
- ✅ Dual tracking for products, cart, checkout, purchase, conversions, engagement
- ✅ Engagement hooks implemented (scroll depth, time on page)
- 🚧 Session identification utilities available (not yet wired to order flow)
- 📝 This document now reflects implemented code

**Goals:**
1. Complement GA4 with privacy-focused Umami analytics
2. Implement dual tracking (GA4 + Umami) for redundancy
3. Use Umami for simple, privacy-friendly analytics
4. Leverage Umami's session identification for user journey tracking
5. Maintain consistency with existing GA4 event naming conventions

---

## 🏗️ Architecture Strategy

### Dual Tracking Approach

```typescript
// Track to both GA4 and Umami
trackEvent("product_view", productData)
  → GA4: gtag("event", "view_item", {...})
  → Umami: umami.track("product_view", {...})
```

### Benefits of Dual Tracking
- **Redundancy**: Backup if one service fails
- **Privacy**: Umami for privacy-conscious users (no cookies)
- **Compliance**: Umami doesn't require cookie consent
- **Comparison**: Cross-validate data between platforms
- **Simplicity**: Umami for quick insights, GA4 for deep analysis

---

## 🛠️ Implementation Plan

### Phase 1: Core Utilities Setup

Create `utils/umamiAnalytics.ts`:

```typescript
/**
 * Umami Event Tracking Utilities
 * Privacy-focused analytics with no cookies
 */

declare global {
  interface Window {
    umami?: {
      track: (event_name?: string | object | Function, data?: object) => void;
      identify: (data: object | string, additionalData?: object) => void;
    };
  }
}

// Helper to check if Umami is available
const isUmamiAvailable = (): boolean => {
  return typeof window !== "undefined" && typeof window.umami !== "undefined";
};

// Core Umami wrapper
export const umami = {
  track: (event_name?: string | object | Function, data?: object): void => {
    if (isUmamiAvailable()) {
      window.umami!.track(event_name, data);
    } else if (process.env.NODE_ENV === "development") {
      console.log("[Umami Debug]", event_name, data);
    }
  },
  
  identify: (data: object | string, additionalData?: object): void => {
    if (isUmamiAvailable()) {
      window.umami!.identify(data, additionalData);
    } else if (process.env.NODE_ENV === "development") {
      console.log("[Umami Identify]", data, additionalData);
    }
  },
};

/**
 * Track custom page view (for SPA navigation)
 * Note: Umami auto-tracks page views by default
 */
export const trackUmamiPageView = (url?: string, title?: string): void => {
  if (url || title) {
    umami.track((props) => ({
      ...props,
      url: url || window.location.pathname,
      title: title || document.title,
    }));
  } else {
    umami.track(); // Default page view
  }
};

/**
 * Track custom event
 */
export const trackUmamiEvent = (eventName: string, data?: object): void => {
  umami.track(eventName, data);
};

// ============================================
// E-COMMERCE TRACKING
// ============================================

export interface UmamiProductData {
  id: string;
  name: string;
  category?: string;
  price?: number;
  quantity?: number;
  variant?: string;
}

/**
 * Track product view
 */
export const trackUmamiProductView = (product: UmamiProductData): void => {
  umami.track("product_view", {
    product_id: product.id,
    product_name: product.name,
    category: product.category || "Unknown",
    price: product.price || 0,
  });
};

/**
 * Track product click
 */
export const trackUmamiProductClick = (product: UmamiProductData, listName?: string): void => {
  umami.track("product_click", {
    product_id: product.id,
    product_name: product.name,
    category: product.category || "Unknown",
    list_name: listName || "Unknown",
    price: product.price || 0,
  });
};

/**
 * Track add to cart
 */
export const trackUmamiAddToCart = (product: UmamiProductData): void => {
  umami.track("add_to_cart", {
    product_id: product.id,
    product_name: product.name,
    category: product.category || "Unknown",
    price: product.price || 0,
    quantity: product.quantity || 1,
    value: (product.price || 0) * (product.quantity || 1),
  });
};

/**
 * Track remove from cart
 */
export const trackUmamiRemoveFromCart = (product: UmamiProductData): void => {
  umami.track("remove_from_cart", {
    product_id: product.id,
    product_name: product.name,
    quantity: product.quantity || 1,
  });
};

/**
 * Track checkout started
 */
export const trackUmamiBeginCheckout = (items: UmamiProductData[], totalValue: number): void => {
  umami.track("begin_checkout", {
    item_count: items.length,
    total_value: totalValue,
    currency: "VND",
  });
};

/**
 * Track purchase completed
 */
export const trackUmamiPurchase = (
  orderId: string,
  items: UmamiProductData[],
  totalValue: number
): void => {
  umami.track("purchase", {
    order_id: orderId,
    item_count: items.length,
    total_value: totalValue,
    currency: "VND",
  });
};

// ============================================
// CONVERSION TRACKING
// ============================================

/**
 * Track order button click (Messenger)
 */
export const trackUmamiOrderButton = (productName: string, category?: string): void => {
  umami.track("order_button_click", {
    product_name: productName,
    category: category || "Unknown",
    method: "messenger",
  });
};

/**
 * Track contact interaction
 */
export const trackUmamiContact = (method: string, productName?: string): void => {
  umami.track("contact_click", {
    method: method, // messenger, phone, whatsapp, email
    product_name: productName || "N/A",
  });
};

/**
 * Track phone click
 */
export const trackUmamiPhoneClick = (): void => {
  umami.track("phone_click");
};

/**
 * Track form submission
 */
export const trackUmamiFormSubmit = (formType: string): void => {
  umami.track("form_submit", {
    form_type: formType, // quote_request, contact_form, etc.
  });
};

/**
 * Track social media click
 */
export const trackUmamiSocialClick = (platform: string): void => {
  umami.track("social_click", {
    platform: platform, // facebook, instagram, tiktok, etc.
  });
};

// ============================================
// ENGAGEMENT TRACKING
// ============================================

/**
 * Track search
 */
export const trackUmamiSearch = (searchTerm: string, resultsCount?: number): void => {
  umami.track("search", {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

/**
 * Track outbound link click
 */
export const trackUmamiOutboundClick = (url: string): void => {
  umami.track("outbound_click", {
    destination: url,
  });
};

/**
 * Track file download
 */
export const trackUmamiDownload = (fileName: string): void => {
  umami.track("file_download", {
    file_name: fileName,
  });
};

/**
 * Track video engagement
 */
export const trackUmamiVideoEngagement = (action: string, videoName: string): void => {
  umami.track("video_engagement", {
    action: action, // play, pause, complete
    video_name: videoName,
  });
};

/**
 * Track scroll depth
 */
export const trackUmamiScrollDepth = (depth: number): void => {
  umami.track("scroll_depth", {
    depth_percentage: depth,
  });
};

/**
 * Track time on page
 */
export const trackUmamiTimeOnPage = (pageName: string, seconds: number): void => {
  umami.track("time_on_page", {
    page_name: pageName,
    duration_seconds: seconds,
  });
};

// ============================================
// SESSION IDENTIFICATION
// ============================================

/**
 * Identify user session (for logged-in users or after order)
 */
export const identifyUmamiUser = (userId: string, userData?: object): void => {
  if (userData) {
    umami.identify(userId, userData);
  } else {
    umami.identify(userId);
  }
};

/**
 * Track anonymous session data (e.g., cart state, preferences)
 */
export const trackUmamiSessionData = (data: object): void => {
  umami.identify(data);
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Batch track multiple events (useful for checkout flow)
 */
export const trackUmamiBatch = (events: Array<{ name: string; data?: object }>): void => {
  events.forEach(({ name, data }) => {
    umami.track(name, data);
  });
};
```

---

### Phase 2: Unified Tracking Wrapper

Update `utils/analytics.ts` to include Umami tracking:

```typescript
// Add at the top
import {
  trackUmamiProductView,
  trackUmamiProductClick,
  trackUmamiAddToCart,
  trackUmamiRemoveFromCart,
  trackUmamiBeginCheckout,
  trackUmamiPurchase,
  trackUmamiOrderButton,
  trackUmamiContact,
  trackUmamiPhoneClick,
  trackUmamiFormSubmit,
  trackUmamiSocialClick,
  trackUmamiSearch,
} from "./umamiAnalytics";

// Modify existing functions to include Umami tracking

// Example: trackViewProduct
export const trackViewProduct = (product: ProductData): void => {
  // GA4 tracking (existing)
  gtag("event", "view_item", {
    currency: "VND",
    value: product.price || 0,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand || "INUT Design",
        item_category: product.category,
        item_variant: product.variant,
        price: product.price,
        quantity: 1,
      },
    ],
  });

  // Umami tracking (new)
  trackUmamiProductView({
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
  });
};

// Apply the same pattern to all other tracking functions
```

---

### Phase 3: Data Attribute Method (Alternative)

For simple static elements, use data attributes:

```tsx
// Example: Simple button tracking
<button data-umami-event="cta_click" data-umami-event-location="hero">
  Đặt hàng ngay
</button>

// Example: Product card with data
<div
  data-umami-event="product_card_click"
  data-umami-event-product={product.name}
  data-umami-event-category={product.category}
>
  {/* Product content */}
</div>
```

**When to use:**
- ✅ Static buttons/links
- ✅ Simple interactions
- ❌ Dynamic data (use JavaScript method instead)
- ❌ Complex e-commerce events

---

## 📋 Event Naming Convention

### Follow GA4 naming for consistency:

| Event Type      | GA4 Event            | Umami Event          | Data Properties                                    |
| --------------- | -------------------- | -------------------- | -------------------------------------------------- |
| **E-commerce**  | `view_item`          | `product_view`       | `product_id`, `product_name`, `category`, `price`  |
|                 | `select_item`        | `product_click`      | `product_id`, `product_name`, `list_name`, `price` |
|                 | `add_to_cart`        | `add_to_cart`        | `product_id`, `product_name`, `quantity`, `value`  |
|                 | `remove_from_cart`   | `remove_from_cart`   | `product_id`, `product_name`, `quantity`           |
|                 | `begin_checkout`     | `begin_checkout`     | `item_count`, `total_value`, `currency`            |
|                 | `purchase`           | `purchase`           | `order_id`, `item_count`, `total_value`            |
| **Conversions** | `order_button_click` | `order_button_click` | `product_name`, `category`, `method`               |
|                 | `contact_click`      | `contact_click`      | `method`, `product_name`                           |
|                 | `phone_click`        | `phone_click`        | -                                                  |
|                 | `form_submit`        | `form_submit`        | `form_type`                                        |
| **Engagement**  | `search`             | `search`             | `search_term`, `results_count`                     |
|                 | Custom               | `scroll_depth`       | `depth_percentage`                                 |
|                 | Custom               | `time_on_page`       | `page_name`, `duration_seconds`                    |

---

## 🎯 Implementation Priority

### High Priority (Week 1)
1. ✅ Create `utils/umamiAnalytics.ts`
2. ✅ Implement core product tracking:
   - Product view
   - Product click
   - Add to cart
3. ✅ Implement conversion tracking:
   - Order button click
   - Contact interactions
4. ✅ Update existing `utils/analytics.ts` to include Umami

### Medium Priority (Week 2)
5. ✅ Cart operations (remove, begin checkout)
6. ✅ Purchase tracking
7. ✅ Form submissions
8. ✅ Search tracking

### Low Priority (Week 3+)
9. ✅ Session identification (post-purchase)
10. ✅ Scroll depth tracking
11. ✅ Time on page tracking
12. ✅ Video engagement (if applicable)

---

## 💡 Best Practices

### Event Data Guidelines

**✅ DO:**
- Keep event names under 50 characters
- Use consistent naming (snake_case)
- Include relevant context (product_id, product_name, category)
- Track user intent, not system responses
- Use meaningful property names

**❌ DON'T:**
- Send events without names
- Track PII (personally identifiable information)
- Use deeply nested objects (max 50 properties)
- Send strings longer than 500 characters
- Track every single click (focus on meaningful interactions)

### Data Limits to Remember

- **Event name**: Max 50 characters
- **Numbers**: Max precision of 4 decimals
- **Strings**: Max 500 characters
- **Arrays**: Convert to string (max 500 chars)
- **Objects**: Max 50 properties

### Performance Considerations

```typescript
// ✅ GOOD: Batch related events
trackUmamiBatch([
  { name: "checkout_started", data: { item_count: 3 } },
  { name: "payment_method_selected", data: { method: "bank_transfer" } },
]);

// ❌ BAD: Too many individual calls
trackUmamiEvent("click_1");
trackUmamiEvent("click_2");
trackUmamiEvent("click_3");
// ... 50 more events
```

---

## 🔍 Testing & Verification

### Local Development Testing

```bash
# Start dev server
pnpm dev

# Open browser console
# Look for: [Umami Debug] messages
```

### Production Verification

1. **Umami Dashboard**
   - Login to https://cloud.umami.is/
   - Go to your website dashboard
   - Check Realtime view
   - Navigate your site and verify events appear

2. **Browser DevTools**
   - Open Network tab
   - Filter by: `umami`
   - Look for requests to `cloud.umami.is/api/send`
   - Verify status 200

3. **Tag Assistant**
   - No specific extension for Umami
   - Use Network tab instead

### Event Verification Checklist

- [ ] Page views tracked automatically
- [ ] Product view events appearing
- [ ] Product click events appearing
- [ ] Add to cart events appearing
- [ ] Order button clicks tracked
- [ ] Contact interactions tracked
- [ ] Events appear in Umami dashboard within 1 minute
- [ ] Event properties visible in dashboard

---

## 📊 Umami vs GA4 Comparison

| Feature                | Umami                        | GA4                       | Recommendation                |
| ---------------------- | ---------------------------- | ------------------------- | ----------------------------- |
| **Privacy**            | ✅ GDPR compliant, no cookies | ⚠️ Requires cookie consent | Use Umami for EU users        |
| **Setup complexity**   | ✅ Simple                     | ⚠️ Complex                 | Umami for quick insights      |
| **E-commerce reports** | ❌ Basic                      | ✅ Advanced                | GA4 for detailed analysis     |
| **Real-time data**     | ✅ Fast                       | ✅ Fast                    | Both are good                 |
| **Custom reports**     | ⚠️ Limited                    | ✅ Extensive               | GA4 for business intelligence |
| **Session tracking**   | ✅ Built-in                   | ✅ Built-in                | Both are good                 |
| **Event debugging**    | ⚠️ Console only               | ✅ DebugView               | GA4 better for debugging      |
| **Data retention**     | ✅ Unlimited                  | ⚠️ 14 months               | Umami for long-term data      |
| **Cost**               | ✅ Free tier                  | ✅ Free                    | Both are free                 |

---

## 🚀 Quick Start Implementation

### Step 1: Create Umami Utility (5 min)
```bash
# Create the file
touch utils/umamiAnalytics.ts
# Copy the code from "Phase 1: Core Utilities Setup" above
```

### Step 2: Update Existing Analytics (10 min)
```typescript
// In utils/analytics.ts, add Umami calls to existing functions
// Example pattern:
export const trackViewProduct = (product: ProductData): void => {
  // Existing GA4 code...
  gtag("event", "view_item", {...});
  
  // Add Umami tracking
  trackUmamiProductView({...});
};
```

### Step 3: Export & Test (2 min)
```typescript
// In utils/index.ts, export Umami functions
export * from "./umamiAnalytics";

// Test in browser console
window.umami.track("test_event", { test: true });
```

### Step 4: Deploy & Verify (5 min)
```bash
pnpm build
git add .
git commit -m "feat: add Umami event tracking"
git push origin main
# Check Umami dashboard for events
```

---

## 🎓 Advanced Features

### Session Identification for User Journey

```typescript
// After user places order
identifyUmamiUser(order.orderNumber, {
  order_value: order.total,
  order_date: new Date().toISOString(),
  customer_type: "new", // or "returning"
});

// Track anonymous user preferences
trackUmamiSessionData({
  cart_items: cartItemCount,
  preferred_category: "laptop_skins",
  visited_pages: 5,
});
```

### Custom Page View Tracking (for SPA)

```typescript
// In pages/_app.tsx, add Umami page view tracking
import { trackUmamiPageView } from "@/utils/umamiAnalytics";

Router.events.on("routeChangeComplete", (url) => {
  // GA4 tracking (existing)
  trackPageView(url);
  
  // Umami tracking (new)
  trackUmamiPageView(url);
});
```

### Funnel Tracking

```typescript
// Track complete funnel
const trackCheckoutFunnel = (step: number, data: object) => {
  umami.track(`checkout_step_${step}`, data);
};

// Usage:
trackCheckoutFunnel(1, { cart_value: 150000 }); // View cart
trackCheckoutFunnel(2, { items: 3 }); // Begin checkout
trackCheckoutFunnel(3, { payment: "bank_transfer" }); // Payment info
trackCheckoutFunnel(4, { order_id: "ORDER-123" }); // Complete
```

---

## 📈 Expected Outcomes

### After 1 Week
- ✅ All core e-commerce events tracked in Umami
- ✅ Conversion events visible in dashboard
- ✅ Page view data matching GA4 (within 5%)
- ✅ Real-time events working

### After 1 Month
- ✅ Complete user journey data
- ✅ Funnel analysis available
- ✅ Product performance insights
- ✅ Traffic source breakdown
- ✅ Conversion rate tracking

### Key Metrics to Monitor
- Product view → click rate
- Click → order conversion rate
- Cart abandonment rate
- Top products by views/clicks
- Popular user paths

---

## 🆘 Troubleshooting

### Umami script not loading
```typescript
// Check if script is present
console.log(window.umami); // Should show object

// Check Network tab for:
// - https://cloud.umami.is/script.js (should be 200)
// - Verify data-website-id is correct
```

### Events not appearing in dashboard
```typescript
// 1. Check if Umami is available
if (!window.umami) {
  console.error("Umami not loaded!");
}

// 2. Verify event is being called
console.log("Tracking event:", eventName, data);
window.umami.track(eventName, data);

// 3. Check Network tab for POST to /api/send
// Should see status 200
```

### Data not matching GA4
- Expected: 5-10% variance is normal
- Umami doesn't track bots/crawlers by default (good!)
- GA4 may track more "junk" traffic
- Use Umami as source of truth for real users

---

## 📚 Resources

- [Umami Track Events Docs](https://umami.is/docs/track-events)
- [Umami Tracker Functions](https://umami.is/docs/tracker-functions)
- [Umami Dashboard](https://cloud.umami.is/)
- [Current Analytics Implementation](/utils/analytics.ts)
- [Analytics Guide](/docs/ANALYTICS_GUIDE.md)

---

## ✅ Implementation Checklist

### Setup
- [ ] Create `utils/umamiAnalytics.ts`
- [ ] Export functions in `utils/index.ts`
- [ ] Update `utils/analytics.ts` to include Umami calls

### Core Events
- [ ] Product view tracking
- [ ] Product click tracking
- [ ] Add to cart tracking
- [ ] Order button click tracking
- [ ] Contact interaction tracking

### Advanced Events
- [ ] Remove from cart
- [ ] Begin checkout
- [ ] Purchase complete
- [ ] Form submissions
- [ ] Search tracking

### Testing
- [ ] Local dev testing (console logs)
- [ ] Production verification (Umami dashboard)
- [ ] Cross-check with GA4 data
- [ ] Monitor for 1 week

### Documentation
- [ ] Update team on dual tracking approach
- [ ] Add Umami access for stakeholders
- [ ] Create custom Umami dashboard
- [ ] Schedule monthly review of analytics data

---

**Estimated Implementation Time:** 4-6 hours  
**Expected Value:** Privacy-compliant analytics, data redundancy, simplified reporting  
**Maintenance:** Minimal - update when adding new features

**Questions?** Refer to this document or the [Analytics Guide](/docs/ANALYTICS_GUIDE.md).
