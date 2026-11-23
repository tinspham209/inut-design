# Blog Listing Refresh Evidence

Environment: local source/build evidence, 2026-11-23.

`/blog` uses 600-second ISR. Each listing regeneration performs one banner Sanity operation while post-list content continues to come from local Markdown. The homepage also retains its existing local blog-list read alongside one grouped homepage Sanity operation.

No Production regeneration was observed, so Production external-operation count and 10-minute freshness remain unknown. The local route configuration is evidenced by `final-build.md`.
