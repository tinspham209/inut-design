# 📊 Analytics Event Mapping Documentation

## Overview

This document provides a comprehensive mapping of all analytics events tracked in the Inut Design platform, including GA4 standard events, custom events, and Umami events.

## Architecture

The analytics system uses a **dual tracking architecture**:
- **GA4 (Google Analytics 4)**: Primary analytics for business intelligence
- **Umami**: Privacy-focused analytics for GDPR compliance

### Data Flow

```
User Action → Analytics Function → GA4 (gtag) + Umami (umami.track) → DataLayer (GTM)
```

---

## GA4 Standard E-commerce Events

### Product Events

| Event Name | Trigger | Parameters | Custom Dimensions |
|------------|---------|------------|-------------------|
| `view_item` | Product detail page load | `currency`, `value`, `items[]` | `user_type`, `device_type`, `product_category`, `price_range` |
| `select_item` | Product click in list | `item_list_name`, `items[]` | `product_category` |
| `add_to_cart` | Add to cart button | `currency`, `value`, `items[]` | `product_category`, `price_range` |
| `remove_from_cart` | Remove from cart | `currency`, `value`, `items[]` | - |
| `view_item_list` | Product list view | `item_list_name`, `items[]` | `product_category` |

### Checkout Events

| Event Name | Trigger | Parameters | Custom Dimensions |
|------------|---------|------------|-------------------|
| `begin_checkout` | Start checkout | `currency`, `value`, `items[]` | `cart_value`, `items_in_cart` |
| `add_shipping_info` | Shipping info added | `currency`, `value`, `items[]`, `shipping_tier` | - |
| `add_payment_info` | Payment info added | `currency`, `value`, `items[]`, `payment_type` | - |
| `purchase` | Order completed | `transaction_id`, `value`, `items[]` | `customer_segment` |

### GA4 Item Parameters

```typescript
interface GA4Item {
  item_id: string;           // Product ID
  item_name: string;         // Product name
  affiliation?: string;      // "INUT Design"
  coupon?: string;           // Coupon code if applied
  discount?: number;         // Discount amount
  index?: number;            // Position in list
  item_brand?: string;       // "INUT Design"
  item_category?: string;    // Primary category
  item_category2?: string;   // Secondary category
  item_category3?: string;   // Tertiary category
  item_variant?: string;     // Product variant
  item_list_name?: string;   // List name where shown
  price: number;             // Unit price
  quantity: number;          // Quantity
}
```

---

## Custom Events

### Conversion Events

| Event Name | Trigger | Parameters | Business Purpose |
|------------|---------|------------|------------------|
| `contact_click` | Contact button click | `contact_method`, `product_name` | Lead generation tracking |
| `phone_click` | Phone number click | `contact_method: "phone"` | Call tracking |
| `zalo_click` | Zalo button click | `contact_method: "zalo"` | Zalo engagement |
| `form_submit` | Form submission | `form_type` | Form conversion |
| `order_button_click` | Order via Messenger | `product_name`, `product_category` | Messenger orders |

### Engagement Events

| Event Name | Trigger | Parameters | Business Purpose |
|------------|---------|------------|------------------|
| `page_view` | Page load/route change | `page_path`, `page_title` | Page popularity |
| `search` | Search performed | `search_term` | Search behavior |
| `scroll_depth` | Scroll milestone | `depth_percentage` | Content engagement |
| `time_on_page` | Page unload | `page_type`, `time_seconds` | Content quality |
| `video_engagement` | Video interaction | `video_action`, `video_title` | Video performance |

### Navigation Events

| Event Name | Trigger | Parameters | Business Purpose |
|------------|---------|------------|------------------|
| `header_navigation_click` | Header nav click | `nav_item`, `nav_section`, `device` | Navigation patterns |
| `footer_navigation_click` | Footer nav click | `nav_item` | Footer usage |
| `social_click` | Social media click | `social_platform` | Social engagement |
| `outbound_click` | External link click | `link_url` | External traffic |

---

## Custom Dimensions & Metrics

### Custom Dimensions

