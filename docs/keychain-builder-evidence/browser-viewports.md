# Keychain Builder browser evidence

- Date: 2026-11-20
- Runner: `agent-browser 0.42.0` controlling local desktop Chrome
- Route: `http://localhost:3001/builder/keychain`
- Command: `KEYCHAIN_BASE_URL=http://localhost:3001 node scripts/test-keychain-browser.mjs`
- Full structured output: [browser-run-2026-11-20.json](./browser-run-2026-11-20.json)

| Viewport | Horizontal overflow | Control order | Interactive targets | Input text | Keyboard focus |
| --- | --- | --- | --- | --- | --- |
| 320 × 780 | none | five groups, expected order | all ≥44×44 CSS px | ≥16 px | pass |
| 360 × 800 | none | five groups, expected order | all ≥44×44 CSS px | ≥16 px | pass |
| 390 × 844 | none | five groups, expected order | all ≥44×44 CSS px | ≥16 px | pass |
| 430 × 900 | none | five groups, expected order | all ≥44×44 CSS px | ≥16 px | pass |
| 844 × 390 | none | five groups, expected order | all ≥44×44 CSS px | ≥16 px | pass |
| 1280 × 800 | none, two-column layout | five groups, expected order | desktop controls | ≥16 px | pass |

The current runner also uploaded a synthetic local PNG through a mocked CDN
URL, checked die-cut geometry and CORS-safe canvas decoding, changed edge,
thickness and sheen and observed a 2D render change, then completed all six
PNG variants through mocked endpoints. It exercised front/back in 3D, checked
that camera controls left design/material state unchanged, forced WebGL context
creation failure to verify the 2D fallback, and emulated reduced motion. It
also checked custom-back crop status and the Export readiness gate.

This is responsive desktop Chrome evidence only. The upload and snapshot APIs
were mocked; no Sanity asset, document or snapshot was created. It does not
prove physical touch behavior, Android Chrome/iOS Safari compatibility, device
FPS or hosted asset availability. See [mobile-device status](./mobile-browser.md)
and [performance status](./performance.md).

The 3D flow checks establish that the view mounts and the back/camera controls
work; they do not establish frame-to-art alignment. User visual review still
finds the frame split/offset at oblique angles. See the [3D alignment record](./3d-frame-texture-alignment-2026-11-20.md)
and deferred enhancement T104.

## Phase 10 desktop interactions (2026-11-21)

- Runner: `agent-browser 0.42.0`, local Chrome, `http://localhost:3001/builder/keychain`
- Command: `KEYCHAIN_BASE_URL=http://localhost:3001 KEYCHAIN_PHASE10_ONLY=true rtk proxy node scripts/test-keychain-browser.mjs`
- Captured runner result: [browser-run-2026-11-21-phase10.json](./browser-run-2026-11-21-phase10.json)
- Viewport: 1280 × 800 desktop only; no mobile or device verification was run.
- 2D selected the back face, switched to 3D and returned to 2D with the back
  selector still active. The 3D toolbar contained no “Mặt trước/Mặt sau” selector.
- While 3D remained open, the four clear modes (through-acrylic, white,
  mirror-front, custom) were selected in turn; the reverse material stayed
  rendered. The opaque acrylic confirmation also kept 3D active and produced a
  solid acrylic-colored reverse cap without custom print. Screenshots are
  retained as `phase10-3d-back-{through-acrylic,white,mirror-front,custom}.png`
  and `phase10-3d-back-opaque-material.png`.
- In 2D custom-back mode, the left toolbar rotated, flipped, zoomed and reset
  the reverse render; keyboard pan was exercised. The front selector remained
  available and the duplicate editor panel was absent. A reducer regression
  separately asserts that updating `backCustom` leaves `front` unchanged.
  Screenshots: `phase10-2d-back-custom-toolbar.png`,
  `phase10-2d-front-before-back-edit.png`,
  `phase10-2d-front-after-back-edit.png` and `phase10-2d-after-3d-back.png`.
- The browser run mocked `/api/keychain/uploads` and substituted a local
  synthetic image for the CDN URL. It did not call Sanity or use the snapshot
  API. The sampled 2D canvas pixel digest differed after a redraw even though
  the retained front screenshots appear visually unchanged; use the reducer
  regression, not that digest, as evidence of state independence.
- This evidence does not address the deferred T104 frame/art split at oblique
  angles; no frame alignment acceptance is claimed.

## Preview toolbar layout correction (2026-11-21)

- Runner: `agent-browser 0.42.0`, local Chrome, `http://localhost:3001/builder/keychain`
- Captured actual browser screenshots at 1440 × 900 (desktop) and 390 × 844
  (mobile viewport emulation):
  - [2D desktop](./toolbar-2026-11-21-2d-desktop.png)
  - [3D desktop](./toolbar-2026-11-21-3d-desktop.png)
  - [2D mobile viewport](./toolbar-2026-11-21-2d-mobile.png)
  - [3D mobile viewport](./toolbar-2026-11-21-3d-mobile.png)
- Desktop 2D face selector measured at intrinsic width (about 142 px total),
  not stretched across the preview. Desktop 3D hint chip stays content-sized.
  Mobile 2D canvas remained visible at 338 × 258 CSS px; mobile 3D canvas at
  338 × 210 CSS px. `document.documentElement.scrollWidth` matched the 390 px
  viewport in both mobile modes.
- These are responsive browser viewport screenshots, not physical-device
  verification. They verify toolbar flow, selector/chip sizing and preview
  visibility; they do not establish T104 frame alignment.

## Synchronized 2D/3D preview layout (2026-11-21)

- Both modes now render the same toolbar component and order: view zoom out,
  view zoom in, reset view, fullscreen, then image rotate, flip, image zoom
  out/in and reset image. The camera rotate action remains available through
  3D drag/orbit. The shared toolbar is 32 × 32 CSS px with 20 px SVG icons;
  its 2D and 3D button bounds match exactly in browser measurements.
- The view controls map to whole-keychain preview zoom/reset in 2D and camera
  zoom/reset in 3D. Image controls share transform behavior. Custom-back mode
  targets `backCustom.transform`; other modes target the front print source.
- At 390 × 844, the preview panel is 506 px tall (60vh) in both modes. Header,
  toolbar and stage bounds match exactly: 32 px, 73 px and 340 × 375 px. At
  1440 × 900, panel/header/toolbar/stage bounds also match exactly between
  modes: 809 × 814, 783 × 32, 32 × 752 and 747 × 752 px.
- Three repeated 2D↔3D cycles at each viewport retained the same measured
  panel, header, toolbar, stage and button bounds. `scrollWidth` stayed equal
  to viewport width on mobile. The 3D lazy-load fallback uses the same layout.
- Screenshots: [2D desktop](./toolbar-2026-11-21-2d-desktop-synced.png),
  [3D desktop](./toolbar-2026-11-21-3d-desktop-synced.png),
  [2D mobile viewport](./toolbar-2026-11-21-2d-mobile-60vh.png),
  [3D mobile viewport](./toolbar-2026-11-21-3d-mobile-60vh.png),
  [3D mobile with back-custom selected](./toolbar-2026-11-21-3d-mobile-back-custom.png).
  The custom-back screenshot verifies dynamic reverse-image labels and the
  hidden 3D face selector; no image was uploaded in that screenshot. Mobile is
  browser viewport emulation, not physical-device verification.
