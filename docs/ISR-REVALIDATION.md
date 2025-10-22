# ISR, On-Demand Revalidation & Live Meta Layer

> This document explains the strategy for combining Next.js Incremental Static Regeneration (ISR), on-demand revalidation, dynamic TTLs per product type, and a lightweight SWR client meta layer for volatile data.

## 1. Goals

- Fast initial loads via static HTML (CDN cached)
- Immediate propagation of critical content changes (webhook-triggered revalidation)
- Different regeneration cadences per product type (lighter vs laptop skin vs blog)
- Small client-side overlay (SWR) for truly volatile attributes (stock / promo / ephemeral flags)
- Maintain SEO integrity (stable HTML + structured data)

---
## 2. On-Demand Revalidation API Route

Create an API route to revalidate specific paths after Sanity content updates.

**File:** `pages/api/revalidate.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from "next";

// Add to .env.local: REVALIDATE_SECRET=superlongrandomvalue
const SECRET = process.env.REVALIDATE_SECRET;

type SanityWebhookBody = {
  _id?: string;
  _type?: string;
  slug?: { current?: string };
};

function verifySecret(req: NextApiRequest): boolean {
  if (!SECRET) return true; // If secret not set, allow (dev only)
  return req.query.secret === SECRET;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  if (!verifySecret(req)) {
    return res.status(401).json({ ok: false, error: "Invalid secret" });
  }

  try {
    const body = req.body as SanityWebhookBody;
    const paths: string[] = [];

    // Map Sanity document types to site paths
    if (body._type === "lighters" && body.slug?.current) {
      paths.push(`/lighters/${body.slug.current}`);
      paths.push("/lighters"); // Listing potentially affected
    }

    if (body._type === "products" && body.slug?.current) {
      paths.push(`/products/${body.slug.current}`);
      paths.push("/products");
    }

    // Manual override: /api/revalidate?secret=...&path=/custom/path
    if (req.query.path) {
      const raw = Array.isArray(req.query.path) ? req.query.path : [req.query.path];
      raw.forEach((p) => typeof p === "string" && paths.push(p));
    }

    const distinct = [...new Set(paths)];
    if (!distinct.length) {
      return res.status(200).json({ ok: true, skipped: true, reason: "No paths derived" });
    }

    // Optional debounce (avoid bursts)
    const results: { path: string; status: "ok" | "fail"; error?: string }[] = [];
    for (const path of distinct) {
      try {
        await res.revalidate(path);
        results.push({ path, status: "ok" });
      } catch (e: any) {
        results.push({ path, status: "fail", error: e?.message || "Unknown" });
      }
    }

    const failed = results.filter((r) => r.status === "fail");
    return res.status(failed.length ? 500 : 200).json({ ok: failed.length === 0, results });
  } catch (error: any) {
    return res.status(500).json({ ok: false, error: error?.message || "Unhandled error" });
  }
}
```

**Sanity Webhook Setup (UI):**
1. Studio → Project Settings → API → Webhooks
2. URL: `https://YOUR_DOMAIN/api/revalidate?secret=REVALIDATE_SECRET`
3. Filter document types: `lighters`, `products` (add others as needed)
4. Trigger events: Create, Update, Delete (usually skip draft events)
5. Save.

**Manual Test:**
```bash
curl -X POST "http://localhost:3000/api/revalidate?secret=REVALIDATE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"_type":"lighters","slug":{"current":"test-2"}}'
```

---
## 3. Dynamic Revalidation Strategy per Product Type

Instead of a single `revalidate: 86400` (24h), return different intervals based on product category.

**File:** `utils/revalidateStrategy.ts`
```typescript
export function resolveRevalidateSeconds(productType?: string): number {
  if (!productType) return 43200; // Default 12h
  const t = productType.toLowerCase();
  if (t === "lighter") return 3600;          // 1h (changes more frequently)
  if (t.includes("skin")) return 21600;       // 6h (moderate)
  if (t === "legacy") return 86400;          // 24h (rarely changes)
  return 43200;                                // Fallback 12h
}
```

**Usage in `getStaticProps`:**
```typescript
import { resolveRevalidateSeconds } from "@/utils/revalidateStrategy";

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  // ...fetch lighter, lighterType
  const revalidateSeconds = resolveRevalidateSeconds(lighterType?.name);
  return { props: { lighter, lighters: filtered, lighterType }, revalidate: revalidateSeconds };
};
```

**Layering With Webhooks:**
- Use longer base TTL (6–24h) for steady cache.
- Trigger immediate revalidation via webhook for urgent changes.
- Avoid setting extremely low base TTL unless absolutely needed (cost & churn).

**Example Matrix:**
| Product Kind  | Volatility | Base ISR | Webhook  | SWR Meta |
| ------------- | ---------: | -------: | :------: | :------: |
| Lighters      |       High |       1h |   Yes    |   Yes    |
| Laptop Skins  |     Medium |    6–12h | Optional |  Maybe   |
| Blog Posts    |        Low |      24h |    No    |    No    |
| Promo Bundles |      Burst |       5m |   Yes    |   Yes    |

---
## 4. Light Volatile Data Layer (ISR + SWR)

Use ISR for main product payload and a small SWR fetch for live fields (e.g., stock, ephemeral promo). This avoids regenerating HTML for minimal changes.

