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
import React, { useEffect } from "react";
import { trackViewProduct } from "@/utils/analytics";
import {
	ContactSection,
	HeroSection,
	IntroductionSection,
	MacnutTypesSection,
	ProductGallery,
	WhyInutSection,
} from "@/components/macnut-customize";
import { FormQuoteRequestType } from "@/models/quoteRequest";

const HERO_IMAGE = "/branding/logo.webp";

// Using placeholder images for gallery as well, can be swapped with actual macnut image urls
const GALLERY_IMAGES = Array.from({ length: 17 }).map(() => HERO_IMAGE);

const HIGHLIGHTS = [
	{
		title: "Chất liệu siêu mỏng",
		description:
			"Độ dày vừa vặn, không ảnh hưởng đến độ nảy hay phản hồi của phím khi gõ, không chạm màn hình.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "In xuyên thấu thông minh",
		description:
			"Hỗ trợ cắt hở font chữ cho cả led phím xuyên qua (đối với một số dòng máy có led).",
		icon: <LocalPrintshopIcon color="primary" />,
	},
	{
		title: "Tính cá nhân hoá",
		description: "Mang nét độc quyền, thể hiện rõ con người, phong cách làm việc của bạn.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Tái tạo phím cũ",
		description:
			"Khôi phục vẻ đẹp cho những bàn phím đã bị bóng, tróc sơn hoặc mờ chữ do quá trình sử dụng.",
		icon: <BoltIcon color="primary" />,
	},
];

const CUSTOM_BULLETS = [
	"Khuôn cắt file sẵn chuẩn 99% cho mọi thiết bị: Macbook, Dell, Asus, Lenovo, HP...",
	"Bóc dán an toàn, dễ dàng tẩy keo khi bạn không dùng nữa bằng nước rửa phụ kiện",
	"Vẽ lại layout chính xác với cấu hình bàn phím quốc tế (US, UK, JP...)",
	"Lên mockup 2D miễn phí để hình dung rõ tổng thể bàn phím trước khi chốt in",
	"Hệ màu sRGB đạt chuẩn, không sai lệch so với bản vẽ",
];

const MACNUT_TYPES = [
	{
		name: "Decal Phím Cán Mờ (Matte)",
		description: "Phủ thêm lớp nhám mịn cho phím, chống bám dấu vân tay và mồ hôi cực kỳ hiệu quả",
		image: HERO_IMAGE,
	},
	{
		name: "Decal Phím Xuyên Led",
		description: "Cắt hở phần ký tự, thích hợp sử dụng trong bóng tối, tôn lên vẻ đẹp nguyên bản",
		image: HERO_IMAGE,
	},
	{
		name: "Decal Set Phím Lẻ",
		description:
			"Chỉ in và dán một số phím thông dụng (Space, W A S D) theo ý định gaming, làm việc",
		image: HERO_IMAGE,
	},
	{
		name: "Decal Gradient Collection",
		description: "Mẫu bộ sưu tập chuyển màu theo phong cách ombre mượt mà, rực rỡ",
		image: HERO_IMAGE,
	},
];

const COATING_OPTIONS = [
	"Chất liệu in 3M Controltac không co rút dưới nhiệt độ máy tỏa ra",
	"Lớp cán bảo vệ vân cát (Matte) tăng cảm giác chạm xúc giác",
	"Cắt demi sẵn hoàn thiện, không cần dùng dao rọc giấy thủ công",
];

const APPLICATIONS = [
	{
		title: "Tạo niềm vui gõ phím",
		description: "Đem đến nguồn cảm hứng làm việc dồi dào trên bộ phím màu sắc tươi mới.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Bảo vệ nguyên bản",
		description: "Vách ngăn giữa mồ hôi tay với lớp sơn phím, giữ phím lúc nào cũng mới.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "Giáo dục / Văn phòng",
		description: "Cách nhớ các phím tắt công cụ nhanh qua hệ thống màu sắc phân bổ.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Quà tặng Geek/IT",
		description: "Không thể phù hợp hơn làm quà cho các tín đồ sưu tầm, công nghệ.",
		icon: <EventAvailableIcon color="primary" />,
	},
];

const MacnutCustomizePage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "macnut-customize",
			name: "Skin Nút Phím",
			category: "Macnut",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "Custom Skin Nút Phím theo yêu cầu - INUT Design",
					description:
						"Dịch vụ in Skin nút phím cho laptop chuẩn xác mọi dòng máy. Cắt CNC rời từng phím, mỏng mịn, chống phai màu và bảo vệ phím bấm vượt trội.",
					url: "https://inutdesign.com/macnut/customize",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={CUSTOM_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<MacnutTypesSection macnutTypes={MACNUT_TYPES} coatingOptions={COATING_OPTIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection type={FormQuoteRequestType.MACNUT_CUSTOMIZE} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

MacnutCustomizePage.Layout = MainLayout;

export default MacnutCustomizePage;
