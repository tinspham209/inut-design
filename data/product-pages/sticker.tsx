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
		url: "https://inutdesign.com/sticker/sticker-diecut",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Sticker Diecut",
		description:
			"Tạo dấu ấn riêng biệt với sticker cắt rời hoàn toàn theo đường viền thiết kế: nổi bật, dễ sử dụng and bền bỉ với khả năng chống nước vượt trội.",
		image: HERO_IMAGE,
		chips: ["Cắt rời hoàn toàn", "Chống nước", "Dễ bóc dán"],
	},
	introduction: {
		title: "Sticker cắt rời độc đáo",
		bullets: [
			"Sticker Diecut là lựa chọn lý tưởng khi bạn cần hình dán cắt rời nổi bật, độc đáo và dễ sử dụng.",
			"Chống nước, bền màu và phù hợp với nhiều điều kiện thời tiết khi dùng cho quảng bá hoặc trang trí.",
			"Có thể cắt theo bất kỳ hình dạng nào: logo, icon, nhân vật hoặc thiết kế minh họa riêng.",
			"Hỗ trợ tốt cho chiến dịch thương hiệu, quà tặng sự kiện và các sản phẩm cá nhân hóa.",
			"Đặt hàng nhanh: gửi thiết kế, số lượng và kích thước để INUT tư vấn và triển khai ngay.",
		],
		highlights: [
			{
				title: "Sticker Diecut là gì?",
				description:
					"Là sticker được cắt rời hoàn toàn theo đường viền thiết kế, giúp thành phẩm nổi bật và dễ bóc dán ngay.",
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
					"In và cán màng trước khi cắt kỹ thuật số, tạo thành sticker cắt rời hoàn chỉnh và sẵn sàng sử dụng.",
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
		title: "Dòng sticker Diecut",
		description: "Đa dạng các ứng dụng cho cá nhân và doanh nghiệp.",
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
	contact: {
		description: "Liên hệ ngay để nhận báo giá in Sticker Diecut nhanh nhất.",
		type: "sticker-diecut",
	},
	gallery: {
		images: Array.from({ length: 17 }).map(() => HERO_IMAGE),
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
		url: "https://inutdesign.com/sticker/sticker-kisscut",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Sticker Kisscut",
		description:
			"Giải pháp hoàn hảo cho các bộ sưu tập sticker: chỉ cắt lớp decal bề mặt and giữ nguyên lớp đế giấy.",
		image: HERO_IMAGE,
		chips: ["Cắt lớp bề mặt", "Dễ bảo quản"],
	},
	introduction: {
		title: "Bảo quản tối ưu",
		bullets: [
			"Sticker Kisscut giúp bảo quản các mẫu sticker nhỏ gọn và tinh tế hơn nhờ lớp đế giấy được giữ nguyên.",
			"Phù hợp cho các bộ sưu tập sticker, quà tặng đính kèm hoặc sản phẩm trang trí có nhiều chi tiết.",
			"Sử dụng decal chất lượng cao, chống nước và bền màu dưới tác động của môi trường.",
			"Dễ dàng bóc từng hình dán mà không làm ảnh hưởng đến các hình xung quanh trên cùng một tấm.",
			"Hỗ trợ in ấn sắc nét và cắt kỹ thuật số chuẩn xác theo mọi đường viền thiết kế.",
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
					"Lớp đế giấy giúp sticker không bị cong vênh, dễ dàng sắp xếp và lưu trữ trong thời gian dài.",
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
	contact: {
		description: "Liên hệ ngay để nhận báo giá in Sticker Kisscut nhanh nhất.",
		type: "sticker-kisscut",
	},
	gallery: {
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
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
		url: "https://inutdesign.com/sticker/sticker-magnet",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Sticker Magnet",
		description:
			"Giải pháp trang trí thông minh and linh hoạt: sticker nam châm dẻo hít lên mọi bề mặt kim loại, không để lại keo.",
		image: HERO_IMAGE,
		chips: ["Nam châm dẻo", "Không để lại keo"],
	},
	introduction: {
		title: "Trang trí linh hoạt",
		bullets: [
			"Sticker Magnet (nam châm dẻo) là sự kết hợp hoàn hảo giữa decal in sắc nét và lớp nam châm mỏng linh hoạt.",
			"Dễ dàng hít lên các bề mặt kim loại như tủ lạnh, cửa sắt, máy móc, bảng từ mà không cần keo dán.",
			"Có thể tháo rời và thay đổi vị trí liên tục mà không làm hỏng bề mặt vật dụng hoặc để lại vết keo.",
			"Sử dụng decal chống nước, giúp sticker bền bỉ trong môi trường bếp hoặc không gian công nghiệp.",
			"Hỗ trợ cắt laser theo mọi hình dáng: tròn, vuông, hình nhân vật hoặc logo doanh nghiệp.",
		],
		highlights: [
			{
				title: "Nam châm dẻo là gì?",
				description:
					"Là loại vật liệu có khả năng hít lên kim loại, mỏng và dẻo dai, dễ dàng uốn cong và cắt theo hình dạng yêu cầu.",
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
					"In ấn trên decal chất lượng cao kết hợp cán màng bảo vệ, giúp màu sắc luôn tươi mới và chống trầy xước.",
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
		title: "Dòng Magnet dẻo",
		description: "Ứng dụng thông minh cho không gian sống và làm việc.",
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
	contact: {
		description: "Liên hệ ngay để nhận báo giá in Sticker Magnet nhanh nhất.",
		type: "sticker-magnet",
	},
	gallery: {
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
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
		url: "https://inutdesign.com/sticker/sticker-sheet",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Sticker Sheet",
		description:
			"Sưu tầm trọn vẹn ý tưởng trên cùng một tấm sticker: nhiều hình dán kisscut được sắp xếp khoa học.",
		image: HERO_IMAGE,
		chips: ["Nhiều hình một tờ", "Chống nước"],
	},
	introduction: {
		title: "Bộ sưu tập sáng tạo",
		bullets: [
			"Sticker Sheet là giải pháp tuyệt vời để thể hiện một bộ sưu tập hình dán đa dạng trên cùng một tấm decal.",
			"Sử dụng kỹ thuật cắt kisscut cho từng hình nhỏ, giúp người dùng dễ dàng bóc dán theo nhu cầu.",
			"Kích thước phổ biến thường là A5 hoặc A4, cho phép sắp xếp hàng chục sticker khác nhau một cách sáng tạo.",
			"Decal chất lượng cao, kháng nước và bền màu, phù hợp trang trí lâu dài trên nhiều bề mặt.",
			"Hỗ trợ in ấn sắc nét, thể hiện tốt cả những chi tiết nhỏ và mảnh trong thiết kế.",
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
	contact: {
		description: "Liên hệ ngay để nhận báo giá in Sticker Sheet nhanh nhất.",
		type: "sticker-sheet",
	},
	gallery: {
		images: Array.from({ length: 15 }).map(() => HERO_IMAGE),
	},
};
