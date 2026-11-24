# Implementation Plan: Migrate Vinext sang Cloudflare

**Branch**: `004-migrate-vinext-cloudflare` | **Date**: 2026-11-24 | **Spec**: `spec.md`

**Input**: Feature specification from `/specs/004-migrate-vinext-cloudflare/spec.md`

## Summary

Feature này tạo một parallel Cloudflare deployment path bằng **Vinext** trong khi giữ Pages Router, route, SEO, 22 API contracts và các commerce invariants hiện tại. Target runtime là Next.js 15.5.x + React 19.3.1 + Vinext 1.4.6 + Vite 8 trên Node 22. Public content pages chuyển sang full-static build; `/search` dùng build-time public index + browser filtering. Worker giữ API routes và Worker side chỉ validate upload output đã được browser resize/encode — không chạy native `sharp`.

Plan được refine theo dependency graph lấy từ source thật, không chỉ từ Vinext scanner: 44 `next/image` usages trong 35 files (52 legacy `layout`/`objectFit` prop occurrences trong 28 files), 99 `passHref`/`legacyBehavior` occurrences trong 57 files, 5 carousel call sites, 2 React Three canvases, 11 pages có `revalidate`, 5 dynamic `getStaticPaths`, 1 SSR page, 22 API routes, 4 raw-body Creativa POST routes, 1 14 MB upload route, và một server bundle dependency vào `sharp`/`Buffer`/Node `crypto`.

Release sequence bắt buộc là: baseline capture → upgrade & compatibility → local Vinext verification → preview deploy → release gate → hard DNS cutover → stabilization → rollback point Cloudflare. Planning phase không deploy, không upgrade account, không đổi DNS, không move registrar, và không phát sinh Cloudflare/domain charge.

## Technical Context

**Language/Version**: TypeScript 5.x, `strict: false`; JavaScript/ESM cho config/scripts; Node `>=22 <26`  
**Current Application Baseline**: Next.js 12.3.1, React 18.2, Pages Router, MUI 5, Sanity v2  
**Target Framework Runtime**: Next.js 15.5.x, React/ReactDOM 19.3.1, Vinext 1.4.6, Vite 8, pnpm 11.5.3
**Primary Dependencies**: MUI 5, Zustand, SWR, React Hook Form, Sanity client/image helpers, GA4/GTM + Umami, `@vinext/cloudflare`/`cf` CLI sau khi implementation phase chạy `vinext init`  
**Storage**: Sanity v2 là system of record; localStorage key `inut-lighters-cart` giữ nguyên; baseline Cloudflare không dùng R2/KV/D1/Durable Objects/Queue  
**Testing**: `pnpm lint`, `pnpm build`, `pnpm build:vinext`, route/headers/curl checks, Node regression scripts, API fixtures/mocks, browser/device regression via `agent-browser`, SEO verifier hiện có  
**Target Platform**: Cloudflare Workers Paid, static assets, preview hostname trước, production custom domain sau release gate  
**Project Type**: Full-stack Next.js Pages Router web application, không phải static-only  
**Performance Goals**: 100% release-gate routes không timeout; 95% representative pages không chậm hơn baseline quá 10%; 100% API parity; rollback Cloudflare version trong 15 phút sau approval  
**Constraints**: Worker isolate 128 MB; bundle size 64 MiB; Paid CPU limit và spending controls; API/public contract parity; 0 production side effect trong test; exact-once analytics; preview non-indexable; immediate hard cutover, no traffic split  
**Scale/Scope**: 74 public page modules, 22 API routes, 11 ISR pages, 5 dynamic path sources, 1 SSR search route cần static hóa, 44 image usages trong 35 files, 99 legacy Link props trong 57 files, 5 `react-material-ui-carousel` call sites, 2 React Three/Fiber entry points, DNS/email/verification records và deferred registrar transfer

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Plan Enforcement |
|---|---|---|
| Evidence-bounded requirements and claims | PASS | Runtime, route counts, five compatibility gaps, package versions và pricing đều có evidence; unknown behavior-changing gap phải được logged, not silently accepted |
| Server-only secrets and validated references | PASS WITH REQUIRED REMEDIATION | Existing `NEXT_PUBLIC_TELEGRAM_*` và `NEXT_PUBLIC_X_API_KEY` are already exposed by design. The migration must remove client-visible credentials, rotate exposed values, replace browser-triggered “auth” with same-origin + validation/rate control, and keep trusted internal auth server-only. Bundle/source-map scan và `_ref`/`_type`/`_key` checks are release blockers. |
| Protected commerce/contact contracts | PASS | Existing cart key, pricing recalc, API/order/contact/confirmation behaviors are regression-gated; tests dùng fixture/mock và không tạo real order/notification |
| Privacy-safe GA4/GTM + Umami | PASS | Remove only `@vercel/analytics`; preserve wrappers, de-duplicate page/action events, prohibit sensitive payload additions |
| Independent executable increments | PASS | Phase gates tách build, Worker runtime, static search, upload, preview, DNS và deferred registrar |
| Existing stack/dependency constraints | PASS WITH APPROVED MIGRATION | Spec 004 explicitly requires Next 15.5 + React 19 + Vinext; Pages Router, `strict: false`, pnpm, MUI 5 and `@/` imports remain; no unrelated rewrite |
| Accessibility/SEO continuity | PASS | Keyboard/query/empty/error states, responsive rendering, canonical, robots, sitemap, redirects và headers are browser/HTTP gates |