| Dimension Name | Scope | Values | Description |
|----------------|-------|--------|-------------|
| `user_type` | User | `new`, `returning`, `loyal`, `vip` | User loyalty segment |
| `device_type` | Session | `mobile`, `tablet`, `desktop` | Device category |
| `traffic_source` | Session | `organic`, `paid`, `social`, `direct`, `referral` | Acquisition channel |
| `customer_segment` | User | `champion`, `loyal`, `potential_loyalist`, `promising`, `needs_attention`, `new` | RFM segment |
| `product_category` | Hit | Product categories | Product classification |
| `price_range` | Hit | `budget`, `mid-range`, `premium` | Price tier |
| `engagement_level` | User | `high`, `medium`, `low`, `none` | Engagement score level |

### Custom Metrics

| Metric Name | Scope | Type | Description |
|-------------|-------|------|-------------|
| `engagement_score` | User | Number | Calculated engagement score |
| `cart_value` | Hit | Currency | Current cart total |
| `items_in_cart` | Hit | Number | Number of items in cart |
| `lifetime_value` | User | Currency | Customer lifetime value |
| `purchase_count` | User | Number | Total purchases |

---

## User Properties

| Property Name | Type | Description |
|---------------|------|-------------|
| `customer_id` | String | Unique customer identifier |
| `customer_type` | String | `new`, `returning`, `loyal`, `vip` |
| `lifetime_value` | Number | Total customer spend |
| `purchase_count` | Number | Number of purchases |
| `first_visit_date` | String | First visit timestamp |
| `last_visit_date` | String | Last visit timestamp |
| `engagement_score` | Number | Current engagement score |

---

## DataLayer Events

### Standard DataLayer Structure

```javascript
window.dataLayer.push({
  event: 'event_name',
  ecommerce: { /* GA4 e-commerce data */ },
  user_properties: { /* User properties */ },
  custom_dimensions: { /* Custom dimensions */ },
  // Additional event-specific data
});
```

### DataLayer Event Examples

#### View Item Event
```javascript
{
  event: 'view_item',
  ecommerce: {
    currency: 'VND',
    value: 250000,
    items: [{
      item_id: 'skin-laptop-001',
      item_name: 'Skin Laptop MacBook Pro 14"',
      item_brand: 'INUT Design',
      item_category: 'Laptop Skin',
      item_category2: 'MacBook',
      price: 250000,
      quantity: 1
    }]
  },
  custom_dimensions: {
    user_type: 'returning',
    device_type: 'desktop',
    product_category: 'Laptop Skin',
    price_range: 'mid-range'
  }
}
```

#### Add to Cart Event
```javascript
{
  event: 'add_to_cart',
  ecommerce: {
    currency: 'VND',
    value: 250000,
    items: [{
      item_id: 'skin-laptop-001',
      item_name: 'Skin Laptop MacBook Pro 14"',
      price: 250000,
      quantity: 1
    }]
  },
  custom_dimensions: {
    product_category: 'Laptop Skin',
    price_range: 'mid-range'
  }
}
```

#### Purchase Event
```javascript
{
  event: 'purchase',
  ecommerce: {
    transaction_id: 'ORDER-20260329-001',
    currency: 'VND',
    value: 500000,
    items: [/* purchased items */]
  },
  custom_dimensions: {
    customer_segment: 'loyal'
  },
  user_properties: {
    customer_type: 'returning',
    purchase_count: 3
  }
}
```

---

## Umami Event Mapping

Umami events mirror GA4 events with normalized parameter names:

| GA4 Event | Umami Event | Key Parameters |
|-----------|-------------|----------------|
| `view_item` | `product_view` | `productId`, `productName`, `category`, `price` |
| `select_item` | `product_click` | `productId`, `productName`, `category`, `listName` |
| `add_to_cart` | `add_to_cart` | `productId`, `productName`, `quantity`, `value` |
| `remove_from_cart` | `remove_from_cart` | `productId`, `productName`, `quantity` |
| `begin_checkout` | `begin_checkout` | `itemCount`, `totalValue`, `currency` |
| `purchase` | `purchase` | `orderId`, `itemCount`, `totalValue`, `currency` |
| `contact_click` | `contact_click` | `method`, `productName` |
| `form_submit` | `form_submit` | `formType` |
| `search` | `search` | `searchTerm`, `resultsCount` |

