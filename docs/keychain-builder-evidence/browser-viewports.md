# Keychain Builder viewport smoke

- Date: 2026-11-18
- Browser: agent-browser Chrome 157.0.8103.80
- Route: local `/builder/keychain`; uploads and snapshot API were intercepted and returned a synthetic local PNG/response, so no Sanity write was performed.
- Command: `rtk proxy node scripts/test-keychain-browser.mjs`

| Viewport | Horizontal overflow | Control order | Buttons | Input text | Keyboard focus |
| --- | --- | --- | --- | --- | --- |
| 320 × 780 | none | 01–05 | ≥44 px | ≥16 px | pass |
| 360 × 800 | none | 01–05 | ≥44 px | ≥16 px | pass |
| 390 × 844 | none | 01–05 | ≥44 px | ≥16 px | pass |
| 430 × 900 | none | 01–05 | ≥44 px | ≥16 px | pass |
| 844 × 390 | none | 01–05 | ≥44 px | ≥16 px | pass |
| 1280 × 800 | none | 01–05, two-column preview | ≥44 px | ≥16 px | pass |

The script also emulates `prefers-reduced-motion`. It does not simulate image
upload to Sanity. It uploads the synthetic fixture through a mocked API, runs
die-cut geometry and CORS-safe canvas decoding, performs all six 2D PNG renders
against a mocked snapshot response, and forces WebGL context creation to fail to
check the 2D fallback. Export clicks were captured in-page rather than saved as
files. This Chrome viewport smoke does not substitute for physical Android/iOS
QA or hosted asset access verification.

## Device simulator availability check

An iPhone 17 / iOS 26.5 Simulator was listed, but `agent-browser -p ios --device
"iPhone 17" open http://localhost:3000/builder/keychain` failed with
`Auto-launch failed: No sessionId in response`; no iOS Safari page was driven.
No Android Chrome emulator/device was connected for this pass. These failures
are not device QA evidence and leave the Android/iOS flow and physical FPS gates
open.
