import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Fab, Tooltip } from "@mui/material";
import React from "react";

const getDocHeight = () => {
	const D = document;
	return Math.max(
		D.body.scrollHeight,
		D.documentElement.scrollHeight,
		D.body.offsetHeight,
		D.documentElement.offsetHeight,
		D.body.clientHeight,
		D.documentElement.clientHeight
	);
};

const ScrollToBottom: React.FC = () => {
	const [showScrollToTopBtn, setShowScrollToTopBtn] = React.useState(false);

	React.useEffect(() => {
		window.addEventListener("scroll", () => {
			if (window.scrollY + window.innerHeight === getDocHeight()) {
				setShowScrollToTopBtn(true);
			} else {
				setShowScrollToTopBtn(false);
			}
		});
	}, []);
	return (
		<Tooltip title={`Scroll to ${showScrollToTopBtn ? "top" : "bottom"}`}>
			<Fab
				color="primary"
				sx={{
					position: "fixed",
					zIndex: 9999,
					bottom: 84,
					right: 8,
				}}
				onClick={() => {
					showScrollToTopBtn
						? window.scrollTo({ top: 0, behavior: "smooth" })
						: window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
				}}
			>
				{showScrollToTopBtn ? <ExpandLess /> : <ExpandMore />}
			</Fab>
		</Tooltip>
	);
};

export default ScrollToBottom;
