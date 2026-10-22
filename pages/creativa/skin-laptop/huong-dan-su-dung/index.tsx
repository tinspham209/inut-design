import { Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import type { NextPageWithLayout } from "@/models/common";

const Guides: NextPageWithLayout = () => (
	<>
		<CreativaSeo title="Hướng dẫn sử dụng" path="/creativa/skin-laptop/huong-dan-su-dung" noindex />
		<Container maxWidth="md" sx={{ py: 8 }}>
			<Stack gap={2} alignItems="flex-start">
				<Typography variant="overline">INUT CREATIVA / HƯỚNG DẪN</Typography>
				<Typography variant="h3" component="h1">
					Hướng dẫn đang được chuẩn bị
				</Typography>
				<Typography>
					Các hướng dẫn dán và sử dụng skin MacBook sẽ được công bố sau khi nội dung được xác nhận.
				</Typography>
				<Link href="/creativa/skin-laptop" passHref>
					<Button component="a" variant="outlined">
						Khám phá thiết kế
					</Button>
				</Link>
			</Stack>
		</Container>
	</>
);
Guides.Layout = CreativaLayout;
export default Guides;
