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
	StickerKisscutTypesSection,
	WhyInutSection,
} from "@/components/sticker/sticker-kisscut";
import { FormQuoteRequestType } from "@/models";

const HERO_IMAGE = "/branding/logo.webp";

const GALLERY_IMAGES = Array.from({ length: 17 }).map(() => HERO_IMAGE);

const HIGHLIGHTS = [
	{
		title: "Sticker Kiss Cut là gì?",
		description:
			"Là kỹ thuật cắt theo đường viền thiết kế nhưng không cắt đứt lớp đế, giúp sticker được bảo vệ tốt hơn.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Thiết kế chuẩn cutline",
		description:
			"Tạo đường cắt chính xác cho cả hình đơn giản lẫn chi tiết phức tạp, đảm bảo độ sắc nét cao.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
	{
		title: "Quy trình sản xuất",
		description:
			"In trên decal chất lượng cao, cán màng chống nước và kiss cut kỹ thuật số với lực cắt tối ưu.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "Lợi thế sử dụng",
		description:
			"Dễ bóc dán, dễ bảo quản, phù hợp cho quà tặng, bán lẻ và bộ sưu tập sticker chuyên nghiệp.",
		icon: <BoltIcon color="primary" />,
	},
];

const CUSTOM_BULLETS = [
	"Sticker Kiss Cut là giải pháp hoàn hảo cho khách hàng đề cao sự tiện lợi và thẩm mỹ.",
	"Chỉ cắt lớp decal bề mặt, giữ nguyên đế giấy bên dưới để bảo vệ các cạnh sticker.",
	"Bóc dán nhanh bằng tay, hạn chế bong tróc trước khi sử dụng và vận chuyển.",
	"Phù hợp để làm quà tặng thương hiệu, trang trí cá nhân và sản phẩm nghệ thuật.",
	"Giữ cảm giác chuyên nghiệp, cao cấp khi giao sản phẩm đến tay khách hàng.",
];

const STICKER_KISSCUT_TYPES = [
	{
		name: "Sự kiện & Triển lãm",
		description: "Gia tăng nhận diện thương hiệu hiệu quả tại sự kiện và các điểm chạm trực tiếp.",
		image: HERO_IMAGE,
	},
	{
		name: "Quà tặng quảng cáo",
		description: "Món quà tinh tế giúp khách hàng dễ bóc dán và nhớ thương hiệu lâu hơn.",
		image: HERO_IMAGE,
	},
	{
		name: "Sản phẩm bán lẻ",
		description:
			"Phù hợp với shop phụ kiện, văn phòng phẩm và các bộ sticker đóng gói chuyên nghiệp.",
		image: HERO_IMAGE,
	},
	{
		name: "Sản phẩm cá nhân",
		description: "Thể hiện phong cách riêng khi dán trên laptop, điện thoại và phụ kiện cá nhân.",
		image: HERO_IMAGE,
	},
];

const COMPARISON_ITEMS = [
	"Sticker Kiss Cut: Cắt lớp decal nhưng giữ nguyên đế, dễ bóc dán và bảo quản tốt.",
	"Die Cut Sticker: Cắt rời cả decal lẫn đế theo hình thiết kế, phù hợp trưng bày hoặc phát lẻ.",
	"Sticker Sheet: Nhiều hình ảnh trên cùng một tấm, tiện cho bộ sưu tập đa mẫu.",
];

const APPLICATIONS = [
	{
		title: "Quảng bá thương hiệu",
		description: "Tăng độ nhận diện khi dùng làm quà tặng kèm bao bì sản phẩm.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Trang trí cá nhân",
		description: "Lớp đế rộng giúp sticker bền hơn trong ví, túi xách trước khi dán.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Sáng tạo nghệ thuật",
		description: "Phù hợp để tạo các bộ sưu tập sticker lẻ, chỉn chu và giàu tính thẩm mỹ.",
		icon: <EventAvailableIcon color="primary" />,
	},
	{
		title: "Sản phẩm chuyên nghiệp",
		description: "Mang lại trải nghiệm cao cấp cho khách hàng trong từng chi tiết bóc dán.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
];

const StickerKisscutPage: NextPageWithLayout = () => {
	return (
		<>
			<Seo
				data={{
					title: "Sticker Kiss Cut theo yêu cầu - INUT Design",
					description:
						"In Sticker Kiss Cut theo yêu cầu tại INUT Design: dễ bóc dán, giữ đế bảo vệ, chống nước, bền màu, từ 10 sản phẩm, sản xuất 3-4 ngày. Liên hệ ngay để nhận báo giá nhanh.",
					url: "https://inutdesign.com/sticker/sticker-kisscut",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={CUSTOM_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<StickerKisscutTypesSection
						stickerKisscutTypes={STICKER_KISSCUT_TYPES}
						comparisonItems={COMPARISON_ITEMS}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description="Liên hệ ngay để nhận báo giá nhanh và tư vấn mẫu Sticker Kiss Cut phù hợp nhất với nhu cầu của bạn."
						type={FormQuoteRequestType.STICKER_KISSCUT}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

StickerKisscutPage.Layout = MainLayout;

export default StickerKisscutPage;
