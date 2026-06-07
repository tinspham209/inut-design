import { LayoutProps } from "@/models";
import { Box, Stack } from "@mui/material";
import { CreativaHeader, Footer } from "../common";

export function CreativaLayout({ children }: LayoutProps) {
	return (
		<>
			<CreativaHeader />
			<article>
				<Stack minHeight="100vh">
					<Box component="main" flexGrow={1} pt="72px">
						{children}
					</Box>

					<Footer />
				</Stack>
			</article>
		</>
	);
}
