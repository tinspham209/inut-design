---
type: architecture concept
title: Runtime Boundaries and Request Architecture
description: Maps the Next.js page and API-route runtimes to browser hooks, Zustand persistence, API-client modules, Sanity, and notification and analytics services. Explains SSR and static generation, client-only islands, SWR request behavior, security-sensitive server boundaries, and failure handling.
tags: [Next.js, runtime-boundaries, request-flow, SWR, Zustand, Sanity, SSR]
verified:
  - by: openwiki/0.4.0
    at: 2026-08-25T17:23:14.366Z
sources:
  - id: openwiki-source-3742c914a02bebd553f6f47e
    resource: repo://api-client/axios-client.ts
  - id: openwiki-source-1b25895d8c499c4e17980186
    resource: repo://api-client/sanity-browser.ts
  - id: openwiki-source-376a15f9ed3ad1c8d95a72bd
    resource: repo://api-client/sanity-server.ts
  - id: openwiki-source-fd621f5f79ce382a09ac8eea
    resource: repo://components/cart/CartWrapper.tsx
  - id: openwiki-source-47783ac9aabf4e197c965755
    resource: repo://components/lighters/LightersPageContainer.tsx
  - id: openwiki-source-7e9f8beea21cb3abffd93519
    resource: repo://hooks/useInfiniteCatalog.ts
  - id: openwiki-source-f443862e04ca8746c18e80ae
    resource: repo://hooks/usePhoneZaloCheck.ts
  - id: openwiki-source-2e49a6481dcab86cfa5de8e5
    resource: repo://hooks/useTelegramNotification.ts
  - id: openwiki-source-f091ae3b14cea245dd06d60d
    resource: repo://hooks/useTelegramQuoteNotification.ts
  - id: openwiki-source-2b7fec4436b3699f6b52beba
    resource: repo://pages/_app.tsx
  - id: openwiki-source-e46821d9626b6e3b6b18fa6e
    resource: repo://pages/api/orders/lighters.ts
  - id: openwiki-source-4d46417a55aa98489af6dba2
    resource: repo://pages/api/quote-request.ts
  - id: openwiki-source-f3524928ef1b6558163bb83f
    resource: repo://pages/api/sanity/upload-image.ts
  - id: openwiki-source-93bbd8b7fb7587842bc605ae
    resource: repo://pages/api/telegram/send-order-notification.ts
  - id: openwiki-source-986e8ea86fea86f82d547da4
    resource: repo://pages/api/validate-phone.ts
  - id: openwiki-source-8d0d48f7d002be7b396b138e
    resource: repo://pages/index.tsx
  - id: openwiki-source-7c8ad6e2c96fa78539df3768
    resource: repo://pages/san-pham/lighters/index.tsx
  - id: openwiki-source-8dcb0b834daf173b78dcf128
    resource: repo://pages/search/index.tsx
  - id: openwiki-source-f146f6f9277ec7bd9d67d238
    resource: repo://sanity/README.md
  - id: openwiki-source-f57d61fd3e0aa95b0df800c5
    resource: repo://sanity/sanity.json
  - id: openwiki-source-599eabb42bd181798aa4e454
    resource: repo://store/cart/lightersCart.ts
  - id: openwiki-source-70ceddaaa8b44f7e98799a47
    resource: repo://store/layout/lightersLayout.ts
generated: {by: "openwiki/0.4.0", at: "2026-08-25T17:23:14.366Z"}
---

# Runtime Boundaries and Request Architecture

This application is a Next.js **Pages Router** site. A request can be handled during static generation, on the server in `getServerSideProps` or an API route, or in the browser after hydration. The most important boundary is between public, tokenless Sanity reads and server-only Sanity writes: browser-facing modules use `api-client/sanity-browser.ts`, while `api-client/sanity-server.ts` owns the token-bearing client and is reached by API routes.

## Component and request boundary

