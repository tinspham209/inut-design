import { ProductPageData } from "@/models/product-page";
import { Box, Button, Grid, Stack, Typography, Avatar } from "@mui/material";
import React from "react";
import { SectionWrapper, SectionHeader, WatermarkText, colors, typography } from "./shared";

interface ContactSectionProps {
	data: ProductPageData["contact"];
}

export const ContactSection: React.FC<ContactSectionProps> = ({ data }) => {
	const defaultPersons = [
		{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
		{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
	];

	const persons = data.persons || defaultPersons;

	return (
		<SectionWrapper
			id="contact"
			aria-labelledby="cta-h2"
			bgcolor={colors.orange}
			sx={{
				"&::after": {
					content: '""',
					position: "absolute",
					top: 0,
					right: "-5%",
					bottom: 0,
					width: "48%",
					bgcolor: "rgba(0, 0, 0, 0.15)",
					clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)",
					pointerEvents: "none",
					display: { xs: "none", md: "block" },
				},
			}}
		>
			<WatermarkText
				text="IN"
				sx={{
					right: "-3%",
					bottom: "-10%",
					fontSize: { xs: "8rem", md: "20rem" },
					color: "rgba(255, 255, 255, 0.06)",
				}}
			/>

			<Grid container spacing={6} alignItems="center">
				<Grid item xs={12} md={7}>
					<SectionHeader
						invert
						eyebrow={data.eyebrow || "✦ Bắt đầu dự án của bạn"}
						title={data.title || "Sẵn sàng tạo<br /><em>thương hiệu</em> của bạn?"}
						description={data.description}
					>
						<Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
							<Button
								variant="contained"
								href="https://zalo.me/0792359996"
								target="_blank"
								rel="noopener noreferrer"
								sx={{
									bgcolor: colors.yellow,
									color: colors.ink,
									fontFamily: typography.syne,
									fontWeight: 700,
									borderRadius: "8px",
									px: 4,
									py: 2,
									"&:hover": { bgcolor: colors.yellowHi, transform: "translateY(-3px)", boxShadow: "0 16px 40px rgba(255, 226, 52, 0.3)" },
									transition: "all 0.3s",
								}}
							>
								💬 Nhắn Zalo Ngay
							</Button>
							<Button
								variant="outlined"
								href="mailto:inutdesign@gmail.com"
								sx={{
									borderColor: "rgba(255, 255, 255, 0.3)",
									color: "white",
									fontFamily: typography.syne,
									fontWeight: 700,
									borderRadius: "8px",
									px: 4,
									py: 1.75,
									"&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.05)" },
								}}
							>
								✉ Gửi Email
							</Button>
						</Stack>
					</SectionHeader>
				</Grid>

				<Grid item xs={12} md={5}>
					<Stack spacing={2}>
						{persons.map((person, idx) => (
							<Box
								key={idx}
								component="a"
								href={`tel:${person.phone.replace(/\s/g, "")}`}
								sx={{
									bgcolor: "rgba(0, 0, 0, 0.2)",
									backdropFilter: "blur(12px)",
									border: "1px solid rgba(255, 255, 255, 0.15)",
									borderRadius: "14px",
									p: 2.5,
									display: "flex",
									alignItems: "center",
									gap: 2,
									transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
									color: "white",
									textDecoration: "none",
									"&:hover": { bgcolor: "rgba(0, 0, 0, 0.35)", transform: "translateX(6px)" },
								}}
							>
								<Avatar
									sx={{
										width: 46,
										height: 46,
										borderRadius: "10px",
										bgcolor: idx === 0 ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.25)",
										fontSize: "0.7rem",
										fontWeight: 800,
										fontFamily: typography.syne,
									}}
								>
									{person.initial}
								</Avatar>
								<Box>
									<Typography sx={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.55)", mb: 0.1 }}>
										{person.role}
									</Typography>
									<Typography sx={{ fontFamily: typography.syne, fontSize: "0.9rem", fontWeight: 700, color: "white" }}>
										{person.name}
									</Typography>
									<Typography sx={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)" }}>
										{person.phone}
									</Typography>
								</Box>
								<Box
									component="span"
									sx={{
										ml: "auto",
										bgcolor: "#0068ff",
										color: "white",
										fontFamily: typography.syne,
										fontSize: "0.62rem",
										fontWeight: 700,
										letterSpacing: "0.06em",
										textTransform: "uppercase",
										px: 1.5,
										py: 0.5,
										borderRadius: "6px",
									}}
								>
									Zalo
								</Box>
							</Box>
						))}

						<Box
							sx={{
								bgcolor: "rgba(0, 0, 0, 0.2)",
								border: "1px solid rgba(255, 255, 255, 0.12)",
								borderRadius: "12px",
								p: 2.25,
								textAlign: "center",
							}}
						>
							<Typography
								sx={{
									fontSize: "0.72rem",
									color: "rgba(255, 255, 255, 0.6)",
									fontFamily: typography.syne,
									fontWeight: 700,
									letterSpacing: "0.1em",
									textTransform: "uppercase",
									mb: 0.5,
								}}
							>
								Địa chỉ xưởng in
							</Typography>
							<Typography sx={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.85)", lineHeight: 1.6 }}>
								{data.address || (
									<>
										45/15 Ông Ích Khiêm, P. 12<br />Q. Thanh Khê, Đà Nẵng
									</>
								)}
							</Typography>
						</Box>
					</Stack>
				</Grid>
			</Grid>
		</SectionWrapper>
	);
};
