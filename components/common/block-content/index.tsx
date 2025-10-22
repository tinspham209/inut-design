import React, { FC } from "react";
import BlockContent from "@sanity/block-content-to-react";
import { Box } from "@mui/material";

type Props = {
	blocks: any;
};

const BlockContentWrapper: FC<Props> = ({ blocks }) => {
	return (
		<Box
			id="block-content-wrapper"
			sx={{
				// add more styles as needed
				"& h1": {
					fontSize: "2rem",
					fontWeight: "bold",
					mt: 3,
					mb: 2,
				},
				"& h2": {
					fontSize: "1.75rem",
					fontWeight: "bold",
					mt: 3,
					mb: 2,
				},
				"& h3": {
					fontSize: "1.5rem",
					fontWeight: "bold",
					mt: 2,
					mb: 1.5,
				},
				"& h4": {
					fontSize: "1.25rem",
					fontWeight: "bold",
					mt: 2,
					mb: 1,
				},
				"& p": {
					fontSize: "1rem",
					lineHeight: 1.7,
					mb: 2,
				},
				"& blockquote": {
					borderLeft: "4px solid #1976d2",
					background: "#f5f5f5",
					pl: 2,
					py: 1,
					mb: 2,
					fontStyle: "italic",
					color: "text.secondary",
				},
				"& ul": {
					pl: 3,
					mb: 2,
				},
				"& li": {
					mb: 1,
					fontSize: "1rem",
				},
				"& a": {
					color: "primary.main",
					textDecoration: "underline",
					transition: "color 0.2s",
					"&:hover": {
						color: "secondary.main",
					},
				},
				"& strong": {
					fontWeight: "bold",
				},
				"& em": {
					fontStyle: "italic",
				},
				"& img": {
					maxWidth: "100%",
					borderRadius: 2,
					boxShadow: 1,
					my: 2,
					display: "block",
					marginLeft: "auto",
					marginRight: "auto",
				},
			}}
		>
			<BlockContent
				blocks={blocks}
				projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
				dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
			/>
		</Box>
	);
};

export default BlockContentWrapper;
