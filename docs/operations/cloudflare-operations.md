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