**Pre-Phase-0 gate result**: PASS. No unresolved NEEDS CLARIFICATION remains in the approved spec.

## Migration Dependency Graph

The migration is not a single framework swap. Execution follows this acyclic dependency order:

```text
baseline manifests + test modes
        │
        ├── core framework peers
        │      (Next 15.5 + React 19 + types + lint/test tooling)
        │              │
        │              ├── UI compatibility
        │              │   (MUI/Emotion, carousel, React Three/Fiber/Drei)
        │              │
        │              ├── source compatibility
        │              │   (Image, Link, next/types, scripts, config)
        │              │
        │              └── secret/env boundary cleanup
        │                       │
        │                       └── valid Next 15 build
        │
        ├── Vinext/Vite config translation
        │      (alias, external, image, headers, redirects, types)
        │              │
        │              └── local built-Worker runtime
        │
        ├── build-time content model
        │      (all slugs, Sanity failure policy, search index, sitemap)
        │              │
        │              └── 100% static public surface
        │
        └── Worker-safe API model
               (raw body, Buffer, crypto, uploads, CORS, limits)
                       │
                       └── preview candidate
                                  │
                                  ├── release gate
                                  │
                                  └── production deploy → DNS cutover → Cloudflare rollback point
```

### Critical Path

The production cutover critical path is:

1. pin compatible React/Next/tooling peers;
2. pass standard Next 15 build without regressions;
3. translate `next.config.js` behavior into Vinext/Vite and pass a built Worker;
4. remove Node-native `sharp` from the upload Worker and prove image parity;
5. convert all public dynamic paths to build-time static outputs and generate the public search index;
6. remediate env/secret exposure and prove origin/auth behavior;
7. pass preview route/API/browser/runtime/cost gates;
8. approve DNS inventory, cut over, stabilize, and record a verified Cloudflare rollback version.

### Parallelizable Work

After baseline capture, the following can proceed in parallel if each lands through an isolated verification gate:

- Next/React image and Link codemods.
- Dependency-only React 19 peer audit and focused MUI/carousel/Three browser evidence.
- Static path discovery for blog/service/product/Creativa pages and search-index design.
- API contract fixtures/mocks and Worker compatibility harnesses.
- DNS inventory, email-record classification and registrar safety checklist.
- Secret inventory, rotation plan and server-only env naming.

They converge at the Vinext local Worker gate; none bypass it.

## Dependency & Integration Impact Matrix

