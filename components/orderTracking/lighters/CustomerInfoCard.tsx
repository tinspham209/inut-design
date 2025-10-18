import { Card, CardContent, Typography, Divider, Grid, Box } from "@mui/material";
import React from "react";

interface CustomerInfoCardProps {
	name: string;
	phone: string;
	email?: string;
	address?: string;
	paymentMethod: string;
	notes?: string;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
	name,
	phone,
	email,
	address,
	paymentMethod,
	notes,
}) => {
	const paymentMethodLabels: Record<string, string> = {
		cod: "Thanh toán khi nhận hàng (COD)",
		// eslint-disable-next-line camelcase
		bank_transfer: "Chuyển khoản ngân hàng",
	};
	const fields = [
		{
			label: "Họ và tên:",
			value: name,
			xs: 12,
			sm: 4,
			show: true,
		},
		{
			label: "Số điện thoại:",
			value: phone,
			xs: 12,
			sm: 4,
			show: true,
		},
		{
			label: "Email:",
			value: email,
			xs: 12,
			sm: 4,
			show: !!email,
		},
		{
			label: "Địa chỉ giao hàng:",
			value: address,
			xs: 12,
			sm: 12,
			show: !!address,
		},
		{
			label: "Phương thức thanh toán:",
			value: paymentMethodLabels[paymentMethod] || paymentMethod,
			xs: 12,
			sm: 12,
			show: true,
		},
		{
			label: "Ghi chú:",
			value: notes,
			xs: 12,
			sm: 12,
			show: !!notes,
		},
	];

	return (
		<Card>
			<CardContent>
				<Typography variant="h6" fontWeight="bold" gutterBottom>
					Thông tin khách hàng
				</Typography>
				<Divider sx={{ my: 2 }} />
				<Grid container spacing={2}>
					{fields
						.filter((f) => f.show)
						.map((f, idx) => (
							<Grid item xs={f.xs} sm={f.sm} key={idx}>
								<Box>
									<Typography variant="body2" color="text.secondary">
										{f.label}
									</Typography>
									<Typography variant="body1" fontWeight="medium">
										{f.value}
									</Typography>
								</Box>
							</Grid>
						))}
				</Grid>
			</CardContent>
		</Card>
	);
};

export default CustomerInfoCard;
