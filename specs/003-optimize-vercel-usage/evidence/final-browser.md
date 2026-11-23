# Final Browser Regression

Environment: local production build from successful Node 22 build; agent-browser, 2026-11-23.

| Route / flow | Result |
|---|---|
| `/` | Expected homepage title; desktop/mobile screenshots retained |
| `/contact` | Expected title; 0 Sanity Resource Timing entries; static local banner route |
| `/contact/form` | Expected title; no form data entered or submitted |
| `/search?q=skin` | Expected search title and route loaded |
| `/creativa`, `/creativa/skin-laptop` | Expected Creativa titles |
| `/blog` | Expected blog title |
| `/san-pham/skin-laptop` | Expected listing title |
| Representative lighter detail | Expected product detail title |
| `/builder/lighters` | Builder loaded; Next remained disabled until an image is selected; upload was not invoked |
| `/checkout/lighters` | Empty-cart state rendered; no cart write or order created |

Responsive screenshots cover homepage, contact, search, blog, Creativa, and laptop listing at 390×844. Reduced-motion media preference was confirmed and keyboard Tab moved focus to the mobile Menu button. All captures are in `test-results/003-after/`.

No successful quote submission, order, upload, notification, or synchronization occurred. Production behavior is not inferred.
