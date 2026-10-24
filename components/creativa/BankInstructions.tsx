/* eslint-disable camelcase */
import {
	Alert,
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Grid,
	Paper,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import toast from "react-hot-toast";
import { sanityImageUrl } from "@/api-client/sanity-image";
import { vietqrService } from "@/lib/vietqr";
import type { CreativaBank } from "@/models/creativa";
import { formatCreativaPrice } from "@/utils/creativa/contracts";
import { trackCreativa } from "@/utils/creativa/analytics";

type CopyTarget = "bank_account" | "bank_owner" | "amount" | "transfer_content";

function CopyableBankRow({
	label,
	value,
	target,
	disabled,
	onCopy,
}: {
	label: string;
	value: string;
	target: CopyTarget;
	disabled: boolean;
	onCopy: (value: string, label: string, target: CopyTarget) => void;
}) {
	return (
		<Box>
			<Typography variant="caption" color="text.secondary">
				{label}
			</Typography>
			<Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
				<Typography
					variant="body1"
					fontWeight="bold"
					color={target === "amount" || target === "bank_account" ? "primary.dark" : "text.primary"}
					sx={{ minWidth: 0, overflowWrap: "anywhere" }}
				>
					{value}
				</Typography>
				<Button
					size="small"
					disabled={disabled}
					startIcon={<ContentCopyOutlinedIcon />}
					onClick={() =>
						void onCopy(value, label.replace(/:$/, "").toLocaleLowerCase("vi-VN"), target)
					}
					sx={{ minWidth: "auto", flexShrink: 0 }}
				>
					Sao chép
				</Button>
			</Stack>
		</Box>
	);
}

export function CreativaBankInstructions({
	bank,
	amount,
	transferContent,
	disabled = false,
}: {
	bank: CreativaBank;
	amount: number;
	transferContent: string;
	disabled?: boolean;
}) {
	const [imageFailed, setImageFailed] = useState(false);
	const [vietQrUrl, setVietQrUrl] = useState<string | null>(null);
	console.log("🫁 ~ CreativaBankInstructions ~ vietQrUrl:", vietQrUrl);
	const [vietQrImageFailed, setVietQrImageFailed] = useState(false);
	const [showCmsQr, setShowCmsQr] = useState(false);
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
	const [manualExpanded, setManualExpanded] = useState<boolean | null>(null);
	const isManualExpanded = manualExpanded ?? isDesktop;
	const [qrStatus, setQrStatus] = useState<"loading" | "ready" | "fallback">("loading");

	useEffect(() => {
		let active = true;
		setVietQrUrl(null);
		setVietQrImageFailed(false);
		setImageFailed(false);
		setQrStatus("loading");

		if (
			!bank.bankCode?.trim() ||
			!bank.accountNumber.trim() ||
			!bank.accountName.trim() ||
			!transferContent.trim() ||
			!Number.isSafeInteger(amount) ||
			amount < 0
		) {
			setQrStatus("fallback");
			return () => {
				active = false;
			};
		}

		void vietqrService
			.generateQR({
				bankCode: bank.bankCode.trim(),
				accountNumber: bank.accountNumber.trim(),
				amount,
				description: transferContent.trim(),
				accountName: bank.accountName.trim(),
			})
			.then((result) => {
				if (!active) return;
				if (result.error || !result.qrCode) {
					console.error("VietQR could not generate the payment QR.", result.error);
					setQrStatus("fallback");
					return;
				}
				setVietQrUrl(result.qrCode);
				setQrStatus("ready");
			})
			.catch((error: unknown) => {
				if (!active) return;
				console.error("VietQR could not generate the payment QR.", error);
				setQrStatus("fallback");
			});

		return () => {
			active = false;
		};
	}, [amount, bank.accountName, bank.accountNumber, bank.bankCode, transferContent]);

	async function copyValue(value: string, label: string, target: CopyTarget) {
		try {
			await navigator.clipboard.writeText(value);
			toast.success(`Đã sao chép ${label}.`, { id: "creativa-copy", duration: 2500 });
			trackCreativa("order_reference_copy", { target, outcome: "success" });
		} catch {
			toast.error(`Không thể tự sao chép ${label}. Hãy chọn nội dung để sao chép thủ công.`, {
				id: "creativa-copy",
				duration: 8000,
			});
			trackCreativa("order_reference_copy", { target, outcome: "error" });
		}
	}

	const useVietQr = Boolean(vietQrUrl && !vietQrImageFailed && !showCmsQr);
	const cmsQrUrl = bank.image && !imageFailed ? sanityImageUrl(bank.image, "small") : null;
	const qrImageUrl = useVietQr ? vietQrUrl : cmsQrUrl;

	return (
		<Card
			sx={{
				border: "2px solid",
				borderColor: "primary.main",
				bgcolor: "primary.main",
				"@media print": { borderColor: "#000" },
			}}
		>
			<CardContent sx={{ p: { xs: 1.5, sm: 2 }, "&:last-child": { pb: { xs: 1.5, sm: 2 } } }}>
				<Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
					<AccountBalanceIcon sx={{ color: "common.white" }} />
					<Typography variant="h6" fontWeight="bold" sx={{ color: "common.white" }}>
						Thông tin chuyển khoản
					</Typography>
				</Stack>
				<Alert severity="info" sx={{ mb: 1.5 }}>
					<Typography variant="body2" fontWeight="bold" gutterBottom>
						Hướng dẫn thanh toán:
					</Typography>
					<Typography variant="body2" component="div">
						1. Chuyển khoản đúng số tiền: <strong>{formatCreativaPrice(amount)}</strong>
						<br />
						2. Nội dung chuyển khoản: <strong>{transferContent}</strong>
						<br />
						3. Vui lòng kiểm tra đúng tài khoản, số tiền và nội dung trước khi xác nhận.
						<br />
						4. Đơn hàng được xử lý sau khi thanh toán được xác nhận.
					</Typography>
					{bank.transferInstructions && (
						<Typography variant="body2" sx={{ mt: 1 }}>
							{bank.transferInstructions}
						</Typography>
					)}
				</Alert>
				<Grid container spacing={1.5}>
					{qrImageUrl ? (
						<Grid item xs={12} md={5}>
							<Paper elevation={2} sx={{ p: 1.5, textAlign: "center", bgcolor: "white" }}>
								<Typography variant="subtitle2" fontWeight="bold" gutterBottom>
									Quét mã QR để thanh toán
								</Typography>
								<Box sx={{ mx: "auto", mt: 0.5, maxWidth: 300 }}>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={qrImageUrl}
										alt={`QR thanh toán ${bank.bankName}`}
										width={300}
										height={300}
										loading="lazy"
										referrerPolicy="no-referrer"
										style={{
											width: "100%",
											maxWidth: 300,
											height: "auto",
											display: "block",
											margin: "0 auto",
										}}
										onError={() => {
											if (useVietQr) {
												console.error("The generated VietQR image could not be loaded.");
												setVietQrImageFailed(true);
												setQrStatus("fallback");
											} else {
												console.error("The CMS fallback QR image could not be loaded.");
												setImageFailed(true);
											}
										}}
									/>
								</Box>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ mt: 0.5, display: "block" }}
								>
									Sử dụng ứng dụng ngân hàng để quét mã
								</Typography>
								{useVietQr && cmsQrUrl && (
									<Button
										size="small"
										onClick={() => {
											setShowCmsQr(true);
											setQrStatus("fallback");
											trackCreativa("cta_click", {
												surface: "order_tracking",
												cta_name: "switch_to_cms_qr",
											});
										}}
										sx={{ mt: 0.5, textTransform: "none" }}
									>
										Không quét được mã này? Thử quét mã chuyển thủ công nhé
									</Button>
								)}
								{qrStatus === "fallback" && (
									<Typography
										variant="caption"
										color="text.secondary"
										sx={{ mt: 0.5, display: "block" }}
									>
										Đang sử dụng mã QR dự phòng từ CMS.
									</Typography>
								)}
							</Paper>
						</Grid>
					) : qrStatus === "loading" ? (
						<Grid item xs={12} md={5}>
							<Paper elevation={2} sx={{ p: 1.5, bgcolor: "white" }}>
								<Skeleton variant="text" width="70%" sx={{ mx: "auto" }} />
								<Skeleton variant="rounded" height={300} sx={{ mt: 1 }} />
							</Paper>
						</Grid>
					) : (
						<Grid item xs={12} md={5}>
							<Alert severity="warning">
								Không thể tải mã QR. Vui lòng dùng thông tin chuyển khoản thủ công.
							</Alert>
						</Grid>
					)}
					<Grid item xs={12} md={7}>
						<Accordion
							expanded={isManualExpanded}
							onChange={(_, expanded) => {
								setManualExpanded(expanded);
								if (expanded)
									trackCreativa("cta_click", {
										surface: "order_tracking",
										cta_name: "manual_transfer_details",
									});
							}}
							elevation={2}
							sx={{
								m: 0,
								bgcolor: "white",
								borderRadius: 1,
								"&:before": { display: "none" },
								"&.Mui-expanded": { m: 0 },
							}}
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="creativa-manual-transfer-content"
								id="creativa-manual-transfer-header"
								sx={{ minHeight: 48, "&.Mui-expanded": { minHeight: 48 } }}
							>
								<Typography variant="subtitle2" fontWeight="bold" color="primary.dark">
									Hoặc chuyển khoản thủ công
								</Typography>
							</AccordionSummary>
							<AccordionDetails
								id="creativa-manual-transfer-content"
								sx={{ pt: 0, px: { xs: 2, sm: 2.5 }, pb: 2 }}
							>
								<Stack spacing={1}>
									<Box>
										<Typography variant="caption" color="text.secondary">
											Ngân hàng:
										</Typography>
										<Typography variant="body1" fontWeight="bold">
											{bank.bankName}
											{bank.bankShortName ? ` (${bank.bankShortName})` : ""}
										</Typography>
									</Box>
									<Divider />
									<CopyableBankRow
										label="Số tài khoản:"
										value={bank.accountNumber}
										target="bank_account"
										disabled={disabled}
										onCopy={copyValue}
									/>
									<Divider />
									<CopyableBankRow
										label="Chủ tài khoản:"
										value={bank.accountName}
										target="bank_owner"
										disabled={disabled}
										onCopy={copyValue}
									/>
									<Divider />
									<CopyableBankRow
										label="Số tiền cần chuyển:"
										value={formatCreativaPrice(amount)}
										target="amount"
										disabled={disabled}
										onCopy={() => void copyValue(String(amount), "số tiền cần chuyển", "amount")}
									/>
									<Divider />
									<CopyableBankRow
										label="Nội dung chuyển khoản:"
										value={transferContent}
										target="transfer_content"
										disabled={disabled}
										onCopy={copyValue}
									/>
									<Typography variant="caption" color="error.main">
										Vui lòng ghi đúng nội dung chuyển khoản để chúng tôi xác nhận nhanh nhất.
									</Typography>
								</Stack>
							</AccordionDetails>
						</Accordion>
					</Grid>
				</Grid>
				<Alert severity="warning" sx={{ mt: 1.5 }}>
					<Typography variant="body2">
						<strong>Lưu ý:</strong> Vui lòng kiểm tra thông tin trước khi chuyển khoản. Đơn hàng chỉ
						được xử lý sau khi thanh toán được xác nhận.
					</Typography>
				</Alert>
			</CardContent>
		</Card>
	);
}
