import { ProductPageData } from "@/models/product-page";
import BoltIcon from "@mui/icons-material/Bolt";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import StorefrontIcon from "@mui/icons-material/Storefront";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import TimerIcon from "@mui/icons-material/Timer";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import GroupsIcon from "@mui/icons-material/Groups";
import CampaignIcon from "@mui/icons-material/Campaign";
import VerifiedIcon from "@mui/icons-material/Verified";
import React from "react";

const HERO_IMAGE = "/branding/logo.webp";

export const STICKER_DIECUT_DATA: ProductPageData = {
	id: "sticker-diecut",
	name: "Sticker Diecut",
	category: "Sticker",
	seo: {
		title: "Sticker Diecut theo yêu cầu - INUT Design",
		description:
			"In Sticker Diecut theo yêu cầu tại INUT Design: cắt rời theo thiết kế, chống nước bền màu, từ 10 sản phẩm, sản xuất 3-4 ngày. Liên hệ ngay để nhận báo giá nhanh.",
		url: "https://inutdesign.com/services/sticker/sticker-diecut",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Sticker Diecut",
		description:
			"Tạo dấu ấn riêng biệt với sticker cắt rời hoàn toàn theo đường viền thiết kế: nổi bật, dễ sử dụng and bền bỉ với khả năng chống nước vượt trội.",
		image: HERO_IMAGE,
		chips: ["Cắt rời hoàn toàn", "Chống nước", "Dễ bóc dán"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem portfolio",
		ticker: ["Sticker Diecut Cắt Rời", "Chống Nước Tuyệt Đối", "In UV Sắc Nét", "Cắt Theo Yêu Cầu"],
		stats: [
			{ value: "100.000", unit: "+", label: "Sticker đã in" },
			{ value: "500", unit: "+", label: "Shop tin dùng" },
			{ value: "100", unit: "%", label: "Chống nước" },
			{ value: "24", unit: "h", label: "Sản xuất nhanh" },
		],
	},
	introduction: {
		eyebrow: "Sticker cắt rời",
		title: "Độc đáo and Nổi bật",
		description:
			"Sticker Diecut là dòng sản phẩm cao cấp được cắt rời hoàn toàn theo hình dáng thiết kế, giúp mỗi miếng dán trở thành một tác phẩm nghệ thuật độc lập.",
		bullets: [
			"Sticker Diecut là lựa chọn lý tưởng khi bạn cần hình dán cắt rời nổi bật, độc đáo and dễ sử dụng.",
			"Chống nước, bền màu and phù hợp với nhiều điều kiện thời tiết khi dùng cho quảng bá hoặc trang trí.",
			"Có thể cắt theo bất kỳ hình dạng nào: logo, icon, nhân vật hoặc thiết kế minh họa riêng.",
			"Hỗ trợ tốt cho chiến dịch thương hiệu, quà tặng sự kiện and các sản phẩm cá nhân hóa.",
			"Đặt hàng nhanh: gửi thiết kế, số lượng and kích thước để INUT tư vấn and triển khai ngay.",
		],
		highlights: [
			{
				title: "Sticker Diecut là gì?",
				description:
					"Là sticker được cắt rời hoàn toàn theo đường viền thiết kế, giúp thành phẩm nổi bật and dễ bóc dán ngay.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Thiết kế cutline chuẩn",
				description:
					"Tạo đường cắt chính xác theo từng chi tiết, đảm bảo hình dáng sắc nét từ logo đến các artwork phức tạp.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Quy trình sản xuất",
				description:
					"In and cán màng trước khi cắt kỹ thuật số, tạo thành sticker cắt rời hoàn chỉnh and sẵn sàng sử dụng.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Công năng nổi bật",
				description:
					"Giúp thương hiệu dễ gây ấn tượng qua quà tặng quảng cáo, đồng thời đáp ứng tốt nhu cầu trang trí cá nhân.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Ứng dụng phổ biến",
		title: "Dòng sticker Diecut",
		description: "Đa dạng các ứng dụng cho cá nhân and doanh nghiệp.",
		items: [
			{
				name: "Sự kiện",
				description: "Nhận diện thương hiệu tại booth.",
				image: HERO_IMAGE,
			},
			{
				name: "Quà tặng",
				description: "Món quà đơn giản, hiệu quả.",
				image: HERO_IMAGE,
			},
			{
				name: "Bán lẻ",
				description: "Mở rộng danh mục sản phẩm.",
				image: HERO_IMAGE,
			},
			{
				name: "Cá nhân",
				description: "Trang trí laptop, điện thoại.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Chất lượng từ xưởng",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Sticker bền bỉ, màu sắc rực rỡ, cắt chuẩn kỹ thuật số.",
		productionProcess: {
			title: "Quy trình chuyên nghiệp",
			items: [
				{
					title: "Thời gian linh hoạt",
					description: "Sản xuất từ 2-4 ngày.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đa dạng số lượng",
					description: "Đặt làm từ 10 cái.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn kỹ thuật",
					description: "Hỗ trợ vẽ cutline miễn phí.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Sticker là công cụ truyền thông sáng tạo.",
			items: [
				{
					title: "Branding",
					description: "Quà tặng sự kiện, marketing.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Trang trí",
					description: "Dán laptop, điện thoại, xe.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Không gian",
					description: "Tạo điểm nhấn văn phòng.",
					icon: <EventAvailableIcon fontSize="small" />,
				},
				{
					title: "Cá nhân hóa",
					description: "Mang đậm dấu ấn cá nhân.",
					icon: <WorkspacePremiumIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Chống nước tuyệt đối, bền màu, cắt gọn.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Khách hàng hài lòng",
		title: "Đánh giá từ <em>người dùng</em>",
		items: [
			{
				name: "Anh Khoa",
				role: "Tech Reviewer",
				text: "Sticker in ở đây cực bền, mình dán laptop mang đi khắp nơi, va chạm nhiều nhưng màu vẫn rất tươi and không bị bong tróc.",
				initials: "AK",
				color: "#1976d2",
			},
			{
				name: "Chị Mai",
				role: "Chủ shop handmade",
				text: "Mấy bé sticker diecut này làm quà tặng kèm khách thích lắm luôn. Đường cắt mượt, bóc ra dán rất dễ dàng.",
				initials: "CM",
				color: "#d81b60",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 500+ shop tin dùng",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để nhận báo giá in Sticker Diecut nhanh nhất.",
		type: "sticker-diecut",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Sản phẩm thực tế",
		title: "Hình ảnh dự án",
		images: Array.from({ length: 17 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Sự kiện", "Cá nhân", "Brand"],
	},
};

export const STICKER_KISSCUT_DATA: ProductPageData = {
	id: "sticker-kisscut",
	name: "Sticker Kisscut",
	category: "Sticker",
	seo: {
		title: "Sticker Kisscut theo yêu cầu - INUT Design",
		description:
			"In Sticker Kisscut theo yêu cầu tại INUT Design: chỉ cắt lớp decal, giữ nguyên lớp đế, chống nước bền màu, từ 10 sản phẩm. Liên hệ ngay để nhận báo giá nhanh.",
		url: "https://inutdesign.com/services/sticker/sticker-kisscut",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Sticker Kisscut",
		description:
			"Giải pháp hoàn hảo cho các bộ sưu tập sticker: chỉ cắt lớp decal bề mặt and giữ nguyên lớp đế giấy.",
		image: HERO_IMAGE,
		chips: ["Cắt lớp bề mặt", "Dễ bảo quản"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem mẫu",
		ticker: [
			"Sticker Kisscut Tiện Lợi",
			"Cắt Lớp Decal Bề Mặt",
			"Dễ Dàng Bóc Dán",
			"Chống Nước Bền Màu",
		],
		stats: [
			{ value: "50.000", unit: "+", label: "Tấm sticker kisscut" },
			{ value: "300", unit: "+", label: "Đối tác Artist" },
			{ value: "100", unit: "%", label: "Độ chính xác cắt" },
			{ value: "2-3", unit: "ngày", label: "Sản xuất nhanh" },
		],
	},
	introduction: {
		eyebrow: "Sticker tiện lợi",
		title: "Dễ bóc - Dễ bảo quản",
		description:
			"Sticker Kisscut là lựa chọn thông minh khi bạn muốn giữ nhiều mẫu hình trên một tấm đế duy nhất, giúp việc lưu trữ and sử dụng trở nên cực kỳ thuận tiện.",
		bullets: [
			"Sticker Kisscut giúp bảo quản các mẫu sticker nhỏ gọn and tinh tế hơn nhờ lớp đế giấy được giữ nguyên.",
			"Phù hợp cho các bộ sưu tập sticker, quà tặng đính kèm hoặc sản phẩm trang trí có nhiều chi tiết.",
			"Sử dụng decal chất lượng cao, chống nước and bền màu dưới tác động của môi trường.",
			"Dễ dàng bóc từng hình dán mà không làm ảnh hưởng đến các hình xung quanh trên cùng một tấm.",
			"Hỗ trợ in ấn sắc nét and cắt kỹ thuật số chuẩn xác theo mọi đường viền thiết kế.",
		],
		highlights: [
			{
				title: "Sticker Kisscut là gì?",
				description:
					"Là kỹ thuật chỉ cắt đứt lớp decal bề mặt theo hình dạng yêu cầu, lớp đế giấy bên dưới vẫn được giữ nguyên.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Bảo quản tối ưu",
				description:
					"Lớp đế giấy giúp sticker không bị cong vênh, dễ dàng sắp xếp and lưu trữ trong thời gian dài.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "In ấn đa dạng",
				description:
					"Hỗ trợ in trên decal sữa, decal trong hoặc các loại decal đặc biệt khác với độ sắc nét cao.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Tiện lợi khi sử dụng",
				description:
					"Khách hàng có thể dễ dàng bóc từng sticker ra để dán lên các bề mặt khác nhau một cách nhanh chóng.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Dòng sản phẩm",
		title: "Dòng sticker Kisscut",
		description: "Tiện lợi cho việc sử dụng nhiều hình ảnh trên một bề mặt.",
		items: [
			{
				name: "Bộ sticker trang trí",
				description: "Nhiều mẫu nhỏ cùng chủ đề.",
				image: HERO_IMAGE,
			},
			{
				name: "Logo sản phẩm",
				description: "Dán bao bì, chai lọ quà tặng.",
				image: HERO_IMAGE,
			},
			{
				name: "Nhân vật & Artwork",
				description: "Goods dành cho artist.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Độ chính xác cao",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Sticker Kisscut in ấn sắc nét, cắt chuẩn xác từng milimet.",
		productionProcess: {
			title: "Quy trình chuyên nghiệp",
			items: [
				{
					title: "Thời gian linh hoạt",
					description: "Sản xuất từ 2-4 ngày.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đa dạng số lượng",
					description: "Hỗ trợ in từ số lượng ít.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn kỹ thuật",
					description: "Kiểm tra file chuẩn kisscut.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Sự lựa chọn hàng đầu cho các bộ sưu tập sticker.",
			items: [
				{
					title: "Planner & Sổ tay",
					description: "Làm đẹp lịch, sổ làm việc.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "Dán bao bì",
					description: "Dán logo shop lên hộp ship.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Merchandise",
					description: "Quà tặng xinh xắn cho fan.",
					icon: <EventAvailableIcon fontSize="small" />,
				},
				{
					title: "Branding",
					description: "Tiếp cận khách hàng nhẹ nhàng.",
					icon: <BoltIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "In sắc nét, màu sắc rực rỡ, cắt chuẩn.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Phản hồi Artist",
		title: "Chất lượng <em>vượt mong đợi</em>",
		items: [
			{
				name: "Lê Na",
				role: "Illustrator",
				text: "Mấy tấm kisscut in ra màu rất trong and sắc nét. Đường cắt kisscut chuẩn, bóc ra nhẹ nhàng không bị rách hay dính đế.",
				initials: "LN",
				color: "#673ab7",
			},
			{
				name: "Anh Minh",
				role: "Shop Chủ",
				text: "Dùng để dán logo lên ly trà sữa rất tiện. Tấm kisscut giúp mình kiểm soát số lượng decal đã dùng dễ dàng hơn.",
				initials: "AM",
				color: "#2e7d32",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 300+ Artist đối tác",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để nhận báo giá in Sticker Kisscut nhanh nhất.",
		type: "sticker-kisscut",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Mẫu Sticker Kisscut",
		title: "Hình ảnh dự án",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Trang trí", "Logo", "Artist Goods"],
	},
};

export const STICKER_MAGNET_DATA: ProductPageData = {
	id: "sticker-magnet",
	name: "Sticker Magnet",
	category: "Sticker",
	seo: {
		title: "Sticker Magnet (Nam châm dẻo) theo yêu cầu - INUT Design",
		description:
			"In Sticker Magnet (nam châm dẻo) theo yêu cầu tại INUT Design: hít lên bề mặt kim loại, chống nước bền màu, linh hoạt hình dáng. Liên hệ ngay để nhận báo giá nhanh.",
		url: "https://inutdesign.com/services/sticker/sticker-magnet",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Sticker Magnet",
		description:
			"Giải pháp trang trí thông minh and linh hoạt: sticker nam châm dẻo hít lên mọi bề mặt kim loại, không để lại keo.",
		image: HERO_IMAGE,
		chips: ["Nam châm dẻo", "Không để lại keo"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem mẫu",
		ticker: ["Nam Châm Dẻo", "Hít Kim Loại", "Không Để Lại Keo", "Trang Trí Linh Hoạt"],
		stats: [
			{ value: "5.000", unit: "+", label: "Magnet dẻo đã in" },
			{ value: "100", unit: "+", label: "Doanh nghiệp tin dùng" },
			{ value: "100", unit: "%", label: "Lực hút ổn định" },
			{ value: "3-4", unit: "ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Trang trí linh hoạt",
		title: "Tiện lợi and Sạch sẽ",
		description:
			"Sticker Magnet là sự kết hợp độc đáo giữa decal in sắc nét and lớp nam châm dẻo, giúp bạn dễ dàng trang trí hoặc thông báo trên các bề mặt kim loại mà không lo vết keo.",
		bullets: [
			"Sticker Magnet (nam châm dẻo) là sự kết hợp hoàn hảo giữa decal in sắc nét and lớp nam châm mỏng linh hoạt.",
			"Dễ dàng hít lên các bề mặt kim loại như tủ lạnh, cửa sắt, máy móc, bảng từ mà không cần keo dán.",
			"Có thể tháo rời and thay đổi vị trí liên tục mà không làm hỏng bề mặt vật dụng hoặc để lại vết keo.",
			"Sử dụng decal chống nước, giúp sticker bền bỉ trong môi trường bếp hoặc không gian công nghiệp.",
			"Hỗ trợ cắt laser theo mọi hình dáng: tròn, vuông, hình nhân vật hoặc logo doanh nghiệp.",
		],
		highlights: [
			{
				title: "Nam châm dẻo là gì?",
				description:
					"Là loại vật liệu có khả năng hít lên kim loại, mỏng and dẻo dai, dễ dàng uốn cong and cắt theo hình dạng yêu cầu.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Tính linh hoạt cao",
				description:
					"Thay đổi vị trí trang trí bất cứ lúc nào bạn muốn. Rất tiện lợi cho các thông báo tạm thời hoặc trang trí thay đổi theo mùa.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Độ bền màu sắc",
				description:
					"In ấn trên decal chất lượng cao kết hợp cán màng bảo vệ, giúp màu sắc luôn tươi mới and chống trầy xước.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Không gây hại bề mặt",
				description:
					"Vì sử dụng lực hít từ tính nên hoàn toàn không làm trầy xước sơn hay để lại vết bẩn trên thiết bị.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Ứng dụng Magnet",
		title: "Dòng Magnet dẻo",
		description: "Ứng dụng thông minh cho không gian sống and làm việc.",
		items: [
			{
				name: "Magnet tủ lạnh",
				description: "Trang trí bếp, ghi chú tiện lợi.",
				image: HERO_IMAGE,
			},
			{
				name: "Magnet quảng cáo",
				description: "In logo dán lên thiết bị khách.",
				image: HERO_IMAGE,
			},
			{
				name: "Magnet thông báo",
				description: "Dán hướng dẫn lên máy móc.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Ưu điểm Magnet",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Sticker magnet hít mạnh, in ấn sắc nét, cắt gọn gàng.",
		productionProcess: {
			title: "Quy trình chuyên nghiệp",
			items: [
				{
					title: "Thời gian linh hoạt",
					description: "Sản xuất từ 2-4 ngày.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đa dạng số lượng",
					description: "Hỗ trợ in từ số lượng ít.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn kỹ thuật",
					description: "Hỗ trợ thiết kế hình dáng.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Giải pháp trang trí không để lại vết bẩn.",
			items: [
				{
					title: "Không gian sống",
					description: "Làm mới tủ lạnh, bảng từ.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "Marketing",
					description: "Quà tặng độc đáo cho khách.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Quản lý",
					description: "Đánh dấu trạng thái trên bảng.",
					icon: <EventAvailableIcon fontSize="small" />,
				},
				{
					title: "Quà lưu niệm",
					description: "Món quà nhỏ xinh cho bạn bè.",
					icon: <BoltIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Lực hút ổn định, màu sắc bền đẹp.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Phản hồi người dùng",
		title: "Tiện lợi <em>tối đa</em>",
		items: [
			{
				name: "Anh Hải",
				role: "Quản lý xưởng sản xuất",
				text: "Dùng magnet dẻo để dán quy trình lên máy móc rất tiện. Khi thay đổi chỉ cần bóc ra dán lại, không sợ bẩn máy.",
				initials: "AH",
				color: "#ef6c00",
			},
			{
				name: "Chị Thảo",
				role: "Nội trợ",
				text: "Mấy cái nam châm dẻo in hình gia đình dán tủ lạnh rất xinh. Hình ảnh rõ nét, hút rất chắc chắn.",
				initials: "CT",
				color: "#00838f",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 100+ doanh nghiệp",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để nhận báo giá in Sticker Magnet nhanh nhất.",
		type: "sticker-magnet",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Mẫu Magnet dẻo",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Tủ lạnh", "Thông báo", "Quà tặng"],
	},
};

export const STICKER_SHEET_DATA: ProductPageData = {
	id: "sticker-sheet",
	name: "Sticker Sheet",
	category: "Sticker",
	seo: {
		title: "Sticker Sheet theo yêu cầu - INUT Design",
		description:
			"In Sticker Sheet theo yêu cầu tại INUT Design: nhiều mẫu trên cùng một tờ, chống nước bền màu, từ 10 tờ, sản xuất nhanh. Liên hệ ngay để nhận báo giá nhanh.",
		url: "https://inutdesign.com/services/sticker/sticker-sheet",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Sticker Sheet",
		description:
			"Sưu tầm trọn vẹn ý tưởng trên cùng một tấm sticker: nhiều hình dán kisscut được sắp xếp khoa học.",
		image: HERO_IMAGE,
		chips: ["Nhiều hình một tờ", "Chống nước"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem mẫu",
		ticker: [
			"Sticker Sheet Sáng Tạo",
			"Nhiều Mẫu Một Tờ",
			"Chống Nước Bền Màu",
			"Giải Pháp Merchandise",
		],
		stats: [
			{ value: "30.000", unit: "+", label: "Tờ sticker đã in" },
			{ value: "150", unit: "+", label: "Artist & Brand" },
			{ value: "100", unit: "%", label: "Chất lượng cán màng" },
			{ value: "3-4", unit: "ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Bộ sưu tập Sticker",
		title: "Thế giới Sticker thu nhỏ",
		description:
			"Sticker Sheet là cách tuyệt vời để bạn sở hữu hàng chục hình dán theo chủ đề trên một tấm decal duy nhất, tối ưu chi phí and tối đa sự sáng tạo.",
		bullets: [
			"Sticker Sheet là giải pháp tuyệt vời để thể hiện một bộ sưu tập hình dán đa dạng trên cùng một tấm decal.",
			"Sử dụng kỹ thuật cắt kisscut cho từng hình nhỏ, giúp người dùng dễ dàng bóc dán theo nhu cầu.",
			"Kích thước phổ biến thường là A5 hoặc A4, cho phép sắp xếp hàng chục sticker khác nhau một cách sáng tạo.",
			"Decal chất lượng cao, kháng nước and bền màu, phù hợp trang trí lâu dài trên nhiều bề mặt.",
			"Hỗ trợ in ấn sắc nét, thể hiện tốt cả những chi tiết nhỏ and mảnh trong thiết kế.",
		],
		highlights: [
			{
				title: "Sticker Sheet là gì?",
				description:
					"Là một tấm decal lớn chứa nhiều hình sticker nhỏ đã được cắt kisscut, giúp bóc dán từng hình lẻ dễ dàng.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Tiết kiệm & Hiệu quả",
				description:
					"In được nhiều mẫu hình khác nhau chỉ trong một lượt in, tối ưu hóa chi phí sản xuất cho các bộ sưu tập.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Sắp xếp theo chủ đề",
				description:
					"Dễ dàng tạo ra các bộ sticker theo concept như: du lịch, động vật, icon học tập, nhận diện thương hiệu.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Ứng dụng đa năng",
				description:
					"Rất được ưa chuộng để trang trí sổ tay, laptop, làm quà tặng kèm hoặc merchandise cho artist.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Concept phổ biến",
		title: "Dòng sticker Sheet",
		description: "Tiết kiệm chi phí in ấn cho các bộ sưu tập hình dán.",
		items: [
			{
				name: "Sheet trang trí sổ",
				description: "Icon nhỏ cho Planner.",
				image: HERO_IMAGE,
			},
			{
				name: "Sheet thương hiệu",
				description: "Logo và icon bổ trợ.",
				image: HERO_IMAGE,
			},
			{
				name: "Sheet fan merch",
				description: "Hình ảnh idol, hoạt hình.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Chuyên nghiệp & Tận tâm",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Sticker sheet in ấn sắc nét, sắp xếp khoa học, dễ bóc dán.",
		productionProcess: {
			title: "Quy trình chuyên nghiệp",
			items: [
				{
					title: "Thời gian linh hoạt",
					description: "Sản xuất từ 2-4 ngày.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đa dạng số lượng",
					description: "Đặt làm từ 10 tờ.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn kỹ thuật",
					description: "Hỗ trợ dàn trang sticker.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Giải pháp merchandise hàng đầu cho artist.",
			items: [
				{
					title: "Artist & Creator",
					description: "In merchandise chi phí hợp lý.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "Giáo dục",
					description: "Sticker khen thưởng học sinh.",
					icon: <WorkspacePremiumIcon fontSize="small" />,
				},
				{
					title: "Kinh doanh",
					description: "Quà tặng đính kèm đơn hàng.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Planner",
					description: "Cá nhân hóa thời gian biểu.",
					icon: <EventAvailableIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "In sắc nét, decal bền bỉ, cắt chuẩn kisscut.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Ý kiến Artist",
		title: "Merchandise <em>hợp thời</em>",
		items: [
			{
				name: "Bạn Linh",
				role: "Bullet Journal Enthusiast",
				text: "Sticker sheet ở đây dàn trang rất đẹp, màu sắc in rực rỡ. Mình dùng để trang trí sổ tay khách hàng khen quá trời.",
				initials: "BL",
				color: "#6a1b9a",
			},
			{
				name: "Anh Hoàng",
				role: "Graphic Designer",
				text: "In sheet giúp tiết kiệm chi phí cho bộ sưu tập sticker mới của mình. Chất lượng cán màng mờ nhìn rất sang trọng.",
				initials: "AH",
				color: "#283593",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 150+ Artist đối tác",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để nhận báo giá in Sticker Sheet nhanh nhất.",
		type: "sticker-sheet",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Mẫu Sticker Sheet",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 15 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Planner", "Artist Merch", "Brand"],
	},
};
