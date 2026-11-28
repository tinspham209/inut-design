# worker-upload-and-rate-limit Specification

## Purpose

Defines the image upload contracts on Workers, client-IP rate limiting for the advisory phone lookup, and budgeted SPX sync that makes progress across scheduled runs.

## Requirements

### Requirement: Bounded canonical image upload decoding
Both image upload routes SHALL accept canonical standard base64 within their applicable limits without a decoder stack error. They SHALL reject malformed or non-canonical base64 with HTTP 400 before attempting persistence and preserve the existing route-specific formats, body limits and response shapes otherwise.

#### Scenario: Keychain image remains subject to keychain-specific constraints
- **WHEN** `POST /api/keychain/uploads` receives a valid PNG, JPEG or WebP within its 10 MiB decoded limit and image dimension and pixel limits
- **THEN** it passes exactly the decoded bytes to persistence and returns the existing `{ image, url }` shape on success
- **AND** an over-limit decoded payload is rejected with HTTP 413 before persistence

#### Scenario: General Sanity image upload keeps its existing bounds and formats
- **WHEN** `POST /api/sanity/upload-image` receives canonical base64 for PNG, JPEG, WebP or SVG within its existing encoded request bounds
- **THEN** it passes exactly the decoded bytes to persistence and returns the existing image-reference shape on success without imposing the keychain-only decoded-size or dimension limits
- **AND** an upstream persistence failure still returns HTTP 500

#### Scenario: Malformed or non-canonical data is rejected as a client error
- **WHEN** either upload route receives malformed or non-canonical base64 after the method, request and format guards pass
- **THEN** it returns HTTP 400 without attempting persistence
- **AND** the 14 MiB request-body cap applies even without a usable `Content-Length` header

### Requirement: Cloudflare client-IP isolation for advisory phone validation
The phone validation limiter SHALL key requests independently by the verified Cloudflare connecting IP where available. Non-Worker callers SHALL retain the existing fallback policy, and a rate-limited request SHALL retain the advisory HTTP 200 response.

#### Scenario: Two clients have separate rate-limit buckets on Cloudflare
- **WHEN** repeated requests from one Cloudflare connecting IP exhaust its allowance and a second client calls `POST /api/validate-phone` with a different connecting IP
- **THEN** the first client receives HTTP 200 with `zaloRegistered: null` and no Zalo lookup
- **AND** the second client's allowance remains available even when both requests have the same forwarded or socket address

### Requirement: Budgeted SPX sync execution
Only authenticated `POST /api/cron/sync-spx-orders` requests SHALL run sync work. Each invocation SHALL make at most 45 external subrequests, including discovery, checkpoint operations, writes, retries, redirects and alerts. A successful batch with deferred work SHALL return HTTP 200 and `hasMore: true`; real Sanity and provider failures SHALL retain their existing HTTP 500 and 502 treatment.

#### Scenario: Both queues exceed the Worker budget
- **WHEN** an authenticated invocation sees more drafts or eligible tracking orders than can be processed in one batch
- **THEN** it limits discovery and processing in both phases, attempts bounded draft publishing before tracking discovery, and leaves excess work for later ticks
- **AND** if the selected batch succeeds, the response retains its summary fields and reports `hasMore: true` rather than HTTP 409

#### Scenario: Dependency retries and redirects consume the same budget
- **WHEN** Sanity, SPX or Telegram responds with a retriable error or a redirect and other operations also need to run
- **THEN** all outbound attempts stay within the same invocation ceiling, priority for reporting real failures is preserved, and deferred work is not reported as a provider error

### Requirement: Durable progress across SPX scheduler ticks
The sync SHALL save bounded scan progress so later authenticated ticks reach candidates after earlier drafts or tracking orders that remain eligible or repeatedly fail. The external scheduler contract SHALL specify how to interpret backlog and error responses without requiring a second invocation inside the same tick.

#### Scenario: Older orders stay in transit across runs
- **WHEN** more candidates are present than fit in one batch, earlier candidates stay in transit or fail, and the scheduler continues invoking sync
- **THEN** later ticks reach the later candidates using persisted progress, even after a Worker restart, and earlier candidates can be revisited in a subsequent scan

#### Scenario: Time runs out before all selected work starts
- **WHEN** a tick reaches its deadline with untouched candidates remaining
- **THEN** checkpoint progress does not skip candidates the tick did not attempt, and the response identifies known deferred work
