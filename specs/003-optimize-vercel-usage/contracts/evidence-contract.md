# Contract: CPU Optimization Evidence

The completion comparison uses route-level operational metrics, not personal or
payload data.

## Required fields

```json
{
  "environment": "production",
  "windowStart": "ISO-8601",
  "windowEnd": "ISO-8601",
  "route": "/contact",
  "invocations": 0,
  "activeCpuMs": 0,
  "externalApiCalls": 0,
  "errorRate": 0,
  "cacheStatus": "static",
  "notes": "Equivalent production workload"
}
```

## Comparison rules

- `environment` must be `production` for acceptance.
- Route and normalized request workload must be equivalent before and after.
- "All Environments" screenshots are supporting evidence only.
- CDN request counts and Function invocation counts must not be conflated.
- Homepage external API calls are compared per regeneration, not per visitor.
- Active CPU must be retained as observed; network wait time or function duration
  alone is not a substitute.
- A `0%` 5xx rate is not evidence of low CPU by itself.
- Freeze the five highest aggregate Active CPU public routes from the
  Production baseline before implementation; compare their summed CPU for the
  same normalized workload. The target is at least 40% lower. The supplied
  All-Environments screenshots cannot establish this Production ranking.
- Latency collection spans 12 continuous Production hours with at least 25
  normal requests for each frozen route plus `/search`. Document a synthetic
  request supplement if Production request volume is insufficient; do not
  replace the Production sample.
- Compare malformed, missing, and unavailable-content Active CPU with one
  normal request for the same route. Each failure class must stay at or below
  that normal-request CPU, without hidden errors or unbounded retries.
- During a 10-minute idle `/contact/form` session, count automatic document,
  Next data, and script/chunk requests independently. Exclude requests tied to
  a user action and identify external monitors separately.
- Search evidence separates one isolated corpus environment (refresh count and
  grouped external read count) from Production aggregate cold-start grouped
  reads by deployment epoch.
- Record blog external content operations per equivalent regeneration with
  the 10-minute homepage/blog freshness result.
- Report CPU budget state as within budget below 75%, warning from 75% through
  89.9%, escalated at 90%, and failed at 100%. Unknown Production metrics remain
  `unknown` and cannot pass an acceptance criterion.

## Forbidden evidence

- Contact names, phones, email addresses, or form contents.
- Uploaded designs, asset URLs tied to a customer, or share links.
- Server tokens, API credentials, or environment values.
- Cart and order payloads.
- Raw user-agent strings unless separately approved and redacted for operator
  use.

## Acceptance matrix

| Signal | Required result |
|---|---|
| Build route `/contact` | Static (`○`) |
| Build route `/` and `/blog` | ISR with 600-second revalidation |
| Build routes `/creativa*` | ISR with 86,400-second revalidation where applicable |
| Homepage Sanity operations | One per regeneration |
| Search Sanity operations | One grouped operation per 24-hour corpus refresh |
| Product list/detail operations | At least 25% fewer for equivalent refresh work |
| `/contact` Production Function invocations | Zero |
| `/contact` local banner | Present and visually equivalent |
| `/contact/form` automatic prefetch | No repeat in unchanged session |
| Page workload inventory | 17/17 page data-fetch modules represented |
| API workload inventory | 22/22 Function endpoints represented |
| Protected API behavior | Unchanged unless separately approved |
| Protected-flow regression | No visitor-visible change |
| Production 5xx | No higher than baseline |

## Protected API fixture classes

The retained matrix must cover read-only catalog/search, order/checkout,
contact/quote, upload/design, notification, synchronization/cron, and
validation endpoints. For each class, record method handling, authorization or
caller guard, response shape, retry/idempotency behavior, and sensitive-data
presence. Use fixtures or rejected/invalid requests only; do not submit an
order, quote, upload, notification, or synchronization action.
