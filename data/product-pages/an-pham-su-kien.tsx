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
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Hashtag Cầm Tay",
		description:
			"Hashtag cầm tay là lựa chọn lý tưởng để tạo không khí sinh động và tăng hiệu quả truyền thông cho sự kiện: thiết kế nổi bật, dễ cầm nắm, bền chắc và giúp lan tỏa thương hiệu tự nhiên.",
		image: `/services/an-pham-su-kien/hashtag-cam-tay/1.avif`,
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
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án đã thực hiện",
		title: "Hình ảnh thực tế",
		images: [
			`/services/an-pham-su-kien/hashtag-cam-tay/2.avif`,
			`/services/an-pham-su-kien/hashtag-cam-tay/1.avif`,
			`/services/an-pham-su-kien/hashtag-cam-tay/4.avif`,
			`/services/an-pham-su-kien/hashtag-cam-tay/3.avif`,
		],
		filters: ["Tất cả", "Sự kiện", "Khai trương", "Cưới hỏi"],
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
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
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
		filters: ["Tất cả", "Poster", "Decal dán", "Bảng hiệu"],
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
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
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
		filters: ["Tất cả", "Roll-up", "X-Banner", "Banner Hiflex", "Standee Sự Kiện"],
	},
};
