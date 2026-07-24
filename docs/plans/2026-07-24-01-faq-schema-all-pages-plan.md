# Plan — FAQSchema Centralized System for All Product Pages
**Ticket:** `2026-07-24-01-engagement-pwa-seo` · Feature 4 · FAQ Extension  
**Date:** 2026-07-24  
**Parent plan:** `2026-07-24-01-engagement-pwa-seo-feature-4-plan.md`

---

## Problem Statement

Currently `FAQSchema` is only mounted on 3 product detail pages (`lighters`, `skin-laptop`, `skin-nut-phim`) and the catch-all services route using a single generic `SERVICES_FAQ`. The site has **34 product pages** using `ProductPageTemplate` — none of them have FAQ structured data.

Updating FAQ content requires touching individual page files. A centralized, data-driven approach is needed.

---

## Architecture Decision

### Why data-driven?

| Approach | Maintainability | Scalability | Risk |
|---|---|---|---|
| Hardcode FAQ per page file | ❌ 34+ file edits per change | ❌ Each new page needs manual setup | Low |
| Central constants + pass via data object | ✅ Edit 1 constant → all pages update | ✅ New page just references constant | Low |
| CMS-driven (Sanity) | ✅ Non-dev edits | ❌ Requires schema + API changes | High |

**Chosen: Central constants + `ProductPageData.faq` field**

### Data flow (after implementation)

```
utils/seo-constants.ts
  └── export STICKER_FAQ, CA_NHAN_HOA_FAQ, etc. (per category)
  └── export SERVICES_FAQ (generic fallback)

data/product-pages/sticker.tsx
  └── STICKER_SHEET_DATA.faq = STICKER_FAQ   ← just reference the constant
  └── STICKER_DIECUT_DATA.faq = STICKER_FAQ  ← same constant, all pages update together

models/product-page.ts
  └── ProductPageData.faq?: FAQItem[]        ← new optional field

components/product-template/ProductPageTemplate.tsx
  └── if (data.faq) → <FAQSchema items={data.faq} />  ← automatic, zero per-page code

components/common/header/routes.ts
  └── RouteItem.meta.faq?: FAQItem[]         ← for catch-all /services/[category] pages
```

---

## Scope

### Pages that use `ProductPageTemplate` (34 pages — automatic via template)

| Data file | Pages | Category FAQ constant |
|---|---|---|
| `sticker.tsx` | 5 pages | `STICKER_FAQ` |
| `ca-nhan-hoa.tsx` | 4 pages | `CA_NHAN_HOA_FAQ` |
| `san-pham-luu-niem.tsx` | 6 pages | `LUU_NIEM_FAQ` |
| `an-pham-su-kien.tsx` | 5 pages | `SU_KIEN_FAQ` |
| `an-pham-tiep-thi.tsx` | 3 pages | `TIEP_THI_FAQ` |
| `an-pham-van-phong.tsx` | 4 pages | `VAN_PHONG_FAQ` |
| `an-pham-fb.tsx` | 4 pages | `FB_FAQ` |
| `an-pham-bao-bi.tsx` | 3 pages | `BAO_BI_FAQ` |

### Pages that use catch-all route `/services/[...slug].tsx` (category listing)

These already have `SERVICES_FAQ` generic. Optionally enhance with category-specific FAQ via `RouteItem.meta.faq`.

### Pages already covered (from previous implementation)

- `/san-pham/lighters/[slug]` → `LIGHTERS_FAQ` ✅
- `/san-pham/skin-laptop/[slug]` → `SKIN_LAPTOP_FAQ` ✅
- `/san-pham/skin-nut-phim/[slug]` → `MACNUT_FAQ` ✅
- `/services/[...slug]` → `SERVICES_FAQ` ✅

---

## Phase 2.1 — Extend `ProductPageData` model

### Step 2.1.1 — Add `faq` field to `ProductPageData`

**File:** `models/product-page.ts`  
**Action:** Add optional `faq` field at the top level of `ProductPageData` (not inside `seo` — FAQ is content, SEO is metadata).

