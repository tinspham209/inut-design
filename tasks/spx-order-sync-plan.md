# SPX Order Status Sync — Investigation and Implementation Plan

Status: **Implementation in progress (uncommitted)**

Scope: publish every `ordersLighter` draft first, then synchronize published
`ordersLighter` documents with `status == "in_transit"` and an SPX value in
`trackingNumber`.

> **This document is the source of truth for implementation.** It records the
> investigated SPX integration, approved business rules, safety constraints, and
> the ordered implementation tasks. The current uncommitted implementation adds
> the runtime route, schema metadata, deterministic regression coverage, and the
> draft-publishing prerequisite described below.
>
> **Review precedence:** the Reverse Validation Summary, reports, and
> **Revised Implementation Tasks** added near the end of this document supersede
> the original `Implementation Tasks` and any conflicting implementation detail in
> earlier proposal sections. Earlier sections remain for investigation and decision
> traceability.

> **Confirmed terminal-return behavior (current revision):** in addition to the
> `Delivered` → `completed` mapping, a **fresh, canonical** SPX order-info
> response whose `group` is exactly `Return` and `subgroup` is exactly
> `Returned` (case/spacing/hyphen tolerant) now transitions an eligible
> `in_transit` order directly to `cancelled`. Non-terminal `Return`/`Returning`
> and any signal derived only from carrier description text never cancel an
> order. See the updated **Business Goal**, **Approved Decisions**, **Status
> Mapping**, and **Acceptance Criteria** (AC36–AC40) below, and Revised Tasks 3
> and 7 for the corresponding implementation and regression coverage.

## Business Goal

Reduce manual shipment checks by synchronizing SPX tracking information into
Sanity once per day at 17:00 GMT+7:

1. Publish every Sanity draft where `_type == "ordersLighter"`, independent of
   status or tracking number.
2. Find published lighter orders currently marked `in_transit`.
3. Read the SPX tracking code from either a full `spx.vn` URL or a raw `SPXVN...`
   value in `trackingNumber`.
4. Fetch the latest SPX shipment status.
5. Write the latest automated snapshot to the dedicated `spxSyncNote` field.
6. Change the existing order `status` to `completed` only when SPX reports
   `Delivered` / `Đã giao hàng`.
7. Change the existing order `status` to `cancelled` only when the fresh,
   canonical SPX order-info `group` is exactly `Return` and `subgroup` is
   exactly `Returned`. This reconciles an order to `cancelled` even when the
   provider fingerprint and the previously stored `spxSyncNote` are unchanged;
   description text alone never triggers this transition.
8. Leave `Return`/`Returning` and other non-terminal shipment states as
   `in_transit` while showing a meaningful latest status to sales in
   `spxSyncNote`.
9. Send one Telegram alert to the configured operations channel when the SPX API
   phase or Sanity query/update phase returns an error so action can be taken
   without waiting for cron-job.org history to be checked manually.

## Approved Decisions

| Decision | Approved behavior |
| --- | --- |
| Implementation stage | Uncommitted implementation and validation |
| Draft prerequisite | Publish every `ordersLighter` draft before SPX discovery |
| Delivery terminal mapping | Fresh, canonical SPX `Delivered`/`Delivered` changes `status` to `completed` |
| Return terminal mapping | Only fresh, canonical SPX `Return`/`Returned` changes `status` to `cancelled` |
| Return/failure mapping | Non-terminal `Return`/`Returning` and other failure states keep `status == "in_transit"` and update `spxSyncNote` |
| Terminal-outcome exclusivity | `shouldComplete`/`shouldCancel` are computed so they can never both be true; a Delivered/Return conflict fails safe and completes/cancels nothing |
| Reconciliation | A stored order already reflecting Return/Returned metadata is still re-evaluated and moved to `cancelled` on the next run, even if the note/fingerprint did not change |
| Audit-note policy | Keep one deterministic marker-free snapshot in `spxSyncNote` |
| Existing admin notes | Leave unchanged unless one valid legacy marker block is migrated |
| Tracking input | Accept both full `spx.vn` URLs and raw `SPXVN...` codes |
| SPX integration risk | Accept the unofficial public endpoint for version 1 |
| Expected active volume | Fewer than 25 in-transit orders |
| Scheduler | cron-job.org once daily at 17:00 GMT+7 |
| Failure notification | One aggregated Telegram alert per failed cron run |

## Repository Findings

The actual Sanity document type and field names differ from the business wording:

| Business term | Repository field |
| --- | --- |
| Order document | `_type == "ordersLighter"` |
| Order status | `status` |
| Tracking number/link | `trackingNumber` |
| Admin notes | `adminNotes` |
| Automated SPX note | `spxSyncNote` |

Relevant existing code:

- `sanity/schemas/ordersLighter.js`
  - `status` values: `pending`, `confirmed`, `processing`, `in_transit`,
    `completed`, `cancelled`.
  - `trackingNumber` and `adminNotes` are plain strings.
  - The implementation adds optional automation-owned `spxSyncNote` and SPX
    metadata fields.
- `api-client/sanity-server.ts`
  - Uses the authenticated server client with `useCdn: false`.
  - Already contains an unused `updateOrderStatus(orderId, status)` patch helper.
  - The sync must add a targeted server-side query and an atomic tracking patch.
- `api-client/sanity-browser.ts`
  - Must not be used by the cron because its public/CDN read path can be stale.
- `models/cart.ts`
  - Contains the `OrderLighter` TypeScript contract and must remain aligned with
    additive Sanity fields.
- `pages/api/orders/lighters.ts`
  - Existing order creation route; there is no existing order-sync route.
- `utils/rateLimit.ts`
  - In-memory and instance-local; it is not a reliable distributed cron lock.
- Existing internal API keys use `NEXT_PUBLIC_X_API_KEY`.
  - This client-visible value must not protect a privileged order-mutation route.
- `utils/telegram/index.ts`
  - Provides reusable `TelegramClient` and `sendWithRetry()` utilities.
  - Messages use Telegram Bot API `sendMessage`, HTML parse mode, and exponential
    retry.
- `utils/telegram/validateTelegramEnv.ts`
  - Contains reusable token/chat validation logic but is currently coupled to
    `utils/env-const.ts`.
- `pages/api/telegram/*`
  - Existing browser-triggered routes use `NEXT_PUBLIC_X_API_KEY`, in-memory rate
    limiting, and `NEXT_PUBLIC_TELEGRAM_*` values.
  - The cron should reuse the utility layer, not call these routes.

## Sanity Usage and Memory Investigation

Current Sanity limits verified from official documentation on 2026-08-28:

| Free-plan resource | Current limit | Expected SPX sync impact |
| --- | --- | --- |
| API requests | 250,000/month | Two discovery queries plus draft publishes and meaningful SPX mutations |
| API CDN requests | 1,000,000/month | None; the cron correctly uses `useCdn: false` |
| Bandwidth | 100 GB/month | A small projected query and mutation payloads |
| Documents | 10,000 | No new order documents; existing documents are patched |
| Unique attributes | 2,000/dataset | Approximately five optional SPX fields added once |
| Revision history | 3 days | Sanity truncates older Free-plan history automatically |

With no drafts, the approved maximum of 25 eligible SPX orders uses two discovery
queries plus up to 25 changed-order patches per day:

```text
(2 queries + 25 mutations) * 31 days = 837 API requests/month
```

That is approximately 0.33% of the currently documented 250,000 monthly API
request allowance. Each discovered draft adds one revision-guarded publish
transaction. Normal SPX mutation usage will be lower because unchanged orders are
not mutated.

The cron does not create a Sanity-side memory leak. Sanity client queries and
mutations are stateless HTTP operations, and historical revisions are retained for
a bounded period. The implementation must still avoid application memory leaks by
using bounded arrays/concurrency, clearing request timeout handles in `finally`,
and avoiding unbounded process-level `Map`, cache, or log collections.

### Sanity usage rules for this feature

1. Make one full-document draft discovery query, then one projected SPX discovery
   query per run.
2. Do not make a separate count query or one Sanity read per order.
3. Never mutate an unchanged successful order.
4. Never write a per-order `lastCheckedAt` timestamp on every run.
5. Only patch when:
   - the SPX status fingerprint or `spxSyncNote` changes;
   - one valid legacy `adminNotes` block must be removed;
   - the order becomes delivered and must become `completed`;
   - a new/different sync error must be recorded; or
   - an existing sync error must be cleared after recovery.
6. Do not create one Sanity document per cron execution. Use cron-job.org execution
   history and the compact API response for run-level observability.
7. Replace the dedicated `spxSyncNote` snapshot; never append an unbounded history
   array or future automated text to `adminNotes`.
8. Commit with `returnDocuments: false` to avoid returning the full mutated
   document.
9. Use synchronous visibility for each draft publish so the following SPX query
   can discover newly published orders. Keep SPX order patches asynchronous because
   the route does not immediately re-query those patched records.
10. Keep independent per-draft publish transactions and independent per-order SPX
    patches instead of one run-wide all-or-nothing transaction.

The installed `@sanity/client@^3.4.1` type definitions support
`ifRevisionId`, `returnDocuments`, and mutation `visibility`, so these optimizations
do not require a dependency upgrade.

The installed v3.4.1 runtime/types do not expose the newer document action API.
Draft publishing therefore uses the supported transactional Mutation API: a first
patch guarded by the discovered draft `_rev`, followed by `createOrReplace` of the
corresponding published ID and deletion of the draft in the same atomic mutation
array. A changed or concurrently published draft makes the guard fail and rolls
back the complete transaction, leaving the newer draft intact.

