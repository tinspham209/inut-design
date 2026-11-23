# Data Model: Optimize Vercel Usage

This feature introduces no database schema, persisted customer record, or public
API payload. The model below defines build-time content snapshots and operational
evidence used to implement and validate the optimization.

## Homepage Content Snapshot

| Field | Type | Description | Validation |
|---|---|---|---|
| `banner` | `Banner` | First matching homepage banner | May be empty; consumers preserve existing fallback behavior |
| `products` | `Products` | Up to 8 special laptop-skin products | Same projection and ordering as current homepage |
| `macnuts` | `Products` | Up to 8 special keyboard-skin products | Same projection and ordering as current homepage |
| `lighters` | `LighterProduct[]` | Up to 8 special lighter products | Same projection and ordering as current homepage |

**Relationships**:

- Created by one `getHomepageContent` Sanity read.
- Consumed only by `pages/index.tsx` during static generation/regeneration.
- Public reference shapes (`_ref`, `_type`, image fields, and consumer models)
  remain unchanged.

**Lifecycle**:

1. Build/revalidation begins.
2. One query returns the complete CMS subset.
3. The local blog summary is read from repository Markdown.
4. The snapshot is serialized into homepage props.
5. The snapshot remains valid until the 600-second ISR window elapses.

## Repository-managed Contact Banner

| Field | Type | Description | Validation |
|---|---|---|---|
| `sanityDocumentId` | string | Original published banner document ID | Exactly `1006eb36-f1f9-42d6-9e86-23a8756cbd61` at migration |
| `sanityAssetRef` | string | Original asset reference | Exactly `image-798e07a689aeb85c93aa8985772606624b15967e-1200x630-jpg` at migration |
| `publicPath` | string | Versioned local asset route | `/branding/contacts/contact-page-banner.jpg` |
| `filePath` | string | Repository path | `public/branding/contacts/contact-page-banner.jpg` |
| `format` | string | Original published format | `jpg` |
| `dimensions` | string | Intrinsic dimensions | `1200×630` |
| `rendition` | string | Local migration transformation | `w=1200&q=80&fit=max&fm=jpg` |
| `deploymentId` | string | Deployment that first serves the local asset | Required in post-implementation evidence |

**Lifecycle**:

1. Read the authoritative published `contact-page` banner.
2. Download the exact current 1200px/quality-80 rendered rendition as JPG.
3. Commit it under `public/` with the stable local path.
4. Switch `/contact` hero and metadata to the local route.
5. Remove runtime Sanity access.
6. Future changes require a repository update and successful deployment.

## Quote-form Prefetch Target

| Field | Type | Description | Validation |
|---|---|---|---|
| `path` | string | Navigation destination | `/contact/form` |
| `prefetch` | boolean | Automatic background-loading behavior | `false` |
| `clickNavigation` | boolean | Normal navigation on user action | `true` |
| `queryPreservation` | boolean | Existing `from` parameters retained | `true` |

**State transition**: rendered link → no automatic prefetch → clicked by visitor →
normal navigation; existing query string and analytics handler preserved.

## CPU Baseline/Evidence Record

| Field | Type | Description | Validation |
|---|---|---|---|
| `environment` | enum | `production`, `preview`, `development` | Only `production` accepted for completion comparison |
| `windowStart` | ISO 8601 | Evidence start | Required |
| `windowEnd` | ISO 8601 | Evidence end | Must be after `windowStart` |
| `route` | string | Public or Next data route | Exact canonical or template path |
| `invocations` | number | Function invocation count | Non-negative integer |
| `activeCpuMs` | number | Aggregate or per-request CPU | Non-negative finite value |
| `externalApiCalls` | number | Content-provider call count | Non-negative integer |
| `errorRate` | number | 5xx/error fraction | 0–1 |
| `cacheStatus` | enum | CDN/static/ISR classification | Explicit or `unknown` when unavailable |
| `notes` | string | Comparison caveats | Must not include sensitive values |

**Relationships**:

- Before and after rows are compared only when route, environment, and workload
  normalization are equivalent.
- Completion evidence may aggregate by route and must retain the comparison note.

## Search Corpus Snapshot

| Field | Type | Description | Validation |
|---|---|---|---|
| `documents` | `SearchDocument[]` | Static, route, blog, and dynamic searchable records | Existing result shape and ranking preserved |
| `facets` | `SearchFacetOption[]` | Deduplicated product/Macnut facets | No duplicate normalized slug |
| `legacyTypeSlugs` | string[] | Existing filter compatibility values | Stable compatibility set |
| `sourceOperationCount` | number | External content operations used to refresh | Exactly 1 for each completed corpus refresh |
| `freshnessWindow` | duration | Normal cache lifetime | 24 hours |
| `urgentPublication` | boolean | Owner-triggered refresh path | Must make approved change visible within 15 minutes |

**Lifecycle**: build/refresh → one grouped dynamic read + local sources → corpus
assembly → 24-hour reuse → owner-triggered publication for urgent catalog
changes. Corpus failure is explicit and does not return an invented successful
result.

## Creativa Publication Snapshot

| Field | Type | Description | Validation |
|---|---|---|---|
| `catalog` | `CreativaCatalogPage` | Public catalog data | Existing consumer shape |
| `productOptions` | object | Product selection options | Reference integrity preserved |
| `freshnessWindow` | duration | Normal visibility delay | ≤24 hours |
| `urgentPublication` | boolean | Owner-triggered refresh | Approved urgent update visible ≤15 minutes |
| `newSlugBehavior` | enum | On-demand generation | `blocking` |

## Product Route Snapshot

| Field | Type | Description | Validation |
|---|---|---|---|
| `items` | product array | Current bounded catalog page | Existing 24-item default or route-specific limit |
| `total` | number | Matching result count | Non-negative integer |
| `types` | type array | Available facets | Existing consumer shape |
| `banner` | banner array | Route banner | Same fallback behavior |
| `detail` | object | Primary product with related/static content | Existing route shape |
| `freshnessWindow` | duration | ISR lifetime | 24 hours |
| `newSlugBehavior` | enum | Non-prebuilt dynamic product | `blocking` |

Product list/detail grouped reads must preserve `_ref`/`_type`, image references,
sorting, drafts exclusion, and related-product behavior.

## API Workload Inventory Entry

| Field | Type | Description | Validation |
|---|---|---|---|
| `route` | string | Canonical `/api/*` path | Must match one of 22 known endpoints |
| `purpose` | enum | read, write, upload, notification, validation, sync | Required |
| `allowedMethods` | string[] | Accepted request methods | Match current handler |
| `callerClass` | string | Browser, server, cron, admin/tooling | Required |
| `cacheEligible` | boolean | Safe to cache or coalesce | `true` only with evidence and no side effect |
| `sensitiveData` | boolean/string | Presence/classification only, not values | Required |
| `retryPolicy` | string | Existing behavior | Must not create duplicate writes |
| `baseline` | evidence ref | Invocation/CPU evidence or unknown | Unknown allowed with explicit disposition |
| `disposition` | enum | optimize, guardrail, unchanged, investigate | Must cover every endpoint |
