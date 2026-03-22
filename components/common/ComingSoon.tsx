import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Button, keyframes } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Link from "next/link";
import { colors } from "@/components/product-template/v3/shared/theme";

// --- ANIMATIONS ---
const breathe = keyframes`
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.7; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-6px); opacity: 1; }
`;

const MESSAGES = [
	"Tụi tui đang vắt óc làm tính năng này. Bug chưa fix xong, nhưng sắp rồi <br/> Hứa luôn fen ơi 🔥",
	"Tính năng này đang trong lò nướng fen ơi 🫠 Thơm lắm, đợi chín rồi lấy nhé!",
	"Tính năng này đang được tụi tui 'ủ' kỹ lắm 🫠 Sắp chín rồi fen ơi!",
	"Fen đến sớm quá — tụi tui chưa kịp dọn dẹp 😅 Quay lại sau nhé!",
	"Đang làm nè fen ơi! Chưa xong nhưng sắp rồi — hứa luôn 🤙",
	"Tụi tui đang chạy deadline fen ơi 😤 Sắp có rồi, đừng đi đâu!",
	"Chỗ này đang được nâng cấp nè fen ơi ✨<br/> Xong là xịn liền, đợi tí nha!",
];

export interface ComingSoonProps {
	/**
	 * Name of the page/feature being built
	 * @default "Tính năng"
	 */
	page?: string;
	/**
	 * Progress percentage (0-100)
	 * @default Random value between 30-65
	 */
	progress?: number;
	/**
	 * Custom message to display
	 * @default Random fun message from MESSAGES
	 */
	message?: React.ReactNode;
	/**
	 * URL for the back button
	 * @default "/"
	 */
	backUrl?: string;
	/**
	 * Text for the back button
	 * @default "Về Trang Chủ"
	 */
	backText?: string;
	/**
	 * Custom status tags to display
	 */
	statusTags?: Array<{ label: string; done: boolean }>;
}

const DEFAULT_STATUS_TAGS = [
	{ label: "Ý tưởng", done: true },
	{ label: "Thiết kế", done: true },
	{ label: "Code", done: false },
	{ label: "Test", done: false },
	{ label: "Launch 🚀", done: false },
];

/**
 * ComingSoon component for pages under construction.
 * Follows the design from template/Coming-soon.html
 */
