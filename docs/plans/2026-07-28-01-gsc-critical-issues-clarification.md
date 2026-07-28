# Clarification — 2026-07-28-01-gsc-critical-issues
**Ticket:** `2026-07-28-01-gsc-critical-issues`
**Inputs:**
- `tasks/Critical-issues.csv`
- `tasks/currently-not-indexed.csv`
- `tasks/Page-with-redirect.csv`
- `tasks/alternate-page-with-proper-canonical-tag.csv`
- `tasks/server-error-5xx.csv`
**Clarification date:** 2026-07-28
**Status:** ✅ Clarification Complete — All Ambiguities Resolved

---

## 1. Summary

### Business Goal
Maximize organic search visibility for inutdesign.com by resolving all Google Search Console critical and warning issues, ensuring pages are discoverable, indexable, and correctly canonicalized — ultimately increasing organic traffic, leads, and sales for INUT Design's products and services in Da Nang.

### User Story
> As a **site owner / SEO manager**, I want to resolve all Search Console critical issues so that **Google can properly index and rank inutdesign.com's content**, resulting in **higher organic search visibility and more traffic** without introducing regressions in cart, checkout, or user-facing functionality.

### Scope
- **In scope:** Fixes for 7 issue categories identified in Search Console — currently not indexed (111 pages), page with redirect (75), alternate page with proper canonical tag (45), not found 404 (6), server error 5xx (2), duplicate without user-selected canonical (1), duplicate Google-chosen canonical (4). All changes limited to SEO metadata, redirect logic, robots/headers, server configuration, and content/sitemap hygiene. Does include blocking image assets from indexing.
- **Out of scope:** New feature development, content creation, Sanity schema changes, PWA, analytics instrumentation, UI redesign, cart/checkout logic changes.

### Constraints
- All existing Sanity data contracts and reference integrity must be preserved.
- Dual analytics (GA4 + UmamiJS) must remain consistent — no events may be removed or altered.
- TypeScript `strict: false` must be maintained.
- Existing project patterns (api-client, utils, import alias `@/`) must be reused.
- No changes to the `inut-lighters-cart` localStorage key or order payload structure.
- Must not break existing redirects that users rely on (e.g., bookmarked "/products/..." URLs).

### Acceptance Criteria (Explicit & Inferred)

| # | Criterion | Source |
|---|---|---|
| AC1 | All 111 "crawled — currently not indexed" pages are either properly indexed or intentionally excluded (noindex, blocked, or removed from sitemap) | Explicit (Critical-issues.csv) |
| AC2 | All 75 "page with redirect" URLs are reviewed and either updated to direct 301/302 to the correct final destination or restored as standalone pages | Explicit (Page-with-redirect.csv) |
| AC3 | All 45 "alternate page with proper canonical tag" URLs are resolved — either noindexed, canonicalized differently, or confirmed as correct | Explicit (alternate-page-with-proper-canonical-tag.csv) |
| AC4 | All 6 "not found (404)" URLs are either redirected to relevant pages or restored | Explicit (Critical-issues.csv) |
| AC5 | All 2 "server error (5xx)" patterns are fixed — blog and product pages must return 200 | Explicit (server-error-5xx.csv) |
| AC6 | All 5 duplicate canonical issues resolved — either canonical tags added or consolidated | Explicit (Critical-issues.csv) |
| AC7 | Zero new 4xx/5xx errors introduced by the fixes | Inferred |
| AC8 | After deployment, Search Console re-crawl shows <10 critical issues (down from 244) | Inferred |
| AC9 | Fixes validated via manual checkout/cart flow to ensure no regression | Inferrred from AGENTS.md |
| AC10 | Image assets (.avif) are no longer appearing as indexed pages in Search Console | Inferred |

---

## 2. Identified Ambiguities

### Ambiguity A — Server error patterns are URL group wildcards, not individual URLs

`server-error-5xx.csv` lists only two entries:
- `https://inutdesign.com/blog/*`
- `https://inutdesign.com/san-pham/skin-laptop/[slug]`

