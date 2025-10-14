import { COLOR_CODE } from "@/utils";
import { useLightersLayout } from "@/store";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";

const LayoutViewSwitch: React.FC = () => {
	const layoutView = useLightersLayout((state) => state.layoutView);
	const setLayoutView = useLightersLayout((state) => state.setLayoutView);

	return (
		<Box
			id="switch-layout-view"
			sx={{
				display: "flex",
				justifyContent: "flex-end",
				alignItems: "center",
				mt: 2,
				gap: 1,
			}}
		>
			<Typography variant="body2" color="text.secondary">
				Hiển thị:
			</Typography>
			<Box
				sx={{
					display: "flex",
					gap: 0.5,
					border: `1px solid ${COLOR_CODE.BORDER}`,
					borderRadius: 1,
					p: 0.5,
				}}
			>
				<Tooltip title="Dạng lưới">
					<IconButton
						size="small"
						onClick={() => setLayoutView("grid")}
						sx={{
							backgroundColor: layoutView === "grid" ? "primary.main" : "transparent",
							color: layoutView === "grid" ? "white" : "text.secondary",
							"&:hover": {
								backgroundColor: layoutView === "grid" ? "primary.dark" : "action.hover",
							},
						}}
					>
						<GridViewIcon fontSize="small" />
					</IconButton>
				</Tooltip>
				<Tooltip title="Dạng danh sách">
					<IconButton
						size="small"
						onClick={() => setLayoutView("list")}
						sx={{
							backgroundColor: layoutView === "list" ? "primary.main" : "transparent",
							color: layoutView === "list" ? "white" : "text.secondary",
							"&:hover": {
								backgroundColor: layoutView === "list" ? "primary.dark" : "action.hover",
							},
						}}
					>
						<ViewAgendaIcon fontSize="small" />
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	);
};

export default LayoutViewSwitch;
