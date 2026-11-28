# document-font-loading Specification

## Purpose

Defines usable Google Fonts in both prerendered and server-rendered pages, and separates deployable Worker code, diagnostic sourcemaps, and public browser assets.

## Requirements

### Requirement: Screen font loading in prerendered and SSR pages
Prerendered and runtime-rendered HTML using the shared document SHALL load the Roboto and Roboto Serif stylesheet for screen media without relying on JavaScript or hydration. Existing Material Icons stylesheet behavior SHALL be preserved.

#### Scenario: Both delivery paths contain an active stylesheet
- **WHEN** a browser loads a public page from a freshly built prerender snapshot and a page rendered at request time
- **THEN** both HTML responses include one active screen stylesheet for Roboto and Roboto Serif, and the browser applies the corresponding fonts to representative text when the stylesheet and font resources are available
- **AND** initial stylesheet activation also works with JavaScript disabled

### Requirement: Worker artifact boundary and diagnostic coverage
Worker build verification SHALL distinguish runtime modules from diagnostic sourcemaps and public assets. Worker diagnostic maps SHALL NOT become public Static Assets, and any bundle change SHALL preserve Worker graph checks and the prerender, privacy, and browser behavior of affected routes.

#### Scenario: The build contains diagnostic maps and lazy browser dependencies
- **WHEN** the Vinext Cloudflare Build Output is assessed for bundle changes
- **THEN** the audit reports runtime module sizes separately from diagnostic maps and public assets and identifies whether heavy chunks are eagerly loaded or only present in the module graph
- **AND** any proposed trim is supported by a before/after improvement on a comparable build, without reducing diagnostic or forbidden-import check coverage
