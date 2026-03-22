import { ProductPageData } from "@/models/product-page";
import CampaignIcon from "@mui/icons-material/Campaign";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SchoolIcon from "@mui/icons-material/School";
import StorefrontIcon from "@mui/icons-material/Storefront";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import BoltIcon from "@mui/icons-material/Bolt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TimerIcon from "@mui/icons-material/Timer";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import VerifiedIcon from "@mui/icons-material/Verified";
import React from "react";

const HERO_IMAGE = "/branding/logo.webp";

export const GIAY_KHEN_DATA: ProductPageData = {
	id: "giay-khen-giay-chung-nhan",
	name: "Giấy Khen & Giấy Chứng Nhận",
	category: "Ấn phẩm văn phòng",
	seo: {
		title: "In Giấy Khen, Giấy Chứng Nhận Chuyên Nghiệp | INUT Design",
		description:
			"In ấn giấy khen, giấy chứng nhận cao cấp tại Đà Nẵng với giấy Couche, Mỹ thuật chuyên nghiệp. Thiết kế chuẩn nhận diện, tùy chọn ép kim sang trọng, nâng tầm uy tín doanh nghiệp.",
		url: "https://inutdesign.com/services/an-pham-van-phong/giay-khen-giay-chung-nhan",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Giấy Khen & Chứng Nhận",
		description:
			"Thể hiện sự trân trọng và vinh danh xứng đáng với dịch vụ in giấy khen, giấy chứng nhận chuyên nghiệp: thiết kế trang trọng, chất liệu cao cấp và gia công tinh tế.",
		image: HERO_IMAGE,
		chips: ["Thiết kế trang trọng", "Chất liệu cao cấp"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem mẫu thiết kế",
		ticker: [
			"In Giấy Khen Cao Cấp",
			"Chứng Nhận Sang Trọng",
			"Gia Công Ép Kim",
			"Thiết Kế Trang Trọng",
		],
		stats: [
			{ value: "5.000", unit: "+", label: "Bản in vinh danh" },
			{ value: "200", unit: "+", label: "Trường học & Tổ chức" },
			{ value: "5.0", unit: "★", label: "Độ sắc nét bản in" },
			{ value: "1-2", unit: "ngày", label: "Sản xuất nhanh" },
		],
	},
	introduction: {
		eyebrow: "Vinh danh thành tích",
		title: "Trân trọng giá trị nỗ lực",
		description:
			"Giấy khen and giấy chứng nhận không chỉ là vật phẩm lưu niệm, mà là sự công nhận chính thức giúp tạo động lực and nâng tầm uy tín cho tổ chức cấp phát.",
		bullets: [
			"Thể hiện sự công nhận chính thức, tạo động lực mạnh mẽ.",
			"Nâng cao hình ảnh chuyên nghiệp của đơn vị cấp phát.",
			"Tạo ấn tượng trang trọng and đánh giá cao người nhận.",
			"Lưu trữ thông tin, thành tích and kết quả minh bạch.",
		],
		highlights: [
			{
				title: "Giấy khen vinh danh",
				description:
					"Khen thưởng thành tích, nỗ lực hoặc đóng góp của cá nhân hay tập thể. Mang tính vinh danh, khích lệ and tạo động lực.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Giấy chứng nhận",
				description:
					"Xác nhận kết quả, năng lực, tư cách, sự hoàn thành khóa học hoặc tham gia sự kiện. Có tính xác thực and lưu trữ cao.",
				icon: <SchoolIcon fontSize="small" />,
			},
			{
				title: "Chất liệu cao cấp",
				description:
					"Đa dạng định lượng giấy như Couche, mỹ thuật, Fort, Ivory bảo đảm độ dày dặn, bám mực tốt and sang trọng.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Gia công sau in",
				description:
					"Kết hợp ép kim, dập nổi, cán màng mờ hoặc in nhũ để tăng giá trị thẩm mỹ, đóng khung gỗ sang trọng.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Dòng sản phẩm",
		title: "Quy cách sản phẩm",
		description: "Đa dạng các loại giấy and quy cách thành phẩm chuyên nghiệp.",
		items: [
			{
				name: "Giấy khen / Bằng khen",
				description: "Vinh danh học tập, công tác.",
				image: "/branding/services/thiet-ke-in-an.avif",
			},
			{
				name: "Giấy chứng nhận",
				description: "Xác nhận năng lực chuyên môn.",
				image: "/branding/services/sticker.avif",
			},
		],
	},
	whyInut: {
		eyebrow: "Sự chuyên nghiệp",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Ấn phẩm trang trọng cho những khoảnh khắc vinh danh đáng nhớ.",
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
					description: "Đặt in từ số lượng ít.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn thiết kế",
					description: "Hỗ trợ layout chuẩn trang trọng.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng rộng rãi",
			description: "Sản phẩm phù hợp cho mọi tổ chức and cá nhân.",
			items: [
				{
					title: "Doanh nghiệp",
					description: "Khen thưởng nhân viên xuất sắc.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Trường học",
					description: "Giấy khen học tập, tốt nghiệp.",
					icon: <SchoolIcon fontSize="small" />,
				},
				{
					title: "Sự kiện",
					description: "Chứng nhận tham gia Workshop.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Tổ chức",
					description: "Vinh danh đóng góp cộng đồng.",
					icon: <GroupsIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Màu sắc tươi sáng, chất liệu giấy bền đẹp, gia công tinh tế.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Phản hồi khách hàng",
		title: "Sự hài lòng của <em>đối tác</em>",
		items: [
			{
				name: "Thầy Minh Tâm",
				role: "Hiệu trưởng trường THCS",
				text: "Nhà trường rất hài lòng với chất lượng giấy khen năm nay. Thiết kế trang trọng, màu sắc in rất đẹp and giao hàng đúng tiến độ.",
				initials: "MT",
				color: "#1b5e20",
			},
			{
				name: "Chị Ngọc Mai",
				role: "HR Manager · Tech Corp",
				text: "Giấy chứng nhận cho khóa đào tạo nội bộ được thiết kế rất chuyên nghiệp. Ép kim logo trông rất sang trọng.",
				initials: "NM",
				color: "#0d47a1",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 200+ tổ chức",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để nhận báo giá in giấy khen, giấy chứng nhận nhanh chóng.",
		type: "giay-khen-giay-chung-nhan",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án đã thực hiện",
		title: "Mẫu sản phẩm thực tế",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Giấy khen", "Chứng nhận", "Ép kim"],
	},
};

export const IN_BI_THU_DATA: ProductPageData = {
	id: "in-bi-thu",
	name: "In Bì Thư",
	category: "Ấn phẩm văn phòng",
	seo: {
		title: "In Bì Thư Chuyên Nghiệp Tại Đà Nẵng | INUT Design",
		description:
			"Dịch vụ in bì thư (bao thư) chất lượng cao cho doanh nghiệp. Đầy đủ các kích thước A4, A5, A6. Thiết kế chuyên nghiệp, in sắc nét, giá cả cạnh tranh.",
		url: "https://inutdesign.com/services/an-pham-van-phong/in-bi-thu",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "In Bì Thư Doanh Nghiệp",
		description:
			"Xây dựng bộ nhận diện thương hiệu chuyên nghiệp ngay từ những chi tiết nhỏ nhất. Bì thư in sắc nét, chất liệu giấy tốt giúp bảo vệ tài liệu và tạo ấn tượng tốt với đối tác.",
		image: HERO_IMAGE,
		chips: ["Thiết kế đồng bộ", "In sắc nét"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"In Bì Thư Doanh Nghiệp",
			"Kích Thước A4 A5 A6",
			"Chất Liệu Giấy Fort",
			"In Offset Sắc Nét",
		],
		stats: [
			{ value: "50.000", unit: "+", label: "Bì thư đã xuất xưởng" },
			{ value: "300", unit: "+", label: "Doanh nghiệp tin dùng" },
			{ value: "100", unit: "%", label: "Chất lượng keo dán" },
			{ value: "3-5", unit: "ngày", label: "Thời gian in offset" },
		],
	},
	introduction: {
		eyebrow: "Nhận diện thương hiệu",
		title: "Chuyên nghiệp từ chi tiết nhỏ",
		description:
			"Bì thư không chỉ bảo vệ tài liệu mà còn là công cụ truyền thông hiệu quả, thể hiện sự chuyên nghiệp and chỉn chu của doanh nghiệp trong mọi giao dịch.",
		bullets: [
			"Bì thư là một phần quan trọng trong bộ nhận diện.",
			"Giúp bảo mật tài liệu, thư từ khi gửi đối tác.",
			"Thể hiện sự chuyên nghiệp and tôn trọng người nhận.",
			"Đa dạng kích thước phù hợp với mục đích sử dụng.",
		],
		highlights: [
			{
				title: "Thiết kế chuyên nghiệp",
				description:
					"Logo, thông tin liên hệ được bố trí hài hòa, đồng bộ với nhận diện thương hiệu.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Đa dạng kích thước",
				description: "Bì thư lớn (A4), bì thư vừa (A5) and bì thư nhỏ (A6/DL) đáp ứng mọi nhu cầu.",
				icon: <BusinessIcon fontSize="small" />,
			},
			{
				title: "Chất liệu giấy tốt",
				description: "Sử dụng giấy Fort, Couche hoặc giấy mỹ thuật định lượng phù hợp, độ bền cao.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Gia công hoàn thiện",
				description:
					"Dán thành phẩm chắc chắn, có sẵn lớp keo chờ hoặc băng dính hai mặt tiện lợi.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Kích thước tiêu chuẩn",
		title: "Quy cách bì thư",
		description: "Đa dạng các kích thước tiêu chuẩn cho doanh nghiệp.",
		items: [
			{
				name: "Bì thư A4",
				description: "Đựng tài liệu, hợp đồng khổ A4.",
				image: "/branding/services/thiet-ke-in-an.avif",
			},
			{
				name: "Bì thư A5",
				description: "Đựng hóa đơn, thư mời khổ A5.",
				image: "/branding/services/sticker.avif",
			},
			{
				name: "Bì thư A6",
				description: "Chuyên dùng cho thư ngỏ, thiệp.",
				image: "/branding/services/skin-laptop.avif",
			},
		],
	},
	whyInut: {
		eyebrow: "Lợi ích dịch vụ",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Bì thư in ấn sắc nét, chuyên nghiệp cho mọi giao dịch.",
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
					description: "Hỗ trợ in offset số lượng lớn.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn thiết kế",
					description: "Đồng bộ nhận diện thương hiệu.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Bì thư là công cụ giao tiếp chuyên nghiệp.",
			items: [
				{
					title: "Giao dịch",
					description: "Gửi hợp đồng, hóa đơn cho đối tác.",
					icon: <BusinessIcon fontSize="small" />,
				},
				{
					title: "Thư mời",
					description: "Dùng cho sự kiện, thiệp kỷ niệm.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Nội bộ",
					description: "Gửi thông báo, thư khen thưởng.",
					icon: <EmailIcon fontSize="small" />,
				},
				{
					title: "Quảng bá",
					description: "Tăng tiếp cận khách hàng trực quan.",
					icon: <BoltIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Giấy dày dặn, in sắc nét, keo dán chắc chắn.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Đánh giá đối tác",
		title: "Khách hàng nói gì về <em>chúng tôi?</em>",
		items: [
			{
				name: "Anh Hoàng",
				role: "Giám đốc Công ty Xây dựng",
				text: "Bì thư in rất sắc nét, màu logo chuẩn xác. Giấy Fort 120gsm dày dặn, gửi hồ sơ thầu rất yên tâm.",
				initials: "AH",
				color: "#3e2723",
			},
			{
				name: "Chị Lan Anh",
				role: "Phòng Hành chính · Logistics",
				text: "Dịch vụ in nhanh, dán keo sẵn rất tiện lợi cho việc gửi thư từ hàng ngày của công ty.",
				initials: "LA",
				color: "#e65100",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 300+ doanh nghiệp",
	},
	contact: {
		eyebrow: "Nhận báo giá",
		description: "Liên hệ ngay để được tư vấn chất liệu và nhận báo giá tốt nhất.",
		type: "in-bi-thu",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Mẫu bì thư thực tế",
		title: "Thư viện dự án",
		images: Array.from({ length: 8 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Bì thư A4", "Bì thư A5", "Bì thư A6"],
	},
};

export const SO_TAY_DATA: ProductPageData = {
	id: "so-tay-ky-yeu-so-bam-ghim",
	name: "Sổ Tay, Kỷ Yếu & Sổ Bấm Ghim",
	category: "Ấn phẩm văn phòng",
	seo: {
		title: "In Sổ Tay, Kỷ Yếu & Sổ Bấm Ghim Chuyên Nghiệp | INUT Design",
		description:
			"Dịch vụ in sổ tay, kỷ yếu, sổ bấm ghim tại Đà Nẵng: thiết kế đẹp, gia công chỉn chu, đa dạng chất liệu. Lưu giữ kỷ niệm, nâng tầm thương hiệu.",
		url: "https://inutdesign.com/services/an-pham-van-phong/so-tay-ky-yeu-so-bam-ghim",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Sổ Tay & Kỷ Yếu",
		description:
			"Sản phẩm ghi chép và lưu giữ kỷ niệm chuyên nghiệp: từ sổ tay quà tặng thương hiệu đến kỷ yếu tập thể sang trọng.",
		image: HERO_IMAGE,
		chips: ["In từ 10 cuốn", "Đa dạng kiểu đóng gáy"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem portfolio",
		ticker: ["Sổ Tay Quà Tặng", "Kỷ Yếu Lớp", "Sổ Bấm Ghim", "Thiết Kế Độc Quyền"],
		stats: [
			{ value: "10.000", unit: "+", label: "Cuốn sổ đã in" },
			{ value: "500", unit: "+", label: "Dự án kỷ yếu" },
			{ value: "5.0", unit: "★", label: "Chất lượng hoàn thiện" },
			{ value: "3-5", unit: "ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Ghi chép & Lưu giữ",
		title: "Đồng hành cùng kỷ niệm",
		description:
			"Từ những cuốn sổ tay ghi chép hàng ngày đến những bộ kỷ yếu lưu giữ thanh xuân, chúng tôi chăm chút từng trang in để mỗi sản phẩm đều là một món quà ý nghĩa.",
		bullets: [
			"Sổ tay, kỷ yếu có tính ứng dụng cao trong công việc.",
			"Dễ cá nhân hóa theo nhận diện thương hiệu.",
			"Hỗ trợ nhiều kiểu đóng gáy: lò xo, keo gáy.",
			"Sản xuất từ 10 cuốn, hoàn thiện nhanh chóng.",
		],
		highlights: [
			{
				title: "Sổ tay",
				description:
					"Dùng ghi chép, lên kế hoạch, làm quà tặng thương hiệu hoặc tài liệu nội bộ. Phù hợp đóng lò xo hoặc keo gáy.",
				icon: <MenuBookIcon fontSize="small" />,
			},
			{
				title: "Kỷ yếu",
				description:
					"Lưu giữ hình ảnh, kỷ niệm and dấu mốc đáng nhớ của lớp học, tổ chức hoặc doanh nghiệp. Đóng keo gáy sang trọng.",
				icon: <SchoolIcon fontSize="small" />,
			},
			{
				title: "Sổ bấm ghim",
				description:
					"Booklet mỏng, đóng ghim giữa gáy, phù hợp tài liệu đào tạo, booklet giới thiệu hoặc ấn phẩm sự kiện.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Gia công đa dạng",
				description:
					"Cán màng, ép kim, bo góc hoặc gia công bìa theo yêu cầu để tăng độ bền and tính thẩm mỹ.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Kiểu dáng đóng cuốn",
		title: "Các loại sổ",
		description: "Lựa chọn quy cách đóng cuốn phù hợp với mục đích sử dụng.",
		items: [
			{
				name: "Sổ tay",
				description: "Đóng lò xo hoặc keo gáy.",
				image: "/branding/services/thiet-ke-in-an.avif",
			},
			{
				name: "Kỷ yếu",
				description: "In ảnh sắc nét, bìa cứng sang trọng.",
				image: "/branding/services/sticker.avif",
			},
			{
				name: "Sổ bấm ghim",
				description: "Gọn nhẹ, tiết kiệm chi phí.",
				image: "/branding/services/skin-laptop.avif",
			},
		],
	},
	whyInut: {
		eyebrow: "Chất lượng vượt trội",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Sổ tay in ấn sắc nét, gia công tỉ mỉ từng chi tiết.",
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
					description: "Đặt in từ 10 cuốn.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn thiết kế",
					description: "Hỗ trợ lên layout ruột and bìa.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Sổ tay là món quà tặng ý nghĩa and chuyên nghiệp.",
			items: [
				{
					title: "Doanh nghiệp",
					description: "Quà tặng khách hàng, sổ nội bộ.",
					icon: <BusinessIcon fontSize="small" />,
				},
				{
					title: "Trường học",
					description: "Kỷ yếu lớp, sổ tay ghi chép.",
					icon: <SchoolIcon fontSize="small" />,
				},
				{
					title: "Sự kiện",
					description: "Tài liệu phát tay hội thảo.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Cá nhân",
					description: "Lưu bút, quà tặng ý nghĩa.",
					icon: <GroupsIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "In sắc nét, đóng cuốn chắc chắn, thẩm mỹ cao.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Chia sẻ từ khách hàng",
		title: "Kỷ niệm <em>đáng nhớ</em>",
		items: [
			{
				name: "Bạn Thùy Trang",
				role: "Lớp trưởng 12A1",
				text: "Kỷ yếu in ra cực kỳ đẹp, hình ảnh sắc nét, bìa cứng rất chắc chắn. Cảm ơn team INUT đã giúp lớp lưu giữ những khoảnh khắc đẹp.",
				initials: "TT",
				color: "#d81b60",
			},
			{
				name: "Anh Minh Quân",
				role: "CEO Start-up",
				text: "Đặt sổ tay quà tặng cho nhân viên, mọi người đều rất thích. Thiết kế bìa tối giản and sang trọng đúng tinh thần thương hiệu.",
				initials: "MQ",
				color: "#333333",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 500+ dự án",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để được tư vấn thiết kế and nhận báo giá tốt nhất.",
		type: "so-tay-ky-yeu-so-bam-ghim",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án tiêu biểu",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Sổ tay lò xo", "Kỷ yếu", "Sổ bấm ghim"],
	},
};

export const BANG_CUNG_IN_THONG_TIN_DATA: ProductPageData = {
	id: "bang-cung-in-thong-tin",
	name: "Bảng Cứng In Thông Tin",
	category: "Ấn phẩm văn phòng",
	seo: {
		title: "In Bảng Cứng In Thông Tin Chuyên Nghiệp | INUT Design",
		description:
			"Dịch vụ in bảng cứng in thông tin chuyên nghiệp tại Đà Nẵng: thiết kế đẹp, in sắc nét, chất liệu bền bỉ. Trình bày nội dung rõ ràng, nâng tầm không gian.",
		url: "https://inutdesign.com/services/an-pham-van-phong/bang-cung-in-thong-tin",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Bảng Cứng In Thông Tin",
		description:
			"Giải pháp trình bày thông tin chuyên nghiệp: từ bảng giá, menu quầy kệ đến bảng hướng dẫn không gian.",
		image: HERO_IMAGE,
		chips: ["In sắc nét", "Bồi cứng bền bỉ"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem mẫu",
		ticker: ["Bảng Cứng Formex", "Bảng Menu Quầy Kệ", "Bảng Giá Sản Phẩm", "Hướng Dẫn Văn Phòng"],
		stats: [
			{ value: "3.000", unit: "+", label: "Bảng đã sản xuất" },
			{ value: "150", unit: "+", label: "Cửa hàng & Văn phòng" },
			{ value: "100", unit: "%", label: "Độ bền màu sắc" },
			{ value: "24", unit: "h", label: "Hỗ trợ thiết kế" },
		],
	},
	introduction: {
		eyebrow: "Thông tin trực quan",
		title: "Trình bày thông tin hiệu quả",
		description:
			"Bảng cứng giúp truyền tải nội dung một cách rõ ràng and chuyên nghiệp tại các điểm chạm khách hàng, từ quầy tư vấn đến khu vực hướng dẫn.",
		bullets: [
			"Giúp trình bày nội dung rõ ràng tại quầy tư vấn.",
			"Phù hợp cho cửa hàng, văn phòng, sự kiện.",
			"Hỗ trợ in theo kích thước linh hoạt theo yêu cầu.",
			"Tối ưu thẩm mỹ nhận diện với bố cục rõ ràng.",
		],
		highlights: [
			{
				title: "Bảng cứng in thông tin là gì?",
				description:
					"Là ấn phẩm in được bồi lên vật liệu cứng để tăng độ đứng, độ bền and hiệu quả hiển thị thông tin tại điểm chạm.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Thiết kế đúng mục tiêu",
				description:
					"Tối ưu phân cấp nội dung, font chữ and khoảng cách đọc để người xem nắm thông tin nhanh chỉ trong vài giây.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Quy trình sản xuất rõ ràng",
				description:
					"In - cán - bồi cứng - cắt thành phẩm - kiểm tra chất lượng, giúp sản phẩm đồng đều and ổn định.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Lợi ích vận hành",
				description:
					"Nâng độ chuyên nghiệp không gian bán hàng, hỗ trợ truyền thông ưu đãi and hướng dẫn khách hàng hiệu quả.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Ứng dụng phổ biến",
		title: "Quy cách bảng cứng",
		description: "Đa dạng các loại bảng cứng cho mọi nhu cầu hiển thị.",
		items: [
			{
				name: "Bảng giá",
				description: "Dùng cho quầy bán lẻ.",
				image: "/branding/services/nhan-chai-san-pham.avif",
			},
			{
				name: "Bảng menu",
				description: "Trình bày menu quầy order.",
				image: "/branding/services/thiet-ke-in-an.avif",
			},
			{
				name: "Bảng hướng dẫn",
				description: "Điều hướng trong văn phòng.",
				image: "/branding/services/sticker.avif",
			},
			{
				name: "Bảng thương hiệu",
				description: "Giữ hình ảnh nhất quán.",
				image: "/branding/services/skin-laptop.avif",
			},
		],
	},
	whyInut: {
		eyebrow: "Sự tin cậy",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Bảng cứng bền bỉ, in ấn sắc nét giúp nâng tầm không gian.",
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
					description: "Hỗ trợ in từ 1 bảng.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn thiết kế",
					description: "Kiểm tra file chuẩn in ấn.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Bảng cứng phù hợp cho mọi điểm chạm khách hàng.",
			items: [
				{
					title: "Cửa hàng",
					description: "Trình bày bảng giá, ưu đãi.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Văn phòng",
					description: "Bảng tên phòng, hướng dẫn.",
					icon: <BusinessIcon fontSize="small" />,
				},
				{
					title: "Sự kiện",
					description: "Sơ đồ khu vực, gian hàng.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Nhà hàng",
					description: "Menu để bàn, QR thanh toán.",
					icon: <LocalPrintshopIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Vật liệu cứng cáp, in sắc nét, cắt gọn gàng.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Phản hồi tích cực",
		title: "Khách hàng <em>nói gì?</em>",
		items: [
			{
				name: "Anh Việt",
				role: "Quản lý chuỗi Cafe",
				text: "Bảng menu quầy order làm bằng formex bồi decal rất bền, in màu sắc thực phẩm nhìn rất bắt mắt and kích thích vị giác.",
				initials: "AV",
				color: "#bf360c",
			},
			{
				name: "Chị Hạnh",
				role: "Admin văn phòng",
				text: "Các bảng hướng dẫn trong văn phòng được in rất rõ nét, giúp không gian làm việc chuyên nghiệp and gọn gàng hơn hẳn.",
				initials: "CH",
				color: "#004d40",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 150+ đơn vị",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để nhận báo giá in bảng cứng thông tin nhanh nhất.",
		type: "bang-cung-in-thong-tin",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Sản phẩm thực tế",
		title: "Hình ảnh thi công",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Bảng giá", "Menu", "Hướng dẫn"],
	},
};
