# Render CPU Versus External Fetch Timing

The measurement method is specified in `render-vs-fetch-method.md`: capture total Function Active CPU separately from Sanity call duration, using temporary local timing around complete data work and individual external operations. Network wait and wall-clock duration are not substituted for Active CPU.

Production timing values are unknown because no Production-only trace or metrics query was available. Local query counts do not identify shared render CPU.
