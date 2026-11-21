# Contract: Builder Promotion UI and Analytics

## Public Destinations

| Builder ID | Visible destination | Route |
|---|---|---|
| `keychain` | Tự thiết kế móc khóa mica | `/builder/keychain` |
| `lighter` | Tự thiết kế bật lửa | `/builder/lighters` |

Both links are ordinary same-tab links. They do not require account state and do
not add or consume Builder query parameters.

The Builder overview route is `/builder`.

## Homepage Contract

- The primary hero action MUST use the text “Tự thiết kế ngay” and open
  `/builder`.
- The shared homepage Builder promotion MUST appear after the first homepage content section (`#featured-gift-products`, “In ấn quà tặng”) and before `ServicesSection`.
- The section MUST include both definitions in priority order.
- Keychain MUST carry a visible text badge equivalent to “Mới”.
- Mobile DOM and keyboard order MUST be Keychain then Lighter.
- Heading, description, badge, and link text MUST remain usable if an image fails.

## Builder Index Contract

- `/builder` MUST render the same two canonical definitions and the same route
  mapping as the homepage.
- Keychain MUST be first and retain the “Mới” marker.
- No third Builder is added by this feature.

## Accessibility Contract

- Each card MUST expose a meaningful accessible link name containing the Builder
  title and destination purpose.
- A card MUST have one primary tab stop for its destination, not separate hidden
  duplicate links.
- The “Mới” state MUST be text, not color alone.
- Focus indication MUST remain visible against the dark surface.
- Any decorative motion MUST not be required to understand the content and MUST
  honor reduced-motion preferences.

## Analytics Contract

### Event names

| Event | Trigger |
|---|---|
| `builder_promotion_view` | Placement is sufficiently visible; at most once per represented Builder per mounted placement |
| `builder_promotion_click` | User activates a Builder destination link; once per activation in each provider |

### Properties

| Property | Allowed values / shape |
|---|---|
| `builder_id` | `keychain`, `lighter`, or `overview` for the Hero CTA |
| `placement` | `home_hero`, `home_feature`, or `builder_index` |
| `action` | `view` or `click`, matching the event name |

The helper rejects or omits values outside these fixed sets. It MUST NOT include:

- image or asset URL;
- design/query/share-link parameters;
- title copied from user-generated content;
- customer, device identifier, email, phone, or address;
- cart, pricing, order, or checkout fields.

### Failure behavior

- Missing `window`, GA4/GTM, or Umami is non-fatal.
- If `IntersectionObserver` is unavailable, view impressions are skipped; promotion content and links remain available.
- A provider exception is reported without forwarding it through the analytics
  pipeline and does not cancel click navigation or remove the promotion.
- A single user activation MUST call each available provider no more than once for
  the promotion click event.

## Acceptance Evidence

- Static contract test proves canonical order, exact routes, unique IDs, and the
  analytics allow-lists.
- Browser evidence proves direct navigation, keyboard order, responsive geometry,
  image-failure degradation, reduced motion, and exact event counts.
