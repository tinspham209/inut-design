import {
	COLOR_CODE,
	trackContactClick,
	trackOutboundClick,
	trackPhoneClick,
	trackSocialClick,
} from "@/utils";
import Facebook from "@mui/icons-material/Facebook";
import Instagram from "@mui/icons-material/Instagram";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const taxInfoUrl = "https://masothue.com/0402325801-cong-ty-tnhh-inut-design";
const phoneNumber = "0327124321";
const emailAddress = "inutstudio.dn@gmail.com";

const socialLinks = [
	{
		icon: Facebook,
		url: "https://www.facebook.com/INUTdesign1003",
		platform: "facebook",
	},
	{
		icon: Facebook,
		url: "https://www.facebook.com/inutdesign",
		platform: "facebook",
	},
	{
		icon: Instagram,
		url: "https://www.instagram.com/inut_skin/",
		platform: "instagram",
	},
];

const introLinks = [
	{ label: "Về Chúng Tôi", url: "/about-us" },
	{ label: "Sản phẩm", url: "/san-pham" },
	{ label: "Dịch vụ", url: "/services" },
	{ label: "Tin tức", url: "/blog" },
	{ label: "Liên hệ", url: "/contact" },
];

const policyLinks = [
	{ label: "Thông tin doanh nghiệp", url: "/policies-terms/thong-tin-doanh-nghiep" },
	{ label: "Thông tin thanh toán", url: "/policies-terms/thong-tin-thanh-toan" },
	{ label: "Điều khoản sử dụng", url: "/policies-terms/dieu-khoan-su-dung" },
	{
		label: "Chính sách bảo mật thông tin",
		url: "/policies-terms/chinh-sach-bao-ve-thong-tin-khach-hang",
	},
	{ label: "Chính sách bảo hành và đổi trả", url: "/policies-terms/chinh-sach-bao-hanh-doi-tra" },
	{ label: "FAQs - Câu hỏi thường gặp", url: "/policies-terms/faqs" },
];

