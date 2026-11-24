import { Box, Container } from "@mui/material";
import Image from "next/image";

type Props = {
	imgUrl: string;
};

export function HeroImage({ imgUrl }: Props) {
	return (
		<Box component={"section"} pb={{ xs: 4 }}>
			<Container
				sx={{
					"& img": {
						borderRadius: "16px",
						objectFit: "cover",
					},
				}}
			>
				<Image
					src={imgUrl}
					width={1000}
					height={300}
					sizes="(min-width: 1200px) 1200px, 100vw"
					alt="avatar"
					priority={true}
					style={{ width: "100%", height: "auto" }}
				/>
			</Container>
		</Box>
	);
}
