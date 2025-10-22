import React from "react";
import { Box, Typography } from "@mui/material";
import BlockContentWrapper from "@/components/common/block-content";

interface DescriptionProps {
	details?: any;
	lighterTypeDescription?: any;
	minOrder?: string;
}

const Description: React.FC<DescriptionProps> = ({ details, lighterTypeDescription, minOrder }) => (
	<Box py={3}>
		<Typography variant="h6" fontWeight="bold">
			Mô tả sản phẩm:
		</Typography>
		{details && <BlockContentWrapper blocks={details} />}
		{lighterTypeDescription && <BlockContentWrapper blocks={lighterTypeDescription} />}
		{minOrder && (
			<Typography variant="body1" mt={1}>
				<b>Đơn hàng tối thiểu</b>: {minOrder}
			</Typography>
		)}
	</Box>
);

export default Description;
