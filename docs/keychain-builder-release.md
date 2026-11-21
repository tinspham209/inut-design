# Keychain Builder release record

## Acrylic material controls simplified (2026-11-21)

- Removed “Tự nhiên”, “Đánh bóng” and the sheen slider from the material panel.
  Removed the matching `edge`/`sheen` fields from active configuration,
  validation and 2D rendering; clear-acrylic opacity is now fixed. Acrylic
  thickness remains and still determines 3D extrusion depth.
- Old snapshots may still contain the legacy fields. Validation accepts them
  as unknown properties for read compatibility, and the client strips them
  when loading into session state. New configurations omit them.
- Current focused regression command passes 19/19. `rtk pnpm lint` and
  `rtk pnpm build` also pass; lint retains the existing unused-variable and
  analytics snake-case warnings. Toolbar screenshots below were captured
  after the shared-toolbar/mobile-height update. Phase 10 face-mode screenshots
  remain evidence for face behavior, not for the material panel.

## Phase 10 verification (2026-11-21)

- T105–T108 are implemented and checked on desktop Chrome at 1280 × 800.
  Focused render tests pass 32/32; `rtk pnpm lint` and `rtk pnpm build` pass.
- Both physical 3D caps keep their own textures. The face selector is hidden in
  3D; 2D face selection sets the starting camera orientation and is preserved
  when returning from 3D. All four clear back modes and opaque acrylic were
  exercised while 3D remained open. White backing is opaque and excludes the
  4 mm hole; opaque acrylic back uses the selected acrylic color with no print.
- The duplicate “Chỉnh riêng ảnh mặt sau” panel is removed. The shared 2D
  toolbar edits the custom reverse image; crop warning/upload/error/stale-local
  recovery status remains by the uploader. Reducer regression confirms
  `backCustom` edits do not change `front`.
- Browser screenshots: [2D custom-back toolbar](keychain-builder-evidence/phase10-2d-back-custom-toolbar.png),
  [3D through-acrylic](keychain-builder-evidence/phase10-3d-back-through-acrylic.png),
  [3D white backing](keychain-builder-evidence/phase10-3d-back-white.png),
  [3D two-sided print](keychain-builder-evidence/phase10-3d-back-mirror-front.png),
  [3D custom back](keychain-builder-evidence/phase10-3d-back-custom.png), and
  [3D opaque acrylic](keychain-builder-evidence/phase10-3d-back-opaque-material.png).
  The upload route was mocked and a synthetic local image substituted for its
  CDN URL; Sanity upload and snapshot persistence were not tested. Details and
  limits are in [browser evidence](keychain-builder-evidence/browser-viewports.md).
- T104 remains deferred: 3D frame/art alignment at oblique angles is not
  accepted and was not part of this pass. T086/T087 and T091 release gates are
  unchanged.

## Historical convergence status before Phase 10 (2026-11-20)

- Phase 9 convergence T095–T102 is implemented and locally verified, subject
  to the evidence limits below. The exact focused command reports **30/30
  passing**. `scripts/test-keychain-browser.mjs` passed against local Chrome
  with mocked upload and snapshot endpoints.
- The enabled 3D preview was exercised on front and back; camera-only controls
  preserved the selected material/design state. Forced WebGL context failure
  returned the usable 2D path. Edge, thickness and sheen values were changed
  in the browser; the 2D render changed and six PNG export variants completed
  through the mocked snapshot route.
- 320×780, 360×800, 390×844, 430×900, 844×390 and 1280×800 viewport checks
  passed for no horizontal overflow, control order, keyboard focus and input
  sizing. Every interactive target measured at least 44×44 CSS px in the four
  portrait sizes and 844×390 landscape. These are desktop Chrome responsive
  emulations, not Android/iOS device results. See
  [current browser evidence](keychain-builder-evidence/browser-viewports.md)
  and the [captured runner output](keychain-builder-evidence/browser-run-2026-11-20.json).
- The quote CTA and its keychain-snapshot linkage were removed because no
  approved spec amendment authorized a pre-Export quote flow. Snapshot creation
  remains coupled to successful PNG Export. Custom-back editing now has
  independent transform/reset controls, aspect ratio crop estimate/warning and
  stale upload recovery; focused tests cover crop estimation and local/blob or
  stale asset references prevent Export/snapshot.
- Android/iOS browser and physical-device FPS tasks T086/T087 remain blocked:
  no Android device is attached, and the iPhone 17 simulator cannot start its
  simulator service with this installed Xcode/macOS combination. No FPS result
  is claimed. T091 remains pending owner/legal confirmation; public IMG.LY
  background removal remains disabled. No fresh Sanity write, real snapshot,
  or hosted analytics network capture was performed.
- **Deferred enhancement T104:** the 3D heart frame still looks split/offset
  from its artwork at oblique angles in the current visual review. The latest
  cap-material experiment prevents an opaque duplicate back face, but desktop
  screenshot evidence does not establish accepted frame-to-art alignment. Keep
  this explicitly pending for a later enhancement pass, as requested while the
  user works on a higher-priority item; do not claim the 3D frame alignment
  requirement is complete.
