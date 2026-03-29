import { useLightersCart } from "@/store";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
	Box,
	Drawer,
	IconButton,
	Stack,
	Typography,
	alpha,
} from "@mui/material";
import { LighterCartContent } from "./LighterCartContent";

export interface LighterCartDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

export function LighterCartDrawer({ isOpen, onClose }: LighterCartDrawerProps) {
	const { totalItems } = useLightersCart();

	return (
		<Drawer
			anchor="right"
			open={isOpen}
			onClose={onClose}
			sx={{
				"& .MuiDrawer-paper": {
					width: {
						xs: "100%",
						sm: "400px",
						md: "450px",
					},
					maxWidth: "100%",
				},
			}}
		>
			<Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
				{/* Header */}
				<Box
					sx={{
						p: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						borderBottom: 1,
						borderColor: "divider",
						backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
					}}
				>
					<Stack direction="row" spacing={1} alignItems="center">
						<ShoppingCartIcon color="primary" />
						<Typography variant="h6" fontWeight="bold">
							Giỏ hàng Bật lửa ({totalItems})
						</Typography>
					</Stack>
					<IconButton onClick={onClose} size="small">
						<CloseIcon />
					</IconButton>
				</Box>

				{/* Cart Content */}
				<Box sx={{ flex: 1, overflow: "hidden" }}>
					<LighterCartContent onActionComplete={onClose} />
				</Box>
			</Box>
		</Drawer>
	);
}
