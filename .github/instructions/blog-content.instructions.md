---
description: "Use when creating or editing markdown blog posts and blog rendering logic"
applyTo: "blog/**/*.md,pages/blog/**/*.{ts,tsx,js,jsx},utils/**/*.{ts,tsx,js,jsx},docs/**/*.md"
---

# Blog Content Instructions (Inut Design)

## Goal

Keep blog content and rendering pipeline consistent with the current markdown + frontmatter workflow.

## Frontmatter rules

- Required fields: `slug`, `title`, `tags`, `date`.
- Keep date format consistent with existing posts.
- Keep slug URL-safe and aligned with filename semantics.

## Filename conventions

- Use `YYYY-MM-DD-slug.md` for new files.
- Do not rename existing files unless migration/redirect handling is included.

## Content quality rules

- Keep headings well-structured for SEO.
- Avoid malformed markdown that breaks remark/rehype transforms.
- Ensure internal links and image paths are valid.

## Rendering safety

- If blog parsing/rendering logic changes, verify backward compatibility with existing posts.
- Prefer incremental parser changes over broad pipeline rewrites.
