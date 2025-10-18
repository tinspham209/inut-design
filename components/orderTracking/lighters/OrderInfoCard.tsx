import { OrderLighter } from "@/models";
import { Card, CardContent, Typography, Divider, Grid, Chip, Stack, Box } from "@mui/material";
import { format } from "date-fns";
import React from "react";

interface OrderInfoCardProps {
	orderNumber?: string;
	orderDate: string;
	status?: OrderLighter["status"];
	paymentStatus?: OrderLighter["paymentStatus"];
}

const STATUS_LABELS: Record<OrderLighter["status"], string> = {
	pending: "Chờ xử lý",
	confirmed: "Đã xác nhận",
	processing: "Đang xử lý",
	completed: "Hoàn thành",
	cancelled: "Đã hủy",
};

const STATUS_COLOR: Record<
	OrderLighter["status"],
	"default" | "primary" | "success" | "warning" | "error" | "info"
> = {
	pending: "warning",
	confirmed: "info",
	processing: "primary",
	completed: "success",
	cancelled: "error",
};

const PAYMENT_STATUS_LABELS: Record<OrderLighter["paymentStatus"], string> = {
	pending: "Chờ thanh toán",
	paid: "Đã thanh toán",
	failed: "Thanh toán thất bại",
	refunded: "Đã hoàn tiền",
};

const PAYMENT_STATUS_COLOR: Record<
	OrderLighter["paymentStatus"],
	"default" | "primary" | "success" | "warning" | "error" | "info"
> = {
	pending: "warning",
	paid: "success",
	failed: "error",
	refunded: "info",
};

const OrderInfoCard: React.FC<OrderInfoCardProps> = ({
	orderNumber,
	orderDate,
	status,
	paymentStatus,
}) => {
	return (
		<Card>
			<CardContent>
				<Typography variant="h6" fontWeight="bold" gutterBottom>
					Thông tin đơn hàng
				</Typography>
				<Divider sx={{ my: 2 }} />
				<Grid container spacing={2}>
					{orderNumber && (
						<Grid item xs={12} sm={6}>
							<Typography variant="body2" color="text.secondary">
								Mã đơn hàng:
							</Typography>
							<Typography variant="body1" fontWeight="bold" color="primary.main">
								{orderNumber}
							</Typography>
						</Grid>
					)}
					<Grid item xs={12} sm={orderNumber ? 6 : 6}>
						<Typography variant="body2" color="text.secondary">
							Ngày đặt:
						</Typography>
						<Typography variant="body1" fontWeight="medium">
							{format(new Date(orderDate), "dd/MM/yyyy HH:mm")}
						</Typography>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack>
							<Typography variant="body2" color="text.secondary">
								Trạng thái đơn:
							</Typography>
							<Box>
								<Chip
									label={status ? STATUS_LABELS[status] : "Không xác định"}
									color={status ? STATUS_COLOR[status] : "default"}
									size="small"
									variant={status === "pending" ? "outlined" : "filled"}
									sx={{ mt: 0.5 }}
								/>
							</Box>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack>
							<Typography variant="body2" color="text.secondary">
								Trạng thái thanh toán:
							</Typography>
							<Box>
								<Chip
									label={paymentStatus ? PAYMENT_STATUS_LABELS[paymentStatus] : "Không xác định"}
									color={paymentStatus ? PAYMENT_STATUS_COLOR[paymentStatus] : "default"}
									size="small"
									variant={paymentStatus === "pending" ? "outlined" : "filled"}
									sx={{ mt: 0.5 }}
								/>
							</Box>
						</Stack>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default OrderInfoCard;
