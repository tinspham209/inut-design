/* eslint-disable camelcase */
import { BUILDERS, type BuilderId } from "@/data/builders";
import { COLOR_CODE, trackBuilderPromotionEvent } from "@/utils";
import { Box, Chip, Container, Typography } from "@mui/material";
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
				aria-label={`${builder.title}${builder.badge ? `. ${builder.badge}` : ""}. Mở trình thiết kế.`}
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
					minHeight: "100%",
					borderRadius: 2,
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
						position: "relative",
						width: "100%",
						aspectRatio: "16 / 9",
						display: "grid",
						placeItems: "center",
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
							sx={{ width: "100%", height: "100%", objectFit: "contain" }}
						/>
					) : (
						<Typography component="span" variant="body2" sx={{ color: COLOR_CODE.TEXT_MUTED }}>
							Ảnh xem trước hiện không khả dụng
						</Typography>
					)}
					{builder.badge && (
						<Chip
							label={builder.badge}
							size="small"
							sx={{
								position: "absolute",
								top: 12,
								left: 12,
								fontWeight: 700,
								color: COLOR_CODE.INK,
								backgroundColor: COLOR_CODE.YELLOW,
							}}
						/>
					)}
				</Box>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, p: { xs: 2, sm: 2.5 }, flexGrow: 1 }}>
					<Typography component="h3" variant="h6" fontWeight={750} sx={{ color: COLOR_CODE.WHITE }}>
						{builder.title}
					</Typography>
					<Typography
						id={`builder-description-${builderId}`}
						variant="body2"
						sx={{ color: COLOR_CODE.TEXT_MUTED, lineHeight: 1.65 }}
					>
						{builder.description}
					</Typography>
					<Typography
						component="span"
						variant="button"
						sx={{ color: COLOR_CODE.PRIMARY, mt: "auto", pt: 0.5 }}
					>
						Mở trình thiết kế →
					</Typography>
				</Box>
			</Box>
		</Link>
	);
};

export const BuilderPromotion: React.FC<BuilderPromotionProps> = ({ placement = "home_feature" }) => {
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
		<Box component="section" aria-labelledby={`builder-promotion-${placement}`} sx={{ bgcolor: COLOR_CODE.INK, py: { xs: 5, md: 7 } }}>
			<Container maxWidth="lg">
				<Box sx={{ mb: 3, maxWidth: 760 }}>
					<Typography component="h2" id={`builder-promotion-${placement}`} variant="h4" fontWeight={800} sx={{ color: COLOR_CODE.WHITE, mb: 1 }}>
						Tự thiết kế sản phẩm
					</Typography>
					<Typography variant="body1" sx={{ color: COLOR_CODE.TEXT_MUTED }}>
						Chọn công cụ phù hợp để bắt đầu thiết kế móc khóa mica hoặc bật lửa cá nhân hóa.
					</Typography>
				</Box>
				<Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" }, gap: { xs: 2, md: 3 }, alignItems: "stretch" }}>
					{BUILDERS.map((builder) => (
						<BuilderCard
							key={builder.id}
							builder={builder}
							placement={placement}
							registerElement={registerElement}
						/>
					))}
				</Box>
			</Container>
		</Box>
	);
};

export default BuilderPromotion;
