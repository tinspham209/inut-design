# Search Grouped Query Count

Environment: local deterministic cache/query harness; 2026-11-23. `client.fetch` is instrumented and no external Sanity requests occur.

- Cold corpus refresh: 1 grouped dynamic-source read.
- Warm read: no additional grouped read.
- After configured 24-hour expiry: one additional grouped read.
- Cache TTL: 86,400 seconds.
- Harness cycles: 85 homepage regenerations -> 85 grouped reads.
- External calls: 0.

Production aggregate cold starts and grouped external read totals by deployment epoch remain unknown; see `search-production-refresh.md`.
