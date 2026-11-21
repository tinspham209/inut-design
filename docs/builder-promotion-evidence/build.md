# Production build evidence

- Command: `pnpm build`
- Result: PASS, exit 0. Next.js compiled successfully, generated 233 static pages,
  and completed the postbuild sitemap and SEO checks.
- `/` generated with ISR (300 seconds); `/builder`, `/builder/keychain`, and
  `/builder/lighters` generated as static routes.
- Existing non-blocking notice: Browserslist reports stale `caniuse-lite` data.
- No environment-related blocker occurred.
- Run: 2026-11-21.
