import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { UsagePurposeValue } from "@/models";
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
import { HeroSection } from "@/components/san-pham-luu-niem/pin-cai-ao-mica/HeroSection";
import { IntroductionSection } from "@/components/san-pham-luu-niem/pin-cai-ao-mica/IntroductionSection";
import { PinBadgeTypesSection } from "@/components/san-pham-luu-niem/pin-cai-ao-mica/PinBadgeTypesSection";
import { WhyInutSection } from "@/components/san-pham-luu-niem/pin-cai-ao-mica/WhyInutSection";
import { ContactSection } from "@/components/skin-laptop-customize/ContactSection";
import { ProductGallery } from "@/components/skin-laptop-customize/ProductGallery";

const HERO_IMAGE = "/branding/logo.webp";

const GALLERY_IMAGES = [
	"/branding/services/sticker.avif",
	"/branding/logo.webp",
	"/branding/hero-bg.webp",
	"/branding/logo.webp",
	"/branding/services/sticker.avif",
	"/branding/logo.webp",
	"/branding/hero-bg.webp",
	"/branding/logo.webp",
	"/branding/services/sticker.avif",
	"/branding/logo.webp",
];

const HIGHLIGHTS = [
	{
		title: "Pin acrylic là gì?",
		description:
			"Sản phẩm lưu niệm từ mica trong suốt, in UV trực tiếp cho màu sắc rực và độ bền cao.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Thiết kế linh hoạt",
		description: "Hỗ trợ tròn, vuông, bo góc hoặc die cut theo hình bất kỳ đúng cutline thiết kế.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
	{
		title: "Quy trình sản xuất",
		description: "Kiểm tra file, in UV, cắt laser, gắn kim cài và QC từng sản phẩm trước khi giao.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "Công năng",
		description:
			"Phù hợp fan merch, quà sự kiện, nhận diện thương hiệu và chiến dịch truyền thông.",
		icon: <BoltIcon color="primary" />,
	},
];

const CUSTOM_BULLETS = [
	"Pin cài áo acrylic nhỏ gọn, bắt mắt, phù hợp cá nhân hóa theo từng ý tưởng.",
	"Công nghệ in UV giúp màu bền, sắc nét và chống phai trong quá trình sử dụng.",
	"Có thể sản xuất số lượng nhỏ từ 10 cái, phù hợp cho cá nhân và doanh nghiệp nhỏ.",
	"Hỗ trợ tư vấn cutline, white ink layer và chuẩn file trước khi in.",
	"Sản xuất nhanh trong 3-4 ngày làm việc tại Đà Nẵng và giao hàng toàn quốc.",
];

const PIN_BADGE_TYPES = [
	{
		name: "Fanclub & nghệ sĩ",
		description: "Sản xuất fan merch theo artwork riêng, phù hợp concert, fan meeting, minigame.",
		image: HERO_IMAGE,
	},
	{
		name: "Doanh nghiệp & sự kiện",
		description:
			"Pin nhận diện nhân sự, quà tặng hội nghị hoặc phụ kiện đồng phục cho sự kiện thương hiệu.",
		image: HERO_IMAGE,
	},
	{
		name: "Shop thời trang",
		description: "Bổ sung dòng phụ kiện nhỏ gọn, tăng giá trị đơn hàng và nhận diện cửa hàng.",
		image: HERO_IMAGE,
	},
	{
		name: "Cộng đồng sáng tạo",
		description: "Phù hợp illustrator, creator muốn bán pin theo bộ sưu tập cá nhân.",
		image: HERO_IMAGE,
	},
];

const SPEC_ITEMS = [
	"Chất liệu: Acrylic trong suốt cao cấp, dày 3mm.",
	"In UV trực tiếp với độ phân giải khuyến nghị từ 300 DPI.",
	"Định dạng file: AI, PDF, EPS hoặc PNG nền trong suốt.",
	"Bleed khuyến nghị 2-3mm và tách cutline thành layer riêng.",
	"Nền trắng cần chuẩn bị white ink layer để hiển thị đúng trên mica trong.",
	"Hoàn thiện với kim cài an toàn (safety pin) chắc chắn.",
];

const APPLICATIONS = [
	{
		title: "Merch cá nhân",
		description: "Tạo bộ pin độc bản cho nghệ sĩ, creator, fanclub hoặc cộng đồng riêng.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Quà tặng thương hiệu",
		description: "Giải pháp quà nhỏ gọn giúp logo và thông điệp thương hiệu tiếp cận thường xuyên.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Sự kiện nhận diện",
		description: "Dùng làm pin phân loại đội ngũ, khách mời hoặc quà lưu niệm chương trình.",
		icon: <EventAvailableIcon color="primary" />,
	},
	{
		title: "Bán lẻ phụ kiện",
		description:
			"Dễ đóng gói, dễ bán theo set, tăng doanh thu cho cửa hàng phụ kiện và văn phòng phẩm.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
];

const PinCaiAoMicaPage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "pin-cai-ao-mica",
			name: "Pin cài áo mica",
			category: "Sản phẩm lưu niệm",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "Pin Cài Áo Acrylic Theo Yêu Cầu — In Ấn Chất Lượng Cao Tại Đà Nẵng | INUT Design",
					description:
						"In pin cài áo acrylic theo yêu cầu tại INUT Design: in UV sắc nét, cắt chính xác, sản xuất nhanh 3-4 ngày, số lượng linh hoạt từ 10 cái.",
					url: "https://inutdesign.com/san-pham-luu-niem/pin-cai-ao-mica",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={CUSTOM_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<PinBadgeTypesSection pinBadgeTypes={PIN_BADGE_TYPES} specItems={SPEC_ITEMS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description="Liên hệ ngay để nhận báo giá pin cài áo acrylic nhanh và tư vấn quy cách phù hợp nhất với nhu cầu của bạn."
						type={UsagePurposeValue.PIN_CAI_AO_MICA}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

PinCaiAoMicaPage.Layout = MainLayout;

export default PinCaiAoMicaPage;
