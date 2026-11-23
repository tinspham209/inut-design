# Feature Specification: Optimize Vercel Usage

**Feature Branch**: `main` (no dedicated branch requested)

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "new spec for feat 003, optimize this website. I
received a Vercel warning that the free team had used 100% of its included Fluid
Active CPU (4 hours) and could be paused in 24 hours. Vercel logs show 207
invocations in the selected 12-hour window, 0% errors, and concentrated usage
across public website entry paths, including the home page and content data
paths; performance metrics also show outlying slow requests. Expand the fix to
all confirmed similar repository patterns because the available traffic data
covers only 12 hours." Supporting investigation:
[`inputs/INUT_VERCEL_CPU_HANDOFF.md`](./inputs/INUT_VERCEL_CPU_HANDOFF.md) and
[`inputs/WHOLE_PROJECT_AUDIT.md`](./inputs/WHOLE_PROJECT_AUDIT.md).

## Investigation Summary

- The latest production deployment is ready and all three priority pages (`/`,
  `/contact`, `/contact/form`) returned HTTP 200 during the audit. The warning
  identifies imminent risk, not a confirmed current outage.
- **Confirmed:** each homepage regeneration performs four independent public
  content-source reads. The observed 85 homepage function invocations exactly
  explain the 340 external content reads in the same 12-hour sample.
- **Confirmed:** `/contact` uses a 300-second regeneration window for a single
  changing image even though the rest of the page is static. Four regenerations
  account for roughly 35 seconds of the observed Active CPU.
- **Confirmed:** `/contact/form` is statically delivered and has no repeating
  request loop in its code. Its periodic GET pattern remains attributed as an
  external requester, navigation prefetch, or another unclassified source until
  requester metadata is obtained.
- **Confirmed whole-project scope:** `/search` is the only request-time page
  renderer and can build a five-read corpus on a cold local cache; Creativa
  refreshes three public page types every 60 seconds and performs two reads per
  refresh; product listing pages perform four reads per 24-hour refresh;
  product detail pages perform 3–4 reads; `/blog` repeats one-read regeneration
  every 5 minutes.
- **Confirmed Function boundary:** 22 API endpoints are function-backed by
  purpose. This feature inventories and bounds their workload without changing
  protected submission, upload, order, notification, or external
  synchronization contracts absent endpoint-specific evidence.
- **Verification gap:** historical requester metadata and a per-operation trace
  of the reported 7–9-second `/contact` CPU samples are unavailable on the
  current log retention window.

## Clarifications

### Session 2026-11-23

- Q: Chính sách cập nhật banner `/contact` là CMS 15 phút, tài nguyên trong mã
  nguồn hay CMS tối đa 1 giờ? → A: Phương án B - lưu banner trong mã nguồn; cập
  nhật qua code và deployment.
- Q: Khi cập nhật sản phẩm hoặc tùy chọn Creativa, độ trễ tối đa được chấp nhận
  là bao lâu? → A: Tối đa 1 ngày; chủ sở hữu có thể chủ động trigger deploy khi
  cần xuất bản ngay.
- Q: Search corpus được phép trễ tối đa bao lâu so với nội dung đã publish? → A:
  Tối đa 1 ngày; owner chủ động deploy để cập nhật ngay khi cần.
- Q: Ranh giới tối ưu cho 22 Function API là gì? → A: Inventory toàn bộ; tối ưu
  read-only/cache-safe khi có evidence; endpoint ghi dữ liệu chỉ guardrail và
  regression trong release này.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Keep the public website available all month (Priority: P1)

A visitor opens product, blog, builder, or contact pages without experiencing a
hosting pause caused by monthly CPU exhaustion, including later in the billing
period when the free-plan budget is already heavily used.

**Why this priority**: A complete hosting pause blocks every visitor journey and
removes the value of any page-level optimization. Preventing quota exhaustion is
the immediate operational need identified by the Vercel warning.

**Independent Test**: Replay a representative month of observed traffic using
the recorded baseline and verify that projected CPU consumption remains below
the safety budget for the complete period without requiring a paid hosting plan.

**Acceptance Scenarios**:

1. **Given** the current monthly traffic profile and the 4-hour included CPU
   budget, **When** the full monthly workload is projected after optimization,
   **Then** consumption remains below the agreed safety budget and does not
   trigger a quota-pause warning.
2. **Given** a visitor arrives during a late-month traffic period, **When** they
   request a public page, **Then** the page remains reachable and does not return
   an unavailable response because CPU capacity has been exhausted.