```mermaid
sequenceDiagram
    participant Browser as Browser page and hooks
    participant App as pages/_app.tsx
    participant Api as Next API route
    participant Client as api-client modules
    participant CMS as Sanity Content Lake
    participant Notify as Telegram service
    participant Analytics as Analytics services

    Browser->>App: Hydrate page and run client effects
    App->>Browser: Provide SWR fetcher and client-only cart dialog
    Browser->>Client: Call browser API module or SWR fetcher
    Client->>CMS: Tokenless public read with useCdn
    Browser->>Api: POST order quote upload or notification
    Api->>Client: Validate and invoke server-side module
    Client->>CMS: Create order quote or image asset
    Api->>Notify: Send validated notification with retry
    App->>Analytics: Track page view engagement and load scripts
```

*The diagram shows the inspected browser, shared-app, API, Content Lake, notification, and analytics boundaries; it does not imply a direct browser connection to privileged Sanity operations.*

### Shared application bootstrap

`pages/_app.tsx` is the client/server page shell. It selects the page's optional `Component.Layout`, falling back to `EmptyLayout`, and mounts the page component inside MUI's `ThemeProvider`, Emotion's `CacheProvider`, and `CssBaseline`. `SWRConfig` supplies a single session-level fetcher, `(url) => axiosClient.get(url)`, enables retry-on-error, and creates a `Map` provider. Consequently, ordinary SWR reads use the shared Axios client unless a hook supplies its own fetcher.

The shell also mounts the cart wrapper, toast renderer, and dialog container. These three are `next/dynamic` imports with `ssr: false`; they are client-only islands rather than SSR output. `ProductCartWrapper` additionally waits for `useEffect` to set `mounted` before rendering, because the persisted cart is browser `localStorage` and would otherwise produce a hydration mismatch. It only exposes the lighter cart on paths beginning `/san-pham/lighters`.

Route effects are deliberately owned by the shell. `useEngagementTracking(router.pathname)` records scroll and time-on-page behavior in the browser. Another effect records the initial page view and subscribes to `routeChangeComplete`, removing the listener on cleanup. Consent mode and bfcache, speculation, and prefetch monitoring are initialized in effects and cleaned up on unmount. Analytics UI/scripts include Vercel `Analytics`, Facebook chat, Google tag/schema components, and the Umami script loaded lazily by `_document.tsx`; these are integrations, not request handlers for business data.

`pages/_document.tsx` is the document-level SSR wrapper: it emits the HTML language, metadata, fonts, scripts, `Main`, and `NextScript`, and uses Emotion server extraction to pass critical style tags to the document. It should not be used for interactive state or browser data fetching.

## Page data: static generation versus SSR

Page modules call API-client functions directly during their server data phase; they do not need to traverse an HTTP API route for public CMS content.

- Static pages such as `pages/index.tsx` use `getStaticProps`. The home page fetches blog content, a banner, and special products in parallel and returns `revalidate: 300`, so its generated props are refreshed on that interval.
- Dynamic CMS pages such as the lighter catalog use `getServerSideProps`. `pages/san-pham/lighters/index.tsx` reads the filter, fetches the first 24 items, types, and banner in parallel, filters drafts, and sets `public, s-maxage=300, stale-while-revalidate=600`.
- Search has both a page-side SSR path and an HTTP API path. Invalid search parameters become a prompt; an unavailable search source becomes a 503 page state in SSR or a 503 JSON response from `/api/search`. Valid API results receive the same shared cache policy.

The catalog's initial server props feed `useInfiniteCatalog` in the browser. An `IntersectionObserver` watches a sentinel with a 600px root margin, serializes one request at a time, appends the next page, and stops when the fetched page is empty or `nextPage * pageSize >= total`. A failed page load is held as local error state and exposed through a retry action; it does not replace the already rendered items. The client loader uses the API-client's bounded page size (1–48) and Sanity queries exclude draft documents.

## Browser API clients and SWR behavior

`api-client/axios-client.ts` is the browser-oriented HTTP client. Its base URL is `/api`, it sets JSON content type, adds non-PII request ID and timestamp headers, and adds `x-api-key` from `envConst`. Successful Axios responses are unwrapped to `response.data`. Errors are normalized into cancellation, HTTP-response, no-response, or setup-error shapes; this makes hook-level failures predictable, but callers still need to present an error state.

