import { ProductPageData } from "@/models/product-page";
import BoltIcon from "@mui/icons-material/Bolt";
import CampaignIcon from "@mui/icons-material/Campaign";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import StorefrontIcon from "@mui/icons-material/Storefront";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const HERO_IMAGE = "/cover-web.webp";

export const SKIN_LAPTOP_DATA: ProductPageData = {
	id: "skin-laptop-customize",
	name: "Skin Laptop",
	category: "Cá nhân hóa",
	seo: {
		title: "Skin Laptop Custom theo yêu cầu - INUT Design",
		description:
			"Dịch vụ in Skin Laptop theo yêu cầu. Decal 3M cao cấp, in UV sắc nét, cắt CNC chuẩn xác 99% cho mọi dòng máy như Macbook, Dell, HP, Asus...",
		url: "https://inutdesign.com/services/ca-nhan-hoa/skin-laptop-customize",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Cá nhân hóa", item: "/services/ca-nhan-hoa" },
			{ name: "Skin Laptop", item: "/services/ca-nhan-hoa/skin-laptop-customize" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Skin Laptop Custom",
			serviceType: "Cá nhân hóa laptop",
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
		title: "Skin Laptop Custom",
		description:
			"Dịch vụ in Skin Laptop theo yêu cầu. Decal 3M cao cấp, in UV sắc nét, cắt CNC chuẩn xác 99% cho mọi dòng máy.",
		image: HERO_IMAGE,
		chips: ["Decal 3M cao cấp", "In UV sắc nét", "Cắt CNC chuẩn xác"],
		ticker: [
			"Decal 3M Cao Cấp",
			"In UV Sắc Nét",
			"Cắt CNC Chính Xác",
			"Tản Nhiệt Tốt",
			"Không Để Lại Keo",
		],
		stats: [
			{ value: "99", unit: "%", label: "Độ chính xác CNC" },
			{ value: "3M", unit: "", label: "Chất liệu cao cấp" },
			{ value: "5.0", unit: "★", label: "Đánh giá hài lòng" },
			{ value: "24", unit: "h", label: "Giao hàng nhanh" },
		],
	},
	introduction: {
		eyebrow: "Bảo vệ & Phong cách",
		title: "Nâng tầm diện mạo cho Laptop của bạn",
		description:
			"Skin laptop không chỉ giúp bảo vệ máy khỏi trầy xước mà còn là cách để bạn thể hiện cá tính riêng biệt qua từng thiết kế độc bản.",
		bullets: [
			"Custom mọi dòng máy: Macbook, Dell, HP, Asus, Lenovo, Acer, MSI...",
			"Vật liệu Decal chuyên dụng có cấu trúc tản nhiệt, không lo nóng máy",
			"Công nghệ in đạt chuẩn sắc độ tươi tắn và độ phân giải cao",
			"Thiết kế sẵn rãnh thoát khí dưới lớp keo giúp tự dán cực kỳ dễ dàng",
			"File cắt CNC chính xác 99% theo kích thước cụ thể từng mẫu máy",
			"Tư vấn chỉnh sửa hình ảnh miễn phí đến khi khách hàng ưng ý",
		],
		highlights: [
			{
				title: "Chất lượng màng dán",
				description: "Decal 3M cao cấp, không để lại keo dư, dễ dán và cực dễ bóc.",
				icon: <WorkspacePremiumIcon color="primary" />,
			},
			{
				title: "In ấn sắc nét",
				description: "Công nghệ in UV tiên tiến, màu đẹp mịn và không phai theo thời gian.",
				icon: <LocalPrintshopIcon color="primary" />,
			},
			{
				title: "Thiết kế độc bản",
				description: "Tự tạo thiết kế theo ý thích cá nhân, bộc lộ cá tính riêng biệt.",
				icon: <DesignServicesIcon color="primary" />,
			},
			{
				title: "Bảo vệ toàn diện",
				description: "Chống trầy xước, bụi bẩn, bảo vệ ngoại hình máy tuyệt đối.",
				icon: <BoltIcon color="primary" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại",
		title: "Các loại Skin Laptop phổ biến",
		description: "Đa dạng chất liệu và bề mặt hoàn thiện để bạn lựa chọn theo sở thích.",
		items: [
			{
				name: "Skin Laptop Nhám (Matte)",
				description:
					"Bề mặt Matte chống bám mồ hôi, vân tay, mang lại cảm giác cầm êm tay, sang trọng",
				image: HERO_IMAGE,
			},
			{
				name: "Skin Laptop Bóng (Glossy)",
				description:
					"Màng bóng rực rỡ, giúp làm nổi bật sâu sắc các mảng màu sắc trên thiết kế gốc",
				image: HERO_IMAGE,
			},
			{
				name: "Skin Laptop Texture",
				description: "Sử dụng vật liệu có hiệu ứng bề mặt như giả carbon, kim loại, hoặc vân nổi",
				image: HERO_IMAGE,
			},
			{
				name: "Skin Cắt Tỉa Theo Yêu Cầu",
				description:
					"Cắt sát layout logo hoặc viền chi tiết lạ mắt, tạo hình dán đa dạng ngoài kích thước chung",
				image: HERO_IMAGE,
			},
		],
		specOptions: [
			"Decal 3M nhập khẩu - Lột ra không bám keo, tuổi thọ sử dụng lên tới nhiều năm",
			"Màng bảo vệ chuyên dụng - Chống tia UV giữ màu luôn mới, bảo vệ mặt in khỏi xước dăm",
			"Cắt CNC gia công sẵn - Chuẩn xác mọi góc bo, logo; khi nhận chỉ việc lột và dán",
		],
	},
	whyInut: {
		eyebrow: "Tại sao chọn INUT",
		title: "Lợi ích khi dán Skin Laptop",
		description:
			"Chúng tôi cam kết mang lại sản phẩm chất lượng cao nhất với dịch vụ tư vấn tận tâm.",
		applications: {
			title: "Ứng dụng thực tế",
			description: "Skin laptop phù hợp cho nhiều mục đích sử dụng khác nhau.",
			items: [
				{
					title: "Thể hiện cá tính",
					description: "Giúp chiếc laptop trở nên ấn tượng, không đụng hàng.",
					icon: <DesignServicesIcon color="primary" />,
				},
				{
					title: "Quà tặng doanh nghiệp",
					description: "Phát triển thương hiệu công ty đồng bộ cho máy tính nhân sự.",
					icon: <StorefrontIcon color="primary" />,
				},
				{
					title: "Sự kiện quảng bá",
					description: "Tạo dấu ấn tại các sự kiện công nghệ hoặc ra mắt dự án.",
					icon: <EventAvailableIcon color="primary" />,
				},
				{
					title: "Bảo vệ tài sản",
					description: "Giữ vỏ máy luôn như mới mẻ khi có ý định nhượng lại.",
					icon: <WorkspacePremiumIcon color="primary" />,
				},
			],
		},
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để nhận báo giá nhanh và tư vấn mẫu thiết kế phù hợp nhất.",
		type: "laptop-customize",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Bộ sưu tập",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: [],
	},
};

export const SKIN_NUT_PHIM_DATA: ProductPageData = {
	id: "macnut-customize",
	name: "Skin Nút Phím",
	category: "Cá nhân hóa",
	seo: {
		title: "Custom Skin Nút Phím theo yêu cầu - INUT Design",
		description:
			"Dịch vụ in Skin nút phím cho laptop chuẩn xác mọi dòng máy. Cắt CNC rời từng phím, mỏng mịn, chống phai màu và bảo vệ phím bấm vượt trội.",
		url: "https://inutdesign.com/services/ca-nhan-hoa/skin-nut-phim-customize",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Cá nhân hóa", item: "/services/ca-nhan-hoa" },
			{ name: "Skin Nút Phím", item: "/services/ca-nhan-hoa/skin-nut-phim-customize" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Skin Nút Phím Custom",
			serviceType: "Cá nhân hóa bàn phím",
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
				price: "60000",
				priceCurrency: "VND",
			},
		},
	},
	hero: {
		title: "Skin Nút Phím Custom",
		description:
			"Dịch vụ in Skin nút phím cho laptop chuẩn xác mọi dòng máy. Cắt CNC rời từng phím, mỏng mịn, chống phai màu.",
		image: HERO_IMAGE,
		chips: ["Cắt CNC chuẩn 99%", "Mỏng mịn", "Chống phai màu"],
		ticker: [
			"Skin Nút Phím",
			"Cắt CNC Chính Xác",
			"Chống Mờ Chữ",
			"Dễ Dàng Tẩy Keo",
			"In Xuyên Led",
		],
		stats: [
			{ value: "99", unit: "%", label: "Độ chính xác cắt" },
			{ value: "3M", unit: "", label: "Chất liệu cao cấp" },
			{ value: "100", unit: "%", label: "Không bám keo" },
			{ value: "24", unit: "h", label: "Hoàn thiện nhanh" },
		],
	},
	introduction: {
		eyebrow: "Cảm hứng làm việc",
		title: "Tái tạo bàn phím, nâng tầm cảm xúc",
		description:
			"Skin nút phím giúp bảo vệ bàn phím khỏi mồ hôi, tróc sơn và mang lại vẻ đẹp mới mẻ, đầy cảm hứng cho mỗi lần gõ phím.",
		bullets: [
			"Khuôn cắt file sẵn chuẩn 99% cho mọi thiết bị: Macbook, Dell, Asus, Lenovo, HP...",
			"Bóc dán an toàn, dễ dàng tẩy keo khi bạn không dùng nữa bằng nước rửa phụ kiện",
			"Vẽ lại layout chính xác với cấu hình bàn phím quốc tế (US, UK, JP...)",
			"Lên mockup 2D miễn phí để hình dung rõ tổng thể bàn phím trước khi chốt in",
			"Hệ màu sRGB đạt chuẩn, không sai lệch so với bản vẽ",
		],
		highlights: [
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
		],
	},
	types: {
		eyebrow: "Tùy chọn",
		title: "Các dòng Skin Nút Phím",
		description: "Lựa chọn phong cách phù hợp với nhu cầu sử dụng của bạn.",
		items: [
			{
				name: "Decal Phím Cán Mờ (Matte)",
				description:
					"Phủ thêm lớp nhám mịn cho phím, chống bám dấu vân tay và mồ hôi cực kỳ hiệu quả",
				image: HERO_IMAGE,
			},
			{
				name: "Decal Phím Xuyên Led",
				description:
					"Cắt hở phần ký tự, thích hợp sử dụng trong bóng tối, tôn lên vẻ đẹp nguyên bản",
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
		],
		specOptions: [
			"Chất liệu in 3M Controltac không co rút dưới nhiệt độ máy tỏa ra",
			"Lớp cán bảo vệ vân cát (Matte) tăng cảm giác chạm xúc giác",
			"Cắt demi sẵn hoàn thiện, không cần dùng dao rọc giấy thủ công",
		],
	},
	whyInut: {
		eyebrow: "Lợi ích",
		title: "Tại sao nên dùng Skin Nút Phím",
		description: "Sản phẩm được nghiên cứu kỹ lưỡng để đảm bảo trải nghiệm người dùng tốt nhất.",
		applications: {
			title: "Ứng dụng",
			description: "Nhiều lợi ích thiết thực cho người dùng laptop thường xuyên.",
			items: [
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
			],
		},
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để nhận báo giá nhanh và tư vấn mẫu thiết kế phù hợp nhất.",
		type: "macnut-customize",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: [],
	},
};

export const SKIN_DIEN_THOAI_DATA: ProductPageData = {
	id: "skin-dien-thoai-customize",
	name: "Skin Điện Thoại",
	category: "Cá nhân hóa",
	seo: {
		title: "In Skin Điện Thoại Customize tại Đà Nẵng - INUT Design",
		description:
			"Dịch vụ in skin điện thoại customize theo yêu cầu tại Đà Nẵng. Cá nhân hóa thiết bị, bảo vệ bề mặt và tạo dấu ấn riêng với chất lượng in sắc nét, cắt chuẩn form máy.",
		url: "https://inutdesign.com/services/ca-nhan-hoa/skin-dien-thoai-customize",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Cá nhân hóa", item: "/services/ca-nhan-hoa" },
			{ name: "Skin Điện Thoại", item: "/services/ca-nhan-hoa/skin-dien-thoai-customize" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Skin Điện Thoại Customize",
			serviceType: "Cá nhân hóa điện thoại",
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
		title: "Skin Điện Thoại Customize",
		description:
			"Cá nhân hóa điện thoại của bạn với lớp skin ôm sát, in hình theo yêu cầu và bảo vệ bề mặt máy tối ưu.",
		image: HERO_IMAGE,
		chips: ["In hình theo yêu cầu", "Cắt chuẩn form máy", "Bảo vệ bề mặt"],
		ticker: [
			"Skin Điện Thoại Custom",
			"Cắt CNC Chính Xác",
			"In Hình Cá Nhân",
			"Màu Sắc Rực Rỡ",
			"Dễ Dàng Thay Thế",
		],
		stats: [
			{ value: "10", unit: "+", label: "Số lượng tối thiểu" },
			{ value: "300", unit: "DPI", label: "Độ phân giải in" },
			{ value: "100", unit: "%", label: "Chuẩn model máy" },
			{ value: "3-4", unit: "ngày", label: "Sản xuất nhanh" },
		],
	},
	introduction: {
		eyebrow: "Cá nhân hóa thiết bị",
		title: "Khẳng định phong cách riêng trên từng đường nét",
		description:
			"Skin điện thoại không chỉ là lớp bảo vệ mà còn là tấm gương phản chiếu cá tính của bạn. Tại INUT, chúng tôi giúp bạn hiện thực hóa mọi ý tưởng thiết kế lên thiết bị cầm tay hằng ngày.",
		bullets: [
			"Tùy chỉnh hoàn toàn thiết kế: Ảnh cá nhân, logo, artwork, fanart...",
			"Cắt chuẩn xác theo từng model máy: iPhone, Samsung, Oppo, Xiaomi...",
			"Chất liệu decal nhựa/vinyl dẻo dai, bám dính tốt và không để lại keo",
			"Hỗ trợ hạn chế trầy xước mà vẫn giữ được độ mỏng nhẹ nguyên bản của máy",
			"Dễ dàng thay đổi mẫu mã theo sở thích hoặc xu hướng",
		],
		highlights: [
			{
				title: "Đúng model máy",
				description: "Cắt chuẩn xác theo từng dòng máy, chừa đúng vị trí camera, cảm biến.",
				icon: <WorkspacePremiumIcon color="primary" />,
			},
			{
				title: "In ấn sắc nét",
				description: "Độ phân giải 300 DPI, hệ màu CMYK cho bản in trung thực nhất.",
				icon: <LocalPrintshopIcon color="primary" />,
			},
			{
				title: "Cá nhân hóa cao",
				description: "Tự do sáng tạo với ảnh cá nhân, tên riêng hoặc thiết kế độc bản.",
				icon: <DesignServicesIcon color="primary" />,
			},
			{
				title: "Gọn nhẹ & Tinh tế",
				description: "Bảo vệ máy khỏi xước dăm mà không làm cộm máy như dùng ốp lưng.",
				icon: <BoltIcon color="primary" />,
			},
		],
	},
	types: {
		eyebrow: "Tùy chọn bề mặt",
		title: "Chất liệu & Hoàn thiện",
		description: "Lựa chọn loại bề mặt phù hợp với phong cách và cảm giác cầm nắm của bạn.",
		items: [
			{
				name: "Skin Cán Mờ (Matte)",
				description: "Nhìn hiện đại, tinh tế, ít phản sáng và hạn chế bám vân tay",
				image: HERO_IMAGE,
			},
			{
				name: "Skin Cán Bóng (Glossy)",
				description: "Màu sắc nổi bật, rực rỡ, bề mặt sáng bóng bắt mắt",
				image: HERO_IMAGE,
			},
			{
				name: "Skin Texture Đặc Biệt",
				description: "Các hiệu ứng bề mặt như giả carbon, giả da hoặc nhám sần",
				image: HERO_IMAGE,
			},
			{
				name: "Skin Design Độc Bản",
				description: "Thiết kế riêng biệt theo yêu cầu cá nhân hoặc thương hiệu",
				image: HERO_IMAGE,
			},
		],
		specOptions: [
			"Decal nhựa/vinyl chuyên dụng - Dẻo dai, ôm sát các đường cong của máy",
			"Lớp cán bảo vệ bề mặt - Chống trầy xước và giữ màu in bền lâu",
			"Cắt chuẩn kỹ thuật - Chừa đúng các cổng kết nối và phím bấm",
		],
	},
	whyInut: {
		eyebrow: "Tại sao chọn INUT",
		title: "Giải pháp Skin chuyên nghiệp",
		description: "Chúng tôi chú trọng vào độ chính xác và chất lượng hoàn thiện cao nhất.",
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Sản phẩm phù hợp cho nhiều nhu cầu khác nhau.",
			items: [
				{
					title: "Cá nhân hóa",
					description: "In ảnh cá nhân, tên riêng, thể hiện phong cách.",
					icon: <DesignServicesIcon color="primary" />,
				},
				{
					title: "Fan Merch",
					description: "Sản phẩm cho fandom, in hình idol, nhân vật.",
					icon: <FavoriteIcon color="primary" />,
				},
				{
					title: "Branding",
					description: "Quà tặng doanh nghiệp, quảng bá logo thương hiệu.",
					icon: <StorefrontIcon color="primary" />,
				},
				{
					title: "Đồng bộ nhóm",
					description: "Skin cho team, cặp đôi hoặc cộng đồng.",
					icon: <EventAvailableIcon color="primary" />,
				},
			],
		},
	},
	contact: {
		eyebrow: "Đặt in ngay",
		description: "Liên hệ để được tư vấn model máy và báo giá theo số lượng.",
		type: "skin-phone-customize",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án đã làm",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: [],
	},
};

export const LIGHTERS_CUSTOMIZE_DATA: ProductPageData = {
	id: "lighters-customize",
	name: "Bật lửa custom",
	category: "Cá nhân hoá",
	seo: {
		title: "In Bật Lửa Cricket Custom Theo Yêu Cầu Tại Đà Nẵng | INUT Design",
		description:
			"In bật lửa Cricket custom tại Đà Nẵng — màu sắc nét, lớp phủ matte/chrome/glitter, giao trong 24h. Nhận đơn lẻ lẫn sỉ. Báo giá trong 15 phút.",
		url: "https://inutdesign.com/services/ca-nhan-hoa/skin-bat-lua-customize/",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Cá nhân hóa", item: "/services/ca-nhan-hoa" },
			{ name: "Bật lửa custom", item: "/services/ca-nhan-hoa/skin-bat-lua-customize" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Bật lửa custom",
			serviceType: "Cá nhân hóa bật lửa",
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
				price: "15000",
				priceCurrency: "VND",
			},
		},
	},
	hero: {
		title: "Bật lửa custom",
		description:
			"Vật dụng cầm tay mỗi ngày — in thành thứ người ta không nỡ bỏ đi. Bật lửa Cricket in theo yêu cầu: màu chuẩn file, lớp phủ đa dạng, giao trong 24h.",
		image: `/services/ca-nhan-hoa/skin-bat-lua-customize/1.avif`,
		chips: ["Phôi Cricket chính hãng", "In sắc nét", "Giao trong 24h"],
		ticker: ["Bật Lửa Cricket", "In Màu Sắc Nét", "Thiết Kế Độc Bản", "Giao Hàng Toàn Quốc"],
		stats: [
			{ value: "10.000", unit: "+", label: "Bật lửa đã in" },
			{ value: "300", unit: "+", label: "Shop tin dùng" },
			{ value: "5.0", unit: "★", label: "Đánh giá trung bình" },
			{ value: "24", unit: "h", label: "Hoàn thiện nhanh nhất" },
		],
	},
	introduction: {
		eyebrow: "Bật lửa Cricket Custom",
		title: "Món vật dụng nhỏ — *ấn tượng* không nhỏ chút nào",
		description:
			"Bật lửa Cricket từ Pháp — nền phôi tốt để in lên một thiết kế tốt. INUT in trực tiếp lên thân bật lửa: màu bền, cạnh sắc, không bong tróc theo thời gian.",
		bullets: [
			"Phôi bật lửa Cricket chính hãng từ Pháp — chất lượng đốt ổn định, thân máy bền.",
			"In màu trực tiếp lên thân — sắc nét đến từng chi tiết nhỏ, không cần dán decal.",
			"3 lớp phủ: matte sang trọng, chrome bóng kim loại, glitter lấp lánh — chọn theo mood.",
			"Nhận đơn từ lẻ đến sỉ — không ép số lượng tối thiểu lớn.",
			"Giao trong 24h với đơn tiêu chuẩn — hỗ trợ tiến độ gấp cho sự kiện.",
		],
		highlights: [
			{
				title: "Phôi Cricket chính hãng",
				description:
					"Bật lửa Cricket nhập từ Pháp — nền in phẳng đều, màu bám tốt hơn phôi thường.",
				icon: <WorkspacePremiumIcon color="primary" />,
			},
			{
				title: "Giao trong 24h",
				description: "Xử lý đơn ngay khi duyệt file — hỗ trợ tiến độ gấp không cần thêm phụ phí.",
				icon: <BoltIcon color="primary" />,
			},
			{
				title: "Tư vấn layout miễn phí",
				description:
					"Gửi logo hoặc ý tưởng thô — INUT căn chỉnh layout chuẩn tỉ lệ in trước khi chạy máy.",
				icon: <DesignServicesIcon color="primary" />,
			},
			{
				title: "Sỉ lẻ đều nhận",
				description:
					"Đơn lẻ vài chục hay sỉ vài nghìn cái — giá tốt theo số lượng, không phân biệt.",
				icon: <LocalPrintshopIcon color="primary" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại",
		title: "Các dòng bật lửa Cricket",
		description: "Lựa chọn mẫu bật lửa phù hợp với nhu cầu của bạn.",
		items: [
			{
				name: "Cricket - in màu thường",
				description: "Bật lửa size tiêu chuẩn, in màu sắc rõ nét, phù hợp mọi thiết kế",
				image: `/services/ca-nhan-hoa/skin-bat-lua-customize/3.avif`,
			},
			{
				name: "Cricket - in màu chrome bóng",
				description: "Lớp phủ chrome bóng sang trọng, tạo hiệu ứng kim loại cao cấp",
				image: `/services/ca-nhan-hoa/skin-bat-lua-customize/2.avif`,
			},
			{
				name: "Cricket mini - in màu thường",
				description: "Kích thước nhỏ gọn, tiện lợi mang theo, in màu sắc nét",
				image: `/services/ca-nhan-hoa/skin-bat-lua-customize/9.avif`,
			},
			{
				name: "Cricket mini - in màu chrome bóng",
				description: "Mini size kết hợp chrome bóng, sang trọng và độc đáo",
				image: `/services/ca-nhan-hoa/skin-bat-lua-customize/11.avif`,
			},
		],
		specOptions: [
			"Lớp phủ mờ (Matte) - Sang trọng, hạn chế vân tay",
			"Lớp phủ kim tuyến (Glitter) - Lấp lánh, thu hút ánh nhìn",
			"Lớp phủ bóng (Glossy) - Màu sắc rực rỡ, nổi bật",
		],
	},
	whyInut: {
		eyebrow: "Ứng dụng thực tế",
		title: "Bật lửa custom — *đắt giá* hơn bạn nghĩ",
		description: "Thứ người ta cầm trên tay mỗi ngày — là thứ họ nhớ thương hiệu của bạn lâu nhất.",
		applications: {
			title: "Dùng được ở đâu?",
			description:
				"Từ bàn trưng bày sự kiện đến quầy thu ngân — bật lửa custom làm việc thầm lặng nhưng hiệu quả.",
			items: [
				{
					title: "Sự kiện & Triển lãm",
					description: "Quà tặng nhỏ — nhận diện thương hiệu lớn.",
					icon: <EventAvailableIcon color="primary" />,
				},
				{
					title: "Quà tặng quảng cáo",
					description: "Người ta giữ bật lửa lâu hơn giữ tờ rơi.",
					icon: <CampaignIcon color="primary" />,
				},
				{
					title: "Bán lẻ tại shop",
					description: "Thêm SKU độc lạ — thêm doanh thu không tốn chi phí hàng tồn.",
					icon: <StorefrontIcon color="primary" />,
				},
				{
					title: "Phụ kiện cá nhân",
					description: "Mang trên người thứ chỉ mình mày có.",
					icon: <WorkspacePremiumIcon color="primary" />,
				},
			],
		},
	},
	contact: {
		eyebrow: "Đặt hàng ngay",
		description:
			"Gửi ý tưởng hoặc logo — INUT báo giá trong 15 phút, tư vấn layout miễn phí, không cần đặt cọc để nhận tư vấn.",
		type: "lighters-customize",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Sản phẩm thực tế",
		title: "Mẫu bật lửa đã in",
		images: Array.from({ length: 13 }).map(
			(_, index) => `/services/ca-nhan-hoa/skin-bat-lua-customize/${index + 1}.avif`
		),
		filters: [],
	},
};
