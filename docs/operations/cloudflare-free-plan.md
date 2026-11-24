# Cloudflare Workers Free Plan Setup

## Current Account State

- Account: `inutdesign`
- Zone plan: Cloudflare Free ($0)
- Cloudflare CLI authentication: completed
- Worker account has no deployed scripts yet.
- `cloudflare.config.ts` contains the account ID and no paid-only service.
- Vinext Cloudflare deploy dry-run passes.

## Current Limits Relevant to This Project

- 100,000 requests/day.
- 10 ms CPU/request.
- 128 MB memory.
- 50 subrequests/request.
- 20,000 static asset files per Worker version.
- 25 MiB per static asset and 64 MiB Worker size limit.

This is sufficient for a limited preview and setup validation. It is not the
production gate because the feature requires higher CPU/runtime headroom and
the release policy is based on Workers Paid.

## Secrets Required Before Preview

Present locally by name:

- `SANITY_TOKEN`
- `CREATIVA_TELEGRAM_BOT_TOKEN`
- `SPX_SYNC_SECRET`
- `SPX_SYNC_TELEGRAM_BOT_TOKEN`
- `SPX_SYNC_TELEGRAM_CHAT_ID`

Still missing under the approved server-only names:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

After the rotated token is placed under `TELEGRAM_BOT_TOKEN` and the destination
under `TELEGRAM_CHAT_ID` in the local secret source, the preview deploy can load
those secrets. Never paste values into this repository, chat, logs or commits.

## Boundary

No Worker has been deployed, no paid subscription has been created, and no DNS
or registrar action has been performed. Preview deployment remains the separate
owner-approved step.
