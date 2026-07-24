# Clarification — 2026-07-24-01-engagement-pwa-seo
**Ticket:** `2026-07-24-01-engagement-pwa-seo`  
**Spec file:** `docs/plans/2026-07-24-01-engagement-pwa-seo-specs.md`  
**Clarification date:** 2026-07-24  
**Status:** ✅ Clarified — Ready to Implement

---

## Feature 1: 🎯 Engagement-Triggered Smart Popup (Zalo CTA)

| Question | Answer | Implementation note |
|---|---|---|
| Trigger segment threshold | `promising` (score ≥ 50) | Read `getUserSegment()` from `utils/engagementScore.ts` |
| Dismissal cooldown | **Session only** | Use `sessionStorage` key `inut_popup_dismissed`, NOT localStorage |
| Trigger events | Exit-intent (desktop) + idle timer (mobile) | `mouseleave` where `clientY < 5` on desktop; 45 s inactivity on mobile |
| Page scope | All pages | Mount globally in `pages/_app.tsx` |

### Implementation Decisions
- **Storage:** `sessionStorage.setItem('inut_popup_dismissed', '1')` — clears automatically on tab close
- **Exit-intent condition:** `document.addEventListener('mouseleave', handler)` where `e.clientY < 5` — desktop only (`window.innerWidth > 768`)
- **Idle detection:** `setTimeout(45000)` reset on any user interaction (`mousemove`, `touchstart`, `keydown`, `scroll`)
- **Minimum page time:** 30 s must pass before any trigger fires
- **One popup per session max:** Once shown (even if not dismissed), set flag so it never shows again in same session

---

## Feature 2: 🧩 "You Might Also Like" — Smarter Lighters Recommendations

| Question | Answer | Implementation note |
|---|---|---|
| Algorithm | Same type first → shuffle → fill from other types | Fisher-Yates shuffle in `[slug].tsx` relatedProducts memo |
| Scope | Lighters only | No cross-category suggestions for now |

### Algorithm (canonical)
```ts
// In pages/san-pham/lighters/[slug].tsx — relatedProducts useMemo
const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const sameType = lighters.filter(
  (l) => l.lighterType?._ref === lighter.lighterType?._ref && l._id !== lighter._id
);
const otherTypes = lighters.filter(
  (l) => l.lighterType?._ref !== lighter.lighterType?._ref && l._id !== lighter._id
);
const result = [...shuffle(sameType), ...shuffle(otherTypes)].slice(0, 12);
```

### Analytics
- New event: `product_recommendation_click` — props: `{ product_name, source: "related_lighters" }`
- Add to `utils/analytics.ts` + mirror in `utils/umamiAnalytics.ts`

---

## Feature 3: 📱 Progressive Web App (PWA)

| Question | Answer | Implementation note |
|---|---|---|
| Library | `next-pwa` | `pnpm add next-pwa` |
| Dev/prod mode | `NEXT_PUBLIC_ENABLE_PWA=true` flag | `disable: process.env.NEXT_PUBLIC_ENABLE_PWA !== 'true'` in withPWA config |
| Icons source | User-provided avif files | `/public/branding/pwa-icon-192.avif` + `pwa-icon-512.avif` |

### Implementation Decisions
- **Manifest icon format:** Reference `.avif` directly in manifest. Modern browsers (Chrome 85+, Firefox 93+) support avif. Add `.png` fallback if needed later.
- **Env flag:** Add `NEXT_PUBLIC_ENABLE_PWA=` (empty/false) to `.env.example` with comment
- **next-pwa version:** Use `next-pwa@5.x` which targets Next.js 12 (NOT `@ducanh2912/next-pwa` which targets Next.js 13+)
- **Cache strategy:** 
  - Pages → NetworkFirst
  - Images (`cdn.sanity.io`, `res.cloudinary.com`) → CacheFirst, max 60 entries, 30 day expiry
  - Static assets → CacheFirst (immutable)
- **Offline fallback page:** `public/offline.html` — dark background `#0a0a0a`, white text, INUT brand, link back to `/`

### Files
| File | Action |
|---|---|
| `package.json` | Add `next-pwa@^5.6.0` |
| `next.config.js` | Wrap with `withPWA({ dest: 'public', disable: ... })` |
| `public/manifest.json` | Create with avif icon refs |
| `public/offline.html` | Create offline fallback |
| `pages/_document.tsx` | Add manifest link + theme-color + apple-touch-icon |
| `.env.example` | Add `NEXT_PUBLIC_ENABLE_PWA=` |

---

## Feature 4: 🔍 SEO Enhancement — Keywords + AI Search Optimization