```ts
import { FAQItem } from "@/utils/seo-constants";

export interface ProductPageData {
  // ... existing fields ...
  faq?: FAQItem[];  // ← ADD THIS
}
```

- [ ] Open `models/product-page.ts`
- [ ] Add `import { FAQItem } from "@/utils/seo-constants"` at top
- [ ] Add `faq?: FAQItem[]` field to `ProductPageData` interface (after `gallery`)
- [ ] Save

---

## Phase 2.2 — Update `ProductPageTemplate` to render FAQSchema automatically

### Step 2.2.1 — Mount `FAQSchema` in `ProductPageTemplate.tsx`

**File:** `components/product-template/ProductPageTemplate.tsx`  
**Action:** Import `FAQSchema` and render it when `data.faq` is present. Zero change needed per page.

```tsx
import { FAQSchema } from "@/components/scripts";

// Inside the return:
return (
  <>
    {renderSeo()}
    {data.faq && <FAQSchema items={data.faq} />}   // ← ADD THIS LINE
    <Fade in={isVisible} timeout={500}>
      <Box>{renderLayout()}</Box>
    </Fade>
  </>
);
```

- [ ] Open `components/product-template/ProductPageTemplate.tsx`
- [ ] Add `import { FAQSchema } from "@/components/scripts"`
- [ ] Add `{data.faq && <FAQSchema items={data.faq} />}` after `{renderSeo()}`
- [ ] Save

---

## Phase 2.3 — Add category FAQ constants to `seo-constants.ts`

**File:** `utils/seo-constants.ts`  
**Action:** Add 8 new FAQ arrays — one per product category. Each array has 3–5 Q&A pairs. Content is specific to that category's typical customer questions.

- [ ] Open `utils/seo-constants.ts`

### `STICKER_FAQ` — for all sticker products (sheet, diecut, kisscut, pack, magnet)

- [ ] Add `STICKER_FAQ: FAQItem[]` with 4 Q&A:
  - "In sticker tại INUT Design có tối thiểu bao nhiêu cái?" → từ 10 cái, magnet từ 20 cái
  - "Sticker có chống nước không?" → có, in UV + cán màng bảo vệ
  - "Thời gian sản xuất sticker là bao lâu?" → 1–3 ngày làm việc
  - "Tôi có thể đặt sticker theo hình tự thiết kế không?" → có, gửi file AI/PDF/PNG

### `CA_NHAN_HOA_FAQ` — for skin laptop, skin nút phím, skin điện thoại, bật lửa customize

- [ ] Add `CA_NHAN_HOA_FAQ: FAQItem[]` with 4 Q&A:
  - "INUT Design có nhận in theo hình ảnh riêng không?" → có, gửi hình qua Zalo
  - "Sản phẩm cá nhân hóa có thể làm trong ngày không?" → có nếu đặt trước 10h
  - "Chất liệu sản phẩm cá nhân hóa có bền không?" → vinyl cao cấp, bền 2–3 năm
  - "Tôi cần cung cấp gì để đặt hàng?" → hình ảnh/ý tưởng + thông tin kích thước/thiết bị

### `LUU_NIEM_FAQ` — for acrylic magnet, mica keychain, pin cài áo, thank card, postcard, in ảnh

- [ ] Add `LUU_NIEM_FAQ: FAQItem[]` with 4 Q&A:
  - "Ấn phẩm lưu niệm có thể đặt số lượng ít không?" → có, từ 1–5 cái
  - "Chất liệu acrylic/mica có bền không?" → rất bền, không bị vỡ khi dùng thường
  - "Có thể in logo doanh nghiệp lên sản phẩm lưu niệm không?" → có, phù hợp quà tặng
  - "Thời gian làm ấn phẩm lưu niệm là bao lâu?" → 2–4 ngày làm việc

### `SU_KIEN_FAQ` — for banner standee, hashtag cầm tay, poster decal, huy chương, sự kiện trọn gói

