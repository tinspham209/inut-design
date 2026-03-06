---
description: "Create a safe implementation plan and code changes for a new Inut Design feature"
agent: inut-maintainer
---

Implement a new feature in this repository using existing conventions.

Inputs:

- Feature summary: ${input:feature_summary:What feature should be added?}
- Target area: ${input:target_area:e.g. checkout, lighters, blog, analytics, contact}
- Constraints: ${input:constraints:Any constraints, risk limits, or no-go areas?}

Requirements:

1. Inspect relevant files and summarize current behavior.
2. Propose a minimal implementation plan.
3. Implement in incremental commits/steps.
4. Reuse existing patterns and helpers.
5. Run verification (`pnpm lint`; include `pnpm build` if applicable).
6. Report changed files and any manual QA checklist.
