# PROPOSAL: Sticker Sheet Builder — INUT Design

**Feature name:** Custom Sticker Sheet Designer  
**Target page:** `/san-pham/sticker` (hoặc `/tao-sticker`)  
**Stack:** Next.js 12 (Page Router) · React 18 · TypeScript · MUI v5 · Sanity CMS v2  
**Priority:** High — reduces designer communication overhead, increases conversion  

---

## 1. Problem Statement

### Current flow (manual, high-friction)

```
Client fills contact form
        ↓
Designer contacts client (Zalo / email)
        ↓
Client collects & sends image assets (often messy, incomplete)
        ↓
Designer assembles demo layout, sends back to client
        ↓
Client requests revisions
        ↓
Final file sent to production
```

**Pain points:**
- 3–5 back-and-forth messages just to collect assets and agree on layout
- Designer spends time on layout tasks instead of design/production
- No standardized asset format → wasted time on file cleanup
- Client has no visual ownership of the sheet before production

### Proposed flow (self-serve, low-friction)

```
Client opens Sticker Builder page
        ↓
Selects paper size (A5 / A6)
        ↓
Uploads & arranges assets on canvas (drag, scale, rotate)
        ↓
Submits: Sanity receives { paperSize, assets[], canvasImage }
        ↓
Designer downloads final 2K canvas image from Sanity Studio
        ↓
Goes directly to production (zero layout revision needed)
```

---

## 2. Feature Scope

### In scope (v1)

| #   | Feature                                                                                                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Paper size selector: A5 (148 × 210 mm) and A6 (105 × 148 mm)                                                                                                                             |
| 2   | Multi-image uploader — drag-and-drop files from device (max **20 assets** per sheet)                                                                                                     |
| 3   | Interactive canvas: drag, scale (resize handles), and rotate each sticker asset                                                                                                          |
| 4   | Snap-to-grid / free placement toggle                                                                                                                                                     |
| 5   | Per-asset controls: bring forward, send backward, duplicate, delete                                                                                                                      |
| 6   | Canvas export at **300 DPI / 2K resolution** (2480 × 3508 px for A5; 1748 × 2480 px for A6)                                                                                              |
| 7   | Submission form: name, phone/Zalo, quantity, notes                                                                                                                                       |
| 8   | Sanity CMS submission document: saves paper size, individual asset URLs, final canvas image, and form data                                                                               |
| 9   | Designer-facing Sanity Studio view to review and download assets                                                                                                                         |
| 10  | **reCAPTCHA v3** (invisible) on submission to prevent spam — no login/OTP wall                                                                                                           |
| 11  | Old contact form remains as a **separate route** (`/lien-he`) — builder is standalone at `/sticker/builder`                                                                              |
| 12  | **Text overlays on canvas** — add text box, choose font, size, color; draggable/resizable like assets                                                                                    |
| 13  | **Background configuration** — solid color picker + import a background image (PNG/JPG) that fills the canvas behind all stickers; bleed-safe zone toggle (3 mm bleed indicator overlay) |
| 14  | **Per-sticker shape masking** — apply circle or rounded-rect clip mask to any individual asset                                                                                           |

### Out of scope (v1)

- Real-time collaboration
- Payment / ordering flow

---

## 3. User Flow Detail

```
[/sticker page]
    │
    ├─ Hero section (existing product info)
    │
    └─ CTA: "Tự thiết kế tờ sticker của bạn →"
            │
            ▼
    [/sticker/builder]  ← new route
            │
    Step 1 — Choose Size
            Select A5 or A6 (visual card with dimensions in mm and px)
            │
    Step 2 — Upload Assets
            Drag-and-drop or click to upload (PNG/JPG/WEBP/SVG)
            Up to 30 assets, max 10 MB each
            Each asset shows as a thumbnail strip below the canvas
            │
    Step 3 — Arrange on Canvas
            Canvas renders at correct aspect ratio
            Drag assets from strip onto canvas
            Resize via corner handles
            Rotate via rotation handle
            Layer order control (right-click or toolbar)
            Snap-to-grid toggle (8px grid)
            │
    Step 4 — Review & Submit
            Fill in: Tên, SĐT/Zalo, Số lượng, Ghi chú
            Click "Gửi thiết kế"
            Canvas exported as 2K PNG (client-side, html2canvas or Konva toDataURL)
            Data posted to API → uploaded to Sanity
            │
    Confirmation screen
            "Chúng tôi đã nhận thiết kế của bạn!
             MR. TOM hoặc MS. BOO sẽ liên hệ bạn trong vòng 24h."
```

