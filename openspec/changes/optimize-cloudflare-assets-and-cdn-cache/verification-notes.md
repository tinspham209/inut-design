# Verification notes

## Local investigation

- Vinext 1.4.6 accepts only wildcard prerender selection. Its Pages classifier skips `getServerSideProps` pages; the pre-build route gate pins and tests this behavior and requires an explicit file inventory.
- A local isolated prerender experiment rendered 699 public entries and skipped 13 SSR pages and 18 API routes. The output gate checked each cached Pages HTML and navigation-data pair; its prohibited checkout fixture was rejected. This is not a Cloudflare preview or deployment result.
- On both Next production and Vinext local preview, privacy headers were checked on representative search, builder, cart, checkout and tracking routes. The stricter keychain API `no-store, max-age=0` survived the common policy in local tests.
- Browser testing on both runtimes added a lighter to a local cart, changed quantity, reloaded and navigated to checkout; the test cart was cleared and no order was submitted. Creativa checkout support navigation worked on both runtimes after fixing a nested anchor.
- The laptop and keycap catalog pages served the same cached HTML with and without filter query parameters. Filter selection and reload were checked in the local browser; catalog requests were mocked to verify results and counts because live Sanity requests from localhost were not confirmed. This does not prove live Sanity CORS or production data.
- The first standalone Vinext build's route-manifest check used Next dev output and failed; running a full Next production build first reconciled 710 paths and allowed the subsequent non-prerender Vinext build to pass.

## Pending

Cloudflare preview routing, production measurements, deployment, safe Sanity fixture freshness and rollback evidence remain pending until actually performed. Do not treat local preview, mocked requests or a deploy dry-run as those results.

## Production baseline (read only)

On 2026-11-27, Cloudflare deployment list reported version `cbe598f5-ecd5-4f62-8bfa-49f17f5f17da` at 100% for the current deployment. This is a point-in-time observation, not proof of a tested rollback; re-read immediately before any release and verify the rollback procedure and content snapshot.

## Cloudflare version URL, 2026-11-27

- Preview-configured version `eeafe7d9-ead2-41e5-9d1b-821226b012fa` was uploaded without a production deployment. Production deployment was read back with version `cbe598f5-ecd5-4f62-8bfa-49f17f5f17da` still at 100%.
- Version URL checks: representative nested AVIF and PNG returned 200 and `max-age=3600`; overlapping HTML paths returned 200 and cache HIT; missing asset returned 404; direct, encoded and traversal-style internal-cache requests returned 404; private routes returned `no-store` and `no-referrer`; API missing route returned `no-store`. Keychain fixture JSON returned 200 while connector README and a `.DS_Store` path returned 404.
- Cloudflare's workers.dev version URL returned `X-Robots-Tag: noindex` on HTML, SEO files and private pages, even though the preview-configured local Worker returned `noindex, nofollow`. Cloudflare documents automatic `noindex` on workers.dev preview URLs. The required `nofollow` remains unverified on a Cloudflare host that preserves the Worker response; do not downgrade the requirement based on this URL.
- No claim is made about zero Worker invocations, real browser-to-Sanity filtering, release freshness, version rollback, or full Cloudflare Preview isolation from this version URL. Cloudflare documents that a Version URL uses production resources and differs from an isolated Preview.

## Production verification preparation, 2026-11-28

- The owner authorized production verification and selected the published product `/san-pham/skin-laptop/dave-the-diver` as a reversible Sanity fixture. A read-only Sanity lookup found document `294c3afa-2609-4cc5-a460-21447b18a76c`, original `name` and `details` value `Dave The Diver`, current revision `KuKwao4kExolzwDvAgWpwZ` (previously `ssTSMVVxZflHd3MfwJXa4s`); no mutation has been made yet.
- The owner explicitly accepted that pages opened before deployment may fail to navigate or load old hashed assets after deployment (`design.md`, Owner-directed production verification), unblocking deployment while keeping fresh-session, propagation, and rollback checks required.
- Prior production deployment `59495562-4d05-46a3-99f4-c4362bd452cb` ran version `cbe598f5-ecd5-4f62-8bfa-49f17f5f17da` (`run_worker_first: ["/*", "!/_next/static/*", "!/*/_next/static/*"]`).
- Deployment `70f1f26a-9b31-4eb0-8a51-3012dbb8bba2` at `2026-11-28T01:30:43Z` promoted version `af45d25b-784f-4fe4-b70e-09f241879d88` to 100%, updating `run_worker_first` and `_headers` on production (`x-vinext-cache: HIT` on HTML, `public, max-age=3600` + security headers on static assets, `public, max-age=31536000, immutable` + security headers on `/_next/static/*`).
- Local workspace changes after `af45d25b` added `worker/index.ts` + `worker/deployed-paths.ts` + `deployedPaths()` Vite plugin for task `2.6` (deployment-snapshot `fallback: false` guard), which are built locally (`buildId: 46f8a434-7189-41d7-abe4-6f4083268088`) and awaiting final gate validation and deployment.
