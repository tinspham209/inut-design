import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import {
	CardTypesSection,
	ComparisonSection,
	ContactSection,
	HeroSection,
	IntroductionSection,
	ProductGallery,
	WhyInutSection,
} from "@/components/an-pham-tiep-thi/in-card-visit";
import { UsagePurposeValue } from "@/models";
import { NextPageWithLayout } from "@/models/common";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PaletteIcon from "@mui/icons-material/Palette";
import SpeedIcon from "@mui/icons-material/Speed";
import VerifiedIcon from "@mui/icons-material/Verified";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SpaIcon from "@mui/icons-material/Spa";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
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
];

const INTRO_BULLETS = [
	"Kết nối thông tin liên lạc (họ tên, SĐT, Email, Địa chỉ, QR code).",
	"Đóng vai trò quan trọng trong bộ nhận diện thương hiệu.",
	"Tạo ấn tượng chuyên nghiệp trong giao tiếp, networking.",
	"Giúp người nhận dễ lưu lại thông tin một cách trực quan.",
];

const HIGHLIGHTS = [
	{
		title: "Chuyên Nghiệp",
		description:
			"Thể hiện vị thế thương hiệu cá nhân hoặc doanh nghiệp ngay từ lần đầu tiên gặp mặt.",
		icon: <VerifiedIcon color="primary" />,
	},
	{
		title: "Đa Dạng Chất Liệu",
		description:
			"Từ giấy Couche phổ thông, giấy Kraft mộc mạc đến giấy mỹ thuật cao cấp và thẻ nhựa PVC hiện đại.",
		icon: <PaletteIcon color="primary" />,
	},
	{
		title: "Thiết Kế Đậm Dấu Ấn",
		description:
			"Bố cục gọn gàng, cân đối, thể hiện cá tính riêng biệt khó nhầm lẫn.",
		icon: <DoneAllIcon color="primary" />,
	},
	{
		title: "Sản Xuất Nhanh",
		description:
			"Hỗ trợ in số lượng từ 10 cái, thời gian hoàn thiện chỉ từ 3-4 ngày làm việc.",
		icon: <SpeedIcon color="primary" />,
	},
];

const CARD_TYPES = [
	{
		name: "Card visit giấy",
		description: "Đa dạng các loại giấy từ Couche, Bristol đến Kraft và giấy mỹ thuật. Phù hợp cho nhiều ngành nghề với chi phí tối ưu.",
		image: "/branding/services/thiet-ke-in-an.avif",
	},
	{
		name: "Card visit nhựa (PVC)",
		description: "Siêu bền, chống nước tuyệt đối, cảm giác hiện đại và cao cấp. Phù hợp cho thẻ thành viên hoặc danh thiếp sử dụng lâu dài.",
		image: "/branding/services/sticker.avif",
	},
];

const SPEC_OPTIONS = [
	"Kích thước chuẩn: 9 x 5.4 cm hoặc 8.8 x 5.3 cm.",
	"File thiết kế: 300 DPI, Hệ màu CMYK, Bleed 3mm.",
	"Gia công: Cán mờ/bóng, ép kim logo, dập nổi, bo góc, phủ UV định vị.",
	"Yêu cầu nội dung: Logo, tên, chức vụ, SĐT, Email, Địa chỉ, QR code.",
];

const COMPARISON_ROWS = [
	{ criteria: "Độ bền", paper: "Trung bình", artPaper: "Tốt", pvc: "Tuyệt đối (chống nước)" },
	{ criteria: "Cảm giác cầm", paper: "Quen thuộc", artPaper: "Sang trọng, có vân", pvc: "Cứng cáp, hiện đại" },
	{ criteria: "Khả năng in", paper: "Sắc nét, màu tươi", artPaper: "Màu trầm, nghệ thuật", pvc: "Màu sắc nổi bật" },
	{ criteria: "Chi phí", paper: "Kinh tế nhất", artPaper: "Cao cấp", pvc: "Đầu tư dài hạn" },
];

const COMPARISON_RECOMMENDATION =
	"Hãy chọn giấy Couche/Bristol nếu bạn cần số lượng lớn với chi phí tốt. Chọn giấy mỹ thuật cho các thương hiệu cần sự tinh tế, sang trọng. Chọn nhựa PVC nếu bạn muốn sự khác biệt và độ bền trọn đời.";

const APPLICATIONS = [
	{
		title: "Cá nhân & Freelancer",
		description: "Xây dựng thương hiệu cá nhân chuyên nghiệp cho designer, photographer, marketer.",
		icon: <CameraAltIcon color="primary" />,
	},
	{
		title: "Doanh nghiệp & Startup",
		description: "Đồng bộ nhận diện cho đội ngũ kinh doanh, quản lý và đối ngoại.",
		icon: <BusinessCenterIcon color="primary" />,
	},
	{
		title: "Cửa hàng & Local Brand",
		description: "Thông tin liên hệ, thẻ tích điểm hoặc card cảm ơn gửi kèm sản phẩm.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Dịch vụ Cao cấp",
		description: "Danh thiếp sang trọng cho Spa, Thẩm mỹ viện, Studio nghệ thuật.",
		icon: <SpaIcon color="primary" />,
	},
];

const InCardVisitPage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "in-card-visit",
			name: "In Card Visit",
			category: "Ấn phẩm tiếp thị",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "In Card Visit Tại Đà Nẵng Chuyên Nghiệp Theo Yêu Cầu | INUT Design",
					description:
						"Dịch vụ in card visit (danh thiếp) tại Đà Nẵng: thiết kế chuyên nghiệp, in sắc nét, tùy chọn đa dạng chất liệu giấy/nhựa. Gia công mờ, bóng, ép kim sang trọng.",
					url: "https://inutdesign.com/an-pham-tiep-thi/in-card-visit",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={INTRO_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<CardTypesSection cardTypes={CARD_TYPES} specOptions={SPEC_OPTIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ComparisonSection rows={COMPARISON_ROWS} recommendation={COMPARISON_RECOMMENDATION} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description={`Liên hệ INUT Design ngay để được tư vấn mẫu Card Visit phù hợp, chọn chất liệu, phong cách thiết kế và nhận báo giá nhanh chóng cho dự án của bạn.`}
						type={UsagePurposeValue.IN_CARD_VISIT}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

InCardVisitPage.Layout = MainLayout;

export default InCardVisitPage;