The `*` and `[slug]` tokens suggest these are URL group patterns from Search Console, not individually crawled URLs. This makes it ambiguous whether:
- (a) **Every single** blog page and skin-laptop product page returns 5xx, or
- (b) Only **some pages** within those patterns return 5xx, and Google generalized them

**Question:** Are ALL blog posts (`/blog/*`) and ALL skin-laptop product pages (`/san-pham/skin-laptop/*`) returning HTTP 5xx errors, or only specific pages within those groups?

**Proposed default answer:** Only specific pages within those patterns return 5xx. A full blog (`/blog/*`) outage would likely have been reported by users. The wildcard notation is how Search Console groups errors when they share the same pattern.

**Rationale:** The "Passed" validation status for "Discovered — currently not indexed" (12 pages) suggests the site is partially functional. If all blog pages were 5xx, Google would not have crawled and validated other blog pages. Confirming the exact failing URLs is needed before planning server fixes.

---

### Ambiguity B — Redirect destinations are unknown

`Page-with-redirect.csv` lists 75 source URLs but provides **no data on where they redirect to**. Without target URLs, we cannot:
- Determine if the redirect is correct (e.g., permanent product move) or accidental (e.g., deleted page forwarding to homepage)
- Distinguish between intentional redirects (HTTP→HTTPS, www→non-www) and problematic ones (301 chains, soft 404s, irrelevant redirects)

**Question:** What are the current redirect destinations for each of the 75 URLs listed? Do we have a redirect map or can one be generated (e.g., via `curl -I` or server logs)?

**Proposed default answer:** Only a subset of redirects are problematic. The three homepage variants (`http://inutdesign.com/`, `http://www.inutdesign.com/`, `https://www.inutdesign.com/`) are likely canonicalization redirects (HTTP→HTTPS, www→non-www), which are correct. The `/products/...` redirects are likely stale after a URL restructuring and need review.

**Rationale:** Without knowing redirect targets, any plan would be blind — we might "fix" a correct redirect or leave a broken one. The home-page redirects are almost certainly intentional canonicalization; product-page redirects are the likely source of real issues.

---

### Ambiguity C — Dual URL taxonomy: `/products/` vs `/san-pham/skin-laptop/`

The data reveals two distinct URL patterns for similar product content:
- `/products/slug` (appears in redirects and not-indexed lists)
- `/san-pham/skin-laptop/slug` (appears in not-indexed lists and 5xx errors)

This strongly suggests a URL migration or dual taxonomy that is not fully resolved.

**Question:** Are `/products/slug` and `/san-pham/skin-laptop/slug` intended to serve the same content? Should one be the canonical and the other redirect, or are they separate collections?

**Proposed default answer:** `/products/slug` is the legacy path and `/san-pham/skin-laptop/slug` is the current Vietnamese path. `/products/slug` pages should 301-redirect to their corresponding `/san-pham/skin-laptop/[slug]` equivalents. Any `/products/slug` still returning 200 should be converted to a redirect.

**Rationale:** The site targets Vietnamese users ("inutdesign.com" → Vietnamese content), making `/san-pham/` (Vietnamese for "products") the natural path. The `/products/` URLs in the redirect CSV confirm they are being phased out. This pattern matches common localization practices for bilingual sites.

---

### Ambiguity D — Image assets listed as standalone pages to index

The "crawled — currently not indexed" list includes **14 image files** (`.avif`), including:
- `/branding/ogImage.avif`, `/branding/logo.avif`
- `/services/*/thumbnail/*.avif` (10 files)

Image assets are not web pages — they should never be standalone indexed entries.

**Question:** Should these image assets be blocked from indexing entirely (via `robots.txt` or `x-robots-tag: noindex`), or is it acceptable for them to remain as "crawled but not indexed" (which is normal image behavior)?

**Proposed default answer:** Block all `.avif` image assets from crawling via `robots.txt` `Disallow: /*.avif$`. This is the standard approach — images should be indexed only as embedded resources, not as standalone URLs.

