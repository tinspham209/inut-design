import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import {
	COLOR_CODE,
	trackContactClick,
	trackEvent,
	trackPhoneClick,
	trackUmamiEvent,
	trackZaloClick,
} from "@/utils";
import {
	AccessTimeOutlined,
	CheckCircleOutline,
	GroupOutlined,
	LocationOnOutlined,
	ManageAccountsOutlined,
	ReportProblemOutlined,
	VisibilityOutlined,
} from "@mui/icons-material";
import {
	Box,
	Breadcrumbs,
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

const PAGE_PATH = "/policies-terms/chinh-sach-bao-ve-thong-tin-khach-hang";
const PAGE_TITLE = "Chính sách bảo vệ thông tin cá nhân khách hàng";

const policySections = [
	{
		title: "Mục đích thu thập thông tin",
		content:
			"Chúng tôi thu thập thông tin cá nhân của khách hàng nhằm phục vụ cho quá trình đặt hàng, giao hàng, chăm sóc khách hàng và cung cấp các dịch vụ liên quan.",
		icon: CheckCircleOutline,
	},
	{
		title: "Phạm vi sử dụng thông tin",
		content:
			"Thông tin cá nhân của khách hàng chỉ được sử dụng trong nội bộ công ty và không chia sẻ cho bên thứ ba, ngoại trừ những trường hợp cần thiết để hoàn tất giao dịch (ví dụ: cung cấp thông tin cho đơn vị vận chuyển để giao hàng).",
		icon: VisibilityOutlined,
	},
	{
		title: "Thời gian lưu trữ thông tin",
		content:
			"Thông tin cá nhân của khách hàng sẽ được lưu trữ trong vòng 02 năm kể từ lần giao dịch cuối cùng, hoặc cho đến khi khách hàng có yêu cầu xóa thông tin.",
		icon: AccessTimeOutlined,
	},
	{
		title: "Tiếp cận thông tin",
		content:
			"Chỉ những nhân viên của INUT DESIGN được phép tiếp cận thông tin cá nhân của khách hàng. Trong một số trường hợp cần thiết, thông tin có thể được cung cấp cho các đối tác vận chuyển quốc tế nhằm hoàn tất quá trình giao hàng.",
		icon: GroupOutlined,
	},
	{
		title: "Địa chỉ quản lý thông tin",
		content: (
			<>
				Địa chỉ: K574/5 Ông Ích Khiêm, Tổ 22, Phường Hải Châu, Thành phố Đà Nẵng
				<br />
				Email:{" "}
				<MuiLink
					href="mailto:inutstudio.dn@gmail.com"
					onClick={() => trackContactClick("email")}
					sx={{ fontWeight: 600, color: COLOR_CODE.PRIMARY }}
				>
					inutstudio.dn@gmail.com
				</MuiLink>
				<Box
					component="span"
					sx={{ fontSize: "0.9em", color: "text.secondary", mt: 0.5, display: "inline-block" }}
				>
					Khách hàng có thể liên hệ qua email trên để tìm hiểu về hoạt động thu thập và xử lý thông
					tin liên quan đến dữ liệu cá nhân của mình.
				</Box>
			</>
		),
		icon: LocationOnOutlined,
	},
	{
		title: "Chỉnh sửa dữ liệu cá nhân",
		content:
			"Khách hàng có thể liên hệ qua email để chỉnh sửa thông tin cá nhân hoặc được hỗ trợ kịp thời.",
		icon: ManageAccountsOutlined,
	},
	{
		title: "Tiếp nhận và giải quyết khiếu nại",
		content: (
			<>
				Trong trường hợp có khiếu nại liên quan đến việc sử dụng thông tin cá nhân sai mục đích,
				khách hàng có thể gửi khiếu nại thông qua:
				<br />
				<Box component="span" sx={{ display: "inline-block", mt: 0.5 }}>
					Hotline:{" "}
					<MuiLink
						href="tel:0327124321"
						onClick={trackPhoneClick}
						sx={{ fontWeight: 600, color: COLOR_CODE.PRIMARY }}
					>
						0327124321
					</MuiLink>
					<br />
					Zalo:{" "}
					<MuiLink
						href="https://zalo.me/0327124321"
						onClick={trackZaloClick}
						sx={{ fontWeight: 600, color: COLOR_CODE.PRIMARY }}
					>
						0327124321
					</MuiLink>
					<br />
					Email:{" "}
					<MuiLink
						href="mailto:inutstudio.dn@gmail.com"
						onClick={() => trackContactClick("email")}
						sx={{ fontWeight: 600, color: COLOR_CODE.PRIMARY }}
					>
						inutstudio.dn@gmail.com
					</MuiLink>
				</Box>
			</>
		),
		icon: ReportProblemOutlined,
	},
];

const PrivacyPolicyPage: NextPageWithLayout = () => {
	const hasTrackedRef = useRef(false);

	useEffect(() => {
		if (hasTrackedRef.current) return;
		hasTrackedRef.current = true;

		trackEvent("privacy_policy_view", {
			category: "engagement",
			label: "privacy_policy_page",
			page_path: PAGE_PATH,
			page_title: PAGE_TITLE,
		});
		trackUmamiEvent("privacy_policy_view", { pagePath: PAGE_PATH });
	}, []);

	return (
		<Box component="section" bgcolor="secondary.dark" pt={4} pb={10}>
			<Seo
				data={{
					title: `${PAGE_TITLE} - INUT Design`,
					description: "Chính sách bảo vệ thông tin cá nhân khách hàng của INUT DESIGN.",
					url: `https://inutdesign.com${PAGE_PATH}`,
					thumbnailUrl: "/branding/ogImage.jpg",
				}}
			/>
			<Container maxWidth="lg">
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
						BẢO VỆ THÔNG TIN CÁ NHÂN
					</Typography>
					<Typography variant="subtitle1" color="text.secondary">
						Chính sách bảo vệ thông tin cá nhân khách hàng của INUT DESIGN
					</Typography>
				</Box>

				<Grid container spacing={{ xs: 2.5, md: 3 }}>
					{policySections.map((info, index) => (
						<Grid item xs={12} md={index > 5 ? 12 : 6} key={index}>
							<Paper
								elevation={0}
								sx={{
									p: { xs: 2.5, md: 3 },
									height: "100%",
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
										<Icon component={info.icon} sx={{ fontSize: 26 }} />
									</Box>
									<Box sx={{ mt: 0.5 }}>
										<Typography
											variant="caption"
											color="text.secondary"
											sx={{
												mb: 0.75,
												textTransform: "uppercase",
												letterSpacing: 0.5,
												fontWeight: 700,
												display: "block",
											}}
										>
											{info.title}
										</Typography>
										<Typography
											variant="body1"
											sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}
										>
											{info.content}
										</Typography>
									</Box>
								</Stack>
							</Paper>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

PrivacyPolicyPage.Layout = MainLayout;

export default PrivacyPolicyPage;
