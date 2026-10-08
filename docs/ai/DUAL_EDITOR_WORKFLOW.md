# Skills-only multi-editor operation

The only repository AI knowledge tree is `.agents/skills/`. `AGENTS.md` is a
minimal safety/routing bootstrap. Seven skills are retained; their bundled
references/assets/scripts contain the former engineering and content recipes.
No mirror synchronization, standalone slash prompts or custom agent modes remain.

## Start a task in any client

Read `AGENTS.md`, then the relevant `.agents/skills/<name>/SKILL.md` and only its
task-specific references. Native skill discovery depends on the client/version;
it has not been verified across Copilot, Trae, Antigravity and Codex. Do not
promise automatic loading or recreate mirrors to work around it.

Explicit fallback: “Read `.agents/skills/inut-content-writer/SKILL.md`, then
execute this batch.” See the writer's
[input examples](../../.agents/skills/inut-content-writer/references/input-examples.md)
for the single source of input recipes.

Engineering features, bugs and checkout audits use `inut-design-workflow`.
New landing pages use `inut-product-page-automation`; existing `content.md`
uses `product-page-generator`. Browser proof uses `agent-browser-automation`.
Measurable experiments use `autoresearch`; skill work uses `skill-creator`.

Edit only canonical skills and their resources. Validate customizations with
`rtk proxy bash scripts/validate-ai-config.sh`; code uses the engineering checks,
prose uses the scoped writer validator. Record assumptions/risks and checks.
Existing unrelated CI and client configuration are not AI knowledge mirrors.
