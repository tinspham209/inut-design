import { Button, Stack } from "@mui/material";

export function Preview3DFallback({ onBack }: { onBack: () => void }) {
	return <Stack><Button onClick={onBack}>Quay lại 2D</Button></Stack>;
}
