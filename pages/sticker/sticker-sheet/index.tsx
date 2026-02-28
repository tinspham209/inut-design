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
import React from "react";
import {
	ContactSection,
	HeroSection,
	IntroductionSection,
	ProductGallery,
	StickerSheetTypesSection,
	WhyInutSection,
} from "@/components/sticker/sticker-sheet";
import { FormQuoteRequestType } from "@/models";

const HERO_IMAGE = "/branding/logo.webp";

const GALLERY_IMAGES = Array.from({ length: 17 }).map(() => HERO_IMAGE);

const HIGHLIGHTS = [
	{
		title: "Sticker Sheet là gì?",
		description:
			"Một tấm sticker có nhiều hình ảnh trên cùng bề mặt, giúp bạn sở hữu nhiều mẫu thiết kế mà không cần đặt rời từng mẫu.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Thiết Kế",
		description:
			"Mỗi hình ảnh được tạo đường cắt tỉ mỉ, dễ bóc dễ dùng. Hỗ trợ đa dạng thiết kế từ logo, chữ cho đến hình ảnh phức tạp.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
	{
		title: "Quy trình sản xuất",
		description:
			"File thiết kế được in, cán màng và cắt bằng máy kỹ thuật số để đảm bảo đường cắt chính xác, hình ảnh sắc nét.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "Công Năng",
		description:
			"Giải pháp quà tặng hiệu quả cho doanh nghiệp: truyền tải logo, slogan, mascot và thông điệp để tăng ghi nhớ thương hiệu.",
		icon: <BoltIcon color="primary" />,
	},
];

const CUSTOM_BULLETS = [
	"Sticker Sheet là giải pháp lý tưởng cho người yêu sự đa dạng và sáng tạo, đặc biệt khi cần nhiều mẫu trên cùng một tờ.",
	"Chống nước, bền màu và không phai dưới nắng, phù hợp sử dụng trong nhiều điều kiện thời tiết.",
	"Sticker Sheet linh hoạt hơn khi gom nhiều thiết kế trên một bề mặt đã cắt bế sẵn.",
	"Giúp bạn vừa tối ưu chi phí in, vừa tăng tính nhận diện cho cá nhân, shop online và thương hiệu.",
	"Đặt hàng nhanh: chỉ cần gửi thiết kế, số lượng và kích thước mong muốn để INUT triển khai.",
];

const STICKER_SHEET_TYPES = [
	{
		name: "Sự kiện & Triển lãm",
		description: "Gia tăng nhận diện thương hiệu tại booth, workshop và hoạt động cộng đồng.",
		image: HERO_IMAGE,
	},
	{
		name: "Quà tặng quảng cáo",
		description: "Món quà nhỏ nhưng giàu cảm xúc, tăng trải nghiệm khách hàng sau mua.",
		image: HERO_IMAGE,
	},
	{
		name: "Sản phẩm bán lẻ",
		description: "Giúp shop mở rộng sản phẩm, tăng giá trị đơn hàng với chi phí tối ưu.",
		image: HERO_IMAGE,
	},
	{
		name: "Sản phẩm cá nhân",
		description: "Nổi bật cá tính qua sticker trang trí laptop, điện thoại và không gian sống.",
		image: HERO_IMAGE,
	},
];

const PAPER_OPTIONS = [
	"Size A5 (148 x 210 mm) - Phù hợp cho các thiết kế nhỏ gọn, dễ dàng dán lên laptop, điện thoại hoặc đồ dùng cá nhân.",
	"Size A6 (105 x 148 mm) - Lý tưởng cho các thiết kế vừa phải, có thể dán lên bình nước, sổ tay hoặc trang trí không gian làm việc.",
];

const APPLICATIONS = [
	{
		title: "Sự kiện, triển lãm",
		description: "Tăng nhận diện thương hiệu nhanh ngay tại điểm chạm với khách hàng.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Quà tặng quảng cáo",
		description: "Món quà đơn giản nhưng tạo cảm giác chuyên nghiệp và đáng nhớ.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Sản phẩm bán lẻ",
		description: "Mở rộng danh mục bán hàng, dễ upsell trong các chiến dịch online.",
		icon: <EventAvailableIcon color="primary" />,
	},
	{
		title: "Sản phẩm cá nhân",
		description: "Tự do thể hiện phong cách cá nhân từ laptop, điện thoại đến góc làm việc.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
];

const StickerSheetPage: NextPageWithLayout = () => {
	return (
		<>
			<Seo
				data={{
					title: "Sticker Sheet theo yêu cầu - INUT Design",
					description:
						"In Sticker Sheet theo yêu cầu tại INUT Design: chống nước, bền màu, nhiều mẫu trên một tờ, từ 10 sản phẩm, sản xuất 3-4 ngày. Đặt in ngay để tăng nhận diện và chốt đơn tốt hơn.",
					url: "https://inutdesign.com/sticker/sticker-sheet",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={CUSTOM_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<StickerSheetTypesSection
						stickerSheetTypes={STICKER_SHEET_TYPES}
						paperOptions={PAPER_OPTIONS}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description="Liên hệ ngay để nhận báo giá nhanh và tư vấn mẫu thiết kế phù hợp nhất với nhu cầu của bạn."
						type={FormQuoteRequestType.STICKER_SHEET}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

StickerSheetPage.Layout = MainLayout;

export default StickerSheetPage;
