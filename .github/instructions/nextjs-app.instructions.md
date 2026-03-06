---
description: "Use when editing Next.js pages/components, cart, checkout, or shared frontend UI in Inut Design"
applyTo: "pages/**/*.{ts,tsx,js,jsx},components/**/*.{ts,tsx,js,jsx},hooks/**/*.{ts,tsx,js,jsx},store/**/*.{ts,tsx,js,jsx},utils/**/*.{ts,tsx,js,jsx}"
---

# Next.js Frontend Instructions (Inut Design)

## Goal

Preserve existing behavior while making minimal, safe edits to the Next.js 12 pages-router app.

## Required patterns

- Prefer existing `api-client/*` wrappers over adding direct fetch logic in page components.
- Keep per-page layout pattern (`Component.Layout = MainLayout`) intact.
- Use existing `@/` import aliases.
- Keep TypeScript compatible with project loose mode (`strict: false`).
- Reuse existing UI structure (MUI v5 + Framer Motion + existing component patterns).

## Cart and checkout safety rules

- Do not change the localStorage key `inut-lighters-cart` unless explicitly requested.
- Ensure pricing recalculation remains correct on every quantity update.
- Keep order creation payload compatible with Sanity schema.
- Every array item written to Sanity must include `_key`.

## Data fetching rules

- Favor SSG conventions and existing `getStaticProps` patterns.
- Avoid introducing unnecessary client-side requests on pages already statically generated.
- Keep query/result shape compatibility with existing components.

## UX and reliability

- Preserve loading and empty-state behavior.
- Avoid breaking SEO metadata patterns.
- For user-visible interactions (cart, checkout, contact), avoid regressions in button click tracking and navigation.
