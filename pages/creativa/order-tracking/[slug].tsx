/* eslint-disable camelcase */
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Container,
	Divider,
	Grid,
	IconButton,
	Link as MuiLink,
	Stack,
	Skeleton,
	Tooltip,
	Typography,
} from "@mui/material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { CreativaBankInstructions } from "@/components/creativa/BankInstructions";
import { CreativaBreadcrumbs } from "@/components/creativa/Breadcrumbs";
import { CreativaProductThumbnail } from "@/components/creativa/ProductThumbnail";
import { CreativaSeo } from "@/components/creativa/Seo";
import { CreativaLayout } from "@/components/layout";
import { useCreativaTracking } from "@/hooks/creativa/useTracking";
import type { NextPageWithLayout } from "@/models/common";
import type { CreativaOrderStatus, CreativaPaymentStatus } from "@/models/creativa";
import { trackCreativa } from "@/utils/creativa/analytics";
import { formatCreativaPrice } from "@/utils/creativa/contracts";

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
const paymentMethodNames = {
	cod: "Thanh toán khi nhận hàng (COD)",
	bank_transfer: "Chuyển khoản ngân hàng",
};
type StatusColor = "warning" | "info" | "success" | "error";
const orderColors: Record<CreativaOrderStatus, StatusColor> = {
	pending: "warning",
	confirmed: "info",
	processing: "info",
	in_transit: "info",
	completed: "success",
	cancelled: "error",
};
const paymentColors: Record<CreativaPaymentStatus, StatusColor> = {
	pending: "warning",
	paid: "success",
	failed: "error",
	refunded: "info",
};
const cardSx = {
	border: "1px solid",
	borderColor: "divider",
	borderRadius: 2,
	boxShadow: "0 8px 24px rgba(38, 30, 25, 0.06)",
};
const cardContentSx = {
	p: { xs: 1.5, sm: 2 },
	"&:last-child": { pb: { xs: 1.5, sm: 2 } },
};

function SectionTitle({ children }: { children: ReactNode }) {
	return (
		<Typography
			component="h2"
			variant="subtitle1"
			fontWeight={700}
			letterSpacing="0.04em"
			textTransform="uppercase"
		>
			{children}
		</Typography>
	);
}

function DetailField({ label, children }: { label: string; children: ReactNode }) {
	return (
		<Box sx={{ minWidth: 0 }}>
			<Typography variant="body2" color="text.secondary">
				{label}
			</Typography>
			<Typography
				component="div"
				variant="body1"
				fontWeight={600}
				sx={{ overflowWrap: "anywhere" }}
			>
				{children}
			</Typography>
		</Box>
	);
}

function TrackingLoadingSkeleton() {
	return (
		<Stack gap={2} aria-label="Đang tải thông tin đơn hàng" aria-busy="true">
			<Card sx={cardSx}>
				<CardContent sx={cardContentSx}>
					<Skeleton variant="text" width={190} height={28} />
					<Divider sx={{ my: 1.5 }} />
					<Grid container spacing={{ xs: 1.5, sm: 2 }}>
						{Array.from({ length: 4 }, (_, index) => (
							<Grid item xs={12} sm={6} key={index}>
								<Skeleton variant="text" width={105} />
								<Skeleton variant="text" width="65%" height={28} />
							</Grid>
						))}
					</Grid>
				</CardContent>
			</Card>
			<Card sx={cardSx}>
				<CardContent sx={cardContentSx}>
					<Skeleton variant="text" width={215} height={28} />
					<Divider sx={{ my: 1.5 }} />
					<Grid container spacing={{ xs: 1.5, sm: 2 }}>
						{Array.from({ length: 3 }, (_, index) => (
							<Grid item xs={12} sm={4} key={index}>
								<Skeleton variant="text" width={100} />
								<Skeleton variant="text" width="80%" height={28} />
							</Grid>
						))}
						<Grid item xs={12}>
							<Skeleton variant="text" width={130} />
							<Skeleton variant="text" width="90%" height={28} />
						</Grid>
						<Grid item xs={12}>
							<Skeleton variant="text" width={165} />
							<Skeleton variant="text" width="50%" height={28} />
						</Grid>
					</Grid>
				</CardContent>
			</Card>
			<Card
				sx={{
					...cardSx,
					bgcolor: "primary.main",
					borderColor: "primary.main",
				}}
			>
				<CardContent sx={cardContentSx}>
					<Skeleton
						variant="text"
						width={230}
						height={30}
						sx={{ bgcolor: "rgba(255,255,255,0.3)" }}
					/>
					<Skeleton
						variant="rounded"
						height={86}
						sx={{ my: 1.5, bgcolor: "rgba(255,255,255,0.65)" }}
					/>
					<Grid container spacing={1.5}>
						<Grid item xs={12} md={5}>
							<Skeleton variant="rounded" height={250} />
						</Grid>
						<Grid item xs={12} md={7}>
							<Skeleton variant="rounded" height={250} />
						</Grid>
					</Grid>
					<Skeleton
						variant="rounded"
						height={56}
						sx={{ mt: 1.5, bgcolor: "rgba(255,255,255,0.65)" }}
					/>
				</CardContent>
			</Card>
			<Card sx={cardSx}>
				<CardContent sx={cardContentSx}>
					<Skeleton variant="text" width={210} height={28} />
					<Divider sx={{ my: 1.5 }} />
					{Array.from({ length: 2 }, (_, index) => (
						<Stack key={index} direction="row" gap={1.5} sx={{ mb: 1.5 }}>
							<Skeleton variant="rounded" width={64} height={64} />
							<Box sx={{ flex: 1 }}>
								<Skeleton variant="text" width="50%" height={26} />
								<Skeleton variant="text" width="70%" />
								<Skeleton variant="text" width="30%" />
							</Box>
						</Stack>
					))}
					<Divider sx={{ my: 1.5 }} />
					<Skeleton variant="text" width="100%" height={28} />
					<Skeleton variant="text" width="100%" height={28} />
					<Skeleton variant="text" width="100%" height={28} />
				</CardContent>
			</Card>
			<Stack direction={{ xs: "column", sm: "row" }} gap={1.5} justifyContent="center">
				{Array.from({ length: 3 }, (_, index) => (
					<Skeleton key={index} variant="rounded" width={170} height={48} />
				))}
			</Stack>
			<Stack alignItems="center" gap={1}>
				<Skeleton variant="text" width={220} />
				<Skeleton variant="text" width={300} />
			</Stack>
		</Stack>
	);
}

