# Proposal

## Why

Khi audit Cloudflare Workers + Vinext build và toàn bộ API / FE source, tụi mình phát hiện 2 vấn đề lớn (1 P0 blocker + nhiều dead code làm phình bundle và tăng attack surface):

1. **Blog detail runtime crash & Worker bloat (P0)**: Hiện tại mỗi request vào `/blog/[slug]` đều chạy `getStaticProps` trực tiếp trong Worker, gọi `getVFile()` (`utils/unified.ts` -> `remark-prism`) và `DOMPurify.sanitize()` (`isomorphic-dompurify`). Cả 2 thư viện này kéo `jsdom`, `vm.createContext`/`vm.runInContext` và `fs.readFileSync` (không tồn tại trên `workerd`) vào Worker bundle — làm `getStaticProps` catch lỗi, trả 404 ngầm và nhồi thêm `jsdom` (~2.6 MB source) vào bundle.
2. **Unused APIs, dead FE code & broken manifest gate**:
   - Có **4 API routes không còn FE caller**: `POST /api/costs/create` và `POST /api/income/create` (unauthenticated Sanity writes chỉ check `Origin` giả mạo được), `GET /api/search` (từ commit `199f091`, `pages/search/index.tsx` đã đọc static `/search-index.json`, nên giữ `/api/search` chỉ làm nặng Worker với `server/search/sources.ts` + 34 product pages + `blog-posts.json`), và `POST /api/creativa/orders/analytics-claim` (đã là 410 tombstone, 0 FE callers).
   - Ở FE còn khá nhiều dead code (0 callers): toàn bộ `components/swr/` (kể cả `StudentDetail.tsx` tutorial + `index.ts`), `utils/date.ts`, `api-client/priceLaptop.ts`, `api-client/sanity-client.ts`, dead hooks (`useCurrentCart`, `useStaticContentBySlug`, `useUmamiEngagement`), và nhiều component chết trong `components/common/` (đặc biệt `calendar/*` re-export từ `components/common/index.ts` kéo theo `react-date-range` + CSS).
   - Ngoài ra, `pnpm migration:check-manifests` hiện **đang FAIL** vì commit `444bd52` đã xóa thư mục speckit cũ (`specs/004-migrate-vinext-cloudflare/compatibility-decisions.md`), khiến `pnpm release:local` bị block.

## What Changes

- **Precompile blog Markdown -> sanitized HTML lúc build**: Chuyển pipeline render Markdown + syntax highlighting + HTML sanitization vào `scripts/migration/generate-blog-data.mjs` (pure JS, không `jsdom`/`vm`, bỏ `rehype-document`), để `pages/blog/[slug].tsx` chỉ đọc `post.htmlContent` sẵn có tại Worker runtime.
- **Baseline evidence capture & structural compare gates**: Trước khi đụng vào các phần làm thay đổi cấu trúc HTML/DOM/route của website (126 bài blog và các FE pages/routes bị chạm khi dọn dead code), capture baseline HTML + browser/DOM hiện tại và tạo script compare (`scripts/migration/compare-blog-html.mjs` + browser/DOM baseline compare) để chạy đối chiếu before/after sau khi implement, đảm bảo 100% pass không lệch semantic structure.
- **Siết Worker bundle & runtime verification**: Thêm rule cấm `jsdom`, `isomorphic-dompurify`, `remark-prism`, `node:vm`/`"vm"` trong `scripts/migration/check-worker-graph.mjs`, đồng thời thêm `/blog/<slug>` vào `scripts/migration/browser-baseline.mjs` (và smoke check) để bắt regression tự động.
- **BREAKING — Xóa 4 unused APIs (22 -> 18 routes)**: Xóa `pages/api/costs/create.ts`, `pages/api/income/create.ts`, `pages/api/search.ts` (cùng `server/search/index.ts`), và `pages/api/creativa/orders/analytics-claim.ts`.
- **Dọn toàn bộ dead FE logic & unused packages**:
  - Xóa toàn bộ `components/swr/` (`costs.ts`, `incomes.ts`, `StudentDetail.tsx`, `index.ts`) và `utils/date.ts` (gỡ export khỏi `utils/index.ts`).
  - Xóa `api-client/priceLaptop.ts` và `api-client/sanity-client.ts`.
  - Xóa dead hooks: `hooks/useCurrentCart.ts`, `hooks/useStaticContentBySlug.ts`, `hooks/useUmamiEngagement.ts` (cập nhật `hooks/index.ts` và bỏ comment thừa trong `pages/_app.tsx`).
  - Xóa dead `components/common/*`: `calendar/` (`dateRange.tsx`, `datePicker.tsx`, `index.ts`), `footerSeo.tsx`, `scrollToBottom/index.tsx`, `switch/index.tsx`, `input/` (`controller.tsx`, `index.tsx`), `template.tsx` và dọn `components/common/index.ts`.
  - Gỡ packages thừa trong `package.json`: `remark-prism`, `@types/remark-prism`, `isomorphic-dompurify`, `rehype-document`, `rehype-format`, `react-date-range`, `@types/react-date-range`, và dùng pure-JS build-time packages (`prismjs`, `rehype-sanitize`, cùng `hast-util-from-html`, `unist-util-visit`).