3. **Given** a normal traffic burst, **When** requests temporarily increase
   above the daily average, **Then** the website remains available and usage does
   not consume the remaining monthly reserve faster than the measured budget
   allows.

---

### User Story 2 - Reduce expensive public-page work without slowing visitors (Priority: P1)

A visitor browsing frequently requested pages receives the same useful content
and interactions while the site performs less repeated work for each visit.

**Why this priority**: The Vercel data shows request volume spread across common
public paths and measurable slow outliers. Reducing repeated work on these paths
addresses both the CPU warning and the visitor experience.

**Independent Test**: Select the highest-volume public routes from the baseline,
run equivalent requests before and after optimization, and compare availability,
response time, content correctness, and CPU cost for the same inputs.

**Acceptance Scenarios**:

1. **Given** one frequently requested public page, **When** multiple visitors
   request unchanged content in a short period, **Then** the visitors receive
   equivalent page content with materially less aggregate CPU use than the
   baseline.
2. **Given** a page with a visible slow-request outlier in the baseline, **When**
   the same normal request is repeated after optimization, **Then** the response
   falls within the performance target without content or navigation loss.
3. **Given** a legitimate request with supported query parameters, **When** it
   reaches a public route, **Then** its result is equivalent to the current
   experience and is not mistaken for duplicate or abusive traffic.
4. **Given** malformed or unsupported request inputs, **When** they are rejected,
   **Then** no unnecessary expensive page work is performed and the visitor
   receives a clear, safe response.

---

### User Story 3 - Preserve freshness, discovery, and core conversions (Priority: P2)

An operator updates website content and expects visitors to see the approved
change promptly, while search visibility, analytics, builders, contact, cart,
and checkout continue to behave as they do before optimization.

**Why this priority**: Saving CPU is not acceptable if public content becomes
stale or protected business flows regress. This story preserves the website's
value while CPU work is reduced.

**Independent Test**: Publish one approved content change, verify it appears in
the defined freshness window, then run the critical visitor journeys and compare
their outcomes with the pre-change baseline.

**Acceptance Scenarios**:

1. **Given** an approved content update is published, **When** the freshness
   window elapses, **Then** the updated public content is visible without a
   manual hosting restart or a user-specific workaround.
2. **Given** a visitor follows an indexed public route, **When** the page loads,
   **Then** its canonical content, metadata, images, and internal navigation
   remain available and are not replaced by blank or placeholder content.
3. **Given** a visitor uses a builder, contact flow, cart, or checkout,
   **When** the journey is completed in a test environment, **Then** its existing
   outcome and confirmation behavior remain unchanged.
4. **Given** measurement is unavailable, **When** a visitor uses an optimized
   page, **Then** the page and its actions still work; measurement failure does
   not block content or conversion.
5. **Given** the currently published `/contact` banner still exists in the CMS,
   **When** the page is converted to repository-managed content, **Then** the
   same visual asset is downloaded and stored under `public/` before the CMS
   dependency is removed, with no visible banner change for visitors.
6. **Given** an operator publishes a normal CMS product, blog, or Creativa
   update, **When** it reaches that content type's approved freshness window,
   **Then** the page reflects it without increasing visitor-visible compute
   beyond the documented route budget.

---

### User Story 4 - Maintain an enforceable CPU budget (Priority: P2)

The website owner can determine whether optimization is holding over time and
can act before usage reaches a disruptive level.

**Why this priority**: A one-time improvement can regress as pages, bots, or
traffic change. Budget visibility turns the immediate incident into a
repeatable operating control.

**Independent Test**: Run the documented CPU budget check against a representative
period and confirm it produces a clear pass, warning, or failure result before
the platform reaches its hard limit.

**Acceptance Scenarios**:

1. **Given** usage is below 75% of the included monthly allowance, **When** the
   owner reviews the operating evidence, **Then** the check reports the site is
   within budget.
2. **Given** usage reaches the warning threshold, **When** the owner reviews the
   evidence, **Then** the affected high-cost paths and comparison baseline are
   identified so action can be taken before service disruption.
3. **Given** a release materially changes public request cost, **When** the
   release is evaluated, **Then** it is not accepted as optimization complete
   until the CPU budget and visitor regressions have been checked.
4. **Given** a public route was not visible in the 12-hour Vercel sample,
   **When** the repository audit identifies a similar regeneration or
   multi-fetch pattern, **Then** the route remains in the release inventory and
   is validated rather than excluded only for lack of recent traffic.