### Published-document safety

`api-client/sanity-server.ts` currently uses API version `2022-09-19`. Authenticated
queries on this older API version use the historical raw perspective and may expose
both a published order and a `drafts.*` copy while an administrator is editing in
Studio. This could duplicate SPX calls and patch the wrong document.

The cron query must explicitly include:

```groq
!(_id in path("drafts.**"))
```

Do not globally change the shared Sanity client's API version as part of this
feature without separately validating all existing create/read/write consumers.
When the Sanity client is upgraded in a dedicated task, also configure an explicit
`published` perspective.

## SPX Investigation

### Public tracking endpoint

The SPX public tracking page currently calls:

```text
GET https://spx.vn/shipment/order/open/order/get_order_info
    ?spx_tn={SPX_TRACKING_CODE}
    &language_code=vi
```

Live verification on 2026-08-28 confirmed:

- The endpoint returns JSON with no cookie, login, CSRF token, or API key.
- A delivered sample returned:
  - `order_info.tracking_code_group_name == "Delivered"`
  - `order_info.tracking_code_subgroup_name == "Delivered"`
  - newest record `tracking_code == "F980"`
  - newest record `description == "Giao hàng thành công"`
- A returning sample returned:
  - `order_info.tracking_code_group_name == "Return"`
  - `order_info.tracking_code_subgroup_name == "Returning"`
  - a newest event describing the current return location.
- Unknown/malformed codes can still return HTTP 200, but with `retcode != 0`.
  Therefore HTTP status alone is not enough to classify a successful lookup.

The supplied production tracking values were used for verification but are not
copied into this repository document.

### Important integration risk

This is an undocumented endpoint used by the public SPX web application. It has no
published SLA or compatibility guarantee and may be changed, rate-limited, or
protected without notice. SPX's `robots.txt` also disallows the public `/track`
pages, which is a cautionary automation signal even though the JSON path is not
explicitly listed.

The implementation must isolate all SPX-specific code behind one provider helper
so it can later be replaced by the official SPX Open API or a paid tracking
aggregator without changing the Sanity synchronization workflow.

### Official API alternative

SPX has a merchant-oriented Open API with HMAC authentication and batch shipment
search. It requires SPX-issued application credentials and appears scoped to
shipments owned by the provisioned shipper account. It is the preferred long-term
option if INUT can obtain credentials and all tracked parcels belong to that
account, but it is not currently the practical version-1 integration.

## Proposed Architecture

```text
cron-job.org
  POST /api/cron/sync-spx-orders
  X-Cron-Secret: configured server secret
              |
              v
Next.js API route
  - authenticate request
  - query all ordersLighter drafts
  - revision-guard, publish, and delete each draft atomically
  - query eligible orders from Sanity server client
  - normalize SPX codes
  - process at most 25 orders with bounded concurrency
              |
              +----> SPX provider helper
              |        GET /shipment/order/open/order/get_order_info
              |        validate retcode and response shape
              |
              v
Sanity patch per changed order
  - optimistic revision guard
  - write dedicated spxSyncNote snapshot
  - migrate one valid legacy adminNotes marker block
  - set status=completed only for Delivered
  - update SPX sync metadata
              |
              +---- error summary ----> TelegramClient + sendWithRetry
                                         configured operations channel
```

## Proposed Files

### New files

1. `utils/spx/tracking.ts`
   - Parse and normalize SPX tracking inputs.
   - Fetch and validate the SPX response.
   - Convert the provider response into a small internal status model.
2. `utils/spx/admin-notes.ts`
   - Build `spxSyncNote` and safely migrate one valid legacy marker block.
3. `models/spxTracking.ts`
   - Shared provider result and sync-result types.
4. `pages/api/cron/sync-spx-orders.ts`
   - Protected POST route invoked by cron-job.org.
5. `utils/telegram/formatSpxSyncErrorMessage.ts`
   - Format one bounded, sanitized failure summary for the operations channel.

### Modified files

1. `sanity/schemas/ordersLighter.js`
   - Add non-destructive SPX sync metadata fields.
2. `models/cart.ts`
   - Add the corresponding optional fields to `OrderLighter`.
3. `api-client/sanity-server.ts`
   - Add the eligible-order query and revision-guarded sync patch.
4. `.env.example`
   - Document `SPX_SYNC_SECRET` and server-only SPX alert Telegram credentials
     without a `NEXT_PUBLIC_` prefix.
5. `utils/telegram/index.ts`
   - Add optional request-timeout support without changing existing callers.
6. `utils/telegram/validateTelegramEnv.ts`
   - Extract reusable credential validation while preserving existing workflows.

`utils/env-const.ts` is explicitly excluded because it is imported by browser code;
the cron route reads the secret from `process.env` in server-only code.

No frontend page, cart flow, checkout payload shape, localStorage key, or analytics
event requires a change. The shared order contract and server-side creation
sanitizer must include the new automation-owned field.

## Sanity Data Design

Keep the existing business fields and add optional sync metadata:

| Field | Type | Purpose |
| --- | --- | --- |
| `spxSyncNote` | text | Latest sanitized marker-free SPX snapshot shown read-only in Studio |
| `spxTrackingNumber` | string | Normalized SPX number used for change detection |
| `spxTrackingStatus` | string | Stable normalized value such as `Delivered` or `Return/Returning` |
| `spxTrackingEventCode` | string | Latest SPX event code, such as `F980` |
| `spxTrackingEventAt` | datetime | Timestamp of the latest event reported by SPX |
| `spxSyncError` | string | Stable bounded lookup/validation error code; cleared after recovery |

These fields make status-change detection reliable and keep machine state separate
from human notes. `adminNotes` remains manual-only after the one-time lazy migration
of a valid legacy managed block.

All additions are optional, so existing order documents require no bulk migration.
One valid legacy marker block is migrated lazily on that order's next successful
lookup. Do not add a per-order `spxLastCheckedAt` field: updating it daily would
create a mutation and revision for every unchanged order without improving the
sales-facing workflow. cron-job.org history is the source for run timestamps.

## Dedicated `spxSyncNote` and Legacy Migration

Store only the useful deterministic snapshot lines in `spxSyncNote`:

```text
tracking order status: Delivered - Giao hàng thành công
updated_time: 2026-08-28T17:05:41+07:00
updated_by: spx-cron-job
```

For a return flow:

```text
tracking order status: Return / Returning - Đơn hàng đã đến kho phân loại ...
updated_time: 2026-08-28T12:27:28+07:00
updated_by: spx-cron-job
```

Rules:

1. Future automation never appends or replaces content in `adminNotes`.
2. If `adminNotes` has no legacy markers, leave it unchanged.
3. If it has exactly one valid `--- SPX_SYNC_START ---` /
   `--- SPX_SYNC_END ---` pair, remove only that block during the next successful
   lookup and apply deterministic minimum boundary-newline cleanup.
4. If markers are partial, reversed, nested, or duplicated, leave `adminNotes`
   untouched, still update `spxSyncNote`/metadata/status, and report
   `SPX_MARKER_ERROR` as attention for manual cleanup.
5. Do not write marker lines into `spxSyncNote`.
6. A status fingerprint should include the normalized tracking number, provider
   group, subgroup, newest event code, newest event timestamp, and newest
   seller-facing description. This detects a new parcel or shipment event even when
   the broad group remains `Returning`.
7. `spxSyncNote` is a latest-status snapshot, not an ever-growing history. Sanity's
   document revision history remains the audit trail of previous snapshot values.
8. `updated_time` is the SPX event time, not the cron execution time. Therefore the
   generated note stays byte-identical when SPX has no new event.

## SPX Input Normalization

Accept:

```text
SPXVN064003583048
https://spx.vn/track?SPXVN064003583048
https://spx.vn/track?spx_tn=SPXVN064003583048
```

Normalization rules:

1. Trim whitespace.
2. For a raw value, require an exact case-insensitive `SPXVN` code pattern.
3. For a URL, require `https:` and an allowlisted host of `spx.vn` or
   `www.spx.vn`.
4. Extract one `SPXVN` code from the query string.
5. Uppercase the normalized code.
6. Reject ambiguous input containing multiple distinct SPX codes.
7. Skip non-SPX tracking values without calling the provider or modifying the order.

The parser must not send the entire stored URL to SPX; only the normalized code is
used in the upstream request.

## Status Mapping

Use provider codes for logic and Vietnamese descriptions only for display.

| SPX result | Sanity `status` | Automated note behavior |
| --- | --- | --- |
| Canonical group and subgroup are both `Delivered`, with a valid non-conflicting newest event | Set `completed` | Update `spxSyncNote`; migrate one valid legacy block |
| Canonical (fresh) order-info group is exactly `Return` and subgroup is exactly `Returned`, with a valid non-conflicting newest event | Set `cancelled` | Update `spxSyncNote`; migrate one valid legacy block; reconciles even if metadata/note already match |
| `Return`/`Returning` (non-terminal), failed delivery, delivery unsuccessful | Keep `in_transit` | Update `spxSyncNote`; migrate one valid legacy block |
| Normal in-transit states | Keep `in_transit` | Update `spxSyncNote`; migrate one valid legacy block |
| Carrier description text alone mentions a return/refund outcome without canonical `Return`/`Returned` group+subgroup | Keep `in_transit` | Update `spxSyncNote` with the sanitized description; never cancels |
| Invalid/missing SPX code | No change | No change; include skip reason in route result |
| SPX `retcode != 0` | No change | Keep both note fields unchanged; record `spxSyncError` |
| Timeout/network/invalid JSON | No change | Keep both note fields unchanged; record `spxSyncError` |
| Conflicting Delivered/Return signals in the same fresh response | No change (fails safe) | Keep both note fields unchanged; record `spxSyncError` as `SPX_STATUS_CONFLICT` |

