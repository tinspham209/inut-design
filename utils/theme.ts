import { BRAND_COLORS, BRAND_RADIUS, BRAND_TYPOGRAPHY } from "@/utils/design-tokens";
import { red } from "@mui/material/colors";
import { Theme, alpha, createTheme, responsiveFontSizes } from "@mui/material/styles";

export const COLOR_CODE = {
	PRIMARY: BRAND_COLORS.orange,
	PRIMARY_HOVER: BRAND_COLORS.orangeHi,
	WHITE: BRAND_COLORS.cream,
	BACKGROUND: BRAND_COLORS.backgroundLight,
	BACKGROUND_CARD: BRAND_COLORS.ink3,
	SURFACE_ELEVATED: BRAND_COLORS.ink2,
	BORDER: BRAND_COLORS.borderLight,
	BORDER_DARK: BRAND_COLORS.ink4,
	TEXT_DARK: BRAND_COLORS.ink3,
	TEXT_MUTED: BRAND_COLORS.smoke,
	TEXT_SOFT: BRAND_COLORS.dust,
	TEXT_CREAM: BRAND_COLORS.cream,
	INK: BRAND_COLORS.ink,
	INK_2: BRAND_COLORS.ink2,
	INK_3: BRAND_COLORS.ink3,
	INK_4: BRAND_COLORS.ink4,
	ORANGE_GLOW: BRAND_COLORS.orangeGlow,
	YELLOW: BRAND_COLORS.yellow,
};

// Create a theme instance.
export let theme: Theme = createTheme({
	typography: {
		fontFamily: BRAND_TYPOGRAPHY.body,
		h1: {
			fontFamily: BRAND_TYPOGRAPHY.display,
			fontWeight: 800,
			letterSpacing: "-0.04em",
			lineHeight: 1.05,
		},
		h2: {
			fontFamily: BRAND_TYPOGRAPHY.display,
			fontWeight: 800,
			letterSpacing: "-0.04em",
			lineHeight: 1.08,
		},
		h3: {
			fontFamily: BRAND_TYPOGRAPHY.display,
			fontWeight: 800,
			letterSpacing: "-0.03em",
		},
		h4: {
			fontFamily: BRAND_TYPOGRAPHY.display,
			fontWeight: 700,
			letterSpacing: "-0.02em",
		},
		h5: {
			fontFamily: BRAND_TYPOGRAPHY.display,
			fontWeight: 700,
		},
		h6: {
			fontFamily: BRAND_TYPOGRAPHY.display,
			fontWeight: 700,
			textTransform: "uppercase",
			letterSpacing: "0.08em",
			fontSize: "0.9rem",
		},
		button: {
			fontFamily: BRAND_TYPOGRAPHY.display,
			fontWeight: 700,
			letterSpacing: "0.06em",
			textTransform: "uppercase",
		},
		subtitle1: {
			fontFamily: BRAND_TYPOGRAPHY.display,
			fontWeight: 700,
		},
		subtitle2: {
			fontFamily: BRAND_TYPOGRAPHY.display,
			fontWeight: 700,
			letterSpacing: "0.08em",
			textTransform: "uppercase",
			fontSize: "0.75rem",
		},
		body1: {
			lineHeight: 1.7,
		},
		body2: {
			lineHeight: 1.65,
		},
		caption: {
			lineHeight: 1.6,
		},
	},
	palette: {
		mode: "light",
		primary: {
			main: COLOR_CODE.PRIMARY,
			dark: COLOR_CODE.PRIMARY_HOVER,
			contrastText: BRAND_COLORS.white,
		},
		secondary: {
			main: BRAND_COLORS.ink3,
			dark: COLOR_CODE.BACKGROUND,
			light: BRAND_COLORS.yellow,
		},
		error: {
			main: red.A400,
		},
		background: {
			default: COLOR_CODE.BACKGROUND,
			paper: BRAND_COLORS.white,
		},
		text: {
			primary: COLOR_CODE.TEXT_DARK,
			secondary: COLOR_CODE.TEXT_SOFT,
		},
		divider: COLOR_CODE.BORDER,
	},
	shape: {
		borderRadius: BRAND_RADIUS.card,
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				":root": {
					colorScheme: "light",
				},
				body: {
					backgroundColor: COLOR_CODE.BACKGROUND,
					color: COLOR_CODE.TEXT_DARK,
				},
				"::selection": {
					backgroundColor: BRAND_COLORS.orangeLo,
					color: COLOR_CODE.TEXT_DARK,
				},
			},
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
					color: "inherit",
					transition: "color 150ms ease",

					"&:hover, &.active": {
						color: COLOR_CODE.PRIMARY,
					},
				},
			},
		},
		MuiButton: {
			defaultProps: {
				disableElevation: true,
			},
			styleOverrides: {
				root: {
					borderRadius: BRAND_RADIUS.button,
					paddingInline: 20,
					paddingBlock: 10,
				},
				containedPrimary: {
					backgroundColor: COLOR_CODE.PRIMARY,
					boxShadow: `0 10px 24px ${alpha(BRAND_COLORS.orange, 0.22)}`,
					"&:hover": {
						backgroundColor: COLOR_CODE.PRIMARY_HOVER,
						boxShadow: `0 14px 28px ${alpha(BRAND_COLORS.orange, 0.28)}`,
					},
				},
				outlinedPrimary: {
					borderColor: alpha(BRAND_COLORS.orange, 0.45),
					"&:hover": {
						borderColor: COLOR_CODE.PRIMARY,
						backgroundColor: BRAND_COLORS.orangeLo,
					},
				},
			},
			variants: [
				{
					props: { variant: "contained", color: "primary" },
					style: {
						color: BRAND_COLORS.white,
					},
				},
			],
		},
		MuiChip: {
			variants: [
				{
					props: { color: "secondary" },
					style: {
						fontSize: 14,
						backgroundColor: BRAND_COLORS.ink3,
						color: BRAND_COLORS.cream,
						fontWeight: "bold",
					},
				},
			],
		},
		MuiDrawer: {
			defaultProps: {
				PaperProps: {
					style: {
						backgroundColor: BRAND_COLORS.white,
					},
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: BRAND_RADIUS.card,
					border: `1px solid ${COLOR_CODE.BORDER}`,
					boxShadow: "0 10px 24px rgba(8, 7, 6, 0.06)",
					backgroundImage: "none",
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: "none",
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				variant: "outlined",
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: BRAND_RADIUS.button,
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: COLOR_CODE.BORDER,
					},
					"&:hover .MuiOutlinedInput-notchedOutline": {
						borderColor: alpha(BRAND_COLORS.orange, 0.4),
					},
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor: COLOR_CODE.PRIMARY,
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
