import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

export interface HeroSectionProps {
	title: string;
	description: string;
	image: string;
	chips?: string[];
	ctaLabel?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
	title,
	description,
	image,
	chips = [],
	ctaLabel = "Đặt in ngay",
}) => {
	return (
		<Box
			sx={{
				position: "relative",
				bgcolor: "#0f172a",
				color: "white",
				pt: { xs: 8, md: 12 },
				pb: { xs: 8, md: 12 },
				overflow: "hidden",
				textAlign: "center",
			}}
		>
			{/* Decorative background element */}
			<Box
				sx={{
					position: "absolute",
					top: -100,
					right: -100,
					width: 400,
					height: 400,
					borderRadius: "50%",
					background: "radial-gradient(circle, rgba(25, 118, 210, 0.15) 0%, rgba(25, 118, 210, 0) 70%)",
					zIndex: 0,
				}}
			/>

			<Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
				<Stack spacing={{ xs: 3, md: 4 }} alignItems="center">
					{chips.length > 0 && (
						<Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap">
							{chips.map((chip, index) => (
								<Chip
									key={index}
									label={chip}
									sx={{
										bgcolor: "rgba(25, 118, 210, 0.1)",
										color: "primary.light",
										border: "1px solid rgba(25, 118, 210, 0.3)",
										fontWeight: 700,
										fontSize: "0.875rem",
										backdropFilter: "blur(4px)",
										px: 1.5,
										py: 0.5,
									}}
								/>
							))}
						</Stack>
					)}

					<Typography
						variant="h1"
						fontWeight={900}
						sx={{
							fontSize: { xs: "2.8rem", md: "4.5rem" },
							lineHeight: 1.1,
							letterSpacing: "-0.02em",
							background: "linear-gradient(45deg, #fff 30%, #94a3b8 90%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
						}}
					>
						{title}
					</Typography>

					<Typography
						variant="h5"
						component="p"
						sx={{
							color: "slate.300",
							maxWidth: 720,
							mx: "auto",
							lineHeight: 1.7,
							fontWeight: 400,
							opacity: 0.9,
							fontSize: { xs: "1.1rem", md: "1.25rem" },
						}}
					>
						{description}
					</Typography>

					<Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
						<Button
							variant="contained"
							size="large"
							href="#order"
							sx={{
								px: { xs: 4, md: 6 },
								py: { xs: 1.5, md: 2 },
								fontSize: { xs: "1rem", md: "1.125rem" },
								fontWeight: 700,
								borderRadius: 2.5,
								boxShadow: "0 10px 25px -5px rgba(25, 118, 210, 0.45)",
								"&:hover": {
									transform: "translateY(-2px)",
									boxShadow: "0 12px 30px -5px rgba(25, 118, 210, 0.55)",
								},
								transition: "transform 0.2s, box-shadow 0.2s",
							}}
						>
							{ctaLabel}
						</Button>
						<Button
							variant="outlined"
							size="large"
							href="#gallery"
							sx={{
								px: { xs: 4, md: 6 },
								py: { xs: 1.5, md: 2 },
								fontSize: { xs: "1rem", md: "1.125rem" },
								fontWeight: 700,
								borderRadius: 2.5,
								color: "white",
								borderColor: "rgba(255,255,255,0.3)",
								"&:hover": {
									borderColor: "white",
									bgcolor: "rgba(255,255,255,0.1)",
								},
							}}
						>
							Xem mẫu thiết kế
						</Button>
					</Stack>

					<Box
						sx={{
							mt: { xs: 6, md: 10 },
							width: "100%",
							maxWidth: { xs: "100%", md: 960 },
							position: "relative",
							borderRadius: { xs: 3, md: 4 },
							overflow: "hidden",
							boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)",
							border: "1px solid rgba(255,255,255,0.15)",
						}}
					>
						<Box sx={{ position: "relative", pt: "56.25%" /* 16:9 */ }}>
							<Image src={image} alt={title} layout="fill" objectFit="cover" unoptimized />
						</Box>
					</Box>
				</Stack>
			</Container>
		</Box>
	);
};
