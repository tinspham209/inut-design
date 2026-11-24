# Phase 0 Research: Vinext + Cloudflare Migration

**Feature**: `004-migrate-vinext-cloudflare`  
**Date**: 2026-11-24

## Implemented Compatibility Decisions

Accepted package units, rejected overrides and retained evidence are maintained
in `specs/004-migrate-vinext-cloudflare/compatibility-decisions.md`.

Implemented units include Next 15.5.29/React 19.3.1/TypeScript 5.9.3, MUI 5,
the shared carousel replacement, Fiber 9/Drei 10/Three 0.187, Sanity client
7.28, MUI icon ESM entrypoints, Worker-safe image/crypto primitives and one
documented `use-sync-external-store` 1.6.0 transitive override.

Invalid Sanity slugs, preview deploy, Worker memory, cost/account controls, DNS
cutover, seven-day stability and the externally observed registrar
`pending transfer` remain blocked evidence—not accepted compatibility gaps.

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

## Package Manager Strategy

**Decision**: Upgrade and pin the repository toolchain to `pnpm@11.5.3` in the same dependency transaction as the Next/React migration. Regenerate the lockfile once with that exact pnpm version and use `pnpm install --frozen-lockfile` for all later local, CI and deployment installs.

**Rationale**:
- The repository currently pins `pnpm@10.32.1`, while feature 004 explicitly upgrades the package manager to 11.5.3.
- A single package-manager version prevents lockfile, peer-resolution and lifecycle-script differences between developer machines, GitHub Actions and Cloudflare build environments.
- Regenerating the lockfile is a required, reviewable migration step; silently accepting a pnpm 10-generated lockfile would weaken reproducibility.

**Alternatives considered**:
- Keep pnpm 10.32.1 — rejected by the updated feature requirement.
- Allow Corepack/current-machine pnpm to choose the version — rejected because lockfile and dependency resolution could differ by environment.
- Commit a regenerated lockfile without reviewing peer/patch resolution changes — rejected because React 19, Next 15 and Vinext are resolved in the same transaction.

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

## Source-Verified Migration Inventory

### Framework and UI Peer Graph

**Decision**: Treat peer compatibility as a dependency graph with atomic upgrade units, not as a list of independent package bumps.

**Source evidence**:
- Direct runtime is still Next 12.3.1/React 18.2 in `package.json`, while tooling has already drifted (`@next/third-parties` 15.x and `@next/bundle-analyzer` 16.x).
- MUI and Emotion are on MUI 5; custom Emotion style extraction in `pages/_document.tsx` and provider/cache ownership in `_app.tsx` make SSR/hydration a first-class gate.
- `react-material-ui-carousel@3.4.2` declares React 17/18 peers and is used in five files.
- `@react-three/fiber@8.15.0` and `@react-three/drei@9.92.0` are React 18-era peers and are consumed by both lighter and keychain 3D surfaces.
- `@sanity/block-content-to-react@2.0.7` has a broad React peer but old runtime assumptions; it must be rendered/tested, not accepted on metadata alone.

**Required order**:
1. Next 15.5 + React 19 + types + Node + Next tooling.
2. MUI/Emotion and custom Document SSR.
3. Carousel replacement/supported package.
4. Fiber/Drei/Three atomic upgrade and WebGL/fallback browser evidence.
5. Remaining UI peers (lightbox/date range/SWR/Hook Form/Zustand) by call-site evidence.

**Rationale**: An `--legacy-peer-deps`/override-style resolution would hide unsupported combinations and make the Worker migration unreliable before Vinext is even involved.

**Alternatives considered**:
- Bump all React packages once — rejected because failures become difficult to attribute.
- Keep React 18 with a newer Next — rejected by the approved Vinext peer line.
- Upgrade only direct imports — rejected because nested peer consumers (carousel, Three, MUI/Emotion) drive actual behavior.

### Next Image and Link Surface

**Decision**: Use an inventory-driven codemod and shared visual patterns; do not mass-remove props.

**Source evidence**:
- 44 `next/image` usages appear in 35 files.
- 28 files contain 52 legacy `layout`/`objectFit` prop occurrences.
- 99 `passHref`/`legacyBehavior` occurrences appear in 57 files, including MUI anchors, cards, galleries, navigation and result links.

