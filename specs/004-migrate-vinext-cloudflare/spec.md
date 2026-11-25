# Feature Specification: Migrate Vinext sang Cloudflare

**Feature Branch**: `004-migrate-vinext-cloudflare`  
**Created**: 2026-11-24  
**Status**: Draft  
**Input**: Migrate app từ Vercel sang Vinext + Cloudflare, deploy và test trên preview trước, chuyển DNS sau khi đã duyệt, và chỉ transfer domain registrar từ Squarespace sang Cloudflare khi owner ra lệnh riêng.

## Clarifications

### Session 2026-11-24

- Q: How should keychain uploads replace native `sharp` on Cloudflare Workers? → A: Browser resize/encode; Worker validates type, size, signature, dimensions and persists.
- Q: How soon must production reflect Sanity product or blog changes? → A: No fixed freshness SLA; owner-triggered automation deploys the approved change on demand.
- Q: How should `/search` query production content? → A: Build-time public search index with browser-side filtering only.

## User Scenarios & Testing *(bắt buộc)*

### User Story 1 — Khôi phục website production (P1)

Khách truy cập `inutdesign.com` và dùng được các flow hiện có: sản phẩm, blog, search, cart, checkout, contact, quote, upload, design và order tracking.

**Vì sao P1**: Vercel đang offline, nên mục tiêu đầu tiên là đưa website hoạt động lại mà không thay đổi hành vi quan trọng.

**Independent Test**: Deploy candidate lên Cloudflare preview và chạy route/API regression trên môi trường production-like.

**Acceptance Scenarios**:

1. **Given** candidate đã deploy, **When** mở các route trong sitemap, **Then** route, content, SEO, navigation và HTTP status đúng.
2. **Given** commerce/contact contracts không đổi, **When** test cart, checkout, quote, contact, upload, search và tracking an toàn, **Then** không có regression.
3. **Given** nội dung Sanity hoặc redirect thay đổi, **When** route được refresh, **Then** cache, content và redirect đúng theo baseline.

### User Story 2 — Preview, cutover và rollback an toàn (P2)

Owner có thể test bản Cloudflare trước, chuyển production domain khi đã pass release gate, và rollback sang bản Cloudflare đã verify nếu lỗi.

**Acceptance Scenarios**:

1. **Given** có baseline hiện tại, **When** test Cloudflare candidate, **Then** route, API, headers, cache, SEO và integration đạt parity.
2. **Given** release gate đã pass, **When** chuyển DNS/custom domain, **Then** `inutdesign.com` phục vụ Cloudflare deployment.
3. **Given** phát hiện lỗi sau cutover, **When** chạy rollback runbook, **Then** quay về verified Cloudflare version trong thời gian cho phép.

### User Story 3 — Vận hành integration và chi phí (P3)

Operator có thể quản lý secrets, logs, cron, spending limit và các integration mà không làm lộ dữ liệu nhạy cảm.

**Acceptance Scenarios**:

1. **Given** có config inventory, **When** tạo environment mới, **Then** app chạy đủ nhưng server secrets không xuất hiện trong browser bundle.
2. **Given** SPX cron gọi API, **When** route chạy, **Then** auth, timeout, idempotency, response và notification giữ nguyên.
3. **Given** Cloudflare usage tăng, **When** vượt warning/cap, **Then** owner nhận cảnh báo trước khi chi phí mất kiểm soát.

### User Story 4 — Chuyển DNS/domain nhưng giữ SEO (P2)

Owner chuyển `inutdesign.com` từ Squarespace/Vercel sang Cloudflare theo từng phase, giữ nguyên URL, HTTPS, sitemap, canonical, email records và SEO. Registrar transfer là bước cuối và chỉ chạy khi owner gọi riêng.

**Acceptance Scenarios**:

