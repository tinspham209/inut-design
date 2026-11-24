# Quickstart: Validate Feature 004

Runbook này dùng để prove migration end-to-end. Nó không authorize Cloudflare subscription, deploy, DNS, registrar transfer hoặc production writes.

## Final Command Map

```bash
pnpm migration:inventory
pnpm migration:verify-routes
pnpm migration:verify-apis
pnpm regression:safe
node scripts/migration/run-raw-body-regression.mjs
node scripts/migration/run-upload-regression.mjs
node scripts/migration/run-spx-operations.mjs
pnpm migration:check-manifests
pnpm migration:check-secrets --require-build
pnpm migration:check-worker-graph --require-build
node scripts/migration/check-analytics.mjs
node scripts/migration/check-performance.mjs
node scripts/migration/check-ui-evidence.mjs
node scripts/migration/check-release-redaction.mjs
pnpm migration:release-manifest
node scripts/migration/release-gate.mjs
pnpm release:local
```

Reviewed contracts live in `artifacts/migration/baseline/` and
`artifacts/migration/templates/`. Generated runtime, preview, DNS, operations
and release evidence is ignored until explicitly reviewed and redacted.

## 1. Prerequisites

- Node 22, exact pnpm `11.5.3` (verify with `pnpm --version`).
- A clean locked install: `pnpm install --frozen-lockfile`.
- Existing `.env` values available locally; never print them.
- Approved Sanity public fixture/read-only access for baseline and build.
- A local mock/test mode for order, notification, upload and Sanity write paths.
- `agent-browser` available for browser/device proof.
- For preview only: owner-approved Cloudflare account access and a configured preview hostname.

## 2. Capture Baseline

From repository root:

```bash
pnpm --version # must be 11.5.3
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm dlx vinext check
```

Expected:
- baseline Next build succeeds;
- compatibility report is retained;
- current report has 2 hard issues + 3 partial areas until Phase 1 fixes;
- route manifest and SEO verifier output are stored as comparison evidence.

Generate/retain:
- public route list;
- 22 API route matrix;
- dependency/peer manifest and call-site inventory;
- public slug/redirect/sitemap manifest;
- env-name/scope manifest without values;
- representative desktop/mobile screenshots;
- redirect/status/header output;
- sanitized analytics event sequence;
- performance timings and current `next.config.js` behavior.

Do not run production write APIs.

## 3. Validate Runtime Upgrade & Vinext

After Phase 1 implementation:

```bash
pnpm --version # must be 11.5.3
pnpm install --frozen-lockfile
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm dev:vinext -- --port 3001
```

Check main pages at port 3001, then stop dev server and test built Worker:

```bash
pnpm build:vinext
pnpm start:vinext -- --port 3001
```

Expected:
- pnpm reports no unexplained peer override or React 18/19 package mix;
- no hard Vinext issue;
- normal Next path and built Vinext path both render;
- Pages Router custom `_app`/`_document` behavior is preserved;
- all 44 image usages/35 files retain layout and responsive behavior;
- affected MUI/Link wrappers contain valid anchor/focus semantics;
- 5 carousel surfaces and 2 React Three canvases retain interaction and fallback behavior;
- images, redirects, headers, React Strict Mode and webpack-derived alias behavior have direct evidence;
- the production output manifest does not contain IMG.LY/ONNX assets while the feature flag is false.

Dependency gates should run in sequence:

1. pnpm 11.5.3 + regenerated reviewed lockfile;
2. core Next/React/types/tooling;
3. MUI/Emotion SSR;
4. carousel replacement;
5. Fiber/Drei/Three;
6. Vinext/Vite translation.

Do not continue by disabling peer checks. If a unit has no supported combination, replace its controlled call sites or stop for an owner decision.

## 4. Validate Static Rendering & Search

Run build and inspect its output:

```bash
pnpm build:vinext
node scripts/verify-seo.mjs
```

Expected:
- all public modules resolve without ISR/SSR;
- blog/service/product/Creativa published slugs build with `fallback: false`;
- generated slug/path manifest equals the approved local/Sanity source inventory;
- duplicate, invalid, draft or omitted slugs fail the build;
- removed/unpublished slugs return 404;
- public search index schema and privacy allow-list pass;
- deterministic search golden fixtures retain counts/order/excerpts;
- `/search` does not call `/api/search` in the network trace;
- result/filter/pagination, empty/error and keyboard interactions match baseline.

## 5. Validate API & Upload Contracts

Use the migration fixture runner introduced by implementation tasks, with mock endpoints for any write/notification. Check:

```bash
pnpm regression
pnpm regression:lighter
pnpm regression:spx
pnpm regression:creativa-notification
pnpm regression:quote-form
```

