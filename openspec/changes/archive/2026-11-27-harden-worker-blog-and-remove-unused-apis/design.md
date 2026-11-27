# Design

## Context

Xem [proposal.md](./proposal.md) để nắm bối cảnh và lý do. Hiện tại hệ thống đang gặp các điểm nghẽn sau:
- `pages/blog/[slug].tsx` chạy `getStaticProps` live trong Cloudflare Worker trên mỗi request (vì chưa có prerendered HTML cache), gọi `getVFile()` trong `utils/unified.ts` (`remark-prism` -> `jsdom` + `vm` + `fs.readFileSync`) và `DOMPurify.sanitize()` (`isomorphic-dompurify` -> `jsdom`). Đáng chú ý, `utils/unified.ts` đang dùng `.use(rehypeDocument, { title })` tạo cả `<!doctype html><html><head>...<body>...`, và trước giờ chạy được chỉ nhờ `DOMPurify.sanitize()` vô tình strip bỏ wrapper `<html>/<body>` xuống thành HTML fragment!
- Trong 4 API không còn FE caller: `/api/costs/create` và `/api/income/create` mở Sanity write không auth; `/api/search` đã bị thay bởi static `/search-index.json` từ commit `199f091` (nhưng vẫn kéo `server/search/sources.ts` + 34 product pages + `data/blog-posts.json` vào Worker bundle); `/api/creativa/orders/analytics-claim` đang là 410 tombstone.
- Nhiều dead modules ở FE (`components/swr/*`, `utils/date.ts`, `api-client/priceLaptop.ts`, `api-client/sanity-client.ts`, 3 hooks chết, và nhiều file dưới `components/common/` như `calendar/*` kéo theo `react-date-range` qua barrel `components/common/index.ts`).
- `scripts/migration/check-manifests.mjs` (line 148–156) đang check file `specs/004-migrate-vinext-cloudflare/compatibility-decisions.md` đã bị xóa ở commit `444bd52`, làm `pnpm migration:check-manifests` và `pnpm release:local` fail mỗi khi có `artifacts/migration/runtime/`.

## Goals / Non-Goals

**Goals:**
- Render toàn bộ 126+ bài blog sạch sẽ trên Cloudflare Workers với **zero runtime dependency** vào `jsdom`, `node:vm`, `node:fs`, `remark-prism`, `isomorphic-dompurify`, `rehype-document`.
- Thu gọn mạnh `worker-entry` bundle bằng cách loại bỏ `jsdom` (~2.64 MB source + transitive deps `parse5`, `ws`, `cssstyle`, `cssom`, `iconv-lite`), bỏ `mdContent` khỏi `data/blog-posts.json` runtime data, và bỏ `server/search/sources.ts` khỏi runtime (nhờ xóa `/api/search`).
- Retire sạch 4 unused APIs (22 -> 18 routes) + toàn bộ dead FE modules/packages đã audit, đồng thời sửa `check-manifests.mjs` và tất cả manifest/regression scripts hardcode `22` để `pnpm release:local` pass xanh.

**Non-Goals:**
- Không xóa/sửa Sanity Studio schemas (`costs`, `income`, `price-laptop` bên trong `sanity/`).
- Không thay đổi format viết bài Markdown trong `blog/*.md` hay giao diện CSS của blog (`MarkdownWrapper` + `styles/prism.css`).
- Không cấu hình `assets.runWorkerFirst` hay edge CDN caching (đã tách sang change `optimize-cloudflare-assets-and-cdn-cache`).
- Không xóa `@emotion/styled` (dù 0 direct import, nó là `peerDependency` của `@mui/material`).

## Decisions

1. **Precompile Markdown -> sanitized HTML fragment ngay trong `scripts/migration/generate-blog-data.mjs`**
   - *Choice*: Chạy unified pipeline pure-JS (`remark-parse`, `remark-gfm`, `remark-toc`, `remark-images`, `remark-rehype`, `rehype-slug`, `rehype-autolink-headings` `{ behaviour: "wrap" }`, pure-JS Prism plugin/transform bằng `prismjs` hoặc `refractor`, `rehype-sanitize`, và `rehype-stringify`) tại build time để ghi thẳng `htmlContent` vào `data/blog-posts.json`. **Bỏ `rehypeDocument` và `rehypeFormat`** để output là HTML fragment chuẩn cho `<MarkdownWrapper>`.
   - *Semantic HTML Parity Config*: Trong `rehype-sanitize`, bắt buộc set `clobberPrefix: ""` (tránh thêm `user-content-` vào `id` của heading làm lệch TOC links `#...`) và whitelist `className` cho code highlighting (`remark-highlight`, `language-*`, `line-numbers`, `token` và token types). Giữ nguyên thứ tự các remark/rehype plugins hiện tại để DOM semantic tree khớp 100%.
   - *Data size & Search index*: Bỏ `mdContent` khỏi `data/blog-posts.json` (vì `utils/posts.ts` static-import toàn bộ JSON này vào Worker bundle — giữ cả `mdContent` + `htmlContent` sẽ làm phình bundle gấp đôi). Cập nhật `server/search/sources.ts` (`blogDocuments()`) đọc plain text strip tags từ `htmlContent` (hoặc `plainText`) cho `pnpm migration:search-index`.
   - *Prism runtime script*: Build-time `rehypeBuildPrism` render sẵn `<span class="token ...">` và `<pre class="language-js line-numbers">`, đồng thời **giữ cố định** `<Script src="/prism.js" strategy="afterInteractive" />` trong `pages/blog/[slug].tsx` vì `styles/prism.css` phụ thuộc client-side `.line-numbers-rows` từ `public/prism.js` cho bài `blog/2022-09-21-huong-dan-xem-doi-may-ten-model-may-tinh-laptop.md` mà không làm lệch DOM semantic parity khi chạy `compare-blog-html.mjs`.
   - *Alternative*: Dùng thư viện highlighter runtime tương thích Workers và compile SSR mỗi request. Bị loại vì tốn CPU trong giới hạn 10ms của Workers Free và giữ pipeline `unified` trong Worker bundle.

