import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import { colors } from "./theme";

export interface CommonCardProps {
	children: React.ReactNode;
	sx?: SxProps<Theme>;
	hoverSx?: SxProps<Theme>;
	onClick?: () => void;
	bgcolor?: string;
	borderColor?: string;
	interactive?: boolean;
}

export const CommonCard: React.FC<CommonCardProps> = ({
	children,
	sx = {},
	hoverSx = {},
	onClick,
	bgcolor = colors.ink2,
	borderColor = colors.ink3,
	interactive = true,
}) => {
	return (
		<Box
			onClick={onClick}
			sx={{
				bgcolor,
				borderRadius: "12px",
				border: `1px solid ${borderColor}`,
				p: 3.5,
				position: "relative",
				overflow: "hidden",
				transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
				...(interactive && {
					cursor: onClick ? "pointer" : "default",
					"&:hover": {
						borderColor: "rgba(255, 77, 0, 0.3)",
						transform: "translateY(-4px)",
						boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 77, 0, 0.1)",
						...hoverSx,
					},
				}),
				...sx,
			}}
		>
			{children}
		</Box>
	);
};
