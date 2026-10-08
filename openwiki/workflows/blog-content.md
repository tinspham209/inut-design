---
type: workflow guide
title: Blog Content Workflow
description: Current compact blog batch input, source grounding, file and CTA contract, and scoped verification limits.
tags: [blog, content, skills, metadata, verification]
manual_review:
  by: GitHub Copilot (user-authorized manual refresh)
  date: '2026-10-08'
  scope: Writer contract and validator source review only; no production batch or rendered UI verification
manual_sources:
  - repo://AGENTS.md
  - repo://.agents/skills/inut-content-writer/SKILL.md
  - repo://.agents/skills/inut-content-writer/references/blog-contract.md
  - repo://.agents/skills/inut-content-writer/references/input-examples.md
  - repo://.agents/skills/inut-content-writer/assets/blog-post-template.md
  - repo://.agents/skills/inut-content-writer/scripts/validate-blog.mjs
  - repo://.agents/skills/inut-design-workflow/SKILL.md
---

# Blog Content Workflow

This is a manually maintained routing guide to the authoritative writer skill,
not a replacement contract or a claim that historic articles conform. Read
`.agents/skills/inut-content-writer/SKILL.md`, its `references/blog-contract.md`,
`references/input-examples.md`, `assets/blog-post-template.md`, and the bundled
`scripts/validate-blog.mjs`. Root `AGENTS.md` is the bootstrap. If a client does
not discover skills, explicitly ask it to read the skill path; do not recreate
editor mirrors or standalone prompt wrappers.

## Compact input and routing

Accept one product group per line: `Tên sản phẩm | số bài | URL đích`.
Counts are positive integers per product, not a global total. Full canonical
INUT site URLs or root-relative routes are accepted. For example:

`Sticker Magnet | 2 | /services/sticker/sticker-magnet`

Optional overrides: `keyword`, `audience`, `date`, and `angles`; they are not
mandatory clarification questions. Example additions: `keyword: sticker nam
châm Đà Nẵng; audience: chủ shop; date: 2026-10-08; angles: phân biệt vật liệu,
chuẩn bị artwork`. Use the task's current date unless overridden: for this
review's batch examples that is **2026-10-08**, not 2025 and not a permanent
default for later tasks. Infer audience/keywords from sources and report
assumptions separately; do not claim measured SEO research without evidence.

Blog prose is not repeated landing-page sales copy. Product marketing copy uses
the writer's product-copy reference. New landing pages route to
`inut-product-page-automation`; existing `content.md` to `product-page-generator`.
Blog rendering changes also require `inut-design-workflow`.

## Inspect, ground, and preserve

1. Inspect `data/product-pages/`, route source under `pages/`, supplied facts,
   redirects, and existing articles. Validate the product/route pairing. Report
   an unambiguous canonical correction; stop an ambiguous group rather than
   silently mapping it to a different product.
2. Plan distinct informational, comparison, preparation, or application intents.
   Check existing slugs, titles, and near-duplicate intents; vary the articles
   naturally rather than repeating a landing page with different titles.
3. Create **new files only** unless specific existing files were authorized for
   update. Preserve user edits. Do not rename existing posts without redirect
   handling, and do not scan/rewrite the entire historical blog to apply a new
   contract.
4. Ground materials, production processes, usage, and order details in that
   product's sources. Never borrow unsupported facts from similar products or
   invent prices, MOQ, delivery timing, SLA, specifications, or production steps.
   Omit unknown details or invite consultation in customer prose. Report gaps
   separately; do not put internal meta statements such as “dữ liệu sản phẩm
   không xác nhận ...” in customer-facing articles.

## File, excerpt, author, and footer contract

- File: `blog/YYYY-MM-DD-slug.md`, with a unique URL-safe kebab-case `slug`.
- YAML: string `slug`, quoted `title` (especially colons), nonempty string-array
  `tags`, and a quoted ISO UTC timestamp `date` on the group day, such as
  `'2026-10-08T10:00:00.000Z'`. The filename date and slug must match metadata.
- Include `author`, `author_title`, `author_url`, and `author_image_url` using
  current posts/template; author URLs must use HTTPS. The template currently
  names `tinspham209` / `INUT Design`. Verify current sources before reusing
  author/contact values as business facts; the template is not independent
  confirmation that contact details remain current.
- Write a useful opening excerpt, then exactly one `<!-- truncate-->****`
  marker; use structured headings and valid Markdown/internal/image links.
- Use the current contact footer from the template. The validator only checks
  for `### Thông Tin Liên Hệ` and `tel:0327124321`; passing those token checks
  does not verify every footer detail or business fact.

## Contextual CTA

Write one contextual inline CTA in prose linking the canonical target route,
then a blank line and exactly one visible URL bullet:
`- [https://inutdesign.com{route}]({route})`.

Use meaningful prose before the link, not a bare list CTA. Replace `{route}`
with the resolved route. Do not duplicate visible URL bullets, including when
updating an authorized article. The validator requires a prose line containing
the route link immediately before the blank line and exact bullet; contextual
quality still requires manual review.

## Scoped validation and delivery

Run `rtk proxy node .agents/skills/inut-content-writer/scripts/validate-blog.mjs
--spec /absolute/path/to/batch.json` from the repository root. The JSON spec
contains absolute `root` and `existingDir` paths, and `groups`, each with
`product`, positive `count`, canonical `route`, explicit `date` (`YYYY-MM-DD`),
and selected absolute `files` paths. Put the date in the spec even when defaulted
in compact input. The authoritative blog-contract reference has a full JSON
example; sandbox output paths are allowed for tests.

The read-only validator checks selected outputs for metadata, filename/date/slug,
existing/batch duplicate slugs and normalized titles, group counts, canonical
page-file existence, exact CTA/bullet spacing, excerpt/footer tokens, certain
internal uncertainty phrases, and remark parsing. It reads other articles'
metadata for uniqueness and can report parsing errors there; it does not
validate their full contract or mutate them. Route redirects and ambiguous
product mapping must be reviewed before supplying the canonical route: the
script does not automatically resolve those mappings. Markdown parse success
does not establish link/image availability, factual accuracy, originality,
semantic intent diversity, or rendered UI behavior.

Manually review those limits and report created/authorized-updated files,
per-group counts, canonical route mappings, sources, assumptions/gaps, and
checks performed. Do not generate/edit production posts merely for evaluation.
Prose-only changes need scoped checks, not full app lint/build. Runtime,
rendering, or route changes additionally require engineering checks and
appropriate browser proof; see [Testing and Verification](../testing/regression-and-verification.md)
and [Quickstart](../quickstart.md).