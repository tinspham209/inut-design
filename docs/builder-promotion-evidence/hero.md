# Hero Builder CTA evidence

- Tested locally with `agent-browser` against `http://localhost:3001/` on 2026-11-21.
- At 360 × 800 CSS pixels, “Tự thiết kế ngay” linked to `/builder`; its measured box was 50.5 px high at y=350.4–400.9, fully inside the first viewport.
- At 1440 × 900 CSS pixels, the CTA box was 50.5 px high at y=432.9–483.4 and linked to `/builder`.
- Keyboard focus followed the Hero primary action before the outlined “Báo giá ngay” action. Pressing Enter on the primary action arrived at `/builder`.
- With call-recording mocks installed before activation, the Hero emitted exactly one `builder_promotion_click` per provider with `{ builder_id: "overview", placement: "home_hero", action: "click" }`. Existing page-view/time-on-page events were excluded from the promotion count.
- With provider functions throwing, the browser recorded the generic GA4/GTM and Umami error messages and still navigated to `/builder`. With providers missing, the route remained available.
- The Builder section follows the first content section, “In ấn quà tặng.” The Hero CTA remains the first Builder entry point. Responsive screenshots and the Hero bounds are recorded in the sibling evidence files.

Hosted analytics delivery is not established by these local mocks.
