import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { fromHtml } from "hast-util-from-html";

const root = process.cwd();
const args = new Map(
	process.argv.slice(2).map((argument) => {
		const [key, ...rest] = argument.replace(/^--/, "").split("=");
		return [key, rest.join("=")];
	}),
);
const baselinePath = path.resolve(
	root,
	args.get("baseline") || "artifacts/migration/runtime/blog-html-baseline.json",
);
const selfCheck = process.argv.includes("--self-check");
const candidatePath = path.resolve(
	root,
	args.get("candidate") ||
		(selfCheck ? baselinePath : "data/blog-posts.json"),
);

function getText(node) {
	if (!node) return "";
	if (node.type === "text") return node.value || "";
	return (node.children || []).map(getText).join("");
}

function normalizeClassList(value) {
	const items = Array.isArray(value) ? value : String(value || "").split(/\s+/);
	return items
		.map((item) => String(item).trim())
		.filter(Boolean)
		.sort()
		.join(" ");
}

function extractSemantics(html) {
	const tree = fromHtml(html, { fragment: true });
	const tags = [];
	const headings = [];
	const links = [];
	const images = [];
	const codeBlocks = [];
	const tables = [];

	function walk(node, inPre = false) {
		if (!node || node.type === "comment") return;
		if (node.type === "text") {
			if (!inPre && !(node.value || "").trim()) return;
			return;
		}
		if (node.type === "element") {
			const tag = node.tagName.toLowerCase();
			const props = node.properties || {};
			tags.push(tag);
			if (/^h[1-6]$/.test(tag)) {
				headings.push({
					tag,
					id: props.id ?? null,
					text: getText(node).replace(/\s+/g, " ").trim(),
				});
			}
			if (tag === "a") {
				links.push({
					href: props.href ?? null,
					text: getText(node).replace(/\s+/g, " ").trim(),
				});
			}
			if (tag === "img") {
				images.push({
					src: props.src ?? null,
					alt: String(props.alt ?? "").replace(/\s+/g, " ").trim(),
				});
			}
			if (tag === "pre") {
				const codeChild = (node.children || []).find(
					(child) => child.type === "element" && child.tagName.toLowerCase() === "code",
				);
				const tokens = [];
				if (codeChild) {
					for (const child of codeChild.children || []) {
						if (child.type === "element" && child.tagName.toLowerCase() === "span") {
							tokens.push({
								className: normalizeClassList(child.properties?.className),
								text: getText(child),
							});
						}
					}
				}
				codeBlocks.push({
					preClass: normalizeClassList(props.className),
					codeClass: normalizeClassList(codeChild?.properties?.className),
					text: getText(codeChild || node).trimEnd(),
					tokens,
				});
			}
			if (tag === "table") {
				const rows = [];
				function collectRows(current) {
					if (current.type === "element" && current.tagName.toLowerCase() === "tr") {
						rows.push(
							(current.children || [])
								.filter(
									(c) =>
										c.type === "element" &&
										(c.tagName.toLowerCase() === "th" || c.tagName.toLowerCase() === "td"),
								)
								.map((c) => ({
									tag: c.tagName.toLowerCase(),
									text: getText(c).replace(/\s+/g, " ").trim(),
								})),
						);
						return;
					}
					for (const child of current.children || []) collectRows(child);
				}
				collectRows(node);
				tables.push(rows);
			}
		}
		const childInPre = inPre || (node.type === "element" && node.tagName.toLowerCase() === "pre");
		for (const child of node.children || []) {
			walk(child, childInPre);
		}
	}

	walk(tree);
	return { tags, headings, links, images, codeBlocks, tables };
}

const baselineRaw = JSON.parse(await readFile(baselinePath, "utf8"));
const baselinePosts = Array.isArray(baselineRaw) ? baselineRaw : baselineRaw.posts;
const candidateRaw = JSON.parse(await readFile(candidatePath, "utf8"));
const candidatePosts = Array.isArray(candidateRaw) ? candidateRaw : candidateRaw.posts;

if (!Array.isArray(baselinePosts) || baselinePosts.length === 0) {
	throw new Error(`Invalid or empty baseline at ${baselinePath}`);
}
if (!Array.isArray(candidatePosts) || candidatePosts.length !== baselinePosts.length) {
	throw new Error(
		`Post count mismatch: baseline has ${baselinePosts.length}, candidate has ${candidatePosts?.length ?? 0}`,
	);
}

const candidateBySlug = new Map(candidatePosts.map((post) => [post.slug, post]));
const failures = [];

for (const basePost of baselinePosts) {
	const candidatePost = candidateBySlug.get(basePost.slug);
	if (!candidatePost) {
		failures.push({ slug: basePost.slug, reason: "missing-candidate-post" });
		continue;
	}
	if (!candidatePost.htmlContent || typeof candidatePost.htmlContent !== "string") {
		failures.push({ slug: basePost.slug, reason: "missing-htmlContent" });
		continue;
	}
	const expected = extractSemantics(basePost.htmlContent);
	const actual = extractSemantics(candidatePost.htmlContent);
	for (const key of ["headings", "links", "images", "codeBlocks", "tables", "tags"]) {
		if (JSON.stringify(expected[key]) !== JSON.stringify(actual[key])) {
			failures.push({
				slug: basePost.slug,
				field: key,
				expected: expected[key],
				actual: actual[key],
			});
			break;
		}
	}
}

if (failures.length > 0) {
	console.error(`Blog HTML semantic compare FAILED (${failures.length}/${baselinePosts.length} posts):`);
	for (const failure of failures.slice(0, 5)) {
		console.error(`- ${failure.slug} [${failure.field || failure.reason}]`);
		if (failure.expected) console.error("  expected:", JSON.stringify(failure.expected).slice(0, 300));
		if (failure.actual) console.error("  actual:  ", JSON.stringify(failure.actual).slice(0, 300));
	}
	process.exitCode = 1;
} else {
	console.log(`Blog HTML semantic compare PASSED for ${baselinePosts.length}/${baselinePosts.length} posts.`);
}