Never move an order backwards from `completed`, `cancelled`, or another manually
selected state. The eligible-order query only selects `in_transit`, and the patch
must re-check that status before writing.

## API Route Contract

### Request

```http
POST /api/cron/sync-spx-orders
X-Cron-Secret: configured server secret
Content-Type: application/json
```

No request body is required for the scheduled run. A later implementation may
allow a server-only `dryRun` flag, but it must not be exposed without the same
authorization.

### Authentication

- Add `SPX_SYNC_SECRET` to Vercel and cron-job.org.
- Never use a `NEXT_PUBLIC_` secret.
- Compare the `X-Cron-Secret` request header with the server-only environment value.
- Return `401` for a missing or invalid secret.
- Return `405` for methods other than POST and set `Allow: POST`.
- Return `500` when the server secret is missing so a deployment
  misconfiguration cannot create an unprotected route.

### Response

Keep the response below cron-job.org's 64 KB response limit:

```json
{
  "success": true,
  "startedAt": "2026-08-28T10:00:00.000Z",
  "finishedAt": "2026-08-28T10:00:02.100Z",
  "summary": {
    "queried": 12,
    "checked": 10,
    "changed": 3,
    "completed": 1,
    "unchanged": 7,
    "skipped": 2,
    "failed": 0,
    "attentionRequired": 0
  },
  "telegramAlert": "not_required",
  "results": [
    {
      "orderId": "sanity-document-id",
      "result": "completed",
      "spxStatus": "Delivered"
    }
  ]
}
```

Do not return SPX location coordinates, driver phone numbers, customer data, or the
full upstream payload.

## Query and Processing Limits

Use an explicit GROQ projection:

```groq
*[
  _type == "ordersLighter" &&
  !(_id in path("drafts.**")) &&
  status == "in_transit" &&
  defined(trackingNumber) &&
  trackingNumber != ""
] | order(_createdAt asc) [0...26] {
  _id,
  _rev,
  status,
  trackingNumber,
  adminNotes,
  spxSyncNote,
  spxTrackingNumber,
  spxTrackingStatus,
  spxTrackingEventCode,
  spxTrackingEventAt,
  spxSyncError
}
```

Processing rules:

- Execute this query exactly once per daily run.
- Use the 26th row only as an overflow sentinel; process a maximum of 25 orders.
- If 26 rows are returned, stop before SPX calls or mutations and return a visible
  capacity error.
- Bounded concurrency of 5 to avoid burst traffic against SPX.
- Use `AbortController` with a short per-request timeout.
- Retry only transient network/5xx failures, at most once, and only while the
  route's execution budget remains.
- Stop starting retries near 25 seconds because cron-job.org has a 30-second
  execution timeout.
- Treat `retcode != 0` as an upstream lookup failure even when HTTP is 200.
- Parse defensively; missing `order_info` or tracking records is not success.
- Use the newest record by `actual_time`, not only array position.
- Do not re-fetch an order after a successful mutation.
- Do not patch an unchanged successful order.
- Do not rewrite an unchanged error value.

At the approved volume of fewer than 25 orders and observed SPX response times of
roughly a few hundred milliseconds, the normal run should complete comfortably
inside the scheduler timeout.

## Idempotency and Concurrency

Each order update must be one atomic Sanity patch:

1. Fetch `_rev` with the order.
2. Build the deterministic `spxSyncNote` snapshot and inspect the fetched
   `adminNotes` only for legacy migration.
3. Patch with `.ifRevisionId(order._rev)`.
4. Set SPX metadata, `spxSyncNote`, valid legacy cleanup, error clearing, and
   `status: "completed"` in the same patch when applicable.
5. Commit with `{returnDocuments: false, visibility: "async"}` to reduce response
   bandwidth and avoid waiting for query-index visibility that this run does not
   need.
6. If revision validation fails, report `revision_conflict` and skip the order.
   The next scheduled run will retry using current data.

This protects manual Studio edits to `adminNotes`, `trackingNumber`, or `status`
from being overwritten by a stale cron read. The only automated `adminNotes`
change is removal of the valid legacy block discovered at that revision. It also
makes overlapping cron calls safe: only one patch based on a given revision can
succeed.

Do not use the current in-memory rate limiter as a lock. No distributed lock is
required for version 1 because the operation is idempotent and revision-guarded.

## Failure and Monitoring Policy

- A single invalid tracking value is a skipped data issue, not a route crash.
- A new or changed SPX request failure is recorded in `spxSyncError`; identical
  repeated errors do not create another mutation.
- Limit `spxSyncError` to a short operational code/message; never store stack traces
  or full upstream responses.
- A successful later lookup clears `spxSyncError`.
- If every attempted SPX lookup fails, return a non-2xx status so cron-job.org can
  alert on a likely provider outage.
- If only some lookups fail, return the compact summary and make failures visible
  in cron-job.org execution history.
- Never set `completed` from a translated description alone. Require stable SPX
  group/subgroup/milestone values indicating delivery.
- Never erase the previous successful `spxSyncNote` or alter legacy/manual
  `adminNotes` because of an upstream error.
- Do not log the full SPX response or personal/location data.

## Telegram Failure Alert Requirement

Reuse the existing Telegram workflow:

- `TelegramClient` from `utils/telegram/index.ts`;
- `sendWithRetry()` for bounded retry behavior;
- HTML formatting with escaped dynamic values;
- credential-format validation extracted from
  `utils/telegram/validateTelegramEnv.ts`.

The cron route must call the Telegram utility directly. It must not make an HTTP
request to an existing `/api/telegram/*` route because that would add another
internal API hop, rely on the client-visible `NEXT_PUBLIC_X_API_KEY`, and invoke an
unrelated in-memory rate limiter.

### Server-only alert configuration

Use dedicated server-only variables:

```text
SPX_SYNC_TELEGRAM_BOT_TOKEN
SPX_SYNC_TELEGRAM_CHAT_ID
```

The values may point to the same bot/channel used by existing order notifications,
but the new names must not use `NEXT_PUBLIC_`. Existing Telegram workflows are not
migrated as part of this feature.

### Alert triggers

Send an alert for:

- Sanity discovery query failure;
- more than 25 eligible orders;
- SPX HTTP, timeout, invalid JSON, invalid response, non-success `retcode`, or
  conflicting status signals;
- malformed/duplicate managed-note markers;
- Sanity mutation or revision-conflict failure;
- unexpected cron orchestration errors after successful cron authentication.

Do not alert for:

- successful, unchanged, returned, or delivered results;
- intentional non-SPX tracking skips;
- missing/invalid cron authentication or unsupported HTTP methods, because public
  callers must not be able to spam the Telegram channel.

### Aggregation and deduplication

- Send at most one aggregated Telegram message per cron invocation.
- Include every failure category in that message, but list at most 10 affected
  orders and report the omitted count.
- A persistent error may generate one reminder on each daily run, but never one
  Telegram message per order.
- Telegram alerting does not create or update a Sanity document.

### Message content

The HTML message must contain:

```text
🚨 SPX ORDER SYNC ERROR
run_time: <GMT+7 timestamp>
environment: production
phases: <spx_api | sanity_query | sanity_update | orchestration>
summary: <checked / updated / completed / failed / attention required>
affected_orders:
  - <order number or document id> — <stable error code> — <Sanity Studio link>
action: <short recommended operator action>
```

Requirements:

- Escape all dynamic HTML.
- Keep the message below Telegram's text-message limit; target at most 3,500
  characters.
- Include order number/document ID and a Sanity Studio deep link when available.
- Do not include customer names, phone numbers, addresses, raw SPX payloads,
  carrier descriptions, secrets, or bot API URLs.

### Alert failure behavior

- Reserve a small portion of the verified route runtime budget for Telegram.
- Extend `TelegramClient.sendMessage()` with an optional request timeout, keeping
  existing callers backward compatible.
- Call `sendWithRetry()` with a small bounded retry count/delay derived from the
  remaining route budget; do not use the current long default blindly.
- Telegram failure must never roll back successful Sanity mutations or replace the
  original route error.
- The API response records
  `telegramAlert: "not_required" | "sent" | "failed" | "not_configured"` plus a
  non-sensitive failure code when applicable.
- If Telegram itself fails, log only the sanitized alert failure and rely on the
  original non-2xx cron response/cron-job.org notification as the fallback. Never
  recursively attempt to alert about the alert failure.

## cron-job.org Configuration

Recommended job:

| Setting | Value |
| --- | --- |
| URL | `https://inutdesign.com/api/cron/sync-spx-orders` |
| Method | `POST` |
| Header | `X-Cron-Secret: <value stored as SPX_SYNC_SECRET>` |
| Vietnam schedule | `0 17 * * *` with Asia/Ho_Chi_Minh timezone |
| UTC fallback | `0 10 * * *` |
| Request timeout | cron-job.org maximum, currently 30 seconds |
| Notifications | Enable failure notifications |

Vietnam has no daylight-saving-time adjustment, so the UTC fallback is stable:
10:00 UTC is 17:00 GMT+7.

Optionally allowlist cron-job.org executor IPs as a secondary control, but keep the
shared request secret as the primary control because the published IP list can
change.

