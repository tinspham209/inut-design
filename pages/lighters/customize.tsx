import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { Box, Container, Divider } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CampaignIcon from "@mui/icons-material/Campaign";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import React from "react";
import {
	HeroSection,
	IntroductionSection,
	LighterTypesSection,
	ProductGallery,
	WhyInutSection,
} from "./components/customize";
import { FormQuoteRequestType } from "@/models/quoteRequest";
import { ContactSection } from "../macnut/components/customize";

const HERO_IMAGE = "/branding/logo.webp";

const GALLERY_IMAGES = Array.from({ length: 17 }).map(() => HERO_IMAGE);

const HIGHLIGHTS = [
	{
		title: "Chất lượng bền bỉ",
		description: "Bật lửa in màu sắc rõ nét, bền đẹp và khó phai.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "In nhanh - giao đúng hẹn",
		description: "Xử lý đơn nhanh, hỗ trợ tiến độ gấp cho sự kiện.",
		icon: <BoltIcon color="primary" />,
	},
	{
		title: "Thiết kế theo yêu cầu",
		description: "Tư vấn layout miễn phí, tùy chỉnh logo và thông điệp.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Giá tốt theo số lượng",
		description: "Giá tốt - số lượng lẻ hay sỉ đều nhận.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
];

const CUSTOM_BULLETS = [
	"Phôi in là thương hiệu bật lửa Cricket nổi tiếng đến từ Pháp",
	"Custom theo yêu cầu - không giới hạn",
	"Sỉ bật lửa cho các shop mở rộng doanh thu",
	"Phù hợp làm quà tặng, đồ decor hoặc dùng cá nhân",
	"In nhanh - thiết kế theo ý bạn - không giới hạn mẫu mã",
	"Giá tốt - số lượng lẻ hay sỉ đều nhận",
];

const LIGHTER_TYPES = [
	{
		name: "Cricket - in màu thường",
		description: "Bật lửa size tiêu chuẩn, in màu sắc rõ nét, phù hợp mọi thiết kế",
		image: HERO_IMAGE,
	},
	{
		name: "Cricket - in màu chrome bóng",
		description: "Lớp phủ chrome bóng sang trọng, tạo hiệu ứng kim loại cao cấp",
		image: HERO_IMAGE,
	},
	{
		name: "Cricket mini - in màu thường",
		description: "Kích thước nhỏ gọn, tiện lợi mang theo, in màu sắc nét",
		image: HERO_IMAGE,
	},
	{
		name: "Cricket mini - in màu chrome bóng",
		description: "Mini size kết hợp chrome bóng, sang trọng và độc đáo",
		image: HERO_IMAGE,
	},
];

const COATING_OPTIONS = [
	"Lớp phủ mờ (Matte) - Sang trọng, hạn chế vân tay",
	"Lớp phủ kim tuyến (Glitter) - Lấp lánh, thu hút ánh nhìn",
	"Lớp phủ bóng (Glossy) - Màu sắc rực rỡ, nổi bật",
];

const APPLICATIONS = [
	{
		title: "Sự kiện, triển lãm",
		description: "Gia tăng nhận diện thương hiệu.",
		icon: <EventAvailableIcon color="primary" />,
	},
	{
		title: "Quà tặng quảng cáo",
		description: "Món quà đơn giản tăng tính trải nghiệm.",
		icon: <CampaignIcon color="primary" />,
	},
	{
		title: "Sản phẩm bán lẻ",
		description: "Giúp các shop mở rộng doanh thu của hàng.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Sản phẩm cá nhân",
		description: "Giúp nổi bật cá tính của bản thân.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
];

const CONTACTS = [
	{
		name: "MR. TOM",
		role: "INUT Product Manager",
		roleBadge: "INUT PRODUCT\nMANAGER",
		phone: "0792359996",
		displayPhone: "0792 359 996",
		photoUrl: "/lighters-storage/contact-1.avif",
	},
	{
		name: "MS. BOO",
		role: "INUT Sale Manager",
		roleBadge: "INUT SALE\nMANAGER",
		phone: "0777208215",
		displayPhone: "0777 208 215",
		photoUrl: "/lighters-storage/contact-2.avif",
	},
];

const LightersCustomizePage: NextPageWithLayout = () => {
	return (
		<>
			<Seo
				data={{
					title: "Bật lửa custom theo yêu cầu - INUT Design",
					description:
						"Dịch vụ in bật lửa custom tại Đà Nẵng. Chất lượng cao, thiết kế theo yêu cầu, giao nhanh và giá tốt theo số lượng.",
					url: "https://inutdesign.com/lighters/customize",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={CUSTOM_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<LighterTypesSection lighterTypes={LIGHTER_TYPES} coatingOptions={COATING_OPTIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description="Liên hệ ngay để nhận báo giá nhanh và tư vấn mẫu thiết kế phù hợp nhất với nhu cầu của bạn."
						type={FormQuoteRequestType.LIGHTER_CUSTOMIZE}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

LightersCustomizePage.Layout = MainLayout;

export default LightersCustomizePage;
