import { PostItem } from "@/components/blog";
import { Seo } from "@/components/common";
import MarkdownWrapper from "@/components/common/markdown/MarkdownWrapper";
import { MainLayout } from "@/components/layout";
import { Post } from "@/models";
import { getAllPostSlugs, getPostBySlug } from "@/utils";
import { trackEvent } from "@/utils/analytics";
import { getVFile } from "@/utils/unified";
import { Box, Breadcrumbs, Container, Divider, Link as MuiLink, Typography } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Link from "next/link";
import Script from "next/script";
import React from "react";

export interface BlogPageProps {
	post: Post;
}

export default function BlogDetailPage({ post }: BlogPageProps) {
	React.useEffect(() => {
		if (post) {
			trackEvent("blog_post_view", {
				post_title: post.title,
				post_slug: post.slug,
			});
		}
	}, [post]);

	if (!post) return null;

	return (
		<Box my={6}>
			<Seo
				data={{
					title: post.title,
					description: post.description,
					url: `https://inutdesign.com/blog/${post.slug}`,
					thumbnailUrl:
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>

			<Container>
				<Breadcrumbs
					sx={{
						mb: 4,
					}}
				>
					<Link href={"/"} passHref>
						<MuiLink>Trang chủ</MuiLink>
					</Link>
					<Link href={"/blog"} passHref>
						<MuiLink>Blog</MuiLink>
					</Link>
					<Typography>{post.title}</Typography>
				</Breadcrumbs>
				<PostItem
					post={{
						id: post.id,
						slug: post.slug,
						title: post.title,
						description: "",
						publishedDate: post.publishedDate,
						tagList: post.tagList,
					}}
				/>

				<Divider />

				<MarkdownWrapper>
					<div
						dangerouslySetInnerHTML={{
							__html: post.htmlContent || "",
						}}
					></div>
				</MarkdownWrapper>
			</Container>

			<Script src="/prism.js" strategy="afterInteractive"></Script>
		</Box>
	);
}

BlogDetailPage.Layout = MainLayout;

export const getStaticPaths: GetStaticPaths = async () => {
	const slugs = await getAllPostSlugs();

	// Pre-render the first 5 blog posts.
	// The rest will be generated on-demand via fallback: "blocking".
	return {
		paths: slugs.slice(0, 5).map((slug) => ({ params: { slug } })),
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps<BlogPageProps> = async (
	context: GetStaticPropsContext
) => {
	const slug = context.params?.slug;
	if (!slug) return { notFound: true };

	const post = await getPostBySlug(slug);
	if (!post) return { notFound: true };

	const file = await getVFile(post.mdContent || "", { title: post.title });
	const htmlContent = file.toString();

	post.htmlContent = DOMPurify.sanitize(htmlContent);

	return {
		props: {
			post: post,
		},
	};
};
