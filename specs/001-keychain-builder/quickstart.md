# Quickstart and Validation: Keychain Builder

Hướng dẫn cho **sau khi triển khai**, không phải kết quả kiểm thử hiện tại. Chỉ dùng ảnh tổng hợp không chứa dữ liệu cá nhân và Sanity dataset thử nghiệm được phép; asset Sanity có URL công khai. Không tạo đơn hàng thật.

## Chuẩn bị

1. Dùng Node theo `package.json`, pnpm 10.32.1 và các biến Sanity server hiện có; không đưa `SANITY_TOKEN` hoặc credential vào browser/log. Chuẩn bị dataset test riêng và quyền xóa document test.
2. Kiểm tra cấu hình bảo vệ dữ liệu, license IMG.LY, CDN và quyền tạo/xóa document với người phụ trách. Chính sách đã được người dùng duyệt; không đưa ảnh khách thật vào demo trước khi hoàn tất các kiểm tra còn lại trong [plan](./plan.md).
3. Chạy năm suite tách biệt bằng `rtk proxy node --test --import ./scripts/register-typescript-loader.mjs ./scripts/tests/keychain-*.test.mjs`, sau đó chạy `rtk pnpm lint` và `rtk pnpm build`. Các suite gồm `image-validation`, `geometry`, `render`, `api` và `privacy`; historical convergence 2026-11-20 là 30/30 pass. Sau cập nhật Phase 10/11, renderer + API focused suites chạy ngày 2026-11-21 là 19/19; lint/build cũng pass. Dùng `rtk pnpm dev` và `agent-browser-automation` cho browser; dùng thiết bị thật/agent-device cho Android và iOS theo các tiêu chí dưới đây.

## Scenarios

1. **Geometry:** Kiểm tra 18 SVG × tám size, lỗ 4 mm và cạnh dài gồm tai; cả hai hướng của frame bất đối xứng. Kiểm tra die-cut với ảnh transparent, nền đen/trắng, mảng gần nhau/còn rời và alpha rỗng; công việc cũ hoàn tất sau công việc mới. Export chỉ dùng geometry mới nhất.
2. **Màu và mặt sau:** Dùng ảnh có chữ/mũi tên, thử bốn mode clear và bảy màu opaque trên 2D/3D/PNG. Chuyển clear → opaque, xác nhận và hủy popup; kiểm tra reset đúng, giữ ảnh sau; quay lại clear chọn custom và khôi phục. Link đã Export phải khôi phục cả ảnh sau được giữ.
3. **Ảnh và link:** Upload ảnh trước/sau, thay và xóa, remove-bg thành công/lỗi và đổi ảnh trong lúc xử lý. Kiểm tra ảnh từ Sanity dùng được trong Canvas/3D và Export không bị lỗi CORS/tainted canvas, kể cả fallback định dạng ảnh trên iOS Safari. Trước Export không có link; sau Export mở link trên trình duyệt mới không đăng nhập. Đóng/mở builder không có link không tự khôi phục. Export thay đổi tạo link mới; link cũ vẫn cho phiên bản cũ.
4. **Lỗi và retry:** Giả lập upload/lưu lỗi, response mất và retry cùng request ID; không mất state, không báo link thành công sai và không tạo snapshot kép. ID trùng payload khác bị từ chối. Xóa document thử nghiệm và xác nhận link không mở; không kết luận CDN ảnh bị thu hồi.
5. **Export:** Mỗi mặt × full/charm × 1x/2x/3x, nền ngoài trong suốt và ring chỉ có ở full. Kiểm tra baseline 100 px/cm, lỗ theo tỉ lệ geometry, overflow/thiết bị không đủ tài nguyên báo lỗi thay vì giảm scale; PNG là showcase.
6. **Mobile và accessibility:** Thực thi `scripts/test-keychain-browser.mjs` ở 320/360/390/430 px và đối chiếu hierarchy với `inputs/mockup-preview.png`: desktop preview trái/control phải; mobile preview trước/control sau; năm nhóm giữ đúng thứ tự; Export nổi bật nhưng không che nội dung. Kiểm tra bàn phím, safe area, xoay ngang, mục tiêu chạm 44 px, chữ input 16 px và cuộn ngoài vùng chỉnh. Trên một Android Chrome và một iPhone/iOS Safari được ghi rõ model/browser, kiểm tra CORS/tainted canvas, fallback định dạng ảnh và đo FPS drag/pinch ảnh ≤2048 px cho cả frame và die-cut; mục tiêu ≥30 FPS. Ghi bằng chứng và lệnh chạy trong `docs/keychain-builder-evidence/`; test không hỗ trợ/mất WebGL về 2D giữ state.
7. **Analytics:** Dùng `scripts/tests/keychain-privacy.test.mjs` và browser network capture để kiểm tra GA4/GTM, Umami, Vercel cho initial load và SPA: đúng một event mỗi hành động/hệ thống; không gửi ảnh, URL, link, ID thiết kế hoặc query/referrer nhạy cảm. Kiểm tra cả analytics tắt. Không yêu cầu ảnh/link thực.
8. **Hồi quy lighter:** Kiểm tra upload, add-to-cart, cart và payload order bằng fixture/giả lập; bảo toàn `inut-lighters-cart`, pricing và `_key` duy nhất. `scripts/test-lighter-builder.sh` hiện có các bước mô phỏng/check mô tả, không tự chứng minh upload/checkout; cần browser/assertion thật cho các luồng bị ảnh hưởng.
9. **Implementation delta:** T095–T102 có browser/local evidence hiện hành;
   quote CTA trước Export đã được gỡ do chưa có amendment được duyệt. T086/T087
   còn chờ thiết bị Android/iOS; T091 chờ xác nhận owner/legal. Frame/artwork
   3D vẫn bị split/offset ở góc nghiêng, được hoãn thành next enhancement T104.
   T105–T108 đã implement và được kiểm tra trên desktop 2026-11-21: 3D map hai
   mặt, các back mode cập nhật mặt vật lý, selector chỉ còn trong 2D và custom
   back dùng toolbar trái. Upload được mock; không chứng minh Sanity lifecycle.
   T104 vẫn deferred, không được coi frame alignment đã đạt.

## Trước public

- Chính sách asset công khai, không thông báo/consent, lưu vô hạn, không nhận yêu cầu xóa và INUT xóa thủ công đã được người dùng duyệt; xác minh nghĩa vụ bảo vệ dữ liệu áp dụng và khả năng vận hành trước public.
- Owner phụ trách MUST xác minh package, model, môi trường deploy và phạm vi sản phẩm/thương mại của license IMG.LY; ghi nhận package version và quyết định tại `docs/keychain-builder-release.md`.
- Ghi nhận kết quả năm suite, browser, Android/iPhone, đo FPS và chất lượng 10 PNG móc khi xuất 3x.

## Sau demo MVP

- Team sản xuất xác nhận frame, tai/lỗ, vùng in, màu và ring/size để cập nhật. Không coi PNG là file in/cắt.
