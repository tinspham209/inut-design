export const jsonSearchSchema = `
{
	"@context": "http://schema.org/",
	"@type": "Product",
	"name": "INUT Design - Tiệm may đo skin laptop theo yêu cầu, INUT Design, Inut skin, skin laptop, skin laptop da nang",
	"description": "INUT Design - Cửa Hàng Thời Trang Dành Cho Laptop Tại Đà Nẵng, skin laptop da nang, skin laptop đà nẵng",
	"sku": "skin-laptop-da-nang",
	"url": "https://inutdesign.com",
	"image": [
		"https://inutdesign.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fsoud11bs%2Fproduction%2Fd8eb4f865977e824fe06dd517f11744d8df3fbf8-2048x1536.webp%3Fw%3D800&w=3840&q=75",
    "https://inutdesign.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fsoud11bs%2Fproduction%2F3744bb790c106b9557532be1813e37fbffaef6c1-2560x1920.webp%3Fw%3D800&w=3840&q=75",
    "https://inutdesign.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fsoud11bs%2Fproduction%2Fc0e739cdf286f87e92534487ae7be67ff82b4565-2560x1920.webp%3Fw%3D800&w=3840&q=75",
    "https://inutdesign.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fsoud11bs%2Fproduction%2F6fa1827094f475f9542d2a56dca9a4bcef994ad0-2560x1962.webp%3Fw%3D800&w=3840&q=75",
    "https://inutdesign.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fsoud11bs%2Fproduction%2F9a072bdd73b8d7b4c20cfed109eb3f109f99d866-2560x1924.webp%3Fw%3D800&w=3840&q=75",
    "https://inutdesign.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fsoud11bs%2Fproduction%2F7c16454bd72f46dc28d4e5dd79720b16a83ae85a-2560x1912.webp%3Fw%3D800&w=3840&q=75"
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
			"returnPolicyCategory": "http://schema.org/MerchantReturnFiniteReturnWindow",
			"returnFees": {
				"@type": "MonetaryAmount",
				"currency": "VND",
				"value": 15000
			},
			"returnMethod": "https://schema.org/ReturnByMail",
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