**Rationale**:
- `next/image` changes require preserving the parent sizing context, not only replacing `layout` text.
- `next/link` migration can create duplicate/nested anchors if a wrapper's child is a MUI component that already renders an anchor.
- These changes affect keyboard behavior, focus, layout shift, tracking and prefetch, so source-shape and browser evidence are both required.

**Alternatives considered**:
- Replace every image with plain `<img>` — rejected because loading priority, dimensions and current route-level output would drift.
- Remove `legacyBehavior` everywhere mechanically — rejected because wrapper-specific child semantics differ.

### Webpack to Vite Boundary

**Decision**: Port only evidenced behavior from `next.config.js`; do not attempt a one-to-one copy of the webpack callback.

The three current behaviors are:
- alias `@imgly/background-removal` to `components/keychain-builder/image/backgroundRemovalDisabled.ts` when the public flag is false;
- set browser `fs` fallback to false;
- externalize `sharp` for server builds (temporary only until the upload Worker path no longer imports it).

Headers, redirects, `reactStrictMode`, `images.unoptimized` and bundle analysis are separate contracts and should be validated independently. The migration succeeds only when generated Vite/Vinext module graphs prove the disabled ML/WASM dependency is absent and required static output remains unchanged.

**Alternatives considered**:
- Copy webpack syntax into Vite — rejected because plugin internals differ.
- Leave disabled background removal to tree shaking — rejected because opt-in static imports and package assets must have an explicit production bundle assertion.

### Static Rendering and Build Publication

**Decision**: `fallback: false` is allowed only after each dynamic route has an independently verified complete slug source.

**Source evidence**:
- Product detail pages currently pre-render only the first 10 Sanity products and use `fallback: "blocking"`.
- Creativa currently builds zero static paths and uses blocking fallback.
- Blog already enumerates local Markdown slugs but still uses blocking fallback.
- Services already use `fallback: false`.
- Index/list pages currently retain `revalidate`.

**Required build policy**:
- duplicate, empty, invalid and reserved slugs fail the build;
- draft/version documents cannot enter path generation;
- required Sanity relations/configuration are validated before serializing page props;
- each path manifest is compared to the approved source query;
- missing Sanity/Markdown source fails closed, never produces an empty production “success”.

**Publication model**: begin with an owner-triggered GitHub Actions `workflow_dispatch` that builds and deploys an immutable revision. Do not start with an unaudited Sanity webhook. A later webhook can only be added after signed/authenticated dispatch, deduplication, concurrency and failure replay are designed separately.

**Alternatives considered**:
- Keep blocking fallback — rejected because it needs request-time generation/response storage.
- Let content stay stale until a normal code deploy — rejected by the approved owner-triggered publication model.
- Auto-deploy every Sanity webhook — deferred because event authentication, replay, ordering and duplicate builds are not designed by feature 004.

### Search Build Contract

**Decision**: Split the existing search module into build-only corpus assembly and browser-safe ranking/query modules.

`server/search/sources.ts` currently combines:
- route-tree documents;
- static page/product-page data;
- local Markdown blog documents;
- dynamic Sanity documents.

Only the corpus assembly depends on filesystem/Sanity. `domain.ts` query parsing, normalization, ranking, deduplication and result projection can be kept deterministic and reused in the browser if its imports are severed from server-only code.

**Index checks**:
- versioned schema;
- allow-listed fields only;
- valid production-relative URL;
- unique document ID and URL;
- no draft/private/contact/order/upload fields;
- deterministic source counts and hashes;
- golden-query ranking/count fixtures before and after migration;
- bundle-size budget and explicit decompression/loading UX.

**Alternatives considered**:
- Expose all current `SearchDocument` body text to the client — rejected until privacy and index-size checks pass; full corpus content is not automatically public contract.
- Fetch static index per query — deferred because local filtering is sufficient for the known corpus and avoids a runtime request.

### Worker API Compatibility

**Decision**: API testing is transport-specific, not route-count-only.

**Classes**:
1. JSON parsed by Next body parser, including the 14 MB upload envelope.
2. Four Creativa POST routes that disable body parsing and iterate a Node request stream.
3. GET/read-only routes and public cache behavior.
4. SPX scheduler with `crypto`, secret auth, timeout/idempotency and Telegram side effects.
5. Base64 image/body paths and Sanity uploads.

**Required evidence**:
- exact status/header/body semantic fixtures;
- under/at/over body limit;
- malformed Base64/JSON and unsupported MIME/signature;
- raw chunk boundaries and UTF-8 behavior;
- missing/duplicate idempotency token;
- no-op/mocked Sanity, Telegram and SPX downstreams;
- memory/CPU observation for largest upload and SPX representative request.

