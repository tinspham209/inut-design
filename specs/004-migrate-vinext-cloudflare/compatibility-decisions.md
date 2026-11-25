# Feature 004 Compatibility Decisions

## MIGRATION-CORE-REACT-19

- **Decision**: upgrade Next 15.5.29, React/ReactDOM 19.3.1, matching types,
  ESLint config, bundle analyzer and TypeScript 5.9.3 as one unit.
- **Evidence**: frozen pnpm 11.5.3 install, `tsc --noEmit`, standard Next build.
- **Rejected**: React 18/19 mixed install and peer-check suppression.

## MIGRATION-MUI5-EMOTION

- **Decision**: keep MUI 5 and pin React-19-compatible 5.18 patch set.
- **Evidence**: `_app`/`_document` preserved; browser SSR/hydration reports.
- **Rejected**: MUI 7 upgrade outside this migration.

## MIGRATION-CAROUSEL-SHARED

- **Decision**: replace unsupported `react-material-ui-carousel` with
  `ResponsiveCarousel` for five product/gallery surfaces.
- **Evidence**: keyboard arrows/Home/End, controls, responsive screenshots,
  reduced-motion handling and reduced peer graph.

## MIGRATION-THREE-STACK

- **Decision**: upgrade Fiber 9.8.2, Drei 10.7.9, Three/@types 0.187.0 atomically.
- **Evidence**: two canvas surfaces render and receive context-loss evidence.

## MIGRATION-SYNC-STORE-OVERRIDE

- **Decision**: override transitive `use-sync-external-store` to 1.6.0.
- **Rationale**: `tunnel-rat` pulls Zustand 4, which pins a package whose peer
  excludes React 19; the 1.6.0 package is API-compatible and covers React 19.
- **Evidence**: `pnpm peers check` reports no issues.
- **Rejected**: overriding React/Next peers or disabling peer checks.

## MIGRATION-SHARP-WORKER-STUB

- **Decision**: retain native `sharp` only as local/test tooling and alias Worker
  imports to an explicit failure stub.
- **Evidence**: browser encodes bounded WebP; Worker parser validates; graph
  check excludes native addon and local Worker starts without it.

## MIGRATION-SANITY-CLIENT-7

- **Decision**: upgrade `@sanity/client` to 7.28.0 to remove the legacy
  `progress-stream/speedometer` global interval in Worker global scope.
- **Evidence**: Worker starts and public reads execute; API matrix compares safely.

## MIGRATION-MUI-ICON-ESM

- **Decision**: Vite aliases MUI icons to their package ESM entrypoints.
- **Rationale**: Rolldown returned CJS module objects as React element types.
- **Evidence**: Worker pages with icons render 200 and browser console is clean.

## MIGRATION-DNS-STATE-CONFLICT

- **Status**: blocked owner evidence.
- Public DNS is already authoritative on Cloudflare while RDAP reports
  Squarespace and `pending transfer`. Feature 004 does not claim the pending
  transfer was initiated by this implementation; no registrar action was taken.

## MIGRATION-WORKERS-FREE-FIRST

- **Status**: owner-approved current operating policy, confirmed 2026-11-25.
- **Decision**: keep production Worker `inutdesign-web` on Cloudflare Free after
  the successful `inutdesign.com` custom-domain cutover; Free is the default,
  not a temporary exception.
- **Owner notification**: report Cloudflare quota/plan warnings. Do not change
  plans or prepare a Paid upgrade without an explicit owner request.
- **Future Paid TODO**: after an owner request, recheck current price, included
  usage, spending controls, observability costs and optional products, then
  update the runbooks and estimator. Historical Paid calculations are superseded.
- **Evidence**: preview/production route and API checks, 0 Worker errors, peak
  measured memory below 128 MB, and the complete production cutover.
- **Boundary**: Free-first does not relax secrets, origin validation, security,
  API, SEO, commerce or Worker graph requirements. A future Paid decision is a
  separate owner-directed change.

## MIGRATION-SANITY-SLUG-RESOLUTION

- **Status**: resolved by owner on 2026-11-24.
- `skt-t1 1` → `skt-t1-2`
- `Vân Đá` → `grey-marble`
- `bat-lua-mini-in-thuong-mau-muoi mot` →
  `bat-lua-mini-in-thuong-mau-muoi-mot`
- Standard Next and Vinext builds both pass afterward; 710 public paths, 706
  sitemap URLs and 678 search documents reconcile without validation issues.
