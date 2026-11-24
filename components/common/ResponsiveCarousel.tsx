import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { Box, IconButton, type IconButtonProps, type SxProps, type Theme } from "@mui/material";
import React from "react";

type ResponsiveCarouselProps = {
	children: React.ReactNode;
	autoPlay?: boolean;
	indicators?: boolean;
	navButtonsAlwaysVisible?: boolean;
	index?: number;
	onChange?: (next: number) => void;
	animation?: "fade" | "slide";
	interval?: number;
	duration?: number;
	cycleNavigation?: boolean;
	activeIndicatorIconButtonProps?: IconButtonProps;
	sx?: SxProps<Theme>;
};

export default function ResponsiveCarousel({
	children,
	autoPlay = false,
	indicators = false,
	navButtonsAlwaysVisible = true,
	index,
	onChange,
	animation = "fade",
	interval = 5000,
	duration = 400,
	cycleNavigation = true,
	activeIndicatorIconButtonProps,
	sx,
}: ResponsiveCarouselProps) {
	const slides = React.Children.toArray(children);
	const [internalIndex, setInternalIndex] = React.useState(0);
	const [paused, setPaused] = React.useState(false);
	const activeIndex = Math.max(0, Math.min(slides.length - 1, index ?? internalIndex));
	const hasMultipleSlides = slides.length > 1;

	const goTo = React.useCallback(
		(next: number) => {
			if (!slides.length) return;
			const bounded = cycleNavigation
				? (next + slides.length) % slides.length
				: Math.max(0, Math.min(slides.length - 1, next));
			if (bounded === activeIndex) return;
			if (index === undefined) setInternalIndex(bounded);
			onChange?.(bounded);
		},
		[activeIndex, cycleNavigation, index, onChange, slides.length],
	);

	React.useEffect(() => {
		if (!autoPlay || paused || !hasMultipleSlides) return undefined;
		const timer = window.setInterval(() => goTo(activeIndex + 1), interval);
		return () => window.clearInterval(timer);
	}, [activeIndex, autoPlay, goTo, hasMultipleSlides, interval, paused]);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === "ArrowLeft") {
			event.preventDefault();
			goTo(activeIndex - 1);
		} else if (event.key === "ArrowRight") {
			event.preventDefault();
			goTo(activeIndex + 1);
		} else if (event.key === "Home") {
			event.preventDefault();
			goTo(0);
		} else if (event.key === "End") {
			event.preventDefault();
			goTo(slides.length - 1);
		}
	};

	const rootStyles: SxProps<Theme> = {
		position: "relative",
		overflow: "hidden",
		"&:hover .responsive-carousel-nav, &:focus-within .responsive-carousel-nav": {
			opacity: 1,
			pointerEvents: "auto",
		},
		"@media (prefers-reduced-motion: reduce)": {
			"& .responsive-carousel-track": { transition: "none !important" },
		},
	};
	const customStyles = sx ? (Array.isArray(sx) ? sx : [sx]) : [];

	return (
		<Box
			role="region"
			aria-roledescription="carousel"
			aria-label="Trình chiếu sản phẩm"
			tabIndex={0}
			onKeyDown={handleKeyDown}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
			}}
			sx={[rootStyles, ...customStyles] as SxProps<Theme>}
		>
			<Box
				className="responsive-carousel-track"
				sx={{
					display: "flex",
					width: "100%",
					transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
					transition:
						animation === "fade"
							? `transform ${Math.min(duration, 250)}ms ease`
							: `transform ${duration}ms ease-in-out`,
				}}
			>
				{slides.map((slide, slideIndex) => (
					<Box
						key={React.isValidElement(slide) && slide.key ? slide.key : slideIndex}
						role="group"
						aria-roledescription="slide"
						aria-label={`${slideIndex + 1} / ${slides.length}`}
						aria-hidden={slideIndex !== activeIndex}
						sx={{ flex: "0 0 100%", minWidth: 0 }}
					>
						{slide}
					</Box>
				))}
			</Box>
			{hasMultipleSlides && (
				<>
					<IconButton
						className="responsive-carousel-nav"
						aria-label="Ảnh trước"
						onClick={() => goTo(activeIndex - 1)}
						size="small"
						disabled={!cycleNavigation && activeIndex === 0}
						sx={{
							position: "absolute",
							left: 8,
							top: "50%",
							zIndex: 2,
							transform: "translateY(-50%)",
							opacity: navButtonsAlwaysVisible ? 1 : 0,
							pointerEvents: navButtonsAlwaysVisible ? "auto" : "none",
						}}
					>
						<ArrowBackIosNewRoundedIcon fontSize="small" />
					</IconButton>
					<IconButton
						className="responsive-carousel-nav"
						aria-label="Ảnh tiếp theo"
						onClick={() => goTo(activeIndex + 1)}
						size="small"
						disabled={!cycleNavigation && activeIndex === slides.length - 1}
						sx={{
							position: "absolute",
							right: 8,
							top: "50%",
							zIndex: 2,
							transform: "translateY(-50%)",
							opacity: navButtonsAlwaysVisible ? 1 : 0,
							pointerEvents: navButtonsAlwaysVisible ? "auto" : "none",
						}}
					>
						<ArrowForwardIosRoundedIcon fontSize="small" />
					</IconButton>
				</>
			)}
			{indicators && hasMultipleSlides && (
				<Box
					aria-label="Chọn ảnh"
					sx={{
						position: "absolute",
						zIndex: 2,
						bottom: 8,
						left: "50%",
						transform: "translateX(-50%)",
						display: "flex",
						gap: 0.5,
					}}
				>
					{slides.map((_, slideIndex) => (
						<IconButton
							key={slideIndex}
							aria-label={`Đi đến ảnh ${slideIndex + 1}`}
							aria-current={slideIndex === activeIndex ? "true" : undefined}
							onClick={() => goTo(slideIndex)}
							size="small"
							{...(slideIndex === activeIndex ? activeIndicatorIconButtonProps : {})}
							sx={[
								{ width: 28, height: 28, p: 0 },
								{
									"&::after": {
										content: '""',
										width: 8,
										height: 8,
										borderRadius: "50%",
										bgcolor: slideIndex === activeIndex ? "primary.main" : "common.white",
										opacity: slideIndex === activeIndex ? 1 : 0.65,
									},
								},
								...(slideIndex === activeIndex && activeIndicatorIconButtonProps?.sx
									? Array.isArray(activeIndicatorIconButtonProps.sx)
										? activeIndicatorIconButtonProps.sx
										: [activeIndicatorIconButtonProps.sx]
									: []),
							]}
						/>
					))}
				</Box>
			)}
		</Box>
	);
}
