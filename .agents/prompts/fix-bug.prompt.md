---
description: "Debug and fix a bug in Inut Design with root-cause analysis and low-risk changes"
agent: inut-maintainer
---

Fix a bug in this repository with a root-cause-first approach.

Inputs:

- Bug summary: ${input:bug_summary:What is broken?}
- Reproduction steps: ${input:repro_steps:How to reproduce?}
- Expected behavior: ${input:expected_behavior:What should happen?}

Requirements:

1. Identify root cause in code (not just symptom patch).
2. Implement minimal safe fix aligned with current patterns.
3. Add/update guards or checks when appropriate.
4. Run verification (`pnpm lint`; include `pnpm build` if runtime-sensitive).
5. Summarize root cause, fix, and regression risks.
