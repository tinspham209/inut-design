# Contract: Runtime & Public Interfaces

## Scope

This contract applies to the 74-page public surface and all 22 routes under `pages/api/`. It records invariants; it does not replace implementation-level schemas.

## Common Worker Contract

- Incoming method, auth, origin and body limit behavior stays at least as strict as baseline.
- Required secret values stay server-only and are never included in client bundles, public JSON, source maps or logs.
- Errors must be explicit 4xx/5xx; no success-shaped fallback hides failure.
- Write requests preserve Sanity `_ref`, `_type` and unique array `_key` requirements.
- Retries are safe or explicitly idempotent for external writes and cron operations.
- Preview and production use explicit allowed-origin lists; wildcard production CORS is not allowed.
- Caller class is part of the contract. Anonymous browser callers, trusted scheduler/internal callers and build-time clients are not treated as the same security model.
- A browser-visible value is never treated as a secret API credential, regardless of its historic header contract.

## API Route Matrix

| API Group | Routes | Contract Focus |
|---|---|---|
| Orders | `/api/orders/lighters` | customer fields, pricing, `_key`, refs, Sanity persistence, confirmation |
| Financial | `/api/costs/create`, `/api/income/create` | server auth/validation and no test production write |
| Quote/contact | `/api/quote-request`, `/api/validate-phone` | field, phone, method and notification response parity |
| Notifications | `/api/telegram/send-order-notification`, `send-abandoned-checkout-notification`, `send-quote-notification` | no-op/mocked test provider, retries, timeout, payload allow-list |
| Keychain | `/api/keychain/uploads`, `/api/keychain/designs`, `/api/keychain/designs/[id]` | upload binary/JSON behavior, read/write shape, validation and persistence |
| Sanity upload | `/api/sanity/upload-image` | server token, MIME/signature/size, asset reference |
| Search | `/api/search` | GET only, 400 invalid query, 503 unavailable, pagination/result shape; retained but removed from `/search` runtime path |
| Creativa public | `/api/creativa/catalog`, `/api/creativa/options`, `/api/creativa/products/[slug]` | public result shape, caching policy, 404/5xx parity |
| Creativa order | `/api/creativa/orders`, `/api/creativa/orders/[publicId]`, `/resolve`, `/analytics-claim`, `/api/creativa/quote` | lookup/create/resolve/analytics contract, public IDs, idempotency and safe tests |
| Scheduler | `/api/cron/sync-spx-orders` | exact canonical endpoint, scheduler auth, timeout, idempotency, notification and concurrent limits |

## Keychain Upload Contract

### Request

- Method: `POST`
- Body: JSON containing `data`, `contentType`, `filename`.
- Accepted MIME: `image/png`, `image/jpeg`, `image/webp`.
- Encoded-body limit stays bounded by the current 14 MB API parser setting; decoded image limit stays 10 MB.

### Browser Preprocessing

Before request, the browser:
- resizes to the approved maximum dimensions without upscaling;
- encodes a supported output;
- exposes actionable validation errors without uploading sensitive source data.

### Worker Validation

Before persistence, the Worker:
1. validates Base64 input shape;
2. validates declared MIME;
3. checks decoded byte length;
4. verifies PNG/JPEG/WebP byte signature;
5. validates actual format, width, height and pixel count;
6. sanitizes filename;
7. validates persistence result/reference.

### Responses

- `415`: unsupported MIME.
- `413`: encoded or decoded size exceeds limit.
- `400`: malformed image, signature mismatch or dimension/format violation.
- `429`: existing rate control exceeded.
- `200`: `{ image: { _type, asset: { _ref, _type } }, url }`.
- `500`: persistence/unexpected failure without secret or raw payload disclosure.

No native `sharp` import may exist in the Cloudflare Worker bundle.

