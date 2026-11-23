# Contact Banner Migration Comparison

Capture environment: local production build on 2026-11-23; screenshots are viewport captures at 1280×800.

- Before: `test-results/003-baseline/contact.png`
- After: `test-results/003-after/contact/desktop.png`
- Mobile after: `test-results/003-after/contact/mobile.png`
- Image file: `public/branding/contacts/contact-page-banner.jpg` (1200×630, JPEG; source/hash in `contact-banner-source.md`).

The visible `/contact` layout, logo, contact copy, spacing, CTA order, button shape, and colors match in the before/after captures. The current viewport does not reach the banner image, so image fidelity is established by migrating the exact published 1200px quality-80 Sanity rendition, not by a pixel comparison of below-fold content. No layout or contact-link change was observed. Route is static in the final build.
