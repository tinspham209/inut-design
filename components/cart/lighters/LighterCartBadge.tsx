import { useLightersCart } from "@/store";
import { trackEvent } from "@/utils/analytics";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, Fab, Tooltip } from "@mui/material";

export interface LighterCartBadgeProps {
	onClick?: () => void;
	size?: "small" | "medium" | "large";
	color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

export function LighterCartBadge({ onClick }: LighterCartBadgeProps) {
	const totalItems = useLightersCart((state) => state.totalItems);

	const handleBadgeClick = () => {
		trackEvent("cart_view", {
			source: "floating_badge",
			total_items: totalItems,
		});
		onClick?.();
	};

	return (
		<Tooltip title="Giỏ hàng" arrow>
			<Fab
				onClick={handleBadgeClick}
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
