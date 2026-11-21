# Quickstart: Validate Builder Promotion

## Prerequisites

- Node.js supported by `package.json`
- pnpm 10.32.1
- Existing dependencies installed with `pnpm install --frozen-lockfile`
- Browser automation available for rendered UI evidence

## 1. Run focused contract checks

```bash
rtk node scripts/tests/builder-promotion.test.mjs
```

Expected:

- exactly two Builders are present;
- Keychain is first;
- `keychain` maps only to `/builder/keychain`;
- `lighter` maps only to `/builder/lighters`;
- the Hero CTA label is exactly “Tự thiết kế ngay” and maps to `/builder`;
- analytics Builder and placement values match the documented contract;
- no analytics property beyond the fixed allow-list can be emitted by the helper.

## 2. Run repository checks

```bash
rtk pnpm lint
rtk pnpm build
```

Both commands must exit successfully. If the build is blocked by unrelated
environment configuration, retain the complete failure and do not treat it as
feature evidence.

## 3. Start the application

```bash
rtk pnpm dev
```

Open the URL printed by Next.js (normally `http://localhost:3000/`; it selects
the next available port when 3000 is occupied).

## 4. Verify the primary journey

At 360 × 800 and 1440 × 900 CSS pixels:

1. Confirm the homepage's first primary action says “Tự thiết kế ngay”.
2. Activate it and confirm arrival at `/builder` in one navigation.
3. Return to `/` and confirm the Builder promotion follows the “In ấn quà tặng”
   section and precedes services, with Keychain first and Lighter second.
4. Activate each promotion and confirm the corresponding exact destination.
5. Open `/builder` and compare names, order, badge, descriptions, and routes with
   the homepage promotion.

## 5. Verify responsive and accessibility behavior

At 360, 768, and 1440 px:

- No horizontal scroll.
- No overlapping or obscured card action.
- Keychain remains before Lighter in DOM, visual, and keyboard order.
- “Mới” is conveyed as text.
- Tab focus is visible and each card has one useful primary tab stop.
- With reduced motion enabled, no promotional motion is required to understand or
  operate the content.
- With promotional images blocked, layout remains stable and all titles,
  descriptions, badges, and links remain usable.
- With `prefers-reduced-motion: reduce`, the promotion card transitions and
  Hero ticker animation are disabled.

## 6. Verify analytics

Before activating links, replace `window.gtag` and `window.umami.track` with
call-recording functions. Filter counts to `builder_promotion_view` and
`builder_promotion_click`, since app-level page-view and engagement events have
separate owners. Use the recorded calls to verify:

1. Bringing the homepage promotion into view emits one
   `builder_promotion_view` for Keychain and one for Lighter in each available
   provider.
2. Re-scrolling the same mounted placement does not emit another view.
3. Activating either card emits one `builder_promotion_click` in each provider.
4. Activating the Hero CTA emits one overview click with placement `home_hero`
   and `builder_id: overview`.
5. Each event contains only `builder_id`, `placement`, and `action`.
6. Disabling either provider does not stop rendering or navigation.

## 7. Acceptance outcome

The feature is ready for task breakdown when direct routing, order, responsive
behavior, keyboard operation, fallback behavior, analytics de-duplication, lint,
and build are all proven. User-study and 30-day conversion targets remain
post-launch business measurements and do not substitute for the executable checks
above.
