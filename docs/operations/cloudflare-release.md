# Cloudflare Release and Rollback

This runbook is owner-triggered. It never grants approval by itself.

## Production State (2026-11-24)

Production cutover is complete: Worker `inutdesign-web` serves
`https://inutdesign.com` on Cloudflare in production mode. Production route,
API, commerce, upload, search, analytics, SEO, security and Worker-resource
checks have passed.

Both apex and `www` return 200 from the same production Worker. The
`www.inutdesign.com` custom domain was attached on 2026-11-24 after replacing
the externally managed CNAME; Cloudflare now owns that routing record and its
certificate.

Worker remains on the Cloudflare Free plan by explicit owner decision. Keep
Free-first operation while it meets current requirements. If Cloudflare emits a
quota/CPU/plan warning, report it to the owner; a plan change is a separate
owner-directed TODO and must not happen automatically.

## Preconditions

- Feature 004 `pnpm release:local` passes without unresolved mandatory blocker.
- Preview has passed route, API, commerce, upload, search, analytics, accessibility,
  security, Worker-size, memory, CPU, log and cost gates.
- `artifacts/migration/release/release-manifest.json` identifies the source commit,
  lockfile hash and immutable Cloudflare candidate.
- `artifacts/migration/templates/production-approval.json` is completed by the owner
  without secret values.
- Required Worker secrets are injected by the Cloudflare secret mechanism and are
  absent from output, logs and source maps.
- For future releases, retain Free-first operation. Do not prepare or execute a
  Paid upgrade until the owner requests that work.

## Publishing Sanity Content with the Static Page Cache

Once the static page cache change is deployed, eligible pages use the content
snapshot created at build time. Sanity edits do not update that snapshot through
timed revalidation. To publish them, the owner runs `pnpm release:local`, then
`pnpm deploy:vinext` after the release and preview prerequisites pass. Verify
the changed page and its client navigation data after deployment. A rollback
restores the previous deployment's content snapshot as well as its code.

## Dry Run and Deploy

1. In GitHub Actions, dispatch `.github/workflows/deploy-web.yml`.
2. Choose `preview` and leave `deploy=false` to run all local gates and deploy dry run.
3. Choose `preview` and `deploy=true` only after owner approval.
4. Run the complete preview matrix and retain `artifacts/migration/preview/`.
5. For production, select `production`; the production GitHub environment must
   require the configured reviewer approval.
6. Compare preview and production artifact hashes. Only channel-specific preview
   `noindex` behavior may differ; every other delta requires a review record.

## Immediate Hard Cutover

1. Confirm the approved Cloudflare version and rollback version.
2. Confirm zone, custom domain, certificate and approved DNS inventory.
3. Attach the custom domain only after the Worker and zone are healthy.
4. Perform an immediate hard cutover; do not split traffic.
5. Verify apex, `www`, TLS, redirects, canonical, sitemap, 22 APIs and critical flows.
6. Record the active version and verification timestamps.

Cutover steps 1-6 are complete for apex and `www.inutdesign.com` as of
2026-11-24.

## Worker Rollback

Use this branch only for an application or Worker regression:

1. Identify the last Cloudflare version with a complete release record.
2. Route traffic to that Cloudflare version.
3. Do not change healthy DNS, certificate or email records.
4. Recheck TLS, apex/`www`, critical routes, 22 APIs, canonical and sitemap.
5. Preserve redacted logs and record operator start/completion time.

Success is restoration within 15 minutes of owner approval, excluding DNS
propagation outside operator control.

## DNS Rollback

Use only when the authoritative record or nameserver layer failed:

1. Restore the owner-approved DNS record or nameserver state.
2. Keep the healthy Cloudflare Worker version active.
3. Recheck resolution, certificate and application health independently.

## TLS Rollback/Repair

Keep healthy Worker and DNS state in place:

1. Inspect custom-domain attachment and certificate state.
2. Repair the hostname/certificate mapping.
3. Recheck certificate chain, expiry, apex, `www` and redirects.

## Email Rollback

Keep web and Worker layers unchanged:

1. Restore approved MX, SPF, DKIM, DMARC, TXT and provider targets.
2. Recheck sender authentication and mail flow independently from HTTP.

## Preview Index Recovery

1. Restore `X-Robots-Tag: noindex, nofollow` for the preview host.
2. Verify production canonical, sitemap and robots still reference
   `https://inutdesign.com`.
3. Remove preview URLs from public indexing surfaces.
4. Do not modify healthy production DNS or Worker versions.

## Failure Boundary Evidence

Each rollback drill records which layer failed and which healthy layers were
preserved. A Worker rollback never silently includes DNS rollback, and a DNS
rollback never silently includes a Worker rollback. Any combined response
requires evidence that both layers failed.
