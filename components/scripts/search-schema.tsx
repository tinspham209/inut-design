export const jsonSearchSchema = `
{
  "@context": "http://schema.org/",
  "@type": "Product",
  "name": "INUT Design - Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop, INUT Design, Inut skin, inutdesign, inutskin, skin laptop, skin laptop da nang, skin laptop đà nẵng",
  "description": "INUT Design - Cửa Hàng Thời Trang Dành Cho Laptop Tại Đà Nẵng, skin laptop da nang, skin laptop đà nẵng",
  "sku": "skin-laptop-da-nang",
  "url": "https://inutdesign.com",
  "image": [
    "imgUrl_1",
    "imgUrl_2",
    "imgUrl_3",
    "imgUrl_4",
    "imgUrl_5",
    "imgUrl_6"
  ],
  "brand": {
    "@type": "Brand",
    "name": "INUT Design"
  },
  "offers": {
    "@type": "Offer",
    "price": "100000",
    "priceCurrency": "VND",
    "priceValidUntil": "2024-12-31",
    "availability": "http://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "INUT Design"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingMethod": "Free shipping",
      "shippingCost": "0",
      "deliveryTime": "3-5 business days"
    },
    "hasMerchantReturnPolicy": true
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "100"
  },
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4.5"
    },
    "author": {
      "@type": "Person",
      "name": "Tin Pham"
    },
    "datePublished": "2023-03-31",
    "description": "í, lướt fb thấy shop custom xịn sò từng phím còn đang giảm giá nên vẫn sắp xếp đi luôn :)))) trong lúc ngồi đợi vẫn tìm được mấy góc chill. máy mình thì bánh bèo nhưng siêu ưng nè"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://inutdesign.com/products?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
`;
