# Contract: API Workload Classification

All 22 endpoints under `pages/api/` must be represented in the final inventory.

## Allowed dispositions

- **Optimize**: read-only/cache-safe behavior with endpoint evidence.
- **Guardrail**: add validation, bounded retry, runtime measurement, or
  documentation without changing the response/side-effect contract.
- **Unchanged**: existing behavior is correct and no material workload evidence
  exists.
- **Investigate**: endpoint could be material but lacks enough route-level
  production evidence before the release is complete.

## Required classification fields

- Route
- Purpose and allowed methods
- Caller class
- Sensitive data class (presence only; never values)
- Cache/coalescing eligibility
- Retry/idempotency behavior
- External services used
- Invocation/CPU baseline or explicit `unknown`
- Disposition and owner

## Protected endpoint classes

The following may only receive guardrail/measurement work in this release unless
new endpoint-specific evidence and explicit approval change the contract:

- Orders, checkout, quote/contact, income/cost writes
- Image uploads and design uploads
- Telegram and external notifications
- SPX synchronization/cron
- Phone validation or external identity checks
- Any endpoint with a write, asset mutation, or external side effect

## Eligible read-only candidates

Examples include public catalog/search/options reads, subject to:

- bounded query result/projection
- unchanged authorization/method checks
- unchanged response shape
- no sensitive value in evidence
- route-level before/after CPU evidence

## Failure behavior

- No duplicate create/write is introduced by caching or retry changes.
- Cache must never cross customer/order/design identity.
- A protected endpoint failure remains visible and is never converted to a
  successful empty response solely to improve metrics.
