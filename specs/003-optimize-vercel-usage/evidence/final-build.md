Final production build, 2026-11-23; Node `v22.23.2` (supported by this repository). Command: `rtk pnpm build`. Exit status: 0. `next-sitemap` and SEO postbuild checks passed. The earlier default Node v26 attempt was incompatible with the declared engine and is not the accepted run.

> inutdesign-web@3.1.0 build /Users/tin.phamv/work/personal/inut-design
> next build

info  - Loaded env from /Users/tin.phamv/work/personal/inut-design/.env
info  - Skipping linting
info  - Checking validity of types...
info  - Creating an optimized production build...
Browserslist: caniuse-lite is outdated. Please run:
  npx browserslist@latest --update-db
  Why you should do it regularly: https://github.com/browserslist/browserslist#browsers-data-updating
info  - Compiled successfully
info  - Collecting page data...
info  - Generating static pages (0/233)
info  - Generating static pages (58/233)
info  - Generating static pages (116/233)
info  - Generating static pages (174/233)
info  - Generating static pages (233/233)
info  - Finalizing page optimization...

Route (pages)                                                                 Size     First Load JS
┌ ● / (ISR: 600 Seconds) (322 ms)                                             1.4 kB          390 kB
├   /_app                                                                     0 B             333 kB
├ ○ /404                                                                      184 B           333 kB
├ ○ /about-us                                                                 576 B           333 kB
├ λ /api/costs/create                                                         0 B             333 kB
├ λ /api/creativa/catalog                                                     0 B             333 kB
├ λ /api/creativa/options                                                     0 B             333 kB
├ λ /api/creativa/orders                                                      0 B             333 kB
├ λ /api/creativa/orders/[publicId]                                           0 B             333 kB
├ λ /api/creativa/orders/analytics-claim                                      0 B             333 kB
├ λ /api/creativa/orders/resolve                                              0 B             333 kB
├ λ /api/creativa/products/[slug]                                             0 B             333 kB
├ λ /api/creativa/quote                                                       0 B             333 kB
├ λ /api/cron/sync-spx-orders                                                 0 B             333 kB
├ λ /api/income/create                                                        0 B             333 kB
├ λ /api/keychain/designs                                                     0 B             333 kB
├ λ /api/keychain/designs/[id]                                                0 B             333 kB
├ λ /api/keychain/uploads                                                     0 B             333 kB
├ λ /api/orders/lighters                                                      0 B             333 kB
├ λ /api/quote-request                                                        0 B             333 kB
├ λ /api/sanity/upload-image                                                  0 B             333 kB
├ λ /api/search                                                               0 B             333 kB
├ λ /api/telegram/send-abandoned-checkout-notification                        0 B             333 kB
├ λ /api/telegram/send-order-notification                                     0 B             333 kB
├ λ /api/telegram/send-quote-notification                                     0 B             333 kB
├ λ /api/validate-phone                                                       0 B             333 kB
├ ● /blog (ISR: 600 Seconds) (522 ms)                                         2.5 kB          391 kB
├ ● /blog/[slug] (52571 ms)                                                   2.82 kB         335 kB
├   ├ /blog/top-5-dich-vu-dan-skin-laptop-da-nang-uy-tin (1278 ms)
├   ├ /blog/tai-sao-nen-dan-skin-cho-laptop (1263 ms)
├   ├ /blog/dan-skin-macbook-tai-da-nang (1257 ms)
├   ├ /blog/huong-dan-xem-doi-may-ten-model-may-tinh-laptop (1250 ms)
├   ├ /blog/skin-laptop-danang (1217 ms)
├   ├ /blog/xu-huong-skin-laptop-da-nang-hot-nhat (1214 ms)
├   ├ /blog/dan-skin-laptop-tai-da-nang (1211 ms)
├   └ [+119 more paths] (avg 369 ms)
├ ○ /builder                                                                  2.23 kB         391 kB
├ ○ /builder/keychain                                                         690 B           333 kB
├ ○ /builder/lighters                                                         1.36 kB         334 kB
├ ○ /cart/lighters                                                            2.6 kB          366 kB
├ ○ /checkout/lighters                                                        36.1 kB         401 kB
├ ○ /contact                                                                  3.13 kB         392 kB
├ ○ /contact/form                                                             8.74 kB         415 kB
├ ● /creativa (ISR: 86400 Seconds) (532 ms)                                   6.21 kB         367 kB
├ ○ /creativa/cart                                                            5.38 kB         367 kB
├ ○ /creativa/checkout                                                        10 kB           395 kB
├ ○ /creativa/order-tracking                                                  4.46 kB         342 kB
├ ○ /creativa/order-tracking/[slug]                                           18.4 kB         394 kB
├ ● /creativa/skin-laptop (ISR: 86400 Seconds) (542 ms)                       9.75 kB         368 kB
├ ● /creativa/skin-laptop/[slug]                                              13.9 kB         383 kB
├ ○ /creativa/skin-laptop/huong-dan-su-dung                                   2.96 kB         336 kB
├ ○ /creativa/skin-laptop/huong-dan-su-dung/cach-tu-dan-skin-macbook-tai-nha  8.82 kB         344 kB
├ ○ /order-tracking                                                           5.6 kB          344 kB
├ ○ /order-tracking/lighters/[slug]                                           12.8 kB         387 kB
├ ○ /policies-terms                                                           4.87 kB         338 kB
├ ○ /policies-terms/chinh-sach-bao-hanh-doi-tra                               6.95 kB         340 kB
├ ○ /policies-terms/chinh-sach-bao-ve-thong-tin-khach-hang                    5.82 kB         338 kB
├ ○ /policies-terms/chinh-sach-duyet-in-va-san-xuat                           5.35 kB         338 kB
├ ○ /policies-terms/dieu-khoan-su-dung                                        7.23 kB         340 kB
├ ○ /policies-terms/faqs                                                      2.49 kB         337 kB
├ ○ /policies-terms/thong-tin-doanh-nghiep                                    4.94 kB         338 kB
├ ○ /policies-terms/thong-tin-thanh-toan                                      6.82 kB         365 kB
├ ● /san-pham                                                                 1.45 kB         341 kB
├ ● /san-pham/lighters (ISR: 86400 Seconds) (528 ms)                          12.9 kB         401 kB
├ ● /san-pham/lighters/[slug] (ISR: 86400 Seconds) (4158 ms)                  12.5 kB         410 kB
├   ├ /san-pham/lighters/bat-lua-in-chrome-bong-mau-than-thoai-nam (615 ms)
├   ├ /san-pham/lighters/bat-lua-in-chrome-bong-mau-cool (584 ms)
├   ├ /san-pham/lighters/bat-lua-mini-in-thuong-mau-chin (580 ms)
├   ├ /san-pham/lighters/bat-lua-in-tthuong-mau-vangogh-muoi-mot (443 ms)
├   ├ /san-pham/lighters/bat-lua-in-chrome-bong-mau-stussy-mot (387 ms)
├   ├ /san-pham/lighters/bat-lua-in-tthuong-mau-vangogh-mot (364 ms)
├   ├ /san-pham/lighters/bat-lua-in-chrome-bong-mau-than-thoai-mot (363 ms)
├   └ [+3 more paths]
├ ● /san-pham/skin-laptop (ISR: 86400 Seconds)                                3.26 kB         374 kB
├ ● /san-pham/skin-laptop/[slug] (ISR: 86400 Seconds) (3668 ms)               9.01 kB         375 kB
├   └ css/05e6f8cb0e2f7ff4.css                                                1.53 kB
├   ├ /san-pham/skin-laptop/retro-2-8bit (657 ms)
├   ├ /san-pham/skin-laptop/skate (402 ms)
├   ├ /san-pham/skin-laptop/meo-di-hoc (398 ms)
├   ├ /san-pham/skin-laptop/tim-cute (392 ms)
├   ├ /san-pham/skin-laptop/labubu-16 (357 ms)
├   ├ /san-pham/skin-laptop/cloudy (347 ms)
├   ├ /san-pham/skin-laptop/mau-sac-2 (344 ms)
├   └ [+3 more paths]
├ ● /san-pham/skin-nut-phim (ISR: 86400 Seconds) (443 ms)                     3 kB            374 kB
├ ● /san-pham/skin-nut-phim/[slug] (ISR: 86400 Seconds) (4880 ms)             9.03 kB         375 kB
├   └ css/837fb84ec13ed589.css                                                1.53 kB
├   ├ /san-pham/skin-nut-phim/chiem-tinh-01 (700 ms)
├   ├ /san-pham/skin-nut-phim/apple (547 ms)
├   ├ /san-pham/skin-nut-phim/spirited-away (544 ms)
├   ├ /san-pham/skin-nut-phim/nascar-01 (536 ms)
├   ├ /san-pham/skin-nut-phim/retro-04 (526 ms)
├   ├ /san-pham/skin-nut-phim/bluemin (476 ms)
├   ├ /san-pham/skin-nut-phim/retro-05 (429 ms)
├   └ [+3 more paths] (avg 374 ms)
├ λ /search                                                                   4.82 kB         340 kB
├ ● /services                                                                 1.26 kB         341 kB
├ ● /services/[...slug]                                                       6.1 kB          345 kB
├   ├ /services/sticker
├   ├ /services/ca-nhan-hoa
├   ├ /services/an-pham-luu-niem
├   └ [+5 more paths]
├ ○ /services/an-pham-bao-bi/decal-nhan-mac                                   331 B           374 kB
├ ○ /services/an-pham-bao-bi/hop-san-pham                                     326 B           374 kB
├ ○ /services/an-pham-bao-bi/tem-bao-hanh                                     325 B           374 kB
├ ○ /services/an-pham-fb/phieu-ve-hoa-don-gtgt                                332 B           374 kB
├ ○ /services/an-pham-fb/san-pham-decor                                       323 B           374 kB
├ ○ /services/an-pham-fb/tam-lot-ban-an                                       327 B           374 kB
├ ○ /services/an-pham-fb/thiet-ke-in-menu                                     328 B           374 kB
├ ○ /services/an-pham-luu-niem/acrylic-magnet                                 334 B           375 kB
├ ○ /services/an-pham-luu-niem/in-anh-da-nang                                 335 B           375 kB
├ ○ /services/an-pham-luu-niem/in-postcard                                    332 B           375 kB
├ ○ /services/an-pham-luu-niem/moc-khoa-mica                                  343 B           375 kB
├ ○ /services/an-pham-luu-niem/pin-cai-ao-mica                                336 B           375 kB
├ ○ /services/an-pham-luu-niem/thank-card-gift-card                           338 B           375 kB
├ ○ /services/an-pham-su-kien/banner-standee                                  326 B           374 kB
├ ○ /services/an-pham-su-kien/hashtag-cam-tay                                 335 B           374 kB
├ ○ /services/an-pham-su-kien/huy-chuong                                      325 B           374 kB
├ ○ /services/an-pham-su-kien/poster-decal                                    330 B           374 kB
├ ○ /services/an-pham-su-kien/su-kien-tron-goi-da-nang                        331 B           374 kB
├ ○ /services/an-pham-tiep-thi/catalogue-brochure                             343 B           372 kB
├ ○ /services/an-pham-tiep-thi/in-card-visit                                  340 B           372 kB
├ ○ /services/an-pham-tiep-thi/voucher-ve-moi-su-kien-the-tich-diem-to-roi    349 B           372 kB
├ ○ /services/an-pham-van-phong/bang-cung-in-thong-tin                        339 B           371 kB
├ ○ /services/an-pham-van-phong/giay-khen-giay-chung-nhan                     340 B           371 kB
├ ○ /services/an-pham-van-phong/in-bi-thu                                     338 B           371 kB
├ ○ /services/an-pham-van-phong/so-tay-ky-yeu-so-bam-ghim                     343 B           371 kB
├ ○ /services/ca-nhan-hoa/skin-bat-lua-customize                              331 B           372 kB
├ ○ /services/ca-nhan-hoa/skin-dien-thoai-customize                           339 B           372 kB
├ ○ /services/ca-nhan-hoa/skin-laptop-customize                               337 B           372 kB
├ ○ /services/ca-nhan-hoa/skin-nut-phim-customize                             337 B           372 kB
├ ○ /services/sticker/sticker-diecut                                          325 B           374 kB
├ ○ /services/sticker/sticker-kisscut                                         334 B           374 kB
├ ○ /services/sticker/sticker-magnet                                          324 B           374 kB
├ ○ /services/sticker/sticker-pack                                            323 B           374 kB
└ ○ /services/sticker/sticker-sheet                                           324 B           374 kB
+ First Load JS shared by all                                                 337 kB
  ├ chunks/framework-d6cf9808660285db.js                                      45.5 kB
  ├ chunks/main-dda8a1e82d27ea6f.js                                           32.3 kB
  ├ chunks/pages/_app-daeb71865f5320ae.js                                     252 kB
  ├ chunks/webpack-e67ca9815c1f029e.js                                        3.11 kB
  └ css/413847526b67acb2.css                                                  4.32 kB

λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
○  (Static)  automatically rendered as static HTML (uses no initial props)
●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
   (ISR)     incremental static regeneration (uses revalidate in getStaticProps)


> inutdesign-web@3.1.0 postbuild /Users/tin.phamv/work/personal/inut-design
> next-sitemap --config next-sitemap.config.js && node scripts/verify-seo.mjs

Loaded env from /Users/tin.phamv/work/personal/inut-design/.env
✨ [next-sitemap] Loading next-sitemap config: file:///Users/tin.phamv/work/personal/inut-design/next-sitemap.config.js
✅ [next-sitemap] Generation completed
┌───────────────┬────────┐
│ (index)       │ Values │
├───────────────┼────────┤
│ indexSitemaps │ 0      │
│ sitemaps      │ 1      │
└───────────────┴────────┘
-----------------------------------------------------
 SITEMAPS
-----------------------------------------------------

   ○ https://inutdesign.com/sitemap.xml


🔍 SEO smoke test — /Users/tin.phamv/work/personal/inut-design


[robots.txt]
  ✓ Disallow: /*.avif$ present
  ✓ Disallow: /_next/image present
  ✓ Allow: / present
  ✓ Host: https://inutdesign.com present
  ✓ Sitemap: https://inutdesign.com/sitemap.xml present

[sitemap.xml]
  ✓ 226 URLs found in sitemap
  ✓ /search excluded from sitemap
  ✓ No query-parameter URLs in sitemap
  ✓ https://inutdesign.com in sitemap
  ✓ https://inutdesign.com/blog in sitemap
  ✓ https://inutdesign.com/contact in sitemap
  ✓ https://inutdesign.com/san-pham in sitemap
  ✓ https://inutdesign.com/san-pham/skin-laptop in sitemap
  ✓ https://inutdesign.com/san-pham/skin-nut-phim in sitemap
  ✓ https://inutdesign.com/services in sitemap

✅ All SEO smoke tests passed.
