# Product Content and Read-Count Parity

Source and browser review, local production build, 2026-11-23. Representative product list and lighter detail loaded with expected titles. Existing data types, image projections, sort order, first-ten static paths, and blocking fallback remain in source.

| Workload | Baseline source reads | Current source reads | Change |
|---|---:|---:|---:|
| Laptop/Macnut listing | 4 | 1 grouped read | 75% fewer |
| Lighter listing | 4 | 1 grouped read | 75% fewer |
| Laptop/Macnut successful detail | 3–4 | 2 | 33–50% fewer |
| Lighter successful detail | 3–4 | 2 | 33–50% fewer |

The reduction is a source/query-shape comparison, not a measured Production CPU result. Browser validation is limited to representative rendered pages; full CMS parity across every product document is not established by this local run.