### Edge Cases

- A public page receives a rapid burst of repeated requests for unchanged
  content; duplicate requests must not consume the remaining monthly budget at
  a linear rate that recreates the current quota failure.
- Search engines, preview tools, health checks, or automated crawlers increase
  request volume without producing equivalent visitor value; legitimate
  discovery must remain supported without letting non-visitor traffic exhaust
  the budget unchecked.
- A content provider is unavailable or responds late; the website must preserve
  an established, non-misleading last-known experience rather than creating
  repeated expensive failures.
- A new deployment, Preview request, crawler, or internal monitor is counted in
  an "All Environments" view; optimization decisions must not treat that traffic
  as production visitor load without separating its environment and source.
- Published content is updated while previously served content is still
  reusable; stale content must expire within the defined freshness window, but
  not before its completeness is verified.
- Query strings or request paths that differ only in irrelevant values must not
  multiply work or bypass the controls that protect repeat requests.
- Traffic is lower than the baseline while CPU use is unexpectedly high, which
  indicates a change in per-request cost rather than growth in visitors.
- Traffic rises substantially while per-request cost falls; absolute availability
  and total monthly CPU still need protection rather than relying on a favorable
  single-request benchmark.
- An optimized route encounters malformed input, a missing record, or an upstream
  error; the response remains explicit and must not be reported as successful
  when the requested content or action was not delivered.
- A single visitor session opens several pages that expose the same internal
  navigation link; background loading must not repeatedly fetch one unchanged
  destination while the user is not choosing it.
- The `/contact` banner needs to change; the change MUST follow the repository
  deployment workflow rather than triggering a content-source read or visitor
  request.
- A search corpus rebuild, Creativa product change, listing refresh, detail
  fallback generation, or blog update happens concurrently; aggregate work
  remains bounded and one stale route does not multiply work across all public
  routes.
- A cart or builder URL contains session, design, or share state; optimization
  must not merge distinct visitor states or omit data required for the journey.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The feature MUST establish a repeatable baseline of monthly CPU
  consumption, public request volume, route distribution, response-time
  percentiles, and error rate using the Vercel evidence supplied for this
  specification.
- **FR-002**: The feature MUST prioritize reductions for the public paths that
  contribute the greatest aggregate request cost, rather than optimizing
  low-traffic paths only.
- **FR-003**: The feature MUST reduce repeated work for equivalent requests for
  unchanged public content while preserving visitor-visible content,
  navigation, product information, and supported interactions.
- **FR-004**: One homepage content refresh MUST consolidate the public content
  needed by the page into a single logical refresh operation; the same refresh
  MUST NOT multiply the content-source work four times for one visitor-visible
  result.
- **FR-005**: A normal visit to `/contact` MUST be served without page compute
  because its complete visible content, including its banner, is owned by the
  repository build. Banner changes are published through code and deployment,
  not through visitor-triggered content-source refresh.
- **FR-006**: The feature MUST prevent failed, malformed, duplicate, or
  non-visitor requests from unnecessarily triggering the full work of a normal
  public page request.
- **FR-007**: The feature MUST apply an explicit freshness policy by content
  type: homepage/blog CMS changes within 10 minutes, ordinary product pages
  within 24 hours, Creativa and search corpus within 24 hours with an
  owner-triggered urgent publication path, and no runtime CMS freshness window
  for the repository-managed `/contact` banner.
- **FR-008**: The feature MUST provide a clear fallback for temporarily
  unavailable content without silently presenting stale content as newly
  updated, exposing internal errors, or triggering unbounded retry work.
- **FR-009**: The feature MUST preserve current canonical public URLs, search
  discovery, page metadata, internal links, images, and responsive behavior.
- **FR-010**: The feature MUST preserve the existing analytics intent while
  ensuring each qualifying action emits no more than one event per analytics
  system and measurement failures do not affect visitor flows.
- **FR-011**: The feature MUST preserve the protected commerce and contact
  journeys, including persisted cart state, validated customer inputs,
  recalculated pricing, successful order/contact submission, and confirmation
  behavior.
- **FR-012**: The feature MUST not introduce new collection of customer contact
  data, uploaded design content, asset URLs, share links, or other sensitive
  request values for the purpose of performance observation.
- **FR-013**: The feature MUST define a monthly CPU safety budget and warning
  threshold that detect an approaching quota problem before the hosting platform
  is forced to pause service.
