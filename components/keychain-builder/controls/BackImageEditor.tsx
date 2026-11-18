import { Alert, Button, Stack, Typography } from "@mui/material";
import type { ImageTransform } from "../types";

type Props = { transform: ImageTransform; onChange: (transform: ImageTransform) => void; onReset: () => void };
export function BackImageEditor({ transform, onChange, onReset }: Props) {
	return <Stack spacing={1.25} sx={{ mt: 2 }}>
		<Typography variant="subtitle2">Căn ảnh mặt sau</Typography>
		<Alert severity="info">Ảnh sẽ được cắt theo vùng in của khung; vùng ngoài khung không xuất hiện.</Alert>
		<Stack direction="row" flexWrap="wrap" gap={1}>
			<Button onClick={() => onChange({ ...transform, scale: Math.max(0.1, transform.scale / 1.1) })} aria-label="Thu nhỏ ảnh">−</Button>
			<Button onClick={() => onChange({ ...transform, scale: Math.min(12, transform.scale * 1.1) })} aria-label="Phóng to ảnh">+</Button>
			<Button onClick={() => onChange({ ...transform, rotation: (transform.rotation + 90) % 360 })}>Xoay 90°</Button>
			<Button onClick={() => onChange({ ...transform, flipX: !transform.flipX })}>Lật ngang</Button>
			<Button onClick={onReset}>Đặt lại ảnh sau</Button>
		</Stack>
	</Stack>;
}
