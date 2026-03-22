import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { LighterCartBadge } from "./lighters/LighterCartBadge";
import { LighterCartDrawer } from "./lighters/LighterCartDrawer";

export function ProductCartWrapper() {
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setMounted(true);
	}, []);

	// Avoid hydration mismatch by rendering nothing until after mount,
	// since persisted cart state (localStorage) only exists on client.
	if (!mounted) return null;

	const currentPathname = router.pathname;

	if (currentPathname.startsWith("/san-pham/lighters")) {
		return (
			<Box>
				<LighterCartBadge onClick={() => setIsCartOpen(true)} />
				<LighterCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
			</Box>
		);
	}

	return null;
}
