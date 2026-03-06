---
description: "Use when editing Sanity schemas, GROQ queries, Sanity client logic, or order write flows"
applyTo: "sanity/**/*.{js,ts,tsx},api-client/**/*.{ts,tsx,js,jsx},models/**/*.{ts,tsx,js,jsx}"
---

# Sanity CMS Instructions (Inut Design)

## Goal

Maintain schema compatibility and stable read/write behavior between Next.js frontend and Sanity v2.

## Schema and content model rules

- Respect current document types and references (`products`, `productType`, `lighterProducts`, `lighterType`, `macnut`, `macnutType`, `ordersLighter`, `bankInfo`, `banner`).
- For arrays in Sanity documents, include unique `_key` values in write payloads.
- Avoid destructive schema changes unless explicitly requested.
- Preserve relationship integrity for references (e.g., `product->`, `lighterType->`).

## Query rules

- Keep GROQ projections explicit and minimal.
- Do not over-fetch nested fields.
- Maintain shape compatibility with existing consumers in `pages/*` and `components/*`.

## Client configuration rules

- Preserve env-driven configuration in `api-client/sanity-client.ts`.
- Do not hardcode project id, dataset, or tokens.
- Use existing image helper patterns (`urlFor`).

## Checkout/order write safety

- Keep `ordersLighter` payload structure aligned with schema.
- Preserve required customer and pricing fields.
- Keep order-number generation format compatible with existing admin workflows.
