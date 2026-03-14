import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import {
	ComparisonSection,
	ContactSection,
	EnvelopeTypesSection,
	HeroSection,
	IntroductionSection,
	ProductGallery,
	WhyInutSection,
} from "@/components/an-pham-van-phong/in-bi-thu";
import { UsagePurposeValue } from "@/models";
import { NextPageWithLayout } from "@/models/common";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import BoltIcon from "@mui/icons-material/Bolt";
import DescriptionIcon from "@mui/icons-material/Description";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BusinessIcon from "@mui/icons-material/Business";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { Box, Container, Divider } from "@mui/material";
import React, { useEffect } from "react";
import { trackViewProduct } from "@/utils/analytics";

const HERO_IMAGE = "/branding/logo.webp";

const GALLERY_IMAGES = [
	"/branding/services/thiet-ke-in-an.avif",
	"/branding/services/sticker.avif",
	"/branding/services/skin-laptop.avif",
	"/branding/services/skin-nut-phim.avif",
	"/branding/services/nhan-chai-san-pham.avif",
	"/branding/hero-bg.webp",
	"/branding/services/thiet-ke-in-an.avif",
	"/branding/services/sticker.avif",
	"/branding/services/skin-laptop.avif",
	"/branding/services/skin-nut-phim.avif",
	"/branding/services/nhan-chai-san-pham.avif",
	"/branding/logo.webp",
];

const INTRO_BULLETS = [
	"Bì thư in theo yêu cầu giúp nâng cao hình ảnh chuyên nghiệp và đồng bộ bộ nhận diện thương hiệu.",
	"Phù hợp cho doanh nghiệp, tổ chức, cửa hàng và cá nhân cần gửi tài liệu, hợp đồng, thư mời.",
	"Hỗ trợ in bì thư A4, A5, A6 theo kích thước linh hoạt và lựa chọn chất liệu giấy phù hợp.",
	"Tối ưu thẩm mỹ thương hiệu với logo, tên công ty, hotline và thông tin nhận diện được in sắc nét.",
];

