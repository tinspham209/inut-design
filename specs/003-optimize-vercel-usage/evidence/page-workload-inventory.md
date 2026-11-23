# Page Function Workload Inventory

Baseline from the full repository audit at revision `206a986`; exact Production CPU and cache status are unknown until a Production-only Vercel sample is retained. Route rows are source-code modules, not individual dynamic slugs.

| Route | Module | Render / freshness | Source work (baseline audit) | Disposition |
|---|---|---|---|---|
| / | pages/index.tsx | ISR 300s | 4 Sanity reads + local blog list | P0; consolidate to 1 CMS operation |
| /contact | pages/contact/index.tsx | ISR 300s | 1 banner Sanity read | P0; static migration |
| /search | pages/search/index.tsx | SSR | 5 dynamic Sanity reads on cold corpus; local corpus assembly | P1; grouped read and 24h corpus |
| /creativa | pages/creativa/index.tsx | ISR 60s | 2 source reads | P1; 86400s |
| /creativa/skin-laptop | pages/creativa/skin-laptop/index.tsx | ISR 60s | 2 source reads | P1; 86400s |
| /creativa/skin-laptop/[slug] | pages/creativa/skin-laptop/[slug].tsx | ISR 60s; blocking fallback | 2 source reads | P1; 86400s; preserve fallback |
| /blog | pages/blog/index.tsx | ISR 300s | 1 banner read + local Markdown | P2; 600s |
| /san-pham/skin-laptop | pages/san-pham/skin-laptop/index.tsx | ISR 86400s | items/count + types + banner (4 calls) | P2; grouped read |
| /san-pham/skin-nut-phim | pages/san-pham/skin-nut-phim/index.tsx | ISR 86400s | items/count + types + banner (4 calls) | P2; grouped read |
| /san-pham/lighters | pages/san-pham/lighters/index.tsx | ISR 86400s | items/count + types + banner (4 calls) | P2; grouped read |
| /san-pham/skin-laptop/[slug] | pages/san-pham/skin-laptop/[slug].tsx | ISR 86400s; blocking fallback | 3–4 Sanity reads | P2; consolidate related content |
| /san-pham/skin-nut-phim/[slug] | pages/san-pham/skin-nut-phim/[slug].tsx | ISR 86400s; blocking fallback | 3–4 Sanity reads | P2; consolidate related content |
| /san-pham/lighters/[slug] | pages/san-pham/lighters/[slug].tsx | ISR 86400s; blocking fallback | 3–4 reads; duplicate type lookup | P2; reuse included type |
| /san-pham | pages/san-pham/index.tsx | SSG | Build-time data reads | Unchanged; not runtime ISR |
| /blog/[slug] | pages/blog/[slug].tsx | SSG; blocking fallback; no revalidate | Sanity post read + Markdown processing on build/first slug | Investigate; not a release target |
| /services | pages/services/index.tsx | SSG | Local route metadata | Unchanged; no runtime source read |
| /services/[...slug] | pages/services/[...slug].tsx | SSG; fallback false | Local route metadata | Unchanged; no runtime source read |

Final source audit after implementation: homepage uses one grouped Sanity operation plus local blog data; `/contact` is static with a repository-managed banner; `/blog` uses 600-second ISR and one banner read per regeneration; Creativa and product page freshness is 86,400 seconds; search is SSR with a grouped cold corpus read and 24-hour process cache. Product listings use one grouped read; laptop/Macnut detail success paths use primary plus grouped related/static read; lighter detail reuses included type details and uses two reads. These are local source/query-count findings, not Production invocation or CPU measurements.

Audit scope: the 17 modules are `/`, `/contact`, `/search`, `/creativa`, the two Creativa skin-laptop routes, `/blog`, `/blog/[slug]`, three product listings, three product details, `/san-pham`, `/services`, and `/services/[...slug]`. Source-read figures are source audit counts; where the implementation issues multiple reads based on a cache miss or related-content lookup, the range/condition is stated. Production invocation counts, CPU, cache state, and error rates remain `unknown` unless supplied by Vercel evidence.