- [ ] Add `SU_KIEN_FAQ: FAQItem[]` with 4 Q&A:
  - "INUT Design có nhận làm ấn phẩm sự kiện trọn gói không?" → có, báo giá chi tiết
  - "Thời gian sản xuất ấn phẩm sự kiện là bao lâu?" → 1–5 ngày, rush được
  - "Banner/standee có chống nước/gió không?" → chất liệu phù hợp ngoài trời
  - "Kích thước banner có thể tùy chỉnh không?" → có, mọi kích thước

### `TIEP_THI_FAQ` — for card visit, catalogue, voucher, tờ rơi

- [ ] Add `TIEP_THI_FAQ: FAQItem[]` with 4 Q&A:
  - "In card visit tại INUT Design có tối thiểu bao nhiêu cái?" → từ 50 cái
  - "Có thể thiết kế card visit nếu chưa có file không?" → có, dịch vụ thiết kế miễn phí
  - "Chất lượng in có bền không?" → giấy cao cấp, mực in UV, bền màu
  - "Bao lâu thì nhận được card visit?" → 1–2 ngày làm việc

### `VAN_PHONG_FAQ` — for giấy khen, bì thư, sổ tay, bảng cứng

- [ ] Add `VAN_PHONG_FAQ: FAQItem[]` with 3 Q&A:
  - "Có thể in ấn phẩm văn phòng theo mẫu sẵn có không?" → có nhiều mẫu hoặc tùy chỉnh
  - "In bì thư/sổ tay có thể in logo riêng không?" → có, phù hợp doanh nghiệp
  - "Thời gian sản xuất ấn phẩm văn phòng?" → 2–3 ngày làm việc

### `FB_FAQ` — for in menu, tấm lót bàn ăn, san pham decor, phieu ve hoa don

- [ ] Add `FB_FAQ: FAQItem[]` with 3 Q&A:
  - "INUT Design có thiết kế menu nhà hàng không?" → có, thiết kế và in trọn gói
  - "Tấm lót bàn ăn có chống thấm nước không?" → có, phủ màng bảo vệ
  - "Chất liệu in ấn F&B có an toàn thực phẩm không?" → có, mực in đạt tiêu chuẩn

### `BAO_BI_FAQ` — for decal nhãn mác, hộp sản phẩm, tem bảo hành

- [ ] Add `BAO_BI_FAQ: FAQItem[]` with 3 Q&A:
  - "In tem nhãn/decal bao bì có số lượng tối thiểu không?" → từ 50 cái
  - "Tem bảo hành có thể in mã QR/số serial không?" → có, hỗ trợ biến dữ liệu
  - "Chất liệu tem nhãn có phù hợp dán lên bề mặt đặc biệt không?" → tư vấn chất liệu phù hợp

- [ ] Save `utils/seo-constants.ts`

---

## Phase 2.4 — Wire FAQ constants into each data file

> Each data object just needs one line: `faq: CATEGORY_FAQ`. Changing the FAQ for all sticker pages = edit `STICKER_FAQ` in one place.

### Step 2.4.1 — `data/product-pages/sticker.tsx`

**File:** `data/product-pages/sticker.tsx`  
**Action:** Import `STICKER_FAQ`, add `faq` field to all 5 data objects.

- [ ] Add import: `import { STICKER_FAQ } from "@/utils/seo-constants"`
- [ ] Add `faq: STICKER_FAQ` to `STICKER_DIECUT_DATA`
- [ ] Add `faq: STICKER_FAQ` to `STICKER_KISSCUT_DATA`
- [ ] Add `faq: STICKER_FAQ` to `STICKER_MAGNET_DATA`
- [ ] Add `faq: STICKER_FAQ` to `STICKER_SHEET_DATA`
- [ ] Add `faq: STICKER_FAQ` to `STICKER_PACK_DATA`
- [ ] Save

### Step 2.4.2 — `data/product-pages/ca-nhan-hoa.tsx`

- [ ] Add import: `import { CA_NHAN_HOA_FAQ } from "@/utils/seo-constants"`
- [ ] Add `faq: CA_NHAN_HOA_FAQ` to `SKIN_LAPTOP_DATA`
- [ ] Add `faq: CA_NHAN_HOA_FAQ` to `SKIN_NUT_PHIM_DATA`
- [ ] Add `faq: CA_NHAN_HOA_FAQ` to `SKIN_DIEN_THOAI_DATA`
- [ ] Add `faq: CA_NHAN_HOA_FAQ` to `LIGHTERS_CUSTOMIZE_DATA`
- [ ] Save

