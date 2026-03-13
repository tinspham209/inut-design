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
	AssignmentOutlined,
	AssignmentTurnedInOutlined,
	CopyrightOutlined,
	DescriptionOutlined,
	GavelOutlined,
	HandshakeOutlined,
	PaymentsOutlined,
	UpdateOutlined,
	VerifiedUserOutlined,
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

const PAGE_PATH = "/policies-terms/dieu-khoan-su-dung";
const PAGE_TITLE = "Điều khoản sử dụng";

const policySections = [
	{
		title: "Phạm vi áp dụng",
		content:
			"Điều khoản sử dụng này áp dụng cho tất cả khách hàng sử dụng website inutdesign.com và các dịch vụ in ấn, thiết kế, skin laptop, sticker do INUT Design cung cấp. Khi sử dụng dịch vụ, quý khách đồng ý tuân thủ các điều khoản dưới đây.",
		icon: DescriptionOutlined,
	},
	{
		title: "Điều kiện sử dụng dịch vụ",
		content: (
			<>
				Để sử dụng dịch vụ, quý khách cần:
				<Box component="ul" sx={{ mt: 0.5, mb: 0, pl: 2.5 }}>
					<li>
						Cung cấp thông tin chính xác khi đặt hàng (tên, số điện thoại, địa chỉ giao hàng).
					</li>
					<li>Không sử dụng dịch vụ cho các mục đích vi phạm pháp luật Việt Nam.</li>
					<li>
						Không đặt in nội dung vi phạm bản quyền, nội dung phản động, khiêu dâm hoặc gây hại cho
						xã hội.
					</li>
					<li>Quý khách phải đủ 18 tuổi hoặc có sự đồng ý của người giám hộ hợp pháp.</li>
				</Box>
			</>
		),
		icon: AssignmentOutlined,
	},
	{
		title: "Quyền lợi khách hàng",
		content: (
			<Box component="ul" sx={{ mt: 0, mb: 0, pl: 2.5 }}>
				<li>Được tư vấn miễn phí về sản phẩm và dịch vụ.</li>
				<li>Nhận sản phẩm đúng với thông tin đã đặt hàng và xác nhận.</li>
				<li>Được hỗ trợ đổi trả trong trường hợp sản phẩm bị lỗi kỹ thuật từ INUT Design.</li>
				<li>Thông tin cá nhân được bảo vệ theo Chính sách bảo mật thông tin.</li>
				<li>Được thông báo kịp thời về tiến trình đơn hàng.</li>
			</Box>
		),
		icon: VerifiedUserOutlined,
	},
	{
		title: "Nghĩa vụ khách hàng",
		content: (
			<Box component="ul" sx={{ mt: 0, mb: 0, pl: 2.5 }}>
				<li>Cung cấp thông tin thiết kế và yêu cầu in ấn chính xác, rõ ràng.</li>
				<li>Xem xét và xác nhận mẫu thiết kế trước khi INUT Design tiến hành in.</li>
				<li>Thanh toán đầy đủ theo hình thức đã thỏa thuận.</li>
				<li>Chịu trách nhiệm về tính hợp pháp của nội dung thiết kế do khách hàng cung cấp.</li>
				<li>Không yêu cầu chỉnh sửa sau khi đã xác nhận duyệt mẫu và tiến hành in.</li>
			</Box>
		),
		icon: AssignmentTurnedInOutlined,
	},
	{
		title: "Sở hữu trí tuệ",
		content: (
			<>
				<Typography
					variant="body1"
					sx={{ mb: 1, fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}
				>
					INUT Design tôn trọng quyền sở hữu trí tuệ. Tất cả nội dung, hình ảnh, logo và thiết kế
					trên website inutdesign.com là tài sản của INUT Design hoặc đã được cấp phép sử dụng hợp
					lệ.
				</Typography>
				<Typography
					variant="body1"
					sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}
				>
					Khách hàng khi cung cấp tệp thiết kế để in ấn xác nhận rằng mình có đầy đủ quyền sử dụng
					nội dung đó và chịu hoàn toàn trách nhiệm pháp lý nếu có tranh chấp về bản quyền.
				</Typography>
			</>
		),
		icon: CopyrightOutlined,
	},
	{
		title: "Thanh toán và giá cả",
		content: (
			<>
				<Typography
					variant="body1"
					sx={{ mb: 1, fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}
				>
					Giá sản phẩm được niêm yết rõ ràng trên website. INUT Design có quyền điều chỉnh giá mà
					không cần thông báo trước, tuy nhiên giá được áp dụng sẽ là giá tại thời điểm khách hàng
					xác nhận đơn hàng.
				</Typography>
				<Typography
					variant="body1"
					sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}
				>
					INUT Design hỗ trợ các hình thức thanh toán: chuyển khoản ngân hàng, tiền mặt trực tiếp
					tại cửa hàng. Đơn hàng sẽ được xử lý sau khi INUT Design xác nhận thanh toán thành công.
				</Typography>
			</>
		),
		icon: PaymentsOutlined,
	},
	{
		title: "Giới hạn trách nhiệm",
		content: (
			<>
				<Typography
					variant="body1"
					sx={{ mb: 1, fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}
				>
					INUT Design không chịu trách nhiệm cho các thiệt hại gián tiếp, mất doanh thu hoặc thiệt
					hại do gián đoạn kinh doanh phát sinh từ việc sử dụng sản phẩm, ngoại trừ các trường hợp
					theo quy định pháp luật Việt Nam.
				</Typography>
				<Typography
					variant="body1"
					sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}
				>
					INUT Design nỗ lực đảm bảo website hoạt động ổn định nhưng không đảm bảo dịch vụ không bao
					giờ bị gián đoạn do các yếu tố ngoài tầm kiểm soát.
				</Typography>
			</>
		),
		icon: GavelOutlined,
	},

	{
		title: "Thay đổi điều khoản",
		content:
			"INUT Design có quyền thay đổi Điều khoản sử dụng bất kỳ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website. Việc tiếp tục sử dụng dịch vụ sau khi điều khoản thay đổi đồng nghĩa với việc quý khách chấp nhận các điều khoản mới.",
		icon: UpdateOutlined,
	},
	{
		title: "Giải quyết tranh chấp",
		content: (
			<>
				<Typography
					variant="body1"
					sx={{ mb: 1, fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}
				>
					Mọi tranh chấp phát sinh từ việc sử dụng dịch vụ sẽ được hai bên ưu tiên giải quyết thông
					qua thương lượng, hòa giải.
				</Typography>
				<Typography
					variant="body1"
					sx={{ mb: 1, fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}
				>
					Trong trường hợp không thể giải quyết qua thương lượng, tranh chấp sẽ được đưa ra cơ quan
					có thẩm quyền tại Thành phố Đà Nẵng, Việt Nam theo quy định của pháp luật hiện hành.
				</Typography>
				<Box component="span" sx={{ display: "inline-block" }}>
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
		icon: HandshakeOutlined,
	},
];

const TermsOfUsePage: NextPageWithLayout = () => {
	const hasTrackedRef = useRef(false);

	useEffect(() => {
		if (hasTrackedRef.current) return;
		hasTrackedRef.current = true;

		trackEvent("terms_of_use_view", {
			category: "engagement",
			label: "terms_of_use_page",
			page_path: PAGE_PATH,
			page_title: PAGE_TITLE,
		});
		trackUmamiEvent("terms_of_use_view", { pagePath: PAGE_PATH });
	}, []);

	return (
		<Box component="section" bgcolor="secondary.dark" pt={4} pb={10}>
			<Seo
				data={{
					title: `${PAGE_TITLE} - INUT Design`,
					description:
						"Điều khoản sử dụng dịch vụ tại INUT Design - cửa hàng in ấn và thiết kế tại Đà Nẵng.",
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
						ĐIỀU KHOẢN SỬ DỤNG
					</Typography>
					<Typography variant="subtitle1" color="text.secondary">
						Điều khoản sử dụng dịch vụ tại INUT Design
					</Typography>
				</Box>

				<Grid container spacing={{ xs: 2.5, md: 3 }}>
					{policySections.map((info, index) => (
						<Grid item xs={12} md={index > 7 ? 12 : 6} key={index}>
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
										{typeof info.content === "string" ? (
											<Typography
												variant="body1"
												sx={{ fontWeight: 500, color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}
											>
												{info.content}
											</Typography>
										) : (
											<Box sx={{ color: COLOR_CODE.TEXT_DARK, lineHeight: 1.6 }}>
												{info.content}
											</Box>
										)}
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

TermsOfUsePage.Layout = MainLayout;

export default TermsOfUsePage;
