---
type: repository quickstart
title: Repository Wiki Quickstart
description: A concise entry point for coding agents working on the Inut Design repository. It explains the Next.js web application and separate Sanity Studio boundary, then routes common changes to the right domain pages and smallest useful verification.
tags: [quickstart, architecture, development, verification]
manual_review:
  by: GitHub Copilot (user-authorized manual refresh)
  date: '2026-10-08'
  scope: Skill bootstrap, blog routing, and verification selection only; runtime assertions not reverified
manual_sources:
  - repo://.agents/skills/inut-design-workflow/SKILL.md
  - repo://.agents/skills/inut-content-writer/SKILL.md
  - repo://docs/ai/DUAL_EDITOR_WORKFLOW.md
verified:
  - by: openwiki/0.4.0
    at: 2026-08-25T17:23:14.366Z
sources:
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-376a15f9ed3ad1c8d95a72bd
    resource: repo://api-client/sanity-server.ts
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-2b7fec4436b3699f6b52beba
    resource: repo://pages/_app.tsx
  - id: openwiki-source-e46821d9626b6e3b6b18fa6e
    resource: repo://pages/api/orders/lighters.ts
  - id: openwiki-source-23775c3de52f3ab95a13cb8b
    resource: repo://README.md
  - id: openwiki-source-02dd5acaafbdef8d8445571f
    resource: repo://sanity/package.json
  - id: openwiki-source-f146f6f9277ec7bd9d67d238
    resource: repo://sanity/README.md
  - id: openwiki-source-f57d61fd3e0aa95b0df800c5
    resource: repo://sanity/sanity.json
  - id: openwiki-source-682faceb88b12ebaff766eb5
    resource: repo://scripts/regression-test-quote-form.sh
  - id: openwiki-source-be105ef62ffd2a01d319d3c2
    resource: repo://scripts/regression-test.sh
  - id: openwiki-source-98d10f9b6091628fff52545f
    resource: repo://scripts/verify-seo.mjs
generated: {by: "openwiki/0.4.0", at: "2026-08-25T17:23:14.366Z"}
manualReviews:
  - by: user-authorized manual review
    at: '2026-10-08'
    scope: writer navigation and customization/prose-only verification caveat; other runtime guidance not reverified
    sources:
      - repo://.agents/skills/inut-design-workflow/SKILL.md#L23-L27
      - repo://.agents/skills/inut-content-writer/SKILL.md#L10-L41
---

# Repository Wiki Quickstart

Inut Design is a Next.js 12 e-commerce application for custom products, backed by Sanity v2. The repository contains two operational surfaces: the web app at the repository root and an independently run Studio under `sanity/`. Treat source code and tests as authoritative; this page is a routing map, not a source-tree inventory.

## Start safely

- Read root `AGENTS.md`, then the relevant `.agents/skills/<name>/SKILL.md` and task-specific references. All seven retained skills live only under `.agents/skills/`; client auto-discovery is not guaranteed, so use an explicit skill path as the fallback. Removed AI mirrors do not imply removal of `.github` CI or `.codex/config.toml`.
- Use `pnpm` (the root declares `pnpm@10.32.1`); use Node 20 through 25, with Node 22 the repository's recommended version. The Studio specifically declares Node 22.
- Copy `.env.example` to `.env` and fill only the variables needed for the task. Do not commit `.env`, tokens, or credentials. Public integrations use `NEXT_PUBLIC_*`; Sanity writes use the server-side `SANITY_TOKEN` and server client.
- Run the web app from the repository root:

  ```bash
  pnpm i
  pnpm dev
  # http://localhost:3000
  ```

- Run the Studio separately when changing schemas, CMS configuration, or editorial data workflows:

  ```bash
  cd sanity
  pnpm i
  pnpm start
  # http://localhost:3333
  ```

The root app's `pages/` directory owns routes and API routes. `pages/_app.tsx` is shared client bootstrapping: it selects the page layout, wraps pages in SWR and MUI providers, mounts the cart/toast/dialog surfaces, and initializes consent, page/engagement tracking, BFCache, speculation, and prefetch monitoring. Keep browser-only state and effects on the client; keep privileged Sanity writes behind API routes and server-side clients. See [Runtime Boundaries and Request Architecture](architecture/runtime-boundaries.md).

