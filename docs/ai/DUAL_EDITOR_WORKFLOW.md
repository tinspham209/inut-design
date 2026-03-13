# Multi Editor AI Workflow (GitHub Copilot + Antigravity + Codex)

This guide lets the team run one consistent AI workflow in:

- **VS Code + GitHub Copilot**
- **Antigravity Editor**
- **Codex IDE**

## Why this exists

Current `.github/*` assets are optimized for Copilot (agents, skills, prompt frontmatter). Antigravity and Codex can still follow the same behavior when we use:

1. Shared repo rules in `AGENTS.md`
2. Editor-agnostic prompt templates in `docs/ai/PORTABLE_PROMPTS.md`

## Quick start

### In VS Code Copilot

1. Keep using:
   - `.github/copilot-instructions.md`
   - `.github/instructions/*.instructions.md`
   - `.github/agents/*.agent.md`
   - `.github/skills/*/SKILL.md`
   - `.github/prompts/*.prompt.md`
2. For broad context portability, also keep `AGENTS.md` in repo root.

### In Antigravity Editor

1. Use `AGENTS.md` as your baseline project behavior.
2. Simply use the slash commands `/inut-design-workflow`, `/inut-content-writer`, etc. generated from `.agents/workflows/`! They work identically to Copilot skills.
3. Start tasks from `docs/ai/PORTABLE_PROMPTS.md` templates or the `/add-feature`, `/fix-bug` workflows.
4. Reuse the same guardrails (cart/checkout/Sanity/analytics/blog) and verification order.

### In Codex IDE

1. Use `AGENTS.md` as your baseline project behavior.
2. Ensure `.codex/{agents,prompts,skills,workflows}` are symlinked to `.agents/*`.
3. Use the same workflows and skills as Antigravity (they are identical files).

## Mapping table

| Intent                      | Copilot-native asset                     | Antigravity equivalent                                    | Codex equivalent                                          |
| --------------------------- | ---------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| Global repo rules           | `.github/copilot-instructions.md`        | `AGENTS.md`                                               | `AGENTS.md`                                               |
| Scoped coding rules         | `.github/instructions/*.instructions.md` | Follow referenced rules via `AGENTS.md` + this doc        | Follow referenced rules via `AGENTS.md` + this doc        |
| Specialized execution modes | `.github/agents/*.agent.md`              | `.agents/agents/*.agent.md`                               | `.codex/agents/*.agent.md`                                |
| Reusable task prompts       | `.github/prompts/*.prompt.md`            | `docs/ai/PORTABLE_PROMPTS.md` or `.agents/workflows/*.md` | `docs/ai/PORTABLE_PROMPTS.md` or `.codex/workflows/*.md`  |
| Workflow playbook           | `.github/skills/*/SKILL.md`              | `.agents/skills/*/SKILL.md`                               | `.codex/skills/*/SKILL.md`                                |

## Team operating model

For consistency across editors:

1. **Write requirements once** in issue/brief format.
2. **Run same prompt intent** (feature, bugfix, blog batch, checkout regression, product page automation).
3. **Use same verification standard** (`pnpm lint`, then `pnpm build` when needed, then manual QA for touched flow).
4. **Record assumptions and risk** in PR/commit notes.

## Notes

- Keep all trees aligned for native editor support:
   - `.github/*` for Copilot
   - `.agents/{agents,prompts,skills,workflows}/*` for Antigravity
   - `.codex/{agents,prompts,skills,workflows}/*` for Codex
- Canonical source is `.agents/*`; `.github/{agents,prompts,skills}` and `.codex/{agents,prompts,skills,workflows}` are symlinked mirrors.
- Keep `AGENTS.md` and `docs/ai/PORTABLE_PROMPTS.md` updated whenever prompts/workflows are changed.
