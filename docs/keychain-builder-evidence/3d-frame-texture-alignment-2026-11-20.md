# 3D frame and texture alignment — deferred

## Change

`KeychainMesh` keeps the generated mesh centered on the SVG `viewBox` and derives face UVs from that same coordinate system. The first UV correction did not resolve the user-reported angled view. Follow-up inspection showed `ExtrudeGeometry` grouped both cap faces under one material, so the selected print texture appeared on both the front and back surfaces. At an angle, acrylic thickness separated those copies and made the art look offset from the frame.

The cap geometry is now split into separate back and front material groups. The selected face receives its print texture, while the opposite cap is fully transparent with depth writing disabled; the side wall remains a third material group. This removes the opaque duplicate panel introduced by the previous attempt. **The user still reports that the 3D frame looks split/offset from the artwork, so this is not an accepted alignment fix.** Keep it as pending enhancement T104 and do not mark the visual requirement complete.

The UV conversion lives in `components/keychain-builder/geometry/frameUv.ts` and has a regression check for the heart frame (`viewBox="9 0 82 97"`), including its cut-path top inset.

## Verification

- Focused keychain suite: `rtk proxy node --test --import ./scripts/register-typescript-loader.mjs ./scripts/tests/keychain-*.test.mjs` — 30/30 passed. These checks cover UV conversion and material-group selection, not pixel-level frame alignment.
- Desktop browser: local route `http://localhost:3001/builder/keychain`, viewport 1536×900; heart frame with asymmetric synthetic PNG, switched to 3D. One canvas mounted, 3D selected, and `document.documentElement.scrollWidth === window.innerWidth`.
- Desktop browser after the transparent-opposite-face experiment: viewport 1280×900; synthetic asymmetric PNG shown in straight-on and angled 3D views. The opposite cap no longer renders an opaque fill, but the user rejected the overall frame/artwork alignment as still visibly split. This browser evidence records the current state; it does not prove acceptance.
- Screenshots: `desktop-3d-single-frame-front-2026-11-20.png` and `desktop-3d-single-frame-angle-2026-11-20.png`.
- Upload endpoint was mocked to return a synthetic Sanity-shaped asset reference; the browser image URL was mapped to a local fixture. No Sanity asset or snapshot was created. No mobile verification was run.
- `rtk pnpm lint` passed with existing warnings in `Homepage.tsx` and snake_case request fields in `KeychainBuilder.tsx`.
- `rtk pnpm build` passed, including static page generation and the repository SEO smoke checks.
- Status: T104 remains `[ ]` until a later enhancement pass resolves the visual mismatch and receives fresh desktop browser acceptance.
