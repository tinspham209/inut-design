# Phase 0 Research: Vinext + Cloudflare Migration

**Feature**: `004-migrate-vinext-cloudflare`  
**Date**: 2026-11-24

## Runtime Version Strategy

**Decision**: Upgrade to Next.js 15.5.x, React/ReactDOM 19.3.1, Vinext 1.4.6 and Vite 8; keep Node `>=22 <26`. Pin `next@15.5.29` only after Phase 1 local/build evidence.

**Rationale**:
- Vinext 1.4.6 reports `node >=22`, Vite `^8`, and React/ReactDOM `^19.3.1`.
- Current registry evidence lists 15.5.29 as the latest 15.5.x; Next 16 adds non-required migration surface and Turbopack/tooling changes.
- The repository uses Pages Router, so Next 15 provides a closer bridge than jumping to Next 16.
- Node 22 is already the repository working baseline and remains inside `package.json` engine range.

**Alternatives considered**:
- Keep Next 12/React 18 — rejected because current supported Vinext peers require React 19 and target Next 14+.
- Jump to Next 16 — rejected for this release because it expands webpack, lint and tooling scope without solving a stated requirement.
- Use OpenNext — rejected by the approved approach; Vinext is the required parallel path.

## Compatibility Baseline

**Decision**: Treat `pnpm dlx vinext check` as an initial filter and require built-Worker runtime evidence before compatibility is claimed.

**Rationale**: Current report scans 74 pages and 22 APIs at 85% compatibility, with:
- 2 hard issues: `next/types`, CommonJS `__dirname`/`__filename` path assumption.
- 3 partial areas: image handling, custom webpack behavior, React Strict Mode.

The plan resolves hard issues in Phase 1 and turns partial support into executable tests.

**Alternatives considered**:
- Accept scanner output as release proof — rejected; static scan cannot validate Worker memory, Buffer/body parsing or rendered behavior.
- Rewrite the app around Vinext-specific internals — rejected; constitution and spec require retaining Pages Router/current public contracts.

## Rendering & Cache Model

**Decision**: Public content is full static with no ISR/SSR; initialize Vinext with `--cdn-cache=none --data-cache=none`.

**Rationale**:
- The spec inventory identifies 58 static shells, 4 SSG groups, 11 ISR page modules and 1 SSR `/search`.
- All public content can be deployed from an owner-triggered build; no fixed freshness SLA exists.
- Worker Response Store, R2 and Durable Objects add cost/state without a current requirement.
- Static asset requests are not billed as Worker requests.

**Alternatives considered**:
- Keep ISR with self-contained Response Store — rejected for baseline because it adds R2/DO, state and cost to solve a deferred freshness requirement.
- Move pages to request-time SSR — rejected; it increases CPU/memory exposure and contradicts the static-first requirement.
- Use KV/D1 for content — rejected; Sanity remains the source of truth and no cross-request cache contract is required.

## Static Search

**Decision**: Build a public, allow-listed search index during deployment and filter it in the browser. `/api/search` remains for API parity but is not called by the `/search` runtime path.

**Rationale**:
- Removes the sole public SSR route and Sanity request-time dependency.
- Allows full-static `/search` without Response Store.
- A dedicated index schema can exclude drafts and sensitive/internal fields.

**Alternatives considered**:
- Keep bounded server search with a cache — rejected as the baseline because it retains dynamic Worker execution for a public page.
- Fetch Sanity directly in browser — rejected; it expands public query/data exposure and does not use the approved build model.
- Use an external search service — rejected; adds dependency, secret and cost without evidence.

## Keychain Image Upload

**Decision**: Resize/encode in the browser; Worker validates MIME, byte signature, decoded size, pixel dimensions and persistence, then stores the accepted bytes. Remove native `sharp` from Worker runtime.

**Rationale**:
- Workers isolate memory is 128 MB; image transforms are a predictable native/WASM pressure point.
- Existing contract already accepts a Base64 PNG/JPEG/WebP and persists WebP output to Sanity.
- Browser output can preserve UX while Worker validation still enforces trust boundaries.

**Alternatives considered**:
- Run `sharp` in Worker — rejected because native addon compatibility and memory are unsupported baseline risks.
- Direct browser upload to Sanity — rejected until an approved short-lived upload authorization design exists.
- External image service — rejected; adds privacy/data transfer, dependency and cost not justified by current evidence.

## Images

**Decision**: Use `--image-optimization=none`; preserve visual output using original local/remote URLs or pre-generated variants.

**Rationale**:
- Current Next config already has `images.unoptimized: true`.
- Vinext can render original image URLs without an optimizer.
- Cloudflare Images would add service/cost and is excluded by the static-first baseline.

**Alternatives considered**:
- Cloudflare Images — defer until visual/performance evidence shows a need.
- Worker-side optimizer — rejected because of CPU/memory and native-module scope.

## API Runtime

