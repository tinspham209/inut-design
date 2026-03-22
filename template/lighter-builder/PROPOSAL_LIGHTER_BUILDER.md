# PROPOSAL: Lighter Skin Builder — INUT Design

**Feature name:** Custom Lighter Skin Designer  
**Route:** `/bat-lua/builder`  
**Stack:** Next.js 12 (Page Router) · React 18 · TypeScript · MUI v5 · Sanity CMS v2  
**Priority:** High  
**Version:** 3.0 (Final) · March 2026  
**Status:** Ready for development planning  

---

## 1. Executive Summary

INUT Design hiện nhận đơn skin bật lửa theo quy trình thủ công: khách gửi form → designer liên hệ thu thập ảnh → designer dựng demo → khách góp ý → sản xuất. Mỗi đơn mất 3–5 lượt trao đổi chỉ để thu thập asset và duyệt layout.

**Giải pháp:** Xây dựng trang tự thiết kế tại `/bat-lua/builder`, cho phép khách tải lên ảnh thiết kế của họ và xem ngay bản xem trước 3D full-wrap trên bật lửa — trước khi nhấn gửi đơn. Designer chỉ cần tải file ảnh 2K từ Sanity Studio và đưa thẳng vào sản xuất.

**Kết quả kỳ vọng:** Giảm từ 3–5 lượt liên hệ xuống còn 0–1 lượt. Designer không còn phải dựng demo layout.

