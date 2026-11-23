# Contract: Optimized Public Routes

## `/`

- ISR revalidation is 600 seconds.
- One grouped CMS operation returns homepage banner and three special-product
  groups; result shapes and ordering are unchanged.
- Local blog reading, metadata, content, analytics, and navigation remain.

## `/contact`

- Fully static; no page data function, runtime CMS read, or regeneration.
- Hero and SEO metadata use
  `/branding/contacts/contact-page-banner.jpg`.
- The local image is the live 1200px/quality-80 rendition.
- Contact text, links, tracking callbacks, SEO, and Main Layout remain.

## `/contact/form`

- Fully static and `noindex` remains when query parameters exist.
- Click navigation and `from`/`note` behavior remain.
- Automatic prefetch is disabled for this destination.
- Submission, validation, analytics, and confirmation behavior remain.

## `/blog`

- ISR revalidation is 600 seconds.
- Local Markdown reading and post ordering remain.
- Banner freshness remains within the shared 10-minute CMS freshness window with no extra
  independent source operation.

## `/creativa` and `/creativa/skin-laptop[/slug]`

- Normal revalidation is 86,400 seconds.
- Blocking fallback for uncached product slugs remains.
- Product/catalog/option result shapes, explicit failures, and unavailable
  states remain.
- Owner-triggered publication can make an urgent approved change visible within
  15 minutes.

## `/search`

- Search remains available for current valid queries and filters.
- One grouped external-content operation builds dynamic corpus data; local
  routes/blogs remain assembled locally.
- Normal corpus freshness is 24 hours; owner-triggered publication supports
  urgent visibility within 15 minutes.
- Empty, malformed, unsupported, and source-unavailable states remain explicit.
- Search does not expose customer, order, upload, or private Sanity data.

## Product listing and detail routes

- Existing 24-hour freshness and blocking fallback/new-slug behavior remain.
- Listing item/count/type/banner reads are grouped without changing order,
  filters, pagination, image references, or draft exclusion.
- Detail routes preserve primary, related, static-content, type, and slug
  behavior.
- Lighter detail does not re-fetch type data already present in its primary
  product result.

## Shared failure behavior

- Missing required local assets are release/build failures.
- Upstream failures remain visible; stale or empty data is not labeled successful.
- Protected customer, cart, order, upload, contact, and builder-design state is
  not shared or merged by optimization.
