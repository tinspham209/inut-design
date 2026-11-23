# INUT Design — Vercel Fluid Active CPU Investigation Handoff

**Date:** 2026-11-23 (Asia/Ho_Chi_Minh)
**Project:** `inut-design`
**Vercel team:** `tin-phams-projects-9441bb27` (Hobby / Free)
**Purpose:** Continue investigation and implement verified fixes using Copilot CLI in the website repository.
**Evidence:** Screenshots supplied by the site owner from Vercel Usage, Observability → Functions, route-level Compute/CDN, and Logs. No repository code has been reviewed yet.

> **Evidence labels:** **[OBSERVED]** directly visible in screenshots; **[INFERENCE]** plausible interpretation, not verified; **[TO VERIFY]** requires repository, function logs, or additional data. Do **not** present inferences as root causes.

## 1. Urgent operational context

- **[OBSERVED]** Vercel warning: `Your free team ... has used 100% of the included free tier usage for Fluid Active CPU (4 hours). Your account will be paused in 24 hours (November 23, 2026). Upgrade now to prevent service disruption.`
- **[OBSERVED]** Vercel Usage shows **`4h 57s / 4h`**. This means **4 hours and 57 seconds**, not 4 hours 57 minutes; over allowance by approximately **57 seconds** (~0.4%).
- **[OBSERVED]** The entire shown usage is attributed to project **`inut-design`**.
- **[TO VERIFY URGENTLY]** Whether the team/project/deployment has actually been paused and whether production `https://inutdesign.com` remains reachable. The warning is a risk notice, **not** proof that the site is currently offline.
- **Important:** Reducing future CPU consumption does not undo usage already accrued in the current billing/usage period. Confirm account/billing status separately from code remediation. Verify hosting plan and commercial-use policy before choosing a longer-term hosting solution.

## 2. Observed usage pattern (roughly Oct 24–Nov 23)

- **[OBSERVED]** Usage graph shows CPU consumed **consistently nearly every day**, visually around **5–11 minutes per day**, with no obvious single massive spike. The final day is partial.
- **[INFERENCE]** Continuous daily consumption is consistent with exhausting a **4-hour/month** allowance even at relatively low traffic; e.g., 8 minutes/day × 30 days = 240 minutes.
- **[NOT ESTABLISHED]** DDoS, a specific bot, high legitimate traffic, or any particular function as the *month-long* primary cause.

## 3. Function summary — 12-hour snapshot

Screen shows **All Environments** and **Last 12 hours** (do not assume Production-only).

| Metric | Screenshot value |
|---|---:|
| Invocations | 207 in earlier screenshot; 210 in later screenshot |
| Function error rate | 0% |
| Timeouts | 0% |
| Active CPU average / P75 / P95 (later screenshot) | 488ms / 530ms / 624ms |
| Memory average / P75 / P95 | 407MB / 416MB / 418MB |
| CPU throttle average / P75 / P95 | 9.2% / 10.9% / 11.7% |
| Start types | 64.8% hot / 35.2% cold |
| Compute region / tier | HKG1 / CPU Standard; Fluid enabled |

**[OBSERVED]** Most CPU samples shown are under 1 second, but the 12-hour graph contains a few spikes to approximately 7–9 seconds. Error-free responses do not mean CPU usage is efficient.

### Route ranking — Active CPU, 12-hour snapshot

Numbers are from a *route list screenshot*, not a complete 30-day report; only the first page of four is visible.

| Route | Invocations | Total Active CPU | Approx CPU/invocation |
|---|---:|---:|---:|
| `/` | 85 | 37s | 435ms |
| `/contact` | 4 | 35s | **8,750ms** |
| `/san-pham/skin-laptop/[slug]` | 44 | 8s | 182ms |
| `/san-pham/lighters/[slug]` | 31 | 5s | 161ms |
| `/_next/data/[buildId]/san-pham/skin-laptop/[slug].json` | 19 | 2.59s | 136ms |
| `/san-pham/skin-nut-phim/[slug]` | 12 | 2.23s | 186ms |
| `/creativa/skin-laptop/[slug]` | 5 | 1.16s | 232ms |
| `/_next/data/[buildId]/creativa/skin-laptop/[slug].json` | 6 | 1s | 167ms |
| `/creativa` | 3 | 830ms | 277ms |
| `/search` | 1 | 650ms | 650ms |

