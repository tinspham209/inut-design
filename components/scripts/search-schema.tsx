export const jsonSearchSchema = `
{
	"@context": "http://schema.org/",
	"@type": "Product",
	"name": "INUT Design - Tiệm may đo skin laptop theo yêu cầu, INUT Design, Inut skin, skin laptop, skin laptop da nang",
	"description": "INUT Design - Cửa Hàng Thời Trang Dành Cho Laptop Tại Đà Nẵng, skin laptop da nang, skin laptop đà nẵng",
	"sku": "skin-laptop-da-nang",
	"url": "https://inutdesign.com",
	"image": [
		"{img_url_1}",
		"{img_url_2}",
		"{img_url_3}",
		"{img_url_4}",
		"{img_url_5}",
		"{img_url_6}"
	],
	"brand": {
		"@type": "Brand",
		"name": "INUT Design"
	},
	"offers": {
		"@type": "Offer",
		"offerCount": 5,
		"lowPrice": 60000,
		"highPrice": 150000,
		"price": 100000,
		"priceCurrency": "VND",
		"priceValidUntil": "2024-12-31",
		"itemCondition": "https://schema.org/UsedCondition",
		"availability": "http://schema.org/InStock",
		"seller": {
			"@type": "Organization",
			"name": "INUT Design"
		},
		"shippingDetails": {
			"@type": "OfferShippingDetails",
			"shippingMethod": "Free shipping",
			"shippingCost": 0,
			"shippingRate": {
				"@type": "MonetaryAmount",
				"value": 0,
				"currency": "VND"
			},
			"shippingDestination": {
				"@type": "DefinedRegion",
				"addressCountry": "VN",
				"addressRegion": ["DN"]
			},
			"deliveryTime": {
				"@type": "ShippingDeliveryTime",
				"handlingTime": {
					"@type": "QuantitativeValue",
					"minValue": 0,
					"maxValue": 1,
					"unitCode": "DAY"
				},
				"transitTime": {
					"@type": "QuantitativeValue",
					"minValue": 1,
					"maxValue": 5,
					"unitCode": "DAY"
				}
			}
		},
		"hasMerchantReturnPolicy": {
			"@type": "MerchantReturnPolicy",
			"refundsAllowed": true,
			"returnPolicyCategory": "http://schema.org/RefundReturnFees",
			"returnFees": {
				"@type": "MonetaryAmount",
				"currency": "VND",
				"value": 15000
			},
			"applicableCountry": "VN"
		}
	},
	"aggregateRating": {
		"@type": "AggregateRating",
		"ratingValue": 4.5,
		"reviewCount": 89
	},
	"review": {
		"@type": "Review",
		"reviewRating": {
			"@type": "Rating",
			"ratingValue": 4.5,
			"bestRating": 5
		},
		"author": {
			"@type": "Person",
			"name": "Tin Pham"
		},
		"datePublished": "2023-03-31",
		"description": "í, lướt fb thấy shop custom xịn sò từng phím còn đang giảm giá nên vẫn sắp xếp đi luôn :)))) trong lúc ngồi đợi vẫn tìm được mấy góc chill. máy mình thì bánh bèo nhưng siêu ưng nè"
	},
	"positiveNotes": {
		"@type": "ItemList",
		"itemListElement": [
			{
				"@type": "ListItem",
				"position": 1,
				"name": "Consistent results"
			},
			{
				"@type": "ListItem",
				"position": 2,
				"name": "Still sharp after many uses"
			}
		]
	},
	"negativeNotes": {
		"@type": "ItemList",
		"itemListElement": [
			{
				"@type": "ListItem",
				"position": 1,
				"name": "Không có skin PPF"
			}
		]
	},
	"potentialAction": {
		"@type": "SearchAction",
		"target": "https://inutdesign.com/search?q={search_term_string}",
		"query-input": "required name=search_term_string"
	}
}
`;
