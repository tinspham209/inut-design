# Quote Form Navigation Regression

Local production build, agent-browser, 2026-11-23. `/contact/form` loaded with the expected title. No field values were entered and no quote request was submitted. Navigation remains an ordinary link with its existing query parameters; automatic prefetch is disabled at the shared route metadata and CTA links.

After the idle capture, the empty form was submitted with no customer name or phone entered. Three required controls became `aria-invalid`; success state remained false and the browser captured no submit request. No quote submission or notification was created. Idle request class counts are in `contact-form-network.md`.