**Priority interpretation:**

1. **`/contact` is the clearest high CPU-per-invocation anomaly.** Four invocations account for almost as much CPU as 85 invocations of `/`; ~20× CPU per invocation compared with homepage. This is a **12-hour** observation, not proof of the top monthly cause.
2. **Homepage `/` is also a large contributor by aggregate CPU**, due to more frequent execution. Check whether the HTML needs request-time server rendering.
3. Product routes and `/_next/data/...json` also execute Functions. Inspect render strategy and caching; do not automatically assume these functions are unnecessarily dynamic.

## 4. `/contact` route details

The route-level **Compute** screenshot shows:

- **4 invocations; approx 35 seconds total Active CPU**, with **7–9 seconds CPU per invocation** (rounded average displayed as `9s`).
- **0% errors and 0% timeouts**.
- **Memory** average ~653MB; P75/P95 ~654MB.
- **CPU Throttle** average ~24.7%, P75/P95 ~24.9%.
- **Start type: Hot 100%** for displayed samples. Thus **cold starts alone cannot explain these unusually expensive invocations**.
- **Duration** chart is visibly labeled **`Demo Data`**, as is TTFB. **Do not** interpret their displayed milliseconds as real measurements or contrast them with real CPU time.
- The CDN tab for `/contact` showed **4 requests** and ~20.2kB average response size in the same short time window.

**Possible explanations to test (not yet proven):** heavy work within `getServerSideProps`, `getInitialProps`, React server render, Sanity data transformation, synchronous parsing/computation, dependency initialization, or unexpectedly expensive request-path logic. Logs and source code are required to isolate the culprit.

## 5. Homepage `/` route details

Earlier detailed Compute screenshot:

- 79 invocations in that screenshot window (route table later shows 85; snapshots differ in capture time).
- Average CPU ~439ms; memory ~413MB; CPU throttle ~11.3%; **cold starts ~53.2%** on its own route snapshot.
- No errors/timeouts. It is being handled by a Function at least for the measured invocations.

**[TO VERIFY]** Does homepage use `getServerSideProps`, `getInitialProps` via custom `_app`, preview mode, dynamic behavior, or another implementation that prevents/static-caching? Could it safely use `getStaticProps` + ISR while preserving SEO and current content freshness?

## 6. Sanity API observations

- **[OBSERVED]** In the 12-hour route/global view, External APIs shows host `soud11bs.apicdn.sanity.io` with **340 calls**.
- **[NOT ESTABLISHED]** Which routes generated those calls, how many were cache hits, whether any request triggered multiple queries, or what CPU those API calls cost.
- **Important:** Waiting on network I/O is not itself equivalent to Active CPU. Sanity could still indirectly cause CPU through postprocessing, JSON parsing, server rendering, query fan-out or repeated work; investigate rather than assume.
- **[TO VERIFY]** Sanity client instantiation and `useCdn`, query batching/shape, fetch placement, data caching and ISR strategy, repeated server-side fetches, preview mode, heavy transformations.

## 7. CDN request log: `/contact/form` repetition

The last uploaded screenshot is from **Logs → `CDN Requests`**, timeline **Last hour**, search text `/contact`. This is **not** a dedicated Vercel Function execution log.

