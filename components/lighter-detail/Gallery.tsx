import React from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
				infiniteLoop
				showIndicators
				showThumbs
				thumbWidth={80}
				renderThumbs={() =>
					images.map((img) => (
						<Image
							src={img.thumbUrl || img.url}
							alt={img.alt}
							key={img._key}
							unoptimized
							width={80}
							height={80}
							style={{ objectFit: "cover" }}
						/>
					))
				}
				useKeyboardArrows
				stopOnHover
				swipeable
				emulateTouch
				interval={3000}
				transitionTime={500}
				centerSlidePercentage={80}
				ariaLabel={`Carousel ${productName}`}
				selectedItem={lightboxIndex}
				onClickItem={(idx) => {
					setLightboxIndex(idx);
					setIsOpenLightBox(true);
				}}
			>
				{images.map((img, idx) => (
					<Box key={img._key} sx={{ cursor: "pointer" }}>
						<Image
							src={img.url}
							width="100%"
							height="100%"
							layout="responsive"
							priority={true}
							unoptimized
							alt={img.alt}
							style={{
								objectFit: "cover",
								border: "1px solid",
								borderColor: "divider",
								borderRadius: "16px",
								transition: "all 0.2 ease-in-out",
							}}
						/>
					</Box>
				))}
			</Carousel>
			{isOpenLightBox && (
				<Lightbox
					images={images.map((img) => ({ url: img.url, title: productName }))}
					startIndex={lightboxIndex}
					onClose={() => setIsOpenLightBox(false)}
				/>
			)}
		</Box>
	);
};

export default Gallery;
