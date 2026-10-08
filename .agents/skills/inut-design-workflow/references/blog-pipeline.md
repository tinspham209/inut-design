# Blog rendering

Posts are `blog/YYYY-MM-DD-slug.md` with `slug`, `title`, `tags`, `date` and
current author metadata. Do not rename existing posts without redirects.
Keep headings structured and internal/image links valid. Rendering uses
unified/remark/rehype; parser changes must preserve old posts, excerpt markers,
frontmatter, routing and list/detail behavior. Make incremental parser edits and
check representative old/new posts. Prose rules live in the writer skill, not a
second competing contract. Rendering/runtime edits require engineering checks;
prose-only edits use the scoped writer validator.