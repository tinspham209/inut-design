# Documentation index

Use this index as the current source of truth for maintained documentation.
Product code, tests and runtime configuration remain authoritative when a
document and implementation disagree.

## Current operations

- [Cloudflare release and rollback](operations/cloudflare-release.md)
- [Cloudflare DNS cutover](operations/cloudflare-dns-cutover.md)
- [Workers Free-first policy and future Paid TODO](operations/cloudflare-free-plan.md)
- [Cost and usage controls](operations/cloudflare-cost-controls.md)
- [Environment and post-deploy operations](operations/cloudflare-operations.md)
- [Registrar transfer boundary](operations/cloudflare-registrar-transfer.md)

## Product and architecture references

- [Analytics guide](ANALYTICS_GUIDE.md)
- [Analytics event map](ANALYTICS_EVENT_MAP.md)
- [Analytics migration record](ANALYTICS_MIGRATION.md) — historical
- [Sanity usage optimization](SANITY_USAGE_OPTIMIZATION.md)
- [Shipping fee flow](SHIPPING_FEE_FEATURE.md)
- [bfcache and speculation rules](bfcache-speculation-rules-performance.md)
- [Keychain builder release record](keychain-builder-release.md) — dated
  feature evidence with current release-gate notes
- [Sanity architecture](../sanity/docs/ARCHITECTURE.md)

## AI workflow

- [AI bootstrap](../AGENTS.md)
- [Portable task routing](ai/PORTABLE_PROMPTS.md)
- [Dual-editor workflow](ai/DUAL_EDITOR_WORKFLOW.md)
- [Deployment rollback for skills](ai/DEPLOYMENT_ROLLBACK.md)
- [Developer effectiveness](ai/DEVELOPER_EFFECTIVENESS.md)
- [MCP tooling](ai/MCP_TOOLING_GUIDE.md)
- [Canonical local Cloudflare deploy skill](../.agents/skills/inut-cloudflare-local-deploy/SKILL.md)

## Historical evidence

- `builder-promotion-evidence/` and `keychain-builder-evidence/` contain
  dated screenshots, browser runs and release observations. Keep them as
  evidence; do not treat them as current production status by date alone.
- `plans/` contains historical plans and audits. See its
  [status index](plans/README.md) before using a plan as implementation
  guidance.

The former duplicate blog prompt documents and generated OpenWiki snapshot were
removed because current canonical guidance lives in
`.agents/skills/inut-content-writer/` and
`.agents/skills/inut-design-workflow/references/blog-pipeline.md`.
