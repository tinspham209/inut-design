import { LayoutProps } from "@/models";
import { Box, Stack } from "@mui/material";
import { Footer, Header } from "../common";

export function MainLayout({ children }: LayoutProps) {
	return (
		<>
			<Header />
			<article>
				<Stack minHeight="100vh">
					<Box component="main" flexGrow={1} mt="72px">
						{children}
					</Box>

					<Footer />
				</Stack>
			</article>
		</>
	);
}
