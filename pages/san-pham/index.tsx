import { Seo } from "@/components/common";
import { RouteItem } from "@/components/common/header/routes";
import { ServiceCard, ServiceCardProps } from "@/components/common/ServiceCard";
import { MainLayout } from "@/components/layout";
import { findRouteByPath, mapChildRoutesToCards } from "@/lib/routeMapToCards";
import { NextPageWithLayout } from "@/models/common";
import { COLOR_CODE } from "@/utils";
import {
	Box,
	Breadcrumbs,
	Container,
	Grid,
	Link as MuiLink,
	Stack,
	Typography,
} from "@mui/material";
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
		<Box
			component="section"
			sx={{
				bgcolor: COLOR_CODE.INK,
				pt: { xs: "60px", sm: "80px" },
				pb: { xs: "60px", sm: "80px" },
				minHeight: "60vh",
				px: { xs: 2, sm: "32px" },
			}}
		>
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

			<Container maxWidth="lg" disableGutters>
				<Breadcrumbs
					sx={{
						mb: 4,
						"& .MuiBreadcrumbs-separator": { color: COLOR_CODE.TEXT_SOFT },
						"& li": { color: COLOR_CODE.TEXT_SOFT },
					}}
				>
					<Link href="/" passHref legacyBehavior>
						<MuiLink
							sx={{ color: COLOR_CODE.TEXT_SOFT, "&:hover": { color: COLOR_CODE.WHITE } }}
							underline="hover"
						>
							Trang chủ
						</MuiLink>
					</Link>
					<Typography sx={{ color: COLOR_CODE.TEXT_MUTED }}>Sản phẩm</Typography>
				</Breadcrumbs>

				<Box mb={6}>
					<Stack direction="row" alignItems="center" gap={1.25} mb={1.5}>
						<Box sx={{ width: 20, height: 2, bgcolor: COLOR_CODE.PRIMARY }} />
						<Typography
							sx={{
								fontWeight: 700,
								fontSize: "0.68rem",
								letterSpacing: "0.18em",
								textTransform: "uppercase",
								color: COLOR_CODE.PRIMARY,
							}}
						>
							SẢN PHẨM
						</Typography>
					</Stack>
					<Typography
						variant="h3"
						component="h1"
						fontWeight="800"
						gutterBottom
						sx={{ color: COLOR_CODE.WHITE, letterSpacing: "-0.04em" }}
					>
						{currentRoute.label}
					</Typography>
					<Typography
						variant="h6"
						sx={{ maxWidth: 800, fontWeight: 400, color: COLOR_CODE.TEXT_MUTED }}
					>
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
							bgcolor: COLOR_CODE.INK_3,
							borderRadius: 4,
							border: `2px dashed ${COLOR_CODE.INK_4}`,
						}}
					>
						<Typography variant="body1" sx={{ color: COLOR_CODE.TEXT_MUTED }}>
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
