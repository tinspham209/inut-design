# Dual analytics

Add tracking for new behaviors, pages, paths and interactive elements, using
`utils/analytics.ts` (GA4/GTM) and `utils/umamiAnalytics.ts` (UmamiJS).
Reuse established names; changing names needs a migration plan. Emit at the
click/submit/view source, not unrelated effects or rerenders; avoid duplicate
page-view instrumentation. Inspect existing view lifecycle before adding a view.

Include meaningful product ID/name/category, value, quantity and journey step.
Use consistent properties and VND for monetary context. Guard unavailable
`window`, `gtag`, `dataLayer` and Umami so SSR/disabled trackers remain safe.

Preserve conversions: `order_button_click`, `contact_click`, `zalo_click`,
`form_submit`, `purchase`, `cta_click`. Preserve engagement:
`service_click`, `blog_post_click`, `blog_post_view`, `cart_view`.
Check one emission per action in both trackers and synchronize
`docs/ANALYTICS_GUIDE.md` for event additions/removals.