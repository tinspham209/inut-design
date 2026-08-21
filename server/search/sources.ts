import { client } from "@/api-client/sanity-browser";
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

export type SearchFacetOption = {
	slug: string;
	name: string;
};

export type SearchCorpus = {
	documents: SearchDocument[];
	facets: SearchFacetOption[];
	legacyTypeSlugs: string[];
};

let pendingCorpus: Promise<SearchCorpus> | null = null;

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
			body: "Thông tin doanh nghiệp, thanh toán, bảo mật, bảo hành, đổi trả và FAQ.",
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

type SanitySearchRecord = {
	_id?: string;
	_type?: string;
	name?: string;
	slug?: string;
	details?: unknown;
	productType?: { name?: string; slug?: string };
	macnutType?: { name?: string; slug?: string };
	lighterType?: { name?: string; slug?: string };
};

const dynamicDocuments = async (): Promise<{
	documents: SearchDocument[];
	facets: SearchFacetOption[];
	legacyTypeSlugs: string[];
}> => {
	const productFields = `_id, _type, name, "slug": slug.current, details, "productType": productType->{name, "slug": slug.current}, "macnutType": macnutType->{name, "slug": slug.current}`;
	const lighterFields = `_id, _type, name, "slug": slug.current, details, "lighterType": lighterType->{name, "slug": slug.current}`;
	const productQuery = `*[_type == "products" && !(_id in path("drafts.**")) && defined(name) && defined(slug.current)]{${productFields}} | order(_createdAt desc)`;
	const macnutQuery = `*[_type == "macnut" && !(_id in path("drafts.**")) && defined(name) && defined(slug.current)]{${productFields}} | order(_createdAt desc)`;
	const lighterQuery = `*[_type == "lighterProducts" && !(_id in path("drafts.**")) && defined(name) && defined(slug.current)]{${lighterFields}} | order(_createdAt desc)`;
	const productTypesQuery =
		'*[_type == "productType" && !(_id in path("drafts.**")) && defined(name) && defined(slug.current)]{name, "slug": slug.current}';
	const macnutTypesQuery =
		'*[_type == "macnutType" && !(_id in path("drafts.**")) && defined(name) && defined(slug.current)]{name, "slug": slug.current}';

	const [products, macnuts, lighters, productTypes, macnutTypes] = await Promise.all([
		client.fetch<SanitySearchRecord[]>(productQuery),
		client.fetch<SanitySearchRecord[]>(macnutQuery),
		client.fetch<SanitySearchRecord[]>(lighterQuery),
		client.fetch<SearchFacetOption[]>(productTypesQuery),
		client.fetch<SearchFacetOption[]>(macnutTypesQuery),
	]);

	const toDocument = (
		record: SanitySearchRecord,
		kind: SearchKind,
		kindLabel: string,
		basePath: string,
		sourcePrecedence: number
	): SearchDocument | null => {
		if (!record._id || !record.name || !record.slug) return null;
		const type =
			kind === "product"
				? record.productType
				: kind === "macnut"
					? record.macnutType
					: record.lighterType;
		const facetSlugs =
			kind === "product" || kind === "macnut"
				? [record.productType?.slug, record.macnutType?.slug].filter(Boolean)
				: [];
		const typeName = type?.name || "";
		return {
			id: record._id,
			url: `${basePath}/${record.slug}`,
			kind,
			kindLabel,
			title: record.name,
			category: typeName || kindLabel,
			slug: record.slug,
			excerpt: typeName,
			body: plainRichText(record.details),
			facetSlugs,
			sourcePrecedence,
		};
	};

	const documents = [
		...products
			.map((record) => toDocument(record, "product", "Skin Laptop", "/san-pham/skin-laptop", 1))
			.filter((record): record is SearchDocument => Boolean(record)),
		...macnuts
			.map((record) =>
				toDocument(record, "macnut", "Skin Nút Phím", "/san-pham/skin-nut-phim", 2)
			)
			.filter((record): record is SearchDocument => Boolean(record)),
		...lighters
			.map((record) =>
				toDocument(record, "lighter", "Bật lửa", "/san-pham/lighters", 3)
			)
			.filter((record): record is SearchDocument => Boolean(record)),
	];

	const facets = [...productTypes, ...macnutTypes].filter(
		(facet): facet is SearchFacetOption => Boolean(facet?.name && facet?.slug)
	);

	return {
		documents,
		facets,
		legacyTypeSlugs: facets.map((facet) => facet.slug),
	};
};

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
	if (pendingCorpus) return pendingCorpus;

	const corpusPromise = buildSearchCorpus();
	pendingCorpus = corpusPromise;
	corpusPromise.then(
		() => {
			if (pendingCorpus === corpusPromise) pendingCorpus = null;
		},
		() => {
			if (pendingCorpus === corpusPromise) pendingCorpus = null;
		}
	);
	return corpusPromise;
}
