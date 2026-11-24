---
name: inut-cloudflare-local-deploy
description: "Deploy INUT Design production to Cloudflare Workers from the local machine with the repository's guarded release flow. Use this skill whenever the user asks to deploy, release, publish, ship, promote, or re-deploy the current INUT Design work to Cloudflare/inutdesign.com from local, including shorthand such as 'release local', 'deploy local CF', 'pnpm release:local', or 'đẩy bản production hiện tại lên Cloudflare'."
compatibility: "Requires pnpm 11.5.3, Cloudflare CLI authentication for this repository, the required build-time environment values, and network access."
---

# INUT Cloudflare local production deploy

Use the repository's existing release scripts instead of recreating a deploy
pipeline. The canonical local production command is:

```bash
pnpm release:local && pnpm deploy:vinext
```

This deploys the current worktree to the `inutdesign-web` Cloudflare Worker. It
does not replace DNS, registrar, Worker custom-domain, or account-plan
configuration.

## Before running

1. Read:
   - [release runbook](../../../docs/operations/cloudflare-release.md)
   - [Free-plan policy](../../../docs/operations/cloudflare-free-plan.md)
   - `package.json` scripts
2. Confirm the task is for production. If the user asks for preview instead, do
   not improvise a channel switch; inspect the GitHub preview workflow and keep
   the local production workflow out of that request.
3. Record the current commit and `git status --short`. Preserve unrelated worktree
   changes and never commit them as part of a deploy.
4. Verify exact tooling and Cloudflare access:

   ```bash
   pnpm --version
   pnpm exec cf auth whoami
   ```

   Require pnpm `11.5.3` and a working Cloudflare identity. If authentication is
   missing, run `pnpm exec cf auth login` only when the user has requested local
   deployment.
5. Set production build context without printing secret values:

   ```bash
   export DEPLOYMENT_CHANNEL=production
   export NEXT_PUBLIC_SITE_URL=https://inutdesign.com
   ```

   Let `.env`/`.env.local` and Worker secrets supply the rest. Never echo, copy,
   or commit secret values.

## Deploy

1. Run the guarded release chain from the repository root:

   ```bash
   pnpm release:local && pnpm deploy:vinext
   ```

   Do not run `pnpm deploy:vinext` if `release:local` fails. Its release gate
   already covers frozen install, lint, type-check, Next and Vinext builds, safe
   regressions, secret scan, Worker graph, manifests, preview SEO, and deploy
   dry-run.
2. Treat the deploy as an external effect. If the terminal times out or the
   command result is uncertain, inspect the Cloudflare deployment/version state
   before retrying; do not blindly run the deploy a second time.
3. Capture only sanitized release evidence:
   - source commit;
   - Cloudflare `Current Version ID`;
   - gate/build pass status;
   - final deploy URL;
   - verification timestamps.

## Verify before reporting success

Run read-only smoke checks against all active production hosts:

```bash
curl -fsS -o /dev/null -w '%{http_code}\n' https://inutdesign.com/
curl -fsS -o /dev/null -w '%{http_code}\n' https://www.inutdesign.com/
curl -fsS -o /dev/null -w '%{http_code}\n' https://inutdesign.com/search
curl -fsS -o /dev/null -w '%{http_code}\n' https://inutdesign.com/san-pham/lighters
curl -fsS -o /dev/null -w '%{http_code}\n' https://inutdesign.com/creativa
```

All must return `200`. Check `https://inutdesign-web.inutdesign.workers.dev/`
only as the Worker fallback, not as the public canonical host.

Do not submit real orders, create real contacts, upload customer data, or send
notifications merely to smoke-test a deploy. Use the completed safe regression
evidence from `release:local` for protected write flows.

## Free-plan and rollback rules

- Production currently uses Workers Free under the owner-approved exception.
  Do not subscribe to Workers Paid or change spend controls automatically.
- Note a Cloudflare quota/CPU/plan warning as a pending Paid-upgrade action.
- Never change DNS, nameservers, registrars, or healthy custom-domain mappings
  after an application deploy.
- If application smoke checks fail, keep DNS/TLS intact, identify the previous
  verified Cloudflare version, and follow the runbook's Worker-only rollback.
  Do not route rollback to Vercel.

## Final response

Report:

- deployed commit and Cloudflare version;
- whether `release:local` and deploy passed;
- HTTP status for apex, `www`, search, lighter and Creativa;
- any warning or pending manual action;
- rollback instruction only when a failure requires it.

Do not claim production success from a successful build or deploy command alone;
the post-deploy smoke checks must pass.
