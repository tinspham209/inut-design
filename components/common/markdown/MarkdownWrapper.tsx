import { Box } from "@mui/material";
import React, { FC } from "react";

type Props = {
	children: React.ReactNode;
};

const MarkdownWrapper: FC<Props> = ({ children }) => {
	return (
		<Box
			sx={{
				"& img": {
					maxWidth: "800px",
					minWidth: "360px",
					maxHeight: "400px",
					width: "100%",
					objectFit: "contain",
					borderRadius: "16px",
					transition: "all 0.2s ease-in-out",
					boxShadow: "-1px 3px 3px -1px rgb(0 0 0 / 25%)",
					"&:hover": {
						transform: "scale(1.05)",
					},
				},
				"& table": {
					width: "100%",
					borderCollapse: "collapse",
					marginTop: "1.5rem",
					marginBottom: "1.5rem",
					overflow: "auto",
					display: "block",
				},
				"& thead": {
					backgroundColor: "#f5f5f5",
				},
				"& th": {
					padding: "12px 16px",
					textAlign: "left",
					fontWeight: 600,
					borderBottom: "2px solid #ddd",
					borderRight: "1px solid #ddd",
					"&:last-child": {
						borderRight: "none",
					},
				},
				"& td": {
					padding: "12px 16px",
					borderBottom: "1px solid #ddd",
					borderRight: "1px solid #ddd",
					"&:last-child": {
						borderRight: "none",
					},
				},
				"& tbody tr": {
					transition: "background-color 0.2s ease",
					"&:hover": {
						backgroundColor: "#f9f9f9",
					},
				},
				"& p a": {},
			}}
		>
			{children}
		</Box>
	);
};

export default MarkdownWrapper;
