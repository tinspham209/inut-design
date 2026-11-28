# Spec Delta

## Purpose

Public files are served efficiently from Cloudflare Static Assets with predictable browser caching, while dynamic application behavior, privacy headers, and preview indexing protections remain available.

## ADDED Requirements

### Requirement: Public static files bypass Worker execution
Cloudflare SHALL serve eligible public files directly from Static Assets without invoking the application Worker.

#### Scenario: Client requests a public image or data file
- **WHEN** a client requests a deployed static file such as an image, font, model, script, sitemap, or search index
- **THEN** Cloudflare serves the file from Static Assets without invoking the application Worker

#### Scenario: Static file shares a URL prefix with an application page
- **WHEN** a client requests an HTML route or API route under a prefix that also contains public files, including `/creativa/`, `/services/`, or `/policies-terms/`
- **THEN** the application route still reaches the Worker and retains its application behavior and response headers

### Requirement: Static file caching is explicit
Eligible static files SHALL receive explicit browser cache headers through the Static Assets response configuration.

#### Scenario: Browser requests a cacheable static asset
- **WHEN** a browser requests an eligible immutable or versioned static file
- **THEN** the Static Assets response includes the configured public cache lifetime and immutable directive where appropriate

#### Scenario: Static cache rules overlap
- **WHEN** multiple header rules match an asset
- **THEN** its response has one coherent Cache-Control policy, with immutable reserved for versioned assets

### Requirement: Preview SEO controls cover static SEO files
Preview deployments SHALL prevent indexing of both HTML pages and static SEO files.

#### Scenario: Crawler requests preview robots or sitemap file
- **WHEN** a crawler requests `/robots.txt` or `/sitemap.xml` on a preview deployment
- **THEN** the response carries `X-Robots-Tag: noindex, nofollow` or is handled by the Worker that adds that header

### Requirement: Non-deployable files are excluded from public assets
Repository metadata and documentation that are not site content SHALL NOT be included in the deployed public asset bundle, while files required by browser tests SHALL remain available.

#### Scenario: Asset bundle is built
- **WHEN** the public asset bundle is assembled
- **THEN** `.DS_Store` and `public/keychain/connectors/README.md` are excluded and `public/keychain/fixtures/` remains included
