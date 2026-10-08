import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";

export function canonicalRoute(root, input) {
	let route = input;
	if (typeof route !== "string") throw new Error("Route must be a string");
	if (/^https?:\/\//.test(route)) {
		const url = new URL(route);
		if (
			url.protocol !== "https:" ||
			!["inutdesign.com", "www.inutdesign.com"].includes(url.hostname) ||
			url.search ||
			url.hash
		)
			throw new Error("Use a canonical INUT URL without query/hash");
		route = url.pathname;
	}
	route = route.replace(/\/$/, "") || "/";
	if (!/^\/(?:[a-z0-9-]+\/)*[a-z0-9-]*$/.test(route)) throw new Error(`Invalid route: ${route}`);
	const base = path.join(root, "pages", route.slice(1));
	if (
		![
			`${base}.tsx`,
			`${base}.ts`,
			`${base}.jsx`,
			`${base}.js`,
			...["tsx", "ts", "jsx", "js"].map((ext) => path.join(base, `index.${ext}`)),
		].some((p) => fs.existsSync(p))
	) {
		throw new Error(
			`No canonical page for ${route}; inspect redirects and product mapping before correction`
		);
	}
	return route;
}
const validDay = (s) =>
	typeof s === "string" &&
	/^\d{4}-\d{2}-\d{2}$/.test(s) &&
	new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s;
const titleKey = (s) => s.normalize("NFC").trim().toLocaleLowerCase("vi");

export function validateBatch(spec) {
	const errors = [],
		check = (ok, msg) => {
			if (!ok) errors.push(msg);
		};
	const root = path.resolve(spec.root || ".");
	if (!Array.isArray(spec.groups) || !spec.groups.length)
		return ["At least one product group is required"];
	const selected = new Set(spec.groups.flatMap((g) => (g.files || []).map((p) => path.resolve(p))));
	const slugs = new Map(),
		titles = new Map();
	const existingDir = path.resolve(spec.existingDir || path.join(root, "blog"));
	// Read existing metadata for uniqueness; do not validate or mutate old posts.
	if (fs.existsSync(existingDir))
		for (const name of fs.readdirSync(existingDir).filter((n) => n.endsWith(".md"))) {
			const p = path.join(existingDir, name);
			if (selected.has(path.resolve(p))) continue;
			try {
				const { data } = matter(fs.readFileSync(p, "utf8"));
				if (typeof data.slug === "string") slugs.set(data.slug, p);
				if (typeof data.title === "string") titles.set(titleKey(data.title), p);
			} catch (e) {
				errors.push(`Cannot check existing uniqueness in ${name}: ${e.message}`);
			}
		}
	const seenFiles = new Set();
	for (const group of spec.groups) {
		check(typeof group.product === "string" && group.product.trim(), "Missing product name");
		check(Number.isInteger(group.count) && group.count > 0, `Invalid count: ${group.product}`);
		check(
			Array.isArray(group.files) && group.files.length === group.count,
			`Group count mismatch: ${group.product}`
		);
		let dayOK = false;
		try {
			dayOK = validDay(group.date);
		} catch {
			/* Invalid calendar date */
		}
		check(dayOK, `Invalid group date: ${group.product}`);
		let route;
		try {
			route = canonicalRoute(root, group.route);
		} catch (e) {
			errors.push(e.message);
		}
		for (const input of group.files || []) {
			const file = path.resolve(input),
				label = path.basename(file);
			check(!seenFiles.has(file), `Repeated selected file: ${label}`);
			seenFiles.add(file);
			try {
				const text = fs.readFileSync(file, "utf8"),
					{ data, content } = matter(text);
				check(
					/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/.test(text),
					`${label}: missing YAML frontmatter`
				);
				for (const key of [
					"slug",
					"title",
					"date",
					"author",
					"author_title",
					"author_url",
					"author_image_url",
				])
					check(
						typeof data[key] === "string" && data[key].trim(),
						`${label}: missing/string ${key}`
					);
				check(
					Array.isArray(data.tags) &&
						data.tags.length > 0 &&
						data.tags.every((t) => typeof t === "string" && t.trim()),
					`${label}: tags must be a nonempty string array`
				);
				check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug || ""), `${label}: invalid slug`);
				check(label === `${group.date}-${data.slug}.md`, `${label}: filename/date/slug mismatch`);
				check(
					typeof data.date === "string" &&
						/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(data.date) &&
						!Number.isNaN(Date.parse(data.date)) &&
						data.date.slice(0, 10) === group.date,
					`${label}: date must be quoted ISO timestamp on group day`
				);
				check(/^title:\s*["']/m.test(text), `${label}: quote title YAML`);
				for (const key of ["author_url", "author_image_url"]) {
					try {
						check(new URL(data[key]).protocol === "https:", `${label}: ${key} must use HTTPS`);
					} catch {
						errors.push(`${label}: invalid ${key}`);
					}
				}
				check(!slugs.has(data.slug), `${label}: duplicate slug ${data.slug}`);
				slugs.set(data.slug, file);
				if (typeof data.title === "string") {
					const key = titleKey(data.title);
					check(!titles.has(key), `${label}: duplicate title`);
					titles.set(key, file);
				}
				const marker = "<!-- truncate-->****";
				check(
					content.split(marker).length === 2 && content.split(marker)[0].trim().length > 20,
					`${label}: require excerpt and one exact truncate marker`
				);
				check(
					content.includes("### Thông Tin Liên Hệ") && content.includes("tel:0327124321"),
					`${label}: missing current contact footer`
				);
				check(
					!/dữ liệu sản phẩm.{0,50}(?:không xác nhận|chưa xác nhận)|không có.{0,40}được xác nhận trong dữ liệu/i.test(
						content
					),
					`${label}: internal data-uncertainty prose`
				);
				if (route) {
					const bullet = `- [https://inutdesign.com${route}](${route})`;
					const lines = content.replace(/\r\n/g, "\n").split("\n");
					check(
						lines.filter((l) => l === bullet).length === 1,
						`${label}: require exactly one canonical visible URL bullet`
					);
					check(
						lines.filter((l) =>
							/^\s*[-*+] \[https?:\/\/(?:www\.)?inutdesign\.com[^\]]*\]\(/.test(l)
						).length === 1,
						`${label}: duplicate/noncanonical visible URL bullets`
					);
					const index = lines.indexOf(bullet);
					check(
						index > 1 &&
							lines[index - 1] === "" &&
							!/^\s*[-*+]/.test(lines[index - 2] || "") &&
							(lines[index - 2] || "").includes(`](${route})`),
						`${label}: contextual inline CTA then blank line before bullet`
					);
				}
				unified().use(remarkParse).use(remarkGfm).parse(content);
			} catch (e) {
				errors.push(`${label}: ${e.message}`);
			}
		}
	}
	return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		if (process.argv[2] !== "--spec" || !process.argv[3])
			throw new Error("Usage: validate-blog.mjs --spec /absolute/batch.json");
		const errors = validateBatch(JSON.parse(fs.readFileSync(process.argv[3], "utf8")));
		if (errors.length) {
			console.error(errors.map((e) => `ERROR: ${e}`).join("\n"));
			process.exitCode = 1;
		} else
			console.log(
				"PASS: selected blog batch metadata, uniqueness, counts, routes, CTA, excerpt/footer and remark parse"
			);
	} catch (e) {
		console.error(`ERROR: ${e.message}`);
		process.exitCode = 1;
	}
}
