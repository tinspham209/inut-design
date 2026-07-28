import { Card, CardContent, Typography, Divider, Stack, Box } from "@mui/material";
import { formatPrice } from "@/utils/priceCalculator";
import React from "react";
import type { LighterType, OrderItemLighter, OrderLighter } from "@/models/cart";
import Image from "next/image";
import { urlFor } from "@/api-client/sanity-client";

interface OrderItemsListProps {
	items: OrderLighter["orderItems"];
	totalAmount: number;
	shippingFee?: number;
	discount?: number;
	finalAmount?: number;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
	items,
	totalAmount,
	shippingFee = 0,
	discount = 0,
	finalAmount,
}) => {
	// Calculate total items from order
	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
	const payableAmount = finalAmount ?? totalAmount + shippingFee - discount;

	return (
		<Card>
			<CardContent>
				<Typography variant="h6" fontWeight="bold" gutterBottom>
					Sản phẩm đã đặt ({totalItems} cái)
				</Typography>
				<Divider sx={{ my: 2 }} />
				<Stack spacing={2}>
					{items.map((item, index) => (
						<OrderItem
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							item={item as any}
							index={index}
							key={item._key}
						/>
					))}
				</Stack>
				<Divider sx={{ my: 3 }} />
				<Stack spacing={1}>
					<Stack direction="row" justifyContent="space-between">
						<Typography variant="body2">Tổng sản phẩm:</Typography>
						<Typography variant="body2" fontWeight="medium">
							{totalItems} cái
						</Typography>
					</Stack>
					<Stack direction="row" justifyContent="space-between">
						<Typography variant="subtitle1" fontWeight="bold">
							Tạm tính:
						</Typography>
						<Typography variant="subtitle1" fontWeight="bold" color="primary">
							{formatPrice(totalAmount)}
						</Typography>
					</Stack>
					<Stack direction="row" justifyContent="space-between">
						<Typography variant="body2">Phí vận chuyển:</Typography>
						<Typography variant="body2" fontWeight="medium">
							{formatPrice(shippingFee)}
						</Typography>
					</Stack>
					{discount > 0 && (
						<Stack direction="row" justifyContent="space-between">
							<Typography variant="body2">Giảm giá:</Typography>
							<Typography variant="body2" fontWeight="medium" color="success.main">
								- {formatPrice(discount)}
							</Typography>
						</Stack>
					)}
					<Divider />
					<Stack direction="row" justifyContent="space-between">
						<Typography variant="subtitle1" fontWeight="bold">
							Thành tiền:
						</Typography>
						<Typography variant="subtitle1" fontWeight="bold" color="primary.main">
							{formatPrice(payableAmount)}
						</Typography>
					</Stack>
				</Stack>
				<Divider sx={{ my: 2 }} />
				<Typography variant="caption" color="text.secondary">
					Giá đã bao gồm in ấn và VAT (nếu có). Nếu bạn muốn xuất hoá đơn bán hàng, vui lòng liên hệ
					sớm với chúng tôi.
				</Typography>
			</CardContent>
		</Card>
	);
};

type OrderItemProps = {
	item: Omit<OrderItemLighter, "lighterType" | "product"> & {
		lighterType: LighterType;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		product: any;
	};
	index: number;
};

const OrderItem: React.FC<OrderItemProps> = ({ item, index }) => {
	return (
		<Box key={`${item._key}-${index}`}>
			<Stack direction="row" spacing={2} alignItems="start">
				<Box
					sx={{
						width: 60,
						height: 60,
						borderRadius: 1,
						bgcolor: "transparent",
					}}
				>
					<Image
						src={urlFor(item.product?.image[0]).width(60).url()}
						alt={item.product?.name || "Sản phẩm"}
						width="100%"
						height={"100%"}
						unoptimized
						layout="responsive"
						priority={true}
						style={{
							borderRadius: "8px",
						}}
					/>
				</Box>
				<Box flex={1}>
					<Typography variant="body1" fontWeight="bold">
						{item.product?.name || "Sản phẩm"}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						Loại: {item.lighterType?.name || "N/A"}
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
						{item.quantity} cái × {formatPrice(item.unitPrice)}
					</Typography>
				</Box>
				<Box textAlign="right">
					<Typography variant="body1" fontWeight="bold" color="primary">
						{formatPrice(item.subtotal)}
					</Typography>
				</Box>
			</Stack>
		</Box>
	);
};

export default OrderItemsList;
