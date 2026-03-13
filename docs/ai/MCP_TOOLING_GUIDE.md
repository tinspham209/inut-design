# MCP & Tooling Guide for Inut Design

This guide helps developers and AI agents pick the right tool quickly for common project tasks.

For cross-editor consistency (GitHub Copilot + Antigravity), pair this guide with:

- `AGENTS.md`
- `docs/ai/DUAL_EDITOR_WORKFLOW.md`
- `docs/ai/PORTABLE_PROMPTS.md`

## Core principle

Use the smallest capable tool for the job:

1. **Code search / reading first**
2. **Small patch edits**
3. **Run lint/build to verify**
4. **Only then broader refactors**

## Recommended tool categories

### 1) Workspace exploration

Use for understanding before edits:

- semantic search for intent-level discovery
- glob/file search for precise file targeting
- focused file reads for full context

Best for:
- locating checkout flow paths
- finding analytics call sites
- tracking Sanity model consumers

### 2) Editing and refactoring

Use for controlled code updates:

- patch-based edits for small, auditable changes
- symbol-aware rename for safe multi-file renames
- usage lookup before changing shared functions

Best for:
- evolving shared utility names
- updating event helpers safely
- adjusting Sanity payload shapes with references

### 3) Quality verification

Use after every meaningful code change:

- lint and build checks
- file/problem diagnostics
- targeted manual flow checks (cart/checkout/blog/contact)

Best for:
- preventing regressions in critical user journeys

## MCP usage guidance in this repo

### Figma MCP (when design links are provided)

Use when a designer shares Figma/FigJam URLs:

- extract design context for nodes
- map design tokens/components to existing MUI patterns
- avoid raw copy-paste output; adapt to this codebase conventions

### GitHub MCP (when working from issues/PRs)

Use when implementing issue-driven work:

- inspect issue/PR context before coding
- create focused PR descriptions with risk + validation notes
- request AI review before human review for quick feedback

## High-value automation ideas

1. Add a pre-PR checklist prompt for cart/checkout regressions.
2. Add a prompt for blog frontmatter validation before commit.
3. Use a dedicated maintainer agent for medium/large tasks.
4. Keep analytics event schema docs synced with `utils/analytics.ts`.

## Safety notes

- Never hardcode tokens/secrets.
- Preserve `strict: false` compatibility unless intentionally migrating.
- Keep `_key` for all Sanity array write items.
- Prefer incremental changes over broad rewrites.
