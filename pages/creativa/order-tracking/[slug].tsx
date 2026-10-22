/* eslint-disable camelcase */
import { Alert, Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import { creativaApi, CreativaRequestError } from "@/api-client/creativa-checkout";
import type { CreativaPublicOrder } from "@/models/creativa";
import type { NextPageWithLayout } from "@/models/common";
import { CREATIVA_PUBLIC_ID, formatCreativaPrice } from "@/utils/creativa/contracts";
import { trackCreativa } from "@/utils/creativa/analytics";

const statusNames = {
	pending: "Chờ xác nhận",
	confirmed: "Đã xác nhận",
	processing: "Đang xử lý",
	in_transit: "Đang vận chuyển",
	completed: "Hoàn tất",
	cancelled: "Đã hủy",
};
const paymentNames = {
	pending: "Chưa xác nhận thanh toán",
	paid: "Đã thanh toán",
	failed: "Thanh toán chưa thành công",
	refunded: "Đã hoàn tiền",
};

const OrderDetail: NextPageWithLayout = () => {
	const router = useRouter();
	const id = typeof router.query.slug === "string" ? router.query.slug : "";
	const [order, setOrder] = useState<CreativaPublicOrder | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);
	const [retry, setRetry] = useState(0);
	const previous = useRef("");
	useEffect(() => {
		if (!router.isReady) return;
		if (!CREATIVA_PUBLIC_ID.test(id)) {
			setError("Mã đơn hàng không hợp lệ.");
			return;
		}
		let current = true;
		setOrder(null);
		setError(null);
		void creativaApi
			.order(id)
			.then((result) => {
				if (!current) return;
				setOrder(result);
				if (previous.current !== id) {
					previous.current = id;
					trackCreativa("order_tracking_result", {
						entry_point: router.query.entry === "root" ? "root" : "creativa",
						lookup_source: router.query.source === "history" ? "history" : "manual",
						outcome: "found",
					});
				}
			})
			.catch((failure: Error) => {
				if (current) {
					setError(failure.message);
					trackCreativa("order_tracking_result", {
						entry_point: router.query.entry === "root" ? "root" : "creativa",
						lookup_source: router.query.source === "history" ? "history" : "manual",
						outcome:
							failure instanceof CreativaRequestError && failure.status === 404
								? "not_found"
								: "error",
					});
				}
			});
		return () => {
			current = false;
		};
	}, [id, router.isReady, retry, router.query.entry, router.query.source]);
	async function copy(target: "id" | "url") {
		try {
			await navigator.clipboard.writeText(
				target === "id" ? id : `${window.location.origin}/creativa/order-tracking/${id}`
			);
			setNotice("Đã sao chép.");
			trackCreativa("order_reference_copy", { target, outcome: "success" });
		} catch {
			setNotice("Không thể tự sao chép. Hãy chọn mã hoặc đường dẫn dưới đây để sao chép thủ công.");
			trackCreativa("order_reference_copy", { target, outcome: "error" });
		}
	}
	return (
		<>
			<CreativaSeo title="Tra cứu đơn hàng" path="/creativa/order-tracking" noindex />
			<Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
				<Stack gap={2.5}>
					<Typography variant="h3" component="h1">
						Thông tin đơn hàng
					</Typography>
					{error && (
						<Alert
							severity="error"
							action={<Button onClick={() => setRetry((value) => value + 1)}>Thử lại</Button>}
						>
							{error}
						</Alert>
					)}
					{!order && !error && <Typography>Đang tra cứu…</Typography>}
					{order && (
						<>
							<Box sx={{ p: 3, bgcolor: "white", border: "1px solid #eadfd8" }}>
								<Typography variant="overline">MÃ ĐƠN HÀNG</Typography>
								<Typography
									component="p"
									sx={{
										fontSize: 27,
										fontFamily: "monospace",
										userSelect: "all",
										overflowWrap: "anywhere",
									}}
								>
									{order.publicId}
								</Typography>
								<Typography variant="body2" mt={1}>
									{new Date(order.orderDate).toLocaleString("vi-VN")}
								</Typography>
								<Stack direction="row" gap={1} mt={2} flexWrap="wrap">
									<Button variant="outlined" onClick={() => void copy("id")}>
										Sao chép mã
									</Button>
									<Button variant="outlined" onClick={() => void copy("url")}>
										Sao chép liên kết
									</Button>
								</Stack>
								{notice && (
									<Alert severity="info" sx={{ mt: 1 }}>
										{notice}
										<Box
											component="span"
											sx={{ display: "block", userSelect: "all", overflowWrap: "anywhere" }}
										>
											/creativa/order-tracking/{id}
										</Box>
									</Alert>
								)}
							</Box>
							<Stack direction={{ xs: "column", sm: "row" }} gap={2}>
								<Typography>Đơn hàng: {statusNames[order.status]}</Typography>
								<Typography>Thanh toán: {paymentNames[order.paymentStatus]}</Typography>
							</Stack>
							{order.trackingNumber && (
								<Typography>Mã vận chuyển: {order.trackingNumber}</Typography>
							)}
							{order.lines.map((line) => (
								<Stack
									key={line._key}
									direction="row"
									justifyContent="space-between"
									gap={2}
									sx={{ py: 2, borderBottom: "1px solid #eadfd8" }}
								>
									<Box>
										<Typography fontWeight={500}>{line.productName}</Typography>
										<Typography variant="body2">
											{line.selection.modelName} / {line.selection.coverageName}
										</Typography>
										<Typography variant="caption">
											{line.quantity} × {formatCreativaPrice(line.unitPrice)}
										</Typography>
									</Box>
									<Typography>{formatCreativaPrice(line.subtotal)}</Typography>
								</Stack>
							))}
							<Stack gap={1}>
								<Stack direction="row" justifyContent="space-between">
									<Typography>Sản phẩm</Typography>
									<Typography>{formatCreativaPrice(order.merchandiseTotal)}</Typography>
								</Stack>
								<Stack direction="row" justifyContent="space-between">
									<Typography>Vận chuyển ({order.shipping.name})</Typography>
									<Typography>{formatCreativaPrice(order.shippingFee)}</Typography>
								</Stack>
								<Divider />
								<Stack direction="row" justifyContent="space-between">
									<Typography fontWeight={700}>Tổng thanh toán</Typography>
									<Typography fontWeight={700}>{formatCreativaPrice(order.finalAmount)}</Typography>
								</Stack>
							</Stack>
							{order.paymentMethod === "bank_transfer" &&
								order.status !== "cancelled" &&
								(order.paymentStatus === "pending" || order.paymentStatus === "failed") &&
								(order.bank ? (
									<Alert severity="info">
										<Typography fontWeight={500}>Thông tin chuyển khoản</Typography>
										{order.bank.bankName}
										<br />
										{order.bank.accountName}
										<br />
										{order.bank.accountNumber}
										<br />
										Nội dung: {order.publicId}
										<br />
										{order.bank.transferInstructions}
										<br />
										Số tiền: {formatCreativaPrice(order.finalAmount)}
									</Alert>
								) : (
									<Alert severity="warning">
										Thông tin ngân hàng tạm thời chưa sẵn sàng. Vui lòng liên hệ hỗ trợ trước khi
										chuyển khoản.
									</Alert>
								))}
						</>
					)}
					<Stack direction="row" gap={2} flexWrap="wrap">
						<Link href="/creativa/order-tracking">Tra cứu mã khác</Link>
						<Link href="/creativa/skin-laptop/huong-dan-su-dung">Hướng dẫn sử dụng</Link>
						<Link href="/contact">
							<a
								onClick={() =>
									trackCreativa("contact_click", { method: "form", surface: "order_tracking" })
								}
							>
								Liên hệ INUT Design
							</a>
						</Link>
					</Stack>
				</Stack>
			</Container>
		</>
	);
};
OrderDetail.Layout = CreativaLayout;
export default OrderDetail;
