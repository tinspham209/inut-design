# Supplied Vercel Baseline and Limits

Source: `inputs/INUT_VERCEL_CPU_HANDOFF.md`, owner-provided Vercel screenshots.
Captured before implementation; the screenshots are explicitly **All Environments**,
not a Production-only route ranking. The sample covers about 12 hours and does not
represent the complete monthly workload. Historical Hobby runtime logs retain about
one hour, so the old request identities and 12-hour route events are unavailable.

| Signal | Supplied observation |
|---|---:|
| Included Fluid Active CPU | 4 hours/month |
| Usage screenshot | 4h 57s / 4h (100% warning) |
| Invocations | 207 earlier; 210 later |
| Error rate / timeouts | 0% / 0% |
| Active CPU avg / P75 / P95 | 488 / 530 / 624 ms |
| CPU throttle avg / P75 / P95 | 9.2 / 10.9 / 11.7% |
| Runtime environment | All Environments; HKG1; CPU Standard; Fluid enabled |

## Visible route ranking (All Environments, incomplete)

| Route | Invocations | Active CPU |
|---|---:|---:|
| `/` | 85 | 37 s |
| `/contact` | 4 | 35 s |
| `/san-pham/skin-laptop/[slug]` | 44 | 8 s |
| `/san-pham/lighters/[slug]` | 31 | 5 s |
| `/_next/data/[buildId]/san-pham/skin-laptop/[slug].json` | 19 | 2.59 s |

The route list contains only its first page of four; it cannot prove the five
highest Production routes. The Vercel MCP observability query currently returns
HTTP 400 for supported project-scoped requests. Therefore no Production route
set was frozen before implementation. The five visible rows above are candidate
routes for later investigation only; they must not be used as the SC-002 frozen
set or represented as Production data. The pre-implementation ordering gate was
missed and remains an explicit evidence gap.

The `85 × 4 = 340` homepage external-read relationship is a strong source/code
correlation, not proof that waiting on those reads contributes equal Active CPU.
The `/contact` CPU cause is not localized. No monthly normalization or post-change
Production result is supplied here.
