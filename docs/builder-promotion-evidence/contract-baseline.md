# Builder promotion contract baseline

- Command: `node scripts/tests/builder-promotion.test.mjs`
- Result before Hero and promotion UI implementation: expected failure (exit 1).
- Failure: `Hero primary CTA must default to /builder` (`scripts/tests/builder-promotion.test.mjs:24`).
- Context: canonical Builder IDs/routes and the privacy-safe analytics foundation were present; the Hero still used its old destination and had no Builder-promotion handler. The shared promotion component was not implemented yet.
- Captured: 2026-11-21.
