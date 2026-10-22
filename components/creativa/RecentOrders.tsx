/* eslint-disable camelcase */
import {
	Alert,
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useCreativaOrderHistory } from "@/hooks/creativa/useBrowserState";
import { clearHistory, removeHistoryId } from "@/utils/creativa/storage";
import { trackCreativa } from "@/utils/creativa/analytics";

export function RecentCreativaOrders({
	entryPoint = "creativa",
}: {
	entryPoint?: "root" | "creativa";
}) {
	const history = useCreativaOrderHistory();
	const router = useRouter();
	const [visible, setVisible] = useState(20);
	const [confirm, setConfirm] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const reportedReadError = useRef<string | null>(null);
	useEffect(() => {
		if (!history.ready) return;
		if (!history.error) {
			reportedReadError.current = null;
		} else if (reportedReadError.current !== history.error) {
			reportedReadError.current = history.error;
			trackCreativa("order_history_storage_error", {
				entry_point: entryPoint,
				phase: "read",
				reason: "invalid_or_unavailable",
			});
		}
	}, [history.ready, history.error, entryPoint]);
	if (!history.ready) return null;
	return (
		<Box>
			{(error || history.error) && (
				<Alert severity="warning" sx={{ mb: 2 }}>
					{error || history.error}
				</Alert>
			)}
			<Typography variant="subtitle2" gutterBottom>
				Đơn Creativa đã lưu trên trình duyệt này
			</Typography>
			<Typography variant="caption" component="p" sx={{ mb: 1.5 }}>
				Không đồng bộ giữa các thiết bị. Người dùng chung trình duyệt có thể xem các mã này.
			</Typography>
			{!history.value.length && (
				<Typography variant="body2">
					Chưa có mã đã lưu. Bạn có thể nhập mã đơn hàng để tra cứu.
				</Typography>
			)}
			<Stack direction="row" flexWrap="wrap" gap={1}>
				{history.value.slice(0, visible).map((id) => (
					<Chip
						key={id}
						label={id}
						variant="outlined"
						aria-label={`Tra cứu đơn ${id}`}
						onClick={() => {
							trackCreativa("order_tracking_search", {
								entry_point: entryPoint,
								lookup_source: "history",
							});
							void router.push({
								pathname: `/creativa/order-tracking/${encodeURIComponent(id)}`,
								query: { source: "history", entry: entryPoint },
							});
						}}
						onDelete={() => {
							const result = removeHistoryId(id);
							setError(result.error || null);
							if (result.error)
								trackCreativa("order_history_storage_error", {
									entry_point: entryPoint,
									phase: "remove",
									reason: "storage_failed",
								});
							trackCreativa("order_history_action", {
								action: "remove",
								entry_point: entryPoint,
								outcome: result.error ? "error" : "success",
								count_before: history.value.length,
								count_after: result.value.length,
							});
							history.refresh();
						}}
					/>
				))}
			</Stack>
			<Stack direction="row" gap={1} mt={1}>
				{history.value.length > visible && (
					<Button size="small" onClick={() => setVisible((value) => value + 20)}>
						Xem thêm
					</Button>
				)}
				{(history.value.length > 0 || history.error) && (
					<Button size="small" onClick={() => setConfirm(true)}>
						Xóa lịch sử cục bộ
					</Button>
				)}
			</Stack>
			<Dialog open={confirm} onClose={() => setConfirm(false)}>
				<DialogTitle>Xóa lịch sử trên trình duyệt?</DialogTitle>
				<DialogContent>
					Thao tác này chỉ quên các mã đã lưu, không hủy đơn hàng hoặc thay đổi giỏ hàng.
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirm(false)}>Giữ lại</Button>
					<Button
						onClick={() => {
							const result = clearHistory();
							setError(result.error || null);
							setConfirm(false);
							if (result.error)
								trackCreativa("order_history_storage_error", {
									entry_point: entryPoint,
									phase: "clear",
									reason: "storage_failed",
								});
							trackCreativa("order_history_action", {
								action: "clear",
								entry_point: entryPoint,
								count_before: history.value.length,
								count_after: result.value.length,
								outcome: result.error ? "error" : "success",
							});
							history.refresh();
						}}
					>
						Xóa lịch sử
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
