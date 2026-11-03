import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { COLOR_CODE, trackEvent, trackUmamiEvent } from "@/utils";
import {
	AssignmentTurnedInOutlined,
	FactCheckOutlined,
	PaletteOutlined,
	PrintOutlined,
	WarningAmberOutlined,
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

const PAGE_PATH = "/policies-terms/chinh-sach-duyet-in-va-san-xuat";
const PAGE_TITLE = "Chính sách duyệt in và sản xuất";

const policySections = [
	{
		title: "1. Xác nhận duyệt in",
		icon: AssignmentTurnedInOutlined,
		paragraphs: [
			"Khách hàng cần kiểm tra kỹ thiết kế, nội dung, kích thước, số lượng, chất liệu, màu sắc và quy cách gia công trước khi duyệt in.",
			"INUT chỉ tiến hành sản xuất sau khi khách hàng xác nhận duyệt in.",
		],
	},
	{
		title: "2. Sai lệch màu sắc",
		icon: PaletteOutlined,
		paragraphs: [
			"Màu sắc thực tế có thể chênh lệch do thiết bị hiển thị, hệ màu, chất liệu và công nghệ in.",
			"INUT cam kết độ tương đồng màu sắc khoảng 90–95%, không đảm bảo trùng khớp tuyệt đối với màn hình.",
			"Khách hàng có yêu cầu cao về màu sắc nên duyệt mẫu in thực tế trước khi sản xuất hàng loạt.",
		],
	},
	{
		title: "3. Trách nhiệm sau duyệt in",
		icon: PrintOutlined,
		paragraphs: [
			"INUT sản xuất theo lệnh in hoặc mẫu in đã được khách hàng xác nhận.",
			"INUT không chịu trách nhiệm đối với sai sót ngoài nội dung đã duyệt hoặc thay đổi từ phía khách hàng.",
			"INUT sẽ xử lý các lỗi sản xuất không đúng với lệnh in hoặc mẫu in đã duyệt.",
		],
	},
	{
		title: "4. Kiểm tra & khiếu nại",
		icon: FactCheckOutlined,
		paragraphs: [
			"Khách hàng vui lòng kiểm tra sản phẩm và phản hồi kèm hình ảnh/video trong vòng 03 ngày kể từ khi nhận hàng.",
			"INUT sẽ đối chiếu với lệnh in hoặc mẫu đã duyệt để đưa ra phương án xử lý phù hợp.",
			"Sau 03 ngày, INUT không tiếp nhận khiếu nại, trừ các trường hợp pháp luật có quy định khác.",
		],
	},
];

const PrintApprovalPolicyPage: NextPageWithLayout = () => {
	const hasTrackedRef = useRef(false);

	useEffect(() => {
		if (hasTrackedRef.current) return;
		hasTrackedRef.current = true;

		trackEvent("print_approval_policy_view", {
			category: "engagement",
			label: "print_approval_policy_page",
			// eslint-disable-next-line camelcase
			page_path: PAGE_PATH,
			// eslint-disable-next-line camelcase
			page_title: PAGE_TITLE,
		});
		trackUmamiEvent("print_approval_policy_view", { pagePath: PAGE_PATH });
	}, []);

	return (
		<Box component="section" bgcolor="secondary.dark" pt={4} pb={10}>
			<Seo
				data={{
					title: `${PAGE_TITLE} - INUT Design`,
					description:
						"Chính sách duyệt in và sản xuất tại INUT Design: xác nhận duyệt in, sai lệch màu sắc, trách nhiệm sau duyệt in và kiểm tra, khiếu nại sản phẩm.",
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
						CHÍNH SÁCH DUYỆT IN & SẢN XUẤT
					</Typography>
					<Typography variant="subtitle1" color="text.secondary">
						Xác nhận duyệt in, màu sắc & trách nhiệm sản xuất
					</Typography>
				</Box>

				<Grid container spacing={{ xs: 2.5, md: 3 }}>
					{policySections.map((section) => (
						<Grid item xs={12} key={section.title}>
							<Paper
								elevation={0}
								sx={{
									p: { xs: 2.5, md: 4 },
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
								<Stack
									direction={{ xs: "column", sm: "row" }}
									spacing={{ xs: 2, sm: 3 }}
									alignItems="flex-start"
								>
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
										<Icon component={section.icon} sx={{ fontSize: 32 }} />
									</Box>
									<Box sx={{ flexGrow: 1, mt: { xs: 0, sm: 0.5 } }}>
										<Typography
											variant="h6"
											component="h2"
											color="text.primary"
											sx={{ mb: 1.5, fontWeight: 700 }}
										>
											{section.title}
										</Typography>
										<Stack spacing={1.5}>
											{section.paragraphs.map((paragraph) => (
												<Typography
													key={paragraph}
													variant="body1"
													sx={{
														fontWeight: 500,
														color: COLOR_CODE.TEXT_DARK,
														lineHeight: 1.6,
													}}
												>
													{paragraph}
												</Typography>
											))}
										</Stack>
									</Box>
								</Stack>
							</Paper>
						</Grid>
					))}
				</Grid>

				<Paper
					elevation={0}
					sx={{
						mt: 3,
						p: { xs: 2.5, md: 4 },
						borderRadius: 3,
						border: `1px solid ${COLOR_CODE.BORDER}`,
						bgcolor: "rgba(225, 97, 46, 0.08)",
					}}
				>
					<Stack direction="row" spacing={2} alignItems="flex-start">
						<WarningAmberOutlined sx={{ color: COLOR_CODE.PRIMARY, flexShrink: 0 }} />
						<Typography variant="body1" sx={{ color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
							<strong>LƯU Ý:</strong> Việc xác nhận duyệt in đồng nghĩa với việc khách hàng đã kiểm
							tra, đồng ý với thông tin sản xuất và chính sách trên.
						</Typography>
					</Stack>
				</Paper>

				<Typography
					variant="body1"
					sx={{ mt: 4, color: COLOR_CODE.PRIMARY, fontWeight: 700, textAlign: "center" }}
				>
					INUT Design – Cảm ơn quý khách đã tin tưởng và hợp tác!
				</Typography>
			</Container>
		</Box>
	);
};

PrintApprovalPolicyPage.Layout = MainLayout;

export default PrintApprovalPolicyPage;