- **Phase 10 T105–T108 was completed on 2026-11-21** as recorded above; the
  implementation and fresh desktop evidence supersede the planned next slice
  in this historical entry.

## Convergence validation (2026-11-20)

- Focused Node command: `rtk proxy node --test --import
  ./scripts/register-typescript-loader.mjs
  ./scripts/tests/keychain-*.test.mjs` — **30 passed, 0 failed**.
- `rtk pnpm lint` passed with existing unrelated `CreativaBreadcrumbs`
  unused-variable warning and camelcase warnings for analytics event keys.
- `rtk pnpm build` passed, including static generation and SEO smoke. Next.js
  reported that `caniuse-lite` data is outdated.
- `rtk proxy git diff --check` passed after the release documentation update.

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

- T086, T087 and T091 remain release gates. Local convergence evidence does not
  establish native-device performance or owner license approval.
- ML background removal through IMG.LY remains disabled by default. The package/model/deployment redistribution and production-use license still requires owner verification before public enablement (T091). The local solid black/white die-cut path does not use that package.
- Initial dependency review: IMG.LY's [`background-removal-js` repository](https://github.com/imgly/background-removal-js) states the software is AGPL; its [web changelog](https://github.com/imgly/background-removal-js/blob/main/packages/web/CHANGELOG.md) records the license change and separation of model data into its own package. The vendor's [production asset guidance](https://github.com/imgly/background-removal-js/blob/main/packages/web/README.md) recommends self-hosting model/WASM assets. This is not an owner-approved license decision; package/model/deployment terms still need review against INUT's intended distribution.
- Die-cut uses bounded native alpha extraction, pixel-mask union and a revision-aware worker; no contour/union dependency is required by the current implementation. Geometry is a demo outline, not a production-cut guarantee.
- Verify privacy obligations before public use with real customer imagery, despite the approved public-asset and retention policy.
- Production must approve demo frame geometry, anchors, rings, sizes, and physical appearance after reviewing the builder output. The PNG is a showcase image, not a cutting or printing file.
- Mobile browser, physical Android/iPhone performance, 3x ring quality, retention and manual-deletion evidence remain outstanding.

## Verification record (2026-11-18)

- Background removal dependency build check: `rtk pnpm lint` and `rtk pnpm build` pass on the repository's Next.js 12.3.1 with the package present in the dependency graph. This proves local bundle compilation only, not vendor-supported Next.js 12 runtime compatibility. With the default flag off, the production alias excludes IMG.LY/ONNX code from shipped chunks. The opt-in browser operation has not been run against a Sanity asset; the public feature flag remains false.
- Desktop visual smoke: Chrome 157.0.8103.80 at 1280 × 720 rendered the route, five control groups and DEMO notice; acrylic transition cancel preserved clear acrylic. Evidence: [desktop browser check](keychain-builder-evidence/desktop-browser.md) and its screenshot. This did not exercise image upload, die-cut worker, Export, or mobile layout.

## Verification record (2026-11-19; historical)

- `rtk pnpm lint` passes with existing warnings; `rtk pnpm build` passes.
- Local Chrome browser smoke used the supplied black-background unicorn and white-background badge images with `/api/keychain/uploads` intercepted, so no test assets were written to Sanity. Both images rendered as die-cut silhouettes; CMS persistence and export were intentionally not verified in that isolated run.
- Responsive browser smoke: Chrome 157.0.8103.80 passed 320/360/390/430 px portrait, 844 × 390 landscape and 1280 × 800 desktop checks for horizontal overflow, order, focusability, 44 px buttons, 16 px inputs, scrolling and bottom spacing. With local API mocks, a synthetic image also passed die-cut/CORS canvas flow, all six PNG renders and forced WebGL fallback. Evidence: [viewport results](keychain-builder-evidence/browser-viewports.md). No Sanity asset or snapshot was written.
- At this point in time, local lint/build were recorded as passing and the
  five Node suites were recorded as passing. This superseded statement is
  intentionally retained as historical evidence, not current status. The
  suites cover upload normalization, synthetic geometry, renderer contracts,
  API validation/fingerprinting and telemetry sanitization; they do not prove
  a live Sanity lifecycle or pixel-perfect browser rendering.
- Public asset behavior: code stores ordinary Sanity image references and returns CDN URLs, but no fresh unauthenticated GET was performed in this pass because no test upload was made. Verify with the exact synthetic test asset URL using `curl -I '<asset-url>'` and a browser request without cookies before release.
- Retention/manual deletion: no live document was created or deleted. Simulate 30/90/365-day reads, delete a synthetic snapshot manually in Studio, verify direct API read returns 404, and verify a shared asset remains while another snapshot references it.
- Not measured here: Android Chrome and iOS Safari models, physical-device
  drag/pinch FPS, 3x ring quality, current-code WebGL fallback, worker
  cancellation in a real browser, and hosted analytics/network payloads. Keep
  these as release gates.
- Motion policy: 2D edits only move on pointer/keyboard input; 3D uses demand rendering and disables damping; loading/status UI is static. There is no autoplay, so `prefers-reduced-motion` users receive the same non-animated preview. A source-level regression check covers this policy; native accessibility behavior still needs device QA.