| Dependency / Integration | Current evidence | Migration impact | Required resolution | Stop condition |
|---|---|---|---|---|
| Next/React/Node core | Next 12.3.1, React 18.2, Node engine `>=20 <26` | Vinext supported path requires a coordinated major upgrade | Pin Next 15.5.x, React 19.3.1, matching types and ESLint tooling; Node `>=22 <26` | Standard Next 15 lint/build or a protected browser flow fails |
| pnpm / lockfile | `packageManager` currently pins `pnpm@10.32.1`; lockfile is v9 | Toolchain upgrade must be reproducible across local, GitHub Actions and Cloudflare deploy commands | Update `package.json#packageManager` to `pnpm@11.5.3`, install with that exact version, regenerate and commit `pnpm-lock.yaml`, then require every install to use `--frozen-lockfile` | `pnpm --version` differs, lockfile is dirty/unreadable, peer resolution changes unexpectedly, or CI/local installs diverge |
| MUI 5 + Emotion SSR | MUI 5.18 resolved, custom `_document` extracts Emotion styles | React 19 SSR/hydration and custom App/Document contracts can regress | Keep MUI 5 major, update to the latest React-19-capable patch already supported by MUI 5, test SSR styles and hydration on representative pages | Peer conflict, hydration diff, or Emotion style loss |
| `react-material-ui-carousel` | 3.4.2; peer only React 17/18; used by 5 carousel surfaces | A package-only override would hide a real unsupported peer | Prefer a React-19-supported release; otherwise replace the 5 call sites with a controlled local/shared MUI wrapper while preserving controls, focus and dimensions | No supported version and no parity wrapper accepted before upgrade |
| React Three Fiber/Drei/Three | Fiber 8.15 + Drei 9.92 + Three 0.160; 2 canvases plus builder/gallery consumers | Fiber 8 is the React 18 line; Drei follows Fiber major | Upgrade Fiber 9 + Drei 10 as one unit, retain/upgrade Three within the supported range, test lighter and keychain 3D, fallback and context-loss paths | Peer graph conflict or WebGL/SSR/fallback behavior changes |
| `next/image` | 44 usages/35 files; legacy props in 28 files; `unoptimized: true` | Next 15 removes legacy layout behavior even when image optimization remains off | Codemod by wrapper/prop shape, preserve aspect ratio/object-fit/loading priority and browser viewport output | Layout shift, broken remote URL, missing intrinsic dimensions or asset 404 |
| `next/link` | 99 `passHref`/`legacyBehavior` occurrences across 57 files | Next 15 anchor behavior can be changed by legacy wrappers and MUI `component="a"` composition | Inventory actual nested-anchor contracts; migrate only affected wrappers, preserve keyboard semantics and click tracking | Nested/duplicate anchors, broken prefetch, lost href, or analytics double emission |
| Webpack/Vite | Config aliases disabled IMG.LY module; externalizes `sharp`; adds `fs: false` browser fallback; custom headers/redirects | Vinext does not automatically make arbitrary webpack hooks equivalent | Move alias/fallback/external behavior only where build evidence says it is needed; verify output module graph and HTTP rules | IMG.LY unexpectedly enters bundle, Node builtin reaches browser, or redirect/header differs |
| Static rendering / Sanity | 11 ISR pages, 5 dynamic path sources, 1 SSR search, build-time Sanity reads | `fallback: blocking` and ISR require a response store that baseline intentionally excludes | Enumerate every published slug, set `fallback: false`, remove `revalidate`, fail build on malformed required content, trigger owner-approved rebuild after publication | Any published slug is omitted, draft enters output, or a Sanity outage silently produces stale/success output |
| Search | Server corpus mixes routes, local product data, Markdown and Sanity reads; browser currently paginates through `/api/search` | `/search` cannot remain SSR/static if the current page/API calls remain coupled to server-only corpus construction | Split index generation from browser search, version/schema-validate JSON, retain domain ranking logic in browser-safe modules, keep API independently for parity | Draft/private fields appear, index bundle is unreasonable, result ranking/order changes, or `/search` requests `/api/search` |
| `sharp` and uploads | Worker route imports `normalizeKeychainImage`, which imports native `sharp`; client `prepareSanityImageUpload` already resizes raster images to 2048/WebP | Native addon and normalization memory are not safe in Worker baseline | Keep browser normalization, add Worker dimension/format verification with browser/Worker-safe implementation, remove `sharp` from Worker graph; retain it only as dev/test tooling if needed and explicitly non-runtime | `sharp` appears in Worker manifest/bundle, max dimensions/pixels are unverified, or output/persistence differs |
| Raw-body / Buffer / crypto | 4 Creativa POST routes disable body parser; upload routes decode Base64; SPX uses `crypto.timingSafeEqual` and `Buffer` | Pages Router Node stream semantics may differ under Workers | Cover content-length, chunked/raw body, malformed JSON, UTF-8, max 64 KiB and 14 MB limits; replace only incompatible APIs with Web Crypto/Uint8Array equivalents after evidence | Truncated/overlong body accepted, authorization compares incorrectly, or body parser behavior changes |
| Rate limiting | Every limiter is in-memory `LRUCache` per process/isolate | Cloudflare isolates and cold starts mean it is not a global security control | Preserve as parity-only defense, document reset/cross-isolate behavior, combine with origin/content-type validation; adopt Cloudflare rate limiting only if abuse evidence requires it | Plan claims distributed protection without a platform service |
| Sanity v2 | Shared client/server wrappers serve SSG and 22 APIs; server token supports writes/uploads | Build and Worker need different env lifetimes; a Worker bundle must not contain write token | Separate public build reads from privileged server writes, validate `_ref`/`_type`/`_key`, provide read-only test datasets/mocks, keep write token Worker-secret only | Token in browser/source map, build uses draft data, or production write occurs in validation |
| Analytics and bfcache/prefetch | Custom `_app` initial + route-change tracking; Strict Mode, bfcache, speculation and Vercel Analytics coexist | React 19 Strict Mode can expose double lifecycle work; Vercel dependency is unnecessary | Remove Vercel Analytics, retain GA4/GTM + Umami, gate initial/route/bfcache events in one matrix, audit prohibited properties | Any page/action emits more than once or includes customer/image/query secrets |
| Secrets and browser auth | `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN`, `NEXT_PUBLIC_TELEGRAM_CHAT_ID`, and `NEXT_PUBLIC_X_API_KEY` are read by browser-shipped `utils/env-const.ts`; client Axios adds the exposed key | Copying Vercel env names to Cloudflare would perpetuate credential exposure and invalid “auth” | Rename bot/chat/key server-side, stop importing them into browser wrappers, use strict same-origin/content-type/rate checks for browser POSTs, keep only scheduler/internal API secrets on server; rotate exposed credentials | Any secret appears in browser/source map or a route becomes unauthenticated relative to its caller class |
| SEO/build post-processing | `postbuild` runs `next-sitemap` + `verify-seo`; production canonical is hard-coded/fallback-based | Vinext may not run the Next postbuild hook or output the same manifest path | Make sitemap/search-index/static verification explicit in release script for both builds, prove preview never leaks host and production output is `inutdesign.com` | Sitemap/robots missing, preview host appears, or deploy proceeds without SEO evidence |
| SPX scheduler | External scheduler targets one authenticated route; SPX uses Telegram and Sanity | Cloudflare URL/cold starts/timeouts must not change scheduler semantics | Keep canonical endpoint or configure an explicit scheduler cutover, preserve secret/timeout/idempotency/concurrency contract, test no duplicate order update/notification | Scheduler target, auth, timeout, or idempotency is ambiguous at cutover |
| Optional heavy client modules | IMG.LY/ONNX is disabled by webpack alias; 3D/libraries remain substantial client chunks | Vite could include disabled code or larger chunks, and React 19 build may change dynamic import behavior | Keep feature flag false, verify no IMG.LY/ONNX bytes in production manifest; preserve dynamic/no-SSR boundaries for 3D builders and dialogs | Disabled dependency or WASM model appears in public assets |

