# Portable skill usage index

This is a routing index, not a second prompt source. Explicitly ask the client
to read `.agents/skills/<name>/SKILL.md` when native discovery is unavailable.
Automatic cross-client discovery and former slash/custom-agent modes are not
guaranteed. Do not recreate mirror trees.

| Intent                               | Skill resource                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Feature / bug                        | [Engineering recipes](../../.agents/skills/inut-design-workflow/references/task-recipes.md)      |
| Checkout audit                       | [Checkout](../../.agents/skills/inut-design-workflow/references/checkout.md)                     |
| Blog batch / Vietnamese product copy | [Canonical writer inputs](../../.agents/skills/inut-content-writer/references/input-examples.md) |
| New landing page / draft only        | [Brief inputs](../../.agents/skills/inut-product-page-automation/references/input-recipes.md)    |
| Existing content to template route   | [Generator QA](../../.agents/skills/product-page-generator/references/requirements-qa.md)        |

Keep examples in the bundled writer reference; update that source rather than
copying contracts into editor-specific files or this human-facing index.