1. **Given** có preview hostname, **When** owner review site, **Then** preview không bị index như production thứ hai.
2. **Given** đã export DNS Squarespace/Vercel, **When** chuẩn bị Cloudflare zone, **Then** apex, `www`, email, SPF, DKIM, DMARC, TXT verification và subdomain đều có trong inventory.
3. **Given** preview và DNS inventory đã pass, **When** Cloudflare thành authoritative DNS, **Then** `https://inutdesign.com`, canonical, redirect, sitemap, robots và TLS không đổi.
4. **Given** production Cloudflare ổn định, **When** owner sau này trigger registrar transfer, **Then** kiểm tra lock, DNSSEC, auth code, eligibility, contact và payment trước khi submit.
5. **Given** owner chưa trigger, **When** migration hoàn tất, **Then** domain vẫn đăng ký tại Squarespace; không unlock, xin auth code, submit transfer hoặc phát sinh phí.

### Edge Cases

- Build pass nhưng runtime trên Cloudflare khác Next.js.
- Redirect, header, cache, ISR hoặc image output khác baseline.
- Secret bị thiếu hoặc lộ ra client.
- DNS propagation tạm đưa traffic vào Vercel/Cloudflare khác nhau.
- API upload/order/notification timeout hoặc bị gọi trùng.
- Worker vượt 128 MB memory hoặc CPU limit.
- DNS scan bỏ sót MX, SPF, DKIM, DMARC, domain verification hoặc subdomain.
- DNSSEC vẫn bật khi đổi nameserver.
- Domain đang bị transfer lock, privacy lock, 60-day lock hoặc auth code hết hạn.
- Preview bị crawl hoặc xuất hiện trong production sitemap.
- Registrar transfer chờ approval lâu; website vẫn phải chạy bình thường trên Cloudflare DNS.

## Requirements *(bắt buộc)*

### Functional Requirements

- **FR-001**: Cloudflare deployment phải serve toàn bộ `inutdesign.com`, không phụ thuộc Vercel.
- **FR-002**: Giữ Next.js Pages Router hiện tại và thêm Vinext như parallel build/deploy path.
- **FR-003**: Giữ nguyên route, product/service/blog/search/form, static asset, sitemap, metadata và redirect.
- **FR-004**: Tất cả 22 API routes phải giữ method, body limit, validation, auth, response và error contract.
- **FR-005**: Cart, checkout, contact, quote, upload, design, notification, phone validation, order tracking và SPX sync không được regression.
- **FR-006**: Giữ `inut-lighters-cart`, pricing calculation, unique `_key`, Sanity references và confirmation.
- **FR-007**: Có config/secrets inventory; không để server secret vào browser bundle hoặc public response.
- **FR-008**: Giữ GA4/GTM + Umami exact-once, không thêm sensitive event data.
- **FR-009**: Giữ cache, ISR, revalidation, redirect, security headers và noindex/no-store behavior.
- **FR-010**: External scheduler vẫn gọi đúng canonical endpoint với auth/timeout contract hiện tại.
- **FR-011**: Có release gate cho route, API, ISR, SEO, analytics, accessibility và critical journeys.
- **FR-012**: Có runbook để deploy, verify, rollback và diagnose.
- **FR-013**: Vercel không còn là rollback target; rollback sau release đầu dùng verified Cloudflare version.
- **FR-014**: Automated test không tạo real order, gửi real notification, upload production data hoặc sửa Sanity production.
- **FR-015**: Cutover production là immediate hard cutover sau khi candidate pass; không làm traffic split.
- **FR-016**: Mọi unsupported/behavior-changing Vinext gap phải được document trước release.
- **FR-017**: Có fallback cho cache/image capability không dùng trong parity phase.
- **FR-018**: Production vận hành Free-first theo owner decision. Nếu Cloudflare
  phát quota/plan warning, operator báo owner; Paid review/upgrade là TODO riêng
  và chỉ bắt đầu khi owner yêu cầu rõ ràng.
- **FR-019**: Baseline static-first không bật Cloudflare Images, KV, R2, Durable Object, D1 hoặc Queue. Chỉ thêm khi compatibility/performance evidence chứng minh cần thiết.
- **FR-020**: Ghi nhận Workers Free allowance, nguồn đo usage và warning/quota
  response trước DNS cutover. Không đặt Paid spending threshold hoặc usage block
  làm điều kiện cutover.