**API Route:** `pages/api/product-meta.ts`
```typescript
import type { NextApiRequest, NextApiResponse } from "next";
import { lightersApi } from "@/api-client/lighters";

// Simple in-memory cache (process-level). Adjust for production clustering.
const cache = new Map<string, { ts: number; data: any }>();
const TTL_MS = 30_000; // 30s soft cache

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query.slug;
  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Missing slug" });
  }

  const now = Date.now();
  const cached = cache.get(slug);
  if (cached && now - cached.ts < TTL_MS) {
    res.setHeader("X-Meta-Cache", "HIT");
    return res.status(200).json(cached.data);
  }

  try {
    const lighter = await lightersApi.getLighterWithTypeBySlug(slug);
    if (!lighter) return res.status(404).json({ error: "Not found" });

    // Example volatile fields (replace with real sources)
    const liveData = {
      slug,
      updatedAt: lighter._updatedAt,
      stock: Math.floor(Math.random() * 40) + 5, // Replace with actual inventory
      promoActive: false,
      hash: Buffer.from((lighter._updatedAt || "")).toString("base64").slice(0, 12),
    };

    cache.set(slug, { ts: now, data: liveData });
    res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
    return res.status(200).json(liveData);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Server Error" });
  }
}
```

**Hook Usage:**
```typescript
import useSWR from "swr";

function useProductMeta(slug: string) {
  return useSWR(
    slug ? `/api/product-meta?slug=${encodeURIComponent(slug)}` : null,
    (url) => fetch(url).then((r) => r.json()),
    {
      refreshInterval: 60_000, // 60s
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    }
  );
}

// In component
const { data: meta } = useProductMeta(lighter.slug.current);
<Typography variant="body2" color="text.secondary">
  {meta ? `Kho: ~${meta.stock} cái` : "Đang tải tồn kho..."}
</Typography>
```

**Why This Pattern:**
- HTML stays cacheable & SEO-friendly.
- Volatile bits update seamlessly post-hydration.
- Avoid heavy regeneration for small changes.

---
## 5. Structured Data & SEO

Continue embedding product JSON-LD in the static HTML (already implemented in page). Only use SWR data for non-critical UX hints (avoid shifting SEO-relevant content dynamically).

---
## 6. Security & Reliability

- Protect `/api/revalidate` with a secret (never expose publicly).
- Limit webhook document types to only those affecting rendered pages.
- Consider request logging & monitoring (Sentry/DataDog) for failed revalidations.
- Optional debounce to prevent rapid repeat revalidation bursts.

**Debounce Example (inline in revalidate.ts):**
```typescript
const lastTrigger = new Map<string, number>();
const MIN_INTERVAL = 10_000; // 10s

for (const path of distinct) {
  const prev = lastTrigger.get(path) || 0;
  if (Date.now() - prev < MIN_INTERVAL) continue; // skip duplicate
  lastTrigger.set(path, Date.now());
  await res.revalidate(path);
}
```

---
## 7. Implementation Checklist

| Step                                    | Status | Notes                  |
| --------------------------------------- | ------ | ---------------------- |
| Create `pages/api/revalidate.ts`        | ☐      | Webhook endpoint       |
| Add `REVALIDATE_SECRET` to `.env.local` | ☐      | Keep secret safe       |
| Configure Sanity webhooks               | ☐      | Map doc types → routes |
| Add `utils/revalidateStrategy.ts`       | ☐      | Dynamic TTL logic      |
| Integrate strategy in `getStaticProps`  | ☐      | Use per product type   |
| Create `pages/api/product-meta.ts`      | ☐      | Volatile meta data     |
| Add `useProductMeta` hook               | ☐      | Client fetch overlay   |
| Display meta (stock/promo) in UI        | ☐      | Non-blocking UX        |
| Add monitoring/logging                  | ☐      | Track failures         |
| (Optional) Debounce revalidation        | ☐      | Avoid spam             |

---
## 8. Suggested Defaults

| Page                | Base `revalidate` | SWR Overlay | Webhook |
| ------------------- | ----------------: | ----------: | :-----: |
| `/lighters/[slug]`  |              3600 |         Yes |   Yes   |
| `/lighters` listing |              7200 |          No |   Yes   |
| `/products/[slug]`  |             21600 |       Maybe |   Yes   |
| `/blog/[slug]`      |             86400 |          No |   No    |
| Home `/`            |             14400 |       Maybe |   Yes   |

---
## 9. Future Enhancements

- Use On-Demand Revalidation + webhook payload diffing (only revalidate pages actually impacted)
- Introduce ETags to `/api/product-meta` and conditional requests
- Migrate to App Router (if planned) and use route handlers with `unstable_revalidateTag`
- Persist meta cache in Redis for multi-instance environments

---
## 10. Quick Reference Snippets

**Trigger Revalidation Manually:**
```bash
curl -X POST "https://yourdomain.com/api/revalidate?secret=REVALIDATE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"_type":"lighters","slug":{"current":"test-2"}}'
```

**Resolve Dynamic TTL in Page:**
```typescript
const revalidateSeconds = resolveRevalidateSeconds(lighterType?.name);
return { props: { lighter, lighterType, lighters }, revalidate: revalidateSeconds };
```

**Client Meta Hook:**
```typescript
const { data: meta, isValidating } = useProductMeta(slug);
```

---
## 11. Summary

This strategy balances performance, freshness, and maintainability:
- ISR provides cached speed
- Webhooks deliver immediacy
- Dynamic TTL reduces unnecessary rebuilds
- SWR meta avoids full page regeneration for volatile data

Adopt incrementally: start with revalidate API + dynamic TTL, then layer SWR meta only if a real volatility need emerges.

---
**Ready for implementation.**
