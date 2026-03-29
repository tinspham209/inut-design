export const BRAND_COLORS = {
	ink: "#080706",
	ink2: "#111009",
	ink3: "#1c1a16",
	ink4: "#282420",
	ash: "#3d3830",
	dust: "#6b6157",
	smoke: "#a89e94",
	cream: "#f5f0e8",
	orange: "#ff4d00",
	orangeHi: "#ff6b25",
	orangeLo: "rgba(255, 77, 0, 0.14)",
	orangeGlow: "rgba(255, 77, 0, 0.30)",
	yellow: "#fff1b1",
	white: "#ffffff",
	backgroundLight: "#fffaf4",
	borderLight: "rgba(40, 36, 32, 0.14)",
	shadowDark: "0 20px 40px rgba(8, 7, 6, 0.24)",
} as const;

export const BRAND_TYPOGRAPHY = {
	display: '"Roboto", sans-serif',
	body: '"Roboto", sans-serif',
	serif: '"Roboto Serif", serif',
	meta: '"Albula Pro", "Roboto", sans-serif',
} as const;

export const BRAND_RADIUS = {
	button: 4,
	card: 12,
	panel: 16,
	pill: 999,
} as const;

export const BRAND_MOTION = {
	easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
	fast: "150ms",
	base: "200ms",
	slow: "300ms",
} as const;

export const BRAND_SHADOWS = {
	glow: `0 0 18px ${BRAND_COLORS.orangeGlow}`,
	floating: BRAND_COLORS.shadowDark,
} as const;

export const BRAND_SPACING = {
	sectionXs: 48,
	sectionSm: 64,
	sectionMd: 80,
	sectionLg: 96,
} as const;
