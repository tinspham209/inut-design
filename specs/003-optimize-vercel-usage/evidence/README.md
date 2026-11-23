# Evidence Conventions

- Keep pre-change and post-change evidence separate and timestamp each capture
  in UTC. Production, Preview, Development, local build, and browser evidence
  must be labelled distinctly.
- Route-level files use the exact route or workload class in their filename;
  dynamic route rows use the source route template.
- Record invocation count, Active CPU, request count, external source calls,
  errors, and cache status when available. Never substitute duration or network
  latency for Active CPU.
- Do not infer Production from an All-Environments Vercel view. Mark unavailable
  fields `unknown` and state the reason. An evidence gap does not pass the
  corresponding success criterion.
- Normalize before/after data to equivalent route mix and request volume. Keep
  the five-route comparison set fixed after it is frozen from Production.
- Store browser screenshots under `test-results/003-baseline/` and
  `test-results/003-after/`; link to them from the evidence summary. Avoid
  recording submitted payloads, personal information, or secret-bearing URLs.
- The `/contact/form` idle count separates document, Next data, and script/chunk
  requests across a 10-minute idle session.
- CPU status: `<75%` within budget, `75–89.9%` warning, `>=90%` escalated, and
  `100%` failed. The safety target remains `<=75%`.
- Search evidence records the isolated corpus environment separately from
  Production aggregate cold starts and grouped external reads, including the
  deployment epoch.
