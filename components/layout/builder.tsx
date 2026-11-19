import { Box } from "@mui/material";
import { Header } from "@/components/common";
import type { LayoutProps } from "@/models";

export function BuilderLayout({ children }: LayoutProps) {
	return <>
		<Header />
		<Box component="main" sx={{ pt: "72px", height: { md: "100vh" }, minHeight: "100vh", boxSizing: "border-box", overflow: { md: "hidden" }, overflowX: "hidden" }}>{children}</Box>
	</>;
}
