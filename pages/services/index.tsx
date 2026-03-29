import { Seo } from "@/components/common";
import { RouteItem } from "@/components/common/header/routes";
import { ServiceCard, ServiceCardProps } from "@/components/common/ServiceCard";
import { MainLayout } from "@/components/layout";
import { findRouteByPath, mapChildRoutesToCards } from "@/lib/routeMapToCards";
import { NextPageWithLayout } from "@/models/common";
import { COLOR_CODE } from "@/utils";
import { Box, Breadcrumbs, Container, Grid, Link as MuiLink, Typography } from "@mui/material";
import { GetStaticProps } from "next";
import Link from "next/link";

interface Props {
	currentPath: string;
	currentRoute: RouteItem;
	cards: ServiceCardProps[];
}

const ServicesIndexPage: NextPageWithLayout<Props> = ({ currentPath, currentRoute, cards }) => {
	if (!currentRoute) {
		return null;
	}

	return (
		<Box component="section" sx={{ bgcolor: COLOR_CODE.INK }} pt={4} pb={10} minHeight="60vh">
			<Seo
				data={{
					title: "Dịch vụ in ấn chuyên nghiệp - INUT Design Đà Nẵng",
					description:
						currentRoute.meta?.description ||
						"Khám phá các dịch vụ in ấn, quà tặng doanh nghiệp and cá nhân hóa độc bản tại INUT Design Đà Nẵng.",
					url: `https://inutdesign.com${currentPath}`,
					thumbnailUrl: currentRoute.meta?.image || "/branding/ogImage.jpg",
				}}
			/>

			<Container maxWidth="lg">
				<Breadcrumbs sx={{ mb: 4 }}>
					<Link href="/" passHref legacyBehavior>
						<MuiLink sx={{ color: COLOR_CODE.TEXT_MUTED }} underline="hover">
							Trang chủ
						</MuiLink>
					</Link>
					<Typography sx={{ color: COLOR_CODE.WHITE }}>Dịch vụ</Typography>
				</Breadcrumbs>

				<Box mb={6}>
					<Typography
						variant="h3"
						component="h1"
						fontWeight="800"
						gutterBottom
						sx={{ color: COLOR_CODE.WHITE }}
					>
						{currentRoute.label}
					</Typography>
					<Typography
						variant="h6"
						sx={{ color: COLOR_CODE.TEXT_MUTED, maxWidth: 800, fontWeight: 400 }}
					>
						{currentRoute.meta?.description ||
							"Chúng tôi cung cấp các giải pháp in ấn sáng tạo, từ sticker, quà tặng lưu niệm đến ấn phẩm doanh nghiệp chất lượng cao."}
					</Typography>
				</Box>

				{cards.length > 0 ? (
					<Grid container spacing={1.5}>
						{cards.map((card) => (
							<Grid item key={card.href} xs={12} sm={6} md={4}>
								<ServiceCard {...card} />
							</Grid>
						))}
					</Grid>
				) : (
					<Box
						sx={{
							p: 8,
							textAlign: "center",
							bgcolor: COLOR_CODE.INK_3,
							borderRadius: 4,
							border: `2px dashed ${COLOR_CODE.INK_4}`,
						}}
					>
						<Typography variant="body1" sx={{ color: COLOR_CODE.TEXT_MUTED }}>
							Đang cập nhật thêm các nội dung cho dịch vụ này...
						</Typography>
					</Box>
				)}
			</Container>
		</Box>
	);
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const currentPath = "/services";
	const currentRoute = findRouteByPath(currentPath);

	if (!currentRoute) {
		return {
			notFound: true,
		};
	}

	const cards = mapChildRoutesToCards(currentPath);

	return {
		props: {
			currentPath,
			currentRoute,
			cards,
		},
	};
};

ServicesIndexPage.Layout = MainLayout;

export default ServicesIndexPage;
