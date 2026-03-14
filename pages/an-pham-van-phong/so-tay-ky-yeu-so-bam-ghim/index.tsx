import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import {
	ContactSection,
	HeroSection,
	NotebookTypesSection,
	IntroductionSection,
	ProductGallery,
	WhyInutSection,
} from "@/components/an-pham-van-phong/so-tay-ky-yeu-so-bam-ghim";
import { UsagePurposeValue } from "@/models";
import { NextPageWithLayout } from "@/models/common";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
import CampaignIcon from "@mui/icons-material/Campaign";
import GroupsIcon from "@mui/icons-material/Groups";
import BoltIcon from "@mui/icons-material/Bolt";
import { Box, Container, Divider } from "@mui/material";
import React, { useEffect } from "react";
import { trackViewProduct } from "@/utils/analytics";

const HERO_IMAGE = "/branding/logo.webp";

const GALLERY_IMAGES = [
	"/branding/services/thiet-ke-in-an.avif",
	"/branding/services/sticker.avif",
	"/branding/services/skin-laptop.avif",
	"/branding/services/skin-nut-phim.avif",
	"/branding/services/nhan-chai-san-pham.avif",
	"/branding/hero-bg.webp",
	"/branding/services/thiet-ke-in-an.avif",
	"/branding/services/sticker.avif",
	"/branding/services/skin-laptop.avif",
	"/branding/services/skin-nut-phim.avif",
	"/branding/services/nhan-chai-san-pham.avif",
	"/branding/logo.webp",
];

const INTRO_BULLETS = [
	"Sổ tay, kỷ yếu và sổ bấm ghim là nhóm ấn phẩm có tính ứng dụng cao trong học tập, công việc và sự kiện.",
	"Dễ cá nhân hóa theo nhu cầu, đồng bộ nhận diện thương hiệu qua màu sắc, logo và thiết kế.",
	"Hỗ trợ nhiều kiểu đóng cuốn: lò xo, keo gáy, bấm ghim phù hợp từng mục đích sử dụng.",
	"Sản xuất từ tối thiểu 10 cuốn, thời gian hoàn thiện 3 - 4 ngày làm việc tại Đà Nẵng.",
];

const HIGHLIGHTS = [
	{
		title: "Sổ tay",
		description:
			"Dùng ghi chép, lên kế hoạch, làm quà tặng thương hiệu hoặc tài liệu nội bộ. Phù hợp đóng lò xo hoặc keo gáy.",
		icon: <MenuBookIcon color="primary" />,
	},
	{
		title: "Kỷ yếu",
		description:
			"Lưu giữ hình ảnh, kỷ niệm và dấu mốc đáng nhớ của lớp học, tổ chức hoặc doanh nghiệp. Đóng keo gáy sang trọng.",
		icon: <SchoolIcon color="primary" />,
	},
	{
		title: "Sổ bấm ghim",
		description:
			"Booklet mỏng, đóng ghim giữa gáy, phù hợp tài liệu đào tạo, booklet giới thiệu hoặc ấn phẩm sự kiện.",
		icon: <DesignServicesIcon color="primary" />,
	},
	{
		title: "Gia công đa dạng",
		description:
			"Cán màng, ép kim, bo góc hoặc gia công bìa theo yêu cầu để tăng độ bền và tính thẩm mỹ.",
		icon: <BoltIcon color="primary" />,
	},
];

const NOTEBOOK_TYPES = [
	{
		name: "Sổ tay",
		description:
			"Ghi chép, lên kế hoạch, quà tặng thương hiệu. Đóng lò xo hoặc keo gáy, ruột Fort 70–100gsm dễ viết.",
		image: "/branding/services/thiet-ke-in-an.avif",
	},
	{
		name: "Kỷ yếu",
		description:
			"Lưu giữ hình ảnh, kỷ niệm tập thể. Đóng keo gáy, ruột Couche cho hình ảnh rõ nét, bìa Ivory sang trọng.",
		image: "/branding/services/sticker.avif",
	},
	{
		name: "Sổ bấm ghim",
		description:
			"Tài liệu mỏng, booklet, sổ ghi chú ngắn. Đóng ghim giữa gáy, đơn giản, gọn gàng và tiết kiệm chi phí.",
		image: "/branding/services/skin-laptop.avif",
	},
];