const OrderDetail: NextPageWithLayout = () => {
	const { order, error, retry, current } = useCreativaTracking();
	const router = useRouter();

	async function copy(target: "url" | "tracking") {
		const value =
			target === "url"
				? `${window.location.origin}${window.location.pathname}`
				: order?.trackingNumber || "";
		try {
			await navigator.clipboard.writeText(value);
			toast.success(
				target === "tracking"
					? "Đã sao chép mã vận đơn."
					: "Đã sao chép liên kết tra cứu.",
				{ id: "creativa-copy", duration: 2500 }
			);
			trackCreativa("order_reference_copy", { target, outcome: "success" });
		} catch {
			toast.error(
				target === "tracking"
					? "Không thể tự sao chép. Hãy chọn mã vận đơn để sao chép thủ công."
					: "Không thể tự sao chép. Hãy sao chép địa chỉ trang từ thanh trình duyệt.",
				{ id: "creativa-copy", duration: 8000 }
			);
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
				<Typography variant="h3" component="h1" sx={{ mb: 1.5 }}>
					Thông tin đơn hàng
				</Typography>
				<Stack gap={1.5}>
					{error && (
						<Alert severity="error" action={<Button onClick={() => void retry()}>Thử lại</Button>}>
							{error}
						</Alert>
					)}
					{!order && !error && <TrackingLoadingSkeleton />}
					{order && (
						<>
							<Card sx={cardSx}>
								<CardContent sx={cardContentSx}>
									<SectionTitle>Thông tin đơn hàng</SectionTitle>
									<Divider sx={{ my: 1.5 }} />
									<Grid container spacing={{ xs: 2, sm: 2.5 }}>
										<Grid item xs={12} sm={6}>
											<DetailField label="Mã đơn hàng">
												<Stack direction="row" alignItems="center" gap={0.5}>
													<Box
														component="span"
														sx={{ color: "primary.dark", overflowWrap: "anywhere" }}
													>
														{order.publicId}
													</Box>
													<Tooltip title="Sao chép liên kết tra cứu">
														<IconButton
															size="small"
															aria-label="Sao chép liên kết tra cứu"
															onClick={() => void copy("url")}
														>
															<ContentCopyOutlinedIcon fontSize="small" />
														</IconButton>
													</Tooltip>
												</Stack>
											</DetailField>
										</Grid>
										<Grid item xs={12} sm={6}>
											<DetailField label="Ngày đặt">
												{new Date(order.orderDate).toLocaleString("vi-VN")}
											</DetailField>
										</Grid>
										<Grid item xs={12} sm={6}>
											<DetailField label="Trạng thái đơn hàng">
												<Chip
													size="small"
													label={statusNames[order.status]}
													color={orderColors[order.status]}
													sx={{ mt: 0.5 }}
												/>
											</DetailField>
										</Grid>
										<Grid item xs={12} sm={6}>
											<DetailField label="Trạng thái thanh toán">
												<Chip
													size="small"
													label={paymentNames[order.paymentStatus]}
													variant="outlined"
													color={paymentColors[order.paymentStatus]}
													sx={{ mt: 0.5 }}
												/>
											</DetailField>
										</Grid>
										{order.trackingNumber && (
											<Grid item xs={12}>
												<DetailField label="Mã vận đơn">
													<Stack direction="row" alignItems="center" gap={0.5}>
														<Box
															component="span"
															sx={{ color: "primary.dark", overflowWrap: "anywhere" }}
														>
															{order.trackingNumber}
														</Box>
														<Tooltip title="Sao chép mã vận đơn">
															<IconButton
																size="small"
																aria-label="Sao chép mã vận đơn"
																onClick={() => void copy("tracking")}
															>
																<ContentCopyOutlinedIcon fontSize="small" />
															</IconButton>
														</Tooltip>
													</Stack>
												</DetailField>
											</Grid>
										)}
									</Grid>
								</CardContent>
							</Card>

							<Card sx={cardSx}>
								<CardContent sx={cardContentSx}>
									<SectionTitle>Thông tin khách hàng</SectionTitle>
									<Divider sx={{ my: 1.5 }} />
									<Grid container spacing={{ xs: 2, sm: 2.5 }}>
										<Grid item xs={12} sm={4}>
											<DetailField label="Họ và tên">{order.customer.name}</DetailField>
										</Grid>
										<Grid item xs={12} sm={4}>
											<DetailField label="Số điện thoại">{order.customer.phone}</DetailField>
										</Grid>
										{order.customer.email && (
											<Grid item xs={12} sm={4}>
												<DetailField label="Email">{order.customer.email}</DetailField>
											</Grid>
										)}
										{order.customer.address && (
											<Grid item xs={12}>
												<DetailField label="Địa chỉ giao hàng">
													{order.customer.address}
												</DetailField>
											</Grid>
										)}
										<Grid item xs={12}>
											<DetailField label="Phương thức thanh toán">
												{paymentMethodNames[order.paymentMethod]}
											</DetailField>
										</Grid>
									</Grid>
								</CardContent>
							</Card>

							{order.paymentMethod === "bank_transfer" &&
								order.status !== "cancelled" &&
								(order.paymentStatus === "pending" || order.paymentStatus === "failed") &&
								(order.bank && order.transferContent ? (
									<CreativaBankInstructions
										key={`${order.publicId}:${order.transferContent}`}
										bank={order.bank}
										amount={order.finalAmount}
										transferContent={order.transferContent}
										disabled={!current}
									/>
								) : (
									<Alert severity="warning">
										Thông tin chuyển khoản tạm thời chưa sẵn sàng. Vui lòng liên hệ hỗ trợ trước khi
										chuyển khoản.
									</Alert>
								))}

							<Card sx={cardSx}>
								<CardContent sx={cardContentSx}>
									<SectionTitle>
										Sản phẩm đã đặt ({order.lines.reduce((sum, line) => sum + line.quantity, 0)}{" "}
										cái)
									</SectionTitle>
									<Divider sx={{ my: 1.5 }} />
									<Stack spacing={1.5}>
										{order.lines.map((line) => (
											<Stack
												key={line._key}
												direction="row"
												justifyContent="space-between"
												alignItems="flex-start"
												gap={2}
												sx={{ minWidth: 0 }}
											>
												<Stack direction="row" gap={1.5} sx={{ minWidth: 0 }}>
													<CreativaProductThumbnail
														image={line.productImage}
														name={line.productName}
													/>
													<Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
														<Typography fontWeight={600}>{line.productName}</Typography>
														<Typography variant="body2" color="text.secondary">
															{line.selection.modelName} / {line.selection.coverageName}
														</Typography>
														<Typography variant="caption" color="text.secondary">
															{line.unitPrice !== undefined
																? `${line.quantity} cái × ${formatCreativaPrice(line.unitPrice)}`
																: `Số lượng: ${line.quantity}`}
														</Typography>
													</Box>
												</Stack>
												{line.subtotal !== undefined && (
													<Typography
														fontWeight={700}
														color="primary.dark"
														textAlign="right"
														sx={{ flexShrink: 0 }}
													>
														{formatCreativaPrice(line.subtotal)}
													</Typography>
												)}
											</Stack>
										))}
									</Stack>
									<Divider sx={{ my: 2 }} />
									<Stack gap={1}>
										<Stack direction="row" justifyContent="space-between" gap={2}>
											<Typography variant="body2">Tổng sản phẩm:</Typography>
											<Typography variant="body2" fontWeight={600}>
												{order.lines.reduce((sum, line) => sum + line.quantity, 0)} cái
											</Typography>
										</Stack>
										<Stack direction="row" justifyContent="space-between" gap={2}>
											<Typography fontWeight={700}>Tạm tính:</Typography>
											<Typography fontWeight={700} color="primary.dark">
												{formatCreativaPrice(order.merchandiseTotal)}
											</Typography>
										</Stack>
										<Stack direction="row" justifyContent="space-between" gap={2}>
											<Typography variant="body2">
												Phí vận chuyển{order.shipping.name ? ` (${order.shipping.name})` : ""}:
											</Typography>
											<Typography variant="body2" fontWeight={600}>
												{formatCreativaPrice(order.shippingFee)}
											</Typography>
										</Stack>
										{order.discount > 0 && (
											<Stack direction="row" justifyContent="space-between" gap={2}>
												<Typography variant="body2">Giảm giá:</Typography>
												<Typography variant="body2" fontWeight={600} color="success.main">
													−{formatCreativaPrice(order.discount)}
												</Typography>
											</Stack>
										)}
										<Divider />
										<Stack direction="row" justifyContent="space-between" gap={2}>
											<Typography fontWeight={700}>Thành tiền:</Typography>
											<Typography fontWeight={700} color="primary.dark">
												{formatCreativaPrice(order.finalAmount)}
											</Typography>
										</Stack>
									</Stack>
								</CardContent>
							</Card>

							<Stack
								direction={{ xs: "column", sm: "row" }}
								gap={1.5}
								justifyContent="center"
								sx={{ mt: 0.5 }}
							>
								<Button
									variant="outlined"
									size="large"
									startIcon={<PrintOutlinedIcon />}
									onClick={() => {
										trackCreativa("cta_click", {
											surface: "order_tracking",
											cta_name: "print_order",
										});
										window.print();
									}}
								>
									In đơn hàng
								</Button>
								<Button
									variant="outlined"
									size="large"
									startIcon={<ShoppingBagOutlinedIcon />}
									onClick={() => {
										trackCreativa("cta_click", {
											surface: "order_tracking",
											cta_name: "continue_shopping",
										});
										void router.push("/creativa/skin-laptop");
									}}
								>
									Tiếp tục mua sắm
								</Button>
								<Button
									variant="contained"
									size="large"
									startIcon={<HomeOutlinedIcon />}
									onClick={() => {
										trackCreativa("cta_click", { surface: "order_tracking", cta_name: "home" });
										void router.push("/creativa");
									}}
								>
									Về trang chủ
								</Button>
							</Stack>

							<Box sx={{ mt: 0.5, textAlign: "center" }}>
								<Typography variant="body2" color="text.secondary" gutterBottom>
									Cần hỗ trợ?{" "}
									<Link href="/contact" passHref>
										<MuiLink
											component="a"
											onClick={() =>
												trackCreativa("contact_click", {
													method: "form",
													surface: "order_tracking",
												})
											}
										>
											Liên hệ với chúng tôi
										</MuiLink>
									</Link>
								</Typography>
								<Stack
									direction={{ xs: "column", sm: "row" }}
									gap={2}
									justifyContent="center"
									sx={{ mt: 0.5 }}
								>
									<Typography variant="body2" fontWeight={600}>
										SĐT/Zalo:{" "}
										<MuiLink
											href="tel:0327124321"
											onClick={() =>
												trackCreativa("contact_click", {
													method: "phone",
													surface: "order_tracking",
												})
											}
										>
											0327 124 321
										</MuiLink>
									</Typography>
									<Typography variant="body2" fontWeight={600}>
										Facebook:{" "}
										<MuiLink
											href="https://www.facebook.com/inutdesign"
											target="_blank"
											rel="noopener noreferrer"
											onClick={() =>
												trackCreativa("contact_click", {
													method: "facebook",
													surface: "order_tracking",
												})
											}
										>
											facebook.com/inutdesign
										</MuiLink>
									</Typography>
								</Stack>
							</Box>
							<Stack direction="row" gap={2} flexWrap="wrap" justifyContent="center">
								<Link href="/creativa/order-tracking">
									<a
										onClick={() =>
											trackCreativa("cta_click", {
												surface: "order_tracking",
												cta_name: "new_order_lookup",
											})
										}
									>
										Tra cứu mã khác
									</a>
								</Link>
								<Link href="/creativa/skin-laptop/huong-dan-su-dung">
									<a>Hướng dẫn sử dụng</a>
								</Link>
							</Stack>
						</>
					)}
				</Stack>
			</Container>
		</>
	);
};

OrderDetail.Layout = CreativaLayout;
export default OrderDetail;
