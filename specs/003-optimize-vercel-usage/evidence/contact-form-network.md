# `/contact/form` Idle Network Classes

Environment: local production build, agent-browser. Unchanged session from `2026-11-23T04:52:29Z` to `2026-11-23T05:02:42Z` (10 minutes 13 seconds). Request logging was cleared after initial page load and no interaction occurred during the interval.

| Request class | Initial page-load resources before interval | Automatic requests during 10m13s idle |
|---|---:|---:|
| Document | 1 | 0 |
| Next data | 4 (prefetches for `/`, `/san-pham`, `/services`, `/blog`; none for `/contact/form`) | 0 |
| Script/chunk (`/_next/static/*.js`) | 49 | 0 |

The browser network log reported no requests during the idle interval. Resource Timing totals above describe initial navigation and header prefetches before the interval; they are not counted as idle requests. No external monitor or user action occurred. The result is local browser evidence, not Production traffic evidence.
