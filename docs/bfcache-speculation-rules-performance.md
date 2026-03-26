# Performance Optimization: bfcache & Speculation Rules

## Overview

This document outlines the implementation of Back/forward cache (bfcache) and speculation rules for the Inut Design website to improve navigation performance and user experience.

## Implementation Summary

### 1. Back/forward Cache (bfcache)

bfcache allows browsers to store a complete snapshot of a page (including the JavaScript heap) when the user navigates away. This enables instant restoration when the user returns via back/forward buttons.

**Key Benefits:**
- Instant back/forward navigation (typically <100ms)
- Preserved page state and scroll position
- Reduced server load for repeat visits

### 2. Speculation Rules

Speculation rules enable browsers to prefetch or prerender pages that users are likely to visit, based on heuristics and explicit hints.

**Two Strategies:**
- **Prefetch**: Downloads HTML and critical resources in the background
- **Prerender**: Fully renders the page in a hidden tab for instant activation

## File Structure

```
utils/
├── speculation-rules.ts      # Rule definitions and configuration
├── bfcache-monitor.ts        # bfcache analytics tracking
├── speculation-monitor.ts    # Speculation rules effectiveness tracking
└── prefetch-fallback.ts      # Fallback for browsers without speculation support

components/scripts/
└── speculation-rules.tsx     # React component for script injection

docs/
└── PERFORMANCE_OPTIMIZATION.md  # This documentation
```

## Configuration Details

### Speculation Rules Configuration

**File:** `utils/speculation-rules.ts`

```typescript
// Tier 1: Critical navigation (moderate eagerness)
const CRITICAL_ROUTES = [
  '/',
  '/san-pham/skin-laptop',
  '/san-pham/skin-nut-phim',
  '/san-pham/lighters',
  '/services',
  '/contact',
  '/about-us',
  '/contact/form',
];

// Tier 2: Secondary routes (conservative eagerness)
const SECONDARY_ROUTES = [
  '/services/sticker',
  '/services/ca-nhan-hoa',
  '/services/an-pham-luu-niem',
  // ... more routes
];
```

**Eagerness Levels:**
- `immediate`: Prefetch/prerender on page load
- `eager`: Prefetch on viewport entry
- `moderate`: Prefetch after short delay (default for critical routes)
- `conservative`: Prefetch on hover/interaction

### Cache Headers

**File:** `next.config.js`

```javascript
async headers() {
  return [
    {
      source: '/_next/static/:path*',
      headers: [{
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      }],
    },
    {
      source: '/:path*.(jpg|jpeg|png|gif|ico|svg|webp)',
      headers: [{
        key: 'Cache-Control',
        value: 'public, max-age=86400, must-revalidate',
      }],
    },
  ];
}
```

## Analytics Integration

### GA4 Events

New events added to `utils/analytics.ts`:

| Event Name | Parameters | Description |
|------------|------------|-------------|
| `bfcache_status` | `wasRestored`, `navigationType`, `restorationTimeMs` | Tracks bfcache hit rate |
| `bfcache_not_restored` | `reasons`, `reasonCount` | Diagnoses bfcache issues |
| `speculation_support` | `supported`, `browser` | Browser capability tracking |
| `prerender_activated` | `activationTimeMs` | Prerender performance |
| `prefetch_effectiveness` | `url`, `wasUsed`, `timeSavedMs` | Prefetch hit tracking |

### Umami Events

Mirrored events in `utils/umamiAnalytics.ts` for dual analytics tracking.

## Browser Compatibility

| Browser | bfcache | Prefetch | Prerender | Fallback |
|---------|---------|----------|-----------|----------|
| Chrome 121+ | ✅ | ✅ | ✅ | Native |
| Firefox 121+ | ✅ | ✅ | ❌ | `<link rel="prefetch">` |
| Safari 17+ | ✅ | ❌ | ❌ | `<link rel="prefetch">` |
| Edge 121+ | ✅ | ✅ | ✅ | Native |

### Fallback Strategy

For browsers without speculation rules support, `utils/prefetch-fallback.ts`:
1. Detects browser support via `HTMLScriptElement.supports('speculationrules')`
2. Falls back to `<link rel="prefetch">` for critical routes
3. Implements hover-based prefetch for progressive enhancement

## bfcache Eligibility Checklist

To ensure pages are eligible for bfcache:

- [x] No `unload` event listeners (use `pagehide` instead)
- [x] No `window.opener` references
- [x] All scripts use `async` or `defer`
- [x] Third-party scripts don't block bfcache
- [x] No long-running IndexedDB transactions
- [x] WebSocket connections closed on `pagehide`
- [x] Cache-Control headers don't prevent caching

## Testing

### Manual Testing

1. **bfcache Test:**
   ```
   1. Navigate to page A
   2. Click link to page B
   3. Press browser back button
   4. Observe instant restoration (<100ms)
   ```

2. **Speculation Rules Test:**
   ```
   1. Open DevTools Network tab
   2. Hover over navigation links
   3. Observe prefetch requests in Network tab
   4. Navigate to prefetched page
   5. Check Performance tab for reduced load time
   ```

### Browser DevTools

- **Chrome**: `Application > Back/forward cache`
- **Firefox**: `about:cache` and Network Monitor
- **Safari**: `Develop > Web Inspector > Network`

### Performance Metrics

Expected improvements:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Back navigation | ~800ms | <100ms | 87.5% |
| Forward navigation | ~600ms | <50ms | 91.7% |
| Predicted page load | ~1200ms | <200ms | 83.3% |
| LCP (predicted pages) | ~2.5s | <1.0s | 60% |
| TTFB (bfcache) | ~400ms | <50ms | 87.5% |

## Troubleshooting

### bfcache Not Working

1. Check `notRestoredReasons` in analytics:
   ```javascript
   // In browser console
   performance.getEntriesByType('navigation')[0].notRestoredReasons
   ```

2. Common issues:
   - DevTools open (disables bfcache in some browsers)
   - Extensions blocking caching
   - Service worker interfering

### Speculation Rules Not Prefetching

1. Verify browser support:
   ```javascript
   HTMLScriptElement.supports('speculationrules') // Should return true
   ```

2. Check for:
   - HTTPS requirement
   - Correct JSON syntax in script tag
   - No `no-referrer` policy blocking

## Maintenance

### Adding New Routes

To add new routes to speculation rules:

1. Edit `utils/speculation-rules.ts`
2. Add route to `CRITICAL_ROUTES` or `SECONDARY_ROUTES`
3. Set appropriate eagerness level
4. Test in multiple browsers

### Monitoring

Review analytics weekly for:
- bfcache hit rate (target: >70% for back navigation)
- Speculation rule effectiveness
- Browser compatibility distribution

## References

- [web.dev: bfcache](https://web.dev/articles/bfcache)
- [Chrome DevRel: Speculation Rules](https://developer.chrome.com/docs/web-platform/implementing-speculation-rules)
- [MDN: Page Lifecycle API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Lifecycle_API)