import { LayoutProps } from "@/models";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { CreativaStoreHeader, CreativaStoreFooter } from "@/components/creativa/Shell";

const creativaTheme = createTheme({
	palette: {
		mode: "light",
		primary: { main: "#713d2c" },
		background: { default: "#fbf8f5", paper: "#fff" },
		text: { primary: "#52281f", secondary: "#80675f" },
	},
	typography: { fontFamily: "Roboto, Arial, sans-serif" },
	shape: { borderRadius: 4 },
	components: {
		MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
	},
});

export function CreativaLayout({ children }: LayoutProps) {
	return (
		<ThemeProvider theme={creativaTheme}>
			<Box
				sx={{
					bgcolor: "background.default",
					color: "text.primary",
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<CreativaStoreHeader />
				<Box component="main" sx={{ flex: 1 }}>
					{children}
				</Box>
				<CreativaStoreFooter />
			</Box>
		</ThemeProvider>
	);
}