## Phase Plan

### Phase 0 — Baseline & Compatibility Research

1. Capture a production baseline before migration:
   - Public route inventory, statuses, canonical/robots/sitemap, redirects and cache/security headers.
   - 22 API route method/schema/status/error/body-limit/auth/idempotency matrix.
   - Representative page timings, analytics events, browser screenshots and critical journey behavior.
   - Sanity content snapshot/approved public fields for static search generation.
   - Current environment variable inventory with classification `public`, `server`, `scheduler`, `build-only`.
   - One manifest entry per direct dependency: resolved version, peer range, package license, used call sites, browser/Worker/build scope, migration action and owner.
   - Baseline Worker-risk fixtures: raw-body bytes, 64 KiB Creativa requests, 14 MB upload envelope, malformed/duplicate requests, timeouts and external-call mocks.
   - Exact public path and static artifact manifests so omitted routes, slugs, sitemap entries and redirects become diff failures rather than manual observations.
2. Re-run and retain `pnpm dlx vinext check`; fix the two hard issues:
   - `pages/blog/index.tsx`: import type from `next`, not `next/types`.
   - `sanity/scripts/report.mjs`: replace CommonJS global assumption with ESM-safe path resolution.
3. Convert the three partial areas into explicit verification contracts:
   - `next/image`: use `image-optimization=none` baseline, preserve rendered output and no 404/visual regression.
   - custom webpack: move only required alias/external behavior to Vinext/Vite equivalents.
   - React Strict Mode: verify Pages Router root behavior and duplicate side-effect absence.
4. Classify the 22 APIs by transport and side effect before changing runtime code:
   - `body-parser JSON`: orders, quote, upload, phone, notifications and financial/keychain snapshot routes.
   - `bodyParser: false`: 4 Creativa POST routes with raw stream behavior.
   - `read-only GET`: search, Creativa catalog/options/product/lookup, keychain snapshot lookup.
   - `external scheduler`: SPX sync.
   - This classification determines fixtures and safe mocks; no route is tested with an assumed generic JSON path.
5. Freeze an explicit compatibility decision log:
   - source file/call site;
   - current and target package/runtime;
   - required behavior;
   - implementation choice;
   - verification command/evidence;
   - owner waiver only where a deliberate non-security behavior gap remains.

**Evidence produced**: `research.md`, baseline command outputs/manifest retained outside secrets, compatibility gap records.

### Phase 1 — Runtime Upgrade & Vinext Parallel Path

1. Upgrade the core framework as one dependency transaction:
   - Next `15.5.29` is the current 15.5 registry candidate; pin after local compatibility evidence.
   - React, ReactDOM and types to compatible 19.3.1 versions; do not mix React 18/19 artifacts.
   - align `@next/third-parties`, `@next/bundle-analyzer`, `eslint-config-next` and `@types/node` with the selected Next/Node line.
   - keep MUI 5 and Emotion, but resolve the complete peer graph rather than disabling pnpm peer checks.
   - treat `react-material-ui-carousel`, React Three Fiber, Drei and old carousel/SSR consumers as explicit migration units.
   - Node engine becomes `>=22 <26`; update `package.json#packageManager` and the deployment toolchain to exact `pnpm@11.5.3`.
   - Regenerate `pnpm-lock.yaml` once with pnpm 11.5.3, inspect peer/patch resolution and content drift, then freeze it for every subsequent local/CI install.