**Decision**: Keep all 22 API routes on Workers and preserve methods, validation, body limits, auth, responses, status codes and idempotency. Tests use fixtures/mocks for write paths.

**Rationale**:
- The feature is explicitly not static-only.
- Commerce, contact, keychain, Creativa, notification and SPX contracts are protected by the constitution.
- Cloudflare worker runtimes can expose different `Buffer`/stream/body-parser behavior, requiring direct evidence.

**Alternatives considered**:
- Move APIs to another service — rejected because it creates an unnecessary second runtime and secret/data plane.
- Permit undefined contract drift while “improving” APIs — rejected by FR-004 and commerce invariants.

## Analytics

**Decision**: Remove `@vercel/analytics`; keep existing GA4/GTM and Umami wrappers and verify each source emits at most once.

**Rationale**:
- Vercel analytics has no operational value after Vercel exit.
- Dual analytics is an established protected contract.
- Static migration and React changes can duplicate effects under Strict Mode, navigation or bfcache handling.

**Alternatives considered**:
- Replace with Cloudflare Web Analytics — rejected unless separately approved, because it does not satisfy the existing GA4/GTM + Umami contract.
- Keep Vercel Analytics as no-op — rejected by FR-022 and dependency cleanliness.

## Dependency & Config Integration

**Decision**: Run `vinext init` with all required non-interactive flags, keep `next.config.js`, and do not add a separate `wrangler.jsonc`.

**Rationale**:
- Cloudflare’s migration guide states Vinext uses `cloudflare.config.ts` + `cf` CLI.
- Wrangler automatic setup targets OpenNext rather than Vinext.
- Existing headers/redirects and custom `webpack` alias/external behavior remain source inputs.

**Alternatives considered**:
- Hand-author Wrangler config — rejected because it bypasses Vinext’s generated model.
- Delete `next.config.js` and duplicate rules — rejected by parity and maintenance risk.

## Deployment & Cutover

**Decision**: Local build → dry-run → preview deploy → owner review/release gate → immediate hard DNS cutover → Cloudflare version rollback. Vercel is not a rollback target.

**Rationale**:
- Preview gives runtime evidence without changing production DNS.
- Hard cutover matches FR-015 and avoids dual-origin traffic ambiguity.
- Cloudflare deployment versions support a rollback point controlled in the same platform.

**Alternatives considered**:
- Traffic split — rejected by spec and by preview/canonical/indexing complexity.
- Vercel fallback — rejected because Vercel is offline and explicitly excluded from rollback.
- Registrar-first migration — rejected because DNS can move independently and registration transfer adds approval/payment/lock risk.

## DNS, SEO & Registrar

**Decision**: Move authoritative DNS only after preview and owner-approved inventory pass. Keep registrar at Squarespace through stabilization. Registrar transfer is a separate explicit-trigger operation.

**Rationale**:
- DNS activation, custom-domain routing and registrar ownership are separate failure domains.
- Email/TXT/verification/DNSSEC records can be damaged if copied blindly.
- Preview must not create a second indexed site.

**Alternatives considered**:
- Blind DNS scan/import — rejected because every record needs owner/target/TTL/priority/proxy disposition.
- Transfer registrar before DNS stabilizes — rejected; it expands failure and approval scope.
- Allow preview into production sitemap — rejected by SEO continuity requirements.

## Cost & Optional Services

**Decision**: Workers Paid is required. Baseline is $5/month when under included usage; configure a $2 usage-over-base warning and $10 usage hard block. No optional Cloudflare data/image/queue service is enabled without compatibility/cost evidence.

**Rationale**:
- Workers Free has 10 ms CPU/request, unsuitable for validated API parity and is explicitly rejected in the spec.
- Workers Paid includes 10M requests and 30M CPU ms/month; static asset requests are free.
- Existing Vercel invocation samples include SSR/ISR work and cannot be treated as Worker API billing volume after full-static conversion.

**Alternatives considered**:
- Stay on Free — rejected for CPU reliability.
- Enable R2/Response Store preemptively — rejected; it is not needed for static publication.
- Add Cache/Queue/Image services for “future use” — rejected as unsupported cost/scope.

## Sources Retained as Evidence

- `pnpm dlx vinext check` output, run 2026-11-24: 85% compatible, 74 pages, 22 APIs, 2 issues, 3 partial areas.
- `pnpm view vinext version engines peerDependencies dependencies --json`, run 2026-11-24: Vinext 1.4.6, Node `>=22`, Vite 8, React 19.3.1 peers.
- `pnpm view next@15.5 version --json`, run 2026-11-24: latest observed 15.5.29.
- Cloudflare, “Migrate Next.js from Vercel to Cloudflare Workers with vinext”, modified 2026-11-11: https://developers.cloudflare.com/workers/static-assets/migration-guides/vercel-to-workers/nextjs/
- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- Cloudflare Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
