# Search Parity Review

Environment: local production build, agent-browser and source review, 2026-11-23.

- Common query `q=skin` returns the search route and expected page title.
- Grouped source projections retain current product, Creativa, service, and blog searchable fields and facet inputs.
- Empty/static/malformed behavior remains in handler branches; malformed input is `private, no-store`, and valid repeatable search uses 24-hour CDN/SWR headers.
- Query output and facet counts are source-compatible by field projection review; no Production search corpus or update was changed during this validation.

Search corpus refresh count is verified by the local deterministic harness. Production aggregate cache misses remain unknown.
