# Proposal

## Why

Cloudflare currently sends nearly every request through the Worker, including public files, while Pages Router pages backed by `getStaticProps` execute dynamically. This change reduces Worker invocations for eligible public files and serves public pages from deployment-built cache through the Worker, avoiding page rendering and Sanity reads on cache hits while keeping user-specific and API responses isolated.

## What Changes

- Route public static files directly through Cloudflare Static Assets with deliberate browser cache headers, while retaining Worker handling for HTML, APIs, private paths, and preview SEO responses.
- Prerender eligible public Pages Router pages into static assets using Vinext's read-only Static Assets cache adapter. Sanity-backed content updates become visible after an owner-triggered local release and redeploy; runtime ISR is not part of this design.
- Add `no-store`, `no-referrer`, and `noindex, nofollow` protections to sensitive commerce, builder, search, and API responses as applicable.
- Exclude `.DS_Store` files and `public/keychain/connectors/README.md` from the deployed asset bundle while retaining keychain test fixtures.
- Exclude GitHub Actions deployment changes (`deploy-web.yml`); production releases continue through the local release workflow.

## Capabilities

### New Capabilities

- `cloudflare-static-asset-routing`: Static asset routing, cache headers, and deployment bundle exclusions.
- `edge-cdn-page-caching`: Deployment-time caching of public pages and privacy guarantees for private routes.

### Modified Capabilities

<!-- None: no existing specs exist under openspec/specs/. -->

## Impact

- Configuration: `cloudflare.config.ts`, `vite.config.ts`, `next.config.js`, `public/_headers`, and `public/.assetsignore`.
- Local deployment: `pnpm release:local`, the actual Vinext prerender/build output, and `pnpm deploy:vinext` preview/live behavior.
- External system: Cloudflare Workers Static Assets on Workers Free. No paid cache binding is required.
- Content operations: Sanity updates are published by running the authorized local release and redeploy; there is no timed refresh or runtime write-back.
