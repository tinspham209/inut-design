import { ProductPageData, ProductType } from "@/models/product-page";
import { Box, Button, Stack, Typography, IconButton, Container } from "@mui/material";
import React, { useRef, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { SectionWrapper, SectionHeader, colors, typography } from "./shared";

interface ProductsSectionProps {
	data: ProductPageData["types"];
}

const ProductCard: React.FC<{ item: ProductType }> = ({ item }) => {
	const cardRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!cardRef.current) return;
		const r = cardRef.current.getBoundingClientRect();
		const x = (e.clientX - r.left) / r.width - 0.5;
		const y = (e.clientY - r.top) / r.height - 0.5;
		cardRef.current.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${
			-y * 10
		}deg) scale(1.02)`;
		cardRef.current.style.transition = "transform .1s";
	};

	const handleMouseLeave = () => {
		if (!cardRef.current) return;
		cardRef.current.style.transform = "";
		cardRef.current.style.transition = "transform .5s cubic-bezier(0.16,1,0.3,1)";
	};

	return (
		<Box
			component="article"
			ref={cardRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			aria-label={item.name}
			sx={{
				width: 270,
				flexShrink: 0,
				bgcolor: colors.ink3,
				borderRadius: "16px",
				border: `1px solid ${colors.ink4}`,
				overflow: "hidden",
				position: "relative",
				transformStyle: "preserve-3d",
				transition: "border-color 0.3s, box-shadow 0.3s",
				"&:hover": { borderColor: "rgba(255, 77, 0, 0.25)" },
			}}
		>
			<Box
				sx={{
					height: 185,
					overflow: "hidden",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					position: "relative",
				}}
			>
				<Box
					sx={{
						width: "100%",
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontFamily: typography.syne,
						fontSize: "3.5rem",
						fontWeight: 800,
						letterSpacing: "-0.06em",
						fontStyle: "italic",
						transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
						position: "relative",
						background: item.image
							? `url(${item.image}) center/cover no-repeat`
							: "linear-gradient(135deg, #1a1614, #2e2822)",
						"article:hover &": { transform: "scale(1.08)" },
					}}
				>
					{!item.image && <Box component="span">{item.name.substring(0, 2).toUpperCase()}</Box>}
				</Box>
				<Box
					sx={{
						position: "absolute",
						inset: 0,
						background: "linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.5))",
					}}
					aria-hidden="true"
				/>
			</Box>
			<Box sx={{ p: 3 }}>
				<Typography
					sx={{
						fontSize: "0.65rem",
						fontWeight: 700,
						letterSpacing: "0.12em",
						textTransform: "uppercase",
						color: colors.orange,
						mb: 0.5,
					}}
				>
					Sản phẩm
				</Typography>
				<Typography
					variant="h3"
					sx={{
						fontFamily: typography.syne,
						fontSize: "1rem",
						fontWeight: 700,
						color: "white",
						mb: 1,
						letterSpacing: "-0.015em",
					}}
				>
					{item.name}
				</Typography>
				<Typography
					variant="body2"
					sx={{
						fontSize: "0.78rem",
						color: colors.dust,
						lineHeight: 1.6,
						mb: 2.5,
						height: "3.2em",
						overflow: "hidden",
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
					}}
				>
					{item.description}
				</Typography>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						pt: 1.75,
						borderTop: `1px solid ${colors.ink4}`,
					}}
				>
					<Typography sx={{ fontSize: "0.82rem", color: colors.smoke }}>
						Giá từ{" "}
						<Box component="strong" sx={{ color: "white", fontSize: "0.95rem" }}>
							Liên hệ
						</Box>
					</Typography>
					<IconButton
						href="#contact"
						aria-label={`Đặt in ${item.name}`}
						sx={{
							width: 36,
							height: 36,
							bgcolor: colors.orange,
							color: "white",
							transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
							"&:hover": {
								bgcolor: colors.orangeHi,
								transform: "scale(1.15) rotate(45deg)",
							},
						}}
					>
						<ArrowForwardIcon fontSize="small" />
					</IconButton>
				</Box>
			</Box>
		</Box>
	);
};

export const ProductsSection: React.FC<ProductsSectionProps> = ({ data }) => {
	const dragRef = useRef<HTMLDivElement>(null);
	const [isDown, setIsDown] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (!dragRef.current) return;
		setIsDown(true);
		setStartX(e.pageX - dragRef.current.offsetLeft);
		setScrollLeft(dragRef.current.scrollLeft);
	};

	const handleMouseLeaveUp = () => {
		setIsDown(false);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDown || !dragRef.current) return;
		e.preventDefault();
		const x = e.pageX - dragRef.current.offsetLeft;
		const walk = (x - startX) * 1.5;
		dragRef.current.scrollLeft = scrollLeft - walk;
	};

	return (
		<SectionWrapper
			id="products"
			aria-labelledby="products-h2"
			bgcolor={colors.ink2}
			maxWidth={false}
		>
			{/* Decorative lines */}
			{[25, 50, 75].map((pos) => (
				<Box
					key={pos}
					sx={{
						position: "absolute",
						width: "1px",
						top: 0,
						bottom: 0,
						left: `${pos}%`,
						bgcolor: colors.ink3,
						display: { xs: "none", md: "block" },
					}}
					aria-hidden="true"
				/>
			))}

			<Container maxWidth="lg">
				<Stack
					direction={{ xs: "column", sm: "row" }}
					justifyContent="space-between"
					alignItems={{ xs: "flex-start", sm: "flex-end" }}
					spacing={3}
					sx={{ mb: { xs: 4, md: 8 } }}
				>
					<SectionHeader
						eyebrow={data.eyebrow || "Dòng sản phẩm"}
						title={data.title || "Các dòng<br />sản phẩm"}
					/>
					<Button
						href="#contact"
						sx={{
							color: colors.smoke,
							fontFamily: typography.syne,
							fontWeight: 700,
							fontSize: "0.82rem",
							textTransform: "uppercase",
							"&:hover": {
								bgcolor: "transparent",
								color: colors.cream,
								"& .ico": { transform: "translateX(5px)" },
							},
						}}
					>
						Xem tất cả{" "}
						<Box component="span" className="ico" sx={{ ml: 1, transition: "transform 0.3s" }}>
							→
						</Box>
					</Button>
				</Stack>
			</Container>

			<Box
				ref={dragRef}
				onMouseDown={handleMouseDown}
				onMouseLeave={handleMouseLeaveUp}
				onMouseUp={handleMouseLeaveUp}
				onMouseMove={handleMouseMove}
				sx={{
					overflowX: "auto",
					scrollbarWidth: "none",
					cursor: isDown ? "grabbing" : "grab",
					userSelect: "none",
					pb: 1,
					"&::-webkit-scrollbar": { display: "none" },
				}}
				role="region"
				aria-label="Danh sách sản phẩm — kéo để xem thêm"
				tabIndex={0}
			>
				<Stack
					direction="row"
					spacing={2.5}
					sx={{
						width: "max-content",
						px: {
							xs: 2,
							lg: "calc((100vw - 1200px) / 2 + 16px)",
						},
						py: 1,
					}}
				>
					{data.items?.map((item, idx) => (
						<ProductCard key={idx} item={item} />
					))}
				</Stack>
			</Box>
		</SectionWrapper>
	);
};
