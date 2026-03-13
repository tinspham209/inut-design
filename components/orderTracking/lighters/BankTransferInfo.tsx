import {
	Card,
	CardContent,
	Stack,
	Typography,
	Alert,
	Grid,
	Paper,
	Divider,
	Box,
	Button,
	Link as MuiLink,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React from "react";
import { formatPrice } from "@/utils/priceCalculator";
import { urlFor } from "@/api-client/sanity-client";
import { toast } from "react-hot-toast";

interface BankInfo {
	bankName: string;
	bankShortName: string;
	accountNumber: string;
	accountHolderName: string;
	image?: any;
}

interface BankTransferInfoProps {
	bankInfo: BankInfo;
	totalAmount: number;
	customerPhone: string;
}

const BankTransferInfo: React.FC<BankTransferInfoProps> = ({
	bankInfo,
	totalAmount,
	customerPhone,
}) => {
	const handleCopyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		toast.success(`Đã sao chép ${label}!`);
	};

	return (
		<Card
			sx={{
				border: "2px solid",
				borderColor: "primary.main",
				bgcolor: "primary.light",
				"@media print": {
					borderColor: "#000",
				},
			}}
		>
			<CardContent>
				<Stack direction="row" alignItems="center" spacing={1} mb={2}>
					<AccountBalanceIcon color="primary" />
					<Typography variant="h6" fontWeight="bold" color="primary.dark">
						Thông tin chuyển khoản
					</Typography>
				</Stack>
				<Alert severity="info" sx={{ mb: 3 }}>
					<Typography variant="body2" fontWeight="bold" gutterBottom>
						📝 Hướng dẫn thanh toán:
					</Typography>
					<Typography variant="body2" component="div">
						1. Chuyển khoản đúng số tiền: <strong>{formatPrice(totalAmount)}</strong>
						<br />
						2. Nội dung chuyển khoản: <strong>{customerPhone}</strong> (Số điện thoại của bạn)
						<br />
						3. Gửi ảnh chụp màn hình chuyển khoản qua Zalo/Facebook: <strong>0123-456-789</strong>
						<br />
						4. Chúng tôi sẽ xác nhận và xử lý đơn hàng ngay sau khi nhận được thanh toán
					</Typography>
				</Alert>
				<Grid container spacing={3}>
					{bankInfo.image && (
						<Grid item xs={12} md={5}>
							<Paper elevation={3} sx={{ p: 2, textAlign: "center", bgcolor: "white" }}>
								<Typography variant="subtitle2" fontWeight="bold" gutterBottom>
									Quét mã QR để thanh toán
								</Typography>
								<Box sx={{ mx: "auto", mt: 1, textAlign: "center" }}>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={urlFor(bankInfo.image).width(400).url()}
										alt="QR Code"
										style={{
											width: "100%",
											maxWidth: "300px",
											height: "auto",
											display: "block",
											margin: "0 auto",
										}}
									/>
								</Box>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ mt: 1, display: "block" }}
								>
									Sử dụng app ngân hàng để quét mã
								</Typography>
							</Paper>
						</Grid>
					)}
					<Grid item xs={12} md={bankInfo.image ? 7 : 12}>
						<Paper elevation={2} sx={{ p: 2.5, bgcolor: "white", height: "100%" }}>
							<Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary.dark">
								Hoặc chuyển khoản thủ công:
							</Typography>
							<Stack spacing={2} mt={2}>
								<Box>
									<Typography variant="caption" color="text.secondary">
										Ngân hàng:
									</Typography>
									<Stack direction="row" alignItems="center" justifyContent="space-between">
										<Typography variant="body1" fontWeight="bold">
											{bankInfo.bankName} ({bankInfo.bankShortName})
										</Typography>
									</Stack>
								</Box>
								<Divider />
								<Box>
									<Typography variant="caption" color="text.secondary">
										Số tài khoản:
									</Typography>
									<Stack
										direction="row"
										alignItems="center"
										justifyContent="space-between"
										spacing={1}
									>
										<Typography variant="h6" fontWeight="bold" color="primary.main">
											{bankInfo.accountNumber}
										</Typography>
										<Button
											size="small"
											startIcon={<ContentCopyIcon />}
											onClick={() => handleCopyToClipboard(bankInfo.accountNumber, "số tài khoản")}
											sx={{ minWidth: "auto" }}
										>
											Sao chép
										</Button>
									</Stack>
								</Box>
								<Divider />
								<Box>
									<Typography variant="caption" color="text.secondary">
										Chủ tài khoản:
									</Typography>
									<Stack
										direction="row"
										alignItems="center"
										justifyContent="space-between"
										spacing={1}
									>
										<Typography variant="body1" fontWeight="bold">
											{bankInfo.accountHolderName}
										</Typography>
										<Button
											size="small"
											startIcon={<ContentCopyIcon />}
											onClick={() =>
												handleCopyToClipboard(bankInfo.accountHolderName, "tên chủ tài khoản")
											}
											sx={{ minWidth: "auto" }}
										>
											Sao chép
										</Button>
									</Stack>
								</Box>
								<Divider />
								<Box>
									<Typography variant="caption" color="text.secondary">
										Số tiền cần chuyển:
									</Typography>
									<Stack
										direction="row"
										alignItems="center"
										justifyContent="space-between"
										spacing={1}
									>
										<Typography variant="h6" fontWeight="bold" color="error.main">
											{formatPrice(totalAmount)}
										</Typography>
										<Button
											size="small"
											startIcon={<ContentCopyIcon />}
											onClick={() => handleCopyToClipboard(totalAmount.toString(), "số tiền")}
											sx={{ minWidth: "auto" }}
										>
											Sao chép
										</Button>
									</Stack>
								</Box>
								<Divider />
								<Box>
									<Typography variant="caption" color="text.secondary">
										Nội dung chuyển khoản:
									</Typography>
									<Stack
										direction="row"
										alignItems="center"
										justifyContent="space-between"
										spacing={1}
									>
										<Typography variant="body1" fontWeight="bold">
											{customerPhone}
										</Typography>
										<Button
											size="small"
											startIcon={<ContentCopyIcon />}
											onClick={() => handleCopyToClipboard(customerPhone, "nội dung chuyển khoản")}
											sx={{ minWidth: "auto" }}
										>
											Sao chép
										</Button>
									</Stack>
									<Typography
										variant="caption"
										color="error.main"
										sx={{ mt: 0.5, display: "block" }}
									>
										⚠️ Vui lòng ghi đúng nội dung để chúng tôi xác nhận nhanh nhất
									</Typography>
								</Box>
							</Stack>
						</Paper>
					</Grid>
				</Grid>
				<Alert severity="warning" sx={{ mt: 3 }}>
					<Typography variant="body2">
						<strong>Lưu ý:</strong> Nếu bạn đang cần gấp, sau khi chuyển khoản, vui lòng chụp ảnh
						màn hình và gửi cho chúng tôi qua Zalo (0327 124 321) /{" "}
						<MuiLink href="https://www.facebook.com/inutdesign" target="_blank">
							Facebook: INUT Design
						</MuiLink>{" "}
						để được xác nhận nhanh chóng. Đơn hàng sẽ được xử lý ngay sau khi thanh toán được xác
						nhận.
					</Typography>
				</Alert>
			</CardContent>
		</Card>
	);
};

export default BankTransferInfo;
