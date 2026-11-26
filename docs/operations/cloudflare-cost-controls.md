# Cloudflare Cost and Usage Controls

## Account Capability Check

Current production state (2026-11-25): `inutdesign.com` runs on Cloudflare
Workers Free and the zone is on Free Plan. Free-first is the current operating
mode, not a temporary exception waiting for an automatic Paid upgrade.

1. Track Worker requests and CPU against current Free-plan limits using Cloudflare
   Worker Metrics; record source, UTC window, account/Worker/host scope, version,
   sampling, aggregation lag and coverage. Free daily request allowance resets at
   00:00 UTC. Confirm current limits before using them operationally.
2. Billing API access last returned 403. Verify Worker Metrics/GraphQL access
   separately; the billing API result does not establish metrics access.
3. Do not infer current spend from sampled logs, local traffic, or Vercel
   invocation counts. Use Cloudflare billing/dashboard evidence for billable usage.
4. **Future Paid TODO**: if Cloudflare issues a quota/plan warning, report it to
   the owner with the warning, UTC time, source and affected scope, and wait for
   explicit direction. Recheck pricing and spending controls then; previous `$5`, `$2`, and `$10` Paid assumptions are inactive.

## Alerts

- Request volume anomaly: owner reviews sustained unexpected request growth.
- CPU: review usage against the active Free limit and Cloudflare warnings.
- Memory: retain preview/production evidence below 128 MB isolate memory.
- Logs: alert on volume growth and cap retained detail; logs contain route,
  status, duration and aggregate counters only.
- Security: secret scan failures and unusual write abuse stop release escalation.
- Free-plan escalation: report the Cloudflare plan/CPU/request warning to the
  owner. Do not change the plan, Worker routing, or DNS without an owner request.

## Cost Comparison

For current Free-first operation, use the Cloudflare Worker Metrics dashboard or
GraphQL aggregate data; record daily requests, date range, source and coverage.
The billing API 403 is a billing-data limitation, not proof that Worker Metrics
are unavailable. Read feature evidence under `specs/005-optimize-cloudflare-costs/evidence/`:
per-Worker values are not account quota headroom; mark missing coverage, incomplete
UTC days and incomparable pre/post traffic as `PENDING`. Keep static asset requests,
CPU, errors and billing separate, and never infer totals from sampled logs.

`scripts/migration/measure-usage.mjs` still contains the historical Workers Paid
`$5` model. Do not run it for current Free usage evidence. Updating it into a
Paid estimator is a future TODO, only after the owner requests Paid planning.

Vercel function invocations are not a direct Cloudflare request/CPU proxy.
The script's model is historical and must be reviewed or replaced before future
Paid use. Its `$5`/`$2`/`$10` values do not describe current spend. Do not run it
for Paid planning until the owner requests that work and its assumptions have
been refreshed.