- **FR-014**: The feature MUST provide retained comparison evidence showing the
  baseline and post-optimization CPU, request, performance, and error outcomes
  for the same or clearly normalized workload.
- **FR-015**: Production, Preview, Development, page regeneration, static CDN
  delivery, client navigation, and background page loading MUST be reportable
  as distinct workload classes.
- **FR-016**: Automatic or speculative loading of `/contact/form` MUST be bounded
  so one unchanged browser session does not repeatedly request that destination
  in the background without a user navigation or an identified operational
  purpose.
- **FR-017**: A release is complete only when its optimization evidence and
  regression checks show that availability, content correctness, and protected
  visitor journeys remain within their defined acceptance limits.
- **FR-018**: The feature MUST avoid changing or hiding existing user-facing
  failures solely to make error-rate metrics appear improved; real failures must
  remain observable.
- **FR-019**: Before `/contact` stops reading the CMS, the currently published
  contact banner MUST be retrieved from the authoritative published CMS record,
  stored as a repository asset under `public/`, and referenced by the static
  page. The local asset MUST preserve the currently visible design and must not
  contain embedded customer or operational data.
- **FR-020**: The feature MUST cover every confirmed public page pattern found
  in the whole-project audit: homepage, contact, search, Creativa listing/detail,
  product listing/detail, and blog listing regeneration.
- **FR-021**: Search MUST preserve result correctness while bounding corpus
  projection size, repeated corpus builds, and external content reads. One
  isolated warmed function environment MUST not rebuild the complete corpus
  more than once in 24 hours; normal corpus freshness is no greater than
  24 hours, and an owner-triggered publication path supports urgent updates.
- **FR-022**: Creativa pages MUST show normal product and option updates within
  24 hours and MUST support an owner-triggered deployment or publication
  refresh when immediate visibility is required. Routine 60-second
  regeneration is prohibited.
- **FR-023**: Product listing and detail pages MUST preserve 24-hour content
  freshness, new-slug availability, and existing result shapes while removing
  duplicate related reads and keeping projections bounded to visitor-visible
  fields.
- **FR-024**: Blog listing freshness MUST remain within the 10-minute homepage
  CMS freshness window while repeated Markdown and banner work is reduced to one logical
  refresh operation.
- **FR-025**: Every function-backed API endpoint MUST be classified by purpose,
  allowed method, expected caller, data sensitivity, retry behavior, and
  representative runtime budget. Read-only or cache-safe endpoints MAY be
  optimized when endpoint-specific evidence exists. Write, upload, order,
  contact, notification, and external synchronization endpoints MUST retain
  their contracts and are limited to workload guardrails, measurement, and
  regression coverage in this release.
- **FR-026**: The release MUST include a route/workload inventory covering all
  17 page modules with data fetching and all 22 API Function endpoints so a
  route omitted from a short Vercel sample cannot remain unreviewed.
- **FR-027**: Shared rendering overhead MUST be measured separately from content
  fetching. The same representative requests MUST record time around the
  content-source operation and the complete page data/render operation; an
  improvement attributed to fewer external reads MUST not be accepted until
  both measurements are compared.

### Key Entities

- **Traffic Baseline**: A documented period of requests describing invocation
  volume, CPU use, route distribution, response-time percentiles, and error rate.
- **Public Workload Segment**: A comparable group of requests for normal visitors,
  crawlers, previews, health checks, malformed inputs, or repeated unchanged
  content; used to separate necessary work from avoidable work.
- **Monthly CPU Budget**: The included monthly CPU allowance, a safe operating
  limit below 100%, a warning threshold, and evidence of actual or projected
  consumption.
- **Content Freshness Window**: The maximum normal delay between approved content
  publication and visitor-visible availability, with a defined fallback when
  upstream content is unavailable.
- **Optimization Evidence**: The retained before/after comparison connecting
  workload, CPU, response time, error rate, availability, and protected-flow
  regressions.
- **Workload Class**: A reportable source of work such as Production visitor
  traffic, Preview traffic, page regeneration, static delivery, client
  navigation, background loading, crawler traffic, or operational monitoring.
- **Repository-managed Contact Banner**: A published `/contact` banner migrated
  from the CMS into a versioned file under `public/`; it is identified by its
  original published content, local path, and the deployment that introduced it.
- **Function-backed Workload Inventory**: A complete list of public page routes
  and server endpoints, including render mode, source reads, refresh window,
  caller class, data sensitivity, and measured baseline.

### Cross-Cutting Constraints

