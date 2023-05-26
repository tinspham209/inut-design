import { LayoutProps } from "@/models";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { motion } from "framer-motion";
import { Footer, FooterSeo, Header } from "../common";
import { useSession } from "next-auth/react";
import React from "react";
const variants = {
	hidden: { opacity: 0, x: 0, y: 20 },
	enter: { opacity: 1, x: 0, y: 0 },
	exit: { opacity: 0, x: -0, y: 20 },
};

export function MainLayout({ children }: LayoutProps) {
	const session = useSession();
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);

	React.useEffect(() => {
		if (session && session.data) {
			setIsAuthenticated(true);
		}
	}, [session]);

	return (
		<>
			<FooterSeo />
			<motion.article
				initial="hidden"
				animate="enter"
				exit="exit"
				variants={variants}
				transition={{ duration: 0.4, type: "easeInOut" }}
				style={{ position: "relative" }}
			>
				<Stack minHeight="100vh">
					<Header isAuthenticated={isAuthenticated} />

					<Box component="main" flexGrow={1} mt={8}>
						{children}
					</Box>

					<Footer />
				</Stack>
			</motion.article>
		</>
	);
}
