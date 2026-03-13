import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import {
	ContactSection,
	HeroSection,
	IntroductionSection,
	ProductGallery,
	StickerMagnetTypesSection,
	WhyInutSection,
} from "@/components/sticker/sticker-magnet";
import { FormQuoteRequestType } from "@/models";
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

const HERO_IMAGE = "/branding/logo.webp";

const GALLERY_IMAGES = Array.from({ length: 17 }).map(() => HERO_IMAGE);

const HIGHLIGHTS = [
	{
		title: "Sticker Magnet là gì?",
		description:
			"Sticker Magnet (Sticker nam châm) là decal tích hợp lớp nam châm dẻo, bám trên bề mặt kim loại mà không cần keo dính.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Thiết kế",
		description:
			"Hỗ trợ đa dạng thiết kế từ logo, chữ nghệ thuật đến hình ảnh phức tạp với đường cắt chuẩn xác theo file.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
	{
		title: "Quy trình sản xuất",
		description:
			"In và cán màng, bồi lên nam châm dẻo rồi cắt kỹ thuật số để đảm bảo thành phẩm sắc nét và bền bỉ.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "Công năng",
		description:
			"Tăng nhận diện thương hiệu trên xe, tủ lạnh, bảng thông tin và các điểm chạm kim loại có tần suất tiếp xúc cao.",
		icon: <BoltIcon color="primary" />,
	},
];

const CUSTOM_BULLETS = [
	"Sticker Magnet là lựa chọn lý tưởng cho doanh nghiệp cần vật phẩm quảng cáo có thể tái sử dụng nhiều lần.",
	"Không để lại vết keo khi tháo lắp, giúp bảo vệ bề mặt và giữ trải nghiệm sử dụng sạch sẽ.",
	"Chống nước, bền màu và chịu được điều kiện môi trường thực tế khi sử dụng ngoài trời ở mức vừa phải.",
	"Phù hợp cho xe công ty, tủ lạnh, cửa sắt, bảng tin văn phòng và nhiều bề mặt kim loại khác.",
	"Đặt hàng nhanh: gửi thiết kế, số lượng và kích thước mong muốn để INUT tư vấn và triển khai.",
];

const STICKER_MAGNET_TYPES = [
	{
		name: "Sự kiện & Triển lãm",
		description: "Gia tăng nhận diện thương hiệu qua quà tặng lưu niệm có tính ứng dụng cao.",
		image: HERO_IMAGE,
	},
	{
		name: "Quà tặng quảng cáo",
		description: "Món quà nhỏ gọn, dễ dùng, giúp khách hàng nhớ đến thương hiệu lâu hơn.",
		image: HERO_IMAGE,
	},
	{
		name: "Sản phẩm bán lẻ",
		description: "Mở rộng danh mục sản phẩm với chi phí hợp lý và khả năng tái mua tốt.",
		image: HERO_IMAGE,
	},
	{
		name: "Sản phẩm cá nhân",
		description: "Trang trí không gian sống và làm việc theo cá tính, dễ thay đổi theo mùa/chủ đề.",
		image: HERO_IMAGE,
	},
];

const SIZE_OPTIONS = [
	"Size 5 x 5 cm - Gọn nhẹ, phù hợp cho logo, icon, thông điệp ngắn trên tủ lạnh hoặc bảng từ.",
	"Size 7 x 10 cm - Cân bằng giữa hiển thị và chi phí, phù hợp cho quà tặng thương hiệu và bán lẻ.",
];

const APPLICATIONS = [
	{
		title: "Sự kiện, triển lãm",
		description: "Tạo điểm nhấn nhận diện thương hiệu với quà tặng dễ mang theo và dễ sử dụng.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Quà tặng quảng cáo",
		description:
			"Nâng trải nghiệm hậu mua và tăng mức độ ghi nhớ thương hiệu trong đời sống hàng ngày.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Sản phẩm bán lẻ",
		description: "Tăng giá trị đơn hàng bằng sản phẩm phụ trợ sáng tạo, dễ đóng gói và vận chuyển.",
		icon: <EventAvailableIcon color="primary" />,
	},
	{
		title: "Sản phẩm cá nhân",
		description:
			"Tự do thay đổi vị trí dán trên bề mặt kim loại theo phong cách và nhu cầu sử dụng.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
];

const StickerMagnetPage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "sticker-magnet",
			name: "Sticker Magnet",
			category: "Sticker",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "Sticker Magnet theo yêu cầu - INUT Design",
					description:
						"In Sticker Magnet (Sticker nam châm) theo yêu cầu tại INUT Design: tái sử dụng linh hoạt, không để lại vết keo, chống nước bền màu, từ 10 sản phẩm, sản xuất 3-4 ngày.",
					url: "https://inutdesign.com/sticker/sticker-magnet",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={CUSTOM_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<StickerMagnetTypesSection
						stickerMagnetTypes={STICKER_MAGNET_TYPES}
						sizeOptions={SIZE_OPTIONS}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description="Liên hệ ngay để nhận báo giá nhanh và tư vấn mẫu Sticker Magnet phù hợp nhất với nhu cầu của bạn."
						type={FormQuoteRequestType.STICKER_MAGNET}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

StickerMagnetPage.Layout = MainLayout;

export default StickerMagnetPage;