### Step 2.4.3 — `data/product-pages/san-pham-luu-niem.tsx`

- [ ] Add import: `import { LUU_NIEM_FAQ } from "@/utils/seo-constants"`
- [ ] Add `faq: LUU_NIEM_FAQ` to: `THANK_CARD_DATA`, `IN_POSTCARD_DATA`, `MOC_KHOA_MICA_DATA`, `PIN_CAI_AO_MICA_DATA`, `ACRYLIC_MAGNET_DATA`, `IN_ANH_DATA`
- [ ] Save

### Step 2.4.4 — `data/product-pages/an-pham-su-kien.tsx`

- [ ] Add import: `import { SU_KIEN_FAQ } from "@/utils/seo-constants"`
- [ ] Add `faq: SU_KIEN_FAQ` to: `HASHTAG_CAM_TAY_DATA`, `POSTER_DECAL_DATA`, `BANNER_STANDEE_DATA`, `HUY_CHUONG_DATA`, `SU_KIEN_TRON_GOI_DATA`
- [ ] Save

### Step 2.4.5 — `data/product-pages/an-pham-tiep-thi.tsx`

- [ ] Add import: `import { TIEP_THI_FAQ } from "@/utils/seo-constants"`
- [ ] Add `faq: TIEP_THI_FAQ` to: `IN_CARD_VISIT_DATA`, `CATALOGUE_BROCHURE_DATA`, `IN_VOUCHER_VE_MOI_SU_KIEN_THE_TICH_DIEM_DATA`
- [ ] Save

### Step 2.4.6 — `data/product-pages/an-pham-van-phong.tsx`

- [ ] Add import: `import { VAN_PHONG_FAQ } from "@/utils/seo-constants"`
- [ ] Add `faq: VAN_PHONG_FAQ` to: `GIAY_KHEN_DATA`, `IN_BI_THU_DATA`, `SO_TAY_DATA`, `BANG_CUNG_IN_THONG_TIN_DATA`
- [ ] Save

### Step 2.4.7 — `data/product-pages/an-pham-fb.tsx`

- [ ] Add import: `import { FB_FAQ } from "@/utils/seo-constants"`
- [ ] Add `faq: FB_FAQ` to: `SAN_PHAM_DECOR_DATA`, `THIET_KE_IN_MENU_DATA`, `PHIEU_VE_HOA_DON_GTGT_DATA`, `TAM_LOT_BAN_AN_DATA`
- [ ] Save

### Step 2.4.8 — `data/product-pages/an-pham-bao-bi.tsx`

- [ ] Add import: `import { BAO_BI_FAQ } from "@/utils/seo-constants"`
- [ ] Add `faq: BAO_BI_FAQ` to: `DECAL_NHAN_MAC_DATA`, `HOP_SAN_PHAM_DATA`, `TEM_BAO_HANH_DATA`
- [ ] Save

---

## Phase 2.5 — Verify & Lint

### Step 2.5.1 — Lint all changed files

```bash
pnpm lint  # or: eslint --no-eslintrc -c .eslintrc.json models/product-page.ts components/product-template/ProductPageTemplate.tsx utils/seo-constants.ts data/product-pages/*.tsx
```

- [ ] Run lint — fix any import or TypeScript errors
- [ ] Watch for: circular imports between `seo-constants.ts` and `models/product-page.ts` (if `FAQItem` is imported from seo-constants into the model, the model must NOT be imported back into seo-constants)

### Step 2.5.2 — Manual verification in browser

- [ ] Run `pnpm dev`
- [ ] Open any sticker page (e.g., `/services/sticker/sticker-sheet`)
- [ ] Inspect `<head>` in DevTools → verify `<script type="application/ld+json">` with `@type: FAQPage` is present
- [ ] Open any ca-nhan-hoa page (e.g., `/services/ca-nhan-hoa/skin-laptop-customize`)
- [ ] Verify `FAQPage` schema is present with correct questions