2. Upgrade dependent UI units in order:
   - first MUI/Emotion and `_app`/`_document` SSR smoke;
   - then replace/upgrade the 5 carousel call sites;
   - then upgrade Fiber 9 + Drei 10 + compatible Three/types together and test both lighter and keychain 3D plus forced WebGL fallback;
   - audit `yet-another-react-lightbox`, `react-date-range`, React Hook Form, SWR, Zustand and `@sanity/block-content-to-react` through their actual call sites and peer ranges.
3. Complete Next 15 codemod-style fixes:
   - migrate 44 image usages/35 files, prioritizing the 28 files with legacy prop occurrences;
   - inspect all 57 files with Link legacy props; convert the actual nested-anchor/`passHref` cases rather than blindly removing props from MUI links;
   - preserve responsive/aspect-ratio/focus/click behavior with screenshot and DOM evidence;
   - keep Pages Router APIs and `Component.Layout`;
   - replace/retire `next export` and `next lint` assumptions if tooling behavior changes;
   - keep TypeScript `strict: false`.
4. Preserve normal Next path as a parallel path until Cloudflare release:
   - `dev`, `build`, `start` continue.
   - `vinext init --platform=cloudflare --name inutdesign-web --cdn-cache=none --data-cache=none --image-optimization=none` adds `dev:vinext`, `build:vinext`, `start:vinext`, `cloudflare.config.ts`, `vite.config.ts` and Vinext dependencies.
   - Add generated Cloudflare types and build-output ignores; no duplicate `wrangler.jsonc`.
   - Replace required `next.config.js` effects explicitly: IMG.LY alias, `fs` fallback, `sharp` externalization until removed, analyzer, security headers, cache headers and redirects.
5. Remove Vercel-only runtime:
   - remove `<Analytics />` and `@vercel/analytics`;
   - replace `VERCEL_ENV` with neutral environment label;
   - retain GA4/GTM and Umami wrappers.

**Gate**: no peer override, React 18/19 mix or hidden Node builtin; standard Next dev/build and local Vinext dev/built-Worker render all protected UI groups before static conversion continues.

### Phase 2 — Full-Static Public Rendering

1. Convert the 11 ISR routes to deploy-driven static generation:
   - remove `revalidate` from `/`, `/blog` and product/Creativa paths;
   - enumerate every published slug at build time: local Markdown blog slugs, service route tree, lighters, laptop products, macnut products and Creativa products;
   - reject duplicates, blank/invalid slugs, missing related configuration and draft/version-prefixed documents during the build;
   - compare the generated path manifest against independent approved source queries;
   - use `fallback: false` for blog, services, product and Creativa detail pages;
   - approved Sanity publication triggers an explicit rebuild/deploy; no freshness SLA.
2. Replace `/search` SSR:
   - split `server/search/domain.ts` so pure parse/search/ranking code is browser-safe and corpus generation remains build-only;
   - build one versioned public search index from approved searchable fields at build time (routes, typed product-page data, Markdown and Sanity dynamic products);
   - prohibit raw Sanity objects, draft/private fields, contact/order/upload/asset internals and credentials;
   - add an index schema version, document count, source hash, duplicate URL check and build manifest;
   - preserve query parsing, filters, pagination, result shape, keyboard interaction and loading/error/empty states;
   - browser filtering becomes the `/search` critical path; no runtime `/api/search` call;
   - keep `/api/search` contract for compatibility and independent parity tests.
3. Use static asset configuration:
   - `--cdn-cache=none --data-cache=none`;
   - no Response Store, R2, DO, KV, D1, Queue or Cloudflare Images;
   - optimize/generate only evidence-backed static image variants if Vinext rendering requires it.
4. Create a deterministic publication path:
   - use a manual `workflow_dispatch` deployment workflow as the minimum owner-triggered automation;
   - use concurrency cancellation per environment, a locked dependency install, explicit build/release commands and immutable artifact/version output;
   - require read-only Sanity build credentials and fail closed on missing data;
   - keep automatic production deploy on every Sanity event out of scope until a separately reviewed webhook/idempotency design exists.

**Gate**: generated manifests reconcile to 74 public modules and every approved slug; zero ISR/SSR public page; search index contains no prohibited/private field; standard and Vinext builds fail loudly on missing/invalid source rather than publishing partial content.

### Phase 3 — Worker API & Upload Hardening

1. Preserve all 22 API method/body/auth/validation/error/status contracts.
2. Group changes by risk:
   - write paths: orders, quote, cost, income, uploads, keychain designs, notifications, Creativa submit/resolve, SPX cron;
   - read paths: catalog/options/product/search/phone/order tracking/claim;
   - enforce `Buffer`/stream body behavior with Worker fixture tests.
