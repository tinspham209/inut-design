import { LayoutProps } from "@/models";
import { Box, Stack } from "@mui/material";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("../common").then((mod) => mod.Header), { ssr: false });
const Footer = dynamic(() => import("../common").then((mod) => mod.Footer), { ssr: false });

export function MainLayout({ children }: LayoutProps) {
	return (
		<>
			<Header />
			<article>
				<Stack minHeight="100vh">
					<Box component="main" flexGrow={1} mt={8}>
						{children}
					</Box>

					<Footer />
				</Stack>
			</article>
		</>
	);
}
