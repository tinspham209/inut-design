# Keychain Builder release record

## Server image normalization

- `sharp@0.32.6` is pinned exactly for server-side decode, dimension limits, orientation normalization, and WebP conversion. The npm registry reports Apache-2.0 and Node.js `>=14.15.0`, compatible with the repository's `>=20.0.0 <26.0.0` engine range. See the [sharp 0.32.6 changelog](https://sharp.pixelplumbing.com/changelog/v0.32.6/) and [versioned npm package metadata](https://www.npmjs.com/package/sharp/v/0.32.6).
- Upload processing rejects unknown/corrupt formats, caps decode at 20 megapixels and each axis at 12,000 px, then produces a WebP no larger than 2048 px per side. The normalized image has metadata stripped by decode/re-encode.

## Local background removal dependency assessment (2026-11-18)

- Contour/union review: the existing native alpha-mask extraction plus the revision-aware worker's mask union meets the current die-cut requirements, so no additional contour package is needed.
- `@imgly/background-removal@1.7.0` is pinned with its exact peer `onnxruntime-web@1.21.0`. The package's included `LICENSE.md` and upstream repository state AGPL-3.0; the package uses a separately served model/WASM asset bundle. The selected `isnet_quint8` model is the quantized option. Upstream documentation says its current supported Next.js version is 15, while this repo remains on Next 12.3.1; local build compatibility is checked, but vendor-supported compatibility is not claimed.
- Inference runs in the browser on CPU. The source image is fetched from the existing public Sanity URL and passed as a Blob to the model; it is not sent to IMG.LY. The processed WebP is then uploaded through the existing keychain upload API so preview/export/snapshots can reuse it. Model and WASM assets use IMG.LY's default static asset host unless a custom `publicPath` is configured.
- The die-cut flow now handles solid black or white image backgrounds with a local edge-connected color removal pass before contour extraction. Existing transparent images keep their alpha. This path does not load IMG.LY; non-solid opaque backgrounds still require an already-transparent source or the separately gated model flow.
- `NEXT_PUBLIC_KEYCHAIN_BACKGROUND_REMOVAL_ENABLED` defaults to `false` in `.env.example`. When false, the production build aliases the package to a local stub, so the AGPL package is not included in shipped client/server chunks. Do not enable it for public deployment until T091 verifies the package, model, redistribution and deployment terms with the responsible owner. IMG.LY advises self-hosting model/WASM assets in production. This record is a technical assessment, not legal approval.
- Primary sources: [upstream package README and Next.js/model guidance](https://github.com/imgly/background-removal-js/blob/main/packages/web/README.md), [package metadata and peer dependency](https://github.com/imgly/background-removal-js/blob/main/packages/web/package.json), and [AGPL license](https://github.com/imgly/background-removal-js/blob/main/packages/web/LICENSE.md).

## Open release gates

- ML background removal through IMG.LY remains disabled by default. The package/model/deployment redistribution and production-use license still requires owner verification before public enablement (T091). The local solid black/white die-cut path does not use that package.
- Initial dependency review: IMG.LY's [`background-removal-js` repository](https://github.com/imgly/background-removal-js) states the software is AGPL; its [web changelog](https://github.com/imgly/background-removal-js/blob/main/packages/web/CHANGELOG.md) records the license change and separation of model data into its own package. The vendor's [production asset guidance](https://github.com/imgly/background-removal-js/blob/main/packages/web/README.md) recommends self-hosting model/WASM assets. This is not an owner-approved license decision; package/model/deployment terms still need review against INUT's intended distribution.
- Die-cut uses bounded native alpha extraction, pixel-mask union and a revision-aware worker; no contour/union dependency is required by the current implementation. Geometry is a demo outline, not a production-cut guarantee.
- Verify privacy obligations before public use with real customer imagery, despite the approved public-asset and retention policy.
- Production must approve demo frame geometry, anchors, rings, sizes, and physical appearance after reviewing the builder output. The PNG is a showcase image, not a cutting or printing file.
- Mobile browser, physical Android/iPhone performance, 3x ring quality, retention and manual-deletion evidence remain outstanding.

## Verification record (2026-11-18)

- Background removal dependency build check: `rtk pnpm lint` and `rtk pnpm build` pass on the repository's Next.js 12.3.1 with the package present in the dependency graph. This proves local bundle compilation only, not vendor-supported Next.js 12 runtime compatibility. With the default flag off, the production alias excludes IMG.LY/ONNX code from shipped chunks. The opt-in browser operation has not been run against a Sanity asset; the public feature flag remains false.
- Desktop visual smoke: Chrome 157.0.8103.80 at 1280 × 720 rendered the route, five control groups and DEMO notice; acrylic transition cancel preserved clear acrylic. Evidence: [desktop browser check](keychain-builder-evidence/desktop-browser.md) and its screenshot. This did not exercise image upload, die-cut worker, Export, or mobile layout.

## Verification record (2026-11-19)

- `rtk pnpm lint` passes with existing warnings; `rtk pnpm build` passes.
- Local Chrome browser smoke used the supplied black-background unicorn and white-background badge images with `/api/keychain/uploads` intercepted, so no test assets were written to Sanity. Both images rendered as die-cut silhouettes; CMS persistence and export were intentionally not verified in that isolated run.
- Responsive browser smoke: Chrome 157.0.8103.80 passed 320/360/390/430 px portrait, 844 × 390 landscape and 1280 × 800 desktop checks for horizontal overflow, order, focusability, 44 px buttons, 16 px inputs, scrolling and bottom spacing. With local API mocks, a synthetic image also passed die-cut/CORS canvas flow, all six PNG renders and forced WebGL fallback. Evidence: [viewport results](keychain-builder-evidence/browser-viewports.md). No Sanity asset or snapshot was written.
- Local verification: `rtk pnpm lint`, `rtk pnpm build`, and `rtk proxy node --test --import ./scripts/register-typescript-loader.mjs ./scripts/tests/keychain-*.test.mjs` pass. The current five Node suites cover upload normalization, synthetic geometry, renderer contracts, API validation/fingerprinting and telemetry sanitization; they do not prove a live Sanity lifecycle or pixel-perfect browser rendering.
- Public asset behavior: code stores ordinary Sanity image references and returns CDN URLs, but no fresh unauthenticated GET was performed in this pass because no test upload was made. Verify with the exact synthetic test asset URL using `curl -I '<asset-url>'` and a browser request without cookies before release.
- Retention/manual deletion: no live document was created or deleted. Simulate 30/90/365-day reads, delete a synthetic snapshot manually in Studio, verify direct API read returns 404, and verify a shared asset remains while another snapshot references it.
- Not measured here: Android Chrome and iOS Safari models, physical-device drag/pinch FPS, 3x ring quality, WebGL fallback, worker cancellation in a real browser, and hosted analytics/network payloads. Keep these as release gates.
- Motion policy: 2D edits only move on pointer/keyboard input; 3D uses demand rendering and disables damping; loading/status UI is static. There is no autoplay, so `prefers-reduced-motion` users receive the same non-animated preview. A source-level regression check covers this policy; native accessibility behavior still needs device QA.
