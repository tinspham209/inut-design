import { ProductPageData } from "@/models/product-page";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import BoltIcon from "@mui/icons-material/Bolt";
import BusinessIcon from "@mui/icons-material/Business";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CampaignIcon from "@mui/icons-material/Campaign";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PaletteIcon from "@mui/icons-material/Palette";
import SpaIcon from "@mui/icons-material/Spa";
import SpeedIcon from "@mui/icons-material/Speed";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TimerIcon from "@mui/icons-material/Timer";
import VerifiedIcon from "@mui/icons-material/Verified";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const HERO_IMAGE = "/cover-web.webp";

export const IN_CARD_VISIT_DATA: ProductPageData = {
	id: "in-card-visit",
	name: "In Card Visit",
	category: "Ấn phẩm tiếp thị",
	seo: {
		title: "In Card Visit Tại Đà Nẵng Chuyên Nghiệp Theo Yêu Cầu | INUT Design",
		description:
			"Dịch vụ in card visit (danh thiếp) tại Đà Nẵng: thiết kế chuyên nghiệp, in sắc nét, tùy chọn đa dạng chất liệu giấy/nhựa. Gia công mờ, bóng, ép kim sang trọng.",
		url: "https://inutdesign.com/services/an-pham-tiep-thi/in-card-visit",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm tiếp thị", item: "/services/an-pham-tiep-thi" },
			{ name: "In Card Visit", item: "/services/an-pham-tiep-thi/in-card-visit" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Card Visit",
			serviceType: "In ấn tiếp thị",
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
				price: "100000",
				priceCurrency: "VND",
			},
		},
	},
	hero: {
		title: "In card visit chuyên nghiệp",
		description:
			"Thiết kế chỉn chu, in sắc nét và chất liệu cao cấp giúp nâng tầm hình ảnh thương hiệu cá nhân và doanh nghiệp tại Đà Nẵng.",
		image: HERO_IMAGE,
		chips: ["In offset", "Đa dạng chất liệu"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"In Card Visit Lấy Ngay",
			"Đa Dạng Chất Liệu",
			"Thiết Kế Chuyên Nghiệp",
			"Giao Hàng Toàn Quốc",
		],
		stats: [
			{ value: "10.000", unit: "+", label: "Hộp card đã in" },
			{ value: "500", unit: "+", label: "Khách hàng tin dùng" },
			{ value: "5.0", unit: "★", label: "Đánh giá hài lòng" },
			{ value: "2-3", unit: "ngày", label: "Thời gian sản xuất" },
		],
	},
	introduction: {
		eyebrow: "Nhận diện thương hiệu",
		title: "Danh thiếp chuyên nghiệp",
		description:
			"Card visit không chỉ là mảnh giấy ghi thông tin, mà là lời chào đầu tiên thể hiện vị thế and phong cách chuyên nghiệp của bạn.",
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
		eyebrow: "Chất liệu & Quy cách",
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
		eyebrow: "Lợi ích dịch vụ",
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
	testimonials: {
		eyebrow: "Khách hàng tin tưởng",
		title: "Đánh giá từ <em>đối tác</em>",
		items: [
			{
				name: "Trần Thế Vinh",
				role: "CEO Tech Solutions",
				text: "In card tại INUT rất ưng ý. Thiết kế hiện đại, chất liệu giấy mỹ thuật sờ rất thích tay. Sẽ ủng hộ lâu dài.",
				initials: "TV",
				color: "#1a237e",
			},
			{
				name: "Lê Thu Thảo",
				role: "Chủ Spa cao cấp",
				text: "Màu sắc in rất chuẩn, đường cắt sắc nét. Team tư vấn rất nhiệt tình về các loại gia công ép kim.",
				initials: "TT",
				color: "#880e4f",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 500+ khách hàng",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để được tư vấn mẫu Card Visit phù hợp nhất.",
		type: "in-card-visit",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Mẫu Card Visit đẹp",
		title: "Dự án tiêu biểu",
		images: [
			"/branding/services/thiet-ke-in-an.avif",
			"/branding/services/sticker.avif",
			"/branding/services/skin-laptop.avif",
			"/branding/services/skin-nut-phim.avif",
			"/branding/services/nhan-chai-san-pham.avif",
			"/branding/hero-bg.webp",
		],
		filters: [],
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
		url: "https://inutdesign.com/services/an-pham-tiep-thi/catalogue-brochure",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm tiếp thị", item: "/services/an-pham-tiep-thi" },
			{ name: "In Catalogue, Brochure", item: "/services/an-pham-tiep-thi/catalogue-brochure" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Catalogue, Brochure",
			serviceType: "In ấn tiếp thị",
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
				price: "500000",
				priceCurrency: "VND",
			},
		},
	},
	hero: {
		title: "In Catalogue & Brochure",
		description:
			"Nâng tầm hình ảnh thương hiệu với các ấn phẩm Catalogue và Brochure chuyên nghiệp, in ấn sắc nét, thiết kế sáng tạo giúp truyền tải trọn vẹn giá trị sản phẩm và dịch vụ.",
		image: HERO_IMAGE,
		chips: ["Thiết kế chuẩn", "In sắc nét"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"Thiết Kế Catalogue",
			"In Brochure Sắc Nét",
			"Gia Công Chỉn Chu",
			"Nâng Tầm Thương Hiệu",
		],
		stats: [
			{ value: "500", unit: "+", label: "Dự án hoàn thành" },
			{ value: "100", unit: "+", label: "Doanh nghiệp tin dùng" },
			{ value: "5.0", unit: "★", label: "Chất lượng thiết kế" },
			{ value: "3-5", unit: "ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Tài liệu quảng bá",
		title: "Ấn phẩm quảng bá chuyên nghiệp",
		description:
			"Catalogue and Brochure là 'bộ mặt' của sản phẩm, giúp khách hàng nắm bắt trọn vẹn giá trị thương hiệu thông qua hình ảnh and nội dung được sắp xếp tinh tế.",
		bullets: [
			"Giới thiệu sản phẩm, dịch vụ hệ thống và trực quan.",
			"Tăng tính chuyên nghiệp và độ tin cậy for thương hiệu.",
			"Hỗ trợ đội ngũ bán hàng and tư vấn khách hàng.",
			"Tạo tài liệu phát tay tiện lợi tại showroom, hội chợ.",
		],
		highlights: [
			{
				title: "Catalogue",
				description:
					"Ấn phẩm nhiều trang giới thiệu danh mục sản phẩm, dịch vụ chi tiết, có hệ thống. Giúp khách hàng dễ tìm hiểu and so sánh.",
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
					"Từ giấy Couche mịn màng, Bristol cứng cáp đến giấy mỹ thuật cao cấp dành for những thiết kế sang trọng.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại ấn phẩm",
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
		eyebrow: "Giá trị cốt lõi",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Giải pháp truyền thông chuyên nghiệp for mọi doanh nghiệp.",
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
			title: "Ứng dụng for mọi lĩnh vực",
			description: "Catalogue and Brochure là công cụ bán hàng không thể thiếu.",
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
	testimonials: {
		eyebrow: "Phản hồi tích cực",
		title: "Khách hàng nói gì về <em>chúng tôi?</em>",
		items: [
			{
				name: "Hoàng Nam",
				role: "Marketing Manager · BĐS",
				text: "Catalogue in rất sang, hình ảnh nhà mẫu lên màu cực chuẩn. Rất hài lòng với dịch vụ thiết kế and in ấn tại đây.",
				initials: "HN",
				color: "#bf360c",
			},
			{
				name: "Bích Phương",
				role: "Chủ thương hiệu mỹ phẩm",
				text: "Brochure gấp 3 thiết kế rất bắt mắt, nhỏ gọn and tinh tế. Giúp ích rất nhiều cho việc giới thiệu sản phẩm mới.",
				initials: "BP",
				color: "#1b5e20",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 100+ doanh nghiệp",
	},
	contact: {
		eyebrow: "Nhận báo giá",
		description: "Liên hệ ngay để được tư vấn mẫu Catalogue, Brochure phù hợp nhất.",
		type: "catalogue-brochure",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Sản phẩm thực tế",
		title: "Thư viện dự án",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: [],
	},
};

export const IN_VOUCHER_VE_MOI_SU_KIEN_THE_TICH_DIEM_DATA: ProductPageData = {
	id: "in-voucher-ve-moi-su-kien-the-tich-diem",
	name: "In Voucher, Vé Mời, Thẻ Tích Điểm, Tờ Rơi",
	category: "Ấn phẩm sự kiện",
	seo: {
		title:
			"In Voucher, Vé Mời Sự Kiện, Thẻ Tích Điểm tại Đà Nẵng – Thiết Kế Đẹp, In Sắc Nét | INUT Design",
		description:
			"Dịch vụ in voucher, vé mời sự kiện, thẻ tích điểm, tờ rơi tại Đà Nẵng. Thiết kế đẹp, in sắc nét, gia công chỉn chu, giá hợp lý. Phù hợp cửa hàng, café, spa, salon, doanh nghiệp.",
		url: "https://inutdesign.com/services/an-pham-su-kien/in-voucher-ve-moi-su-kien-the-tich-diem-to-roi",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm sự kiện", item: "/services/an-pham-su-kien" },
			{
				name: "In Voucher, Vé Mời, Thẻ Tích Điểm, Tờ Rơi",
				item: "/services/an-pham-su-kien/in-voucher-ve-moi-su-kien-the-tich-diem",
			},
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Voucher, Vé Mời Sự Kiện, Thẻ Tích Điểm, Tờ Rơi",
			serviceType: "In ấn ấn phẩm thương hiệu",
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
		title: "In Voucher, Vé Mời, Thẻ Tích Điểm & Tờ Rơi",
		description:
			"Nhỏ gọn nhưng không nhỏ vai trò. Voucher, vé mời, thẻ tích điểm và tờ rơi được thiết kế đẹp, in sắc nét và gia công chỉn chu — giúp thương hiệu của bạn ghi điểm ngay từ điểm chạm đầu tiên.",
		image: HERO_IMAGE,
		chips: ["Thiết kế theo yêu cầu", "In lấy nhanh", "Gia công chỉn chu"],
		secondaryCtaLabel: "Xem portfolio",
		ticker: ["In Voucher Sắc Nét", "Vé Mời Chuyên Nghiệp", "Thẻ Tích Điểm Đẹp", "Tờ Rơi Ấn Tượng"],
		stats: [
			{ value: "10.000", unit: "+", label: "Ấn phẩm đã xuất xưởng" },
			{ value: "300", unit: "+", label: "Thương hiệu tin dùng" },
			{ value: "5.0", unit: "★", label: "Đánh giá từ khách hàng" },
			{ value: "3–4", unit: " ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Ấn phẩm thương hiệu nhỏ gọn",
		title: "Voucher, vé mời, thẻ tích điểm & tờ rơi theo yêu cầu",
		description:
			"Những ấn phẩm nhỏ nhưng ảnh hưởng trực tiếp đến trải nghiệm khách hàng và hình ảnh thương hiệu — khi đầu tư đúng cách, chúng mang lại hiệu quả rõ rệt.",
		bullets: [
			"Voucher, vé mời và thẻ tích điểm là điểm chạm trực tiếp với khách hàng — thiết kế đẹp, in rõ giúp thương hiệu trông chuyên nghiệp hơn ngay lập tức.",
			"Hỗ trợ tích hợp QR code, mã seri, số nhảy hoặc dữ liệu cá nhân hóa theo từng chương trình.",
			"Kích thước linh hoạt: từ cỡ name card đến A6, hoặc tùy chỉnh theo concept thương hiệu và mục đích sử dụng.",
			"Đa dạng chất liệu: Couche, Bristol, Ivory, giấy mỹ thuật — tư vấn theo ngân sách và phong cách.",
			"Gia công sau in: cán mờ, cán bóng, bo góc, bế form, ép kim, dập nổi — tùy chọn theo nhu cầu thực tế.",
		],
		highlights: [
			{
				title: "Voucher là gì?",
				description:
					"Phiếu ưu đãi hoặc quà tặng dùng cho giảm giá, khuyến mãi, tri ân khách hàng — tăng chuyển đổi và thúc đẩy mua hàng.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Vé mời sự kiện",
				description:
					"Mời khách tham dự workshop, khai trương, hội thảo, event — thể hiện phong cách tổ chức và mức độ đầu tư của thương hiệu.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Thẻ tích điểm",
				description:
					"Ghi nhận lần mua hàng hoặc sử dụng dịch vụ — giải pháp đơn giản nhưng hiệu quả để giữ chân khách hàng thân thiết.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Tờ rơi",
				description:
					"Truyền tải thông tin sản phẩm, dịch vụ hoặc chương trình khuyến mãi — nhanh, trực tiếp và dễ phân phối.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại ấn phẩm",
		title: "Các dòng ấn phẩm INUT thực hiện",
		description: "Mỗi loại ấn phẩm phục vụ một mục tiêu riêng — tư vấn đúng để chọn đúng.",
		items: [
			{
				name: "Voucher & Phiếu ưu đãi",
				description: "Giảm giá, quà tặng, khuyến mãi theo mùa, tri ân khách hàng.",
				image: HERO_IMAGE,
			},
			{
				name: "Vé mời sự kiện",
				description: "Workshop, khai trương, hội thảo, event, vé VIP có QR code.",
				image: HERO_IMAGE,
			},
			{
				name: "Thẻ tích điểm",
				description: "Café, trà sữa, spa, salon, nail, cửa hàng thời trang.",
				image: HERO_IMAGE,
			},
			{
				name: "Tờ rơi",
				description: "Giới thiệu sản phẩm, dịch vụ, chương trình khuyến mãi.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Tại sao chọn chúng tôi",
		title: "Vì sao chọn dịch vụ in tại INUT Design?",
		description:
			"Mỗi ấn phẩm không chỉ in đúng nội dung — mà còn cần đẹp, gọn, đồng bộ và phù hợp với mục đích sử dụng thực tế.",
		productionProcess: {
			title: "Quy trình sản xuất chuyên nghiệp",
			items: [
				{
					title: "Tư vấn & Thiết kế",
					description: "Chọn chất liệu, kích thước, gia công phù hợp — kiểm tra file trước khi in.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "In ấn chuẩn kỹ thuật",
					description:
						"300 DPI, CMYK, bleed 3mm — màu sắc ổn định, sắc nét đồng đều giữa các thành phẩm.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Gia công & Bàn giao",
					description:
						"Cán mờ / bóng, bo góc, bế form, ép kim — kiểm tra trước giao để đảm bảo đúng quy cách.",
					icon: <DoneAllIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng cho mọi mô hình",
			description:
				"Phù hợp với cửa hàng, café, spa, salon, doanh nghiệp và nhiều mô hình kinh doanh cần ấn phẩm nhỏ nhưng hiệu quả lớn.",
			items: [
				{
					title: "Bán hàng & Khuyến mãi",
					description: "Voucher giảm giá, phiếu quà tặng, ưu đãi khai trương.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Tổ chức sự kiện",
					description: "Vé mời workshop, hội thảo, event doanh nghiệp, vé VIP.",
					icon: <CardGiftcardIcon fontSize="small" />,
				},
				{
					title: "Chăm sóc khách hàng",
					description: "Thẻ tích điểm tăng loyalty, giữ chân khách hàng quay lại.",
					icon: <GroupsIcon fontSize="small" />,
				},
				{
					title: "Truyền thông thương hiệu",
					description: "Tờ rơi phân phối tại sự kiện, quầy kệ, khu vực đông người.",
					icon: <StorefrontIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết in đẹp, đúng hẹn và giá cạnh tranh",
			description:
				"Từ tư vấn chất liệu đến gia công hoàn thiện — INUT đảm bảo thành phẩm sạch đẹp, đồng đều và sẵn sàng sử dụng ngay khi bàn giao.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Đánh giá khách hàng",
		title: "Khách hàng nói gì về <em>INUT?</em>",
		items: [
			{
				name: "Chủ tiệm Café Rang Đà Nẵng",
				role: "F&B · Đà Nẵng",
				text: "In thẻ tích điểm cho quán, INUT tư vấn chất liệu phù hợp và thiết kế đồng bộ với branding. Khách cầm lên ai cũng khen đẹp.",
				initials: "CR",
				color: "#ff4d00",
			},
			{
				name: "Trung tâm Đào Tạo Kỹ Năng Sống",
				role: "Giáo dục · Đà Nẵng",
				text: "Vé mời workshop in rất đẹp, màu sắc sắc nét, giấy dày dặn. Khách mời nhận được đều hỏi in ở đâu. Sẽ tiếp tục hợp tác.",
				initials: "TT",
				color: "#1a5c3a",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 300+ đánh giá",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description:
			"Liên hệ ngay để được tư vấn mẫu phù hợp, chọn chất liệu tối ưu và nhận báo giá nhanh cho thương hiệu hoặc chương trình của bạn.",
		type: "in-voucher-ve-moi-su-kien-the-tich-diem",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án đã thực hiện",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 8 }).map((_, index) => HERO_IMAGE),
		filters: [],
	},
};
