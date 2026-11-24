import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import grayMatter from "gray-matter";

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
		mdContent: content,
	});
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(posts, null, 2)}\n`);
console.log(`Generated ${posts.length} deterministic blog records.`);
