# Developer Effectiveness Playbook (Inut Design)

Use this checklist to ship features faster with fewer regressions.

## 1) Daily local workflow

- Run lint before creating a PR.
- Run build when touching routes, data fetching, or shared utilities.
- Validate the exact user journey you changed.

## 2) High-impact manual QA scenarios

### Cart/Checkout (lighters)

- Add item, update quantity, remove item.
- Confirm unit/subtotal recalc behavior.
- Confirm cart persistence (`inut-lighters-cart`).
- Place order and verify Sanity write success.

### Blog

- Verify post list render and detail page render.
- Confirm frontmatter fields exist and slug routing works.

### Contact

- Verify CTA clicks and analytics events.
- Check external links (Messenger, Facebook, Instagram, map, phone).

## 3) Suggested code-level productivity improvements

These are optional follow-ups for the team:

1. Add lightweight unit tests for `utils/priceCalculator.ts`.
2. Add runtime schema validation around checkout payload mapping.
3. Add a small script to lint blog frontmatter consistency.
4. Add a typed event map for analytics to reduce event-name drift.

## 4) PR template recommendations

For every PR include:

- Scope summary
- Risk level (low/medium/high)
- Validation steps performed
- Screenshots for UI changes
- Any data-contract changes (Sanity/GROQ/event payloads)

## 5) AI usage recommendations

- For cross-editor usage (Copilot + Trae + Antigravity), start with `AGENTS.md` and `docs/ai/DUAL_EDITOR_WORKFLOW.md`.
- **File Governance**: Keep AI knowledge only in `.agents/skills/` and bundled resources.
- Use `docs/ai/PORTABLE_PROMPTS.md` as a routing index, not a separate prompt system.
- Read `.agents/skills/inut-design-workflow/SKILL.md` for features, root-cause debugging,
  checkout audits and larger multi-file tasks.
- Read `.agents/skills/inut-content-writer/SKILL.md` for content operations.
- If a client does not discover skills, explicitly provide the relevant `SKILL.md` path.
- Run the read-only `scripts/validate-ai-config.sh` for customization-only changes.
