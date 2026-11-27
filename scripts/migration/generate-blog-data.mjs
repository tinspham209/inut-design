import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";

import grayMatter from "gray-matter";
import { fromHtml } from "hast-util-from-html";
import Prism from "prismjs";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkToc from "remark-toc";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const require = createRequire(import.meta.url);
const loadPrismLanguages = require("prismjs/components/index.js");

function extractText(node) {
	if (!node) return "";
	if (node.type === "text") return node.value || "";
	if (Array.isArray(node.children)) return node.children.map(extractText).join("");
	return "";
}

function parseCodeAttributes(rawAttrBlock) {
	const attrs = {};
	if (!rawAttrBlock) return attrs;
	for (const match of rawAttrBlock.matchAll(/([a-zA-Z0-9_-]+)=["']([^"']*)["']/g)) {
		attrs[match[1]] = match[2];
	}
	return attrs;
}

/**
 * Pure-JS Prism syntax highlighter at build time (no jsdom, vm, or runtime fs).
 * Matches remark-prism's `<div class="remark-highlight"><pre><code class="language-*">` structure.
 */
function rehypeBuildPrism() {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName !== "pre" || !parent || typeof index !== "number") return;
			const codeNode = node.children?.find(
				(child) => child.type === "element" && child.tagName === "code",
			);
			if (!codeNode) return;

			const classNames = Array.isArray(codeNode.properties?.className)
				? codeNode.properties.className
				: [];
			const langClass = classNames.find(
				(value) => typeof value === "string" && value.startsWith("language-"),
			);
			const rawLangSpec = langClass ? langClass.slice("language-".length) : "";
			const langMatch = rawLangSpec.match(/^([^\[\s]+)(?:\[([^\]]+)\])?$/);
			const language = langMatch?.[1] || "";
			const parsedAttrs = parseCodeAttributes(langMatch?.[2]);
			const rawCode = extractText(codeNode).replace(/\n$/, "");

			if (language && !Prism.languages[language]) {
				try {
					loadPrismLanguages([language]);
				} catch {
					// Fallback to plain code when a Prism grammar is unavailable.
				}
			}

			const grammar = language ? Prism.languages[language] : null;
			let codeChildren;
			if (grammar) {
				const highlighted = Prism.highlight(rawCode, grammar, language);
				const fragment = fromHtml(`${highlighted}\n`, { fragment: true });
				codeChildren = fragment.children;
			} else {
				codeChildren = [{ type: "text", value: `${rawCode}\n` }];
			}

			const extraClasses = (parsedAttrs.class || "")
				.split(/\s+/)
				.filter(Boolean);
			const baseLangClass = language ? `language-${language}` : null;
			const preClasses = [...(baseLangClass ? [baseLangClass] : []), ...extraClasses];
			const codeClasses = baseLangClass ? [baseLangClass] : [];

			const preElement = {
				type: "element",
				tagName: "pre",
				properties: {
					...parsedAttrs,
					...(preClasses.length > 0 && { className: preClasses }),
				},
				children: [
					{
						type: "element",
						tagName: "code",
						properties: {
							...(codeClasses.length > 0 && { className: codeClasses }),
						},
						children: codeChildren,
					},
				],
			};

			parent.children[index] = {
				type: "element",
				tagName: "div",
				properties: { className: ["remark-highlight"] },
				children: [preElement],
			};
		});
	};
}

const blogSanitizeSchema = {
	...defaultSchema,
	clobberPrefix: "",
	protocols: {
		...defaultSchema.protocols,
		href: [...(defaultSchema.protocols?.href || []), "tel"],
	},
	attributes: {
		...defaultSchema.attributes,
		"*": [...(defaultSchema.attributes?.["*"] || []), "id"],
		div: [...(defaultSchema.attributes?.div || []), ["className", "remark-highlight"]],
		pre: [
			...(defaultSchema.attributes?.pre || []),
			["className", /^language-[a-z0-9-]+$/i, "line-numbers"],
		],
		code: [
			...(defaultSchema.attributes?.code || []),
			["className", /^language-[a-z0-9-]+$/i],
		],
		span: [
			...(defaultSchema.attributes?.span || []),
			["className", "token", /^[a-z0-9-]+$/i],
		],
		img: [...(defaultSchema.attributes?.img || []), "alt"],
	},
};

const blogCompiler = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkToc, { heading: "Table of Contents" })
	.use(remarkImages)
	.use(remarkRehype)
	.use(rehypeSlug)
	.use(rehypeAutolinkHeadings, { behaviour: "wrap" })
	.use(rehypeBuildPrism)
	.use(rehypeSanitize, blogSanitizeSchema)
	.use(rehypeStringify);

/**
 * Verifies raw dangerous HTML, disallowed event attributes (including code-fence attrs),
 * and unsafe protocols are stripped before generating blog artifacts.
 */
async function assertBlogSanitization() {
	const maliciousMarkdown = [
		"# Heading Safe",
		"",
		"[Call](tel:+84123456789) [Bad](javascript:alert(1))",
		"",
		'<script>alert("xss")</script>',
		'<img src="https://example.com/a.png" onerror="alert(1)" onclick="alert(2)" />',
		"",
		'```js[class="line-numbers",onerror="alert(1)",onclick="alert(2)"]',
		"const x = 1;",
		"```",
	].join("\n");

	const compiled = String(await blogCompiler.process(maliciousMarkdown)).trim();
	const forbiddenSnippets = ["<script", "onerror=", "onclick=", "javascript:", "user-content-"];
	for (const snippet of forbiddenSnippets) {
		if (compiled.toLowerCase().includes(snippet)) {
			throw new Error(`Blog sanitization self-check failed: output retained "${snippet}".`);
		}
	}
	const requiredSnippets = [
		'id="heading-safe"',
		'href="tel:+84123456789"',
		'class="remark-highlight"',
		'class="language-js line-numbers"',
		'class="token keyword"',
	];
	for (const snippet of requiredSnippets) {
		if (!compiled.includes(snippet)) {
			throw new Error(`Blog sanitization self-check failed: missing expected "${snippet}".`);
		}
	}
}

await assertBlogSanitization();

const root = process.cwd();
const blogDir = path.join(root, "blog");
const outputPath = path.join(root, "data/blog-posts.json");
const files = (await readdir(blogDir)).filter((file) => file.endsWith(".md")).sort();
const slugs = new Set();
const posts = [];

for (const file of files) {
	const source = await readFile(path.join(blogDir, file), "utf8");
	const { data, excerpt, content } = grayMatter(source, {
		excerpt_separator: "<!-- truncate-->",
	});
	if (!data.slug || typeof data.slug !== "string" || slugs.has(data.slug)) {
		throw new Error(`Blog source ${file} has a missing or duplicate slug.`);
	}
	slugs.add(data.slug);
	const htmlContent = String(await blogCompiler.process(content || "")).trim();
	posts.push({
		id: file,
		slug: data.slug,
		title: data.title,
		author: {
			name: data.author,
			title: data.author_title,
			profileUrl: data.author_url,
			avatarUrl: data.author_image_url,
		},
		tagList: data.tags,
		publishedDate: data.date,
		excerpt: excerpt || "",
		description: data.description || excerpt || "",
		ogImage: data.ogImage || null,
		htmlContent,
	});
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(posts, null, 2)}\n`);
console.log(`Generated ${posts.length} deterministic precompiled blog records.`);
