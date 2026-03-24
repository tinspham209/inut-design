export const MERCHANT_LISTING_CONFIG = {
	shippingDetails: {
		"@type": "OfferShippingDetails",
		"shippingMethod": "Giao hàng tận nơi",
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
	hasMerchantReturnPolicy: {
		"@type": "MerchantReturnPolicy",
		"refundsAllowed": true,
		"returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
		"returnFees": "https://schema.org/FreeReturn",
		"returnMethod": "https://schema.org/ReturnByMail",
		"applicableCountry": "VN",
		"merchantReturnDays": 1
	}
};
