import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
export let theme = createTheme({
	typography: {
		fontFamily: '"Roboto", sans-serif',
	},
	palette: {
		primary: {
			main: "#9e2121",
		},
		secondary: {
			main: "#00A8CC",
			dark: "#0e1e1d",
			light: "#EDF7FA",
		},
		error: {
			main: red.A400,
		},
		text: {
			primary: "#21243D",
		},
	},
	components: {
		MuiTypography: {
			variants: [
				{
					props: { variant: "button" },
					style: {
						fontFamily: '"Bangers" ,"Roboto", sans-serif',
					},
				},
			],
		},
		MuiContainer: {
			defaultProps: {
				maxWidth: "lg",
			},
		},
		MuiLink: {
			defaultProps: {
				underline: "hover",
			},
			styleOverrides: {
				root: {
					color: "black",
					"&:hover, &.active": {
						color: "#9e2121",
					},
				},
			},
		},
		MuiButton: {
			variants: [
				{
					props: { variant: "contained", color: "primary" },
					style: {
						color: "white",
					},
				},
			],
		},
		MuiChip: {
			variants: [
				{
					props: { color: "secondary" },
					style: {
						fontSize: 16,
						backgroundColor: "#142850",
						color: "white",
						fontWeight: "bold",
					},
				},
			],
		},
	},
});

export const muiResponsive = {
	MOBILE: "(max-width:600px)",
	TABLET: "(max-width:960px)",
	LARGE_SCREEN: "(max-width:1200px)",
	EXTRA_LARGE_SCREEN: "(max-width:1440px)",
};

theme = responsiveFontSizes(theme);
