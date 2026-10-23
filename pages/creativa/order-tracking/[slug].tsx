/* eslint-disable camelcase */
import { Alert, Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import { CreativaBreadcrumbs } from "@/components/creativa/Breadcrumbs";
import { useCreativaTracking } from "@/hooks/creativa/useTracking";
import type { NextPageWithLayout } from "@/models/common";
import { formatCreativaPrice } from "@/utils/creativa/contracts";
import { trackCreativa } from "@/utils/creativa/analytics";
import { CreativaBankInstructions } from "@/components/creativa/BankInstructions";

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
	const { id, order, error, retry } = useCreativaTracking();
	const [notice, setNotice] = useState<string | null>(null);
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
			<Container maxWidth="md" sx={{ py: { xs: 2, md: 3 } }}>
				<CreativaBreadcrumbs
					ancestors={[
						{ label: "Creativa", href: "/creativa" },
						{ label: "Tra cứu đơn", href: "/creativa/order-tracking" },
					]}
					current="Thông tin đơn hàng"
				/>
				<Stack gap={1.5}>
					<Typography variant="h3" component="h1">
						Thông tin đơn hàng
					</Typography>
					{error && (
						<Alert severity="error" action={<Button onClick={() => void retry()}>Thử lại</Button>}>
							{error}
						</Alert>
					)}
					{!order && !error && <Typography>Đang tra cứu…</Typography>}
					{order && (
						<>
							<Box sx={{ p: 2, bgcolor: "white", border: "1px solid #eadfd8" }}>
								<Typography variant="overline">MÃ ĐƠN HÀNG</Typography>
								<Typography
									component="p"
									sx={{
										fontSize: 22,
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
									<CreativaBankInstructions
										key={order.publicId}
										bank={order.bank}
										amount={order.finalAmount}
										publicId={order.publicId}
									/>
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
