import { LighterProduct, LighterType } from "@/models/cart";
import { useLightersLayout } from "@/store";
import { COLOR_CODE } from "@/utils";
import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import LighterCard from "./LighterCard";
import LighterCardBuilder from "./LighterCardBuilder";
import LighterCardCustomize from "./LighterCardCustomize";

interface LightersGridProps {
	lighters: (LighterProduct & {
		typeName: string;
		typeSlug: string;
	})[];
	lighterTypes: LighterType[];
	onCartOpen: () => void;
}

const LightersGrid: React.FC<LightersGridProps> = ({ lighters, lighterTypes, onCartOpen }) => {
	const layoutView = useLightersLayout((state) => state.layoutView);
	const gridItemProps = {
		xs: layoutView === "list" ? 12 : 6,
		md: layoutView === "list" ? 12 : 3,
		lg: layoutView === "list" ? 12 : 3,
	};

	return (
		<>
			<Grid item {...gridItemProps}>
				<LighterCardBuilder />
			</Grid>

			<Grid item {...gridItemProps}>
				<LighterCardCustomize />
			</Grid>

			{lighters.length === 0 ? (
				<Grid item xs={12}>
					<Box textAlign="center" py={4}>
						<Typography variant="h4" fontWeight="bold" sx={{ color: COLOR_CODE.TEXT_MUTED }}>
							Không có sản phẩm nào
						</Typography>
					</Box>
				</Grid>
			) : (
				lighters.map((lighter) => (
					<Grid item {...gridItemProps} key={lighter._id}>
						<LighterCard lighter={lighter} lighterTypes={lighterTypes} onCartOpen={onCartOpen} />
					</Grid>
				))
			)}
		</>
	);
};

export default LightersGrid;
