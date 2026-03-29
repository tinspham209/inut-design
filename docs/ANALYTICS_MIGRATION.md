# 🔄 Analytics Migration Guide

## Overview

This guide documents the migration from the legacy analytics implementation to the enhanced analytics architecture with improved GA4 integration, Umami dual tracking, consent management, and engagement scoring.

## Migration Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| Phase 1 | Week 1 | Foundation & Configuration |
| Phase 2 | Week 2 | Enhanced GA4 Implementation |
| Phase 3 | Week 3 | Advanced Analytics Features |
| Phase 4 | Week 4 | Testing & Validation |
| Phase 5 | Week 5 | Deployment & Monitoring |

---

## What's Changing

### New Files Added

| File | Purpose |
|------|---------|
| `utils/dataLayer.ts` | GTM DataLayer utility for standardized event pushing |
| `utils/consent.ts` | GDPR/CCPA consent management with Google Consent Mode v2 |
| `utils/engagementScore.ts` | User engagement scoring and segmentation |
| `scripts/validate-tracking.ts` | Automated tracking validation script |
| `docs/ANALYTICS_EVENT_MAP.md` | Comprehensive event mapping documentation |

### Files Modified

| File | Changes |
|------|---------|
| `.env.example` | Added Umami environment variables |
| `utils/env-const.ts` | Added Umami configuration constants |
| `utils/analytics.ts` | Enhanced with DataLayer and engagement integration |

---

## Breaking Changes

### None (Backward Compatible)

All existing tracking functions remain functional. New features are additive and don't break existing implementations.

---

## Step-by-Step Migration

### Step 1: Update Environment Variables

1. **Copy new environment variables to `.env.local`**:
   ```bash
   cp .env.example .env.local
   ```

2. **Add Umami configuration**:
   ```env
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-umami-website-id
   NEXT_PUBLIC_UMAMI_HOST_URL=https://cloud.umami.is
   ```

3. **Verify existing variables**:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
   NEXT_PUBLIC_ENABLE_UMAMI=true
   ```

### Step 2: Update Imports (Optional)

The new utilities are available but not required for existing code:

```typescript
// New utilities (optional imports)
import { pushToDataLayer, getDeviceType, getUserType } from "@/utils/dataLayer";
import { initializeConsentMode, hasAnalyticsConsent } from "@/utils/consent";
import { trackEngagementEvent, getCurrentEngagementScore } from "@/utils/engagementScore";
```

Existing imports continue to work:
```typescript
// Existing imports (still valid)
import { trackAddToCart, trackPurchase } from "@/utils/analytics";
```

### Step 3: Initialize Consent Mode (Recommended)

Add consent initialization to `pages/_app.tsx`:

```typescript
import { useEffect } from "react";
import { initializeConsentMode } from "@/utils/consent";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize consent mode before analytics
    initializeConsentMode();
  }, []);

  return <Component {...pageProps} />;
}
```

### Step 4: Enable DataLayer Integration (Recommended)

Update `utils/analytics.ts` to push events to DataLayer:

```typescript
import { pushEcommerceEvent, getDeviceType, getUserType, getPriceRange } from "./dataLayer";

export const trackViewProduct = (product: ProductData): void => {
  // Existing GA4 tracking
  gtag("event", "view_item", {
    currency: "VND",
    value: product.price || 0,
    items: [/* ... */],
  });

  // Existing Umami tracking
  trackUmamiProductView({/* ... */});

  // NEW: DataLayer integration
  pushEcommerceEvent("view_item", {
    currency: "VND",
    value: product.price || 0,
    items: [{
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity: 1,
    }],
  }, {
    user_type: getUserType(),
    device_type: getDeviceType(),
    product_category: product.category,
    price_range: getPriceRange(product.price || 0),
  });
};
```

### Step 5: Enable Engagement Scoring (Optional)

Add engagement tracking to key user actions:

```typescript
import { trackCartEngagement, trackPurchaseEngagement } from "@/utils/engagementScore";

// In add to cart handler
trackCartEngagement(product.name, cartValue);

