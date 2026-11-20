# Research: Keychain Builder

**Nguồn ưu tiên:** [spec](./spec.md) và các clarification mới nhất; [idea](./inputs/idea.md) chỉ là hướng tham khảo khi không mâu thuẫn. Các quyết định sau không phải bằng chứng rằng tính năng đã triển khai.

## 1. Ảnh Sanity và quyền truy cập

**Decision:** Theo lựa chọn mới nhất của người dùng, dùng image asset Sanity thông thường như luồng lighter. Upload ngay khi chọn ảnh; giữ asset reference trong state phiên; lưu cấu hình lúc Export. Bất kỳ ai có URL ảnh đều xem được, kể cả không có link thiết kế. Không hứa URL ảnh là riêng tư.

**Rationale:** `pages/checkout/lighters.tsx` dùng `uploadImageToSanity`, tạo URL bằng `sanityImageUrl`; `pages/api/sanity/upload-image.ts` gọi `serverClient.assets.upload("image", ...)`. Tài liệu Sanity nói dataset assets luôn public trên CDN, kể cả dataset private. Public dataset cũng có thể cho phép đọc/query document; không coi ID khó đoán là authorization hoặc khẳng định config chỉ ai có link xem được.

**Alternatives considered:** Media Library private + signed URL có thể đáp ứng quyền riêng tư nhưng phụ thuộc khả năng/gói Enterprise; ảnh mã hóa có thêm lớp giải mã và preview Studio; kho private khác không giữ ảnh trong Sanity. Người dùng chọn cách asset thông thường sau khi được giải thích đánh đổi.

**Release gate:** Người dùng đã duyệt không thông báo/consent, lưu vô thời hạn, không có quy trình khách yêu cầu xóa, URL asset công khai và việc INUT xóa thủ công. Trước khi public với ảnh thật vẫn cần xác minh nghĩa vụ bảo vệ dữ liệu áp dụng; phê duyệt không tự chứng minh tuân thủ. Sanity CDN cache có thể tồn tại sau khi xóa asset; xóa design phải làm link **thiết kế** không khả dụng, không hứa thu hồi bản ảnh đã được cache/tải xuống. Đội vận hành phải hiểu giới hạn này.

