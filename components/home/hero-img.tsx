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
					width="100%"
					height="30%"
					layout="responsive"
					alt="avatar"
					priority={true}
				/>
			</Container>
		</Box>
	);
}
