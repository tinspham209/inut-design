---
description: "Use when implementing or changing analytics events, GTM/GA tracking, or conversion instrumentation"
applyTo: "utils/analytics.ts,pages/**/*.{ts,tsx,js,jsx},components/**/*.{ts,tsx,js,jsx},docs/ANALYTICS_GUIDE.md"
---

# Analytics Instructions (Inut Design)

## Goal

Ensure dual event tracking (GA4 + UmamiJS) remains accurate, non-duplicated, and consistent across product and conversion flows. Automatically integrate tracking when creating or updating interactable elements.

## Tracking rules

- **MANDATORY**: Always create tracking events when introducing new behaviors, features, or pages.
- Use `utils/analytics.ts` and `utils/umamiAnalytics.ts` as the main event gateway.
- Reuse established event names unless there is a clear migration plan.
- Fire events at user action source (click, submit, view), not from unrelated side effects.
- Avoid duplicate event emission from rerenders/effects.

## Event payload quality

- Include meaningful context: product id/name/category, value, quantity, journey step.
- Keep currency convention as VND where relevant.
- Use consistent property naming for easier reporting.

## Validation expectations

- Verify no runtime errors when `window`, `gtag`, or `dataLayer` are unavailable.
- Confirm key conversion events remain intact (`order_button_click`, `contact_click`, `form_submit`, `purchase`).
- Keep docs synchronized if adding/removing event types.