---

## 4. Technical Architecture

### 4.1 Canvas Library Recommendation

**Recommended: [Konva.js](https://konvajs.org/) + `react-konva`**

| Criterion                           | Konva                                  | Fabric.js         | Plain Canvas |
| ----------------------------------- | -------------------------------------- | ----------------- | ------------ |
| React integration                   | ✅ First-class (`react-konva`)          | ⚠️ Manual          | ❌ Imperative |
| TypeScript support                  | ✅                                      | ⚠️ Community types | ✅            |
| High-res export                     | ✅ `stage.toDataURL({ pixelRatio: N })` | ✅                 | Manual       |
| Bundle size                         | ~200 KB                                | ~280 KB           | 0 KB         |
| Transformer (resize/rotate handles) | ✅ Built-in `<Transformer>`             | ✅                 | Manual       |
| Next.js 12 SSR compatibility        | ✅ Dynamic import `{ ssr: false }`      | ✅                 | ✅            |

**Decision: Konva.js.** The built-in `<Transformer>` component handles resize+rotate handles with no extra code, and `stage.toDataURL({ pixelRatio })` makes 2K export trivial.

**SSR note:** Wrap the entire builder in:
```ts
const StickerBuilder = dynamic(() => import('@/components/sticker/StickerBuilder'), { ssr: false });
```

### 4.2 Resolution & Export

| Paper | Physical     | @ 300 DPI (print-ready) | Konva pixelRatio        |
| ----- | ------------ | ----------------------- | ----------------------- |
| A5    | 148 × 210 mm | 1748 × 2480 px          | `2480 / canvasHeightPx` |
| A6    | 105 × 148 mm | 1240 × 1748 px          | `1748 / canvasHeightPx` |

Canvas renders at a display size (e.g., 400 × 566 px for A5) and exports at full resolution by multiplying the `pixelRatio`. No external rasterization needed.

### 4.3 Asset Upload Flow

```
Client device
    │ File(s) selected
    ▼
Browser: validate (type, size) → create Object URLs for canvas preview
    │ On submit only
    ▼
POST /api/sticker-submit
    │
    ├─ Upload each asset File → Sanity Assets API
    │   Returns: { _id, url } per asset
    │
    ├─ Upload canvas PNG (base64 → Blob) → Sanity Assets API
    │   Returns: { _id, url }
    │
    └─ Create Sanity document  (type: stickerOrder)
        { paperSize, assets[], canvasImage, customerName, phone, qty, notes, submittedAt }
```

**Why upload only on submit:** Keeps storage clean, avoids orphaned assets, and respects the client's bandwidth.

### 4.4 Sanity CMS Schema

**Document type: `stickerOrder`**

```ts
// schemas/stickerOrder.ts
export default {
  name: 'stickerOrder',
  title: 'Sticker Order',
  type: 'document',
  fields: [
    { name: 'customerName', title: 'Tên khách hàng', type: 'string' },
    { name: 'phone',        title: 'SĐT / Zalo',    type: 'string' },
    { name: 'quantity',     title: 'Số lượng',       type: 'number' },
    { name: 'notes',        title: 'Ghi chú',        type: 'text' },
    {
      name: 'paperSize',
      title: 'Khổ giấy',
      type: 'string',
      options: { list: ['A5', 'A6'] },
    },
    {
      name: 'assets',
      title: 'File ảnh gốc',
      type: 'array',
      of: [{ type: 'image' }],   // individual uploaded sticker images
    },
    {
      name: 'canvasExport',
      title: 'Ảnh thiết kế (2K)',
      type: 'image',             // final composed layout
      options: { hotspot: false },
    },
    {
      name: 'status',
      title: 'Trạng thái',
      type: 'string',
      options: { list: ['Mới', 'Đang xử lý', 'Hoàn tất'] },
      initialValue: 'Mới',
    },
    {
      name: 'submittedAt',
      title: 'Thời gian gửi',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'phone',
      media: 'canvasExport',
    },
  },
};
```

### 4.5 API Route

**`/pages/api/sticker-submit.ts`**

```
POST /api/sticker-submit
Content-Type: multipart/form-data

Fields:
  - paperSize       : 'A5' | 'A6'
  - customerName    : string
  - phone           : string
  - quantity        : number
  - notes           : string
  - canvasImage     : Blob (PNG, ~1–3 MB)
  - assets[]        : File[] (original uploads)

Response:
  201 { success: true, orderId: string }
  400 { error: string }
  500 { error: string }
```

Use `formidable` or `busboy` for multipart parsing in Next.js 12.  
Use `@sanity/client` with a write token (stored in `SANITY_WRITE_TOKEN` env var — never exposed to client).

---

## 5. Component Tree

```
pages/sticker/builder.tsx
└── StickerBuilderPage (dynamic, ssr: false)
    ├── StepIndicator              — Step 1 / 2 / 3 / 4 progress bar
    ├── SizePicker                 — A5 / A6 card selector (Step 1)
    ├── AssetUploader              — Dropzone + thumbnail strip (Step 2, max 20)
    │   └── AssetThumbnail[]
    ├── CanvasEditor               — Konva Stage (Step 3)
    │   ├── KonvaStage
    │   │   └── KonvaLayer
    │   │       ├── BackgroundRect         — solid color fill
    │   │       ├── BackgroundImage        — optional imported background
    │   │       ├── BleedGuideLines        — 3mm bleed overlay (non-exported)
    │   │       ├── StickerImage[]         — placed assets, with optional clipFunc mask
    │   │       ├── TextOverlay[]          — Konva Text nodes
    │   │       └── KonvaTransformer       — unified resize/rotate handles
    │   ├── CanvasToolbar
    │   │   ├── SnapToggle
    │   │   ├── LayerOrderControls         — bring forward / send to back
    │   │   ├── ShapeMaskPicker            — none / circle / rounded-rect
    │   │   ├── BackgroundControls         — color picker + image import
    │   │   ├── TextAddButton              — insert new text node
    │   │   └── DeleteSelected
    │   └── AssetTray                  — thumbnails to drag onto canvas
    ├── OrderForm                  — name, phone, qty, notes (Step 4)
    │   └── ReCaptchaProvider + useGoogleReCaptcha
    └── SubmitButton + ConfirmationModal
```

---

## 6. UX & Design Notes (Chromatic Offset system)

- **Dark canvas editor background** (`#0F0F0F`) with the white paper as the focal point — makes sticker placement contrast pop.
- **Orange accent** (`#FF6B00`) for active transformer handles, CTA buttons, and step indicator active state.
- **Step progress bar** using Syne typeface for step labels.
- Canvas toolbar floats above the stage with MUI `Paper` at elevation 4 + slight blur backdrop.
- Mobile: canvas editor is locked to portrait scroll; asset tray scrolls horizontally below.
- Minimum touch targets 44 × 44 px for all canvas controls.
- Vietnamese copy throughout; English only for UI label abbreviations (e.g., "A5", "PNG").
- Animations ≤ 300 ms; no smooth scroll.

---

## 7. Constraints & Edge Cases

| Edge Case                     | Handling                                                      |
| ----------------------------- | ------------------------------------------------------------- |
| User uploads >20 assets       | Reject with toast: "Tối đa 20 ảnh mỗi tờ"                     |
| File > 10 MB                  | Client-side rejection before upload                           |
| Canvas empty on submit        | Validate: at least 1 asset placed on canvas                   |
| Network failure during submit | Retry button on error state; assets remain in memory          |
| SVG with external references  | Convert to PNG via canvas before upload                       |
| Safari mobile canvas export   | Use `pixelRatio: 2` max to avoid memory crash on iOS          |
| Slow upload (large assets)    | Show per-asset upload progress via Sanity asset API streaming |

---

## 8. Implementation Phases

### Phase 1 — Canvas MVP (2–3 weeks)
- [ ] `/sticker/builder` route scaffold (separate from old contact form at `/lien-he`)
- [ ] `SizePicker` component (A5 / A6)
- [ ] `AssetUploader` with dropzone (react-dropzone), max 20 assets
- [ ] `CanvasEditor` with Konva: place, drag, resize, rotate
- [ ] Canvas export at 300 DPI / 2K via `toDataURL({ pixelRatio })`
- [ ] Basic `OrderForm` UI

### Phase 2 — Submission & CMS (1 week)
- [ ] Google reCAPTCHA v3 (invisible) on submit
- [ ] `/api/sticker-submit` API route
- [ ] Sanity `stickerOrder` schema
- [ ] Multipart upload: assets + canvas PNG → Sanity
- [ ] Confirmation screen ("Sales sẽ liên hệ bạn trong 24h")

### Phase 3 — Advanced Canvas Features (2 weeks)
- [ ] **Text overlays** — `KonvaText` node; font selector (Syne, DM Sans), size slider, color picker; draggable + resizable via `Transformer`
- [ ] **Background configuration** — solid color picker + background image import (fills behind all layers); 3 mm bleed-safe zone indicator overlay (non-exported guide lines)
- [ ] **Per-sticker shape masking** — circle and rounded-rect clip using Konva `clipFunc`; applied per-node, persists through resize
- [ ] Snap-to-grid toggle (8 px grid)
- [ ] Layer order (bring forward / send to back)

### Phase 4 — Polish & Designer UX (1 week)
- [ ] Sanity Studio order list view with status column (Mới / Đang xử lý / Hoàn tất)
- [ ] Designer can update order status in Studio
- [ ] Mobile responsive pass (horizontal asset tray, portrait-locked canvas)

### Phase 5 — Stretch Goals (backlog)
- [ ] Order history lookup via phone number
- [ ] Multiple background blend modes

---

## 9. Dependencies to Add

```json
{
  "konva": "^9.x",
  "react-konva": "^18.x",
  "react-dropzone": "^14.x",
  "react-google-recaptcha-v3": "^1.x",
  "formidable": "^3.x"
}
```

No changes to existing MUI v5 or Sanity v2 versions required.

**reCAPTCHA setup notes:**
- Use `GoogleReCaptchaProvider` wrapping the builder page only (not the whole app)
- Execute token on submit via `useGoogleReCaptcha` hook
- Verify token server-side in `/api/sticker-submit` before processing the upload
- Store `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY` in `.env.local`

---

## 10. Decisions Log

All open questions resolved:

| #   | Question                  | Decision                                                                                  |
| --- | ------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Auth wall?                | **Fully public** + reCAPTCHA v3 (invisible) to prevent spam                               |
| 2   | Max sticker count?        | **20 assets** per sheet                                                                   |
| 3   | Client confirmation?      | **No** — sales team contacts client directly                                              |
| 4   | Old contact form?         | **Separated** — old form stays at `/lien-he`; builder is standalone at `/sticker/builder` |
| 5   | DPI target?               | **300 DPI** (print-ready, 2K export)                                                      |
| 6   | Text overlays?            | **In scope** (Phase 3)                                                                    |
| 7   | Background + bleed marks? | **In scope** (Phase 3) — color picker + image import + 3mm bleed guide overlay            |
| 8   | Shape masking?            | **In scope** (Phase 3) — circle and rounded-rect per asset                                |
| 9   | Real-time collaboration?  | **Out of scope**                                                                          |
| 10  | Payment / ordering?       | **Out of scope**                                                                          |

---

*Prepared for INUT Design — Đà Nẵng*  
*Version 1.0 · March 2026*