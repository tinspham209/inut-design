import { LayoutProps } from "@/models";
import { Box, Stack } from "@mui/material";
import { Auth, Header } from "../common";

export function AdminLayout({ children }: LayoutProps) {
	return (
		<Auth>
			<>
				<article className="page-transition">
					<Stack minHeight="100vh">
						<Header />

						<Box component="main" flexGrow={1} mt={10}>
							{children}
						</Box>
					</Stack>
				</article>
			</>
		</Auth>
	);
}
