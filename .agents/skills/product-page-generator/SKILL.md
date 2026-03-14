---
name: "product-page-generator"
description: "Parses content.md and adapts it to ProductPageTemplate structure to generate new product routes. Invoke when user wants to create a new product page or migrate existing content to the standard template."
---

# Product Page Generator Skill

This skill automates the creation of new product pages using the standard `ProductPageTemplate` and centralized data pattern.

## Usage Guidelines

1. **Input Verification**: 
   - Ensure the user provides a `route path` (e.g., `/an-pham-su-kien/new-product`) and a source `content.md`.
   - Read the `content.md` file using the `Read` tool.

2. **Content Parsing & Adaptation**:
   - Map markdown sections to the `ProductPageData` interface in `models/product-page.ts`.
   - Sections to identify: Hero (title/desc), Introduction (bullets/highlights), Types (product variations), Why Inut (process/apps), Contact, and Gallery.

3. **Asset Handling**:
   - Use mock images `/branding/logo.webp` for any missing assets.
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
