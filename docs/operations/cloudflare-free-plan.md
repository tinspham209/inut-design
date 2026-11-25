# Cloudflare Workers Free Plan Setup

## Current Account State

- Account: `inutdesign`
- Zone plan: Cloudflare Free ($0)
- Cloudflare CLI authentication: completed
- Worker `inutdesign-web` is deployed and serving `inutdesign.com` in production.
- `inutdesign.com` custom-domain cutover is complete.
- `cloudflare.config.ts` contains the account ID and no paid-only service.
- `pnpm release:local` and Vinext Cloudflare deploy dry-run pass.

## Current Limits Relevant to This Project

- 100,000 requests/day.
- 10 ms CPU/request.
- 128 MB memory.
- 50 subrequests/request.
- 20,000 static asset files per Worker version.
- 25 MiB per static asset and 64 MiB Worker size limit.

## Accepted Production Decision

Production remains on Workers Free by explicit owner decision on 2026-11-24.
Workers Paid is not the default target or a production precondition; it is a
future owner-directed option if current limits or requirements change.

- Continue operating on the Free plan while Cloudflare reports healthy request,
  CPU and memory usage.
- When Cloudflare emits a quota/plan warning, report it to the owner and wait
  for explicit direction before changing plans. This document sets no separate
  numeric warning threshold.
- **Future Paid TODO**: if the owner requests an upgrade, verify current pricing,
  included usage, spending controls, logs and optional service costs, then
  update the model and runbooks. Historical `$5`/`$2`/`$10` assumptions are not
  active policy.

## Worker Secrets

Production Worker secrets are configured in Cloudflare by name:

- `SANITY_TOKEN`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `CREATIVA_TELEGRAM_BOT_TOKEN`
- `SPX_SYNC_SECRET`
- `SPX_SYNC_TELEGRAM_BOT_TOKEN`
- `SPX_SYNC_TELEGRAM_CHAT_ID`

Never paste values into this repository, chat, logs or commits. Rotate and
replace credentials in Cloudflare secrets without exposing them in build output.

## Boundary

Production DNS and Worker routing are complete. The registrar remains at
Squarespace and no registrar transfer action is part of this deployment.
Workers Paid has not been purchased. Monitor Cloudflare warnings; any Paid-plan
change requires an explicit owner request.