Read hooks use either the shared SWR configuration or an explicit fetcher. `useStaticContentBySlug` and `useShippingFees` disable focus revalidation and deduplicate for five minutes; their key is `null` when disabled or missing its input. `useOrderByNumber` also uses a null key until it has a single order number. Mutation hooks use `useSWRMutation` and run only after `trigger`: order creation and the quote form use native `fetch` or API-client modules, while Telegram mutations post through Axios. `useCreateLighterOrder` opts into `throwOnError`, so its submitter must catch a rejected trigger.

One subtle client boundary is that `components/swr` exports a Sanity `fetcher` using the tokenless browser client and a separate `creater` that POSTs to a supplied API key. The generic `SWRConfig` fetcher is Axios instead, so a hook's explicit fetcher determines which behavior applies.

## Zustand and client-only state

The lighters cart is a browser-owned Zustand store exported through `store/index.ts`. It persists items and computed totals under `inut-lighters-cart` using `createJSONStorage(() => localStorage)`, and recalculates totals during rehydration. Adding the same product and lighter type merges quantities and recalculates tiered unit price and subtotal; non-positive quantity removes the item. The layout preference is a separate persisted store under `inut-lighters-layout`, with `grid` as the default and `list` as the alternate.

These stores must not be treated as SSR state. The cart UI waits until mount, and route-aware hooks (`useCurrentCart`, `useCartConfig`, and `useHasCartSupport`) select support from `router.pathname`; currently only the `lighters` category returns a cart store. Other browser-only facilities include engagement and consent persistence. The Axios auth-token lookup is only a commented placeholder, not an implemented authentication boundary.

## Server API routes and privileged integrations

API routes validate method and payload before crossing into server-side services:

- `POST /api/orders/lighters` rate-limits attempts, requires customer fields and structurally valid Sanity references in every order item, then calls `createLighterOrder`. The server client adds `_type: "ordersLighter"`, generates an order number, and creates the document in Sanity with `useCdn: false`.
- `POST /api/quote-request` rate-limits five requests per minute per request token, requires the core quote fields, and creates the `form-nhan-bao-gia` document through the token-bearing server client.
- `POST /api/sanity/upload-image` accepts only PNG, JPEG, WebP, or SVG data, applies a 14 MB parser/input limit and a five-per-minute limiter, then uploads a Buffer as a Sanity image asset. The API route, not the browser bundle, owns the Sanity write token.
- `/api/validate-phone` checks the API key after rate limiting and format validation, then probes Zalo. It is advisory: rate limits, invalid values, and upstream errors return a successful response with `zaloRegistered: null`, so phone checking must never block quote submission. `usePhoneZaloCheck` debounces valid input by 500ms and ignores stale results.
- Telegram notification routes authenticate with `x-api-key`, validate required data and Telegram environment configuration, and call `sendWithRetry`. The order route supports retry count and base delay environment overrides and returns 429, 400, 401, 500, or 200 outcomes as appropriate. The corresponding SWR mutation hooks expose `isSending` and `error` to the form or checkout UI.

The Sanity Studio is a separate Sanity v2 workspace under `sanity/`, configured for project `soud11bs` and the `production` dataset in `sanity/sanity.json`. Its schemas and admin tools are an authoring surface; the Next.js site reads the Content Lake through the public client and writes submitted orders, quotes, and uploaded assets only through server routes. Deployment and dataset changes therefore need coordination between the Studio configuration and the web app's environment variables.

## Failure handling and safe extension points

There is no repository-wide React `ErrorBoundary` component. Failures are handled at the request/domain boundary: API routes return explicit JSON/status codes, Axios normalizes transport failures, SSR search renders an error status, infinite catalog exposes retry, and forms use validation, toasts, and mutation errors. A new page or hook should preserve that pattern rather than assuming an uncaught exception will be converted into a friendly fallback.

When adding a data path, keep the direction explicit: public reads can use `sanity-browser` and should remain tokenless; mutations, uploads, and privileged reads belong behind a `pages/api` route and `sanity-server`. For browser requests, prefer the shared Axios/SWR behavior when its normalized errors and headers are wanted; use an explicit fetcher only when the endpoint contract requires it. For persisted state, render browser-dependent UI after mount and define rehydration behavior, otherwise SSR and client markup can diverge. Finally, preserve rate limiting, method checks, input bounds, and upstream-failure semantics when introducing another external notification or analytics integration.
