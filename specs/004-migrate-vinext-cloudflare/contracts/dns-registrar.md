# Contract: DNS Cutover & Registrar Boundary

## Domain Boundary

- `inutdesign.com` registration stays at Squarespace during preview, DNS cutover and stabilization.
- Cloudflare authoritative DNS and Worker routing are separate from registrar transfer.
- Registrar transfer is not an automatic part of feature 004 and has no implementation-side effect.

## DNS Inventory Contract

Each source record must be captured with:

```text
name | type | target | ttl | priority | proxyMode | purpose | owner | disposition
```

Required coverage: apex, `www`, MX/email, SPF, DKIM, DMARC, TXT verification, third-party service records, Cloudflare/non-Cloudflare-supported records and known subdomains.

Disposition is owner-approved as `copy`, `update`, `retire` or `verify`; no record is copied merely because a scan returned it.

## Preview SEO Contract

- Temporary hostname serves the same application candidate.
- All pages return `X-Robots-Tag: noindex, nofollow`.
- Canonical URLs remain on `https://inutdesign.com`.
- Production sitemap excludes preview host.
- Robots file does not make preview origin eligible for production indexing.
- Production analytics/SEO actions use non-sensitive evidence only.

## DNS Preparation Gate

Before nameserver change:
- approved DNS inventory exists;
- Cloudflare zone exists and its records are validated;
- Worker and preview are healthy;
- Workers Paid, spend controls and production candidate are ready;
- current DNSSEC state is known;
- if DNSSEC is active at Squarespace, disable and wait for propagation before nameserver change;
- owner approval exists for the immediate hard cutover.

## Production DNS Cutover Contract

1. Lower TTL where useful and operationally safe.
2. Switch authoritative nameservers to Cloudflare.
3. Wait until the zone is active and DNS resolves correctly.
4. Attach Worker custom domain.
5. Verify:
   - apex and `www`;
   - TLS/certificate;
   - redirect parity;
   - security/cache/robots headers;
   - canonical, sitemap and indexed public paths;
   - 22 APIs and critical journeys;
   - MX/SPF/DKIM/DMARC/TXT and email continuity;
   - Cloudflare logs/CPU/request/spend signals.

No traffic split is allowed.

## DNS Rollback Boundary

Retain previous nameserver and DNS record evidence. If cutover fails:
- restore the approved Cloudflare-compatible DNS record state or previous nameserver state;
- route the zone to the last verified Cloudflare Worker version;
- re-verify TLS and domain routes;
- diagnose certificate/NSError/propagation separately.

Vercel is not a rollback target.

## Deferred Registrar Transfer

Registrar transfer may start only after a separate explicit owner trigger and after:
- Cloudflare DNS is authoritative and stable;
- Worker/custom domain remains healthy;
- domain is transfer-eligible (including 60-day rules);
- registrar lock is reviewed;
- DNSSEC state is safe;
- auth code validity is confirmed;
- registrant contact email access is confirmed;
- renewal/payment total is approved.

The transfer plan must keep the website online while Squarespace approval is pending and must not change Worker, DNS, canonical, sitemap, indexed paths or HTTPS.

Secrets/auth codes are never committed to this repository, plan files, logs or browser.
