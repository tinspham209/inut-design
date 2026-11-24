# Phase 1 Data Model: Cloudflare Migration

All entities below are planning/operational records; the migration does not introduce a new production database. Sanity remains the source of truth for application content and writes.

## Core Entities

### Production Baseline

| Field | Type | Validation / Meaning |
|---|---|---|
| `id` | string | Immutable identifier tied to commit + captured timestamp |
| `commitSha` | string | Source revision used for parity |
| `routeInventory` | RouteRecord[] | Every public route from approved inventory |
| `apiInventory` | ApiContractRecord[] | Exactly 22 API routes at baseline |
| `timings` | TimingRecord[] | Representative p50/p95/page timing evidence |
| `analyticsInventory` | AnalyticsEventRecord[] | GA4/GTM + Umami source and exact-once expectation |
| `seoInventory` | SeoRecord[] | Canonical, sitemap, robots, redirect and status |
| `capturedAt` | timestamp | Evidence capture time |

**Rule**: a baseline without source revision, route/API inventory and success evidence is invalid.

### Route Record

| Field | Type | Validation |
|---|---|---|
| `path` | string | Starts `/`, canonical production-relative path |
| `renderMode` | `static | ssg | isr | ssr` | Baseline is captured exactly; target is `static`/`ssg` |
| `getStaticPathsMode` | `none | blocking | false` | Dynamic content target must be `false` |
| `status` | integer | Expected 2xx/3xx/4xx where intentional |
| `headers` | Record<string,string> | Security/cache/robots expectations |
| `canonicalUrl` | URL or null | Production host for indexable pages |
| `requiresData` | boolean | Must identify public Sanity/build inputs |

### Api Contract Record

Fields: `path`, `methods`, `authMode`, `bodyLimit`, `inputSchema`, `successShape`, `errorShape`, `rateLimit`, `idempotency`, `sideEffects`, `allowedTestMode`, `expectedCache`.

**Validation**:
- all 22 routes appear once;
- write routes require safe fixture/mock mode;
- `sideEffects` explicitly states whether Sanity, notification or external system is touched;
- contract checks compare status, headers and semantic body, not only HTTP success.

### Deployment Candidate

| Field | Type | Validation |
|---|---|---|
| `version` | string | Cloudflare version/deployment identifier |
| `commitSha` | string | Exact source commit |
| `buildType` | `local-next | preview-vinext | production-vinext` | Recorded per build |
| `runtimeVersion` | object | Next, React, Vinext, Vite, Node |
| `assetStrategy` | `static-none-cache` | Baseline strategy |
| `gateResults` | VerificationResult[] | No unresolved blocker for release |
| `state` | CandidateState | See transitions |

### Verification Result

Fields: `gateId`, `scope`, `status`, `evidenceRef`, `measuredAt`, `measurement`, `expected`, `owner`.

Allowed status: `not_run | pass | fail | blocked | waived`. `waived` requires explicit owner acceptance and a compatibility/security rationale; security/data failures cannot be success-shaped.

### Release Gate

Groups: `compatibility`, `route`, `api`, `commerce`, `upload`, `analytics`, `seo`, `accessibility`, `worker-limits`, `cost`, `dns`, `operations`.

**Rule**: production cutover requires every mandatory group to be `pass`; DNS-specific gates can run only after the Cloudflare candidate exists.

### Rollback Point

| Field | Type | Meaning |
|---|---|---|
| `cloudflareVersion` | string | Last verified production-safe Worker version |
| `verifiedAt` | timestamp | Evidence time |
| `coverage` | string[] | Routes/APIs/flows covered |
| `restoreTarget` | `cloudflare-version | dns-state` | Vercel is never a target |
| `maxRestoreMinutes` | integer | Requirement: 15 after approval |

### Compatibility Gap

Fields: `source`, `category`, `affectedFiles`, `severity`, `resolution`, `evidence`, `ownerDecision`.

Known values are the two hard issues and three partial areas reported by `vinext check`. `ownerDecision` is required only for a deliberately accepted behavioral gap.

## Static Publication Entities

### Public Search Index

| Field | Type | Validation |
|---|---|---|
| `version` | string | Build identifier |
| `generatedAt` | timestamp | Build evidence |
| `sourceCommit` | string | Sanitized source/build state |
| `documents` | SearchDocument[] | Approved public records only |
| `schemaVersion` | string | Reject incompatible client/index pairs |
| `fieldAllowList` | string[] | No draft/private/contact/order/upload fields |

