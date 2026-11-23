# Homepage Grouped Read Count

Environment: local deterministic harness; 2026-11-23. The harness replaces `client.fetch` and does not contact Sanity or another external service.

Command: `node --import ./scripts/register-typescript-loader.mjs scripts/verify-grouped-content-reads.mjs` with local environment loaded privately.

Result: 85 equivalent homepage regeneration calls produced 85 grouped homepage reads (one Sanity operation per regeneration). Blog data remains a separate local read. Search harness also reported one grouped read per corpus refresh, one warm read, and a second read after the 24-hour TTL. External calls made by the harness: 0.

This verifies query grouping and cache behavior in-process, not Production CPU.
