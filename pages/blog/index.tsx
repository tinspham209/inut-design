import { GetStaticProps, GetStaticPropsContext } from 'next'
import * as React from 'react'
import Link from 'next/link'
import { getPostList } from '@/utils'
import { MainLayout } from '@/components/layout'
import { PostItem } from '@/components/blog'
import { Divider, Link as MuiLink } from '@mui/material'
import { Box, Container } from '@mui/system'
import { Post } from '@/models'
export interface BlogListPageProps {
	posts: Post[]
}

export default function BlogListPage({ posts }: BlogListPageProps) {
	console.log('posts: ', posts)
	return (
		<Box>
			<Container>
				<h1>Blog</h1>

				<Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
					{posts.map((post) => (
						<li key={post.id}>
							<Link passHref href={`/blog/${post.slug}`}>
								<MuiLink>
									<PostItem post={post} />
								</MuiLink>
							</Link>

							<Divider sx={{ my: 3 }} />
						</li>
					))}
				</Box>
			</Container>
		</Box>
	)
}

BlogListPage.Layout = MainLayout

export const getStaticProps: GetStaticProps<BlogListPageProps> = async (
	context: GetStaticPropsContext
) => {
	const data = await getPostList()

	return {
		props: {
			posts: data,
		},
	}
}