- **FR-021**: Tiết kiệm chi phí không được xóa tính năng, làm lỏng security hoặc thay đổi public data contract.
- **FR-022**: Bỏ runtime dependency `@vercel/analytics`; giữ GA4/GTM và Umami.
- **FR-023**: Xử lý các Vinext gaps: `next/types`, CommonJS `__dirname`/`__filename`, partial support cho images, webpack và React Strict Mode.
- **FR-023a**: Keychain upload thực hiện resize/encode ở browser; Worker chỉ chấp nhận output hợp lệ sau khi kiểm tra file type, byte signature, file size, image dimensions, persistence contract và error response. Native `sharp` không được chạy trong Worker.
- **FR-024**: Production cần preview hostname, `inutdesign.com` zone và
  Free-first usage policy. Workers Paid không phải prerequisite; review hoặc
  migration sang Paid được deferred tới explicit owner request. R2 chỉ là
  prerequisite nếu sau audit thật sự cần Response Store.
- **FR-025**: Deployment đầu tiên chỉ dùng preview hostname; chưa đổi Squarespace registration, authoritative DNS hoặc `inutdesign.com`.
- **FR-026**: Preview phải non-indexable và không thay canonical host/sitemap production.
- **FR-027**: Có DNS inventory được owner duyệt trước khi đổi nameserver.
- **FR-028**: Không copy DNS scan mù quáng; mỗi record phải rõ target, owner, TTL, priority và proxy mode.
- **FR-029**: DNS cutover giữ nguyên `https://inutdesign.com`, redirect, robots, sitemap, canonical, indexed paths và TLS.
- **FR-030**: Registrar transfer là deferred final phase; không unlock, xin auth code, submit, payment hoặc đổi registrant contact nếu owner chưa ra lệnh.
- **FR-031**: Khi được trigger sau này, kiểm tra 60-day rule, registrar lock, DNSSEC, auth code, contact email, renewal và payment.
- **FR-032**: Cloudflare phải là authoritative DNS và Worker phải healthy trước khi transfer registrar.
- **FR-033**: Nếu DNSSEC đang bật thì disable ở Squarespace và chờ propagation trước khi đổi nameserver; chỉ re-enable sau khi stable.
- **FR-034**: Domain runbook phải có rollback cho DNS, certificate, nameserver, preview indexing và registrar transfer failure.
- **FR-035**: Runtime baseline phải tương thích `vinext@latest`: Next.js 15.5.x, React 19, Node 22, Vite 8 và `strict: false` hiện tại được giữ.
- **FR-036**: Next.js 16 là deferred option; không upgrade chỉ để phục vụ Vinext nếu Phase 1 chạy ổn trên Next 15.5.x.
- **FR-037**: Public content pages ưu tiên full static build. ISR/SSR không được thêm vào baseline; owner-triggered automation sẽ deploy approved Sanity content changes khi cần, không có fixed freshness SLA trong feature này.
- **FR-038**: `/search` trở thành static page shell; mỗi deploy tạo public search index từ approved public content và browser thực hiện filtering. Page không gọi `/api/search`; endpoint vẫn được giữ nguyên theo parity contract, nhưng không còn nằm trong critical `/search` runtime path và không dùng request-time `getServerSideProps`.
- **FR-039**: Product/Creativa/blog detail prebuild toàn bộ published slugs với `fallback: false`; owner-triggered automation rebuild/deploy khi thêm hoặc cập nhật product/post.
- **FR-040**: Production deploy được thiết kế theo local flow: checks → `build:vinext` → preview deploy → verify → production deploy. Phase specification không chạy deploy và không phát sinh Cloudflare charge.

### Key Entities