The format/dimension validator must be bounded before accepting full decoder allocation. Test inputs include valid PNG/JPEG/WebP, JPEG/PNG/WebP signature mismatch, trailing/ignored Base64 bytes, malformed chunks, enormous declared dimensions, decompression-bomb metadata and polyglot files. Invalid input must fail before Sanity persistence is attempted.

## Raw-Body Contract

The following Creativa POST endpoints retain their public method/status/error contract while using a runtime-safe request-byte reader:

- `/api/creativa/orders`;
- `/api/creativa/orders/resolve`;
- `/api/creativa/orders/analytics-claim`;
- `/api/creativa/quote`.

Rules:
- maximum JSON body remains 65,536 bytes;
- `Content-Type` remains JSON;
- under-limit valid JSON, exactly-at-limit JSON, over-limit chunks, malformed UTF-8/JSON and aborted streams return the documented response;
- runtime conversion from `Buffer` to `Uint8Array` or Web APIs must not silently change byte boundaries or auth payloads;
- raw-body limits are enforced on actual accumulated bytes, not only `Content-Length`.

## Caller & Secret Contract

### Anonymous Browser Routes

Phone and notification flows currently called from browser code:
- preserve method/body/field validation and outward success/error semantics;
- require an allowed origin and JSON content type for POST;
- retain rate limits and explicit side-effect mocks for tests;
- remove `NEXT_PUBLIC_X_API_KEY` and do not introduce a replacement secret in the browser.

The effective browser boundary must be at least as strict as the legacy flow. A client-exposed key is not counted as authentication evidence.

### Trusted Scheduler/Internal Routes

- SPX continues to require the server-only `SPX_SYNC_SECRET` and timing-safe comparison.
- Any future internal call uses a separately named Worker secret.
- Internal/scheduler secret names and values are absent from browser chunks, source maps, public responses and logs.

### Telegram/Sanity Credentials

- Bot token, Telegram chat ID and Sanity write token remain Worker secrets.
- Exposed `NEXT_PUBLIC_TELEGRAM_*` credentials are rotated as part of remediation.
- Renaming without rotation does not satisfy this contract.

## `/search` Static Contract

- The page is a static shell, not `getServerSideProps`.
- Build emits a versioned public index with only approved searchable fields.
- Browser path parsing, filtering, pagination, loading/error/empty state and keyboard behavior preserve existing UX.
- The page must not call `/api/search` for normal result loading.
- Query text is not added to analytics beyond the approved sanitized event contract.
- Draft/unpublished/private/content fields fail the index build rather than being silently copied.

## Public Dynamic Route Contract

Blog, service, product and Creativa detail paths:
- enumerate all published slugs at build time;
- use `fallback: false`;
- return 404 for unknown slugs;
- update only after approved rebuild/deploy;
- keep production URL, redirect, canonical and sitemap shape.

## Analytics Contract

- Remove `@vercel/analytics` component/dependency only.
- Preserve GA4/GTM and Umami events from the existing wrappers.
- Emit action/page events at most once per provider from their source.
- Strict Mode, navigation, initial load and bfcache flows must not duplicate.
- Prohibited fields: secrets, customer contact, uploaded image content, asset/source URLs, design identifiers, sensitive query values and share links.

## Runtime Limits Contract

- Worker isolate memory must remain below 128 MB for all release-gate requests.
- Build artifact must remain below the current 64 MiB Worker size limit.
- No route silently raises Cloudflare CPU limits; measured runtime evidence is required first.
- Worker logs preserve actionable error/timing context but redact body, auth, customer and file content.
- Worker module graph must not contain native `sharp`, filesystem/path modules reachable at request time, IMG.LY/ONNX while the feature flag is false, or development/test-only generators.

## Contract Verification

For every API route, retain:
- baseline request fixture or read-only request;
- expected method/status/header/body semantics;
- local Next result;
- local Vinext Worker result;
- preview Worker result;
- side-effect assertion proving test did not create a real order, notification, upload or Sanity write.

Production route/API parity is a release blocker when any protected field, status, authorization or side effect differs.
