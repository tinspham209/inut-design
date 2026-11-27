import blogPosts from "@/data/blog-posts.json";
import { Post } from "@/models";

type GeneratedPost = Omit<Post, "description"> & {
	excerpt: string;
	description: string;
	ogImage: string | null;
	htmlContent: string;
};

const posts = blogPosts as GeneratedPost[];

function listPost(post: GeneratedPost): Post {
	return {
		id: post.id,
		slug: post.slug,
		title: post.title,
		author: post.author,
		tagList: post.tagList,
		publishedDate: post.publishedDate,
		description: post.excerpt,
		ogImage: post.ogImage,
	};
}

export async function getPostList(): Promise<Post[]> {
	return posts.map((post) => ({ ...listPost(post), htmlContent: post.htmlContent }));
}

export async function getPostListSummary(): Promise<Post[]> {
	return posts.map(listPost);
}

export async function getPostListLimit(limit: number): Promise<Post[]> {
	return [...posts]
		.sort((left, right) => String(right.id).localeCompare(String(left.id)))
		.slice(0, limit)
		.map(listPost);
}

export async function getPostBySlug(slug: string | string[]): Promise<Post | null> {
	const post = posts.find((candidate) => candidate.slug === slug);
	return post
		? {
				...listPost(post),
				description: post.description,
				htmlContent: post.htmlContent,
			}
		: null;
}

export async function getAllPostSlugs(): Promise<string[]> {
	return posts.map((post) => post.slug);
}
