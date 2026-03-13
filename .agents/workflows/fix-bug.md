---
description: "Fix a bug in this repository with a root-cause-first approach"
---

# Fix bug

Fix a bug in this repository with a root-cause-first approach.

Requirements:

1. Identify root cause in code (not just symptom patch).
2. Implement minimal safe fix aligned with current patterns.
3. Add/update guards or checks when appropriate.
4. Run verification (`pnpm lint`; include `pnpm build` if runtime-sensitive).
5. Summarize root cause, fix, and regression risks.
