# Implementation Plan: Promote Builder Tools

**Branch**: `main` (feature directory: `002-promote-builder-tools`) | **Date**: 2026-11-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-promote-builder-tools/spec.md`

## Summary

Introduce a keychain-first promotion surface for the two existing design tools.
The homepage hero primary action will be renamed to “Tự thiết kế ngay” and send
users to the Builder overview at `/builder`. A shared Builder promotion section
immediately below the hero will present Keychain Builder before Lighter Builder
and retain direct links to each tool. The `/builder` page will reuse the same
ordered content. A small analytics helper will emit allow-listed GA4/GTM and
Umami events once per visible placement and once per click without touching
either Builder's saved design state or commerce flows.

## Technical Context

**Language/Version**: TypeScript 5.0.4, React 18.2, Next.js 12.3 pages router, project `strict: false`

**Primary Dependencies**: MUI 5 components, existing `next/link`, existing analytics and
Umami wrappers, browser `IntersectionObserver`; no new dependency required

**Storage**: N/A for promotion content. Existing Builder storage, routes, and server
payloads remain unchanged

**Testing**: `pnpm lint`, `pnpm build`, focused static contract validation, and
browser/device evidence at mobile and desktop viewports; no new test framework

**Target Platform**: Responsive public website in modern desktop and mobile browsers

**Project Type**: Existing Next.js frontend in a single repository

**Performance Goals**: Keep promotion content renderable in static HTML, avoid adding
heavy client dependencies, preserve stable image aspect ratios, and introduce no
blocking request before the destination links become usable

**Constraints**: Keep the Builder-overview CTA at the start of the homepage
journey, maintain keyboard order that matches Keychain-first visual priority,
support viewports from 360 px to 1440 px, respect reduced motion, and make
analytics failure non-blocking

**Scale/Scope**: Two Builder destinations, one homepage hero CTA, one homepage
promotion placement, and one `/builder` index placement; no API, CMS schema, or
Builder-state changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Evidence-bounded scope**: PASS. Existing routes, Builder descriptions, and
  thumbnail assets are verified in the repository. No price, MOQ, delivery, or
  production claims are added.
- **Server and data integrity**: PASS. No server write, Sanity reference, upload, or
  secret boundary is introduced.
- **Commerce contract stability**: PASS. The feature does not change cart,
  pricing, checkout, contact, order, or confirmation contracts.
- **Privacy-safe observability**: PASS. Events use a fixed union of Builder IDs and
  placement IDs and contain no design, customer, URL query, or asset data.
- **Verifiable delivery**: PASS. The plan includes independently testable routing,
  responsive/accessibility, analytics de-duplication, image-fallback, lint, build,
  and browser evidence.
- **Platform constraints**: PASS. The design stays within Next.js 12, React 18,
  TypeScript, MUI 5, pnpm, SSG/layout, and `@/` import conventions.

## Project Structure

### Documentation (this feature)

```text
specs/002-promote-builder-tools/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── builder-promotion.md
```

### Source Code (repository root)

```text
components/
├── common/
│   └── ServiceCard.tsx              # Existing visual pattern retained as reference
└── home/
    ├── builder-promotion.tsx        # Shared keychain-first presentation and impression tracking
    ├── hero.tsx                     # Homepage primary CTA destination and click tracking
    └── index.ts                     # Export shared promotion component

data/
└── builders.ts                      # Canonical ordered Builder definitions and destinations

pages/
├── index.tsx                        # Insert promotion after featured-gift-products
└── builder/
    └── index.tsx                    # Reuse shared Builder presentation and order

utils/
└── builderAnalytics.ts              # Fixed allow-listed GA4/GTM + Umami events

scripts/
└── tests/
    └── builder-promotion.test.mjs   # Static contract checks for routes, order, and event properties

docs/
└── ANALYTICS_GUIDE.md               # Promotion event contract and verification notes
```

**Structure Decision**: This is a client-side presentation feature in the existing
single Next.js application. It reuses shared static data and analytics modules,
adds one home component and one narrow analytics helper, and requires no backend
or new package boundary.

## Design Decisions

1. The hero's existing “Xem sản phẩm” primary CTA becomes “Tự thiết kế ngay” and
   opens `/builder`; the existing quote CTA remains as the secondary action.
2. A dedicated promotion section follows the first homepage content section,
   `featured-gift-products`, and precedes services. This keeps both tools
   discoverable without placing the promotion directly below the Hero. Keychain
   is first and visually emphasized on desktop; mobile preserves that reading order.
3. `data/builders.ts` becomes the canonical source for both homepage and
   `/builder` content, with Keychain first, explicit IDs, and a text "Mới" badge.
4. A dedicated Builder card surface avoids firing the generic `service_click`
   event in addition to a promotion event for the same activation.
5. Impression tracking is attached to a stable promotion placement with an
   `IntersectionObserver` and a ref guard. Click tracking is attached directly
   to the link handler. The hero click is tracked at its own `home_hero`
   placement with the Builder-overview action, not as a Keychain-only click.
6. Tracking properties are allow-listed to `builder_id`, `placement`, and
   `action`; event names distinguish views and clicks. Tracking wrappers guard
   unavailable providers, report provider exceptions to the console, and never
   gate rendering or navigation.
7. If visual assets fail, text, badge, and link remain available within a fixed
   aspect-ratio region. No alternate product claims or dynamic fallback content
   are required.

## Phase 0 Research Gates

- No unresolved specification clarification remains.
- Existing route and asset evidence resolves the product and destination model.
- Existing intersection, analytics, layout, accessibility, and SSG patterns are
  sufficient; no external package research is needed.
- See [research.md](./research.md) for the consolidated decisions and rejected
  alternatives.

## Phase 1 Design Gates

- Entity and event-state model: [data-model.md](./data-model.md)
- Public UI and analytics behavior: [contracts/builder-promotion.md](./contracts/builder-promotion.md)
- End-to-end verification: [quickstart.md](./quickstart.md)
- Post-design Constitution Check: PASS. The design introduces no protected-data,
  commerce, server, dependency, or persistence risk and keeps event data minimal.

## Complexity Tracking

No constitution violations or exceptional complexity are required.
