import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { FRAMES } from "@/data/keychain/catalog";
import type { KeychainAction, KeychainConfig } from "../types";

export function ShapeControls({ config, onChange }: { config: KeychainConfig; onChange: (action: KeychainAction) => void }) {
	return <Stack spacing={{ xs: 1.25, md: 0.4 }}>
		<Typography variant="caption" color="grey.400">Kiểu tạo hình</Typography>
		<Stack direction="row" spacing={{ xs: 1, md: 0.5 }}>
			<Button fullWidth variant="outlined" aria-pressed={config.shape.type === "frame"} onClick={() => onChange({ type: "select-frame", frameId: config.shape.type === "frame" ? config.shape.frameId : "heart" })} sx={{ minHeight: { md: 30 }, justifyContent: "flex-start", borderColor: config.shape.type === "frame" ? "#f47a28" : "#41424a", color: "white", bgcolor: "#202127" }}>▱ &nbsp; Khung có sẵn</Button>
			<Button fullWidth aria-pressed={config.shape.type === "die-cut"} onClick={() => onChange({ type: "select-die-cut" })} sx={{ minHeight: { md: 30 }, justifyContent: "flex-start", border: "1px solid", borderColor: config.shape.type === "die-cut" ? "#f47a28" : "#41424a", color: "white", bgcolor: "#202127" }}>✧ &nbsp; Cắt theo ảnh</Button>
		</Stack>
		{config.shape.type === "frame" && <>
			<Typography variant="caption" color="grey.400">Chọn hình khung</Typography>
			<Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(6, minmax(0, 1fr))", md: "repeat(9, minmax(0, 1fr))" }, gap: { xs: 0.5, md: 0.35 }, maxHeight: { xs: 164, md: "none" }, overflowY: "auto", pr: 0.25, "& button": { minHeight: { md: 30 } } }}>
				{FRAMES.map((frame) => <Button key={frame.id} title={frame.label} aria-label={frame.label} aria-pressed={config.shape.type === "frame" && config.shape.frameId === frame.id} onClick={() => onChange({ type: "select-frame", frameId: frame.id })} sx={{ minWidth: 0, minHeight: { xs: 48, md: 30 }, p: { xs: 0.5, md: 0.25 }, border: "1px solid", borderColor: config.shape.type === "frame" && config.shape.frameId === frame.id ? "#f47a28" : "#36373e", bgcolor: "#22232a", borderRadius: 1 }}><Image src={frame.src} alt="" width={24} height={24} unoptimized style={{ objectFit: "contain" }} /></Button>)}
			</Box>
		</>}
		{config.shape.type === "die-cut" && <>
			<Typography variant="caption" color="grey.400">Dùng ảnh PNG/WebP có nền trong suốt, một silhouette liền khối. Tai treo minh họa, lỗ giữ đường kính 4 mm.</Typography>
		</>}
	</Stack>;
}