- **Privacy and data**: Optimization must not add personal-data capture or expose
  visitor, cart, contact, builder-design, asset, or share-link values in
  operational evidence.
- **Security and validation**: Request inputs remain bounded and validated.
  Public optimization behavior must not create authorization bypasses, cross-user
  state reuse, unbounded retries, or acceptance of malformed payloads.
- **Accessibility and motion**: Public pages, loading states, errors, and
  navigation must remain keyboard-accessible, responsive, meaningfully labeled,
  and compatible with reduced-motion preferences.
- **Observability**: GA4/GTM and Umami behavior must retain at most one event per
  qualifying action and must fail safely; CPU evidence must use only operational
  metrics and must not include sensitive request values.
- **Compatibility**: Existing public routes, product and blog content, builders,
  cart persistence, pricing, checkout, contact, and confirmation contracts must
  remain stable. Changes must not depend on upgrading the current hosting plan.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Over a representative complete billing cycle, Fluid Active CPU
  consumption is no more than 3 hours (75% of the included 4-hour allowance)
  for traffic normalized to the recorded baseline, leaving at least 1 hour of
  monthly safety margin.
- **SC-002**: Before implementation, the five public routes with the highest
  aggregate Active CPU in the fixed Production baseline are recorded as the
  comparison set. For the same normalized workload, aggregate CPU across that
  frozen set is reduced by at least 40% without lowering request volume or error
  visibility.
- **SC-003**: For the frozen five-route comparison set plus `/search`,
  at least 95% of normal responses complete within 2 seconds and at least 99%
  complete within 5 seconds. Evidence covers at least 12 continuous Production
  hours and 25 normal requests per route; where Production traffic is
  insufficient, a documented synthetic repeat of the same request workload
  supplements rather than replaces the Production sample.
- **SC-004**: The optimization period produces zero hosting pauses caused by
  Fluid Active CPU exhaustion and no new quota-pause warning during the
  validation month.
- **SC-005**: The public 5xx response rate remains at or below the supplied
  baseline of 0% for representative visitor traffic; no real failure is hidden
  by a success-shaped fallback.
- **SC-006**: 100% of sampled homepage/blog CMS updates are visible within
  10 minutes; sampled product, Creativa, and search updates are visible within
  24 hours; and an owner-triggered urgent Creativa/search update is visible
  within 15 minutes. The repository-managed `/contact` banner is excluded from
  runtime CMS freshness validation.
- **SC-007**: All protected cart, checkout, contact, builder, analytics, and
  critical internal-navigation regression scenarios pass with the same
  visitor-visible outcomes as the pre-optimization baseline.
- **SC-008**: Each malformed-input and unavailable-content class completes
  without an unbounded retry loop, sensitive-data exposure, or misleading
  success state, and its Active CPU is no greater than the measured CPU of one
  normal request for the same route.
- **SC-009**: The owner can classify monthly usage as within budget below 75%,
  warning from 75% through 89.9%, escalated at 90%, and failed at 100%, using
  one documented evidence set. The documented response action for warning is
  review top routes and publication activity before any further public release.
- **SC-010**: Search discovery and page accessibility checks cover all optimized
  entry paths; 100% retain canonical identity, meaningful metadata, working
  internal navigation, and keyboard-accessible primary actions.
- **SC-011**: For the same 85 homepage regeneration events represented in the
  baseline, the optimized site performs no more than 85 content-source reads,
  reducing the observed fan-out from 340 reads by at least 75%.
- **SC-012**: In a representative production validation window, 100% of normal
  `/contact` visits are delivered without function regeneration or a runtime
  content-source read.
- **SC-013**: A representative production validation window records zero
  Function invocations for `/contact`; any observed regeneration is treated as
  a failed completion gate and must be resolved before the feature is accepted.
- **SC-014**: During a 10-minute unchanged browser session, `/contact/form`
  produces no more than one automatic document request, one automatic Next data
  request, and one automatic script/chunk request; fixed-interval repeat
  requests are absent unless tied to an identified visitor action or documented
  external monitor.
- **SC-015**: All before/after results identify Production separately from
  Preview and Development, and do not claim improvement when the compared
  environments or traffic patterns differ.
- **SC-016**: The `/contact` banner migration stores the currently served
  1200px, quality-80 published rendition as a deterministic local JPG under
  `public/`; a visual comparison confirms no material difference at desktop and
  mobile viewports after the CMS dependency is removed.
