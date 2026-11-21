# Research: Promote Builder Tools

## Decision: Use the Hero CTA for Builder discovery and place the comparison after the first content section

**Decision**: Replace the hero primary label “Xem sản phẩm” with “Tự thiết kế ngay”
and link it to `/builder`, keep the quote action, and insert a shared two-Builder
promotion section after `#featured-gift-products` and before `ServicesSection`.

**Rationale**: The current homepage already has a high-visibility hero. Replacing
the generic product link with a Builder-oriented label makes the capability
discoverable, while `/builder` lets new users see both choices before selecting a
tool. The following section still offers direct Keychain and Lighter routes.

**Alternatives considered**:

- Link the Hero CTA directly to `/builder/keychain`: rejected after review because
  the requested updated flow should introduce both Builders through `/builder`.
- Promotion only in the existing product grid: rejected because it is below the
  hero and competes with unrelated products.
- Replace the entire hero with a Builder-only hero: rejected because it would
  displace the site's established broad-purpose homepage message.
- Add a modal or popup: rejected because it is interruptive, harder to make
  keyboard accessible, and not necessary to meet the discovery goal.

## Decision: Use one canonical Builder content source

**Decision**: Extend `data/builders.ts` with stable IDs, an explicit priority order,
and a “Mới” badge for Keychain Builder. Render that source on the homepage and
`/builder`.

**Rationale**: The site already contains both verified routes, descriptions, and
assets in one module. Reordering and enriching this module avoids drift between
promotion entry points and makes Keychain-first order a testable contract.

**Alternatives considered**:

- Separate homepage-only constants: rejected because names, links, or badge state
  could diverge from `/builder`.
- Fetch promotion content from Sanity: rejected because the requirement is narrow,
  both destinations are fixed, and no CMS editing or translation workflow was
  requested.

## Decision: Use a dedicated Builder promotion component

**Decision**: Create one Builder-specific card/grid surface for the homepage and
Builder index rather than changing the generic ServiceCard tracking behavior.

**Rationale**: The existing `ServiceCard` already emits a generic `service_click`
event. A dedicated promotion component avoids sending two engagement events for a
single Builder selection and avoids changing analytics for unrelated services.

**Alternatives considered**:

- Modify `ServiceCard` globally: rejected due to unrelated analytics blast radius.
- Reuse `LighterCardBuilder` and create a separate keychain card: rejected because
  it duplicates structure and makes order/content consistency harder to enforce.

## Decision: Measure views and clicks with an allow-listed dual tracker

**Decision**: Add `builder_promotion_view` and `builder_promotion_click` through a
single helper that calls GA4/GTM and Umami. Permit only `builder_id`, `placement`,
and `action` properties. Use a ref guard and `IntersectionObserver` for one view
per mounted placement; call click tracking from each direct link activation.

**Rationale**: This matches the repository's dual analytics convention, supports
conversion analysis by Builder and placement, and satisfies privacy constraints.
Provider failures remain isolated from navigation.

**Alternatives considered**:

- Page-level view only: rejected because it cannot identify which promotion
  placement reached the viewport.
- Anonymous free-form event properties: rejected because it increases privacy and
  schema drift risk.
- Scroll listener: rejected because it is noisier and requires manual cleanup and
  viewport calculation already handled by `IntersectionObserver`.

## Decision: Keep destination pages responsible for Builder errors

**Decision**: Promotion links are ordinary same-tab Next.js links and do not
preflight Builder availability.

**Rationale**: Both destination routes are existing public pages. A preflight
would add network coupling and could create misleading “available” states or
block navigation when checks fail.

**Alternatives considered**:

- Client health check before navigation: rejected due to extra latency and false
  negatives.
- Disabled promotion while a Builder is unavailable: rejected because the
  promotion layer has no authoritative availability source.

## Decision: Validate with static contracts plus browser evidence

**Decision**: Add a focused static contract check for canonical Builder order,
routes, and analytics allow-lists, then verify rendering, keyboard behavior,
responsive layout, image fallback, and event counts in a browser.

**Rationale**: Static checks catch contract drift quickly but cannot prove visual
priority or interaction behavior. Browser evidence is required for those claims.

**Alternatives considered**:

- Build/lint only: rejected because those commands do not prove viewport behavior,
  accessibility, or analytics de-duplication.
- Add a broad end-to-end framework: rejected because the repository has no
  existing browser test dependency and this feature does not justify one.
