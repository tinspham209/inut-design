
> inutdesign-web@3.1.0 regression:spx /Users/tin.phamv/work/personal/inut-design
> node --import ./scripts/register-typescript-loader.mjs ./scripts/test-spx-sync.mjs

✓ parses raw, lowercase, URL-key, named, and encoded SPX inputs
✓ rejects wrong hosts, protocols, whitespace, ambiguity, and oversized codes
✓ accepts repeated occurrences of the same SPX code
✓ normalizes delivered and returning fixtures without PII
✓ cancels only for canonical Return/Returned; Returning and description-only text never cancel
✓ treats a Delivered group with Returned subgroup as a conflict, never cancels or completes
✓ selects the newest valid record independently of array order
✓ fails safe for equal-timestamp Delivered and Return events in either order
✓ rejects mixed valid and invalid timestamps before completion
✓ classifies retcode, empty records, missing fields, timestamps, and conflicts
✓ uses the fixed endpoint and retries one transient HTTP failure
✓ classifies timeout, network, HTTP, and invalid JSON failures deterministically
✓ builds a dedicated marker-free SPX snapshot
✓ migrates one valid legacy block with minimum boundary cleanup
✓ leaves partial, reversed, nested, and duplicate legacy markers untouched
✓ sanitizes marker injection, controls, multiline text, and length
✓ formats SPX event time at a deterministic GMT+7 date boundary
✓ makes deterministic no-op, tracking-change, error, and recovery decisions
✓ builds one atomic delivered decision with valid legacy migration
✓ updates and completes despite malformed legacy markers
✓ provider errors preserve the last successful notes
✓ builds one atomic cancellation decision only for canonical Return/Returned
✓ keeps Return/Returning in_transit and never cancels on description text alone
✓ reconciles a stored Return/Returned order to cancelled even with unchanged metadata and note
✓ enforces published-only discovery, overflow sentinel, and bounded concurrency
✓ builds a revision-guarded atomic draft publish transaction
✓ runs cleanly with no drafts and no eligible SPX orders
✓ publishes drafts before SPX discovery so new records participate
✓ bounds concurrent Sanity draft publish mutations
✓ continues SPX work after a draft conflict and returns compact non-PII failure output
[SPX Sync] Sanity draft discovery failed: SANITY_DRAFT_QUERY_ERROR
✓ aborts after draft discovery failure and sends one Sanity publish alert
✓ reports capacity overflow after publishing without processing SPX orders
✓ combines draft-publish and SPX failures into one alert and prefers HTTP 500
✓ aggregates malformed legacy markers as non-provider attention
✓ aggregates cancelled orders into the cron summary with a compact Return/Returned result
✓ strips crafted SPX metadata from order creation input
✓ classifies auth, HTTP policies, revision conflicts, and Sanity timeouts
✓ formats one bounded HTML-safe Telegram alert with ten-order cap
✓ groups multiple failure categories for the same affected order
✓ validates dedicated server-only Telegram credentials
✓ bounds Telegram retries, request timeout, and insufficient budget
✓ keeps route auth before external calls and Sanity mutations guarded/change-only

SPX regression passed: 42 deterministic checks
