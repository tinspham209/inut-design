# Migration Evidence

Feature 004 tooling writes reproducible, redacted evidence below
`artifacts/migration/`. Checked-in fixtures and reviewed manifests describe safe
inputs and approved contracts; generated runtime, browser, preview, and operation
evidence may be retained separately when it contains environment-specific data.

## Safety Rules

- Every order, contact, quote, upload, notification, design, SPX, and Sanity
  validation must use an explicit mock or no-op adapter. Do not create a real
  order, notification, upload, or production write.
- Never print, capture, or commit environment values, credentials, request
  bodies, customer contact data, uploaded bytes, share links, analytics secrets,
  or registrar authorization codes. Record environment variable names and
  presence only.
- A command that cannot prove its safe-test boundary must stop before execution.
  A successful-looking HTTP response is not evidence when a side effect is
  unknown.
- Every immutable release record must identify the source commit, lockfile
  hash, dependency/runtime versions, and the generated artifact or deployment
  identifier.

## Evidence Layout

- `baseline/`: pre-migration route, API, slug, dependency, environment-name,
  compatibility, browser, and SEO expectations.
- `runtime/`: local Next and built Vinext verification results.
- `gates/`: per-story release-gate reports.
- `preview/`: approved preview-only verification.
- `operations/`: redacted environment, scheduler, spend, rollback, and
  stabilization evidence.
- `dns/`: owner-approved inventories and cutover snapshots.
- `release/`: final manifest and release reports.

Generated evidence must be deterministic where possible. JSON arrays that
represent routes, slugs, APIs, dependencies, or manifests are sorted and
deduplicated. Redact environment-specific or sensitive values before retention.

## Owner Gates

Scripts may prepare dry runs, fixtures, inventories, and runbooks. Cloudflare
subscription changes, real deploys, production writes, DNS or nameserver
changes, registrar actions, credential rotation verification, and payments
require a separate explicit owner approval. A missing owner gate is a blocked
state, never a pass or waiver.