const SPEC_OPTIONS = [
	"Kích thước phổ biến: A5, A4, A6 hoặc thiết kế kích thước riêng theo yêu cầu.",
	"Độ phân giải: 300 DPI, Hệ màu: CMYK, Bleed (tràn lề): 3 mm.",
	"Font chữ cần convert outline, chừa lề an toàn ở gáy cho sản phẩm nhiều trang.",
	"Bìa: Couche / Ivory / Bristol / Mỹ thuật / Kraft tùy theo phong cách.",
	"Ruột: Fort 70–100gsm (sổ ghi chép) hoặc Couche (kỷ yếu cần hình ảnh đẹp).",
	"Kiểu đóng cuốn: Lò xo, Keo gáy hoặc Bấm ghim tùy theo số trang và mục đích.",
];

const TARGET_CUSTOMERS = [
	"doanh nghiệp",
	"trường học",
	"câu lạc bộ",
	"tổ chức sự kiện",
	"workshop",
];

const APPLICATIONS = [
	{
		title: "Doanh nghiệp",
		description:
			"Sổ tay nhân viên, tài liệu đào tạo nội bộ, sổ quà tặng thương hiệu cho đối tác và khách hàng.",
		icon: <BusinessIcon color="primary" />,
	},
	{
		title: "Trường học & Câu lạc bộ",
		description:
			"Kỷ yếu lớp học, kỷ yếu khóa học, sổ tay sinh hoạt câu lạc bộ hoặc ấn phẩm lưu niệm tập thể.",
		icon: <SchoolIcon color="primary" />,
	},
	{
		title: "Sự kiện & Workshop",
		description:
			"Sổ bấm ghim dùng làm tài liệu hội thảo, booklet giới thiệu chương trình hoặc sổ ghi chú sự kiện.",
		icon: <CampaignIcon color="primary" />,
	},
	{
		title: "Cộng đồng & Tổ chức",
		description:
			"Kỷ yếu dự án, sổ tay lưu niệm chiến dịch, booklet thông tin cho các nhóm cộng đồng.",
		icon: <GroupsIcon color="primary" />,
	},
];

const SoTayKyYeuSoBamGhimPage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "so-tay-ky-yeu-so-bam-ghim",
			name: "Sổ tay, Kỷ yếu, Sổ bấm ghim",
			category: "Ấn phẩm văn phòng",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "In Sổ Tay, Kỷ Yếu, Sổ Bấm Ghim Theo Yêu Cầu | INUT Design",
					description:
						"In sổ tay, kỷ yếu, sổ bấm ghim chuyên nghiệp tại Đà Nẵng. Đa dạng chất liệu, gia công chắc chắn, giá cạnh tranh. Tối thiểu 10 cuốn, sản xuất 3-4 ngày.",
					url: "https://inutdesign.com/an-pham-van-phong/so-tay-ky-yeu-so-bam-ghim",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={INTRO_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<NotebookTypesSection notebookTypes={NOTEBOOK_TYPES} specOptions={SPEC_OPTIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description={`Liên hệ INUT Design để nhận báo giá in sổ tay, kỷ yếu, sổ bấm ghim và tư vấn chất liệu phù hợp cho ${TARGET_CUSTOMERS.join(
							", "
						)}.`}
						type={UsagePurposeValue.SO_TAY_KY_YEU_SO_BAM_GHIM}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

SoTayKyYeuSoBamGhimPage.Layout = MainLayout;

export default SoTayKyYeuSoBamGhimPage;
