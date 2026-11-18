# Implementation Plan: Keychain Builder

**Branch**: `main` | **Date**: 2026-11-18 | **Spec**: [spec.md](./spec.md)

**Input**: `specs/001-keychain-builder/spec.md`

## Summary

Xây builder mobile-first cho acrylic trong và bảy màu đục, khung cố định và die-cut, ảnh hai mặt, preview 2D/3D và PNG. Ảnh được upload lên Sanity khi chọn; mỗi lần Export lưu một snapshot bất biến và trả link mở lại. Không đăng nhập, không lưu thiết kế bền vững ở trình duyệt, không làm cart/checkout. Các quyết định, bao gồm lựa chọn asset Sanity có URL công khai, được ghi trong [research.md](./research.md).

**Release gate:** Người dùng đã duyệt không thông báo/xin đồng ý, lưu vô hạn, không nhận yêu cầu xóa, quyền truy cập ảnh công khai, quy trình xóa thủ công và quyền dùng ảnh được cung cấp. Trước khi public với ảnh thật vẫn cần xác minh nghĩa vụ bảo vệ dữ liệu áp dụng; phê duyệt này không tự chứng minh tuân thủ pháp luật. Demo dùng ảnh tổng hợp và dataset thử nghiệm riêng.

## Technical Context

**Language/Version**: TypeScript `strict: false`; Node theo `package.json` (`>=20 <26`), pnpm 10.32.1; Sanity Studio v2 schemas bằng JavaScript.

**Primary Dependencies**: Next.js 12 pages router, React 18, MUI 5, Three.js/R3F/Drei có sẵn; dùng Canvas 2D và Web Worker. Contour/union dùng alpha-mask + worker sẵn có, không thêm dependency. Pin `@imgly/background-removal@1.7.0` và peer `onnxruntime-web@1.21.0`; package AGPL-3.0, upstream chỉ ghi supported Next.js 15, nên giữ feature off mặc định và chờ owner xác nhận package/model/deployment trước khi bật public. Không thêm state library.

**Storage**: Sanity image assets thông thường và `keychainDesign` snapshot; URL asset công khai với bất kỳ ai có URL. Trạng thái chỉnh chỉ ở bộ nhớ phiên; không dùng `localStorage`, `sessionStorage`, IndexedDB hoặc cookie để khôi phục thiết kế.

**Testing**: Tách suite Node cho geometry/config, render/CORS, API/lifecycle và analytics/privacy trong `scripts/tests/`; thực thi browser ở bốn viewport và trên Android Chrome/iOS Safari, đồng thời đo hiệu năng frame/die-cut trên thiết bị được ghi rõ. `rtk pnpm lint`, `rtk pnpm build` sau khi thực hiện thay đổi runtime; xác minh luồng lighter thực tế không bị ảnh hưởng.

**Target Platform**: Android Chrome và iOS Safari, ưu tiên viewport 320–430 CSS px; desktop hỗ trợ hai cột.

**Project Type**: Website Next.js có API routes và Sanity Studio.

**Performance Goals**: Mục tiêu ≥30 FPS khi kéo/pinch ảnh ≤2048 px với frame và die-cut trên một Android tầm trung và một iPhone được ghi rõ; chưa có số đo baseline.

**Constraints**: Lỗ thiết kế cố định 4 mm; 2D mặc định; không đưa thông tin cá nhân/link/ảnh vào analytics; 3D và xóa nền tải theo yêu cầu; output PNG không là file sản xuất. Ảnh móc gốc dài 536–946 px, cần kiểm tra độ nét xuất 3x, không hứa đủ nét.

**Scale/Scope**: 18 SVG nháp, 10 PNG móc, tám màu, tám size, bốn mode mặt sau cho acrylic trong và một mode acrylic đục. Không có dự báo tải hoặc cam kết throughput; giới hạn và giám sát upload để tránh lạm dụng.

## Constitution Check

**Trước và sau thiết kế:** `.specify/memory/constitution.md` vẫn là template chưa điền, nên không có nguyên tắc dự án được phê duyệt để đánh giá; không tuyên bố constitution gate đã pass. Các ràng buộc hiện hành trong repository vẫn áp dụng: token Sanity chỉ ở server; dùng `api-client/*`, `@/`, pnpm; dual GA4 + Umami không duplicate; không đổi `inut-lighters-cart`, pricing, order payload hay `_key` của lighter.

Không có vi phạm constitution được xác định vì chưa có constitution thực tế. Owner cần thiết lập/duyệt constitution nếu muốn áp dụng gate chính thức; không tự tạo nguyên tắc giả. AGPL-3.0 của IMG.LY đã được xác minh từ upstream, nhưng phạm vi giấy phép cho package, model và môi trường triển khai của INUT vẫn chờ owner xác nhận theo T091.

## Project Structure

### Documentation (this feature)

```text
specs/001-keychain-builder/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/keychain-builder.md
├── quickstart.md
├── checklists/requirements.md
└── inputs/{idea.md,frames/,ring/}
```