---

## File Change Summary

| File | Action | Note |
|---|---|---|
| `models/product-page.ts` | EDIT — add `faq?: FAQItem[]` | 1 line + 1 import |
| `components/product-template/ProductPageTemplate.tsx` | EDIT — render FAQSchema | 2 lines |
| `utils/seo-constants.ts` | EDIT — add 8 new FAQ category arrays | ~80 new lines |
| `data/product-pages/sticker.tsx` | EDIT — add `faq:` to 5 objects | 5 lines |
| `data/product-pages/ca-nhan-hoa.tsx` | EDIT — add `faq:` to 4 objects | 4+1 lines |
| `data/product-pages/san-pham-luu-niem.tsx` | EDIT — add `faq:` to 6 objects | 6+1 lines |
| `data/product-pages/an-pham-su-kien.tsx` | EDIT — add `faq:` to 5 objects | 5+1 lines |
| `data/product-pages/an-pham-tiep-thi.tsx` | EDIT — add `faq:` to 3 objects | 3+1 lines |
| `data/product-pages/an-pham-van-phong.tsx` | EDIT — add `faq:` to 4 objects | 4+1 lines |
| `data/product-pages/an-pham-fb.tsx` | EDIT — add `faq:` to 4 objects | 4+1 lines |
| `data/product-pages/an-pham-bao-bi.tsx` | EDIT — add `faq:` to 3 objects | 3+1 lines |

**Total: 10 files · ~120 lines · 34 product pages get FAQSchema automatically**

---

## Reusability Design (How to update FAQ later)

```
To update FAQ for ALL sticker pages:
  → Edit STICKER_FAQ in utils/seo-constants.ts
  → All 5 sticker pages automatically update on next build ✅

To give a specific product its own FAQ (override):
  → In the data file: faq: [...custom questions]
  → Other products in same category keep the category FAQ ✅

To add a new product page:
  → Create a new ProductPageData object
  → Add faq: CATEGORY_FAQ
  → FAQSchema renders automatically ✅
```

---

## Progress Tracker

```
Phase 2.1 — Model Extension
  [x] 2.1.1 Add faq?: FAQItem[] to ProductPageData

Phase 2.2 — Template Update
  [x] 2.2.1 Render FAQSchema in ProductPageTemplate

Phase 2.3 — FAQ Constants
  [x] 2.3.1 STICKER_FAQ (5 Q&A)
  [x] 2.3.2 CA_NHAN_HOA_FAQ (4 Q&A)
  [x] 2.3.3 LUU_NIEM_FAQ (5 Q&A)
  [x] 2.3.4 SU_KIEN_FAQ (4 Q&A)
  [x] 2.3.5 TIEP_THI_FAQ (4 Q&A)
  [x] 2.3.6 VAN_PHONG_FAQ (4 Q&A)
  [x] 2.3.7 FB_FAQ (4 Q&A)
  [x] 2.3.8 BAO_BI_FAQ (4 Q&A)

Phase 2.4 — Wire into Data Files
  [x] 2.4.1 sticker.tsx (5 objects)
  [x] 2.4.2 ca-nhan-hoa.tsx (4 objects)
  [x] 2.4.3 san-pham-luu-niem.tsx (6 objects)
  [x] 2.4.4 an-pham-su-kien.tsx (5 objects)
  [x] 2.4.5 an-pham-tiep-thi.tsx (3 objects)
  [x] 2.4.6 an-pham-van-phong.tsx (4 objects)
  [x] 2.4.7 an-pham-fb.tsx (4 objects)
  [x] 2.4.8 an-pham-bao-bi.tsx (3 objects)

Phase 2.5 — Verify
  [x] 2.5.1 pnpm lint — 0 errors (2 pre-existing warnings in an-pham-tiep-thi.tsx)
  [ ] 2.5.2 Manual browser check on 2 pages (post-deploy / pnpm dev)
```

---

*Plan generated by GitHub Copilot CLI — 2026-07-24*