| Question | Answer | Implementation note |
|---|---|---|
| AI crawlers | Allow all major AI bots | GPTBot, ClaudeBot, PerplexityBot, anthropic-ai, ChatGPT-User |
| `llms.txt` language | Vietnamese + English | Both sections in single file |
| Structured data scope | **All product detail pages** | lighters + skin-laptop + macnut + all service pages |
| FAQ data source | Static in `utils/seo-constants.ts` | No Sanity schema changes needed |

### `public/llms.txt` structure
```
# INUT Design — llms.txt
[English business profile]
[Vietnamese business profile]
Products, services, location, contact, hours
```

### Structured Data pages (expanded from spec)
| Page | LocalBusiness | FAQPage | BreadcrumbList |
|---|---|---|---|
| `/` (homepage) | ✅ | — | — |
| `/san-pham/lighters/[slug]` | — | ✅ (5 Q&A) | ✅ |
| `/san-pham/skin-laptop/[slug]` | — | ✅ (5 Q&A) | ✅ |
| `/san-pham/skin-nut-phim/[slug]` | — | ✅ (5 Q&A) | ✅ |
| `/services/[...slug]` | — | ✅ (3 Q&A generic) | ✅ |

### FAQ content categories (in `utils/seo-constants.ts`)
- `LIGHTERS_FAQ` — 5 Q&A about bật lửa custom (chất liệu, số lượng tối thiểu, thời gian, giá, thiết kế)
- `SKIN_LAPTOP_FAQ` — 5 Q&A about skin laptop (tương thích model, dễ dán, độ bền, tháo ra có để lại keo không, in màu gì)
- `MACNUT_FAQ` — 5 Q&A about skin nút phím (macbook model nào, có ảnh hưởng gõ phím không, thời gian giao)
- `SERVICES_FAQ` — 3 generic Q&A (quy trình đặt hàng, thời gian giao, phương thức thanh toán)

### Keywords to integrate into meta descriptions
| Page | Meta description (final, 140-160 chars) |
|---|---|
| Homepage | `INUT Design — xưởng in skin laptop, sticker, bật lửa custom tại Đà Nẵng. Báo giá trong 5 phút, giao nhanh, chất lượng cao. Zalo: 0327 124 321.` |
| Lighters index | `In bật lửa custom theo yêu cầu tại Đà Nẵng. Chọn mẫu, upload hình, nhận hàng trong 2–3 ngày. Số lượng từ 1 cái. Báo giá ngay qua Zalo.` |
| Skin laptop index | `Dán skin laptop đà nẵng uy tín — INUT Design. Hàng nghìn mẫu có sẵn hoặc in theo yêu cầu. Tương thích hầu hết laptop, macbook. Zalo: 0327 124 321.` |

---

## Implementation Order (final)

```
Phase A — No new dependencies:
  1. f4-seo-llms          Create public/llms.txt (VI + EN)
  2. f4-seo-robots        Update robots.txt via next-sitemap.config.js
  3. f4-seo-local-biz     Create LocalBusinessSchema component → mount on homepage
  4. f4-seo-breadcrumb    Add BreadcrumbList to all product detail pages
  5. f4-seo-faq-schema    Create FAQSchema component + seo-constants.ts FAQ data
  6. f4-seo-meta          Update meta descriptions on index pages
  7. f1-popup-analytics   Add 3 popup events to analytics.ts + umamiAnalytics.ts
  8. f1-popup-hook        Create hooks/useSmartPopup.ts
  9. f1-popup-component   Create SmartZaloCTAPopup component
  10. f1-popup-mount      Mount in _app.tsx
  11. f2-reco-algorithm   Upgrade relatedProducts memo in [slug].tsx
  12. f2-reco-analytics   Add click tracking + prop to RelatedProducts

Phase B — Requires next-pwa install:
  13. f3-pwa-deps         pnpm add next-pwa@^5.6.0
  14. f3-pwa-manifest     Create public/manifest.json
  15. f3-pwa-offline      Create public/offline.html
  16. f3-pwa-config       Wrap next.config.js with withPWA + env flag
  17. f3-pwa-document     Update _document.tsx
  18. .env.example        Add NEXT_PUBLIC_ENABLE_PWA=
```

---

## Open Questions / Risks

| Risk | Mitigation |
|---|---|
| `next-pwa@5.x` + Next.js 12 compatibility | Confirmed supported — widely used combination |
| avif icons in PWA manifest | Modern browsers support it; add png fallback in v2 if needed |
| Structured data on `/services/[...slug]` is a catch-all route | Use page-level props to determine which FAQ set to load |
| Popup on all pages may annoy blog readers | Acceptable — session-only cooldown limits it to once per session |

---

