import { gtag } from "@/utils/analytics";
import { trackUmamiEvent } from "@/utils/umamiAnalytics";
import { getCurrentConsent } from "@/utils/consent";
import { safeCreativaUrl } from "./privacy";
export { isCreativaPath, safeCreativaUrl } from "./privacy";

type Value = string | number | boolean;
type Parameters = Record<string, Value>;
export type CreativaMeasurementItem = {
	item_id: string;
	item_name: string;
	item_category: "skin-laptop";
	item_variant?: string;
	item_list_id?: string;
	index?: number;
	model_id?: string;
	coverage_id?: string;
	price?: number;
	quantity: number;
};

export function measureCreativaLine(line: {
	productId: string;
	productName: string;
	productType: "skin-laptop";
	quantity: number;
	unitPrice: number;
	selection: { modelId: string; coverageId: string; coverageCode?: string };
}): CreativaMeasurementItem {
	return {
		item_id: line.productId,
		item_name: line.productName,
		item_category: line.productType,
		model_id: line.selection.modelId,
		coverage_id: line.selection.coverageId,
		...(line.selection.coverageCode && { item_variant: line.selection.coverageCode }),
		price: line.unitPrice,
		quantity: line.quantity,
	};
}
const allowed = new Set([
	"surface",
	"item_list_id",
	"item_position",
	"item_positions",
	"search_context",
	"entry_point",
	"lookup_source",
	"outcome",
	"action",
	"reason",
	"field",
	"product_id",
	"product_name",
	"product_type",
	"model_id",
	"coverage_id",
	"quantity",
	"previous_quantity",
	"columns",
	"previous_columns",
	"image_index",
	"query_length",
	"results_count",
	"page",
	"item_count",
	"unit_count",
	"value",
	"price_basis",
	"currency",
	"payment_method",
	"shipping_rule",
	"shipping_fee",
	"phase",
	"count_before",
	"count_after",
	"target",
	"cta_name",
	"method",
	"transaction_id",
	"merchandise_value",
	"final_amount",
]);

export function creativaTrackingAllowed(): boolean {
	if (typeof window === "undefined") return false;
	return getCurrentConsent()?.analytics_storage !== "denied";
}

export function trackCreativa(
	event: string,
	parameters: Parameters = {},
	items?: CreativaMeasurementItem[]
) {
	if (!creativaTrackingAllowed()) return;
	const data: Parameters = { storefront: "creativa", currency: "VND" };
	for (const [key, value] of Object.entries(parameters)) {
		if (
			allowed.has(key) &&
			(typeof value === "boolean" ||
				(typeof value === "number" && Number.isFinite(value)) ||
				(typeof value === "string" && value.length <= 250))
		)
			data[key] = value;
	}
	const publicItems = items?.map((item) => ({
		item_id: item.item_id,
		item_name: item.item_name,
		item_category: item.item_category,
		quantity: item.quantity,
		...(item.item_variant && { item_variant: item.item_variant }),
		...(item.model_id && { model_id: item.model_id }),
		...(item.coverage_id && { coverage_id: item.coverage_id }),
		...(item.item_list_id && { item_list_id: item.item_list_id }),
		...(typeof item.index === "number" && Number.isFinite(item.index) && { index: item.index }),
		...(typeof item.price === "number" && Number.isFinite(item.price) && { price: item.price }),
	}));
	gtag("event", event, {
		...data,
		...(publicItems && { items: publicItems }),
		page_location: safeCreativaUrl(window.location.href),
		page_referrer: safeCreativaUrl(document.referrer || "/"),
		page_title: document.title,
	});
	const umamiData: Parameters = { ...data };
	if (publicItems?.length) {
		umamiData.item_count = publicItems.length;
		if (publicItems.length === 1) {
			const item = publicItems[0];
			umamiData.product_id = item.item_id;
			umamiData.product_name = item.item_name;
			umamiData.product_type = item.item_category;
			if (item.model_id) umamiData.model_id = item.model_id;
			if (item.coverage_id) umamiData.coverage_id = item.coverage_id;
			if (item.item_variant) umamiData.item_variant = item.item_variant;
			if (umamiData.quantity === undefined) umamiData.quantity = item.quantity;
			if (item.price !== undefined) umamiData.unit_price = item.price;
		} else {
			const ids = publicItems.map((item) => item.item_id).join(",");
			if (ids.length <= 500) umamiData.product_ids = ids;
			else umamiData.items_omitted = publicItems.length;
		}
	}
	trackUmamiEvent(
		event === "view_item" ? "product_view" : event === "select_item" ? "product_click" : event,
		umamiData
	);
}

export function trackCreativaPage(url: string) {
	if (!creativaTrackingAllowed()) return;
	gtag("event", "page_view", {
		storefront: "creativa",
		page_path: safeCreativaUrl(url),
		page_location: safeCreativaUrl(window.location.href),
		page_referrer: safeCreativaUrl(document.referrer || "/"),
		page_title: document.title,
	});
}

// Static pre-bootstrap code also covers automatic/default collector URL context.
export const CREATIVA_TELEMETRY_BOOTSTRAP = `
(function () {
  function creator(url) {
    try { return /^(?:\\/(?:api\\/)?creativa(?:\\/|$)|\\/_next\\/data\\/[^/]+\\/creativa(?:\\/|$))/.test(new URL(url, location.origin).pathname); }
    catch (_) { return false; }
  }
  function safe(url) {
    if (!url) return url;
    try {
      var parsed = new URL(url, location.origin);
      if (creator(url)) {
        parsed.pathname = parsed.pathname.replace(/^(\\/creativa\\/order-tracking)\\/[^/]+\\/?$/, '$1/[id]');
        parsed.pathname = parsed.pathname.replace(/^(\\/api\\/creativa\\/orders)\\/[A-Za-z0-9_-]{10}\\/?$/, '$1/[id]');
        parsed.pathname = parsed.pathname.replace(/^(\\/_next\\/data\\/[^/]+\\/creativa\\/order-tracking)\\/[^/]+\\.json$/, '$1/[id].json');
        parsed.search = ''; parsed.hash = '';
      }
      return /^https?:/.test(url) ? parsed.href : parsed.pathname + parsed.search + parsed.hash;
    } catch (_) { return '/creativa'; }
  }
  window.creativaSafeUrl = safe;
  if (creator(location.pathname) && window.creativaGoogleId && typeof window.gtag !== 'function') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('js', new Date());
    window.gtag('config', window.creativaGoogleId, {send_page_view:false,page_location:safe(location.href),page_referrer:safe(document.referrer)});
  }
  window.creativaBeforeSend = function (type, payload) {
    var own = creator(location.pathname) || creator(payload.url || '');
    if (own) {
      if (window.creativaUmamiEnabled === false) return false;
      try {
        var consent = JSON.parse(localStorage.getItem('inut_consent_preferences') || 'null');
        if (consent && consent.analytics_storage === 'denied') return false;
      } catch (_) {}
      payload.url = safe(payload.url || location.pathname);
      if (/^\\/creativa\\/order-tracking\\//.test(location.pathname)) payload.title = 'Tra cứu đơn hàng — INUT Creativa';
      if (payload.data) {
        Object.keys(payload.data).forEach(function (key) {
          if (/customer|phone|email|address|note|capability|public.?id|order.?id|order.?number|search.?term|idempotency|print.?asset|production|fit.?reference|artwork|account.?number|account.?holder|account.?name/i.test(key)) delete payload.data[key];
        });
      }
    }
    if (payload.referrer) payload.referrer = safe(payload.referrer);
    return payload;
  };
})();`;
