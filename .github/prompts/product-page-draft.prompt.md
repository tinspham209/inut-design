---
description: "Create only the draft brief for a new INUT product page before full content/page implementation"
agent: inut-product-page-automation
---

Tạo bản draft brief cho trang sản phẩm mới (chưa implement code).

Inputs:

- Tên sản phẩm: ${input:product_name:Tên sản phẩm}
- Từ khoá SEO chính: ${input:primary_keyword:Từ khoá chính}
- Đối tượng khách hàng: ${input:target_audience:Nhóm khách mục tiêu}

Yêu cầu:

1. Trả về bản draft có: positioning, pain points, value propositions, technical points, CTA.
2. Đề xuất route slug phù hợp chuẩn URL.
3. Đề xuất cấu trúc section để dùng cho `content.md` ở bước triển khai chính.
4. Giữ văn phong đúng brand INUT: chuyên nghiệp, hiện đại, gần gũi.
