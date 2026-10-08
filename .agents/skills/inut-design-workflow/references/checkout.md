# Cart / checkout audit

Inputs: change summary and affected files. Read `store/cart/lightersCart.ts`,
`utils/priceCalculator.ts`, `pages/checkout/lighters.tsx`, the relevant server API
route and `api-client/sanity-server.ts` before modifying contracts.

- Keep persistence key `inut-lighters-cart` unchanged.
- Recalculate `unitPrice` and `subtotal` on every quantity change.
- Preserve customer/pricing fields, order-number format, reference integrity,
  successful writes and confirmation display.
- Each Sanity array item needs a unique `_key`. Canonical item:
  `{ _key: productId-lighterTypeId-timestamp-index, product: { _ref: productId,
  _type: "reference" }, lighterType: { _ref: lighterTypeId, _type: "reference" },
  quantity, unitPrice, subtotal }` (compose the key as a string).

## Audit recipe

1. Identify persistence, pricing and payload behavior changes and consumers.
2. Inspect mapped order items and test unique keys / references / totals.
3. Check dual checkout analytics at action source with no duplicate purchases.
4. QA add, quantity update, removal, reload persistence, pricing tiers, empty
   cart, order creation and confirmation. Use mocks or an authorized test dataset;
   don't create real orders as an unapproved test.
5. Report risk (low/medium/high), evidence, mitigation and remaining manual checks.