**Alternatives considered**:
- Rewrite all APIs to Web Fetch handlers — rejected because it expands scope and creates response/status drift.
- Assume Vinext emulates `NextApiRequest` exactly — rejected because raw body and Buffer behavior are a stated partial-risk area.

### Keychain Upload Worker Boundary

**Decision**: Browser encoding plus Worker validation is the only baseline path; `sharp` must be absent from the Worker graph.

The client already runs through `prepareSanityImageUpload`, resizing raster images to 2048 px and encoding WebP. The missing contract is robust Worker-side trust verification after receiving that output. The replacement must inspect container headers/dimensions/pixels without a native addon and must reject decompression bombs before full allocation.

**Required sequence**:
1. strict Base64 validation;
2. declared MIME allow-list;
3. decoded byte bound;
4. container signature and parser-level format confirmation;
5. width, height and pixel-count bounds;
6. filename sanitization;
7. Sanity write;
8. `_ref`/`_type` and public URL verification.

`sharp` may remain a development fixture generator or test dependency only if the Worker graph and production package cannot reach it; even then it is reviewed again for license/maintenance before implementation.

### Secret and Caller Migration

**Decision**: Do not replace exposed public credentials with another browser-visible secret.

Current source evidence:
- `utils/env-const.ts` loads `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN`, `NEXT_PUBLIC_TELEGRAM_CHAT_ID` and `NEXT_PUBLIC_X_API_KEY`.
- `api-client/axios-client.ts` and abandoned-checkout keepalive send the exposed `x-api-key` from the browser.
- Telegram and phone routes compare that same public key.
- `SPX_SYNC_SECRET` is already a proper server-only scheduler path and remains separate.

**Caller classes**:
- Browser-triggered same-origin phone/notification flows: enforce strict origin, JSON content type, method/body/field validation and a parity rate limiter. The legacy public key provides no meaningful secrecy and is removed.
- Scheduler/internal trusted calls: use server-only secrets and timing-safe comparison.
- Sanity/Telegram: tokens and chat credentials stay Worker-secret/build-server secret.

The exposed Telegram token must be rotated, not merely renamed. The plan preserves user-facing API outcomes, status semantics and retry behavior while explicitly rejecting the legacy assumption that a public `NEXT_PUBLIC_*` value authorizes a request.

**Alternatives considered**:
- Copy the old key to Cloudflare — rejected by constitution and FR-007.
- Issue a public browser token — rejected because it remains obtainable by the caller and does not add effective authorization.
- Add a new auth system — rejected as unrelated scope; same-origin + rate/content validation is the minimum compatible boundary for anonymous browser flows.

### Observability, Preview and Rollback

**Decision**: Every build and cutover must produce machine-diffable evidence.

Required artifacts:
- source commit and lockfile hash;
- dependency/peer decision manifest;
- public route/slug/redirect/sitemap manifest;
- API contract matrix;
- env variable names/scopes without values;
- Worker module graph and asset totals;
- preview/production deployment IDs;
- gate-by-gate evidence references;
- last verified Cloudflare version.

Rollback is layered:
- Worker/code: redeploy the verified Cloudflare version.
- DNS: restore approved DNS/nameserver state.
- TLS: repair custom-domain certificate/zone state without rolling back healthy app code.
- email: restore record-level email configuration.
- preview indexing: block crawlers/remove preview discovery without changing production.

**Alternatives considered**:
- Reuse Vercel as fallback — rejected by FR-013 and current availability.
- Use one combined “rollback everything” step — rejected because it can make a healthy layer regress while troubleshooting another.

## Sources Retained as Evidence

- `pnpm dlx vinext check` output, run 2026-11-24: 85% compatible, 74 pages, 22 APIs, 2 issues, 3 partial areas.
- `pnpm view vinext version engines peerDependencies dependencies --json`, run 2026-11-24: Vinext 1.4.6, Node `>=22`, Vite 8, React 19.3.1 peers.
- `pnpm view next@15.5 version --json`, run 2026-11-24: latest observed 15.5.29.
- Cloudflare, “Migrate Next.js from Vercel to Cloudflare Workers with vinext”, modified 2026-11-11: https://developers.cloudflare.com/workers/static-assets/migration-guides/vercel-to-workers/nextjs/
- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- Cloudflare Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