2. **Mở rộng `check-worker-graph.mjs` & `browser-baseline.mjs`**
   - *Choice*: Thêm pattern cấm `jsdom`, `isomorphic-dompurify`, `remark-prism`, và cả `node:vm` lẫn bare `"vm"` (`from "vm"` / `require("vm")`) vào cả `forbidden` (compiled JS bundle) và `requestTimeModules` (`.map` `sourcesContent`) trong `scripts/migration/check-worker-graph.mjs`, kèm negative self-check trên fixture tạm để chứng minh script thực sự fail khi có regression. Thêm ít nhất 1 route `/blog/<slug>` thực tế (vd `/blog/tai-sao-nen-dan-skin-cho-laptop` và `/blog/huong-dan-xem-doi-may-ten-model-may-tinh-laptop`) vào `scripts/migration/browser-baseline.mjs` (và verify HTTP 200 trong local Worker preview).
   - *Rationale*: Chặn sớm nguy cơ dev hoặc dependency import nhầm Node-only DOM/VM packages vào `pages/` hoặc `utils/`, và đảm bảo `/blog/[slug]` được test thật ở runtime chứ không chỉ `/blog` listing.

3. **Retire 4 unused APIs (22 -> 18) & tách `server/search/sources.ts` thành build-only**
   - *Choice*: Xóa `pages/api/costs/create.ts`, `pages/api/income/create.ts`, `pages/api/search.ts` (+ `server/search/index.ts`), và `pages/api/creativa/orders/analytics-claim.ts`. Giữ nguyên `server/search/client.ts`, `domain.ts`, `public-index.ts`, `sources.ts`, `dynamic-sources.ts`, `expiring-promise-cache.ts` vì `pages/search/index.tsx`, `scripts/migration/generate-search-index.mjs`, và `scripts/verify-grouped-content-reads.mjs` vẫn dùng.
   - *Rationale*: `pages/search/index.tsx` đã đọc static `/search-index.json`, nên xóa `pages/api/search.ts` vừa bỏ endpoint thừa vừa đá `server/search/sources.ts` + 34 product page data modules ra khỏi Worker runtime. `analytics-claim.ts` đã là 410 tombstone và không còn caller nào.

4. **Dọn toàn bộ dead FE modules & packages thừa**
   - *Choice*:
     - Xóa toàn bộ `components/swr/` (`costs.ts`, `incomes.ts`, `StudentDetail.tsx`, `index.ts`) + `utils/date.ts` (gỡ export khỏi `utils/index.ts`).
     - Xóa `api-client/priceLaptop.ts`, `api-client/sanity-client.ts`.
     - Xóa `hooks/useCurrentCart.ts`, `hooks/useStaticContentBySlug.ts`, `hooks/useUmamiEngagement.ts` (cập nhật `hooks/index.ts`, xóa dòng comment trong `pages/_app.tsx`).
     - Xóa `components/common/calendar/` (`dateRange.tsx`, `datePicker.tsx`, `index.ts`), `footerSeo.tsx`, `scrollToBottom/index.tsx`, `switch/index.tsx`, `input/` (`controller.tsx`, `index.tsx`), `template.tsx` (cập nhật `components/common/index.ts`).
     - Gỡ khỏi `package.json`: `remark-prism`, `@types/remark-prism`, `isomorphic-dompurify`, `rehype-document`, `rehype-format`, `react-date-range`, `@types/react-date-range`.

5. **Reconcile manifests (22 -> 18) & sửa `check-manifests.mjs` legacy gate**
   - *Choice*: Update count `22` -> `18` và gỡ 4 routes đã xóa trong `artifacts/migration/baseline/apis.json`, `scripts/migration/api-contracts.mjs`, `scripts/migration/api-fixtures/fixtures.json`, `scripts/migration/api-fixtures/fixture-loader.mjs`, `scripts/migration/api-fixtures/creativa/manifest.json`, `scripts/migration/verify-api-manifest.mjs`, `scripts/migration/check-manifests.mjs`, `scripts/migration/compare-runtime-contracts.mjs`, và `scripts/migration/release-gate.mjs`. Đồng thời cập nhật `scripts/migration/check-manifests.mjs` (lines 148–159) để không fail vì file `specs/004-migrate-vinext-cloudflare/compatibility-decisions.md` đã xóa ở commit `444bd52`, chuyển sang kiểm tra sự tồn tại của spec/change record `.md` dưới `openspec/`.

