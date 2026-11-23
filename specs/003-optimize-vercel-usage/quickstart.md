# Quickstart: Validate Vercel Usage Optimization

## Prerequisites

- Dependencies installed with the repository pnpm version.
- Local environment configured for public Sanity reads only when performing the
  one-time banner migration.
- No sensitive environment value is printed into validation output.
- Vercel operator access for post-deploy route metrics.

## 1. Prepare and migrate the contact banner

1. Read the published `contact-page` banner through the existing public Sanity
   client.
2. Confirm document ID
   `1006eb36-f1f9-42d6-9e86-23a8756cbd61` and asset ref
   `image-798e07a689aeb85c93aa8985772606624b15967e-1200x630-jpg`.
3. Download the current 1200px, quality-80 rendition as a deterministic JPG using
   `w=1200&q=80&fit=max&fm=jpg`, stored as
   `public/branding/contacts/contact-page-banner.jpg`.
4. Record file dimensions, hash, and source identity in the implementation
   evidence.
5. Only after the file exists, remove the page's runtime CMS access.

Expected result: the exact published banner is local and the page no longer
depends on Sanity.

## Freshness policy

| Route/content | Normal freshness | Urgent publication |
|---|---:|---|
| Homepage and blog | 10 minutes | Routine CMS update within the same 10-minute window |
| Product listings/details | 24 hours | Redeploy when an immediate update is required |
| Creativa and search corpus | 24 hours | Owner-triggered Production redeploy; visible within 15 minutes |
| `/contact` banner | Repository/deployment managed | Update the versioned asset in an approved code change |

## 2. Run static checks

```bash
rtk pnpm lint
rtk pnpm build
```

Expected build-route evidence:

- `/` is ISR with `600 Seconds`.
- `/contact` is `○` static.
- `/contact/form` remains `○` static.
- No lint or type/build failure caused by the change.

## 3. Validate grouped page reads

Use a focused build-time or instrumented test invocation to verify:

- exactly one `client.fetch` operation returns `banner`, `products`, `macnuts`,
  and `lighters`;
- each product list keeps the existing limit and order;
- the data reaches homepage sections in the same shape;
- product listings perform one grouped read rather than four independent reads;
- lighter detail does not fetch the same type twice;
- a failed query remains explicit and is not transformed into a successful
  empty page without evidence.

Expected result: homepage and each product listing use one grouped content
operation; product detail fan-out is at least 25% lower.

## 4. Validate `/contact` visually and operationally

1. Start the local production server after build.
2. Capture `/contact` at desktop and mobile viewport sizes.
3. Compare with the pre-change screenshots for banner crop, section position,
   metadata, and visible text.
4. Inspect browser network traffic:
   - no Sanity API request from `/contact`;
   - no `/contact` runtime page-data request triggered after static load;
   - contact links and analytics controls remain present.
5. Navigate to the quote form, but do not submit real customer information.

Expected result: no material visual difference and no runtime CMS dependency.

## 5. Validate search and Creativa freshness

1. Run representative searches for exact product names, categories, empty
   results, malformed input, and known static pages.
2. Compare results/counts before and after corpus grouping.
3. Confirm dynamic corpus source operations drop from five to one per refresh.
4. Confirm normal search/Creativa freshness policies are 24 hours.
5. For an urgent approved change, open the project's Vercel Deployments page,
   select the latest approved commit, and trigger a new Production deployment.
   Confirm the deployment is newly created and Ready, then verify the changed
   Creativa page and search result against that deployment URL with browser and
   process caches bypassed. Record the deployment epoch and elapsed time; the
   change must be visible within 15 minutes. Do not treat the existing
   deployment or an old warmed corpus process as proof.
6. Verify Creativa unavailable states and blocking fallback for a new slug.

Expected result: search parity, no per-request corpus rebuild, and documented
urgent publication without 60-second Creativa regeneration.

## 6. Validate `/contact/form` background requests

1. Open a neutral public page in production mode.
2. Observe the network for a complete idle interval.
3. Refresh once and count automatic requests to `/contact/form`.
4. Click each quote CTA and confirm immediate navigation and preserved query
   values.

Expected result: one unchanged session does not create repeated interval-style
background requests. Click navigation remains functional.

## 7. Inventory and validate APIs

Create the [API workload contract](./contracts/api-workload-contract.md) record for
all 22 endpoints and verify:

- allowed method and caller
- sensitive-data class and cache eligibility
- retry/idempotency behavior
- baseline `invocations`/CPU or explicit `unknown`
- disposition: optimize, guardrail, unchanged, or investigate

Do not optimize a write/upload/notification/order endpoint merely to reduce
metrics. If a read-only endpoint is changed, retain before/after route evidence.

## 8. Run protected regressions

Use existing focused browser flows for:

- homepage navigation and product discovery;
- product detail to quote CTA;
- contact form rendering and validation without successful submission;
- cart persistence, builder entry, and critical checkout UI (do not create a
  real order).

The full `scripts/regression-test-quote-form.sh` is intentionally not part of
default acceptance because successful submissions create real Sanity documents
and send Telegram notifications. The same rule applies to order and external
notification endpoints.

## 9. Compare deployed Production evidence

After deployment, capture an equivalent Production-only window using the
[evidence contract](./contracts/evidence-contract.md):

- `/contact` Function invocations;
- `/` Function invocations and Active CPU;
- Sanity external-call count per homepage regeneration;
- 5xx/error rate;
- `/contact/form` request pattern and cache state.

Expected acceptance:

- zero `/contact` Function invocations;
- ≤85 Sanity reads for 85 equivalent homepage regenerations;
- one grouped search operation per 24-hour corpus refresh;
- Creativa uses a 24-hour normal generation cadence with an urgent publication
  path;
- 17 page data-fetch modules and 22 API endpoints represented in evidence;
- ≤3-hour normalized monthly CPU projection;
- no regression in public 5xx rate;
- no repeated `/contact/form` automatic request.

## Completion stop

Proceed to task generation only after the plan artifacts pass review. Proceed
to implementation completion only when all build, browser, and deployed
Production evidence gates above are retained.
