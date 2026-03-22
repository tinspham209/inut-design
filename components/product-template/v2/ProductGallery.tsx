import { Box, ImageList, ImageListItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import dynamic from "next/dynamic";
import React from "react";
import { Portal } from "../../common/Portal";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });
import "yet-another-react-lightbox/styles.css";

export interface ProductGalleryProps {
	images: string[];
	title?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
	images,
	title = "Hình ảnh mẫu sản phẩm",
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
	const [isOpenLightBox, setIsOpenLightBox] = React.useState(false);
	const [lightboxIndex, setLightboxIndex] = React.useState(0);

	return (
		<Box id="gallery" sx={{ scrollMarginTop: "100px" }}>
			<Box sx={{ mb: 6, textAlign: "center" }}>
				<Typography
					variant="h3"
					fontWeight={900}
					gutterBottom
					sx={{ fontSize: { xs: "2rem", md: "2.75rem" } }}
				>
					{title}
				</Typography>
				<Box
					sx={{
						width: 60,
						height: 4,
						bgcolor: "primary.main",
						mx: "auto",
						borderRadius: 2,
					}}
				/>
			</Box>

			<ImageList
				variant="masonry"
				cols={isMobile ? 1 : isTablet ? 2 : 4}
				gap={isMobile ? 16 : 24}
				sx={{
					width: "100%",
					height: "auto",
					overflow: "hidden",
				}}
			>
				{images.map((image, index) => (
					<ImageListItem
						key={index}
						onClick={() => {
							setLightboxIndex(index);
							setIsOpenLightBox(true);
						}}
						sx={{
							cursor: "pointer",
							borderRadius: 4,
							overflow: "hidden",
							transition: "all 0.3s ease-in-out",
							boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
							"&:hover": {
								transform: "translateY(-5px)",
								boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
							},
						}}
					>
						<Image
							src={image}
							alt={`Product sample ${index + 1}`}
							width={500}
							height={500}
							layout="responsive"
							objectFit="cover"
							unoptimized
							style={{
								borderRadius: "16px",
							}}
						/>
					</ImageListItem>
				))}
			</ImageList>

			<Portal>
				<Lightbox
					open={isOpenLightBox}
					close={() => setIsOpenLightBox(false)}
					index={lightboxIndex}
					slides={images.map((src) => ({ src }))}
				/>
			</Portal>
		</Box>
	);
};
