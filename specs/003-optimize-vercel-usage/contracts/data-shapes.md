# Grouped Read Data Shapes

These shapes describe composition of existing source data. They do not change
public page props, Sanity references, CMS models, or browser/API payloads.

## Homepage

`getHomepageContent(): Promise<HomepageContent>` returns one result with:

| Field | Existing consumer shape | Query scope |
|---|---|---|
| `banner` | `Banner[]`; page uses `banner[0]` or the existing SEO image fallback | First homepage banner with `_id`, `_rev`, `_type`, `_updatedAt`, `createdAt`, `buttonText`, `slug.current`, and `image` (`_type`, `asset`, `crop`, `hotspot`) |
| `products` | `Products` list | Up to 8 special `products`, ordered `_createdAt desc`, current list projection |
| `macnuts` | `Products` list | Up to 8 special `macnut`, ordered `_createdAt desc`, current list projection |
| `lighters` | `LighterProduct[]` | Up to 8 special `lighterProducts`, ordered `_createdAt desc`, current lighter list projection |

The local three-post Markdown read remains separate and is not included in the
Sanity operation count.

## Search

One grouped query returns aliases for the existing five dynamic groups: laptop
products, Macnut products, lighter products, product types, and Macnut types.
Keep each current field projection and draft exclusion. Local blog, product
service-page, and static-route documents remain assembled in the existing
search domain layer. The grouped query does not contain order, customer, quote,
design, or upload documents.

## Product listings

Each grouped listing result has the existing page's `items`, finite nonnegative
`total`, `types`, and `banner` values. Keep each list's current item projection,
filter, pagination, descending creation order, draft exclusion, image
references, and type/banner model fields. The query must preserve item and type
references (`_ref`, `_type`) and banner image crop/hotspot fields.

## Product detail

Detail results preserve the current primary item, related item list, referenced
type details, and static content shape for the same slug. Lighter type details
already present on a primary product are reused instead of fetched again.
Missing slugs and upstream failures retain their explicit existing behavior.

## Workload evidence

Operational measurement records route, environment, time window, request
class, source-operation count, Active CPU, cache status, and errors. It never
records customer values, raw query strings, assets, designs, order data, or
credentials. An unknown measurement is represented as `unknown`.
