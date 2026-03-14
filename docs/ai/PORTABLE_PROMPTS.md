# Portable AI Prompt Pack (Editor-Agnostic)

Use these prompts in editors that do not natively support `.github/prompts/*.prompt.md` or `.trae/prompts/*.prompt.md` metadata/frontmatter.

---

## Organizational Rule

All prompt source files reside in `.agents/prompts/`. Symbolic links are maintained for:
- `.github/prompts/` (Copilot)
- `.trae/prompts/` (Trae)
- `.codex/prompts/` (Codex)

**Always create and edit files in `.agents/prompts/` to ensure consistency across all IDEs. Creating files in `.trae/prompts/` or `.github/prompts/` is strictly prohibited.**

---

## 1) Add feature

Implement a new feature in this repository using existing conventions.

Inputs:

- Feature summary: `<what feature should be added?>`
- Target area: `<checkout | lighters | blog | analytics | contact | other>`
- Constraints: `<risk limits, no-go areas, timeline constraints>`

Requirements:

1. Inspect relevant files and summarize current behavior.
2. Propose a minimal implementation plan.
3. Implement in incremental steps.
4. Reuse existing patterns and helpers.
5. Run verification (`pnpm lint`; include `pnpm build` if applicable).
6. Report changed files and manual QA checklist.

---

## 2) Fix bug

Fix a bug in this repository with a root-cause-first approach.

Inputs:

- Bug summary: `<what is broken?>`
- Reproduction steps: `<how to reproduce?>`
- Expected behavior: `<what should happen?>`

Requirements:

1. Identify root cause in code (not just symptom patch).
2. Implement minimal safe fix aligned with current patterns.
3. Add/update guards or checks when appropriate.
4. Run verification (`pnpm lint`; include `pnpm build` if runtime-sensitive).
5. Summarize root cause, fix, and regression risks.

---

## 3) Blog batch

Create or update blog posts for this repository.

Inputs:

- Topic: `<main topic>`
- Quantity: `<number of posts>`
- Target keyword: `<primary SEO keyword>`
- Audience: `<who is this for?>`

Requirements:

1. Follow blog frontmatter conventions (`slug`, `title`, `tags`, `date`).
2. Use `YYYY-MM-DD-slug.md` naming.
3. Keep markdown compatible with existing rendering pipeline.
4. Avoid duplicate slugs or near-duplicate titles.
5. Provide concise list of created/updated files.

---

## 4) New product page (draft-first automation)

Tự động triển khai trang sản phẩm mới cho INUT Design theo workflow draft-first.

Inputs:

- Tên sản phẩm: `<ví dụ: Móc khoá mica in theo yêu cầu>`
- Từ khoá SEO chính: `<ví dụ: móc khoá mica Đà Nẵng>`
- Đối tượng khách hàng: `<ví dụ: chủ shop online, doanh nghiệp SME, cá nhân trẻ>`
- Route path (optional): `<ví dụ: san-pham-luu-niem/moc-khoa-mica>`
- Hero image (optional): `<ví dụ: /branding/logo.webp>`

Yêu cầu bắt buộc:

1. Bắt đầu bằng bản draft brief ngắn gọn (positioning, value, technical points, CTA).
2. Tái sử dụng chuẩn content writer để tạo `content.md` hoàn chỉnh.
3. Tạo/cập nhật route mới với `index.tsx` + `content.md`.
4. Khi implement `index.tsx`, tham chiếu approach từ `pages/sticker/sticker-sheet/index.tsx` và dùng nội dung `content.md` làm context chính.
5. Bắt buộc implement theo React component syntax (section + constants/arrays), không dùng markdown-to-HTML rendering (`dangerouslySetInnerHTML`, `getVFile` + HTML injection, hoặc wrapper chỉ để render markdown body).
6. Tham chiếu component layout cùng style page sticker, bao gồm phần showcase hình ảnh sản phẩm.
7. Chạy kiểm tra phù hợp phạm vi và trả về checklist review cuối.

---

## 5) Product page draft only

Tạo bản draft brief cho trang sản phẩm mới (chưa implement code).

Inputs:

- Tên sản phẩm: `<tên sản phẩm>`
- Từ khoá SEO chính: `<từ khoá chính>`
- Đối tượng khách hàng: `<nhóm khách mục tiêu>`

Yêu cầu:

1. Trả về draft có: positioning, pain points, value propositions, technical points, CTA.
2. Đề xuất route slug phù hợp chuẩn URL.
3. Đề xuất cấu trúc section cho `content.md` ở bước triển khai chính.
4. Giữ văn phong đúng brand INUT: chuyên nghiệp, hiện đại, gần gũi.

---

## 6) Checkout regression check

Audit checkout and lighters-related changes for regression risk.

Inputs:

- Change summary: `<what changed?>`
- Affected files: `<list key files touched>`

Requirements:

1. Identify behavior changes in cart persistence, pricing, and order payload.
2. Verify Sanity order payload contract (including `_key` in array items).
3. Check analytics impact on checkout events.
4. Propose concise manual QA checklist.
5. Report risk level with mitigation notes.

---

## 7) Write Vietnamese product content

Hãy viết nội dung sản phẩm cho INUT Design theo workflow content writer.

Inputs:

- Tên sản phẩm: `<tên sản phẩm cần viết>`
- Từ khoá SEO chính: `<từ khoá SEO chính>`
- Đối tượng khách hàng: `<ví dụ: chủ shop online, doanh nghiệp SME, cá nhân tại Đà Nẵng>`

Yêu cầu:

1. Bắt buộc tuân thủ cấu trúc chuẩn content writer skill.
2. Viết bằng tiếng Việt, đúng thuật ngữ ngành in, giọng chuyên nghiệp và thuyết phục.
3. Tối ưu SEO tự nhiên theo từ khoá chính.
4. Chèn CTA rõ ràng hướng về INUT Design.
5. Nếu thiếu dữ liệu chi tiết, áp dụng giá trị mặc định và ghi chú phần cần bổ sung.
