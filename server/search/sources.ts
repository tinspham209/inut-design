import {
	ACRYLIC_MAGNET_DATA,
	IN_ANH_DATA,
	IN_POSTCARD_DATA,
	MOC_KHOA_MICA_DATA,
	PIN_CAI_AO_MICA_DATA,
	THANK_CARD_DATA,
} from "@/data/product-pages/san-pham-luu-niem";
import {
	BANNER_STANDEE_DATA,
	HASHTAG_CAM_TAY_DATA,
	HUY_CHUONG_DATA,
	POSTER_DECAL_DATA,
	SU_KIEN_TRON_GOI_DATA,
} from "@/data/product-pages/an-pham-su-kien";
import {
	CATALOGUE_BROCHURE_DATA,
	IN_CARD_VISIT_DATA,
	IN_VOUCHER_VE_MOI_SU_KIEN_THE_TICH_DIEM_DATA,
} from "@/data/product-pages/an-pham-tiep-thi";
import {
	DECAL_NHAN_MAC_DATA,
	HOP_SAN_PHAM_DATA,
	TEM_BAO_HANH_DATA,
} from "@/data/product-pages/an-pham-bao-bi";
import {
	PHIEU_VE_HOA_DON_GTGT_DATA,
	SAN_PHAM_DECOR_DATA,
	TAM_LOT_BAN_AN_DATA,
	THIET_KE_IN_MENU_DATA,
} from "@/data/product-pages/an-pham-fb";
import {
	LIGHTERS_CUSTOMIZE_DATA,
	SKIN_DIEN_THOAI_DATA,
	SKIN_LAPTOP_DATA,
	SKIN_NUT_PHIM_DATA,
} from "@/data/product-pages/ca-nhan-hoa";
import {
	BANG_CUNG_IN_THONG_TIN_DATA,
	GIAY_KHEN_DATA,
	IN_BI_THU_DATA,
	SO_TAY_DATA,
} from "@/data/product-pages/an-pham-van-phong";
import {
	STICKER_DIECUT_DATA,
	STICKER_KISSCUT_DATA,
	STICKER_MAGNET_DATA,
	STICKER_PACK_DATA,
	STICKER_SHEET_DATA,
} from "@/data/product-pages/sticker";
import { ROUTE_LIST, CREATIVA_ROUTE_LIST, RouteItem } from "@/components/common/header/routes";
import { ProductPageData } from "@/models/product-page";
import { getPostList } from "@/utils/posts";
import { createExpiringPromiseCache, SEARCH_CORPUS_TTL_MS } from "./expiring-promise-cache";
import { dynamicDocuments, SearchFacetOption } from "./dynamic-sources";
export { dynamicDocuments, SEARCH_DYNAMIC_SOURCES_QUERY } from "./dynamic-sources";
export type { SearchFacetOption } from "./dynamic-sources";
import {
	normalizeSearchText,
	SearchDocument,
	SearchKind,
} from "./domain";

const SITE_URL = "https://inutdesign.com";

const PRODUCT_PAGE_DATA: ProductPageData[] = [
	ACRYLIC_MAGNET_DATA,
	IN_ANH_DATA,
	IN_POSTCARD_DATA,
	MOC_KHOA_MICA_DATA,
	PIN_CAI_AO_MICA_DATA,
	THANK_CARD_DATA,
	BANNER_STANDEE_DATA,
	HASHTAG_CAM_TAY_DATA,
	HUY_CHUONG_DATA,
	POSTER_DECAL_DATA,
	SU_KIEN_TRON_GOI_DATA,
	CATALOGUE_BROCHURE_DATA,
	IN_CARD_VISIT_DATA,
	IN_VOUCHER_VE_MOI_SU_KIEN_THE_TICH_DIEM_DATA,
	DECAL_NHAN_MAC_DATA,
	HOP_SAN_PHAM_DATA,
	TEM_BAO_HANH_DATA,
	PHIEU_VE_HOA_DON_GTGT_DATA,
	SAN_PHAM_DECOR_DATA,
	TAM_LOT_BAN_AN_DATA,
	THIET_KE_IN_MENU_DATA,
	LIGHTERS_CUSTOMIZE_DATA,
	SKIN_DIEN_THOAI_DATA,
	SKIN_LAPTOP_DATA,
	SKIN_NUT_PHIM_DATA,
	BANG_CUNG_IN_THONG_TIN_DATA,
	GIAY_KHEN_DATA,
	IN_BI_THU_DATA,
	SO_TAY_DATA,
	STICKER_DIECUT_DATA,
	STICKER_KISSCUT_DATA,
	STICKER_MAGNET_DATA,
	STICKER_PACK_DATA,
	STICKER_SHEET_DATA,
];

export type SearchCorpus = {
	documents: SearchDocument[];
	facets: SearchFacetOption[];
	legacyTypeSlugs: string[];
};

export { SEARCH_CORPUS_TTL_MS } from "./expiring-promise-cache";
const corpusCache = createExpiringPromiseCache<SearchCorpus>(SEARCH_CORPUS_TTL_MS);

