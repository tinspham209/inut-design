# Copilot Instructions for Inut Design

## Project Overview

**Inut Design** is an e-commerce platform for custom laptop skins, stickers, and printing services in Da Nang, Vietnam. Built with **Next.js 12**, **Sanity CMS v2**, and **Material-UI v5**.

- **Website**: https://inutdesign.com
- **CMS Studio**: https://inut-design.sanity.studio/
- **Package Manager**: `pnpm` (required)
- **Node Version**: 22+ (use `nvm use 22` in sanity/)

## Architecture

### Data Flow Pattern

1. **Content (Sanity CMS)** → GROQ queries via `@sanity/client`
2. **Static Generation** → Most pages use `getStaticProps` for SSG
3. **Client State** → Zustand stores with localStorage persistence
4. **Checkout Flow** → Cart → Sanity CMS (orders) → Confirmation page

### Key Components

- **Pages**: Next.js pages router with per-page layouts via `NextPageWithLayout` pattern
- **Layouts**: Pages define layout via `Component.Layout = MainLayout` (see `pages/_app.tsx`)
- **State**: Zustand stores in `/store` - cart state persists to localStorage with key `inut-lighters-cart`
- **API Client**: `/api-client/sanity-client.ts` for all Sanity operations (no `/pages/api` routes exist)

## Path Aliases (tsconfig.json)

```typescript
"@/*": "./*"           // Root-level imports
"@/api": "./api-client/index.ts"
"@/api/*": "./api-client/*"
```

## Development Workflows

### Start Development

```bash
# Main app
pnpm dev              # http://localhost:3000

# Sanity Studio (separate terminal)
cd sanity
pnpm start            # http://localhost:3000 (in sanity context)
```

### Environment Variables Required

```bash
# .env.local (root)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production  # or 'dev'
NEXT_PUBLIC_SANITY_TOKEN=your-write-token  # Editor permissions needed
```

### Sanity Dataset Switching

- Edit `sanity/sanity.json` → `api.dataset` field
- Choose `production` or `dev`

### Deployment

```bash
# Webapp: Push to main branch → Auto-deploys via Vercel
git push origin main

# Sanity Studio
cd sanity
sanity login
sanity deploy
```

## Critical Patterns

### 1. Shopping Cart (Lighters Product Line)

**Store**: `store/cart/lightersCart.ts` (Zustand with persist middleware)

- **Tiered Pricing**: Price per unit changes based on quantity (see `utils/priceCalculator.ts`)
- **Auto-calculation**: `unitPrice` and `subtotal` recalculated on every quantity change
- **Persistence**: localStorage key `inut-lighters-cart`

**Checkout Flow** (`pages/checkout/lighters.tsx`):

1. Cart items → Sanity reference format with required `_key` property
2. Submit via `createLighterOrder()` in `api-client/sanity-client.ts`
3. Store order data in localStorage
4. Redirect to confirmation page
5. Clear cart

**Order Item Format** (CRITICAL):

```typescript
{
  _key: `${productId}-${lighterTypeId}-${timestamp}-${index}`,  // Required by Sanity
  product: { _ref: productId, _type: "reference" },
  lighterType: { _ref: lighterTypeId, _type: "reference" },
  quantity: number,
  unitPrice: number,
  subtotal: number
}
```

### 2. Blog System

- **Source**: Markdown files in `/blog` with frontmatter
- **Processing**: `unified`, `remark`, `rehype` pipeline
- **Pattern**: Posts must include `slug`, `title`, `tags`, `date` in frontmatter
- **Filename**: Convention is `YYYY-MM-DD-slug.md`

### 3. Data Fetching

**Primary Pattern**: `getStaticProps` with Sanity GROQ queries

```typescript
export const getStaticProps: GetStaticProps = async () => {
	const products = await productsApi.getAll(); // Uses Sanity client
	return { props: { products } };
};
```

**Client-side**: SWR configured in `_app.tsx` with axios fetcher

- SWR instance uses in-memory Map provider (no global cache)
- Custom fetcher: `(url) => axiosClient.get(url)`

### 4. Image Handling

- **Cloudinary**: `res.cloudinary.com` for uploaded assets
- **Sanity CDN**: `cdn.sanity.io` for CMS images
- **Helper**: `urlFor()` from `api-client/sanity-client.ts` for image URLs
- **Next Image**: Domains configured in `next.config.js`

### 5. UI Patterns

- **Dialogs**: Global dialog system via `useDialogSlice` store + `<DialogContainer />` in `_app.tsx`
- **Toasts**: `react-hot-toast` with `<Toaster />` in `_app.tsx`
- **Animations**: Framer Motion with page transitions (see `MainLayout`)
- **Cart Overlay**: `<ProductCartWrapper />` rendered globally in `_app.tsx`

## Sanity CMS Integration

### Schema Location

`sanity/schemas/` - 9 content types including:

- `ordersLighter` - Lighter product orders
- `bankInfo` - Bank transfer information
- Products, product types, banners, etc.

### Order Submission Pattern

1. Generate order number: `LIGHT-{timestamp}{random}`
2. Auto-set `orderDate` to ISO timestamp
3. Create via `client.create()` with `_type: "ordersLighter"`
4. Retrieve via GROQ with references populated: `product->`, `lighterType->`

### Common GROQ Patterns

```groq
*[_type == "products" && !isDeleted]{...}           // Get all active products
*[_type == "ordersLighter" && orderNumber == $orderNumber][0]{
  ...,
  orderItems[]{..., product->, lighterType->}       // Populate references
}
```

## Common Issues & Solutions

### Missing `_key` in array items

**Error**: Sanity warns about missing keys in arrays  
**Fix**: All array items need unique `_key` - use format: `${id1}-${id2}-${timestamp}-${index}`

### Sanity token permissions

**Error**: "Failed to create order"  
**Fix**: Token needs **Editor** permissions in Sanity dashboard → Settings → API

### Cart not persisting

**Check**: localStorage key is `inut-lighters-cart`  
**Debug**: Open DevTools → Application → Local Storage

### Image not loading

**Check**: Domain is in `next.config.js` → `images.domains` array

## Style Conventions

- **TypeScript**: Loose mode (`strict: false` in tsconfig) - avoid strict types
- **Component Structure**: Pages in `/pages`, containers/components co-located in feature folders (e.g., `pages/lighters/components/`)
- **Imports**: Use `@/` aliases for cleaner imports
- **CSS**: Global styles in `styles/globals.css`, Prism theme in `styles/prism.css`
- **MUI Theming**: Custom theme in `utils/createEmotionCache.ts` and theme definition

## Key Files Reference

- `sanity/docs/ARCHITECTURE.md` - Sanity schema, structure and Comprehensive order flow documentation
- `utils/priceCalculator.ts` - Tiered pricing logic
- `store/cart/lightersCart.ts` - Cart state management example
- `pages/_app.tsx` - Global providers and layout pattern

## Testing Approach

Currently no automated tests. Manual testing flow:

1. Add items to cart → Check localStorage
2. Checkout → Verify Sanity Studio for order
3. Bank transfer → Check QR code display

## Performance Notes

- **SSG**: Most pages are statically generated (check for `getStaticProps`)
- **Images**: Use Next.js `<Image>` with `layout="responsive"`
- **Analytics**: Vercel Analytics enabled in production
