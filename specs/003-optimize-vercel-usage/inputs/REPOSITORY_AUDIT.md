# Repository Audit: Vercel Fluid Active CPU

**Date**: 2026-11-23

**Repository revision**: `206a986`

**Scope**: `/`, `/contact`, `/contact/form`, shared layout and rendering, Sanity
public reads, and Next.js prefetch behavior.

## Status Check

- Vercel MCP reports the latest production deployment `dpl_2YMdr...` as ready
  and the project billing status as active.
- Direct production reads of `/`, `/contact`, and `/contact/form` returned HTTP
  200 at audit time. The 24-hour pause warning therefore does not prove a current
  outage.
- The supplied 12-hour Vercel observations cover `All Environments`. Production
  and Preview must be separated during final before/after validation.
- Hobby runtime logs retain only about one hour. The requested historical
  12-hour log query could not be retrieved, and a 30-minute production query for
  `contact` returned no rows. User-agent or requester identity for the earlier
  `/contact/form` pattern is therefore not available through the retained logs.

## Confirmed Findings

### 1. Homepage regeneration performs four content-source reads

- `/` is ISR with a 300-second revalidation window:
  `pages/index.tsx:158-176`.
- Each regeneration reads the local blog list and then performs four Sanity
  reads: one banner query at `pages/index.tsx:160`, followed by three
  concurrently started product queries at `pages/index.tsx:162-166`.
- The three product methods each issue their own Sanity fetch:
  `api-client/products.ts:27-32`, `api-client/products.ts:98-103`, and
  `api-client/lighters.ts:132-137`.
- The banner method issues one Sanity fetch:
  `api-client/banner.ts:18-29`.
- **Strong correlation:** Vercel observed 85 `/` function invocations and 340
  Sanity external calls in the same 12-hour sample. The current route performs
  exactly four reads per regeneration, so `85 × 4 = 340`. No other route is
  required to explain the full external-call count.
- The Vercel production build identifies `/` as `ISR: 300 Seconds`, confirming
  that these requests are regeneration work rather than per-visitor SSR.

**Assessment**: High confidence primary cause of Sanity call volume and a major
confirmed contributor to recurring aggregate CPU. Waiting on Sanity is not
counted as CPU by itself, so the correlation does not prove every external call
causes equivalent CPU.

### 2. `/contact` is an expensive ISR route for mostly static content

- `/contact` is not SSR. It uses `getStaticProps` with a 300-second
  revalidation window: `pages/contact/index.tsx:204-211`.
- Every regeneration calls Sanity once for only the contact banner:
  `pages/contact/index.tsx:205` and `api-client/banner.ts:18-29`.
- The page otherwise consists of static contact information and links, while a
  nearby static `/contact/form` page already uses a local image.
- Vercel observed 4 invocations consuming about 35 seconds of Active CPU, or
  roughly 8.75 seconds per invocation. Cold starts are not a sufficient
  explanation because the screenshot reported 100% hot starts.

**Assessment**: High confidence that `/contact` uses function compute because a
single CMS banner forces ISR regeneration. The exact 7–9-second CPU operation is
not localized by the available repository or retained logs, so the specific
internal cause remains open. The code shows no per-request loop or expensive
contact calculation.

### 3. `/contact/form` is static and has no repeating GET loop

- `/contact/form` has no `getServerSideProps`, `getStaticProps`, ISR, polling, or
  route reload: `pages/contact/form/index.tsx:12-63`.
- Its only client timer performs one debounced `POST /validate-phone` after a
  valid Vietnamese phone number has been entered:
  `hooks/usePhoneZaloCheck.ts:9-48`. It cannot explain periodic anonymous `GET`
  requests.
- The page imports the quote form directly, and submission occurs only from the
  visitor action at `components/contact/QuoteRequestForm.tsx:101`.

**Assessment**: Confirmed not caused by an in-page polling loop.

### 4. Next.js navigation can prefetch `/contact/form`

- The mobile header always renders a Next.js link to `/contact/form`:
  `components/common/header/header-mobile.tsx:159`.
