# Contracts: Keychain Builder

Các endpoint dưới đây là contract của implementation hiện tại, đồng bộ theo
[source code](../../components/keychain-builder/KeychainBuilder.tsx) ngày
2026-11-20. [spec](../spec.md) vẫn là nguồn intent ưu tiên
khi contract/code drift. Tất cả hoạt động test dùng ảnh tổng hợp; không có
authentication người dùng. URL asset Sanity là công khai với ai có URL.

## `POST /api/keychain/uploads`

- Input: ảnh PNG/JPEG/WebP; tối đa 10 MB trước xử lý, resize tối đa 2048 px ở client; server kiểm tra body size, định dạng/dữ liệu thực và giới hạn kích thước trước khi ghi.
- Output `200`: object `{ image: { _type, asset }, url }`; `url` là URL CDN Sanity
  sử dụng được ngay cho preview anonymous-CORS và Export. URL này **không riêng tư**.
- Các lỗi `400`/`413`/`415`/`429`/`500`: payload sai, quá lớn, loại không hỗ trợ, bị giới hạn hoặc upload thất bại. Không trả link thiết kế, không log bytes, URL hoặc dữ liệu cá nhân.
- Upload thành công không đồng nghĩa đã Export; client giữ reference trong bộ nhớ phiên và chờ upload hoàn tất trước Export. Xóa nền tạo asset mới và giữ asset gốc cho thao tác bật/tắt. Integration test MUST tải trực tiếp `url` mà không cookie/auth và dùng được trong Canvas/3D/PNG; lỗi CORS/tainted canvas phải bị báo rõ.
- Tái sử dụng `prepareSanityImageUpload` và server upload helper khi phù hợp, không thay đổi hợp đồng `POST /api/sanity/upload-image` của lighter. Giới hạn theo `utils/rateLimit.ts` là theo process, không phải bảo đảm phân tán.

## `POST /api/keychain/designs`

- Input: `requestId` ngẫu nhiên duy nhất cho một hành động lưu snapshot và `config` đã validate, gồm references của ảnh trước/ảnh sau kể cả ảnh riêng được giữ khi đang opaque. Không nhận hoặc lưu `configVersion` top-level.
- Output `201`: `id` và link `/builder/keychain?design=<id>` sau khi snapshot đã lưu; client tải PNG đã render theo mặt/phạm vi/scale đang chọn.
- Retry cùng `requestId` và cùng config canonical trả snapshot đã tạo, không sinh document thứ hai; cùng ID với nội dung khác trả `409`. Không lưu fingerprint/requestId thành field riêng trong snapshot mới. Không có endpoint cho khách patch snapshot cũ.
- Kiểm tra danh mục, eight sizes, `diameterMm=4`, các cặp acrylic/printSides/backMode, image refs và finite bounds. Không dùng URL tự do do client gửi làm nguồn fetch server.
- `400`/`413`/`429`/`500` cho input lỗi, quá lớn, rate limit hoặc lỗi lưu. Khi lưu lỗi, không trả link thành công; giữ state để retry. Token Sanity chỉ ở server.

## `GET /api/keychain/designs/[id]`

- Input: ID snapshot. Output `200` chứa phiên bản lấy từ `config.version`, image refs và URL CDN được dựng lại từ asset refs để renderer hiện tại mở thiết kế; không cung cấp credential, thông tin khách hoặc quyền ghi.
- `400` cho ID sai định dạng, `404` khi không tồn tại/đã xóa, `500` khi đọc lỗi. Đọc trực tiếp API Sanity không dùng CDN cache, trả `Cache-Control: no-store`; link tới document đã xóa phải hết hiệu lực.
- Bất kỳ người có link có thể mở, chỉnh trong state phiên và Export snapshot khác. Không coi ID là cơ chế bảo vệ ảnh hoặc dữ liệu; URL ảnh trực tiếp vẫn công khai và dataset public có thể cho query document.
- Dọn document/asset là thao tác thủ công của INUT trong Studio; không có endpoint xóa cho khách và không tự expire. Không xóa asset còn được snapshot khác tham chiếu; xóa doc không bảo đảm ảnh đã cache bị thu hồi. Lifecycle test MUST mô phỏng 30/90/365 ngày, xác minh doc/link vẫn đọc được, rồi xóa snapshot test và xác minh `404` trong khi asset chia sẻ vẫn được giữ cho snapshot khác.

## UI and render contract

- Visual hierarchy theo `../inputs/mockup-preview.png`: desktop preview trái và
  panel phải; mobile preview trên và controls dưới. Năm nhóm panel theo thứ tự
  shape/ring, front image, back, acrylic và PNG export. Nút Export dùng primary
  accent, còn nút preview/view/mode là secondary controls.
- Preview toolbar MUST hiện front/back, 2D/3D và Fit/Reset; touch tools riêng
  của preview không được ngăn scroll ngoài vùng canvas. Nhãn DEMO và disclaimer
  minh họa/showcase phải luôn dễ thấy.
- `clear` là mặc định; màu đục chỉ in một mặt, mặt sau là màu acrylic không in. Dropdown gồm đúng tám lựa chọn; không hex selector.
- Trong → đục hiện popup theo FR-028. Hủy giữ state; xác nhận reset sides/back mode, giữ ảnh/transform khác; quay lại trong mặc định through và có thể chọn lại ảnh sau đã giữ.
- Bốn mode acrylic trong như bảng [data model](../data-model.md); 2D/3D/PNG phải khớp mặt và outline, lỗ luôn 4 mm. Die-cut dựa ảnh trước và chỉ Export khi geometry đúng revision.
- PNG ngoài nền trong suốt; 1x = 100 px/cm chiều dài charm, 2x/3x là hệ số pixel; full bao gồm ring, charm-only không có ring. Quá giới hạn thiết bị báo lỗi, không âm thầm đổi scale.
- Link được tạo sau khi snapshot lưu thành công ở Export. Implementation hiện
  còn CTA báo giá lưu snapshot và đính kèm ID vào form; đây là implementation
  addition chưa được `spec.md`/`tasks.md` gốc phê duyệt và được giữ ở trạng thái
  pending tại T100. Không coi flow này là contract được phê duyệt. Không lưu
  thêm ảnh PNG preview vào form và không hứa ảnh chưa lưu khôi phục sau đóng
  trình duyệt.

## Current implementation gaps

- 3D module hiện có nhưng toolbar control đang disabled (T096).
- Edge/sheen đã tồn tại trong model/render nhưng chưa có đầy đủ UI control
  (T097).
- Mobile target 44 px, custom-back upload/export gate và dedicated back crop
  editor cần remediation theo T098, T099 và T101.
- Focused Node suite hiện 21/23 pass; contract không được ghi là release-verified
  cho tới khi T095 hoàn tất.

## Analytics and privacy

Các event gồm view, chọn ring/shape/acrylic/back mode, upload, remove-bg, chuyển 2D/3D, Export; ghi một lần cho mỗi hệ thống. Chỉ gửi thuộc tính không nhạy cảm (`ring_id`, `shape_type`, `acrylic_id`, `print_sides`, `mode`, `variant`, `scale`, kết quả). Không gửi ảnh, asset URL, link, design ID, thông tin khách. Sanitize page location, query, referrer và auto page views cho cả GA4/GTM, Umami và Vercel Analytics; xác minh network request trước khi public.

Người dùng đã duyệt chính sách asset công khai, không notice/consent, lưu vô hạn và xóa thủ công. Không khẳng định asset private hoặc các lựa chọn này là tuân thủ; cần xác minh nghĩa vụ bảo vệ dữ liệu áp dụng trước khi public.
