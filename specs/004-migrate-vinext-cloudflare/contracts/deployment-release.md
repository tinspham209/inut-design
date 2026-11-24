# Contract: Deployment, Preview & Release

## Allowed Sequence

```text
inspect & baseline
→ compatibility fixes
→ Next 15 build pass
→ Vinext local build/runtime pass
→ safe regression pass
→ deploy dry-run
→ preview deploy
→ preview release gate
→ explicit owner approval
→ production deploy
→ DNS hard cutover
→ stabilization
→ verified Cloudflare rollback point
```

The planning command stops before deploy, account upgrade, DNS and registrar actions.

## Build Interface

Expected commands after implementation:

```bash
pnpm lint
pnpm build
pnpm build:vinext
pnpm start:vinext -- --port <free-port>
pnpm dlx @vinext/cloudflare deploy --dry-run
```

Any required `NEXT_PUBLIC_*` value must exist at build time. Missing required values fail the build with a variable name only; values are never printed.

## Preview Contract

Before preview:
- Vinext config uses static asset/cache model with `--cdn-cache=none --data-cache=none`.
- `--image-optimization=none` is active.
- No R2/KV/D1/DO/Queue binding exists unless a separately approved gap is evidenced.
- Required Worker secrets are configured server-side.

Every preview response must:
- contain `X-Robots-Tag: noindex, nofollow`;
- retain canonical/sitemap URLs on `https://inutdesign.com`;
- avoid publishing preview hostname in SEO artifacts;
- reject disallowed origins;
- expose only non-secret operational errors.

## Mandatory Release Gates

| Gate | Pass Condition |
|---|---|
| Compatibility | Vinext 0 hard issues; all 3 partial areas have retained evidence |
| Build | normal Next and Vinext production builds pass |
| Routes | 100% route inventory status/content/metadata/redirect/header parity |
| APIs | 100% of 22 API contracts pass with 0 unsafe production side effect |
| Commerce | cart key, recalculated price/subtotal, order/contact/confirmation safe flows pass |
| Search | static index privacy/parity, browser interaction and no runtime `/api/search` call pass |
| Upload | browser transform + Worker validation + mocked persistence + visual check pass without `sharp` |
| Analytics | GA4/GTM + Umami exact-once and prohibited-field audit pass |
| Accessibility | keyboard, responsive, non-color cues, loading/empty/error and reduced motion pass |
| Runtime | 0 route/API timeout; Worker memory evidence below 128 MB; CPU/log anomalies resolved |
| Performance | ≥95% representative pages within +10% baseline |
| Security | 0 secret in client/source map/public response; validation/auth not weakened |
| Cost | Workers Paid/spend controls/alerts configured before production; modeled total ≤ approved range |
| Operations | operator completes deploy/verify/rollback drill in allowed time |

## Production Deploy Contract

Production deploy/cutover requires an explicit owner approval record referencing:
- preview URL and candidate/version;
- source commit;
- release-gate report;
- DNS inventory approval;
- account/zone/Workers Paid readiness;
- spending policy;
- verified rollback point.

Deploy/cutover is an immediate hard cutover. There is no traffic split and Vercel is not a rollback target.

## Rollback Contract

On approved rollback:
1. identify the last verified Cloudflare version;
2. route back to that Cloudflare version;
3. restore approved DNS state only if DNS itself changed;
4. verify TLS, apex/`www`, canonical/sitemap, APIs and critical flows;
5. preserve incident logs without sensitive request/customer data.

Success criterion: restoration ≤15 minutes after approval, excluding DNS propagation outside operator control.

## Cost & Observability

- Workers Paid is required before production.
- Model Worker request/CPU usage after full-static conversion; do not reuse Vercel function invocations as a direct bill proxy.
- Configure warning at $2 usage over base and hard usage block at $10, excluding $5 subscription.
- Configure Worker CPU/request and log-volume alerts.
- Optional Images/R2/KV/D1/DO/Queue services require a separately evidenced gate.

## Prohibited During Feature Validation

- Real order or production Sanity write.
- Real Telegram/customer notification.
- Production customer upload/design persistence.
- Secret logging or bundle inclusion.
- DNS/nameserver/registrar modification from the planning command.
- Registrar unlock, auth-code request, submission or payment.
- Cloudflare account/product subscription action without explicit owner approval.