const isExcludedPath = (path: string): boolean =>
	/^\/(search|api|cart|checkout|order-tracking|builder)(\/|$)/.test(path);

const routeKind = (path: string): SearchKind => {
	if (path.startsWith("/services")) return "service";
	return "information";
};

const routeCategory = (path: string): string => {
	if (path.startsWith("/services")) return "Dịch vụ";
	if (path.startsWith("/san-pham")) return "Sản phẩm";
	return "INUT Design";
};

const routeDocuments = (): SearchDocument[] => {
	const routes = [...ROUTE_LIST, ...CREATIVA_ROUTE_LIST];
	const documents: SearchDocument[] = [];
	const seen = new Set<string>();

	const visit = (route: RouteItem) => {
		if (!isExcludedPath(route.path) && !seen.has(route.path)) {
			seen.add(route.path);
			documents.push({
				id: `route:${route.path}`,
				url: route.path,
				kind: routeKind(route.path),
				kindLabel: routeKind(route.path) === "service" ? "Dịch vụ" : "Trang thông tin",
				title: route.label.trim(),
				category: routeCategory(route.path),
				slug: route.path,
				excerpt: route.meta?.description || "",
				body: route.meta?.description || "",
				sourcePrecedence: 40,
			});
		}
		route.children?.forEach(visit);
	};

	routes.forEach(visit);
	return documents;
};

const staticPageDocuments = (): SearchDocument[] => {
	const pages: Array<{
		url: string;
		title: string;
		description: string;
		body?: string;
	}> = [
		{
			url: "/",
			title: "INUT Design",
			description: "In sticker, bật lửa, skin laptop và skin nút phím tại Đà Nẵng.",
			body: "Thiết kế và in ấn cá nhân hóa, giao toàn quốc, báo giá nhanh.",
		},
		{
			url: "/about-us",
			title: "Về chúng tôi",
			description:
				"Tìm hiểu về INUT Design và hành trình sáng tạo. Giải pháp in ấn sticker và sản phẩm cá nhân hóa chất lượng cao tại Đà Nẵng.",
		},
		{
			url: "/contact",
			title: "Liên hệ",
			description:
				"Thiết kế và in ấn, skin laptop, sticker, decal, thiệp, card và tem nhãn tại Đà Nẵng.",
			body: "Địa chỉ K574/5 Ông Ích Khiêm, Đà Nẵng. Điện thoại và giờ làm việc của INUT Design.",
		},
		{
			url: "/contact/form",
			title: "Đăng ký nhận tư vấn, báo giá",
			description:
				"Điền thông tin để nhận tư vấn, báo giá về thiết kế, in ấn tại Đà Nẵng. INUT Design sẽ liên hệ bạn sớm nhất.",
		},
		{
			url: "/blog",
			title: "Blog",
			description: "Kiến thức về skin laptop, in ấn, sticker và thiết kế tại Đà Nẵng.",
		},
		{
			url: "/policies-terms",
			title: "Chính sách và Điều khoản",
			description:
				"Chính sách, điều khoản sử dụng, thông tin doanh nghiệp và câu hỏi thường gặp tại INUT Design.",
			body: "Thông tin doanh nghiệp, thanh toán, bảo mật, duyệt in và sản xuất, bảo hành, đổi trả và FAQ.",
		},
		{
			url: "/policies-terms/thong-tin-doanh-nghiep",
			title: "Thông tin doanh nghiệp",
			description: "Thông tin pháp lý và liên hệ của Công ty TNHH INUT DESIGN.",
			body: "Tên đơn vị sở hữu, người đại diện pháp luật, mã số thuế, địa chỉ, số điện thoại và email.",
		},
		{
			url: "/policies-terms/thong-tin-thanh-toan",
			title: "Hướng dẫn thanh toán",
			description: "Thông tin thanh toán khi nhận hàng COD và chuyển khoản ngân hàng.",
			body: "Thanh toán khi nhận hàng, chuyển khoản qua tài khoản ngân hàng, phương thức thanh toán.",
		},
		{
			url: "/policies-terms/dieu-khoan-su-dung",
			title: "Điều khoản sử dụng",
			description: "Quy định sử dụng website và dịch vụ tại INUT Design.",
			body: "Phạm vi áp dụng, điều kiện sử dụng dịch vụ, quyền lợi và nghĩa vụ khách hàng, sở hữu trí tuệ, thanh toán và giá cả.",
		},
		{
			url: "/policies-terms/chinh-sach-bao-ve-thong-tin-khach-hang",
			title: "Chính sách bảo vệ thông tin cá nhân khách hàng",
			description: "Chính sách bảo vệ thông tin cá nhân khách hàng của INUT DESIGN.",
			body: "Mục đích thu thập, phạm vi sử dụng, thời gian lưu trữ, chỉnh sửa dữ liệu cá nhân và giải quyết khiếu nại.",
		},
		{
			url: "/policies-terms/chinh-sach-duyet-in-va-san-xuat",
			title: "Chính sách duyệt in và sản xuất",
			description:
				"Quy định xác nhận duyệt in, sai lệch màu sắc, trách nhiệm sản xuất và khiếu nại tại INUT Design.",
			body: "Khách hàng kiểm tra thiết kế, nội dung, kích thước, số lượng, chất liệu, màu sắc và quy cách gia công trước khi duyệt in. Độ tương đồng màu sắc khoảng 90–95%. Sản xuất theo lệnh in hoặc mẫu đã xác nhận. Kiểm tra và phản hồi kèm hình ảnh/video trong vòng 03 ngày kể từ khi nhận hàng.",
		},
		{
			url: "/policies-terms/chinh-sach-bao-hanh-doi-tra",
			title: "Chính sách bảo hành và đổi trả",
			description: "Chính sách bảo hành và đổi trả sản phẩm tại INUT Design.",
			body: "Cam kết chất lượng, điều khoản đổi trả, thời gian áp dụng, hoàn tiền và chi phí vận chuyển.",
		},
		{
			url: "/policies-terms/faqs",
			title: "FAQS - Câu hỏi thường gặp",
			description: "Câu hỏi thường gặp về INUT Design.",
			body: "Câu hỏi thường gặp về sản phẩm, dịch vụ, thanh toán và in ấn.",
		},
		{
			url: "/creativa",
			title: "inut.creativa",
			description:
				"Thương hiệu merchandise cho cộng đồng running, trail và trekking: khung kỷ niệm race, sticker, phụ kiện và quà tặng sự kiện.",
		},
	];

	return pages.map((page) => ({
		id: `page:${page.url}`,
		url: page.url,
		kind: "information",
		kindLabel: "Trang thông tin",
		title: page.title,
		category: "INUT Design",
		slug: page.url,
		excerpt: page.description,
		body: page.body || page.description,
		sourcePrecedence: 30,
	}));
};

