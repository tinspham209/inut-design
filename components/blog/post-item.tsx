import { Post } from "@/models/post";
import { Box, Stack, Typography } from "@mui/material";
import { format } from "date-fns";

export interface PostItemProps {
	post: Post;
}

export function PostItem({ post }: PostItemProps) {
	if (!post) return null;
	return (
		<Box>
			<Typography variant="h5" fontWeight="bold">
				{post.title}
			</Typography>
			<Stack my={2} direction="row">
				<Typography variant="body1">
					{format(new Date(post.publishedDate), "dd MMM yyyy")}
				</Typography>
				{/* <Divider orientation="vertical" sx={{ mx: 2 }} flexItem />
				<Typography>{post.tagList.join(", ")}</Typography> */}
			</Stack>

			{post.description !== "" && <Typography variant="body2">{post.description}</Typography>}
		</Box>
	);
}
