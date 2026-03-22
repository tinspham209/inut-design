import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { Post } from "@/models";

const BLOG_FOLDER = path.join(process.cwd(), "blog");

export async function getPostList(): Promise<Post[]> {
	// read all markdown files
	const fileNameList = fs.readdirSync(BLOG_FOLDER);

	const postList: Post[] = [];

	for (const fileName of fileNameList) {
		const filePath = path.join(BLOG_FOLDER, fileName);
		const fileContents = fs.readFileSync(filePath, "utf8");

		const { data, excerpt, content } = matter(fileContents, {
			excerpt_separator: "<!-- truncate-->",
		});
		postList.push({
			id: fileName,
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
			description: excerpt || "",
			mdContent: content,
		});
	}

	return postList;
}

export async function getPostListLimit(limit: number): Promise<Post[]> {
	try {
		if (!fs.existsSync(BLOG_FOLDER)) {
			return [];
		}

		// Read all filenames and sort them alphabetically descending (newest first based on YYYY-MM-DD prefix)
		const fileNameList = fs
			.readdirSync(BLOG_FOLDER)
			.filter((fileName) => fileName.endsWith(".md"))
			.sort((a, b) => b.localeCompare(a))
			.slice(0, limit);

		const postList: Post[] = [];

		for (const fileName of fileNameList) {
			const filePath = path.join(BLOG_FOLDER, fileName);
			const fileContents = fs.readFileSync(filePath, "utf8");

			const { data, excerpt, content } = matter(fileContents, {
				excerpt_separator: "<!-- truncate-->",
			});

			postList.push({
				id: fileName,
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
				description: excerpt || "",
				mdContent: content,
			});
		}

		return postList;
	} catch (error) {
		console.error("Error fetching limited post list:", error);
		return [];
	}
}

export async function getPostBySlug(slug: string | string[]): Promise<Post | null> {
	const postList = await getPostList();
	const post = postList.find((x) => x.slug === slug) || null;
	return post;
}

export async function getAllPostSlugs(): Promise<string[]> {
	const postList = await getPostList();
	return postList.map((x) => x.slug);
}
