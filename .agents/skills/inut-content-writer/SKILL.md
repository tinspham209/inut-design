---
name: inut-content-writer
description: "Use for Vietnamese INUT Design product marketing/SEO descriptions and Markdown blog batches, including viết content, viết bài giới thiệu sản phẩm, blog batch, metadata/frontmatter, CTA and article updates. Accept compact Tên sản phẩm | số bài | URL đích with keyword/audience/date/angles optional. Ground printing/design copy in authoritative data and canonical routes. Blog prose is distinct from landing-page copy; rendering code also needs inut-design-workflow."
---

# INUT content writer

Write professional, modern, friendly Vietnamese with accurate printing/design
terminology, natural keywords and useful guidance for Da Nang customers. Avoid
keyword stuffing, repetitive sales prose and unsupported superiority claims.

## Inputs and routing

Read [input examples](references/input-examples.md) for canonical recipes.
For blog batches accept one line per group: `Tên sản phẩm | số bài | URL đích`.
Keyword, audience, date and angles are optional, not mandatory clarification
questions. Use the task's current date unless overridden; infer suitable audience
and keywords from sources, reporting assumptions separately.

Blog work: [blog contract](references/blog-contract.md) and
[post template](assets/blog-post-template.md). Product/landing copy:
[product copy](references/product-copy.md), not a compulsory blog sales outline.
New complete landing page: [automation](../inut-product-page-automation/SKILL.md).
Existing content-to-code: [generator](../product-page-generator/SKILL.md).

## Workflow

1. Read authoritative `data/product-pages/`, route source under `pages/`, supplied
   facts and existing articles. Resolve canonical routes using source/redirects.
2. Validate each group/product/route. Correct an unambiguous old route with a
   reported mapping; flag ambiguity rather than silently guessing.
3. Plan distinct search intents/titles, checking existing slugs and articles.
   Vary naturally; don't claim measured SEO research without evidence.
4. Write new posts only unless specific existing files were authorized for update.
   Preserve user edits. Never invent price, MOQ, SLA, specifications or production
   steps. Omit unknown specifics or invite consultation in customer prose; report
   source gaps separately, not as internal data-uncertainty meta statements.
5. Validate selected outputs with the bundled scoped validator; manually review
   factual accuracy, intent diversity and contextual CTA.
6. Report created files, per-group counts, canonical routes, sources,
   assumptions/gaps and checks. Parsing is not browser rendering proof.

Run `rtk proxy node .agents/skills/inut-content-writer/scripts/validate-blog.mjs
--spec /absolute/path/to/batch.json` using the blog-contract spec format.
Never generate/edit production posts merely for evaluation.
