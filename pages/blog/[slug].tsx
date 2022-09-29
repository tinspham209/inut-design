import { PostItem } from "@/components/blog";
import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { Post } from "@/models";
import { COLOR_CODE, getPostList } from "@/utils";
import { Box, Breadcrumbs, Container, Divider, Link as MuiLink, Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Link from "next/link";
import Script from "next/script";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkImages from "remark-images";
import remarkParse from "remark-parse";
import remarkPrism from "remark-prism";
import remarkRehype from "remark-rehype";
import remarkToc from "remark-toc";
import { unified } from "unified";

export interface BlogPageProps {
	post: Post;
}

export default function BlogDetailPage({ post }: BlogPageProps) {
	if (!post) return null;

	return (
		<Box my={6}>
			<Seo
				data={{
					title: post.title,
					description: post.description,
					url: `https://inut-design.vercel.app/blog/${post.slug}`,
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
					<Typography color={COLOR_CODE.WHITE}>{post.title}</Typography>
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

				<Box
					sx={{
						"& img": {
							maxWidth: "800px",
							minWidth: "360px",
							maxHeight: "400px",
							width: "100%",
							objectFit: "contain",
							borderRadius: "16px",
							transition: "all 0.2s ease-in-out",
							boxShadow: "-1px 3px 3px -1px rgb(0 0 0 / 25%)",
							"&:hover": {
								transform: "scale(1.05)",
							},
						},
						"& p a": {},
					}}
				>
					<div
						dangerouslySetInnerHTML={{
							__html: post.htmlContent || "",
						}}
					></div>
				</Box>
			</Container>

			<Script src="/prism.js" strategy="afterInteractive"></Script>
		</Box>
	);
}

BlogDetailPage.Layout = MainLayout;

export const getStaticPaths: GetStaticPaths = async () => {
	const postList = await getPostList();

	return {
		paths: postList.map((post: Post) => ({ params: { slug: post.slug } })),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps<BlogPageProps> = async (
	context: GetStaticPropsContext
) => {
	const slug = context.params?.slug;
	const postList = await getPostList();

	if (!slug) return { notFound: true };

	const post = postList.find((x) => x.slug === slug);
	if (!post) return { notFound: true };

	const file = await unified()
		.use(remarkParse)
		.use(remarkToc, { heading: "Table of Contents" })
		// .use(remarkPrism, { plugins: ['line-numbers'] })
		.use(remarkPrism)
		.use(remarkImages)
		.use(remarkRehype)
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, { behaviour: "wrap" })
		.use(rehypeDocument, { title: post.title })
		.use(rehypeFormat)
		.use(rehypeStringify)
		.process(post.mdContent || "");

	post.htmlContent = file.toString();

	return {
		props: {
			post: post,
		},
	};
};
