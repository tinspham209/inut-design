import React from "react";
import { Stack, Typography, SxProps, Theme } from "@mui/material";
import { SectionHeaderProps } from "./types";
import { colors, typography } from "./theme";

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; invert?: boolean }> = ({
	children,
	color = colors.orange,
	invert = false,
}) => (
	<Typography
		sx={{
			display: "inline-flex",
			alignItems: "center",
			gap: 1,
			fontFamily: typography.syne,
			fontSize: "0.68rem",
			fontWeight: 700,
			letterSpacing: "0.18em",
			textTransform: "uppercase",
			color: invert ? "rgba(255, 255, 255, 0.7)" : color,
			"&::before": {
				content: '""',
				width: 20,
				height: "2px",
				bgcolor: invert ? "rgba(255, 255, 255, 0.5)" : color,
				borderRadius: "2px",
			},
		}}
	>
		{children}
	</Typography>
);

export const SectionTitle: React.FC<{
	children: React.ReactNode;
	color?: string;
	invert?: boolean;
	sx?: SxProps<Theme>;
}> = ({ children, color = colors.white, invert = false, sx = {} }) => (
	<Typography
		variant="h2"
		sx={{
			fontFamily: typography.syne,
			fontSize: { xs: "2.2rem", md: "4rem" },
			fontWeight: 800,
			letterSpacing: "-0.04em",
			lineHeight: 1.05,
			color: invert ? colors.white : color,
			"& em": {
				fontFamily: typography.dmSerif,
				fontStyle: "italic",
				color: colors.ink,
			},
			...sx,
		}}
	>
		{typeof children === "string"
			? children.split("<br />").map((line, i) => (
					<React.Fragment key={i}>
						{line.includes("<em>") ? <span dangerouslySetInnerHTML={{ __html: line }} /> : line}
						{i < children.split("<br />").length - 1 && <br />}
					</React.Fragment>
			  ))
			: children}
	</Typography>
);

export const SectionHeader: React.FC<SectionHeaderProps> = ({
	eyebrow,
	title,
	description,
	children,
	sx = {},
	align = "left",
	invert = false,
}) => {
	return (
		<Stack spacing={2} sx={{ textAlign: align, ...sx }}>
			{eyebrow && <Eyebrow invert={invert}>{eyebrow}</Eyebrow>}
			{title && <SectionTitle invert={invert}>{title}</SectionTitle>}
			{description && (
				<Typography
					sx={{
						color: invert ? "rgba(255, 255, 255, 0.8)" : colors.smoke,
						lineHeight: 1.75,
						fontSize: "1rem",
						maxWidth: align === "center" ? "auto" : 480,
						mx: align === "center" ? "auto" : 0,
					}}
				>
					{description}
				</Typography>
			)}
			{children}
		</Stack>
	);
};
