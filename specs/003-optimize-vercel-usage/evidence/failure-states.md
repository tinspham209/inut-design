# Failure-State Review

Source review, 2026-11-23. Search malformed input and errors are marked `private, no-store`; cache promise rejection is cleared so a later read can retry. Creativa error/unavailable outcomes retain their explicit fallback/recovery path. Dynamic product/Creativa fallbacks remain blocking. Grouped result projections keep individual source data shapes.

Active CPU for malformed, missing, and unavailable requests is not available from Production. No CPU equivalence claim is made; see `failure-cpu.md`.