- **Deployment Candidate**: bản Worker cần kiểm tra tại preview.
- **Production Baseline**: hành vi route/API/SEO/cache trước migration.
- **Release Gate**: bộ kiểm tra bắt buộc trước production.
- **Rollback Point**: verified Cloudflare version gần nhất.
- **Compatibility Gap**: khác biệt giữa app và Vinext/Workers cần resolve hoặc owner accept.
- **DNS Inventory**: danh sách record kèm owner, target, TTL, proxy mode và disposition.
- **Domain Phase**: preview → DNS prep → production routing → stabilization → registrar transfer.
- **Registrar Transfer Request**: thao tác chuyển registration, chỉ được phép sau explicit owner trigger.

### Cross-Cutting Constraints

- **Privacy/Data**: không thêm personal/order/upload data; test dùng fixture/read-only.
- **Security**: secrets server-only; method, input size, validation, auth và idempotency không bị nới lỏng.
- **Accessibility**: giữ keyboard, responsive, non-color cues, loading/error state và reduced motion.
- **Observability**: GA4/GTM + Umami giữ exact-once và không thu sensitive fields.
- **Compatibility**: bảo toàn commerce, Sanity, cart, upload, analytics và public URL contracts.
- **SEO Continuity**: preview không index; production canonical, sitemap, robots, HTTPS và redirects không đổi.
- **Cost Control**: Workers Free là current operating plan; owner báo chưa có
  billable usage tại thời điểm ghi nhận. Paid pricing/modeling không phải
  acceptance gate và chỉ được rà soát lại khi owner yêu cầu upgrade.

## Next.js / React Upgrade Decision

### Version khuyến nghị

- Không nhảy thẳng Next 12 → Next 16 trong release migration này.
- Target ít risk nhất: **Next 15.5.x + React 19 + Node 22**.
- `vinext@latest` yêu cầu Node ≥22 và React 19.2/19.3, nên giữ React 18/Next 14 không còn là option phù hợp nếu dùng supported Vinext release.
- Next 15.5 vẫn giữ Pages Router và Webpack-compatible flow gần repo hiện tại; async Request APIs của Next 15/16 chủ yếu ảnh hưởng App Router, repo không dùng App Router.
- Next 16 chỉ thêm migration không cần ngay: Turbopack default conflict custom webpack, `next lint` bị bỏ và TypeScript/tooling đổi thêm.

### Công việc bắt buộc khi upgrade

1. Đồng bộ Next, ESLint config, bundle analyzer, `@next/third-parties`, React/ReactDOM và React types.
2. Đổi Node baseline sang **>=22 <26**.
3. Nâng MUI 5 lên bản cuối hỗ trợ React 19; cập nhật React Hook Form và SWR trong major hiện tại.
4. Giải quyết `react-material-ui-carousel` vì package chỉ khai báo React 17/18.
5. Đánh giá React Three Fiber/Drei cho React 19 compatibility.
6. Migrate **51 legacy `next/image` usages trong 28 files** khỏi `layout/objectFit/objectPosition`.
7. Migrate 5 chỗ `<Link><a>…`.
8. Đổi `GetStaticProps` import từ `next/types` sang `next`.
9. Xóa/đổi script `next export`.
10. Map custom webpack alias/external sang Vinext/Vite.
11. Gate hoàn tất chỉ khi lint, type/build, browser regression và Worker runtime checks đều pass.

## Public Route Rendering Matrix

Source hiện có 74 public page modules:

| Mode hiện tại | Số page | Route | Target local-static model |
|--------------|--------:|-------|---------------------------|
| Static shell | 58 | About, policy, contact form, cart, checkout, builder, tracking, guides và service leaf pages | Giữ static |
| Build-time SSG | 4 | Blog detail, service index/detail, product landing | Giữ SSG; `fallback: false` |
| ISR 600s | 2 | `/`, `/blog` | Remove `revalidate`; rebuild/deploy sau publish |
| ISR 86400s | 9 | Product lists/details, Creativa pages | Remove ISR; prebuild all slugs |
| SSR | 1 | `/search` | Static shell + build-time public index + browser filtering |

Kết quả:

- Public page không cần Response Store.
- Vinext init dùng `--cdn-cache=none --data-cache=none`.
- Không cần R2/DO chỉ để render public page.
- Static assets được serve miễn phí; Worker chủ yếu chạy 22 API.

