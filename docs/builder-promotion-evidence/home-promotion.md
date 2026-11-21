# Homepage Builder promotion evidence

- At 360, 768, and 1440 CSS-pixel widths, `document.documentElement.scrollWidth` matched the viewport width. At 360 px the two cards stacked; at 768 and 1440 px they formed two columns.
- The homepage promotion is ordered after the first content section, “In ấn quà tặng,” and before services.
- DOM and keyboard order were Keychain then Lighter. Each card exposed one link with the Builder title, destination purpose, and associated description; the Keychain link name also includes “Mới”. Routes were `/builder/keychain` and `/builder/lighters`.
- The Keychain card carries the text badge “Mới” and an orange outline; it remains first on mobile and visually emphasized on desktop.
- Both existing thumbnails rendered at 1080 px natural width. When their `src` values were changed to a deliberately missing local asset, each image region retained its measured 16:9 geometry, fallback text appeared, and titles, descriptions, badges, and link destinations remained available. The simulation screenshot is `home-promotion-fallback-360.png`.
- With `prefers-reduced-motion: reduce`, the promotion link transition computed to `none`; the Hero ticker animation computed to `none`.
- A focused axe audit of the homepage promotion reported 0 violations, 11 passes, and 0 incomplete checks.
- Browser event mocks observed one `builder_promotion_view` per card/provider after each card crossed the 50% visibility threshold, and one `builder_promotion_click` per card/provider. Re-entry in the same mounted placement did not duplicate a view. Back navigation remounted `/builder`, so the new placement lifecycle recorded a new Keychain view.
- Screenshot evidence: `home-1440.png` includes the Hero and beginning of the promotion with loaded thumbnails; `home-promotion-fallback-360.png` demonstrates failed-image behavior.

The local browser did not exercise hosted analytics delivery. When
`IntersectionObserver` was undefined, cards and links still rendered; view
impressions were intentionally skipped, as documented in the contract.