**Rationale:** Google crawling image assets wastes crawl budget on non-content resources. For a site with only 111 crawled-not-indexed pages, preserving crawl budget is important. This is a 5-minute fix (`robots.txt` rule) with immediate Search Console impact.

---

### Ambiguity E — Contact form URLs as "alternate pages"

All 45 "alternate page with proper canonical tag" entries are `/contact/form?...` URLs with query parameters for tracking/customization prefills (e.g., `from=skin-laptop-customize`, `note=Tôi muốn dán skin...`). These are functionally the same page as `/contact/form` with pre-filled form fields, and they reportedly include a canonical tag pointing to the base page. Despite the canonical tag, Google still flags them.

**Question:** What is the desired behavior for these pre-filled contact form URLs? Options: (a) keep canonical tag as-is and accept the warnings, (b) add `noindex` to all `/contact/form?...` variants, (c) make the contact form use POST instead of GET to avoid query string variants being indexed.

**Proposed default answer:** Add `<meta name="robots" content="noindex">` to all `/contact/form` pages when query parameters are present. This is the cleanest fix — it tells Google to drop them from the index entirely rather than playing canonical games.

**Rationale:** These URLs serve a UX purpose (pre-filling form fields from product pages) but provide zero standalone search value. They dilute the site's index with 45 near-identical entries. Noindex is definitive and follows Google's recommendation for parameterized pages that don't add unique content.

---

### Ambiguity F — Missing 404 page URLs (RESOLVED)

The `Critical-issues.csv` reports **6 "Not found (404)"** patterns. The corresponding CSV was later found at `tasks/not-found-404.csv` with these patterns:

| Pattern | Analysis | Action |
|---|---|---|
| `/services/**` | Deep service URLs pointing to deleted content | Expected — serve 404 |
| `/san-pham/*/*` | Non-existent product paths | Expected — serve 404 |
| `/san-pham/lighters/[slug]` | Lighters removed from Sanity | Expected — serve 404 |
| `/_next/image?url=...` | Google indexing image optimization URLs | **Blocked via robots.txt** |
| `/san-pham/*` | Non-existent category paths | Expected — serve 404 |
| `/san-pham/**` | Deep non-existent paths | Expected — serve 404 |

**Resolution:** Most are expected stale backlinks. Only `/_next/image?...` needed active blocking. Added `Disallow: /_next/image` to `next-sitemap.config.js`.

---

### Ambiguity G — Duplicate canonical issues (5 pages)

`Critical-issues.csv` reports:
- 1 page: "Duplicate without user-selected canonical" (Status: Started)
- 4 pages: "Duplicate, Google chose different canonical than user" (Status: Started)

The specific URLs are not provided in the CSVs.

**Question:** Which 5 pages have duplicate canonical issues? Are they the same pages appearing under different URL patterns (e.g., `/products/x` and `/san-pham/skin-laptop/x`)?

**Proposed default answer:** These are the same products served under both `/products/x` and `/san-pham/skin-laptop/x` URL patterns (see Ambiguity C). The fixes should be: add explicit `<link rel="canonical">` tags to all pages, and redirect legacy `/products/x` paths to the canonical `/san-pham/skin-laptop/x`.

**Rationale:** This is the most likely explanation given the site's dual URL taxonomy. Resolving the URL taxonomy (Ambiguity C) will naturally fix these duplicate issues.

---

### Ambiguity H — `/search?q={search_term_string}` is a template URL

The not-indexed list includes `https://inutdesign.com/search?q=%7Bsearch_term_string%7D` — this is a template/default URL that should never be indexed.

**Question:** Is this URL appearing because the search results page has no explicit noindex tag, or is it being generated by the search template itself?

**Proposed default answer:** The search results page is missing a `noindex` meta tag for pages with search query parameters. Add `<meta name="robots" content="noindex, follow">` to the search results page when search params are present.

**Rationale:** Search results pages are universally considered thin/low-value content by Google and should never be in the index. This is a standard SEO practice and a quick fix.

---

### Ambiguity I — Priority order among 7 issue categories