- **[OBSERVED]** ~11 `GET https://inutdesign.com/contact/form` requests between **08:17 and 08:59, Nov 23, 2026**, all HTTP **200**.
- **[OBSERVED]** Six requests from **08:37:00.94 to 08:38:01.19**; the first five are about **10 seconds apart**, then another ~20 seconds later.
- **[OBSERVED]** A `GET /_next/data/<buildId>/contact.json` received **200** near 08:55:18 and **304** near 08:55:24. JavaScript chunks for `/contact` and `/contact/form` were also fetched.
- **[INFERENCE]** The repeating ~10-second pattern suggests a possible poller, automated monitor/bot, or client refresh loop. **It does not prove bot traffic or malicious behavior.**
- **Crucial distinction:** `/contact` **and** `/contact/form` are distinct paths. The observed repeated **CDN** requests to `/contact/form` are **not evidence that `/contact/form` caused the 35 seconds of Function CPU recorded against `/contact`**. Check cache status, request type, corresponding compute invocations, user agents and logs.
- Search text `/contact` matches multiple paths and even static asset filenames. Filter by **exact Request Path** when attributing traffic.

## 8. Information gaps / limits

- **No source code** (`pages/contact.tsx`, `pages/contact/form.tsx`, homepage or API handlers) was provided in the chat.
- No real Function runtime log with tracing, execution timings, stack traces, or per-request console output has been reviewed.
- The available function snapshots cover **12 hours**, whereas quota consumption is over a longer period. Four pages of function routes exist; only page one was reviewed.
- Observability view had **All Environments** selected. Separate Production from Preview/Development before prioritizing by production impact.
- Free/Hobby log retention and available timeline limit may restrict historical investigation.
- Observed traffic volume alone cannot diagnose bot vs human; CDN hits and function invocations are different metrics.
- Project tech previously discussed: **Next.js 12 Pages Router, React 18, TypeScript, Sanity CMS**. **Verify actual versions in `package.json`** rather than assuming current branch is identical.

## 9. Investigation plan for Copilot CLI (repo access required)

### P0 — Protect availability and scope

1. Have operator verify current Vercel account/project status and public site availability; identify if pause is active, impending or already resolved. Do not confuse current account status with a future CPU code fix.
2. Inspect `package.json`, `next.config.*`, `vercel.json`, routing tree and deployment config. Confirm Next.js runtime/version and which functions deploy.
3. Do not print, commit, or transmit `.env*`, tokens, passwords, API secrets, customer contact form submissions, or other private data. Redact diagnostics.

### P1 — Explain `/contact` CPU anomaly

1. Locate exact page route and imports: e.g. `pages/contact.tsx`, `pages/contact/index.tsx`, `src/pages/contact*`; also inspect `pages/contact/form*` independently.
2. Trace `getServerSideProps`, `getInitialProps`, `getStaticProps`, custom `_app.getInitialProps`, preview/draft behavior, middleware, server-side components/utilities, and any relevant API handlers.
3. Identify all work performed **per request**: Sanity queries, JSON transforms, expensive loops, image manipulation, parsing, heavy imports, synchronous computation, repeated fetching, logging.
4. Explain why `/contact` generates a Function invocation and whether 7–9s CPU is reproducible. If not reproducible, state that honestly and recommend instrumentation.
5. Determine whether `/contact` can switch to SSG/ISR; if a form needs POST/API processing, separate form submission endpoint from statically rendered page.
6. Inspect `/contact/form` for `setInterval`, timers, `useEffect` loops, SWR `refreshInterval`, React Query refetch settings, `router.reload`, auto-refresh, health checks, external monitors and bot-sensitive routes. Do not conflate browser polling with server CPU without correlation.

### P2 — Reduce recurring baseline CPU

1. Audit homepage `pages/index.*` and pages in the usage table for unnecessary SSR, missing cache, repeated data fetching and expensive server rendering.
2. Check `getStaticPaths` fallback modes, ISR `revalidate`, on-demand revalidation and Next data (`/_next/data/...json`) requests. Make sure proposed optimizations preserve dynamic product slugs and new product publishing.
3. Audit Sanity query paths: `useCdn`, fetch call counts, shared data duplicate queries, GROQ projections, expensive transformations, preview behavior.
4. Inspect middleware, API routes, cron schedules, uptime checks, external crawlers and any route rewritten or redirected into functions. Investigate production-only traffic separately.
5. Prioritize by **total CPU = invocations × CPU/request**, not just most-expensive single request. Ask operator for longer-period per-route data if available.

