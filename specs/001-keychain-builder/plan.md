# Implementation Plan: Keychain Builder

**Branch**: `main` | **Created**: 2026-11-18 | **Updated**: 2026-11-20 | **Spec**: [spec.md](./spec.md)

**Input**: `specs/001-keychain-builder/spec.md`

**Implementation status (2026-11-20)**: The route, state, geometry, upload,
snapshot and analytics paths are implemented. The specification remains
authoritative; current convergence gaps are tracked in `tasks.md` Phase 9.
In particular, the 3D control is presently disabled, edge/sheen are not fully
exposed in the UI, several mobile controls are below the 44 px target, both
front/back uploads are not gated consistently, and the quote flow is not an
approved addition to the original feature intent. T095–T102 track remediation;
T086, T087 and T091 remain explicit release gates.

## Summary

Xây builder mobile-first cho acrylic trong và bảy màu đục, khung cố định và die-cut, ảnh hai mặt, preview 2D/3D và PNG. Ảnh được upload lên Sanity khi chọn; mỗi lần Export lưu một snapshot bất biến và trả link mở lại. Không đăng nhập, không lưu thiết kế bền vững ở trình duyệt, không làm cart/checkout. Các quyết định, bao gồm lựa chọn asset Sanity có URL công khai, được ghi trong [research.md](./research.md).

**Release gate:** Người dùng đã duyệt không thông báo/xin đồng ý, lưu vô hạn, không nhận yêu cầu xóa, quyền truy cập ảnh công khai, quy trình xóa thủ công và quyền dùng ảnh được cung cấp. Trước khi public với ảnh thật vẫn cần xác minh nghĩa vụ bảo vệ dữ liệu áp dụng; phê duyệt này không tự chứng minh tuân thủ pháp luật. Demo dùng ảnh tổng hợp và dataset thử nghiệm riêng.

## Technical Context

**Language/Version**: TypeScript `strict: false`; Node theo `package.json` (`>=20 <26`), pnpm 10.32.1; Sanity Studio v2 schemas bằng JavaScript.

**Primary Dependencies**: Next.js 12 pages router, React 18, MUI 5, Three.js/R3F/Drei có sẵn; dùng Canvas 2D và Web Worker. Contour/union dùng alpha-mask + worker sẵn có, không thêm dependency. Pin `@imgly/background-removal@1.7.0` và peer `onnxruntime-web@1.21.0`; package AGPL-3.0, upstream chỉ ghi supported Next.js 15, nên giữ feature off mặc định và chờ owner xác nhận package/model/deployment trước khi bật public. Không thêm state library.

**Storage**: Sanity image assets thông thường và `keychainDesign` snapshot; URL asset công khai với bất kỳ ai có URL. Trạng thái chỉnh chỉ ở bộ nhớ phiên; không dùng `localStorage`, `sessionStorage`, IndexedDB hoặc cookie để khôi phục thiết kế.

**Testing**: Năm suite Node trong `scripts/tests/` phủ image normalization,
geometry/config, render/CORS, API/lifecycle và analytics/privacy. Kết quả
2026-11-20 là 21/23 pass; hai lỗi test-fixture/runtime mismatch được theo dõi
tại T095. Browser mock kiểm tra bốn viewport và các luồng 2D đã có bằng chứng
lịch sử, nhưng script hiện cần cập nhật selector/state và rerun theo T102.
Android Chrome/iOS Safari cùng đo hiệu năng vẫn thuộc T086/T087. `rtk pnpm
lint`, `rtk pnpm build` được dùng cho thay đổi runtime; lighter regression
được giữ riêng.

**Target Platform**: Android Chrome và iOS Safari, ưu tiên viewport 320–430 CSS px; desktop hỗ trợ hai cột.

**Project Type**: Website Next.js có API routes và Sanity Studio.

**Performance Goals**: Mục tiêu ≥30 FPS khi kéo/pinch ảnh ≤2048 px với frame và die-cut trên một Android tầm trung và một iPhone được ghi rõ; chưa có số đo baseline.

