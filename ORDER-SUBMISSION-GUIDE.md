# Order Submission Implementation Guide

## Overview
This guide explains how order data is submitted to Sanity CMS for the Lighters product line.

## Implementation Summary

### 1. Database Schema (Sanity)
- **Schema File**: `/sanity/schemas/ordersLighter.js`
- **Schema Name**: `ordersLighter`
- **Auto-generated Fields**:
  - `orderNumber`: Format `LIGHT-{timestamp}{random}` (e.g., "LIGHT-1697345678123456")
  - `orderDate`: ISO datetime string

### 2. API Client Functions
- **File**: `/api-client/sanity-client.ts`
- **Main Function**: `createLighterOrder(orderData: CreateOrderLighterInput)`
- **Additional Functions**:
  - `getOrderByNumber(orderNumber: string)` - Retrieve order by order number
  - `updateOrderStatus(orderId: string, status: string)` - Update order status

### 3. Data Flow

#### Checkout Page (`/pages/checkout/lighters.tsx`)
1. User fills out checkout form with:
   - Customer information (name, phone, email)
   - Delivery address
   - Payment method (COD or Bank Transfer)
   - Order notes

2. On form submission (`onSubmit`):
   - Cart items are converted to Sanity reference format:
     ```typescript
     {
       _key: `${productId}-${lighterTypeId}-${timestamp}-${index}`, // Unique key
       product: { _ref: productId, _type: "reference" },
       lighterType: { _ref: lighterTypeId, _type: "reference" },
       quantity: number,
       unitPrice: number,
       subtotal: number
     }
     ```
     **Note**: The `_key` property is required by Sanity for array items and must be unique.
   
   - Order input is created with:
     - `status`: "pending"
     - `paymentStatus`: "pending"
     - `shippingFee`: 0 (can be updated)
     - `discount`: 0 (can be updated)
     - `finalAmount`: totalAmount + shippingFee - discount

   - Order is submitted to Sanity via `createLighterOrder()`
   
   - Response includes:
     - `orderNumber`: Unique order identifier
     - `orderDate`: Creation timestamp
     - All other submitted data

3. Order data is stored in localStorage for confirmation page

4. Cart is cleared

5. User is redirected to order confirmation page

#### Order Confirmation Page (`/pages/order-confirmation/lighters.tsx`)
1. Retrieves order data from localStorage
2. Displays:
   - Order number (if available)
   - Order date and status
   - Customer information
   - Delivery address
   - Payment method
   - Order items with quantities and prices
   - Total amount

3. If payment method is "bank_transfer":
   - Fetches bank account information from Sanity
   - Displays bank transfer instructions
   - Shows QR code (if available)
   - Provides copy-to-clipboard functionality

## Data Models

### CreateOrderLighterInput
```typescript
{
  status: "pending" | "confirmed" | "processing" | "completed" | "cancelled";
  orderItems: OrderItemLighter[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  totalAmount: number;
  shippingFee: number;
  discount: number;
  finalAmount: number;
  notes?: string;
  paymentMethod: "cod" | "bank_transfer";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  adminNotes?: string;
  trackingNumber?: string;
  orderDate?: string; // Optional, auto-generated if not provided
}
```

### OrderItemLighter
```typescript
{
  _key: string; // Required unique key for Sanity array items
  product: {
    _ref: string; // Product ID
    _type: "reference";
  };
  lighterType: {
    _ref: string; // Lighter Type ID
    _type: "reference";
  };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
```

**Important**: The `_key` property is required by Sanity for all array items. It must be a unique string. The format used is:
```
${productId}-${lighterTypeId}-${timestamp}-${index}
```

## Environment Variables Required

Create a `.env.local` file with:

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_TOKEN=your-write-token
```

### How to Get Sanity Token:
1. Go to [sanity.io](https://www.sanity.io/)
2. Navigate to your project
3. Go to **Settings** → **API**
4. Click **Add API token**
5. Give it a name (e.g., "Production Write Token")
6. Select permissions: **Editor** (for write access)
7. Copy the token and add to `.env.local`

## Testing the Implementation

### 1. Test Order Creation
1. Add items to cart on `/lighters` page
2. Navigate to checkout
3. Fill out all required fields
4. Submit order
5. Check browser console for success message
6. Verify redirect to confirmation page

### 2. Verify in Sanity Studio
1. Go to Sanity Studio (usually `localhost:3333` or your deployed studio URL)
2. Navigate to **Orders - Lighters 🔥**
3. Find your newly created order
4. Verify all fields are populated correctly
5. Check that product and lighter type references are correct

### 3. Test Bank Transfer Flow
1. Create an order with payment method "Bank Transfer"
2. On confirmation page, verify:
   - Bank information is displayed
   - QR code appears (if configured in Sanity)
   - Copy buttons work correctly
   - Toast notifications appear on copy

## Common Issues & Solutions

### Issue 1: "Missing keys" warning in Sanity
**Cause**: Array items in Sanity require a unique `_key` property
**Solution**: 
- Each item in the `orderItems` array must have a `_key` property
- The key must be a unique string
- Format: `${productId}-${lighterTypeId}-${timestamp}-${index}`
- This is now automatically handled in the code

### Issue 2: "Failed to create order"
**Cause**: Missing or invalid Sanity token
**Solution**: 
- Verify `NEXT_PUBLIC_SANITY_TOKEN` is set in `.env.local`
- Ensure token has **Editor** permissions
- Restart Next.js dev server after adding token

### Issue 3: Order appears but references are empty
**Cause**: Invalid product or lighter type IDs
**Solution**:
- Verify product IDs in cart match Sanity document IDs
- Check that products exist in Sanity
- Ensure lighter type references are valid

### Issue 4: Bank info not showing
**Cause**: No bank account marked as primary
**Solution**:
- Go to Sanity Studio
- Create or edit a bank account
- Set `isPrimary` to true
- Set `isActive` to true

## Future Enhancements

1. **Email Notifications**:
   - Send confirmation email to customer
   - Notify admin of new orders

2. **Order Tracking**:
   - Add tracking number field
   - Create order tracking page
   - SMS notifications for status updates

3. **Payment Integration**:
   - Integrate with payment gateway (VNPay, MoMo)
   - Automatic payment verification
   - Real-time payment status updates

4. **Shipping Calculator**:
   - Calculate shipping fee based on address
   - Multiple shipping options
   - Delivery time estimates

5. **Discount Codes**:
   - Coupon code system
   - Automatic discount calculation
   - Promotional campaigns

## File Structure
```
/pages
  /checkout
    lighters.tsx                    # Checkout form & order submission
  /order-confirmation
    lighters.tsx                    # Order confirmation display
/api-client
  sanity-client.ts                  # Sanity API functions
  bankInfo.ts                       # Bank info API
/models
  cart.ts                           # TypeScript types
/sanity/schemas
  ordersLighter.js                  # Order schema definition
  bankInfo.js                       # Bank info schema
/store
  cart/lightersCart.ts              # Cart state management
```

## Support & Maintenance

For issues or questions:
1. Check console logs for detailed error messages
2. Verify all environment variables are set
3. Check Sanity Studio for data integrity
4. Review this guide for common solutions

---

**Last Updated**: October 15, 2025
**Version**: 1.0.0
