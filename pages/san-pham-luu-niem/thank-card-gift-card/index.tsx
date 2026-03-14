import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import {
	ContactSection,
	HeroSection,
	IntroductionSection,
	ProductGallery,
	ThankCardGiftCardTypesSection,
	WhyInutSection,
} from "@/components/san-pham-luu-niem/thank-card-gift-card";
import { UsagePurposeValue } from "@/models";
import { NextPageWithLayout } from "@/models/common";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BoltIcon from "@mui/icons-material/Bolt";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Box, Container, Divider } from "@mui/material";
import React, { useEffect } from "react";
import { trackViewProduct } from "@/utils/analytics";

const HERO_IMAGE = "/branding/logo.webp";

const GALLERY_IMAGES = [
	"/branding/services/sticker.avif",
	"/branding/services/skin-laptop.avif",
	"/branding/services/skin-nut-phim.avif",
	"/branding/services/nhan-chai-san-pham.avif",
	"/branding/services/thiet-ke-in-an.avif",
	"/branding/hero-bg.webp",
	"/branding/services/sticker.avif",
	"/branding/services/skin-laptop.avif",
	"/branding/services/skin-nut-phim.avif",
	"/branding/services/nhan-chai-san-pham.avif",
	"/branding/services/thiet-ke-in-an.avif",
	"/branding/logo.webp",
];

const INTRO_BULLETS = [
	"Thank card và gift card giúp tăng trải nghiệm khách hàng, tạo cảm giác chuyên nghiệp và chỉn chu cho thương hiệu.",
	"Gia tăng nhận diện thương hiệu qua logo, màu sắc, chất liệu và thông điệp trên mỗi tấm thẻ.",
	"Dễ kết hợp với đơn hàng, bộ quà tặng, set sản phẩm hoặc campaign theo mùa.",
	"Sản xuất tại xưởng INUT Design Đà Nẵng, tối thiểu từ 10 cái, thời gian hoàn thiện 3–4 ngày làm việc.",
];

const HIGHLIGHTS = [
	{
		title: "Tăng trải nghiệm khách hàng",
		description:
			"Một chiếc thẻ cảm ơn hoặc quà tặng đi kèm đơn hàng tạo cảm giác được trân trọng và đáng nhớ.",
		icon: <FavoriteIcon color="primary" />,
	},
	{
		title: "Chuyên nghiệp & chỉn chu",
		description:
			"Thiết kế đẹp, in ấn sắc nét giúp thương hiệu nổi bật hơn trong mắt khách hàng.",
		icon: <AutoAwesomeIcon color="primary" />,
	},
	{
		title: "Cá nhân hóa linh hoạt",
		description:
			"Tùy chỉnh nội dung, kích thước, chất liệu và phong cách theo từng chiến dịch hoặc bộ sưu tập.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Chi phí hợp lý, hiệu quả cao",
		description:
			"Sản phẩm nhỏ gọn nhưng tạo cảm xúc mạnh, hỗ trợ tốt cho marketing và chăm sóc khách hàng.",
		icon: <BoltIcon color="primary" />,
	},
];

const THANK_CARD_GIFT_CARD_TYPES = [
	{
		name: "Thank card kẹp đơn hàng",
		description:
			"Thẻ cảm ơn nhỏ gọn kèm đơn hàng, tăng thiện cảm và ghi nhớ thương hiệu từ khách mua online.",
		image: "/branding/services/sticker.avif",
	},
	{
		name: "Gift card quà tặng",
		description:
			"Thẻ quà tặng mang giá trị sử dụng, dùng làm voucher, ưu đãi hoặc quà tặng cho khách hàng thân thiết.",
		image: "/branding/services/nhan-chai-san-pham.avif",
	},
	{
		name: "Thẻ dịp lễ & khai trương",
		description:
			"Quà lưu niệm tinh tế cho sinh nhật, lễ tết, khai trương hoặc các campaign đặc biệt.",
		image: "/branding/services/thiet-ke-in-an.avif",
	},
	{
		name: "Thẻ thương hiệu doanh nghiệp",
		description:
			"Gift card cho spa, café, nhà hàng, thời trang, studio — công cụ bán hàng và chăm sóc khách hàng hiệu quả.",
		image: "/branding/services/skin-laptop.avif",
	},
];

const SPEC_OPTIONS = [
	"Kích thước phổ biến: name card size, A6, card ngang/đứng, vuông hoặc tùy chỉnh theo concept.",
	"Độ phân giải: 300 DPI, hệ màu CMYK, bleed (tràn lề) 3mm.",
	"Font chữ: nên convert outline trước khi gửi file.",
	"Chất liệu: Giấy Couche, Ivory, Bristol, Mỹ thuật, Kraft.",
	"Gia công: cán mờ, cán bóng, ép kim, bo góc hoặc dập nổi tùy chọn.",
	"Nếu có QR code hoặc mã giảm giá, cần kiểm tra kỹ độ rõ để dễ quét và sử dụng.",
];

const TARGET_CUSTOMERS = [
	"Shop online, local brand muốn tăng trải nghiệm mở hàng.",
	"Tiệm bánh, mỹ phẩm, thời trang, studio muốn thêm điểm chạm thương hiệu.",
	"Spa, café, nhà hàng cần gift card làm voucher ưu đãi.",
	"Doanh nghiệp cần quà tặng đối tác hoặc chăm sóc khách hàng thân thiết.",
	"Chương trình khuyến mãi, sự kiện khai trương, campaign theo mùa.",
];

const APPLICATIONS = [
	{
		title: "Shop online & local brand",
		description:
			"Kẹp thank card theo mỗi đơn hàng giúp tăng trải nghiệm unboxing và tỷ lệ quay lại.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Quà tặng & ưu đãi",
		description:
			"Gift card làm quà sinh nhật, voucher giảm giá hoặc quà tặng trong các chương trình khuyến mãi.",
		icon: <CardGiftcardIcon color="primary" />,
	},
	{
		title: "Marketing & branding",
		description:
			"Công cụ chi phí thấp nhưng hiệu quả cao để gia tăng nhận diện và kết nối thương hiệu.",
		icon: <RocketLaunchIcon color="primary" />,
	},
	{
		title: "Doanh nghiệp & sự kiện",
		description:
			"Quà tri ân đối tác, khách hàng VIP hoặc vật phẩm lưu niệm trong các sự kiện đặc biệt.",
		icon: <LocalOfferIcon color="primary" />,
	},
];

const ThankCardGiftCardPage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "thank-card-gift-card",
			name: "Thank Card & Gift Card",
			category: "Sản phẩm lưu niệm",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "In Thank Card, Gift Card Tại Đà Nẵng — Nâng Tầm Thương Hiệu | INUT Design",
					description:
						"Dịch vụ in thank card, gift card tại Đà Nẵng: thiết kế đẹp, đa dạng chất liệu, giá cạnh tranh, sản xuất nhanh từ 10 cái tại INUT Design.",
					url: "https://inutdesign.com/san-pham-luu-niem/thank-card-gift-card",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={INTRO_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ThankCardGiftCardTypesSection
						types={THANK_CARD_GIFT_CARD_TYPES}
						specOptions={SPEC_OPTIONS}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description={`Liên hệ INUT Design ngay để được tư vấn mẫu thank card, gift card phù hợp, chọn chất liệu tối ưu và báo giá nhanh chóng cho: ${TARGET_CUSTOMERS.join(
							" "
						)}`}
						type={UsagePurposeValue.THANK_CARD_GIFT_CARD}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

ThankCardGiftCardPage.Layout = MainLayout;

export default ThankCardGiftCardPage;
