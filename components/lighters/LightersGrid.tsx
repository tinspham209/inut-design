import { LighterProduct, LighterType } from "@/models/cart";
import { useLightersLayout } from "@/store";
import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import LighterCard from "./LighterCard";

interface LightersGridProps {
	lighters: (LighterProduct & {
		typeName: string;
		typeSlug: string;
	})[];
	lighterTypes: LighterType[];
	onCartOpen: () => void;
}

const LightersGrid: React.FC<LightersGridProps> = ({ lighters, lighterTypes, onCartOpen }) => {
	const router = useRouter();
	const { filter } = router.query;
	const layoutView = useLightersLayout((state) => state.layoutView);

	const filteredLighters = lighters.filter((lighter) =>
		lighter.typeSlug.includes((filter as string) || "")
	);

	if (filteredLighters.length === 0) {
		return (
			<Grid item xs={12}>
				<Box textAlign="center" py={4}>
					<Typography variant="h4" fontWeight="bold" color="text.secondary">
						Không có sản phẩm nào
					</Typography>
				</Box>
			</Grid>
		);
	}

	return (
		<>
			{filteredLighters.map((lighter) => (
				<Grid
					item
					xs={layoutView === "list" ? 12 : 6}
					md={layoutView === "list" ? 12 : 3}
					lg={layoutView === "list" ? 12 : 3}
					key={lighter._id}
				>
					<LighterCard lighter={lighter} lighterTypes={lighterTypes} onCartOpen={onCartOpen} />
				</Grid>
			))}
		</>
	);
};

export default LightersGrid;
