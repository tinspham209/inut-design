import { LayoutProps } from "@/models";
import { Box, Stack } from "@mui/material";
import { Auth, Header } from "../common";

export function AdminLayout({ children }: LayoutProps) {
	return (
		<Auth>
			<>
				<Header />
				<article className="page-transition">
					<Stack minHeight="100vh">
						<Box component="main" flexGrow={1} mt={10}>
							{children}
						</Box>
					</Stack>
				</article>
			</>
		</Auth>
	);
}
