---
description: "Generate or update blog markdown content in Inut Design format with valid frontmatter and SEO-aware structure"
agent: inut-maintainer
---

Create or update blog posts for this repository.

Inputs:

- Topic: ${input:topic:Main topic}
- Quantity: ${input:quantity:Number of posts}
- Target keyword: ${input:keyword:Primary SEO keyword}
- Audience: ${input:audience:Who is this for?}

Requirements:

1. Follow blog frontmatter conventions (`slug`, `title`, `tags`, `date`).
2. Use `YYYY-MM-DD-slug.md` naming.
3. Keep markdown compatible with existing rendering pipeline.
4. Avoid duplicate slugs or titles close to existing posts.
5. Provide a concise list of created/updated files.