**Constraints**: Lỗ thiết kế cố định 4 mm; 2D mặc định; không đưa thông tin cá nhân/link/ảnh vào analytics; 3D và xóa nền tải theo yêu cầu; output PNG không là file sản xuất. Ảnh móc gốc dài 536–946 px, cần kiểm tra độ nét xuất 3x, không hứa đủ nét.

**Scale/Scope**: 18 SVG nháp, 10 PNG móc, tám màu, tám size, bốn mode mặt sau cho acrylic trong và một mode acrylic đục. Không có dự báo tải hoặc cam kết throughput; giới hạn và giám sát upload để tránh lạm dụng.

## Constitution Check

**Cập nhật 2026-11-20:** `.specify/memory/constitution.md` đã được ratified tại
v1.0.0 với 5 principle. Constitution Check lịch sử trong plan đã bị stale và
được thay bởi đánh giá hiện tại này. Token Sanity vẫn chỉ ở server; dữ liệu
crosses boundaries được validate; cart/checkout lighter không bị chỉnh; GA4 và
Umami giữ allow-list và de-duplication. Phase 9 đã xác định một vi phạm
Constitution V tại baseline kiểm thử: T084 được đánh dấu hoàn tất nhưng lệnh
suite hiện tại còn 2/23 failing; T095 phải phục hồi bằng chứng trước khi tuyên bố
delivery complete. AGPL-3.0 của IMG.LY đã được xác minh kỹ thuật từ upstream,
nhưng package/model/deployment vẫn chờ owner theo T091.

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
  preview/                  # 2D và module 3D lazy hiện đang gated
  geometry/                 # SVG, die-cut worker, alpha mask, mm và lỗ
  image/                    # Sanity loader, solid-background và IMG.LY gate
  render/                   # render 2D, texture 3D, PNG
  hooks/                    # state phiên, upload, geometry, snapshot
  controls/                 # shape, image, back, acrylic và xóa nền
  types.ts
  ExportDialog.tsx
data/keychain/              # danh mục, màu, metadata móc
public/keychain/{frames,rings}/
api-client/keychain.ts
api-client/keychain-server.ts
sanity/schemas/keychainDesign.js
sanity/schemas/schema.js
utils/analytics.ts
utils/umamiAnalytics.ts
utils/keychain/             # validation, privacy, lifecycle, fingerprint, hydration
docs/ANALYTICS_GUIDE.md
docs/keychain-builder-release.md
docs/keychain-builder-evidence/{desktop-browser,browser-viewports}.md
scripts/tests/keychain-{geometry,render,api,privacy,image-validation}.test.mjs
scripts/test-keychain-browser.mjs
```

**Structure Decision**: Theo pages router và phân lớp hiện có. `BuilderLayout`
được gán trực tiếp ở route keychain; `MainLayout` chỉ là precedent, không phải
layout hiện tại của route. Upload keychain tách khỏi lighter. Không đưa asset
nháp thành file cắt production. `BackImageEditor.tsx` từng được nêu trong
T036 nhưng chưa tồn tại trong source; hành vi còn thiếu được trace tại T101.

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

## Current Implementation Delta

Implementation hiện tại còn các delta sau và chúng không được coi là plan
amendment:

- CTA báo giá trong Export dialog hiện lưu snapshot trước khi khách tải PNG.
  Đây là addition chưa nằm trong intent ban đầu; T100 yêu cầu remove hoặc
  approved spec/plan amendment.
- 3D module đã tồn tại nhưng control đang disabled; T096 phải restore UX và
  evidence trước khi claim US3 complete.
- Edge và sheen chỉ tồn tại trong type/state/render, chưa có control UI; T097.
- Mobile target size, back-upload gating và custom-back crop UX lần lượt là
  T098, T099 và T101.
- Browser script/evidence cần chạy lại theo current DOM; T102.

## Complexity Tracking

Không có exception constitution được xác định. Die-cut worker, render 3D và snapshot immutable là phạm vi MVP chứ không phải phần mở rộng tùy chọn. Tài liệu nghiên cứu ghi rõ giới hạn asset công khai và các gate trước public.
