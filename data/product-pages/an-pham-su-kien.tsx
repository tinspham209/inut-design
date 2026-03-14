import { ProductPageData } from "@/models/product-page";
import BoltIcon from "@mui/icons-material/Bolt";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import TimerIcon from "@mui/icons-material/Timer";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import VerifiedIcon from "@mui/icons-material/Verified";
import CampaignIcon from "@mui/icons-material/Campaign";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import GroupsIcon from "@mui/icons-material/Groups";
import React from "react";

const HERO_IMAGE = "/branding/logo.webp";

export const HASHTAG_CAM_TAY_DATA: ProductPageData = {
	id: "hashtag-cam-tay",
	name: "Hashtag Cầm Tay",
	category: "Ấn phẩm sự kiện",
	seo: {
		title: "In Hashtag Cầm Tay tại Đà Nẵng - Chuyên Nghiệp, Giá Rẻ | INUT Design",
		description:
			"Dịch vụ in hashtag cầm tay chuyên nghiệp tại Đà Nẵng. Thiết kế đẹp, chất liệu formex bền chắc, lấy nhanh. Tăng nhận diện thương hiệu cho sự kiện của bạn!",
		url: "https://inutdesign.com/an-pham-su-kien/hashtag-cam-tay",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Hashtag Cầm Tay",
		description:
			"Hashtag cầm tay là lựa chọn lý tưởng để tạo không khí sinh động và tăng hiệu quả truyền thông cho sự kiện: thiết kế nổi bật, dễ cầm nắm, bền chắc và giúp lan tỏa thương hiệu tự nhiên.",
		image: HERO_IMAGE,
		chips: ["In lấy ngay", "Thiết kế nổi bật", "Bền chắc"],
	},
	introduction: {
		title: "Hashtag cầm tay theo yêu cầu",
		bullets: [
			"Hashtag cầm tay là lựa chọn lý tưởng để tạo không khí sinh động và tăng hiệu quả truyền thông cho sự kiện.",
			"Thiết kế nổi bật, dễ cầm nắm, phù hợp cho nhiều loại hình từ khai trương đến tiệc cưới, hội nghị.",
			"Chất liệu formex nhẹ nhưng bền, bề mặt in sắc nét, cán màng bảo vệ giúp thành phẩm luôn đẹp.",
			"Hỗ trợ lan tỏa thương hiệu tự nhiên qua các bức ảnh check-in của khách mời trên Facebook, Instagram, TikTok.",
			"Đặt hàng nhanh: tư vấn mẫu, kiểm tra file và sản xuất hoàn thiện trong 3-4 ngày làm việc.",
		],
		highlights: [
			{
				title: "Hashtag cầm tay là gì?",
				description:
					"Dạng bảng in nội dung ngắn được gắn thêm tay cầm hoặc que cầm, thường dùng trong sự kiện để chụp ảnh, cổ vũ...",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Thiết kế linh hoạt",
				description:
					"Kích thước 20x30, 25x35, 30x40 cm hoặc cắt theo hình dáng riêng tùy concept sự kiện.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Chất liệu bền chắc",
				description:
					"Formex, PP bồi formex, decal bồi format... nhẹ, cứng cáp và bề mặt in sắc nét.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Lan tỏa thương hiệu",
				description:
					"Giúp tăng nhận diện qua logo, slogan và các thông điệp check-in nổi bật trên mạng xã hội.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		title: "Các dòng Hashtag",
		description: "Chúng tôi cung cấp đa dạng các loại hashtag phù hợp với từng nhu cầu cụ thể.",
		items: [
			{
				name: "Sự kiện doanh nghiệp",
				description: "Khai trương, workshop, hội thảo.",
				image: HERO_IMAGE,
			},
			{
				name: "Tiệc & Kỷ niệm",
				description: "Sinh nhật, tiệc cưới, kỷ niệm.",
				image: HERO_IMAGE,
			},
			{
				name: "Activation & Roadshow",
				description: "Hoạt động quảng bá ngoài trời.",
				image: HERO_IMAGE,
			},
			{
				name: "Sự kiện trường học",
				description: "Lễ tốt nghiệp, ngày hội CLB.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description:
			"Với nhiều năm kinh nghiệm trong lĩnh vực in ấn, INUT Design cam kết mang đến những sản phẩm chất lượng nhất cùng quy trình chuyên nghiệp.",
		productionProcess: {
			title: "Quy trình sản xuất chuyên nghiệp",
			items: [
				{
					title: "Thời gian linh hoạt",
					description: "Sản xuất từ 1-3 ngày làm việc.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đa dạng số lượng",
					description: "Đặt in từ 1 cái, giá tốt cho số lượng lớn.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn thiết kế",
					description: "Đội ngũ thiết kế trẻ trung, sáng tạo.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng cho mọi mục đích",
			description: "Sản phẩm không chỉ là vật dụng trang trí mà còn là công cụ marketing hiệu quả.",
			items: [
				{
					title: "Sự kiện, triển lãm",
					description: "Cửa hàng nhận diện thương hiệu.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Quà tặng quảng cáo",
					description: "Món quà đơn giản nhưng hiệu quả.",
					icon: <CardGiftcardIcon fontSize="small" />,
				},
				{
					title: "Sản phẩm bán lẻ",
					description: "Cập nhật mẫu mã mới thường xuyên.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Sản phẩm cá nhân",
					description: "Quà tặng độc đáo, ý nghĩa.",
					icon: <GroupsIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng và giá tốt nhất thị trường",
			description:
				"Sử dụng mực in chính hãng, công nghệ in hiện đại đảm bảo màu sắc bền đẹp theo thời gian.",
			icon: <VerifiedIcon />,
		},
	},
	contact: {
		description: "Liên hệ ngay để nhận báo giá nhanh và tư vấn mẫu thiết kế phù hợp nhất.",
		type: "hashtag-cam-tay",
	},
	gallery: {
		images: Array.from({ length: 17 }).map(() => HERO_IMAGE),
	},
};

export const POSTER_DECAL_DATA: ProductPageData = {
	id: "poster-decal",
	name: "Poster & Decal",
	category: "Ấn phẩm sự kiện",
	seo: {
		title: "In Poster & Decal theo yêu cầu tại Đà Nẵng - Sắc nét, Bền đẹp | INUT Design",
		description:
			"Dịch vụ in poster, decal quảng cáo chất lượng cao tại Đà Nẵng. In kỹ thuật số khổ lớn, màu sắc trung thực, đa dạng chất liệu. Giải pháp quảng bá hiệu quả!",
		url: "https://inutdesign.com/an-pham-su-kien/poster-decal",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Poster & Decal",
		description:
			"Giải pháp quảng bá hình ảnh mạnh mẽ với dịch vụ in poster và decal chất lượng cao: màu sắc sống động, độ phân giải sắc nét và đa dạng kích thước theo yêu cầu.",
		image: HERO_IMAGE,
		chips: ["In sắc nét", "Màu sắc sống động", "Đa dạng kích thước"],
	},
	introduction: {
		title: "Poster & Decal quảng cáo chuyên nghiệp",
		bullets: [
			"Poster và decal là công cụ không thể thiếu để truyền tải thông điệp và hình ảnh thương hiệu đến khách hàng một cách trực quan nhất.",
			"Sử dụng công nghệ in kỹ thuật số hiện đại, đảm bảo độ phân giải cao và màu sắc trung thực so với bản thiết kế.",
			"Đa dạng chất liệu từ giấy PP, Decal sữa, Decal trong đến bạt Hiflex, đáp ứng mọi nhu cầu sử dụng trong nhà và ngoài trời.",
			"Hỗ trợ cán màng bảo vệ (mờ hoặc bóng) giúp tăng độ bền, chống trầy xước và giữ màu lâu phai theo thời gian.",
			"Thời gian hoàn thiện nhanh chóng, hỗ trợ in số lượng linh hoạt từ 1 tấm đến hàng trăm tấm.",
		],
		highlights: [
			{
				title: "Chất lượng in ấn",
				description:
					"Sử dụng mực in cao cấp, độ bám màu tốt và dải màu rộng, thể hiện chi tiết hình ảnh hoàn hảo.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Chất liệu đa dạng",
				description:
					"PP, Decal, Canvas, Backlit film... phù hợp cho nhiều không gian quảng bá khác nhau.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Độ bền vượt trội",
				description:
					"Khả năng kháng nước, chống tia UV (với decal ngoài trời), duy trì vẻ đẹp lâu dài.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Ứng dụng rộng rãi",
				description:
					"Từ trang trí cửa hàng, dán tường, bảng hiệu đến poster quảng cáo sự kiện, workshop.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		title: "Các loại Poster & Decal",
		description: "Đa dạng các loại chất liệu phù hợp với mọi không gian trưng bày.",
		items: [
			{
				name: "Poster PP",
				description: "Bề mặt phẳng mịn, in sắc nét.",
				image: HERO_IMAGE,
			},
			{
				name: "Decal sữa",
				description: "Chống nước, bám dính tốt.",
				image: HERO_IMAGE,
			},
			{
				name: "Decal trong",
				description: "Lý tưởng dán kính, chai lọ.",
				image: HERO_IMAGE,
			},
			{
				name: "Decal bồi Formex",
				description: "Bảng quảng cáo nhẹ, chắc chắn.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description:
			"Chúng tôi không chỉ cung cấp dịch vụ in ấn mà còn là đối tác đồng hành giúp thương hiệu của bạn tỏa sáng.",
		productionProcess: {
			title: "Quy trình sản xuất chuyên nghiệp",
			items: [
				{
					title: "Thời gian linh hoạt",
					description: "Sản xuất nhanh, đáp ứng tiến độ gấp.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đa dạng số lượng",
					description: "Hỗ trợ in từ số lượng ít.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn thiết kế",
					description: "Kiểm tra file và tư vấn layout miễn phí.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng cho mọi mục đích",
			description: "Poster và decal giúp truyền tải thông điệp một cách trực quan nhất.",
			items: [
				{
					title: "Sự kiện, triển lãm",
					description: "Cửa hàng nhận diện thương hiệu.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Quà tặng quảng cáo",
					description: "Món quà đơn giản nhưng hiệu quả.",
					icon: <CardGiftcardIcon fontSize="small" />,
				},
				{
					title: "Sản phẩm bán lẻ",
					description: "Cập nhật mẫu mã mới thường xuyên.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Sản phẩm cá nhân",
					description: "Quà tặng độc đáo, ý nghĩa.",
					icon: <GroupsIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Bản in sắc nét, màu sắc trung thực, độ bền cao.",
			icon: <VerifiedIcon />,
		},
	},
	contact: {
		description: "Liên hệ ngay để được tư vấn kích thước và chất liệu phù hợp nhất.",
		type: "poster-decal",
	},
	gallery: {
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
	},
};