6. **Before/After Baseline Capture & Structural Compare Protocol**
   - *Choice*: Mọi thay đổi tác động tới cấu trúc HTML/DOM/route của website đều phải đi theo flow **Capture Baseline -> Implement -> Run Compare Script -> Pass**:
     - **Blog HTML Semantic Parity & Sanitization (126 bài)**: **Trước khi** sửa `utils/unified.ts` hoặc gỡ `remark-prism`/`isomorphic-dompurify`, chạy snapshot generator dùng pipeline hiện tại để capture HTML của toàn bộ 126 bài ra file baseline (trong `artifacts/migration/baseline/` hoặc scratch). Viết script `scripts/migration/compare-blog-html.mjs` (dùng HTML parser chuẩn `hast-util-from-html` đã có sẵn trong `package.json`, không kéo `jsdom`) so sánh structural AST/DOM giữa baseline và `data/blog-posts.json` mới: tag names, heading levels `h1..h6`, heading `id`s, anchor `href`s, `img[src]`/`alt`, `table` rows/cells, `ul/ol/li`, và `<pre><code>` + Prism classes. Bắt buộc 126/126 bài pass trước khi gỡ baseline/dependencies. Ngoài ra bổ sung automated sanitization check trên synthetic Markdown chứa `<script>`, `onerror`, `onclick` (kể cả trong code-fence attrs) để chứng minh `rehype-sanitize` strip sạch trước output.
     - **Website Pages / Shell & Negative API Checks (`_app.tsx`, `components/common/*`, `/blog/<slug>`, `/search`, `/checkout/lighters`, `/contact/form`)**: Capture evidence baseline trước khi sửa bằng `scripts/migration/browser-baseline.mjs` (đã mở rộng thêm `/blog/<slug>`) + HTTP/DOM summary (HTTP status, `<title>`/canonical/robots meta, heading tags, console errors). Sau khi implement xong bản build cuối cùng, chạy lại trọn vẹn `browser-after` capture để `artifacts/migration/runtime/browser-after/report.json` đồng bộ timestamp với build và screenshots mới nhất, rồi chạy `compare-browser-baseline.mjs --skip-before-404` (vì `browser-before` chứa URL typo 404 cũ `/blog/tai-sao-nen-dan-skin-laptop` đã được sửa sang `/blog/tai-sao-nen-dan-skin-cho-laptop` ở `after`): toàn bộ active routes phải pass HTTP 200, zero console error mới, semantic structure/SEO không lệch. Đồng thời bổ sung automated negative-route check cho 4 retired APIs trong `scripts/migration/compare-runtime-contracts.mjs` (`--retired-only` và `retiredResults`: `/api/costs/create`, `/api/income/create`, `/api/search` -> `404`; `POST /api/creativa/orders/analytics-claim` -> `405` không Sanity write), và chạy `compare-runtime-contracts.mjs` đối chiếu local Next.js với local Vinext để refresh `artifacts/migration/runtime/api-contract-comparison.json` cho đủ 18 active routes + 4 retired routes.

## Risks / Trade-offs

- **[Bỏ `rehypeDocument` & `DOMPurify` có thể làm thay đổi nhẹ HTML output của một số bài blog]** -> *Mitigation*: Audit hiện tại cho thấy 0/126 bài blog có raw HTML tag, 41 bài có TOC marker, 1 bài có code fence. Dùng `rehype-sanitize` với allow-list chuẩn (hỗ trợ heading `id`, `aria-hidden`, Prism `className`) và diff HTML output trước/sau trên các bài mẫu (bài có bảng, bài có TOC, bài có code fence `wmic csproduct get name`).
- **[Xóa `mdContent` khỏi `data/blog-posts.json` có thể ảnh hưởng script nào đọc `post.mdContent`]** -> *Mitigation*: Đã check toàn repo, ngoài `pages/blog/[slug].tsx` chỉ có `server/search/sources.ts` đọc `post.mdContent`. Cập nhật `sources.ts` đọc `htmlContent` (strip tags bằng helper sẵn có hoặc regex sạch) và chạy `pnpm migration:search-index` để verify `public/search-index.json` không mất nội dung blog.
- **[Xóa `components/common/index.ts` exports hoặc `package.json` deps có thể đụng indirect import]** -> *Mitigation*: Đã grep verify 0 callers toàn repo; chạy full `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, `pnpm build:vinext` ngay sau khi dọn để đảm bảo zero broken imports.
- **[`artifacts/migration/baseline/dependencies.json` có thể lệch sau khi đổi `package.json`]** -> *Mitigation*: Chạy lại `node scripts/migration/inventory-dependencies.mjs && node scripts/migration/inventory-call-sites.mjs` sau khi cập nhật `package.json` và check `pnpm migration:check-manifests`.
