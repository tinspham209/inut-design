# Builder overview and navigation evidence

- `/builder` rendered exactly the two canonical cards in Keychain then Lighter order, matching homepage titles, descriptions, “Mới” badge state, images, and routes.
- At 360 px the cards stacked in DOM and keyboard order without horizontal overflow; at 1440 px they appeared side by side with the Keychain card outlined for visual priority.
- Keyboard activation from the first card reached `/builder/keychain`; activation from the second reached `/builder/lighters`.
- Existing navigation remained available under **Sản Phẩm → Tự thiết kế**. Activating that entry reached `/builder`.
- Focused axe audit of the shared promotion on `/builder` reported 0 violations and 14 passes. The normal-render screenshots are `builder-index-360.png` and `builder-index-1440.png`.
- Provider mocks recorded one click per provider for each card, with `placement: "builder_index"`. Observer re-entry did not create another view within the same mount. A browser-history remount started a new impression lifecycle.

Navigation uses the site's existing navigation tracking. The Builder promotion
event is emitted only by the Hero and the dedicated Builder cards.
