import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import {
	ContactSection,
	HeroSection,
	IntroductionSection,
	PrintServicesSection,
	ProductGallery,
	WhyInutSection,
} from "@/components/in-anh";
import { FormQuoteRequestType } from "@/models";
import { NextPageWithLayout } from "@/models/common";
import { Box, Container, Divider } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CollectionsIcon from "@mui/icons-material/Collections";
import React from "react";

const HERO_IMAGE = "/branding/logo.webp";

const GALLERY_IMAGES = Array.from({ length: 17 }).map(() => HERO_IMAGE);

const HIGHLIGHTS = [
	{
		title: "In ảnh kỹ thuật số là gì?",
		description:
			"Là phương pháp in hiện đại cho chất lượng hình ảnh sắc nét, màu sắc trung thực và thời gian xử lý nhanh.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Thiết kế",
		description:
			"Hỗ trợ in ảnh chân dung, ảnh sản phẩm, ảnh sự kiện và ảnh trang trí với nhiều quy cách kích thước khác nhau.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
	{
		title: "Quy trình sản xuất",
		description:
			"Nhận file, kiểm tra màu, in kỹ thuật số và hoàn thiện thành phẩm nhanh chóng để đáp ứng đúng tiến độ.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "Công năng",
		description:
			"Phù hợp cho nhu cầu cá nhân, quà tặng, trưng bày cửa hàng, truyền thông sự kiện và sản phẩm bán lẻ.",
		icon: <BoltIcon color="primary" />,
	},
];

const CUSTOM_BULLETS = [
	"In ảnh nhanh, linh hoạt số lượng từ ít đến nhiều theo mục tiêu sử dụng thực tế.",
	"Màu sắc rõ ràng, bề mặt in đẹp và đồng đều giữa các bản in cùng một lô.",
	"Đa dạng quy cách thành phẩm: ảnh rời, ảnh trưng bày, ảnh sự kiện, ảnh tặng khách hàng.",
	"Tối ưu chi phí cho cá nhân, studio, shop online và doanh nghiệp tổ chức sự kiện.",
	"Đặt hàng nhanh: gửi file ảnh, số lượng và kích thước mong muốn để INUT tư vấn và triển khai.",
];

const PRINT_SERVICES = [
	{
		name: "Ảnh kỷ niệm cá nhân",
		description:
			"Lưu giữ khoảnh khắc gia đình, du lịch, chân dung với chất lượng in sắc nét và bền màu.",
		image: HERO_IMAGE,
	},
	{
		name: "Ảnh sự kiện",
		description:
			"In nhanh ảnh cho workshop, triển lãm, khai trương và các chiến dịch truyền thông ngắn hạn.",
		image: HERO_IMAGE,
	},
	{
		name: "Ảnh trưng bày",
		description:
			"Phù hợp cho cửa hàng, quán cà phê, studio cần hình ảnh trực quan để tăng trải nghiệm khách hàng.",
		image: HERO_IMAGE,
	},
	{
		name: "Ảnh phục vụ bán lẻ",
		description:
			"Triển khai theo bộ ảnh sản phẩm hoặc ảnh decor để gia tăng giá trị đơn hàng tại điểm bán.",
		image: HERO_IMAGE,
	},
];

const SIZE_OPTIONS = [
	"Kích thước 10 x 15 cm - Phù hợp in ảnh kỷ niệm và ảnh tặng khách hàng với chi phí tối ưu.",
	"Kích thước 13 x 18 cm - Cân bằng tốt giữa độ chi tiết hình ảnh và mức giá cho nhu cầu phổ thông.",
	"Kích thước A4 (210 x 297 mm) - Phù hợp ảnh trưng bày, ảnh sản phẩm và ảnh truyền thông tại điểm bán.",
];

const APPLICATIONS = [
	{
		title: "Ảnh cá nhân, gia đình",
		description: "Lưu giữ kỷ niệm theo phong cách riêng với chất lượng ảnh đồng đều và đẹp mắt.",
		icon: <CollectionsIcon color="primary" />,
	},
	{
		title: "Sự kiện, triển lãm",
		description:
			"Hỗ trợ in nhanh để kịp timeline tổ chức, giúp truyền tải thông điệp trực quan hơn.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Trưng bày cửa hàng",
		description:
			"Tăng điểm nhấn không gian và cải thiện trải nghiệm hình ảnh tại quầy/khu vực sản phẩm.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Sản phẩm bán lẻ",
		description:
			"Bổ sung danh mục ảnh in theo chủ đề để gia tăng doanh thu và tần suất quay lại của khách.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
];

const InAnhPage: NextPageWithLayout = () => {
	return (
		<>
			<Seo
				data={{
					title: "In ảnh kỹ thuật số theo yêu cầu tại Đà Nẵng - INUT Design",
					description:
						"Dịch vụ in ảnh kỹ thuật số theo yêu cầu tại Đà Nẵng, INUT Design: in nhanh, màu sắc trung thực, đa dạng kích thước và số lượng linh hoạt cho cá nhân, sự kiện và kinh doanh.",
					url: "https://inutdesign.com/in-anh",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={CUSTOM_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<PrintServicesSection services={PRINT_SERVICES} sizeOptions={SIZE_OPTIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description="Liên hệ ngay để nhận báo giá in ảnh kỹ thuật số nhanh và tư vấn quy cách phù hợp nhất với nhu cầu của bạn."
						type={FormQuoteRequestType.IN_ANH}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

InAnhPage.Layout = MainLayout;

export default InAnhPage;
