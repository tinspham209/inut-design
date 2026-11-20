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
