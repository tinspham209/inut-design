# Keychain Builder desktop visual fixes

- Date: 2026-11-20
- Browser: agent-browser desktop Chrome at 1536×768 CSS px
- Route: local `/builder/keychain`; default demo state, no Sanity upload
- Mobile verification was skipped as requested.

## Browser measurements

- Document scroll width equals viewport width: 1536 px.
- All five right-side panels have matching `scrollWidth` and `clientWidth`
  (634/634, 315/315, 315/315, 634/634, 634/634 px); the sheen slider no longer
  pushes the material panel horizontally.
- The 2D preview canvas is 440×614 px. Nontransparent assembly pixels occupy
  `[44, 24]` through `[394, 590]`, so the keychain is centered and clear of all
  four canvas edges.
- The 3D side-orbit view shows a single centered connector set. The connector
  remains a flat two-sided plane; hardware depth was not modeled.
- This check did not validate the keychain frame/art alignment. The user still
  reports a split/offset 3D frame at oblique angles; the issue is deferred as
  T104 and remains open.

Screenshots: [2D fit and uniform acrylic](./desktop-preview-2d-2026-11-20.png)
and [3D side view](./desktop-preview-3d-side-2026-11-20.png).
