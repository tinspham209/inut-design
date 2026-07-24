# Inut Design — Feature Specification
**Ticket:** `2026-07-24-01-engagement-pwa-seo`  
**Date:** 2026-07-24  
**Phase:** Specify → Plan → Tasks → Implement  
**Status:** 🔵 Specifying

---

## Overview

Four features to boost website value, conversion, and search visibility:

| # | Feature | Category | Impact |
|---|---|---|---|
| 1 | Engagement-Triggered Smart Popup (Zalo CTA) | Conversion | ⭐⭐⭐⭐⭐ |
| 2 | "You Might Also Like" — Smarter Lighters Recommendations | UX/Revenue | ⭐⭐⭐⭐ |
| 3 | Progressive Web App (PWA) | Retention | ⭐⭐⭐ |
| 4 | SEO Enhancement — Keywords + AI Search Optimization | Acquisition | ⭐⭐⭐⭐⭐ |

---

## Feature 1: 🎯 Engagement-Triggered Smart Popup (Zalo CTA)

### Problem
`engagementScore.ts` + `useEngagementTracking` are fully implemented, but NO component
reads the user's engagement segment and acts on it. High-intent visitors leave without converting.

### Goal
Show a Zalo contact CTA popup to users who are browsing but haven't contacted yet,
triggered by engagement segment OR exit-intent. Dismissable with a cooldown period.

### Trigger Rules

**All must be true (AND):**
- User segment is `"promising"`, `"potential_loyalist"`, or higher (score ≥ 50)
- User has NOT dismissed in the last 24 h (localStorage key: `inut_popup_dismissed_at`)
- At least 30 s has passed on the current page

**At least one must fire (OR):**
- Exit-intent: `mouseleave` on `document` where `clientY < 5` (desktop only)
- Idle: user inactive for 45 s (mobile + desktop)

### CTA Content (Vietnamese)
- Headline: *"Bạn cần tư vấn thêm?"*
- Body: *"Nhắn Zalo ngay — báo giá trong 5 phút ⚡"*
- Primary button: Zalo link → `https://zalo.me/0327124321`
- Secondary: *"Để sau"*

### Analytics Events (new)
- `zalo_popup_shown` (with trigger source: `exit_intent` | `idle`)
- `zalo_popup_click`
- `zalo_popup_dismissed`

### Files to Create/Edit
| File | Action |
|---|---|
| `hooks/useSmartPopup.ts` | CREATE — timer + exit-intent + segment check |
| `components/common/SmartPopup/SmartZaloCTAPopup.tsx` | CREATE — MUI Dialog |
| `components/common/index.ts` | EDIT — export SmartZaloCTAPopup |
| `utils/analytics.ts` | EDIT — 3 new tracking functions |
| `utils/umamiAnalytics.ts` | EDIT — 3 mirrored umami events |
| `pages/_app.tsx` | EDIT — dynamic mount (ssr:false) |

---

## Feature 2: 🧩 "You Might Also Like" — Smarter Lighters Recommendations

### Problem
`RelatedProducts.tsx` exists in `lighter-detail` and shows a carousel, but selection is
`lighters.slice(0, 12)` — just the 12 newest lighters regardless of type. Not truly "related."

### Goal
Make recommendations type-aware. Prioritize same-type lighters, shuffle for variety, and track clicks.

### Recommendation Algorithm (client-side)
```
1. sameType   = lighters where lighterType._ref === current.lighterType._ref, exclude self
2. otherTypes = remaining lighters, exclude self
3. result     = shuffle(sameType) + shuffle(otherTypes), slice(0, 12)
```

### Analytics Events (new)
- `product_recommendation_click` — passes `product_name`, `source: "related_lighters"`

### Files to Edit
| File | Action |
|---|---|
| `pages/san-pham/lighters/[slug].tsx` | EDIT — update relatedProducts memo |
| `components/lighter-detail/RelatedProducts.tsx` | EDIT — add onProductClick prop |
| `utils/analytics.ts` | EDIT — add trackRecommendationClick |
| `utils/umamiAnalytics.ts` | EDIT — mirror umami event |

---

## Feature 3: 📱 Progressive Web App (PWA)

### Problem
No `manifest.json`, no service worker, no "Add to Home Screen". Vietnamese users are
80%+ mobile — the site misses return-visit traffic and installability.

### Goal
Make inutdesign.com installable as a PWA with offline fallback and caching strategy.

