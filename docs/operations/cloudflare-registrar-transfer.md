# Future Registrar Transfer Checklist

**Feature 004 does not execute a transfer.**

Public RDAP currently reports Squarespace Domains II LLC and `pending transfer`.
The owner must first determine whether that status is intentional. This checklist
must not be used to infer approval or expose the auth code.

## Explicit Owner Trigger

Before any action, retain a separately signed owner request for the named domain.

## Eligibility Gate

- [ ] Confirm the 60-day rule and transfer eligibility.
- [ ] Confirm registrar/privacy lock state.
- [ ] Confirm DNSSEC state and safe DS handling.
- [ ] Confirm Cloudflare DNS is authoritative, stable and serving healthy Worker/TLS.
- [ ] Confirm registrant contact email access.
- [ ] Confirm auth-code validity without storing it here.
- [ ] Confirm renewal quote, fees, taxes and payment approval.
- [ ] Confirm rollback contacts and Squarespace approval window.

## Transfer Submission

Submit only after every eligibility item passes. Keep the auth code in the
owner-controlled transfer surface; never commit it, paste it into logs, or send
it to browser/code tooling.

## During Approval

Keep Cloudflare DNS, Worker, custom domain, canonical, sitemap and indexed paths
unchanged. The site and HTTPS must remain available while Squarespace approval is
pending. Do not re-run DNS/Worker rollback as a routine registrar step.

## Failure and Approval Delay

Handle registrar lock, DNSSEC, contact email, auth code, rejection and approval
delay independently. Preserve healthy Cloudflare DNS/Worker state and the last
verified version throughout.
