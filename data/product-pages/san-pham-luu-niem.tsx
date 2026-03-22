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
const HERO_IMAGE = "/branding/logo.webp";

export const THANK_CARD_DATA: ProductPageData = {
	id: "thank-card-gift-card",
	name: "Thank Card & Gift Card",
	category: "Sản phẩm lưu niệm",
	seo: {
		title: "In Thank Card, Gift Card Tại Đà Nẵng — Nâng Tầm Thương Hiệu | INUT Design",
		description:
			"Dịch vụ in thank card, gift card tại Đà Nẵng: thiết kế đẹp, đa dạng chất liệu, giá cạnh tranh, sản xuất nhanh từ 10 cái tại INUT Design.",
		url: "https://inutdesign.com/services/an-pham-luu-niem/thank-card-gift-card",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Thank Card & Gift Card",
		description:
			"Tạo điểm nhấn tinh tế và gắn kết khách hàng với dịch vụ in thank card, gift card chuyên nghiệp: thiết kế chỉn chu và in ấn sắc nét.",
		image: HERO_IMAGE,
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
				image: "/branding/services/sticker.avif",
			},
			{
				name: "Gift card",
				description: "Thẻ quà tặng, voucher.",
				image: "/branding/services/nhan-chai-san-pham.avif",
			},
			{
				name: "Thẻ dịp lễ",
				description: "Sinh nhật, khai trương.",
				image: "/branding/services/thiet-ke-in-an.avif",
			},
			{
				name: "Thẻ thương hiệu",
				description: "Dành cho Spa, Café, Studio.",
				image: "/branding/services/skin-laptop.avif",
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
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Mẫu thẻ thực tế",
		title: "Thư viện dự án",
		images: Array.from({ length: 8 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Thank card", "Gift card", "Voucher"],
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
		url: "https://inutdesign.com/services/an-pham-luu-niem/in-postcard",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "In Postcard Theo Yêu Cầu",
		description:
			"Gói ghém kỷ niệm và thông điệp qua những tấm postcard in ấn tinh tế: từ ảnh du lịch đến quà tặng thương hiệu đầy cảm xúc.",
		image: HERO_IMAGE,
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
				image: "/branding/services/thiet-ke-in-an.avif",
			},
			{
				name: "Giấy Couche",
				description: "Bề mặt phẳng mịn, in ảnh nét.",
				image: "/branding/services/sticker.avif",
			},
			{
				name: "Giấy Kraft",
				description: "Phong cách vintage, mộc mạc.",
				image: "/branding/services/skin-laptop.avif",
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
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án nghệ thuật",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 9 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Nghệ thuật", "Du lịch", "Quà tặng"],
	},
};

export const MOC_KHOA_MICA_DATA: ProductPageData = {
	id: "moc-khoa-mica",
	name: "Móc Khóa Mica",
	category: "Sản phẩm lưu niệm",
	seo: {
		title: "Làm Móc Khóa Mica Theo Yêu Cầu Tại Đà Nẵng | INUT Design",
		description:
			"Dịch vụ làm móc khóa mica in hình theo yêu cầu. Chất liệu mica trong suốt, in 2 mặt sắc nét, cắt laser hình dáng linh hoạt. Quà tặng doanh nghiệp, quà tặng cá nhân ý nghĩa.",
		url: "https://inutdesign.com/services/an-pham-luu-niem/moc-khoa-mica",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Móc Khóa Mica Custom",
		description:
			"Biến ý tưởng thành vật phẩm cầm tay xinh xắn với dịch vụ làm móc khóa mica theo yêu cầu: in hình sắc nét, cắt laser chuẩn xác.",
		image: HERO_IMAGE,
		chips: ["In 2 mặt sắc nét", "Cắt laser linh hoạt"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"Móc Khóa Mica In Hình",
			"Cắt Laser Die-cut",
			"Mica Đài Loan Trong Suốt",
			"In UV Sắc Nét",
		],
		stats: [
			{ value: "15.000", unit: "+", label: "Móc khóa đã làm" },
			{ value: "200", unit: "+", label: "Fandom & Group" },
			{ value: "100", unit: "%", label: "Mica Đài Loan" },
			{ value: "3-5", unit: "ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Quà tặng cầm tay",
		title: "Xinh xắn and bền bỉ",
		description:
			"Móc khóa mica là vật lưu niệm tuyệt vời để mang theo những hình ảnh yêu thích hoặc thông điệp thương hiệu mọi lúc mọi nơi.",
		bullets: [
			"Móc khóa mica là vật phẩm quà tặng phổ biến, bền bỉ and dễ dàng cá nhân hóa hình ảnh, logo.",
			"Sử dụng chất liệu mica Đài Loan trong suốt, cứng cáp, không bị ố vàng theo thời gian.",
			"Công nghệ in kỹ thuật số trực tiếp hoặc ép ảnh giữa 2 lớp mica, đảm bảo hình ảnh không bị phai màu.",
			"Cắt laser theo mọi hình dáng yêu cầu: tròn, vuông, hình nhân vật, logo thương hiệu.",
			"Phụ kiện khoen khóa chắc chắn, đa dạng mẫu mã từ inox đến nhựa màu.",
		],
		highlights: [
			{
				title: "Độ bền vượt trội",
				description:
					"Mica chống nước hoàn toàn, chịu được va đập nhẹ and giữ hình ảnh bền đẹp trong quá trình sử dụng.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Hình dáng không giới hạn",
				description:
					"Nhờ công nghệ cắt laser chuẩn xác, chúng tôi có thể tạo ra mọi hình dáng từ đơn giản đến phức tạp.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "In ấn 2 mặt",
				description:
					"Hình ảnh hiển thị rõ nét từ cả hai phía, tăng hiệu quả thẩm mỹ and nhận diện thương hiệu.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Quà tặng ý nghĩa",
				description:
					"Chi phí thấp nhưng giá trị kỷ niệm cao, phù hợp làm quà tặng cá nhân hoặc quà tặng quảng bá thương hiệu.",
				icon: <FavoriteIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Quy cách sản xuất",
		title: "Dòng móc khóa",
		description: "Chúng tôi cung cấp đa dạng quy cách làm móc khóa mica.",
		items: [
			{
				name: "Móc khóa in 2 mặt",
				description: "Bảo vệ giữa 2 lớp mica.",
				image: "/branding/services/sticker.avif",
			},
			{
				name: "Móc khóa cắt hình",
				description: "Cắt theo viền nhân vật, logo.",
				image: "/branding/services/nhan-chai-san-pham.avif",
			},
			{
				name: "Móc khóa quà tặng",
				description: "Giải pháp quảng bá hiệu quả.",
				image: "/branding/services/thiet-ke-in-an.avif",
			},
		],
	},
	whyInut: {
		eyebrow: "Ưu điểm nổi bật",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Móc khóa mica bền đẹp, phụ kiện khoen khóa chắc chắn.",
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
					description: "Đặt làm từ số lượng ít.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn thiết kế",
					description: "Hỗ trợ vẽ cutline chuẩn xác.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Móc khóa là vật phẩm quà tặng phổ biến nhất.",
			items: [
				{
					title: "Quà tặng cá nhân",
					description: "In hình idol, gia đình, bạn bè.",
					icon: <FavoriteIcon fontSize="small" />,
				},
				{
					title: "Branding",
					description: "Quà tặng kèm đơn hàng hiệu quả.",
					icon: <RocketLaunchIcon fontSize="small" />,
				},
				{
					title: "Lưu niệm",
					description: "In địa danh, đặc sản du lịch.",
					icon: <PhotoAlbumIcon fontSize="small" />,
				},
				{
					title: "Đội nhóm",
					description: "Nhận diện CLB, lớp học, công ty.",
					icon: <BoltIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Mica trong suốt cao cấp, in sắc nét, cắt gọn.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Đánh giá từ khách",
		title: "Món quà <em>nhỏ xinh</em>",
		items: [
			{
				name: "Bạn Hoàng Yến",
				role: "Fanclub Manager",
				text: "Đặt móc khóa in hình idol cho nhóm, các bạn đều khen mica trong and hình in rất rõ. Đường cắt laser mượt, không bị sắc cạnh.",
				initials: "HY",
				color: "#ffc107",
			},
			{
				name: "Anh Quốc Bảo",
				role: "Chủ cửa hàng xe máy",
				text: "Móc khóa tặng khách hàng mua xe in logo rất chuyên nghiệp. Mica dày dặn, dùng lâu không thấy bị trầy xước nhiều.",
				initials: "QB",
				color: "#212121",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 200+ nhóm khách hàng",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để được tư vấn thiết kế and nhận báo giá tốt nhất.",
		type: "moc-khoa-mica",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án đã thực hiện",
		title: "Mẫu móc khóa thực tế",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Cá nhân", "Doanh nghiệp", "Fandom"],
	},
};

export const PIN_CAI_AO_MICA_DATA: ProductPageData = {
	id: "pin-cai-ao-mica",
	name: "Pin Cài Áo Mica",
	category: "Sản phẩm lưu niệm",
	seo: {
		title: "Làm Pin Cài Áo Mica Theo Yêu Cầu Tại Đà Nẵng | INUT Design",
		description:
			"Dịch vụ làm pin cài áo mica (acrylic badge) in hình theo yêu cầu. In UV sắc nét, cắt laser hình dáng linh hoạt, gắn kim cài an toàn. Phụ kiện thời trang, fan merch độc đáo.",
		url: "https://inutdesign.com/services/an-pham-luu-niem/pin-cai-ao-mica",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Pin Cài Áo Mica",
		description:
			"Tạo điểm nhấn cá tính trên trang phục và túi xách với pin cài áo mica in hình theo yêu cầu: màu sắc rực rỡ và cắt laser chuẩn xác.",
		image: HERO_IMAGE,
		chips: ["In UV rực rỡ", "Kim cài an toàn"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem portfolio",
		ticker: ["Acrylic Badge", "Pin Cài Áo Custom", "In UV Rực Rỡ", "Phụ Kiện Thời Trang"],
		stats: [
			{ value: "8.000", unit: "+", label: "Pin đã sản xuất" },
			{ value: "50", unit: "+", label: "Local Brand hợp tác" },
			{ value: "100", unit: "%", label: "Chất lượng UV" },
			{ value: "3-4", unit: "ngày", label: "Sản xuất nhanh" },
		],
	},
	introduction: {
		eyebrow: "Phụ kiện cá tính",
		title: "Nhỏ gọn and độc đáo",
		description:
			"Pin cài áo mica (Acrylic Badge) là món phụ kiện không thể thiếu để tạo điểm nhấn riêng trên balo, túi xách hay trang phục của bạn.",
		bullets: [
			"Pin cài áo acrylic nhỏ gọn, bắt mắt, phù hợp cá nhân hóa theo từng ý tưởng.",
			"Công nghệ in UV giúp màu bền, sắc nét and chống phai trong quá trình sử dụng.",
			"Có thể sản xuất số lượng nhỏ từ 10 cái, phù hợp cho cá nhân and doanh nghiệp nhỏ.",
			"Hỗ trợ tư vấn cutline, white ink layer and chuẩn file trước khi in.",
			"Sản xuất nhanh trong 3-4 ngày làm việc tại Đà Nẵng and giao hàng toàn quốc.",
		],
		highlights: [
			{
				title: "Pin acrylic là gì?",
				description:
					"Sản phẩm lưu niệm từ mica trong suốt, in UV trực tiếp cho màu sắc rực and độ bền cao.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Thiết kế linh hoạt",
				description:
					"Hỗ trợ tròn, vuông, bo góc hoặc die cut theo hình bất kỳ đúng cutline thiết kế.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Quy trình sản xuất",
				description:
					"Kiểm tra file, in UV, cắt laser, gắn kim cài and QC từng sản phẩm trước khi giao.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Công năng",
				description:
					"Phù hợp fan merch, quà sự kiện, nhận diện thương hiệu and chiến dịch truyền thông.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Ứng dụng sản phẩm",
		title: "Dòng sản phẩm Pin",
		description: "Phụ kiện nhỏ gọn giúp lan tỏa thông điệp thương hiệu.",
		items: [
			{
				name: "Fanclub merch",
				description: "Sản xuất goods theo artwork.",
				image: HERO_IMAGE,
			},
			{
				name: "Doanh nghiệp",
				description: "Pin nhận diện nhân sự, sự kiện.",
				image: HERO_IMAGE,
			},
			{
				name: "Shop thời trang",
				description: "Phụ kiện tăng giá trị đơn hàng.",
				image: HERO_IMAGE,
			},
			{
				name: "Artist",
				description: "Bán pin theo bộ sưu tập riêng.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Cam kết từ xưởng",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description: "Pin cài áo mica in UV bền màu, cắt laser chuẩn xác.",
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
					description: "Hỗ trợ file in chuẩn UV.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ứng dụng đa dạng",
			description: "Pin cài áo là điểm nhấn cá tính cho trang phục.",
			items: [
				{
					title: "Sự kiện",
					description: "Vật phẩm check-in độc đáo.",
					icon: <EventAvailableIcon fontSize="small" />,
				},
				{
					title: "Fan Merch",
					description: "Sản phẩm sưu tầm cho fandom.",
					icon: <AutoAwesomeIcon fontSize="small" />,
				},
				{
					title: "Thời trang",
					description: "Điểm nhấn cho balo, túi xách.",
					icon: <FavoriteIcon fontSize="small" />,
				},
				{
					title: "Branding",
					description: "Tiếp cận khách hàng trẻ trung.",
					icon: <RocketLaunchIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "In UV sắc nét, mica bền đẹp, kim cài chắc chắn.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Phản hồi đối tác",
		title: "Nhỏ gọn nhưng <em>ấn tượng</em>",
		items: [
			{
				name: "Thùy Linh",
				role: "Owner Local Brand",
				text: "Pin cài in UV của shop màu sắc rất tươi. Khách hàng rất thích khi được tặng kèm hoặc mua thêm để cài túi canvas.",
				initials: "TL",
				color: "#6200ea",
			},
			{
				name: "Duy Mạnh",
				role: "Sự kiện Manager",
				text: "Badge gắn kim cài rất chắc, không bị rơi hay hỏng khi sử dụng trong sự kiện ngoài trời. Rất hài lòng.",
				initials: "DM",
				color: "#c62828",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 50+ brand hợp tác",
	},
	contact: {
		eyebrow: "Liên hệ ngay",
		description: "Liên hệ ngay để được tư vấn mẫu pin cài áo mica and nhận báo giá nhanh nhất.",
		type: "pin-cai-ao-mica",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Sản phẩm thực tế",
		title: "Mẫu pin tiêu biểu",
		images: Array.from({ length: 10 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Fan Merch", "Sự kiện", "Brand"],
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
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Mẫu Magnet thực tế",
		title: "Thư viện dự án",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Die-cut", "Artist Merch", "Brand"],
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
		url: "https://inutdesign.com/in-anh",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "In Ảnh Kỹ Thuật Số",
		description:
			"Lưu giữ trọn vẹn từng khoảnh khắc với dịch vụ in ảnh kỹ thuật số chất lượng cao: màu sắc trung thực, độ phân giải sắc nét và thời gian hoàn thiện nhanh chóng.",
		image: HERO_IMAGE,
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
				image: HERO_IMAGE,
			},
			{
				name: "Ảnh sự kiện",
				description: "In nhanh cho workshop, triển lãm.",
				image: HERO_IMAGE,
			},
			{
				name: "Ảnh trưng bày",
				description: "Phù hợp cửa hàng, studio.",
				image: HERO_IMAGE,
			},
			{
				name: "Ảnh bán lẻ",
				description: "Bộ ảnh sản phẩm, decor.",
				image: HERO_IMAGE,
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
			{ name: "MR. TOM", role: "Sales Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Design Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Dự án tiêu biểu",
		title: "Hình ảnh thực tế",
		images: Array.from({ length: 17 }).map(() => HERO_IMAGE),
		filters: ["Tất cả", "Ảnh kỷ niệm", "Ảnh sự kiện", "Ảnh trưng bày"],
	},
};
