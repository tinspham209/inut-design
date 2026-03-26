# Comprehensive Implementation Plan: Umami Performance Monitoring

This document outlines the phased rollout strategy for integrating a Performance Tab into the Umami analytics platform, capturing and visualizing Core Web Vitals (LCP, FID, CLS, FCP, TTFB).

---

## Phase 1: Client-Side Integration (Completed)

Captured Core Web Vitals using the `web-vitals` library and routed them to Umami via custom events.

### Implementation Details
- **Library**: `web-vitals` (v4+)
- **Utility**: `utils/vitals.ts` captures metrics and sends them to Umami.
- **Integration**: Wired into `pages/_app.tsx` using a `useEffect` hook to ensure it runs on every page load/hydration.
- **Metric Normalization**: CLS (Cumulative Layout Shift) is multiplied by 1000 and rounded to an integer to fit into Umami's numeric event value storage.

---

## Phase 2: Database Schema Extensions

To store performance metrics efficiently without impacting the performance of standard event queries, we propose a dedicated table.

### Schema Design (Prisma)
```prisma
model PerformanceEvent {
  id             String   @id @default(cuid())
  websiteId      String
  sessionId      String
  url            String
  metricName     String   // LCP, FID, CLS, FCP, TTFB
  metricValue    Int      // Stored in ms (or unitless * 1000 for CLS)
  createdAt      DateTime @default(now())

  website        Website  @relation(fields: [websiteId], references: [id])

  @@index([websiteId, createdAt])
  @@index([metricName])
  @@index([url])
}
```

### Indexing Strategy
- Composite index on `[websiteId, createdAt]` for fast dashboard loading.
- Index on `metricName` to filter by specific vitals.
- Index on `url` for page-level performance analysis.

---

## Phase 3: API Endpoints

### 1. Ingestion Endpoint
Extend the existing `/api/send` endpoint to handle a new event type `performance`.

- **Payload**:
  ```json
  {
    "type": "performance",
    "payload": {
      "website": "uuid",
      "name": "LCP",
      "data": { "value": 2500, "url": "/products/skin-laptop" }
    }
  }
  ```

### 2. Retrieval & Aggregation Endpoint
`GET /api/websites/:id/performance`

- **Query Parameters**: `startAt`, `endAt`, `url`, `metric`.
- **Logic**: Use SQL aggregation to calculate percentiles (p50, p75, p95).
- **Pagination**: Implement cursor-based pagination for raw event drill-downs.

---

## Phase 4: Frontend Performance Tab UI

### 1. Dashboard Integration
- Add a "Performance" navigation item in the Website settings/dashboard.
- Use **MUI v5** and **Chart.js** (existing Umami stack) for visualization.

### 2. Components
- **Summary Cards**: Display current p75 for LCP, FID, CLS with color-coded status (Good, Needs Improvement, Poor).
- **Time-series Chart**: Visual trend of metrics over the selected time range.
- **Page Breakdown Table**: Sortable list of URLs by worst-performing metric.

---

## Phase 5: Data Retention & Cleanup

### 1. Retention Policy
Performance data is high-volume. We recommend a shorter retention period than standard events (e.g., 30-90 days).

### 2. Automated Cleanup
Implement a background job (using `node-cron` or Vercel Cron) to prune old records:
```sql
DELETE FROM PerformanceEvent WHERE createdAt < NOW() - INTERVAL '30 days';
```

---

## Phase 6: Testing & Validation

### 1. Metric Accuracy
- Compare `web-vitals` output in DevTools with captured events in the database.
- Verify CLS normalization logic (value * 1000).

### 2. API Reliability
- Load test the `/api/send` endpoint to ensure high-frequency performance events don't degrade ingestion speed.
- Test aggregation query performance with 1M+ rows.

### 3. UI Responsiveness
- Ensure charts render correctly with large datasets using data downsampling.

---

## Phase 7: Deployment & Monitoring

### 1. Deployment Steps
1. Run database migration (`npx prisma migrate deploy`).
2. Deploy backend API updates.
3. Deploy frontend UI updates.
4. Deploy client-side `web-vitals` tracking (already implemented in this repo).

### 2. Real-time Alerts
Configure alerts (e.g., via Telegram or Slack) when the p75 of a metric exceeds the "Poor" threshold:
- LCP > 4000ms
- CLS > 0.25
- FID > 300ms

### 3. Rollback Strategy
- **Database**: Revert migration if ingestion fails.
- **Client**: Disable `ENABLE_WEB_VITALS` environment variable to stop client-side reporting without a redeploy.
