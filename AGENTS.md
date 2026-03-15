# Inut Design — AI Agent Playbook (Editor-Agnostic)

This file defines the **shared working contract** for AI assistants used in this repository, including:

- GitHub Copilot in VS Code
- Trae IDE (AI-native)
- Antigravity Editor assistants
- Codex IDE assistants

If an editor supports `AGENTS.md`, treat this file as the primary repo behavior baseline.

## Mission

Ship safe, minimal, production-friendly changes for Inut Design.

## Core priorities

1. Protect business-critical flows: cart, checkout, order confirmation, contact.
2. Preserve Sanity data contracts and reference integrity.
3. Keep dual analytics (GA4 + UmamiJS) consistent and ensure tracking is added for new behaviors/pages/elements. Avoid duplicate event firing.
4. Reuse existing project patterns before introducing new abstractions.
5. Keep TypeScript compatible with `strict: false`.

## Required implementation behavior

- Investigate before editing: locate dependent files and shared contracts.
- Make small, incremental edits.
- Prefer existing helpers (`api-client/*`, `utils/analytics.ts`, `utils/priceCalculator.ts`).
- Keep `@/` import alias style.
- Avoid broad formatting churn or unrelated refactors.

## Domain guardrails

### Cart/Checkout

- Do not change localStorage key: `inut-lighters-cart`.
- Preserve pricing recalculation behavior on quantity updates.
- Keep order payload shape compatible with Sanity.
- Every Sanity array item written must include `_key`.

Canonical order item shape:

```ts
{
  _key: `${productId}-${lighterTypeId}-${timestamp}-${index}`,
  product: { _ref: productId, _type: "reference" },
  lighterType: { _ref: lighterTypeId, _type: "reference" },
  quantity: number,
  unitPrice: number,
  subtotal: number,
}
```

### Analytics

- **MANDATORY**: Always create tracking events when adding new behaviors, new pages, or new interactive elements.
- Use `utils/analytics.ts` and `utils/umamiAnalytics.ts` as the unified tracking gateway.
- Fire at user action source (click/submit/view).
- Avoid duplicate events from rerenders/effects.

### Blog

- Keep frontmatter required fields: `slug`, `title`, `tags`, `date`.
- Use filename format: `YYYY-MM-DD-slug.md`.

### Sanity

- Preserve env-driven Sanity config.
- Keep GROQ projections explicit and minimal.
- Maintain reference integrity (`_ref`, `->` shape compatibility).

### Browser Automation

- **MANDATORY**: Use `agent-browser` for UI verification of critical flows (cart/checkout/blog).
- Always prefer `agent-browser snapshot -i` for token efficiency.
- Follow the workflow in `.agents/skills/agent-browser-automation/SKILL.md`.

## Verification order

1. `pnpm lint`
2. `pnpm build` (when routing/runtime/shared logic changed)
3. Manual flow checks for touched areas (cart/checkout/blog/contact)

## Where to find task workflows

- Shared docs for all editors: `docs/ai/DUAL_EDITOR_WORKFLOW.md`
- Portable prompt pack: `docs/ai/PORTABLE_PROMPTS.md`
- Trae/Cursor rules: `.cursorrules`, `.traerules` (symlinked to `.agents/instructions/global-rules.md`)
- Antigravity-native assets: `.agents/workflows/*` (use `/` inside Antigravity to run them)
- Copilot-native assets: `.github/copilot-instructions.md`, `.github/prompts/*`, `.github/skills/*`, `.github/agents/*`

## Multi-editor compatibility policy

- Keep all trees available for native IDE ingestion:
  - Trae reads `.cursorrules` and `.traerules`.
  - Copilot reads `.github/*`.
  - Antigravity reads `.agents/{agents,prompts,skills,workflows,instructions}/*`.
  - `.codex/{agents,prompts,skills,workflows,instructions}` are symlinked to `.agents/` equivalents.
- **CRITICAL GOVERNANCE**:
  - Do NOT create new files in `.trae/`. 
  - All AI instructions, skills, agents, and prompts MUST be created exclusively in the `.agents/` directory structure.
  - Symbolic links are used to bridge `.agents/` to specific IDE environments (`.trae/`, `.github/`, `.codex/`).
  - For every new skill or prompt file created in `.agents/`, ensure the corresponding symlink exists in all target IDE folders.
