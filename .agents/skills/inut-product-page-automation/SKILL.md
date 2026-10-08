---
name: inut-product-page-automation
description: "Use for a new INUT product landing page from scratch: draft brief, Vietnamese SEO content and Next.js route, or draft-only positioning requests. Triggers include tạo trang sản phẩm mới, auto page sản phẩm, draft rồi làm route, new product landing page and auto route sản phẩm. Use product-page-generator instead when content.md already exists."
---

# Draft-first product page automation

Read [inputs and brief recipe](references/input-recipes.md), the
[writer](../inut-content-writer/SKILL.md) for grounded landing copy, and
[engineering workflow](../inut-design-workflow/SKILL.md) for implementation.

1. Read authoritative sources and existing route/category patterns. Draft a
   concise brief: positioning, 3–5 pain points, 3–5 value propositions, technical
   points, CTA and section plan. Draft-only requests stop here without code.
2. Generate Vietnamese `content.md` using the writer's product-copy contract,
   not blog metadata/CTA-bullet requirements. Never invent commercial specs.
   If `content.md` exists, prefer generator; for an explicitly requested new
   alternative draft use `content.generated.md`. Overwrite only when authorized.
3. Confirm category/main highlights from supplied requirements or targeted QA;
   don't ask again for decisions already approved. Verify route against current
   hierarchy; never default blindly to a flat `pages/<slug>`.
4. Delegate typed data and route implementation to
   [generator](../product-page-generator/SKILL.md) and its
   [requirements QA](../product-page-generator/references/requirements-qa.md).
   Use centralized `ProductPageData` + `ProductPageTemplate`, with hero and image
   showcase. No raw Markdown/HTML injection or new competing page abstraction.
5. Verify lint, runtime/routing build and browser UI as applicable. New actions
   require both analytics gateways; do not modify unrelated cart/Sanity flows.

Report brief, content status, data/route status, assumptions, verification and
final content/SEO/image/CTA/responsiveness review checklist.
