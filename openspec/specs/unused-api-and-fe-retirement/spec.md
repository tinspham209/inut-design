# unused-api-and-fe-retirement Specification

## Purpose

Quy định việc retire 4 API routes không còn dùng (`/api/costs/create`, `/api/income/create`, `/api/search`, `/api/creativa/orders/analytics-claim`), dọn toàn bộ dead FE modules/dependencies không có caller, và reconcile API baseline manifests (22 -> 18 routes) cùng manifest gate.

## Requirements

### Requirement: Retirement of unused API endpoints
Ứng dụng SHALL NOT expose các API routes không còn được FE sử dụng: `POST /api/costs/create`, `POST /api/income/create`, `GET /api/search`, và `POST /api/creativa/orders/analytics-claim`.

#### Scenario: Requests to retired API endpoints return HTTP 404 or 405 without side effects
- **WHEN** client gửi request tới `/api/costs/create`, `/api/income/create`, `/api/search`, hoặc `/api/creativa/orders/analytics-claim`
- **THEN** Worker SHALL trả về HTTP 404 (hoặc HTTP 405 trên `POST /api/creativa/orders/analytics-claim` do fallback sang route động GET-only `/api/creativa/orders/[publicId]`) và không thực hiện Sanity write hay search corpus computation nào

#### Scenario: Static public search continues working without /api/search
- **WHEN** user tìm kiếm trên trang `/search`
- **THEN** FE vẫn load và lọc dữ liệu bình thường từ `/search-index.json` mà không gọi `/api/search`

### Requirement: Cleanup of dead frontend modules and unused packages
Codebase SHALL NOT giữ các FE modules/hooks/components không có caller (`components/swr/*`, `utils/date.ts`, dead `api-client/*`, dead `hooks/*`, dead `components/common/*`) và dependencies chỉ phục vụ chúng.

#### Scenario: Zero broken imports or active callers remain after cleanup
- **WHEN** chạy static analysis (`pnpm lint`, `pnpm exec tsc --noEmit`) và production build (`pnpm build`, `pnpm build:vinext`) sau khi xóa các dead modules và packages
- **THEN** toàn bộ barrel exports (`hooks/index.ts`, `utils/index.ts`, `components/common/index.ts`) và active pages/components compile sạch không lỗi import

#### Scenario: Active routes pass before-and-after baseline comparison
- **WHEN** chạy compare (`scripts/migration/compare-browser-baseline.mjs`, dùng `--skip-before-404` nếu `before` có URL typo cũ đã sửa sang slug đúng) giữa evidence baseline chụp trước cleanup và runtime output sau cleanup trên các routes bị chạm (`/`, `/blog`, `/blog/<slug>`, `/search`, `/checkout/lighters`, `/contact/form`)
- **THEN** toàn bộ active routes hợp lệ từ `before` SHALL giữ nguyên HTTP 200, SEO metadata, semantic DOM structure, và không phát sinh console/runtime error mới; các route mới thêm hoặc route sửa từ URL 404 ở `before` SHALL đạt HTTP 200 và zero console error mới ở `after`

### Requirement: Reconciled API baseline manifest and integrity gate
Hệ thống migration manifests, fixtures, và `scripts/migration/check-manifests.mjs` SHALL đồng bộ đúng 18 active API routes và pass validation mà không phụ thuộc file speckit cũ đã xóa.

#### Scenario: API manifest and integrity checks pass with 18 routes
- **WHEN** chạy `pnpm migration:verify-apis` và `pnpm migration:check-manifests` sau khi retire 4 API routes
- **THEN** cả hai command SHALL pass với baseline count là 18 routes, zero missing-file errors, và không fail vì file `compatibility-decisions.md` cũ đã bị xóa
