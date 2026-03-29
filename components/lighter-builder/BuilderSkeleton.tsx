import { Box, keyframes } from "@mui/material";

const BG = "#080706";
const SURFACE = "#100f0d";
const SURFACE2 = "#1a1916";
const BORDER = "#2c2b28";

const shimmer = keyframes`
  0%   { opacity: 0.4; }
  50%  { opacity: 0.7; }
  100% { opacity: 0.4; }
`;

export function BuilderSkeleton() {
	return (
		<Box
			sx={{
				bgcolor: BG,
				height: { md: "calc(100vh - 64px)" },
				display: { xs: "flex", md: "grid" },
				flexDirection: "column",
				gridTemplateColumns: { md: "1fr 340px" },
				overflow: "hidden",
			}}
		>
			{/* Canvas placeholder */}
			<Box
				sx={{
					bgcolor: SURFACE,
					height: { xs: "45vw", md: "100%" },
					minHeight: { xs: 400 },
					flexShrink: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					position: "relative",
					overflow: "hidden",
				}}
			>
				{/* Subtle spinning ring */}
				<Box
					sx={{
						width: 56,
						height: 56,
						borderRadius: "50%",
						border: "3px solid #2c2b28",
						borderTopColor: "#FF4D00",
						animation: "spin 0.9s linear infinite",
						"@keyframes spin": {
							from: { transform: "rotate(0deg)" },
							to: { transform: "rotate(360deg)" },
						},
					}}
				/>
			</Box>

			{/* Control panel placeholder */}
			<Box
				sx={{
					bgcolor: SURFACE,
					borderLeft: { md: `1px solid ${BORDER}` },
					borderTop: { xs: `1px solid ${BORDER}`, md: "none" },
					p: "20px",
					display: "flex",
					flexDirection: "column",
					gap: "14px",
					animation: `${shimmer} 1.6s ease-in-out infinite`,
				}}
			>
				{/* Title bar */}
				<Box sx={{ bgcolor: SURFACE2, borderRadius: "6px", height: 20, width: "60%" }} />
				{/* Upload zone */}
				<Box
					sx={{
						bgcolor: SURFACE2,
						border: `1.5px dashed ${BORDER}`,
						borderRadius: "10px",
						height: 100,
					}}
				/>
				{/* Section label */}
				<Box sx={{ bgcolor: SURFACE2, borderRadius: "6px", height: 14, width: "40%" }} />
				{/* Preview box */}
				<Box sx={{ bgcolor: SURFACE2, borderRadius: "8px", height: 120 }} />
				{/* Tab strip placeholder */}
				<Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
					{[0, 1, 2, 3].map((i) => (
						<Box key={i} sx={{ bgcolor: SURFACE2, borderRadius: "6px", height: 32 }} />
					))}
				</Box>
				{/* Slider */}
				<Box sx={{ bgcolor: SURFACE2, borderRadius: "6px", height: 6, mt: "4px" }} />
				{/* Submit button */}
				<Box sx={{ bgcolor: SURFACE2, borderRadius: "8px", height: 44, mt: "auto" }} />
			</Box>
		</Box>
	);
}
