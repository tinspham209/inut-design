import { sanityImageUrl } from "@/api-client/sanity-image";
import { LighterCartBadge, LighterCartDrawer } from "@/components/cart";
import { Seo } from "@/components/common";
import { useInfiniteCatalog } from "@/hooks/useInfiniteCatalog";
import { lightersApi } from "@/api-client/lighters";
import { Banner } from "@/models/banner";
import { LighterProduct, LighterType } from "@/models/cart";
import { COLOR_CODE } from "@/utils";
import { trackCatalogPagination } from "@/utils/analytics";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import { LayoutViewSwitch, LightersFilter, LightersGrid, LightersPageHeader } from ".";
import { useLightersPage } from "@/hooks/useLightersPage";
import { useRouter } from "next/router";

type LighterProductWithTypeName = LighterProduct & {
	typeName: string;
	typeSlug: string;
};

interface LightersPageContainerProps {
	lighters: LighterProductWithTypeName[];
	lighterTypes: LighterType[];
	banner: Banner[];
	total: number;
	page: number;
	pageSize: number;
}

const LightersPageContainer: React.FC<LightersPageContainerProps> = ({
	lighters,
	lighterTypes,
	banner,
	total,
	page,
	pageSize,
}) => {
	const [mounted, setMounted] = useState(false);
	const router = useRouter();
	const { isCartOpen, handleCartOpen, handleCartClose } = useLightersPage();
	const activeFilter = typeof router.query.filter === "string" ? router.query.filter : "";

	const loadPage = React.useCallback(
		async (nextPage: number) => {
			const catalog = await lightersApi.getLightersBatch({
				page: nextPage,
				pageSize,
				filter: activeFilter,
			});

			return catalog
				.filter((lighter) => !lighter._id.includes("drafts"))
				.map((lighter) => {
					const lighterType = lighterTypes.find((type) => type._id === lighter.lighterType?._ref);
					return {
						...lighter,
						typeName: lighterType?.name || "",
						typeSlug: lighterType?.slug?.current || "",
					};
				});
		},
		[activeFilter, lighterTypes, pageSize]
	);

	const onPageLoad = React.useCallback((nextPage: number) => {
		trackCatalogPagination("lighters", nextPage);
	}, []);

	const {
		items: loadedLighters,
		sentinelRef,
		isLoading,
		error,
		retry,
		hasMore,
	} = useInfiniteCatalog({
		initialItems: lighters,
		initialPage: page,
		pageSize,
		total,
		resetKey: activeFilter,
		loadPage,
		onPageLoad,
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Box
			component={"section"}
			sx={{
				bgcolor: COLOR_CODE.INK,
				pt: { xs: "60px", sm: "80px" },
				pb: { xs: "60px", sm: "80px" },
				px: { xs: 2, sm: "32px" },
			}}
		>
			{/* Floating Cart Badge - Only render after mount to avoid hydration mismatch */}
			{mounted && (
				<>
					<Box
						sx={{
							position: "fixed",
							bottom: 24,
							right: 24,
							zIndex: 1000,
						}}
					>
						<LighterCartBadge onClick={handleCartOpen} size="large" color="primary" />
					</Box>

					{/* Cart Drawer */}
					<LighterCartDrawer isOpen={isCartOpen} onClose={handleCartClose} />
				</>
			)}

			<Seo
				data={{
					title: "Bật Lửa Custom Đà Nẵng — In Theo Yêu Cầu | INUT Design",
					description:
						"In bật lửa theo yêu cầu tại Đà Nẵng. Nhận từ 1 cái, giao trong 2–3 ngày. Upload hình, INUT thiết kế miễn phí, duyệt rồi mới in. Zalo: 0327 124 321.",
					url: "https://inutdesign.com/san-pham/lighters",
					thumbnailUrl:
						(banner && !isEmpty(banner) && sanityImageUrl(banner[0]?.image, "seo")) ||
						`/branding/ogImage.jpg`,
				}}
			/>

			<Container>
				<LightersPageHeader itemCount={total} />

				<Stack
					direction="row"
					alignItems="center"
					justifyContent={{
						xs: "space-between",
						sm: "flex-end",
					}}
					// justifyContent="space-between"
					mt={2}
					gap={2}
					flexWrap="wrap"
				>
					<Box
						display={{
							xs: "block",
							sm: "none",
						}}
					>
						<LayoutViewSwitch />
					</Box>
					<Box>
						<LightersFilter lighterTypes={lighterTypes} />
					</Box>
				</Stack>

				<Grid container spacing={2} mt={1} id="lighterTitle">
					<LightersGrid
						lighters={loadedLighters}
						lighterTypes={lighterTypes}
						onCartOpen={handleCartOpen}
					/>
				</Grid>
				{hasMore && (
					<Box display="flex" justifyContent="center" py={2}>
						<Box ref={sentinelRef} minHeight={56}>
							{isLoading && <Typography color="text.secondary">Đang tải thêm sản phẩm...</Typography>}
							{error && (
								<Button color="primary" onClick={retry}>
									Không tải được. Thử lại
								</Button>
							)}
						</Box>
					</Box>
				)}
			</Container>
		</Box>
	);
};

export default LightersPageContainer;