## Domain Migration Sequence

1. **Preview first**: deploy Worker lên temporary hostname và test toàn bộ critical flows; không đổi DNS/registrar.
2. **Prepare DNS**: tạo Cloudflare zone, export/check Squarespace DNS và Vercel targets, owner duyệt DNS inventory.
3. **Production DNS cutover**: sau release gate, lower TTL khi phù hợp, đổi nameserver, chờ zone active, attach Worker custom domain, verify HTTPS.
4. **Stabilize**: monitor availability, indexed URL, sitemap, canonical, redirect, email và critical workflow.
5. **Registrar transfer cuối cùng**: chỉ khi owner yêu cầu sau này, mới unlock domain, xin auth code, confirm giá, submit và approve transfer.

> Planning/implementation có thể chuẩn bị checklist, nhưng **không được** xin auth code, unlock domain, submit transfer hoặc phát sinh phí khi chưa có lệnh riêng từ owner.

## API Route Decision

### Giữ Worker, không cache

Giữ method, auth, validation, idempotency và response contract cho:

- Orders, checkout, quote, cost, income.
- Keychain design read/write và upload.
- Telegram notifications.
- SPX synchronization.
- Phone validation.
- Creativa lookup, submit, resolve và analytics claim.

### Public GET có thể tối ưu

- `/api/creativa/catalog`, `/api/creativa/options`, `/api/creativa/products/[slug]`: public read nhưng hiện bị `no-store`; có thể cache 24h.
- `/api/search`: endpoint được giữ theo API parity contract; `/search` không còn gọi endpoint ở runtime và chỉ dùng static search index được tạo trong build.

### Bắt buộc sửa cho Workers

1. `/api/keychain/uploads` dùng browser resize/encode trước khi gửi. Worker bắt buộc validate file type, byte signature, file size và image dimensions trước khi persist; native `sharp` và external image service không thuộc baseline.
2. Preview origin phải allow-list rõ ràng, không wildcard và không expose production secret.
3. `Buffer`/stream body parsing phải test trên Worker cho upload và Creativa raw-body endpoints.
4. In-memory LRU rate limit là per-isolate; giữ để parity ban đầu nhưng không claim distributed security. Nếu abuse tăng, chuyển Cloudflare-native rate limiting.
5. Đổi `process.env.VERCEL_ENV` thành neutral environment label.
6. Remove `@vercel/analytics`; giữ GA4/GTM và Umami.

## Cost Estimate & Alternatives

### Pain points từ Feature 003

- Vercel sample: 207–210 invocations/12 giờ, average CPU 488 ms, P75 530 ms, P95 624 ms.
- Homepage từng có 4 Sanity reads; feature 003 đã group còn 1.
- `/contact` từng dùng 35 giây CPU/4 invocations; hiện đã chuyển static.
- `/search` từng gọi 5 Sanity reads; hiện đã group còn 1 với cache 24 giờ.
- Creativa cache 60 giây → 24 giờ; homepage/blog 5 phút → 10 phút.
- Vercel memory mẫu 407–654 MB; Cloudflare Worker giới hạn khoảng 128 MB/isolate, nên bắt buộc đo actual memory.
- Production-only traffic chưa đủ evidence; estimate dưới đây là proxy, không phải hóa đơn chắc chắn.

### Cloudflare account state at migration kickoff (historical snapshot)

This table records pre-cutover state from the migration kickoff; it is not the
current production inventory. Production now runs on Workers Free as the
owner-approved Free-first operating mode.

| Resource | Hiện trạng |
|----------|-----------|
| Account | `inutdesign`, mới tạo |
| Plan | Workers Free |
| Subscription | Workers Free (state at migration kickoff) |
| Workers/scripts | 0 |
| Preview subdomain | Chưa có |
| Zone | Chưa có `inutdesign.com` |
| Spend policy | 0 |
| R2 | Chưa enable; không cần trong static-first baseline |
| KV/D1/Queues | 0 resource |