## Security and Privacy

- Keep `SANITY_TOKEN`, `SPX_SYNC_SECRET`, `SPX_SYNC_TELEGRAM_BOT_TOKEN`, and
  `SPX_SYNC_TELEGRAM_CHAT_ID` server-side only.
- Do not include secrets in query strings because URLs can appear in logs.
- Do not expose a browser button that invokes the privileged route with the secret.
- Validate SPX hosts before parsing URLs to avoid turning the route into an SSRF
  primitive.
- Build the upstream URL from a fixed base plus `URLSearchParams`; never fetch a
  user-supplied URL directly.
- Do not persist or return SPX driver phone numbers, coordinates, receiver data, or
  the complete upstream response.
- Keep error messages operational and concise; avoid including secret headers or
  customer data.

## Analytics

No GA4 or Umami event is required. This is a server-to-server scheduled operation,
not a new customer interaction or page behavior. Operational results belong in the
cron response, Sanity sync metadata, and deployment logs rather than marketing
analytics.

## Rollback Strategy

1. Disable the cron-job.org schedule first.
2. Remove or disable the API route.
3. Revert provider/helper code.
4. Optional additive Sanity fields can remain safely; they do not affect existing
   documents or checkout.
5. Do not remove or rewrite manual `adminNotes`.
6. Orders already changed to `completed` or `cancelled` remain in that terminal
   state unless sales explicitly determines a correction is required; a
   mistaken automated cancellation is corrected the same way as any other
   manual Studio status correction, not by re-running the cron.

## Acceptance Criteria

1. An authorized POST run queries only `ordersLighter` documents currently marked
   `in_transit` with a non-empty `trackingNumber`.
2. Unauthorized requests cannot query SPX or mutate Sanity.
3. Both an SPX URL and a raw SPX code normalize to the same tracking identifier.
4. Non-SPX or ambiguous values are skipped without modifying the order.
5. The latest valid SPX event is written as a marker-free snapshot in
   `spxSyncNote`.
6. `adminNotes` without legacy markers remains unchanged.
7. Exactly one valid legacy block is removed while manual prefix/suffix content is
   preserved with deterministic minimum boundary cleanup.
8. An unchanged successful order causes no Sanity mutation, unless the fresh
   result is the terminal Return/Returned cancellation described in AC36–AC38.
9. A changed non-terminal return/failure/in-transit event (including
   `Return`/`Returning`) updates `spxSyncNote` but leaves the order `status` as
   `in_transit`.
10. A delivered event atomically updates `spxSyncNote`, performs any valid legacy
    cleanup, and changes `status` to `completed`.
11. A provider error never clears the last successful `spxSyncNote`, alters
    `adminNotes`, or completes/cancels an order.
12. Repeating the same provider error does not create another Sanity mutation.
13. A concurrent Studio edit causes a revision conflict instead of lost data.
14. Every `ordersLighter` draft is publish-attempted before SPX discovery, and the
    SPX query itself still excludes draft IDs.
15. Mutations use `returnDocuments: false` and asynchronous visibility.
16. The route processes no more than 25 orders and normally finishes within 30
    seconds.
17. The response contains aggregate results without customer or SPX location data.
18. Existing cart, checkout, order creation, and confirmation behavior is unchanged.
19. cron-job.org invokes the route once daily at 17:00 GMT+7.
20. A normal run uses one draft discovery query plus one SPX discovery query,
    revision-guarded draft publish transactions, and only meaningful SPX order
    mutations; it creates no run document or daily per-order timestamp write.
21. More than 25 eligible orders causes a visible capacity failure before any SPX
    call or Sanity mutation.
22. Conflicting Delivered/Return provider signals never complete or cancel an
    order.
23. New SPX metadata is read-only in Studio and cannot be injected through the
    existing order-creation request.
24. Partial/reversed/duplicate/nested markers leave `adminNotes` untouched, do not
    block `spxSyncNote`/completion updates, and create stable manual-cleanup
    attention; unsafe provider text cannot corrupt either note field.
25. SPX event timestamps are validated, stored as UTC datetimes, and displayed in
    `spxSyncNote` as GMT+7.
26. The route deadline respects the verified deployment and scheduler limits, and
    all timeout resources are released.
27. Persisted error values are bounded stable codes rather than volatile upstream
    messages.
28. Sales has a documented procedure to move fully resolved returns out of
    `in_transit` so they stop consuming daily checks for cases the automated
    canonical Return/Returned cancellation (AC36) does not cover.
29. Any SPX API, Sanity query, Sanity mutation, revision-conflict, capacity, or
    authenticated orchestration error produces at most one aggregated Telegram
    alert during that cron invocation.
30. Invalid cron authentication and unsupported HTTP methods never trigger a
    Telegram message.
31. Telegram alerts use dedicated server-only credentials and call the shared
    Telegram utility directly rather than an internal public API route.
32. Telegram messages are HTML-safe, below 3,500 characters, contain actionable
    phase/order/error information, and contain no customer data, secrets, raw SPX
    payload, or carrier description.
33. Telegram retries/timeouts fit inside the verified remaining route budget.
34. A Telegram delivery failure does not mask the original error, roll back Sanity
    changes, or recursively trigger another Telegram attempt.
35. Sanity query and mutation calls use bounded request timeouts so a stalled
    Content Lake request cannot consume the entire route budget before Telegram
    alerting is attempted.
36. A fresh, canonical SPX response whose order-info `group` is exactly `Return`
    and `subgroup` is exactly `Returned` (case/spacing/hyphen tolerant token
    matching) atomically changes an eligible `in_transit` order's `status` to
    `cancelled` via the same revision-guarded patch mechanism used for
    completion.
37. Non-terminal `Return`/`Returning` states, and any signal derived only from
    carrier description text, never change `status`; the order remains
    `in_transit` with an updated `spxSyncNote`.
38. A previously stored `in_transit` order whose `spxTrackingStatus`/
    `spxSyncNote` already reflect `Return`/`Returned` is still reconciled to
    `cancelled` on the next run when the fresh response confirms
    `Return`/`Returned`, even if the provider fingerprint and stored note are
    unchanged; this cancellation counts as a successful state change for
    Sanity-mutation and summary-aggregation purposes.
39. `shouldComplete` and `shouldCancel` are mutually exclusive on every
    normalized snapshot; a conflicting Delivered/Return signal never sets
    either flag and never completes or cancels an order.
40. The cron response `summary` and the Telegram alert both include a
    `cancelled` aggregate alongside the existing `completed`/`changed`/`failed`
    fields, and the compact per-order result for a cancellation reports
    `result: "cancelled"` with `spxStatus` exactly `"Return / Returned"`.

## Implementation Tasks

> Retained for traceability. This original task list is superseded by
> **Revised Implementation Tasks** below.

### Task 1 — Add SPX types and normalization

- **Files:** `models/spxTracking.ts`, `utils/spx/tracking.ts`
- Define the narrow upstream fields consumed by the application.
- Implement URL/raw-code parsing and provider response validation.
- Normalize provider results into stable internal fields.
- Add request timeout and bounded retry behavior.
- **Done when:** delivered, returning, invalid-code, malformed-response, timeout,
  and non-SPX input cases have deterministic helper results.

- [ ]

### Task 2 — Add dedicated SPX-note and legacy-migration helper

- **File:** `utils/spx/admin-notes.ts`
- Build the exact approved marker-free `spxSyncNote` syntax.
- Detect and remove exactly one valid legacy marker block.
- Preserve manual prefix/suffix content and leave malformed markers untouched.
- **Done when:** no-marker notes, valid legacy migration, unchanged fingerprint,
  and malformed-marker attention are covered.

- [ ]

### Task 3 — Add additive Sanity metadata

- **Files:** `sanity/schemas/ordersLighter.js`, `models/cart.ts`
- Add optional SPX status, code, event timestamp, and bounded error fields.
- Do not add a per-order daily check timestamp or append-only run-history array.
- Keep existing document and checkout contracts backward compatible.
- **Done when:** Studio loads existing orders without migration and new fields are
  visible to administrators.

- [ ]

### Task 4 — Add server-side query and guarded patch

- **File:** `api-client/sanity-server.ts`
- Query at most 25 eligible published orders with one explicit GROQ projection and
  a defensive `drafts.*` exclusion.
- Add one patch helper using `_rev` optimistic concurrency.
- Atomically update the note, SPX metadata, error state, and optional completion.
- Skip unchanged status/error states without issuing a mutation.
- Commit with `returnDocuments: false` and `visibility: "async"`.
- Keep independent per-order commits; do not use one batch transaction.
- **Done when:** stale reads cannot overwrite a concurrent Studio edit.

- [ ]

### Task 5 — Add protected cron API route

- **Files:** `pages/api/cron/sync-spx-orders.ts`, `.env.example`
- Add POST-only `X-Cron-Secret` authentication.
- Run bounded-concurrency synchronization and return a compact summary.
- Clear all SPX request timeout handles in `finally` and avoid unbounded
  process-level collections.
- Continue processing after per-order failures.
- Return a non-2xx status for configuration errors or complete provider failure.
- **Done when:** unauthorized, no-orders, mixed-result, full-success, and
  full-provider-failure runs have clear responses.

- [ ]

### Task 6 — Configure cron-job.org

- Add `SPX_SYNC_SECRET` to the deployed Vercel environment.
- Configure the same secret in the cron authorization header.
- Schedule once daily at 17:00 GMT+7, or use 10:00 UTC.
- Enable failure notifications.
- First run against production should be manually observed.
- **Done when:** one scheduled invocation per day appears in cron-job.org history
  and unauthorized manual calls return `401`.

