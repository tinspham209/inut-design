import React from "react";
import { Box, Container } from "@mui/material";
import { SectionProps } from "./types";
import { colors } from "./theme";

export const SectionWrapper: React.FC<SectionProps> = ({
	id,
	children,
	bgcolor = colors.ink,
	color = colors.white,
	sx = {},
	maxWidth = "lg",
}) => {
	return (
		<Box
			component="section"
			id={id}
			sx={{
				py: { xs: 8, md: 18 },
				position: "relative",
				overflow: "hidden",
				bgcolor,
				color,
				...sx,
			}}
		>
			<Container maxWidth={maxWidth}>{children}</Container>
		</Box>
	);
};
