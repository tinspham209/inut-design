import { ProductPageData } from "@/models/product-page";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArticleIcon from "@mui/icons-material/Article";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import BoltIcon from "@mui/icons-material/Bolt";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CampaignIcon from "@mui/icons-material/Campaign";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import TimerIcon from "@mui/icons-material/Timer";
import VerifiedIcon from "@mui/icons-material/Verified";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const HERO_IMAGE = "/cover-web.webp";

export const SAN_PHAM_DECOR_DATA: ProductPageData = {
	id: "san-pham-decor",
	name: "Sản Phẩm Decor Nhà Hàng, Quán Cà Phê",
	category: "Ấn phẩm F&B",
	seo: {
		title:
			"In Sản Phẩm Decor cho Nhà Hàng, Quán Cà Phê tại Đà Nẵng – Tăng Thẩm Mỹ & Nhận Diện Thương Hiệu | INUT Design",
		description:
			"Dịch vụ in sản phẩm decor cho nhà hàng, quán cà phê tại Đà Nẵng. Poster, bảng quote, decal dán tường, bảng chỉ dẫn, hashtag decor — thiết kế đẹp, chất liệu đa dạng, giá cạnh tranh.",
		url: "https://inutdesign.com/services/an-pham-fb/san-pham-decor",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm F&B", item: "/services/an-pham-fb" },
			{ name: "Sản Phẩm Decor", item: "/services/an-pham-fb/san-pham-decor" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Sản Phẩm Decor Nhà Hàng, Quán Cà Phê",
			serviceType: "In ấn & trang trí không gian F&B",
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
		title: "Sản Phẩm Decor Nhà Hàng & Quán Cà Phê",
		description:
			"Không gian đẹp không tự nhiên mà có. Poster, bảng quote, decal dán tường, bảng chỉ dẫn — INUT in sắc nét, đúng chất liệu, đồng bộ với concept quán của bạn.",
		image: HERO_IMAGE,
		chips: ["Thiết kế theo concept", "Đa dạng chất liệu", "Lấy nhanh 3–4 ngày"],
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"Poster Decor Sắc Nét",
			"Decal Dán Tường & Kính",
			"Bảng Quote Chỉn Chu",
			"Đồng Bộ Nhận Diện Quán",
		],
		stats: [
			{ value: "300", unit: "+", label: "Mô hình F&B tin dùng" },
			{ value: "10", unit: " cái", label: "Số lượng tối thiểu" },
			{ value: "5.0", unit: "★", label: "Đánh giá từ khách hàng" },
			{ value: "3–4", unit: " ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Decor không gian F&B",
		title: "Sản phẩm decor in theo yêu cầu",
		description:
			"Decor không chỉ để đẹp — đây là công cụ định hình phong cách thương hiệu, tạo điểm check-in và giúp khách hàng ghi nhớ quán của bạn lâu hơn.",
		bullets: [
			"Poster, bảng quote, decal, hashtag decor, bảng chỉ dẫn — tất cả được thiết kế đồng bộ theo màu sắc và concept của quán.",
			"Kích thước linh hoạt: từ A4 bảng nhỏ đến 80×120 cm poster lớn, hoặc tùy chỉnh theo vị trí thi công thực tế.",
			"Đa dạng chất liệu: giấy Couche, giấy mỹ thuật, decal PP, decal trong, formex, mica, gỗ — tư vấn đúng theo mô hình quán.",
			"Thiết kế chuẩn kỹ thuật: 300 DPI, CMYK, bleed 3mm, font convert outline — đảm bảo thành phẩm sắc nét khi thi công.",
			"Gia công sau in: cán mờ / bóng, bồi formex, bế theo hình, gia cố khung — phù hợp cho không gian trong nhà và ngoài trời.",
		],
		highlights: [
			{
				title: "Sản phẩm decor là gì?",
				description:
					"Nhóm ấn phẩm và vật phẩm dùng để trang trí, định hình phong cách không gian và hỗ trợ nhận diện thương hiệu tại quán — từ chi tiết nhỏ trên bàn đến điểm nhấn lớn trên tường.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Decal dán tường & kính",
				description:
					"Decal PP, decal sữa, decal trong — dễ thi công, gọn đẹp, phù hợp cho tường, cửa kính, quầy order và khu check-in.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Bảng cứng & bảng treo",
				description:
					"Formex, mica, gỗ — chắc chắn, thẩm mỹ cao, dùng lâu dài. Phù hợp cho bảng tên khu vực, bảng chỉ dẫn, hashtag decor cố định.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Poster & bảng quote",
				description:
					"A4, A3, A2 hoặc khổ tùy chỉnh — in sắc nét trên giấy Couche hoặc giấy mỹ thuật, tạo điểm nhấn nhẹ nhàng mà hiệu quả.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại decor",
		title: "Các dòng sản phẩm decor INUT thực hiện",
		description:
			"Mỗi loại decor có vai trò và vị trí riêng trong không gian — tư vấn đúng để chọn đúng.",
		items: [
			{
				name: "Poster & Bảng quote",
				description: "Treo tường, dựng bàn, tạo điểm nhấn cho từng góc quán.",
				image: HERO_IMAGE,
			},
			{
				name: "Decal dán tường & kính",
				description: "Trang trí tường, cửa kính, quầy order — gọn, đẹp, dễ thi công.",
				image: HERO_IMAGE,
			},
			{
				name: "Bảng cứng & Hashtag decor",
				description: "Formex, mica, gỗ — bảng tên, bảng chỉ dẫn, hashtag check-in cố định.",
				image: HERO_IMAGE,
			},
			{
				name: "Decor theo concept",
				description: "Tùy chỉnh hoàn toàn theo phong cách và màu sắc nhận diện của quán.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Tại sao chọn chúng tôi",
		title: "Vì sao chọn dịch vụ in decor tại INUT Design?",
		description:
			"Một bộ decor tốt không chỉ đẹp trên file — nó phải ăn nhập với không gian thực tế, đồng bộ với thương hiệu và bền theo thời gian sử dụng.",
		productionProcess: {
			title: "Quy trình sản xuất chuyên nghiệp",
			items: [
				{
					title: "Tư vấn & Thiết kế",
					description:
						"Khảo sát vị trí, phong cách quán và ngân sách — tư vấn chất liệu và phương án phù hợp nhất.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "In ấn & Gia công",
					description:
						"In trên chất liệu đã chọn, sau đó cán màng, bồi formex, bế form hoặc gia cố khung theo yêu cầu.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Kiểm tra & Bàn giao",
					description:
						"Kiểm tra độ sắc nét, màu sắc, cạnh cắt — đóng gói sạch đẹp, sẵn sàng thi công tại quán.",
					icon: <DoneAllIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng cho mọi mô hình F&B",
			description:
				"Từ chi tiết nhỏ trên bàn đến điểm nhấn lớn trên tường — INUT đáp ứng đủ nhu cầu decor cho từng loại không gian.",
			items: [
				{
					title: "Nhà hàng & Quán cà phê",
					description: "Bảng quote, poster decor, decal tường, bảng chỉ dẫn khu vực.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Tiệm bánh, trà sữa, quán ăn",
					description: "Decor bàn, bảng menu mini, hashtag check-in, standee mini.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Khu vực check-in & quầy order",
					description: "Hashtag decor, bảng cứng, decal kính — tạo điểm chụp ảnh đẹp tự nhiên.",
					icon: <CardGiftcardIcon fontSize="small" />,
				},
				{
					title: "Decor theo concept riêng",
					description:
						"Vintage, hiện đại, industrial, handmade — tùy chỉnh hoàn toàn theo tinh thần quán.",
					icon: <GroupsIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết đẹp đúng chỗ, bền đúng mục đích, giá cạnh tranh",
			description:
				"Mỗi sản phẩm decor được tư vấn đúng chất liệu theo vị trí và môi trường sử dụng — trong nhà hay ngoài trời, ngắn hạn hay dài hạn.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Đánh giá khách hàng",
		title: "Khách hàng nói gì về <em>INUT?</em>",
		items: [
			{
				name: "Rang Coffee & Studio",
				role: "Quán cà phê concept · Đà Nẵng",
				text: "INUT tư vấn rất kỹ từ chất liệu đến vị trí đặt decor. Thành phẩm đẹp hơn mình hình dung, ăn nhập hoàn toàn với concept quán. Khách check-in liên tục.",
				initials: "RC",
				color: "#ff4d00",
			},
			{
				name: "The Garden House",
				role: "Nhà hàng · Đà Nẵng",
				text: "Đặt bộ bảng chỉ dẫn và poster decor cho nhà hàng. Chất lượng in sắc nét, formex cứng cáp, giao đúng hẹn. Sẽ tiếp tục hợp tác cho lần mở rộng tiếp theo.",
				initials: "GH",
				color: "#1a5c3a",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 300+ đánh giá",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description:
			"Liên hệ ngay để được tư vấn mẫu decor phù hợp, chọn chất liệu tối ưu và nhận báo giá nhanh cho không gian F&B của bạn.",
		type: "san-pham-decor",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án đã thực hiện",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: [],
	},
};

export const THIET_KE_IN_MENU_DATA: ProductPageData = {
	id: "design-in-menu",
	name: "Thiết Kế & In Menu Nhà Hàng, Quán Cà Phê",
	category: "Ấn phẩm F&B",
	seo: {
		title: "Thiết Kế & In Menu Nhà Hàng, Quán Cà Phê tại Đà Nẵng – Đa Dạng Chất Liệu | INUT Design",
		description:
			"Dịch vụ thiết kế và in menu nhà hàng, quán cà phê tại Đà Nẵng. Menu giấy, menu nhựa, menu mica, menu gỗ, menu da — thiết kế đẹp, in sắc nét, tư vấn chất liệu phù hợp. Lấy nhanh 3–4 ngày.",
		url: "https://inutdesign.com/services/an-pham-fb/thiet-ke-in-menu",
		thumbnailUrl: `/services/an-pham-fb/thumbnail/thiet-ke-in-menu.avif`,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm F&B", item: "/services/an-pham-fb" },
			{ name: "Thiết Kế & In Menu", item: "/services/an-pham-fb/thiet-ke-in-menu" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "Thiết Kế & In Menu Nhà Hàng, Quán Cà Phê",
			serviceType: "Thiết kế & In ấn menu F&B",
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
		title: "Thiết Kế & In Menu Nhà Hàng, Quán Cà Phê",
		description:
			"Menu đẹp không chỉ để nhìn — nó giúp khách chọn món nhanh hơn, upsell tự nhiên hơn và cảm nhận rõ hơn phong cách của quán. INUT thiết kế đúng chất, in đúng chất liệu.",
		image: `/services/an-pham-fb/thumbnail/thiet-ke-in-menu.avif`,
		chips: ["Thiết kế theo concept", "Đa dạng chất liệu", "Lấy nhanh 3–4 ngày"],
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"Menu Giấy Cao Cấp",
			"Menu Nhựa Chống Nước",
			"Menu Mica & Gỗ",
			"Thiết Kế Đúng Thương Hiệu",
		],
		stats: [
			{ value: "300", unit: "+", label: "Mô hình F&B tin dùng" },
			{ value: "10", unit: " cái", label: "Số lượng tối thiểu" },
			{ value: "5.0", unit: "★", label: "Đánh giá từ khách hàng" },
			{ value: "3–4", unit: " ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Ấn phẩm F&B quan trọng nhất",
		title: "In menu nhà hàng, quán cà phê theo yêu cầu",
		description:
			"Menu là điểm chạm trực tiếp giữa thương hiệu và khách hàng — được thiết kế đẹp, in sắc nét và chọn đúng chất liệu sẽ giúp quán chuyên nghiệp hơn mỗi ngày.",
		bullets: [
			"Menu không chỉ liệt kê món — bố cục tốt giúp khách đọc nhanh, chọn dễ và tăng giá trị đơn hàng tự nhiên.",
			"Kích thước linh hoạt: A4, A5, A3 gấp đôi / gấp ba, kích thước vuông hoặc tùy chỉnh theo concept quán.",
			"Đa dạng chất liệu in: Couche, Ivory, Bristol, giấy mỹ thuật, giấy Kraft — tư vấn theo phong cách và ngân sách.",
			"Đa dạng vật liệu thành phẩm: menu giấy cán màng, menu bồi form cứng, menu nhựa / PVC, menu mica, menu gỗ, menu da.",
			"Gia công linh hoạt: cán mờ / bóng, đóng lò xo, gáy vít, gáy còng — hỗ trợ thay ruột menu khi cập nhật món.",
		],
		highlights: [
			{
				title: "Menu là gì trong F&B?",
				description:
					"Ấn phẩm giới thiệu món ăn, thức uống, combo và giá bán — vừa cung cấp thông tin vừa thể hiện bản sắc và mức độ đầu tư của thương hiệu.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Menu giấy & cán màng",
				description:
					"Couche, Ivory, giấy mỹ thuật, giấy Kraft — cán mờ hoặc bóng, bồi form cứng. Chi phí linh hoạt, thẩm mỹ cao.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Menu chống nước",
				description:
					"PVC, nhựa, mica — bền, dễ lau chùi, phù hợp nhà hàng và quán ăn tần suất cao. Dùng lâu dài, ít hư hỏng.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Menu cao cấp",
				description:
					"Menu gỗ, menu da / giả da — tạo dấu ấn mạnh, tăng cảm giác premium cho nhà hàng, lounge hoặc khách sạn.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại menu",
		title: "Các dòng menu INUT thực hiện",
		description:
			"Từ menu giấy phổ thông đến menu cao cấp theo concept — tư vấn đúng vật liệu cho từng mô hình quán.",
		items: [
			{
				name: "Menu giấy cán màng",
				description: "Couche, Ivory, giấy mỹ thuật, Kraft — cán mờ / bóng, bồi cứng.",
				image: `/services/an-pham-fb/thiet-ke-in-menu/1.avif`,
			},
			{
				name: "Menu nhựa & chống nước",
				description: "PVC, nhựa — bền, dễ lau, phù hợp nhà hàng tần suất cao.",
				image: `/services/an-pham-fb/thiet-ke-in-menu/10.avif`,
			},
			{
				name: "Menu gỗ & Giấy Craft",
				description: "Hiện đại hoặc vintage — để bàn, quầy order, bảng nhỏ.",
				image: `/services/an-pham-fb/thiet-ke-in-menu/9.avif`,
			},
			{
				name: "Menu da & đóng quyển",
				description: "Da / giả da, đóng lò xo / gáy vít — premium, dễ thay ruột.",
				image: `/services/an-pham-fb/thiet-ke-in-menu/6.avif`,
			},
		],
	},
	whyInut: {
		eyebrow: "Tại sao chọn chúng tôi",
		title: "Vì sao chọn thiết kế & in menu tại INUT Design?",
		description:
			"Chọn đúng chất liệu in và vật liệu thành phẩm là yếu tố quyết định menu đẹp, bền và phù hợp thực tế — INUT tư vấn cụ thể theo từng mô hình quán.",
		productionProcess: {
			title: "Quy trình sản xuất chuyên nghiệp",
			items: [
				{
					title: "Tư vấn & Thiết kế",
					description:
						"Xác định mô hình quán, phong cách thương hiệu, tần suất dùng — tư vấn chất liệu và vật liệu phù hợp nhất.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "In ấn & Gia công",
					description:
						"In 300 DPI, CMYK, bleed 3mm — cán mờ / bóng, bồi cứng, đóng lò xo, gáy vít hoặc lắp khung theo loại menu.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Kiểm tra & Bàn giao",
					description:
						"Kiểm tra độ sắc nét, màu sắc, gia công hoàn thiện — đóng gói sạch đẹp, sẵn sàng đặt bàn ngay.",
					icon: <DoneAllIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Phù hợp với mọi mô hình F&B",
			description:
				"Menu phổ thông hay cao cấp, ngắn hạn hay dài hạn — INUT có giải pháp phù hợp cho từng loại không gian và ngân sách.",
			items: [
				{
					title: "Nhà hàng & Quán ăn",
					description: "Menu Ivory / PVC cán màng, menu nhựa chống nước, menu da / gáy vít.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Quán cà phê & Trà sữa",
					description: "Menu Couche, Kraft, giấy mỹ thuật — cán mờ hoặc bồi cứng theo concept.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Tiệm bánh & Take-away",
					description: "Menu gấp A5 / A4, menu bảng nhỏ để quầy, menu một tờ lấy về.",
					icon: <CardGiftcardIcon fontSize="small" />,
				},
				{
					title: "Nhà hàng premium & Khách sạn",
					description: "Menu gỗ, menu da / giả da — tăng cảm giác sang trọng và chỉn chu.",
					icon: <GroupsIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết thiết kế đẹp, chất liệu đúng, giá cạnh tranh",
			description:
				"Menu được tư vấn đúng vật liệu theo tần suất sử dụng và môi trường thực tế — đảm bảo đẹp ngay khi nhận và bền trong quá trình vận hành.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Đánh giá khách hàng",
		title: "Khách hàng nói gì về <em>INUT?</em>",
		items: [
			{
				name: "Mộc Quán Coffee",
				role: "Quán cà phê concept · Đà Nẵng",
				text: "INUT tư vấn dùng giấy Kraft cán mờ cho concept vintage của quán. Nhìn thực tế đẹp hơn mình nghĩ rất nhiều, khách cầm lên ai cũng chụp ảnh.",
				initials: "MQ",
				color: "#ff4d00",
			},
			{
				name: "Nhà Hàng Hải Sản Biển Đông",
				role: "Nhà hàng · Đà Nẵng",
				text: "Làm menu PVC chống nước cho nhà hàng. Lau được dễ dàng, màu sắc vẫn sắc nét sau nhiều tháng dùng. Giá tốt, giao đúng hẹn, sẽ đặt tiếp khi cần cập nhật.",
				initials: "BD",
				color: "#1a5c3a",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 300+ đánh giá",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description:
			"Liên hệ ngay để được tư vấn mẫu menu phù hợp, chọn chất liệu tối ưu và nhận báo giá nhanh cho nhà hàng hoặc quán cà phê của bạn.",
		type: "design-in-menu",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án đã thực hiện",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 11 }).map(
			(_, index) => `/services/an-pham-fb/thiet-ke-in-menu/${index + 1}.avif`
		),
		filters: [],
	},
};

export const PHIEU_VE_HOA_DON_GTGT_DATA: ProductPageData = {
	id: "phieu-ve-hoa-don-gtgt",
	name: "Phiếu, Vé & Hóa Đơn GTGT",
	category: "Ấn phẩm F&B",
	seo: {
		title:
			"In Phiếu, Vé, Hóa Đơn GTGT tại Đà Nẵng – In Số Nhảy, Đóng Quyển, Lấy Nhanh | INUT Design",
		description:
			"Dịch vụ in phiếu order, vé vào cửa, hóa đơn GTGT tại Đà Nẵng. In số nhảy, mã seri, QR code, đóng quyển liên — thiết kế đẹp, in rõ, gia công chỉn chu. Phù hợp nhà hàng, sự kiện, doanh nghiệp.",
		url: "https://inutdesign.com/services/an-pham-fb/phieu-ve-hoa-don-gtgt",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm F&B", item: "/services/an-pham-fb" },
			{ name: "Phiếu, Vé & Hóa Đơn GTGT", item: "/services/an-pham-fb/phieu-ve-hoa-don-gtgt" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Phiếu, Vé & Hóa Đơn GTGT",
			serviceType: "In ấn ấn phẩm nghiệp vụ",
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
		title: "Phiếu, Vé & Hóa Đơn GTGT",
		description:
			"Phiếu order, vé vào cửa, hóa đơn GTGT — in số nhảy, đóng quyển liên, tích hợp QR code. Gọn, rõ, đúng nghiệp vụ và sẵn sàng dùng ngay khi nhận hàng.",
		image: HERO_IMAGE,
		chips: ["In số nhảy & mã seri", "Đóng quyển liên", "Tích hợp QR code"],
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"In Số Nhảy Chính Xác",
			"Đóng Quyển Liên Chắc Chắn",
			"Tích Hợp QR Code",
			"Lấy Nhanh 3–4 Ngày",
		],
		stats: [
			{ value: "50.000", unit: "+", label: "Phiếu & vé đã xuất xưởng" },
			{ value: "10", unit: " cuốn", label: "Số lượng tối thiểu" },
			{ value: "5.0", unit: "★", label: "Đánh giá từ khách hàng" },
			{ value: "3–4", unit: " ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Ấn phẩm nghiệp vụ F&B & doanh nghiệp",
		title: "In phiếu, vé & hóa đơn GTGT theo yêu cầu",
		description:
			"Nhỏ nhưng không thể sai — phiếu, vé và hóa đơn là ấn phẩm nghiệp vụ đòi hỏi in rõ, đúng quy cách và đảm bảo tính nhất quán trong từng quyển, từng tờ.",
		bullets: [
			"In số nhảy tuần tự, mã seri, mã vạch hoặc QR code — đảm bảo chính xác từng con số, không trùng, không sai thứ tự.",
			"Đóng quyển liên: 2 liên, 3 liên hoặc nhiều hơn — giấy than hoặc không carbon (NCR) để sao chép không cần mực.",
			"Thiết kế theo yêu cầu: logo, thông tin doanh nghiệp, bảng nội dung, dòng ký tên, mã QR — đầy đủ và đúng nghiệp vụ.",
			"Kích thước linh hoạt: A4, A5, A6, 1/3 A4 hoặc tùy chỉnh theo từng loại phiếu và quy trình vận hành thực tế.",
			"Chất liệu in: giấy thường, giấy NCR (không carbon), giấy nhiệt — tư vấn đúng theo thiết bị và môi trường sử dụng.",
		],
		highlights: [
			{
				title: "Phiếu order & phiếu thu",
				description:
					"Phiếu gọi món, phiếu order bếp, phiếu thu tiền, phiếu giao nhận — in số nhảy, đóng quyển liên, dùng ngay tại quán.",
				icon: <ReceiptLongIcon fontSize="small" />,
			},
			{
				title: "Vé vào cửa & vé sự kiện",
				description:
					"Vé check-in sự kiện, vé tham quan, vé giữ xe, vé VIP — in mã seri, QR code, chống làm giả bằng số nhảy tuần tự.",
				icon: <ConfirmationNumberIcon fontSize="small" />,
			},
			{
				title: "Hóa đơn GTGT",
				description:
					"Mẫu hóa đơn GTGT theo đúng quy định — thông tin doanh nghiệp, mã số thuế, bảng hàng hóa dịch vụ, dòng ký xác nhận.",
				icon: <AccountBalanceIcon fontSize="small" />,
			},
			{
				title: "In số nhảy & QR code",
				description:
					"Số nhảy tuần tự không trùng lặp, QR code liên kết dữ liệu thực — hỗ trợ kiểm soát, đối soát và quản lý vận hành.",
				icon: <QrCode2Icon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại ấn phẩm",
		title: "Các dòng phiếu, vé & hóa đơn INUT thực hiện",
		description:
			"Mỗi loại có quy cách riêng — tư vấn đúng để chọn đúng giấy, đúng số liên và đúng gia công.",
		items: [
			{
				name: "Phiếu order & nghiệp vụ",
				description: "Phiếu gọi món, phiếu thu, phiếu giao nhận, phiếu kiểm kho.",
				image: HERO_IMAGE,
			},
			{
				name: "Vé vào cửa & sự kiện",
				description: "Vé check-in, vé tham quan, vé giữ xe, vé VIP có QR code.",
				image: HERO_IMAGE,
			},
			{
				name: "Hóa đơn GTGT",
				description: "Theo đúng mẫu quy định, đầy đủ thông tin thuế và ký xác nhận.",
				image: HERO_IMAGE,
			},
			{
				name: "Phiếu bảo hành & phiếu quà",
				description: "Phiếu bảo hành sản phẩm, phiếu quà tặng có số seri kiểm soát.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Tại sao chọn chúng tôi",
		title: "Vì sao chọn in phiếu, vé & hóa đơn tại INUT Design?",
		description:
			"Ấn phẩm nghiệp vụ không cho phép sai — INUT kiểm soát chặt từ số nhảy, thứ tự liên đến chất lượng in đồng đều giữa từng tờ trong quyển.",
		productionProcess: {
			title: "Quy trình sản xuất chuyên nghiệp",
			items: [
				{
					title: "Tư vấn & Thiết kế",
					description:
						"Xác định loại phiếu, số liên, thông tin cần hiển thị, có cần số nhảy hay QR code — thiết kế đúng nghiệp vụ trước khi in.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "In ấn & Đóng quyển",
					description:
						"In số nhảy tuần tự, in trên giấy thường hoặc NCR — đóng quyển liên, ghim hoặc keo gáy chắc chắn, dễ xé từng liên.",
					icon: <LocalPrintshopIcon fontSize="small" />,
				},
				{
					title: "Kiểm tra & Bàn giao",
					description:
						"Kiểm tra thứ tự số, độ rõ nét giấy than / NCR, độ chắc gáy quyển — đóng gói theo tập, sẵn sàng sử dụng ngay.",
					icon: <DoneAllIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng cho F&B, sự kiện & doanh nghiệp",
			description:
				"Bất kỳ quy trình nào cần ghi nhận, kiểm soát và đối soát — đều cần ấn phẩm nghiệp vụ đúng chuẩn.",
			items: [
				{
					title: "Nhà hàng & Quán ăn",
					description: "Phiếu order bếp, phiếu thu tiền, phiếu giao nhận ca — đóng quyển liên NCR.",
					icon: <RestaurantIcon fontSize="small" />,
				},
				{
					title: "Sự kiện & Triển lãm",
					description: "Vé vào cửa, vé VIP, vé giữ xe — in số nhảy, QR code kiểm soát lối vào.",
					icon: <ConfirmationNumberIcon fontSize="small" />,
				},
				{
					title: "Doanh nghiệp & Bán lẻ",
					description:
						"Hóa đơn GTGT, phiếu bảo hành, phiếu xuất kho — đúng mẫu, đủ thông tin pháp lý.",
					icon: <AccountBalanceIcon fontSize="small" />,
				},
				{
					title: "Spa, Salon & Dịch vụ",
					description:
						"Phiếu dịch vụ, phiếu quà tặng có mã seri, phiếu hẹn lịch — theo dõi khách hàng dễ hơn.",
					icon: <CardGiftcardIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết in đúng số, đúng thứ tự, đúng hẹn",
			description:
				"Số nhảy không trùng, quyển liên không lệch, giấy than / NCR sao chép rõ — INUT kiểm tra kỹ từng quyển trước khi bàn giao.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Đánh giá khách hàng",
		title: "Khách hàng nói gì về <em>INUT?</em>",
		items: [
			{
				name: "Nhà Hàng Buffet Sơn Trà",
				role: "Nhà hàng · Đà Nẵng",
				text: "Đặt phiếu order 3 liên NCR cho nhà hàng. INUT thiết kế đúng theo quy trình bếp, số nhảy rõ ràng, giấy than sao chép rõ nét. Dùng rất tiện, sẽ tái đặt định kỳ.",
				initials: "ST",
				color: "#ff4d00",
			},
			{
				name: "Ban Tổ Chức Lễ Hội Đà Nẵng",
				role: "Sự kiện · Đà Nẵng",
				text: "In vé vào cửa có QR code và số seri cho sự kiện 2.000 người. INUT giao đúng hẹn, số nhảy không sai một tờ, kiểm soát lối vào rất thuận tiện.",
				initials: "LH",
				color: "#1a5c3a",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 300+ đánh giá",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description:
			"Liên hệ ngay để được tư vấn mẫu phiếu, vé phù hợp với quy trình vận hành và nhận báo giá nhanh cho doanh nghiệp hoặc sự kiện của bạn.",
		type: "phieu-ve-hoa-don-gtgt",
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
			(_, index) => `/services/an-pham-fb/phieu-ve-hoa-don-gtgt/${index + 1}.avif`
		),
		filters: [],
	},
};

export const TAM_LOT_BAN_AN_DATA: ProductPageData = {
	id: "tam-lot-ban-an",
	name: "Tấm Lót Bàn Ăn",
	category: "Ấn phẩm F&B",
	seo: {
		title: "In Tấm Lót Bàn Ăn tại Đà Nẵng – Thiết Kế Đẹp, Đa Dạng Chất Liệu | INUT Design",
		description:
			"Dịch vụ in tấm lót bàn ăn tại Đà Nẵng. Lót bàn giấy, PP, silicone — thiết kế đồng bộ thương hiệu, in sắc nét, phù hợp nhà hàng, quán cà phê, tiệc sự kiện. Lấy nhanh 3–4 ngày.",
		url: "https://inutdesign.com/services/an-pham-fb/tam-lot-ban-an",
		thumbnailUrl: `/services/an-pham-fb/thumbnail/tam-lot-ban-an.avif`,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm F&B", item: "/services/an-pham-fb" },
			{ name: "Tấm Lót Bàn Ăn", item: "/services/an-pham-fb/tam-lot-ban-an" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Tấm Lót Bàn Ăn",
			serviceType: "In ấn ấn phẩm F&B",
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
		title: "Tấm Lót Bàn Ăn",
		description:
			"Mỗi lần khách ngồi xuống là một lần thương hiệu xuất hiện. Tấm lót bàn thiết kế đẹp, in sắc nét — vừa bảo vệ mặt bàn, vừa nâng tầm trải nghiệm và giữ thương hiệu trong tầm mắt khách suốt bữa ăn.",
		image: `/services/an-pham-fb/thumbnail/tam-lot-ban-an.avif`,
		chips: ["Thiết kế theo thương hiệu", "Đa dạng chất liệu", "Lấy nhanh 3–4 ngày"],
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"Lót Bàn Giấy Dùng Một Lần",
			"Lót Bàn PP Tái Sử Dụng",
			"In Sắc Nét Theo Thương Hiệu",
			"Giao Hàng Đúng Hẹn",
		],
		stats: [
			{ value: "300", unit: "+", label: "Mô hình F&B tin dùng" },
			{ value: "50", unit: " cái", label: "Số lượng tối thiểu" },
			{ value: "5.0", unit: "★", label: "Đánh giá từ khách hàng" },
			{ value: "3–4", unit: " ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Ấn phẩm F&B tăng trải nghiệm",
		title: "In tấm lót bàn ăn theo yêu cầu",
		description:
			"Tấm lót bàn ăn không chỉ giữ sạch mặt bàn — đây là không gian nhỏ nhưng hiệu quả để thương hiệu hiện diện liên tục trong suốt trải nghiệm dùng bữa của khách.",
		bullets: [
			"Thiết kế linh hoạt: logo, slogan, menu mini, QR code, hình minh họa — tích hợp thông tin thương hiệu tự nhiên vào mặt lót.",
			"Kích thước phổ biến: 30×40 cm, 35×45 cm, 40×55 cm hoặc tùy chỉnh theo kích thước mặt bàn thực tế.",
			"Chất liệu đa dạng: giấy Couche dùng một lần, PP tái sử dụng, PVC chống nước — tư vấn theo tần suất và phong cách quán.",
			"In sắc nét, màu sắc đồng đều — đảm bảo mỗi tờ đều đẹp như nhau dù sản xuất số lượng lớn.",
			"Phù hợp cho nhà hàng, quán cà phê, tiệc cưới, sự kiện doanh nghiệp và bất kỳ không gian F&B nào cần nâng tầm bàn ăn.",
		],
		highlights: [
			{
				title: "Tấm lót bàn ăn là gì?",
				description:
					"Ấn phẩm đặt dưới đĩa, tô hoặc ly trên bàn ăn — vừa giữ sạch mặt bàn, vừa là diện tích in thương hiệu hiện diện liên tục trước mắt khách.",
				icon: <TableRestaurantIcon fontSize="small" />,
			},
			{
				title: "Lót bàn giấy dùng một lần",
				description:
					"Giấy Couche hoặc giấy Kraft — in đẹp, chi phí hợp lý, thay mới sau mỗi lượt khách. Phù hợp nhà hàng, quán ăn đông khách.",
				icon: <ArticleIcon fontSize="small" />,
			},
			{
				title: "Lót bàn PP tái sử dụng",
				description:
					"Nhựa PP hoặc PVC — lau chùi dễ dàng, dùng nhiều lần, bền màu theo thời gian. Phù hợp quán cà phê, nhà hàng dùng lâu dài.",
				icon: <AutorenewIcon fontSize="small" />,
			},
			{
				title: "Tích hợp QR code & menu mini",
				description:
					"In QR code trỏ đến menu online, mạng xã hội hoặc chương trình khuyến mãi — biến tấm lót thành công cụ marketing tại bàn.",
				icon: <QrCode2Icon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại tấm lót",
		title: "Các dòng tấm lót bàn ăn INUT thực hiện",
		description:
			"Dùng một lần hay tái sử dụng, đơn giản hay có bộ nhận diện đầy đủ — tư vấn đúng để chọn đúng chất liệu.",
		items: [
			{
				name: "Lót bàn giấy Couche",
				description: "In đẹp, dùng một lần, chi phí hợp lý cho quán đông khách.",
				image: `/services/an-pham-fb/tam-lot-ban-an/1.avif`,
			},
			{
				name: "Lót bàn giấy Kraft",
				description: "Tông nâu mộc, phù hợp concept vintage, handmade, quán organic.",
				image: `/services/an-pham-fb/tam-lot-ban-an/2.avif`,
			},
			{
				name: "Lót bàn nhựa PP / PVC",
				description: "Tái sử dụng, lau dễ, bền màu — dùng lâu dài cho nhà hàng, café.",
				image: `/services/an-pham-fb/tam-lot-ban-an/12.avif`,
			},
			{
				name: "Lót bàn sự kiện",
				description: "Thiết kế theo chủ đề tiệc cưới, event, gala dinner, team building.",
				image: `/services/an-pham-fb/tam-lot-ban-an/4.avif`,
			},
		],
	},
	whyInut: {
		eyebrow: "Tại sao chọn chúng tôi",
		title: "Vì sao chọn in tấm lót bàn ăn tại INUT Design?",
		description:
			"Tấm lót bàn đẹp phải đồng đều từ tờ đầu đến tờ cuối — INUT kiểm soát chất lượng in và màu sắc nhất quán dù số lượng lớn.",
		productionProcess: {
			title: "Quy trình sản xuất chuyên nghiệp",
			items: [
				{
					title: "Tư vấn & Thiết kế",
					description:
						"Xác định kích thước bàn, tần suất thay, concept quán — tư vấn chất liệu và bố cục phù hợp nhất với không gian thực tế.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "In ấn & Gia công",
					description:
						"In 300 DPI, CMYK, bleed 3mm — cắt đúng kích thước, cán màng bảo vệ hoặc để mộc tùy chất liệu và mục đích sử dụng.",
					icon: <LocalPrintshopIcon fontSize="small" />,
				},
				{
					title: "Kiểm tra & Bàn giao",
					description:
						"Kiểm tra màu sắc, cạnh cắt và độ đồng đều giữa các tờ — đóng gói theo tập gọn gàng, sẵn sàng đặt bàn ngay.",
					icon: <DoneAllIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng cho mọi không gian ăn uống",
			description:
				"Từ quán bình dân đến nhà hàng cao cấp, từ bàn ăn hàng ngày đến bàn tiệc sự kiện — tấm lót phù hợp với mọi quy mô.",
			items: [
				{
					title: "Nhà hàng & Quán ăn",
					description: "Lót bàn giấy thay sau mỗi khách — vệ sinh, chuyên nghiệp, có thương hiệu.",
					icon: <RestaurantIcon fontSize="small" />,
				},
				{
					title: "Quán cà phê & Trà sữa",
					description:
						"Lót bàn PP tái sử dụng theo concept quán — đồng bộ với tổng thể không gian.",
					icon: <LocalCafeIcon fontSize="small" />,
				},
				{
					title: "Tiệc cưới & Gala dinner",
					description:
						"Thiết kế riêng theo chủ đề, in tên sự kiện, logo thương hiệu hoặc lời chào khách.",
					icon: <CelebrationIcon fontSize="small" />,
				},
				{
					title: "Sự kiện doanh nghiệp",
					description:
						"Hội nghị, team building, tiệc nội bộ — đồng bộ nhận diện thương hiệu trên từng bàn.",
					icon: <BusinessCenterIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết in đồng đều, đẹp từng tờ, giao đúng hẹn",
			description:
				"Dù đặt 50 hay 5.000 tờ — INUT đảm bảo màu sắc nhất quán, cắt đúng kích thước và không có tờ nào lỗi trong lô hàng bàn giao.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Đánh giá khách hàng",
		title: "Khách hàng nói gì về <em>INUT?</em>",
		items: [
			{
				name: "The Local Kitchen",
				role: "Nhà hàng · Đà Nẵng",
				text: "In lót bàn giấy Couche có logo và QR code menu cho nhà hàng. Khách ngồi xuống là thấy ngay thương hiệu, nhiều người còn scan QR xem menu trước khi gọi món. Rất hiệu quả.",
				initials: "LK",
				color: "#ff4d00",
			},
			{
				name: "Công ty Tổ Chức Sự Kiện Danang Events",
				role: "Event · Đà Nẵng",
				text: "Đặt lót bàn theo chủ đề cho gala dinner 500 khách. INUT thiết kế đẹp, in sắc nét và giao đúng ngày tổ chức. Không có tờ nào lỗi — rất hài lòng.",
				initials: "DE",
				color: "#1a5c3a",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 300+ đánh giá",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description:
			"Liên hệ ngay để được tư vấn chất liệu phù hợp và nhận báo giá nhanh cho tấm lót bàn ăn của nhà hàng, quán cà phê hoặc sự kiện của bạn.",
		type: "tam-lot-ban-an",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án đã thực hiện",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 12 }).map(
			(_, index) => `/services/an-pham-fb/tam-lot-ban-an/${index + 1}.avif`
		),
		filters: [],
	},
};
