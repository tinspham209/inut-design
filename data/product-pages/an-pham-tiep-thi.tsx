import { ProductPageData } from "@/models/product-page";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import BusinessIcon from "@mui/icons-material/Business";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CampaignIcon from "@mui/icons-material/Campaign";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PaletteIcon from "@mui/icons-material/Palette";
import SpaIcon from "@mui/icons-material/Spa";
import SpeedIcon from "@mui/icons-material/Speed";
import StorefrontIcon from "@mui/icons-material/Storefront";
import VerifiedIcon from "@mui/icons-material/Verified";
import TimerIcon from "@mui/icons-material/Timer";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import GroupsIcon from "@mui/icons-material/Groups";
import BoltIcon from "@mui/icons-material/Bolt";
import React from "react";

const HERO_IMAGE = "/branding/logo.webp";

export const IN_CARD_VISIT_DATA: ProductPageData = {
	id: "in-card-visit",
	name: "In Card Visit",
	category: "Ấn phẩm tiếp thị",
	seo: {
		title: "In Card Visit Tại Đà Nẵng Chuyên Nghiệp Theo Yêu Cầu | INUT Design",
		description:
			"Dịch vụ in card visit (danh thiếp) tại Đà Nẵng: thiết kế chuyên nghiệp, in sắc nét, tùy chọn đa dạng chất liệu giấy/nhựa. Gia công mờ, bóng, ép kim sang trọng.",
		url: "https://inutdesign.com/an-pham-tiep-thi/in-card-visit",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "In card visit chuyên nghiệp",
		description:
			"Thiết kế chỉn chu, in sắc nét và chất liệu cao cấp giúp nâng tầm hình ảnh thương hiệu cá nhân và doanh nghiệp tại Đà Nẵng.",
		image: HERO_IMAGE,
		chips: ["In offset", "Đa dạng chất liệu"],
		ctaLabel: "Nhận báo giá nhanh",
	},
	introduction: {
		title: "Danh thiếp chuyên nghiệp",
		bullets: [
			"Kết nối thông tin liên lạc (họ tên, SĐT, Email, Địa chỉ, QR code).",
			"Đóng vai trò quan trọng trong bộ nhận diện thương hiệu.",
			"Tạo ấn tượng chuyên nghiệp trong giao tiếp, networking.",
			"Giúp người nhận dễ lưu lại thông tin một cách trực quan.",
		],
		highlights: [
			{
				title: "Chuyên Nghiệp",
				description:
					"Thể hiện vị thế thương hiệu cá nhân hoặc doanh nghiệp ngay từ lần đầu tiên gặp mặt.",
				icon: <VerifiedIcon fontSize="small" />,
			},
			{
				title: "Đa Dạng Chất Liệu",
				description:
					"Từ giấy Couche phổ thông, giấy Kraft mộc mạc đến giấy mỹ thuật cao cấp và thẻ nhựa PVC hiện đại.",
				icon: <PaletteIcon fontSize="small" />,
			},
			{
				title: "Thiết Kế Đậm Dấu Ấn",
				description: "Bố cục gọn gàng, cân đối, thể hiện cá tính riêng biệt khó nhầm lẫn.",
				icon: <DoneAllIcon fontSize="small" />,
			},
			{
				title: "Sản Xuất Nhanh",
				description: "Hỗ trợ in số lượng từ 10 cái, thời gian hoàn thiện chỉ từ 3-4 ngày làm việc.",
				icon: <SpeedIcon fontSize="small" />,
			},
		],
	},
	types: {
		title: "Các dòng Card Visit",
		description: "Lựa chọn chất liệu phù hợp để thể hiện đẳng cấp thương hiệu.",
		items: [
			{
				name: "Card visit giấy",
				description: "Đa dạng giấy Couche, Kraft, Mỹ thuật.",
				image: "/branding/services/thiet-ke-in-an.avif",
			},
			{
				name: "Card visit nhựa",
				description: "Siêu bền, chống nước tuyệt đối.",
				image: "/branding/services/sticker.avif",
			},
		],
		specOptions: [
			"Kích thước chuẩn: 9 x 5.4 cm.",
			"Gia công: Cán mờ/bóng, ép kim logo.",
			"Hệ màu CMYK, độ phân giải 300 DPI.",
		],
		comparisonRows: [
			{ criteria: "Độ bền", paper: "Trung bình", artPaper: "Tốt", pvc: "Tuyệt đối" },
			{ criteria: "Chi phí", paper: "Kinh tế", artPaper: "Cao cấp", pvc: "Đầu tư" },
		],
	},
	whyInut: {
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Giải pháp in ấn toàn diện giúp nâng tầm thương hiệu của bạn.",
		productionProcess: {
			title: "Quy trình chuyên nghiệp",
			items: [
				{
					title: "Thời gian linh hoạt",
					description: "Sản xuất từ 1-3 ngày.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đa dạng số lượng",
					description: "Đặt in từ 1 hộp.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn thiết kế",
					description: "Hỗ trợ lên layout chuyên nghiệp.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Danh thiếp phù hợp cho mọi nhu cầu kết nối.",
			items: [
				{
					title: "Cá nhân & Freelancer",
					description: "Xây dựng thương hiệu cá nhân.",
					icon: <CameraAltIcon fontSize="small" />,
				},
				{
					title: "Doanh nghiệp",
					description: "Đồng bộ nhận diện đội ngũ.",
					icon: <BusinessIcon fontSize="small" />,
				},
				{
					title: "Cửa hàng",
					description: "Thông tin liên hệ, thẻ tích điểm.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Dịch vụ Cao cấp",
					description: "Sang trọng cho Spa, Studio.",
					icon: <SpaIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "In sắc nét, màu sắc chuẩn xác, gia công tỉ mỉ.",
			icon: <VerifiedIcon />,
		},
	},
	contact: {
		description: "Liên hệ ngay để được tư vấn mẫu Card Visit phù hợp nhất.",
		type: "in-card-visit",
	},
	gallery: {
		images: [
			"/branding/services/thiet-ke-in-an.avif",
			"/branding/services/sticker.avif",
			"/branding/services/skin-laptop.avif",
			"/branding/services/skin-nut-phim.avif",
			"/branding/services/nhan-chai-san-pham.avif",
			"/branding/hero-bg.webp",
		],
	},
};

export const CATALOGUE_BROCHURE_DATA: ProductPageData = {
	id: "catalogue-brochure",
	name: "In Catalogue, Brochure",
	category: "Ấn phẩm tiếp thị",
	seo: {
		title: "In Catalogue, Brochure Chuyên Nghiệp Theo Yêu Cầu | INUT Design Đà Nẵng",
		description:
			"Dịch vụ in Catalogue, Brochure chuyên nghiệp tại Đà Nẵng: thiết kế đẹp, gia công chỉn chu, hình ảnh sắc nét. Nâng tầm thương hiệu, hỗ trợ bán hàng hiệu quả.",
		url: "https://inutdesign.com/an-pham-tiep-thi/catalogue-brochure",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "In Catalogue & Brochure",
		description:
			"Nâng tầm hình ảnh thương hiệu với các ấn phẩm Catalogue và Brochure chuyên nghiệp, in ấn sắc nét, thiết kế sáng tạo giúp truyền tải trọn vẹn giá trị sản phẩm và dịch vụ.",
		image: HERO_IMAGE,
		chips: ["Thiết kế chuẩn", "In sắc nét"],
		ctaLabel: "Nhận báo giá nhanh",
	},
	introduction: {
		title: "Ấn phẩm quảng bá chuyên nghiệp",
		bullets: [
			"Giới thiệu sản phẩm, dịch vụ hệ thống và trực quan.",
			"Tăng tính chuyên nghiệp và độ tin cậy cho thương hiệu.",
			"Hỗ trợ đội ngũ bán hàng và tư vấn khách hàng.",
			"Tạo tài liệu phát tay tiện lợi tại showroom, hội chợ.",
		],
		highlights: [
			{
				title: "Catalogue",
				description:
					"Ấn phẩm nhiều trang giới thiệu danh mục sản phẩm, dịch vụ chi tiết, có hệ thống. Giúp khách hàng dễ tìm hiểu và so sánh.",
				icon: <MenuBookIcon fontSize="small" />,
			},
			{
				title: "Brochure",
				description:
					"Ấn phẩm giới thiệu ngắn gọn, cô đọng (thường gấp 2, gấp 3). Phù hợp truyền tải nhanh thông điệp thương hiệu, dịch vụ.",
				icon: <AutoAwesomeMotionIcon fontSize="small" />,
			},
			{
				title: "Thiết kế chuẩn mực",
				description:
					"Bố cục rõ ràng, phân cấp thông tin hợp lý, hình ảnh sắc nét, màu sắc đồng bộ giúp nhận diện thương hiệu tốt nhất.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Chất liệu đa dạng",
				description:
					"Từ giấy Couche mịn màng, Bristol cứng cáp đến giấy mỹ thuật cao cấp dành cho những thiết kế sang trọng.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
		],
	},
	types: {
		title: "Quy cách ấn phẩm",
		description: "Lựa chọn hình thức phù hợp để truyền tải thông tin hiệu quả nhất.",
		items: [
			{
				name: "Catalogue",
				description: "Nhiều trang, đóng ghim hoặc keo gáy.",
				image: "/branding/services/thiet-ke-in-an.avif",
			},
			{
				name: "Brochure",
				description: "In tờ gấp 2, gấp 3 gọn nhẹ.",
				image: "/branding/services/sticker.avif",
			},
		],
	},
	whyInut: {
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Giải pháp truyền thông chuyên nghiệp cho mọi doanh nghiệp.",
		productionProcess: {
			title: "Quy trình chuyên nghiệp",
			items: [
				{
					title: "Thời gian linh hoạt",
					description: "Sản xuất từ 3-5 ngày.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đa dạng số lượng",
					description: "Hỗ trợ in từ số lượng ít.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn thiết kế",
					description: "Hỗ trợ lên layout chuẩn in ấn.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng cho mọi lĩnh vực",
			description: "Catalogue và Brochure là công cụ bán hàng không thể thiếu.",
			items: [
				{
					title: "Doanh nghiệp",
					description: "Hồ sơ năng lực, Catalogue sản phẩm.",
					icon: <BusinessIcon fontSize="small" />,
				},
				{
					title: "Cửa hàng",
					description: "Menu dịch vụ, bảng giá chi tiết.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Sự kiện",
					description: "Brochure phát tay ấn tượng.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Dịch vụ",
					description: "Giới thiệu liệu trình Spa, Du lịch.",
					icon: <SpaIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "In ấn sắc nét, gia công chỉn chu, màu sắc chuẩn.",
			icon: <VerifiedIcon />,
		},
	},
	contact: {
		description: "Liên hệ ngay để được tư vấn mẫu Catalogue, Brochure phù hợp nhất.",
		type: "catalogue-brochure",
	},
	gallery: {
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
	},
};
