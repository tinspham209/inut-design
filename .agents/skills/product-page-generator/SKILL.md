---
name: "product-page-generator"
description: "Use when generating a product page FROM an existing content.md file using the ProductPageTemplate and centralized data pattern. This skill is the right choice when a content.md already exists and you need to scaffold the data file + route. Distinct from inut-product-page-automation (which starts from scratch with no content): use THIS skill when the user already has content and just needs the code structure generated. Triggers: 'generate page from content.md', 'create route from existing content', 'scaffold product page from content', 'migrate content to ProductPageTemplate', 'turn content.md into a page'."
---

# Product Page Generator Skill

This skill automates the creation of new product pages using the standard `ProductPageTemplate` and centralized data pattern.

## Scope and Relationship to Other Skills

**Use this skill when:** A `content.md` already exists and the goal is to convert it into structured React code using `ProductPageTemplate`.

**Use `inut-product-page-automation` instead when:** Starting from scratch — no content exists yet and you need to draft a brief, generate Vietnamese SEO content, AND implement the page in one flow.

## Usage Guidelines

1. **Input Verification**:

   - Ensure the user provides a `route path` (e.g., `/an-pham-su-kien/new-product`) and a source `content.md`.
   - Read the `content.md` file using the `Read` tool.

2. **Content Parsing & Adaptation**:

   - Map markdown sections to the `ProductPageData` interface in `models/product-page.ts`.
   - Sections to identify: Hero (title/desc), Introduction (bullets/highlights), Types (product variations), Why Inut (process/apps), Contact, and Gallery.

3. **Asset Handling**:

   - Use mock images `/branding/logo.avif` for any missing assets.
   - Ensure all images use the `unoptimized` prop and maintain 4:3 aspect ratio.

4. **Code Generation**:

   - **Data File**: Add the new data object to the appropriate file in `data/product-pages/`.
   - **Route File**: Create `pages/[route]/index.tsx` using the `ProductPageTemplate`.

5. **Validation**:
   - Verify SEO tags are unique and descriptive.
   - Ensure responsive grid columns (2 mobile / 4 desktop for types).
   - Check that the `ProductPageTemplate` is correctly imported and utilized.

## Execution Flow

1. Read `content.md`.
2. Generate a `ProductPageData` JSON draft.
3. Propose changes to `data/product-pages/[category].tsx`.
4. Create the new route directory and `index.tsx`.
5. Run `pnpm lint` to verify.

## Rendering Constraints (strict)

When generating the `index.tsx`, never render page content using raw markdown injection.

**Disallowed:**

- `dangerouslySetInnerHTML` for body content
- markdown-to-HTML pipeline (`remark`, `rehype`, `DOMPurify` injection) for the product page body
- A page that is just a markdown wrapper/container

**Required:**

- The generated page must use `ProductPageTemplate` with a typed `ProductPageData` object
- All text content from `content.md` must be mapped to typed constants/arrays, not injected as raw HTML
- Section structure: hero, intro/highlights, product types, why-inut/process, contact
