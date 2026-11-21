/* eslint-disable camelcase */
import { BUILDERS, type BuilderId } from "@/data/builders";
import { COLOR_CODE, trackBuilderPromotionEvent } from "@/utils";
import { Box, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

export type BuilderPromotionPlacement = "home_feature" | "builder_index";

interface BuilderPromotionProps {
	placement?: BuilderPromotionPlacement;
}

interface BuilderCardProps {
	builder: (typeof BUILDERS)[number];
	placement: BuilderPromotionPlacement;
	registerElement: (id: BuilderId, element: HTMLAnchorElement | null) => void;
}

const VISIBILITY_THRESHOLD = 0.5;

const BuilderCard: React.FC<BuilderCardProps> = ({ builder, placement, registerElement }) => {
	const builderId = builder.id;
	const [imageFailed, setImageFailed] = useState(false);

	return (
		<Link href={builder.href} passHref legacyBehavior>
			<Box
				component="a"
				ref={(element: HTMLAnchorElement | null) => registerElement(builderId, element)}
				aria-label={`${builder.title}${
					builder.badge ? `. ${builder.badge}` : ""
				}. Mở trình thiết kế.`}
				aria-describedby={`builder-description-${builderId}`}
				onClick={() =>
					trackBuilderPromotionEvent("builder_promotion_click", {
						builder_id: builderId,
						placement,
						action: "click",
					})
				}
				sx={{
					display: "flex",
					flexDirection: "column",
					minWidth: 0,
					height: "100%",
					borderRadius: "12px",
					overflow: "hidden",
					textDecoration: "none",
					color: "inherit",
					backgroundColor: COLOR_CODE.INK_3,
					border:
						builderId === "keychain"
							? `2px solid ${COLOR_CODE.PRIMARY}`
							: `1px solid ${COLOR_CODE.INK_4}`,
					transition: "transform 180ms ease, border-color 180ms ease",
					"&:hover": {
						transform: "translateY(-3px)",
						borderColor: COLOR_CODE.PRIMARY,
					},
					"&:focus-visible": {
						outline: `3px solid ${COLOR_CODE.PRIMARY}`,
						outlineOffset: 3,
					},
					"@media (prefers-reduced-motion: reduce)": {
						transition: "none",
						"&:hover": { transform: "none" },
					},
				}}
			>
				<Box
					sx={{
						width: "100%",
						pt: "75%",
						position: "relative",
						overflow: "hidden",
						backgroundColor: COLOR_CODE.INK_4,
					}}
				>
					{!imageFailed ? (
						<Box
							component="img"
							src={builder.imageUrl}
							alt=""
							loading="lazy"
							onError={() => setImageFailed(true)}
							sx={{
								position: "absolute",
								inset: 0,
								width: "100%",
								height: "100%",
								objectFit: "contain",
							}}
						/>
					) : (
						<Typography
							component="span"
							variant="body2"
							sx={{
								position: "absolute",
								inset: 0,
								display: "grid",
								placeItems: "center",
								color: COLOR_CODE.TEXT_MUTED,
							}}
						>
							Ảnh xem trước hiện không khả dụng
						</Typography>
					)}
					{builder.badge && (
						<Chip
							label={builder.badge}
							size="small"
							sx={{
								position: "absolute",
								top: 8,
								right: 8,
								fontWeight: 700,
								color: COLOR_CODE.INK,
								backgroundColor: COLOR_CODE.YELLOW,
							}}
						/>
					)}
				</Box>
				<Stack spacing={0.5} px="12px" py={1} alignItems="flex-start">
					<Typography
						component="h3"
						id={`builder-title-${builderId}`}
						sx={{
							fontWeight: 700,
							fontSize: { xs: "0.85rem", sm: "0.9rem" },
							color: COLOR_CODE.WHITE,
							lineHeight: 1.4,
							letterSpacing: "0.02em",
						}}
					>
						{builder.title}
					</Typography>
					<Typography
						id={`builder-description-${builderId}`}
						sx={{
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
							fontSize: "0.78rem",
							color: COLOR_CODE.TEXT_SOFT,
							lineHeight: 1.5,
						}}
					>
						{builder.description}
					</Typography>
					<Typography
						component="span"
						sx={{ fontSize: "0.78rem", color: COLOR_CODE.PRIMARY, lineHeight: 1.5 }}
					>
						Mở trình thiết kế →
					</Typography>
				</Stack>
			</Box>
		</Link>
	);
};

export const BuilderPromotion: React.FC<BuilderPromotionProps> = ({
	placement = "home_feature",
}) => {
	const cardElements = useRef(new Map<BuilderId, HTMLAnchorElement>());
	const viewedBuilders = useRef(new Set<BuilderId>());

	const recordView = useCallback(
		(id: BuilderId) => {
			if (viewedBuilders.current.has(id)) return;
			viewedBuilders.current.add(id);
			trackBuilderPromotionEvent("builder_promotion_view", {
				builder_id: id,
				placement,
				action: "view",
			});
		},
		[placement]
	);

	const registerElement = useCallback((id: BuilderId, element: HTMLAnchorElement | null) => {
		if (element) cardElements.current.set(id, element);
		else cardElements.current.delete(id);
	}, []);

	useEffect(() => {
		const elements = [...cardElements.current.entries()];
		if (!elements.length || typeof window.IntersectionObserver !== "function") return undefined;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && entry.intersectionRatio >= VISIBILITY_THRESHOLD) {
						const item = elements.find(([, element]) => element === entry.target);
						if (item) recordView(item[0]);
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: VISIBILITY_THRESHOLD }
		);
		elements.forEach(([, element]) => observer.observe(element));
		return () => observer.disconnect();
	}, [recordView]);

	return (
		<Box
			component="section"
			aria-labelledby={`builder-promotion-${placement}`}
			sx={{ bgcolor: COLOR_CODE.INK, py: { xs: 5, md: 7 }, px: { xs: 2, sm: 2 } }}
		>
			<Container maxWidth="lg" disableGutters>
				<Box sx={{ mb: 3, maxWidth: 760 }}>
					<Typography
						component="h2"
						id={`builder-promotion-${placement}`}
						variant="h4"
						fontWeight={800}
						sx={{ color: COLOR_CODE.WHITE, mb: 1 }}
					>
						Tự thiết kế sản phẩm
					</Typography>
					<Typography variant="body1" sx={{ color: COLOR_CODE.TEXT_MUTED }}>
						Chọn công cụ phù hợp để bắt đầu thiết kế móc khóa mica hoặc bật lửa cá nhân hóa.
					</Typography>
				</Box>
				<Grid container spacing={2}>
					{BUILDERS.map((builder) => (
						<Grid item xs={6} sm={3} key={builder.id}>
							<BuilderCard
								builder={builder}
								placement={placement}
								registerElement={registerElement}
							/>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

export default BuilderPromotion;
