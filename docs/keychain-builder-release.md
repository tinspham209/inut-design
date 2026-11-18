# Keychain Builder release record

## Server image normalization

- `sharp@0.32.6` is pinned exactly for server-side decode, dimension limits, orientation normalization, and WebP conversion. The npm registry reports Apache-2.0 and Node.js `>=14.15.0`, compatible with the repository's `>=20.0.0 <26.0.0` engine range. See the [sharp 0.32.6 changelog](https://sharp.pixelplumbing.com/changelog/v0.32.6/) and [versioned npm package metadata](https://www.npmjs.com/package/sharp/v/0.32.6).
- Upload processing rejects unknown/corrupt formats, caps decode at 20 megapixels and each axis at 12,000 px, then produces a WebP no larger than 2048 px per side. The normalized image has metadata stripped by decode/re-encode.

## Open release gates

- `@imgly/background-removal` is not installed or enabled. The package/model/deployment redistribution and production-use license still requires owner verification.
- Initial dependency review: IMG.LY's [`background-removal-js` repository](https://github.com/imgly/background-removal-js) states the software is AGPL; its [web changelog](https://github.com/imgly/background-removal-js/blob/main/packages/web/CHANGELOG.md) records the license change and separation of model data into its own package. The vendor's [production asset guidance](https://img.ly/docs/cesdk/js/starterkits/background-removal-editor-bgrmv1/) says CDN assets are for development and production assets must be self-hosted. This is not an owner-approved license decision; package/model/deployment terms still need review against INUT's intended distribution.
- Die-cut uses bounded native alpha extraction, pixel-mask union and a revision-aware worker; no contour/union dependency is required by the current implementation. Geometry is a demo outline, not a production-cut guarantee.
- Verify privacy obligations before public use with real customer imagery, despite the approved public-asset and retention policy.
- Production must approve demo frame geometry, anchors, rings, sizes, and physical appearance after reviewing the builder output. The PNG is a showcase image, not a cutting or printing file.
- Mobile browser, physical Android/iPhone performance, 3x ring quality, retention and manual-deletion evidence remain outstanding.

## Verification record (2026-11-18)

- Desktop visual smoke: Chrome 157.0.8103.80 at 1280 × 720 rendered the route, five control groups and DEMO notice; acrylic transition cancel preserved clear acrylic. Evidence: [desktop browser check](keychain-builder-evidence/desktop-browser.md) and its screenshot. This did not exercise image upload, die-cut worker, Export, or mobile layout.
- Responsive browser smoke: Chrome 157.0.8103.80 passed 320/360/390/430 px portrait, 844 × 390 landscape and 1280 × 800 desktop checks for horizontal overflow, order, focusability, 44 px buttons, 16 px inputs, scrolling and bottom spacing. With local API mocks, a synthetic image also passed die-cut/CORS canvas flow, all six PNG renders and forced WebGL fallback. Evidence: [viewport results](keychain-builder-evidence/browser-viewports.md). No Sanity asset or snapshot was written.
- Local verification: `rtk pnpm lint`, `rtk pnpm build`, and `rtk proxy node --test --import ./scripts/register-typescript-loader.mjs ./scripts/tests/keychain-*.test.mjs` pass. The current five Node suites cover upload normalization, synthetic geometry, renderer contracts, API validation/fingerprinting and telemetry sanitization; they do not prove a live Sanity lifecycle or pixel-perfect browser rendering.
- Public asset behavior: code stores ordinary Sanity image references and returns CDN URLs, but no fresh unauthenticated GET was performed in this pass because no test upload was made. Verify with the exact synthetic test asset URL using `curl -I '<asset-url>'` and a browser request without cookies before release.
- Retention/manual deletion: no live document was created or deleted. Simulate 30/90/365-day reads, delete a synthetic snapshot manually in Studio, verify direct API read returns 404, and verify a shared asset remains while another snapshot references it.
- Not measured here: Android Chrome and iOS Safari models, physical-device drag/pinch FPS, 3x ring quality, WebGL fallback, worker cancellation in a real browser, and hosted analytics/network payloads. Keep these as release gates.
- Motion policy: 2D edits only move on pointer/keyboard input; 3D uses demand rendering and disables damping; loading/status UI is static. There is no autoplay, so `prefers-reduced-motion` users receive the same non-animated preview. A source-level regression check covers this policy; native accessibility behavior still needs device QA.
