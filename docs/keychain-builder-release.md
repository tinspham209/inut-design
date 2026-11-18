# Keychain Builder release record

## Server image normalization

- `sharp@0.32.6` is pinned exactly for server-side decode, dimension limits, orientation normalization, and WebP conversion. The npm registry reports Apache-2.0 and Node.js `>=14.15.0`, compatible with the repository's `>=20.0.0 <26.0.0` engine range. See the [sharp 0.32.6 changelog](https://sharp.pixelplumbing.com/changelog/v0.32.6/) and [versioned npm package metadata](https://www.npmjs.com/package/sharp/v/0.32.6).
- Upload processing rejects unknown/corrupt formats, caps decode at 20 megapixels and each axis at 12,000 px, then produces a WebP no larger than 2048 px per side. The normalized image has metadata stripped by decode/re-encode.

## Open release gates

- `@imgly/background-removal` is not installed or enabled. The package/model/deployment redistribution and production-use license still requires owner verification.
- No contour/union dependency is selected yet. Die-cut implementation remains a prerequisite to evaluate whether the native contour approach needs a package.
- Verify privacy obligations before public use with real customer imagery, despite the approved public-asset and retention policy.
- Production must approve demo frame geometry, anchors, rings, sizes, and physical appearance after reviewing the builder output. The PNG is a showcase image, not a cutting or printing file.
- Mobile browser, physical Android/iPhone performance, 3x ring quality, retention and manual-deletion evidence remain outstanding.
