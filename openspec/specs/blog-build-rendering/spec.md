# blog-build-rendering Specification

## Purpose

Quy định build-time Markdown compilation, syntax highlighting, HTML sanitization, và Worker runtime verification để tất cả trang `/blog/[slug]` chạy ổn định trên Cloudflare Workers mà không phụ thuộc `jsdom`, `vm`, hay `fs` ở runtime.

## Requirements

### Requirement: Build-time blog HTML compilation and sanitization
Hệ thống build pipeline SHALL compile toàn bộ file Markdown trong `blog/` thành HTML fragment đã syntax-highlight và sanitize ở build time, để request runtime tới `/blog/[slug]` không gọi thư viện DOM/VM của Node.

#### Scenario: Blog detail page renders cleanly without jsdom or vm at runtime
- **WHEN** user hoặc crawler request `/blog/<slug>` trên Cloudflare Worker runtime
- **THEN** Worker render bài viết từ `htmlContent` đã precompile sẵn (HTTP 200), không gọi `remark-prism`, `isomorphic-dompurify`, `jsdom`, `vm`, hay `fs` và không bọc lại thành `<!doctype html><html>` lồng trong page

#### Scenario: Unsafe HTML and attributes are sanitized before artifact output
- **WHEN** một file Markdown nguồn chứa raw HTML nguy hiểm hoặc event-handler attributes (như `onerror`, `onclick`, `<script>`)
- **THEN** bước build-time compilation SHALL strip toàn bộ tags/attributes không nằm trong allow-list trước khi ghi ra artifact blog

#### Scenario: Code blocks and search index remain functional after precompilation
- **WHEN** build pipeline chạy cho các bài có code fence (như `wmic csproduct get name`) và sinh search index tĩnh
- **THEN** code block vẫn giữ syntax highlighting markup tương thích với Prism styles và `public/search-index.json` vẫn index đầy đủ nội dung blog

### Requirement: Semantic HTML structure parity against baseline
Hệ thống build-time compilation SHALL giữ nguyên cấu trúc HTML semantic (heading levels `h1..h6`, heading `id`, TOC/autolink `href`, `p`, `ul/ol/li`, `table`, `img`, `pre > code` và Prism classes) khớp với baseline pipeline cũ trên toàn bộ 126 bài blog.

#### Scenario: Automated baseline compare passes for all blog posts
- **WHEN** chạy script compare đối chiếu HTML baseline chụp trước khi sửa với `htmlContent` build-time mới trên toàn bộ 126 bài blog
- **THEN** script SHALL pass 126/126 bài với zero sai lệch về semantic tags, heading hierarchy, heading `id` (không có `user-content-` prefix), links, images, tables, và code blocks

### Requirement: Worker graph and blog detail verification gates
Bộ verification scripts SHALL đảm bảo compiled Worker bundle không chứa `jsdom` hoặc `vm` primitives, và kiểm tra thực tế ít nhất một route `/blog/<slug>` render HTTP 200.

#### Scenario: Worker graph check rejects jsdom or vm regressions
- **WHEN** `scripts/migration/check-worker-graph.mjs` scan compiled Worker output hoặc `.map` `sourcesContent` có chứa `jsdom`, `isomorphic-dompurify`, `remark-prism`, `node:vm`, hoặc `"vm"`
- **THEN** script SHALL exit non-zero và báo lỗi module bị cấm trong report

#### Scenario: Browser and smoke verification covers a real blog slug route
- **WHEN** browser baseline / smoke verification suite chạy trên local hoặc preview Worker
- **THEN** ít nhất một route `/blog/<slug>` thực tế được request và verify trả HTTP 200 kèm article HTML không rỗng
