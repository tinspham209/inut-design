# API Function Workload Inventory

Source inventory: all route modules under `pages/api/` at revision `206a986`. Vercel invocation and Active CPU baselines are unknown for every endpoint. Caller, sensitivity, method and side-effect classifications are source-audit categories; exact route auth/method details must follow each handler and shared helper. No protected endpoint is optimized by this feature.

| Endpoint | Method | Purpose / likely caller | Sensitivity class | Baseline | Disposition |
|---|---|---|---|---|---|
| /api/costs/create | POST | Internal cost write; caller: internal/owner integration | Financial/business data | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail |
| /api/creativa/catalog | GET | Creativa public catalog; caller: browser | Public catalog | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Investigate; read-only, no route CPU evidence |
| /api/creativa/options | GET | Creativa public options; caller: browser | Public catalog | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Investigate; read-only, no route CPU evidence |
| /api/creativa/orders/[publicId] | GET | Creativa order lookup; caller: browser | Order/customer data | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail; identity-sensitive |
| /api/creativa/orders/analytics-claim | POST | Claim order analytics; caller: browser | Order identifiers/analytics state | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail |
| /api/creativa/orders | POST | Create Creativa order; caller: browser | Order/customer/payment state | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail; idempotency contract |
| /api/creativa/orders/resolve | POST | Resolve Creativa checkout/order; caller: browser | Order/customer/payment state | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail |
| /api/creativa/products/[slug] | GET | Creativa product read; caller: browser | Public catalog | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Investigate; read-only, no route CPU evidence |
| /api/creativa/quote | POST | Calculate Creativa quote; caller: browser | Design/quote inputs | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail; no submission fixture |
| /api/cron/sync-spx-orders | POST | SPX synchronization; caller: internal/owner integration | Order/shipping data | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail; external side effects |
| /api/income/create | POST | Create income record; caller: internal/owner integration | Financial data | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail |
| /api/keychain/designs/[id] | GET | Read saved keychain design; caller: browser | Private design state | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail; identity-sensitive |
| /api/keychain/designs | POST | Save keychain design; caller: browser | Private design state | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail |
| /api/keychain/uploads | POST | Upload design asset; caller: browser | Uploaded image/design | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail; body size limit |
| /api/orders/lighters | POST | Create lighter order; caller: browser | Order/customer data | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail; idempotency contract |
| /api/quote-request | POST | Create quote request; caller: browser | Contact/design data | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail; no real submission |
| /api/sanity/upload-image | POST | Upload image asset; caller: browser | Uploaded image | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail; external mutation |
| /api/search | GET | Search API pagination; caller: browser | Public search query/result data | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Investigate; read-only, no route CPU evidence |
| /api/telegram/send-abandoned-checkout-notification | POST | Send abandoned checkout notice; caller: browser | Notification/order data | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail; external side effect |
| /api/telegram/send-order-notification | POST | Send order notice; caller: browser | Notification/order data | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail; external side effect |
| /api/telegram/send-quote-notification | POST | Send quote notice; caller: browser | Notification/contact data | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail; external side effect |
| /api/validate-phone | POST | Validate phone/contact input; caller: browser | Phone number | invocations/Active CPU: unknown; method, auth, response shape, retry/idempotency must remain unchanged | Guardrail; third-party validation |

**Retry / idempotency:** no retries or cache behavior are introduced for any endpoint. The Creativa order-submit route already passes the `idempotency-key` through to its service; lighter order creation has its existing idempotency behavior. All other retry semantics remain exactly as implemented and are not altered. External service categories from source inspection are Sanity reads/writes, Telegram notifications, SPX carrier synchronization, and phone validation. The cron route accepts `POST` only and is not invoked in validation.

**Class dispositions:** catalog/options/products/search GETs are read-only candidates but remain `investigate` until endpoint-specific Production CPU evidence exists. Orders, checkout, contact/quote, income/cost writes, uploads/designs, notifications, synchronization, and phone validation remain guardrail/regression-only. Evidence records only presence/class, never values.

## Required endpoint classification fields (T092–T104)

For each row above, cache/coalescing eligibility is **no change in this release**. Read-only public catalog/options/product/search routes are candidates only; endpoint-level Production CPU evidence was unavailable, so no API endpoint was optimized. Every write, identity-sensitive read, upload, notification, sync, and phone-validation route is non-cacheable for this scope. Retry behavior is unchanged; no new retry or idempotency behavior was added. Exact auth and response behavior remain source-defined and unchanged. Owner for unresolved endpoint evidence: Inut Design service owner.

| Endpoint class | External service / state | Cache/coalescing | Retry / idempotency | Disposition rationale |
|---|---|---|---|---|
| `/api/creativa/catalog`, `/api/creativa/options`, `/api/creativa/products/[slug]` | Sanity read | Candidate; no API change absent route evidence | Existing behavior unchanged | Investigate |
| `/api/search` | Local search data / Sanity-backed content as defined by handler | Candidate; no API change absent route evidence | Existing behavior unchanged | Investigate |
| `/api/creativa/orders/[publicId]`, `/api/keychain/designs/[id]` | Order/design persistence | Identity-sensitive; never shared-cache | Existing behavior unchanged | Guardrail |
| Create/resolve/claim/order, quote, cost, income routes | Order, quote, or business persistence | No cache | Existing idempotency unchanged; no requests submitted | Guardrail |
| `/api/keychain/uploads`, `/api/sanity/upload-image` | Sanity asset mutation / upload storage | No cache | Existing behavior unchanged; no upload issued | Guardrail |
| `/api/telegram/*` | Telegram notification delivery | No cache | Existing delivery behavior unchanged; no notification sent | Guardrail |
| `/api/cron/sync-spx-orders` | SPX synchronization and order state | No cache | Existing behavior unchanged; cron not invoked | Guardrail |
| `/api/validate-phone` | External phone-validation provider | No cache; phone values never recorded | Existing provider behavior unchanged | Guardrail |

Endpoint-level method/auth details remain those in each handler; this inventory does not claim to replace route-contract tests. All 22 paths were counted from `pages/api/`. Protected fixture execution is retained in `protected-api-matrix.md`; Production invocation and Active CPU remain unknown.
