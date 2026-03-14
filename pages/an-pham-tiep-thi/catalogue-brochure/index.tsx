import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import {
	ComparisonSection,
	ContactSection,
	HeroSection,
	IntroductionSection,
	ProductGallery,
	ProductTypesSection,
	WhyInutSection,
} from "@/components/an-pham-tiep-thi/catalogue-brochure";
import { UsagePurposeValue } from "@/models";
import { NextPageWithLayout } from "@/models/common";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SpaIcon from "@mui/icons-material/Spa";
import CampaignIcon from "@mui/icons-material/Campaign";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BusinessIcon from "@mui/icons-material/Business";
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
	"Giới thiệu sản phẩm, dịch vụ một cách trực quan và hệ thống.",
	"Tăng tính chuyên nghiệp và độ tin cậy cho thương hiệu.",
	"Hỗ trợ đội ngũ bán hàng và tư vấn khách hàng.",
	"Tạo tài liệu phát tay tiện lợi tại cửa hàng, showroom, hội chợ, sự kiện.",
];

const HIGHLIGHTS = [
	{
		title: "Catalogue",
		description:
			"Ấn phẩm nhiều trang giới thiệu danh mục sản phẩm, dịch vụ chi tiết, có hệ thống. Giúp khách hàng dễ tìm hiểu và so sánh.",
		icon: <MenuBookIcon color="primary" />,
	},
	{
		title: "Brochure",
		description:
			"Ấn phẩm giới thiệu ngắn gọn, cô đọng (thường gấp 2, gấp 3). Phù hợp truyền tải nhanh thông điệp thương hiệu, dịch vụ.",
		icon: <AutoAwesomeMotionIcon color="primary" />,
	},
	{
		title: "Thiết kế chuẩn mực",
		description:
			"Bố cục rõ ràng, phân cấp thông tin hợp lý, hình ảnh sắc nét, màu sắc đồng bộ giúp nhận diện thương hiệu tốt nhất.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Chất liệu đa dạng",
		description:
			"Từ giấy Couche mịn màng, Bristol cứng cáp đến giấy mỹ thuật cao cấp dành cho những thiết kế sang trọng.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
];

const PRODUCT_TYPES = [
	{
		name: "Catalogue",
		description: "In nhiều trang, đóng ghim hoặc keo gáy chắc chắn. Phù hợp giới thiệu chi tiết danh mục sản phẩm.",
		image: "/branding/services/thiet-ke-in-an.avif",
	},
	{
		name: "Brochure",
		description: "In tờ gấp 2, gấp 3 hoặc ít trang. Gọn nhẹ, dễ phát tay, lan tỏa thông điệp sự kiện, dịch vụ.",
		image: "/branding/services/sticker.avif",
	},
];

const SPEC_OPTIONS = [
	"Kích thước Catalogue: A4, A5, Vuông hoặc tùy chỉnh theo concept.",
	"Kích thước Brochure: A4 gấp 2, gấp 3, hoặc kích thước tùy chỉnh.",
	"Tiêu chuẩn file: Độ phân giải 300 DPI, Hệ màu CMYK, Bleed (tràn lề) 3mm.",
	"Chất liệu bìa & ruột: Giấy Couche (phổ biến nhất), Bristol/Ivory (cứng cáp), Giấy mỹ thuật (cao cấp).",
	"Gia công sau in: Cán màng (bóng/mờ), bế khuôn, gấp, đóng ghim, đóng keo gáy.",
];

const COMPARISON_ROWS = [
	{ criteria: "Mục đích chính", catalogue: "Giới thiệu danh mục sản phẩm, dịch vụ chi tiết", brochure: "Giới thiệu nhanh thương hiệu, dịch vụ hoặc chương trình" },
	{ criteria: "Số lượng nội dung", catalogue: "Nhiều, có hệ thống", brochure: "Ngắn gọn, cô đọng" },
	{ criteria: "Số trang / kết cấu", catalogue: "Nhiều trang, thường đóng ghim hoặc keo gáy", brochure: "Thường gấp 2, gấp 3 hoặc ít trang" },
	{ criteria: "Tính ứng dụng", catalogue: "Bán hàng, tư vấn, trưng bày tại showroom, gửi khách", brochure: "Phát tay, sự kiện, giới thiệu nhanh, marketing trực tiếp" },
	{ criteria: "Phong cách trình bày", catalogue: "Chi tiết, đầy đủ, chuyên nghiệp", brochure: "Ngắn gọn, nổi bật, dễ tiếp cận" },
];

const COMPARISON_RECOMMENDATION =
	"Nếu bạn cần giới thiệu đầy đủ danh mục sản phẩm, catalogue sẽ phù hợp hơn. Nếu mục tiêu là truyền tải thông tin ngắn gọn, dễ phát, dễ tiếp cận, hãy chọn brochure.";

const TARGET_CUSTOMERS = [
	"doanh nghiệp",
	"cửa hàng / showroom",
	"spa / thẩm mỹ",
	"tổ chức sự kiện",
];

const APPLICATIONS = [
	{
		title: "Doanh nghiệp & Công ty",
		description:
			"Hồ sơ năng lực (Profile), Catalogue giới thiệu sản phẩm dịch vụ cho đối tác, khách hàng.",
		icon: <BusinessIcon color="primary" />,
	},
	{
		title: "Cửa hàng & Showroom",
		description:
			"Catalogue bộ sưu tập, menu dịch vụ, bảng giá chi tiết tại điểm bán lẻ.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Sự kiện & Triển lãm",
		description:
			"Brochure phát tay nhanh chóng, ấn tượng, thu hút khách hàng tham quan gian hàng.",
		icon: <CampaignIcon color="primary" />,
	},
	{
		title: "Spa, Du lịch & Dịch vụ",
		description:
			"Brochure giới thiệu gói dịch vụ, tour du lịch, liệu trình làm đẹp gọn gàng, trực quan.",
		icon: <SpaIcon color="primary" />,
	},
];

const CatalogueBrochurePage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "catalogue-brochure",
			name: "In Catalogue, Brochure",
			category: "Ấn phẩm tiếp thị",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "In Catalogue, Brochure Chuyên Nghiệp Theo Yêu Cầu | INUT Design Đà Nẵng",
					description:
						"Dịch vụ in Catalogue, Brochure chuyên nghiệp tại Đà Nẵng: thiết kế đẹp, gia công chỉn chu, hình ảnh sắc nét. Nâng tầm thương hiệu, hỗ trợ bán hàng hiệu quả.",
					url: "https://inutdesign.com/an-pham-tiep-thi/catalogue-brochure",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={INTRO_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductTypesSection productTypes={PRODUCT_TYPES} specOptions={SPEC_OPTIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ComparisonSection rows={COMPARISON_ROWS} recommendation={COMPARISON_RECOMMENDATION} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description={`Liên hệ INUT Design để được tư vấn mẫu Catalogue, Brochure phù hợp, chọn chất liệu và báo giá nhanh chóng cho ${TARGET_CUSTOMERS.join(
							", "
						)}.`}
						type={UsagePurposeValue.CATALOGUE_BROCHURE}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

CatalogueBrochurePage.Layout = MainLayout;

export default CatalogueBrochurePage;
