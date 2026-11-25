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

### Dependency Decision

| Field | Type | Validation / Meaning |
|---|---|---|
| `package` | string | Direct package name; one record per migration-relevant direct dependency |
| `currentVersion` | string | Manifest/lockfile baseline |
| `targetVersion` | string | Version selected with compatible peer graph |
| `scope` | `build \| browser \| worker \| dev-test` | A package may require multiple records if scope differs |
| `consumers` | string[] | Exact source files/call sites |
| `peerConstraints` | Record<string,string> | React/Next/Node/companion-package constraints |
| `migrationAction` | `keep \| upgrade \| replace \| remove \| dev-only` | Explicit action |
| `evidence` | VerificationResult[] | Install, build, browser/Worker and bundle-graph proof |
| `ownerDecision` | string or null | Required for unsupported override/waiver |

**Rules**:
- no package is upgraded with an unexplained peer override;
- a removed Worker dependency must be absent from the Worker module graph, not only absent from imports in one route;
- companion majors (Fiber/Drei, Next/tooling, React/types) are one atomic decision record with shared gate evidence.

### Migration Manifest

Fields: `sourceCommit`, `lockfileHash`, `publicRoutes`, `apiRoutes`, `dynamicSlugs`, `redirects`, `sitemapUrls`, `searchIndexHash`, `envNames`, `workerModules`, `assetSummary`, `previewVersion`, `productionVersion`, `generatedAt`.

**Validation**:
- arrays are sorted and deduplicated;
- values contain no secret content;
- `previewVersion` and `productionVersion` identify immutable Cloudflare deployments;
- any delta from the approved baseline links to a reviewed change record.

### Package Upgrade Unit

Fields: `id`, `members`, `reason`, `sequence`, `gate`, `rollbackAction`.

Known units:
- `pnpm-toolchain`;
- `next-react-core`;
- `mui-emotion-ssr`;
- `carousel`;
- `react-three-stack`;
- `next-image-codemod`;
- `next-link-codemod`;
- `vinext-vite-adapter`;
- `upload-worker-boundary`;
- `static-public-rendering`.

**Rule**: members of one unit land together, but the unit is independently revertable and has focused evidence. A later dependent unit must not merge while a predecessor gate is failing.

### Secret Migration Record

| Field | Type | Validation / Meaning |
|---|---|---|
| `legacyName` | string | Existing name only; never value |
| `replacementName` | string or null | Server-only or null when removed |
| `scope` | `public \| build \| worker-secret \| scheduler` | Explicit runtime boundary |
| `callerClass` | `browser \| worker \| scheduler \| build` | Determines effective auth/control |
| `rotationRequired` | boolean | `true` for any credential already exposed publicly |
| `consumers` | string[] | Code/config call sites |
| `removalEvidence` | string[] | Bundle/source-map/config scan references |

Known migration:
- `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN` → server-only `TELEGRAM_BOT_TOKEN`, rotate;
- `NEXT_PUBLIC_TELEGRAM_CHAT_ID` → server-only `TELEGRAM_CHAT_ID`;
- `NEXT_PUBLIC_X_API_KEY` → remove from browser paths; retain only a separately named server-side/internal secret if a trusted caller needs one;
- `SPX_SYNC_SECRET` remains scheduler-only;
- public Sanity project/dataset, analytics IDs, site URL and approved feature flags remain public.

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

Fields: `schemaVersion`, `id`, `kind`, `title`, `url`, `summary`, `keywords`, `productType`, `facetSlugs`, `sourceHash`, `updatedAt`.

**Rules**:
- URL uses a production-public path.
- No full Sanity object, asset source internals, customer/order fields or private metadata.
- Browser filter and result shape retain existing published result semantics.
- `id` and `url` are unique; a duplicate is a build failure.
- `sourceHash` permits deterministic rebuild checks without exposing source tokens.

## Upload Entities

### Keychain Upload Request

Fields: `data` (Base64), `contentType`, `filename`, `originalByteLength` optional evidence, `clientTransformVersion`.

**Validation**:
- MIME is PNG, JPEG or WebP.
- Decoded bytes ≤10 MB and Base64 request stays below the configured 14 MB body cap.
- signature matches declared MIME.
- Base64 is canonical/strictly decodable and does not contain ignored trailing bytes.
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

Additional rule: `scope=browser-build` is reserved for non-secret public config. A token, chat credential, internal API key or scheduler secret cannot be classified as browser-build.

### Cost Policy

Fields: `currentPlan`, `includedRequestCount`, `includedCpuMs`, `observedRequests`,
`observedCpu`, `observationWindow`, `evidenceSource`, `coverage`, `ownerReviewDate`.

Current policy: Workers Free first. Compare observed usage to current Free
allowances and report Cloudflare quota/plan warnings to the owner. Paid-plan
price, warning and spending-limit fields are deferred TODOs; add them only after
the owner requests Paid planning. Historical `$5`/`$2`/`$10` assumptions are not
active cost policy.

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
