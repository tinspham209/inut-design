import { Box, Button, Chip, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

// ─── Design tokens (mirrored from inut_hero_final.html) ────────────────────
const C = {
	orange: "#ff4d00",
	yellow: "#ffe234",
	ink: "#080706",
	ink3: "#1c1a16",
	ink4: "#282420",
	ash: "#3d3830",
	cream: "#f5f0e8",
	smoke: "#a89e94",
	dust: "#6b6157",
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────
type TagVariant = "orange" | "yellow" | "dark";

interface ProductCardItem {
	name: string;
	sub: string;
	tag: string;
	tagVariant: TagVariant;
	href: string;
}

interface StatItem {
	num: string;
	label: string;
	yellow?: boolean;
}

export interface HeroSectionProps {
	/** Override the primary CTA link (default: /san-pham) */
	ctaPrimaryHref?: string;
	/** Override the secondary CTA link (default: /contact) */
	ctaSecondaryHref?: string;
}

// ─── Static data ────────────────────────────────────────────────────────────
const PRODUCT_CARDS: ProductCardItem[] = [
	{
		name: "Bật Lửa",
		sub: "In logo thương hiệu · Phôi bật lửa Cricket",
		tag: "HOT",
		tagVariant: "orange",
		href: "#lighters",
	},
	{
		name: "Sticker & Decal",
		sub: "Sticker Sheet · Sticker Magnet · Sticker Diecut · Sticker Kisscut",
		tag: "500+ MẪU",
		tagVariant: "dark",
		href: "#sticker",
	},
	{
		name: "Skin Laptop · Nút Phím",
		sub: "Dán lại không dính keo · Cắt CNC chuẩn xác 99% cho mọi dòng máy.",
		tag: "HOT",
		tagVariant: "orange",
		href: "#macnuts",
	},
	{
		name: "Ấn phẩm sự kiện",
		sub: "Banner · Backdrop · Standee · Hashtag · Namecard",
		tag: "B2B",
		tagVariant: "yellow",
		href: "#services",
	},
	{
		name: "Ấn phẩm lưu niệm",
		sub: "Acrylic Magnet · Móc khoá / Pin cài áo Mica · In ảnh / Postcard / Thank card / Gift card",
		tag: "B2B",
		tagVariant: "yellow",
		href: "#services",
	},
];

const STATS: StatItem[] = [
	{ num: "5K+", label: "Đơn hoàn thành" },
	{ num: "1000+", label: "Mẫu sẵn có" },
	{ num: "5★", label: "200+ Reviews", yellow: true },
	{ num: "24h", label: "Giao tại Đà Nẵng" },
];

// ─── Tag chip style helper ───────────────────────────────────────────────────
function tagSx(variant: TagVariant) {
	if (variant === "orange") return { bgcolor: C.orange, color: C.cream };
	if (variant === "yellow") return { bgcolor: C.yellow, color: C.ink };
	return { bgcolor: C.ash, color: C.smoke };
}

// ─── Component ──────────────────────────────────────────────────────────────
export function HeroSection({
	ctaPrimaryHref = "#lighters",
	ctaSecondaryHref = "/contact",
}: HeroSectionProps) {
	const [activeCard, setActiveCard] = useState(0);

	return (
		<Box
			component="section"
			aria-label="Trang chủ INUT Design"
			sx={{
				bgcolor: "background.paper",
				borderRadius: { xs: 2, sm: 3 },
				p: { xs: 0.75, sm: 1.25 },
			}}
		>
			{/* ── Hero body ── */}
			<Box sx={{ bgcolor: C.ink, borderRadius: "0 0 8px 8px" }}>
				<Grid container>
					{/* ─ Left panel ─ */}
					<Grid
						item
						xs={12}
						md={6}
						sx={{
							p: { xs: 4, sm: 5, md: "48px 44px" },
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							borderRight: { md: `1px solid ${C.ink4}` },
							borderBottom: { xs: `1px solid ${C.ink4}`, md: "none" },
						}}
					>
						{/* Eyebrow */}
						<Stack
							direction="row"
							alignItems="center"
							spacing={1}
							sx={{ mb: 2.75 }}
							aria-hidden="true"
						>
							<Box sx={{ width: 20, height: 2, bgcolor: C.orange, flexShrink: 0 }} />
							<Typography
								sx={{
									fontWeight: 700,
									fontSize: "13px",
									letterSpacing: "0.14em",
									color: C.orange,
									textTransform: "uppercase",
								}}
							>
								INUT Design · Đà Nẵng
							</Typography>
						</Stack>

						{/* Heading */}
						<Typography
							component="h1"
							sx={{
								fontWeight: 800,
								fontSize: { xs: "2.6rem", sm: "3.2rem", md: "3.8rem" },
								color: C.cream,
								lineHeight: 1.05,
								mb: 2,
							}}
						>
							In Nhanh.
							<br />
							<Box
								component="span"
								sx={{
									fontStyle: "italic",
									color: C.orange,
								}}
							>
								Đẹp Đúng Ý.
							</Box>
						</Typography>

						{/* Tagline */}
						<Typography
							sx={{
								fontWeight: 700,
								fontSize: "15px",
								color: C.cream,
								mb: 0.75,
							}}
						>
							Skin decal, Bật lửa, Sticker, In ấn sự kiện, Ấn phẩm lưu niệm.
						</Typography>

						{/* Sub text */}
						<Typography
							sx={{
								fontSize: "15px",
								color: C.smoke,
								lineHeight: 1.6,
								mb: 4,
							}}
						>
							Từ 1 cái · Giao 24–48h · Báo giá 15 phút.
						</Typography>

						{/* CTA row */}
						<Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
							<Link href={ctaPrimaryHref} passHref legacyBehavior>
								<Button
									component="a"
									variant="contained"
									disableElevation
									aria-label="Xem sản phẩm INUT Design"
									sx={{
										fontWeight: 700,
										fontSize: "14px",
										letterSpacing: "0.08em",
										textTransform: "uppercase",
										bgcolor: C.orange,
										color: C.cream,
										borderRadius: "3px",
										px: 3,
										py: "13px",
										"&:hover": { bgcolor: "#e04400" },
									}}
								>
									Xem sản phẩm
								</Button>
							</Link>
							<Link href={ctaSecondaryHref} passHref legacyBehavior>
								<Button
									component="a"
									variant="outlined"
									aria-label="Báo giá ngay"
									sx={{
										fontWeight: 700,
										fontSize: "14px",
										letterSpacing: "0.08em",
										textTransform: "uppercase",
										color: C.cream,
										borderColor: C.ash,
										borderRadius: "3px",
										px: "22px",
										py: "12px",
										"&:hover": {
											borderColor: C.smoke,
											bgcolor: "rgba(255,255,255,0.04)",
										},
									}}
								>
									Báo giá ngay
								</Button>
							</Link>
						</Stack>
					</Grid>

					{/* ─ Right panel — product cards ─ */}
					<Grid
						item
						xs={12}
						md={6}
						sx={{
							bgcolor: C.ink3,
							p: { xs: 3, sm: 4, md: "48px 40px" },
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							gap: 1.25,
						}}
					>
						{PRODUCT_CARDS.map((card, idx) => {
							const isActive = activeCard === idx;
							return (
								<Link key={card.name} href={card.href} passHref legacyBehavior>
									<Box
										component="a"
										onClick={() => setActiveCard(idx)}
										aria-current={isActive ? "true" : undefined}
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											textDecoration: "none",
											cursor: "pointer",
											borderRadius: "4px",
											border: `1px solid ${C.ink4}`,
											borderLeftWidth: "3px",
											borderLeftColor: isActive ? C.orange : "transparent",
											px: "17px",
											py: 2,
											bgcolor: isActive ? C.ink4 : "transparent",
											transition: "border-left-color 0.2s ease, background-color 0.2s ease",
											"&:hover": {
												borderLeftColor: C.orange,
												bgcolor: C.ink4,
											},
											"&:focus-visible": {
												outline: `2px solid ${C.orange}`,
												outlineOffset: 2,
											},
										}}
									>
										<Stack spacing={0.375}>
											<Typography
												sx={{
													fontWeight: 800,
													fontSize: "15px",
													color: C.cream,
													textTransform: "uppercase",
													letterSpacing: "0.06em",
												}}
											>
												{card.name}
											</Typography>
											<Typography
												sx={{
													fontSize: "13px",
													color: C.dust,
												}}
											>
												{card.sub}
											</Typography>
										</Stack>
										<Chip
											label={card.tag}
											size="small"
											sx={{
												fontWeight: 700,
												fontSize: "10px",
												letterSpacing: "0.06em",
												textTransform: "uppercase",
												height: 22,
												borderRadius: "2px",
												flexShrink: 0,
												...tagSx(card.tagVariant),
												"& .MuiChip-label": { px: 0.875 },
											}}
										/>
									</Box>
								</Link>
							);
						})}
					</Grid>
				</Grid>

				{/* ── Stats bar ── */}
				<Box
					component="ul"
					aria-label="Thống kê INUT Design"
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
						borderTop: `1px solid ${C.ink4}`,
						m: 0,
						p: 0,
						listStyle: "none",
					}}
				>
					{STATS.map((stat, i) => (
						<Box
							key={stat.label}
							component="li"
							sx={{
								py: 1.75,
								px: 1,
								textAlign: "center",
								borderRight: {
									xs: i % 2 === 0 ? `1px solid ${C.ink4}` : "none",
									sm: i < 3 ? `1px solid ${C.ink4}` : "none",
								},
								borderBottom: {
									xs: i < 2 ? `1px solid ${C.ink4}` : "none",
									sm: "none",
								},
							}}
						>
							<Typography
								component="span"
								display="block"
								sx={{
									fontWeight: 800,
									fontSize: { xs: "22px", sm: "26px" },
									color: stat.yellow ? C.yellow : C.orange,
									lineHeight: 1,
								}}
							>
								{stat.num}
							</Typography>
							<Typography
								component="span"
								display="block"
								sx={{
									fontSize: "12px",
									color: C.dust,
									mt: 0.375,
								}}
							>
								{stat.label}
							</Typography>
						</Box>
					))}
				</Box>
			</Box>
		</Box>
	);
}
