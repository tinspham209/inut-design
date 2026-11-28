# Proposal

## Why

The upload decoder can fail on valid large payloads, and an authorized SPX run can exceed the Workers Free subrequest limit even with the current 25-order cap. Phone validation does not use a Cloudflare-aware IP resolver, and the broken font link now appears in both rendered and deployed prerendered HTML.

## What Changes

- Validate canonical base64 without the large-input stack failure and reduce avoidable intermediate allocations. Preserve each upload route's existing formats, size limits and success shape. **API behavior change:** `/api/sanity/upload-image` returns HTTP 400 instead of 500 for malformed or non-canonical base64; upstream persistence failures remain 500.
- Reuse shared IP resolution for `/api/validate-phone`, recognizing the Cloudflare client IP without changing the route's advisory fallback or other endpoints' trust policy.
- Bound SPX draft publishing and tracking across all external attempts. **Scheduler contract change:** a successful batch with deferred work returns HTTP 200 and `hasMore: true` rather than rejecting an oversized tracking backlog with 409. Save scan progress so later ticks reach orders beyond the first batch. Keep authenticated POST and real-failure reporting.
- Load Roboto and Roboto Serif on screen with a standard stylesheet in both the prerender snapshot and runtime SSR. Inspect current Worker modules, diagnostic sourcemaps, and public assets separately; trim only a measured, safe target.

## Capabilities

### New Capabilities
- `worker-upload-and-rate-limit`: Efficient, contract-preserving image uploads, Cloudflare client-IP handling for phone validation, and budgeted SPX sync with durable backlog progress.
- `document-font-loading`: Screen-ready Google Fonts in prerendered and SSR HTML, with verification of Worker artifact boundaries and diagnostic coverage.

### Modified Capabilities

None. The archived blog Worker graph, static asset routing, private-route and deployment-snapshot requirements remain in force.

## Impact

- Affected surfaces: upload handlers and validation, phone limiter, SPX handler and cron-specific Sanity/provider calls, external scheduler runbook, `_document.tsx`, and Worker build inspection.
- SPX progress uses the existing Sanity dataset, not a new Cloudflare binding. No upload protocol change, global limiter rewrite, native Cron Trigger, cache policy change, or production deployment is in scope.
- Verification includes mocked handler and transport tests, end-to-end upload resource measurements, prerender/SSR browser checks, and the existing Vinext and prebuilt release gates.
