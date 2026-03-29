import { Post } from "@/models";
import { COLOR_CODE } from "@/utils";
import { Box, Button, Container, Link as MuiLink, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { PostItem } from "../blog";

type Props = {
	posts: Post[];
};

export function BlogsHome({ posts }: Props) {
	return (
		<Box
			component="section"
			bgcolor={COLOR_CODE.INK_2}
			sx={{ py: { xs: "60px", sm: "80px" }, px: { xs: 2, sm: "32px" } }}
		>
			<Container maxWidth="lg" disableGutters>
				{/* Section header */}
				<Box mb={4.5}>
					<Stack direction="row" alignItems="center" gap={1.25} mb={1.5}>
						<Box sx={{ width: 20, height: 2, bgcolor: COLOR_CODE.PRIMARY, flexShrink: 0 }} />
						<Typography
							sx={{
								fontWeight: 700,
								fontSize: "0.68rem",
								letterSpacing: "0.18em",
								textTransform: "uppercase",
								color: COLOR_CODE.PRIMARY,
							}}
						>
							Blog
						</Typography>
					</Stack>
					<Typography
						component="h2"
						sx={{
							fontWeight: 800,
							fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
							lineHeight: 1.05,
							letterSpacing: "-0.04em",
							color: COLOR_CODE.WHITE,
							mt: 1.5,
						}}
					>
						Tin{" "}
						<Box component="em" sx={{ fontStyle: "italic", color: COLOR_CODE.PRIMARY }}>
							Tức
						</Box>
					</Typography>
				</Box>

				{/* News list */}
				<Box
					component="ul"
					sx={{
						listStyleType: "none",
						p: 0,
						m: 0,
						bgcolor: COLOR_CODE.INK_4,
						borderRadius: "12px",
						overflow: "hidden",
					}}
				>
					{posts.map((post) => (
						<Box
							component="li"
							key={post.id}
							sx={{
								bgcolor: COLOR_CODE.INK_3,
								"&:not(:last-child)": {
									borderBottom: `1px solid ${COLOR_CODE.INK_4}`,
								},
							}}
						>
							<Link passHref href={`/blog/${post.slug}`}>
								<MuiLink
									underline="none"
									sx={{
										display: "block",
										p: "18px 16px",
										transition: "background 150ms",
										color: COLOR_CODE.WHITE,
										"&:hover": { bgcolor: COLOR_CODE.INK_4 },
									}}
								>
									<PostItem post={post} />
								</MuiLink>
							</Link>
						</Box>
					))}
				</Box>

				<Stack direction="row" py={3} justifyContent="center" alignItems="center">
					<Link href="/blog" passHref>
						<MuiLink underline="none">
							<Button
								variant="outlined"
								sx={{
									borderColor: COLOR_CODE.INK_4,
									color: COLOR_CODE.TEXT_MUTED,
									"&:hover": {
										borderColor: COLOR_CODE.PRIMARY,
										color: COLOR_CODE.PRIMARY,
										bgcolor: "transparent",
									},
								}}
							>
								Xem tất cả Tin Tức
							</Button>
						</MuiLink>
					</Link>
				</Stack>
			</Container>
		</Box>
	);
}
