/* eslint-disable camelcase */
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import type { NextPageWithLayout } from "@/models/common";
import { CreativaBreadcrumbs } from "@/components/creativa/Breadcrumbs";
import { GUIDE_INDEX_PATH, MACBOOK_GUIDE, MACBOOK_GUIDE_PATH } from "@/data/creativa/guides";
import { trackCreativa } from "@/utils/creativa/analytics";

const Guides: NextPageWithLayout = () => (
	<>
		<CreativaSeo
			title="Hướng dẫn sử dụng skin MacBook"
			path={GUIDE_INDEX_PATH}
			description="Hướng dẫn tự dán và sử dụng skin MacBook cùng INUT Creativa."
		/>
		<Container maxWidth="md" sx={{ py: { xs: 2, md: 3 } }}>
			<CreativaBreadcrumbs
				ancestors={[
					{ label: "Creativa", href: "/creativa" },
					{ label: "Skin MacBook", href: "/creativa/skin-laptop" },
				]}
				current="Hướng dẫn sử dụng"
			/>
			<Stack gap={2} alignItems="flex-start" sx={{ mt: 3 }}>
				<Typography variant="overline">INUT CREATIVA / HƯỚNG DẪN</Typography>
				<Typography variant="h3" component="h1" sx={{ fontSize: { xs: 32, md: 42 } }}>
					Hướng dẫn sử dụng
				</Typography>
				<Typography color="text.secondary">
					Cùng INUT Creativa chuẩn bị và tự dán skin MacBook tại nhà.
				</Typography>
				<Box
					component="article"
					sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 3, width: "100%" }}
				>
					<Stack spacing={2} alignItems="flex-start">
						<Typography variant="h5" component="h2">
							{MACBOOK_GUIDE.title}
						</Typography>
						<Typography color="text.secondary">{MACBOOK_GUIDE.description}</Typography>
						<Link href={MACBOOK_GUIDE_PATH} passHref>
							<Button
								component="a"
								variant="contained"
								onClick={() =>
									trackCreativa("cta_click", {
										surface: "guide_index",
										cta_name: "macbook_application_guide",
									})
								}
							>
								Đọc hướng dẫn
							</Button>
						</Link>
					</Stack>
				</Box>
			</Stack>
		</Container>
	</>
);
Guides.Layout = CreativaLayout;
export default Guides;
