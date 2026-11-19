import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { ACRYLICS, RINGS, SIZES_CM } from "@/data/keychain/catalog";
import type { AcrylicId, KeychainConfig } from "../types";

type Props = {
	section: "shape" | "material";
	config: KeychainConfig;
	onRing: (id: string) => void;
	onFrame: (id: string) => void;
	onSize: (cm: number) => void;
	onAcrylic: (id: AcrylicId) => void;
	onOpaque: (id: Exclude<AcrylicId, "clear">) => void;
	onMaterial: (material: Partial<KeychainConfig["material"]>) => void;
};
export function AppearanceControls({
	section,
	config,
	onRing,
	onSize,
	onAcrylic,
	onOpaque,
	onMaterial,
}: Props) {
	if (section === "shape")
		return (
			<Stack spacing={{ xs: 1.25, md: 0.35 }} sx={{ mt: { xs: 1.5, md: 0.35 } }}>
				<Typography variant="caption" color="grey.400">
					Kiểu khoen
				</Typography>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "repeat(5, minmax(0, 1fr))",
							md: "repeat(10, minmax(0, 1fr))",
						},
						gap: { xs: 0.5, md: 0.35 },
						"& button": { minHeight: { md: 32 } },
					}}
				>
					{RINGS.map((ring) => (
						<Button
							key={ring.id}
							title={ring.label}
							aria-label={ring.label}
							aria-pressed={config.ringId === ring.id}
							onClick={() => onRing(ring.id)}
							sx={{
								minWidth: 0,
								minHeight: { xs: 49, md: 32 },
								p: { xs: 0.5, md: 0.25 },
								bgcolor: "#22232a",
								border: "1px solid",
								borderColor: config.ringId === ring.id ? "#f47a28" : "#36373e",
								borderRadius: 1,
							}}
						>
							<Box sx={{ position: "relative", width: "100%", height: { xs: 34, md: 25 } }}>
								<Image
									src={ring.src}
									alt=""
									layout="fill"
									objectFit="contain"
									unoptimized
									sizes="(min-width: 900px) 42px, 100%"
								/>
							</Box>
						</Button>
					))}
				</Box>
				<Typography variant="caption" color="grey.400">
					Kích thước thành phẩm (cm)
				</Typography>
				<Stack direction="row" spacing={{ xs: 0.6, md: 0.35 }} flexWrap="wrap">
					{SIZES_CM.map((size) => (
						<Button
							key={size}
							aria-pressed={config.sizeCm === size}
							onClick={() => onSize(size)}
							sx={{
								px: { xs: 1.1, md: 0.7 },
								minWidth: { xs: 39, md: 30 },
								minHeight: { xs: 34, md: 28 },
								border: "1px solid",
								borderColor: config.sizeCm === size ? "#f47a28" : "#36373e",
								color: config.sizeCm === size ? "#ffad69" : "#d0d0d5",
								bgcolor: "#22232a",
								borderRadius: 1,
								fontSize: 11,
							}}
						>
							{size}
						</Button>
					))}
				</Stack>
			</Stack>
		);
	return (
		<>
			<Typography variant="caption" color="grey.400">
				Chọn màu mica
			</Typography>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 88px), 1fr))",
					gap: { xs: 0.5, md: 0.35 },
					mt: 0.35,
					minWidth: 0,
				}}
			>
				{ACRYLICS.map((item) => (
					<Button
						key={item.id}
						aria-pressed={config.acrylicId === item.id}
						onClick={() =>
							item.opaque && config.acrylicId === "clear"
								? onOpaque(item.id as Exclude<AcrylicId, "clear">)
								: onAcrylic(item.id)
						}
						sx={{
							minWidth: 0,
							minHeight: { xs: 44, md: 32 },
							px: 0.5,
							display: "flex",
							flexDirection: "row",
							justifyContent: "flex-start",
							gap: 0.5,
							whiteSpace: "nowrap",
							overflow: "hidden",
							border: "1px solid",
							borderColor: config.acrylicId === item.id ? "#f47a28" : "#36373e",
							bgcolor: "#22232a",
							color: "#d0d0d5",
							borderRadius: 1,
							fontSize: { xs: 10, md: 9 },
							lineHeight: 1.1,
						}}
					>
						<Box
							sx={{
								flex: "0 0 auto",
								width: { xs: 18, md: 13 },
								height: { xs: 18, md: 13 },
								borderRadius: "50%",
								bgcolor: item.color,
								border: "1px solid #ffffff55",
							}}
						/>
						<Box
							component="span"
							sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}
						>
							{item.label}
						</Box>
					</Button>
				))}
			</Box>
			<Stack
				direction="row"
				spacing={{ xs: 0.5, md: 0.35 }}
				alignItems="center"
				sx={{ mt: { xs: 1, md: 0.5 } }}
			>
				<Typography variant="caption" color="grey.400" sx={{ mr: 0.5 }}>
					Độ dày
				</Typography>
				{([2, 3, 5] as const).map((thicknessMm) => (
					<Button
						key={thicknessMm}
						aria-pressed={config.material.thicknessMm === thicknessMm}
						onClick={() => onMaterial({ thicknessMm })}
						sx={{
							minWidth: { xs: 52, md: 46 },
							minHeight: { xs: 34, md: 28 },
							px: 0.75,
							border: "1px solid",
							borderColor: config.material.thicknessMm === thicknessMm ? "#f47a28" : "#36373e",
							color: config.material.thicknessMm === thicknessMm ? "#ffad69" : "#d0d0d5",
							bgcolor: "#22232a",
							borderRadius: 1,
							fontSize: 11,
						}}
					>
						{thicknessMm} mm
					</Button>
				))}
			</Stack>
		</>
	);
}
