# Phase 0 Research: Whole-Project Vercel Optimization

## Decision 1: Treat the 12-hour sample as a lead, not a complete scope

**Decision**: Audit every page and API route because short "All Environments"
evidence cannot prove monthly Production absence.

**Rationale**: A full build confirms 17 page data-fetch modules, 22 API
Functions, and multiple repeated ISR patterns absent or truncated from the
screenshots. Feature 003 must close those known repository risks in one release.

**Alternatives considered**: Fix only `/`, `/contact`, and `/contact/form`.
Rejected because `/search`, Creativa, and product/listing routes share the same
regeneration or query-fan-out failure modes.

## Decision 2: Use repository-owned static `/contact`

**Decision**: Archive the live 1200px/quality-80 contact banner as deterministic
JPG and remove page data fetching.

**Rationale**: It removes a confirmed 300-second ISR Function path and the
clarification explicitly chose code/deployment ownership.

**Alternatives considered**: 15-minute CMS ISR or one-hour CMS ISR. Both retain
unnecessary visitor-triggered compute and contradict the chosen publication
policy.

## Decision 3: Group homepage and listing reads

**Decision**: One grouped Sanity operation per route refresh for homepage and
product listings.

**Rationale**: The homepage's 4× fan-out exactly correlates with the 340-call
sample. Listings have the same items/count/type/banner pattern and can preserve
all existing projections/order.

**Alternatives considered**: Process-local memoization, fetching all products,
or a new cache service. Rejected as less deterministic under serverless instance
churn or as unnecessary infrastructure.

## Decision 4: Use 24-hour Creativa and search freshness

**Decision**: Creativa ISR and search corpus normal freshness are 24 hours;
owner-triggered deploy/publication is required for urgent changes.

**Rationale**: The operator clarified these products are uploaded by the owner
and can be deployed deliberately. This removes 60-second and per-instance
freshness pressure while retaining a 15-minute urgent path.

**Alternatives considered**: 10 minutes/15 minutes. Rejected after clarification
because the accepted content policy explicitly prefers a one-day normal delay.

## Decision 5: Consolidate search corpus into one external read

**Decision**: One aliased query returns the five current dynamic groups; local
blog and static corpus sources remain local.

**Rationale**: The current only request-time page renderer performs five
Sanity reads on a cold process-local cache. Grouping reduces network fan-out and
is easier to count; a 24-hour policy reduces rebuild frequency.

**Alternatives considered**: Make `/search` ISR for every possible query.
Rejected because query combinations and filters are dynamic and the current
route's CDN cache can still serve repeat normalized URLs. Client-only search is
deferred because SEO/API behavior and corpus exposure would change.

## Decision 6: Retain product 24-hour freshness but reduce duplicate reads

**Decision**: Preserve blocking fallback and 86,400-second revalidation while
combining related item/type/banner/detail reads.

**Rationale**: These routes are low frequency but high-coverage, and Vercel data
already shows product routes in the top table. Removing duplicate type fetches
and grouping list data is low risk.

**Alternatives considered**: Pre-generate every slug. Rejected because catalog
growth increases build work and latency without addressing repeat fetches.

## Decision 7: Use 10-minute homepage/blog refresh

**Decision**: Move only these short-interval CMS routes from 5 to 10 minutes.

**Rationale**: The clarified 10-minute freshness requirement matches the
600-second ISR window and cuts demand-triggered regeneration opportunities in
half.

**Alternatives considered**: 15 minutes. Rejected because it exceeds the
accepted normal freshness window.

## Decision 8: Disable quote-form prefetch narrowly

**Decision**: Disable automatic Next Link prefetch for `/contact/form`, but not
global prefetch.

**Rationale**: No polling loop exists, and prefetch is a plausible background
request source. Narrow disabling preserves fast navigation to other public
pages.

**Alternatives considered**: Disable all Link prefetch or replace links with
anchors. Rejected as broader and likely harmful to navigation UX.

## Decision 9: Inventory all APIs; optimize only safe read paths

**Decision**: All 22 API Functions receive an inventory and workload budget;
only read-only/cache-safe endpoints with evidence may be optimized in code.

**Rationale**: Protected writes, uploads, notifications, synchronization, and
order flows are constitutional contracts. Their invocation volume is unknown
and a metric-only rewrite is unsafe.

**Alternatives considered**: No API work or unrestricted API optimization.
Rejected because one ignores possible CPU consumers, while the other creates
commerce/security regression risk.

## Decision 10: Defer `_document` rewrite until evidence requires it

**Decision**: Measure shared Emotion rendering as a separate CPU component and
do not refactor it in the first release.

**Rationale**: It affects all SSR/ISR and carries hydration/visual risk, but the
current source does not quantify its CPU contribution. The narrower P0/P1
changes are verifiable first.

**Alternatives considered**: Remove custom Emotion extraction. Rejected without
route-level evidence because it risks every MUI page.
