# Cloudflare DNS Cutover

## Current Observed State

Public DNS is already authoritative on `giancarlo.ns.cloudflare.com` and
`zainab.ns.cloudflare.com`; Squarespace remains the RDAP registrar and DNSSEC is
not delegated. The domain currently reports `pending transfer`, so registrar and
transfer eligibility gates are blocked and require owner review before any
registrar claim.

Production DNS cutover is complete as of 2026-11-24. `https://inutdesign.com`
and `https://www.inutdesign.com` are attached to Worker `inutdesign-web` and
serving production. The `www` custom domain replaced the externally managed
CNAME that was returning 522. The Worker stays on Cloudflare Free by owner
decision. If Cloudflare emits a plan/quota/CPU warning, notify the owner; any
Paid-plan review or upgrade remains an owner-directed TODO.

## Preparation

1. Complete and owner-approve `artifacts/migration/dns/source-inventory.csv`.
2. Fill every unknown MX/SPF/DKIM/DMARC/TXT/CAA/DS owner and disposition.
3. Confirm Cloudflare zone, target Worker, custom domain, certificate and nameservers.
4. Confirm Worker preview and release gate. Keep Free-first operation and usage
   monitoring active; do not change plans without an owner request.
5. Confirm DNSSEC state:
   - if active, capture DS, disable at the current registrar/DNS provider and wait
     for the DS removal to propagate;
   - if disabled, retain evidence and proceed without registrar change;
   - re-enable DNSSEC only after Cloudflare authoritative state is healthy and
     the new DS value is published.

## Immediate Hard Cutover

No traffic split is allowed.

1. Record owner approval and start time.
2. Lower approved A/AAAA/CNAME TTLs only where safe.
3. Activate the approved Cloudflare authoritative nameservers.
4. Wait for the Cloudflare zone active state and positive resolution.
5. Attach the Worker custom domain after zone/Worker health.
6. Run `node scripts/migration/verify-dns-cutover.mjs`.
7. Verify apex, `www`, TLS, redirects, robots, canonical, sitemap, indexed paths,
   22 APIs, critical commerce/contact flows, and email continuity.
8. Record Cloudflare Worker version, custom domain and resolution snapshot.

The apex and `www` steps above are complete for the current production
cutover. Keep the resulting DNS and Worker layers unchanged while monitoring
Free-plan usage.

## Post-Cutover Evidence

Retain redacted resolution, certificate, Worker version, canonical, sitemap,
indexed URL and email evidence. Customer data, request bodies and upload content
must not appear. Operator-caused downtime is measured separately from external
DNS propagation.

## Layer-Specific Rollback

- **DNS-only**: restore prior approved records/nameservers; preserve healthy Worker.
- **Worker-only**: route to the previous Cloudflare version; preserve healthy DNS/TLS.
- **TLS-only**: preserve Worker/DNS; repair custom-domain/certificate mapping.
- **Email-only**: restore MX/SPF/DKIM/DMARC/TXT; preserve web Worker/DNS.
- **Preview indexing**: restore preview `noindex`; preserve production SEO output.

Never route rollback to Vercel. A combined rollback requires evidence that both
layers failed.
