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

const ProductsIndexPage: NextPageWithLayout<Props> = ({ currentPath, currentRoute, cards }) => {
	if (!currentRoute) {
		return null;
	}

	return (
		<Box component="section" bgcolor="secondary.dark" pt={4} pb={10} minHeight="60vh">
			<Seo
				data={{
					title: "Sản phẩm độc bản - INUT Design Đà Nẵng",
					description:
						currentRoute.meta?.description ||
						"Khám phá các sản phẩm cá nhân hóa, sticker and quà tặng độc bản tại INUT Design Đà Nẵng.",
					url: `https://inutdesign.com${currentPath}`,
					thumbnailUrl: currentRoute.meta?.image || "/branding/ogImage.jpg",
				}}
			/>

			<Container maxWidth="lg">
				<Breadcrumbs sx={{ mb: 4 }}>
					<Link href="/" passHref legacyBehavior>
						<MuiLink color="inherit" underline="hover">
							Trang chủ
						</MuiLink>
					</Link>
					<Typography color="text.primary">Sản phẩm</Typography>
				</Breadcrumbs>

				<Box mb={6}>
					<Typography
						variant="h3"
						component="h1"
						fontWeight="800"
						gutterBottom
						sx={{ color: COLOR_CODE.TEXT_DARK }}
					>
						{currentRoute.label}
					</Typography>
					<Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, fontWeight: 400 }}>
						{currentRoute.meta?.description ||
							"Chúng tôi mang đến những sản phẩm độc đáo, từ skin laptop, skin nút phím đến các dòng bật lửa cá nhân hóa chất lượng cao."}
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
							bgcolor: "rgba(0,0,0,0.02)",
							borderRadius: 4,
							border: "2px dashed rgba(0,0,0,0.1)",
						}}
					>
						<Typography variant="body1" color="text.secondary">
							Đang cập nhật thêm các sản phẩm mới...
						</Typography>
					</Box>
				)}
			</Container>
		</Box>
	);
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const currentPath = "/san-pham";
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

ProductsIndexPage.Layout = MainLayout;

export default ProductsIndexPage;
