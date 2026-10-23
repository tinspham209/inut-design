import { Alert, Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { sanityImageUrl } from "@/api-client/sanity-image";
import type { CreativaBank } from "@/models/creativa";
import { formatCreativaPrice } from "@/utils/creativa/contracts";

export function CreativaBankInstructions({
	bank,
	amount,
	publicId,
}: {
	bank: CreativaBank;
	amount: number;
	publicId: string;
}) {
	const [imageFailed, setImageFailed] = useState(false);
	return (
		<Alert severity="info">
			<Stack gap={1.5}>
				<Typography fontWeight={600}>Thông tin chuyển khoản</Typography>
				<Typography variant="body2">
					{bank.bankName}
					{bank.bankShortName ? ` (${bank.bankShortName})` : ""}
					<br />
					Chủ tài khoản: {bank.accountName}
					<br />
					Số tài khoản:{" "}
					<Box component="span" sx={{ userSelect: "all" }}>
						{bank.accountNumber}
					</Box>
					<br />
					Nội dung:{" "}
					<Box component="span" sx={{ userSelect: "all" }}>
						{publicId}
					</Box>
					<br />
					Số tiền: {formatCreativaPrice(amount)}
				</Typography>
				{bank.image && !imageFailed && (
					<Box sx={{ maxWidth: 240, bgcolor: "white", p: 1 }}>
						<Image
							src={sanityImageUrl(bank.image, "small")}
							alt={`QR hoặc logo ${bank.bankName}`}
							width={240}
							height={240}
							objectFit="contain"
							onError={() => setImageFailed(true)}
						/>
					</Box>
				)}
				{imageFailed && (
					<Typography variant="body2">
						Không tải được ảnh ngân hàng. Hãy dùng thông tin tài khoản bên trên.
					</Typography>
				)}
				{bank.transferInstructions && (
					<Typography variant="body2">{bank.transferInstructions}</Typography>
				)}
				<Typography variant="caption">
					Kiểm tra đúng tài khoản, số tiền và nội dung trước khi chuyển khoản. Đặt hàng không đồng
					nghĩa thanh toán đã được xác nhận.
				</Typography>
			</Stack>
		</Alert>
	);
}