**Sources:** [Dataset assets always public](https://www.sanity.io/docs/content-lake/assets); [Media Library asset visibility](https://www.sanity.io/docs/media-library/asset-visibility); [Asset CDN and caching](https://www.sanity.io/docs/apis-and-sdks/asset-cdn).

## 2. Phiên chỉnh và snapshot Export

**Decision:** State phiên ở React reducer; upload asset ngay, không tự lưu cấu hình mỗi 15 giây và không khôi phục nếu đóng trang mà chưa giữ link. Khi Export, tạo `keychainDesign` mới bất biến và link `?design=<id>`; mỗi lần Export mới tạo snapshot mới, không patch snapshot cũ.

**Rationale:** Khớp clarification sau idea. Cách lighter dùng `localStorage` cho cart **không** được sao chép vì spec keychain cấm lưu bền vững. Client đợi upload và geometry mới nhất; request id cố định cho retry của cùng hành động, server kiểm tra payload trùng trước khi trả lại kết quả. Dùng API đọc trực tiếp không qua CDN và `no-store` để link không phục hồi document đã xóa.

**Alternatives considered:** Auto-save 15 giây, draft trong `localStorage`, update cùng document và hỗ trợ tài khoản đều không phù hợp spec hiện hành.

## 3. Hình học và ảnh hai mặt

**Decision:** Một geometry mm dùng chung 2D, texture 3D và export. Lấy `#cut`, `#print`, `#hole` từ 18 SVG nháp; scale cạnh dài theo size 30–100 mm rồi dựng lại lỗ `r=2 mm`. Die-cut theo alpha mặt trước sau transform; khoảng đệm mở rộng mask và nối các mảng ở gần nhau trước khi union tai/lỗ; reject alpha rỗng, mảng còn rời hoặc contour không hợp lệ thay vì giả định sản xuất được. Chạy worker và bỏ result phiên bản cũ.

**Rationale:** Tránh lỗ bị scale sai và outline/crop giữa các renderer lệch nhau. Hai mode in từ ảnh trước phản chiếu đúng một lần khi nhìn từ sau; custom giữ chiều chỉnh mặt sau và chỉ bị clip theo silhouette trước. Mặt sau opaque là màu acrylic không in. Frame/viền/lỗ là concept, team chỉ xác nhận sau demo.

**Alternatives considered:** Scale nguyên SVG kể cả lỗ làm sai 4 mm; geometry riêng cho mỗi renderer dễ lệch; xác nhận gia công trước MVP trái yêu cầu demo.

**Dependencies:** Dùng các mẫu trong `inputs/frames/`, PNG trong `inputs/ring/`; anchor và kích thước vật lý thực của từng móc chưa được team cung cấp. Metadata demo phải được đánh dấu ước lượng. Phương án `d3-contour`, `simplify-js`, `polygon-clipping` trong idea là đề xuất; chọn và pin phiên bản sau khi kiểm tra license, TypeScript/Next 12, output contour và bundle. Không thêm thư viện nếu cách đơn giản hơn đáp ứng được cùng bộ test.

## 4. 3D, xóa nền và ngân sách mobile

**Decision:** 2D mặc định; lazy-load Three/R3F khi mở 3D và dùng ring PNG trên plane gắn với charm. Xóa nền tải `@imgly/background-removal@1.7.0` theo yêu cầu, xử lý ảnh trong trình duyệt bằng model `isnet_quint8` và giữ asset gốc. Dependency là AGPL-3.0; upstream hiện chỉ ghi nhận Next.js 15, còn repo dùng Next.js 12. Tính năng mặc định tắt cho tới khi owner xác nhận package/model/triển khai theo T091. Xem [đánh giá dependency](../../docs/keychain-builder-release.md#local-background-removal-dependency-assessment-2026-11-18).

**Rationale:** Three/R3F đã có trong `package.json`. Giới hạn 2D preview DPR, demand rendering, worker và giải phóng tài nguyên giúp mobile; 30 FPS chỉ là mục tiêu phải đo. Việc chạy trên Next 12 phải được xác nhận bằng build/runtime vì vendor chỉ ghi hỗ trợ Next 15. Nếu thiết bị không xử lý được, báo lỗi và giữ config thay vì hứa mọi máy đều chạy.

**Implementation note (2026-11-20):** module 3D lazy, toolbar và WebGL fallback
đã được bật/kiểm tra. Geometry đang tách cap trước/sau để tránh một opaque
duplicate cap che mặt đang xem. Tuy vậy, desktop review vẫn thấy frame/artwork
bị split/offset ở góc nghiêng; T104 ghi nhận enhancement này còn pending, không
thay đổi quyết định trên. Ngoài model IMG.LY bị gate, die-cut còn có
local solid black/white background-removal path để phục hồi alpha trước khi
trace contour. Path local này không thay đổi license gate của IMG.LY.

**Alternatives considered:** Tải 3D/model ngay hoặc gọi dịch vụ xử lý ảnh bên ngoài tăng chi phí/tải và đưa dữ liệu cá nhân ra bên thứ ba. Upstream xác nhận AGPL-3.0; owner chưa xác nhận quyền dùng package, model và phương án triển khai của INUT.

## 5. Độ phân giải Export và tính nhất quán

**Decision:** Quy ước kỹ thuật cho PNG showcase: 1x = 100 px mỗi cm cạnh charm theo size đã chọn; 2x/3x nhân số pixel, không nhân kích thước vật lý hay đường kính lỗ trong geometry. Full keychain nới canvas để chứa ring; charm-only không chứa ring. Render lại độc lập viewport/DPR; dùng `toBlob`, chặn nếu vượt mức an toàn thiết bị và đề nghị scale thấp hơn, không tự giảm scale.

**Rationale:** Spec yêu cầu ba mức nhưng chưa quy định baseline pixel; chọn baseline cố định để kiểm thử và không phụ thuộc điện thoại. Đây không phải DPI hoặc quy cách file in. Test các kích thước, back mode và hình bất đối xứng, gồm chất lượng 10 PNG nguồn.

**Alternatives considered:** Chụp preview canvas làm kết quả phụ thuộc viewport/DPR; coi PNG là file in đi ngược non-goal.

## 6. Analytics, URL và bảo vệ hệ thống hiện hữu

**Decision:** Track một lần ở nguồn hành động cho GA4 và Umami; không gửi hình, URL ảnh, link hoặc identifier thiết kế. Route keychain cần khử query trong page view, referrer và mọi luồng analytics trước khi script bên thứ ba gửi; thêm kiểm thử ở initial load và điều hướng SPA.

**Rationale:** `utils/analytics.ts` hiện lấy `window.location.href`; `_app.tsx`, `_document.tsx` và `GoogleTagSchema` có nhiều nguồn page view/third-party. User chấp nhận URL ảnh công khai nhưng không yêu cầu phát tán link thiết kế cho analytics. `utils/rateLimit.ts` là cache theo process, không phải rate limit phân tán; dùng cho MVP như lớp bảo vệ cơ bản và nêu rõ không bảo đảm quota toàn hệ thống.

**Alternatives considered:** Track thêm page view trong component gây duplicate; chỉ lọc event thủ công không ngăn auto pageview và referrer rò query.

## Open release checks

- Xác minh nghĩa vụ bảo vệ dữ liệu áp dụng trước public; chính sách đã được người dùng duyệt nhưng chưa chứng minh tuân thủ.
- Team sản xuất duyệt 18 frame, lỗ/tai, safe area, màu và tổ hợp size/móc **sau demo**; không coi output là production.
- Owner xác minh license IMG.LY, model, quyền tái phân phối và môi trường deploy trước public; xác nhận anchor/kích thước thực và độ nét 10 ảnh móc.
- Constitution đã được ratified tại v1.0.0. Convergence 2026-11-20 phát hiện
  verification baseline chưa sạch (T095) và các implementation gaps
  T096–T102; không được claim constitution gate đã pass cho delivery.
- CTA báo giá trước Export và liên kết snapshot đã bị gỡ theo T100; không có
  amendment nào được thêm vào spec/plan gốc.
- T104 giữ frame/artwork 3D bị split/offset ở góc nghiêng làm next enhancement;
  evidence desktop hiện tại không được coi là visual acceptance.
