import { useLightersLayout } from "@/store";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import { Stack, Typography, ToggleButtonGroup, ToggleButton, Tooltip } from "@mui/material";
import React from "react";

const LayoutViewSwitch: React.FC = () => {
	const layoutView = useLightersLayout((state) => state.layoutView);
	const setLayoutView = useLightersLayout((state) => state.setLayoutView);

	return (
		<Stack id="switch-layout-view" direction="row" alignItems="center" gap={1}>
			<Typography variant="body2" color="text.secondary" fontWeight={500}>
				Hiển thị:
			</Typography>
			<ToggleButtonGroup
				value={layoutView}
				exclusive
				onChange={(_, value) => value && setLayoutView(value)}
				size="small"
				aria-label="layout view switch"
				color="primary"
			>
				<Tooltip title="Chế độ lưới" arrow>
					<ToggleButton value="grid" aria-label="grid layout">
						<GridViewIcon fontSize="small" />
					</ToggleButton>
				</Tooltip>
				<Tooltip title="Chế độ danh sách" arrow>
					<ToggleButton value="list" aria-label="list layout">
						<ViewAgendaIcon fontSize="small" />
					</ToggleButton>
				</Tooltip>
			</ToggleButtonGroup>
		</Stack>
	);
};

export default LayoutViewSwitch;
