import { urlFor } from "@/api-client/sanity-client";
import { LighterCartBadge, LighterCartDrawer } from "@/components/cart";
import { Seo } from "@/components/common";
import { Banner } from "@/models/banner";
import { LighterProduct, LighterType } from "@/models/cart";
import { Box, Container, Grid } from "@mui/material";
import _ from "lodash";
import React from "react";
import {
	LayoutViewSwitch,
	LightersFilter,
	LightersGrid,
	LightersPageHeader,
} from "../../components/lighters";
import { useLightersPage } from "../../hooks/useLightersPage";

type LighterProductWithTypeName = LighterProduct & {
	typeName: string;
	typeSlug: string;
};

interface LightersPageContainerProps {
	lighters: LighterProductWithTypeName[];
	lighterTypes: LighterType[];
	banner: Banner[];
}

export const LightersPageContainer: React.FC<LightersPageContainerProps> = ({
	lighters,
	lighterTypes,
	banner,
}) => {
	const { isCartOpen, handleCartOpen, handleCartClose } = useLightersPage();

	return (
		<Box component={"section"} bgcolor="secondary.dark" pt={4} pb={4}>
			{/* Floating Cart Badge */}
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

				<LayoutViewSwitch />

				<Grid
					container
					spacing={2}
					mt={3}
					flexDirection={{
						xs: "column-reverse",
						md: "row",
					}}
				>
					<Grid container item xs={12} md={9} spacing={3} id="lighterTitle">
						<LightersGrid
							lighters={lighters}
							lighterTypes={lighterTypes}
							onCartOpen={handleCartOpen}
						/>
					</Grid>

					<Grid container item xs={12} md={3}>
						<LightersFilter lighterTypes={lighterTypes} />
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};
