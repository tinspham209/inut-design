---
description: "Gather structured requirements before generating a product page from content.md — confirms category, images, CTA, highlights, and SEO metadata"
agent: inut-maintainer
---

# Product Page Requirements Q&A

Use this prompt template to gather requirements before generating a new product page.

---

## Context

The user wants to create a new product page at path: `{{route_path}}` using content from: `{{content_md_path}}`.

## Instructions

1. Analyze the `content.md` provided.
2. If any of the following fields are missing or unclear, ask the user specifically:
   - **Category**: Which existing data file should this belong to? (e.g., `an-pham-su-kien.tsx`, `an-pham-tiep-thi.tsx`, etc.)
   - **Hero Image**: Do we have a specific image path, or should we use the default `/branding/logo.avif`?
   - **CTA Label**: Should it be "Đặt in ngay" or something specific?
   - **Comparison Table**: If there's comparison data, which criteria should be used as columns?
   - **SEO Metadata**: Are the provided title and description optimized for the target keywords?

## Structured Questions for User

_Please present these questions if the information is not in the markdown file:_

1. **Hierarchy**: "Under which category does this product fall (Event, Marketing, Office, Photo, Souvenir, or Sticker)?"
2. **Key Visuals**: "Do you have specific images for the product types, or should I use placeholders for now?"
3. **Conversion**: "What is the primary goal of this page? Should the contact form lead to a specific 'type' identifier?"
4. **Highlights**: "I see X and Y in the text. Should these be the 4 main highlights with icons?"

## Validation Rule

DO NOT proceed with file generation until the category and main highlights are confirmed.
