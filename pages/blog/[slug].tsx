import { Post } from '@/models'
import { getPostList } from '@/utils'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import { Box, Button, Container, Divider } from '@mui/material'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkPrism from 'remark-prism'
import { PostItem } from '@/components/blog'
import Script from 'next/script'
import { Seo } from '@/components/common'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'

export interface BlogPageProps {
	post: Post
}

export default function BlogDetailPage({ post }: BlogPageProps) {
	if (!post) return null

	return (
		<Box my={6}>
			<Seo
				data={{
					title: post.title,
					description: post.description,
					url: `https://learn-nextjs-three-sage.vercel.app/blog/${post.slug}`,
					thumbnailUrl:
						'https://res.cloudinary.com/dmspucdtf/image/upload/v1659891297/learn-nextjs/next-js-automatic-image-optimization-next-image_cvlwnz.png',
				}}
			/>

			<Container>
				<Link passHref href={`/blog`}>
					<Button variant="outlined" sx={{ mb: 2 }}>
						Back to Blog
					</Button>
				</Link>
				<PostItem
					post={{
						id: post.id,
						slug: post.slug,
						title: post.title,
						description: '',
						publishedDate: post.publishedDate,
						tagList: post.tagList,
					}}
				/>

				<Divider />

				<div
					dangerouslySetInnerHTML={{
						__html: post.htmlContent || '',
					}}
				></div>
			</Container>

			<Script src="/prism.js" strategy="afterInteractive"></Script>
		</Box>
	)
}

BlogDetailPage.Layout = MainLayout

export const getStaticPaths: GetStaticPaths = async () => {
	const postList = await getPostList()

	return {
		paths: postList.map((post: Post) => ({ params: { slug: post.slug } })),
		fallback: false,
	}
}

export const getStaticProps: GetStaticProps<BlogPageProps> = async (
	context: GetStaticPropsContext
) => {
	const slug = context.params?.slug
	const postList = await getPostList()

	if (!slug) return { notFound: true }

	const post = postList.find((x) => x.slug === slug)
	if (!post) return { notFound: true }

	const file = await unified()
		.use(remarkParse)
		.use(remarkToc, { heading: 'Table of Contents' })
		// .use(remarkPrism, { plugins: ['line-numbers'] })
		.use(remarkPrism)
		.use(remarkRehype)
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, { behaviour: 'wrap' })
		.use(rehypeDocument, { title: post.title })
		.use(rehypeFormat)
		.use(rehypeStringify)
		.process(post.mdContent || '')

	post.htmlContent = file.toString()

	return {
		props: {
			post: post,
		},
	}
}
