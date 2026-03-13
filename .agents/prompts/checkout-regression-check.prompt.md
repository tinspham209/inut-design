---
description: "Run a checkout/lighters regression check plan and report risks before merge"
agent: inut-maintainer
---

Audit checkout and lighters-related changes for regression risk.

Inputs:

- Change summary: ${input:change_summary:What changed?}
- Affected files: ${input:affected_files:List key files touched}

Requirements:

1. Identify behavior changes in cart persistence, pricing, and order payload.
2. Verify Sanity order payload contract (including `_key` in array items).
3. Check analytics impact on checkout events.
4. Propose a concise manual QA checklist.
5. Report risk level with mitigation notes.
