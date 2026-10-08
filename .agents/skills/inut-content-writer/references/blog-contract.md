# Blog batch contract

Accept `Tên sản phẩm | số bài | URL đích` (one group per line); positive integer
counts, optional keyword/audience/date/angles. Full canonical site URLs or root
relative routes are accepted. Resolve against actual page source/product data,
including redirects. If mapping is unambiguous report the correction; otherwise
stop that group and report the conflict. Never silently map Pin to an unrelated
page. Inspect existing posts for duplicate slugs, near-duplicate titles/intents.

Use distinct informational, comparison, preparation or application intents, not
repeated landing-page copy. Ground materials, processes, usage and order details
in product sources; don't transfer facts from similar products. Unknown MOQ,
pricing and timing have no defaults. Do not write internal meta statements such
as “dữ liệu sản phẩm không xác nhận ...” in customer prose; list gaps in the
delivery report and invite customers to send their requirements instead.

## File contract

- New file: `blog/YYYY-MM-DD-slug.md`; URL-safe unique kebab-case slug.
- YAML `slug`, quoted `title` (especially colons), nonempty `tags` array, quoted
  ISO `date`; task date unless explicit override. Include `author`,
  `author_title`, `author_url`, `author_image_url` based on current posts/template.
- Useful opening excerpt, then exactly one `<!-- truncate-->****` marker.
- Structured headings, valid Markdown/internal/image links and current footer.
  Do not rename existing posts without redirect handling.
- One contextual inline CTA in prose linking the target route, then a blank line
  and exactly ONE visible URL bullet: `- [https://inutdesign.com{route}]({route})`.
  No duplicated visible-URL bullets, including when updating an authorized post.
- Preserve author/contact details only if current sources support them;
  verify before using template values as business facts.

## Scoped validation

The read-only `scripts/validate-blog.mjs` takes `--spec` pointing to JSON:
`{ "root": "/absolute/repo", "existingDir": "/absolute/repo/blog",
"groups": [{ "product": "Sticker Magnet", "count": 2,
"route": "/services/sticker/sticker-magnet", "date": "2026-10-08",
"files": ["/absolute/output/2026-10-08-example-one.md",
"/absolute/output/2026-10-08-example-two.md"] }] }`.

The date is explicit in this validation spec, even when defaulted in the input.
Use selected output paths; sandbox paths are allowed for tests. It checks
metadata, filename/date/slug, duplicate existing/batch slugs and titles, group
count, route existence, exact visible URL/CTA spacing, excerpt, footer and remark
parse. It cannot prove factual accuracy, originality or rendered UI: review those
separately. Do not scan/rewrite the whole blog or run app builds for prose alone.