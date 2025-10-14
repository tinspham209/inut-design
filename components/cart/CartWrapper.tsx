import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { LighterCartBadge } from "./lighters/LighterCartBadge";
import { LighterCartDrawer } from "./lighters/LighterCartDrawer";

export function ProductCartWrapper() {
	const [isCartOpen, setIsCartOpen] = useState(false);
	const router = useRouter();

	const currentPathname = router.pathname;

	if (currentPathname.startsWith("/lighters")) {
		return (
			<Box>
				<LighterCartBadge onClick={() => setIsCartOpen(true)} />
				<LighterCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
			</Box>
		);
	}

	return null;
}