3. Replace keychain upload normalization:
   - browser canvas/codec path resizes to bounded dimensions and emits PNG/JPEG/WebP;
   - remove native `sharp` from `utils/keychain/imageValidation.ts` and its Worker import chain;
   - Worker validates strict Base64 shape, declared MIME, byte signature, decoded size, format dimensions/pixel count and persistence outcome with a Web/Worker-safe parser;
   - use a shared browser/Worker contract so the browser always emits the same approved format and bounds;
   - Worker uploads the accepted browser output to Sanity without native `sharp`;
   - do not weaken filename, 10 MB, format, rate-limit or 4xx/5xx contract.
4. Scheduler and abuse controls:
   - keep external SPX scheduler and canonical authenticated endpoint;
   - retain in-memory LRU only as parity/per-isolate control, not distributed security;
   - log timing, memory/CPU evidence and safe error details without payload secrets.
5. Define a public-origin allow-list for preview and production, never wildcard.
6. Remediate the secret boundary before preview:
   - replace browser-injected `NEXT_PUBLIC_X_API_KEY` with route-appropriate controls: strict same-origin `Origin`, JSON content type, size/method validation and per-isolate limiter for browser flows;
   - keep `SPX_SYNC_SECRET` and any future internal token exclusively server-side;
   - rename bot credentials to server-only names and rotate the currently exposed Telegram token; a mere rename is insufficient;
   - remove all server-only values from `utils/env-const.ts`, `.env.example` public names and source maps;
   - retain public config only for site URL, Sanity project/dataset, analytics and feature flags.
7. Prove runtime-safe primitives:
   - classify every Worker-reachable `Buffer`, Node `crypto`, async stream, file-system and path import;
   - keep Node-only filesystem code in build/test modules only;
   - test Creativa raw-body 64 KiB boundaries, malformed UTF-8/JSON, transfer/content-length mismatches, and connection abort behavior;
   - compare response status/body/header and side-effect attempt count under local Next and Worker.

**Gate**: 100% contract matrix passes under the built Worker; native `sharp` and Node filesystem/path modules are absent from Worker entry graphs; zero real order/write/notification/upload side effect; no server secret or old public credential in client output/source maps.

### Phase 4 — Cloudflare Package, Preview & Release Gate

1. Add one-command local and owner-triggered release flows around:
   - dependency/install check;
   - lint and type/build;
   - normal Next build;
   - Vinext build;
   - safe regression/API matrix;
   - `pnpm dlx @vinext/cloudflare deploy --dry-run`;
   - route/API manifest diff, secret scan, Worker bundle/module graph and generated-artifact validation;
   - owner-triggered preview deploy and verification;
   - owner-triggered production deploy.
2. Inventory secrets and variables; inject `NEXT_PUBLIC_*` at build time and server secrets as Worker secrets. Build must fail visibly on required values, but never print secret values.
3. Preview:
   - use an explicit `DEPLOYMENT_CHANNEL=preview` build/config channel or proven host-aware Worker rule to add `X-Robots-Tag: noindex, nofollow` on all preview pages;
   - production canonical and sitemap host remain `https://inutdesign.com`;
   - no preview hostname in built sitemap/robots/canonical.
4. Establish Workers Paid, preview subdomain, zone and spend policy only before a separately approved production cutover. Baseline warning at $2 usage-over-base and hard usage block at $10 usage excluding the $5 subscription. Record that these are proposal thresholds and confirm actual account plan controls support the chosen enforcement model before relying on them.
5. Release evidence must include route/API, analytics, browser, upload, scheduler, SEO, CPU/memory/logs, asset/image parity and cost checks.
6. Treat deployment artifacts as evidence:
   - immutable commit SHA and lockfile hash;
   - route, slug, sitemap, redirect, API and env-name manifests;
   - Worker module graph and asset total;
   - preview and production deployment IDs;
   - pass/fail report linking every result to a gate.

**Gate**: every FR/SC release gate passes, unsupported Vinext behavior is resolved or owner-accepted with retained evidence. A preview artifact/config difference must be enumerated, and the production artifact reruns the relevant post-build/smoke gates before DNS approval.

### Phase 5 — DNS Cutover & Operations

1. Export and classify every Squarespace/Vercel DNS record with owner, target, TTL, priority, proxy mode and disposition.
2. Create Cloudflare zone and validate apex, `www`, email, SPF, DKIM, DMARC, TXT, verification and subdomain records.
3. After owner approval:
   - lower TTL when appropriate;
   - handle DNSSEC disable/wait if active at Squarespace;
   - activate Cloudflare authoritative DNS;
   - attach custom domain only after zone and Worker health;
   - verify HTTPS, redirects, robots, sitemap, canonical and indexed paths.
4. Immediate hard cutover; monitor critical journeys and indexed URLs. Do not split traffic.
5. Roll back to a verified Cloudflare version through version/traffic routing and DNS recovery runbook; Vercel is not a rollback target.
6. Separate failure boundaries in the runbook:
   - application/Worker regression → Cloudflare version rollback;
   - DNS record/nameserver failure → restore approved DNS state;
   - certificate failure → preserve DNS and repair custom domain/certificate state;
   - preview indexing → remove preview from indexing surfaces, keep production untouched;
   - email failure → restore MX/SPF/DKIM/DMARC records independent of web routing.
   Never combine DNS rollback and Worker rollback unless evidence identifies both layers as faulty.

