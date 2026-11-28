# Design

## Context

See [proposal.md](./proposal.md) for motivation. The existing `cloudflare.config.ts` uses a broad `/*` `runWorkerFirst` rule, and `vite.config.ts` registers `vinext()` without cache or prerender options. The repository has a typed `cloudflare.config.ts`; Vinext's automatic cache-config patch does not apply to that existing config, so required cache behavior and bindings must be declared explicitly.

The current Pages Router `getStaticProps` pages include `/`, `/blog`, `/blog/[slug]`, `/san-pham` and its product subroutes, `/services` and `/services/[...slug]`, `/creativa`, and `/creativa/skin-laptop` and its slug/guide routes. Other route files without `getStaticProps` still need explicit consideration when prerendering all routes. The current `next.config.js` only gives explicit privacy headers to Creativa cart, checkout, and tracking paths. Worker headers do not cover requests served directly by Static Assets.

## Goals / Non-Goals

**Goals:**

- Use the Workers Free compatible read-only Static Assets cache adapter and build-time prerendering for eligible public pages.
- Make public file routing and browser cache headers work when Static Assets bypasses the Worker.
- Preserve Worker handling and privacy headers for sensitive, dynamic, API, and preview SEO responses.
- Make Sanity content freshness deployment-based: after content changes, the owner runs the local release and redeploys.

**Non-Goals:**

- Runtime ISR, background regeneration, or timed Sanity refresh. Do not set finite `revalidate` values with the read-only adapter.
- `workersCacheCdnAdapter`, paid Cloudflare bindings, custom Worker Cache API wrappers, or Zone Cache Rules.
- GitHub Actions deployment changes.

## Decisions

1. **Use the read-only Static Assets adapter with fail-closed route classification.** Vinext 1.4.6 accepts only `prerender.routes: "*"`; its Pages prerenderer skips routes classified as `getServerSideProps`, but otherwise also renders pages without `getStaticProps`. Maintain an explicit reviewed public route allowlist and a pre-build gate which enumerates every Pages route, fails on unknown or misclassified routes, and requires all routes outside the allowlist to be classified SSR or API. Make sensitive pages SSR using a no-data `getServerSideProps` only after checking their existing behavior and verify both Next and Vinext. A prohibited route fixture must fail the pre-build gate before prerender begins; inspect actual manifest and shared HTML/data after build as a second gate. Pin and check Vinext's version and classification behavior so an upgrade cannot silently invalidate this protection. If classification or runtime tests fail, stop rather than deploy. Configure `vinext({ cache: { cdn: staticAssetsAdapter() }, prerender: { routes: "*" } })` only after those gates pass. Because `cloudflare.config.ts` already exists, manually configure required cache exports/bindings and keep the adapter binding aligned with `ASSETS`. Protect `/_vinext/static-cache/*` via the existing `/*` Worker-first rule and ensure no negative rule overlaps it; an additional positive rule is rejected as redundant by the installed Cloudflare plugin. Do not use numeric `revalidate`: the adapter's runtime `set()` is a no-op. Build output is the cache; a local redeploy publishes Sanity changes.

   **Alternative considered:** `workersCacheCdnAdapter()` is not selected. In this repository, `pages/_document.tsx` makes static Pages Router responses request-aware, so Vinext bypasses its Pages response stage for `dataKind: "static"`; the regular Worker does not have the enabled response cache path. Adding only `CF_VERSION_METADATA` also does not patch the existing typed Cloudflare config with the required cache exports.

2. **Make routing exclusions specific and validate the actual built rules.** Derive exclusions from the current `public/` file tree, preserve Worker handling for HTML/API/private routes, and account for shared prefixes. Keep within Cloudflare's limits of 100 rules and less than 100 characters per rule; remove redundant broad wildcard rules. Keep preview `/robots.txt` and `/sitemap.xml` on the Worker (or otherwise demonstrably add the preview noindex header) while production may serve them directly.

3. **Put Static Assets headers in `public/_headers`.** Configure long-lived caching for immutable hashed assets and a conservative explicit lifetime for mutable public files. Include extensions such as AVIF, GLB, JS, JSON, XML, and TXT where appropriate. A custom `_headers` replaces the generated default in the observed build, so explicitly reproduce the `/_next/static/*` immutable policy, detaching the broader mutable policy first. Inspect the built file and responses to prove one effective policy. `next.config.js` headers alone do not apply when Static Assets serves a request directly.

4. **Apply privacy headers by route class before enabling bypasses.** Add no-store/no-referrer/noindex headers for cart, checkout, order-tracking, builder, and search HTML routes; add no-store to `/api/*` responses (with route-level coverage where framework headers do not apply). Keep these paths Worker-first. Confirm private HTML is never emitted as a prerendered public asset and that preview routes and static SEO files remain noindex.

5. **Filter only repository detritus.** Add `public/.assetsignore` entries for `.DS_Store` and `keychain/connectors/README.md`. Retain `keychain/fixtures/`, which browser and geometry tests consume.

6. **Measure the two paths separately.** Record a before/after baseline using identical representative requests and Cloudflare invocation logs or analytics: an existing eligible asset must invoke the Worker zero times after the change; a prerendered HTML or navigation-data hit may invoke the Worker, but must perform zero page renders and zero Sanity reads. Record request counts, method and observed results; do not claim a percentage improvement without measured traffic.

