import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import type { CreativaImage } from "@/models/creativa";
import { sanityImageUrl } from "@/api-client/sanity-image";
import { validCreativaImageRef } from "@/utils/creativa/contracts";

function Thumbnail({ image, name }: { image?: CreativaImage; name: string }) {
	const [failed, setFailed] = useState(false);
	const available = validCreativaImageRef(image?.asset?._ref) && !failed;
	return (
		<Box
			sx={{
				width: { xs: 64, sm: 76 },
				height: { xs: 64, sm: 76 },
				flexShrink: 0,
				position: "relative",
				bgcolor: "background.paper",
				border: "1px solid",
				borderColor: "divider",
				display: "grid",
				placeItems: "center",
				overflow: "hidden",
			}}
		>
			{available ? (
				<Image
					src={sanityImageUrl(image, "tiny")}
					alt={image.alt || name}
					layout="fill"
					objectFit="contain"
					onError={() => setFailed(true)}
				/>
			) : (
				<Typography variant="caption" textAlign="center" sx={{ px: 0.5, fontSize: 10 }}>
					Ảnh chưa sẵn sàng
				</Typography>
			)}
		</Box>
	);
}

export function CreativaProductThumbnail(props: { image?: CreativaImage; name: string }) {
	return <Thumbnail key={props.image?.asset?._ref || "missing"} {...props} />;
}
