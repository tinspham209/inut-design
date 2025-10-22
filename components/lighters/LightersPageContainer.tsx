import { urlFor } from "@/api-client/sanity-client";
import { LighterCartBadge, LighterCartDrawer } from "@/components/cart";
import { Seo } from "@/components/common";
import { Banner } from "@/models/banner";
import { LighterProduct, LighterType } from "@/models/cart";
import { Box, Container, Grid, Stack } from "@mui/material";
import _ from "lodash";
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
		<Box component={"section"} bgcolor="secondary.dark" pt={4} pb={4}>
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
					title: "Lighters - INUT Design",
					description:
						"Custom printed lighters with high quality materials. Various designs and bulk order options available.",
					url: "https://inutdesign.com/lighters",
					thumbnailUrl:
						(banner && !_.isEmpty(banner) && urlFor(banner[0]?.image || "").url()) ||
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
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
