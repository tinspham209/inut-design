# Product page inputs

Full task: product name, primary keyword, audience; optional route and hero image.
Infer optional route only from current category hierarchy and verify collisions.
Missing image may use `/branding/logo.avif` as a reported placeholder, never a
claimed real product photo. Product specs are sourced, not defaulted.

Draft-only task uses product/keyword/audience and returns positioning, pain
points, value propositions, technical points, CTA, proposed kebab-case route and
content section plan in the professional/modern/friendly INUT voice. No route or
data writes for draft-only intent.

End-to-end task produces brief → `content.md` → centralized data → route → review.
Preserve an existing `content.md`; use `content.generated.md` for an alternative
unless explicit overwrite consent exists. Reuse the current generator pattern,
not obsolete route examples. Include hero/showcase and final human review.