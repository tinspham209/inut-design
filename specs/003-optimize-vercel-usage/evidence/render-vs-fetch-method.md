# Page Data and Content Fetch Timing Method

Use a local-only harness against the same representative page-data invocation
to capture two monotonic durations:

1. `contentSourceMs`: elapsed time around each Sanity `client.fetch` operation;
   sum separately by logical source read and never log query variables or data.
2. `pageDataMs`: elapsed time around the complete `getStaticProps` or search
   corpus/page-data operation, including local Markdown processing and mapping.

For a route that groups reads, put one timer around the grouped read and another
around the full page-data function. Use an isolated harness/test wrapper rather
than persistent instrumentation in a public route. Record route template,
environment (`local`), code revision, cold/warm state, invocation count, and
elapsed milliseconds only. Remove any temporary instrumentation before the final
build. These measurements explain source-vs-render work but do not prove
Production Active CPU; Vercel CPU evidence is a separate gate.
