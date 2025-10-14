import React from "react";

export const useLightersPage = () => {
	const [isCartOpen, setIsCartOpen] = React.useState(false);

	const handleCartOpen = () => {
		setIsCartOpen(true);
	};

	const handleCartClose = () => {
		setIsCartOpen(false);
	};

	return {
		isCartOpen,
		handleCartOpen,
		handleCartClose,
	};
};