- [ ]

### Task 7 — Validate the complete flow

- Run `pnpm lint`.
- Run `pnpm build` because a new API route and server modules affect runtime.
- Use a controlled in-transit Sanity order for each scenario:
  - delivered;
  - returning;
  - unchanged event;
  - invalid SPX value;
  - provider failure;
  - concurrent manual note edit.
- Confirm the delivered scenario changes only the intended fields.
- Confirm the returning scenario keeps `status == "in_transit"`.
- Confirm valid legacy marker removal preserves manual prefix/suffix notes.
- Confirm malformed legacy markers remain untouched while `spxSyncNote` still
  updates and Delivered can still complete.
- Confirm an unchanged successful run makes no Sanity mutation.
- Confirm a repeated identical error makes no additional Sanity mutation.
- Confirm draft documents are not selected.
- Confirm no SPX/customer PII appears in the route response or logs.
- **Done when:** all acceptance criteria pass in the deployed environment.

- [ ]

## Reverse Validation Summary

Walking backward from the business goal: **if Revised Tasks 1–8 are complete, the
once-daily cron can safely discover every supported in-transit SPX order, classify
the latest carrier event, preserve manual notes, update only meaningful Sanity
state, complete delivered orders, and surface failures without silent data loss.**

| Acceptance criterion | Revised task coverage |
| --- | --- |
| AC1 — eligible in-transit order query | Tasks 5, 6, 7 |
| AC2 — cron authentication | Tasks 6, 7, 8 |
| AC3 — URL and raw-code normalization | Tasks 1, 2, 7 |
| AC4 — non-SPX/ambiguous input skipped | Tasks 2, 3, 7 |
| AC5 — latest event written to one block | Tasks 2, 3, 5, 7 |
| AC6 — manual notes preserved | Tasks 3, 7 |
| AC7 — unchanged fingerprint does not rewrite notes | Tasks 3, 5, 7 |
| AC8 — unchanged success causes no mutation | Tasks 3, 5, 7 |
| AC9 — return/failure stays in transit | Tasks 2, 3, 5, 7 |
| AC10 — delivered becomes completed atomically | Tasks 2, 3, 5, 7 |
| AC11 — provider failure preserves last success | Tasks 2, 3, 5, 6, 7 |
| AC12 — repeated identical error is a no-op | Tasks 1, 3, 5, 7 |
| AC13 — concurrent edit is not overwritten | Tasks 5, 7 |
| AC14 — draft documents excluded | Tasks 5, 7 |
| AC15 — low-bandwidth mutation options | Tasks 5, 7 |
| AC16 — bounded volume/runtime | Tasks 5, 6, 7, 8 |
| AC17 — compact response without SPX/customer PII | Tasks 2, 6, 7 |
| AC18 — cart/checkout/order creation unchanged | Tasks 4, 7 |
| AC19 — once-daily 17:00 GMT+7 schedule | Task 8 |
| AC20 — two phase-specific queries plus bounded/meaningful mutations | Tasks 5, 7 |
| AC21 — visible overflow failure | Tasks 5, 6, 7 |
| AC22 — conflicting signals fail safe | Tasks 1, 2, 7 |
| AC23 — server-managed field ownership | Tasks 4, 7 |
| AC24 — marker/provider text safety | Tasks 3, 7 |
| AC25 — timestamp validation and GMT+7 display | Tasks 2, 3, 7 |
| AC26 — deployment-aware deadline and cleanup | Tasks 2, 6, 7, 8 |
| AC27 — bounded stable persisted errors | Tasks 1, 3, 4, 7 |
| AC28 — resolved-return polling lifecycle | Task 8 |
| AC29 — one aggregated failure alert | Tasks 6, 7, 8 |
| AC30 — public requests cannot spam Telegram | Tasks 6, 7 |
| AC31 — server-only direct Telegram integration | Tasks 6, 7, 8 |
| AC32 — bounded actionable non-PII message | Tasks 6, 7 |
| AC33 — alerting fits the route budget | Tasks 6, 7, 8 |
| AC34 — Telegram failure preserves original outcome | Tasks 6, 7 |
| AC35 — bounded Sanity request timeouts | Tasks 5, 6, 7, 8 |

The review found additional conditions needed to make those mappings true. They are
recorded in the Gap Report and are mandatory in the Revised Implementation Tasks.

## Gap Report

### G1 — The 25-order slice can silently starve orders

The original query selects `[0...25]` ordered by `_updatedAt`. If the operational
assumption becomes false and 26 or more eligible orders exist, unchanged orders can
remain in the first page forever while later orders are never checked.

**Resolution:** Task 5 queries up to 26 documents as an overflow sentinel. If more
than 25 are eligible, the route must stop before SPX calls/mutations, return an
explicit capacity error, and trigger cron monitoring. Do not silently process a
partial page.

### G2 — Delivered classification is currently too permissive

The status table allows completion when the broad group/subgroup is Delivered
**or** the latest milestone is Delivered. Conflicting provider fields could
therefore complete an order incorrectly.

**Resolution:** Task 2 requires the canonical `order_info` group and subgroup to
both indicate Delivered. The newest event must be valid and non-conflicting. Any
Delivered/Return contradiction becomes `SPX_STATUS_CONFLICT`; it never completes
the order.

### G3 — Tracking-number changes are missing from the fingerprint

Two different SPX numbers can temporarily have identical broad status, event code,
timestamp, or description. Comparing only status fields can incorrectly classify
a newly replaced `trackingNumber` as unchanged.

**Resolution:** add `spxTrackingNumber` as server-managed metadata and include the
normalized SPX number in the fingerprint/patch decision.

### G4 — Legacy marker migration must not corrupt manual notes

The plan covers missing/reversed markers but not multiple valid blocks, nested
markers, or upstream descriptions containing the marker text. It also says manual
notes are preserved "byte-for-byte except newline normalization," which is
internally contradictory.

**Resolution:** Task 3 treats exactly one well-formed marker pair as a lazy
migration candidate and removes it in the same successful revision-guarded patch.
Duplicate/nested/reversed/partial markers remain untouched while `spxSyncNote`,
metadata, and completion continue; `SPX_MARKER_ERROR` is aggregated as attention.
Carrier text is sanitized so it cannot create marker tokens in the dedicated note.

### G5 — Dynamic error messages can defeat no-op writes

If `spxSyncError` stores request IDs, timestamps, raw SPX messages, or stack text,
the value can differ every day and create a mutation even when the underlying
failure is unchanged.

**Resolution:** Tasks 1 and 3 use stable bounded error codes such as
`SPX_NOT_FOUND`, `SPX_TIMEOUT`, `SPX_HTTP_ERROR`, `SPX_INVALID_RESPONSE`,
`SPX_STATUS_CONFLICT`, and `SPX_MARKER_ERROR`. Provider errors retain existing
no-op behavior; marker attention is reported without converting a successful
lookup into a provider failure.

### G6 — The real SPX URL format needs query-key parsing

The verified public URL can be `https://spx.vn/track?SPXVN...`, where the tracking
code is the query **key**, not a named query value. A helper that only checks
`URLSearchParams.values()` will miss the primary format.

**Resolution:** Task 2 scans decoded query keys and values, accepts duplicate
occurrences of the same code, and rejects multiple distinct codes.

### G7 — SPX code length is undocumented

The plan does not define a bounded code format, but hardcoding the length from two
examples would be an unsupported assumption.

**Resolution:** Task 1 defines a conservative bounded format (`SPXVN` plus digits,
with a documented maximum total length) without assuming the two samples represent
all valid SPX lengths. Synthetic tests cover lower/upper bounds and oversized
input.

### G8 — Event timestamp conversion is under-specified

SPX currently returns `actual_time` as Unix seconds. The note requires GMT+7 and
must remain byte-identical across unchanged runs.

**Resolution:** Task 2 validates a positive integer Unix-seconds value. Task 3
stores the event as UTC ISO datetime in Sanity and formats the note in fixed GMT+7,
including day-boundary test cases. Cron execution time is never used in the block.

### G9 — Adding the secret to `utils/env-const.ts` is unsafe and unnecessary

`utils/env-const.ts` is imported by browser code. Even though Next.js should not
inline a non-public environment value, a privileged server secret does not belong
in a shared client/server configuration object.

**Resolution:** Task 6 reads `process.env.SPX_SYNC_SECRET` directly inside the API
route or a clearly server-only module. `utils/env-const.ts` is not modified.

### G10 — New sync fields can leak into order creation

`CreateOrderLighterInput` is derived from `OrderLighter`, and
`createLighterOrder()` currently spreads the request object into Sanity. Adding
optional SPX fields to `OrderLighter` can make them type-visible and runtime
injection remains possible even if TypeScript omits them.

**Resolution:** Task 4 marks the fields read-only in Studio, omits them from the
creation type, and explicitly strips/whitelists server-managed SPX fields before
creating a new order. This is limited to fields introduced by this feature.

### G11 — The route budget assumes cron-job.org is the only timeout

The plan uses a 25-second internal budget based on cron-job.org's 30-second limit
without confirming the deployed Vercel function's maximum duration. A shorter
platform timeout could terminate the route before it returns a useful summary.

**Resolution:** Task 8 verifies the production function-duration limit before
activation. Task 6 sets its internal deadline below the smaller of the scheduler
and deployment limits, and only retries while budget remains.

