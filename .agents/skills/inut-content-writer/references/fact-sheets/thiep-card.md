# Fact Sheet - Thiệp & card

**Trạng thái:** Bản nháp, chưa được marketing duyệt. **Người duyệt/ngày duyệt:** chưa có. **Nguồn khảo sát:** mã nguồn trong repo, không phải xác nhận nghiệp vụ. Không trích bảng "chờ đối soát" làm claim quảng cáo.

## Phạm vi và URL để kiểm tra

| Sản phẩm cụ thể | Route tham chiếu | Nguồn trong repo |
| --- | --- | --- |
| Thank card, gift card | `/services/an-pham-luu-niem/thank-card-gift-card` | `data/product-pages/san-pham-luu-niem.tsx` - `THANK_CARD_DATA`; `pages/services/an-pham-luu-niem/thank-card-gift-card/content.md` |
| Postcard/bưu thiếp | `/services/an-pham-luu-niem/in-postcard` | `data/product-pages/san-pham-luu-niem.tsx` - `IN_POSTCARD_DATA`; `pages/services/an-pham-luu-niem/in-postcard/content.md` |
| Card visit/danh thiếp | `/services/an-pham-tiep-thi/in-card-visit` | `data/product-pages/an-pham-tiep-thi.tsx` - `IN_CARD_VISIT_DATA`; `pages/services/an-pham-tiep-thi/in-card-visit/content.md` |

Các route có trang trong `pages/services/`; kiểm tra lại URL/redirect khi đăng. "Card" chung có thể là **gift card** hoặc **card visit**: chọn đúng sản phẩm/URL trước khi dùng Fact Sheet. "Thiệp mời" chưa có URL sản phẩm riêng được xác nhận trong nhóm này; không gán mặc định vào thank card hay postcard.

## Claim được marketing duyệt

Chưa có. Marketing bổ sung **từng claim kèm đúng loại thẻ, nguồn xác nhận, điều kiện, người duyệt và ngày duyệt**.

| Loại thiệp/card | Claim được phép công bố | Nguồn/điều kiện/người duyệt/ngày duyệt |
| --- | --- | --- |
| Chưa có | Chưa có | Chưa có |

## Chờ đối soát - không dùng làm copy

| Sản phẩm | Điều trang hiện tại mô tả; marketing cần kiểm tra |
| --- | --- |
| Thank card/gift card | Thẻ cảm ơn kèm đơn hàng và thẻ quà tặng là hai mục đích khác nhau; xác nhận giấy, kích thước, in hai mặt, gia công từng loại. Trang nêu thời gian **2–3 ngày** và **3–4 ngày làm việc** ở các phần khác nhau. |
| Postcard | Trang nêu các lựa chọn giấy mỹ thuật/Couche/Kraft và các kích thước; xác nhận quy cách thực nhận, yêu cầu file, giá và thời gian. |
| Card visit | Trang nêu giấy/nhựa và gia công cán/ép kim; xác nhận loại thực làm, quy cách đặt hàng, công nghệ in, thời gian và giá. |

**Thông tin biến động cần xác nhận riêng:** giá theo số lượng và đơn vị tính, MOQ, thời gian, loại giấy/định lượng, kích thước, bleed, gia công, hỗ trợ thiết kế. Không coi giá trong `productStructuredData`, số liệu bán hàng hoặc các câu "giá cạnh tranh", "lấy ngay" trong trang là dữ kiện đã duyệt.

**Liên kết/liên hệ/ảnh:** Marketing xác nhận URL đích, kênh liên hệ và ảnh có quyền sử dụng cho **từng loại**; không dùng chung ảnh hoặc CTA của một loại card cho loại khác khi chưa kiểm tra.