export function Footer() {
	return (
		<Box
			component={"footer"}
			bgcolor={COLOR_CODE.INK}
			color={COLOR_CODE.WHITE}
			borderTop={`1px solid ${COLOR_CODE.BORDER_DARK}`}
			sx={{
				pt: { xs: 6, md: 8 },
				pb: { xs: 4, md: 5 },
			}}
		>
			<Container maxWidth="lg">
				{/* Top Section - 4 Columns */}
				<Grid container spacing={{ xs: 4, md: 4, lg: 6 }}>
					{/* Column 1: GIỚI THIỆU */}
					<Grid item xs={12} sm={6} md={3}>
						<Typography
							variant="subtitle2"
							sx={{
								color: COLOR_CODE.PRIMARY,
								fontWeight: 700,
								mb: 2.5,
								textTransform: "uppercase",
								letterSpacing: "0.12em",
							}}
						>
							GIỚI THIỆU
						</Typography>
						<Stack spacing={1.5}>
							{introLinks.map((link) => (
								<Link key={link.label} href={link.url} passHref>
									<MuiLink
										variant="body2"
										sx={{
											color: COLOR_CODE.TEXT_MUTED,
											textDecoration: "none",
											"&:hover": { color: COLOR_CODE.PRIMARY },
											transition: "color 0.2s",
										}}
									>
										{link.label}
									</MuiLink>
								</Link>
							))}
						</Stack>
					</Grid>

					{/* Column 2: ĐIỀU KHOẢN */}
					<Grid item xs={12} sm={6} md={3}>
						<Typography
							variant="subtitle2"
							sx={{
								color: COLOR_CODE.PRIMARY,
								fontWeight: 700,
								mb: 2.5,
								textTransform: "uppercase",
								letterSpacing: "0.12em",
							}}
						>
							CHÍNH SÁCH & ĐIỀU KHOẢN
						</Typography>
						<Stack spacing={1.5}>
							{policyLinks.map((link) => (
								<Link key={link.label} href={link.url} passHref>
									<MuiLink
										variant="body2"
										sx={{
											color: COLOR_CODE.TEXT_MUTED,
											textDecoration: "none",
											"&:hover": { color: COLOR_CODE.PRIMARY },
											transition: "color 0.2s",
										}}
									>
										{link.label}
									</MuiLink>
								</Link>
							))}
						</Stack>
					</Grid>

					{/* Column 3: CONTACT INFO */}
					<Grid item xs={12} sm={6} md={3}>
						<Stack spacing={2}>
							<Typography
								variant="subtitle2"
								sx={{
									color: COLOR_CODE.PRIMARY,
									fontWeight: 700,
									display: "flex",
									alignItems: "center",
									textTransform: "uppercase",
									letterSpacing: "0.1em",
									mb: 0.5,
								}}
							>
								© {new Date().getFullYear()} - INUT DESIGN
							</Typography>
							<Typography variant="body2" sx={{ color: COLOR_CODE.TEXT_MUTED, lineHeight: 1.6 }}>
								<Box component="span" sx={{ color: COLOR_CODE.PRIMARY, fontWeight: 700, mr: 0.5 }}>
									VPĐD:
								</Box>
								<MuiLink
									onClick={() => trackOutboundClick("https://maps.app.goo.gl/dAdKSbnBEvarx6LK8")}
									href="https://maps.app.goo.gl/dAdKSbnBEvarx6LK8"
									target="_blank"
								>
									K574/5 Ông Ích Khiêm, Tổ 22, Phường Hải Châu, Thành phố Đà Nẵng
								</MuiLink>
							</Typography>
							<Typography variant="body2" sx={{ color: COLOR_CODE.TEXT_MUTED }}>
								<Box component="span" sx={{ color: COLOR_CODE.PRIMARY, fontWeight: 700, mr: 0.5 }}>
									Hotline:
								</Box>
								<MuiLink
									href={`tel:${phoneNumber}`}
									onClick={trackPhoneClick}
									sx={{
										color: COLOR_CODE.TEXT_MUTED,
										textDecoration: "none",
										"&:hover": { color: COLOR_CODE.PRIMARY },
									}}
								>
									{phoneNumber}
								</MuiLink>
							</Typography>
							<Typography variant="body2" sx={{ color: COLOR_CODE.TEXT_MUTED }}>
								<Box component="span" sx={{ color: COLOR_CODE.PRIMARY, fontWeight: 700, mr: 0.5 }}>
									Email:
								</Box>
								<MuiLink
									href={`mailto:${emailAddress}`}
									onClick={() => trackContactClick("email")}
									sx={{
										color: COLOR_CODE.TEXT_MUTED,
										textDecoration: "none",
										"&:hover": { color: COLOR_CODE.PRIMARY },
									}}
								>
									{emailAddress}
								</MuiLink>
							</Typography>
							<Typography variant="body2" sx={{ color: COLOR_CODE.TEXT_MUTED }}>
								<Box component="span" sx={{ color: COLOR_CODE.PRIMARY, fontWeight: 700, mr: 0.5 }}>
									Làm việc:
								</Box>
								08:00 - 17:30 (T2 - T7)
							</Typography>
						</Stack>
					</Grid>

					{/* Column 4: BRAND & SOCIAL */}
					<Grid item xs={12} sm={6} md={3}>
						<Stack spacing={2}>
							<Typography
								variant="h5"
								sx={{ fontWeight: 800, letterSpacing: "-0.04em", color: COLOR_CODE.WHITE, mb: 0.5 }}
							>
								INUT{" "}
								<Box component="span" sx={{ color: COLOR_CODE.PRIMARY }}>
									DESIGN
								</Box>
							</Typography>

							<Typography
								variant="subtitle2"
								sx={{
									color: COLOR_CODE.PRIMARY,
									fontWeight: 700,
									textTransform: "uppercase",
									letterSpacing: "0.1em",
								}}
							>
								KẾT NỐI VỚI CHÚNG TÔI
							</Typography>
							<Stack direction="row" spacing={1.5}>
								{socialLinks.map((link) => (
									<MuiLink
										key={link.url}
										component="a"
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={`INUT Design ${link.platform}`}
										onClick={() => trackSocialClick(link.platform)}
										sx={{
											color: COLOR_CODE.WHITE,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: 40,
											height: 40,
											borderRadius: 1.5,
											border: `1px solid ${COLOR_CODE.BORDER_DARK}`,
											backgroundColor: COLOR_CODE.SURFACE_ELEVATED,
											transition: "all 0.2s ease",
											"&:hover": {
												color: COLOR_CODE.PRIMARY,
												borderColor: COLOR_CODE.PRIMARY,
												backgroundColor: "rgba(255, 77, 0, 0.08)",
											},
										}}
									>
										<link.icon sx={{ fontSize: 24 }} />
									</MuiLink>
								))}
							</Stack>
						</Stack>
					</Grid>
				</Grid>

				{/* Divider */}
				<Divider sx={{ borderColor: COLOR_CODE.BORDER_DARK, my: { xs: 4, md: 5 } }} />

				{/* Bottom Section - Registration Info */}
				<Box>
					<Stack spacing={0.75}>
						<Typography variant="caption" sx={{ color: COLOR_CODE.TEXT_SOFT, display: "block" }}>
							Công ty TNHH INUT DESIGN
						</Typography>
						<Typography variant="caption" sx={{ color: COLOR_CODE.TEXT_SOFT, display: "block" }}>
							Mã số DN:{" "}
							<MuiLink
								href={taxInfoUrl}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => trackOutboundClick(taxInfoUrl)}
								sx={{
									color: "inherit",
									textDecoration: "none",
									"&:hover": { color: COLOR_CODE.PRIMARY },
								}}
							>
								0402325801
							</MuiLink>{" "}
							bởi Sở Tài Chính Thành phố Đà Nẵng, Phòng Doanh Nghiệp và Đăng Ký Kinh Doanh cấp ngày
							09/03/2026. Người đại diện: HỒ HỮU NGỌC TÂM
						</Typography>
						<Typography variant="caption" sx={{ color: COLOR_CODE.TEXT_SOFT, display: "block" }}>
							Địa chỉ: K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng
						</Typography>
						<Typography variant="caption" sx={{ color: COLOR_CODE.TEXT_SOFT, display: "block" }}>
							Điện thoại: {phoneNumber} - Email: {emailAddress}
						</Typography>
						<Typography
							variant="caption"
							sx={{ color: COLOR_CODE.TEXT_SOFT, display: "block", mt: 1 }}
						>
							© 2018–{new Date().getFullYear()} Công ty TNHH INUT DESIGN - mọi quyền bảo lưu
						</Typography>
					</Stack>
				</Box>
			</Container>
			<Box
				className="footer__bigname"
				aria-hidden="true"
				sx={{
					// font-family: var(--f-display);
					fontSize: "clamp(3.5rem, 8vw, 8rem)",
					fontWeight: 800,
					letterSpacing: "-0.05em",
					color: "rgba(245, 240, 232, 0.08)",
					textAlign: "center",
					padding: "1.5rem 0 0",
					borderTop: `1px solid ${COLOR_CODE.BORDER_DARK}`,
					marginTop: "2rem",
					lineHeight: 1,
					userSelect: "none",

					"& span": {
						color: "rgba(255, 77, 0, 0.18)",
					},
				}}
			>
				INUT<span>.</span>DESIGN
			</Box>
		</Box>
	);
}
