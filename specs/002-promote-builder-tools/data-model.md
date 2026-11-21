# Data Model: Promote Builder Tools

## BuilderDefinition

Canonical, static content for one design tool.

| Field | Type | Required | Validation / meaning |
|---|---|---:|---|
| `id` | `"keychain" \| "lighter"` | Yes | Stable analytics and lookup identifier |
| `title` | string | Yes | User-facing product-specific name; must name the product |
| `description` | string | Yes | Verified existing capability only; no ungrounded commercial claim |
| `href` | string | Yes | Exactly `/builder/keychain` or `/builder/lighters` for the matching ID |
| `imageUrl` | string | Yes | Existing public thumbnail path; used decoratively if title/description identify the destination |
| `badge` | string \| undefined | No | Text-only “Mới” marker for Keychain only during this campaign |
| `priority` | positive integer | Yes | Lower value is earlier; Keychain MUST be `1` and Lighter `2` |

**Relationships**:

- One `BuilderDefinition` is rendered in one or more `BuilderPromotionPlacement`.
- A placement never mutates the definition or destination Builder state.

**Invariant**:

- The canonical list contains exactly two definitions.
- IDs, routes, and title-to-route mapping are fixed and must fail the static
  contract check if changed unexpectedly.

## BuilderPromotionPlacement

Fixed source location where a Builder link is shown.

| Value | Meaning |
|---|---|
| `home_hero` | Primary homepage CTA to `/builder` |
| `home_feature` | Shared two-card homepage promotion after `#featured-gift-products` and before services |
| `builder_index` | Shared two-card list on `/builder` |

## BuilderPromotionEvent

Sanitized analytics payload.

| Field | Type | Required | Validation |
|---|---|---:|---|
| `action` | `"view" \| "click"` | Yes | Determines `builder_promotion_view` or `builder_promotion_click` |
| `builder_id` | BuilderDefinition ID or `"overview"` | Yes | `overview` is reserved for the `/builder` Hero CTA; direct cards use canonical IDs |
| `placement` | BuilderPromotionPlacement | Yes | Must be a fixed placement value |

No additional field is copied from URL parameters, route state, Builder state,
image data, customer information, or request content.

## Impression State

Client-only, ephemeral state owned by a rendered promotion placement:

1. **Unobserved**: The placement has not intersected the configured viewport
   threshold.
2. **Observed**: The observer reports sufficient visibility.
3. **Emitted**: One view event has been sent for each represented Builder.

Transition `Unobserved → Observed → Emitted` occurs once per mounted placement.
Component unmount discards this state. Returning through a new navigation may
create a new page-level placement instance; no local storage or session identifier
is written.

## Click State

Clicks are not persisted. Each actual link activation creates one event in each
analytics provider at the source, then follows ordinary same-tab navigation.
Hover, keyboard focus, image load, and pointer movement do not emit click events.
