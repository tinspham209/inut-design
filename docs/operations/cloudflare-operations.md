# Cloudflare Operations

## Initial Environment Setup

1. Dispatch a preview gate; do not deploy on the first setup run.
2. Configure build-only public variables by name.
3. Configure Worker secrets by reference, never in repository files:
   `SANITY_TOKEN`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`,
   `CREATIVA_TELEGRAM_BOT_TOKEN`, `SPX_SYNC_SECRET`,
   `SPX_SYNC_TELEGRAM_BOT_TOKEN`, `SPX_SYNC_TELEGRAM_CHAT_ID`.
4. Set `PREVIEW_SITE_URL` only in the preview environment.
5. Run `pnpm migration:check-secrets --require-build` and retain name-only diagnostics.

## Deploy Verification

- Dry-run the deployment.
- Verify preview `X-Robots-Tag: noindex, nofollow`.
- Verify production canonical, sitemap and robots remain `https://inutdesign.com`.
- Run route, API, browser, upload, analytics, secret and Worker graph matrices.
- Record immutable Cloudflare version, commit and lockfile hash.

## Log Inspection

Inspect only redacted route, status, duration, aggregate memory/CPU, attempt and
error-code fields. Never output request bodies, auth values, contact data,
uploaded bytes, design identifiers, asset internals or analytics secrets.

## Cost Escalation

Apply the policy in `artifacts/migration/operations/spend-policy.md`. Escalate to
the billing owner before any plan, Images, KV, R2, D1, Durable Object or Queue
activation.

## Failure and Recovery

Use the layer-specific procedure in `cloudflare-release.md`. Preserve the last
healthy Cloudflare version; Vercel is not a restore target.

## SPX External Scheduler

`POST /api/cron/sync-spx-orders` requires the `x-cron-secret` header matching the
server-only `SPX_SYNC_SECRET`. GET remains 405. There is no native Cron Trigger.
Keep the existing scheduler cadence and confirm it with the owner before rollout;
allow at least the configured function timeout (at most 30 seconds) plus network
overhead, and do not overlap runs. A backlog does not require an immediate second
call: the next scheduled tick continues the scan.

- A successful batch returns 200. `hasMore: true` means known work was deferred
  in this sweep, not an exact total backlog count. It is not a provider failure
  and does not send a Telegram alert on its own.
- A Sanity/checkpoint failure returns 500; transient SPX provider failures return
  502 unless a Sanity failure takes precedence. Keep monitoring those errors.
  Existing summaries and compact order results remain available. Do not log
  customer data, cursor contents, request bodies, or authentication headers.
- Each invocation allows at most 45 external attempts: up to eight draft publish
  transactions, ten tracking checks (up to two SPX attempts plus one patch each),
  and seven discovery/checkpoint/alert attempts. The cron transport has no hidden
  Sanity retries and refuses redirects. Other endpoints retain their client policy.
- Progress is revision-guarded in `spxSync.checkpoint` in the existing Sanity
  dataset. Its dotted ID is a private subpath under Sanity's default access rules,
  not a public order document or a Studio draft. No new binding is needed.
  Failed/unchanged attempted rows advance the cursor and return on the next
  sweep; untouched rows do not advance. Existing order revision guards remain.
- A checkpoint conflict or write failure returns 500; it never overwrites a
  newer checkpoint or claims durable completion. Inspect scheduler overlap before
  retrying. Resetting the checkpoint is not a routine retry operation.

Before a separately approved deploy, confirm the scheduler/monitor accepts 200
with backlog instead of the old 409 capacity response. Rollback restores the prior
Worker and its scheduler expectations. The prior Worker ignores the checkpoint;
do not delete orders or the checkpoint as part of rollback.

## Runtime Verification

`pnpm regression:safe` runs mocked upload/phone handlers on the installed local
workerd/Vinext adapter, decoder and Next body-parser checks, and deterministic SPX
regressions. No real orders, assets, provider requests or Telegram messages are
created by these fixtures.

`node scripts/migration/measure-worker-uploads.mjs before|after` records synthetic
upload wall times under `artifacts/migration/runtime/worker-runtime/`. Capture
`before` before changing code; do not overwrite it with a later build. The
2026-11-28 baseline failed at 10 MiB on workerd; the corrected decoder succeeds
with byte-identical mock persistence. The one-MiB baseline was approximately
37–52 ms, versus 5–8 ms after decoding changes in this local measurement.

These wall times include parsing, the existing request guard, Blob construction
and mock hashing. They are not deployed Worker CPU measurements or a peak isolate
memory profile. The 10 MiB path still buffers JSON and measured approximately
41–55 ms wall time locally; its Free-plan CPU/memory margin remains unverified.
The redundant body reserialization guard is retained because this comparison
does not isolate its cost sufficiently to justify changing that guard.

### Document fonts and bundle audit (2026-11-28)

The fresh prerendered `/` and runtime SSR `/search` each expose one active
Roboto/Roboto Serif stylesheet, with JavaScript both enabled and disabled.
Chromium's rendered-font inspection confirms both downloaded faces on Vietnamese
sample text; Material Icons is unchanged. At 1280×900 with cache cleared before
each navigation, neither page overflowed horizontally. Local first paints for
`/`, `/search` were 268/276 ms before and 276/120 ms after with JavaScript off;
with JavaScript on they were 108/124 ms before and 116/100 ms after. These single
samples establish the matched comparison, not a statistically significant
performance improvement or production Core Web Vitals result.

The comparable Worker bundle has 65 JavaScript modules: 5,679,241 → 5,681,105
raw bytes and 1,491,079 → 1,492,276 bytes summed per-module gzip. Its 61 diagnostic
maps total 17,449,466 bytes after the change (17,440,296 before), with zero maps
under public Static Assets. The installed `cf` prebuilt loader separates
`sourcemap` entries into diagnostic `sourceMaps`, rather than runtime modules.
The guarded prebuilt dry-run reports 5,547.95 KiB total upload / 1,438.61 KiB gzip;
that CLI accounting is distinct from the per-JavaScript-module measurement.

Static-import traversal from `index.js` reaches 48 modules, versus 65 when
dynamic imports are included. Both builder chunks are dynamic imports from the
Worker entry; the 936,000-byte OrbitControls chunk (including Three.js, confirmed
by its map sources) is reachable through those lazy boundaries, not the eager
entry graph. No bundle trim was justified or applied. Existing diagnostic maps
and Worker graph checks, including `sourcesContent` inspection, remain intact.

The local lint, TypeScript, Next/Vinext builds, safe regressions, secret/graph,
manifest and SEO gates passed, including 699 prerender HTML/data entries and
the protected-path asset checks. Production-channel Build Output passed
`DEPLOYMENT_CHANNEL=production INUT_LOCAL_PREBUILT=1 pnpm deploy:vinext --dry-run`.
This did not deploy or verify live CPU, memory, provider behavior, or scheduler
configuration. Those require a separately approved rollout and observation.
Detailed local JSON, logs and screenshots are under
`artifacts/migration/runtime/worker-runtime/`.
