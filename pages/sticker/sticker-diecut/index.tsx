import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import {
	ContactSection,
	HeroSection,
	IntroductionSection,
	ProductGallery,
	StickerDiecutTypesSection,
	WhyInutSection,
} from "@/components/sticker/sticker-diecut";
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
		title: "Sticker Diecut là gì?",
		description:
			"Là sticker được cắt rời hoàn toàn theo đường viền thiết kế, giúp thành phẩm nổi bật và dễ bóc dán ngay.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Thiết kế cutline chuẩn",
		description:
			"Tạo đường cắt chính xác theo từng chi tiết, đảm bảo hình dáng sắc nét từ logo đến các artwork phức tạp.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
	{
		title: "Quy trình sản xuất",
		description:
			"In và cán màng trước khi cắt kỹ thuật số, tạo thành sticker cắt rời hoàn chỉnh và sẵn sàng sử dụng.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "Công năng nổi bật",
		description:
			"Giúp thương hiệu dễ gây ấn tượng qua quà tặng quảng cáo, đồng thời đáp ứng tốt nhu cầu trang trí cá nhân.",
		icon: <BoltIcon color="primary" />,
	},
];

const CUSTOM_BULLETS = [
	"Sticker Diecut là lựa chọn lý tưởng khi bạn cần hình dán cắt rời nổi bật, độc đáo và dễ sử dụng.",
	"Chống nước, bền màu và phù hợp với nhiều điều kiện thời tiết khi dùng cho quảng bá hoặc trang trí.",
	"Có thể cắt theo bất kỳ hình dạng nào: logo, icon, nhân vật hoặc thiết kế minh họa riêng.",
	"Hỗ trợ tốt cho chiến dịch thương hiệu, quà tặng sự kiện và các sản phẩm cá nhân hóa.",
	"Đặt hàng nhanh: gửi thiết kế, số lượng và kích thước để INUT tư vấn và triển khai ngay.",
];

const STICKER_DIECUT_TYPES = [
	{
		name: "Sự kiện & Triển lãm",
		description: "Gia tăng nhận diện thương hiệu tại booth, workshop và các hoạt động cộng đồng.",
		image: HERO_IMAGE,
	},
	{
		name: "Quà tặng quảng cáo",
		description: "Món quà đơn giản, dễ sử dụng và giúp khách hàng ghi nhớ thương hiệu tốt hơn.",
		image: HERO_IMAGE,
	},
	{
		name: "Sản phẩm bán lẻ",
		description: "Phù hợp cho cửa hàng mở rộng danh mục sản phẩm với chi phí tối ưu.",
		image: HERO_IMAGE,
	},
	{
		name: "Sản phẩm cá nhân",
		description: "Trang trí laptop, điện thoại, phụ kiện để thể hiện phong cách riêng.",
		image: HERO_IMAGE,
	},
];

const COMPARISON_ITEMS = [
	"Sticker Diecut: Cắt rời hoàn toàn, đứt cả lớp đế decal, dễ bóc dán nhanh.",
	"Sticker Sheet: Nhiều mẫu sticker trên cùng một tờ, phù hợp cho bộ sưu tập đa dạng.",
	"Sticker Kiss Cut: Chỉ cắt lớp decal, giữ nguyên lớp đế để bảo quản tốt hơn.",
];

const APPLICATIONS = [
	{
		title: "Quảng bá thương hiệu",
		description:
			"Phù hợp làm quà tặng sự kiện, chiến dịch marketing và vật phẩm nhận diện thương hiệu.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Trang trí cá nhân",
		description: "Dễ dán lên laptop, điện thoại, xe cộ và nhiều vật dụng thường ngày.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Sáng tạo không gian",
		description: "Tăng điểm nhấn cho văn phòng, khu vực làm việc hoặc không gian nghệ thuật.",
		icon: <EventAvailableIcon color="primary" />,
	},
	{
		title: "Sản phẩm cá nhân hóa",
		description: "Tạo ra các mẫu sticker mang dấu ấn cá nhân để bán lẻ hoặc làm quà tặng.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
];

const StickerDiecutPage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "sticker-diecut",
			name: "Sticker Diecut",
			category: "Sticker",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "Sticker Diecut theo yêu cầu - INUT Design",
					description:
						"In Sticker Diecut theo yêu cầu tại INUT Design: cắt rời theo thiết kế, chống nước bền màu, từ 10 sản phẩm, sản xuất 3-4 ngày. Liên hệ ngay để nhận báo giá nhanh.",
					url: "https://inutdesign.com/sticker/sticker-diecut",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={CUSTOM_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<StickerDiecutTypesSection
						stickerDiecutTypes={STICKER_DIECUT_TYPES}
						comparisonItems={COMPARISON_ITEMS}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description="Liên hệ ngay để nhận báo giá nhanh và tư vấn mẫu Sticker Diecut phù hợp nhất với nhu cầu của bạn."
						type={FormQuoteRequestType.STICKER_DIECUT}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

StickerDiecutPage.Layout = MainLayout;

export default StickerDiecutPage;
