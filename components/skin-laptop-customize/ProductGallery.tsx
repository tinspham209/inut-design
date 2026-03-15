import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Portal } from "../common";

interface ProductGalleryProps {
	images: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const handleImageClick = (index: number) => {
		setCurrentImageIndex(index);
		setLightboxOpen(true);
	};

	const lightboxImages = images.map((img) => ({ src: img }));

	return (
		<Grid container spacing={1} id="gallery">
			<Grid item xs={12}>
				<Typography
					variant="h5"
					fontWeight={700}
					color="text.primary"
					gutterBottom
					sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" }, mb: { xs: 1.5, md: 2 } }}
				>
					Hình ảnh sản phẩm
				</Typography>
			</Grid>
			{images.map((img, index) => {
				const isFeatured = index < 2;
				return (
					<Grid
						item
						xs={isFeatured ? 12 : 6}
						sm={isFeatured ? 6 : 4}
						md={isFeatured ? 6 : 3}
						lg={isFeatured ? 6 : 2.4}
						key={`${img}-${index}`}
					>
						<Box
							onClick={() => handleImageClick(index)}
							sx={{
								position: "relative",
								borderRadius: 2,
								overflow: "hidden",
								backgroundColor: "rgba(255,255,255,0.05)",
								aspectRatio: isFeatured ? "16 / 9" : "1 / 1",
								transition: "transform 0.3s ease",
								cursor: "pointer",
								"&:hover": {
									transform: "scale(1.05)",
								},
							}}
						>
							<Image
								src={img}
								alt={`Skin Laptop Custom ${index + 1}`}
								width={800}
								height={isFeatured ? 450 : 800}
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
							/>
						</Box>
					</Grid>
				);
			})}

			{lightboxOpen && (
				<Portal>
					<Lightbox
						open={lightboxOpen}
						close={() => setLightboxOpen(false)}
						index={currentImageIndex}
						slides={lightboxImages}
					/>
				</Portal>
			)}
		</Grid>
	);
};
