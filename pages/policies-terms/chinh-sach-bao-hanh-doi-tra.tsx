import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { COLOR_CODE, trackEvent, trackUmamiEvent } from "@/utils";
import {
	AccessTimeOutlined,
	AssignmentTurnedInOutlined,
	CurrencyExchangeOutlined,
	SyncAltOutlined,
	VerifiedOutlined,
	WarningAmberOutlined,
} from "@mui/icons-material";
import { Box, Breadcrumbs, Container, Grid, Icon, Link as MuiLink, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useRef } from "react";

const PAGE_PATH = "/policies-terms/chinh-sach-bao-hanh-doi-tra";
const PAGE_TITLE = "Chính sách bảo hành và đổi trả";

const policySections = [
	{
		title: "Cam kết chất lượng",
		icon: VerifiedOutlined,
		value: (
			<Stack spacing={1.5}>
				<Typography variant="body1" sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
					Quý khách khi mua hàng và sử dụng dịch vụ tại INUT Design hoàn toàn có thể an tâm về chất lượng sản phẩm mà mình nhận được. INUT Design cam kết tất cả các sản phẩm được gửi đến quý khách hàng đều là sản phẩm chất lượng, đúng với thông tin mô tả trên website và đơn hàng của quý khách.
				</Typography>
				<Typography variant="body1" sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
					Trường hợp quý khách nhận được sản phẩm không đúng với yêu cầu quý khách khi đặt hàng, bị lỗi kỹ thuật, quý khách hoàn toàn có yêu cầu gửi trả sản phẩm lại cho INUT Design để đổi sang sản phẩm khác trong vòng <b>7 ngày</b> kể từ thời điểm nhận hàng. INUT Design xin từ chối hỗ trợ mọi khiếu nại về tình trạng ngoại quan của sản phẩm trong trường hợp Quý khách thông báo cho INUT Design sau thời gian này.
				</Typography>
			</Stack>
		),
	},
	{
		title: "Điều khoản và điều kiện đổi trả",
		icon: AssignmentTurnedInOutlined,
		value: (
			<Stack spacing={1.5}>
				<Typography variant="body1" sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
					Vui lòng đọc kỹ <b>Điều kiện đổi trả</b>. Yêu cầu đổi hàng được xem là hợp lệ nếu thỏa mãn đầy đủ các điều kiện sau:
				</Typography>
				<Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 1, fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 } }}>
					<li>Sản phẩm chưa qua sử dụng, không bị dơ bẩn.</li>
					<li>Sản phẩm bị lỗi do kỹ thuật in như sai màu sắc so với quy định, sai quy cách, không đúng với mô tả trên website, thiếu sản phẩm.</li>
					<li>Sản phẩm in theo yêu cầu: không đúng theo yêu cầu thiết kế, giao không đúng sản phẩm so với đơn đặt hàng.</li>
					<li>Sản phẩm còn trong thời hạn hiệu lực cho phép đổi hàng (07 ngày kể từ thời điểm đơn hàng được giao thành công).</li>
					<li>Sản phẩm đổi cùng loại, cùng mức giá niêm yết. Trường hợp đổi sang sản phẩm khác loại: Giá thấp hơn sản phẩm đổi trả sẽ được tính bằng giá với sản phẩm đổi trả (không hoàn trả lại phần tiền chênh lệch) và Giá cao hơn quý khách vui lòng bù phần tiền chênh lệch so với sản phẩm đổi trả.</li>
				</Box>
			</Stack>
		),
	},
	{
		title: "Phạm vi & Thời gian áp dụng",
		icon: AccessTimeOutlined,
		value: (
			<Stack spacing={1.5}>
				<Box>
					<Typography variant="body1" sx={{ fontWeight: 700, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
						Sản phẩm áp dụng chính sách đổi trả:
					</Typography>
					<Typography variant="body1" sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
						Dành cho tất cả các sản phẩm được đặt tại INUT Design.
					</Typography>
				</Box>
				<Box>
					<Typography variant="body1" sx={{ fontWeight: 700, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
						Thời gian áp dụng chính sách đổi trả:
					</Typography>
					<Typography variant="body1" sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
						Sản phẩm được đổi <b>1 lần duy nhất</b> trong vòng <b>7 ngày</b> kể từ thời điểm đơn hàng được giao thành công.
					</Typography>
				</Box>
			</Stack>
		),
	},
	{
		title: "Cách thức đổi trả sản phẩm",
		icon: SyncAltOutlined,
		value: (
			<Stack spacing={1.5}>
				<Box>
					<Typography variant="body1" sx={{ fontWeight: 700, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
						Cách 1: Đổi sản phẩm trực tiếp tại cửa hàng
					</Typography>
					<Typography variant="body1" sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
						Quý khách có thể mang sản phẩm trực tiếp đến INUT Design tại địa chỉ K574/5 Ông Ích Khiêm, Tổ 22, Phường Hải Châu, Thành phố Đà Nẵng trong thời gian làm việc của chúng tôi:<br />
						Thứ 2 đến thứ 7<br />
						Từ 8h đến 17h30
					</Typography>
				</Box>
				<Box>
					<Typography variant="body1" sx={{ fontWeight: 700, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
						Cách 2: Đổi sản phẩm qua hình thức vận chuyển:
					</Typography>
					<Box component="ul" sx={{ pl: 2, m: 0, mt: 0.5, '& li': { mb: 0.5, fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 } }}>
						<li>Khách hàng trong nước có thể gửi trả sản phẩm qua bưu điện hoặc các đơn vị vận chuyển có ở Việt Nam.</li>
						<li>Khách hàng quốc tế cần liên hệ trước với INUT Design để được hướng dẫn chi tiết về quy trình và chi phí hoàn trả.</li>
					</Box>
					<Typography variant="body1" sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6, mt: 1 }}>
						Xin vui lòng liên hệ hotline <b>0327124321</b> hoặc email <b>inutstudio.dn@gmail.com</b>
					</Typography>
				</Box>
			</Stack>
		),
	},
	{
		title: "Hoàn tiền & Chi phí vận chuyển",
		icon: CurrencyExchangeOutlined,
		value: (
			<Stack spacing={1.5}>
				<Box>
					<Typography variant="body1" sx={{ fontWeight: 700, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
						Cách thức lấy lại tiền:
					</Typography>
					<Typography variant="body1" sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
						Sau khi nhận lại sản phẩm và kiểm tra tình trạng, INUT Design sẽ liên lạc khách hàng và hoàn tiền trong vòng 7 ngày qua tài khoản ngân hàng của khách hàng hoặc theo phương thức thanh toán ban đầu.
					</Typography>
				</Box>
				<Box>
					<Typography variant="body1" sx={{ fontWeight: 700, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
						Chi phí vận chuyển cho việc đổi trả:
					</Typography>
					<Box component="ul" sx={{ pl: 2, m: 0, mt: 0.5, '& li': { mb: 1, fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 } }}>
						<li>INUT Design sẽ chịu toàn bộ chi phí vận chuyển trong suốt quá trình đổi trả hàng hóa.</li>
						<li><b>Trường hợp đổi mẫu/ đổi sản phẩm khác KHÔNG PHẢI LỖI TỪ INUT Design</b> (Dành cho quý khách hàng mua hàng nhưng không sử dụng được, không phù hợp, muốn đổi sang mẫu khác, đặt nhầm):<br />
						Quý khách vui lòng chịu toàn bộ chi phí vận chuyển trong suốt quá trình đổi trả hàng hóa.</li>
					</Box>
				</Box>
			</Stack>
		),
	},
	{
		title: "Lưu ý quan trọng",
		icon: WarningAmberOutlined,
		value: (
			<Stack spacing={1.5}>
				<Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 1, fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 } }}>
					<li>INUT Design chỉ áp dụng chính sách đổi trả hàng hóa <b>cho đến khi quý khách hài lòng</b> nhưng <b>không áp dụng chính sách hoàn trả lại tiền</b> đối với tất cả các trường hợp.</li>
					<li>Quý khách chịu trách nhiệm trực tiếp về nội dung khi xác nhận mua hàng, sử dụng dịch vụ và INUT Design có nhiệm vụ thực hiện đúng nội dung của khách khi xác nhận đơn hàng.</li>
				</Box>
				<Typography variant="body1" sx={{ fontWeight: 700, color: COLOR_CODE.PRIMARY, lineHeight: 1.6, textAlign: "center", mt: 2 }}>
					INUT Design luôn mong muốn mang đến cho khách những sự hài lòng tuyệt đối nhất!
				</Typography>
			</Stack>
		),
	},
];

const WarrantyPolicyPage: NextPageWithLayout = () => {
	const hasTrackedRef = useRef(false);

	useEffect(() => {
		if (hasTrackedRef.current) return;
		hasTrackedRef.current = true;

		trackEvent("warranty_policy_view", {
			category: "engagement",
			label: "warranty_policy_page",
			page_path: PAGE_PATH,
			page_title: PAGE_TITLE,
		});
		trackUmamiEvent("warranty_policy_view", { pagePath: PAGE_PATH });
	}, []);

	return (
		<Box component="section" bgcolor="secondary.dark" pt={4} pb={10}>
			<Seo
				data={{
					title: `${PAGE_TITLE} - INUT Design`,
					description: "Chính sách bảo hành và đổi trả sản phẩm tại INUT Design. Cam kết chất lượng và hỗ trợ khách hàng tốt nhất.",
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
					<Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
						Tìm hiểu về quy định bảo hành, điều kiện và quy trình đổi trả sản phẩm để đảm bảo quyền lợi khi mua sắm tại INUT Design
					</Typography>
				</Box>

				<Grid container spacing={{ xs: 2.5, md: 3 }}>
					{policySections.map((section, index) => (
						<Grid item xs={12} key={index}>
							<Paper
								elevation={0}
								sx={{
									p: { xs: 2.5, md: 4 },
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
								<Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2, sm: 3 }} alignItems="flex-start">
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
											color="text.primary"
											sx={{ mb: 1.5, fontWeight: 700 }}
										>
											{section.title}
										</Typography>
										{section.value}
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

WarrantyPolicyPage.Layout = MainLayout;

export default WarrantyPolicyPage;
