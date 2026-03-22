import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { COLOR_CODE, trackEvent, trackOutboundClick, trackUmamiEvent } from "@/utils";
import {
	AccountBalanceOutlined,
	BadgeOutlined,
	EmailOutlined,
	LocationOnOutlined,
	PhoneOutlined,
	ReceiptLongOutlined,
} from "@mui/icons-material";
import { Box, Breadcrumbs, Container, Grid, Icon, Link as MuiLink, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useRef } from "react";

const TAX_LINK = "https://masothue.com/0402325801-cong-ty-tnhh-inut-design";
const PAGE_PATH = "/policies-terms/thong-tin-doanh-nghiep";
const PAGE_TITLE = "Thông tin doanh nghiệp";

const businessInfo = [
	{
		title: "Tên đơn vị sở hữu",
		value: "Công ty TNHH INUT DESIGN",
		icon: AccountBalanceOutlined,
	},
	{
		title: "Người đại diện pháp luật",
		value: "Hồ Hữu Ngọc Tâm",
		icon: BadgeOutlined,
	},
	{
		title: "Mã số thuế & Đăng ký kinh doanh",
		value: (
			<>
				0402325801{" "}
				{"("}
				<MuiLink
					href={TAX_LINK}
					target="_blank"
					rel="noopener noreferrer"
					onClick={() => trackOutboundClick(TAX_LINK)}
					sx={{ fontWeight: 600, color: COLOR_CODE.PRIMARY }}
				>
					Tra cứu
				</MuiLink>
				{")"}
				<br />
				<Box component="span" sx={{ fontSize: "0.9em", color: "text.secondary", mt: 0.5, display: "inline-block" }}>
					Cấp ngày 09/03/2026 bởi Sở Tài Chính Thành phố Đà Nẵng, Phòng Doanh Nghiệp và Đăng Ký Kinh Doanh
				</Box>
			</>
		),
		icon: ReceiptLongOutlined,
	},
	{
		title: "Địa chỉ trụ sở",
		value: "K574/5 Ông Ích Khiêm, Tổ 22, Phường Hải Châu, Thành phố Đà Nẵng",
		icon: LocationOnOutlined,
	},
	{
		title: "Số điện thoại liên hệ",
		value: "0327124321",
		icon: PhoneOutlined,
	},
	{
		title: "Email",
		value: "inutstudio.dn@gmail.com",
		icon: EmailOutlined,
	},
];

const CompanyInfoPage: NextPageWithLayout = () => {
	const hasTrackedRef = useRef(false);

	useEffect(() => {
		if (hasTrackedRef.current) return;
		hasTrackedRef.current = true;

		trackEvent("company_info_view", {
			category: "engagement",
			label: "company_info_page",
			page_path: PAGE_PATH,
			page_title: PAGE_TITLE,
		});
		trackUmamiEvent("company_info_view", { pagePath: PAGE_PATH });
	}, []);

	return (
		<Box component="section" bgcolor="secondary.dark" pt={4} pb={10}>
			<Seo
				data={{
					title: `${PAGE_TITLE} - INUT Design`,
					description: "Thông tin pháp lý và liên hệ của Công ty TNHH INUT DESIGN.",
					url: `https://inutdesign.com${PAGE_PATH}`,
					thumbnailUrl: "/branding/ogImage.jpg",
				}}
			/>
			<Container maxWidth="md">
				<Breadcrumbs sx={{ mb: 4 }}>
					<Link href="/" passHref>
						<MuiLink color="inherit" underline="hover">Trang chủ</MuiLink>
					</Link>
					<Link href="/policies-terms" passHref>
						<MuiLink color="inherit" underline="hover">Chính sách và Điều khoản</MuiLink>
					</Link>
					<Typography color="text.primary">{PAGE_TITLE}</Typography>
				</Breadcrumbs>

				<Box mb={6} textAlign="center">
					<Typography variant="h3" component="h1" fontWeight="800" gutterBottom>
						{PAGE_TITLE}
					</Typography>
					<Typography variant="subtitle1" color="text.secondary">
						Thông tin chi tiết về chủ sở hữu website và hồ sơ pháp lý
					</Typography>
				</Box>

				<Grid container spacing={{ xs: 2.5, md: 3 }}>
					{businessInfo.map((info, index) => (
						<Grid item xs={12} sm={index === 2 ? 12 : 6} key={index}>
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
											sx={{ mb: 0.75, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700, display: "block" }}
										>
											{info.title}
										</Typography>
										<Typography
											variant="body1"
											sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}
										>
											{info.value}
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

CompanyInfoPage.Layout = MainLayout;

export default CompanyInfoPage;