- **SC-017**: 100% of the 17 page modules with data-fetch exports and 100% of
  the 22 API Function endpoints are present in the final route/workload
  inventory with a priority and explicit disposition.
- **SC-018**: A reproducible isolated function environment performs no more
  than one corpus refresh for a representative common search workload in
  24 hours, with no more than one grouped content-read operation per refresh.
  Production evidence separately reports aggregate cold-start refreshes and
  grouped reads by deployment epoch. Owner-triggered publication makes an
  urgent catalog update searchable within 15 minutes.
- **SC-019**: Creativa's normal public page freshness is no greater than
  24 hours, its routine regeneration interval is 86,400 seconds, and an
  owner-triggered publication path makes an approved urgent update visible
  within 15 minutes without making any existing product or option unavailable.
- **SC-020**: For equivalent product-listing and detail refresh workloads, the
  optimized release performs at least 25% fewer content-source reads without
  changing displayed product data, new-slug availability, or 24-hour freshness.
- **SC-021**: Blog listing regeneration performs no more than one external
  content operation for equivalent refreshes, with the operation count recorded
  alongside the 10-minute freshness result and new-post visibility.
- **SC-022**: 100% of protected APIs are classified and covered by a
  class-specific fixture matrix for authorization, method validation, response
  shape, retry/idempotency, and sensitive-data behavior. Any optimized
  read-only endpoint has route-level before/after CPU evidence; no protected
  write, upload, order, contact, notification, or synchronization contract is
  changed.

## Assumptions

- The immediate goal is to remain safely within the hosting plan's existing free
  included CPU allowance; upgrading the plan is not assumed to be part of this
  feature.
- The recommended operating threshold is 75% of the included monthly CPU
  allowance so the site retains a 25% buffer for traffic growth and operational
  anomalies.
- The current Vercel warning and screenshots represent the authoritative
  incident baseline available for this specification: 4 hours of included
  Fluid Active CPU, 100% usage, a 12-hour sample of 207 invocations, and no
  observed 5xx errors in that sample.
- The repository audit confirmed the homepage's four-read fan-out: four
  independent content-source reads for every refresh. The exact `85 × 4 = 340`
  correlation with the supplied Vercel sample is treated as high-confidence
  incident evidence, not as a reason to ignore other routes.
- The whole-project audit is the scope authority because the supplied Vercel
  sample is too short and incomplete to prove which route patterns are absent
  from monthly Production traffic.
- A 10-minute normal refresh window applies to homepage/blog CMS-managed
  content unless a verified requirement demands a shorter interval. Creativa
  follows a 24-hour normal window with owner-triggered publication for urgent
  updates. Search corpus and 24-hour product content follow the same urgent
  publication rule. Static or repository-managed routes have no runtime CMS
  refresh.
- The `/contact` 7–9-second CPU operation is not yet localized to an individual
  statement. The recommended default is to remove page compute from ordinary
  contact visits and require instrumentation for any refresh work that remains.
- The `/contact` banner is repository-managed for this feature. It no longer
  requires CMS delivery or a 15-minute runtime freshness window; a banner update
  is complete only after a successful website deployment.
- Before disconnecting `/contact` from the CMS, implementation MUST migrate the
  current 1200px, quality-80 published rendition into `public/` as a
  deterministic JPG; replacing it with a different visual or unrelated asset is
  outside this feature.
- The owner-triggered urgent publication mechanism is a Production redeploy of
  the approved commit. Completion requires a 15-minute check against the new
  deployment that proves the updated Creativa or search content is visible
  independently of browser cache and prior function-instance cache.
- The repeated `/contact/form` GETs are not produced by an application polling
  loop. The recommended default is to bound automatic navigation prefetch and
  classify repeated external traffic in production evidence rather than assume
  it is malicious.
- Function-backed API endpoints with protected side effects are included for
  inventory and guardrail validation, not assumed to be safe optimization
  candidates.
- The observed traffic mix and route distribution are representative enough for
  initial validation; the post-launch check will be normalized again if visitor
  volume or campaign traffic changes materially.
- A 10-minute normal content freshness window applies to homepage/blog
  CMS-managed content. Product, Creativa, and search content use the clarified
  24-hour policy; none applies to the repository-managed `/contact` banner.
- Optimization may reduce avoidable work and repeated requests but must not
  disable legitimate search indexing, product discovery, content updates, or
  visitor interactions.
- No new analytics service, personal-data store, product-price commitment,
  minimum-order promise, or delivery guarantee is required.
