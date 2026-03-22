import { ProductPageData } from "@/models/product-page";
import { Box, Button, Chip, Container, Grid, Stack, Typography, keyframes } from "@mui/material";
import React, { useEffect, useState } from "react";
import { colors, typography, FloatingGlow, WatermarkText } from "./shared";

interface HeroSectionProps {
	data: ProductPageData["hero"];
}

const tickerMove = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

export const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
	const [isUnderlined, setIsUnderlined] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsUnderlined(true), 400);
		return () => clearTimeout(timer);
	}, []);

	const defaultTicker = [
		"✦ In Ấn Chất Lượng Cao",
		"Giấy Couche · Kraft · Mỹ Thuật",
		"Thiết Kế Miễn Phí",
		"Giao Hàng Toàn Quốc",
	];

	const defaultStats = [
		{ value: "10.000", unit: "+", label: "Sản phẩm đã xuất xưởng" },
		{ value: "500", unit: "+", label: "Khách hàng tin tưởng" },
		{ value: "5.0", unit: "★", label: "Điểm đánh giá trung bình" },
		{ value: "24", unit: "h", label: "Giao hàng nhanh nhất" },
	];

	const tickerItems = data.ticker || defaultTicker;
	const statsItems = data.stats || defaultStats;

	return (
		<Box
			component="section"
			aria-labelledby="hero-h1"
			sx={{
				minHeight: "100svh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				position: "relative",
				overflow: "hidden",
				bgcolor: colors.ink,
				color: colors.cream,
			}}
		>
			<FloatingGlow top="-20%" right="-15%" />
			<FloatingGlow bottom="-10%" left="-10%" color="rgba(255, 226, 52, 0.06)" animationDuration="16s" reverse />

			<Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, width: "100%", px: { xs: 2, md: 4 }, py: { xs: 10, md: 0 } }}>
				<Grid container alignItems="center">
					<Grid item xs={12} md={6}>
						<Stack spacing={4}>
							<Stack direction="row" spacing={1} flexWrap="wrap">
								{data.chips?.map((chip, idx) => (
									<Chip
										key={idx}
										label={chip}
										sx={{
											bgcolor: idx === 0 ? colors.orangeLo : "transparent",
											color: idx === 0 ? colors.orange : colors.dust,
											border: `1px solid ${idx === 0 ? "rgba(255, 77, 0, 0.3)" : colors.ash}`,
											borderRadius: "99px",
											fontSize: "0.68rem",
											fontWeight: 600,
											letterSpacing: "0.06em",
											textTransform: "uppercase",
											height: "auto",
											"& .MuiChip-label": { px: 1.5, py: 0.5 },
										}}
									/>
								))}
							</Stack>

							<Typography
								variant="h1"
								id="hero-h1"
								sx={{
									fontFamily: typography.syne,
									fontSize: { xs: "2.8rem", md: "5.2rem" },
									fontWeight: 800,
									letterSpacing: "-0.04em",
									lineHeight: 1,
									color: "white",
								}}
							>
								{data.title.split("<br />").map((line, i) => (
									<React.Fragment key={i}>
										{line.split(" ").map((word, j) => {
											const isAccent = word.toLowerCase().includes("inut") || word.toLowerCase().includes("postcard");
											return (
												<React.Fragment key={j}>
													{isAccent ? (
														<Box
															component="span"
															sx={{
																display: "inline-block",
																position: "relative",
																color: colors.orange,
																fontStyle: "italic",
																fontFamily: typography.dmSerif,
																fontWeight: 700,
																"&::after": {
																	content: '""',
																	position: "absolute",
																	bottom: "-4px",
																	left: 0,
																	right: 0,
																	height: "3px",
																	background: colors.yellow,
																	transform: isUnderlined ? "scaleX(1)" : "scaleX(0)",
																	transformOrigin: "left",
																	transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
																	borderRadius: "2px",
																},
															}}
														>
															{word}
														</Box>
													) : word}
													{" "}
												</React.Fragment>
											);
										})}
										{i < data.title.split("<br />").length - 1 && <br />}
									</React.Fragment>
								))}
							</Typography>

							<Typography
								variant="body1"
								sx={{
									fontSize: "1rem",
									lineHeight: 1.75,
									color: colors.smoke,
									maxWidth: 440,
								}}
							>
								{data.description}
							</Typography>

							<Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
								<Button
									variant="contained"
									href="#contact"
									sx={{
										bgcolor: colors.orange,
										color: "white",
										fontFamily: typography.syne,
										fontWeight: 700,
										fontSize: "0.88rem",
										textTransform: "uppercase",
										px: 4,
										py: 1.75,
										borderRadius: "8px",
										boxShadow: `0 0 0 0 ${colors.orangeGlow}`,
										transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
										"&:hover": {
											bgcolor: colors.orangeHi,
											transform: "translateY(-3px) scale(1.02)",
											boxShadow: `0 16px 40px ${colors.orangeGlow}`,
										},
									}}
								>
									{data.ctaLabel || "Đặt In Ngay"} →
								</Button>
								<Button
									variant="text"
									href="#portfolio"
									sx={{
										color: colors.smoke,
										fontFamily: typography.syne,
										fontWeight: 700,
										fontSize: "0.82rem",
										textTransform: "uppercase",
										px: 0,
										"&:hover": {
											bgcolor: "transparent",
											color: colors.cream,
											"& .ico": { transform: "translateX(5px)" },
										},
									}}
								>
									{data.secondaryCtaLabel || "Xem portfolio"}
									<Box component="span" className="ico" sx={{ ml: 1, transition: "transform 0.3s" }}>
										↗
									</Box>
								</Button>
							</Stack>
						</Stack>
					</Grid>

					<Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "grid" }, height: "100%" }}>
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gridTemplateRows: "1fr 1fr 1fr",
								gap: "3px",
								bgcolor: colors.ink3,
								height: "600px",
							}}
						>
							<Box
								sx={{
									gridRow: "span 2",
									bgcolor: "#0f0d0b",
									p: 2,
									display: "flex",
									alignItems: "flex-end",
									position: "relative",
									overflow: "hidden",
									"&:hover .mono": { transform: "translate(-6px, -6px) scale(1.03)" },
								}}
							>
								<Typography
									className="mono"
									sx={{
										position: "absolute",
										fontFamily: typography.syne,
										fontSize: "9rem",
										fontWeight: 800,
										color: "rgba(255, 255, 255, 0.06)",
										bottom: -16,
										right: -8,
										letterSpacing: "-0.05em",
										lineHeight: 1,
										transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
									}}
								>
									IN
								</Typography>
								<Chip
									label="Premium Quality"
									sx={{
										bgcolor: "rgba(0,0,0,0.35)",
										backdropFilter: "blur(8px)",
										color: "white",
										border: "1px solid rgba(255,255,255,0.12)",
										borderRadius: "99px",
										fontSize: "0.65rem",
										fontWeight: 700,
										letterSpacing: "0.1em",
										textTransform: "uppercase",
										height: "auto",
									}}
								/>
							</Box>
							<Box
								sx={{
									bgcolor: colors.orange,
									p: 2,
									display: "flex",
									alignItems: "flex-end",
									position: "relative",
									overflow: "hidden",
									"&:hover": { bgcolor: colors.orangeHi },
									"&:hover .mono": { transform: "translate(-6px, -6px) scale(1.03)" },
								}}
							>
								<Typography
									className="mono"
									sx={{
										position: "absolute",
										fontFamily: typography.syne,
										fontSize: "4rem",
										fontWeight: 800,
										color: "rgba(255, 255, 255, 0.12)",
										bottom: -16,
										right: -8,
										letterSpacing: "-0.05em",
										lineHeight: 1,
										transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
									}}
								>
									NU
								</Typography>
								<Chip
									label="Expertise"
									sx={{
										bgcolor: "rgba(0,0,0,0.3)",
										color: "white",
										borderRadius: "99px",
										fontSize: "0.65rem",
										fontWeight: 700,
										height: "auto",
									}}
								/>
							</Box>
							<Box
								sx={{
									bgcolor: "#141210",
									p: 2,
									display: "flex",
									alignItems: "flex-end",
									position: "relative",
									overflow: "hidden",
									"&:hover .mono": { transform: "translate(-6px, -6px) scale(1.03)" },
								}}
							>
								<Typography
									className="mono"
									sx={{
										position: "absolute",
										fontFamily: typography.syne,
										fontSize: "3rem",
										fontWeight: 800,
										color: "rgba(255, 255, 255, 0.06)",
										bottom: -16,
										right: -8,
										letterSpacing: "-0.05em",
										lineHeight: 1,
										transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
									}}
								>
									UT
								</Typography>
								<Chip
									label="Creative"
									sx={{
										bgcolor: "rgba(0,0,0,0.35)",
										color: "white",
										borderRadius: "99px",
										fontSize: "0.65rem",
										fontWeight: 700,
										height: "auto",
									}}
								/>
							</Box>
							<Box
								sx={{
									gridColumn: "span 2",
									bgcolor: colors.yellow,
									p: 2,
									display: "flex",
									alignItems: "flex-end",
									position: "relative",
									overflow: "hidden",
									"&:hover": { bgcolor: colors.yellowHi },
									"&:hover .mono": { transform: "translate(-6px, -6px) scale(1.03)" },
								}}
							>
								<Typography
									className="mono"
									sx={{
										position: "absolute",
										fontFamily: typography.syne,
										fontSize: "3rem",
										fontWeight: 800,
										color: "rgba(0,0,0,0.08)",
										bottom: -16,
										right: -8,
										letterSpacing: "-0.05em",
										lineHeight: 1,
										transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
									}}
								>
									INUT
								</Typography>
								<Chip
									label="✦ Custom Solutions"
									sx={{
										bgcolor: "rgba(0,0,0,0.12)",
										color: "#1a1714",
										border: "1px solid rgba(0,0,0,0.05)",
										borderRadius: "99px",
										fontSize: "0.65rem",
										fontWeight: 700,
										height: "auto",
									}}
								/>
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Container>

			{/* Watermark */}
			<WatermarkText
				text={data.title.split(" ")[0].toUpperCase()}
				sx={{
					left: "-2%",
					top: "50%",
					transform: "translateY(-50%) rotate(-90deg)",
					transformOrigin: "center",
					fontSize: { xs: "5rem", md: "14rem" },
					color: "rgba(255, 255, 255, 0.025)",
					whiteSpace: "nowrap",
					display: { xs: "none", md: "block" },
				}}
			/>

			{/* Ticker Strip */}
			<Box
				sx={{
					bgcolor: colors.orange,
					py: 1,
					overflow: "hidden",
					zIndex: 3,
				}}
			>
				<Box
					sx={{
						display: "flex",
						gap: 6,
						width: "max-content",
						animation: `${tickerMove} 22s linear infinite`,
						"&:hover": { animationPlayState: "paused" },
					}}
				>
					{[1, 2, 3, 4].map((i) => (
						<React.Fragment key={i}>
							{tickerItems.map((item, idx) => (
								<React.Fragment key={idx}>
									<Typography
										sx={{
											fontFamily: typography.syne,
											fontSize: "0.7rem",
											fontWeight: 700,
											letterSpacing: "0.14em",
											textTransform: "uppercase",
											color: "white",
											display: "flex",
											alignItems: "center",
											gap: 1,
											whiteSpace: "nowrap",
										}}
									>
										✦ {item}
									</Typography>
									<Typography sx={{ color: "rgba(255,255,255,0.45)" }}>◆</Typography>
								</React.Fragment>
							))}
						</React.Fragment>
					))}
				</Box>
			</Box>

			{/* Stats Strip */}
			<Box sx={{ bgcolor: "#111009", borderTop: `1px solid ${colors.ink3}`, borderBottom: `1px solid ${colors.ink3}`, py: 5 }}>
				<Container maxWidth="lg">
					<Grid container spacing={4} justifyContent="center">
						{statsItems.map((stat, idx) => (
							<Grid item xs={6} md={3} key={idx} sx={{ textAlign: "center", borderRight: { md: idx < 3 ? `1px solid ${colors.ink3}` : "none" } }}>
								<Typography
									sx={{
										fontFamily: typography.syne,
										fontSize: { xs: "2.2rem", md: "3.2rem" },
										fontWeight: 800,
										letterSpacing: "-0.04em",
										lineHeight: 1,
										color: "white",
										display: "flex",
										alignItems: "baseline",
										justifyContent: "center",
										gap: 0.5,
									}}
								>
									{stat.value}
									<Box component="span" sx={{ fontSize: "0.55em", color: colors.orange }}>{stat.unit}</Box>
								</Typography>
								<Typography sx={{ fontSize: "0.75rem", color: colors.dust, mt: 1, fontWeight: 500, letterSpacing: "0.04em" }}>
									{stat.label}
								</Typography>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>
		</Box>
	);
};
