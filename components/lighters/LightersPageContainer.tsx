import { urlFor } from "@/api-client/sanity-client";
import { LighterCartBadge, LighterCartDrawer } from "@/components/cart";
import { Seo } from "@/components/common";
import { Banner } from "@/models/banner";
import { LighterProduct, LighterType } from "@/models/cart";
import { COLOR_CODE } from "@/utils";
import { Box, Container, Grid, Stack } from "@mui/material";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import { LayoutViewSwitch, LightersFilter, LightersGrid, LightersPageHeader } from ".";
import { useLightersPage } from "@/hooks/useLightersPage";

type LighterProductWithTypeName = LighterProduct & {
	typeName: string;
	typeSlug: string;
};

interface LightersPageContainerProps {
	lighters: LighterProductWithTypeName[];
	lighterTypes: LighterType[];
	banner: Banner[];
}

const LightersPageContainer: React.FC<LightersPageContainerProps> = ({
	lighters,
	lighterTypes,
	banner,
}) => {
	const [mounted, setMounted] = useState(false);
	const { isCartOpen, handleCartOpen, handleCartClose } = useLightersPage();

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
					title: "Bật lửa - Sản Phẩm - INUT Design",
					description:
						"Custom printed lighters with high quality materials. Various designs and bulk order options available.",
					url: "https://inutdesign.com/san-pham/lighters",
					thumbnailUrl:
						(banner && !isEmpty(banner) && urlFor(banner[0]?.image || "").url()) ||
						`/branding/ogImage.jpg`,
				}}
			/>

			<Container>
				<LightersPageHeader itemCount={lighters.length} />

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
						lighters={lighters}
						lighterTypes={lighterTypes}
						onCartOpen={handleCartOpen}
					/>
				</Grid>
			</Container>
		</Box>
	);
};

export default LightersPageContainer;
