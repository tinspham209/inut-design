---
description: "Draft-first automation for a new INUT product page: collect Q/A, generate SEO content, scaffold route, and implement page"
agent: inut-product-page-automation
---

Tự động triển khai trang sản phẩm mới cho INUT Design theo workflow draft-first.

Inputs:

- Tên sản phẩm: ${input:product_name:Ví dụ: Móc khoá mica in theo yêu cầu}
- Từ khoá SEO chính: ${input:primary_keyword:Ví dụ: móc khoá mica Đà Nẵng}
- Đối tượng khách hàng: ${input:target_audience:Ví dụ: chủ shop online, doanh nghiệp SME, cá nhân trẻ}
- Route path (optional): ${input:route_path:Ví dụ: san-pham-luu-niem/moc-khoa-mica}
- Hero image (optional): ${input:hero_image:Ví dụ: /branding/logo.webp}

Yêu cầu bắt buộc:

1. Bắt đầu bằng bản draft brief ngắn gọn (positioning, value, technical points, CTA).
2. Tái sử dụng chuẩn content writer từ `inut-content-writer` để tạo `content.md` hoàn chỉnh.
3. Tạo/cập nhật route mới với `index.tsx` + `content.md`.
4. Khi implement `index.tsx`, tham chiếu approach từ `pages/sticker/sticker-sheet/index.tsx` và dùng nội dung `content.md` làm context chính.
5. Bắt buộc implement theo React component syntax (section + constants/arrays), không dùng markdown-to-HTML rendering (`dangerouslySetInnerHTML`, `getVFile` + HTML injection, hoặc wrapper chỉ để render markdown body).
6. refer the components in route /sticker/sticker-sheet, implement the layout same as the sticker page, with the UI and the image showcase of product also
7. Chạy kiểm tra phù hợp phạm vi và trả về checklist review cuối để tôi duyệt nội dung.