Run the route-by-route contract matrix against both `pnpm start` and `pnpm start:vinext`; compare:
- method;
- request validation/body limits;
- status/header/body semantics;
- auth;
- idempotency/rate-limit behavior;
- timeout/error response;
- no real external side effect.

Raw-body fixtures must include:
- 0, 1, 64 KiB−1, 64 KiB and 64 KiB+1 byte Creativa requests;
- valid, malformed and chunked UTF-8 JSON;
- missing/wrong `Content-Type`;
- absent/mismatched `Content-Length` where the test transport permits;
- duplicate/absent idempotency key;
- aborted downstream request/timeout.

Keychain upload scenarios:
- valid PNG/JPEG/WebP browser output;
- wrong declared MIME;
- bad signature/polyglot bytes;
- >10 MB decoded image;
- excessive width/height/pixel count;
- malformed Base64;
- persistence failure;
- success reference shape and visual output.

Expected: no Worker import/bundle of native `sharp`; invalid requests fail before persistence; success works against a safe mocked Sanity boundary.

Secret boundary check:

```bash
pnpm migration:check-secrets
pnpm migration:check-worker-graph
```

Expected:
- no Telegram token/chat credential or internal key in client chunks/source maps;
- old public credential names do not appear in active env/config/client imports;
- browser phone/notification routes reject cross-origin or non-JSON abuse at least as strictly as baseline;
- SPX/internal credentials remain server-only;
- credential rotation is recorded without recording the value.

## 6. Browser Regression

Run the repository regression flow against the local built Worker:

```bash
./scripts/regression-test.sh http://localhost:3001 full
```

Also inspect manually/automatically:
- responsive home/product/blog/search/cart/checkout;
- keychain builder + upload flow;
- Creativa catalog/checkout/order tracking;
- quote/contact/phone flow;
- keyboard focus and semantic controls;
- GA4/GTM + Umami exact-once sequence;
- no sensitive analytics property or request value.

Capture these React/3D-specific cases:
- React Strict Mode causes no duplicate initial page/action tracking;
- MUI/Emotion initial SSR and client hydration produce no style shift;
- each 5-carousel surface supports keyboard/pointer navigation;
- lighter and keychain 3D canvas both support normal and forced-context-loss/fallback behavior;
- IMG.LY remains disabled and its ONNX/model assets do not load.

Evidence: screenshots, browser console/network result and a concise pass/fail manifest.

## 7. Preview Deploy Gate

Only when explicitly approved to deploy:

```bash
pnpm dlx @vinext/cloudflare deploy --dry-run
pnpm dlx @vinext/cloudflare deploy
```

Before running the real deploy:
- confirm preview hostname and spend policy, plus either Workers Paid or the
  owner-approved Free-plan exception and its Cloudflare warning trigger;
- confirm server secrets are configured without values appearing in shell history/output;
- confirm exposed legacy Telegram credential has been rotated;
- confirm preview `noindex`;
- confirm production canonical/sitemap.

Re-run the route, API, browser, upload, SEO, CPU/memory/log and analytics matrix on the preview URL. Expected: 100% mandatory gates pass, 0 real production side effect, 0 preview URL in sitemap/canonical.

Retain the following preview manifest before approval:
- commit SHA and lockfile hash;
- Vinext/Next/React/Vite/Node versions;
- route/slug/API/redirect/sitemap/search hashes;
- Worker module graph and asset totals;
- env names/scopes only;
- deployment version and release-gate report.

## 8. DNS Cutover Validation

Only after preview pass and owner approval:

1. Compare approved DNS inventory record-by-record.
2. Validate DNSSEC, nameserver, Worker health and certificate state.
3. Execute the immediate hard cutover runbook.
4. Verify apex/`www`, TLS, redirects, robots, sitemap, canonical, indexed paths, 22 APIs, email/DKIM/SPF/DMARC/TXT and critical flows.
5. Record the verified Cloudflare version as rollback point.

Expected: no Vercel dependency, ≤5-minute operator-caused downtime excluding external DNS propagation, rollback drill ≤15 minutes, and Cloudflare version—not Vercel—is the restore target.

Failure-specific checks:
- redeploying a Worker version restores app/API behavior without changing healthy DNS;
- DNS rollback restores only the affected records/nameservers;
- certificate repair leaves a healthy Worker in place;
- MX/SPF/DKIM/DMARC rollback is independent from web route rollback;
- preview indexing is repaired without changing production robots/canonical.

## 9. Registrar Safety Check

Before reporting feature 004 complete, prove:
- registrar remains Squarespace;
- no domain unlock/auth-code request/submission/payment occurred;
- DNS can operate on Cloudflare independently.

A future registrar transfer requires a separate explicit owner trigger and all checks in `contracts/dns-registrar.md`.