const HIGHLIGHTS = [
	{
		title: "Bì thư là gì?",
		description:
			"Ấn phẩm văn phòng dùng để đựng thư từ, hợp đồng, báo giá, hóa đơn hoặc hồ sơ quan trọng, in kèm thông tin nhận diện thương hiệu.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Thiết kế đúng tiêu chuẩn",
		description:
			"File in 300 DPI, hệ màu CMYK, bleed 3mm, font convert outline để đảm bảo thành phẩm sắc nét.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
	{
		title: "Quy trình sản xuất rõ ràng",
		description:
			"Kiểm tra file – in ấn – bế khuôn – dán mép – cắt hoàn thiện – kiểm tra QC trước bàn giao.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "Lợi ích cho doanh nghiệp",
		description:
			"Tăng tính chuyên nghiệp, đồng bộ thương hiệu, bảo vệ tài liệu và tối ưu chi phí in ấn.",
		icon: <BoltIcon color="primary" />,
	},
];

const ENVELOPE_TYPES = [
	{
		name: "Bì thư A4",
		description: "Kích thước 250 × 340mm, dùng để đựng tài liệu không cần gấp.",
		image: "/branding/services/thiet-ke-in-an.avif",
	},
	{
		name: "Bì thư A5",
		description: "Kích thước 180 × 250mm, phù hợp với giấy A4 gấp đôi.",
		image: "/branding/services/sticker.avif",
	},
	{
		name: "Bì thư A6",
		description: "Kích thước 120 × 220mm, thường dùng cho thư mời, thiệp hoặc giấy tờ nhỏ.",
		image: "/branding/services/skin-laptop.avif",
	},
];

const SPEC_OPTIONS = [
	"Độ phân giải: 300 DPI để đảm bảo hình ảnh sắc nét khi in.",
	"Hệ màu: CMYK để kiểm soát màu in chính xác và đồng nhất.",
	"Bleed (tràn lề): 3mm mỗi cạnh để tránh bị cắt lệch nội dung.",
	"Font chữ: convert outline trước khi gửi file in.",
	"Chất liệu phổ biến: giấy Fort 100–120gsm, giấy Kraft, giấy Couche.",
	"Chi tiết in: logo, tên thương hiệu, địa chỉ, email, hotline, website.",
];

const COMPARISON_ROWS = [
	{ criteria: "Bề mặt", fort: "Nhám nhẹ", couche: "Mịn", kraft: "Thô tự nhiên" },
	{ criteria: "Khả năng viết", fort: "Rất tốt", couche: "Trung bình", kraft: "Tốt" },
	{
		criteria: "Phong cách",
		fort: "Văn phòng truyền thống",
		couche: "Hiện đại, chỉn chu",
		kraft: "Vintage, sáng tạo",
	},
	{
		criteria: "Ứng dụng",
		fort: "Hành chính, hợp đồng, chứng từ",
		couche: "Marketing, thư mời, thương hiệu chuyên nghiệp",
		kraft: "Thương hiệu thủ công, quà tặng, phong cách riêng",
	},
];

const COMPARISON_RECOMMENDATION =
	"Giấy Fort phù hợp cho hồ sơ hằng ngày. Giấy Couche ưu tiên hình ảnh thương hiệu hiện đại. Giấy Kraft thích hợp cho phong cách thủ công, gần gũi và khác biệt.";

const TARGET_CUSTOMERS = [
	"doanh nghiệp",
	"tổ chức",
	"cửa hàng",
	"trường học",
	"cá nhân",
];

const APPLICATIONS = [
	{
		title: "Hợp đồng & Báo giá",
		description:
			"Gửi hợp đồng, báo giá và hồ sơ doanh nghiệp trong bì thư in logo chuyên nghiệp.",
		icon: <DescriptionIcon color="primary" />,
	},
	{
		title: "Thư mời sự kiện",
		description:
			"Bì thư đẹp mắt giúp thiệp mời sự kiện tạo ấn tượng ngay từ khi cầm trên tay.",
		icon: <MailOutlineIcon color="primary" />,
	},
	{
		title: "Hóa đơn & Chứng từ",
		description:
			"Bảo vệ và trình bày hóa đơn, chứng từ chuyên nghiệp khi gửi đến khách hàng và đối tác.",
		icon: <BusinessIcon color="primary" />,
	},
	{
		title: "Catalogue & Tài liệu Marketing",
		description:
			"Đóng gói catalogue, tài liệu marketing trong bì thư thương hiệu tăng mức độ nhận diện.",
		icon: <CardGiftcardIcon color="primary" />,
	},
];

const InBiThuPage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "in-bi-thu",
			name: "In bì thư",
			category: "Ấn phẩm văn phòng",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "In Bì Thư Chuyên Nghiệp Theo Yêu Cầu | INUT Design Đà Nẵng",
					description:
						"Dịch vụ in bì thư chuyên nghiệp tại Đà Nẵng: in logo, thông tin doanh nghiệp trên bì thư A4, A5, A6. Chất lượng cao, giá cạnh tranh, sản xuất từ 10 cái, giao hàng 3-4 ngày.",
					url: "https://inutdesign.com/an-pham-van-phong/in-bi-thu",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={INTRO_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<EnvelopeTypesSection envelopeTypes={ENVELOPE_TYPES} specOptions={SPEC_OPTIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ComparisonSection rows={COMPARISON_ROWS} recommendation={COMPARISON_RECOMMENDATION} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description={`Liên hệ INUT Design để nhận báo giá nhanh in bì thư, tư vấn chất liệu và thiết kế phù hợp cho ${TARGET_CUSTOMERS.join(
							", "
						)}.`}
						type={UsagePurposeValue.IN_BI_THU}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

InBiThuPage.Layout = MainLayout;

export default InBiThuPage;