const ComingSoon: React.FC<ComingSoonProps> = ({
	progress,
	message,
	backUrl = "/",
	backText = "Về Trang Chủ",
	statusTags = DEFAULT_STATUS_TAGS,
}) => {
	const [displayProgress, setDisplayProgress] = useState(0);
	const [targetProgress] = useState(
		progress !== undefined
			? Math.min(100, Math.max(0, progress))
			: Math.floor(Math.random() * 35) + 30
	);
	const [randomMessage] = useState(() => {
		const idx = Math.floor(Math.random() * MESSAGES.length);
		return MESSAGES[idx];
	});

	useEffect(() => {
		const timer = setTimeout(() => {
			const duration = 1800;
			const start = performance.now();

			const animate = (now: number) => {
				const t = Math.min((now - start) / duration, 1);
				const ease = 1 - Math.pow(1 - t, 4);
				setDisplayProgress(Math.round(targetProgress * ease));

				if (t < 1) {
					requestAnimationFrame(animate);
				}
			};

			requestAnimationFrame(animate);
		}, 600);

		return () => clearTimeout(timer);
	}, [targetProgress]);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				backgroundColor: colors.ink,
				color: colors.cream,
				position: "relative",
				overflowX: "hidden",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				"&::before": {
					content: '""',
					position: "absolute",
					inset: 0,
					backgroundImage: `linear-gradient(${colors.ash} 1px, transparent 1px), linear-gradient(90deg, ${colors.ash} 1px, transparent 1px)`,
					backgroundSize: "60px 60px",
					opacity: 0.18,
					pointerEvents: "none",
					zIndex: 0,
				},
			}}
		>
			{/* GLOW BLOB */}
			<Box
				sx={{
					position: "absolute",
					width: { xs: "300px", md: "600px" },
					height: { xs: "300px", md: "600px" },
					borderRadius: "50%",
					background: `radial-gradient(circle, ${colors.orangeGlow} 0%, transparent 70%)`,
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					pointerEvents: "none",
					zIndex: 0,
					animation: `${breathe} 4s ease-in-out infinite`,
				}}
			/>

			{/* CORNER DECORATIONS */}
			<Box
				sx={{
					position: "absolute",
					width: { xs: "48px", md: "80px" },
					height: { xs: "48px", md: "80px" },
					opacity: 0.2,
					top: "20px",
					left: "20px",
					borderTop: `1px solid ${colors.orange}`,
					borderLeft: `1px solid ${colors.orange}`,
				}}
			/>
			<Box
				sx={{
					position: "absolute",
					width: { xs: "48px", md: "80px" },
					height: { xs: "48px", md: "80px" },
					opacity: 0.2,
					bottom: "20px",
					right: "20px",
					borderBottom: `1px solid ${colors.orange}`,
					borderRight: `1px solid ${colors.orange}`,
				}}
			/>

			<Container
				maxWidth="lg"
				sx={{
					position: "relative",
					zIndex: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					textAlign: "center",
					py: { xs: "40px", md: "40px" },
					pb: { xs: "80px", md: "80px" },
				}}
			>
				{/* WORKER ILLUSTRATION */}
				<Box
					sx={{
						mb: { xs: "16px", md: "36px" },
						animation: `${float} 3s ease-in-out infinite`,
						"& svg": {
							width: { xs: "80px", md: "120px" },
							height: { xs: "80px", md: "120px" },
						},
					}}
				>
					<svg
						viewBox="0 0 120 120"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						role="img"
						aria-label="Working illustration"
					>
						<ellipse cx="60" cy="38" rx="26" ry="8" fill={colors.orange} />
						<rect x="34" y="31" width="52" height="10" rx="5" fill={colors.orange} />
						<rect x="28" y="39" width="64" height="5" rx="2.5" fill={colors.orangeHi} />
						<circle cx="60" cy="54" r="18" fill={colors.cream} />
						<circle cx="53" cy="52" r="2.5" fill={colors.ink} />
						<circle cx="67" cy="52" r="2.5" fill={colors.ink} />
						<ellipse cx="82" cy="48" rx="3" ry="4.5" fill={colors.ash} opacity="0.5" />
						<path
							d="M53 60 Q60 66 67 60"
							stroke={colors.ink}
							strokeWidth="2"
							strokeLinecap="round"
							fill="none"
						/>
						<rect x="44" y="72" width="32" height="28" rx="4" fill={colors.ink3} />
						<text
							x="60"
							y="90"
							fontWeight="800"
							fontSize="8"
							fill={colors.orange}
							textAnchor="middle"
						>
							INUT
						</text>
						<rect
							x="20"
							y="72"
							width="24"
							height="8"
							rx="4"
							fill={colors.ink3}
							transform="rotate(-20 20 72)"
						/>
						<rect
							x="76"
							y="72"
							width="24"
							height="8"
							rx="4"
							fill={colors.ink3}
							transform="rotate(20 76 72)"
						/>
						<rect
							x="90"
							y="82"
							width="20"
							height="5"
							rx="2.5"
							fill={colors.ash}
							transform="rotate(45 90 82)"
						/>
						<circle cx="93" cy="78" r="5" fill="none" stroke={colors.ash} strokeWidth="3" />
						<text x="15" y="55" fontSize="14" fill={colors.cream}>
							✦
						</text>
						<text x="96" y="35" fontSize="10" fill={colors.cream}>
							✦
						</text>
						<text x="8" y="80" fontSize="8" fill={colors.cream}>
							✦
						</text>
					</svg>
				</Box>

				{/* HEADLINE */}
				<Typography
					variant="h1"
					sx={{
						fontWeight: 800,
						fontSize: { xs: "28px", sm: "48px", md: "80px" },
						lineHeight: 1.1,
						letterSpacing: "-0.04em",
						color: colors.cream,
						maxWidth: "800px",
						animation: `${fadeUp} 0.7s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both`,
					}}
				>
					Từ từ{" "}
					<Box
						component="span"
						sx={{
							fontStyle: "italic",
							color: colors.orange,
						}}
					>
						fen
					</Box>{" "}
					ơi
					<Box
						component="span"
						sx={{
							display: "inline-flex",
							gap: "5px",
							ml: "4px",
							verticalAlign: "middle",
						}}
					>
						{[0, 1, 2].map((i) => (
							<Box
								key={i}
								component="span"
								sx={{
									width: "6px",
									height: "6px",
									borderRadius: "50%",
									backgroundColor: colors.orange,
									animation: `${bounce} 1.2s ease-in-out infinite`,
									animationDelay: `${i * 0.2}s`,
								}}
							/>
						))}
					</Box>
				</Typography>

				{/* SUBTEXT */}
				<Typography
					variant="body1"
					sx={{
						fontSize: { xs: "14px", sm: "16px", md: "18px" },
						lineHeight: 1.6,
						color: colors.smoke,
						mt: "20px",
						maxWidth: "540px",
						animation: `${fadeUp} 0.7s 0.35s cubic-bezier(0.22, 1, 0.36, 1) both`,
					}}
					dangerouslySetInnerHTML={
						typeof message === "string"
							? { __html: message }
							: !message
							? { __html: randomMessage }
							: undefined
					}
				>
					{message && typeof message !== "string" ? message : null}
				</Typography>

				{/* PROGRESS BAR */}
				<Box
					sx={{
						mt: { xs: "24px", md: "44px" },
						width: "100%",
						maxWidth: "460px",
						animation: `${fadeUp} 0.7s 0.5s cubic-bezier(0.22, 1, 0.36, 1) both`,
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							mb: "10px",
						}}
					>
						<Typography
							sx={{
								fontWeight: 700,
								fontSize: "11px",
								letterSpacing: "0.12em",
								textTransform: "uppercase",
								color: colors.dust,
							}}
						>
							Tiến độ
						</Typography>
						<Typography
							sx={{
								fontWeight: 800,
								fontSize: "13px",
								color: colors.orange,
							}}
						>
							{displayProgress}%
						</Typography>
					</Box>
					<Box
						sx={{
							width: "100%",
							height: "4px",
							backgroundColor: colors.ash,
							position: "relative",
							overflow: "hidden",
						}}
					>
						<Box
							sx={{
								height: "100%",
								backgroundColor: colors.orange,
								width: `${displayProgress}%`,
								transition: "width 0.2s linear",
								position: "relative",
								"&::after": {
									content: '""',
									position: "absolute",
									top: 0,
									right: 0,
									width: "40px",
									height: "100%",
									background: `linear-gradient(90deg, transparent, ${colors.orangeHi})`,
									animation: `${shimmer} 1.2s ease-in-out infinite`,
								},
							}}
						/>
					</Box>
				</Box>

				{/* STATUS TAGS */}
				<Box
					sx={{
						display: "flex",
						gap: "10px",
						mt: { xs: "24px", md: "36px" },
						flexWrap: "wrap",
						justifyContent: "center",
						animation: `${fadeUp} 0.7s 0.65s cubic-bezier(0.22, 1, 0.36, 1) both`,
					}}
				>
					{statusTags.map((tag, idx) => (
						<Box
							key={idx}
							sx={{
								fontWeight: 700,
								fontSize: "11px",
								letterSpacing: "0.1em",
								textTransform: "uppercase",
								padding: "6px 16px",
								border: `1px solid ${tag.done ? "rgba(255, 226, 52, 0.3)" : colors.ash}`,
								color: tag.done ? colors.yellow : colors.smoke,
								backgroundColor: tag.done ? "rgba(255, 226, 52, 0.05)" : "transparent",
								cursor: "default",
								transition: "all 0.2s",
								"&:hover": {
									borderColor: colors.orange,
									color: colors.cream,
								},
								"&::before": tag.done ? { content: '"✓ "' } : {},
							}}
						>
							{tag.label}
						</Box>
					))}
				</Box>

				{/* BACK BUTTON */}
				<Link href={backUrl} passHref>
					<Button
						component="a"
						startIcon={<ArrowBackIosNewIcon sx={{ fontSize: "14px !important" }} />}
						sx={{
							mt: "16px",
							fontWeight: 700,
							fontSize: "13px",
							letterSpacing: "0.08em",
							textTransform: "uppercase",
							color: colors.smoke,
							border: `1px solid ${colors.ash}`,
							borderRadius: 0,
							padding: "12px 28px",
							animation: `${fadeUp} 0.7s 0.8s cubic-bezier(0.22, 1, 0.36, 1) both`,
							"&:hover": {
								color: colors.ink,
								backgroundColor: colors.orange,
								borderColor: colors.orange,
								"& .MuiButton-startIcon": {
									transform: "translateX(-4px)",
								},
							},
							"& .MuiButton-startIcon": {
								transition: "transform 0.2s",
								marginRight: "8px",
							},
						}}
					>
						{backText}
					</Button>
				</Link>
			</Container>
		</Box>
	);
};

export default ComingSoon;
