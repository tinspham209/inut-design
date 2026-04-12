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
import EventAvailable from "@mui/icons-material/EventAvailable";
import React from "react";

const HERO_IMAGE = "/cover-web.webp";

export const HASHTAG_CAM_TAY_DATA: ProductPageData = {
	id: "hashtag-cam-tay",
	name: "Hashtag Cầm Tay",
	category: "Ấn phẩm sự kiện",
	seo: {
		title: "In Hashtag Cầm Tay tại Đà Nẵng - Chuyên Nghiệp, Giá Rẻ | INUT Design",
		description:
			"Dịch vụ in hashtag cầm tay chuyên nghiệp tại Đà Nẵng. Thiết kế đẹp, chất liệu formex bền chắc, lấy nhanh. Tăng nhận diện thương hiệu cho sự kiện của bạn!",
		url: "https://inutdesign.com/services/an-pham-su-kien/hashtag-cam-tay",
		thumbnailUrl: `/services/an-pham-su-kien/thumbnail/hashtag-cam-tay.avif`,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm sự kiện", item: "/services/an-pham-su-kien" },
			{ name: "Hashtag Cầm Tay", item: "/services/an-pham-su-kien/hashtag-cam-tay" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Hashtag Cầm Tay",
			serviceType: "In ấn sự kiện",
			provider: {
				"@type": "Organization",
				name: "INUT Design",
			},
			areaServed: {
				"@type": "Country",
				name: "VN",
			},
			offer: {
				"@type": "Offer",
				price: "50000",
				priceCurrency: "VND",
			},
		},
	},
	hero: {
		title: "Hashtag Cầm Tay",
		description:
			"Hashtag cầm tay là lựa chọn lý tưởng để tạo không khí sinh động và tăng hiệu quả truyền thông cho sự kiện: thiết kế nổi bật, dễ cầm nắm, bền chắc và giúp lan tỏa thương hiệu tự nhiên.",
		image: `/services/an-pham-su-kien/thumbnail/hashtag-cam-tay.avif`,
		chips: ["In lấy ngay", "Thiết kế nổi bật", "Bền chắc"],
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"In Hashtag Lấy Ngay",
			"Thiết Kế Nổi Bật",
			"Chất Liệu Formex Bền",
			"Giao Hàng Toàn Quốc",
		],
		stats: [
			{ value: "5.000", unit: "+", label: "Hashtag đã xuất xưởng" },
			{ value: "300", unit: "+", label: "Sự kiện tin dùng" },
			{ value: "5.0", unit: "★", label: "Đánh giá từ khách hàng" },
			{ value: "24", unit: "h", label: "Sản xuất nhanh chóng" },
		],
	},
	introduction: {
		eyebrow: "Dịch vụ in ấn sự kiện",
		title: "Hashtag cầm tay theo yêu cầu",
		description:
			"Hashtag cầm tay là lựa chọn lý tưởng để tạo không khí sinh động và tăng hiệu quả truyền thông cho sự kiện.",
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
					"Formex, PP bồi formex, decal bồi format... nhẹ, cứng cáp and bề mặt in sắc nét.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Lan tỏa thương hiệu",
				description:
					"Giúp tăng nhận diện qua logo, slogan and các thông điệp check-in nổi bật trên mạng xã hội.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại Hashtag",
		title: "Các dòng Hashtag",
		description: "Chúng tôi cung cấp đa dạng các loại hashtag phù hợp với từng nhu cầu cụ thể.",
		items: [
			{
				name: "Sự kiện doanh nghiệp",
				description: "Khai trương, workshop, hội thảo.",
				image: `/services/an-pham-su-kien/hashtag-cam-tay/6.avif`,
			},
			{
				name: "Tiệc & Kỷ niệm",
				description: "Sinh nhật, tiệc cưới, kỷ niệm.",
				image: `/services/an-pham-su-kien/hashtag-cam-tay/1.avif`,
			},
			{
				name: "Activation & Roadshow",
				description: "Hoạt động quảng bá ngoài trời.",
				image: `/services/an-pham-su-kien/hashtag-cam-tay/8.avif`,
			},
			{
				name: "Sự kiện trường học",
				description: "Lễ tốt nghiệp, ngày hội CLB.",
				image: `/services/an-pham-su-kien/hashtag-cam-tay/5.avif`,
			},
		],
	},
	whyInut: {
		eyebrow: "Tại sao chọn chúng tôi",
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
	testimonials: {
		eyebrow: "Đánh giá khách hàng",
		title: "Khách hàng nói gì về <em>INUT?</em>",
		items: [
			{
				name: "Nguyễn Anh Thư",
				role: "Travel Blogger · Hà Nội",
				text: "Mình order lần đầu mà rất hài lòng. Màu sắc in ra đúng như file thiết kế, giấy dày dặn, đóng gói kỹ.",
				initials: "NA",
				color: "#ff4d00",
			},
			{
				name: "Minh Hoàng Studio",
				role: "Nhiếp ảnh · Đà Nẵng",
				text: "Đặt hashtag cho sự kiện ra mắt sản phẩm. INUT tư vấn nhiệt tình, giao đúng hẹn and chất lượng vượt kỳ vọng.",
				initials: "MH",
				color: "#1a5c3a",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 300+ đánh giá",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để nhận báo giá nhanh và tư vấn mẫu thiết kế phù hợp nhất.",
		type: "hashtag-cam-tay",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án đã thực hiện",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 10 }).map(
			(_, index) => `/services/an-pham-su-kien/hashtag-cam-tay/${index + 1}.avif`
		),
		filters: [],
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
		url: "https://inutdesign.com/services/an-pham-su-kien/poster-decal",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm sự kiện", item: "/services/an-pham-su-kien" },
			{ name: "Poster & Decal", item: "/services/an-pham-su-kien/poster-decal" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Poster & Decal",
			serviceType: "In ấn sự kiện",
			provider: {
				"@type": "Organization",
				name: "INUT Design",
			},
			areaServed: {
				"@type": "Country",
				name: "VN",
			},
			offer: {
				"@type": "Offer",
				price: "30000",
				priceCurrency: "VND",
			},
		},
	},
	hero: {
		title: "Poster & Decal",
		description:
			"Giải pháp quảng bá hình ảnh mạnh mẽ với dịch vụ in poster và decal chất lượng cao: màu sắc sống động, độ phân giải sắc nét và đa dạng kích thước theo yêu cầu.",
		image: `/services/an-pham-su-kien/poster-decal/1.avif`,
		chips: ["In sắc nét", "Màu sắc sống động", "Đa dạng kích thước"],
		secondaryCtaLabel: "Xem portfolio",
		ticker: ["In Poster Sắc Nét", "Decal Chống Nước", "Màu Sắc Sống Động", "Giao Hàng Toàn Quốc"],
		stats: [
			{ value: "8.000", unit: "+", label: "m2 đã xuất xưởng" },
			{ value: "450", unit: "+", label: "Đối tác tin dùng" },
			{ value: "5.0", unit: "★", label: "Đánh giá từ khách hàng" },
			{ value: "24", unit: "h", label: "Giao hàng nhanh nhất" },
		],
	},
	introduction: {
		eyebrow: "Giải pháp quảng bá",
		title: "Poster & Decal quảng cáo chuyên nghiệp",
		description:
			"Poster và decal là công cụ không thể thiếu để truyền tải thông điệp và hình ảnh thương hiệu đến khách hàng một cách trực quan nhất.",
		bullets: [
			"Poster và decal là công cụ không thể thiếu để truyền tải thông điệp và hình ảnh thương hiệu đến khách hàng một cách trực quan nhất.",
			"Sử dụng công nghệ in kỹ thuật số hiện đại, đảm bảo độ phân giải cao and màu sắc trung thực so với bản thiết kế.",
			"Đa dạng chất liệu từ giấy PP, Decal sữa, Decal trong đến bạt Hiflex, đáp ứng mọi nhu cầu sử dụng trong nhà and ngoài trời.",
			"Hỗ trợ cán màng bảo vệ (mờ hoặc bóng) giúp tăng độ bền, chống trầy xước and giữ màu lâu phai theo thời gian.",
			"Thời gian hoàn thiện nhanh chóng, hỗ trợ in số lượng linh hoạt từ 1 tấm đến hàng trăm tấm.",
		],
		highlights: [
			{
				title: "Chất lượng in ấn",
				description:
					"Sử dụng mực in cao cấp, độ bám màu tốt and dải màu rộng, thể hiện chi tiết hình ảnh hoàn hảo.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Chất liệu đa dạng",
				description:
					"PP, Decal, Canvas, Backlit film... phù hợp for nhiều không gian quảng bá khác nhau.",
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
		eyebrow: "Chất liệu phổ biến",
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
		eyebrow: "Cam kết từ INUT",
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
					description: "Kiểm tra file and tư vấn layout miễn phí.",
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
	testimonials: {
		eyebrow: "Ý kiến đối tác",
		title: "Khách hàng nói gì về <em>INUT?</em>",
		items: [
			{
				name: "Lan Trinh Travel",
				role: "Lữ hành · TP.HCM",
				text: "Cần poster gấp cho tour du lịch, INUT xử lý trong 24h and giao tận khách sạn. Quá tuyệt vời!",
				initials: "LT",
				color: "#5c1a5c",
			},
			{
				name: "Phạm Quỳnh",
				role: "Handmade Shop · Hội An",
				text: "Decal của shop rất phù hợp với thương hiệu handmade của mình. Màu in đẹp tự nhiên, bám dính tốt.",
				initials: "PQ",
				color: "#5c4b1a",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 450+ đánh giá",
	},
	contact: {
		eyebrow: "Nhận báo giá",
		description: "Liên hệ ngay để được tư vấn kích thước và chất liệu phù hợp nhất.",
		type: "poster-decal",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Công trình tiêu biểu",
		title: "Hình ảnh thực tế",
		images: [
			`/services/an-pham-su-kien/poster-decal/1.avif`,
			`/services/an-pham-su-kien/poster-decal/2.avif`,
			`/services/an-pham-su-kien/poster-decal/3.avif`,
			`/services/an-pham-su-kien/poster-decal/4.avif`,
			`/services/an-pham-su-kien/poster-decal/5.avif`,
		],
		filters: [],
	},
};

export const BANNER_STANDEE_DATA: ProductPageData = {
	id: "banner-standee",
	name: "Banner & Standee",
	category: "Ấn phẩm sự kiện",
	seo: {
		title:
			"In Banner & Standee theo yêu cầu tại Đà Nẵng - Chuyên nghiệp, Nhanh chóng | INUT Design",
		description:
			"Dịch vụ in banner hiflex, standee quảng cáo chất lượng cao tại Đà Nẵng. Màu sắc sống động, khung cơ cấu chắc chắn, giao hàng nhanh. Lý tưởng cho sự kiện, triển lãm, khai trương!",
		url: "https://inutdesign.com/services/an-pham-su-kien/banner-standee",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm sự kiện", item: "/services/an-pham-su-kien" },
			{ name: "Banner & Standee", item: "/services/an-pham-su-kien/banner-standee" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Banner & Standee",
			serviceType: "In ấn sự kiện",
			provider: {
				"@type": "Organization",
				name: "INUT Design",
			},
			areaServed: {
				"@type": "Country",
				name: "VN",
			},
			offer: {
				"@type": "Offer",
				price: "150000",
				priceCurrency: "VND",
			},
		},
	},
	hero: {
		title: "Banner & Standee",
		description:
			"Giải pháp trưng bày thương hiệu chuyên nghiệp với dịch vụ in banner và standee chất lượng cao: màu sắc nổi bật, khung dựng bền chắc và kích thước linh hoạt theo từng không gian sự kiện.",
		image: `/services/an-pham-su-kien/banner-standee/1.avif`,
		chips: ["In sắc nét", "Khung cơ cấu chắc chắn", "Giao hàng nhanh"],
		secondaryCtaLabel: "Xem portfolio",
		ticker: ["In Banner Hiflex", "Standee Sự Kiện", "Dựng Lắp Tận Nơi", "Giao Hàng Toàn Quốc"],
		stats: [
			{ value: "5.000", unit: "+", label: "m2 banner đã xuất xưởng" },
			{ value: "300", unit: "+", label: "Đối tác tin dùng" },
			{ value: "5.0", unit: "★", label: "Đánh giá từ khách hàng" },
			{ value: "24", unit: "h", label: "Giao hàng nhanh nhất" },
		],
	},
	introduction: {
		eyebrow: "Giải pháp trưng bày",
		title: "Banner & Standee quảng cáo chuyên nghiệp",
		description:
			"Banner và standee là công cụ truyền thông trực quan không thể thiếu tại mọi sự kiện, hội nghị, khai trương hay không gian bán lẻ.",
		bullets: [
			"Banner và standee giúp thương hiệu hiện diện mạnh mẽ tại mọi không gian sự kiện — từ hội nghị, triển lãm đến khai trương và điểm bán lẻ.",
			"Sử dụng công nghệ in kỹ thuật số khổ lớn, đảm bảo độ phân giải cao và màu sắc trung thực so với bản thiết kế gốc.",
			"Đa dạng chất liệu từ bạt Hiflex, vải PP dệt đến Backlit film, phù hợp sử dụng cả trong nhà và ngoài trời.",
			"Khung cơ cấu standee bằng nhôm cao cấp — nhẹ, chắc chắn, dễ tháo lắp và mang theo khi di chuyển.",
			"Thời gian hoàn thiện nhanh chóng, hỗ trợ số lượng linh hoạt từ 1 chiếc đến hàng loạt cho chiến dịch lớn.",
		],
		highlights: [
			{
				title: "Chất lượng in ấn",
				description:
					"Mực in cao cấp kháng UV, bám màu bền và dải màu rộng — hình ảnh sắc nét dù nhìn gần hay xa.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Khung cơ cấu đa dạng",
				description:
					"X-Banner, Roll-up, L-Banner, khung Pop-up... lựa chọn phù hợp cho từng không gian và ngân sách.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Độ bền vượt trội",
				description:
					"Chất liệu kháng nước, chịu tia UV và gió nhẹ ngoài trời, duy trì vẻ đẹp suốt chiến dịch.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Ứng dụng rộng rãi",
				description:
					"Phù hợp cho khai trương, hội chợ, triển lãm, sự kiện nội bộ, điểm bán lẻ và không gian văn phòng.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Chủng loại phổ biến",
		title: "Các loại Banner & Standee",
		description: "Đa dạng kiểu dáng và chất liệu, phù hợp với mọi không gian trưng bày.",
		items: [
			{
				name: "Roll-up Banner",
				description: "Cuộn gọn tiện lợi, dễ di chuyển.",
				image: HERO_IMAGE,
			},
			{
				name: "X-Banner",
				description: "Khung chữ X nhẹ, lắp ráp nhanh.",
				image: HERO_IMAGE,
			},
			{
				name: "L-Banner",
				description: "Khung chữ L vững chắc, sang trọng.",
				image: HERO_IMAGE,
			},
			{
				name: "Banner Hiflex",
				description: "Khổ lớn, chịu thời tiết ngoài trời.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Cam kết từ INUT",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description:
			"Chúng tôi không chỉ in — chúng tôi đồng hành từ thiết kế đến lắp đặt, giúp thương hiệu của bạn hiện diện ấn tượng nhất tại mọi sự kiện.",
		productionProcess: {
			title: "Quy trình sản xuất chuyên nghiệp",
			items: [
				{
					title: "Thời gian linh hoạt",
					description: "Sản xuất nhanh, đáp ứng tiến độ gấp cho sự kiện.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Lắp dựng tận nơi",
					description: "Hỗ trợ lắp đặt tại địa điểm sự kiện theo yêu cầu.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn thiết kế",
					description: "Kiểm tra file và tư vấn bố cục, tỉ lệ miễn phí.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng cho mọi mục đích",
			description: "Banner và standee hiện diện mạnh mẽ ở bất kỳ không gian nào bạn cần.",
			items: [
				{
					title: "Khai trương, sự kiện",
					description: "Tạo điểm nhấn thu hút ngay từ lối vào.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Hội chợ, triển lãm",
					description: "Nổi bật giữa hàng trăm gian hàng cạnh tranh.",
					icon: <CardGiftcardIcon fontSize="small" />,
				},
				{
					title: "Điểm bán lẻ",
					description: "Truyền tải khuyến mãi và nhận diện thương hiệu.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Nội bộ doanh nghiệp",
					description: "Hội nghị, đào tạo, không gian văn phòng chuyên nghiệp.",
					icon: <GroupsIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Bản in sắc nét, màu sắc trung thực, khung cơ cấu chắc chắn — đúng hẹn mọi lần.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Ý kiến đối tác",
		title: "Khách hàng nói gì về <em>INUT?</em>",
		items: [
			{
				name: "Sky Coffee & Co.",
				role: "Chuỗi F&B · Đà Nẵng",
				text: "Đặt 20 bộ standee cho chuỗi khai trương, INUT giao đúng hẹn và lắp đặt tận nơi. Chất lượng in vượt kỳ vọng, màu sắc chuẩn nhận diện thương hiệu.",
				initials: "SC",
				color: "#1a3d5c",
			},
			{
				name: "Minh Khoa Events",
				role: "Tổ chức sự kiện · Đà Nẵng",
				text: "Là đơn vị tổ chức sự kiện, mình cần đối tác in ấn đáng tin cậy. INUT luôn xử lý file chuẩn và giao hàng đúng deadline — kể cả những đơn gấp nhất.",
				initials: "MK",
				color: "#1a5c2a",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 300+ đánh giá",
	},
	contact: {
		eyebrow: "Nhận báo giá",
		description: "Liên hệ ngay để được tư vấn kích thước, chất liệu và kiểu khung phù hợp nhất.",
		type: "banner-standee",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Công trình tiêu biểu",
		title: "Hình ảnh thực tế",
		images: [
			`/services/an-pham-su-kien/banner-standee/3.avif`,
			`/services/an-pham-su-kien/banner-standee/2.avif`,
			`/services/an-pham-su-kien/banner-standee/4.avif`,
			`/services/an-pham-su-kien/banner-standee/5.avif`,
			`/services/an-pham-su-kien/banner-standee/1.avif`,
		],
		filters: [],
	},
};

export const HUY_CHUONG_DATA: ProductPageData = {
	id: "huy-chuong",
	name: "Huy chương",
	category: "Sự kiện",
	seo: {
		title: "In Huy Chương Sự Kiện Chuyên Nghiệp tại Đà Nẵng – Tôn Vinh Thành Tích | INUT Design",
		description:
			"Huy chương sự kiện thiết kế riêng — acrylic, gỗ, kim loại, khắc laser tinh xảo. Đặt từ 10 cái, sản xuất 3–4 ngày. Báo giá nhanh tại INUT Design Đà Nẵng.",
		url: "https://inutdesign.com/services/an-pham-su-kien/huy-chuong",
		thumbnailUrl: `/services/an-pham-su-kien/thumbnail/huy-chuong.avif`,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Sự kiện", item: "/services/an-pham-su-kien/su-kien" },
			{ name: "Huy chương", item: "/services/an-pham-su-kien/huy-chuong" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Huy chương sự kiện theo yêu cầu",
			serviceType: "Sản xuất huy chương",
			provider: {
				"@type": "Organization",
				name: "INUT Design",
			},
			areaServed: {
				"@type": "Country",
				name: "VN",
			},
			offer: {
				"@type": "Offer",
				price: "25000",
				priceCurrency: "VND",
			},
		},
	},
	hero: {
		title: "Huy chương",
		description:
			"Huy chương là vật phẩm trao tặng mang tính biểu trưng cao — ghi nhận thành tích, tôn vinh người tham gia và tạo dấu ấn khó quên cho mọi chương trình, sự kiện.",
		image: `/services/an-pham-su-kien/thumbnail/huy-chuong.avif`,
		chips: ["Thiết kế theo yêu cầu", "Nhiều chất liệu", "Giao nhanh 3–4 ngày"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"Acrylic · Gỗ · Kim Loại",
			"Khắc Laser Tinh Xảo",
			"Từ 10 Cái",
			"Thiết Kế Theo Concept",
		],
		stats: [
			{ value: "50.000", unit: "+", label: "Huy chương đã sản xuất" },
			{ value: "300", unit: "+", label: "Sự kiện tin dùng" },
			{ value: "100", unit: "%", label: "Thiết kế theo yêu cầu" },
			{ value: "3", unit: "ngày", label: "Sản xuất nhanh nhất" },
		],
	},
	introduction: {
		eyebrow: "Huy chương sự kiện",
		title: "Tôn vinh thành tích — nâng tầm chương trình",
		description:
			"Huy chương không chỉ là phần thưởng — đó là dấu ấn ghi nhận thành tích, cảm xúc và hình ảnh của cả một sự kiện được đầu tư chỉn chu.",
		bullets: [
			"Mang tính biểu tượng và giá trị tinh thần cao — tạo cảm giác được ghi nhận và trân trọng.",
			"Tăng hình ảnh chuyên nghiệp cho sự kiện, dễ đồng bộ với bộ nhận diện thương hiệu.",
			"Có thể thiết kế riêng theo từng concept chương trình — logo, màu sắc, thông điệp.",
			"Đa dạng chất liệu: acrylic, gỗ, kim loại, mica — phù hợp mọi ngân sách và mục đích.",
			"Giá trị lưu niệm lâu dài — giúp sự kiện được nhớ đến nhiều hơn sau khi kết thúc.",
		],
		highlights: [
			{
				title: "Thiết kế theo concept",
				description:
					"Mỗi huy chương được thiết kế riêng theo tinh thần sự kiện — logo, màu sắc, thông điệp đều được cá nhân hóa.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Gia công tinh xảo",
				description:
					"In UV, khắc laser, cắt CNC hoặc ép nổi — thành phẩm sắc nét, chắc chắn, xứng đáng để trao tặng.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Nhiều chất liệu",
				description:
					"Acrylic hiện đại, gỗ mộc mạc, kim loại trang trọng — chọn chất liệu phù hợp nhất với ngân sách và concept.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Đặt ít vẫn được",
				description:
					"Tối thiểu 10 cái — phù hợp cả sự kiện nhỏ lẫn chương trình lớn hàng trăm người tham dự.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Chất liệu phổ biến",
		title: "Dòng huy chương",
		description: "Đa dạng chất liệu và hoàn thiện, phù hợp mọi concept sự kiện và ngân sách.",
		items: [
			{
				name: "Acrylic",
				description: "Hiện đại, trong suốt hoặc đục mịn, dễ tạo hình — phù hợp sự kiện trẻ trung.",
				image: `/services/an-pham-su-kien/huy-chuong/1.avif`,
			},
			{
				name: "Gỗ",
				description: "Cảm giác mộc mạc, gần gũi — phù hợp concept tự nhiên và handmade.",
				image: `/services/an-pham-su-kien/huy-chuong/13.avif`,
			},
			{
				name: "Kim loại",
				description: "Trang trọng, bền chắc, giá trị cao — lý tưởng cho lễ vinh danh.",
				image: `/services/an-pham-su-kien/huy-chuong/2.avif`,
			},
			{
				name: "In UV",
				description: "Màu sắc nổi bật, hình ảnh sắc nét — tối ưu chi phí cho số lượng lớn.",
				image: `/services/an-pham-su-kien/huy-chuong/11.avif`,
			},
		],
	},
	whyInut: {
		eyebrow: "Chất lượng từ xưởng",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description:
			"Không phải ai cũng làm huy chương đẹp — nhưng INUT làm điều đó mỗi ngày, với từng đơn hàng 10 cái hay 1.000 cái.",
		productionProcess: {
			title: "Quy trình chuyên nghiệp",
			items: [
				{
					title: "Giao nhanh, đúng hẹn",
					description: "Sản xuất từ 3–4 ngày, có thể rút ngắn khi cần gấp cho sự kiện.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đặt ít vẫn được",
					description: "Tối thiểu chỉ 10 cái — không ép số lượng lớn, phù hợp mọi quy mô.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Hỗ trợ thiết kế miễn phí",
					description: "INUT hỗ trợ thiết kế theo concept sự kiện, tư vấn chất liệu phù hợp nhất.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Dùng cho mọi sự kiện",
			description:
				"Từ giải chạy cuối tuần đến gala doanh nghiệp — huy chương INUT có mặt ở khắp nơi.",
			items: [
				{
					title: "Giải chạy & hội thao",
					description:
						"Giải chạy marathon, đi bộ, hội thao trường học và phong trào thể dục thể thao.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Cuộc thi & đấu trường",
					description: "Thi học thuật, văn nghệ, phong trào, cuộc thi tay nghề và sáng tạo.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Sự kiện doanh nghiệp",
					description: "Gala dinner, lễ vinh danh, team building, year-end party và kick-off.",
					icon: <EventAvailable fontSize="small" />,
				},
				{
					title: "Chương trình cộng đồng",
					description: "Workshop, sự kiện trường học, hoạt động từ thiện và event thương hiệu.",
					icon: <WorkspacePremiumIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description:
				"Thiết kế đúng tinh thần, thành phẩm đẹp chắc chắn, gia công chỉn chu — hoặc INUT làm lại.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Khách hàng tin tưởng",
		title: "Họ đã trao — và <em>ai cũng nhớ</em>",
		items: [
			{
				name: "Anh Hùng",
				role: "BTC Giải chạy Marathon · Đà Nẵng",
				text: "Huy chương acrylic INUT đẹp xuất sắc — đường cắt laser tinh xảo, màu sắc nổi bật. Runner nào nhận cũng chụp ảnh đăng Facebook, lan tỏa thương hiệu sự kiện miễn phí.",
				initials: "HH",
				color: "#2e7d32",
			},
			{
				name: "Chị Lan",
				role: "Phòng Nhân sự · Tập đoàn ABC",
				text: "Đặt huy chương gỗ cho lễ vinh danh nhân viên, chất lượng vượt mong đợi. Mộc mạc mà sang trọng, ai nhận cũng xúc động. INUT tư vấn rất nhiệt tình.",
				initials: "CL",
				color: "#e65100",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 300+ sự kiện tin dùng",
	},
	contact: {
		eyebrow: "Báo giá trong 15 phút",
		description:
			"Gửi concept sự kiện + số lượng — INUT tư vấn chất liệu và báo giá ngay, không cần đặt cọc.",
		type: "huy-chuong",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Sản phẩm thực tế",
		title: "Trao tay thành tích — ghi dấu sự kiện",
		images: Array.from({ length: 13 }).map(
			(_, index) => `/services/an-pham-su-kien/huy-chuong/${index + 1}.avif`
		),
		filters: [],
	},
};

export const SU_KIEN_TRON_GOI_DATA: ProductPageData = {
	id: "su-kien-tron-goi",
	name: "Sự Kiện Trọn Gói",
	category: "Ấn phẩm sự kiện",
	seo: {
		title: "Dịch Vụ Sự Kiện Trọn Gói tại Đà Nẵng – Chuyên Nghiệp, Đồng Bộ | INUT Design",
		description:
			"Dịch vụ sự kiện trọn gói tại Đà Nẵng: thiết kế, in ấn, thi công và set up đồng bộ. Phù hợp khai trương, hội nghị, workshop, activation. Báo giá nhanh trong 15 phút.",
		url: "https://inutdesign.com/services/an-pham-su-kien/su-kien-tron-goi",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm sự kiện", item: "/services/an-pham-su-kien" },
			{ name: "Sự Kiện Trọn Gói", item: "/services/an-pham-su-kien/su-kien-tron-goi" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "Dịch Vụ Sự Kiện Trọn Gói",
			serviceType: "Tổ chức sự kiện & In ấn",
			provider: {
				"@type": "Organization",
				name: "INUT Design",
			},
			areaServed: {
				"@type": "Country",
				name: "VN",
			},
			offer: {
				"@type": "Offer",
				priceCurrency: "VND",
			},
		},
	},
	hero: {
		title: "Sự Kiện Trọn Gói",
		description:
			"Từ concept đến thi công — INUT lo toàn bộ. Thiết kế đồng bộ, in ấn sắc nét, set up chỉn chu. Bạn chỉ cần xuất hiện và tận hưởng sự kiện.",
		image: HERO_IMAGE,
		chips: ["Đồng bộ 100%", "Triển khai nhanh", "Tư vấn miễn phí"],
		secondaryCtaLabel: "Xem portfolio",
		ticker: ["Thiết Kế Đồng Bộ", "In Ấn Sắc Nét", "Thi Công Chuyên Nghiệp", "Giao Hàng Đúng Hẹn"],
		stats: [
			{ value: "300", unit: "+", label: "Sự kiện đã triển khai" },
			{ value: "3–4", unit: " ngày", label: "Sản xuất tiêu chuẩn" },
			{ value: "5.0", unit: "★", label: "Đánh giá từ khách hàng" },
			{ value: "15", unit: " phút", label: "Phản hồi báo giá" },
		],
	},
	introduction: {
		eyebrow: "Giải pháp tổ chức sự kiện",
		title: "Sự kiện trọn gói theo yêu cầu",
		description:
			"Một dịch vụ trọn gói chuyên nghiệp giúp tiết kiệm thời gian, kiểm soát tốt chất lượng và nâng cao hình ảnh thương hiệu trong suốt quá trình tổ chức.",
		bullets: [
			"Lên concept và định hướng hình ảnh sự kiện từ giai đoạn đầu, đảm bảo nhất quán đến thành phẩm cuối.",
			"Thiết kế toàn bộ bộ nhận diện sự kiện — backdrop, standee, hashtag, thẻ đeo, giấy chứng nhận và nhiều hơn nữa.",
			"In ấn sắc nét, gia công chỉn chu với chất liệu phù hợp từng hạng mục và không gian thực tế.",
			"Thi công và set up tại địa điểm sự kiện — bố trí đúng bố cục, đúng thẩm mỹ, sẵn sàng vận hành.",
			"Triển khai theo timeline: thông thường 3–4 ngày làm việc cho các hạng mục cơ bản.",
		],
		highlights: [
			{
				title: "Sự kiện trọn gói là gì?",
				description:
					"Giải pháp cung cấp đầy đủ hạng mục tổ chức sự kiện từ concept, thiết kế, in ấn đến thi công — chỉ một đầu mối, đồng bộ toàn bộ.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Thiết kế đồng bộ",
				description:
					"Toàn bộ ấn phẩm được thiết kế theo một concept thống nhất — màu sắc, font chữ, thông điệp đồng nhất từ đầu đến cuối.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "In ấn & gia công chuẩn",
				description:
					"300 DPI, CMYK, bleed 3mm — đảm bảo chất lượng in sắc nét. Hỗ trợ cắt theo form, bồi cứng và cán màng bảo vệ.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Thi công & set up",
				description:
					"Lắp đặt backdrop, standee, bàn check-in và toàn bộ không gian sự kiện — kiểm tra tổng thể trước giờ khai mạc.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại sự kiện",
		title: "Các dạng sự kiện INUT đã triển khai",
		description:
			"Phù hợp với nhiều quy mô và loại hình chương trình — từ nội bộ đến sự kiện thương hiệu lớn.",
		items: [
			{
				name: "Khai trương & Ra mắt",
				description: "Khai trương cửa hàng, showroom, ra mắt sản phẩm.",
				image: HERO_IMAGE,
			},
			{
				name: "Hội nghị & Workshop",
				description: "Hội thảo, đào tạo, sự kiện doanh nghiệp nội bộ.",
				image: HERO_IMAGE,
			},
			{
				name: "Activation & Roadshow",
				description: "Booth activation, event thương hiệu, truyền thông ngoài trời.",
				image: HERO_IMAGE,
			},
			{
				name: "Trường học & Cộng đồng",
				description: "Lễ tốt nghiệp, ngày hội CLB, chương trình cộng đồng.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Tại sao chọn chúng tôi",
		title: "Vì sao chọn sự kiện trọn gói tại INUT Design?",
		description:
			"Một đầu mối — toàn bộ hạng mục. INUT đảm nhận từ thiết kế đến thi công, giúp bạn kiểm soát chất lượng và tiến độ dễ dàng hơn bao giờ hết.",
		productionProcess: {
			title: "Quy trình triển khai chuyên nghiệp",
			items: [
				{
					title: "Tiếp nhận & Tư vấn",
					description:
						"Xác định loại sự kiện, quy mô, hạng mục và ngân sách — phản hồi trong 15 phút.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Thiết kế & Kiểm duyệt",
					description: "Thiết kế đồng bộ theo concept, chỉnh sửa theo yêu cầu trước khi sản xuất.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "In ấn & Thi công",
					description: "Sản xuất đúng tiến độ, lắp đặt và bàn giao hoàn chỉnh trước giờ khai mạc.",
					icon: <DoneAllIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Các hạng mục thường có trong gói sự kiện",
			description:
				"Tùy quy mô và mục tiêu chương trình, INUT có thể tư vấn hạng mục phù hợp và tối ưu chi phí.",
			items: [
				{
					title: "Backdrop & Photobooth",
					description: "Khu vực check-in chuyên nghiệp, đẹp khi chụp ảnh.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Standee, Banner, Poster",
					description: "Thông tin sự kiện rõ ràng, bố cục thẩm mỹ.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Hashtag, Props & Thẻ đeo",
					description: "Tăng tương tác check-in và lan tỏa thương hiệu tự nhiên.",
					icon: <CardGiftcardIcon fontSize="small" />,
				},
				{
					title: "Huy chương & Giấy chứng nhận",
					description: "Kỷ niệm chương chính thức, in sắc nét và hoàn thiện tốt.",
					icon: <GroupsIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết đồng bộ, đúng hẹn và giá cạnh tranh",
			description:
				"Sự chuyên nghiệp của một chương trình thể hiện rõ qua cách các hạng mục nhỏ liên kết thành tổng thể nhất quán. INUT cam kết điều đó.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Đánh giá khách hàng",
		title: "Khách hàng nói gì về <em>INUT?</em>",
		items: [
			{
				name: "Công ty TNHH Minh Phát",
				role: "Sự kiện khai trương · Đà Nẵng",
				text: "INUT lo từ A đến Z — backdrop, standee, hashtag, thẻ đeo đều đồng bộ và đẹp hơn mình mong đợi. Giao đúng giờ, set up nhanh.",
				initials: "MP",
				color: "#ff4d00",
			},
			{
				name: "CLB Khởi Nghiệp Đà Nẵng",
				role: "Workshop thường niên · Đà Nẵng",
				text: "Làm việc rất chuyên nghiệp. Tư vấn rõ ràng từ đầu, thiết kế chỉnh sửa nhanh và bàn giao đúng timeline. Năm sau vẫn chọn INUT.",
				initials: "KN",
				color: "#1a5c3a",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 300+ đánh giá",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description:
			"Liên hệ ngay để được tư vấn hạng mục phù hợp và nhận báo giá nhanh cho sự kiện của bạn.",
		type: "su-kien-tron-goi",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án đã thực hiện",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 8 }).map(
			(_, index) => `/services/an-pham-su-kien/su-kien-tron-goi-da-nang/${index + 1}.avif`
		),
		filters: [],
	},
};