- **Reconcile migration manifests & fix `check-manifests.mjs`**: Cập nhật `artifacts/migration/baseline/apis.json` và toàn bộ migration scripts/fixtures từ `22` -> `18` routes (`api-contracts.mjs`, `api-fixtures/fixtures.json`, `api-fixtures/fixture-loader.mjs`, `api-fixtures/creativa/manifest.json`, `verify-api-manifest.mjs`, `check-manifests.mjs`, `compare-runtime-contracts.mjs`, `release-gate.mjs`), đồng thời sửa legacy check `specs/004-migrate-vinext-cloudflare/compatibility-decisions.md` trong `scripts/migration/check-manifests.mjs` để `pnpm release:local` pass.

## Capabilities

### New Capabilities
- `blog-build-rendering`: Build-time Markdown compilation, syntax highlighting, HTML sanitization cho 126 bài blog, và Worker-safe runtime rendering + regression gates (`jsdom`/`vm` check + `/blog/<slug>` verification).
- `unused-api-and-fe-retirement`: Xóa 4 unused API routes (22 -> 18), dọn dead FE modules/dependencies không còn caller, và reconcile toàn bộ API baseline manifests + legacy manifest gate.

### Modified Capabilities

<!-- Không có: hiện chưa có spec nào liên quan dưới openspec/specs/. -->

## Impact

- **Blog & search build pipeline**: `pages/blog/[slug].tsx`, `utils/unified.ts` (xóa), `utils/posts.ts`, `models/post.ts`, `scripts/migration/generate-blog-data.mjs`, `server/search/sources.ts`, `data/blog-posts.json`, `public/search-index.json`.
- **APIs & server modules**: Xóa `pages/api/costs/create.ts`, `pages/api/income/create.ts`, `pages/api/search.ts`, `pages/api/creativa/orders/analytics-claim.ts`, `server/search/index.ts`.
- **FE modules**: `components/swr/*`, `utils/date.ts`, `utils/index.ts`, `api-client/priceLaptop.ts`, `api-client/sanity-client.ts`, `hooks/useCurrentCart.ts`, `hooks/useStaticContentBySlug.ts`, `hooks/useUmamiEngagement.ts`, `hooks/index.ts`, `pages/_app.tsx`, `components/common/*`.
- **Migration scripts & manifests**: `scripts/migration/compare-blog-html.mjs` (mới), `scripts/migration/compare-browser-baseline.mjs` (mới), `scripts/migration/check-worker-graph.mjs`, `scripts/migration/browser-baseline.mjs`, `artifacts/migration/baseline/apis.json`, `artifacts/migration/baseline/dependencies.json`, `artifacts/migration/baseline/call-sites.json`, `scripts/migration/api-contracts.mjs`, `scripts/migration/api-fixtures/fixtures.json`, `scripts/migration/api-fixtures/fixture-loader.mjs`, `scripts/migration/api-fixtures/creativa/manifest.json`, `scripts/migration/verify-api-manifest.mjs`, `scripts/migration/check-manifests.mjs`, `scripts/migration/compare-runtime-contracts.mjs`, `scripts/migration/release-gate.mjs`.
- **Dependencies (`package.json`)**: Gỡ `remark-prism`, `@types/remark-prism`, `isomorphic-dompurify`, `rehype-document`, `rehype-format`, `react-date-range`, `@types/react-date-range`; thêm/dùng `prismjs`, `rehype-sanitize`, `hast-util-from-html`, `unist-util-visit`.
