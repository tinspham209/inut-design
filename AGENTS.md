# Inut Design — AI Bootstrap

Repository AI knowledge lives only in `.agents/skills/`. Read the matching
`SKILL.md` and task-specific references before work. Do not recreate editor
mirrors, prompt trees or custom agent wrappers. Client discovery varies; use an
explicit skill path when automatic discovery is unavailable.

## Safety

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

Customization checks: `rtk proxy bash scripts/validate-ai-config.sh`.
Operation/fallback: `docs/ai/DUAL_EDITOR_WORKFLOW.md`.

<!-- OPENWIKI:START -->

## OpenWiki

This repository has a generated `openwiki/` evidence index. It is optional just-in-time context, not required startup reading.

- Treat source code and tests as authoritative. A brief's unknowns and review items are verification gaps, not automatic requirements.
- Prefer the narrowest quiet validation that proves the changed behavior. Preserve complete failure output.

The scheduled OpenWiki GitHub Actions workflow refreshes the repository wiki. Do not hand-edit generated OpenWiki pages unless explicitly asked; prefer updating source code/docs and letting OpenWiki regenerate.

<!-- OPENWIKI:END -->
