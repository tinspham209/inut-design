import React from "react";
import { Box, keyframes, Typography, SxProps, Theme } from "@mui/material";
import { colors, typography } from "./theme";

const grainShift = keyframes`
	0%, 100% { transform: translate(0, 0); }
	10% { transform: translate(-2%, -3%); }
	20% { transform: translate(3%, 2%); }
	30% { transform: translate(-1%, 4%); }
	40% { transform: translate(4%, -1%); }
	50% { transform: translate(-3%, 3%); }
	60% { transform: translate(2%, -4%); }
	70% { transform: translate(-4%, 1%); }
	80% { transform: translate(1%, -2%); }
	90% { transform: translate(3%, 4%); }
`;

export const NoiseOverlay: React.FC = () => (
	<Box
		sx={{
			position: "fixed",
			inset: 0,
			pointerEvents: "none",
			zIndex: 9000,
			opacity: 0.032,
			backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
			backgroundRepeat: "repeat",
			backgroundSize: "128px 128px",
			animation: `${grainShift} 8s steps(8) infinite`,
		}}
		aria-hidden="true"
	/>
);

export const WatermarkText: React.FC<{ text: string; sx?: SxProps<Theme> }> = ({ text, sx = {} }) => (
	<Typography
		sx={{
			position: "absolute",
			fontFamily: typography.syne,
			fontWeight: 800,
			color: "rgba(255, 255, 255, 0.015)",
			letterSpacing: "-0.05em",
			pointerEvents: "none",
			userSelect: "none",
			lineHeight: 1,
			...sx,
		}}
	>
		{text}
	</Typography>
);

const glowDrift = keyframes`
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(3%, 3%) scale(1.05); }
`;

export const FloatingGlow: React.FC<{
	size?: number;
	color?: string;
	top?: string | number;
	right?: string | number;
	bottom?: string | number;
	left?: string | number;
	animationDuration?: string;
	reverse?: boolean;
}> = ({
	size = 900,
	color = colors.orangeGlow,
	top,
	right,
	bottom,
	left,
	animationDuration = "12s",
	reverse = false,
}) => (
	<Box
		sx={{
			position: "absolute",
			width: size,
			height: size,
			borderRadius: "50%",
			background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
			top,
			right,
			bottom,
			left,
			pointerEvents: "none",
			animation: `${glowDrift} ${animationDuration} ease-in-out infinite ${reverse ? "alternate-reverse" : "alternate"}`,
			zIndex: 0,
		}}
	/>
);