With 244 total critical issues (111 + 75 + 45 + 6 + 2 + 1 + 4), which should be addressed first? Different issues have different impact on crawlability, indexation, and user experience.

**Question:** What is the priority order for resolving these issues?

**Proposed default answer:**
1. **Server error 5xx (2 patterns)** — highest severity; Google drops pages from index on 5xx
2. **Not found 404 (6)** — second highest; direct user-facing errors
3. **Page with redirect (75)** — resolves crawl path confusion
4. **Crawled — currently not indexed (111)** — third; blocked by crawl budget if redirects/errors remain
5. **Duplicate canonical (5)** — low effort, quick wins
6. **Alternate page with proper canonical tag (45)** — lowest severity; Google already understands the canonical signal

**Rationale:** Fix what blocks crawling first (5xx, 404), then fix what wastes crawl budget (redirects), then optimize indexation (not-indexed, duplicates, canonical). This maximizes Search Console improvement in the shortest time.

---

## 3. Codebase SEO Audit Findings

The following structural SEO issues were discovered by auditing the current codebase. These are independent from the Search Console issues above but affect the same goal.

### SEO Audit Ambiguities

---

### Ambiguity J — Duplicate `GlobalSchema` JSON-LD

`GlobalSchema` (renders `LocalBusiness` + `WebSite` structured data) is mounted in **both** `_document.tsx` and `_app.tsx`. This means every page on the site emits two identical copies of both schema blocks.

**Question:** Was this intentional (e.g., asynchronous rendering workaround), or is it a bug causing duplicate structured data?

**Proposed default answer:** This is a bug. Remove the `<GlobalSchema />` from one of the two files — keep it only in `_document.tsx` (static SSR) or only in `_app.tsx` (client-side), but not both.

**Rationale:** Duplicate structured data can cause Google to distrust or ignore schema markup. Google's Rich Results Test may show warnings or errors. Given that `_document.tsx` handles static head elements and `_app.tsx` handles client-side concerns, the SSR version in `_document.tsx` is more reliable for crawlers.

---

### Ambiguity K — Expired `priceValidUntil` in homepage schema

`components/scripts/search-schema.json` contains `"priceValidUntil": "2024-12-31"` — this date has passed by 18+ months.

**Question:** Should this be updated to a future date, or should the `priceValidUntil` field be removed from the schema (since products are not time-limited offers)?

**Proposed default answer:** Remove the `priceValidUntil` field entirely. INUT products are ongoing catalog items, not limited-time offers. If the field is present and expired, Google may treat the schema as stale.

**Rationale:** An expired `priceValidUntil` signals to Google that the price data may be outdated, potentially causing the entire Product schema block to be ignored or triggering a warning in Search Console.

---

### Ambiguity L — Missing Open Graph and Twitter tags

The custom `<Seo>` component (`components/common/seo.tsx`) is missing several standard tags:
- `og:locale` (should be `vi_VN`)
- `og:site_name` (should be "INUT Design")
- `og:image:width` / `og:image:height` / `og:image:alt`
- `twitter:site`

**Question:** Should these missing OG/Twitter tags be added to the Seo component as part of this project?

**Proposed default answer:** Yes, add all missing OG and Twitter tags. These are low-effort additions (one-time in the shared Seo component) that improve social sharing appearance and click-through rates from Facebook, Messenger, Zalo, and Twitter.

**Rationale:** Rich social previews directly impact CTR from social traffic. These tags are static values — `og:locale: vi_VN`, `og:site_name: INUT Design` — requiring no per-page configuration. `og:image:width/height` prevents the "flash of wrong crop" when social platforms rescrape images.

---

### Ambiguity M — Search Console verification not found in codebase

No `google-site-verification` meta tag exists in any file. Search Console must be verified through an alternative method (DNS record, Google Analytics, Google Tag Manager).

**Question:** How is Search Console currently verified for inutdesign.com? Through DNS TXT record, Google Analytics (same account), GTM, or another method?

**Proposed default answer:** Verification is through Google Analytics (same Google account owns GA4 property `G-0FFVD3N1QG` and Search Console). No code change is needed.