7. **Fail closed before and after prerender.** The allowlist and SSR classification above are the route selection mechanism, not a Vinext route-list option. Enumerate and classify every route before invoking Vite; do not rely on a post-build check to protect private routes. Inspect generated cache artifacts and manifest, including HTML and navigation data, and fail the release gate if any prohibited route appears. Confirm the classifier and SSR behavior using executable fixtures; if the installed implementation does not honor these safeguards, stop and revise the design rather than ship.

8. **Set measurable cache policies.** Hashed build assets use `public, max-age=31536000, immutable`; mutable public files default to `public, max-age=3600` unless a documented shorter policy is required. Never apply immutable to unversioned paths. Inspect all overlapping `_headers` rules and actual responses so each asset has one coherent Cache-Control policy, including the explicit replacement for Vinext's default `/_next/static/*` rule. Preview SEO files retain their separate indexing protection.

9. **Prove release and rollback with controlled content.** Use an owner-approved, reversible non-sensitive Sanity fixture or existing test content, record its original value and URL, and restore it after verification. Record the exact prior deployment version and a working restoration procedure before release; verify rollback serves that version's content. If a safe fixture, deployment access, or rollback procedure is unavailable, mark the corresponding live checks pending and do not claim completion.

10. **Refresh content path inventory per release.** The original migration slug baseline is historical and cannot remain the expected set for mutable Sanity content. Collect and validate a fresh published slug inventory for each release build; use that same captured inventory for SEO generation and route reconciliation, fail on unavailable sources, invalid paths or detected build/inventory divergence, and retain the historical baseline unchanged. Exercise added and removed slug fixtures before live tests.

11. **Freeze CMS-backed fallback-false path selection.** Production verification showed Vinext can call `getStaticPaths` on a cache MISS; a function that queries live Sanity admits a newly published slug without redeployment. A thin Worker entry guard embeds the validated inventory generated by the build and rejects HTML and navigation-data requests for unlisted slugs in the four Sanity-backed product route families before delegating to Vinext. It also includes explicit static Pages routes, so guide pages sharing a prefix remain reachable. The guard does not intercept APIs, private pages or ordinary asset paths. Each deployment owns its inventory; the build fails if it is missing or invalid. Blog and service paths are sourced from deployment-bundled files. Verify GET/HEAD and data requests, known static pages, private/API paths, and cached pages after content removal; unknown paths must not invoke Sanity.

## Risks / Trade-offs

- [Sanity edits remain unpublished until redeploy] → State the owner workflow in release documentation and verify a redeploy refreshes prerendered output.
- [A broad routing exclusion serves an HTML page as a static miss or bypasses privacy headers] → Inspect generated rules and exercise representative nested asset paths plus overlapping HTML/private paths in preview.
- [Private or request-dependent routes are accidentally prerendered] → Review the complete prerender manifest; exclude or explicitly keep dynamic any route that depends on cookies, identity, or request state.
- [Direct Static Assets responses miss `next.config.js` headers] → Verify response headers from the built asset server and keep `_headers` as the source for static-file policy.
- [Preview robots or sitemap become indexable when bypassing Worker] → Keep those paths Worker-first on preview and verify the actual preview responses.

## Migration Plan

1. Add and validate cache/privacy/routing configuration and build-time prerendering.
2. Run `pnpm release:local`; inspect the generated asset rules, `_headers`, `.assetsignore`, and prerender manifest. Treat `vinext-cloudflare deploy --dry-run` only as a deploy dry-run, not as proof that build or prerender ran.
3. Deploy to preview and verify representative public pages/assets, private pages/APIs, and preview SEO behavior.
4. On production release, run the local release and deploy. For later Sanity content edits, repeat that local release and redeploy.
5. Roll back by redeploying the previous known-good release; content freshness returns to that build's snapshot.

### Owner-directed production verification (2026-11-28)

The owner identified the published product `/san-pham/skin-laptop/dave-the-diver` as the reversible Sanity fixture and authorized verification directly on production because no separate preview host is available. Record the live value and revision and a concrete, dry-run-checked rollback procedure before the production change. Use revision-guarded temporary mutations, restore the original value even on failure, and verify both the restored Sanity document and the final deployed snapshot. Verify the candidate on production as authorized, with immediate rollback on a material failure. This authorization changes the order of live checks; it does not establish or remove the separate preview SEO requirement, which remains pending without a suitable host.

The owner explicitly accepts that pages opened before deployment may fail to navigate or load old hashed assets after deployment. This is a known, demonstrated limitation, not a passing compatibility check. Verify fresh sessions and the deployed version, and report any observed problems during deployment propagation or rollback separately; the owner did not waive those checks.

The installed `vinext-cloudflare deploy` performs an additional build and prerender even after the release gate has already produced a checked Build Output; the second prerender failed because its server output path was missing. For the local release only, deploy the exact freshly gated Cloudflare Build Output via `cf deploy --prebuilt`, after repeating the route and prerender-output checks and a prebuilt dry-run. Preserve the normal `deploy:vinext` behavior for CI unless the local prebuilt mode is explicitly selected.

### Preview-evidence waiver (2026-11-28)

The owner confirmed that no live preview hostname is configured and explicitly waived preview-only live evidence for this change. Complete the remaining verification on the active Cloudflare production custom domain, retaining preview-mode configuration checks and local Worker-header gates. Do not treat the `workers.dev` version URL as equivalent evidence, because Cloudflare injects `noindex` there and replaces the application's `noindex, nofollow` value. This waiver changes the verification surface only; it does not remove the implementation requirement that preview HTML, private pages, robots, and sitemap remain `noindex, nofollow`.
