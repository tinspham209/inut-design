import { ProductPageData } from "@/models/product-page";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CategoryIcon from "@mui/icons-material/Category";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import DevicesIcon from "@mui/icons-material/Devices";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import GppBadIcon from "@mui/icons-material/GppBad";
import HandymanIcon from "@mui/icons-material/Handyman";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LabelIcon from "@mui/icons-material/Label";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import RecyclingIcon from "@mui/icons-material/Recycling";
import SecurityIcon from "@mui/icons-material/Security";
import SpaIcon from "@mui/icons-material/Spa";
import VerifiedIcon from "@mui/icons-material/Verified";
import WaterDropIcon from "@mui/icons-material/WaterDrop";

const HERO_IMAGE = "/cover-web.webp";

export const DECAL_NHAN_MAC_DATA: ProductPageData = {
	id: "decal-nhan-mac",
	name: "Decal Nhãn Mác",
	category: "Ấn phẩm bao bì",
	seo: {
		title: "In Decal Nhãn Mác Theo Yêu Cầu Tại Đà Nẵng | INUT Design",
		description:
			"In decal nhãn mác bao bì tại Đà Nẵng: nhãn sản phẩm, nhãn chai lọ, tem dán hộp. Cắt theo hình, chống nước, in UV sắc nét. Đặt từ 50 cái — báo giá trong 15 phút.",
		url: "https://inutdesign.com/services/an-pham-bao-bi/decal-nhan-mac",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm bao bì", item: "/services/an-pham-bao-bi" },
			{ name: "Decal Nhãn Mác", item: "/services/an-pham-bao-bi/decal-nhan-mac" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Decal Nhãn Mác",
			serviceType: "In ấn ấn phẩm bao bì",
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
		title: "Decal Nhãn Mác",
		description:
			"Bao bì không có nhãn là sản phẩm chưa hoàn chỉnh. Nhãn mác in đẹp — đúng màu thương hiệu, bám chắc trên mọi bề mặt, chống nước và không bong tróc khi vận chuyển.",
		image: HERO_IMAGE,
		chips: ["Cắt theo hình tự do", "Chống nước & bền dính", "Đặt từ 50 cái"],
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"Nhãn Sản Phẩm Custom",
			"Decal Chai Lọ Chống Nước",
			"Tem Dán Hộp Bao Bì",
			"Cắt Die-Cut Tự Do",
		],
		stats: [
			{ value: "500", unit: "+", label: "Thương hiệu đã in nhãn" },
			{ value: "50", unit: " cái", label: "Số lượng tối thiểu" },
			{ value: "5.0", unit: "★", label: "Đánh giá từ khách hàng" },
			{ value: "3–5", unit: " ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Nhãn mác bao bì",
		title: "Nhãn in đẹp — *thương hiệu* lên kệ tự tin hơn",
		description:
			"Nhãn mác là thứ khách nhìn đầu tiên trước khi quyết định mua. Decal nhãn mác in tại INUT: màu chuẩn Pantone/CMYK, cắt laser theo đúng cutline, bám dính tốt trên giấy, nhựa, thủy tinh và kim loại.",
		bullets: [
			"Cắt die-cut theo hình bất kỳ — tròn, oval, bo góc hoặc theo đúng contour thiết kế.",
			"Chất liệu đa dạng: giấy couche, giấy kraft, PP trong, PP trắng, PET bạc, PET vàng — tư vấn đúng nền bao bì.",
			"Lớp keo chuyên dụng theo bề mặt: keo thường, keo chịu nước, keo chịu nhiệt cho sản phẩm đông lạnh hoặc đồ uống.",
			"In UV bảo vệ màu sắc, tùy chọn cán matte hoặc glossy — không bị trầy hay ố vàng theo thời gian.",
			"In QR code, barcode, số lô sản xuất — tích hợp trực tiếp vào layout nhãn không phát sinh thêm chi phí.",
		],
		highlights: [
			{
				title: "Decal nhãn mác là gì?",
				description:
					"Tem dán bao bì in thông tin thương hiệu, thành phần, QR code lên sản phẩm — vừa nhận diện vừa đáp ứng quy định ghi nhãn hàng hóa.",
				icon: <LabelIcon fontSize="small" />,
			},
			{
				title: "Cắt die-cut tự do",
				description:
					"Cắt laser theo đúng cutline thiết kế — không bị thừa viền trắng, hình dáng nhãn chính xác như file gốc.",
				icon: <ContentCutIcon fontSize="small" />,
			},
			{
				title: "Chống nước & bền dính",
				description:
					"Keo và chất liệu chuyên dụng theo bề mặt dán — bám chắc dù tiếp xúc nước, nhiệt hay va đập khi vận chuyển.",
				icon: <WaterDropIcon fontSize="small" />,
			},
			{
				title: "Tích hợp QR & barcode",
				description:
					"In mã QR, barcode, số serial trực tiếp vào layout — quét được, đọc được, không phát sinh chi phí thêm.",
				icon: <QrCode2Icon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại nhãn mác",
		title: "Các dòng decal nhãn mác INUT thực hiện",
		description:
			"Nhãn giấy, nhãn nhựa hay nhãn kim loại giả — tư vấn đúng để chất liệu nhãn phù hợp với bao bì thực tế.",
		items: [
			{
				name: "Nhãn giấy Couche / Kraft",
				description:
					"In CMYK sắc nét, cán matte hoặc glossy — phù hợp hộp carton, túi giấy, lọ thủy tinh.",
				image: HERO_IMAGE,
			},
			{
				name: "Nhãn PP trong suốt",
				description:
					"Dán vào chai lọ tạo hiệu ứng in thẳng lên bề mặt — phổ biến cho mỹ phẩm, thực phẩm, đồ uống.",
				image: HERO_IMAGE,
			},
			{
				name: "Nhãn PET bạc / vàng",
				description:
					"Hiệu ứng kim loại cao cấp, chống nước tốt — phù hợp thương hiệu premium, mỹ phẩm, rượu.",
				image: HERO_IMAGE,
			},
			{
				name: "Tem dán hộp bao bì",
				description:
					"Tem niêm phong, tem thương hiệu dán hộp ship — bảo vệ sản phẩm và tăng nhận diện khi giao hàng.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Tại sao chọn INUT",
		title: "Nhãn in tại INUT — *chuẩn màu* từ tờ đầu đến tờ cuối",
		description:
			"Nhãn mác đại diện cho thương hiệu trên kệ hàng — INUT kiểm soát màu sắc nhất quán và chất lượng cắt đều nhau dù in số lượng lớn.",
		productionProcess: {
			title: "Quy trình sản xuất chuyên nghiệp",
			items: [
				{
					title: "Tư vấn & Chuẩn file",
					description:
						"Xác định chất liệu bao bì, bề mặt dán, môi trường sử dụng — tư vấn chọn đúng chất liệu và loại keo trước khi chuẩn hóa file in.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "In & Cắt die-cut",
					description:
						"In UV hoặc offset CMYK, bleed 3mm, cắt laser theo đúng cutline — kiểm tra màu và cạnh cắt sau mỗi lô.",
					icon: <LocalPrintshopIcon fontSize="small" />,
				},
				{
					title: "QC & Bàn giao",
					description:
						"Kiểm tra độ bám dính, màu sắc và cắt đồng đều — đóng cuộn hoặc đóng tập theo yêu cầu, sẵn sàng dán ngay.",
					icon: <DoneAllIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Nhãn mác dùng được ở đâu?",
			description:
				"Từ sản phẩm handmade bán online đến hàng hóa phân phối hệ thống — nhãn in đẹp là bộ mặt của thương hiệu trên mọi kênh.",
			items: [
				{
					title: "Thực phẩm & Đồ uống",
					description:
						"Nhãn chai, lọ, hộp — chịu ẩm, chịu lạnh, đạt yêu cầu ghi nhãn hàng hóa thực phẩm.",
					icon: <Inventory2Icon fontSize="small" />,
				},
				{
					title: "Mỹ phẩm & Skincare",
					description:
						"Nhãn PP trong hoặc PET bạc — cao cấp, chống nước, không bong khi tiếp xúc dầu và kem.",
					icon: <SpaIcon fontSize="small" />,
				},
				{
					title: "Bán lẻ & Thương mại điện tử",
					description:
						"Tem thương hiệu dán hộp ship — tăng nhận diện khi giao hàng, giữ nguyên độ dính suốt quá trình vận chuyển.",
					icon: <LocalShippingIcon fontSize="small" />,
				},
				{
					title: "Quà tặng & Sự kiện",
					description:
						"Nhãn cá nhân hóa theo sự kiện, in tên — tạo điểm nhấn cho quà tặng doanh nghiệp và tiệc cưới.",
					icon: <CelebrationIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết màu chuẩn, cắt đều, giao đúng hẹn",
			description:
				"Dù đặt 50 hay 50.000 nhãn — INUT đảm bảo màu sắc nhất quán theo file gốc, cắt đúng cutline và không có nhãn nào lỗi trong lô hàng bàn giao.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Khách hàng nói gì",
		title: "Nhãn đẹp — *thương hiệu* lên kệ tự nhiên hơn",
		items: [
			{
				name: "Lâm Organic",
				role: "Thực phẩm sạch · Đà Nẵng",
				text: "Trước đây nhãn in chỗ khác hay bị ố và bong khi dán vào hũ thủy tinh. Chuyển sang INUT, nhãn PP trong dán chắc, màu đẹp — khách hay hỏi in ở đâu vậy.",
				initials: "LO",
				color: "#1a5c3a",
			},
			{
				name: "Bloom Studio",
				role: "Mỹ phẩm handmade · Đà Nẵng",
				text: "Cần nhãn PET bạc cho dòng serum mới, INUT tư vấn đúng loại keo chịu dầu và in chuẩn màu Pantone. Nhận hàng là dán luôn, không cần chỉnh gì thêm.",
				initials: "BS",
				color: "#c2185b",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 500+ thương hiệu đã in nhãn",
	},
	contact: {
		eyebrow: "Đặt hàng ngay",
		description:
			"Gửi file thiết kế hoặc mô tả ý tưởng — INUT tư vấn chất liệu phù hợp và báo giá trong 15 phút. Không cần đặt cọc để nhận tư vấn.",
		type: "decal-nhan-mac",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Sản phẩm thực tế",
		title: "Mẫu nhãn mác đã in",
		images: Array.from({ length: 8 }).map(
			(_, index) => `/services/an-pham-bao-bi/decal-nhan-mac/${index + 1}.avif`
		),
		filters: [],
	},
};

export const HOP_SAN_PHAM_DATA: ProductPageData = {
	id: "hop-san-pham",
	name: "Hộp Sản Phẩm",
	category: "Ấn phẩm bao bì",
	seo: {
		title: "In Hộp Sản Phẩm Theo Yêu Cầu Tại Đà Nẵng | INUT Design",
		description:
			"In hộp sản phẩm bao bì tại Đà Nẵng: hộp mỹ phẩm, hộp quà, hộp thực phẩm, hộp carton in offset. Thiết kế theo thương hiệu, cắt bế chính xác. Báo giá trong 15 phút.",
		url: "https://inutdesign.com/services/an-pham-bao-bi/hop-san-pham",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm bao bì", item: "/services/an-pham-bao-bi" },
			{ name: "Hộp Sản Phẩm", item: "/services/an-pham-bao-bi/hop-san-pham" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Hộp Sản Phẩm",
			serviceType: "In ấn ấn phẩm bao bì",
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
		title: "Hộp Sản Phẩm",
		description:
			"Hộp là thứ khách cầm trên tay trước khi chạm vào sản phẩm. In đẹp, cứng đúng độ, gấp khớp từng mép — bao bì tốt không chỉ bảo vệ hàng, nó bán hàng thay bạn.",
		image: HERO_IMAGE,
		chips: ["Thiết kế theo thương hiệu", "Cắt bế chính xác", "Đa dạng chất liệu"],
		secondaryCtaLabel: "Xem portfolio",
		ticker: [
			"Hộp Mỹ Phẩm Custom",
			"Hộp Quà Cao Cấp",
			"Hộp Thực Phẩm In Offset",
			"Bao Bì Theo Thương Hiệu",
		],
		stats: [
			{ value: "200", unit: "+", label: "Thương hiệu đã làm hộp" },
			{ value: "100", unit: " cái", label: "Số lượng tối thiểu" },
			{ value: "5.0", unit: "★", label: "Đánh giá từ khách hàng" },
			{ value: "5–7", unit: " ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Bao bì sản phẩm",
		title: "Hộp đẹp — *bán được hàng* trước khi khách mở ra",
		description:
			"Bao bì không chỉ là vỏ bọc. Hộp sản phẩm in đẹp tại INUT: màu chuẩn theo bộ nhận diện, cắt bế sắc cạnh, gấp khít từng mép — thương hiệu xuất hiện chuyên nghiệp từ lần đầu khách nhìn thấy.",
		bullets: [
			"Thiết kế dieline theo kích thước sản phẩm thực tế — đảm bảo hộp ôm khít, không bị xộc xệch hay lỏng lẻo.",
			"In offset CMYK 300 DPI hoặc in UV — màu sắc đồng đều trên toàn bộ lô, chuẩn Pantone theo yêu cầu.",
			"Chất liệu đa dạng: carton duplex, carton kraftliner, carton ivory — tư vấn độ dày theo trọng lượng sản phẩm bên trong.",
			"Gia công hoàn thiện: cán matte, cán glossy, ép kim, dập nổi, cửa sổ trong — nâng tầm bao bì không cần thay chất liệu.",
			"Hỗ trợ in QR code, barcode, thông tin thành phần — tích hợp trực tiếp vào layout, đáp ứng quy định ghi nhãn hàng hóa.",
		],
		highlights: [
			{
				title: "Dieline theo sản phẩm",
				description:
					"Vẽ dieline theo kích thước thực tế — hộp gấp khít, không thừa không thiếu, bảo vệ sản phẩm tốt hơn mẫu có sẵn.",
				icon: <ContentCutIcon fontSize="small" />,
			},
			{
				title: "Cắt bế sắc cạnh",
				description:
					"Cắt bế dao thép chính xác đến 0.1mm — mép hộp sắc, gấp dễ, không bị xước hay bong tróc khi lắp ráp.",
				icon: <CategoryIcon fontSize="small" />,
			},
			{
				title: "Gia công cao cấp",
				description:
					"Ép kim, dập nổi, cán matte/glossy, cửa sổ PET trong — tùy chọn theo ngân sách và định vị thương hiệu.",
				icon: <AutoAwesomeIcon fontSize="small" />,
			},
			{
				title: "Chất liệu bền vững",
				description:
					"Carton tái chế, kraft tự nhiên — lựa chọn cho thương hiệu hướng đến bao bì xanh và thân thiện môi trường.",
				icon: <RecyclingIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại hộp",
		title: "Các dòng hộp sản phẩm INUT thực hiện",
		description:
			"Hộp gấp, hộp cứng, hộp có cửa sổ hay hộp ship — tư vấn đúng loại để bao bì vừa đẹp vừa bảo vệ hàng.",
		items: [
			{
				name: "Hộp carton gấp (Folding Box)",
				description:
					"Gấp phẳng khi lưu kho, lắp ráp nhanh khi dùng — phổ biến nhất cho mỹ phẩm, thực phẩm, dược phẩm.",
				image: HERO_IMAGE,
			},
			{
				name: "Hộp cứng cao cấp (Rigid Box)",
				description:
					"Carton dày bọc giấy in — không gấp được, sang trọng, dùng cho quà tặng và sản phẩm premium.",
				image: HERO_IMAGE,
			},
			{
				name: "Hộp có cửa sổ (Window Box)",
				description:
					"Mặt trước gắn film PET trong suốt — khách nhìn thấy sản phẩm bên trong mà không cần mở hộp.",
				image: HERO_IMAGE,
			},
			{
				name: "Hộp kraft tự nhiên",
				description:
					"Carton kraftliner nâu mộc in 1–2 màu hoặc in UV — phù hợp thương hiệu organic, handmade, eco.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Tại sao chọn INUT",
		title: "Hộp in tại INUT — *chuẩn từng mép* gấp đến màu in",
		description:
			"Hộp lỗi là hàng trả về. INUT kiểm soát từ dieline đến thành phẩm — giao hộp là dùng được ngay, không cần căn chỉnh lại.",
		productionProcess: {
			title: "Quy trình sản xuất chuyên nghiệp",
			items: [
				{
					title: "Tư vấn & Thiết kế dieline",
					description:
						"Đo kích thước sản phẩm thực tế, xác định chất liệu và gia công — vẽ dieline chuẩn trước khi thiết kế đồ họa lên mặt hộp.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "In & Cắt bế",
					description:
						"In offset hoặc UV CMYK, bleed 3mm, cắt bế dao thép chính xác — kiểm tra màu, cạnh cắt và độ khít sau mỗi lô sản xuất.",
					icon: <LocalPrintshopIcon fontSize="small" />,
				},
				{
					title: "Gia công & Bàn giao",
					description:
						"Cán màng, ép kim, dập nổi theo yêu cầu — gấp và lắp ráp mẫu thử trước khi bàn giao toàn bộ lô, đóng gói gọn gàng.",
					icon: <DoneAllIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Hộp sản phẩm dùng cho ngành nào?",
			description:
				"Từ hộp mỹ phẩm handmade bán online đến hộp thực phẩm phân phối hệ thống — bao bì in đẹp là lợi thế cạnh tranh trên kệ hàng.",
			items: [
				{
					title: "Mỹ phẩm & Skincare",
					description:
						"Hộp gấp hoặc hộp cứng cán matte — nâng tầm sản phẩm, tạo cảm giác cao cấp khi khách cầm trên tay.",
					icon: <SpaIcon fontSize="small" />,
				},
				{
					title: "Thực phẩm & Bánh kẹo",
					description:
						"Hộp carton chống ẩm, có cửa sổ nhìn sản phẩm — đảm bảo vệ sinh và tăng sức hút trên kệ bán lẻ.",
					icon: <Inventory2Icon fontSize="small" />,
				},
				{
					title: "Quà tặng & Sự kiện",
					description:
						"Hộp cứng bọc giấy in, ép kim tên sự kiện — sang trọng, đáng nhớ, tạo trải nghiệm unboxing đáng share.",
					icon: <CelebrationIcon fontSize="small" />,
				},
				{
					title: "Bán lẻ & Thương mại điện tử",
					description:
						"Hộp ship chắc, in thương hiệu bên ngoài — bảo vệ hàng trong vận chuyển và tạo ấn tượng khi khách nhận hàng.",
					icon: <LocalShippingIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết dieline chuẩn, màu đúng file, giao đúng hẹn",
			description:
				"Dù đặt 100 hay 10.000 hộp — INUT đảm bảo từng hộp gấp khít, màu sắc nhất quán theo file gốc và không có hộp nào lỗi trong lô hàng bàn giao.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Khách hàng nói gì",
		title: "Bao bì đẹp — *khách nhớ* thương hiệu lâu hơn",
		items: [
			{
				name: "Minh Châu Skincare",
				role: "Mỹ phẩm handmade · Đà Nẵng",
				text: "Trước dùng hộp trắng dán nhãn ngoài, chuyển sang hộp in offset cán matte tại INUT — khách bắt đầu chụp ảnh unboxing và tag Instagram. Doanh thu tăng rõ chỉ vì thay bao bì.",
				initials: "MC",
				color: "#c2185b",
			},
			{
				name: "Viet Artisan Cookies",
				role: "Bánh thủ công · Đà Nẵng",
				text: "Hộp bánh cần cửa sổ để nhìn sản phẩm bên trong, INUT làm dieline chuẩn, film PET trong dán phẳng không bong. Giao đúng hạn trước Tết — quan trọng nhất là không có hộp nào lỗi.",
				initials: "VA",
				color: "#e65100",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 200+ thương hiệu đã làm hộp",
	},
	contact: {
		eyebrow: "Đặt hàng ngay",
		description:
			"Gửi kích thước sản phẩm hoặc mẫu hộp tham khảo — INUT vẽ dieline, tư vấn chất liệu và báo giá trong 15 phút. Không cần đặt cọc để nhận tư vấn.",
		type: "hop-san-pham",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Sản phẩm thực tế",
		title: "Mẫu hộp đã sản xuất",
		images: Array.from({ length: 8 }).map(
			(_, index) => `/services/an-pham-bao-bi/hop-san-pham/${index + 1}.avif`
		),
		filters: ["Tất cả", "Mỹ phẩm", "Thực phẩm", "Quà tặng", "Bán lẻ"],
	},
};

export const TEM_BAO_HANH_DATA: ProductPageData = {
	id: "tem-bao-hanh",
	name: "Tem Bảo Hành",
	category: "Ấn phẩm bao bì",
	seo: {
		title: "In Tem Bảo Hành Theo Yêu Cầu Tại Đà Nẵng | INUT Design",
		description:
			"In tem bảo hành tại Đà Nẵng: tem vỡ khi bóc, tem hologram, tem QR xác thực, tem niêm phong. Bảo vệ thương hiệu, chống hàng nhái. Đặt từ 10 cái — báo giá 15 phút.",
		url: "https://inutdesign.com/services/an-pham-bao-bi/tem-bao-hanh",
		thumbnailUrl: HERO_IMAGE,
		breadcrumbs: [
			{ name: "Trang chủ", item: "/" },
			{ name: "Dịch vụ", item: "/services" },
			{ name: "Ấn phẩm bao bì", item: "/services/an-pham-bao-bi" },
			{ name: "Tem Bảo Hành", item: "/services/an-pham-bao-bi/tem-bao-hanh" },
		],
		productStructuredData: {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "In Tem Bảo Hành",
			serviceType: "In ấn ấn phẩm bao bì",
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
		title: "Tem Bảo Hành",
		description:
			"Tem bảo hành không chỉ là tờ giấy dán lên sản phẩm — đó là tuyên bố: hàng này chính hãng, thương hiệu này đứng sau chất lượng. Vỡ khi bóc, in QR xác thực, chống làm giả từ trong ra ngoài.",
		image: HERO_IMAGE,
		chips: ["Vỡ khi bóc chống giả mạo", "In QR xác thực", "Đặt từ 10 cái"],
		secondaryCtaLabel: "Xem portfolio",
		ticker: ["Tem Vỡ Khi Bóc", "Tem Hologram Chống Giả", "Tem QR Xác Thực", "Tem Niêm Phong Hộp"],
		stats: [
			{ value: "300", unit: "+", label: "Thương hiệu đã dùng tem" },
			{ value: "10", unit: " cái", label: "Số lượng tối thiểu" },
			{ value: "5.0", unit: "★", label: "Đánh giá từ khách hàng" },
			{ value: "3–4", unit: " ngày", label: "Sản xuất tiêu chuẩn" },
		],
	},
	introduction: {
		eyebrow: "Tem chống giả & bảo hành",
		title: "Một tờ tem nhỏ — *bảo vệ* cả thương hiệu",
		description:
			"Sản phẩm không có tem bảo hành là sản phẩm không có cam kết. Tem bảo hành in tại INUT: vật liệu chuyên dụng vỡ khi bóc, QR xác thực riêng từng tem, keo bám chắc — không thể bóc đi dán lại mà không để lại dấu vết.",
		bullets: [
			"Chất liệu VOID — vỡ thành mảnh hoặc hiện chữ 'VOID' / 'OPENED' khi bóc — không thể dán lại nguyên vẹn.",
			"Tích hợp QR code dẫn đến trang xác thực bảo hành — khách scan là biết ngay hàng thật hay giả.",
			"In serial number, mã lô, tháng năm bảo hành — mỗi tem có thông tin riêng biệt, truy xuất nguồn gốc dễ dàng.",
			"Keo dán chuyên dụng bám chắc trên nhựa, kim loại, thủy tinh — không bong tự nhiên, để lại dấu vết rõ khi bị bóc cố ý.",
			"Cắt die-cut theo hình: tròn, oval, chữ nhật bo góc hoặc hình tùy chỉnh — đặt từ 10 cái, không ép số lượng lớn.",
		],
		highlights: [
			{
				title: "Tem VOID chống bóc",
				description:
					"Lớp vật liệu đặc biệt phá vỡ cấu trúc khi bị bóc — hiện chữ VOID hoặc vỡ thành mảnh, không thể tái sử dụng.",
				icon: <GppBadIcon fontSize="small" />,
			},
			{
				title: "QR xác thực chính hãng",
				description:
					"Mỗi tem in QR riêng dẫn đến trang xác thực — khách scan biết ngay thông tin bảo hành và trạng thái sản phẩm.",
				icon: <QrCode2Icon fontSize="small" />,
			},
			{
				title: "Serial number riêng biệt",
				description:
					"In số serial, mã số sản phẩm, tháng năm bảo hành khác nhau trên từng tem — truy xuất lô hàng và phát hiện hàng giả chính xác.",
				icon: <FingerprintIcon fontSize="small" />,
			},
			{
				title: "Keo bám không để dấu",
				description:
					"Keo chuyên dụng theo bề mặt — bám chắc khi nguyên vẹn, để lại dấu vết rõ ràng hoặc vỡ khi bị bóc cố ý.",
				icon: <SecurityIcon fontSize="small" />,
			},
		],
	},
	types: {
		eyebrow: "Phân loại tem bảo hành",
		title: "Các dòng tem bảo hành INUT thực hiện",
		description:
			"Tem vỡ, tem niêm phong, tem hologram hay tem giấy thông tin — tư vấn đúng loại theo mục đích và mức độ bảo mật thực tế.",
		items: [
			{
				name: "Tem vỡ / Tem VOID",
				description:
					"Vỡ thành mảnh hoặc hiện chữ VOID khi bóc — tiêu chuẩn chống tháo mở cho điện tử, linh kiện, thiết bị kỹ thuật.",
				image: HERO_IMAGE,
			},
			{
				name: "Tem hologram chống giả",
				description:
					"Lớp hologram ánh kim 7 màu — khó sao chép bằng mắt thường, dùng cho hàng chính hãng cần bảo mật cao.",
				image: HERO_IMAGE,
			},
			{
				name: "Tem QR xác thực online",
				description:
					"Mỗi tem in QR riêng — scan xác thực hàng thật, tra cứu thời hạn bảo hành trực tiếp trên web hoặc app thương hiệu.",
				image: HERO_IMAGE,
			},
			{
				name: "Tem niêm phong hộp",
				description:
					"Dán qua khe mở hộp, vỡ khi mở — xác nhận hộp nguyên seal, bảo vệ sản phẩm trong vận chuyển và trưng bày.",
				image: HERO_IMAGE,
			},
			{
				name: "Tem nhựa thông tin bảo hành",
				description:
					"In logo, tháng năm, mã số, hotline — chất liệu nhựa PP bền hơn giấy, chịu ẩm, dùng cho môi trường cầm nắm thường xuyên.",
				image: HERO_IMAGE,
			},
			{
				name: "Tem giấy thông tin cơ bản",
				description:
					"Giấy couche in 1–2 màu, ghi thời hạn và thông tin bảo hành — chi phí tối ưu, phù hợp cửa hàng nhỏ và đại lý.",
				image: HERO_IMAGE,
			},
		],
	},
	whyInut: {
		eyebrow: "Tại sao chọn INUT",
		title: "Tem in tại INUT — *bảo vệ thật*, không chỉ dán cho có",
		description:
			"Tem bảo hành kém chất lượng bị bóc và dán lại không để lại dấu vết — INUT dùng vật liệu chuyên dụng đảm bảo mọi hành vi can thiệp đều bị phát hiện.",
		productionProcess: {
			title: "Quy trình sản xuất chuyên nghiệp",
			items: [
				{
					title: "Tư vấn & Thiết kế",
					description:
						"Xác định bề mặt dán, mức độ bảo mật và thông tin cần in — tư vấn chọn vật liệu VOID, hologram hay kết hợp. File chuẩn 300 DPI, CMYK, bleed 3mm.",
					icon: <DesignServicesIcon fontSize="small" />,
				},
				{
					title: "In & Cắt die-cut",
					description:
						"In UV hoặc offset sắc nét, serial number biến đổi từng tem nếu cần, cắt die-cut chính xác theo kích thước khe dán thực tế.",
					icon: <LocalPrintshopIcon fontSize="small" />,
				},
				{
					title: "Kiểm tra & Bàn giao",
					description:
						"Bóc thử mẫu kiểm tra hiệu ứng VOID, xác nhận QR scan được và serial không trùng — đóng gói theo cuộn hoặc tờ rời tùy yêu cầu.",
					icon: <DoneAllIcon fontSize="small" />,
				},
			],
		},
		applications: {
			title: "Tem bảo hành dùng cho ngành nào?",
			description:
				"Bất kỳ sản phẩm nào cần xác nhận chính hãng và kiểm soát thời hạn bảo hành — tem là lớp bảo vệ đầu tiên và rẻ nhất.",
			items: [
				{
					title: "Điện tử & Linh kiện",
					description:
						"Dán khe ốc vít, cổng kết nối — phát hiện ngay thiết bị bị tháo mở trái phép trước khi tiếp nhận bảo hành.",
					icon: <DevicesIcon fontSize="small" />,
				},
				{
					title: "Mỹ phẩm & Thực phẩm",
					description:
						"Niêm phong nắp chai, hộp sản phẩm — đảm bảo hàng nguyên seal, chưa bị mở hay thay thế nội dung bên trong.",
					icon: <SpaIcon fontSize="small" />,
				},
				{
					title: "Cửa hàng sửa chữa & Đại lý",
					description:
						"Tem ghi tháng năm bảo hành, mã số kỹ thuật viên — kiểm soát tiến trình dịch vụ và giảm tranh chấp khi tiếp nhận lại.",
					icon: <HandymanIcon fontSize="small" />,
				},
				{
					title: "Vận chuyển & Thương mại điện tử",
					description:
						"Tem niêm phong hộp ship — xác nhận hàng nguyên vẹn khi giao đến tay khách, giảm tranh chấp đổi trả.",
					icon: <LocalShippingIcon fontSize="small" />,
				},
			],
		},
		commitment: {
			title: "Cam kết VOID thật, QR scan được, giao đúng hẹn",
			description:
				"Dù đặt 10 hay 100.000 tem — INUT đảm bảo hiệu ứng VOID hoạt động đúng, QR code scan được và serial number không trùng lặp trong toàn bộ lô.",
			icon: <VerifiedIcon />,
		},
	},
	testimonials: {
		eyebrow: "Khách hàng nói gì",
		title: "Tem nhỏ — *tin tưởng lớn* từ phía khách hàng",
		items: [
			{
				name: "TechGear Đà Nẵng",
				role: "Phụ kiện điện tử · Đà Nẵng",
				text: "Trước bị khách khiếu nại thiết bị đã qua sử dụng nhưng không chứng minh được. Dùng tem VOID của INUT — mọi tranh chấp bảo hành giải quyết nhanh vì bóc ra là thấy ngay. Không cần giải thích thêm.",
				initials: "TG",
				color: "#1565c0",
			},
			{
				name: "Linh Organic Beauty",
				role: "Mỹ phẩm · Đà Nẵng",
				text: "Làm tem QR xác thực cho dòng serum, khách scan là ra trang chính hãng ngay. Mấy shop giả muốn làm nhái cũng không qua được — QR mỗi tem khác nhau, không thể photocopy dùng lại.",
				initials: "LO",
				color: "#c2185b",
			},
		],
		score: "5.0★",
		countText: "Dựa trên 300+ thương hiệu đã dùng tem",
	},
	contact: {
		eyebrow: "Đặt hàng ngay",
		description:
			"Cho INUT biết bề mặt dán, loại sản phẩm và mức độ bảo mật cần thiết — tư vấn loại tem phù hợp và báo giá trong 15 phút. Không cần đặt cọc để nhận tư vấn.",
		type: "tem-bao-hanh",
		address: "K574/5 Ông Ích Khiêm, Phường Hải Châu, Thành phố Đà Nẵng",
		persons: [
			{ name: "MR. TOM", role: "Design Manager", phone: "0792 359 996", initial: "TOM" },
			{ name: "MS. BOO", role: "Sales Manager", phone: "0777 208 215", initial: "BOO" },
		],
	},
	gallery: {
		eyebrow: "Sản phẩm thực tế",
		title: "Mẫu tem bảo hành đã in",
		images: Array.from({ length: 8 }).map(
			(_, index) => `/services/an-pham-bao-bi/tem-bao-hanh/${index + 1}.avif`
		),
		filters: ["Tất cả", "Tem VOID", "Tem Hologram", "Tem QR", "Tem Niêm Phong"],
	},
};
