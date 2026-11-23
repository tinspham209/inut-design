# Search Isolated and Production Refresh Evidence

Isolated local harness: one grouped source read per cold corpus refresh; warm calls coalesce/cache; configured TTL is 86,400 seconds. The harness is deterministic and issues no external service calls.

Production aggregate cold-start grouped reads, unique deployment epoch, and total corpus refresh count: **unknown**. No Production deployment epoch is inferred from local or All-Environments data. This item remains an explicit evidence gap.
