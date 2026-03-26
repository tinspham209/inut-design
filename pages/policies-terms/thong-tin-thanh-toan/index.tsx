import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { usePrimaryBankInfo } from "@/hooks/usePrimaryBankInfo";
import { NextPageWithLayout } from "@/models/common";
import {
	COLOR_CODE,
	trackContactClick,
	trackEvent,
	trackPhoneClick,
	trackUmamiEvent,
} from "@/utils";
import {
	AccountBalanceOutlined,
	ContactSupportOutlined,
	LocalShippingOutlined,
	WarningAmberOutlined,
} from "@mui/icons-material";
import {
	Box,
	Breadcrumbs,
	CircularProgress,
	Container,
	Grid,
	Icon,
	Link as MuiLink,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useRef } from "react";

const PAGE_PATH = "/policies-terms/thong-tin-thanh-toan";
const PAGE_TITLE = "Hướng dẫn thanh toán";

const PaymentInfoPage: NextPageWithLayout = () => {
	const hasTrackedRef = useRef(false);
	const { data: bankInfo, isLoading: loadingBankInfo } = usePrimaryBankInfo(true);

	useEffect(() => {
		if (hasTrackedRef.current) return;
		hasTrackedRef.current = true;

		trackEvent("payment_info_view", {
			category: "engagement",
			label: "payment_info_page",
			page_path: PAGE_PATH,
			page_title: PAGE_TITLE,
		});
		trackUmamiEvent("payment_info_view", { pagePath: PAGE_PATH });
	}, []);

	const paymentMethods = [
		{
			title: "Thanh toán khi nhận hàng (COD)",
			description: "Áp dụng tùy theo khu vực giao hàng và từng đơn hàng cụ thể.",
			icon: LocalShippingOutlined,
		},
		{
			title: "Chuyển khoản qua tài khoản ngân hàng",
			description: (
				<>
					Khách hàng có thể thanh toán qua chuyển khoản theo thông tin bên dưới hoặc quét mã QR
					thanh toán của INUT để chuyển khoản nhanh và thuận tiện hơn.
					<Box
						sx={{
							mt: 2,
							p: 2,
							bgcolor: "rgba(0,0,0,0.02)",
							borderRadius: 2,
							border: `1px solid ${COLOR_CODE.BORDER}`,
							position: "relative",
							minHeight: 120,
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
						}}
					>
						{loadingBankInfo ? (
							<Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
								<CircularProgress size={24} />
							</Box>
						) : bankInfo ? (
							<>
								<Typography
									variant="body2"
									sx={{ mb: 1.5, display: "flex", flexWrap: "wrap", columnGap: 1 }}
								>
									<strong>Ngân hàng:</strong>{" "}
									<span>
										{bankInfo.bankName} ({bankInfo.bankShortName})
									</span>
								</Typography>
								<Typography
									variant="body2"
									sx={{ mb: 1.5, display: "flex", flexWrap: "wrap", columnGap: 1 }}
								>
									<strong>Chủ tài khoản:</strong> <span>{bankInfo.accountHolderName}</span>
								</Typography>
								<Typography
									variant="body2"
									sx={{ mb: 1.5, display: "flex", flexWrap: "wrap", columnGap: 1 }}
								>
									<strong>Số tài khoản:</strong>{" "}
									<Box component="span" sx={{ color: COLOR_CODE.PRIMARY, fontWeight: 700 }}>
										{bankInfo.accountNumber}
									</Box>
								</Typography>
								<Typography
									variant="body2"
									sx={{ display: "flex", flexWrap: "wrap", columnGap: 1 }}
								>
									<strong>Nội dung thanh toán:</strong> <span>Số điện thoại / Mã đơn hàng</span>
								</Typography>
							</>
						) : (
							<Typography variant="body2" color="text.secondary" fontStyle="italic">
								Vui lòng liên hệ hotline để nhận thông tin chuyển khoản.
							</Typography>
						)}
					</Box>
				</>
			),
			icon: AccountBalanceOutlined,
		},
	];

	return (
		<Box component="section" bgcolor="secondary.dark" pt={4} pb={10}>
			<Seo
				data={{
					title: `${PAGE_TITLE} - INUT Design`,
					description:
						"Hướng dẫn các phương thức thanh toán an toàn và tiện lợi khi mua sắm tại INUT Design.",
					url: `https://inutdesign.com${PAGE_PATH}`,
					thumbnailUrl: "/branding/ogImage.jpg",
				}}
			/>
			<Container maxWidth="md">
				<Breadcrumbs sx={{ mb: 4 }}>
					<Link href="/" passHref>
						<MuiLink color="inherit" underline="hover">
							Trang chủ
						</MuiLink>
					</Link>
					<Link href="/policies-terms" passHref>
						<MuiLink color="inherit" underline="hover">
							Chính sách và Điều khoản
						</MuiLink>
					</Link>
					<Typography color="text.primary">{PAGE_TITLE}</Typography>
				</Breadcrumbs>

				<Box mb={6} textAlign="center">
					<Typography variant="h3" component="h1" fontWeight="800" gutterBottom>
						{PAGE_TITLE}
					</Typography>
					<Typography variant="subtitle1" color="text.secondary">
						Các phương thức thanh toán INUT Design hỗ trợ
					</Typography>
				</Box>

				<Grid container spacing={{ xs: 2.5, md: 3 }} alignItems="stretch">
					{/* Cột trái: Các phương thức thanh toán */}
					<Grid item xs={12} md={7} sx={{ display: "flex" }}>
						<Stack spacing={{ xs: 2.5, md: 3 }} sx={{ flexGrow: 1 }}>
							{paymentMethods.map((method, index) => (
								<Paper
									key={index}
									elevation={0}
									sx={{
										p: { xs: 2.5, md: 3 },
										borderRadius: 3,
										border: `1px solid ${COLOR_CODE.BORDER}`,
										transition: "transform 0.2s ease, box-shadow 0.2s ease",
										"&:hover": {
											transform: "translateY(-4px)",
											boxShadow: "0 12px 24px -10px rgba(0,0,0,0.08)",
											borderColor: COLOR_CODE.PRIMARY,
										},
									}}
								>
									<Stack direction="row" spacing={2.5} alignItems="flex-start">
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												p: 1.5,
												borderRadius: 2,
												bgcolor: "rgba(225, 97, 46, 0.08)",
												color: COLOR_CODE.PRIMARY,
												flexShrink: 0,
											}}
										>
											<Icon component={method.icon} sx={{ fontSize: 26 }} />
										</Box>
										<Box sx={{ mt: 0.5, flexGrow: 1 }}>
											<Typography
												variant="subtitle1"
												color="text.primary"
												sx={{ mb: 1, fontWeight: 700, lineHeight: 1.3 }}
											>
												{method.title}
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary"
												sx={{ lineHeight: 1.6 }}
												component="div"
											>
												{method.description}
											</Typography>
										</Box>
									</Stack>
								</Paper>
							))}

							{/* Lưu ý Section */}
							<Paper
								elevation={0}
								sx={{
									p: { xs: 2.5, md: 3 },
									borderRadius: 3,
									border: `1px solid ${COLOR_CODE.BORDER}`,
									bgcolor: "rgba(244, 67, 54, 0.03)",
									flexGrow: 1,
								}}
							>
								<Stack direction="row" spacing={2.5} alignItems="flex-start">
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											p: 1.5,
											borderRadius: 2,
											bgcolor: "rgba(244, 67, 54, 0.1)",
											color: "#d32f2f",
											flexShrink: 0,
										}}
									>
										<WarningAmberOutlined sx={{ fontSize: 26 }} />
									</Box>
									<Box sx={{ mt: 0.5 }}>
										<Typography
											variant="subtitle1"
											sx={{ mb: 1, fontWeight: 700, color: "#d32f2f" }}
										>
											Lưu ý quan trọng
										</Typography>
										<Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
											Đối với các đơn hàng thanh toán trước, khách hàng vui lòng kiểm tra kỹ thông
											tin người nhận, số tiền và nội dung chuyển khoản trước khi thanh toán để đảm
											bảo giao dịch chính xác.
										</Typography>
									</Box>
								</Stack>
							</Paper>
						</Stack>
					</Grid>

					{/* Cột phải: QR Code & Contact */}
					<Grid item xs={12} md={5} sx={{ display: "flex" }}>
						<Stack spacing={{ xs: 2.5, md: 3 }} sx={{ flexGrow: 1 }}>
							<Paper
								elevation={0}
								sx={{
									p: { xs: 2.5, md: 3 },
									borderRadius: 3,
									border: `1px solid ${COLOR_CODE.BORDER}`,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									textAlign: "center",
									flexGrow: 1,
								}}
							>
								<Typography variant="subtitle1" fontWeight="700" mb={3} color="text.primary">
									Quét mã QR để thanh toán nhanh
								</Typography>
								{loadingBankInfo ? (
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											minHeight: 200,
											width: "100%",
										}}
									>
										<CircularProgress />
									</Box>
								) : bankInfo?.image ? (
									<Box
										component="img"
										src={urlFor(bankInfo.image).width(400).url()}
										alt="QR Payment INUT Design"
										sx={{
											width: "100%",
											height: "auto",
											maxWidth: 300,
											objectFit: "contain",
										}}
									/>
								) : (
									<Box
										component="img"
										src="/policies-terms/thong-tin-thanh-toan/qr-payment.png"
										alt="QR Payment INUT Design"
										sx={{
											width: "100%",
											height: "100%",
											objectFit: "contain",
										}}
									/>
								)}
								<Typography
									variant="caption"
									color="text.secondary"
									mt={3}
									display="block"
									sx={{ px: 2 }}
								>
									Mở ứng dụng ngân hàng hoặc ví điện tử có hỗ trợ VietQR để quét mã
								</Typography>
							</Paper>

							{/* Liên hệ hỗ trợ */}
							<Paper
								elevation={0}
								sx={{
									p: { xs: 2.5, md: 3 },
									borderRadius: 3,
									border: `1px solid ${COLOR_CODE.BORDER}`,
									transition: "transform 0.2s ease, box-shadow 0.2s ease",
									"&:hover": {
										transform: "translateY(-4px)",
										boxShadow: "0 12px 24px -10px rgba(0,0,0,0.08)",
										borderColor: COLOR_CODE.PRIMARY,
									},
								}}
							>
								<Stack direction="row" spacing={2} alignItems="center" mb={2.5}>
									<Box
										sx={{
											bgcolor: "rgba(225, 97, 46, 0.08)",
											p: 1,
											borderRadius: 1.5,
											display: "flex",
										}}
									>
										<ContactSupportOutlined sx={{ color: COLOR_CODE.PRIMARY, fontSize: 20 }} />
									</Box>
									<Typography variant="subtitle1" fontWeight="700">
										Mọi thắc mắc vui lòng liên hệ
									</Typography>
								</Stack>
								<Stack spacing={2} sx={{ wordBreak: "break-word" }}>
									<Box>
										<Typography
											variant="caption"
											color="text.secondary"
											fontWeight={700}
											sx={{ textTransform: "uppercase", display: "block", mb: 0.5 }}
										>
											Hotline hỗ trợ
										</Typography>
										<Typography variant="body2" fontWeight={500}>
											<MuiLink
												href="tel:0792359996"
												onClick={() => trackPhoneClick()}
												color={COLOR_CODE.PRIMARY}
												sx={{ textDecoration: "none" }}
											>
												0792 359 996
											</MuiLink>
											{" - "}
											<MuiLink
												href="tel:0327124321"
												onClick={() => trackPhoneClick()}
												color={COLOR_CODE.PRIMARY}
												sx={{ textDecoration: "none" }}
											>
												0327 124 321
											</MuiLink>
										</Typography>
									</Box>

									<Box>
										<Typography
											variant="caption"
											color="text.secondary"
											fontWeight={700}
											sx={{ textTransform: "uppercase", display: "block", mb: 0.5 }}
										>
											Email
										</Typography>
										<Typography variant="body2" fontWeight={500}>
											<MuiLink
												href="mailto:inutstudio.dn@gmail.com"
												onClick={() => trackContactClick("email")}
												color="inherit"
												underline="hover"
											>
												inutstudio.dn@gmail.com
											</MuiLink>
										</Typography>
									</Box>

									<Box>
										<Typography
											variant="caption"
											color="text.secondary"
											fontWeight={700}
											sx={{ textTransform: "uppercase", display: "block", mb: 0.5 }}
										>
											Địa chỉ
										</Typography>
										<Typography
											variant="body2"
											color="text.primary"
											fontWeight={500}
											sx={{ lineHeight: 1.5 }}
										>
											K574/5 Ông Ích Khiêm, Tổ 22, Phường Hải Châu, Thành phố Đà Nẵng
										</Typography>
									</Box>
								</Stack>
							</Paper>
						</Stack>
					</Grid>
				</Grid>

				<Box mt={8} textAlign="center" maxWidth="600px" mx="auto">
					<Typography variant="body1" color="text.secondary" fontWeight={500} gutterBottom>
						CẢM ƠN QUÝ KHÁCH HÀNG ĐÃ ỦNG HỘ INUT DESIGN!
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						fontStyle="italic"
						sx={{ opacity: 0.8 }}
					>
						Nếu quý anh/chị đã lựa chọn phương thức thanh toán hoặc đã hoàn tất thanh toán, INUT
						chúc quý anh/chị có trải nghiệm mua hàng thật hài lòng.
					</Typography>
				</Box>
			</Container>
		</Box>
	);
};

PaymentInfoPage.Layout = MainLayout;

export default PaymentInfoPage;
