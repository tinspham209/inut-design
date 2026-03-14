import { Box, ImageList, ImageListItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import React from "react";

interface ProductGalleryProps {
	images: string[];
	title?: string;
}

interface QuiltedPattern {
	cols: number;
	rows: number;
}

const QUILTED_PATTERN: QuiltedPattern[] = [
	{ cols: 2, rows: 2 },
	{ cols: 1, rows: 1 },
	{ cols: 1, rows: 1 },
	{ cols: 1, rows: 2 },
	{ cols: 1, rows: 1 },
	{ cols: 2, rows: 2 },
	{ cols: 1, rows: 1 },
	{ cols: 1, rows: 1 },
];

export const ProductGallery: React.FC<ProductGalleryProps> = ({
	images,
	title = "Hình ảnh mẫu sản phẩm",
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

	// Determine number of columns based on breakpoints
	const cols = isMobile ? 2 : isTablet ? 3 : 4;

	return (
		<Box id="gallery" sx={{ scrollMarginTop: "100px" }}>
			<Typography variant="h5" fontWeight={800} gutterBottom sx={{ fontSize: "1.5rem", mb: 3 }}>
				{title}
			</Typography>

			<ImageList
				variant="quilted"
				cols={cols}
				rowHeight={isMobile ? 150 : 200}
				gap={8}
				sx={{
					width: "100%",
					height: "auto",
					overflow: "hidden",
					borderRadius: 1,
				}}
			>
				{images.map((image, index) => {
					const pattern = QUILTED_PATTERN[index % QUILTED_PATTERN.length];
					// On mobile, we limit max cols to the grid's cols
					const itemCols = isMobile ? Math.min(pattern.cols, 2) : pattern.cols;
					const itemRows = isMobile ? Math.min(pattern.rows, 2) : pattern.rows;

					return (
						<ImageListItem key={index} cols={itemCols} rows={itemRows}>
							<Box
								sx={{
									position: "relative",
									width: "100%",
									height: "100%",
									overflow: "hidden",
									bgcolor: "grey.100",
									"&:hover img": {
										transform: "scale(1.05)",
									},
								}}
							>
								<Image
									src={image}
									alt={`Product sample ${index + 1}`}
									layout="fill"
									objectFit="cover"
									unoptimized
									style={{
										transition: "transform 0.3s ease-in-out",
									}}
								/>
							</Box>
						</ImageListItem>
					);
				})}
			</ImageList>
		</Box>
	);
};
