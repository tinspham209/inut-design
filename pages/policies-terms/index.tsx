import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { COLOR_CODE, trackEvent, trackUmamiEvent } from "@/utils";
import {
	AccountBalanceOutlined,
	AssignmentReturnOutlined,
	GavelOutlined,
	HelpOutlineOutlined,
	PaymentOutlined,
	SecurityOutlined,
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

const PAGE_PATH = "/policies-terms";
const PAGE_TITLE = "Chính sách và Điều khoản";

const policyPages = [
	{
		title: "Thông tin doanh nghiệp",
		description: "Thông tin pháp lý và liên hệ doanh nghiệp",
		url: "/policies-terms/thong-tin-doanh-nghiep",
		icon: AccountBalanceOutlined,
	},
	{
		title: "Thông tin thanh toán",
		description: "Phương thức thanh toán & thông tin chuyển khoản",
		url: "/policies-terms/thong-tin-thanh-toan",
		icon: PaymentOutlined,
	},
	{
		title: "Điều khoản sử dụng",
		description: "Quy định sử dụng website & dịch vụ",
		url: "/policies-terms/dieu-khoan-su-dung",
		icon: GavelOutlined,
	},
	{
		title: "Chính sách bảo mật thông tin",
		description: "Bảo vệ thông tin cá nhân khách hàng",
		url: "/policies-terms/chinh-sach-bao-ve-thong-tin-khach-hang",
		icon: SecurityOutlined,
	},
	{
		title: "Chính sách bảo hành và đổi trả",
		description: "Quy định bảo hành, đổi và hoàn trả sản phẩm",
		url: "/policies-terms/chinh-sach-bao-hanh-doi-tra",
		icon: AssignmentReturnOutlined,
	},
	{
		title: "FAQS - Câu hỏi thường gặp",
		description: "Câu hỏi thường gặp về INUT Design",
		url: "/policies-terms/faqs",
		icon: HelpOutlineOutlined,
	},
];

const PoliciesTermsIndexPage: NextPageWithLayout = () => {
	const hasTrackedRef = useRef(false);

	useEffect(() => {
		if (hasTrackedRef.current) return;
		hasTrackedRef.current = true;

		trackEvent("policies_terms_index_view", {
			category: "engagement",
			label: "policies_terms_index_page",
			page_path: PAGE_PATH,
			page_title: PAGE_TITLE,
		});
		trackUmamiEvent("policies_terms_index_view", { pagePath: PAGE_PATH });
	}, []);

	const handleCardClick = (title: string, url: string) => {
		trackEvent("policies_terms_card_click", {
			category: "engagement",
			label: title,
			page_path: url,
		});
		trackUmamiEvent("policies_terms_card_click", { pagePath: url, label: title });
	};

	return (
		<Box component="section" bgcolor="secondary.dark" pt={4} pb={10}>
			<Seo
				data={{
					title: `${PAGE_TITLE} - INUT Design`,
					description:
						"Tìm hiểu các chính sách, điều khoản sử dụng, thông tin doanh nghiệp và câu hỏi thường gặp tại INUT Design.",
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
					<Typography color="text.primary">{PAGE_TITLE}</Typography>
				</Breadcrumbs>

				<Box mb={6} textAlign="center">
					<Typography variant="h3" component="h1" fontWeight="800" gutterBottom>
						{PAGE_TITLE}
					</Typography>
					<Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
						Tìm hiểu các chính sách, điều khoản sử dụng và thông tin liên quan để đảm bảo quyền lợi
						khi mua sắm tại INUT Design
					</Typography>
				</Box>

				<Grid container spacing={{ xs: 2.5, md: 3 }}>
					{policyPages.map((page) => (
						<Grid item xs={12} sm={6} key={page.url}>
							<Link href={page.url} passHref>
								<Paper
									elevation={0}
									onClick={() => handleCardClick(page.title, page.url)}
									sx={{
										p: { xs: 2.5, md: 3 },
										height: "100%",
										borderRadius: 3,
										border: `1px solid ${COLOR_CODE.BORDER}`,
										cursor: "pointer",
										transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
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
											<Icon component={page.icon} sx={{ fontSize: 32 }} />
										</Box>
										<Box sx={{ mt: 0.5 }}>
											<Typography
												variant="h6"
												color="text.primary"
												sx={{ mb: 0.75, fontWeight: 700 }}
											>
												{page.title}
											</Typography>
											<Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
												{page.description}
											</Typography>
										</Box>
									</Stack>
								</Paper>
							</Link>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

PoliciesTermsIndexPage.Layout = MainLayout;

export default PoliciesTermsIndexPage;
