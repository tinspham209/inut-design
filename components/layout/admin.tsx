import { LayoutProps } from "@/models";
import { Box, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { Auth, Header } from "../common";
const variants = {
	hidden: { opacity: 0, x: 0, y: 20 },
	enter: { opacity: 1, x: 0, y: 0 },
	exit: { opacity: 0, x: -0, y: 20 },
};
export function AdminLayout({ children }: LayoutProps) {
	return (
		<Auth>
			<>
				<motion.article
					initial="hidden"
					animate="enter"
					exit="exit"
					variants={variants}
					transition={{ duration: 0.4, type: "tween" }}
					style={{ position: "relative" }}
				>
					<Stack minHeight="100vh">
						<Header />

						<Box component="main" flexGrow={1} mt={10}>
							{children}
						</Box>
					</Stack>
				</motion.article>
			</>
		</Auth>
	);
}
