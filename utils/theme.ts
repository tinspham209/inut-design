import { Theme, createTheme, responsiveFontSizes } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const COLOR_CODE = {
	PRIMARY: "#f53844",
	WHITE: "rgba(255, 255, 255, 0.92)",
	BACKGROUND: "rgb(250, 250, 251);",
	BACKGROUND_CARD: "#1c1f26",
	BORDER: "rgba(240, 240, 240, 1)",
	TEXT_DARK: "rgba(38, 38, 38, 1)",
};

// Create a theme instance.
export let theme: Theme = createTheme({
	typography: {
		fontFamily: '"Roboto", sans-serif',
	},
	palette: {
		mode: "light",
		primary: {
			main: COLOR_CODE.PRIMARY,
		},
		secondary: {
			main: "#00A8CC",
			dark: COLOR_CODE.BACKGROUND,
			light: "#EDF7FA",
		},
		error: {
			main: red.A400,
		},
		text: {
			primary: COLOR_CODE.TEXT_DARK,
		},
	},
	components: {
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
					color: "inherit",

					"&:hover, &.active": {
						color: COLOR_CODE.PRIMARY,
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
		MuiDrawer: {
			defaultProps: {
				PaperProps: {
					style: {
						backgroundColor: COLOR_CODE.BACKGROUND,
					},
				},
			},
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