## 🏆 Implementation Priority (Recommended)

### Scoring model: Impact × Speed-to-Value ÷ Risk

| Feature | Business Impact | Speed to Value | Risk | Score |
|---|---|---|---|---|
| SEO + AI Search | 🟢 High — compounds daily | 🟡 Medium (weeks) | 🟢 Zero (no runtime code) | **9/10** |
| Smart Popup | 🟢 High — direct conversion | 🟢 Immediate | 🟢 Low | **9/10** |
| Recommendations | 🟡 Medium — UX/page depth | 🟢 Immediate | 🟢 Very low | **7/10** |
| PWA | 🟡 Medium — long-term retention | 🔴 Slow (weeks to show) | 🟡 Medium (service worker) | **5/10** |

---

### 🥇 Priority 1 — Feature 4: SEO + AI Search *(do this first)*

**Why first:**
- **Zero risk** — only adds files and meta tags, nothing can break
- **Compounding value** — Google and AI crawlers re-index within 24–48 h; every day earlier = more traffic
- **AI search is NOW** — GPT, Perplexity, Claude are actively crawling; `llms.txt` is a 15-min win with months of payoff
- **Unblocks marketing** — structured data improves click-through rate from search immediately after deploy

**Sub-priority within SEO:**
```
1a. llms.txt + robots.txt         ← 15 min, zero risk, immediate AI visibility
1b. LocalBusiness schema          ← homepage rich result in Google Maps / Knowledge Panel
1c. BreadcrumbList (all pages)    ← navigation rich result, improves CTR
1d. FAQPage schema + content      ← featured snippet eligibility
1e. Meta description updates      ← last, depends on FAQ content being written
```

---

### 🥈 Priority 2 — Feature 1: Smart Popup (Zalo CTA) *(second)*

**Why second:**
- **Highest direct revenue impact** — Zalo is the #1 closing channel for Vietnamese e-commerce
- **Infrastructure is ready** — `engagementScore.ts`, `useEngagementTracking`, analytics hooks all exist, just need the UI layer
- **Every day without it = lost conversions** — high-intent visitors bounce with no prompt
- **Low risk** — session-only, globally mounted, no data model changes

**Sub-priority:**
```
2a. popup analytics events        ← foundation, needed before component
2b. useSmartPopup hook            ← business logic (timers, exit-intent)
2c. SmartZaloCTAPopup component   ← UI (depends on 2a + 2b)
2d. mount in _app.tsx             ← activate (depends on 2c)
```

---

### 🥉 Priority 3 — Feature 2: Smarter Recommendations *(third)*

**Why third:**
- **Low effort** — 2 tasks, both scoped to existing files
- **Improves page depth** — users who don't immediately buy browse more → engagement score rises → triggers popup
- **Synergy with popup** — better recommendations + popup = compounding conversion loop
- **Very low risk** — algorithm change in a single `useMemo`, no new components

**Sub-priority:**
```
3a. algorithm upgrade             ← relatedProducts memo in [slug].tsx
3b. click tracking                ← analytics prop on RelatedProducts
```

---

### 4️⃣ Priority 4 — Feature 3: PWA *(last)*

**Why last:**
- **Slow time-to-value** — users must visit → get prompted → choose to install → return. Takes weeks to show metrics.
- **Medium risk** — service workers are notoriously tricky; bad cache rules can serve stale pages
- **Dependency on env flag** — requires coordination with deployment (set `NEXT_PUBLIC_ENABLE_PWA=true` in production env)
- **Non-breaking to defer** — site works perfectly without it; PWA is an enhancement, not a fix

**Sub-priority:**
```
4a. pnpm add next-pwa             ← install
4b. manifest.json                 ← PWA identity
4c. offline.html                  ← fallback page
4d. next.config.js withPWA wrap   ← activation (depends on 4a + 4b + 4c)
4e. _document.tsx meta tags       ← browser hints (depends on 4d)
4f. .env.example update           ← documentation
```

---

### 📅 Suggested Sprint Plan

```
Day 1 (1–2 h):   Priority 1 — SEO quick wins (llms.txt, robots.txt, LocalBusiness)
Day 1–2 (2–3 h): Priority 1 — SEO structured data (Breadcrumb, FAQ, meta descriptions)
Day 2 (2–3 h):   Priority 2 — Smart Popup (hook + analytics + component + mount)
Day 3 (1 h):     Priority 3 — Recommendations (algorithm + click tracking)
Day 4 (2–3 h):   Priority 4 — PWA (install + config + icons + manifest)
──────────────────────────────────────────────────────
Total estimated: ~8–11 hours of focused implementation
```

---

*Clarified by GitHub Copilot CLI — 2026-07-24*