### G12 — Partial failure response semantics are undefined

The plan distinguishes full provider failure but does not specify what HTTP status
is returned after some orders succeed and others have transient SPX failures.
Without a defined policy, cron-job.org may report success while the endpoint is
degrading.

**Resolution:** Task 6 defines stable response categories. Configuration/Sanity
failures return `500`; capacity overflow returns a non-2xx capacity response;
transient SPX transport/schema failures return `502` after all orders settle, even
if some mutations succeeded; successful/unchanged/data-skip runs return `200`.

### G13 — Provider text is untrusted input

SPX descriptions are written into `spxSyncNote`. The current plan does not cap
length, normalize line breaks, or prevent control/marker content.

**Resolution:** Task 3 collapses provider text to a single line, removes control
characters and marker tokens, preserves Vietnamese text, and caps the displayed
description. The raw upstream payload is never persisted.

### G14 — The no-mutation rule has an unstated recovery exception

AC8 says unchanged successful orders cause no mutation, but a successful lookup
must clear a previously stored `spxSyncError`.

**Resolution:** Task 3 defines this as an intentional meaningful mutation:
unchanged status + existing error becomes `clear_error`; unchanged status + no
error remains `no_change`.

### G15 — Schema metadata is not declared automation-owned

If the new SPX metadata fields are editable in Studio, manual changes can make the
fingerprint disagree with the managed note and trigger confusing updates.

**Resolution:** Task 4 makes all SPX metadata read-only and gives sales-facing
titles/descriptions. Manual users continue editing `trackingNumber`, `status`, and `adminNotes`.

### G16 — Test coverage is not deterministic enough

The original Task 7 relies mainly on live SPX and controlled Sanity orders. It does
not enumerate parser, marker, contradiction, no-op, injection, timeout, overflow,
or response-status tests. Live carrier data can change and is unsuitable as the
only regression oracle.

**Resolution:** Task 7 adds sanitized synthetic fixtures and an existing-tooling
regression script. Live SPX is only a deployed smoke check, not the deterministic
test suite.

### G17 — Sanity Studio build validation is missing

Root `pnpm build` does not compile the separate Sanity v2 Studio project after its
schema changes.

**Resolution:** Task 7 adds `pnpm --dir sanity build` alongside root lint/build.

### G18 — Existing order creation needs explicit regression coverage

The feature changes `OrderLighter`, `CreateOrderLighterInput`, and
`api-client/sanity-server.ts`, all of which are used by the checkout API.

**Resolution:** Task 7 verifies that the existing lighter order creation path still
accepts its current payload and cannot set the new server-managed SPX fields.

### G19 — Non-delivered terminal shipments have no polling lifecycle

The original mapping kept every return/failure state as `in_transit`. A parcel
that had finished returning to sender could therefore remain eligible forever,
consuming one SPX lookup per day and eventually contributing to the 25-order cap.

**Resolution (superseded by the confirmed terminal-return behavior above):**
version 1 shipped without an automatic terminal mapping for returns and
documented a manual sales rule (Task 8) to move resolved returns to `cancelled`.
This revision closes that gap: a fresh, canonical `Return`/`Returned`
order-info response now automatically moves the order to `cancelled` using the
same revision-guarded, change-detecting patch path as `Delivered` →
`completed`, so a fully returned parcel stops consuming daily SPX lookups
without a manual Studio edit. Non-terminal `Return`/`Returning` states are
unaffected and still rely on the manual sales rule until SPX itself reports the
canonical `Returned` subgroup. Eligible-order counts continue to be monitored
during rollout, and overflow still fails visibly rather than silently starving
orders.

### G20 — Existing Telegram routes are the wrong integration boundary

The current notification routes are designed for browser-triggered business
events. They use `NEXT_PUBLIC_X_API_KEY`, a shared in-memory rate limiter, and an
extra HTTP request. Calling one from the cron would add failure modes and reuse
client-visible authentication for an internal operation.

**Resolution:** Task 6 reuses `TelegramClient`, `sendWithRetry`, and validation
logic directly inside the authenticated cron process. No new Telegram API route is
created.

### G21 — Existing Telegram credentials are client-visible

The current workflow reads `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN` and
`NEXT_PUBLIC_TELEGRAM_CHAT_ID` through `utils/env-const.ts`. Copying that pattern
would expose a privileged bot token by design.

**Resolution:** Task 6 adds dedicated server-only
`SPX_SYNC_TELEGRAM_BOT_TOKEN`/`SPX_SYNC_TELEGRAM_CHAT_ID` variables. Existing
notification routes are left unchanged to avoid an unrelated migration.

### G22 — Per-order alerts would spam the channel

With up to 25 orders and retries, sending one message inside each failure branch
could generate many messages for one provider outage.

**Resolution:** Task 6 accumulates sanitized failure records and sends at most one
summary per authenticated cron invocation, listing at most 10 affected orders.

### G23 — Telegram defaults can exceed the remaining route budget

The existing `sendWithRetry()` defaults to three attempts with exponential delays,
and `TelegramClient.sendMessage()` has no request timeout. Alerting after SPX work
could cause the function to time out before returning its original error.

**Resolution:** Task 6 adds backward-compatible request-timeout support and passes
an alert retry budget derived from the remaining route deadline.

### G24 — Alert failures can mask the original incident

If Telegram delivery throws or returns failure, a naive outer catch can replace the
SPX/Sanity result with a Telegram-specific error or attempt recursive alerts.

**Resolution:** Task 6 treats alerting as best-effort after preserving the original
HTTP status/result. The response includes a sanitized alert outcome, and Telegram
failure is never alerted recursively.

### G25 — Alert message content and size are undefined

The current plan has compact cron responses but no bound or privacy contract for
Telegram. Raw upstream errors may contain changing IDs, HTML characters, or
operational/customer data.

**Resolution:** Task 6 uses a dedicated formatter with HTML escaping, stable error
codes, a 3,500-character target, capped order entries, Sanity links, and an
explicit PII/secret exclusion list.

### G26 — A stalled Sanity request can prevent the alert

The shared Sanity client has a configurable/request-level timeout, but the current
plan only budgets SPX and Telegram work. A hanging discovery query or mutation can
consume the whole serverless duration and leave no time to notify Telegram.

**Resolution:** Task 5 supplies bounded query/mutation timeout options derived from
the route deadline. Task 6 reserves alert time and classifies Sanity timeout errors
like other Sanity phase failures.

## Assumption Report

- **A1 — Unofficial endpoint accepted.** Version 1 depends on an undocumented SPX
  endpoint with no SLA. The accepted mitigation is isolation, bounded retries,
  failure alerts, and no destructive fallback.
- **A2 — Daily freshness trade-off accepted.** A status changing immediately after
  17:00 GMT+7 may remain stale until the next day's run. The maximum expected lag is
  close to 24 hours.
- **A3 — Fewer than 25 eligible orders is an operational invariant.** The revised
  route detects and alerts on overflow rather than silently providing partial
  coverage. Supporting larger volume requires a separately approved pagination or
  queue design.
- **A4 — SPX Unix-seconds timestamps are stable.** Values that are absent,
  non-integer, non-positive, or implausible are treated as invalid responses rather
  than guessed as milliseconds.
- **A5 — Canonical Delivered fields remain stable.** Automatic completion depends
  on SPX's structured group/subgroup values, not Vietnamese display text. Unknown or
  conflicting values fail safe.
- **A6 — Current dedicated note is a snapshot, not permanent audit history.**
  Previous `spxSyncNote` versions are available only within the project's Sanity history-retention
  window. The business explicitly chose replacement over append-only history.
- **A7 — cron-job.org history is sufficient for run-level audit.** No Sanity
  document is created per execution. If longer operational retention is later
  required, it is a separate logging/monitoring decision.
- **A8 — The deployed function duration is not yet known.** The implementation
  cannot finalize retry count and internal deadline until the production limit is
  checked.
- **A9 — Non-SPX tracking values are intentionally skipped.** The cron is not a
  multi-carrier tracker and must not mark another carrier's value as an SPX error.
- **A10 — `spxSyncNote` is automation-owned.** It is optional and read-only in
  Studio. `adminNotes` is manual-only after valid legacy migration.
- **A11 — Async mutation visibility is acceptable.** No same-run query depends on a
  just-written document; the next run is one day later.
- **A12 — Project plan tier is unverified.** Current Free-plan figures demonstrate
  the workload is small, but the implementation must not depend on a specific paid
  or free entitlement.
- **A13 — Shipment completion does not change payment state.** The cron updates
  `status` only; `paymentStatus` remains under the existing business process.
- **A14 — SPX descriptions are internal context, not trusted business logic.**
  Descriptions may be shown after sanitization but never determine `completed` or
  `cancelled`.
- **A15 — Revision conflicts are retried on the next daily run.** Version 1 does not
  re-read and retry the same order in the current invocation because that would add
  Sanity requests and risk overriding an active Studio edit.
- **A16 — Non-canonical returns still require manual review.** Canonical
  `Return`/`Returned` is automatically mapped to `cancelled`; sales must still
  resolve non-terminal, ambiguous, or provider-conflicting return cases manually.
- **A17 — Changing to a non-SPX carrier does not trigger legacy migration.** AC4
  requires no mutation for non-SPX input. Sales must manually resolve any obsolete
  legacy marker content when no successful SPX lookup occurs.
- **A18 — The configured operations channel is monitored.** Real-time Telegram
  delivery only reduces response time if the bot can post and responsible staff
  monitor the target chat/channel.
