# edge-cdn-page-caching Specification

## Purpose

Public content pages are served from the deployed static asset bundle to reduce runtime rendering and Worker work. Private and user-specific responses remain isolated from shared caches.

## Requirements

### Requirement: Public content pages are available from the deployed cache
Eligible public Pages Router pages SHALL be prerendered and served from the deployed asset bundle without runtime page regeneration.

#### Scenario: Anonymous visitor requests a prerendered public page
- **WHEN** an anonymous visitor requests a public page backed by `getStaticProps` after a successful deployment
- **THEN** Cloudflare serves the deployed page and does not run page rendering or Sanity reads for that request

#### Scenario: Owner publishes updated Sanity content
- **WHEN** Sanity content changes after the current deployment
- **THEN** the deployed page continues to show the current build until the owner completes a local release and redeploy, after which it shows the newly built content

#### Scenario: Visitor navigates to a prerendered page
- **WHEN** the visitor loads a prerendered page directly or navigates to it using its Pages Router data request
- **THEN** HTML and navigation data reflect the same deployed content snapshot

#### Scenario: A static path is added or removed
- **WHEN** a route using `getStaticPaths` with `fallback: false` is added or removed in content
- **THEN** the deployed path set changes only after a successful rebuild and redeploy

#### Scenario: Build contains a sensitive route
- **WHEN** a sensitive or request-dependent route appears in the prerendered shared HTML or navigation data
- **THEN** the release gate fails before deployment

### Requirement: Sensitive page routes are not shared or retained
Cart, checkout, order tracking, builder, and search pages SHALL return non-cacheable responses and SHALL prevent referrer disclosure and search indexing where those pages may expose user-specific or operational information.

#### Scenario: User requests a sensitive page
- **WHEN** a user requests a cart, checkout, order-tracking, builder, or search page
- **THEN** the response includes `Cache-Control: no-store`, `Referrer-Policy: no-referrer`, and `X-Robots-Tag: noindex, nofollow`

### Requirement: API responses are not shared by intermediaries
Application API routes SHALL return `Cache-Control: no-store` unless an endpoint is explicitly documented and verified as public cacheable data.

#### Scenario: Client calls an application API
- **WHEN** a client requests an API route under `/api/`
- **THEN** the response is not retained in a shared browser or CDN cache
