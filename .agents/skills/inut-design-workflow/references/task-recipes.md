# Engineering input recipes

## Add feature

Inputs: feature summary, target area (checkout/lighters/blog/analytics/contact/
other), constraints (risk limits/no-go areas/timeline).
Inspect current behavior and dependents, summarize it, plan the minimum change,
implement incrementally using existing helpers, include dual tracking at new
actions, validate code and affected flows. Do not commit unless requested.
Report changed files and a concise manual QA checklist.

## Fix bug

Inputs: bug summary, reproduction steps, expected behavior.
Reproduce/inspect before editing; identify root cause, not only symptoms.
Implement a minimal compatible fix; add guards or regression checks where useful.
Run scoped tests, lint and runtime-sensitive build when applicable. Report root
cause, fix, evidence, regression risks and any blocked checks.

## Checkout regression

Inputs: change summary, affected files. Follow [checkout audit](checkout.md).
Report behavior changes, payload/analytics checks, risk, mitigation and QA steps.