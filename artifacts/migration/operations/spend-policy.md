# Workers Spend Policy

- Current setup: Workers Free for preview/account preparation only.
- Production plan: Workers Paid, required before production.
- Free preview limits: 100,000 requests/day, 10 ms CPU, 128 MB memory, 50
  subrequests/request, 20,000 static assets/Worker version.
- Included subscription baseline: $5/month, separate from modeled usage.
- Warning target: $2 usage over the included base.
- Usage block target: $10 usage over base.
- Approved modeled total range: $5–$6/month before optional services/tax.
- Optional Images, KV, R2, D1, Durable Objects and Queues remain disabled unless a
  separate evidence-backed compatibility/performance gate activates them.

The owner must verify that the Cloudflare account's actual controls can enforce
the requested warning/block semantics. This document is a policy target, not
proof that account controls are configured.