### Vinext compatibility

`pnpm dlx vinext check` trả về:

- **85% compatible**
- 74 pages, 22 API routes được scan.
- Hỗ trợ Pages Router, custom `_app`, custom `_document`, redirects, headers và các imports chính.
- 2 issues và 3 partial-support areas cần xử lý.
- Cloudflare hướng dẫn Vinext chủ yếu cho Next.js 14+, repo đang dùng 12.3.1; vì vậy phải runtime-test thật.

### Current Free-first cost policy

- Production currently runs on Workers Free and the zone is on Cloudflare Free.
  Owner reported no billable usage as of 2026-11-25; this is point-in-time
  evidence, not a forecast or a guarantee about third-party costs.
- Static Asset requests are documented as free. Worker request/CPU usage must be
  measured from Cloudflare Worker Metrics and compared with the current Free
  limits; Vercel function counts and sampled Worker logs are not substitutes.
- This migration does not require Workers Paid, a monthly Paid estimate, dollar
  warning/block targets, or optional metered services.
- **Future Paid TODO**: if Cloudflare emits a quota/plan warning or the owner
  requests an upgrade, notify the owner and wait for explicit direction. Recheck
  then-current pricing, included usage, spending controls, logs and optional
  services only after that request. Earlier Paid estimates are superseded and
  are not current policy.
- Full-static public pages do not require Response Store. R2, Durable Object,
  Cloudflare Images, KV, D1 and Queue remain disabled absent a separate approved
  evidence-based need. Registrar transfer fees are outside Workers usage.

Historical Workers Paid pricing models from the migration investigation are
superseded by the owner-approved Free-first decision; do not use them to infer
current or future charges.

### Low-cost alternatives

| Area | Default choice | Alternative nếu Worker limit/chi phí lệch |
|------|----------------|-----------------------------------------|
| Public pages | Full static build + local deploy | ISR/Response Store chỉ khi owner không chấp nhận rebuild flow |
| `/contact` | Static local asset, 0 runtime Sanity read | Versioned build-time asset |
| Homepage/catalog | Grouped Sanity queries | Public versioned catalog snapshot |
| Search | Bounded server search + 24h cache | Build-time public search index + browser filtering |
| Upload | Giữ Sanity upload contract; server validate | Stream upload hoặc short-lived direct upload |
| Images | `image-optimization=none` | Pre-generate fixed variants; tránh paid Images |
| SPX cron | Giữ external cron-job.org | Chuyển sang Cloudflare Cron Trigger nếu cần |
| Notification | Giữ provider hiện tại | Queue chỉ phần retryable notification |
| Logs | Dùng included logs | Sample non-error logs; không ẩn security/write error |

### Pricing references

- Workers pricing: <https://developers.cloudflare.com/workers/platform/pricing/>
- Worker limits: <https://developers.cloudflare.com/workers/platform/limits/>
- Vercel → Vinext: <https://developers.cloudflare.com/workers/static-assets/migration-guides/vercel-to-workers/nextjs/>
- Domain transfer: <https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/>

## Success Criteria

- **SC-001**: 100% route trong release gate load đúng content, SEO, redirect, header và status.
- **SC-002**: 100% critical safe flows hoàn tất không regression.
- **SC-003**: 100% API contract checks pass; 0 real order/production side effect trong test.
- **SC-004**: 95% representative pages chậm không quá 10% so với baseline; không route timeout.
- **SC-005**: Cutover downtime do thao tác dưới 5 phút, không tính DNS propagation ngoài kiểm soát.
- **SC-006**: Rollback Cloudflare version trong 15 phút sau owner approve.
- **SC-007**: 7 ngày sau cutover đạt ít nhất 99.9% monitoring availability, 0 unresolved critical security/data incident.
- **SC-008**: 100% config nằm trong inventory; 0 secret trong browser bundle/source map.
- **SC-009**: GA4/GTM và Umami ghi exact-once, không có prohibited data.
- **SC-010**: Qualified operator deploy/verify từ runbook trong 30 phút.
- **SC-011**: Production cutover and routine operation require no Workers Paid
  subscription or Paid-plan charge model.
