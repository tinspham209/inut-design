import { ProductPageData } from "@/models/product-page";
import BoltIcon from "@mui/icons-material/Bolt";
import CampaignIcon from "@mui/icons-material/Campaign";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TimerIcon from "@mui/icons-material/Timer";
import VerifiedIcon from "@mui/icons-material/Verified";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const HERO_IMAGE = "/cover-web.webp";

export const STICKER_DIECUT_DATA: ProductPageData = {
	id: "sticker-diecut",
	name: "Sticker Diecut",
	category: "Sticker",
	seo: {
		title: "In Sticker Diecut theo yêu cầu tại Đà Nẵng - Cắt Rời Sắc Nét, Chống Nước | INUT Design",
		description:
			"Sticker Diecut cắt rời theo thiết kế — chống nước bền màu, đặt từ 10 cái, giao trong 24h. In UV sắc nét, hỗ trợ vẽ cutline miễn phí. Báo giá nhanh tại INUT Design Đà Nẵng.",
		url: "https://inutdesign.com/services/sticker/sticker-diecut",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Sticker", item: "/services/sticker" },
			{ name: "Sticker Diecut", item: "/services/sticker/sticker-diecut" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Sticker Diecut theo yêu cầu",
			serviceType: "In ấn sticker",
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
		title: "Sticker Diecut",
		description:
			"Mỗi miếng dán là một tuyên ngôn. Sticker Diecut cắt rời hoàn toàn theo đường viền thiết kế — sắc nét từng chi tiết, chống nước tuyệt đối, bóc ra là dán được ngay.",
		image: `/services/sticker/sticker-diecut/1.avif`,
		chips: ["Cắt rời hoàn toàn", "Chống nước 100%", "In UV sắc nét"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem portfolio",
		ticker: ["Cắt Rời Theo Thiết Kế", "Chống Nước Tuyệt Đối", "In UV Sắc Nét", "Đặt Từ 10 Cái"],
		stats: [
			{ value: "100.000", unit: "+", label: "Sticker đã xuất xưởng" },
			{ value: "500", unit: "+", label: "Shop tin dùng" },
			{ value: "100", unit: "%", label: "Chống nước" },
			{ value: "24", unit: "h", label: "Sản xuất nhanh nhất" },
		],
	},
	introduction: {
		eyebrow: "Sticker cắt rời",
		title: "Nhỏ mà chất — Dán đâu cũng đẹp",
		description:
			"Sticker Diecut không chỉ là miếng dán — đó là cách thương hiệu và cá tính của bạn xuất hiện trên mọi thứ bạn chạm vào.",
		bullets: [
			"Cắt rời hoàn toàn theo đường viền thiết kế — logo, nhân vật, icon hay artwork phức tạp đều xử lý được.",
			"In UV kết hợp cán màng bảo vệ: màu sắc rực rỡ, chống nước, chống trầy và không bị phai dưới nắng.",
			"Cutline chính xác đến từng milimet nhờ máy cắt kỹ thuật số — không răng cưa, không lệch đường viền.",
			"Đặt hàng linh hoạt từ 10 cái — phù hợp cả shop nhỏ lẫn chiến dịch thương hiệu lớn.",
			"Hỗ trợ vẽ cutline miễn phí và tư vấn chất liệu phù hợp nhất với mục đích sử dụng của bạn.",
		],
		highlights: [
			{
				title: "Cắt rời theo thiết kế",
				description:
					"Đường cắt bám sát 100% theo hình dạng artwork — từ hình đơn giản đến nhân vật chi tiết.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "In UV + cán màng",
				description:
					"Lớp mực UV bão hòa màu kết hợp màng bảo vệ mờ hoặc bóng — bền bỉ dù dán ngoài trời.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Cắt kỹ thuật số",
				description:
					"Máy cắt CNC chính xác đến 0.1mm — thành phẩm gọn sắc, bóc ra là dán được ngay.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Đặt ít, nhận nhiều",
				description:
					"Tối thiểu 10 cái, không cần đặt số lượng lớn — lý tưởng để test mẫu trước khi tăng đơn.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Chủng loại phổ biến",
		title: "Dòng sticker Diecut",
		description: "Đa dạng chất liệu và hoàn thiện, phù hợp mọi mục đích sử dụng.",
		items: [
			{
				name: "Decal sữa",
				description: "Màu đục mịn, in sắc nét, dán phẳng đẹp.",
				image: HERO_IMAGE,
			},
			{
				name: "Decal trong",
				description: "Nền trong suốt, lý tưởng dán kính và chai lọ.",
				image: HERO_IMAGE,
			},
			{
				name: "Holographic",
				description: "Hiệu ứng cầu vồng bắt sáng, nổi bật độc đáo.",
				image: HERO_IMAGE,
			},
			{
				name: "Kraft / Giấy",
				description: "Tone vintage tự nhiên, phù hợp thương hiệu handmade.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Chất lượng từ xưởng",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description:
			"Không phải ai cũng in sticker đẹp — nhưng INUT làm điều đó mỗi ngày, với từng đơn hàng 10 cái hay 10.000 cái.",
		productionProcess: {
			title: "Quy trình chuyên nghiệp",
			items: [
				{
					title: "Giao nhanh, đúng hẹn",
					description: "Sản xuất từ 2–4 ngày, có thể rút ngắn khi cần gấp.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đặt ít vẫn được",
					description: "Tối thiểu chỉ 10 cái — không ép số lượng lớn.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Hỗ trợ cutline miễn phí",
					description: "INUT vẽ đường cắt chuẩn kỹ thuật cho mọi file thiết kế.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Dán ở đâu cũng hợp",
			description: "Từ tay khách hàng đến mặt bàn văn phòng — sticker INUT xuất hiện ở khắp nơi.",
			items: [
				{
					title: "Branding & sự kiện",
					description: "Quà tặng đi kèm đơn hàng, booth hội chợ, chiến dịch ra mắt.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Trang trí cá nhân",
					description: "Laptop, điện thoại, bình nước, mũ bảo hiểm.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Không gian & nội thất",
					description: "Dán tường, tủ, cửa kính — tạo điểm nhấn mà không cần khoan đục.",
					icon: <EventAvailableIcon fontSize="small" />,
				},
				{
					title: "Packaging & nhãn hàng",
					description: "Tem dán hộp quà, nhãn sản phẩm handmade, seal phong bì.",
					icon: <WorkspacePremiumIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Chống nước tuyệt đối, màu bền lâu, đường cắt gọn sắc — hoặc INUT làm lại.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Khách hàng hài lòng",
		title: "Họ đã dán — và <em>không hối hận</em>",
		items: [
			{
				name: "Anh Khoa",
				role: "Tech Reviewer · Đà Nẵng",
				text: "Dán laptop đi khắp nơi, va đập đủ kiểu mà màu vẫn tươi, không bong tróc. Sticker INUT thuộc hàng bền nhất mình từng dùng.",
				initials: "AK",
				color: "#1976d2",
			},
			{
				name: "Chị Mai",
				role: "Chủ shop handmade · Hội An",
				text: "Mấy bé diecut này tặng kèm đơn hàng, khách thích lắm — đường cắt mượt, bóc dễ, nhìn rất chuyên nghiệp. Tháng nào mình cũng đặt lại.",
				initials: "CM",
				color: "#d81b60",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 500+ shop tin dùng",
	},
	contact: {
		eyebrow: "Báo giá trong 15 phút",
		description: "Gửi file thiết kế + số lượng — INUT báo giá ngay, không cần đặt cọc.",
		type: "sticker-diecut",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Sản phẩm thực tế",
		title: "Rời khỏi xưởng INUT — đi khắp nơi",
		images: Array.from({ length: 13 }).map(
			(_, index) => `/services/sticker/sticker-diecut/${index + 1}.avif`
		),
		filters: [],
	},
};

export const STICKER_KISSCUT_DATA: ProductPageData = {
	id: "sticker-kisscut",
	name: "Sticker Kisscut",
	category: "Sticker",
	seo: {
		title: "In Sticker Kisscut theo yêu cầu tại Đà Nẵng - Cắt Chuẩn, Bóc Dễ, Bền Màu | INUT Design",
		description:
			"Sticker Kisscut in theo yêu cầu tại Đà Nẵng — chỉ cắt lớp decal, giữ nguyên lớp đế, bóc từng hình lẻ không rách, chống nước bền màu, đặt từ 10 cái. Báo giá nhanh tại INUT Design.",
		url: "https://inutdesign.com/services/sticker/sticker-kisscut",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Sticker", item: "/services/sticker" },
			{ name: "Sticker Kisscut", item: "/services/sticker/sticker-kisscut" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Sticker Kisscut theo yêu cầu",
			serviceType: "In ấn sticker",
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
		title: "Sticker Kisscut",
		description:
			"Cắt đúng lớp decal — giữ nguyên lớp đế. Kisscut giúp sticker dễ bóc, dễ bảo quản và trông chuyên nghiệp hơn hẳn — dù là goods artist, dán bao bì hay tặng kèm đơn hàng.",
		image: HERO_IMAGE,
		chips: ["Cắt chuẩn từng milimet", "Bóc không rách", "Chống nước bền màu"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem mẫu",
		ticker: [
			"Kisscut Cắt Chuẩn Kỹ Thuật Số",
			"Bóc Từng Hình Lẻ",
			"Lớp Đế Giữ Nguyên",
			"Chống Nước Bền Màu",
		],
		stats: [
			{ value: "50.000", unit: "+", label: "Tấm Kisscut đã xuất xưởng" },
			{ value: "300", unit: "+", label: "Artist & Brand tin dùng" },
			{ value: "100", unit: "%", label: "Độ chính xác cắt" },
			{ value: "2-3", unit: "ngày", label: "Sản xuất nhanh nhất" },
		],
	},
	introduction: {
		eyebrow: "Kỹ thuật Kisscut",
		title: "Bóc một hình — Còn lại nguyên vẹn",
		description:
			"Kisscut là kỹ thuật cắt chỉ đứt lớp decal bề mặt, giữ nguyên tờ đế phía dưới — mỗi hình dán độc lập nhau, bóc cái nào ra cái đó, không ảnh hưởng gì đến phần còn lại.",
		bullets: [
			"Máy cắt kỹ thuật số cắt chính xác đến lớp decal bề mặt — lớp đế giấy giữ nguyên, sticker không bị cong vênh hay biến dạng khi lưu trữ.",
			"Bóc từng hình lẻ dễ dàng mà không làm rách hay bong các hình xung quanh — đặc biệt tiện lợi cho bộ sưu tập nhiều mẫu.",
			"In UV sắc nét kết hợp cán màng mờ hoặc bóng — màu chuẩn, chống nước, bền bỉ dù dán trong nhà hay ngoài trời.",
			"Phù hợp cả thiết kế đơn giản lẫn artwork phức tạp nhiều chi tiết — kisscut xử lý được mọi đường viền.",
			"Đặt từ 10 cái, hỗ trợ kiểm tra file kisscut miễn phí trước khi sản xuất.",
		],
		highlights: [
			{
				title: "Kisscut là gì?",
				description:
					"Kỹ thuật cắt chỉ xuyên qua lớp decal bề mặt — lớp đế giấy bên dưới vẫn nguyên, giữ từng hình dán đứng yên đúng chỗ.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Bóc sạch, không rách",
				description:
					"Đường kisscut sắc bén giúp tách hình ra khỏi đế dễ dàng — không bị rách góc, không dính ngón tay.",
				icon: <BoltIcon fontSize="small" />,
			},
			{
				title: "Lưu trữ phẳng đẹp",
				description:
					"Lớp đế giữ cho sticker phẳng, không cong vênh — đóng gói vào túi OPP là sẵn sàng bán hoặc tặng ngay.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "In đa chất liệu",
				description:
					"Decal sữa, decal trong, holographic — kisscut áp dụng được trên tất cả, sắc nét như nhau.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Ứng dụng phổ biến",
		title: "Dòng Sticker Kisscut tại INUT",
		description: "Từ goods artist đến dán bao bì thương hiệu — kisscut phù hợp với tất cả.",
		items: [
			{
				name: "Goods Artist",
				description: "Nhân vật, artwork cắt rời — bán kèm album, sách, triển lãm.",
				image: HERO_IMAGE,
			},
			{
				name: "Logo & Nhãn bao bì",
				description: "Dán hộp ship, ly, chai lọ — đồng nhất nhận diện thương hiệu.",
				image: HERO_IMAGE,
			},
			{
				name: "Planner & Sổ tay",
				description: "Bộ icon trang trí lịch, bullet journal theo concept.",
				image: HERO_IMAGE,
			},
			{
				name: "Quà tặng kèm",
				description: "Tặng kèm đơn hàng — nhỏ mà tạo ấn tượng lớn với khách.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Cam kết từ INUT",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description:
			"Kisscut đòi hỏi máy chuẩn, file chuẩn và người hiểu kỹ thuật. INUT có cả ba — và làm điều đó mỗi ngày.",
		productionProcess: {
			title: "Quy trình chuyên nghiệp",
			items: [
				{
					title: "Giao nhanh, đúng hẹn",
					description: "Sản xuất tiêu chuẩn 2–3 ngày, ưu tiên rút ngắn khi gấp.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đặt ít vẫn được",
					description: "Tối thiểu 10 cái — test mẫu trước khi tăng số lượng lớn.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Kiểm tra file miễn phí",
					description: "INUT check đường kisscut trước khi in — tránh lãng phí ngay từ đầu.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ai cũng cần Kisscut",
			description: "Tiện bóc, dễ bảo quản, trông chuyên nghiệp — một lý do là đủ để chọn kisscut.",
			items: [
				{
					title: "Artist & Illustrator",
					description: "Goods dễ đóng gói, dễ bán, khách cầm lên là thích ngay.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "Shop & Thương hiệu",
					description: "Dán logo bao bì hoặc tặng kèm đơn — chi phí thấp, hiệu quả cao.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Sự kiện & Triển lãm",
					description: "Phát sticker cho khách — thương hiệu rời theo họ về nhà.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Cá nhân hóa",
					description: "Planner, sổ tay, đồ dùng cá nhân — dán đâu cũng nổi.",
					icon: <EventAvailableIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Kisscut sắc bén, màu chuẩn, bóc không rách — hoặc INUT làm lại.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Phản hồi Artist & Khách hàng",
		title: "Bóc ra là <em>mê ngay</em>",
		items: [
			{
				name: "Lê Na",
				role: "Illustrator · Đà Nẵng",
				text: "Đường kisscut chuẩn từng milimet, bóc nhẹ tay là ra ngay — không rách, không dính đế. In màu cũng rất trung thực với file gốc của mình.",
				initials: "LN",
				color: "#673ab7",
			},
			{
				name: "Anh Minh",
				role: "Chủ shop F&B · Đà Nẵng",
				text: "Dán logo lên ly trà sữa tiện lắm, bóc từng cái ra dán vào vừa khớp, không bị lệch. Khách hàng hay hỏi in ở đâu đẹp vậy.",
				initials: "AM",
				color: "#2e7d32",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 300+ Artist & Brand đối tác",
	},
	contact: {
		eyebrow: "Báo giá trong 15 phút",
		description:
			"Gửi file thiết kế + số lượng — INUT check kisscut và báo giá ngay, không cần đặt cọc.",
		type: "sticker-kisscut",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Sản phẩm thực tế",
		title: "Cắt chuẩn — Bóc đẹp — Dán ngay",
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
		filters: [],
	},
};

export const STICKER_MAGNET_DATA: ProductPageData = {
	id: "sticker-magnet",
	name: "Sticker Magnet",
	category: "Sticker",
	seo: {
		title:
			"In Sticker Magnet Nam Châm Dẻo theo yêu cầu tại Đà Nẵng - Hít Chắc, Không Keo | INUT Design",
		description:
			"Sticker Magnet nam châm dẻo in theo yêu cầu tại Đà Nẵng — hít lên mọi bề mặt kim loại, không keo không vết bẩn, cắt theo hình dáng bất kỳ. Báo giá nhanh tại INUT Design.",
		url: "https://inutdesign.com/services/sticker/sticker-magnet",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Sticker", item: "/services/sticker" },
			{ name: "Sticker Magnet", item: "/services/sticker/sticker-magnet" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Sticker Magnet Nam Châm Dẻo",
			serviceType: "In ấn sticker",
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
		title: "Sticker Magnet",
		description:
			"Dán không cần keo — gỡ không để lại vết. Sticker Magnet nam châm dẻo hít chắc lên mọi bề mặt kim loại, in sắc nét, thay đổi vị trí bao nhiêu lần tùy thích.",
		image: `/services/sticker/sticker-magnet/1.avif`,
		chips: ["Hít không cần keo", "Tháo lắp tự do", "Cắt theo yêu cầu"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem mẫu",
		ticker: [
			"Hít Kim Loại Không Cần Keo",
			"Cắt Theo Hình Bất Kỳ",
			"In Sắc Nét Bền Màu",
			"Tháo Lắp Tự Do",
		],
		stats: [
			{ value: "5.000", unit: "+", label: "Magnet đã xuất xưởng" },
			{ value: "100", unit: "+", label: "Doanh nghiệp tin dùng" },
			{ value: "100", unit: "%", label: "Không để lại vết keo" },
			{ value: "3-4", unit: "ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Nam châm dẻo in theo yêu cầu",
		title: "Dán — Gỡ — Dán lại. Không vấn đề gì",
		description:
			"Sticker Magnet là lớp decal in sắc nét gắn liền với tấm nam châm dẻo mỏng — hít chắc lên kim loại, không keo, không vết, đổi chỗ bất cứ lúc nào.",
		bullets: [
			"Lớp nam châm dẻo mỏng linh hoạt hít lên mọi bề mặt kim loại — tủ lạnh, cửa sắt, bảng từ, thân máy móc.",
			"Không dùng keo dán: gỡ ra sạch bong, không để lại vết bẩn hay làm trầy sơn bề mặt.",
			"In UV kết hợp cán màng bảo vệ — màu sắc rực rỡ, chống nước, bền bỉ kể cả trong môi trường bếp hay xưởng sản xuất.",
			"Cắt laser theo bất kỳ hình dáng nào: tròn, vuông, logo doanh nghiệp hay nhân vật minh họa phức tạp.",
			"Tái sử dụng được nhiều lần — lực hút giữ ổn định dù tháo ra dán lại liên tục.",
		],
		highlights: [
			{
				title: "Hít không cần keo",
				description:
					"Lực từ tính giữ chặt lên kim loại — không cần keo hai mặt, không lo bong tróc hay vết dính.",
				icon: <BoltIcon fontSize="small" />,
			},
			{
				title: "Tháo lắp tự do",
				description:
					"Thay thông điệp, đổi vị trí, cập nhật thông tin — gỡ ra và dán lại trong vài giây.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "In bền, màu chuẩn",
				description:
					"Mực UV bám sâu, cán màng chống trầy — màu sắc giữ tươi lâu dù trong bếp hay ngoài nắng.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Cắt theo bất kỳ hình nào",
				description:
					"Máy cắt laser xử lý mọi đường viền phức tạp — logo, icon hay nhân vật đều sắc bén như nhau.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Ứng dụng phổ biến",
		title: "Dòng Sticker Magnet tại INUT",
		description: "Một sản phẩm — ứng dụng trong không gian sống, văn phòng và doanh nghiệp.",
		items: [
			{
				name: "Magnet tủ lạnh",
				description: "Trang trí bếp, ghi chú, in ảnh gia đình.",
				image: `/services/sticker/sticker-magnet/8.avif`,
			},
			{
				name: "Magnet quảng cáo",
				description: "In logo dán lên phương tiện hoặc thiết bị.",
				image: `/services/sticker/sticker-magnet/13.avif`,
			},
			{
				name: "Magnet vận hành",
				description: "Dán hướng dẫn, quy trình lên máy móc kim loại.",
				image: `/services/sticker/sticker-magnet/5.avif`,
			},
			{
				name: "Magnet quà tặng",
				description: "Lưu niệm độc đáo, in theo sự kiện hoặc thương hiệu.",
				image: `/services/sticker/sticker-magnet/15.avif`,
			},
		],
	},
	whyInut: {
		eyebrow: "Cam kết từ INUT",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description:
			"Magnet dẻo nghe đơn giản — nhưng làm đẹp, hút chắc và cắt gọn thì không phải ai cũng làm được. INUT thì được.",
		productionProcess: {
			title: "Quy trình chuyên nghiệp",
			items: [
				{
					title: "Giao đúng hẹn",
					description: "Sản xuất tiêu chuẩn 3–4 ngày, ưu tiên rút ngắn khi gấp.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Số lượng linh hoạt",
					description: "Đặt ít hay nhiều đều được — không ép MOQ lớn.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Tư vấn hình dáng",
					description: "Hỗ trợ thiết kế đường cắt và tư vấn kích thước phù hợp.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Dán ở đâu cũng hợp",
			description: "Từ bếp nhà bạn đến xưởng sản xuất — magnet dẻo INUT ở đâu cũng làm việc tốt.",
			items: [
				{
					title: "Không gian sống",
					description: "Tủ lạnh, bảng từ, cửa sắt — trang trí linh hoạt không lo hỏng đồ.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "Marketing & Branding",
					description:
						"Quà tặng khách hàng, dán lên xe hoặc thiết bị — thương hiệu xuất hiện liên tục.",
					icon: <CampaignIcon fontSize="small" />,
				},
				{
					title: "Vận hành & Quản lý",
					description:
						"Gắn hướng dẫn, trạng thái quy trình lên máy móc — thay được bất cứ lúc nào.",
					icon: <EventAvailableIcon fontSize="small" />,
				},
				{
					title: "Quà lưu niệm",
					description: "Nhỏ gọn, in đẹp, ý nghĩa — quà tặng sự kiện không ai vứt đi.",
					icon: <StorefrontIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Lực hút ổn định, màu bền, cắt gọn — không keo, không vết, không phàn nàn.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Phản hồi người dùng",
		title: "Hít một cái — <em>ghiền luôn</em>",
		items: [
			{
				name: "Anh Hải",
				role: "Quản lý xưởng sản xuất · Đà Nẵng",
				text: "Dán quy trình vận hành lên máy, khi cần cập nhật chỉ gỡ ra thay tờ mới. Không cần keo, không bẩn máy — tiện hơn mình nghĩ nhiều.",
				initials: "AH",
				color: "#ef6c00",
			},
			{
				name: "Chị Thảo",
				role: "Chủ hộ kinh doanh · Hội An",
				text: "Đặt magnet in logo dán lên tủ mát quầy bán hàng. Khách hay hỏi mua luôn — vừa trang trí vừa quảng cáo, một công đôi việc.",
				initials: "CT",
				color: "#00838f",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 100+ doanh nghiệp tin dùng",
	},
	contact: {
		eyebrow: "Báo giá trong 15 phút",
		description: "Gửi file + hình dáng mong muốn — INUT báo giá ngay, tư vấn đường cắt miễn phí.",
		type: "sticker-magnet",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Sản phẩm thực tế",
		title: "Hít lên — Đẹp ngay",
		images: Array.from({ length: 16 }).map(
			(_, index) => `/services/sticker/sticker-magnet/${index + 1}.avif`
		),
		filters: [],
	},
};

export const STICKER_SHEET_DATA: ProductPageData = {
	id: "sticker-sheet",
	name: "Sticker Sheet",
	category: "Sticker",
	seo: {
		title: "In Sticker Sheet A5 & A6 theo yêu cầu tại Đà Nẵng - Kisscut Sắc Nét | INUT Design",
		description:
			"Sticker Sheet kisscut khổ A5 và A6 — nhiều hình dán trên một tờ, chống nước bền màu, đặt từ 10 tờ, giao trong 3–4 ngày. Giải pháp merchandise lý tưởng cho artist và thương hiệu tại INUT Design Đà Nẵng.",
		url: "https://inutdesign.com/services/sticker/sticker-sheet",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Sticker", item: "/services/sticker" },
			{ name: "Sticker Sheet", item: "/services/sticker/sticker-sheet" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Sticker Sheet A5 & A6",
			serviceType: "In ấn sticker",
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
		title: "Sticker Sheet",
		description:
			"Cả một bộ sưu tập trên một tờ giấy. Sticker Sheet kisscut khổ A5 và A6 — in sắc nét, bóc từng hình lẻ dễ dàng, đủ chỗ cho mọi ý tưởng bạn muốn kể.",
		image: `/services/sticker/sticker-sheet/1.avif`,
		chips: ["Khổ A5 & A6", "Kisscut từng hình", "Chống nước bền màu"],
		ctaLabel: "Nhận báo giá nhanh",
		secondaryCtaLabel: "Xem mẫu",
		ticker: ["Khổ A5 & A6", "Kisscut Sắc Bén", "Nhiều Hình Một Tờ", "Giải Pháp Merchandise"],
		stats: [
			{ value: "30.000", unit: "+", label: "Tờ sticker đã xuất xưởng" },
			{ value: "150", unit: "+", label: "Artist & Brand tin dùng" },
			{ value: "100", unit: "%", label: "Chống nước" },
			{ value: "3-4", unit: "ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Bộ sưu tập Sticker",
		title: "Một tờ — Vô vàn câu chuyện",
		description:
			"Sticker Sheet là cách thông minh nhất để in cùng lúc nhiều hình dán khác nhau — tối ưu chi phí, giữ trọn concept, và trông rất chuyên nghiệp khi cầm trên tay.",
		bullets: [
			"Hai khổ phổ biến nhất: A5 (148×210mm) và A6 (105×148mm) — đủ không gian để dàn trải cả một bộ sưu tập sticker theo chủ đề.",
			"Kỹ thuật cắt kisscut chính xác: cắt đến lớp decal, giữ nguyên tờ nền — bóc từng hình lẻ dễ dàng mà không làm hỏng các hình còn lại.",
			"In UV sắc nét kết hợp cán màng mờ hoặc bóng — màu rực rỡ, chống nước, chống trầy và bền lâu.",
			"Hỗ trợ dàn trang (layout) sticker miễn phí — INUT sắp xếp khoa học để tối đa số lượng hình trên một tờ.",
			"Đặt từ 10 tờ, không ép số lượng lớn — phù hợp cả artist bán lẻ lẫn thương hiệu cần merchandise số lượng nhiều.",
		],
		highlights: [
			{
				title: "Khổ A5 & A6",
				description:
					"A5 lý tưởng cho bộ sưu tập đầy đủ, A6 gọn nhẹ dễ tặng kèm — cả hai đều vừa tay, vừa túi.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Kỹ thuật Kisscut",
				description:
					"Cắt đúng lớp decal, giữ nguyên tờ nền — bóc từng hình lẻ không bị rách, không dính tay.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "In nhiều mẫu, một lần",
				description:
					"Dồn toàn bộ bộ sưu tập vào một tờ — tiết kiệm chi phí mà vẫn ra đủ số lượng từng mẫu.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Merchandise sẵn sàng bán",
				description:
					"Đóng gói đẹp là bán được ngay — Sticker Sheet là merchandise entry-level hoàn hảo cho mọi artist.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Khổ & Chất liệu",
		title: "Dòng Sticker Sheet tại INUT",
		description: "Hai khổ giấy, nhiều lựa chọn chất liệu — linh hoạt cho mọi concept.",
		items: [
			{
				name: "Sheet A5",
				description: "148×210mm — bộ sưu tập đầy đủ, trình bày sang trọng.",
				image: HERO_IMAGE,
			},
			{
				name: "Sheet A6",
				description: "105×148mm — gọn nhẹ, dễ tặng kèm, chi phí tối ưu.",
				image: HERO_IMAGE,
			},
			{
				name: "Cán màng mờ",
				description: "Tone nhẹ tinh tế, chống trầy, cầm tay không bám mờ.",
				image: HERO_IMAGE,
			},
			{
				name: "Cán màng bóng",
				description: "Màu sắc rực rỡ, sáng bắt mắt, phù hợp thiết kế pop art.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Chuyên nghiệp & Tận tâm",
		title: "Vì sao chọn dịch vụ tại INUT Design?",
		description:
			"Từ artist bán merch đến shop online cần quà tặng — INUT hiểu bạn cần gì và làm đúng ngay từ đầu.",
		productionProcess: {
			title: "Quy trình chuyên nghiệp",
			items: [
				{
					title: "Giao đúng hẹn",
					description: "Sản xuất tiêu chuẩn 3–4 ngày, có thể rút ngắn khi gấp.",
					icon: <TimerIcon fontSize="small" />,
				},
				{
					title: "Đặt ít vẫn được",
					description: "Tối thiểu 10 tờ — thử nghiệm trước khi tăng đơn lớn.",
					icon: <DoneAllIcon fontSize="small" />,
				},
				{
					title: "Hỗ trợ dàn trang",
					description: "INUT layout sticker miễn phí, tối ưu số hình trên mỗi tờ.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Ai cũng cần Sticker Sheet",
			description: "Nhỏ gọn, dễ bán, dễ tặng — sticker sheet phù hợp với hầu hết mọi người.",
			items: [
				{
					title: "Artist & Creator",
					description: "Merchandise dễ làm, dễ bán, chi phí thấp để bắt đầu.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "Shop & Thương hiệu",
					description: "Quà tặng kèm đơn hàng — nhỏ mà tạo ấn tượng lớn.",
					icon: <StorefrontIcon fontSize="small" />,
				},
				{
					title: "Giáo dục",
					description: "Sticker khen thưởng học sinh, trẻ em yêu thích.",
					icon: <WorkspacePremiumIcon fontSize="small" />,
				},
				{
					title: "Planner & Journaling",
					description: "Trang trí sổ tay, bullet journal theo concept riêng.",
					icon: <EventAvailableIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết chất lượng",
			description: "Kisscut sắc bén, màu in trung thực, tờ nền phẳng đẹp — hoặc INUT làm lại.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Ý kiến Artist & Khách hàng",
		title: "Một tờ sticker — <em>ngàn lời khen</em>",
		items: [
			{
				name: "Bạn Linh",
				role: "Bullet Journal Enthusiast · Đà Nẵng",
				text: "Sheet A6 của INUT nhỏ gọn mà in sắc đẹp lắm. Mình dùng trang trí sổ, khách đặt hàng cứ hỏi mua sticker thêm hoài.",
				initials: "BL",
				color: "#6a1b9a",
			},
			{
				name: "Anh Hoàng",
				role: "Graphic Designer · Hội An",
				text: "In sheet A5 cho bộ merch mới — layout INUT dàn rất khéo, cán màng mờ nhìn sang. Chi phí hợp lý hơn mình tưởng nhiều.",
				initials: "AH",
				color: "#283593",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 150+ Artist & Brand đối tác",
	},
	contact: {
		eyebrow: "Báo giá trong 15 phút",
		description: "Gửi file + chọn khổ A5 hoặc A6 — INUT báo giá ngay, hỗ trợ dàn trang miễn phí.",
		type: "sticker-sheet",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Mẫu Sticker Sheet thực tế",
		title: "Từ xưởng INUT — ra tay bạn",
		images: Array.from({ length: 15 }).map(
			(_, index) => `/services/sticker/sticker-sheet/${index + 1}.avif`
		),
		filters: [],
	},
};
