# Inut Design Sanity CMS

Web-admin: https://inut-design.sanity.studio/

# Tech-stack
- Sanity v2

# Setup

```
nvm use 22
pnpm i
pnpm start

// localhost:3000
```

# Change dataset
- access to [./sanity.json](./sanity.json)
- update field `api.dataset` to `dev|production`


# Deployment

```
sanity login
sanity deploy
```

# Scripts

All helper scripts live in [`./scripts/`](./scripts/).

## Generate submission/order reports

`report.mjs` generates a markdown report for a given form type and date range. Output is saved to `./reports/{form}-{start}-{end}.md`.

### Prerequisites

Create `sanity/.env` with a read token:

```env
SANITY_TOKEN=sk...
```

> Get a token from https://manage.sanity.io/ → API → Tokens.

### Default usage

Run without arguments to generate a combined report for the current month:

```bash
node scripts/report.mjs
```

### Filter by form type

```bash
node scripts/report.mjs --form=all
node scripts/report.mjs --form=ordersLighter
node scripts/report.mjs --form=lighter
```

Supported values:

| `--form`                    | Sanity document type | title field    | notes field                       |
| --------------------------- | -------------------- | -------------- | --------------------------------- |
| `all` (default)             | both forms above     | —              | —                                 |
| `quote`                     | `form-nhan-bao-gia`  | `customerName` | `usagePurpose` (fallback `notes`) |
| `ordersLighter` / `lighter` | `ordersLighter`      | `orderNumber`  | `status`                          |

### Filter by date range

```bash
node scripts/report.mjs --form=quote --start=2026-07-01 --end=2026-07-31
```

Dates are interpreted in Vietnam time (`Asia/Ho_Chi_Minh`). The output table is also shown in Vietnam time.

### Combined report for both forms

```bash
node scripts/report.mjs --form=all
node scripts/report.mjs --form=all --start=2026-07-01 --end=2026-07-31
```

Output file: `./reports/all-{start}-{end}.md`.

### Report output

Example `./reports/quote-2026-07-01-2026-07-31.md`:

```markdown
form: Form Nhận Báo Giá 📝
start: 2026-07-01 00:00
end: 2026-07-31 23:59
total records: 14

## Form Nhận Báo Giá 📝 (14 records)

| date             | title      | notes            |
| ---------------- | ---------- | ---------------- |
| 2026-07-24 17:50 | Hoàng Linh | macnut-customize |
```

Combined report example `./reports/all-2026-07-01-2026-07-31.md`:

```markdown
form: All Reports
start: 2026-07-01 00:00
end: 2026-07-31 23:59
total records: 35

## Form Nhận Báo Giá 📝 (14 records)

| date             | title      | notes            |
| ---------------- | ---------- | ---------------- |
| 2026-07-24 17:50 | Hoàng Linh | macnut-customize |

## Orders - Lighters 🔥 (21 records)

| date             | title                   | notes   |
| ---------------- | ----------------------- | ------- |
| 2026-07-24 22:57 | LIGHTER-202607242257446 | pending |
```

## Backfill createdAt for existing quote submissions

If you add the `createdAt` field to `form-nhan-bao-gia` after submissions already exist, run the migration script to copy Sanity's system `_createdAt` into the editable field.

```bash
# Dry run first
SANITY_TOKEN=sk... node scripts/migrate-form-nhan-bao-gia-created-at.mjs

# Apply changes
DRY_RUN=false SANITY_TOKEN=sk... node scripts/migrate-form-nhan-bao-gia-created-at.mjs
```

