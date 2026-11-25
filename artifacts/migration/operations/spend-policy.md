# Workers Spend Policy

- Current production state (2026-11-25): Workers Free is active and the
  `inutdesign.com` zone is on Free Plan. The owner reports no billable usage to
  date. This is an observed current state, not a forecast for future traffic.
- Workers Free limits: 100,000 requests/day, 10 ms CPU, 128 MB memory, 50
  subrequests/request, 20,000 static assets/Worker version. Track request and
  CPU headroom against the Free limits; do not assume a Paid subscription is
  required for production.
- Paid-plan assumptions are not active: the previous $5/month base, $2 warning,
  $10 usage block, and $5–$6/month modeled total applied to a proposed Workers
  Paid setup and must not be treated as the current plan or current spend.
- Optional Images, KV, R2, D1, Durable Objects and Queues remain disabled unless a
  separate evidence-backed compatibility/performance gate activates them.

Billing API usage data is not currently accessible to the project integration;
the latest request returned 403. Until access is available, record billing
figures from the Cloudflare dashboard or owner confirmation and label them with
their source and observation date. Revisit plan thresholds if the account moves
to Workers Paid or enables a metered product.

## Future Workers Paid TODO

- Current operating mode is Free-first; no Workers Paid monthly estimate,
  dollar warning/block target, or plan change is active.
- If Cloudflare issues a quota/plan warning, record the signal and wait for the
  owner to request follow-up. Do not upgrade or change spend controls
  automatically.
- Only after an explicit owner request, recheck then-current pricing, included
  usage, spending controls, log pricing and optional service costs, then update
  the policy and estimator.
