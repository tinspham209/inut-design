# Multi Editor AI Workflow (Copilot + Trae + Antigravity + Codex)

This guide lets the team run one consistent AI workflow in:

- **VS Code + GitHub Copilot**
- **Trae IDE** (AI-native)
- **Antigravity Editor**
- **Codex IDE**

## Why this exists

Current instructions and assets are centralized in `.agents/` to ensure all AI tools follow the same behavior when we use:

1. Shared repo rules in `AGENTS.md` and `.agents/instructions/global-rules.md`
2. Editor-agnostic prompt templates in `docs/ai/PORTABLE_PROMPTS.md`

## Quick start

### In Trae IDE

1. Trae automatically picks up project context.
2. Root symlinks `.cursorrules` and `.traerules` provide the global baseline from `.agents/instructions/global-rules.md`.
3. Use Trae's built-in search and context tools; they are already optimized for this structure.
4. **Governance & File Creation**:
   - **STRICT PROHIBITION**: Do NOT create new files directly in `.trae/`.
   - **MANDATORY**: Create all new skills, prompts, and instructions exclusively in the `.agents/` directory structure.
   - **Synchronization**: Skills and prompts are symlinked from `.agents/` to `.trae/`. Trae will see them via these links, but the source of truth remains in `.agents/`.
5. **Skills and Prompts**: Trae skills are symlinked from `.agents/skills` to `.trae/skills`, and prompts from `.agents/prompts` to `.trae/prompts`. Always edit the source in `.agents/`.

### In VS Code Copilot

1. Native assets are symlinked in `.github/`:
   - `.github/copilot-instructions.md` -> `.agents/instructions/global-rules.md`
   - `.github/instructions/` -> `.agents/instructions/`
   - `.github/agents/`, `.github/skills/`, `.github/prompts/` -> `.agents/` equivalents.
2. For broad context portability, also keep `AGENTS.md` in repo root.

### In Antigravity Editor

1. Use `AGENTS.md` as your baseline project behavior.
2. Simply use the slash commands `/inut-design-workflow`, `/inut-content-writer`, etc. generated from `.agents/workflows/`! They work identically to Copilot skills.
3. Start tasks from `docs/ai/PORTABLE_PROMPTS.md` templates or the `/add-feature`, `/fix-bug` workflows.

### In Codex IDE

1. Use `AGENTS.md` as your baseline project behavior.
2. Ensure `.codex/{agents,prompts,skills,workflows,instructions}` are symlinked to `.agents/*`.

## Mapping table

| Intent                      | Trae/Cursor equivalent       | Copilot-native asset              | Antigravity equivalent        | Codex equivalent              |
| --------------------------- | ---------------------------- | --------------------------------- | ----------------------------- | ----------------------------- |
| Global repo rules           | `.cursorrules`, `.traerules` | `.github/copilot-instructions.md` | `AGENTS.md`                   | `AGENTS.md`                   |
| Scoped coding rules         | `.agents/instructions/*.md`  | `.github/instructions/*.md`       | `.agents/instructions/*.md`   | `.codex/instructions/*.md`    |
| Specialized execution modes | N/A (Tool-driven)            | `.github/agents/*.agent.md`       | `.agents/agents/*.agent.md`   | `.codex/agents/*.agent.md`    |
| Reusable task prompts       | N/A (Tool-driven)            | `.github/prompts/*.prompt.md`     | `docs/ai/PORTABLE_PROMPTS.md` | `docs/ai/PORTABLE_PROMPTS.md` |
| Workflow playbook           | N/A (Tool-driven)            | `.github/skills/*/SKILL.md`       | `.agents/skills/*/SKILL.md`   | `.codex/skills/*/SKILL.md`    |

## Team operating model

For consistency across editors:

1. **Write requirements once** in issue/brief format.
2. **Run same prompt intent** (feature, bugfix, blog batch, checkout regression, product page automation).
3. **Use same verification standard** (`pnpm lint`, then `pnpm build` when needed, then manual QA for touched flow).
4. **Record assumptions and risk** in PR/commit notes.

## Notes

- Keep all trees aligned for native editor support:
   - `.agents/` is the canonical source.
   - Root symlinks for Trae/Cursor.
   - `.github/` symlinks for Copilot.
   - `.codex/` symlinks for Codex.
- Always add new instructions to `.agents/instructions/` and ensure they follow the `*.instructions.md` naming for scoped rules.
