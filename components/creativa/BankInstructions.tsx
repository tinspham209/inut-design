/* eslint-disable camelcase */
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import Image from "next/image";
import { useState } from "react";
import { sanityImageUrl } from "@/api-client/sanity-image";
import type { CreativaBank } from "@/models/creativa";
import { formatCreativaPrice } from "@/utils/creativa/contracts";
import { trackCreativa } from "@/utils/creativa/analytics";

export function CreativaBankInstructions({
	bank,
	amount,
	publicId,
	transferContent,
}: {
	bank: CreativaBank;
	amount: number;
	publicId: string;
	transferContent?: string;
}) {
	const [imageFailed, setImageFailed] = useState(false);
	const [copyNotice, setCopyNotice] = useState<string | null>(null);
	const content = transferContent || publicId;
	async function copyContent() {
		try {
			await navigator.clipboard.writeText(content);
			setCopyNotice("Đã sao chép nội dung chuyển khoản.");
			trackCreativa("order_reference_copy", { target: "transfer_content", outcome: "success" });
		} catch {
			setCopyNotice("Không thể tự sao chép. Hãy chọn nội dung bên trên để sao chép thủ công.");
			trackCreativa("order_reference_copy", { target: "transfer_content", outcome: "error" });
		}
	}
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
					Số tiền: {formatCreativaPrice(amount)}
				</Typography>
				<Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
					<Typography variant="body2" sx={{ minWidth: 0, flex: 1, overflowWrap: "anywhere" }}>
						Nội dung:{" "}
						<Box component="span" sx={{ userSelect: "all" }}>
							{content}
						</Box>
					</Typography>
					<Button
						size="small"
						startIcon={<ContentCopyOutlinedIcon />}
						onClick={() => void copyContent()}
					>
						Sao chép nội dung
					</Button>
				</Stack>
				{copyNotice && (
					<Typography variant="caption" role="status">
						{copyNotice}
					</Typography>
				)}
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
