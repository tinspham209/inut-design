import { Badge, Fab, IconButton, Tooltip } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useLightersCart } from "@/store";

export interface LighterCartBadgeProps {
	onClick?: () => void;
	size?: "small" | "medium" | "large";
	color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

export function LighterCartBadge({ onClick }: LighterCartBadgeProps) {
	const totalItems = useLightersCart((state) => state.totalItems);

	return (
		<Tooltip title="Giỏ hàng" arrow>
			<Fab
				onClick={onClick}
				color="primary"
				sx={{
					position: "fixed",
					zIndex: 999,
					bottom: 24,
					right: 8,
				}}
			>
				<Badge badgeContent={totalItems} color="error" max={99}>
					<ShoppingCartIcon />
				</Badge>
			</Fab>
		</Tooltip>
	);
}
