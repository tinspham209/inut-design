# Sanity usage optimization

- Catalog pages use explicit list projections plus separate GROQ page and count
  queries. Category/search filters remain in the existing query-string routes,
  with the existing client-side filter checks retained for compatibility.
- Public CMS reads use `api-client/sanity-browser.ts` without a token. Sanity
  writes and uploads run through server API routes and
  `api-client/sanity-server.ts`; configure `SANITY_TOKEN` as a server-only
  environment variable.
- `api-client/sanity-image.ts` owns width, `fit=max`, negotiated format, and
  quality presets. Product structured data intentionally emits one image.
- Raster checkout designs are validated at 10MB, resized to 2048px, and
  compressed to WebP before upload. SVG files remain vector data.
- Public catalog responses are edge-cacheable for five minutes. Shared SWR CMS
  reads use a five-minute deduplication window.

Manual QA still needed: verify a real checkout upload/order in the deployed
environment and confirm CDN cache headers with the production host.
