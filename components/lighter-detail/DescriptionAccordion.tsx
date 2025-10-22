import BlockContentWrapper from "@/components/common/block-content";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import React from "react";

interface PortableTextBlock {
	_key?: string;
	_type?: string;
	children?: { _key?: string; text?: string }[];
	[key: string]: unknown;
}

interface DescriptionAccordionProps {
	details?: PortableTextBlock[];
	lighterTypeDescription?: PortableTextBlock[];
	minOrder?: string;
}

const DescriptionAccordion: React.FC<DescriptionAccordionProps> = ({
	details,
	lighterTypeDescription,
}) => {
	const [expanded, setExpanded] = React.useState(true);

	return (
		<Accordion expanded={expanded} onChange={() => setExpanded((e) => !e)}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography fontWeight={600}>Mô tả sản phẩm</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Box>
					<Box
						sx={{
							position: "relative",
							overflow: "hidden",
							transition: "max-height .3s",
						}}
					>
						{details && <BlockContentWrapper blocks={details} />}
						{lighterTypeDescription && <BlockContentWrapper blocks={lighterTypeDescription} />}
					</Box>
				</Box>
			</AccordionDetails>
		</Accordion>
	);
};

export default DescriptionAccordion;
