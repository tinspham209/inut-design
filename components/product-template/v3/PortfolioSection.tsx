import { ProductPageData } from "@/models/product-page";
import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { SectionWrapper, SectionHeader, colors, typography } from "./shared";

interface PortfolioSectionProps {
	data: ProductPageData["gallery"];
}

const PortfolioItem: React.FC<{ image: string; index: number }> = ({ image, index }) => {
	const text = String(index + 1).padStart(2, "0");

	return (
		<Box
			sx={{
				breakInside: "avoid",
				mb: 1.5,
				borderRadius: "12px",
				overflow: "hidden",
				position: "relative",
				display: "block",
				cursor: "pointer",
				"&:hover .overlay": { opacity: 1 },
				"&:hover .inner": { transform: "scale(1.06)" },
				"&:hover .info": { transform: "translateY(0)" },
			}}
		>
			<Box
				className="inner"
				sx={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontFamily: typography.syne,
					fontWeight: 800,
					fontSize: "2.5rem",
					letterSpacing: "-0.04em",
					fontStyle: "italic",
					color: "rgba(255, 255, 255, 0.15)",
					transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
					position: "relative",
					background: `url(${image}) center/cover no-repeat`,
					aspectRatio: index % 3 === 0 ? "3/4" : index % 2 === 0 ? "4/3" : "1",
				}}
			>
				{text}
			</Box>
			<Box
				className="overlay"
				sx={{
					position: "absolute",
					inset: 0,
					background: "linear-gradient(to top, rgba(8, 7, 6, 0.9) 0%, transparent 55%)",
					opacity: 0,
					transition: "opacity 0.35s",
					display: "flex",
					alignItems: "flex-end",
					p: 2.5,
				}}
				aria-hidden="true"
			>
				<Box
					className="info"
					sx={{
						transform: "translateY(10px)",
						transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
					}}
				>
					<Typography
						component="strong"
						sx={{
							fontFamily: typography.syne,
							fontSize: "0.88rem",
							fontWeight: 700,
							color: colors.cream,
							display: "block",
						}}
					>
						Dự án #{text}
					</Typography>
					<Typography component="span" sx={{ fontSize: "0.7rem", color: colors.smoke }}>
						In ấn chất lượng cao
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ data }) => {
	const [activeFilter, setActiveFilter] = useState("Tất cả");
	const defaultFilters = ["Tất cả", "Nghệ thuật", "Du lịch", "Doanh nghiệp", "Lễ tết"];
	const filters = data.filters || defaultFilters;

	return (
		<SectionWrapper id="portfolio" aria-labelledby="portfolio-h2">
			<Stack
				direction={{ xs: "column", sm: "row" }}
				justifyContent="space-between"
				alignItems={{ xs: "flex-start", sm: "flex-end" }}
				spacing={3}
				sx={{ mb: { xs: 4, md: 8 } }}
			>
				<SectionHeader
					eyebrow={data.eyebrow || "Hình ảnh thực tế"}
					title={data.title || "Portfolio<br />Chromatic"}
				/>

				<Stack
					direction="row"
					spacing={0.5}
					flexWrap="wrap"
					role="tablist"
					aria-label="Lọc danh mục"
				>
					{filters.map((filter) => (
						<Button
							key={filter}
							onClick={() => setActiveFilter(filter)}
							role="tab"
							aria-selected={activeFilter === filter}
							sx={{
								px: 2.5,
								py: 1,
								borderRadius: "99px",
								border: `1.5px solid ${activeFilter === filter ? colors.orange : colors.ash}`,
								bgcolor: activeFilter === filter ? colors.orange : "transparent",
								color: activeFilter === filter ? colors.cream : colors.dust,
								fontFamily: typography.syne,
								fontSize: "0.72rem",
								fontWeight: 700,
								letterSpacing: "0.08em",
								textTransform: "uppercase",
								transition: "all 0.2s",
								minWidth: "auto",
								mb: 1,
								"&:hover": {
									bgcolor: colors.orange,
									borderColor: colors.orange,
									color: colors.cream,
								},
							}}
						>
							{filter}
						</Button>
					))}
				</Stack>
			</Stack>

			<Box sx={{ columns: { xs: 1, sm: 2, md: 4 }, columnGap: 1.5 }}>
				{data.images?.map((image, idx) => (
					<PortfolioItem key={idx} image={image} index={idx} />
				))}
			</Box>

			<Box sx={{ textAlign: "center", mt: 6 }}>
				<Button
					variant="outlined"
					href="#contact"
					sx={{
						borderRadius: "8px",
						borderColor: colors.ash,
						color: colors.smoke,
						fontFamily: typography.syne,
						fontWeight: 700,
						px: 4,
						py: 1.5,
						"&:hover": { borderColor: colors.orange, color: colors.orange },
					}}
				>
					Xem thêm dự án →
				</Button>
			</Box>
		</SectionWrapper>
	);
};