## Route the task to the right page

| If you are changing…                                                                                             | Read first                                                                                           |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Vietnamese blog batches, author metadata, dates, source-grounded copy, or contextual CTA                         | [Blog Content Workflow](workflows/blog-content.md) and `.agents/skills/inut-content-writer/SKILL.md` |
| Next.js pages, API routes, client hooks, Zustand, API clients, SSR/client-only behavior, or app-wide providers   | [Runtime Boundaries and Request Architecture](architecture/runtime-boundaries.md)                    |
| Products, lighter pricing, cart items, checkout payloads, order statuses, or Sanity references                   | [Catalog, Pricing, Cart, and Order Contracts](concepts/catalog-and-content-model.md)                 |
| Sanity schemas, GROQ reads, uploads, credentials, datasets, or CMS operations                                    | [Sanity CMS Integration and Content Contracts](integrations/sanity-cms.md)                           |
| Telegram, quote/order notifications, phone advice, or Zalo degradation                                           | [Telegram Notifications and Zalo Phone Advisory](integrations/telegram-and-zalo.md)                  |
| Cart, lighter builder, checkout submission, order persistence, or order tracking                                 | [Lighter Builder, Cart, Checkout, and Order Tracking](workflows/cart-to-order.md)                    |
| Contact form validation, phone normalization, Zalo confirmation, quote persistence, or notification side effects | [Quote Request and Contact Workflow](workflows/quote-request.md)                                     |
| Environment configuration, local services, build/postbuild, redirects, or deployment                             | [Configuration, Local Development, and Deployment](operations/development-and-deployment.md)         |
| Regression commands, browser checks, tracking/SEO checks, or test limitations                                    | [Testing, Regression, and Safe Change Verification](testing/regression-and-verification.md)          |
| Analytics, consent, SEO, sitemap, BFCache, speculation, or performance instrumentation                           | [Analytics, Consent, SEO, and Performance Surfaces](integrations/analytics-and-seo.md)               |

The principal commerce invariant is worth checking before edits: cart persistence uses the `inut-lighters-cart` localStorage key, and Sanity array items require `_key` values. Order items preserve product/lighter references alongside quantity and calculated prices. Do not invent a parallel contract; follow the models, API clients, and focused workflow documentation.

## Smallest verification path

For customization/prose-only changes, use scoped architecture, metadata, JSON and Markdown checks—not application lint/build. See the [blog writer contract](workflows/blog-content.md) for selected-post validation and the [AI configuration check](testing/regression-and-verification.md#ai-configuration-validation) for skills-only architecture. Neither proves factual accuracy or rendered UI.

For application code changes, including narrow UI changes, begin with:

```bash
rtk pnpm lint
```

For a route, runtime, API, configuration, or build-affecting change, follow with:

```bash
rtk pnpm build
```

`pnpm build` also runs the `postbuild` chain: `next-sitemap` generates SEO artifacts and `scripts/verify-seo.mjs` checks `robots.txt` and `sitemap.xml`. Start `pnpm dev` and manually exercise the changed path, especially cart, checkout, order, and contact flows. For focused browser coverage, use the repository scripts:

```bash
pnpm regression                 # navigation/SEO and optional cart flow
pnpm regression:lighter         # lighter builder checks
pnpm regression:quote-form      # quote validation, Zalo dialog, and submit scenarios
```

These browser scripts may create screenshots and, for successful quote submissions, real Sanity documents and Telegram notifications. They do not replace source-level tests or prove external side effects; use safe credentials/data and verify those side effects manually when required. See [Testing, Regression, and Safe Change Verification](testing/regression-and-verification.md) for scope and limitations.

## Change discipline

Keep changes small, reuse existing `api-client/*`, analytics utilities, and pricing helpers, and preserve route redirects when moving URLs. Never hardcode Sanity project IDs, datasets, or tokens. When a change crosses the web/CMS boundary, verify both the API contract and the corresponding Studio schema rather than relying on a successful page render.
