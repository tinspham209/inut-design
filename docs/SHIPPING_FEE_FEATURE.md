# Shipping fee flow

## Scope

The lighter checkout at `/checkout/lighters` loads shipping fees from Sanity,
selects a default from the delivery address, permits an explicit override and
stores the accepted numeric fee with the order.

Creativa has a separate server-quoted shipping contract under
`utils/creativa/quote.server.ts`; do not replace it with the lighter client flow.

## Source of truth

- Schema: `sanity/schemas/shippingFee.js`
- Model: `models/shippingFee.ts`
- API client: `api-client/shippingFee.ts`
- SWR hook: `hooks/useShippingFees.ts`
- Address detection: `utils/shippingDetection.ts`
- Checkout consumer: `pages/checkout/lighters.tsx`

Each Sanity record contains `name`, `slug`, `fee` and optional `note`. The
current selection contract uses `da-nang` for Đà Nẵng and falls back to
`toan-quoc`; if that record is absent, the first returned fee is the fallback.

## Runtime behavior

1. The checkout loads all `shippingFee` documents through
   `shippingFeeApi.getAll()`.
2. The initial/default fee is `toan-quoc`.
3. While the user edits the address, the detector normalizes Vietnamese text and
   selects `da-nang` when the address identifies Đà Nẵng.
4. A manual shipping selection disables later automatic replacement until the
   user changes that choice.
5. The displayed and submitted breakdown is:

   ```text
   finalAmount = totalAmount + shippingFee - discount
   ```

6. The order stores numeric `shippingFee`, `totalAmount`, `discount` and
   `finalAmount`; the pricing display uses the same recalculated values.

## Verification

- Change a blank/generic address and verify the `toan-quoc` default.
- Enter a Đà Nẵng address and verify the automatic selection.
- Manually choose a different fee, then edit the address and verify the manual
  choice is retained.
- Recalculate item totals after quantity changes and verify the submitted
  amount matches the checkout summary.
- In order tracking, verify `shippingFee` and `finalAmount` match the stored
  order.

Do not hardcode current fee amounts in code or documentation; those values are
managed in Sanity.