- The homepage Hero and lower contact CTA also link to `/contact/form`:
  `components/home/hero.tsx:120`, `components/home/chot-don.tsx:130`.
- Broad custom speculation and fallback prefetching were already disabled:
  `utils/speculation-rules.ts:79`, `utils/prefetch-fallback.ts:155-169`.
  Default Next.js `Link` prefetching is intentionally still responsible for
  visible links.

**Assessment**: Plausible explanation for background GETs and `_next/data`
requests, but ordinary prefetch does not explain a stable 10-second repeat
without an external page load/refresh/poller. That traffic remains unclassified.

### 5. Shared document rendering is part of every regeneration

- Custom `_document.getInitialProps` renders the full page, extracts Emotion
  styles, and serializes them on every server render:
  `pages/_document.tsx:106-122`.
- ISR regeneration therefore includes React server rendering plus shared Emotion
  style extraction, not only the Sanity network request.
- The latest Vercel build reports a 332 kB shared `_app` first load, and the
  current homepage HTML returned by production is substantially larger than the
  contact page.

**Assessment**: Likely contributor to regeneration CPU. It does not explain by
itself why a smaller `/contact` regeneration is reported as more expensive than
`/`; instrumentation or before/after profiling is required.

### 6. No repository-level schedule or middleware explains the route pattern

- No `middleware.*` file or Vercel `vercel.json` route configuration is present.
- No broad prefetch interval or route refresh interval was found.
- A separate SPX cron API exists, but it is unrelated to `/contact` and no
  repository configuration connects it to the observed 10-second pattern.

## Root-Cause Ranking

| Priority | Finding | Confidence | Current impact |
|---|---|---|---|
| P0 | Homepage performs four Sanity calls per 5-minute ISR refresh; 85 refreshes exactly explain 340 external calls | High | Major aggregate call volume and recurring CPU |
| P0 | `/contact` forces ISR compute for a single CMS banner despite otherwise static content | High | Clear 35s anomaly in 4 observed invocations |
| P1 | Shared `_document` Emotion server rendering runs during each ISR regeneration | Medium | Likely compute amplification, magnitude unknown |
| P1 | Short 300-second ISR windows create repeated refresh opportunities across public routes | High | More regeneration work during steady traffic |
| P2 | Next.js prefetch exposes `/contact/form` to background GETs from common navigation | Medium | Plausible contributor to CDN traffic, not CPU anomaly |
| P2 | External monitor, bot, crawler, or repeated browser requester may fetch `/contact/form` every 10 seconds | Low-medium | Cannot be confirmed with expired logs |

## Recommended Requirements for Planning

1. Make homepage content refresh a single logical content-source operation and
   preserve the 15-minute or better freshness requirement.
2. Make `/contact` a no-compute cached page for normal visitors; if a changing
   banner must remain editable, separate publication-time refresh from visitor
   traffic and retain the freshness guarantee.
3. Measure and bound shared Emotion/React work per regeneration. Do not treat a
   faster external API request alone as proof that Active CPU improved.
4. Bound or disable automatic prefetch for `/contact/form` when normal navigation
   does not require it, while keeping user-requested navigation responsive.
5. Add evidence that separates Production, Preview, ISR regeneration, Next data
   fetches, and static CDN hits.
6. Preserve SEO, content freshness, Sanity reference shapes, analytics, contact
   submission, and all protected commerce flows.

## Verification Gaps

- Production-only route metrics for the same full interval as the screenshots.
- User agent, cache status, and requester identity for the repeated
  `/contact/form` GETs.
- A trace or instrumentation boundary showing which portion of the `/contact`
  regeneration consumes 7–9 seconds of Active CPU.
- Full 30-day route distribution beyond the first visible page of the route table.
- A normalized before/after month or equivalent synthetic workload that compares
  the same environments, traffic pattern, and deployment.
# Historical audit note

This audit predates the authoritative user clarification. Any generic 15-minute
freshness recommendation below is historical context only. Current requirements
are 10 minutes for homepage/blog, 24 hours for Creativa/search/product, and an
owner-triggered Production redeploy with 15-minute visibility for urgent
Creativa/search updates; see `../spec.md` and `../analysis-report.md`.