### PWA Configuration
```json
{
  "name": "INUT Design",
  "short_name": "INUT",
  "description": "In skin laptop, sticker, bật lửa tại Đà Nẵng",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#FF6B35",
  "icons": [
    { "src": "/branding/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/branding/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/branding/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Cache Strategy
- Pages: Network-first (always fresh content)
- Static assets / images: Cache-first (performance)
- Offline fallback: `public/offline.html`

### Files to Create/Edit
| File | Action |
|---|---|
| `package.json` | EDIT — add `next-pwa` |
| `next.config.js` | EDIT — wrap with `withPWA()` |
| `public/manifest.json` | CREATE |
| `public/offline.html` | CREATE |
| `pages/_document.tsx` | EDIT — manifest link + theme-color meta |
| `public/branding/icon-192.png` | CREATE — resize from logo.avif |
| `public/branding/icon-512.png` | CREATE — resize from logo.avif |

---

## Feature 4: 🔍 SEO Enhancement — Keywords + AI Search Optimization

### Problem
The site lacks:
1. AI search engine visibility (no `llms.txt`, restrictive `robots.txt` for bots)
2. Rich structured data (LocalBusiness, FAQ, BreadcrumbList)
3. Keyword-optimized meta for top product pages

### Target Keywords
| Product | Primary Keyword | Long-tail / AI-query |
|---|---|---|
| Skin Laptop | `skin laptop đà nẵng` | *"nơi in skin laptop uy tín tại đà nẵng"* |
| Macnut | `skin nút phím macbook đà nẵng` | *"dán phím macbook tại đà nẵng"* |
| Sticker | `in sticker đà nẵng` | *"in sticker số lượng ít theo yêu cầu"* |
| Bật lửa | `bật lửa custom đà nẵng` | *"in bật lửa theo yêu cầu đà nẵng"* |
| Brand | `inut design đà nẵng` | *"xưởng in ấn cá nhân hóa đà nẵng"* |

### AI Search Strategy
- `public/llms.txt` — plain-text business profile readable by LLM crawlers
- `robots.txt` — explicit Allow for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `anthropic-ai`, `ChatGPT-User`

### Structured Data
1. `LocalBusiness` — homepage
2. `FAQPage` — lighters + skin-laptop + sticker pages (5 Q&A each)
3. `BreadcrumbList` — all product detail pages

### Files to Create/Edit
| File | Action |
|---|---|
| `public/llms.txt` | CREATE |
| `next-sitemap.config.js` | EDIT — allow AI bots |
| `utils/seo-constants.ts` | EDIT — add FAQ content + LocalBusiness schema |
| `components/scripts/LocalBusinessSchema.tsx` | CREATE |
| `components/scripts/FAQSchema.tsx` | CREATE |
| `pages/index.tsx` | EDIT — mount LocalBusinessSchema |
| `pages/san-pham/lighters/[slug].tsx` | EDIT — FAQSchema + BreadcrumbList |
| `pages/san-pham/skin-laptop/[slug].tsx` | EDIT — FAQSchema + BreadcrumbList |

---

## Task Dependency Graph

```
Phase A — No new dependencies:
  f4-seo-llms          ✅ ready
  f4-seo-robots        ✅ ready
  f4-seo-local-biz     ✅ ready
  f4-seo-breadcrumb    ✅ ready
  f4-seo-faq-schema    🔒 needs f4-seo-local-biz
  f4-seo-meta          🔒 needs f4-seo-faq-schema
  f1-popup-analytics   ✅ ready
  f1-popup-hook        ✅ ready
  f1-popup-component   🔒 needs analytics + hook
  f1-popup-mount       🔒 needs component
  f2-reco-algorithm    ✅ ready
  f2-reco-analytics    🔒 needs algorithm

Phase B — Requires next-pwa install:
  f3-pwa-deps          ✅ ready
  f3-pwa-icons         ✅ ready
  f3-pwa-manifest      ✅ ready
  f3-pwa-offline       ✅ ready
  f3-pwa-config        🔒 needs deps + manifest + offline
  f3-pwa-document      🔒 needs config + icons
```

---

## Implementation Order

```
1. SEO: llms.txt + robots.txt + LocalBusiness schema  (quick wins)
2. Smart Popup: hook + analytics + component + mount
3. Recommendations: algorithm + click tracking
4. PWA: install + manifest + icons + config
```

---

*Generated by GitHub Copilot CLI — 2026-07-24*