### Phase 6 — Deferred Registrar Transfer

Registrar remains at Squarespace through preview, DNS cutover and stabilization. No auth-code request, unlock, submission or charge is part of this feature. If owner issues a separate explicit trigger later, a new runbook/approval gate checks the 60-day rule, lock status, DNSSEC, registrant email, eligibility, renewal/payment, stable Cloudflare DNS and Worker health.

## Project Structure

### Documentation (this feature)

```text
specs/004-migrate-vinext-cloudflare/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── deployment-release.md
│   ├── dns-registrar.md
│   └── runtime-api.md
└── tasks.md                 # future /speckit-tasks output
```

### Source Code (implementation phase)

```text
package.json
pnpm-lock.yaml
tsconfig.json
next.config.js
vite.config.ts               # added by Vinext init
cloudflare.config.ts         # added by Vinext init

pages/
├── _app.tsx                 # remove Vercel Analytics, retain GA4/GTM + Umami
├── index.tsx                # ISR removed
├── search/index.tsx         # static shell + build-time index
├── blog/                    # SSG fallback false, no ISR
├── creativa/                # prebuilt slugs, no ISR
├── san-pham/                # prebuilt slugs, no ISR
└── api/                     # 22 Worker-parity routes

api-client/
server/search/               # shared build/search and retained API model
utils/keychain/              # browser/Worker-safe image validation split
components/keychain-builder/  # browser resize/encode path
scripts/
└── migration/               # manifests, static index, safe regression, secret/graph and release checks

public/                      # static assets and optional public search artifact

.github/workflows/
└── deploy-web.yml           # owner-triggered preview/production build+deploy after implementation
```

**Structure Decision**: keep the existing single Next.js repository. Cloudflare is a parallel build/deploy adapter, not a second app. Add generated root config and focused migration scripts only; do not create a `wrangler.jsonc` or separate OpenNext project.

## Implementation Surface by Dependency

| Work package | Primary files/surfaces | Required output |
|---|---|---|
| Framework/package peer lock | `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.js`, `pages/_app.tsx`, `pages/_document.tsx`, GitHub Actions setup | pnpm 11.5.3 plus one coherent Next 15.5/React 19 peer graph and preserved Pages Router SSR shell |
| Image compatibility | all 44 `next/image` consumers, especially 28 files with legacy props | Shared migration pattern with explicit `fill`/`sizes`/style dimensions and visual parity |
| Link compatibility | 57 files with legacy Link props, `components/common/header/*`, MUI link/breadcrumb/card compositions | No nested/duplicate anchors; href, focus, prefetch and click tracking preserved |
| Carousel replacement | 5 `react-material-ui-carousel` consumers | A supported package or shared controlled replacement with equivalent navigation/a11y |
| React Three | `components/lighters/LighterCanvas.tsx`, `components/keychain-builder/preview/*`, related render hooks | Fiber 9/Drei 10 atomic upgrade, SSR-disabled boundaries, context-loss/2D fallback evidence |
| Config translation | `next.config.js`, generated `vite.config.ts`, generated `cloudflare.config.ts` | Headers, redirects, alias and browser fallback parity without a duplicate Wrangler config |
| Static public paths | `pages/index.tsx`, `pages/blog/*`, `pages/creativa/**/*`, `pages/san-pham/**/*`, `pages/services/[...slug].tsx` | All published paths materialized, `fallback: false`, no `revalidate` |
| Static search | `pages/search/index.tsx`, `server/search/*`, `api-client/*` used by `dynamic-sources.ts` | Build-time allow-listed index; pure browser ranking; API parity retained |
| Upload | `api-client/sanity-upload.ts`, `api-client/keychain.ts`, `pages/api/keychain/uploads.ts`, `utils/keychain/imageValidation.ts`, keychain browser builder | Browser transform + Worker-safe validation; no Worker `sharp` graph |
| Server secrets/auth class | `utils/env-const.ts`, `api-client/axios-client.ts`, Telegram hooks/routes, `pages/api/validate-phone.ts`, `.env.example` | Client-visible credentials removed/rotated; same-origin browser controls and server-only internal/scheduler secrets |
| Raw/body/Node APIs | `utils/creativa/api.server.ts`, 4 raw-body Creativa APIs, SPX route, upload APIs, rate limiter | Worker fixture parity and explicit replacement of incompatible Node-only primitives |
| Analytics/SEO build | `_app.tsx`, `_document.tsx`, analytics wrappers, `next-sitemap.config.js`, `scripts/verify-seo.mjs` | No Vercel Analytics, exact-once dual tracking, deterministic sitemap/robots/search artifacts |
| Release/operations | `scripts/migration/*`, `.github/workflows/deploy-web.yml`, contracts + quickstart | Repeatable manifests, safe deploy/verify, preview noindex, version rollback and DNS runbook |