---

## Funnel Tracking

### Checkout Funnel

| Step | Event | Step Number | Description |
|------|-------|-------------|-------------|
| 1 | `view_cart` | 1 | User views cart page |
| 2 | `begin_checkout` | 2 | User starts checkout |
| 3 | `add_shipping_info` | 3 | User enters shipping info |
| 4 | `add_payment_info` | 4 | User enters payment info |
| 5 | `purchase` | 5 | User completes purchase |

### Product Discovery Funnel

| Step | Event | Step Number | Description |
|------|-------|-------------|-------------|
| 1 | `page_view` | 1 | User lands on site |
| 2 | `view_item_list` | 2 | User views product list |
| 3 | `select_item` | 3 | User clicks product |
| 4 | `view_item` | 4 | User views product detail |
| 5 | `add_to_cart` | 5 | User adds to cart |

---

## Engagement Scoring

### Event Weights

| Event Type | Weight | Description |
|------------|--------|-------------|
| `page_view` | 1 | Basic engagement |
| `scroll` | 2 | Content consumption |
| `click` | 3 | Active interaction |
| `search` | 5 | Intent signal |
| `add_to_cart` | 10 | Purchase intent |
| `contact` | 15 | High intent |
| `purchase` | 50 | Conversion |

### User Segments

| Segment | Score Range | Description |
|---------|-------------|-------------|
| `champion` | 500+ | Most engaged users |
| `loyal` | 200-499 | Regular customers |
| `potential_loyalist` | 100-199 | Growing engagement |
| `promising` | 50-99 | Showing interest |
| `needs_attention` | 20-49 | Low engagement |
| `about_to_sleep` | 5-19 | At risk |
| `new` | 0-4 | New users |

---

## Privacy & Consent

### Consent Modes

| Mode | Description |
|------|-------------|
| `analytics_storage` | GA4 analytics cookies |
| `ad_storage` | Advertising cookies |
| `ad_user_data` | User data for ads |
| `ad_personalization` | Personalized ads |
| `functionality_storage` | Site functionality |
| `personalization_storage` | Personalization |
| `security_storage` | Security features |

### Default Behavior

- All consent modes default to `denied` (privacy-first)
- `functionality_storage` and `security_storage` default to `granted`
- User can grant/deny consent via consent banner
- Consent state persisted in localStorage

---

## Testing & Validation

### Debug Mode

In development, all events are logged to console:
```
[GA Debug] view_item { currency: 'VND', value: 250000, items: [...] }
[Umami Debug] product_view { productId: 'skin-laptop-001', ... }
[DataLayer] view_item { event: 'view_item', ecommerce: {...} }
```

### Validation Checklist

- [ ] GA4 Realtime shows events
- [ ] GTM Tag Assistant shows correct tags
- [ ] Umami dashboard shows events
- [ ] No duplicate events
- [ ] Custom dimensions populated
- [ ] E-commerce data complete
- [ ] Consent mode working
- [ ] DataLayer events correct

---

## Implementation Guidelines

### Adding New Events

1. **Define event in `utils/analytics.ts`**
2. **Add corresponding Umami event in `utils/umamiAnalytics.ts`**
3. **Update this documentation**
4. **Add to GA4 custom events configuration**
5. **Create GTM trigger/tag if needed**

### Best Practices

1. **Track at source**: Call tracking at user action, not after API success
2. **Include context**: Always include relevant product/user/page data
3. **Avoid duplicates**: Check for existing tracking before adding
4. **Test in development**: Use console logs to verify
5. **Document changes**: Update this file with new events

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-03-29 | Initial documentation | AI Assistant |
| 2026-03-29 | Added engagement scoring | AI Assistant |
| 2026-03-29 | Added consent management | AI Assistant |
| 2026-03-29 | Added DataLayer specifications | AI Assistant |