// In purchase handler
trackPurchaseEngagement(orderId, orderValue);
```

### Step 6: Run Validation Script

Validate your tracking implementation:

```bash
npx ts-node scripts/validate-tracking.ts
```

Review the output and fix any errors or warnings.

---

## Data Continuity

### Historical Data

- **GA4**: Historical data remains accessible. New custom dimensions will populate going forward.
- **Umami**: Historical data remains accessible. New events will appear with enhanced parameters.
- **No data loss**: Migration doesn't delete or modify historical data.

### New Metrics Available

After migration, these new metrics become available:

| Metric | Description | GA4 Location |
|--------|-------------|--------------|
| `engagement_score` | User engagement score | Custom metric |
| `user_type` | User loyalty segment | Custom dimension |
| `device_type` | Device category | Custom dimension |
| `price_range` | Product price tier | Custom dimension |
| `customer_segment` | RFM segment | Custom dimension |

---

## Testing Checklist

### Pre-Deployment Testing

- [ ] Run validation script: `npx ts-node scripts/validate-tracking.ts`
- [ ] Test in development mode (check console logs)
- [ ] Verify GA4 Realtime shows events
- [ ] Verify Umami dashboard shows events
- [ ] Check GTM Tag Assistant for correct tags
- [ ] Test consent banner functionality
- [ ] Verify DataLayer events in browser console

### Post-Deployment Testing

- [ ] Monitor GA4 for 24-48 hours
- [ ] Check for duplicate events
- [ ] Verify custom dimensions populate
- [ ] Test checkout funnel tracking
- [ ] Validate engagement scoring
- [ ] Monitor Umami dashboard

---

## Rollback Plan

If issues arise, you can rollback:

### Option 1: Disable New Features

Set environment variables to disable new features:

```env
NEXT_PUBLIC_ENABLE_CONSENT_MODE=false
NEXT_PUBLIC_ENABLE_DATA_LAYER=false
NEXT_PUBLIC_ENABLE_ENGAGEMENT_SCORING=false
```

### Option 2: Revert Code Changes

```bash
# Revert to previous commit
git revert HEAD

# Or restore specific files
git checkout HEAD~1 -- utils/analytics.ts
```

### Option 3: Remove New Files

```bash
# Remove new utilities
rm utils/dataLayer.ts
rm utils/consent.ts
rm utils/engagementScore.ts
rm scripts/validate-tracking.ts
```

---

## Troubleshooting

### Issue: Events not appearing in GA4

**Solution**:
1. Check `.env.local` for correct `GA_MEASUREMENT_ID`
2. Verify production build includes analytics scripts
3. Check browser console for errors
4. Use GA4 DebugView for real-time debugging

### Issue: Duplicate events

**Solution**:
1. Run validation script to identify duplicates
2. Check for multiple tracking calls in components
3. Verify `store/cart/lightersCart.ts` doesn't duplicate component tracking

### Issue: Consent mode not working

**Solution**:
1. Verify `initializeConsentMode()` is called in `_app.tsx`
2. Check browser localStorage for consent preferences
3. Test with consent banner UI

### Issue: Engagement scores not updating

**Solution**:
1. Verify localStorage is accessible (not blocked by privacy settings)
2. Check browser console for errors
3. Verify `trackEngagementEvent()` is being called

### Issue: Umami events not tracking

**Solution**:
1. Check `NEXT_PUBLIC_ENABLE_UMAMI=true`
2. Verify `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set
3. Check if Umami script loads in Network tab
4. Verify `window.umami` is available in console

---

## Performance Impact

### Expected Impact

| Metric | Impact | Notes |
|--------|--------|-------|
| Bundle size | +5KB gzipped | New utilities |
| localStorage | +2KB | Engagement data |
| Network requests | No change | Same analytics endpoints |
| Page load time | <10ms | Consent initialization |

### Optimization Tips

1. **Lazy load consent banner**: Only load when needed
2. **Batch events**: Use `trackUmamiBatch()` for multiple events
3. **Limit storage**: Engagement events capped at 100
4. **Clear old data**: Automatic cleanup of stale engagement data

---

## Support & Resources

### Documentation

- [Analytics Event Map](./ANALYTICS_EVENT_MAP.md) - Complete event documentation
- [Analytics Guide](./ANALYTICS_GUIDE.md) - Implementation guide
- [Umami Performance Plan](./umami-performance-comprehensive-plan.md) - Umami optimization

### Validation

- Run `npx ts-node scripts/validate-tracking.ts` for automated checks
- Use GA4 DebugView for real-time event inspection
- Use GTM Tag Assistant for tag validation
- Check Umami dashboard for privacy-focused analytics

### Contact

For issues or questions:
1. Check this migration guide
2. Review event mapping documentation
3. Run validation script
4. Check browser console for errors

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-29 | 1.0.0 | Initial migration guide |
| 2026-03-29 | 1.0.1 | Added troubleshooting section |
| 2026-03-29 | 1.0.2 | Added rollback plan |
| 2026-03-29 | 1.0.3 | Added performance impact section |