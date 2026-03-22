import { ReactNode } from "react";
import { SxProps, Theme } from "@mui/material";

export interface SectionProps {
	id?: string;
	children: ReactNode;
	bgcolor?: string;
	color?: string;
	sx?: SxProps<Theme>;
	maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

export interface SectionHeaderProps {
	eyebrow?: string;
	title?: string;
	description?: string;
	children?: ReactNode;
	sx?: SxProps<Theme>;
	align?: "left" | "center" | "right";
	invert?: boolean;
}
