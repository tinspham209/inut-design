import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import {
	ContactSection,
	HeroSection,
	CertificateTypesSection,
	IntroductionSection,
	ProductGallery,
	WhyInutSection,
} from "@/components/an-pham-van-phong/giay-khen-giay-chung-nhan";
import { UsagePurposeValue } from "@/models";
import { NextPageWithLayout } from "@/models/common";
import CampaignIcon from "@mui/icons-material/Campaign";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import StorefrontIcon from "@mui/icons-material/Storefront";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
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
	"Thể hiện sự công nhận chính thức, tạo động lực mạnh mẽ.",
	"Nâng cao hình ảnh chuyên nghiệp của đơn vị cấp phát.",
	"Tạo ấn tượng trang trọng và đánh giá cao người nhận.",
	"Lưu trữ thông tin, thành tích và kết quả minh bạch.",
];

const HIGHLIGHTS = [
	{
		title: "Giấy khen vinh danh",
		description:
			"Khen thưởng thành tích, nỗ lực hoặc đóng góp của cá nhân hay tập thể. Mang tính vinh danh, khích lệ và tạo động lực.",
		icon: <WorkspacePremiumIcon color="primary" />,
	},
	{
		title: "Giấy chứng nhận",
		description:
			"Xác nhận kết quả, năng lực, tư cách, sự hoàn thành khóa học hoặc tham gia sự kiện. Có tính xác thực và lưu trữ cao.",
		icon: <SchoolIcon color="primary" />,
	},
	{
		title: "Chất liệu cao cấp",
		description:
			"Đa dạng định lượng giấy như Couche, mỹ thuật, Fort, Ivory bảo đảm độ dày dặn, bám mực tốt và sang trọng.",
		icon: <LocalPrintshopIcon color="primary" />,
	},
	{
		title: "Gia công sau in",
		description:
			"Kết hợp ép kim, dập nổi, cán màng mờ hoặc in nhũ để tăng giá trị thẩm mỹ, đóng khung gỗ sang trọng.",
		icon: <DesignServicesIcon color="primary" />,
	},
];

const CERTIFICATE_TYPES = [
	{
		name: "Giấy khen / Bằng khen",
		description: "Mang tính động viên, vinh danh. Ứng dụng phổ biến tại: Trường học, công ty, các cuộc thi, phong trào thi đua.",
		image: "/branding/services/thiet-ke-in-an.avif",
	},
	{
		name: "Giấy chứng nhận",
		description: "Mang tính xác nhận kết quả, chức minh năng lực chuyên môn. Ứng dụng tại: Khóa học nghiệp vụ, hội thảo, đào tạo.",
		image: "/branding/services/sticker.avif",
	},
];

const SPEC_OPTIONS = [
	"Kích thước phổ biến: A4 (210 × 297 mm), A5 (148 × 210 mm) hoặc thiết kế riêng.",
	"Độ phân giải bản in: 300 DPI, Hệ màu CMYK đảm bảo màu tươi sáng.",
	"Bleed (tràn lề) thiết kế 3 mm, và cần convert outline toàn bộ font chữ.",
	"Kiểm soát file: Căn chỉnh vị trí khung viền, họa tiết mảnh, logo và huy hiệu chuẩn xác trước khi xuất in.",
	"Giấy thông dụng: Couche (mịn, sắc nét), Mỹ thuật (cao cấp), Fort/Bristol/Ivory (cứng cáp, trang trọng).",
];

const TARGET_CUSTOMERS = [
	"doanh nghiệp lớn nhỏ",
	"trường học",
	"trung tâm giáo dục",
	"tổ chức sự kiện",
	"workshop",
];

const APPLICATIONS = [
	{
		title: "Doanh nghiệp",
		description:
			"Khen thưởng nhân viên xuất sắc, chứng nhận đào tạo nội bộ hoặc tôn vinh đối tác.",
		icon: <StorefrontIcon color="primary" />,
	},
	{
		title: "Trường học & Trung tâm",
		description:
			"Tặng giấy khen học tập đạt xuất sắc, giấy chứng nhận hoàn thành khóa học nghiệp vụ.",
		icon: <SchoolIcon color="primary" />,
	},
	{
		title: "Sự kiện & Workshop",
		description:
			"Cấp chứng nhận tham gia cho học viên, giấy chứng nhận tri ân dành cho diễn giả.",
		icon: <CampaignIcon color="primary" />,
	},
	{
		title: "Tổ chức & Câu lạc bộ",
		description: "Vinh danh đóng góp nổi bật, xác nhận tư cách thành viên, đại sứ chiến dịch.",
		icon: <GroupsIcon color="primary" />,
	},
];

const GiayKhenGiayChungNhanPage: NextPageWithLayout = () => {
	useEffect(() => {
		trackViewProduct({
			id: "giay-khen-giay-chung-nhan",
			name: "Giấy Khen Tuyên Dương, Giấy Chứng Nhận",
			category: "Ấn phẩm văn phòng",
		});
	}, []);

	return (
		<>
			<Seo
				data={{
					title: "In Giấy Khen, Giấy Chứng Nhận Chuyên Nghiệp | INUT Design",
					description:
						"In ấn giấy khen, giấy chứng nhận cao cấp tại Đà Nẵng với giấy Couche, Mỹ thuật chuyên nghiệp. Thiết kế chuẩn nhận diện, tùy chọn ép kim sang trọng, nâng tầm uy tín doanh nghiệp.",
					url: "https://inutdesign.com/an-pham-van-phong/giay-khen-giay-chung-nhan",
					thumbnailUrl: HERO_IMAGE,
				}}
			/>

			<Box component="section" bgcolor="background.default" pb={{ xs: 2, md: 3 }}>
				<HeroSection heroImage={HERO_IMAGE} />

				<Container sx={{ py: { xs: 2, md: 3 } }}>
					<IntroductionSection bullets={INTRO_BULLETS} highlights={HIGHLIGHTS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<CertificateTypesSection certificateTypes={CERTIFICATE_TYPES} specOptions={SPEC_OPTIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<WhyInutSection applications={APPLICATIONS} />

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ContactSection
						description={`Liên hệ INUT Design để nhận báo giá in giấy khen, tư vấn thiết kế chuyên nghiệp ứng dụng cho ${TARGET_CUSTOMERS.join(
							", "
						)}.`}
						type={UsagePurposeValue.GIAY_KHEN_GIAY_CHUNG_NHAN}
					/>

					<Divider sx={{ my: { xs: 2, md: 3 } }} />

					<ProductGallery images={GALLERY_IMAGES} />
				</Container>
			</Box>
		</>
	);
};

GiayKhenGiayChungNhanPage.Layout = MainLayout;

export default GiayKhenGiayChungNhanPage;