**Benchmark:** [Cricket Lighters Design Tool](https://design.cricketlighters.com) — công cụ tương tự của thương hiệu bật lửa quốc tế, dùng làm tham chiếu UX.

---

## 2. Current vs. Proposed Flow

### Hiện tại — nhiều bước thủ công

```
Khách gửi form liên hệ
        ↓
Designer liên hệ qua Zalo/email để thu thập ảnh
        ↓
Khách gom & gửi ảnh (thường bị nén, thiếu file)
        ↓
Designer dựng demo layout → gửi lại khách duyệt
        ↓
Khách yêu cầu chỉnh sửa (1–3 lượt)
        ↓
File cuối gửi sản xuất
```

**Vấn đề cốt lõi:**
- Designer mất thời gian dựng demo thay vì làm sản xuất
- Không có format asset chuẩn → mất công xử lý file
- Khách không có hình dung trực quan trước khi duyệt

### Đề xuất — tự phục vụ, ít ma sát

```
Khách mở trang /bat-lua/builder
        ↓
Chọn loại bật lửa (Normal / Mini)
        ↓
Tải lên 1 ảnh thiết kế duy nhất
        ↓
Xem ngay bản xem trước 3D full-wrap trên bật lửa
        ↓
Điền thông tin & nhấn "Gửi thiết kế"
        ↓
Sanity nhận: { loại bật lửa, ảnh gốc, ảnh 2K full-wrap, thông tin đơn }
        ↓
Designer tải ảnh 2K từ Sanity Studio → đưa thẳng vào sản xuất
```

---

## 3. Đặc điểm sản phẩm đã xác nhận

Các quyết định dưới đây đã được INUT xác nhận, không còn là câu hỏi mở:

| Thuộc tính               | Giá trị xác nhận                                          |
| ------------------------ | --------------------------------------------------------- |
| Loại skin                | **Decal dán** (không phải màu vật liệu)                   |
| Kiểu bao phủ             | **Full wrap 360°** quanh thân bật lửa                     |
| Hình dạng skin           | **Chữ nhật đầy đủ** — không cắt xén, không lỗ             |
| Số ảnh thiết kế          | **1 ảnh duy nhất** per đơn (full-wrap, không ghép canvas) |
| Độ phân giải khuyến nghị | **1640 × 2048 px trở lên**, giữ tỉ lệ gốc                 |
| Định dạng xuất           | **PNG 300 DPI flat**                                      |
| Chọn màu bật lửa         | **Không cần** — skin decal phủ toàn bộ thân               |
| In 2 mặt                 | **Không áp dụng** — full wrap đã bao gồm tất cả mặt       |

---

## 4. Loại bật lửa & Kích thước

> ⚠️ **Cần xác nhận với nhà cung cấp** trước Phase 1: kích thước mm chính xác của vùng in.  
> Giá trị dưới đây là tham chiếu ngành — có thể khác tùy nhà sản xuất.

| Loại                    | Kích thước bật lửa | Vùng in (ước tính)             | @ 300 DPI     | Tỉ lệ hiển thị UI |
| ----------------------- | ------------------ | ------------------------------ | ------------- | ----------------- |
| **Normal** (tiêu chuẩn) | ~80 × 26 mm        | ~74 × 82 mm (full wrap chu vi) | ~874 × 968 px | 4:5               |
| **Mini** (nhỏ)          | ~60 × 20 mm        | ~56 × 63 mm                    | ~661 × 744 px | 4:5               |

> **Lưu ý full wrap:** Ảnh thiết kế bao quanh 360° chu vi, nên chiều ngang của file in = chu vi thân bật lửa (π × đường kính), không phải chiều ngang mặt trước.

---

## 5. Phạm vi tính năng (v1)

### Trong phạm vi

| #   | Tính năng                                                                                                                   |
| --- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | Chọn loại bật lửa: **Normal** hoặc **Mini** (card trực quan kèm kích thước mm + px)                                         |
| 2   | **Upload 1 ảnh duy nhất** — drag-and-drop hoặc click chọn file (PNG/JPG/WEBP, tối đa 30 MB)                                 |
| 3   | **Cảnh báo độ phân giải** — toast cảnh báo nếu ảnh dưới 1640 × 2048 px (không chặn, chỉ thông báo)                          |
| 4   | **Xem trước 3D full-wrap** — Three.js render bật lửa 3D với ảnh thiết kế map UV lên thân cylinder, cập nhật ngay khi upload |
| 5   | **Kéo để xoay** — kéo chuột/chạm màn hình trên khung 3D để xoay bật lửa tự do                                               |
| 6   | **Thanh xoay (Rotation slider)** — MUI Slider −180° đến +180°, đồng bộ với thao tác kéo                                     |
| 7   | **Thanh thu phóng (Scale slider)** — 60% đến 150%, điều chỉnh kích thước bật lửa trong khung xem                            |
| 8   | Nút **Reset** — đưa góc nhìn và tỉ lệ về mặc định                                                                           |
| 9   | **Thay ảnh / Xóa ảnh** — thay thế hoặc xóa ảnh đang xem trước                                                               |
| 10  | **Form gửi đơn**: Tên, SĐT/Zalo, Số lượng, Loại bật lửa, Ghi chú                                                            |
| 11  | **Sanity CMS** — lưu tài liệu `lighterOrder` đầy đủ thông tin                                                               |
| 12  | **reCAPTCHA v3** (ẩn) trên submit                                                                                           |
| 13  | **Route độc lập** `/bat-lua/builder` — không ảnh hưởng form liên hệ cũ tại `/lien-he`                                       |
| 14  | **Màn hình xác nhận** — "MR. TOM hoặc MS. BOO sẽ liên hệ bạn trong vòng 24h"                                                |

### Ngoài phạm vi (v1)

- Canvas editor đa lớp (drag-and-drop nhiều ảnh, text overlay, shape masking) — đây là upload trực tiếp 1 ảnh
- Chọn màu vỏ bật lửa (không cần thiết với skin decal)
- In 2 mặt / dual-face (không áp dụng với full wrap)
- Thanh toán / đặt cọc online
- Cộng tác thời gian thực

---

## 6. User Flow chi tiết

```
[/san-pham/bat-lua]
    │
    ├── Hero section (thông tin + giá sản phẩm hiện có)
    │
    └── CTA: "Tự thiết kế skin bật lửa của bạn →"
              │
              ▼
    [/bat-lua/builder]  ← route mới, độc lập
              │
    ┌─────────────────────────────────────────────────────────┐
    │  HEADER: INUT Design logo · Step 1 → 2 → 3 · PROTOTYPE  │
    ├────────────────────────────────┬────────────────────────┤
    │                                │  TAB: Thiết kế         │
    │                                │  ─────────────────     │
    │   [  Three.js 3D Lighter  ]    │  Loại bật lửa:         │
    │                                │  [ Normal ] [ Mini ]   │
    │   Ảnh wrap 360° quanh thân     │                        │
    │   bật lửa, render real-time    │  Ảnh thiết kế:         │
    │                                │  [  Drag & Drop Zone ] │
    │   ← Kéo để xoay →             │  (sau khi upload:      │
    │                                │   thumb + metadata     │
    │                                │   + cảnh báo res)      │
    │                                │                        │
    │                                │  Điều chỉnh xem trước: │
    │                                │  Xoay  ────●────  0°  │
    │                                │  Scale ────●──── 100% │
    │                                │  [ Reset ]             │
    │                                ├────────────────────────┤
    │                                │  TAB: Gửi đơn          │
    │                                │  ─────────────────     │
    │                                │  Tên · SĐT · Số lượng  │
    │                                │  Loại · Ghi chú        │
    │                                ├────────────────────────┤
    │                                │  [ GỬI THIẾT KẾ → ]   │
    └────────────────────────────────┴────────────────────────┘
              │
    Màn hình xác nhận:
    "Chúng tôi đã nhận thiết kế của bạn!
     MR. TOM hoặc MS. BOO sẽ liên hệ bạn trong vòng 24h."
```

---

## 7. Kiến trúc kỹ thuật

### 7.1 Thư viện render 3D

**Three.js r128** (CDN, không cần cài thêm npm package)

| Tiêu chí          | Three.js                    | CSS perspective     | Fabric.js |
| ----------------- | --------------------------- | ------------------- | --------- |
| Full wrap 360° UV | ✅ CylinderGeometry UV map   | ❌ Chỉ CSS transform | ❌         |
| Kéo xoay tự do    | ✅ mousemove handler         | ⚠️ Giới hạn          | ❌         |
| Lighting / depth  | ✅ StandardMaterial + lights | ❌                   | ❌         |
| Bundle size       | ~580 KB CDN                 | 0                   | ~280 KB   |
| Next.js 12 SSR    | ✅ `dynamic({ ssr: false })` | ✅                   | ✅         |

**Quyết định: Three.js.** CSS perspective không thể render full wrap 360° đúng nghĩa — ảnh sẽ bị kéo méo ở cạnh thay vì uốn tự nhiên theo hình trụ. Three.js `CylinderGeometry` với UV map là giải pháp duy nhất render chính xác.

```ts
// pages/bat-lua/builder.tsx
const LighterBuilder = dynamic(
  () => import('@/components/lighter/LighterBuilder'),
  { ssr: false }
);
```

### 7.2 Cấu trúc 3D Model

```
THREE.Group (lighterGroup)
├── CylinderGeometry (thân bật lửa)        ← UV map = ảnh thiết kế
│   MeshStandardMaterial { map: texture }
│
├── CylinderGeometry (nắp trên — đen)       ← MeshStandardMaterial đen
├── CylinderGeometry (gờ nắp)
├── CylinderGeometry (bánh xe lửa kim loại)
├── CylinderGeometry (miệng phun)
└── CircleGeometry (đáy bật lửa)
```

**Lighting setup:**
- `AmbientLight` — nền đều
- `DirectionalLight` (key) — từ trên-phải, castShadow
- `DirectionalLight` (rim) — từ sau-trái, tông xanh lạnh tạo độ sâu
- `DirectionalLight` (fill) — làm mềm bóng tối

**Tone mapping:** `ACESFilmicToneMapping` — cho skin texture trông tự nhiên như ảnh thực tế.

### 7.3 Upload & Texture Pipeline

```
Client chọn file (1 ảnh)
        │
        ▼
Validate: type (PNG/JPG/WEBP) + size ≤ 30 MB
        │
        ▼
FileReader → dataURL → new Image()
        │
        ├── Đọc naturalWidth × naturalHeight
        │   → nếu < 1640 × 2048: hiện cảnh báo vàng (không chặn)
        │
        ├── THREE.Texture(img) → bodyMaterial.map = texture
        │   → texture.needsUpdate = true
        │   → render ngay trên 3D canvas
        │
        └── Hiển thị thumbnail + metadata trong panel phải
```

**Upload lên server:** Chỉ khi nhấn submit — không upload trong quá trình preview. Giữ nguyên Object URL trong bộ nhớ cho đến khi submit thành công.

### 7.4 Export 2K PNG

```ts
// Trên client, trước khi POST:
renderer.setSize(2048, 2048);   // tạm thời resize off-screen
renderer.render(scene, camera);
const dataUrl = renderer.domElement.toDataURL('image/png');

// Restore kích thước hiển thị
renderer.setSize(canvasArea.clientWidth, canvasArea.clientHeight);
```

> **Lưu ý:** Export PNG từ Three.js canvas là ảnh render 3D (có lighting, reflection). Nếu printer cần flat skin tuyệt đối phẳng (không lighting), export thay bằng `canvas.drawImage(uploadedImg)` trực tiếp — giữ nguyên pixel ảnh gốc. **Cần xác nhận với printer.**

### 7.5 Sanity CMS Schema

```ts
// schemas/lighterOrder.ts
export default {
  name: 'lighterOrder',
  title: 'Lighter Skin Order',
  type: 'document',
  fields: [
    { name: 'customerName',  title: 'Tên khách hàng', type: 'string' },
    { name: 'phone',         title: 'SĐT / Zalo',     type: 'string' },
    { name: 'quantity',      title: 'Số lượng',        type: 'number' },
    { name: 'notes',         title: 'Ghi chú',         type: 'text'   },
    {
      name: 'lighterType',
      title: 'Loại bật lửa',
      type: 'string',
      options: { list: ['Normal', 'Mini'] },
    },
    {
      name: 'designAsset',
      title: 'File thiết kế gốc (ảnh upload)',
      type: 'image',
      options: { hotspot: false },
    },
    {
      name: 'skinExport',
      title: 'Ảnh skin 2K (xuất từ builder)',
      type: 'image',
      options: { hotspot: false },
      // Đây là file designer tải về để sản xuất
    },
    {
      name: 'assetResolution',
      title: 'Độ phân giải ảnh gốc',
      type: 'string',
      // Ví dụ: "2048 × 2560 px"
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
      media: 'skinExport',
    },
  },
};
```

### 7.6 API Route

**`/pages/api/lighter-submit.ts`**

```
POST /api/lighter-submit
Content-Type: multipart/form-data

Fields:
  lighterType       : 'Normal' | 'Mini'
  customerName      : string
  phone             : string
  quantity          : number
  notes             : string
  assetResolution   : string          (e.g. "2048 × 2560")
  designAsset       : File            (ảnh gốc từ khách)
  skinExport        : Blob (PNG)      (ảnh 2K render từ Three.js)

Response:
  201 { success: true, orderId: string }
  400 { error: string }
  500 { error: string }
```

Dùng `formidable` để parse multipart, `@sanity/client` với write token (`SANITY_WRITE_TOKEN` trong `.env.local`) để upload.

---

## 8. Cây component

```
pages/bat-lua/builder.tsx
└── LighterBuilderPage  (dynamic, ssr: false)
    │
    ├── BuilderHeader
    │   ├── Logo + subtitle "Lighter Builder"
    │   ├── StepIndicator (3 bước: Tải ảnh → Xem trước → Gửi đơn)
    │   └── Badge "PROTOTYPE"
    │
    ├── ThreeCanvas                     ← Three.js WebGLRenderer mount
    │   ├── LighterModel (group)
    │   │   ├── BodyMesh (CylinderGeometry + MeshStandardMaterial)
    │   │   ├── CapMesh
    │   │   ├── WheelMesh
    │   │   └── GuardMesh
    │   ├── SceneLights (Ambient + Key + Rim + Fill)
    │   ├── DragRotateHandler           ← mouse/touch events
    │   └── UploadPromptOverlay         ← hiện khi chưa có ảnh
    │
    └── ControlPanel
        ├── TabBar [Thiết kế | Gửi đơn]
        │
        ├── DesignTab
        │   ├── LighterTypePicker       ← Normal / Mini cards
        │   ├── ImageUploadZone         ← react-dropzone, 1 file, max 30MB
        │   │   ├── DropzoneIdle        ← drag-and-drop UI
        │   │   └── UploadedPreview     ← thumbnail + metadata + res warning
        │   └── ViewerControls
        │       ├── RotationSlider      ← MUI Slider −180°..+180°
        │       ├── ScaleSlider         ← MUI Slider 60..150%
        │       └── ResetButton
        │
        ├── OrderTab
        │   ├── Field: Tên khách hàng
        │   ├── Field: SĐT / Zalo
        │   ├── Field: Số lượng
        │   ├── Field: Loại bật lửa (select, sync với TypePicker)
        │   └── Field: Ghi chú (textarea)
        │
        └── SubmitArea (sticky bottom)
            ├── SubmitButton            ← disabled khi chưa upload ảnh
            ├── SubmitHintText
            └── ConfirmationModal       ← hiện sau submit thành công
```

### Tái sử dụng từ Sticker Builder

| Component                            | Trạng thái                         |
| ------------------------------------ | ---------------------------------- |
| `StepIndicator`                      | ✅ Tái sử dụng hoàn toàn            |
| `OrderForm` fields                   | ✅ Tái sử dụng hoàn toàn            |
| `SubmitButton` + `ConfirmationModal` | ✅ Tái sử dụng hoàn toàn            |
| `BuilderHeader`                      | ✅ Tái sử dụng (thay subtitle)      |
| `ImageUploadZone`                    | ♻️ Đơn giản hóa — 1 file thay vì 20 |
| `ThreeCanvas` + `LighterModel`       | 🆕 Mới hoàn toàn                    |
| `LighterTypePicker`                  | 🆕 Mới (tương tự `SizePicker`)      |
| `ViewerControls`                     | 🆕 Mới                              |

> ~40% component tái sử dụng từ Sticker Builder.

---

## 9. UX & Design (Chromatic Offset system)

Toàn bộ visual language nhất quán với Sticker Builder đã được duyệt:

| Element         | Giá trị                                                                |
| --------------- | ---------------------------------------------------------------------- |
| Background      | `#080706` — nền tối làm bật lửa 3D nổi bật                             |
| Surface         | `#100f0d` / `#1a1916` / `#242220`                                      |
| Orange accent   | `#FF4D00` — CTA, step active, slider thumb, selected card border       |
| Yellow          | `#FFE234` — cảnh báo độ phân giải thấp                                 |
| Heading font    | **Syne** (700–800) — step labels, section headers, button text         |
| Body font       | **DM Sans** — metadata, labels, input fields                           |
| Canvas lighting | ACES filmic tone mapping — cho skin texture trông như ảnh chụp thực tế |
| Auto-rotate     | Khi chưa có ảnh: bật lửa tự xoay chậm, dừng khi upload ảnh             |
| Mobile          | Panel trượt lên từ dưới (bottom sheet); canvas chiếm toàn màn hình     |
| Touch target    | Tối thiểu 44 × 44 px                                                   |
| Animation       | ≤ 300ms; không parallax                                                |
| Copy chính      | Tiếng Việt; tiếng Anh chỉ cho code ("Normal", "Mini", "PNG")           |

**Điểm khác biệt so với Sticker Builder:** Không có flat canvas editor. Toàn bộ trải nghiệm là xem trước 3D — khách hiểu ngay "đây là cái bật lửa của mình trông như thế nào" mà không cần giải thích.

---

## 10. Edge Cases & Xử lý lỗi

| Tình huống                      | Xử lý                                                           |
| ------------------------------- | --------------------------------------------------------------- |
| File không phải ảnh             | Từ chối với toast: "Chỉ chấp nhận PNG, JPG, WEBP"               |
| File > 30 MB                    | Từ chối với toast: "File quá lớn (tối đa 30 MB)"                |
| Độ phân giải < 1640 × 2048 px   | **Cảnh báo vàng** trong panel (không chặn) — khách vẫn gửi được |
| Submit khi chưa có ảnh          | Chặn submit; toast + chuyển về tab Thiết kế                     |
| Submit khi thiếu thông tin đơn  | Chặn submit; toast + chuyển sang tab Gửi đơn                    |
| Lỗi mạng khi submit             | Nút retry; ảnh vẫn còn trong Object URL (chưa revoke)           |
| Safari iOS — canvas export      | Giới hạn pixelRatio ≤ 2 để tránh crash bộ nhớ                   |
| Đổi loại bật lửa sau khi upload | **Không xóa ảnh** — chỉ thay đổi tỉ lệ hiển thị model           |

---

## 11. Các giai đoạn triển khai

### Phase 1 — 3D Viewer MVP (2 tuần)

- [ ] Route `/bat-lua/builder` scaffold (dynamic, SSR disabled)
- [ ] `LighterTypePicker` — Normal / Mini cards
- [ ] `ImageUploadZone` — react-dropzone, 1 file, validate type + size + resolution
- [ ] `ThreeCanvas` — WebGLRenderer + CylinderGeometry body + lighting setup
- [ ] `LighterModel` — full model (body, cap, wheel, guard, bottom cap)
- [ ] UV texture map từ ảnh upload lên thân cylinder (full wrap 360°)
- [ ] Drag-to-rotate (mouse + touch)
- [ ] `RotationSlider` + `ScaleSlider` + Reset
- [ ] `UploadedPreview` — thumbnail, metadata, resolution warning
- [ ] Auto-rotate khi chưa có ảnh

### Phase 2 — Submission & CMS (1 tuần)

- [ ] `lighterOrder` Sanity schema
- [ ] Export 2K PNG từ Three.js renderer (hoặc flat canvas — xác nhận với printer)
- [ ] `/api/lighter-submit` API route (multipart: designAsset + skinExport → Sanity)
- [ ] Google reCAPTCHA v3 (tái sử dụng config từ Sticker Builder)
- [ ] `ConfirmationModal` — MR. TOM / MS. BOO copy

### Phase 3 — Designer UX & Polish (0.5 tuần)

- [ ] Sanity Studio view cho `lighterOrder` — cột status, thumbnail skinExport, thông tin khách
- [ ] Designer cập nhật trạng thái đơn (Mới → Đang xử lý → Hoàn tất)
- [ ] Mobile responsive (bottom sheet panel, full-screen canvas)
- [ ] CTA trên trang `/san-pham/bat-lua` dẫn tới builder

### Phase 4 — Stretch Goals (backlog)

- [ ] Lookup lịch sử đơn theo số điện thoại
- [ ] Fullscreen preview modal (nhấn phóng to model 3D)
- [ ] Download ảnh xem trước từ phía khách (PNG snapshot)

---

## 12. Dependencies

**Không thêm npm package mới.** Chỉ cần:

```json
{
  "react-dropzone": "^14.x",          // đã có trong Sticker Builder
  "react-google-recaptcha-v3": "^1.x", // đã có trong Sticker Builder
  "formidable": "^3.x"                 // đã có trong Sticker Builder
}
```

**Three.js:** Load qua CDN trong component (`next/script` hoặc dynamic import) — không thêm vào `node_modules` để tránh ảnh hưởng bundle chính.

```ts
// Option A — CDN script tag (đơn giản nhất cho Next.js 12)
<Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />

// Option B — npm (nếu muốn typed import)
// npm install three @types/three
// tree-shaking sẽ giữ bundle hợp lý (~200KB gzipped)
```

---

## 13. Bảng quyết định (Decision Log)

| #   | Câu hỏi                          | Quyết định                      | Lý do                                                                                        |
| --- | -------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | Render 3D: CSS hay Three.js?     | **Three.js**                    | CSS perspective không render full wrap 360° đúng — ảnh bị méo cạnh                           |
| 2   | Số ảnh upload                    | **1 ảnh duy nhất**              | Full wrap = 1 file bao toàn bộ, không cần ghép canvas                                        |
| 3   | Canvas editor đa lớp?            | **Không**                       | Khách chuẩn bị ảnh sẵn trước khi upload — builder chỉ preview                                |
| 4   | Chọn màu vỏ bật lửa?             | **Không**                       | Skin decal phủ toàn bộ thân — màu vỏ không nhìn thấy                                         |
| 5   | In 2 mặt?                        | **Không áp dụng**               | Full wrap 360° đã bao gồm tất cả mặt                                                         |
| 6   | Export: render 3D hay flat file? | **Cần xác nhận với printer**    | Nếu printer chấp nhận PNG gốc (flat) → dùng ảnh gốc; nếu cần render → Three.js canvas export |
| 7   | Độ phân giải tối thiểu?          | **1640 × 2048 px khuyến nghị**  | Theo spec Cricket Lighters; không chặn, chỉ cảnh báo                                         |
| 8   | Auth wall?                       | **Fully public** + reCAPTCHA v3 | Không yêu cầu đăng nhập — tăng tỉ lệ hoàn thành                                              |
| 9   | Form liên hệ cũ?                 | **Giữ nguyên** tại `/lien-he`   | Builder là route mới, độc lập                                                                |
| 10  | Auto-rotate model?               | **Có** khi chưa có ảnh          | Tăng visual appeal; dừng khi upload để khách kiểm tra kỹ                                     |

---

## 14. Câu hỏi còn mở (cần INUT xác nhận trước Phase 1)

| #   | Câu hỏi                                                                           | Ai trả lời          | Mức độ ưu tiên |
| --- | --------------------------------------------------------------------------------- | ------------------- | -------------- |
| 1   | **Kích thước vùng in chính xác (mm)** của Normal và Mini theo nhà cung cấp?       | INUT / nhà cung cấp | 🔴 Bắt buộc     |
| 2   | **Định dạng file gửi printer:** PNG gốc (flat, không lighting) hay PNG render 3D? | Printer / INUT      | 🔴 Bắt buộc     |
| 3   | Skin có **kích thước full chu vi** (wrap 360°) hay chỉ mặt trước + sau?           | INUT / nhà cung cấp | 🟠 Quan trọng   |
| 4   | **Tỉ lệ file khuyến nghị** (W:H) để in full wrap đúng không bị kéo méo?           | Nhà cung cấp        | 🟠 Quan trọng   |

---

## 15. So sánh với Sticker Sheet Builder

|                        | Sticker Builder                      | Lighter Builder                 |
| ---------------------- | ------------------------------------ | ------------------------------- |
| Canvas                 | Konva.js flat canvas (2D editor)     | Three.js WebGL (3D viewer)      |
| Số ảnh                 | Tối đa 20 ảnh, drag onto canvas      | 1 ảnh full-wrap                 |
| Interaction            | Drag, scale, rotate từng asset       | Drag để xoay bật lửa 3D         |
| Export                 | Flat canvas PNG 300 DPI              | Flat skin PNG 300 DPI (ảnh gốc) |
| Độ phức tạp frontend   | Cao (editor state, layer management) | Trung bình (upload + 3D viewer) |
| Thời gian dev ước tính | 7–9 tuần                             | **3–4 tuần**                    |
| Reuse component        | —                                    | ~40% từ Sticker Builder         |

---

## 16. Prototype tham khảo

File prototype HTML (`lighter-builder.html`) đã được xây dựng với Three.js r128, bao gồm:

- ✅ 3D lighter model với full-wrap UV texture
- ✅ Drag-to-rotate (mouse + touch)
- ✅ Rotation + Scale slider
- ✅ Upload ảnh + resolution warning
- ✅ Replace / Clear ảnh
- ✅ Normal / Mini type picker
- ✅ Order form (tab 2)
- ✅ Submit flow + confirmation modal
- ✅ Chromatic Offset design system (màu, font, layout)

Dùng prototype để demo cho khách hàng và align với developer trước khi bắt đầu Phase 1.

---

*Prepared for INUT Design — Đà Nẵng*  
*Version 3.0 (Final) · March 2026*  
*Author: Product team*  
*References:*  
*— PROPOSAL_STICKER_BUILDER.md (approved architecture)*  
*— design.cricketlighters.com (UX benchmark)*  
*— lighter-builder.html (working prototype)*