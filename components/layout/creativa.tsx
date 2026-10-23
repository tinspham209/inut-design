import { LayoutProps } from "@/models";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { CreativaStoreHeader, CreativaStoreFooter } from "@/components/creativa/Shell";
import { CreativaBuyerProvider } from "@/components/creativa/BuyerContext";

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
	typography: {
		fontFamily: "Roboto, Arial, sans-serif",
		fontSize: 13,
		h1: { fontSize: 28, lineHeight: 1.2 },
		h2: { fontSize: 26, lineHeight: 1.25 },
		h3: { fontSize: 24, lineHeight: 1.3 },
		h4: { fontSize: 22, lineHeight: 1.3 },
		h5: { fontSize: 18, lineHeight: 1.4 },
		h6: { fontSize: 16, lineHeight: 1.4 },
		body1: { fontSize: 14, lineHeight: 1.5 },
		body2: { fontSize: 13, lineHeight: 1.5 },
		caption: { fontSize: 12, lineHeight: 1.5 },
		button: { fontSize: 14, fontWeight: 600 },
	},
	shape: { borderRadius: 4 },
	components: {
		MuiButton: {
			styleOverrides: {
				root: { textTransform: "none", minHeight: 44 },
				textPrimary: ({ theme }) => ({ color: theme.palette.primary.dark }),
				outlinedPrimary: ({ theme }) => ({
					color: theme.palette.primary.dark,
					borderColor: theme.palette.primary.main,
				}),
				containedPrimary: ({ theme }) => ({
					backgroundColor: theme.palette.primary.dark,
					color: "#fff",
					"&:hover": {
						backgroundColor: "#8b2b00",
						color: "#fff",
						"@media (hover: none)": {
							backgroundColor: theme.palette.primary.dark,
							color: "#fff",
						},
					},
				}),
			},
		},
		MuiTextField: { defaultProps: { size: "small" } },
		MuiFormControl: { defaultProps: { size: "small" } },
		MuiInputBase: { styleOverrides: { root: { fontSize: 16, minHeight: 44 } } },
		MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
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
		<CreativaBuyerProvider>
			<ThemeProvider theme={creativaTheme}>
				<Box
					sx={{
						bgcolor: "background.default",
						color: "text.primary",
						minHeight: "100vh",
						fontSize: 14,
						fontFamily: "Roboto, Arial, sans-serif",
						lineHeight: 1.5,
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
		</CreativaBuyerProvider>
	);
}
