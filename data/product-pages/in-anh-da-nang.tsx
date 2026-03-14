import { ProductPageData } from "@/models/product-page";
import BoltIcon from "@mui/icons-material/Bolt";
import CollectionsIcon from "@mui/icons-material/Collections";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import StorefrontIcon from "@mui/icons-material/Storefront";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import TimerIcon from "@mui/icons-material/Timer";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CampaignIcon from "@mui/icons-material/Campaign";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedIcon from "@mui/icons-material/Verified";
import React from "react";

const HERO_IMAGE = "/branding/logo.webp";

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
	},
	introduction: {
		title: "Lưu giữ trọn vẹn khoảnh khắc",
		bullets: [
			"In ảnh nhanh, linh hoạt số lượng từ ít đến nhiều theo mục tiêu sử dụng thực tế.",
			"Màu sắc rõ ràng, bề mặt in đẹp và đồng đều giữa các bản in cùng một lô.",
			"Đa dạng quy cách thành phẩm: ảnh rời, ảnh trưng bày, ảnh sự kiện, ảnh tặng khách hàng.",
			"Tối ưu chi phí cho cá nhân, studio, shop online và doanh nghiệp tổ chức sự kiện.",
			"Đặt hàng nhanh: gửi file ảnh, số lượng và kích thước mong muốn để INUT tư vấn và triển khai.",
		],
		highlights: [
			{
				title: "In ảnh kỹ thuật số là gì?",
				description:
					"Là phương pháp in hiện đại cho chất lượng hình ảnh sắc nét, màu sắc trung thực và thời gian xử lý nhanh.",
				icon: <DesignServicesIcon fontSize="small" />,
			},
			{
				title: "Thiết kế",
				description:
					"Hỗ trợ in ảnh chân dung, ảnh sản phẩm, ảnh sự kiện và ảnh trang trí với nhiều quy cách kích thước khác nhau.",
				icon: <LocalPrintshopIcon fontSize="small" />,
			},
			{
				title: "Quy trình sản xuất",
				description:
					"Nhận file, kiểm tra màu, in kỹ thuật số và hoàn thiện thành phẩm nhanh chóng để đáp ứng đúng tiến độ.",
				icon: <WorkspacePremiumIcon fontSize="small" />,
			},
			{
				title: "Công năng",
				description:
					"Phù hợp cho nhu cầu cá nhân, quà tặng, trưng bày cửa hàng, truyền thông sự kiện và sản phẩm bán lẻ.",
				icon: <BoltIcon fontSize="small" />,
			},
		],
	},
	types: {
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
	contact: {
		description: "Liên hệ ngay để nhận báo giá in ảnh kỹ thuật số nhanh nhất.",
		type: "in-anh",
	},
	gallery: {
		images: Array.from({ length: 17 }).map(() => HERO_IMAGE),
	},
};
