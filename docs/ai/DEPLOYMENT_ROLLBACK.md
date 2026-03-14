# AI Context Deployment & Rollback Procedures

This document outlines the standard procedure for updating the unified AI context architecture and how to recover from potential configuration issues.

## Deployment Process

The deployment of new AI instructions, agents, or workflows follows the "Write Once, Sync Everywhere" principle.

### 1. Identify Target
- **Global Rules**: Edit `.agents/instructions/global-rules.md`.
- **Scoped Rules**: Add or edit `*.instructions.md` in `.agents/instructions/`.
- **Specialized Assets**: Use `.agents/agents/`, `.agents/prompts/`, `.agents/skills/`, or `.agents/workflows/`.

### 2. Implementation
- Always make changes in the `.agents/` directory.
- **Strict Rule**: Never create new files in `.trae/`. Create in `.agents/` and verify symlink propagation.
- Ensure naming conventions are followed (`*.agent.md`, `*.prompt.md`, `*.instructions.md`).

### 3. Verification
Run the validation script to ensure symlink integrity:
```bash
./scripts/validate-ai-config.sh
```

### 4. Commit
Commit the changes in `.agents/`. If new symlinks were created, ensure they are included in the commit.

---

## Rollback Procedures

In case of broken symlinks or corrupted instructions that negatively impact AI behavior across IDEs.

### Scenario A: Broken Symlinks
If `validate-ai-config.sh` reports broken symlinks:
1. Identify the broken link.
2. Re-create the link pointing to the correct `.agents/` target.
   - Example: `ln -sf ../.agents/instructions/global-rules.md .github/copilot-instructions.md`

### Scenario B: Corrupted Instruction Content
If the AI starts hallucinating or ignoring rules:
1. Use Git to revert the specific file in `.agents/`.
   - `git checkout HEAD~1 -- .agents/instructions/global-rules.md`
2. Verify with the validation script.

### Scenario C: Emergency Reset (Full Re-link)
If the symlink structure is heavily compromised:
1. Remove all AI-specific symlinks in `.github/`, `.codex/`, `.trae/`, and root (`.cursorrules`, `.traerules`).
2. Run the initialization commands to restore standard links:
   ```bash
   # Re-link root
   ln -sf .agents/instructions/global-rules.md .cursorrules
   ln -sf .agents/instructions/global-rules.md .traerules
   
   # Re-link .github
   ln -sf ../.agents/agents .github/agents
   ln -sf ../.agents/prompts .github/prompts
   ln -sf ../.agents/skills .github/skills
   ln -sf ../.agents/instructions .github/instructions
   ln -sf ../.agents/instructions/global-rules.md .github/copilot-instructions.md
   
   # Re-link .codex
   ln -sf ../.agents/agents .codex/agents
   ln -sf ../.agents/prompts .codex/prompts
   ln -sf ../.agents/skills .codex/skills
   ln -sf ../.agents/workflows .codex/workflows
   ln -sf ../.agents/instructions .codex/instructions

   # Re-link .trae
   ln -sf ../.agents/prompts .trae/prompts
   ln -sf ../.agents/skills .trae/skills
   ```
3. Run `./scripts/validate-ai-config.sh`.

## Naming & Organization Standards

| Category           | Location                                 | Pattern                                                        |
| :----------------- | :--------------------------------------- | :------------------------------------------------------------- |
| Global Baseline    | `.agents/instructions/global-rules.md`   | Single source for all IDE instructions.                        |
| Scoped Rules       | `.agents/instructions/*.instructions.md` | `[topic].instructions.md` (e.g., `analytics.instructions.md`). |
| Specialized Agents | `.agents/agents/*.agent.md`              | `[name].agent.md`.                                             |
| Prompt Templates   | `.agents/prompts/*.prompt.md`            | `[task].prompt.md`.                                            |
| Skill Workflows    | `.agents/skills/[name]/SKILL.md`         | Folder-based skill definition.                                 |
| Playbooks          | `.agents/workflows/*.md`                 | Narrative multi-step workflows.                                |
