---
name: inut-product-page-automation
description: "Use when creating a new product page for INUT Design end-to-end: from brief, to Vietnamese SEO content, to implemented Next.js route. Invoke this skill whenever someone asks to 'create a new product page', 'add a new product route', or wants a complete product page built from scratch — even if they only mention the product name. Vietnamese triggers: 'tạo trang sản phẩm mới', 'auto page sản phẩm', 'draft rồi làm route', 'thêm trang sản phẩm'. English triggers: 'new product landing page', 'create product page', 'add product route', 'build product page for INUT'. Prefer this skill over product-page-generator when starting from scratch without an existing content.md."
---

# INUT Product Page Automation Skill

## Objective

Biến quy trình thủ công nhiều bước thành workflow gần như 1-click:

1. Draft ý tưởng nội dung sản phẩm
2. Sinh nội dung Markdown chuẩn SEO
3. Tạo route page mới (`index.tsx` + `content.md`)
4. Implement page dựa trên pattern có sẵn
5. Trả về checklist review cuối

## Required inputs

- **Tên sản phẩm**
- **Từ khoá SEO chính**
- **Đối tượng khách hàng**

## Optional inputs (fallback nếu không có)

- **Route path**: tự suy ra từ tên sản phẩm theo slug kebab-case
- **Hero image**: mặc định `/branding/logo.webp`
- **Parent folder**: nếu không rõ, tạo route phẳng an toàn dưới `pages/<slug>/`

## Workflow (must follow)

### Step 1 — Draft brief first (bắt buộc)

Tạo bản nháp ngắn (không quá dài) gồm:

- Positioning statement
- 3–5 pain points của khách hàng mục tiêu
- 3–5 value propositions
- Điểm kỹ thuật cần nhấn (file thiết kế, chất liệu, quy trình)
- CTA hướng về INUT Design

### Step 2 — Generate final content via existing writer contract (bắt buộc)

Follow the content writing framework defined directly in:

- `.github/skills/inut-content-writer/SKILL.md`

Apply the mandatory section structure, tone, and domain knowledge from that skill. Do not route through the agent wrapper — read the skill file directly to avoid an extra layer of indirection.

Nội dung đầu ra là `content.md` tiếng Việt, cấu trúc đầy đủ theo content writer skill.

### Step 3 — Create or update route files (bắt buộc)

Tạo/cập nhật:

- `pages/<route>/content.md`
- `pages/<route>/index.tsx`

Nếu `index.tsx` đang rỗng, triển khai đầy đủ.

### Step 4 — Implement page with repository pattern (bắt buộc)

- Tham chiếu phong cách triển khai từ `pages/sticker/sticker-sheet/index.tsx`.
- Dùng `NextPageWithLayout`, `MainLayout`, `Seo`, MUI layout.
- Dùng nội dung từ `content.md` làm ngữ cảnh chính cho tiêu đề/section/SEO copy, rồi map thành section data trong React.
- Tránh tạo abstraction mới nếu chưa cần.

#### Rendering rule (bắt buộc)

Không render markdown trực tiếp thành HTML cho thân trang sản phẩm.

Không dùng các pattern sau cho `pages/<route>/index.tsx`:

- `dangerouslySetInnerHTML`
- pipeline markdown-to-HTML để render toàn bộ body
- page chỉ gồm `MarkdownWrapper` + HTML injection

Thay vào đó, bắt buộc triển khai bằng React component syntax:

- Chia section rõ ràng (hero, intro, highlights, quy trình, ứng dụng/lợi ích, contact)
- Dữ liệu section ở dạng constants/arrays để dễ maintain
- JSX rõ cấu trúc và bám phong cách các page sticker hiện có

### Step 5 — Verify and handoff (bắt buộc)

- Chạy kiểm tra phù hợp phạm vi thay đổi (`pnpm lint`, và `pnpm build` nếu ảnh hưởng routing/runtime).
- Trả về:
  - Danh sách file thay đổi
  - Assumptions đã áp dụng
  - Checklist review nội dung cuối cho người dùng

## Output contract for this skill

Kết quả cần có các phần:

1. **Draft brief** (tóm tắt)
2. **Generated content status** (`content.md` đã tạo/cập nhật)
3. **Route implementation status** (`index.tsx` đã scaffold/implement)
4. **Verification status**
5. **Final review checklist**

## Guardrails

- Không đụng vào flow checkout/cart/Sanity nếu không liên quan.
- Không hardcode secrets.
- Không đổi conventions import (`@/`).
- Không rewrite lớn ngoài phạm vi route mới.
- Không fallback sang markdown-to-HTML renderer cho product page implementation.
