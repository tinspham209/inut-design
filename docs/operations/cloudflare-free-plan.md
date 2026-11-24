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
Workers Paid is a pending operational TODO, not a reason to roll back the healthy
production Worker.

- Continue operating on the Free plan while Cloudflare reports healthy request,
  CPU and memory usage.
- Upgrade to Workers Paid when Cloudflare emits a plan/quota/CPU warning, usage
  approaches the Free limits, or production reliability is affected.
- Retain the existing Paid escalation evidence and `$2` warning / `$10` usage
  block policy for the upgrade so the account can be switched without changing
  the Worker or DNS architecture.

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
Workers Paid has not been purchased; monitor Cloudflare warnings and upgrade
only when the owner-decided trigger is reached.
