import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import {
	ContactSection,
	HeroSection,
	IntroductionSection,
	MocKhoaMicaTypesSection,
	ProductGallery,
	WhyInutSection,
} from "@/components/san-pham-luu-niem/moc-khoa-mica";
import { FormQuoteRequestType } from "@/models";
import { NextPageWithLayout } from "@/models/common";
import BoltIcon from "@mui/icons-material/Bolt";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import StorefrontIcon from "@mui/icons-material/Storefront";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Box, Container, Divider } from "@mui/material";
import React, { useEffect } from "react";
import { trackViewProduct } from "@/utils/analytics";

const HERO_IMAGE = "/branding/logo.webp";

const GALLERY_IMAGES = [
	"/branding/services/sticker.avif",
	"/branding/services/nhan-chai-san-pham.avif",
	"/branding/logo.webp",
	"/branding/services/sticker.avif",
	"/branding/services/nhan-chai-san-pham.avif",
	"/branding/logo.webp",
	"/branding/services/sticker.avif",
	"/branding/services/nhan-chai-san-pham.avif",
];

const HIGHLIGHTS = [
	{
		title: "Móc khóa mica là gì?",
		description:
			"Là phụ kiện từ acrylic trong suốt, bền đẹp, có thể in UV logo/hình ảnh với độ sắc nét cao.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Thiết kế linh hoạt",
		description:
			"Hỗ trợ file AI/PDF/PSD/PNG, cắt theo cutline riêng, tùy biến hình dạng theo mọi ý tưởng.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
	{
		title: "Quy trình sản xuất",
		description:
			"Kiểm tra file, in UV, cắt laser CNC, lắp phụ kiện và đóng gói cẩn thận trước khi giao hàng.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "Công năng nổi bật",
		description:
			"Phù hợp quà tặng cá nhân, merchandise fanclub, sự kiện thương hiệu và bán lẻ số lượng linh hoạt.",
		icon: <BoltIcon color="primary" />,
	},
];

const CUSTOM_BULLETS = [
	"Cá nhân hóa mạnh: in hình người thân, thú cưng, idol, mascot hoặc logo thương hiệu.",
	"Mica acrylic 3mm nhẹ, cứng cáp, bền màu, phù hợp dùng hằng ngày.",
	"MOQ từ 10 cái nên dễ test mẫu mới hoặc chạy chiến dịch nhỏ.",
	"Tùy chọn in 1 mặt/2 mặt, cán bóng/mờ theo định hướng thẩm mỹ.",
	"Đội ngũ INUT hỗ trợ kiểm tra file và tư vấn chỉnh sửa trước khi in.",
];

const PRODUCT_TYPES = [
	{
		name: "Quà tặng cá nhân",
		description: "Tạo keychain độc bản cho sinh nhật, kỷ niệm, cặp đôi hoặc nhóm bạn.",
		image: "/branding/services/sticker.avif",
	},
	{
		name: "Quà sự kiện",
		description: "Vật phẩm gọn nhẹ cho hội nghị, khai trương, booth activation và mini game.",
		image: "/branding/services/nhan-chai-san-pham.avif",
	},
	{
		name: "Merch fanclub",
		description:
			"Sản xuất theo series idol, anime, nhân vật cộng đồng với nhiều mẫu trong một đơn.",
		image: "/branding/logo.webp",
	},
	{
		name: "Branding doanh nghiệp",
		description: "In logo/slogan giúp tăng tần suất xuất hiện thương hiệu với chi phí tối ưu.",
		image: "/branding/services/sticker.avif",
	},
];

const TECHNICAL_OPTIONS = [
	"Định dạng file: AI, PDF, PSD hoặc PNG nền trong (transparent background).",
	"Độ phân giải đề xuất: tối thiểu 300 DPI tại kích thước thực tế.",
	"Chế độ màu: CMYK (khuyến nghị) để màu in trung thực hơn.",
	"Cutline tách layer riêng để máy laser cắt đúng đường viền thiết kế.",
	"Safe zone cách mép cắt 2–3mm để tránh cắt lẹm nội dung quan trọng.",
];

const APPLICATIONS = [
	{
		title: "Quà tặng sự kiện",
		description: "Món quà nhỏ gọn, dễ tặng, giúp người nhận ghi nhớ thương hiệu lâu hơn.",
		icon: <EventAvailableIcon color="primary" />,
	},
	{
		title: "Bán lẻ & merch",
		description: "Dễ mở rộng dòng sản phẩm fan merch, stationery, giftset theo từng mùa/chủ đề.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Branding chi phí thấp",
		description: "In logo, slogan trên vật phẩm dùng hằng ngày để tăng nhận diện liên tục.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Cá nhân hóa độc bản",
		description: "Tự do thể hiện cá tính qua artwork riêng với hình dạng và màu sắc tùy chỉnh.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
];

const MocKhoaMicaPage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "moc-khoa-mica",
			name: "Móc khóa mica",
			category: "Sản phẩm lưu niệm",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "Móc khóa mica in theo yêu cầu tại Đà Nẵng - INUT Design",
					description:
						"INUT Design nhận in móc khóa mica theo yêu cầu: in UV sắc nét, cắt laser chuẩn cutline, nhận từ 10 cái, phù hợp cá nhân, fanclub và doanh nghiệp.",
					url: "https://inutdesign.com/san-pham-luu-niem/moc-khoa-mica",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={CUSTOM_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<MocKhoaMicaTypesSection
						productTypes={PRODUCT_TYPES}
						technicalOptions={TECHNICAL_OPTIONS}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description="Liên hệ ngay để nhận báo giá móc khóa mica, tư vấn mẫu thiết kế và ưu đãi cho đơn hàng đầu tiên tại INUT Design."
						type={FormQuoteRequestType.MOC_KHOA_MICA}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

MocKhoaMicaPage.Layout = MainLayout;

export default MocKhoaMicaPage;
