import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import {
	ContactSection,
	HeroSection,
	InfoBoardTypesSection,
	IntroductionSection,
	ProductGallery,
	WhyInutSection,
} from "@/components/an-pham-van-phong/bang-cung-in-thong-tin";
import { UsagePurposeValue } from "@/models";
import { NextPageWithLayout } from "@/models/common";
import CampaignIcon from "@mui/icons-material/Campaign";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import StorefrontIcon from "@mui/icons-material/Storefront";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import BoltIcon from "@mui/icons-material/Bolt";
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
	"Bảng cứng in thông tin giúp trình bày nội dung rõ ràng tại quầy tư vấn, khu trưng bày và điểm bán.",
	"Phù hợp cho cửa hàng, văn phòng, trường học, F&B và các đơn vị tổ chức sự kiện tại Đà Nẵng.",
	"Hỗ trợ in theo kích thước linh hoạt và lựa chọn vật liệu bồi cứng theo mục tiêu sử dụng thực tế.",
	"Tối ưu thẩm mỹ nhận diện thương hiệu với bố cục rõ ràng, màu sắc đồng bộ và độ hoàn thiện cao.",
];

const HIGHLIGHTS = [
	{
		title: "Bảng cứng in thông tin là gì?",
		description:
			"Là ấn phẩm in được bồi lên vật liệu cứng để tăng độ đứng, độ bền và hiệu quả hiển thị thông tin tại điểm chạm.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Thiết kế đúng mục tiêu",
		description:
			"Tối ưu phân cấp nội dung, font chữ và khoảng cách đọc để người xem nắm thông tin nhanh chỉ trong vài giây.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
	{
		title: "Quy trình sản xuất rõ ràng",
		description:
			"In - cán - bồi cứng - cắt thành phẩm - kiểm tra chất lượng, giúp sản phẩm đồng đều và ổn định.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "Lợi ích vận hành",
		description:
			"Nâng độ chuyên nghiệp không gian bán hàng, hỗ trợ truyền thông ưu đãi và hướng dẫn khách hàng hiệu quả.",
		icon: <BoltIcon color="primary" />,
	},
];

const INFO_BOARD_TYPES = [
	{
		name: "Bảng giá & khuyến mãi",
		description: "Phù hợp cho quầy bán lẻ, giúp khách hàng nắm nhanh thông tin sản phẩm và ưu đãi.",
		image: "/branding/services/nhan-chai-san-pham.avif",
	},
	{
		name: "Bảng menu F&B",
		description: "Trình bày menu và combo nổi bật, tăng tốc độ chọn món tại quầy và bàn order.",
		image: "/branding/services/thiet-ke-in-an.avif",
	},
	{
		name: "Bảng hướng dẫn khu vực",
		description: "Tối ưu điều hướng trong văn phòng, showroom, trường học và không gian sự kiện.",
		image: "/branding/services/sticker.avif",
	},
	{
		name: "Bảng nhận diện thương hiệu",
		description: "Giữ hình ảnh thương hiệu nhất quán với màu sắc và thông điệp được chuẩn hóa.",
		image: "/branding/services/skin-laptop.avif",
	},
];

const SPEC_OPTIONS = [
	"Kích thước phổ biến: A4, A3, 40x60cm, 60x90cm hoặc theo yêu cầu thực tế.",
	"Vật liệu bồi cứng: formex 3mm/5mm, foam board hoặc nhựa PVC theo ngân sách.",
	"Bề mặt in: giấy couche, decal PP, cán màng bóng/mờ để tăng độ bền khi sử dụng.",
	"Yêu cầu file: AI/PDF vector hoặc PSD/PNG chất lượng cao, tối thiểu 300 DPI.",
	"Hệ màu: CMYK để kiểm soát màu in và độ đồng nhất giữa các đợt sản xuất.",
	"Khuyến nghị bố cục: phân cấp tiêu đề - nội dung chính - thông tin liên hệ rõ ràng.",
];

const TARGET_CUSTOMERS = [
	"cửa hàng bán lẻ",
	"quán cà phê và nhà hàng",
	"doanh nghiệp SME",
	"đơn vị tổ chức sự kiện",
	"trường học và trung tâm đào tạo",
];

const APPLICATIONS = [
	{
		title: "Điểm bán lẻ",
		description:
			"Trình bày bảng giá, chương trình khuyến mãi và thông báo quan trọng rõ ràng, dễ nhìn.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "F&B",
		description:
			"Menu và thông tin món được bố trí trực quan, cải thiện trải nghiệm gọi món tại quầy.",
		icon: <ViewAgendaIcon color="primary" />,
	},
	{
		title: "Sự kiện & activation",
		description:
			"Hỗ trợ điều hướng, phân khu và truyền tải thông điệp thương hiệu trong thời gian ngắn.",
		icon: <CampaignIcon color="primary" />,
	},
	{
		title: "Văn phòng & giáo dục",
		description: "Ứng dụng cho bảng nội quy, bảng hướng dẫn và bảng thông tin nội bộ lâu dài.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
];

const BangCungInThongTinPage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "bang-cung-in-thong-tin",
			name: "Bảng cứng in thông tin",
			category: "Ấn phẩm văn phòng",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "Bảng Cứng In Thông Tin Theo Yêu Cầu | INUT Design",
					description:
						"In bảng cứng in thông tin theo yêu cầu tại INUT Design: bền, rõ nét, phù hợp điểm bán, văn phòng và sự kiện. Tối thiểu từ 10 bảng, sản xuất nhanh 3-4 ngày tại Đà Nẵng.",
					url: "https://inutdesign.com/an-pham-van-phong/bang-cung-in-thong-tin",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={INTRO_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<InfoBoardTypesSection infoBoardTypes={INFO_BOARD_TYPES} specOptions={SPEC_OPTIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description={`Liên hệ INUT Design để nhận báo giá nhanh bảng cứng in thông tin, tư vấn vật liệu và bố cục phù hợp cho ${TARGET_CUSTOMERS.join(
							", "
						)}.`}
						type={UsagePurposeValue.BANG_CUNG_IN_THONG_TIN}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

BangCungInThongTinPage.Layout = MainLayout;

export default BangCungInThongTinPage;
