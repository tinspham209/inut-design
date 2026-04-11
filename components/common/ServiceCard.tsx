import { COLOR_CODE } from "@/utils";
import { trackEvent } from "@/utils/analytics";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Card, Chip, Icon, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

export interface ServiceCardProps {
	title: string;
	description?: string;
	image_url?: string;
	href: string;
	badge?: string | null;
	image?: string | null;
}

/**
 * A reusable navigation card for service sub-items.
 * Theme-consistent, fully responsive, and accessible (WCAG 2.2 AA).
 */
export const ServiceCard: React.FC<ServiceCardProps> = ({
	title,
	description,
	image_url,
	href,
	badge,
}) => {
	const handleCardClick = () => {
		trackEvent("service_click", {
			service_title: title,
			service_path: href,
		});
	};

	const getBadgeIcon = (badgeText: string) => {
		const lower = badgeText.toLowerCase();
		if (lower === "hot" || lower === "bestseller")
			return <LocalFireDepartmentIcon sx={{ fontSize: "0.9rem !important" }} />;
		if (lower === "new") return <NewReleasesIcon sx={{ fontSize: "0.9rem !important" }} />;
		if (lower === "trend" || lower === "trending")
			return <TrendingUpIcon sx={{ fontSize: "0.9rem !important" }} />;
		if (lower === "pro" || lower === "unique")
			return <StarIcon sx={{ fontSize: "0.9rem !important" }} />;
		return null;
	};

	return (
		<Link href={href} passHref legacyBehavior>
			<Card
				component="a"
				onClick={handleCardClick}
				tabIndex={0}
				aria-label={title}
				sx={{
					height: "100%",
					display: "flex",
					flexDirection: "column",
					textDecoration: "none",
					position: "relative",
					cursor: "pointer",
					borderRadius: "16px",
					overflow: "hidden",
					backgroundColor: COLOR_CODE.INK_3,
					border: `1px solid ${COLOR_CODE.INK_4}`,
					boxShadow: "none",
					transition:
						"transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.3s ease",

					"&:hover, &:focus-visible": {
						transform: "translateY(-6px)",
						boxShadow: `0 16px 40px rgba(225, 97, 46, 0.14), 0 4px 12px rgba(0,0,0,0.08)`,
						borderColor: "rgba(225, 97, 46, 0.35)",
						outline: "none",

						"& .card-image-container": {
							"& img": {
								transform: "scale(1.05)",
							},
						},

						"& .card-arrow": {
							transform: "translateX(5px)",
							color: COLOR_CODE.PRIMARY,
						},

						"& .cta-label": {
							color: COLOR_CODE.PRIMARY,
						},
					},
				}}
			>
				{/* Image Container with 4:3 Aspect Ratio */}
				<Box
					className="card-image-container"
					sx={{
						width: "100%",
						pt: "75%", // 4:3 Aspect Ratio
						position: "relative",
						overflow: "hidden",
						backgroundColor: COLOR_CODE.INK_4,
					}}
				>
					{image_url ? (
						<Box
							component="img"
							src={image_url}
							alt={title}
							sx={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%",
								objectFit: "cover",
								transition: "transform 0.5s ease",
							}}
						/>
					) : (
						<Box
							sx={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: COLOR_CODE.TEXT_SOFT,
							}}
						>
							<Typography variant="caption">No Image</Typography>
						</Box>
					)}

					{/* Badge overlay */}
					{badge && (
						<Chip
							label={badge}
							icon={getBadgeIcon(badge) || undefined}
							size="small"
							sx={{
								position: "absolute",
								top: 12,
								right: 12,
								zIndex: 2,
								fontSize: "0.68rem",
								fontWeight: 800,
								letterSpacing: "0.06em",
								textTransform: "uppercase",
								height: 24,
								backgroundColor: "rgba(0,0,0,0.6)",
								backdropFilter: "blur(4px)",
								color: "#fff",
								border: `1px solid rgba(255, 255, 255, 0.2)`,
								"& .MuiChip-label": { px: 1 },
								"& .MuiChip-icon": {
									color: COLOR_CODE.PRIMARY,
									ml: 0.5,
									mr: -0.2,
								},
							}}
						/>
					)}
				</Box>

				{/* Card body */}
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						height: "100%",
						p: 1,
					}}
				>
					{/* Title */}
					<Typography
						variant="h6"
						component="h3"
						fontWeight={700}
						lineHeight={1.3}
						sx={{
							color: COLOR_CODE.WHITE,
							fontSize: { xs: "1rem", sm: "1.05rem" },
							mb: 1,
						}}
					>
						{title}
					</Typography>

					{/* Description */}
					<Typography
						variant="body2"
						sx={{
							color: COLOR_CODE.TEXT_SOFT,
							lineHeight: 1.6,
							flexGrow: 1,
							mb: 2.5,
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
							fontSize: "0.85rem",
						}}
					>
						{description}
					</Typography>

					{/* CTA row */}
					<Stack
						direction="row"
						alignItems="center"
						spacing={0.5}
						sx={{
							mt: "auto",
							pt: 1.5,
							borderTop: `1px solid ${COLOR_CODE.INK_4}`,
						}}
					>
						<Typography
							className="cta-label"
							variant="caption"
							sx={{
								fontWeight: 700,
								color: COLOR_CODE.TEXT_MUTED,
								fontSize: "0.7rem",
								letterSpacing: "0.08em",
								textTransform: "uppercase",
								transition: "color 0.3s ease",
							}}
						>
							Khám phá ngay
						</Typography>
						<ArrowForwardIcon
							className="card-arrow"
							sx={{
								fontSize: 14,
								color: COLOR_CODE.TEXT_MUTED,
								transition: "transform 0.3s ease, color 0.3s ease",
							}}
						/>
					</Stack>
				</Box>
			</Card>
		</Link>
	);
};

export default ServiceCard;
