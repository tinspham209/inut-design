# Cloudflare Cost and Usage Controls

## Account Capability Check

Current production state (2026-11-24): `inutdesign.com` runs on Cloudflare
Workers Free under an owner-approved operational exception.

1. **TODO pending**: upgrade to Workers Paid when Cloudflare reports a quota,
   CPU or plan warning, or when production usage approaches Free-plan limits.
2. Confirm billing owner and account-level permission.
3. Verify whether Cloudflare supports the proposed warning at $2 usage over base
   and hard block at $10 usage over base. Do not claim enforcement from this
   document; retain screenshots/API evidence.
4. Confirm the $5 subscription is excluded from the warning/block usage amounts.
5. Confirm included requests/CPU/log retention and any taxes or optional services.

## Alerts

- Request volume anomaly: owner reviews sustained unexpected request growth.
- CPU: alert on repeated route batches or spikes approaching the Paid limit.
- Memory: retain preview/production evidence below 128 MB isolate memory.
- Logs: alert on volume growth and cap retained detail; logs contain route,
  status, duration and aggregate counters only.
- Security: secret scan failures and unusual write abuse stop release escalation.
- Free-plan escalation: review the first Cloudflare plan/CPU/request warning
  immediately and prepare the Paid-plan upgrade without changing DNS or Worker
  routing.

## Cost Comparison

Run:

```bash
node scripts/migration/measure-usage.mjs \
  --requests=<observed-worker-requests> \
  --cpu-ms=<observed-cpu-ms> \
  --log-bytes=<observed-log-bytes> \
  --days=<measurement-window>
```

Vercel function invocations are not a direct Cloudflare request/CPU proxy.
Escalate when observed usage exceeds the approved model or an optional service
is required for compatibility.
