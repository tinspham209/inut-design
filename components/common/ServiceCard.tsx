import { COLOR_CODE } from "@/utils";
import { trackEvent } from "@/utils/analytics";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Card, Chip, Icon, Stack, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import React from "react";

export interface ServiceCardProps {
	title: string;
	description?: string;
	icon?: string | React.ReactNode;
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
	icon,
	href,
	badge,
}) => {
	const theme = useTheme();

	const handleCardClick = () => {
		trackEvent("service_click", {
			service_title: title,
			service_path: href,
		});
	};

	const renderIcon = () => {
		if (!icon) return null;
		if (typeof icon === "string") {
			return (
				<Icon sx={{ fontSize: 28, color: COLOR_CODE.PRIMARY, lineHeight: 1, display: "block" }}>
					{icon}
				</Icon>
			);
		}
		return <>{icon}</>;
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
					backgroundColor: "#fff",
					border: `1px solid ${theme.palette.divider}`,
					boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
					transition:
						"transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.3s ease",

					// Accent stripe at top — expands on hover
					"&::before": {
						content: '""',
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						height: "3px",
						background: `linear-gradient(90deg, ${COLOR_CODE.PRIMARY}, #f0944d)`,
						transform: "scaleX(0)",
						transformOrigin: "left",
						transition: "transform 0.35s ease",
						zIndex: 1,
					},

					"&:hover, &:focus-visible": {
						transform: "translateY(-6px)",
						boxShadow: `0 16px 40px rgba(225, 97, 46, 0.14), 0 4px 12px rgba(0,0,0,0.08)`,
						borderColor: "rgba(225, 97, 46, 0.35)",
						outline: "none",

						"&::before": {
							transform: "scaleX(1)",
						},

						"& .card-icon-wrap": {
							background: `linear-gradient(135deg, ${COLOR_CODE.PRIMARY} 0%, #f0944d 100%)`,
							"& .MuiIcon-root, & svg": {
								color: "#fff !important",
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
				{/* Card body */}
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						height: "100%",
						p: { xs: 2.5, sm: 3 },
					}}
				>
					{/* Top row: icon + badge */}
					<Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
						{/* Icon container */}
						<Box
							className="card-icon-wrap"
							sx={{
								width: 52,
								height: 52,
								borderRadius: "14px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: "rgba(225, 97, 46, 0.09)",
								flexShrink: 0,
								transition: "background 0.3s ease",
							}}
						>
							{renderIcon()}
						</Box>

						{badge && (
							<Chip
								label={badge}
								icon={getBadgeIcon(badge) || undefined}
								size="small"
								sx={{
									fontSize: "0.68rem",
									fontWeight: 800,
									letterSpacing: "0.06em",
									textTransform: "uppercase",
									height: 24,
									backgroundColor: "rgba(225, 97, 46, 0.1)",
									color: COLOR_CODE.PRIMARY,
									border: `1px solid rgba(225, 97, 46, 0.25)`,
									"& .MuiChip-label": { px: 1 },
									"& .MuiChip-icon": {
										color: "inherit",
										ml: 0.5,
										mr: -0.2,
									},
								}}
							/>
						)}
					</Stack>

					{/* Title */}
					<Typography
						variant="h6"
						component="h3"
						fontWeight={700}
						lineHeight={1.3}
						gutterBottom
						sx={{
							color: COLOR_CODE.TEXT_DARK,
							fontSize: { xs: "1rem", sm: "1.05rem" },
						}}
					>
						{title}
					</Typography>

					{/* Description */}
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							lineHeight: 1.65,
							flexGrow: 1,
							mb: 3,
							display: "-webkit-box",
							WebkitLineClamp: 3,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
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
							pt: 2,
							borderTop: `1px solid ${theme.palette.divider}`,
						}}
					>
						<Typography
							className="cta-label"
							variant="caption"
							sx={{
								fontWeight: 700,
								color: "text.secondary",
								fontSize: "0.75rem",
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
								fontSize: 15,
								color: "text.secondary",
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
