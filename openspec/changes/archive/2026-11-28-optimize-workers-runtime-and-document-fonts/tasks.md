# Tasks

## 1. Worker upload decoding

- [x] 1.1 Capture a baseline with synthetic typical and near-limit uploads through local Vinext/workerd with mocked persistence. Record how CPU, wall time and peak memory are measured or approximated, and record the current 10 MiB failure separately from comparable successful cases.
- [x] 1.2 Replace the regex and round trip in `decodeBase64Image` and pass the exact decoded byte range to each route's `Blob` without an extra full-size app copy. Extend `scripts/tests/keychain-image-validation.test.mjs` with exact 10 MiB decode, byte equality, canonical one/two-padding cases, and malformed, non-canonical and empty rejection.
- [x] 1.3 Separate general Sanity decode failures (400) from persistence failures (500). Add mocked tests that invoke both handlers and assert exact persisted bytes, route-specific success shapes, valid PNG/JPEG/WebP, general-route SVG, the keychain 10 MiB decoded boundary and dimension constraints, and no persistence for rejected requests. Check the existing 14 MiB body cap and request guards in Next and Vinext.
- [x] 1.4 Compare end-to-end resource measurements against task 1.1. Remove redundant JSON reserialization on upload paths only if it remains material and tests prove both real parsers enforce the body byte limit without relying on `Content-Length`. Record any remaining Workers Free CPU or memory risk rather than treating Node measurements as deployed evidence.

## 2. Cloudflare phone rate limiting

- [x] 2.1 Replace the phone handler's local resolver with the shared resolver and explicit Worker trust behavior, leaving other endpoints unchanged. Test the Vinext request adapter, two connecting IPs with the same forwarded/socket input, and direct Next fallback. Invoke the handler with a mocked Zalo dependency to show the limited bucket returns HTTP 200 with `zaloRegistered: null` and does not probe Zalo, while the other bucket can still do so.

## 3. Budgeted SPX sync and scheduler contract

- [x] 3.1 Enforce the 45-attempt budget in the cron-specific Sanity/SPX/Telegram paths and bound both discovery queries and dispatch loops. Extend `scripts/test-spx-sync.mjs` with a transport-level fixture that counts actual requests including checkpoint operations, redirects/retries, draft mutations, tracking patches and alert attempts; verify the ceiling when both batches are full.
- [x] 3.2 Persist independent, revision-guarded sweep cursors in the existing Sanity dataset. Use mocked state across multiple invocations to verify cold-start continuation, equal creation times, wraparound, persistently eligible or failing earlier rows, deadline deferral and stale/checkpoint-write failures without skipping untouched candidates.
- [x] 3.3 Add `hasMore` and distinguish deferral from failure. Run `pnpm regression:spx` with handler and orchestration cases for full and partial success (200), preserved auth/method handling and 500/502 precedence, and no alert for deferral alone. Document the external POST scheduler contract, no-overlap policy, status handling and rollback in `docs/operations/cloudflare-operations.md`; leave external scheduler configuration and live writes to a separately approved release.

## 4. Document fonts and Worker artifact audit

- [x] 4.1 Replace the Roboto print/onLoad workaround with one active stylesheet in `_document.tsx`, preserving Material Icons. On fresh prerendered HTML and a runtime SSR page (for example `/` and `/search`), verify the initial stylesheet applies to screen even with JavaScript disabled. Check rendered font faces for Roboto and Roboto Serif in the browser (use explicit sample text if a page does not naturally render both), compare first-paint/layout behavior under matching conditions, and confirm the stylesheet is not duplicated.
- [x] 4.2 Audit the fresh Cloudflare Build Output and installed prebuilt loader: record runtime raw/compressed module sizes, diagnostic map size and handling, absence of Worker maps under public assets, and eager/lazy reachability of Three.js/OrbitControls. Land only an isolated trim with a measured improvement; otherwise record the no-change result. If trimming, verify both 3D builders in the browser and keep the Worker graph negative fixtures effective, including imports detected through map `sourcesContent`.

## 5. Integration and release gates

- [x] 5.1 Run `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, `pnpm build:vinext`, `pnpm regression:safe`, and `pnpm migration:check-secrets --require-build`, `pnpm migration:check-worker-graph --require-build`, `pnpm migration:check-manifests` and `pnpm migration:check-preview-seo`. Keep the prerender route/output, deployed-path, Static Assets and API/privacy gates and verify the same freshness and private-route behavior as the archived changes.
- [x] 5.2 Validate the fresh gated Cloudflare Build Output with `DEPLOYMENT_CHANNEL=production INUT_LOCAL_PREBUILT=1 pnpm deploy:vinext --dry-run` using the production build channel, without a real deploy. Record the measured upload/bundle limitations and flag unverified live behavior as pending rather than treating a local dry-run as production evidence.
