# Baseline Production Build Route Summary

- Captured before implementation on 2026-11-23 from `rtk pnpm build`.
- Exit status: 0.
- This is a local build classification, not Production CPU evidence.
- The build generated 233 pages; `/contact` was ISR 300 seconds and `/` plus `/blog` were ISR 300 seconds in this baseline.

## Full command output

```text

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
┌ ● / (ISR: 300 Seconds) (819 ms)                                             1.4 kB          390 kB
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
├ ● /blog (ISR: 300 Seconds) (443 ms)                                         2.5 kB          391 kB
├ ● /blog/[slug] (60485 ms)                                                   2.82 kB         335 kB
├   ├ /blog/dan-skin-laptop-tai-da-nang (1779 ms)
├   ├ /blog/dan-skin-macbook-tai-da-nang (1740 ms)
├   ├ /blog/bao-quan-laptop-ton-hon-voi-skin-decal (1696 ms)
├   ├ /blog/skin-laptop-danang (1688 ms)
├   ├ /blog/tai-sao-nen-dan-skin-cho-laptop (1644 ms)
├   ├ /blog/top-5-dich-vu-dan-skin-laptop-da-nang-uy-tin (1582 ms)
├   ├ /blog/xu-huong-skin-laptop-da-nang-hot-nhat (1493 ms)
├   └ [+119 more paths] (avg 411 ms)
├ ○ /builder                                                                  2.23 kB         391 kB
├ ○ /builder/keychain                                                         690 B           333 kB
├ ○ /builder/lighters                                                         1.36 kB         334 kB
├ ○ /cart/lighters                                                            2.6 kB          366 kB
├ ○ /checkout/lighters                                                        36.1 kB         401 kB
├ ● /contact (ISR: 300 Seconds)                                               3.16 kB         392 kB
├ ○ /contact/form                                                             8.74 kB         415 kB
├ ● /creativa (ISR: 60 Seconds) (573 ms)                                      6.21 kB         367 kB
├ ○ /creativa/cart                                                            5.38 kB         367 kB
├ ○ /creativa/checkout                                                        10 kB           395 kB
├ ○ /creativa/order-tracking                                                  4.46 kB         342 kB
├ ○ /creativa/order-tracking/[slug]                                           18.4 kB         394 kB
├ ● /creativa/skin-laptop (ISR: 60 Seconds) (873 ms)                          9.75 kB         368 kB
├ ● /creativa/skin-laptop/[slug]                                              13.9 kB         383 kB
├ ○ /creativa/skin-laptop/huong-dan-su-dung                                   2.96 kB         336 kB
├ ○ /creativa/skin-laptop/huong-dan-su-dung/cach-tu-dan-skin-macbook-tai-nha  8.82 kB         344 kB
├ ○ /order-tracking                                                           5.6 kB          344 kB
├ ○ /order-tracking/lighters/[slug]                                           12.8 kB         387 kB
├ ○ /policies-terms                                                           4.87 kB         337 kB
├ ○ /policies-terms/chinh-sach-bao-hanh-doi-tra                               6.95 kB         340 kB
├ ○ /policies-terms/chinh-sach-bao-ve-thong-tin-khach-hang                    5.82 kB         338 kB
├ ○ /policies-terms/chinh-sach-duyet-in-va-san-xuat                           5.35 kB         338 kB
├ ○ /policies-terms/dieu-khoan-su-dung                                        7.23 kB         340 kB
├ ○ /policies-terms/faqs                                                      2.49 kB         337 kB
├ ○ /policies-terms/thong-tin-doanh-nghiep                                    4.94 kB         338 kB
├ ○ /policies-terms/thong-tin-thanh-toan                                      6.82 kB         365 kB
├ ● /san-pham                                                                 1.45 kB         341 kB
├ ● /san-pham/lighters (ISR: 86400 Seconds) (582 ms)                          12.6 kB         401 kB
├ ● /san-pham/lighters/[slug] (ISR: 86400 Seconds) (9816 ms)                  12.5 kB         410 kB
├   ├ /san-pham/lighters/bat-lua-in-chrome-bong-mau-than-thoai-nam (1244 ms)
├   ├ /san-pham/lighters/bat-lua-in-chrome-bong-mau-cool (1176 ms)
├   ├ /san-pham/lighters/bat-lua-in-tthuong-mau-vangogh-mot (1036 ms)
├   ├ /san-pham/lighters/bat-lua-mini-in-thuong-mau-chin (1026 ms)
├   ├ /san-pham/lighters/bat-lua-in-chrome-bong-mau-stussy-mot (1003 ms)
├   ├ /san-pham/lighters/bat-lua-in-chrome-bong-mau-than-thoai-mot (999 ms)
├   ├ /san-pham/lighters/bat-lua-in-tthuong-mau-vangogh-muoi-mot (962 ms)
├   └ [+3 more paths] (avg 790 ms)
├ ● /san-pham/skin-laptop (ISR: 86400 Seconds) (561 ms)                       3.26 kB         373 kB
├ ● /san-pham/skin-laptop/[slug] (ISR: 86400 Seconds) (4337 ms)               9.01 kB         375 kB
├   └ css/05e6f8cb0e2f7ff4.css                                                1.53 kB
├   ├ /san-pham/skin-laptop/don-gian-simple-5 (616 ms)
├   ├ /san-pham/skin-laptop/hoa-la-3 (442 ms)
├   ├ /san-pham/skin-laptop/skate (440 ms)
├   ├ /san-pham/skin-laptop/retro-2-8bit (436 ms)
├   ├ /san-pham/skin-laptop/tim-cute (434 ms)
├   ├ /san-pham/skin-laptop/mau-sac-2 (407 ms)
├   ├ /san-pham/skin-laptop/meo-di-hoc (401 ms)
├   └ [+3 more paths] (avg 387 ms)
├ ● /san-pham/skin-nut-phim (ISR: 86400 Seconds) (463 ms)                     3 kB            373 kB
├ ● /san-pham/skin-nut-phim/[slug] (ISR: 86400 Seconds) (7397 ms)             9.03 kB         375 kB
├   └ css/837fb84ec13ed589.css                                                1.53 kB
├   ├ /san-pham/skin-nut-phim/chiem-tinh-01 (850 ms)
├   ├ /san-pham/skin-nut-phim/spirited-away (841 ms)
├   ├ /san-pham/skin-nut-phim/apple (827 ms)
├   ├ /san-pham/skin-nut-phim/nascar-01 (818 ms)
├   ├ /san-pham/skin-nut-phim/retro-04 (817 ms)
├   ├ /san-pham/skin-nut-phim/gundam-04 (811 ms)
├   ├ /san-pham/skin-nut-phim/retro-05 (811 ms)
├   └ [+3 more paths] (avg 541 ms)
├ λ /search                                                                   4.82 kB         340 kB
├ ● /services                                                                 1.26 kB         341 kB
├ ● /services/[...slug] (378 ms)                                              6.1 kB          345 kB
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
  ├ chunks/pages/_app-6ec64ad86e724c31.js                                     252 kB
  ├ chunks/webpack-15b2b7ece57caaa4.js                                        3.11 kB
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


```
