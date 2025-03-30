import { Box } from "@mui/material";
import * as React from "react";

interface TemplateProps {
	children: React.ReactElement;
}

export function Template(props: TemplateProps) {
	return <Box>{props.children}</Box>;
}
