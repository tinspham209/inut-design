# Builder promotion release summary

Local browser validation on 2026-11-21 covered the Hero, homepage promotion,
`/builder`, navigation, keyboard activation, reduced motion, image failure, and
provider failure.

Placement follow-up: rendered DOM order is Hero → `#featured-gift-products`
(“In ấn quà tặng”) → Builder promotion → `ServicesSection`.

| Viewport | Hero CTA | Promotion layout | Horizontal overflow | Result |
| --- | --- | --- | --- | --- |
| 360 × 800 | Fully visible; 50.5 px high; `/builder` | One column, Keychain first | None | Pass |
| 768 × 900 | Label and `/builder` retained | Two columns, Keychain first | None | Pass |
| 1440 × 900 | Label and `/builder` retained | Two columns; Keychain outlined | None | Pass |

Focused axe audits reported no violations on either promotion placement. In
browser mocks, each Hero/card click generated exactly one event for GA4/GTM and
Umami, containing only `builder_id`, `placement`, and `action`. Each card view
generated one event per provider at 50% visibility. Missing trackers, provider
exceptions, failed images, reduced motion, and missing `IntersectionObserver`
did not remove the cards or block their destinations. Missing
`IntersectionObserver` skips view events.

Evidence files in this directory contain viewport measurements, event
properties, and screenshots. Local mocks do not prove hosted analytics delivery.
User-study and 30-day conversion success criteria remain post-launch measures.
