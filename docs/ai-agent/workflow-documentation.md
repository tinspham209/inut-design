# AI Agent Workflow: Product Page Automation

This document outlines the workflow for the AI Agent to automate the creation of new product pages using the `ProductPageTemplate`.

## 1. Overview
The goal is to provide a consistent, zero-duplication process for expanding the Inut Design catalog. The Agent transforms raw markdown content into a structured, responsive route using a centralized data pattern.

## 2. Agent Capabilities
- **Content Parsing**: Extracts structured data from unstructured `.md` files.
- **Requirement Elicitation**: Conducts a structured Q&A to fill gaps in content.
- **Asset Management**: Enforces 4:3 aspect ratio and `unoptimized` image loading.
- **Route Generation**: Automatically creates Next.js pages and updates centralized data files.
- **Consistency Validation**: Ensures all new pages adhere to the MUI Quilted Gallery and responsive design standards.

## 3. The Workflow Process

### Step 1: Input & Analysis
- User provides `route_path` and `content_md_location`.
- Agent reads the markdown and identifies the product category.

### Step 2: Structured Q&A (Requirements Gathering)
- Agent uses the `product-requirements-qa` prompt template.
- Confirms SEO metadata, CTA labels, and icon selections.

### Step 3: Data Integration
- Agent generates a `ProductPageData` object.
- Appends the object to the relevant file in `data/product-pages/`.

### Step 4: Page Implementation
- Agent creates the directory `pages/[route_path]`.
- Generates `index.tsx` which imports the data and the template.

### Step 5: Verification
- Runs `pnpm lint`.
- Verifies image ratios and responsive grid settings.

## 4. Integration Guidelines
- **Models**: Always reference `models/product-page.ts`.
- **Components**: Never duplicate UI logic; always use `components/product-template/`.
- **SEO**: Ensure unique slugs and meta descriptions.