### P3 — Implement and validate carefully

1. Produce findings **with file path + line numbers**, classify as confirmed/likely/unknown, and estimate impact before changing code.
2. Propose the smallest safe code changes first (e.g. eliminate request-time SSR on static contact page; reuse/cache Sanity data; remove accidental polling if present).
3. Preserve SEO metadata, canonical URLs, dynamic slug pages, preview behavior, localized content and contact form functionality.
4. Run available lint, typecheck, tests, and `next build`; inspect build output to distinguish static vs server-rendered routes. Do not fake measurements.
5. Explain validation steps after deployment: Function CPU per route, invocation counts, CDN cache behavior, overall active CPU/day; compare equivalent intervals and environments before/after.
6. Do not automatically upgrade plan, alter billing, deploy production or change DNS without owner approval.

### Useful repo search commands (run from repo root; adjust to its structure)

```bash
cat package.json
find pages src/pages -maxdepth 4 -type f 2>/dev/null | grep -E '(contact|index|_app|api|san-pham|creativa)'
rg -n 'getServerSideProps|getInitialProps|getStaticProps|getStaticPaths|revalidate|fallback|unstable_revalidate' --glob '!node_modules/**' .
rg -n 'createClient|sanityClient|useCdn|apicdn.sanity.io|fetch\(' --glob '!node_modules/**' .
rg -n 'setInterval|setTimeout|refreshInterval|refetchInterval|router\.reload|router\.replace|window\.location\.reload' --glob '!node_modules/**' .
rg -n 'cron|schedule|middleware|rewrites|redirects|headers' vercel.json next.config.* middleware.* src pages .github 2>/dev/null
```

**Note:** Commands are discovery aids, not evidence that these mechanisms exist. Avoid indiscriminately dumping files containing secrets.

## 10. Concrete deliverable expected from Copilot CLI

Return:

1. **Root-cause assessment** with confidence levels; code citations by file/line and correlation to observed metrics.
2. **Prioritized fix list**: P0 critical, P1 high impact, P2 optional; include performance vs correctness/SEO trade-offs.
3. **Patch(es)** only if justified by inspected source and testable; otherwise request precise missing evidence.
4. **Verification evidence**: commands run, build/test results, expected changes to render mode, and a 24-hour post-deploy CPU monitoring plan.
5. **Open questions**, especially `/contact` vs `/contact/form` behavior and why the former used ~9s CPU per invocation.

---

## 11. Ready-to-paste prompt for Copilot CLI

> Read `INUT_VERCEL_CPU_HANDOFF.md` in full. You are taking over an ongoing investigation of Vercel Hobby `Fluid Active CPU` usage for project `inut-design`. First inspect this repository, confirm framework/configuration and enumerate the exact source files for `/`, `/contact`, `/contact/form` and relevant Sanity data fetches. Investigate why `/contact` consumed ~35s CPU in four invocations (~8.75s each) despite 100% hot starts, and why homepage consumed 37s CPU over 85 invocations in a 12-hour snapshot. Independently investigate recurring CDN GET `/contact/form` requests around 08:37 at ~10-second intervals; do not assume they caused `/contact` CPU usage. Separate observed evidence, hypothesis and confirmed cause. Trace Next.js render mode (SSR/SSG/ISR), custom `_app`, API routes, middleware, client polling, caching, Sanity fetch/transform, and build output. List your findings with file:line references, then propose small high-impact fixes that preserve SEO, product updates and contact form. Apply fixes only where justified, run relevant lint/typecheck/tests/build, and summarize exact verification steps and remaining uncertainties. Do not modify billing, DNS or production deployment; do not disclose secrets. Start with a concise repository audit and hypotheses ranked by evidence.
