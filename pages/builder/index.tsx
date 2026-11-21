import { Seo } from "@/components/common";
import { BuilderPromotion } from "@/components/home";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { SITE_URL } from "@/utils/siteUrl";
import { COLOR_CODE } from "@/utils";
import { Box, Breadcrumbs, Container, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";

const BuilderIndexPage: NextPageWithLayout = () => (
	<Box component="section" sx={{ bgcolor: COLOR_CODE.INK }} pt={4} pb={4} minHeight="60vh">
		<Seo
			data={{
				title: "Công cụ thiết kế trực tuyến - INUT Design",
				description:
					"Tự tạo mẫu bật lửa và móc khóa mica với công cụ thiết kế trực tuyến của INUT Design.",
				url: `${SITE_URL}/builder`,
				thumbnailUrl: `${SITE_URL}/branding/builders/builders-og.avif`,
			}}
		/>
		<Container maxWidth="lg">
			<Breadcrumbs>
				<Link href="/" passHref legacyBehavior>
					<MuiLink sx={{ color: COLOR_CODE.TEXT_MUTED }} underline="hover">
						Trang chủ
					</MuiLink>
				</Link>
				<Typography sx={{ color: COLOR_CODE.WHITE }}>Công cụ thiết kế</Typography>
			</Breadcrumbs>
		</Container>
		<BuilderPromotion placement="builder_index" />
	</Box>
);

BuilderIndexPage.Layout = MainLayout;

export default BuilderIndexPage;
