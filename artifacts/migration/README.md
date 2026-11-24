# Feature 004 Migration Artifacts

Artifacts in this directory are evidence, not runtime configuration.

## Reviewed Sources

Commit deterministic, non-sensitive source evidence when it can be independently
regenerated:

- `baseline/`: source/route/API/slug/dependency/env-name/compatibility manifests;
- reviewed fixture metadata and sanitized browser proof;
- `templates/`: approval shapes without credentials or customer data;
- reports that identify an immutable source commit, lockfile hash, and deployment
  version.

Never retain real environment values, request bodies, customer contact data,
upload bytes, share/design identifiers, analytics secret fields, auth codes, or
credential-bearing logs.

## Generated Runtime Evidence

`runtime/`, `preview/`, `operations/`, `dns/`, and `release/` can contain
environment-specific proof. Generate them with `scripts/migration/` and review
redaction before retention. Source maps are scanned but must not be committed.
The repository ignores generated runtime output while preserving reviewed
fixtures, schemas, and baseline contracts.

## Immutability and Redaction

- Tie every comparison to the source commit and `pnpm-lock.yaml` SHA-256.
- Tie deploy evidence to an immutable Cloudflare version.
- Store variable names, scopes, and presence/validation outcomes—not values.
- Keep only status, route identity, timings, aggregate counts, and redacted
  errors in retained logs.
- A failed gate remains `fail` or `blocked`. Do not convert failure into a
  pass-shaped fallback or delete evidence to clear a gate.
- Owner-triggered deploy, DNS, registrar, secret rotation, and spend-control
  actions require their own operator evidence; scripts never imply approval.