- **A19 — One reminder per failed daily run is acceptable.** Persistent unresolved
  errors may generate one aggregated message each day until corrected.
- **A20 — Telegram is secondary observability.** cron-job.org failure notification
  and deployment logs remain required because the bot/API can also fail.
- **A21 — Public authentication failures are not operational incidents.** They are
  returned as `401`/`405` without Telegram to prevent channel-spam abuse.

## Over-engineering Report

- **O1 — No generic carrier framework.** Keep one SPX provider module; do not add a
  provider registry, dependency-injection container, or factory until a second
  carrier is approved.
- **O2 — No global Sanity client upgrade.** The installed client already supports
  the required mutation options. Do not upgrade dependencies or globally change
  `apiVersion`/perspective solely for this feature.
- **O3 — No distributed lock.** Revision guards and idempotent decisions are enough
  for one daily invocation. Do not add Redis, a lock document, or another service.
- **O4 — No append-only status-history array or run documents.** They add document
  growth and writes without serving the approved latest-status workflow.
- **O5 — No new order status enum.** Reuse the existing `completed` and `cancelled`
  values for canonical terminal delivery/return outcomes. Non-terminal
  return/failure states remain carrier context in `spxSyncNote` and SPX metadata.
- **O6 — No cron IP allowlist in version 1.** The server-only secret is sufficient.
  IP maintenance can be added later only if a concrete threat requires it.
- **O7 — No public/manual dry-run feature.** A dry-run request mode adds branching
  and security surface. Deterministic fixtures and controlled production orders
  cover validation.
- **O8 — No new test framework.** Use a focused Node regression script, existing
  lint/build commands, and controlled integration checks.
- **O9 — No marketing analytics or customer UI.** Cron health belongs in the API
  response, cron-job.org history, deployment logs, and read-only Sanity fields.
- **O10 — No SPX location/driver/receiver persistence.** Store only the minimum
  status metadata and sanitized description in `spxSyncNote`.
- **O11 — No batch Sanity transaction.** Independent per-order mutations preserve
  failure isolation and are far below mutation-rate limits.
- **O12 — No stored fingerprint field.** Derive the fingerprint from normalized
  tracking number, stored event metadata, error code, and generated `spxSyncNote`;
  an additional hash field is unnecessary.
- **O13 — No internal Telegram HTTP call or new notification route.** Reuse the
  existing client utility directly in the cron process.
- **O14 — No Telegram message per order and no success messages.** One failure-only
  summary per run provides actionability without channel noise.
- **O15 — No durable alert queue or Telegram audit document.** The once-daily,
  low-volume requirement does not justify a queue, outbox, or additional Sanity
  writes; cron-job.org remains the fallback.

## Revised Implementation Tasks

> **This task list is the implementation source of truth.** Complete tasks in order.
> Earlier task descriptions are retained only for traceability.

### Revised Task 1 — Freeze contracts, decisions, and sanitized fixtures

- **Files:** `models/spxTracking.ts` (new), planned regression fixture/script files.
- Define discriminated provider results for success, skip, stable data error,
  transient provider error, and invalid response.
- Define stable bounded sync-error codes; do not persist raw upstream messages.
- Define the normalized status fingerprint inputs:
  - normalized SPX tracking number;
  - group and subgroup;
  - newest event code;
  - newest event Unix timestamp;
  - sanitized seller-facing description.
- Define the only automatic completion rule: canonical group and subgroup are both
  Delivered, a valid latest event exists, and no Return/conflict signal exists.
- Create sanitized synthetic delivered, returning, unsorted-history, invalid-code,
  conflicting-status, empty-record, malformed-response, timeout, and HTTP-error
  fixtures. Do not commit real customer payloads or tracking numbers.
- **Acceptance coverage:** AC3, AC9–AC12, AC17, AC22, AC27.
- **Done when:** downstream helpers can be implemented without guessing response
  semantics, error text, timestamps, or completion precedence.

- [ ]

### Revised Task 2 — Implement the bounded SPX provider helper

- **Files:** `utils/spx/tracking.ts` (new), `models/spxTracking.ts`.
- Parse raw codes and allowlisted HTTPS SPX URLs.
- Scan decoded query keys and values so both `?SPXVN...` and named-parameter URLs
  work.
- Accept repeated occurrences of the same code; reject multiple distinct codes.
- Use a bounded `SPXVN` plus digits format and reject oversized input.
- Build requests from the fixed SPX endpoint and normalized code; never fetch the
  stored URL.
- Validate `retcode`, required `order_info`, non-empty records, and positive
  Unix-seconds timestamps.
- Select the newest record by `actual_time`, independent of array order.
- Require non-conflicting canonical Delivered signals before returning
  `shouldComplete: true`.
- Use `AbortController`, clear timeout handles in `finally`, and retry only
  transient failures while the caller's runtime budget permits.
- Return only the narrow normalized result; discard location, receiver, driver, and
  raw payload data.
- **Acceptance coverage:** AC3, AC4, AC9–AC12, AC17, AC22, AC25, AC26.
- **Done when:** all Task 1 fixtures produce deterministic, fail-safe results.

- [ ]

### Revised Task 3 — Implement note management and patch decisions

- **Files:** `utils/spx/admin-notes.ts` (new), optional pure decision helper under
  `utils/spx/`.
- Recognize exactly zero or one complete marker pair.
- Treat one valid pair as legacy content to remove during the next successful
  lookup.
- Leave partial, reversed, nested, or duplicate marker blocks untouched while
  continuing the successful automated update.
- Preserve prefix/suffix manual text with deterministic minimum cleanup at the
  removed block boundary.
- Build future automated content only in `spxSyncNote`, without marker lines.
- Sanitize the SPX description to one bounded line, remove control characters and
  marker tokens, and preserve Vietnamese text.
- Format `updated_time` from the SPX event timestamp in fixed GMT+7.
- Include normalized tracking number in the fingerprint even though the existing
  `trackingNumber` field remains the sales-visible source.
- Produce an explicit decision:
  - `no_change`;
  - `status_changed`;
  - `complete_order`;
  - `cancel_order`;
  - `set_error`;
  - `clear_error`.
- Compute `shouldComplete`/`shouldCancel` on the normalized snapshot
  (`utils/spx/tracking.ts`) from the fresh, canonical order-info `group`/
  `subgroup` tokens only, never from description text, and construct them so
  they are structurally mutually exclusive (a Delivered/Return conflict is
  already rejected upstream as `SPX_STATUS_CONFLICT` before either flag can be
  computed).
- Treat `shouldCancel` as a successful state change even when stored metadata
  and `spxSyncNote` already match, so a previously-synced Return/Returned order
  is reconciled to `cancelled` on the next run.
- Attach stable `SPX_MARKER_ERROR` attention to otherwise successful decisions
  when legacy markers are malformed.
- Treat unchanged status plus an existing error as `clear_error`, not `no_change`.
- **Acceptance coverage:** AC4–AC12, AC24, AC25, AC27, AC36–AC39.
- **Done when:** note output and mutation/no-mutation decisions are deterministic
  for every fixture and marker edge case, including the canonical
  Return/Returned cancellation and its reconciliation case.

- [ ]

### Revised Task 4 — Add automation-owned Sanity fields safely

- **Files:** `sanity/schemas/ordersLighter.js`, `models/cart.ts`,
  `api-client/sanity-server.ts`.
- Add optional read-only fields:
  - `spxSyncNote`;
  - `spxTrackingNumber`;
  - `spxTrackingStatus`;
  - `spxTrackingEventCode`;
  - `spxTrackingEventAt`;
  - `spxSyncError`.
- Keep error values bounded and stable; do not add history arrays or daily check
  timestamps.
- Add the optional fields to `OrderLighter`.
- Explicitly omit all new SPX fields from `CreateOrderLighterInput`.
- Add runtime stripping/whitelisting in the existing order creation helper so a
  crafted request cannot set server-managed SPX metadata.
- Do not alter existing order status/payment defaults or checkout payload shape.
- **Acceptance coverage:** AC12, AC18, AC23, AC27.
- **Done when:** existing documents need no migration, Studio shows metadata as
  read-only, and new-order creation cannot set SPX fields.

- [ ]

### Revised Task 5 — Add one-query discovery and change-only Sanity mutations

- **File:** `api-client/sanity-server.ts`.
- Use `serverClient` with `useCdn: false`.
- Execute one explicit GROQ query with:
  - `_type == "ordersLighter"`;
  - `!(_id in path("drafts.**"))`;
  - `status == "in_transit"`;
  - non-empty `trackingNumber`;
  - only fields required by the decision engine;
  - a 26-document overflow sentinel.
- If 26 documents are returned, emit an overflow result before any SPX request or
  mutation; do not silently process only 25.
- For 25 or fewer orders, perform no additional Sanity reads.
- Skip mutations for `no_change` and repeated identical error decisions.
- For each meaningful decision, use one independent patch with
  `.ifRevisionId(_rev)`.
- Set note, metadata, error clearing/setting, and optional `status: "completed"` in
  the same order-level patch.
- Commit with `returnDocuments: false` and `visibility: "async"`.
- Pass bounded request timeouts to the discovery query and each mutation so the
  caller retains time for failure aggregation and Telegram.
- Do not use a batch transaction, re-read/retry revision conflicts, or update
  daily timestamps.
