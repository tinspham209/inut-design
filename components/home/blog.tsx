import { Post } from "@/models";
import { COLOR_CODE } from "@/utils";
import { Button, Container, Divider, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { PostItem } from "../blog";
type Props = {
	posts: Post[];
};

export function BlogsHome({ posts }: Props) {
	return (
		<Box component={"section"} bgcolor={COLOR_CODE.BACKGROUND_CARD} pt={2} pb={4} zIndex={999}>
			<Container>
				<Stack direction="row" py={3} justifyContent={"center"} alignItems={"center"}>
					<Typography
						variant="h3"
						fontWeight={"bold"}
						textAlign={"center"}
						color={"white"}
						fontFamily={'"Zawtturee", "Bangers" ,"Roboto", sans-serif'}
						letterSpacing="10px"
					>
						BLOG ({posts.length})
					</Typography>
				</Stack>

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

				<Stack direction="row" py={3} justifyContent={"center"} alignItems={"center"}>
					<Link href={`/blog`} passHref>
						<MuiLink>
							<Button variant="contained">Xem thêm Blog</Button>
						</MuiLink>
					</Link>
				</Stack>
			</Container>
			<Divider />
		</Box>
	);
}
