import { ProductPageData } from "@/models/product-page";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BoltIcon from "@mui/icons-material/Bolt";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import ShieldIcon from "@mui/icons-material/Shield";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TimerIcon from "@mui/icons-material/Timer";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import VerifiedIcon from "@mui/icons-material/Verified";
import CampaignIcon from "@mui/icons-material/Campaign";
import React from "react";

const HERO_IMAGE = "/branding/logo.webp";

export const THANK_CARD_DATA: ProductPageData = {
	id: "thank-card-gift-card",
	name: "Thank Card & Gift Card",
	category: "Sản phẩm lưu niệm",
	seo: {
		title: "In Thank Card, Gift Card Tại Đà Nẵng — Nâng Tầm Thương Hiệu | INUT Design",
		description:
			"Dịch vụ in thank card, gift card tại Đà Nẵng: thiết kế đẹp, đa dạng chất liệu, giá cạnh tranh, sản xuất nhanh từ 10 cái tại INUT Design.",
		url: "https://inutdesign.com/san-pham-luu-niem/thank-card-gift-card",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Thank Card & Gift Card",
		description:
			"Tạo điểm nhấn tinh tế và gắn kết khách hàng với dịch vụ in thank card, gift card chuyên nghiệp: thiết kế chỉn chu và in ấn sắc nét.",
		image: HERO_IMAGE,
		chips: ["In từ 10 cái", "Thiết kế chỉn chu"],
	},
	introduction: {
		title: "Gắn kết khách hàng",
		bullets: [
			"Thank card và gift card giúp tăng trải nghiệm khách hàng, tạo cảm giác chuyên nghiệp và chỉn chu cho thương hiệu.",
			"Gia tăng nhận diện thương hiệu qua logo, màu sắc, chất liệu và thông điệp trên mỗi tấm thẻ.",
			"Dễ kết hợp với đơn hàng, bộ quà tặng, set sản phẩm hoặc campaign theo mùa.",
			"Sản xuất tại xưởng INUT Design Đà Nẵng, tối thiểu từ 10 cái, thời gian hoàn thiện 3–4 ngày làm việc.",
		],
		highlights: [
			{
				title: "Tăng trải nghiệm khách hàng",
				description:
					"Một chiếc thẻ cảm ơn hoặc quà tặng đi kèm đơn hàng tạo cảm giác được trân trọng và đáng nhớ.",
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
					"Tùy chỉnh nội dung, kích thước, chất liệu và phong cách theo từng chiến dịch hoặc bộ sưu tập.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Chi phí hợp lý, hiệu quả cao",
				description:
					"Sản phẩm nhỏ gọn nhưng tạo cảm xúc mạnh, hỗ trợ tốt cho marketing và chăm sóc khách hàng.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
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
	contact: {
		description: "Liên hệ ngay để nhận báo giá in thank card, gift card nhanh nhất.",
		type: "thank-card-gift-card",
	},
	gallery: {
		images: Array.from({ length: 8 }).map(() => HERO_IMAGE),
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
		url: "https://inutdesign.com/san-pham-luu-niem/in-postcard",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "In Postcard Theo Yêu Cầu",
		description:
			"Gói ghém kỷ niệm và thông điệp qua những tấm postcard in ấn tinh tế: từ ảnh du lịch đến quà tặng thương hiệu đầy cảm xúc.",
		image: HERO_IMAGE,
		chips: ["In sắc nét", "Chất liệu cao cấp"],
	},
	introduction: {
		title: "Cầu nối cảm xúc",
		bullets: [
			"Postcard là cầu nối cảm xúc tuyệt vời giữa người gửi và người nhận qua những hình ảnh và dòng chữ viết tay.",
			"Sử dụng công nghệ in kỹ thuật số hiện đại, đảm bảo màu sắc trung thực và chi tiết hình ảnh sắc nét.",
			"Đa dạng lựa chọn chất liệu giấy từ giấy Couche mịn, giấy mỹ thuật có vân đến giấy Kraft mộc mạc.",
			"Hỗ trợ in số lượng linh hoạt, phù hợp cho cá nhân, họa sĩ, nhiếp ảnh gia và doanh nghiệp du lịch.",
			"Sản xuất nhanh chóng tại Đà Nẵng, hỗ trợ kiểm tra file và tư vấn quy cách thành phẩm.",
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
					"Giấy mỹ thuật định lượng cao giúp postcard cứng cáp, sang trọng và bám mực in hoàn hảo.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Thiết kế hai mặt",
				description:
					"Mặt trước in hình ảnh ấn tượng, mặt sau chừa khoảng trống viết tay và dán tem theo quy chuẩn.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
		],
	},
	types: {
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
	contact: {
		description: "Liên hệ ngay để được tư vấn chất liệu giấy và báo giá tốt nhất.",
		type: "in-postcard",
	},
	gallery: {
		images: Array.from({ length: 9 }).map(() => HERO_IMAGE),
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
		url: "https://inutdesign.com/san-pham-luu-niem/moc-khoa-mica",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Móc Khóa Mica Custom",
		description:
			"Biến ý tưởng thành vật phẩm cầm tay xinh xắn với dịch vụ làm móc khóa mica theo yêu cầu: in hình sắc nét, cắt laser chuẩn xác.",
		image: HERO_IMAGE,
		chips: ["In 2 mặt sắc nét", "Cắt laser linh hoạt"],
	},
	introduction: {
		title: "Quà tặng cầm tay ý nghĩa",
		bullets: [
			"Móc khóa mica là vật phẩm quà tặng phổ biến, bền bỉ và dễ dàng cá nhân hóa hình ảnh, logo.",
			"Sử dụng chất liệu mica Đài Loan trong suốt, cứng cáp, không bị ố vàng theo thời gian.",
			"Công nghệ in kỹ thuật số trực tiếp hoặc ép ảnh giữa 2 lớp mica, đảm bảo hình ảnh không bị phai màu.",
			"Cắt laser theo mọi hình dáng yêu cầu: tròn, vuông, hình nhân vật, logo thương hiệu.",
			"Phụ kiện khoen khóa chắc chắn, đa dạng mẫu mã từ inox đến nhựa màu.",
		],
		highlights: [
			{
				title: "Độ bền vượt trội",
				description:
					"Mica chống nước hoàn toàn, chịu được va đập nhẹ và giữ hình ảnh bền đẹp trong quá trình sử dụng.",
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
					"Hình ảnh hiển thị rõ nét từ cả hai phía, tăng hiệu quả thẩm mỹ và nhận diện thương hiệu.",
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
	contact: {
		description: "Liên hệ ngay để được tư vấn thiết kế và nhận báo giá tốt nhất.",
		type: "moc-khoa-mica",
	},
	gallery: {
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
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
		url: "https://inutdesign.com/san-pham-luu-niem/pin-cai-ao-mica",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Pin Cài Áo Mica",
		description:
			"Tạo điểm nhấn cá tính trên trang phục và túi xách với pin cài áo mica in hình theo yêu cầu: màu sắc rực rỡ và cắt laser chuẩn xác.",
		image: HERO_IMAGE,
		chips: ["In UV rực rỡ", "Kim cài an toàn"],
	},
	introduction: {
		title: "Phụ kiện thời trang độc đáo",
		bullets: [
			"Pin cài áo acrylic nhỏ gọn, bắt mắt, phù hợp cá nhân hóa theo từng ý tưởng.",
			"Công nghệ in UV giúp màu bền, sắc nét và chống phai trong quá trình sử dụng.",
			"Có thể sản xuất số lượng nhỏ từ 10 cái, phù hợp cho cá nhân và doanh nghiệp nhỏ.",
			"Hỗ trợ tư vấn cutline, white ink layer và chuẩn file trước khi in.",
			"Sản xuất nhanh trong 3-4 ngày làm việc tại Đà Nẵng và giao hàng toàn quốc.",
		],
		highlights: [
			{
				title: "Pin acrylic là gì?",
				description:
					"Sản phẩm lưu niệm từ mica trong suốt, in UV trực tiếp cho màu sắc rực và độ bền cao.",
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
					"Kiểm tra file, in UV, cắt laser, gắn kim cài và QC từng sản phẩm trước khi giao.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Công năng",
				description:
					"Phù hợp fan merch, quà sự kiện, nhận diện thương hiệu và chiến dịch truyền thông.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
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
	contact: {
		description: "Liên hệ ngay để được tư vấn mẫu pin cài áo mica và nhận báo giá nhanh nhất.",
		type: "pin-cai-ao-mica",
	},
	gallery: {
		images: Array.from({ length: 10 }).map(() => HERO_IMAGE),
	},
};

export const ARCYLIC_MAGNET_DATA: ProductPageData = {
	id: "arcylic-magnet",
	name: "Acrylic Magnet",
	category: "Sản phẩm lưu niệm",
	seo: {
		title: "Làm Acrylic Magnet Theo Yêu Cầu Tại Đà Nẵng | INUT Design",
		description:
			"Dịch vụ làm nam châm mica (acrylic magnet) in hình theo yêu cầu. In UV sắc nét, cắt laser die cut linh hoạt, nam châm lực hút mạnh. Quà tặng merchandise cao cấp.",
		url: "https://inutdesign.com/san-pham-luu-niem/arcylic-magnet",
		thumbnailUrl: HERO_IMAGE,
	},
	hero: {
		title: "Acrylic Magnet",
		description:
			"Nâng tầm vật phẩm lưu niệm với nam châm mica cao cấp: bề mặt bóng gương sang trọng and in UV bền màu.",
		image: HERO_IMAGE,
		chips: ["Bề mặt bóng gương", "Nam châm mạnh"],
	},
	introduction: {
		title: "Nam châm mica cao cấp",
		bullets: [
			"Acrylic Magnet là dòng nam châm mica cao cấp, nổi bật nhờ bề mặt bóng đẹp và độ bền vượt trội.",
			"Phù hợp cho fanart, merchandise, quà tặng doanh nghiệp và các chiến dịch marketing cần điểm chạm thương hiệu.",
			"Gia công theo hình tự do (die cut), cá nhân hóa không giới hạn theo logo, nhân vật hoặc artwork riêng.",
			"Sản xuất tại xưởng INUT Design Đà Nẵng, tối thiểu từ 10 cái, thời gian hoàn thiện 3–4 ngày làm việc.",
		],
		highlights: [
			{
				title: "Bền bỉ vượt trội",
				description:
					"Acrylic dày 3–5mm kết hợp in UV cho độ bền màu cao, chống nước và chống tia UV.",
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
					"Hỗ trợ in theo mọi ý tưởng: logo, nhân vật, ảnh cá nhân, artwork và cắt CNC theo đường cutline riêng.",
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
	contact: {
		description: "Liên hệ ngay để được tư vấn mẫu acrylic magnet và nhận báo giá nhanh nhất.",
		type: "arcylic-magnet",
	},
	gallery: {
		images: Array.from({ length: 12 }).map(() => HERO_IMAGE),
	},
};
