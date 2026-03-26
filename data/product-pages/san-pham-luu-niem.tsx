import { ProductPageData } from "@/models/product-page";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BoltIcon from "@mui/icons-material/Bolt";
import CampaignIcon from "@mui/icons-material/Campaign";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CollectionsIcon from "@mui/icons-material/Collections";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ShieldIcon from "@mui/icons-material/Shield";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TimerIcon from "@mui/icons-material/Timer";
import VerifiedIcon from "@mui/icons-material/Verified";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const HERO_IMAGE = "/cover-web.webp";

export const THANK_CARD_DATA: ProductPageData = {
	id: "thank-card-gift-card",
	name: "Thank Card & Gift Card",
	category: "Sản phẩm lưu niệm",
	seo: {
		title: "In Thank Card, Gift Card Tại Đà Nẵng — Nâng Tầm Thương Hiệu | INUT Design",
		description:
			"Dịch vụ in thank card, gift card tại Đà Nẵng: thiết kế đẹp, đa dạng chất liệu, giá cạnh tranh, sản xuất nhanh từ 10 cái tại INUT Design.",
		url: "/services/an-pham-luu-niem/thank-card-gift-card",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Sản phẩm lưu niệm", item: "/services/an-pham-luu-niem" },
			{
				name: "Thank Card & Gift Card",
				item: "/services/an-pham-luu-niem/thank-card-gift-card",
			},
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Thank Card & Gift Card",
			serviceType: "In ấn phẩm lưu niệm",
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
				price: "10000",
				priceCurrency: "VND",
			},
		},
	},
	hero: {
		title: "Thank Card & Gift Card",
		description:
			"Tạo điểm nhấn tinh tế và gắn kết khách hàng với dịch vụ in thank card, gift card chuyên nghiệp: thiết kế chỉn chu và in ấn sắc nét.",
		image: "/services/an-pham-luu-niem/thank-card-gift-card/2.avif",
		chips: ["In từ 10 cái", "Thiết kế chỉn chu"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"Thẻ Cảm Ơn Tinh Tế",
			"Gift Card Sang Trọng",
			"In Nhanh Từ 10 Cái",
			"Thiết Kế Độc Quyền",
		],
		stats: [
			{ value: "50.000", unit: "+", label: "Thẻ đã in" },
			{ value: "500", unit: "+", label: "Shop tin dùng" },
			{ value: "100", unit: "%", label: "Sự hài lòng" },
			{ value: "2-3", unit: "ngày", label: "Sản xuất nhanh" },
		],
	},
	introduction: {
		eyebrow: "Gắn kết khách hàng",
		title: "Trao gửi lời cảm ơn",
		description:
			"Một chiếc thank card nhỏ bé đi kèm đơn hàng không chỉ là lời tri ân, mà còn là cách tinh tế để thương hiệu ghi dấu ấn trong lòng khách hàng.",
		bullets: [
			"Thank card và gift card giúp tăng trải nghiệm khách hàng, tạo cảm giác chuyên nghiệp and chỉn chu cho thương hiệu.",
			"Gia tăng nhận diện thương hiệu qua logo, màu sắc, chất liệu and thông điệp trên mỗi tấm thẻ.",
			"Dễ kết hợp với đơn hàng, bộ quà tặng, set sản phẩm hoặc campaign theo mùa.",
			"Sản xuất tại xưởng INUT Design Đà Nẵng, tối thiểu từ 10 cái, thời gian hoàn thiện 3–4 ngày làm việc.",
		],
		highlights: [
			{
				title: "Tăng trải nghiệm khách hàng",
				description:
					"Một chiếc thẻ cảm ơn hoặc quà tặng đi kèm đơn hàng tạo cảm giác được trân trọng and đáng nhớ.",
				icon: <FavoriteIcon fontSize="small" />,
			},
			{
				title: "Chuyên nghiệp & chỉn chu",
				description:
					"Thiết kế đẹp, in ấn sắc nét giúp thương hiệu nổi bật hơn trong mắt khách hàng.",
				icon: <AutoAwesomeIcon fontSize="small" />,
			},
			{
				title: "Cá nhân hóa linh hoạt",
				description:
					"Tùy chỉnh nội dung, kích thước, chất liệu and phong cách theo từng chiến dịch hoặc bộ sưu tập.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Chi phí hợp lý, hiệu quả cao",
				description:
					"Sản phẩm nhỏ gọn nhưng tạo cảm xúc mạnh, hỗ trợ tốt cho marketing and chăm sóc khách hàng.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Dòng thẻ phổ biến",
		title: "Quy cách thẻ",
		description: "Đa dạng các loại thẻ lưu niệm cho mọi mục đích tặng quà.",
		items: [
			{
				name: "Thank card",
				description: "Kẹp đơn hàng online.",
				image: "/services/an-pham-luu-niem/thank-card-gift-card/4.avif",
			},
			{
				name: "Gift card",
				description: "Thẻ quà tặng, voucher.",
				image: "/services/an-pham-luu-niem/thank-card-gift-card/2.avif",
			},
			{
				name: "Thẻ dịp lễ",
				description: "Sinh nhật, khai trương.",
				image: "/services/an-pham-luu-niem/thank-card-gift-card/7.avif",
			},
			{
				name: "Thẻ thương hiệu",
				description: "Dành cho Spa, Café, Studio.",
				image: "/services/an-pham-luu-niem/thank-card-gift-card/8.avif",
			},
		],
	},
	whyInut: {
		eyebrow: "Sự tinh tế",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Món quà nhỏ mang thông điệp lớn cho thương hiệu của bạn.",
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
					description: "Đặt in từ 10 cái.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn thiết kế",
					description: "Hỗ trợ layout theo concept.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Thẻ lưu niệm giúp tăng điểm chạm khách hàng.",
			items: [
				{
					title: "Shop online",
					description: "Tăng trải nghiệm unboxing.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Quà tặng",
					description: "Voucher, thẻ ưu đãi.",
					icon: <LocalOfferIcon fontSize="small" />,
				},
				{
					title: "Marketing",
					description: "Gia tăng nhận diện thương hiệu.",
					icon: <RocketLaunchIcon fontSize="small" />,
				},
				{
					title: "Doanh nghiệp",
					description: "Tri ân đối tác, khách hàng.",
					icon: <CardGiftcardIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Giấy chất lượng, in sắc nét, thiết kế tinh tế.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Phản hồi từ khách",
		title: "Lan tỏa <em>niềm vui</em>",
		items: [
			{
				name: "Chị Lan Phương",
				role: "Chủ shop phụ kiện",
				text: "Thank card in ở INUT rất xinh, giấy mỹ thuật sờ thích tay. Khách nhận đơn hàng xong đều khen thẻ cảm ơn chu đáo.",
				initials: "LP",
				color: "#e91e63",
			},
			{
				name: "Anh Tuấn Anh",
				role: "Manager Cafe",
				text: "Voucher in sắc nét, thiết kế đồng bộ với quán. Rất hài lòng với sự tư vấn nhiệt tình của team.",
				initials: "TA",
				color: "#795548",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 500+ shop online",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để nhận báo giá in thank card, gift card nhanh nhất.",
		type: "thank-card-gift-card",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Mẫu thẻ thực tế",
		title: "Thư viện dự án",
		images: Array.from({ length: 8 }).map(
			(_, index) => `/services/an-pham-luu-niem/thank-card-gift-card/${index + 1}.avif`
		),
		filters: [],
	},
};

export const IN_POSTCARD_DATA: ProductPageData = {
	id: "in-postcard",
	name: "In Postcard",
	category: "Sản phẩm lưu niệm",
	seo: {
		title: "In Postcard Theo Yêu Cầu Tại Đà Nẵng | INUT Design",
		description:
			"Dịch vụ in postcard (bưu thiếp) chất lượng cao tại Đà Nẵng. In ảnh kỷ niệm, postcard nghệ thuật, postcard quảng bá du lịch. Thiết kế đẹp, in sắc nét, đa dạng chất liệu.",
		url: "/services/an-pham-luu-niem/in-postcard",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Sản phẩm lưu niệm", item: "/services/an-pham-luu-niem" },
			{
				name: "In Postcard",
				item: "/services/an-pham-luu-niem/in-postcard",
			},
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Postcard",
			serviceType: "In ấn phẩm lưu niệm",
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
				price: "5000",
				priceCurrency: "VND",
			},
		},
	},
	hero: {
		title: "In Postcard Theo Yêu Cầu",
		description:
			"Gói ghém kỷ niệm và thông điệp qua những tấm postcard in ấn tinh tế: từ ảnh du lịch đến quà tặng thương hiệu đầy cảm xúc.",
		image: `/services/an-pham-luu-niem/in-postcard/1.avif`,
		chips: ["In sắc nét", "Chất liệu cao cấp"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"Postcard Nghệ Thuật",
			"In Ảnh Kỷ Niệm",
			"Chất Liệu Giấy Mỹ Thuật",
			"Thiết Kế Độc Bản",
		],
		stats: [
			{ value: "5.000", unit: "+", label: "Postcard đã in" },
			{ value: "100", unit: "+", label: "Artist hợp tác" },
			{ value: "5.0", unit: "★", label: "Chất lượng màu in" },
			{ value: "3-4", unit: "ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Cầu nối cảm xúc",
		title: "Gói ghém những chân tình",
		description:
			"Mỗi tấm postcard là một sứ giả của cảm xúc. Tại INUT, chúng tôi biến những khung hình and thông điệp của bạn thành những ấn phẩm lưu niệm tinh tế.",
		bullets: [
			"Postcard là cầu nối cảm xúc tuyệt vời giữa người gửi and người nhận qua những hình ảnh and dòng chữ viết tay.",
			"Sử dụng công nghệ in kỹ thuật số hiện đại, đảm bảo màu sắc trung thực and chi tiết hình ảnh sắc nét.",
			"Đa dạng lựa chọn chất liệu giấy từ giấy Couche mịn, giấy mỹ thuật có vân đến giấy Kraft mộc mạc.",
			"Hỗ trợ in số lượng linh hoạt, phù hợp cho cá nhân, họa sĩ, nhiếp ảnh gia and doanh nghiệp du lịch.",
			"Sản xuất nhanh chóng tại Đà Nẵng, hỗ trợ kiểm tra file and tư vấn quy cách thành phẩm.",
		],
		highlights: [
			{
				title: "Postcard nghệ thuật",
				description:
					"In tranh vẽ, minh họa hoặc thiết kế sáng tạo của các nghệ sĩ and local brand. Thể hiện trọn vẹn phong cách cá nhân.",
				icon: <AutoAwesomeIcon fontSize="small" />,
			},
			{
				title: "Postcard du lịch",
				description:
					"Lưu giữ những phong cảnh đẹp, khoảnh khắc đáng nhớ của các điểm đến. Món quà lưu niệm ý nghĩa cho du khách.",
				icon: <PhotoAlbumIcon fontSize="small" />,
			},
			{
				title: "Chất liệu giấy tuyển chọn",
				description:
					"Giấy mỹ thuật định lượng cao giúp postcard cứng cáp, sang trọng and bám mực in hoàn hảo.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Thiết kế hai mặt",
				description:
					"Mặt trước in hình ảnh ấn tượng, mặt sau chừa khoảng trống viết tay and dán tem theo quy chuẩn.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Chất liệu giấy",
		title: "Các dòng Postcard",
		description: "Lựa chọn chất liệu giấy phù hợp với phong cách thiết kế.",
		items: [
			{
				name: "Giấy mỹ thuật",
				description: "Sang trọng, có vân đặc biệt.",
				image: "/services/an-pham-luu-niem/in-postcard/giay-mi-thuat.avif",
			},
			{
				name: "Giấy Couche",
				description: "Bề mặt phẳng mịn, in ảnh nét.",
				image: "/services/an-pham-luu-niem/in-postcard/couche.avif",
			},
			{
				name: "Giấy Kraft",
				description: "Phong cách vintage, mộc mạc.",
				image: "/services/an-pham-luu-niem/in-postcard/kraft.avif",
			},
		],
	},
	whyInut: {
		eyebrow: "Giá trị nghệ thuật",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Postcard in ấn sắc nét, chất liệu giấy tuyển chọn.",
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
					description: "Hỗ trợ in từ 10 tấm.",
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
			description: "Postcard là món quà lưu niệm tinh tế.",
			items: [
				{
					title: "Quà lưu niệm",
					description: "Lưu giữ kỷ niệm điểm đến.",
					icon: <FavoriteIcon fontSize="small" />,
				},
				{
					title: "Sáng tạo",
					description: "In ấn tác phẩm nghệ thuật.",
					icon: <AutoAwesomeIcon fontSize="small" />,
				},
				{
					title: "Marketing",
					description: "Quà tặng khách lưu trú.",
					icon: <RocketLaunchIcon fontSize="small" />,
				},
				{
					title: "Sự kiện",
					description: "Thiệp mời, quà check-in.",
					icon: <BoltIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Màu sắc trung thực, giấy dày dặn, sang trọng.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Ý kiến Artist",
		title: "Đồng hành cùng <em>sáng tạo</em>",
		items: [
			{
				name: "Họa sĩ Thu Vân",
				role: "Freelance Artist",
				text: "In postcard ở INUT màu lên rất rực and đúng tone mình vẽ. Giấy mỹ thuật 300gsm rất cứng cáp, khách mua tranh đều khen chất lượng bưu thiếp.",
				initials: "TV",
				color: "#673ab7",
			},
			{
				name: "Lê Minh",
				role: "Nhiếp ảnh gia du lịch",
				text: "Rất ưng ý với cách team tư vấn chọn giấy. Postcard in ảnh phong cảnh Đà Nẵng bán rất chạy tại các shop lưu niệm.",
				initials: "LM",
				color: "#009688",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 100+ nghệ sĩ",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để được tư vấn chất liệu giấy and báo giá tốt nhất.",
		type: "in-postcard",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án nghệ thuật",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 5 }).map(
			(_, index) => `/services/an-pham-luu-niem/in-postcard/${index + 1}.avif`
		),
		filters: [],
	},
};

export const MOC_KHOA_MICA_DATA: ProductPageData = {
	id: "moc-khoa-mica",
	name: "Móc Khóa Mica",
	category: "Sản phẩm lưu niệm",
	seo: {
		title: "Làm Móc Khóa Mica In Hình Theo Yêu Cầu | INUT Design Đà Nẵng",
		description:
			"Móc khóa mica in 2 mặt sắc nét, cắt laser theo hình dáng bất kỳ. Mica trong suốt, bền đẹp. Giao 3-5 ngày, đặt từ số lượng ít. Quà tặng xinh xắn cho idol, team, brand.",
		url: "https://inutdesign.com/services/an-pham-luu-niem/moc-khoa-mica",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Sản phẩm lưu niệm", item: "/services/an-pham-luu-niem" },
			{ name: "Móc Khóa Mica", item: "/services/an-pham-luu-niem/moc-khoa-mica" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "Làm Móc Khóa Mica",
			serviceType: "In ấn phẩm lưu niệm",
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
		title: "Móc Khóa Mica In Hình",
		description:
			"In 2 mặt sắc nét, cắt laser theo ý bạn. Mica trong suốt — bền đẹp từ móc khóa idol đến quà tặng brand.",
		image: `/services/an-pham-luu-niem/moc-khoa-mica/1.avif`,
		chips: ["Mica trong suốt", "Cắt laser die-cut"],
		ctaLabel: "Báo giá ngay",
		secondaryCtaLabel: "Xem mẫu thực tế",
		ticker: ["In UV Sắc Nét 2 Mặt", "Cắt Laser Mọi Hình Dáng", "Mica Chống Nước", "Giao 3-5 Ngày"],
		stats: [
			{ value: "15.000", unit: "+", label: "Móc khóa đã giao" },
			{ value: "200", unit: "+", label: "Fandom & team" },
			{ value: "100", unit: "%", label: "Mica" },
			{ value: "3-5", unit: "ngày", label: "Giao hàng" },
		],
	},
	introduction: {
		eyebrow: "In hình theo yêu cầu",
		title: "Xinh xắn, bền, *cầm tay* mỗi ngày",
		description:
			"Móc khóa mica — món quà nhỏ xinh mang theo hình ảnh yêu thích hoặc logo brand đi khắp nơi. Bền, đẹp, giá hợp lý.",
		bullets: [
			"Mica trong suốt cao cấp — cứng cáp, không ố vàng, chống nước hoàn toàn.",
			"In UV 2 mặt siêu sắc nét — màu sắc bền đẹp, không phai theo thời gian.",
			"Cắt laser die-cut theo mọi hình dáng — tròn, vuông, hình nhân vật, logo phức tạp đều ok.",
			"Khoen khóa inox chắc chắn — đa dạng kiểu móc, xích, dây da tùy chọn.",
			"Đặt từ số lượng ít — phù hợp cả cá nhân lẫn doanh nghiệp, fandom, team.",
		],
		highlights: [
			{
				title: "Bền vượt mọi test",
				description:
					"Chống nước 100%, chịu va đập, hình ảnh giữ nguyên độ sắc nét dù dùng hằng ngày.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Cắt hình gì cũng được",
				description:
					"Laser cắt chuẩn xác đến từng chi tiết nhỏ — chibi, logo, chữ viết đều mượt mà.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "In 2 mặt không lo phai",
				description:
					"Công nghệ in UV trực tiếp lên mica — màu đậm, sắc nét, nhìn từ mặt nào cũng đẹp.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Quà tặng vừa xinh vừa ý nghĩa",
				description: "Giá mềm, giá trị cao — món quà nhỏ mà để lại ấn tượng lớn.",
				icon: <FavoriteIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Kiểu móc khóa",
		title: "Chọn style phù hợp",
		description: "3 dạng phổ biến nhất — tùy mục đích sử dụng mà chọn.",
		items: [
			{
				name: "Móc khóa in 2 mặt",
				description: "Hình ảnh được bảo vệ giữa 2 lớp mica trong suốt.",
				image: "/services/an-pham-luu-niem/moc-khoa-mica/22.avif",
			},
			{
				name: "Móc khóa cắt hình",
				description: "Cắt theo viền nhân vật, logo — không có nền thừa.",
				image: "/services/an-pham-luu-niem/moc-khoa-mica/16.avif",
			},
			{
				name: "Móc khóa quà tặng brand",
				description: "In logo công ty — tặng kèm đơn hàng, sự kiện.",
				image: "/services/an-pham-luu-niem/moc-khoa-mica/14.avif",
			},
		],
	},
	whyInut: {
		eyebrow: "Vì sao chọn INUT",
		title: "In đẹp, cắt chuẩn, *giao nhanh*",
		description: "Mica xịn, in sắc nét, khoen khóa chắc chắn — đơn giản vậy thôi.",
		productionProcess: {
			title: "Quy trình rõ ràng",
			items: [
				{
					title: "Giao 3-5 ngày",
					description: "Kể từ khi file duyệt xong.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đặt từ số lượng ít",
					description: "10 cái cũng làm, 1000 cái cũng ok.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Hỗ trợ thiết kế free",
					description: "Vẽ cutline, chỉnh màu, tư vấn kích thước.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ai cũng xài được",
			description: "Từ fan hâm mộ đến doanh nghiệp — móc khóa mica fit mọi mục đích.",
			items: [
				{
					title: "Quà tặng cá nhân",
					description: "In hình idol, ảnh gia đình, thú cưng.",
					icon: <FavoriteIcon fontSize="small" />,
				},
				{
					title: "Quà tặng brand",
					description: "Tặng kèm đơn hàng, quà tri ân khách.",
					icon: <RocketLaunchIcon fontSize="small" />,
				},
				{
					title: "Lưu niệm sự kiện",
					description: "Hội nghị, workshop, du lịch, lễ hội.",
					icon: <PhotoAlbumIcon fontSize="small" />,
				},
				{
					title: "Team & fandom",
					description: "CLB, lớp học, công ty, nhóm bạn.",
					icon: <BoltIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết rõ ràng",
			description: "Mica trong suốt 100%. In sắc nét. Cắt laser mượt. Giao đúng hẹn.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Khách nói gì",
		title: "Móc khóa *xinh xắn*, bền bỉ",
		items: [
			{
				name: "Hoàng Yến",
				role: "Fanclub manager",
				text: "Đặt móc khóa in hình idol cho nhóm, các bạn đều khen mica trong and hình in rất rõ. Đường cắt laser mượt, không bị sắc cạnh. Sẽ đặt thêm lần sau!",
				initials: "HY",
				color: "#ffc107",
			},
			{
				name: "Quốc Bảo",
				role: "Chủ cửa hàng xe máy",
				text: "Làm móc khóa logo tặng khách mua xe. Mica dày dặn, dùng lâu không thấy bị trầy nhiều. Khách nhận được đều thích, giá lại mềm.",
				initials: "QB",
				color: "#212121",
			},
		],
		score: "5.0★",
		countText: "200+ team & fandom đã tin dùng",
	},
	contact: {
		eyebrow: "Inbox ngay",
		description: "Gửi file thiết kế — báo giá trong 15 phút. Không cần đặt cọc.",
		type: "moc-khoa-mica",
		address: "K574/5 Ông Ích Khiêm, Hải Châu, Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Sales", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Mẫu thực tế",
		title: "Móc khóa đã *giao tận tay* khách",
		images: Array.from({ length: 26 }).map(
			(_, index) => `/services/an-pham-luu-niem/moc-khoa-mica/${index + 1}.avif`
		),
		filters: [],
	},
};

export const PIN_CAI_AO_MICA_DATA: ProductPageData = {
	id: "pin-cai-ao-mica",
	name: "Pin Cài Áo Mica",
	category: "Sản phẩm lưu niệm",
	seo: {
		title: "In Pin Cài Áo Mica Theo Yêu Cầu Tại Đà Nẵng | INUT Design",
		description:
			"In pin cài áo mica (acrylic badge) UV sắc nét, cắt laser chuẩn từng đường — giao 3–4 ngày. Phụ kiện fan merch, sự kiện, local brand. Đặt từ 10 cái, báo giá trong 15 phút.",
		url: "https://inutdesign.com/services/an-pham-luu-niem/pin-cai-ao-mica",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Sản phẩm lưu niệm", item: "/services/an-pham-luu-niem" },
			{ name: "Pin Cài Áo Mica", item: "/services/an-pham-luu-niem/pin-cai-ao-mica" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Pin Cài Áo Mica",
			serviceType: "In ấn phẩm lưu niệm",
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
				price: "10000",
				priceCurrency: "VND",
			},
		},
	},
	hero: {
		title: "Pin Cài Áo Mica",
		description:
			"Nhỏ gọn. Bắt mắt. Nói lên cá tính — không cần một câu chú thích nào. Pin cài áo mica in UV theo yêu cầu, cắt laser sắc cạnh, gắn kim cài chắc tay.",
		image: `/services/an-pham-luu-niem/pin-cai-ao-mica/1.avif`,
		chips: ["In UV bền màu", "Cắt laser chuẩn xác"],
		ctaLabel: "Báo giá trong 15 phút",
		secondaryCtaLabel: "Xem portfolio",
		ticker: ["Acrylic Badge", "Fan Merch Chuẩn Chỉnh", "In UV Rực Rỡ", "Đặt Từ 10 Cái"],
		stats: [
			{ value: "8.000", unit: "+", label: "Pin đã sản xuất" },
			{ value: "50", unit: "+", label: "Local brand hợp tác" },
			{ value: "100", unit: "%", label: "QC từng sản phẩm" },
			{ value: "3–4", unit: "ngày", label: "Giao nhanh tại Đà Nẵng" },
		],
	},
	introduction: {
		eyebrow: "Acrylic Badge",
		title: "Nhỏ bằng lòng bàn tay — *ấn tượng* không kém gì poster",
		description:
			"Pin cài áo mica là phụ kiện cá nhân hóa đang được chọn bởi fan club, local brand và doanh nghiệp trẻ. In UV trực tiếp lên mica trong — màu ra đúng file, không ố, không bong.",
		bullets: [
			"In UV trực tiếp lên mặt mica — màu sắc trung thực, sắc nét đến từng chi tiết nhỏ.",
			"Cắt laser theo đúng cutline — tròn, vuông, bo góc hay die-cut tự do đều làm được.",
			"Kim cài inox chắc tay, không rỉ sét, cố định tốt trên vải dày.",
			"Đặt từ 10 cái — phù hợp cá nhân lẫn doanh nghiệp nhỏ.",
			"Hỗ trợ kiểm tra file, white ink layer và chuẩn hóa cutline miễn phí trước khi in.",
		],
		highlights: [
			{
				title: "Pin mica là gì?",
				description:
					"Tấm acrylic trong suốt in UV trực tiếp — cho màu rực, độ bền cao hơn in decal dán thông thường.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Hình dáng không giới hạn",
				description:
					"Cắt laser theo đúng cutline thiết kế — tròn, bo góc, die-cut bất kỳ form nào.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Quy trình 4 bước",
				description:
					"Kiểm tra file → In UV → Cắt laser → Gắn kim cài & QC — mỗi cái đều qua tay trước khi đóng gói.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Dùng để làm gì?",
				description:
					"Fan merch, quà tặng sự kiện, phụ kiện thời trang, nhận diện thương hiệu — một sản phẩm, nhiều mục đích.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Ứng dụng thực tế",
		title: "Pin mica — dùng được ở *đâu cũng đẹp*",
		description: "Từ fan club đến local brand — pin mica chạy tốt trong mọi chiến dịch.",
		items: [
			{
				name: "Fan Club & Merch",
				description: "Goods theo artwork, sản xuất theo set.",
				image: HERO_IMAGE,
			},
			{
				name: "Doanh nghiệp & Sự kiện",
				description: "Pin nhận diện nhân sự, check-in event.",
				image: HERO_IMAGE,
			},
			{
				name: "Shop Thời Trang",
				description: "Phụ kiện cài túi, tăng giá trị đơn hàng.",
				image: HERO_IMAGE,
			},
			{
				name: "Artist & Creator",
				description: "Bán pin theo bộ sưu tập cá nhân.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Cam kết từ xưởng in",
		title: "Vì sao chọn INUT để in pin mica?",
		description:
			"In UV chuẩn màu, cắt laser sắc cạnh, gắn kim chắc — kiểm tra từng cái trước khi giao.",
		productionProcess: {
			title: "Sản xuất nhanh — không cần chờ lâu",
			items: [
				{
					title: "Giao trong 3–5 ngày",
					description: "Tính từ lúc duyệt file in.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đặt từ 10 cái",
					description: "Không ép số lượng lớn.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Hỗ trợ kỹ thuật file",
					description: "Check cutline, white ink, bleed miễn phí.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Một sản phẩm — nhiều chiến dịch",
			description: "Pin mica nhỏ nhưng làm được việc lớn trong truyền thông và branding.",
			items: [
				{
					title: "Sự kiện",
					description: "Vật phẩm check-in, tặng kèm ticket.",
					icon: <EventAvailableIcon fontSize="small" />,
				},
				{
					title: "Fan Merch",
					description: "Goods sưu tầm cho fandom, bán theo set.",
					icon: <AutoAwesomeIcon fontSize="small" />,
				},
				{
					title: "Thời trang",
					description: "Điểm nhấn cá tính trên balo, túi canvas.",
					icon: <FavoriteIcon fontSize="small" />,
				},
				{
					title: "Branding",
					description: "Tiếp cận khách hàng trẻ theo cách không ai ngờ.",
					icon: <RocketLaunchIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Màu UV đúng file, mica không trầy, kim cài không rơi — hoặc INUT làm lại.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Khách hàng nói gì",
		title: "Nhỏ thôi — nhưng *không ai bỏ qua*",
		items: [
			{
				name: "Thùy Linh",
				role: "Owner · Local Brand thời trang",
				text: "Màu UV ra rực, cắt cạnh sắc — tặng kèm đơn hàng là khách lập tức đăng story. Đặt đợt hai ngay sau khi nhận hàng đợt một.",
				initials: "TL",
				color: "#6200ea",
			},
			{
				name: "Duy Mạnh",
				role: "Event Manager",
				text: "Kim cài chắc, cả ngày ngoài trời không rơi một cái. Quan trọng hơn là giao đúng hạn — sự kiện không chờ được.",
				initials: "DM",
				color: "#c62828",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 50+ brand đã hợp tác",
	},
	contact: {
		eyebrow: "Đặt hàng ngay",
		description:
			"Inbox mô tả ý tưởng — INUT báo giá trong 15 phút, không cần đặt cọc để nhận tư vấn.",
		type: "pin-cai-ao-mica",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Sản phẩm thực tế",
		title: "Mẫu pin đã sản xuất",
		images: Array.from({ length: 5 }).map(
			(_, index) => `/services/an-pham-luu-niem/pin-cai-ao-mica/${index + 1}.avif`
		),
		filters: [],
	},
};

export const ACRYLIC_MAGNET_DATA: ProductPageData = {
	id: "acrylic-magnet",
	name: "Acrylic Magnet",
	category: "Sản phẩm lưu niệm",
	seo: {
		title: "Làm Acrylic Magnet Theo Yêu Cầu Tại Đà Nẵng | INUT Design",
		description:
			"Dịch vụ làm nam châm mica (acrylic magnet) in hình theo yêu cầu. In UV sắc nét, cắt laser die cut linh hoạt, nam châm lực hút mạnh. Quà tặng merchandise cao cấp.",
		url: "https://inutdesign.com/services/an-pham-luu-niem/acrylic-magnet",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Sản phẩm lưu niệm", item: "/services/an-pham-luu-niem" },
			{ name: "Acrylic Magnet", item: "/services/an-pham-luu-niem/acrylic-magnet" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "Làm Acrylic Magnet",
			serviceType: "In ấn phẩm lưu niệm",
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
				price: "20000",
				priceCurrency: "VND",
			},
		},
	},
	hero: {
		title: "Acrylic Magnet",
		description:
			"Nâng tầm vật phẩm lưu niệm với nam châm mica cao cấp: bề mặt bóng gương sang trọng and in UV bền màu.",
		image: HERO_IMAGE,
		chips: ["Bề mặt bóng gương", "Nam châm mạnh"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem portfolio",
		ticker: ["Acrylic Magnet", "Nam Châm Mica", "In UV Mặt Sau", "Quà Tặng Cao Cấp"],
		stats: [
			{ value: "3.000", unit: "+", label: "Magnet đã làm" },
			{ value: "80", unit: "+", label: "Nghệ sĩ hợp tác" },
			{ value: "5.0", unit: "★", label: "Độ bóng bề mặt" },
			{ value: "3-5", unit: "ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Nam châm cao cấp",
		title: "Sang trọng and bền bỉ",
		description:
			"Acrylic Magnet là sự kết hợp hoàn hảo giữa tính thẩm mỹ của mica bóng gương and sự tiện dụng của nam châm vĩnh cửu, tạo nên vật lưu niệm đẳng cấp.",
		bullets: [
			"Acrylic Magnet là dòng nam châm mica cao cấp, nổi bật nhờ bề mặt bóng đẹp and độ bền vượt trội.",
			"Phù hợp cho fanart, merchandise, quà tặng doanh nghiệp and các chiến dịch marketing cần điểm chạm thương hiệu.",
			"Gia công theo hình tự do (die cut), cá nhân hóa không giới hạn theo logo, nhân vật hoặc artwork riêng.",
			"Sản xuất tại xưởng INUT Design Đà Nẵng, tối thiểu từ 10 cái, thời gian hoàn thiện 3–4 ngày làm việc.",
		],
		highlights: [
			{
				title: "Bền bỉ vượt trội",
				description:
					"Acrylic dày 3–5mm kết hợp in UV cho độ bền màu cao, chống nước and chống tia UV.",
				icon: <ShieldIcon fontSize="small" />,
			},
			{
				title: "Thẩm mỹ sang trọng",
				description:
					"Lớp mica trong tạo chiều sâu tự nhiên, giúp sản phẩm trông như một tác phẩm nghệ thuật thu nhỏ.",
				icon: <AutoAwesomeIcon fontSize="small" />,
			},
			{
				title: "Cá nhân hóa linh hoạt",
				description:
					"Hỗ trợ in theo mọi ý tưởng: logo, nhân vật, ảnh cá nhân, artwork and cắt CNC theo đường cutline riêng.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Ứng dụng thương mại cao",
				description:
					"Tăng nhận diện thương hiệu qua quà tặng kèm đơn hàng, merchandise hoặc quà doanh nghiệp.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Lĩnh vực ứng dụng",
		title: "Quy cách Magnet",
		description: "Lựa chọn hình thức hiển thị cho nam châm mica của bạn.",
		items: [
			{
				name: "Artist merch",
				description: "Sản xuất fanart die cut tự do.",
				image: "/branding/services/sticker.avif",
			},
			{
				name: "Quà thương hiệu",
				description: "Tăng ghi nhớ trong đời sống.",
				image: "/branding/services/nhan-chai-san-pham.avif",
			},
			{
				name: "Sự kiện",
				description: "Quà lưu niệm cho fanmeeting.",
				image: "/branding/services/thiet-ke-in-an.avif",
			},
			{
				name: "Doanh nghiệp",
				description: "Branding tủ lạnh văn phòng.",
				image: "/branding/services/skin-laptop.avif",
			},
		],
	},
	whyInut: {
		eyebrow: "Chất lượng hoàn thiện",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Acrylic magnet bóng gương sang trọng, nam châm lực hút mạnh.",
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
					description: "Đặt làm từ 10 cái.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn kỹ thuật",
					description: "Hỗ trợ file in ngược mặt sau.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Nam châm mica là vật phẩm sưu tầm cao cấp.",
			items: [
				{
					title: "Artist & Creator",
					description: "Biến artwork thành merchandise.",
					icon: <AutoAwesomeIcon fontSize="small" />,
				},
				{
					title: "Local Brand",
					description: "Quà tặng tri ân khách hàng.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Du lịch",
					description: "In hình ảnh địa danh lưu niệm.",
					icon: <PhotoAlbumIcon fontSize="small" />,
				},
				{
					title: "Sự kiện",
					description: "Vật phẩm nhỏ gọn, tinh tế.",
					icon: <EventAvailableIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "In UV sắc nét, nam châm vĩnh cửu hút mạnh.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Phản hồi Artist",
		title: "Đẳng cấp <em>Merchandise</em>",
		items: [
			{
				name: "Minh Anh",
				role: "Digital Artist",
				text: "Magnet in UV ngược mặt sau nên hình ảnh được bảo vệ tuyệt đối bởi lớp mica dày, nhìn rất trong and sang trọng. Cảm ơn xưởng!",
				initials: "MA",
				color: "#00bcd4",
			},
			{
				name: "Team Marketing",
				role: "F&B Brand",
				text: "Lực hút nam châm rất mạnh, không bị rơi khi đóng mở cửa tủ lạnh. Một món quà tặng brand rất hiệu quả and bền bỉ.",
				initials: "TM",
				color: "#4caf50",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 80+ đối tác sáng tạo",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để được tư vấn mẫu acrylic magnet and nhận báo giá nhanh nhất.",
		type: "acrylic-magnet",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Mẫu Magnet thực tế",
		title: "Thư viện dự án",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: [],
	},
};

export const IN_ANH_DATA: ProductPageData = {
	id: "in-anh-da-nang",
	name: "In ảnh kỹ thuật số",
	category: "In ảnh",
	seo: {
		title: "In ảnh kỹ thuật số theo yêu cầu tại Đà Nẵng - INUT Design",
		description:
			"Dịch vụ in ảnh kỹ thuật số theo yêu cầu tại Đà Nẵng, INUT Design: in nhanh, màu sắc trung thực, đa dạng kích thước và số lượng linh hoạt cho cá nhân, sự kiện and kinh doanh.",
		url: "https://inutdesign.com/services/an-pham-luu-niem/in-anh-da-nang",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "In Ảnh Kỹ Thuật Số",
		description:
			"Lưu giữ trọn vẹn từng khoảnh khắc với dịch vụ in ảnh kỹ thuật số chất lượng cao: màu sắc trung thực, độ phân giải sắc nét và thời gian hoàn thiện nhanh chóng.",
		image: `/services/an-pham-luu-niem/in-anh-da-nang/2.avif`,
		chips: ["In nhanh lấy ngay", "Màu sắc trung thực"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem portfolio",
		ticker: ["In Ảnh Lấy Ngay", "Màu Sắc Trung Thực", "Đa Dạng Kích Thước", "Chất Lượng Cao Cấp"],
		stats: [
			{ value: "20.000", unit: "+", label: "Tấm ảnh đã in" },
			{ value: "1.000", unit: "+", label: "Khách hàng cá nhân" },
			{ value: "100", unit: "%", label: "Màu sắc trung thực" },
			{ value: "15", unit: "phút", label: "In nhanh lấy ngay" },
		],
	},
	introduction: {
		eyebrow: "Lưu giữ khoảnh khắc",
		title: "Trọn vẹn từng kỷ niệm",
		description:
			"Chúng tôi hiểu rằng mỗi bức ảnh là một câu chuyện. Với công nghệ in kỹ thuật số hiện đại, INUT giúp bạn lưu giữ những khoảnh khắc ấy một cách sống động and bền bỉ nhất.",
		bullets: [
			"In ảnh nhanh, linh hoạt số lượng từ ít đến nhiều theo mục tiêu sử dụng thực tế.",
			"Màu sắc rõ ràng, bề mặt in đẹp and đồng đều giữa các bản in cùng một lô.",
			"Đa dạng quy cách thành phẩm: ảnh rời, ảnh trưng bày, ảnh sự kiện, ảnh tặng khách hàng.",
			"Tối ưu chi phí cho cá nhân, studio, shop online and doanh nghiệp tổ chức sự kiện.",
			"Đặt hàng nhanh: gửi file ảnh, số lượng and kích thước mong muốn để INUT tư vấn and triển khai.",
		],
		highlights: [
			{
				title: "In ảnh kỹ thuật số là gì?",
				description:
					"Là phương pháp in hiện đại cho chất lượng hình ảnh sắc nét, màu sắc trung thực and thời gian xử lý nhanh.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Thiết kế",
				description:
					"Hỗ trợ in ảnh chân dung, ảnh sản phẩm, ảnh sự kiện and ảnh trang trí với nhiều quy cách kích thước khác nhau.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Quy trình sản xuất",
				description:
					"Nhận file, kiểm tra màu, in kỹ thuật số and hoàn thiện thành phẩm nhanh chóng để đáp ứng đúng tiến độ.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Công năng",
				description:
					"Phù hợp cho nhu cầu cá nhân, quà tặng, trưng bày cửa hàng, truyền thông sự kiện and sản phẩm bán lẻ.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại in ảnh",
		title: "Dòng sản phẩm in ảnh",
		description: "Đa dạng các loại hình in ảnh đáp ứng mọi nhu cầu lưu giữ.",
		items: [
			{
				name: "Ảnh kỷ niệm",
				description: "Lưu giữ khoảnh khắc gia đình.",
				image: `/services/an-pham-luu-niem/in-anh-da-nang/8.avif`,
			},
			{
				name: "Ảnh sự kiện",
				description: "In nhanh cho workshop, triển lãm.",
				image: `/services/an-pham-luu-niem/in-anh-da-nang/9.avif`,
			},
			{
				name: "Ảnh trưng bày",
				description: "Phù hợp cửa hàng, studio.",
				image: `/services/an-pham-luu-niem/in-anh-da-nang/10.avif`,
			},
			{
				name: "Ảnh bán lẻ",
				description: "Bộ ảnh sản phẩm, decor.",
				image: `/services/an-pham-luu-niem/in-anh-da-nang/11.avif`,
			},
		],
		specOptions: [
			"Kích thước 10 x 15 cm phổ biến.",
			"Kích thước 13 x 18 cm cân bằng.",
			"Kích thước A4 cho ảnh trưng bày.",
		],
	},
	whyInut: {
		eyebrow: "Sự khác biệt",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Màu sắc trung thực, thời gian hoàn thiện nhanh chóng.",
		productionProcess: {
			title: "Quy trình chuyên nghiệp",
			items: [
				{
					title: "Thời gian linh hoạt",
					description: "In nhanh, lấy ngay trong ngày.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đa dạng số lượng",
					description: "Hỗ trợ in từ 1 tấm.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn kỹ thuật",
					description: "Kiểm tra chất lượng file ảnh.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Hình ảnh trực quan giúp kết nối cảm xúc.",
			items: [
				{
					title: "Cá nhân, gia đình",
					description: "Lưu giữ kỷ niệm đẹp.",
					icon: <CollectionsIcon fontSize="small" />,
				},
				{
					title: "Sự kiện",
					description: "Truyền tải thông điệp trực quan.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Trưng bày",
					description: "Tăng điểm nhấn không gian.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Sản phẩm",
					description: "Gia tăng giá trị đơn hàng.",
					icon: <WorkspacePremiumIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Màu sắc bền đẹp, không phai theo thời gian.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Khách hàng chia sẻ",
		title: "Cảm nhận về <em>chất lượng</em>",
		items: [
			{
				name: "Chị Minh Thư",
				role: "Khách hàng cá nhân",
				text: "In ảnh ở đây màu rất tươi and thực, giấy dày dặn. In nhanh nên mình lấy luôn trong ngày để kịp làm quà tặng.",
				initials: "MT",
				color: "#ff4081",
			},
			{
				name: "Anh Tuấn",
				role: "Photographer tự do",
				text: "Chất lượng in kỹ thuật số tại INUT rất ổn định. Màu sắc bản in gần như tương đồng với file mình chỉnh sửa trên máy.",
				initials: "AT",
				color: "#2196f3",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 1.000+ khách hàng",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để nhận báo giá in ảnh kỹ thuật số nhanh nhất.",
		type: "in-anh",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án tiêu biểu",
		title: "Hình ảnh thực tế",
		images: [
			`/services/an-pham-luu-niem/in-anh-da-nang/2.avif`,
			`/services/an-pham-luu-niem/in-anh-da-nang/1.avif`,
			`/services/an-pham-luu-niem/in-anh-da-nang/3.avif`,
			`/services/an-pham-luu-niem/in-anh-da-nang/4.avif`,
			`/services/an-pham-luu-niem/in-anh-da-nang/5.avif`,
			`/services/an-pham-luu-niem/in-anh-da-nang/6.avif`,
			`/services/an-pham-luu-niem/in-anh-da-nang/7.avif`,
			`/services/an-pham-luu-niem/in-anh-da-nang/8.avif`,
			`/services/an-pham-luu-niem/in-anh-da-nang/9.avif`,
			`/services/an-pham-luu-niem/in-anh-da-nang/11.avif`,
		],
		filters: [],
	},
};