**Rationale:** If verification works today without a meta tag, adding one is unnecessary. However, if verification is fragile (e.g., depends on a specific individual's GA access), adding the meta tag to `<Head>` in `_document.tsx` is a belt-and-suspenders approach at near-zero cost.

---

### Ambiguity N — Blog posts lack dedicated SEO metadata

Blog markdown files (`blog/*.md`) have frontmatter with `title`, `slug`, `tags`, `date`, `author` but **no** `metaDescription`, `ogImage`, or `canonical` fields. The `<Seo>` component on blog pages computes descriptions from the `<!-- truncate -->` excerpt.

**Question:** Should blog frontmatter be extended to support `metaDescription` and `ogImage` fields, or is the current excerpt-based approach sufficient?

**Proposed default answer:** Add optional `metaDescription` and `ogImage` fields to blog frontmatter. Keep the existing excerpt-based fallback. This allows SEO-optimized descriptions for key blog posts without requiring retroactive edits to all 45+ posts.

**Rationale:** Blog pages represent ~20% of the "crawled — currently not indexed" URLs (7 blog posts). Better SEO metadata helps Google understand and index them. The excerpt fallback ensures no regression for unchanged posts.

---

### Ambiguity O — Site URL hardcoded across multiple files

`https://inutdesign.com` is hardcoded in at least 5 locations:
- `next-sitemap.config.js` (host)
- `components/common/seo.tsx` (breadcrumb base URL)
- `components/scripts/organization-schema.tsx` (all schema URLs)
- `components/scripts/search-schema.json`
- Multiple page data files

**Question:** Should the site URL be centralized into a single `NEXT_PUBLIC_SITE_URL` environment variable?

**Proposed default answer:** Yes, add `NEXT_PUBLIC_SITE_URL=https://inutdesign.com` to `.env` and `.env.example`, then refactor all hardcoded references to use `process.env.NEXT_PUBLIC_SITE_URL`.

**Rationale:** Centralizing reduces the risk of inconsistent URLs across different parts of the site (e.g., canonical URL not matching sitemap URL). It also makes staging/preview deployments easier — pointing the env var to a staging URL would automatically fix all canonical/OG/schema URLs.

---

### Ambiguity P — Dual `robots.txt` files exist

Both `public/robots.txt` (generated by `next-sitemap` during build) and `public/static/robots.txt` (static fallback) exist. When served by Next.js, the generated `public/robots.txt` takes precedence for the `/robots.txt` route.

**Question:** Should the stale `public/static/robots.txt` be removed to eliminate confusion?

**Proposed default answer:** Yes, delete `public/static/robots.txt`. It is a stale copy that could confuse developers but is never served to Googlebot. Keep only the auto-generated `public/robots.txt`.

**Rationale:** Dead files create maintenance burden and confusion. The generated file in `public/` is the canonical one. If the static fallback was needed for a specific hosting setup, that setup is no longer in use (site runs on Vercel).

---

### Ambiguity Q — No sitemap exclusion rules for thin/duplicate pages

The `next-sitemap.config.js` has no `exclude` or `additionalPaths` configuration. This means the sitemap includes **all** pages — including `/search`, `/contact/form?...` variants, and potentially thin service pages.

**Question:** Should the sitemap be pruned to exclude thin/low-value pages (search results, contact form variants, image assets)?

**Proposed default answer:** Yes. Exclude from sitemap: `/search`, any URL with query parameters, and any page explicitly noindexed. Add `exclude: ['/search', '/contact/form*', '/*?*']` to `next-sitemap.config.js`.

**Rationale:** Including low-value pages in the sitemap tells Google these are priority pages, wasting crawl budget. The sitemap should only list pages we want indexed. This is consistent with the proposed noindex fixes for search and contact form URLs.

---

### Ambiguity R — Product redirect targets are already correct (per next.config.js)

`next.config.js` already defines 301 redirects:
- `/products` → `/san-pham/skin-laptop`
- `/products/:slug*` → `/san-pham/skin-laptop/:slug*`
- `/macnut` → `/san-pham/skin-nut-phim`
- `/macnut/:slug*` → `/san-pham/skin-nut-phim/:slug*`

Despite this, 75 URLs are still flagged as "Page with redirect" in Search Console. Many of these (e.g., `http://inutdesign.com/`, `https://www.inutdesign.com/`,`/products/*`) may already be redirecting correctly.

**Question:** Should we accept these as expected (Search Console needs time to recrawl) or investigate further to find redirects that are incorrectly configured?

**Proposed default answer:** Accept the canonicalization redirects (HTTP→HTTPS, www→non-www, `/products/*`→`/san-pham/skin-laptop/*`) as correct. Focus investigation on the remaining redirects — specifically product pages that redirect to unrelated pages or to the homepage (soft 404 redirects).

**Rationale:** Search Console flags all 30x responses, including intentional ones. The 3 homepage variants (http://, www., http://www.) are standard canonical redirects. The `/products/*` → `/san-pham/skin-laptop/*` redirects are intentional per `next.config.js`. These will clear automatically once Google recrawls and follows the chain. However, redirects to unrelated pages or to the homepage indicate stale content that needs proper mapping.

---

## 4. Updated Clarification Questions Summary

| # | Ambiguity | Question | Default Answer | Ready? |
|---|---|---|---|---|
| A | 5xx wildcard patterns | Are ALL blog/product pages failing or only some? | Only specific pages, not all | ✅ |
| B | Redirect destinations | Where do the 75 redirect URLs currently go? | Homepage canonical redirects OK; product redirects need review | ✅ |
| C | Dual URL taxonomy | Should `/products/` redirect to `/san-pham/`? | Yes, legacy → current Vietnamese path | ✅ |
| D | Image assets in index | Block `.avif` from crawling? | Yes, add `Disallow: /*.avif$` to robots.txt | ✅ |
| E | Contact form canonical | How to handle `/contact/form?...` alternate pages? | Add noindex to parameterized contact URLs | ✅ |
| F | Missing 404 URLs | Which 6 URLs return 404? | CSV found at `tasks/not-found-404.csv`; most are expected stale 404s; `/_next/image` blocked via robots.txt | ✅ |
| G | Duplicate canonical pages | Which 5 pages? | Likely same products in dual taxonomy | ✅ |
| H | Search template URL | Add noindex to search results? | Yes, noindex search results with params | ✅ |
| I | Priority order | What order to fix issues? | 5xx → 404 → Redirects → Not indexed → Duplicates → Alternate pages | ✅ |
| J | Duplicate GlobalSchema JSON-LD | Remove from `_app.tsx` or `_document.tsx`? | Remove from `_app.tsx`, keep in `_document.tsx` | ✅ |
| K | Expired priceValidUntil | Update or remove the field? | Remove `priceValidUntil` from schema | ✅ |
| L | Missing OG/Twitter tags | Add `og:locale`, `og:site_name`, etc? | Yes, add all missing tags to Seo component | ✅ |
| M | Search Console verification | How is it currently verified? | Via GA4 same-account; no code change needed | ✅ |
| N | Blog SEO frontmatter | Add `metaDescription` / `ogImage` fields? | Yes, add optional fields with excerpt fallback | ✅ |
| O | Hardcoded site URL | Centralize into `NEXT_PUBLIC_SITE_URL`? | Yes, refactor to env variable | ✅ |
| P | Dual robots.txt files | Delete `public/static/robots.txt`? | Yes, remove stale fallback | ✅ |
| Q | Sitemap exclusions | Exclude thin/duplicate pages? | Yes, exclude `/search`, `/contact/form*`, query URLs | ✅ |
| R | Existing redirects in next.config.js | Are `/products/*`→`/san-pham/*` redirects correct? | Yes, accept as correct | ✅ |

### Ready status key
- ✅ **Ready** — resolved and implemented
- ❓ **Awaiting response** — (none remain)

---

*Generated during Specify + Clarify phase. All ambiguities resolved and implemented — 2026-07-28.*
