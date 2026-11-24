# Contract: Deployment, Preview & Release

## Allowed Sequence

```text
inspect & baseline
→ dependency peer lock
→ compatibility/source fixes
→ Next 15 build pass
→ Vinext local build/runtime pass
→ static artifact/index manifest pass
→ secret + Worker module-graph pass
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
pnpm --version # 11.5.3
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
| Package manager | `packageManager` pins pnpm 11.5.3, runtime reports 11.5.3, lockfile regenerates cleanly once, and frozen installs succeed in local and CI |
| Compatibility | Vinext 0 hard issues; all 3 partial areas have retained evidence |
| Dependency | No unexplained peer override or React 18/19 mix; MUI/Emotion, carousel, Fiber/Drei/Three and tooling units have focused evidence |
| Build | normal Next and Vinext production builds pass |
| Static manifests | 74-module route inventory, all approved slugs, redirects, sitemap and search-index schema reconcile to baseline/source |
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
| Secret migration | Old exposed Telegram token rotated; public credential names removed; browser and trusted internal/scheduler caller classes pass separate tests |
| Worker graph | No native `sharp`, build/test-only package, request-time filesystem/path module or disabled IMG.LY/ONNX asset in production graph |
| Cost | Paid mode remains preferred; the owner-approved 2026-11-24 Free-plan exception may continue while Cloudflare usage is healthy and monitoring/watch triggers are retained |
| Operations | operator completes deploy/verify/rollback drill in allowed time |

## Production Deploy Contract

Production deploy/cutover requires an explicit owner approval record referencing:
- preview URL and candidate/version;
- source commit;
- lockfile hash and dependency decision report;
- route/slug/API/search/redirect/sitemap/env-name manifest hashes;
- Worker module graph and artifact-size report;
- release-gate report;
- DNS inventory approval;
- account/zone/Workers readiness plus Paid-plan status or the owner-approved
  Free-plan exception and escalation trigger;
- spending policy;
- verified rollback point.

Deploy/cutover is an immediate hard cutover. There is no traffic split and Vercel is not a rollback target.

If preview and production use different build-time channel values, only the channel-specific `noindex` mechanism may differ. Every other manifest/output delta must be explained and rerun through the corresponding production-artifact smoke, SEO, security and route/API gates.

## Rollback Contract

On approved rollback:
1. identify the last verified Cloudflare version;
2. route back to that Cloudflare version;
3. restore approved DNS state only if DNS itself changed;
4. verify TLS, apex/`www`, canonical/sitemap, APIs and critical flows;
5. preserve incident logs without sensitive request/customer data.

Success criterion: restoration ≤15 minutes after approval, excluding DNS propagation outside operator control.

## Cost & Observability

- Workers Paid was the original baseline, but production is now live on Workers
  Free under an owner-approved 2026-11-24 exception. Upgrade becomes a TODO
  trigger when Cloudflare reports plan/quota/CPU warning, usage approaches Free
  limits, or reliability is affected.
- Model Worker request/CPU usage after full-static conversion; do not reuse Vercel function invocations as a direct bill proxy.
- Configure warning at $2 usage over base and hard usage block at $10, excluding $5 subscription.
- Configure Worker CPU/request and log-volume alerts.
- Optional Images/R2/KV/D1/DO/Queue services require a separately evidenced gate.

## Deployment Automation Contract

After implementation:
- a `workflow_dispatch` workflow is the minimum owner-triggered production automation;
- preview and production are distinct inputs/environments with explicit approval for production;
- Corepack/runner installs exact `pnpm@11.5.3` before setup and every install uses `--frozen-lockfile`;
- jobs have environment concurrency and do not overlap same-target builds;
- build logs mask all secrets and only print variable names on missing-config failure;
- output retains immutable deployment version/artifact identifiers;
- automatic Sanity webhook dispatch is out of scope until auth, replay and deduplication have a separate design.

## Prohibited During Feature Validation

- Real order or production Sanity write.
- Real Telegram/customer notification.
- Production customer upload/design persistence.
- Secret logging or bundle inclusion.
- DNS/nameserver/registrar modification from the planning command.
- Registrar unlock, auth-code request, submission or payment.
- Cloudflare account/product subscription action without explicit owner approval.