## Validation Strategy

1. **Static analysis**: `pnpm lint`, type diagnostics, dependency audit and secret scan.
2. **Build parity**: standard Next build and `build:vinext`; compare route manifest, page count, slugs, headers, redirects and output classes.
3. **Runtime parity**: `start:vinext` local Worker plus curl/fixture/browser tests for all 22 APIs and representative public paths.
4. **Safe business-flow regression**: cart persistence, pricing, design, quote/contact and checkout confirmation use test fixtures/mocks with no production write.
5. **Cloudflare preview**: exact same matrix on preview hostname, with `noindex` and production canonical.
6. **Cutover checks**: DNS, TLS, route/API, canonical/sitemap, email records, logs, CPU/memory, analytics and spend.
7. **Operational drill**: deploy → identify verified rollback point → restore in ≤15 minutes from runbook.
8. **Manifest integrity**: fail if route/slug/sitemap/API/env/Worker-module manifests differ from the reviewed baseline unless an approved change record explains the delta.

## Key Risks & Controls

| Risk | Control / Gate |
|---|---|
| Next 12 → 15.5 / React 19 breaks MUI or Three.js | Incremental compatibility phase, peer-dependency audit, focused component/browser tests |
| 85% Vinext scan leaves runtime differences | Treat scan as filter, not proof; built-Worker local and preview regression are mandatory |
| Worker 128 MB isolate limit | Browser-offload image transform, no `sharp` runtime, measure upload/write and heavy API routes |
| Vite misses custom webpack behavior | Port only current alias/external behavior and prove affected feature toggles |
| Static pages become stale | Owner-triggered rebuild/deploy is explicit publication model and operational runbook |
| Search index leaks draft/private data | Build allow-list, draft exclusion, index audit and no raw Sanity objects |
| Upload body/Buffer semantics differ | Fixture matrix for type/signature/size/dimension/error and persistence mocks |
| In-memory rate limit is not distributed | Preserve for parity only; document limitation and adopt native rate limiting only with abuse evidence |
| Preview index pollution | Force noindex and compare canonical/sitemap host to production |
| DNS/email record omission | Owner-approved typed inventory, record-by-record verification and propagation checks |
| Accidental registrar transfer or cost | No transfer/account upgrade/cutover tooling executes without explicit owner step |
| Analytics duplicate/sensitive events | Existing wrappers, exact-once browser evidence, prohibited-field payload audit |
| Legacy public credentials already shipped to clients | Server-only rename + credential rotation + same-origin browser POST policy + source-map/client bundle scan |
| Carousel peer excludes React 19 | Upgrade to supported release or replace 5 usages with a shared controlled component before peer lock |
| Fiber/Drei major mismatch | Atomic Fiber 9 + Drei 10 + Three/types upgrade, then 2 canvas/fallback browser matrix |
| Full-static slug discovery is incomplete | Independent source reconciliation, duplicate/draft/invalid slug rejection and `fallback: false` |
| Search index leaks too much or changes ranking | Versioned allow-list/schema, privacy audit, reuse pure ranking logic and golden-result corpus |
| Build-time Sanity outage silently publishes partial site | Fail closed on required source/config; no empty/success fallback |
| Preview and production use different builds | Enumerate channel-only delta and rerun production artifact smoke/SEO/security gates |
| In-place API security “fix” changes browser behavior | Preserve UI outcomes and effective security while documenting route caller-class changes; no public secret replacement |

## Post-Design Constitution Check

| Gate | Result | Design Evidence |
|---|---|---|
| Evidence-bounded scope | PASS | `research.md` records decisions and rejected alternatives; spec-derived route/API counts and package evidence are explicit |
| Server/data integrity | PASS WITH REQUIRED REMEDIATION | `data-model.md` and `runtime-api.md` turn existing public credential exposure into a release-blocking rotation/removal plan while preserving server-only references, upload and idempotency boundaries |
| Commerce stability | PASS | `deployment-release.md` requires cart/order/pricing/contact/upload/confirmation parity with safe mocks |
| Privacy-safe observability | PASS | Analytics parity, de-duplication and sensitive-field prohibition are release-gate evidence |
| Verifiable delivery | PASS | `quickstart.md` gives runnable phase gates and expected outcomes; no success-shaped fallback |
| Stack and dependency migration | PASS | Spec-approved upgrade is isolated, Vercel rollback is excluded, and no secondary framework is introduced |
| Accessibility + SEO | PASS | Browser/keyboard/responsive and canonical/robots/sitemap/preview indexing are explicit acceptance checks |

## Complexity Tracking

No constitution violation. The framework/runtime migration and domain runbook complexity are directly required by feature 004, not speculative expansion.
