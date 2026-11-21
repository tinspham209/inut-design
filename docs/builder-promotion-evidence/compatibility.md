# Compatibility review

Reviewed the feature changes in `components/home/hero.tsx`,
`components/home/builder-promotion.tsx`, `pages/index.tsx`,
`pages/builder/index.tsx`, `utils/builderAnalytics.ts`, and
`data/builders.ts` against the scoped diff.

- No Builder state, storage, upload, design serialization, or destination-page behavior changed.
- No cart, price calculation, checkout, contact, order, or confirmation code changed.
- The existing public Builder routes remain `/builder`, `/builder/keychain`, and `/builder/lighters`.
- The new event payload uses only fixed Builder, placement, and action identifiers. It does not read query strings, asset URLs, design content, customer data, or commerce state.
- The Hero's existing quote action and all following homepage sections remain in place; the promotion follows `ServiceChildrenGrid` and precedes `ServicesSection`.
- The existing generic `ServiceCard` was not changed, so unrelated service tracking remains intact.

Review scope: source-level diff and local browser behavior. No hosted analytics or
production commerce transaction was used.
