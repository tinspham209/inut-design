# PROPOSAL: Lighter Skin Builder — INUT Design

**Feature name:** Custom Lighter Skin Designer  
**Route:** `/builder/lighters`  
**Stack:** Next.js 12.3.1 (Page Router) · React 18.2.0 · TypeScript 5.0.4 · MUI v5.9.3 · Sanity CMS v3.4.1 · Zustand 4.3.8  
**Priority:** High  
**Version:** 4.0 (Final) · March 2026  
**Status:** Ready for development planning  

---

## 1. Executive Summary

INUT Design currently handles custom lighter skin orders through a manual process: customer submits form → designer contacts to collect images → designer creates demo → customer provides feedback → production. Each order takes 3–5 exchanges just to collect assets and approve the layout.

**Solution:** Build a self-service design page at `/builder/lighters`, allowing customers to upload their design image and immediately preview a 3D full-wrap on the lighter — before adding to cart and checkout.

**Expected Result:** Reduce from 3–5 contacts to 0–1 contacts. Designers no longer need to create demo layouts.

**Benchmark:** [Cricket Lighters Design Tool](https://design.cricketlighters.com) — similar tool from an international lighter brand, used as UX reference.

---

## 2. Current vs. Proposed Flow

### Current — Multiple manual steps

```
Customer submits contact form
        ↓
Designer contacts via Zalo/email to collect images
        ↓
Customer gathers & sends images (often compressed, missing files)
        ↓
Designer creates demo layout → sends to customer for review
        ↓
Customer requests edits (1–3 rounds)
        ↓
Final file sent to production
```

**Core Issues:**
- Designers spend time creating demos instead of production
- No standard asset format → extra file processing
- Customer has no visual preview before approval

### Proposed — Self-service, low friction

```
Customer opens /builder/lighters
        ↓
Uploads 1 design image
        ↓
Immediately sees 3D full-wrap preview on lighter (drag to rotate, zoom)
        ↓
Clicks "Next" → Adds to cart with preview image
        ↓
Adjusts quantity → Price calculated automatically
        ↓
Cart at /cart/lighters (existing flow)
        ↓
Sanity receives order with attached design image
        ↓
Designer downloads image from Sanity Studio → sends directly to production
```

---

## 3. Confirmed Product Specifications

The following decisions have been confirmed by INUT, no longer open questions:

| Attribute               | Confirmed Value                                          |
| ----------------------- | -------------------------------------------------------- |
| Skin type               | **Decal sticker** (not material color)                   |
| Coverage style          | **Full wrap 360°** around lighter body                   |
| Skin shape              | **Full rectangle** — no cropping, no holes               |
| Number of design images | **1 image per order** (full-wrap, no canvas composition) |
| Recommended resolution  | **1640 × 2048 px or higher**, maintain original ratio    |
| Export format           | **PNG 300 DPI flat**                                     |
| Lighter color selection | **Not needed** — decal skin covers entire body           |
| Double-sided printing   | **Not applicable** — full wrap covers all sides          |

---

## 4. Design Image Specifications

| Attribute                  | Specification                                           |
| -------------------------- | ------------------------------------------------------- |
| **Recommended resolution** | **1640 × 2048 px** (or higher, maintain original ratio) |
| **Accepted formats**       | PNG, JPG, WEBP                                          |
| **Max file size**          | 10 MB                                                   |
| **Coverage**               | Full wrap 360° around lighter body                      |

> **Full wrap note:** Design image wraps 360° around circumference, so file width = lighter body circumference (π × diameter), not just front width.

---

## 5. Feature Scope (v1)

### In Scope

| #   | Feature                                                                                                                    |
| --- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Upload 1 image** — click to select file (PNG/JPG/WEBP, max 10 MB)                                                        |
| 2   | **Helper text** — displays "Please upload image with size 1640×2048 px or higher"                                          |
| 3   | **Resolution warning** — toast warning if image is below 1640 × 2048 px (non-blocking, info only)                          |
| 4   | **3D full-wrap preview** — @react-three/fiber + @react-three/drei renders 3D lighter with design image UV-mapped to body   |
| 5   | **Drag to rotate** — OrbitControls (from drei) allows free rotation via mouse/touch                                        |
| 6   | **Zoom** — OrbitControls supports zoom in/out via scroll/pinch                                                             |
| 7   | **Image position adjustment** — scroll X/Y to adjust image position on lighter body                                        |
| 8   | **Right panel** — shows upload zone + controls when no image, shows preview after upload                                   |
| 9   | **Replace / Clear image** — replace or remove current preview image                                                        |
| 10  | **"Next" button** — when image is uploaded, fetches product data from existing lighters list and adds to cart              |
| 11  | **Existing cart integration** — uses useLightersCart (Zustand) to add item using real product ID from Sanity               |
| 12  | **Cart item** — displays product name from Sanity ("Bật lửa Thường - In Thường - Thiết kế theo yêu cầu"), shows 2D preview |
| 13  | **Existing checkout flow** — uses /checkout/lighters already built                                                         |
| 14  | **Standalone route** `/builder/lighters` — does not affect existing contact form at `/lien-he`                             |

### Out of Scope (v1)

- Multi-layer canvas editor (drag-and-drop multiple images, text overlay, shape masking) — this is direct single image upload
- Lighter color selection (not needed with decal skin)
- Double-sided / dual-face printing (not applicable with full wrap)
- Online payment / deposit
- Real-time collaboration

---

## 6. User Flow Details

```
[/san-pham/lighters]
    │
    ├── Hero section (product info + current pricing)
    │
    └── CTA: "Design your own lighter skin →"
              │
              ▼
    [/builder/lighters]  ← New standalone route
              │
    ┌─────────────────────────────────────────────────────────┐
    │  HEADER: INUT Design logo · Lighter Builder              │
    ├──────────────────────────────┬──────────────────────────┤
    │                              │  Right Panel             │
    │   [  Three.js 3D Lighter  ]  │  ─────────────────      │
    │                              │                          │
    │   Image wraps 360° around    │  Helper text:            │
    │   lighter body, real-time    │  "Please upload image    │
    │                              │   1640×2048 px or higher"│
    │   ← Drag to rotate →        │                          │
    │   ↑ Scroll to zoom ↑        │  [  Drag & Drop Zone ]   │
    │                              │  (or click to select)    │
    │                              │                          │
    │                              │  After upload:           │
    │                              │  - Thumbnail + metadata  │
    │                              │  - Resolution warning    │
    │                              │  - Scroll X/Y to adjust  │
    │                              │  - [ Replace ] [ Clear ] │
    │                              │                          │
    │                              │  ─────────────────      │
    │                              │  [ Next → ]              │
    └──────────────────────────────┴──────────────────────────┘
              │
              ▼ (When clicking "Next")
    [/checkout/lighters]  ← Existing route
              │
    ┌─────────────────────────────────────────────────────────┐
    │  Current cart:                                           │
    │  ┌─────────────────────────────────────────────────────┐ │
    │  │ 2D preview image (not 3D)                           │ │
    │  │ Name: "Bật lửa Thường - In Thường - Thiết kế theo   │ │
    │  │        yêu cầu" (from Sanity)                        │ │
    │  │ Quantity: [ 1 ] ▲▼                                   │ │
    │  │ Unit price: [calculated from price tiers]           │ │
    │  │ Subtotal: [auto-calculated]                         │ │
    │  └─────────────────────────────────────────────────────┘ │
    │                                                          │
    │  [Customer info form - unchanged]                        │
    │  [Payment method - unchanged]                            │
    │  [Place order]                                           │
    └─────────────────────────────────────────────────────────┘
              │
              ▼ (After successful order)
    [/order-tracking/lighters/{orderNumber}]  ← Existing route
```

---

## 7. Technical Architecture

### 7.1 3D Rendering Library

**@react-three/fiber + @react-three/drei** (npm packages)

| Criteria          | @react-three/fiber + drei      | Three.js CDN       | CSS perspective      |
| ----------------- | ------------------------------ | ------------------ | -------------------- |
| Full wrap 360° UV | ✅ CylinderGeometry UV map      | ✅ CylinderGeometry | ❌ CSS transform only |
| React integration | ✅ Native React components      | ❌ Imperative API   | ✅                    |
| OrbitControls     | ✅ Built-in (drei)              | ❌ Manual impl      | ❌                    |
| Lighting / depth  | ✅ StandardMaterial + lights    | ✅                  | ❌                    |
| Bundle size       | ~350 KB (three + fiber + drei) | ~580 KB CDN        | 0                    |
| Next.js 12 SSR    | ✅ `dynamic({ ssr: false })`    | ✅                  | ✅                    |
| Maintenance       | ✅ Actively maintained          | ⚠️ CDN version      | ✅                    |

**Decision: @react-three/fiber + @react-three/drei.** 
- React-native integration for cleaner, more maintainable code
- `OrbitControls` from drei provides rotation + zoom without custom implementation
- Better than Three.js CDN due to typed components and declarative API

```ts
// pages/builder/lighters.tsx
const LighterBuilder = dynamic(
  () => import('@/components/lighter/LighterBuilder'),
  { ssr: false }
);
```

### 7.2 3D Model Structure (.glb)

**Use .glb file** for lighter model — .glb file contains geometry, UV mapping, and materials.

```tsx
// components/lighter/LighterCanvas.tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'

function LighterModel({ textureUrl, scrollX, scrollY, modelPath }) {
  // Load .glb model
  const { scene } = useGLTF(modelPath)
  
  // Load texture (uploaded image)
  const texture = textureUrl ? useTexture(textureUrl) : null
  
  // Apply texture to model and adjust offset
  React.useEffect(() => {
    if (texture && scene) {
      // Find the body mesh in the model and apply texture
      scene.traverse((child) => {
        if (child.isMesh && child.name === 'body') {
          texture.offset = new THREE.Vector2(scrollX, scrollY)
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
          child.material.map = texture
          child.material.needsUpdate = true
        }
      })
    }
  }, [texture, scene, scrollX, scrollY])
  
  return <primitive object={scene} scale={1} />
}

export function LighterCanvas({ textureUrl, scrollX, scrollY, modelPath = '/models/lighter.glb' }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#aaccff" />
      
      <Suspense fallback={null}>
        <LighterModel 
          textureUrl={textureUrl} 
          scrollX={scrollX} 
          scrollY={scrollY}
          modelPath={modelPath}
        />
      </Suspense>
      
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
      />
    </Canvas>
  )
}
```

**Lighting setup:**
- `ambientLight` — even base light
- `directionalLight` (key) — from top-right, castShadow
- `directionalLight` (rim) — from back-left, cool blue tone for depth

**Tone mapping:** `ACESFilmicToneMapping` — makes skin texture look natural like real photo.

**Notes on .glb file:**
- Single file: `/public/models/lighter.glb`
- Model needs correct UV mapping for body mesh (mesh name: 'body')

### 7.3 Upload & Texture Pipeline

```
Client selects file (1 image)
        │
        ▼
Validate: type (PNG/JPG/WEBP) + size ≤ 10 MB
        │
        ▼
FileReader → createObjectURL → texture URL
        │
        ├── Read naturalWidth × naturalHeight
        │   → if < 1640 × 2048: show yellow warning (non-blocking)
        │
        ├── useTexture(url) → bodyMaterial.map = texture
        │   → texture.needsUpdate = true
        │   → render immediately on 3D canvas
        │
        └── Show thumbnail + metadata in right panel
```

**Scroll X/Y to adjust image position:**
```tsx
// Adjust texture offset based on scroll position
const [scrollX, setScrollX] = useState(0)
const [scrollY, setScrollY] = useState(0)

// In texture:
texture.offset = new THREE.Vector2(scrollX, scrollY)
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
```

### 7.4 Add to Cart (Fetch Product by Name)

When user clicks "Next", the system will:
1. **Fetch product by exact name** using new `lightersApi.getLighterByName(name)` function
2. **Extract product ID, lighter type ID, price tiers** from the fetched data
3. **Create cart item** using existing product data structure
4. **Add to cart** using `addItem()` from `useLightersCart`
5. **Redirect** to `/checkout/lighters`

**New API function to add in `api-client/lighters.ts`:**
```ts
/**
 * Get a lighter product by exact name
 */
async getLighterByName(name: string): Promise<LighterProductWithType> {
  const query = `*[_type == "lighterProducts" && name == $name][0]{
    ...,
    "lighterTypeDetails": lighterType->
  }`;
  return await client.fetch(query, { name });
}
```

**Usage in builder component:**
```tsx
// components/lighter/LighterBuilder.tsx
import { lightersApi } from '@/api-client/lighters'
import { useLightersCart } from '@/store'
import { useRouter } from 'next/router'

const handleNext = async () => {
  // Fetch specific product by exact name (reduces data transfer)
  const customLighterProduct = await lightersApi.getLighterByName(
    'Bật lửa Thường - In Thường - Thiết kế theo yêu cầu'
  )
  
  if (!customLighterProduct) {
    toast.error('Không tìm thấy sản phẩm bật lửa custom')
    return
  }
  
  // Convert canvas to image for cart preview
  const previewImage = canvasRef.current.toDataURL('image/png')
  
  // Add to cart using existing product data
  addItem({
    productId: customLighterProduct._id,                    // Real ID from Sanity
    productName: customLighterProduct.name,                  // Product name
    productImage: { asset: { url: previewImage } },         // Preview image from canvas
    productSlug: customLighterProduct.slug.current,          // Product slug
    lighterTypeId: customLighterProduct.lighterTypeDetails._id,
    lighterTypeName: customLighterProduct.lighterTypeDetails.name,
    quantity: 1,
    priceTiers: customLighterProduct.lighterTypeDetails.priceTiers,
  })
  
  router.push('/checkout/lighters')
}
```

**Benefits of this approach:**
- ✅ Single GROQ query — fetches only the exact product needed
- ✅ Reduces data transfer (no need to fetch all products)
- ✅ Uses existing price tiers from lighter types
- ✅ Compatible with existing checkout flow (no new logic needed)

### 7.5 Cart Display

In `/checkout/lighters` page, the custom lighter item will display:
- **2D preview image** (not 3D) — snapshot from canvas or original uploaded image
- **Product name**: From Sanity ("Bật lửa Thường - In Thường - Thiết kế theo yêu cầu")
- **Quantity**: Adjustable (price auto-calculated based on tiers)
- **Price**: Auto-calculated based on quantity and price tiers

Existing checkout flow (`/checkout/lighters`) handles:
- Customer information form
- Payment method
- Shipping fee calculation
- Order creation in Sanity
- Redirect to confirmation page

### 7.6 Sanity Schema Update for Orders

Add `designImage` field to order item to store design image:

```js
// Update in sanity/schemas/ordersLighter.js
// Add field to orderItem object:
{
  name: "designImage",
  title: "Design Image",
  type: "image",
  description: "Customer's custom design image",
  options: { hotspot: false },
}
```

### 7.7 Checkout Flow Integration

**No new API route needed.** Uses existing checkout flow:

1. Builder page adds item to Zustand cart (`useLightersCart`)
2. Redirects to `/checkout/lighters`
3. Checkout page handles form and creates order
4. Order tracking page shows status

**Needs update:**
- `CartItemLighter` model: Add field `designImage?: SanityImage` (optional)
- `OrderItemLighter` model: Add field `designImage?: SanityImage` (optional)
- Checkout page: Display preview image for custom lighter items
- Order schema: Add `designImage` field to order item

---

## 8. Component Tree

```
pages/builder/lighters.tsx
└── LighterBuilderPage  (dynamic, ssr: false)
    │
    ├── BuilderHeader
    │   ├── Logo + subtitle "Lighter Builder"
    │   └── Back button
    │
    ├── LighterCanvas                     ← @react-three/fiber Canvas mount
    │   ├── LighterModel (.glb loaded via useGLTF)
    │   │   └── Body mesh with UV texture
    │   ├── SceneLights (Ambient + Key + Rim)
    │   └── OrbitControls                 ← from @react-three/drei
    │
    └── ControlPanel (right side)
        ├── HelperText                    ← "Please upload image 1640×2048 px or higher"
        ├── ImageUploadZone               ← click to select file (PNG/JPG/WEBP)
        │   ├── DropzoneIdle              ← click-to-upload UI
        │   └── UploadedPreview           ← thumbnail + metadata + res warning
        │       ├── ImageInfo             ← dimensions, file size
        │       ├── ScrollControls        ← Slider X/Y to adjust image position
        │       ├── [ Replace ]
        │       └── [ Clear ]
        │
        └── NextButton                    ← "Next →" (disabled when no image)
```

### Reused from Existing Codebase

| Component                         | Status                    | Source                                 |
| --------------------------------- | ------------------------- | -------------------------------------- |
| `useLightersCart` (Zustand store) | ✅ Fully reused            | `store/cart/lightersCart.ts`           |
| `useCreateLighterOrder`           | ✅ Fully reused            | `hooks/useCreateLighterOrder.ts`       |
| `useTelegramNotification`         | ✅ Fully reused            | `hooks/useTelegramNotification.ts`     |
| `useShippingFees`                 | ✅ Fully reused            | `hooks/useShippingFees.ts`             |
| `lightersApi.getLighterByName()`  | 🆕 New (add to api-client) | `api-client/lighters.ts`               |
| Checkout page                     | ✅ Fully reused            | `pages/checkout/lighters.tsx`          |
| Order tracking page               | ✅ Fully reused            | `pages/order-tracking/lighters/[slug]` |
| `formatPrice`                     | ✅ Fully reused            | `utils/priceCalculator.ts`             |
| Analytics tracking                | ✅ Fully reused            | `utils/analytics.ts`                   |
| `ThreeCanvas` + `LighterModel`    | 🆕 New                     | —                                      |
| `ImageUploadZone`                 | 🆕 New (simple — 1 file)   | —                                      |
| `ControlPanel`                    | 🆕 New                     | —                                      |

> ~70% code reused from existing codebase (cart, checkout, order flow, API client).

---

## 9. UX & Design (Chromatic Offset system)

All visual language consistent with current design system:

| Element         | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| Background      | `#080706` — dark background makes 3D lighter pop                   |
| Surface         | `#100f0d` / `#1a1916` / `#242220`                                  |
| Orange accent   | `#FF4D00` — CTA, button, selected state                            |
| Yellow          | `#FFE234` — low resolution warning                                 |
| Heading font    | **Roboto** (700) — section headers, button text                    |
| Body font       | **Roboto** (400) — metadata, labels, input fields                  |
| Canvas lighting | ACES filmic tone mapping — makes skin texture look like real photo |
| Auto-rotate     | **Always** — lighter auto-rotates slowly (never stops)             |
| Mobile          | Canvas takes top half; panel takes bottom half                     |
| Touch target    | Minimum 44 × 44 px                                                 |
| Animation       | ≤ 300ms; no parallax                                               |
| Main copy       | Vietnamese; English only for code ("Normal", "Mini", "PNG")        |

**Key difference:** No flat canvas editor. Entire experience is 3D preview — customer immediately understands "this is what my lighter will look like" without explanation.

---

## 9.1 Guardrails & Standards

### Mobile-First Requirements

| Requirement               | Specification                                               |
| ------------------------- | ----------------------------------------------------------- |
| **Touch target size**     | Minimum **44 × 44 px** for all interactive elements         |
| **Button padding**        | Minimum 12px vertical, 16px horizontal                      |
| **Slider thumb size**     | Minimum 44px hit area (visual thumb can be smaller)         |
| **Upload zone tap area**  | Minimum 44px height for mobile touch                        |
| **Spacing between items** | Minimum 8px gap between tappable elements                   |
| **Viewport handling**     | Support viewport units (dvh) for mobile browser address bar |

### Performance Guardrails

| Requirement           | Specification                                                          |
| --------------------- | ---------------------------------------------------------------------- |
| **Canvas pixelRatio** | Cap at `Math.min(window.devicePixelRatio, 2)` for iOS Safari stability |
| **Texture max size**  | Limit to 2048 × 2048 px for mobile GPU memory                          |
| **Frame rate**        | Target 60fps; throttle to 30fps on low-end devices                     |
| **Memory management** | Dispose Three.js textures/geometries on unmount                        |
| **Lazy loading**      | Load .glb model only when canvas is in viewport                        |

### Implementation Example

```tsx
// components/lighter/LighterCanvas.tsx

// Cap pixelRatio for iOS Safari stability
const pixelRatio = Math.min(window.devicePixelRatio, 2)

<Canvas 
  camera={{ position: [0, 0, 5], fov: 45 }}
  gl={{ 
    pixelRatio: pixelRatio,
    powerPreference: 'high-performance',
  }}
  dpr={[1, 2]} // Limit DPR range
>
```

```tsx
// Touch target enforcement
<Button
  sx={{
    minWidth: 44,
    minHeight: 44,
    padding: '12px 16px',
  }}
>
  Next →
</Button>

<Slider
  sx={{
    '& .MuiSlider-thumb': {
      width: 24,
      height: 24,
      // Hit area expanded via pseudo-element
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -10,
        left: -10,
        right: -10,
        bottom: -10,
      },
    },
  }}
/>
```

### Memory Cleanup Pattern

```tsx
// Cleanup Three.js resources on unmount
useEffect(() => {
  return () => {
    // Dispose texture
    if (texture) {
      texture.dispose()
    }
    // Dispose geometry and materials from model
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose()
          if (child.material.map) child.material.map.dispose()
          child.material.dispose()
        }
      })
    }
  }
}, [texture, scene])
```

---

## 10. Edge Cases & Error Handling

| Situation                          | Handling                                                               |
| ---------------------------------- | ---------------------------------------------------------------------- |
| File is not an image               | Reject with toast: "Only PNG, JPG, WEBP accepted"                      |
| File > 10 MB                       | Reject with toast: "File too large (max 10 MB)"                        |
| Resolution < 1640 × 2048 px        | **Yellow warning** in panel (non-blocking) — customer can still submit |
| Click Next without uploading image | Block; toast "Please upload design image"                              |
| Error adding to cart               | Toast error; keep builder state                                        |
| Product not found in Sanity        | Toast error: "Custom lighter product not found"                        |
| Safari iOS — canvas                | Limit pixelRatio ≤ 2 to avoid memory crash                             |
| WebGL not supported                | Show fallback: 2D image with CSS rotation effect                       |

---

## 11. Implementation Phases

### Phase 1 — 3D Viewer + Upload (1.5 weeks)

- [ ] Route `/builder/lighters` scaffold (dynamic, SSR disabled)
- [ ] `LighterCanvas` — @react-three/fiber Canvas + OrbitControls
- [ ] `LighterModel` — Load .glb model + UV texture map + lighting
- [ ] `ImageUploadZone` — file input, validate type + size + resolution
- [ ] Scroll X/Y controls to adjust image position on lighter body
- [ ] `UploadedPreview` — thumbnail, metadata, resolution warning
- [ ] Auto-rotate when no image

### Phase 2 — Cart Integration (0.5 weeks)

- [ ] Update `CartItemLighter` model: add `designImage` field (optional)
- [ ] Update `OrderItemLighter` model: add `designImage` field (optional)
- [ ] "Next" button → fetch product from `lightersApi.getAllLighters()` → add to cart → redirect to `/checkout/lighters`
- [ ] Update checkout page: display preview image for custom lighter items
- [ ] Update Sanity schema `ordersLighter`: add `designImage` field to orderItem

### Phase 3 — Polish & Mobile (0.5 weeks)

- [ ] Mobile responsive (canvas half-top, panel half-bottom)
- [ ] Touch gestures for OrbitControls
- [ ] WebGL fallback (if browser doesn't support)
- [ ] CTA on `/san-pham/lighters` page linking to builder
- [ ] Analytics tracking (page view, upload, add to cart, checkout)

### Phase 4 — Stretch Goals (backlog)

- [ ] Order history lookup by phone number
- [ ] Fullscreen preview modal (click to enlarge 3D model)
- [ ] Customer download preview image (PNG snapshot)

---

## 12. Dependencies

**New npm packages to install:**

```json
{
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.92.0",
  "three": "^0.160.0"
}
```

**Already in project (reused):**
- `zustand` 4.3.8 — cart state management
- `react-hook-form` ^7.44.2 — form handling in checkout
- `@mui/material` ^5.9.3 — UI components
- `react-hot-toast` ^2.4.1 — notifications
- `@sanity/client` ^3.4.1 — CMS integration
- `next` 12.3.1 — framework

**Install:**
```bash
pnpm add @react-three/fiber @react-three/drei three
pnpm add -D @types/three
```

---

## 13. Decision Log

| #   | Question                       | Decision                       | Reason                                                                            |
| --- | ------------------------------ | ------------------------------ | --------------------------------------------------------------------------------- |
| 1   | 3D rendering: CSS or Three.js? | **@react-three/fiber + drei**  | CSS perspective can't render true full wrap 360°; drei has OrbitControls built-in |
| 2   | Number of images to upload     | **1 image only**               | Full wrap = 1 file covering entire surface, no canvas composition needed          |
| 3   | Multi-layer canvas editor?     | **No**                         | Customer prepares image before upload — builder only previews                     |
| 4   | Checkout flow: new or reuse?   | **Reuse /checkout/lighters**   | Already built, full-featured (cart, shipping, payment, order tracking)            |
| 5   | Separate API route?            | **No**                         | Current flow handles via useCreateLighterOrder hook                               |
| 6   | Lighter color selection?       | **No**                         | Decal skin covers entire body — color not visible                                 |
| 7   | Double-sided printing?         | **Not applicable**             | Full wrap 360° covers all sides                                                   |
| 8   | Minimum resolution?            | **1640 × 2048 px recommended** | Per Cricket Lighters spec; non-blocking, warning only                             |
| 9   | Auto-rotate model?             | **Always Yes**                 | Increases visual appeal; continuous rotation helps see full wrap                  |
| 10  | Image display in cart?         | **2D preview** (not 3D)        | Checkout page needs fast load; 3D only needed on builder page                     |
| 11  | Product ID for cart?           | **Fetch from Sanity via API**  | Reuses existing product data, no hardcoded IDs, compatible with checkout flow     |

---

## 14. Confirmed Answers

| #   | Question                              | Answer                                               |
| --- | ------------------------------------- | ---------------------------------------------------- |
| 1   | **Exact print area dimensions (mm)?** | No exact dimensions — will use estimated values      |
| 2   | **Confirm product name?**             | "Bật lửa Thường - In Thường - Thiết kế theo yêu cầu" |
| 3   | **Custom lighter pricing?**           | No — reuse current pricing of the product            |
| 4   | **Design image storage?**             | Store in Sanity image field                          |

---

## 15. Comparison with Sticker Sheet Builder

|                     | Sticker Builder                   | Lighter Builder (v4)           |
| ------------------- | --------------------------------- | ------------------------------ |
| Canvas              | Konva.js flat canvas (2D editor)  | @react-three/fiber (3D viewer) |
| Number of images    | Up to 20 images, drag onto canvas | 1 full-wrap image              |
| Interaction         | Drag, scale, rotate per asset     | OrbitControls (rotate + zoom)  |
| 3D Model            | None (2D only)                    | .glb file with UV texture      |
| Checkout            | Custom flow                       | Reuse /checkout/lighters       |
| Product ID          | N/A                               | Fetched from Sanity via API    |
| Frontend complexity | High (editor state, layer mgmt)   | Medium (upload + 3D viewer)    |
| Dev time estimate   | 7–9 weeks                         | **2.5–3 weeks**                |
| Code reuse          | —                                 | ~70% from existing codebase    |

---

## 16. Tech Stack Summary

| Technology         | Version  | Purpose                              |
| ------------------ | -------- | ------------------------------------ |
| Next.js            | 12.3.1   | Framework (Page Router)              |
| React              | 18.2.0   | UI library                           |
| TypeScript         | 5.0.4    | Type safety (strict: false)          |
| MUI                | v5.9.3   | UI components                        |
| @react-three/fiber | ^8.15.0  | React renderer for Three.js          |
| @react-three/drei  | ^9.92.0  | Useful helpers (OrbitControls, etc.) |
| three              | ^0.160.0 | 3D graphics engine                   |
| Sanity CMS         | v3.4.1   | Content & order management           |
| Zustand            | 4.3.8    | State management (cart)              |
| react-hook-form    | ^7.44.2  | Form handling                        |
| react-hot-toast    | ^2.4.1   | Notifications                        |
| pnpm               | 10.32.1  | Package manager                      |
| Node.js            | >=20.0.0 | Runtime                              |

---

*Prepared for INUT Design — Da Nang*  
*Version 4.0 (Final) · March 2026*  
*Author: Product team*  
*References:*  
*— PROPOSAL_STICKER_BUILDER.md (approved architecture)*  
*— design.cricketlighters.com (UX benchmark)*  
*— pages/checkout/lighters.tsx (existing checkout flow)*  
*— store/cart/lightersCart.ts (cart state management)*  
*— api-client/lighters.ts (product data API)*