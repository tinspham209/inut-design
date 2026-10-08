# Sanity contracts

Respect current types: `products`, `productType`, `lighterProducts`, `lighterType`,
`macnut`, `macnutType`, `ordersLighter`, `bankInfo`, `banner`. Inspect actual
schemas before changing fields. Avoid destructive schema changes without an
explicit requirement. Every written array item needs a unique `_key`.
Maintain `_ref` / `_type: "reference"` integrity and dereferencing (`product->`,
`lighterType->`) with consumer-compatible shapes.

Keep GROQ projections explicit/minimal, including nested fields; don't over-fetch.
Public reads belong in `api-client/sanity-browser.ts`; tokens/writes belong in
`api-client/sanity-server.ts` and server API routes. Do not hardcode IDs, datasets
or tokens. Use `sanityImageUrl` presets. Preserve required customer/pricing fields,
`ordersLighter` schema alignment, and order-number format used by admin workflows.
Validate consumer shapes and reference resolution, not just query syntax.