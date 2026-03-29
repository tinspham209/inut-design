import { ServiceCard, ServiceCardProps } from "@/components/common/ServiceCard";
import { MainLayout } from "@/components/layout";
import { findRouteByPath, mapChildRoutesToCards } from "@/lib/routeMapToCards";
import { NextPageWithLayout } from "@/models/common";
import { COLOR_CODE } from "@/utils";
import { Box, Breadcrumbs, Container, Grid, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { Seo } from "@/components/common";
import { GetStaticPaths, GetStaticProps } from "next";
import { ROUTE_LIST, RouteItem } from "@/components/common/header/routes";

interface Props {
	currentPath: string;
	currentRoute: RouteItem;
	cards: ServiceCardProps[];
}

const ServiceDynamicPage: NextPageWithLayout<Props> = ({ currentPath, currentRoute, cards }) => {
	if (!currentRoute) {
		return null;
	}

	return (
		<Box component="section" sx={{ bgcolor: COLOR_CODE.INK }} pt={4} pb={10} minHeight="60vh">
			<Seo
				data={{
					title: `${currentRoute.label} - Dịch vụ -  INUT Design`,
					description:
						currentRoute.meta?.description ||
						`Khám phá các dịch vụ ${currentRoute.label} chuyên nghiệp tại INUT Design Đà Nẵng.`,
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
					<Link href="/services" passHref legacyBehavior>
						<MuiLink sx={{ color: COLOR_CODE.TEXT_MUTED }} underline="hover">
							Dịch vụ
						</MuiLink>
					</Link>
					<Typography sx={{ color: COLOR_CODE.WHITE }}>{currentRoute.label}</Typography>
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
						{currentRoute.meta?.description}
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

export const getStaticPaths: GetStaticPaths = async () => {
	const paths: { params: { slug: string[] } }[] = [];

	/**
	 * Helper function to recursively find all branch routes under /services
	 */
	const extractPaths = (routes: RouteItem[]) => {
		for (const route of routes) {
			const pathSegments = route.path.split("/").filter(Boolean);
			// We only care about /services/* paths that have children (category pages)
			if (pathSegments[0] === "services" && pathSegments.length > 1 && route.children) {
				// The slug should be the segments AFTER /services
				const slug = pathSegments.slice(1);
				paths.push({ params: { slug } });
			}

			if (route.children) {
				extractPaths(route.children);
			}
		}
	};

	extractPaths(ROUTE_LIST);

	return {
		paths,
		fallback: false, // Or 'blocking' if you expect more routes to be added dynamically
	};
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const slug = params?.slug as string[];
	const currentPath = `/services/${slug.join("/")}`;
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

ServiceDynamicPage.Layout = MainLayout;

export default ServiceDynamicPage;