`tasks.md` thuộc bước `/speckit.tasks`, không tạo trong plan.

### Source Code (repository root)

```text
pages/builder/keychain/index.tsx
pages/api/keychain/designs/index.ts
pages/api/keychain/designs/[id].ts
pages/api/keychain/uploads.ts
components/keychain-builder/
  KeychainBuilder.tsx
  preview/                  # 2D và 3D lazy
  geometry/                 # SVG, die-cut worker, mm và lỗ
  image/                    # load Sanity ảnh và remove background theo yêu cầu
  render/                   # render 2D, texture, PNG
  hooks/                    # trạng thái phiên, upload, export
data/keychain/              # danh mục, màu, metadata móc
public/keychain/{frames,rings}/
api-client/keychain.ts
sanity/schemas/keychainDesign.js
sanity/schemas/schema.js
utils/analytics.ts
utils/umamiAnalytics.ts
docs/ANALYTICS_GUIDE.md
docs/keychain-builder-release.md
docs/keychain-builder-evidence/
scripts/tests/keychain-{geometry,render,api,privacy}.test.mjs
scripts/test-keychain-browser.mjs
```

**Structure Decision**: Theo pages router và phân lớp hiện có; file nêu trên là hướng triển khai, không tạo thư mục trống hay module không cần thiết. Dùng `MainLayout` và SEO như `pages/builder/lighters/index.tsx`. Tách route upload keychain để kiểm tra raster và giới hạn mà không đổi hợp đồng upload/checkout lighter. Không đưa asset nháp thành file cắt production.

## Visual Reference

`specs/001-keychain-builder/inputs/mockup-preview.png` được dùng làm visual
reference binding cho hierarchy, không phải source pixel-perfect hoặc design
system mới. Desktop có preview ở cột trái và năm control groups trong panel cột
phải; mobile xếp preview trước controls và giữ Export dễ tiếp cận. Màu cam,
nền than/đen, panel nổi và typography gọn được triển khai bằng MUI 5/theme hiện
có, không thêm framework UI mới. Khi mockup và spec xung đột, spec và contracts
về geometry, accessibility, dữ liệu và privacy vẫn là nguồn ưu tiên.

## Design and Delivery

1. **Catalog và geometry:** Sao chép 18 SVG và 10 PNG được cung cấp cho demo, tạo ID ổn định và metadata anchor hiển thị. Dùng tọa độ mm, dựng lại lỗ bán kính 2 mm sau khi scale outline; ring thật/anchor và thông số xưởng vẫn cần team xác nhận sau demo.
2. **State và UI:** Reducer theo phiên, acrylic mặc định trong suốt; dropdown tám màu; popup xác nhận chuyển sang đục chỉ reset số mặt/mode, giữ ảnh và transform hai mặt. Desktop giữ tỷ lệ preview/control như mockup; control panel bám thứ tự hình dáng & móc → ảnh → mặt sau → acrylic → Export. Các trạng thái hợp lệ được kiểm tra ở cả UI và server.
3. **Render chung:** Một geometry/transform là nguồn cho preview 2D, 3D và PNG. Hệ tọa độ mặt sau phải phản chiếu outline và ảnh đúng một lần; opaque back không in; PNG nền ngoài charm trong suốt. Ảnh sau riêng crop vào vùng trước và không quyết định die-cut.
4. **3D và die-cut:** Tải R3F khi mở 3D; PNG móc là plane gắn vào charm, không phải model 3D thật. Die-cut dựa trên alpha mặt trước, xử lý trong worker, bỏ kết quả cũ và chặn Export cho tới geometry mới nhất. Nếu WebGL/worker/remove-bg thất bại, thông báo và giữ thiết kế.
5. **Upload và snapshot:** Upload ảnh khi chọn, chặn input không hợp lệ; không tạo link trước Export. Export chờ ảnh và geometry mới nhất, render PNG, lưu snapshot mới và chỉ báo thành công/link sau khi lưu thành công. Retry không ghi đè snapshot khác; mở link chỉ đọc snapshot cũ và chỉnh trong phiên mới.
6. **Analytics và bảo vệ dữ liệu:** Route API dùng giới hạn và validate server; không log ảnh, URL asset hay link thiết kế. Khử query/ảnh khỏi GA4/GTM, Umami, Vercel Analytics và referrer trước khi script ngoài có thể gửi dữ liệu; không duplicate page view. Asset CDN vẫn công khai theo quyết định đã chốt.
7. **QA:** Kiểm tra hình học, hướng hai mặt, palette, popup, ảnh được giữ, upload/lưu/lỗi, snapshot bất biến, 6 biến thể Export, link và xóa thủ công, analytics; browser thực tế trên mobile và hồi quy lighter. Không thực hiện checkout/order thật.

## Complexity Tracking

Không có exception constitution được xác định. Die-cut worker, render 3D và snapshot immutable là phạm vi MVP chứ không phải phần mở rộng tùy chọn. Tài liệu nghiên cứu ghi rõ giới hạn asset công khai và các gate trước public.
