# Inut Design — AI Bootstrap

Repository AI knowledge lives only in `.agents/skills/`. Read the matching
`SKILL.md` and task-specific references before work. Do not recreate editor
mirrors, prompt trees or custom agent wrappers. Client discovery varies; use an
explicit skill path when automatic discovery is unavailable.

## Safety

- Follow `.specify/memory/constitution.md` for repository governance, evidence,
  protected contracts, privacy, and completion gates.
- Investigate first, preserve user changes, keep edits minimal and scoped.
- Never hardcode secrets or expose server tokens in browser code.
- Protect cart/checkout/contact: retain `inut-lighters-cart`, unique Sanity array
  `_key` values, and dual GA4 + Umami tracking without duplicate events.
- Use pnpm, existing patterns, `@/` imports and non-strict TypeScript.
- Ground product facts in sources; never invent prices, MOQ or delivery promises.

## Routing

Read `.agents/skills/<name>/SKILL.md`:

| Skill                          | Task                                                                        |
| ------------------------------ | --------------------------------------------------------------------------- |
| `inut-design-workflow`         | Frontend, Sanity, analytics, blog rendering, features, bugs, checkout audit |
| `inut-content-writer`          | Vietnamese product copy and blog batches                                    |
| `inut-product-page-automation` | New landing page from brief; draft-only requests                            |
| `product-page-generator`       | Existing `content.md` to typed product data/template route                  |
| `agent-browser-automation`     | Browser verification, screenshots, flow regression                          |
| `autoresearch`                 | Measurable optimization experiments, not ordinary fixes                     |
| `skill-creator`                | Create, improve or evaluate skills                                          |
| `migrate-to-vinext`            | Vinext compatibility and Cloudflare configuration                           |
| `inut-cloudflare-local-deploy` | Guarded local production release to Cloudflare and post-deploy smoke checks |

Customization checks: `rtk proxy bash scripts/validate-ai-config.sh`.
Operation/fallback: `docs/ai/DUAL_EDITOR_WORKFLOW.md`.