import React from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Portal } from "../common/Portal";

const Carousel = dynamic(() => import("react-material-ui-carousel"), { ssr: false });
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });
import "yet-another-react-lightbox/styles.css";

export type GalleryImage = {
	_key: string;
	url: string;
	alt: string;
	thumbUrl?: string;
};

interface GalleryProps {
	images: GalleryImage[];
	productName: string;
}

const Gallery: React.FC<GalleryProps> = ({ images, productName }) => {
	const [isOpenLightBox, setIsOpenLightBox] = React.useState(false);
	const [lightboxIndex, setLightboxIndex] = React.useState(0);

	return (
		<Box>
			<Carousel
				autoPlay
				indicators={true}
				navButtonsAlwaysVisible={true}
				index={lightboxIndex}
				onChange={(now) => setLightboxIndex(now as number)}
				sx={{
					"& .MuiImage-root": {
						objectFit: "cover",
						borderRadius: "16px",
					},
				}}
			>
				{images.map((img, idx) => (
					<Box
						key={img._key}
						sx={{
							cursor: "pointer",
							position: "relative",
							width: "100%",
							paddingTop: "100%",
						}}
						onClick={() => setIsOpenLightBox(true)}
					>
						<Image
							src={img.url}
							layout="fill"
							priority={idx === 0}
							unoptimized
							alt={img.alt}
							style={{
								objectFit: "cover",
								border: "1px solid",
								borderColor: "divider",
								borderRadius: "16px",
							}}
						/>
					</Box>
				))}
			</Carousel>
			{/* Thumbnails */}
			<Box sx={{ display: "flex", gap: 1, mt: 2, overflowX: "auto", pb: 1 }}>
				{images.map((img, idx) => (
					<Box
						key={`thumb-${img._key}`}
						onClick={() => setLightboxIndex(idx)}
						sx={{
							width: 80,
							height: 80,
							flexShrink: 0,
							cursor: "pointer",
							border: "2px solid",
							borderColor: lightboxIndex === idx ? "primary.main" : "transparent",
							borderRadius: "8px",
							overflow: "hidden",
							opacity: lightboxIndex === idx ? 1 : 0.6,
							transition: "all 0.2s",
							"&:hover": { opacity: 1 },
						}}
					>
						<Image
							src={img.thumbUrl || img.url}
							alt={img.alt}
							width={80}
							height={80}
							unoptimized
							style={{ objectFit: "cover" }}
						/>
					</Box>
				))}
			</Box>
			{isOpenLightBox && (
				<Portal>
					<Lightbox
						open={isOpenLightBox}
						close={() => setIsOpenLightBox(false)}
						index={lightboxIndex}
						slides={images.map((img) => ({ src: img.url }))}
					/>
				</Portal>
			)}
		</Box>
	);
};

export default Gallery;
