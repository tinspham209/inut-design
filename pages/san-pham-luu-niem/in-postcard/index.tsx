import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import {
	ContactSection,
	HeroSection,
	IntroductionSection,
	InPostcardPaperTypesSection,
	ProductGallery,
	WhyInutSection,
} from "@/components/san-pham-luu-niem/in-postcard";
import { UsagePurposeValue } from "@/models";
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
		title: "Nhỏ gọn, dễ bảo quản",
		description:
			"Kích thước vừa vặn (A6, 10x15cm) để nằm trọn trong túi quà hay kẹp vào sổ tay.",
		icon: <BoltIcon color="primary" />,
	},
	{
		title: "Thẩm mỹ cao",
		description:
			"Thiết kế 1 hoặc 2 mặt với hình ảnh, artwork hay thông điệp đẹp mắt truyền cảm hứng.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Đa dạng hóa chất liệu",
		description:
			"Từ giấy Couche cơ bản đến giấy mỹ thuật có vân sần, mang lại xúc cảm đa dạng.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
	{
		title: "Công năng linh hoạt",
		description:
			"Thiệp cảm ơn, quà tặng kèm, ấn phẩm trang trí, ảnh sưu tầm hoặc merch fanclub.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
];

const CUSTOM_BULLETS = [
	"Độ phân giải yêu cầu 300 DPI, màu CMYK để hiển thị chuẩn xác nhất khi ra thành phẩm.",
	"Kích thước chuẩn: A6 (105 x 148 mm), 10 x 15 cm, 12 x 17 cm hoặc theo kích thước riêng.",
	"Tùy chọn gia công: cán bóng, mờ, bo góc, ép kim để tăng độ nổi bật.",
	"MOQ chỉ từ 10 mẫu để dễ dàng ra mắt bộ sưu tập.",
	"Sử dụng chất liệu giấy phù hợp từ thông dụng (Couche, Ivory, Bristol) đến Giấy mỹ thuật.",
];

const PAPER_TYPES = [
	{
		name: "Postcard giấy thông dụng",
		description: "Các loại giấy phổ biến như Couche, Ivory, Bristol với bề mặt quen thuộc, dễ in và dễ tối ưu chi phí.",
		pros: [
			"Chi phí in ấn hợp lý",
			"Màu sắc rõ nét, đồng đều",
			"Dễ dàng sản xuất số lượng nhiều",
		],
		bestFor: "Thương mại, tặng kèm, bán số lượng lớn hoặc chiến dịch ngắn hạn.",
	},
	{
		name: "Postcard giấy mỹ thuật",
		description: "Nhóm giấy có bề mặt, vân giấy hoặc màu sắc đặc biệt. Tạo cảm giác cao cấp, độc đáo và có chiều sâu.",
		pros: [
			"Tạo cảm giác sang và tinh tế",
			"Bề mặt có chất riêng, cầm 'đã tay'",
			"Phù hợp cho cả các thiết kế tối giản nhất",
		],
		bestFor: "Quà tặng, lưu niệm, sưu tầm, thiệp chúc hoặc concept riêng.",
	},
];

const APPLICATIONS = [
	{
		title: "Quà tặng kèm sản phẩm",
		description: "Tăng trải nghiệm khi đập hộp, ghi dấu ấn trong lòng khách hàng.",
		icon: <EventAvailableIcon color="primary" />,
	},
	{
		title: "Bán lẻ & Merchandise",
		description: "In các mẫu artwork, fanart hay hình ảnh idol cho các nhóm fanclub.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Sự kiện & Workshop",
		description: "Làm thẻ lưu niệm hoặc thank you card cho khách mời tham dự.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Branding thương hiệu",
		description: "Lan tỏa thông điệp của studio, tiệm bánh, cửa hàng một cách mộc mạc.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
];

const InPostcardPage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "in-postcard",
			name: "In Postcard",
			category: "Sản phẩm lưu niệm",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "In Postcard tại Đà Nẵng: Đa Dạng Giấy Mỹ Thuật & Thông Dụng – INUT Design",
					description:
						"Dịch vụ in postcard tại Đà Nẵng. Mẫu mã đa dạng: giấy mỹ thuật, giấy thông dụng. Phù hợp cho quà tặng, sự kiện, merch fanclub với giá cạnh tranh, in sắc nét.",
					url: "https://inutdesign.com/san-pham-luu-niem/in-postcard",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={CUSTOM_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<InPostcardPaperTypesSection paperTypes={PAPER_TYPES} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description="Liên hệ ngay để nhận tư vấn giấy in postcard cao cấp, chọn khổ in và nhận báo giá ưu đãi."
						type={UsagePurposeValue.IN_POSTCARD}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

InPostcardPage.Layout = MainLayout;

export default InPostcardPage;
