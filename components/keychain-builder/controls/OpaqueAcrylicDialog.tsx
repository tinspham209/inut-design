import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import type { AcrylicId } from "../types";

type Props = { acrylicId: Exclude<AcrylicId, "clear"> | null; onCancel: () => void; onConfirm: (id: Exclude<AcrylicId, "clear">) => void };
export function OpaqueAcrylicDialog({ acrylicId, onCancel, onConfirm }: Props) {
	return <Dialog open={Boolean(acrylicId)} onClose={onCancel} aria-labelledby="opaque-title">
		<DialogTitle id="opaque-title">Chuyển sang acrylic đục?</DialogTitle>
		<DialogContent><DialogContentText>Acrylic đục chỉ in một mặt. Mặt sau sẽ là màu acrylic và lựa chọn mặt sau sẽ được đặt lại. Ảnh mặt sau đã tải vẫn được giữ.</DialogContentText></DialogContent>
		<DialogActions><Button onClick={onCancel}>Hủy</Button><Button variant="contained" onClick={() => acrylicId && onConfirm(acrylicId)}>Xác nhận</Button></DialogActions>
	</Dialog>;
}
