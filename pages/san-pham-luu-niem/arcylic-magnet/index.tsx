import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import {
	AcrylicMagnetTypesSection,
	ContactSection,
	HeroSection,
	IntroductionSection,
	ProductGallery,
	WhyInutSection,
} from "@/components/san-pham-luu-niem/arcylic-magnet";
import { FormQuoteRequestType } from "@/models";
import { NextPageWithLayout } from "@/models/common";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BoltIcon from "@mui/icons-material/Bolt";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ShieldIcon from "@mui/icons-material/Shield";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import { Box, Container, Divider } from "@mui/material";
import React from "react";

const HERO_IMAGE = "/branding/logo.webp";

const GALLERY_IMAGES = [
	"/branding/services/sticker.avif",
	"/branding/services/skin-laptop.avif",
	"/branding/services/skin-nut-phim.avif",
	"/branding/services/nhan-chai-san-pham.avif",
	"/branding/services/thiet-ke-in-an.avif",
	"/branding/hero-bg.webp",
	"/branding/services/sticker.avif",
	"/branding/services/skin-laptop.avif",
	"/branding/services/skin-nut-phim.avif",
	"/branding/services/nhan-chai-san-pham.avif",
	"/branding/services/thiet-ke-in-an.avif",
	"/branding/logo.webp",
];

const INTRO_BULLETS = [
	"Acrylic Magnet là dòng nam châm mica cao cấp, nổi bật nhờ bề mặt bóng đẹp và độ bền vượt trội.",
	"Phù hợp cho fanart, merchandise, quà tặng doanh nghiệp và các chiến dịch marketing cần điểm chạm thương hiệu.",
	"Gia công theo hình tự do (die cut), cá nhân hóa không giới hạn theo logo, nhân vật hoặc artwork riêng.",
	"Sản xuất tại xưởng INUT Design Đà Nẵng, tối thiểu từ 10 cái, thời gian hoàn thiện 3–4 ngày làm việc.",
];

const HIGHLIGHTS = [
	{
		title: "Bền bỉ vượt trội",
		description: "Acrylic dày 3–5mm kết hợp in UV cho độ bền màu cao, chống nước và chống tia UV.",
		icon: <ShieldIcon color="primary" />,
	},
	{
		title: "Thẩm mỹ sang trọng",
		description:
			"Lớp mica trong tạo chiều sâu tự nhiên, giúp sản phẩm trông như một tác phẩm nghệ thuật thu nhỏ.",
		icon: <AutoAwesomeIcon color="primary" />,
	},
	{
		title: "Cá nhân hóa linh hoạt",
		description:
			"Hỗ trợ in theo mọi ý tưởng: logo, nhân vật, ảnh cá nhân, artwork và cắt CNC theo đường cutline riêng.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Ứng dụng thương mại cao",
		description:
			"Tăng nhận diện thương hiệu qua quà tặng kèm đơn hàng, merchandise hoặc quà doanh nghiệp.",
		icon: <BoltIcon color="primary" />,
	},
];

const ACRYLIC_MAGNET_TYPES = [
	{
		name: "Merchandise artist",
		description: "Sản xuất fanart, chibi, artwork gốc theo hình die cut tự do với bề mặt bóng đẹp.",
		image: "/branding/services/sticker.avif",
	},
	{
		name: "Quà tặng thương hiệu",
		description:
			"Tặng kèm đơn hàng hoặc giftset giúp tăng ghi nhớ thương hiệu trong đời sống hằng ngày.",
		image: "/branding/services/nhan-chai-san-pham.avif",
	},
	{
		name: "Sự kiện & hội chợ",
		description:
			"Quà lưu niệm gọn nhẹ cho fanmeeting, workshop, festival và các hoạt động cộng đồng.",
		image: "/branding/services/thiet-ke-in-an.avif",
	},
	{
		name: "Doanh nghiệp",
		description: "Branding tủ lạnh văn phòng, quà tặng đối tác hoặc quà tri ân khách hàng.",
		image: "/branding/services/skin-laptop.avif",
	},
];

const SPEC_OPTIONS = [
	"Chất liệu: Acrylic (mica) trong suốt hoặc trắng đục, dày 3mm (chuẩn) hoặc 5mm (cao cấp).",
	"Kích thước phổ biến: 5×5cm, 6×6cm, 5×7cm hoặc cắt tự do theo thiết kế.",
	"Độ phân giải in: tối thiểu 300 DPI tại kích thước thực tế để đảm bảo chi tiết sắc nét.",
	"Định dạng file hỗ trợ: .AI, .PDF vector, .PSD 300 DPI, .PNG nền trong.",
	"Yêu cầu cutline vector riêng và bleed 2–3mm để đảm bảo cắt CNC chính xác.",
	"Màu sắc: ưu tiên CMYK để kiểm soát độ chính xác màu in tốt hơn.",
];

const TARGET_CUSTOMERS = [
	"Artist & Creator: bán merchandise fanart, chibi nhân vật, artwork gốc.",
	"Cửa hàng & thương hiệu: quà tặng kèm đơn hàng, tăng trải nghiệm khách hàng.",
	"Sự kiện & hội chợ: quà lưu niệm fanmeeting, festival, hoạt động cộng đồng.",
	"Doanh nghiệp: quà tặng đối tác, branding tủ lạnh văn phòng.",
	"Cá nhân: quà sinh nhật, kỷ niệm, ảnh gia đình.",
];

const APPLICATIONS = [
	{
		title: "Artist & Creator",
		description: "Bán merchandise cá nhân hóa theo artwork riêng với cảm giác thành phẩm cao cấp.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Cửa hàng & thương hiệu",
		description: "Quà tặng kèm đơn hàng giúp tăng trải nghiệm mua sắm và mức độ quay lại.",
		icon: <RocketLaunchIcon color="primary" />,
	},
	{
		title: "Sự kiện & hội chợ",
		description: "Vật phẩm lưu niệm mini dễ tặng, dễ trưng bày và tạo điểm chạm cảm xúc.",
		icon: <WorkspacesIcon color="primary" />,
	},
	{
		title: "Doanh nghiệp",
		description: "Ứng dụng tốt cho quà đối tác, quà nhân sự và nhận diện thương hiệu văn phòng.",
		icon: <BoltIcon color="primary" />,
	},
];

const ArcylicMagnetPage: NextPageWithLayout = () => {
	return (
		<>
			<Seo
				data={{
					title: "Acrylic Magnet — Nam Châm Mica In Hình Theo Yêu Cầu | INUT Design",
					description:
						"Acrylic Magnet (nam châm mica) in theo yêu cầu tại INUT Design: bền đẹp, in UV sắc nét, cắt CNC theo hình tự do, sản xuất nhanh 3-4 ngày tại Đà Nẵng.",
					url: "https://inutdesign.com/san-pham-luu-niem/arcylic-magnet",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={INTRO_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<AcrylicMagnetTypesSection
						acrylicMagnetTypes={ACRYLIC_MAGNET_TYPES}
						specOptions={SPEC_OPTIONS}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description={`Liên hệ INUT Design ngay để nhận báo giá Acrylic Magnet, tư vấn chất liệu và các phương án triển khai phù hợp cho: ${TARGET_CUSTOMERS.join(
							" "
						)}`}
						type={FormQuoteRequestType.ACRYLIC_MAGNET}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

ArcylicMagnetPage.Layout = MainLayout;

export default ArcylicMagnetPage;