### Search Document

Fields: `id`, `kind`, `title`, `url`, `summary`, `keywords`, `productType`, `thumbnailUrl`, `updatedAt`.

**Rules**:
- URL uses a production-public path.
- No full Sanity object, asset source internals, customer/order fields or private metadata.
- Browser filter and result shape retain existing published result semantics.

## Upload Entities

### Keychain Upload Request

Fields: `data` (Base64), `contentType`, `filename`, `originalByteLength` optional evidence, `clientTransformVersion`.

**Validation**:
- MIME is PNG, JPEG or WebP.
- Decoded bytes ≤10 MB and Base64 request stays below the configured 14 MB body cap.
- signature matches declared MIME.
- width/height and pixel count fit browser/Worker limits.
- no executable/polyglot content accepted.

### Validated Upload

Fields: `mime`, `byteLength`, `signature`, `width`, `height`, `pixelCount`, `safeFilename`, `sanityAssetRef`, `publicUrl`, `resultStatus`.

**Invariant**: native `sharp` is absent from the Worker dependency graph. The persistence write must happen only after all validation passes.

## Domain Entities

### DNS Inventory Record

| Field | Type | Validation |
|---|---|---|
| `name` | DNS name | Full apex/subdomain |
| `type` | DNS record type | A/AAAA/CNAME/MX/TXT/SRV/CAA/NS/etc. |
| `target` | string | Exact destination |
| `ttl` | integer | Existing/approved TTL |
| `priority` | integer or null | Required for priority-bearing records |
| `proxyMode` | `proxied | dns-only | n/a` | Explicit, never inferred |
| `owner` | string | Account/team responsible |
| `purpose` | string | Site/email/verification/third-party |
| `disposition` | `copy | update | retire | verify` | Owner-approved |

### Domain Phase

Fields: `currentState`, `zoneId`, `authoritativeNameservers`, `dnssecState`, `workerHealth`, `certificateState`, `approvedDnsInventoryRef`, `ownerTriggerRef`.

Allowed states:

`preview_only → dns_prepared → authoritative_dns_cutover → stabilizing → stable_on_cloudflare → registrar_transfer_deferred`

After a separate owner trigger, `registrar_transfer_deferred` may enter:

`transfer_eligibility_review → transfer_submitted → transfer_approved → registrar_on_cloudflare`

### Registrar Transfer Request

Fields: `ownerTrigger`, `eligibleForTransfer`, `lockState`, `dnssecState`, `authCode`, `registrantEmail`, `renewalQuote`, `paymentApproval`, `submittedAt`, `result`.

`authCode` is a sensitive one-time input and must not be committed, put in plans/logs, or exposed in browser. The entity exists only to document a future gate; no request is created in feature 004.

## Cost & Environment Entities

### Environment Variable Record

Fields: `name`, `scope` (`browser-build | worker-secret | scheduler | local-test`), `requiredBy`, `visibility`, `buildOrRuntime`, `owner`, `rotationNotes`, `valuePresent`.

No record may contain a secret value. Existing public-secret exposure is classified and remediated before production instead of copied into Cloudflare config.

### Cost Policy

Fields: `plan`, `includedRequestCount`, `includedCpuMs`, `usageWarningUsd`, `usageBlockUsd`, `logVolumeThreshold`, `reviewOwner`, `lastReviewedAt`.

Baseline: Workers Paid, warning at $2 usage over base, usage block at $10, excluding $5 subscription.

## State Transitions

### Deployment Candidate

```text
building
  → local_next_pass
  → local_vinext_pass
  → contract_pass
  → preview_pass
  → release_approved
  → production_active
  → superseded
```

Any mandatory verification failure moves the candidate to `blocked`; it may return to `building` only after source/evidence changes.

### Domain

```text
preview_only
  → dns_prepared
  → authoritative_dns_cutover
  → stabilizing
  → stable_on_cloudflare
```

Rollback transitions use stored DNS state and a verified Cloudflare version. They never return to Vercel and do not alter registrar state.

### Search Index

```text
generated → schema_validated → privacy_validated → result_parity_passed → published
```

Failure at schema/privacy/parity blocks the static `/search` deployment.
