# Shopee handoff

## Package locations

- Golden Elegant listing: `outputs/approved/batch-01/`
- Shop identity: `outputs/approved/batch-02/`
- Collection covers: `outputs/approved/batch-03/`
- Story slides: `outputs/approved/batch-04/`
- Grouped listings: `outputs/approved/batch-05/{elegant,daisy-quilt,car,anime-street,retro}/`
- Delivery manifest: `production/delivery-manifest.json`

## Upload notes

Upload each grouped listing in this order:

1. Collection cover
2. Three-face view
3. Pattern macro
4. Lifestyle
5. Model selector
6. Coverage selector
7. Application guide

The shared model, coverage, and application slides are intentionally marked `HÌNH MINH HỌA`. They describe buying and usage options, not the exact artwork on those slides.

## Pre-publication gate

- Recheck current catalog names, active models, prices, and coverage values.
- Confirm the listing's cover and first three slides correspond to the designs offered by that listing.
- Keep the real product title and variant options synchronized with Shopee.
- Do not upload generated source files from `outputs/generated/`.
- Do not upload source templates or the competitor references.
- Do not add unsupported durability, adhesion, removability, waterproof, delivery, or material claims.

## Traceability

`delivery-manifest.json` records the approved file path, byte count, and SHA-256 digest for every listing image. Recreate the manifest whenever an approved image changes.
