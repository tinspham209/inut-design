import { LayoutProps } from "@/models";
import { Box, Stack } from "@mui/material";
import { Footer, FooterSeo, Header } from "../common";

export function MainLayout({ children }: LayoutProps) {
	return (
		<>
			<FooterSeo />
			<article className="page-transition">
				<Stack minHeight="100vh">
					<Header />

					<Box
						component="main"
						flexGrow={1}
						mt={{
							xs: 10,
							md: 9,
						}}
					>
						{children}
					</Box>

					<Footer />
				</Stack>
			</article>
		</>
	);
}
