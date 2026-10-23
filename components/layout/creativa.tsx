import { LayoutProps } from "@/models";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { CreativaStoreHeader, CreativaStoreFooter } from "@/components/creativa/Shell";

const creativaTheme = createTheme({
	palette: {
		mode: "light",
		primary: { main: "#fd4d01", dark: "#ae3500", contrastText: "#20130c" },
		secondary: { main: "#ae3500" },
		background: { default: "#fffaf7", paper: "#fff" },
		text: { primary: "#261e19", secondary: "#665a52" },
		divider: "#eadfd7",
		action: { selected: "rgba(253, 77, 1, 0.12)" },
	},
	typography: { fontFamily: "Roboto, Arial, sans-serif" },
	shape: { borderRadius: 4 },
	components: {
		MuiButton: {
			styleOverrides: {
				root: { textTransform: "none" },
				textPrimary: ({ theme }) => ({ color: theme.palette.primary.dark }),
				outlinedPrimary: ({ theme }) => ({
					color: theme.palette.primary.dark,
					borderColor: theme.palette.primary.main,
				}),
				containedPrimary: ({ theme }) => ({
					"&:hover": {
						backgroundColor: theme.palette.primary.dark,
						color: "#fff",
						"@media (hover: none)": {
							backgroundColor: theme.palette.primary.main,
							color: theme.palette.primary.contrastText,
						},
					},
				}),
			},
		},
		MuiFormLabel: {
			styleOverrides: {
				root: ({ theme }) => ({
					"&.Mui-focused:not(.Mui-error)": { color: theme.palette.primary.dark },
				}),
			},
		},
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
				<Box
					component="main"
					sx={{
						flex: 1,
						"& a:not(.MuiButton-root)": {
							color: "primary.dark",
							textDecorationColor: "primary.main",
						},
					}}
				>
					{children}
				</Box>
				<CreativaStoreFooter />
			</Box>
		</ThemeProvider>
	);
}