- **SC-012**: Worker requests, CPU and source/coverage are recorded against the
  current Free allowance; missing aggregate evidence remains an explicit gap.
- **SC-013**: 100% release-gate route/API không vượt 128 MB memory hoặc CPU limit.
- **SC-014**: Images, KV, R2, Durable Object, D1 và Queue tắt trong static-first baseline; mỗi service thêm sau phải có cost/compatibility gate.
- **SC-015**: Có Free-plan request/CPU monitoring and Cloudflare warning
  response before DNS cutover; no Paid usage-block policy is required.
- **SC-016**: Không còn active Vercel Analytics dependency; GA4/GTM và Umami giữ nguyên.
- **SC-017**: Account có preview hostname, zone và Free-plan usage monitoring.
  Paid review is deferred to an explicit owner request. R2 không còn là
  prerequisite của baseline.
- **SC-018**: 2 Vinext issues + 3 partial areas được fix hoặc owner chấp nhận có evidence.
- **SC-019**: 0 preview URL vào production index/sitemap; 100% preview page dùng canonical `inutdesign.com`.
- **SC-020**: 100% DNS records được owner duyệt; không thiếu apex/`www`/MX/SPF/DKIM/DMARC/TXT/subdomain.
- **SC-021**: Sau DNS cutover, canonical/sitemap URL vẫn là `https://inutdesign.com`, HTTPS valid, status/redirect parity.
- **SC-022**: Registrar vẫn ở Squarespace trong preview, DNS cutover và stabilization; 0 transfer action khi chưa có explicit trigger.
- **SC-023**: Khi sau này trigger transfer, toàn bộ eligibility/payment/contact/lock/DNSSEC/auth-code checks đều pass.
- **SC-024**: Registrar transfer không làm đổi Worker, DNS, canonical, sitemap, indexed path hoặc HTTPS; website không offline khi chờ Squarespace approval.
- **SC-025**: 100% public page inventory static hoặc có approved runtime exception; production không dùng Response Store/R2/DO chỉ để render public pages.
- **SC-026**: Preview và production đều build/deploy thành công từ local CLI flow; owner repeat được bằng một lệnh.
- **SC-027**: Không còn native `sharp` runtime trong Cloudflare Worker; browser resize/encode và Worker validation pass file type, byte signature, size, dimensions, persistence, error contract và visual checks.
- **SC-028**: Build-time search index chỉ chứa approved public searchable fields; browser search giữ parity cho published result sets, query/error/empty states, keyboard operation và không gọi `/api/search` ở runtime.

## Assumptions

- Cloudflare là production platform dài hạn; Vercel đang offline và không phải rollback.
- Scope gồm toàn bộ Pages + 22 API routes, không phải static-only.
- Preview phải có trước domain cutover.
- Domain vẫn registered tại Squarespace tới khi owner ra lệnh transfer riêng.
- Cloudflare DNS activation và registrar transfer là hai milestone khác nhau.
- Cloudflare yêu cầu domain dùng authoritative Cloudflare DNS trước transfer registration.
- Zone active có thể mất tới 24 giờ; registrar transfer có thể mất vài ngày tới tối đa giới hạn của TLD/registrar.
- Owner cung cấp/duyệt Squarespace DNS export, Vercel targets, email records, domain eligibility và registrant contact.
- Yêu cầu chờ Squarespace trả auth code/transfer material không đồng nghĩa với việc được phép trigger ngay.
- Cloudflare Workers Free and zone Free Plan are the current owner-approved
  state. Paid upgrade is neither required nor authorized by this feature.
- Any future Paid price or spending-control estimate must be refreshed only
  after an explicit owner request; third-party and registrar costs are separate.
- Owner-triggered automation deploy là accepted publication model; Sanity/product/blog change lên production khi trigger chạy. Feature này không quy định fixed freshness SLA.
- Next 15.5.x + React 19 + Node 22 là migration target; Next 16 được defer để giảm scope.
