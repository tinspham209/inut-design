import { bannerApi } from "@/api-client/banner";
import { urlFor } from "@/api-client/sanity-client";
import { PostItem } from "@/components/blog";
import { Seo } from "@/components/common";
import { HeroImage } from "@/components/home";
import { MainLayout } from "@/components/layout";
import { Post } from "@/models";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { getPostList } from "@/utils";
import { Box, Breadcrumbs, Container, Divider, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import { GetStaticProps } from "next/types";
import CountUp from "react-countup";

const BlogContainer: NextPageWithLayout = ({ posts, banner }: Props) => {
	return (
		<Box component={"section"} bgcolor="secondary.dark" pt={4} pb={4}>
			<Seo
				data={{
					title: "Blog - INUT Design",
					description:
						"Thiết kế & In ấn - Skin Laptop - Sticker - Decal - Thiệp - Card - Tem Nhãn, skin laptop da nang, skin laptop đà nẵng",
					url: "https://inutdesign.com/blog",
					thumbnailUrl:
						urlFor(banner.image).url() ||
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>

			<HeroImage imgUrl={urlFor(banner.image).url()} />
			<Container>
				<Box>
					<Breadcrumbs>
						<Link href={"/"} passHref>
							<MuiLink>Trang chủ</MuiLink>
						</Link>

						<Typography color="text.primary">Blog</Typography>
					</Breadcrumbs>
					<Box mt={3}>
						<Typography variant="h1" fontWeight="bold" textAlign="center">
							Blog (<CountUp end={posts.length} duration={1} />)
						</Typography>
					</Box>
					<Box component="ul" sx={{ listStyleType: "none", p: 0, mt: 3 }}>
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
				</Box>
			</Container>
		</Box>
	);
};

BlogContainer.Layout = MainLayout;

type Props = {
	posts: Post[];
	banner: Banner;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const posts = await getPostList();
	const banner: Banner = await bannerApi.getBannerPage("blogs-page");

	return {
		props: {
			posts: posts.sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1)),
			banner: banner ? banner[0] : [],
		},
	};
};

export default BlogContainer;
