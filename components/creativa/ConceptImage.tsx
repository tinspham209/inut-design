import { Box } from "@mui/material";
import Image from "next/image";

export function ConceptImage({
	src,
	alt,
	aspect = "1",
	priority = false,
	alternate,
}: {
	src: string;
	alt: string;
	aspect?: string;
	priority?: boolean;
	alternate?: string;
}) {
	return (
		<Box
			component="figure"
			sx={{
				m: 0,
				position: "relative",
				overflow: "hidden",
				aspectRatio: aspect,
				bgcolor: "#cbe7f7",
				"& .hover-image": { opacity: 0, transition: "opacity .35s ease" },
				"@media (hover: hover)": { "&:hover .hover-image": { opacity: 1 } },
				"@media (prefers-reduced-motion: reduce)": { "& .hover-image": { transition: "none" } },
			}}
		>
			<Image
				src={src}
				alt={alt}
				layout="fill"
				objectFit="cover"
				priority={priority}
				sizes="(min-width: 900px) 50vw, 100vw"
			/>
			{alternate && (
				<Box className="hover-image" aria-hidden="true" sx={{ position: "absolute", inset: 0 }}>
					<Image
						src={alternate}
						alt=""
						layout="fill"
						objectFit="cover"
						sizes="(min-width: 900px) 33vw, 80vw"
					/>
				</Box>
			)}
		</Box>
	);
}

