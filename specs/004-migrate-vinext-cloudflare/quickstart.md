# Quickstart: Validate Feature 004

Runbook này dùng để prove migration end-to-end. Nó không authorize Cloudflare subscription, deploy, DNS, registrar transfer hoặc production writes.

## 1. Prerequisites

- Node 22, pnpm `10.32.1`.
- Existing `.env` values available locally; never print them.
- Approved Sanity public fixture/read-only access for baseline and build.
- A local mock/test mode for order, notification, upload and Sanity write paths.
- `agent-browser` available for browser/device proof.
- For preview only: owner-approved Cloudflare account access and a configured preview hostname.

## 2. Capture Baseline

From repository root:

```bash
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
- representative desktop/mobile screenshots;
- redirect/status/header output;
- sanitized analytics event sequence;
- performance timings and current `next.config.js` behavior.

Do not run production write APIs.

## 3. Validate Runtime Upgrade & Vinext

After Phase 1 implementation:

```bash
pnpm lint
pnpm build
pnpm dev:vinext -- --port 3001
```

Check main pages at port 3001, then stop dev server and test built Worker:

```bash
pnpm build:vinext
pnpm start:vinext -- --port 3001
```

Expected:
- no hard Vinext issue;
- normal Next path and built Vinext path both render;
- Pages Router custom `_app`/`_document` behavior is preserved;
- images, redirects, headers, React Strict Mode and webpack-derived alias behavior have direct evidence.

## 4. Validate Static Rendering & Search

Run build and inspect its output:

```bash
pnpm build:vinext
node scripts/verify-seo.mjs
```

Expected:
- all public modules resolve without ISR/SSR;
- blog/service/product/Creativa published slugs build with `fallback: false`;
- removed/unpublished slugs return 404;
- public search index schema and privacy allow-list pass;
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

Evidence: screenshots, browser console/network result and a concise pass/fail manifest.

## 7. Preview Deploy Gate

Only when explicitly approved to deploy:

```bash
pnpm dlx @vinext/cloudflare deploy --dry-run
pnpm dlx @vinext/cloudflare deploy
```

Before running the real deploy:
- confirm Workers Paid, preview hostname and spend policy;
- confirm server secrets are configured without values appearing in shell history/output;
- confirm preview `noindex`;
- confirm production canonical/sitemap.

Re-run the route, API, browser, upload, SEO, CPU/memory/log and analytics matrix on the preview URL. Expected: 100% mandatory gates pass, 0 real production side effect, 0 preview URL in sitemap/canonical.

## 8. DNS Cutover Validation

Only after preview pass and owner approval:

1. Compare approved DNS inventory record-by-record.
2. Validate DNSSEC, nameserver, Worker health and certificate state.
3. Execute the immediate hard cutover runbook.
4. Verify apex/`www`, TLS, redirects, robots, sitemap, canonical, indexed paths, 22 APIs, email/DKIM/SPF/DMARC/TXT and critical flows.
5. Record the verified Cloudflare version as rollback point.

Expected: no Vercel dependency, ≤5-minute operator-caused downtime excluding external DNS propagation, rollback drill ≤15 minutes, and Cloudflare version—not Vercel—is the restore target.

## 9. Registrar Safety Check

Before reporting feature 004 complete, prove:
- registrar remains Squarespace;
- no domain unlock/auth-code request/submission/payment occurred;
- DNS can operate on Cloudflare independently.

A future registrar transfer requires a separate explicit owner trigger and all checks in `contracts/dns-registrar.md`.