- **Acceptance coverage:** AC1, AC5, AC7–AC16, AC20, AC21, AC35.
- **Done when:** one run consumes one draft discovery query plus one SPX discovery
  query, one revision-guarded transaction per draft publish attempt, and exactly
  the number of meaningful SPX order mutations, with no silent draft/overflow
  coverage gap.

- [ ]

### Revised Task 6 — Add the protected cron route and Telegram failure alerting

- **Files:** `pages/api/cron/sync-spx-orders.ts` (new),
  `utils/telegram/formatSpxSyncErrorMessage.ts` (new),
  `utils/telegram/index.ts`, `utils/telegram/validateTelegramEnv.ts`,
  `.env.example`.
- Read `process.env.SPX_SYNC_SECRET` directly in server-only code; do not modify
  `utils/env-const.ts`.
- Add server-only `SPX_SYNC_TELEGRAM_BOT_TOKEN` and
  `SPX_SYNC_TELEGRAM_CHAT_ID`; do not use `NEXT_PUBLIC_` credentials for the new
  alert path.
- Extract/reuse credential validation without changing existing Telegram route
  behavior.
- Reuse `TelegramClient` and `sendWithRetry()` directly; do not call an internal
  `/api/telegram/*` route.
- Add an optional Telegram request timeout while keeping current callers backward
  compatible.
- Reject a missing server configuration with `500`, an invalid/missing request
  secret with `401`, and non-POST methods with `405` plus `Allow: POST`.
- Authenticate before querying Sanity or calling SPX.
- Derive the internal execution deadline from the verified deployment limit and
  cron-job.org's 30-second limit; stop retries/starting work before that deadline.
- Process at most 25 orders with bounded concurrency and settled per-order results.
- Avoid unbounded caches/collections and clear all timer resources.
- Collect SPX API, capacity, marker, Sanity query/update, revision-conflict, and
  authenticated orchestration failures into one sanitized run summary.
- Send at most one Telegram alert per invocation, with at most 10 affected orders,
  a 3,500-character target, stable error codes, Sanity Studio links, and a short
  recommended action.
- Do not alert for success/unchanged/non-SPX skips, invalid cron authentication, or
  unsupported methods.
- Reserve time for Telegram and pass bounded retry/delay/request-timeout options
  based on the remaining route budget.
- Preserve the original result/status if Telegram fails; never retry recursively or
  roll back successful Sanity mutations.
- Return only compact order IDs/result categories and aggregate counts.
- Response policy:
  - `200` for no orders, success, unchanged results, intentional non-SPX skips,
    stable per-order data errors, marker errors, and revision conflicts, with an
    `attentionRequired` count/result category where applicable;
  - non-2xx capacity response for more than 25 eligible orders;
  - `500` for configuration/Sanity failures;
  - `502` for one or more transient SPX transport/schema failures after all started
    orders settle, even if some order mutations succeeded.
- Never include secrets, tracking payloads, descriptions, coordinates, receiver
  data, or driver data in the response/logs.
- Include
  `telegramAlert: "not_required" | "sent" | "failed" | "not_configured"` and only
  a stable non-sensitive alert failure code in the route response.
- **Acceptance coverage:** AC1, AC2, AC11, AC16, AC17, AC21, AC26, AC29–AC35.
- **Done when:** all response categories are deterministic and no unauthorized
  request reaches Sanity, SPX, or Telegram; every eligible operational failure
  produces no more than one bounded alert attempt.

- [ ]

### Revised Task 7 — Add deterministic and regression validation

- **Files:** focused script/fixtures under `scripts/` using existing Node tooling;
  no new test framework.
- Cover parser cases:
  - raw/lowercase code;
  - nameless and named query parameters;
  - encoded input;
  - wrong host/protocol;
  - repeated same code;
  - multiple distinct codes;
  - whitespace and oversized input.
- Cover provider cases:
  - delivered and returning;
  - unsorted records;
  - `retcode != 0`;
  - empty records;
  - missing fields;
  - invalid timestamp;
  - Delivered/Return conflict, including Delivered group with Returned subgroup;
  - canonical Return/Returned cancellation with a sanitized Vietnamese
    seller_description fixture (`Đơn hàng đã hoàn trả thành công`);
  - description-only return text with non-terminal group/subgroup never
    cancels;
  - timeout and HTTP/JSON failure.
- Cover note/decision cases:
  - no-marker manual notes remain unchanged;
  - marker-free deterministic `spxSyncNote`;
  - valid legacy migration with manual prefix/suffix preservation;
  - partial/reversed/nested/duplicate markers;
  - marker injection and multiline/oversized description;
  - malformed markers still update `spxSyncNote` and can complete;
  - provider errors preserve both note fields;
  - missing/different `spxSyncNote` with unchanged metadata;
  - no-op after migration;
  - same status no-op;
  - changed tracking number with same status;
  - new/same/cleared error;
  - GMT+7 date-boundary formatting;
  - canonical Return/Returned produces `cancel_order` with `status: "cancelled"`
    and the exact
    `tracking order status: Return / Returned - <sanitized description>` note;
  - Return/Returning never produces `cancel_order`;
  - a stored order whose metadata/note already match Return/Returned is still
    reconciled to `cancel_order` on the next run.
- Cover Sanity/orchestration cases with stubs or pure decision inputs:
  - draft exclusion;
  - 26-document overflow;
  - zero-mutation unchanged run;
  - atomic delivered patch shape;
  - atomic cancelled patch shape and cron summary/result `cancelled` aggregate;
  - revision conflict;
  - compact non-PII response;
  - expected HTTP response categories.
- Cover Telegram cases:
  - one alert for multiple per-order failures;
  - no alert for success, unchanged, non-SPX skip, `401`, or `405`;
  - HTML escaping and 3,500-character truncation;
  - first 10 affected orders plus omitted count;
  - server-only credential validation;
  - request timeout and bounded retry;
  - Sanity query/mutation timeout classification;
  - insufficient remaining budget;
  - Telegram failure preserves the original HTTP status/result;
  - no recursive alert attempt;
  - the summary line includes the `cancelled` aggregate.
- Validate the route rejects invalid auth locally before external calls.
- Validate the existing order creation payload still works and injected SPX fields
  including `spxSyncNote` are discarded.
- Run:
  - focused SPX regression script;
  - `pnpm lint`;
  - `pnpm build`;
  - `pnpm --dir sanity build`;
  - the existing lighter regression/manual checkout flow appropriate for the
    environment.
- **Acceptance coverage:** AC1–AC40.
- **Done when:** deterministic checks pass without depending on live customer
  tracking data, Telegram failure handling is bounded and non-recursive, and
  existing order creation/checkout behavior is unchanged.

- [ ]

### Revised Task 8 — Deploy, configure, and observe the daily job

- Confirm the deployed Vercel function-duration limit and align Task 6's internal
  budget before enabling the scheduler.
- Add `SPX_SYNC_SECRET`, `SPX_SYNC_TELEGRAM_BOT_TOKEN`, and
  `SPX_SYNC_TELEGRAM_CHAT_ID` to the production environment and deploy the
  API/schema changes.
- Invoke the protected route against controlled in-transit test orders for
  returning, unchanged, delivered, error, and revision-conflict scenarios.
- Confirm a delivered order updates `spxSyncNote`/metadata, performs valid legacy
  cleanup, and becomes `completed` in one patch.
- Confirm unchanged orders create no Sanity mutation/revision.
- Confirm the response and deployment logs contain no SPX/customer PII.
- Trigger controlled SPX and Sanity failures and confirm each invocation sends one
  actionable Telegram summary to the configured channel.
- Confirm invalid cron authentication does not send Telegram.
- Trigger a controlled Telegram failure and confirm cron-job.org still receives
  the original non-2xx SPX/Sanity result with `telegramAlert: "failed"`.
- Configure cron-job.org:
  - POST production route;
  - `X-Cron-Secret` header;
  - `0 17 * * *` in Asia/Ho_Chi_Minh, or `0 10 * * *` in UTC;
  - failure notifications enabled.
- Observe at least three scheduled executions and confirm expected request/mutation
  counts and no timeout/provider-alert pattern before considering rollout stable.
- Document for sales that a fully resolved return must be moved from `in_transit`
  to the existing appropriate terminal status so it stops consuming daily checks.
- Document the disable-first rollback: pause cron-job.org before reverting the API.
- **Acceptance coverage:** AC2, AC10, AC16, AC17, AC19, AC26, AC28–AC35.
- **Done when:** the daily 17:00 GMT+7 job has three healthy observed runs and sales
  receives one actionable Telegram summary for controlled SPX/Sanity failures, and
  can read the latest managed SPX status without manual carrier lookup for covered
  orders.

- [ ]

## External References

- SPX public tracking page: <https://spx.vn/track>
- Current public JSON endpoint:
  <https://spx.vn/shipment/order/open/order/get_order_info>
- SPX robots file: <https://spx.vn/robots.txt>
- SPX integration documentation root: <https://spx.vn/en/integration/en/guide/>
- cron-job.org FAQ: <https://cron-job.org/en/faq/>
- Sanity plans and usage: <https://www.sanity.io/docs/platform-management/plans-and-payments>
- Sanity technical limits: <https://www.sanity.io/docs/content-lake/technical-limits>
- Sanity API CDN guidance: <https://www.sanity.io/docs/content-lake/api-cdn>
- Sanity perspectives: <https://www.sanity.io/docs/content-lake/perspectives>
- Sanity mutation options: <https://www.sanity.io/docs/apis-and-sdks/js-client-advanced>
- Telegram Bot API `sendMessage`: <https://core.telegram.org/bots/api#sendmessage>
