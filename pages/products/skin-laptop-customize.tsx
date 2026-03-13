import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { Box, Container, Divider } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import React, { useEffect } from "react";
import { trackViewProduct } from "@/utils/analytics";
import {
	HeroSection,
	IntroductionSection,
	SkinLaptopTypesSection,
	ProductGallery,
	WhyInutSection,
	ContactSection,
} from "../../components/skin-laptop-customize";
import { FormQuoteRequestType } from "@/models/quoteRequest";

const HERO_IMAGE = "/branding/logo.webp";

// Using placeholder images for gallery as well, can be swapped with actual skin laptop image urls
const GALLERY_IMAGES = Array.from({ length: 17 }).map(() => HERO_IMAGE);

const HIGHLIGHTS = [
	{
		title: "Chất lượng màng dán",
		description: "Decal 3M cao cấp, không để lại keo dư, dễ dán và cực dễ bóc.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "In ấn sắc nét",
		description: "Công nghệ in UV tiên tiến, màu đẹp mịn và không phai theo thời gian.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
	{
		title: "Thiết kế độc bản",
		description: "Tự tạo thiết kế theo ý thích cá nhân, bộc lộ cá tính riêng biệt.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Bảo vệ toàn diện",
		description: "Chống trầy xước, bụi bẩn, bảo vệ ngoại hình máy tuyệt đối.",
		icon: <BoltIcon color="primary" />,
	},
];

const CUSTOM_BULLETS = [
	"Custom mọi dòng máy: Macbook, Dell, HP, Asus, Lenovo, Acer, MSI...",
	"Vật liệu Decal chuyên dụng có cấu trúc tản nhiệt, không lo nóng máy",
	"Công nghệ in đạt chuẩn sắc độ tươi tắn và độ phân giải cao",
	"Thiết kế sẵn rãnh thoát khí dưới lớp keo giúp tự dán cực kỳ dễ dàng",
	"File cắt CNC chính xác 99% theo kích thước cụ thể từng mẫu máy",
	"Tư vấn chỉnh sửa hình ảnh miễn phí đến khi khách hàng ưng ý",
];

const SKIN_TYPES = [
	{
		name: "Skin Laptop Nhám (Matte)",
		description: "Bề mặt Matte chống bám mồ hôi, vân tay, mang lại cảm giác cầm êm tay, sang trọng",
		image: HERO_IMAGE,
	},
	{
		name: "Skin Laptop Bóng (Glossy)",
		description: "Màng bóng rực rỡ, giúp làm nổi bật sâu sắc các mảng màu sắc trên thiết kế gốc",
		image: HERO_IMAGE,
	},
	{
		name: "Skin Laptop Texture",
		description: "Sử dụng vật liệu có hiệu ứng bề mặt như giả carbon, kim loại, hoặc vân nổi",
		image: HERO_IMAGE,
	},
	{
		name: "Skin Cắt Tỉa Theo Yêu Cầu",
		description:
			"Cắt sát layout logo hoặc viền chi tiết lạ mắt, tạo hình dán đa dạng ngoài kích thước chung",
		image: HERO_IMAGE,
	},
];

const COATING_OPTIONS = [
	"Decal 3M nhập khẩu - Lột ra không bám keo, tuổi thọ sử dụng lên tới nhiều năm",
	"Màng bảo vệ chuyên dụng - Chống tia UV giữ màu luôn mới, bảo vệ mặt in khỏi xước dăm",
	"Cắt CNC gia công sẵn - Chuẩn xác mọi góc bo, logo; khi nhận chỉ việc lột và dán",
];

const APPLICATIONS = [
	{
		title: "Thể hiện cá tính",
		description: "Giúp chiếc laptop trở nên ấn tượng, không đụng hàng.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Quà tặng doanh nghiệp",
		description: "Phát triển thương hiệu công ty đồng bộ cho máy tính nhân sự.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Sự kiện quảng bá",
		description: "Tạo dấu ấn tại các sự kiện công nghệ hoặc ra mắt dự án.",
		icon: <EventAvailableIcon color="primary" />,
	},
	{
		title: "Bảo vệ tài sản",
		description: "Giữ vỏ máy luôn như mới mẻ khi có ý định nhượng lại.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
];

const SkinLaptopCustomizePage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "skin-laptop-customize",
			name: "Skin Laptop",
			category: "Skin Laptop",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "Skin Laptop Custom theo yêu cầu - INUT Design",
					description:
						"Dịch vụ in Skin Laptop theo yêu cầu. Decal 3M cao cấp, in UV sắc nét, cắt CNC chuẩn xác 99% cho mọi dòng máy như Macbook, Dell, HP, Asus...",
					url: "https://inutdesign.com/products/skin-laptop-customize",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={CUSTOM_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<SkinLaptopTypesSection skinTypes={SKIN_TYPES} coatingOptions={COATING_OPTIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection type={FormQuoteRequestType.LAPTOP_CUSTOMIZE} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

SkinLaptopCustomizePage.Layout = MainLayout;

export default SkinLaptopCustomizePage;