const plainRichText = (value: unknown): string => {
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.map(plainRichText).filter(Boolean).join(" ");
	if (!value || typeof value !== "object") return "";

	const record = value as { text?: unknown; children?: unknown };
	if (record.text) return plainRichText(record.text);
	if (record.children) return plainRichText(record.children);
	return "";
};

const productPageBody = (data: ProductPageData): string =>
	[
		data.hero.title,
		data.hero.description,
		...(data.hero.chips || []),
		data.introduction.title,
		data.introduction.description,
		...(data.introduction.bullets || []),
		...(data.introduction.highlights || []).flatMap((item) => [item.title, item.description]),
		data.types.title,
		data.types.description,
		...(data.types.items || []).flatMap((item) => [item.name, item.description]),
		data.whyInut.title,
		data.whyInut.description,
		data.whyInut.productionProcess?.title,
		...(data.whyInut.productionProcess?.items || []).flatMap((item) => [
			item.title,
			item.description,
		]),
		data.whyInut.applications.title,
		data.whyInut.applications.description,
		...(data.whyInut.applications.items || []).flatMap((item) => [item.title, item.description]),
		data.contact.title,
		data.contact.description,
		...(data.gallery.images || []),
		...(data.testimonials?.items || []).flatMap((item) => [item.name, item.role, item.text]),
	]
		.filter(Boolean)
		.join(" ");

const productPageDocuments = (): SearchDocument[] =>
	PRODUCT_PAGE_DATA.map((data) => {
		const url = data.seo.url.replace(SITE_URL, "") || "/";
		return {
			id: `service:${data.id}`,
			url,
			kind: "service",
			kindLabel: "Dịch vụ",
			title: data.name,
			category: data.category,
			slug: url,
			excerpt: data.seo.description,
			body: productPageBody(data),
			sourcePrecedence: 10,
		};
	});

const blogDocuments = async (): Promise<SearchDocument[]> => {
	const posts = await getPostList();
	return posts.map((post) => {
		if (!post.slug || !post.title) {
			throw new Error("A blog post is missing required searchable metadata");
		}
		return {
			id: `blog:${post.slug}`,
			url: `/blog/${post.slug}`,
			kind: "blog",
			kindLabel: "Bài viết",
			title: post.title,
			category: "Blog",
			slug: post.slug,
			excerpt: post.description,
			body: plainRichText(post.mdContent),
			sourcePrecedence: 20,
		};
	});
};

async function buildSearchCorpus(): Promise<SearchCorpus> {
	const [dynamic, blogs] = await Promise.all([dynamicDocuments(), blogDocuments()]);
	const documents = [
		...routeDocuments(),
		...staticPageDocuments(),
		...productPageDocuments(),
		...blogs,
		...dynamic.documents,
	];

	const uniqueFacets = new Map<string, SearchFacetOption>();
	for (const facet of dynamic.facets) {
		const slug = normalizeSearchText(facet.slug);
		if (!uniqueFacets.has(slug)) uniqueFacets.set(slug, facet);
	}

	return {
		documents,
		facets: Array.from(uniqueFacets.values()),
		legacyTypeSlugs: dynamic.legacyTypeSlugs,
	};
}

export function getSearchCorpus(): Promise<SearchCorpus> {
	return corpusCache.get(buildSearchCorpus);
}
