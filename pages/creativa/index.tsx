/* eslint-disable camelcase */
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import type { NextPageWithLayout } from "@/models/common";
import { trackCreativa } from "@/utils/creativa/analytics";
import { CreativaBreadcrumbs } from "@/components/creativa/Breadcrumbs";

const CreativaHome: NextPageWithLayout = () => (
	<>
		<CreativaSeo title="Thiết kế cho dấu ấn riêng" path="/creativa" />
		<Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
			<CreativaBreadcrumbs ancestors={[{ label: "INUT Design", href: "/" }]} current="Creativa" />
			<Stack gap={2} maxWidth={860}>
				<Typography variant="overline">INUT DESIGN / CREATIVA</Typography>
				<Typography
					component="h1"
					sx={{
						fontSize: { xs: 28, md: 40 },
						fontWeight: 500,
						lineHeight: 1.05,
						letterSpacing: "-.055em",
					}}
				>
					Thiết kế cho
					<br />
					dấu ấn riêng.
				</Typography>
				<Typography sx={{ maxWidth: 520, mt: 1, color: "text.secondary" }}>
					Không gian mới dành cho các sản phẩm của INUT Creativa. Bắt đầu với những mẫu skin MacBook
					— chọn thiết kế, mẫu máy và phạm vi dán theo cách của bạn.
				</Typography>
				<Box mt={2}>
					<Link href="/creativa/skin-laptop" passHref>
						<Button
							component="a"
							size="large"
							variant="outlined"
							sx={{ borderRadius: 20, px: 4 }}
							onClick={() => trackCreativa("cta_click", { cta_name: "shop_skin", surface: "home" })}
						>
							Khám phá skin MacBook
						</Button>
					</Link>
				</Box>
			</Stack>
			<Box sx={{ borderTop: "1px solid #dfcfc6", mt: { xs: 3, md: 4 }, pt: 2 }}>
				<Typography variant="overline">DANH MỤC ĐẦU TIÊN</Typography>
				<Link href="/creativa/skin-laptop" passHref>
					<Typography
						component="a"
						sx={{ display: "block", color: "inherit", fontSize: 22, my: 1 }}
					>
						Skin MacBook →
					</Typography>
				</Link>
				<Typography variant="body2" color="text.secondary">
					Những danh mục tiếp theo sẽ được giới thiệu khi sẵn sàng.
				</Typography>
			</Box>
		</Container>
	</>
);
CreativaHome.Layout = CreativaLayout;
export default CreativaHome;
