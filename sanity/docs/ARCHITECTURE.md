# 🏗️ Sanity CMS Architecture
## Inut Design - Content Management System

**Last Updated**: October 15, 2025  
**Sanity Version**: v2  
**Project ID**: soud11bs  
**Studio URL**: https://inut-design.sanity.studio/

---

## 📋 Table of Contents
1. [Overview](#1-overview)
2. [Project Configuration](#2-project-configuration)
3. [Schema Architecture](#3-schema-architecture)
4. [Content Types](#4-content-types)
5. [Data Relationships](#5-data-relationships)
6. [API Structure](#6-api-structure)
7. [Deployment](#7-deployment)
8. [Best Practices](#8-best-practices)

---

## 1. Overview

### 1.1 Purpose
Sanity CMS serves as the headless content management system for Inut Design's e-commerce platform, managing:
- Product catalog (Lighters, Laptop Skins, MacBook Skins)
- Product categories and types
- Orders and transactions
- Bank transfer information
- Marketing banners

### 1.2 Architecture Pattern
```
┌─────────────────────────────────────────────────────────────────┐
│                      SANITY STUDIO (Admin Panel)                │
│                   https://inut-design.sanity.studio/            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ GraphQL / GROQ API
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                      SANITY CLOUD DATABASE                      │
│                       (Content Lake)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📦 Content Types:                                              │
│  ├─ Products (products, lighterProducts, macnut)               │
│  ├─ Product Types (productType, lighterType, macnutType)       │
│  ├─ Orders (ordersLighter)                                      │
│  ├─ Bank Info (bankInfo)                                        │
│  ├─ Marketing (banner)                                          │
│  └─ Content (blockContent)                                      │
│                                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Sanity Client SDK
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                    NEXT.JS FRONTEND                             │
│                  (inut-design website)                          │
│                                                                 │
│  API Clients:                                                   │
│  ├─ /api-client/sanity-client.ts                               │
│  ├─ /api-client/products.ts                                    │
│  ├─ /api-client/lighters.ts                                    │
│  └─ /api-client/bankInfo.ts                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Key Features
- ✅ **Headless CMS**: API-first content delivery
- ✅ **Real-time Collaboration**: Multiple admins can work simultaneously
- ✅ **Content Validation**: Built-in validation rules
- ✅ **Image Optimization**: Built-in CDN and image processing
- ✅ **Version Control**: Content history and rollback
- ✅ **GROQ Queries**: Powerful query language
- ✅ **TypeScript Support**: Strong typing for content

---

## 2. Project Configuration

### 2.1 Project Structure
```
/sanity
├── config/                      # Sanity Studio configuration
│   ├── .checksums
│   └── @sanity/
│       ├── data-aspects.json
│       ├── default-layout.json
│       ├── default-login.json
│       ├── form-builder.json
│       └── vision.json
│
├── docs/                        # Documentation
│   ├── README.md               # Documentation index
│   ├── ARCHITECTURE.md         # This file
│   └── shopping-cart.md        # Shopping cart implementation
│
├── plugins/                     # Custom plugins (empty)
│   └── .gitkeep
│
├── schemas/                     # Content schemas
│   ├── schema.js               # Schema registry
│   ├── products.js             # Laptop skin products
│   ├── productType.js          # Laptop skin categories
│   ├── lighterProducts.js      # Lighter products
│   ├── lighterType.js          # Lighter categories with pricing
│   ├── macnut.js               # MacBook skin products
│   ├── macnutType.js           # MacBook skin categories
│   ├── ordersLighter.js        # Lighter orders
│   ├── bankInfo.js             # Bank transfer information
│   ├── banner.js               # Homepage banners
│   └── block-content.js        # Rich text content
│
├── static/                      # Static assets
│   └── .gitkeep
│
├── package.json                 # Dependencies
├── sanity.json                  # Main configuration
├── tsconfig.json                # TypeScript config
└── README.md                    # Setup instructions
```

### 2.2 Configuration Files

#### sanity.json
```json
{
  "root": true,
  "project": {
    "name": "INUT"
  },
  "api": {
    "projectId": "soud11bs",
    "dataset": "dev"              // Switch between 'dev' and 'production'
  },
  "plugins": [
    "@sanity/base",               // Core functionality
    "@sanity/default-layout",     // Studio layout
    "@sanity/default-login",      // Authentication
    "@sanity/desk-tool"           // Content management UI
  ],
  "env": {
    "development": {
      "plugins": ["@sanity/vision"]  // GROQ query testing
    }
  },
  "parts": [
    {
      "name": "part:@sanity/base/schema",
      "path": "./schemas/schema"
    }
  ]
}
```

#### Datasets
- **dev**: Development environment for testing
- **production**: Live production data

To switch datasets:
```bash
# Edit sanity.json
"api": {
  "dataset": "production"  # or "dev"
}
```

### 2.3 Dependencies
```json
{
  "dependencies": {
    "@sanity/base": "^2.x",
    "@sanity/default-layout": "^2.x",
    "@sanity/default-login": "^2.x",
    "@sanity/desk-tool": "^2.x",
    "@sanity/vision": "^2.x",
    "react": "^17.x",
    "react-dom": "^17.x",
    "styled-components": "^5.x"
  }
}
```

---

## 3. Schema Architecture

### 3.1 Schema Registry
**File**: `/schemas/schema.js`

All content types are registered here:
```javascript
import createSchema from "part:@sanity/base/schema-creator";
import schemaTypes from "all:part:@sanity/base/schema-type";

// Product schemas
import products from "./products";              // Laptop skins
import productType from "./productType";        // Laptop skin types
import lighterProducts from "./lighterProducts"; // Lighters
import lighterType from "./lighterType";        // Lighter types
import macnut from "./macnut";                  // MacBook skins
import macnutType from "./macnutType";          // MacBook skin types

// Business schemas
import ordersLighter from "./ordersLighter";    // Orders
import bankInfo from "./bankInfo";              // Bank accounts

// Marketing schemas
import banner from "./banner";                  // Banners
import blockContent from "./block-content";     // Rich text

export default createSchema({
  name: "default",
  types: schemaTypes.concat([
    // Product catalog
    products,
    productType,
    macnut,
    macnutType,
    lighterProducts,
    lighterType,
    
    // Business operations
    ordersLighter,
    bankInfo,
    
    // Marketing & content
    banner,
    blockContent,
  ]),
});
```

### 3.2 Schema Types Overview

| Category      | Schema Name       | Title               | Purpose                                |
| ------------- | ----------------- | ------------------- | -------------------------------------- |
| **Products**  | `products`        | Products            | Laptop skin products                   |
|               | `productType`     | Product Type        | Laptop skin categories                 |
|               | `lighterProducts` | Lighters            | Lighter products                       |
|               | `lighterType`     | Lighter Type        | Lighter categories with tiered pricing |
|               | `macnut`          | MacNut              | MacBook skin products                  |
|               | `macnutType`      | MacNut Type         | MacBook skin categories                |
| **Orders**    | `ordersLighter`   | Orders - Lighters 🔥 | Lighter purchase orders                |
| **Banking**   | `bankInfo`        | Bank Information 🏦  | Bank transfer accounts                 |
| **Marketing** | `banner`          | Banner              | Homepage promotional banners           |
| **Content**   | `blockContent`    | Block Content       | Rich text editor content               |

### 3.3 Schema Pattern
Each schema follows this structure:
```javascript
export default {
  name: "schemaName",           // Unique identifier
  title: "Display Title",       // Admin panel title
  type: "document",             // or "object" for nested types
  
  fields: [
    {
      name: "fieldName",
      title: "Field Title",
      type: "string",           // Field type
      validation: (Rule) => Rule.required(),
      description: "Help text"
    }
  ],
  
  preview: {                    // List view configuration
    select: {
      title: "name",
      subtitle: "type",
      media: "image"
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: selection.subtitle,
        media: selection.media
      };
    }
  }
};
```

---

## 4. Content Types

### 4.1 Product Schemas

#### 4.1.1 Laptop Skin Products (`products`)
**File**: `/schemas/products.js`

```javascript
{
  name: "products",
  title: "Products",
  fields: [
    image: image[],              // Multiple images with hotspot
    name: string,                // Product name
    slug: slug,                  // URL-friendly identifier
    details: string,             // Product description
    special: boolean,            // Featured on homepage
    productType: reference       // → productType
  ]
}
```

**Features**:
- Multiple images with smart cropping
- Featured product flag
- Links to product type (category)

**Preview**:
```
⭐ Premium Laptop Skin XYZ
   Skin Laptop Đà Nẵng
```

#### 4.1.2 Product Type (`productType`)
**File**: `/schemas/productType.js`

```javascript
{
  name: "productType",
  title: "Product Type",
  fields: [
    name: string,                // Category name
    slug: slug,                  // URL-friendly identifier
    description: text            // Category description
  ]
}
```

**Examples**:
- "Skin Laptop Đà Nẵng"
- "Skin Gaming Laptop"
- "Skin Laptop Business"

#### 4.1.3 Lighter Products (`lighterProducts`)
**File**: `/schemas/lighterProducts.js`

```javascript
{
  name: "lighterProducts",
  title: "Lighters",
  fields: [
    image: image[],              // Multiple images
    name: string,                // Product name
    slug: slug,                  // URL identifier
    details: string,             // Description
    special: boolean,            // Featured flag
    lighterType: reference       // → lighterType (required)
  ]
}
```

**Preview**:
```
Cricket Lighter Premium
Lighter Type: Cricket Thường
```

#### 4.1.4 Lighter Type (`lighterType`)
**File**: `/schemas/lighterType.js`

```javascript
{
  name: "lighterType",
  title: "Lighter Type",
  fields: [
    name: string,                // Category name
    slug: slug,                  // URL identifier
    description: text,           // Category description
    priceTiers: array[{          // Quantity-based pricing
      quantity: number,          // Min quantity for tier
      price: number              // Price per unit (VND)
    }]
  ]
}
```

**Tiered Pricing Example**:
```javascript
priceTiers: [
  { quantity: 1,   price: 10000 },  // 1-49 pcs:  10,000₫ each
  { quantity: 50,  price: 9000 },   // 50-99 pcs:  9,000₫ each
  { quantity: 100, price: 8000 }    // 100+ pcs:   8,000₫ each
]
```

**Preview**:
```
Cricket Thường
3 price tiers
```

#### 4.1.5 MacNut Products (`macnut`)
**File**: `/schemas/macnut.js`

```javascript
{
  name: "macnut",
  title: "MacNut",
  fields: [
    image: image[],              // Multiple images
    name: string,                // Product name
    slug: slug,                  // URL identifier
    details: string,             // Description
    special: boolean,            // Featured flag
    macnutType: reference        // → macnutType
  ]
}
```

**Purpose**: MacBook-specific skin products

#### 4.1.6 MacNut Type (`macnutType`)
**File**: `/schemas/macnutType.js`

```javascript
{
  name: "macnutType",
  title: "MacNut Type",
  fields: [
    name: string,                // Category name
    slug: slug,                  // URL identifier
    description: text            // Category description
  ]
}
```

**Examples**:
- "MacBook Air 13 inch"
- "MacBook Pro 14 inch"
- "MacBook Pro 16 inch"

---

### 4.2 Order Schema

#### 4.2.1 Lighter Orders (`ordersLighter`)
**File**: `/schemas/ordersLighter.js`

```javascript
{
  name: "ordersLighter",
  title: "Orders - Lighters 🔥",
  fields: [
    // Order Information
    orderNumber: string,         // LIGHT-xxxxx (auto-generated)
    orderDate: datetime,         // Order timestamp
    status: string,              // pending|confirmed|processing|completed|cancelled
    
    // Order Items (Array with _key)
    orderItems: array[{
      _key: string,              // Unique identifier (required!)
      product: reference,        // → lighterProducts
      lighterType: reference,    // → lighterType
      quantity: number,          // Item quantity
      unitPrice: number,         // Price per unit (VND)
      subtotal: number           // unitPrice × quantity
    }],
    
    // Customer Information
    customerName: string,        // Required
    customerPhone: string,       // Required
    customerEmail: string,       // Optional
    deliveryAddress: text,       // Optional
    
    // Pricing
    totalAmount: number,         // Sum of all subtotals
    shippingFee: number,         // Default: 0
    discount: number,            // Default: 0
    finalAmount: number,         // total + shipping - discount
    
    // Payment
    paymentMethod: string,       // cod | bank_transfer
    paymentStatus: string,       // pending|paid|failed|refunded
    
    // Notes
    notes: text,                 // Customer notes
    adminNotes: text,            // Internal admin notes
    trackingNumber: string       // Shipping tracking
  ]
}
```

**Order Number Format**: `LIGHT-{timestamp}{random}`
- Example: `LIGHT-1697345678123`

**Status Flow**:
```
pending → confirmed → processing → completed
                  ↓
              cancelled
```

**Preview**:
```
⏳ LIGHT-1697345678123
   Nguyen Van A | 15/10/2025 | 100,000₫
```

**Important**: Each order item MUST have a `_key` property to satisfy Sanity's array requirements. Format: `${productId}-${lighterTypeId}-${timestamp}-${index}`

---

### 4.3 Banking Schema

#### 4.3.1 Bank Information (`bankInfo`)
**File**: `/schemas/bankInfo.js`

```javascript
{
  name: "bankInfo",
  title: "Bank Information 🏦",
  fields: [
    name: string,                // Internal identifier
    image: image,                // QR code for bank transfer
    bankName: string,            // Full bank name
    bankShortName: string,       // Abbreviation (VCB, TCB, etc.)
    accountNumber: string,       // Bank account number
    accountHolderName: string,   // Account owner name
    isPrimary: boolean,          // Primary account flag
    isActive: boolean,           // Active status
    displayOrder: number,        // Sort order
    notes: text,                 // Additional notes
    createdAt: datetime          // Creation timestamp
  ]
}
```

**Usage**:
- **Primary Account**: Used in checkout flow (isPrimary=true)
- **QR Code**: Uploaded as image for easy scanning
- **Multiple Accounts**: Support for multiple bank accounts

**Example**:
```json
{
  "name": "Main VCB Account",
  "bankName": "Vietcombank",
  "bankShortName": "VCB",
  "accountNumber": "1234567890",
  "accountHolderName": "NGUYEN VAN A",
  "isPrimary": true,
  "isActive": true
}
```

---

### 4.4 Marketing Schema

#### 4.4.1 Banner (`banner`)
**File**: `/schemas/banner.js`

```javascript
{
  name: "banner",
  title: "Banner",
  fields: [
    image: image,                // Banner image with hotspot
    slug: slug,                  // URL identifier
    buttonText: string           // Call-to-action text
  ]
}
```

**Purpose**: Homepage promotional banners

**Preview**:
```
summer-sale-2025
[Banner Image]
```

---

### 4.5 Content Schema

#### 4.5.1 Block Content (`blockContent`)
**File**: `/schemas/block-content.js`

```javascript
{
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    {
      type: "block",             // Rich text block
      styles: [...],             // Heading styles
      lists: [...],              // List types
      marks: {                   // Text decorations
        decorators: [...],       // Bold, italic, etc.
        annotations: [...]       // Links, etc.
      }
    },
    {
      type: "image",             // Inline images
      options: { hotspot: true }
    }
  ]
}
```

**Purpose**: Rich text editor for blog posts, product descriptions, etc.

---

## 5. Data Relationships

### 5.1 Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRODUCT CATALOG                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐                  ┌──────────────────┐
│  lighterType    │◄─────────────────│ lighterProducts  │
│  (Categories)   │    lighterType   │  (Products)      │
│                 │                  │                  │
│ • Cricket       │                  │ • Product A      │
│ • Zippo         │                  │ • Product B      │
│ • Dupont        │                  │   ...            │
│                 │                  │                  │
│ • priceTiers[]  │                  │ • images[]       │
│   - qty: 1      │                  │ • special: bool  │
│   - price: 10k  │                  │                  │
│   - qty: 50     │                  │                  │
│   - price: 9k   │                  │                  │
└─────────────────┘                  └──────────────────┘

┌─────────────────┐                  ┌──────────────────┐
│  productType    │◄─────────────────│    products      │
│  (Categories)   │   productType    │  (Laptop Skins)  │
│                 │                  │                  │
│ • Skin Laptop   │                  │ • Product X      │
│ • Gaming Skin   │                  │ • Product Y      │
└─────────────────┘                  └──────────────────┘

┌─────────────────┐                  ┌──────────────────┐
│   macnutType    │◄─────────────────│      macnut      │
│  (Categories)   │    macnutType    │  (MacBook Skins) │
│                 │                  │                  │
│ • Air 13"       │                  │ • Product M      │
│ • Pro 14"       │                  │ • Product N      │
└─────────────────┘                  └──────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                           ORDERS                                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  ordersLighter   │
│                  │
│ • orderNumber    │
│ • orderDate      │
│ • customer info  │
│                  │
│ • orderItems[]   │─────┬──────────────────────────────────┐
│   [                    │                                  │
│     {                  │                                  │
│       _key,            │ references                       │
│       product: ────────┼─────────────►┌──────────────────┐│
│       lighterType: ────┼────────┐     │ lighterProducts  ││
│       quantity,        │        │     └──────────────────┘│
│       unitPrice,       │        │                          │
│       subtotal         │        │                          │
│     }                  │        └────►┌──────────────────┐│
│   ]                    │              │   lighterType    ││
│                        │              └──────────────────┘│
│ • payment info         │                                  │
│ • status               │                                  │
└────────────────────────┘                                  │
                                                            │
┌─────────────────────────────────────────────────────────┘
│
│  Used in order confirmation when
│  paymentMethod === "bank_transfer"
│
▼
┌──────────────────┐
│    bankInfo      │
│                  │
│ • isPrimary      │◄── Only primary account shown
│ • isActive       │
│ • accountNumber  │
│ • accountHolder  │
│ • QR code image  │
└──────────────────┘
```

### 5.2 Reference Types

#### Product References
```javascript
// In lighterProducts
lighterType: {
  type: "reference",
  to: { type: "lighterType" }
}

// In products
productType: {
  type: "reference",
  to: { type: "productType" }
}

// In macnut
macnutType: {
  type: "reference",
  to: { type: "macnutType" }
}
```

#### Order References
```javascript
// In ordersLighter.orderItems[]
{
  product: {
    _ref: "lighterProducts._id",
    _type: "reference"
  },
  lighterType: {
    _ref: "lighterType._id",
    _type: "reference"
  }
}
```

### 5.3 Query Examples

**Get Lighter Products with Types**:
```groq
*[_type == "lighterProducts"]{
  _id,
  name,
  image,
  slug,
  details,
  special,
  "lighterTypeDetails": lighterType->{
    _id,
    name,
    slug,
    priceTiers
  }
}
```

**Get Order with Full Details**:
```groq
*[_type == "ordersLighter" && orderNumber == $orderNumber][0]{
  ...,
  orderItems[]{
    ...,
    "product": product->{
      _id,
      name,
      image,
      slug
    },
    "lighterType": lighterType->{
      _id,
      name,
      priceTiers
    }
  }
}
```

**Get Primary Bank Account**:
```groq
*[_type == "bankInfo" && isPrimary == true && isActive == true][0]{
  _id,
  name,
  image,
  bankName,
  bankShortName,
  accountNumber,
  accountHolderName
}
```

---

## 6. API Structure

### 6.1 Frontend Integration

#### Sanity Client Configuration
**File**: `/api-client/sanity-client.ts`

```typescript
import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2022-09-19",
  useCdn: true,                    // Use CDN for reads
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN  // For writes
});

// Image URL builder
const builder = imageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);
```

#### Environment Variables
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=soud11bs
NEXT_PUBLIC_SANITY_DATASET=dev          # or 'production'
NEXT_PUBLIC_SANITY_TOKEN=your-token-here
```

### 6.2 API Endpoints

#### Read Operations (CDN cached)
- `useCdn: true` - Fast, cached reads
- Use for: Product listings, public content
- Latency: ~50ms

#### Write Operations (Real-time)
- `useCdn: false` - Direct database writes
- Use for: Order creation, updates
- Requires: Valid auth token
- Latency: ~200ms

### 6.3 GROQ Query Language

**Basic Query**:
```groq
*[_type == "lighterProducts"]
```

**Filtered Query**:
```groq
*[_type == "lighterProducts" && special == true]
```

**With References**:
```groq
*[_type == "lighterProducts"]{
  ...,
  lighterType->
}
```

**Projections**:
```groq
*[_type == "lighterProducts"]{
  _id,
  name,
  "typeId": lighterType._ref
}
```

**Ordering & Limiting**:
```groq
*[_type == "lighterProducts"] | order(_createdAt desc) [0...10]
```

---

## 7. Deployment

### 7.1 Local Development

```bash
# Use Node 22
nvm use 22

# Install dependencies
pnpm install

# Start Sanity Studio locally
pnpm start
# → Opens at http://localhost:3000
```

### 7.2 Production Deployment

```bash
# Authenticate
sanity login

# Deploy to production
sanity deploy

# Access deployed studio
# → https://inut-design.sanity.studio/
```

### 7.3 Dataset Management

**Switch Dataset** (in `sanity.json`):
```json
{
  "api": {
    "dataset": "production"  // or "dev"
  }
}
```

**Create New Dataset**:
```bash
sanity dataset create staging
```

**Export Dataset**:
```bash
sanity dataset export production backup.tar.gz
```

**Import Dataset**:
```bash
sanity dataset import backup.tar.gz staging
```

### 7.4 Continuous Integration

**Recommended CI/CD Flow**:
```yaml
# .github/workflows/sanity-deploy.yml
name: Deploy Sanity Studio

on:
  push:
    branches: [main]
    paths:
      - 'sanity/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '22'
      - run: cd sanity && pnpm install
      - run: cd sanity && pnpm run deploy
        env:
          SANITY_AUTH_TOKEN: ${{ secrets.SANITY_AUTH_TOKEN }}
```

---

## 8. Best Practices

### 8.1 Schema Design

✅ **DO**:
- Use descriptive field names
- Add validation rules
- Include helpful descriptions
- Configure preview displays
- Use references for relationships
- Add unique `_key` to array items

❌ **DON'T**:
- Store computed values
- Create circular references
- Use arrays for large datasets
- Omit required validations

### 8.2 Content Management

✅ **DO**:
- Use slugs for URL-friendly identifiers
- Enable hotspot on images
- Set reasonable image sizes
- Use references instead of duplication
- Add preview configurations

❌ **DON'T**:
- Upload oversized images
- Duplicate content across documents
- Use special characters in slugs
- Forget to set isPrimary for bank accounts

### 8.3 Query Optimization

✅ **DO**:
- Use projections to limit fields
- Add limits to queries
- Use CDN for public content
- Cache query results on frontend
- Use specific filters

❌ **DON'T**:
- Fetch entire documents unnecessarily
- Make multiple queries for same data
- Skip pagination on large datasets
- Use `select` without limits

### 8.4 Security

✅ **DO**:
- Use environment variables for tokens
- Restrict token permissions
- Use read-only tokens for public queries
- Enable CORS restrictions
- Review access logs

❌ **DON'T**:
- Commit tokens to version control
- Use admin tokens in frontend
- Allow anonymous writes
- Share tokens between environments

### 8.5 Data Integrity

✅ **DO**:
- Validate all inputs
- Use required fields appropriately
- Add unique constraints where needed
- Test data migrations
- Backup before major changes

❌ **DON'T**:
- Skip validation rules
- Allow orphaned references
- Delete documents with dependencies
- Make schema changes without testing

---

## 9. Troubleshooting

### 9.1 Common Issues

**Issue**: "Missing keys" warning in array fields
```
Solution: Ensure each array item has a unique _key property
Example: _key: `${id}-${timestamp}-${index}`
```

**Issue**: Images not displaying
```
Check:
1. Image asset exists in Sanity
2. urlFor() helper configured correctly
3. CDN URL accessible
4. CORS settings allow domain
```

**Issue**: References not resolving
```
Check:
1. Referenced document exists
2. Document type matches reference type
3. Use -> in GROQ to dereference
4. Check dataset (dev vs production)
```

**Issue**: Studio not starting
```
Solutions:
1. Clear node_modules and reinstall
2. Check Node version (use v22)
3. Verify sanity.json is valid
4. Check for plugin compatibility
```

### 9.2 Debug Tools

**Sanity Vision** (in Studio):
- Test GROQ queries
- Inspect document structure
- Debug reference chains
- View dataset content

**Browser DevTools**:
- Network tab for API calls
- Console for client errors
- Application tab for localStorage

---

## 10. Migration Guide

### 10.1 Schema Changes

When modifying schemas:

1. **Add fields** (safe):
   ```javascript
   // Just add to fields array
   { name: "newField", type: "string" }
   ```

2. **Rename fields** (requires migration):
   ```javascript
   // Create migration script
   sanity exec migrations/rename-field.js --with-user-token
   ```

3. **Delete fields** (caution):
   ```javascript
   // Data will be lost
   // Export first: sanity dataset export
   ```

4. **Change field types** (complex):
   ```javascript
   // Requires data transformation
   // Test on dev dataset first
   ```

### 10.2 Data Migration Example

```javascript
// migrations/add-display-order.js
import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: 'soud11bs',
  dataset: 'dev',
  token: process.env.SANITY_TOKEN,
  useCdn: false
})

// Add displayOrder to all bankInfo documents
client
  .patch({
    query: '*[_type == "bankInfo" && !defined(displayOrder)]'
  })
  .set({ displayOrder: 0 })
  .commit()
  .then(() => console.log('Migration complete'))
  .catch(err => console.error(err))
```

---

## 11. Performance Optimization

### 11.1 Query Optimization

**Use Projections**:
```groq
// Bad - Fetches everything
*[_type == "lighterProducts"]

// Good - Only needed fields
*[_type == "lighterProducts"]{_id, name, slug}
```

**Add Pagination**:
```groq
// Bad - Fetches all
*[_type == "lighterProducts"]

// Good - Limited results
*[_type == "lighterProducts"][0...20]
```

**Smart References**:
```groq
// Bad - Multiple queries
*[_type == "lighterProducts"]
// Then fetch each lighterType separately

// Good - Single query with dereference
*[_type == "lighterProducts"]{
  ...,
  lighterType->
}
```

### 11.2 Image Optimization

```javascript
// Small thumbnail
urlFor(image).width(100).height(100).url()

// Optimized quality
urlFor(image).width(800).quality(80).url()

// WebP format
urlFor(image).width(800).format('webp').url()

// Auto format (best for browser)
urlFor(image).width(800).auto('format').url()
```

### 11.3 Caching Strategy

```typescript
// Use CDN for public content
const client = sanityClient({
  useCdn: true,
  // cached ~15 min
})

// Bypass CDN for real-time data
const liveClient = sanityClient({
  useCdn: false
})
```

---

## 12. Monitoring & Analytics

### 12.1 Sanity Analytics

Access in Studio:
- Document views
- User activity
- API usage
- Storage metrics

### 12.2 Custom Tracking

```typescript
// Track order creation
const order = await client.create({
  _type: 'ordersLighter',
  // ... order data
})

// Log to analytics
analytics.track('Order Created', {
  orderNumber: order.orderNumber,
  totalAmount: order.totalAmount,
  itemCount: order.orderItems.length
})
```

---

## 13. Conclusion

This Sanity CMS architecture provides:

- ✅ **Scalable Content Model**: Supports multiple product categories
- ✅ **Flexible Schema**: Easy to extend and modify
- ✅ **Type Safety**: Strong typing with references
- ✅ **Developer Experience**: Clean API and powerful queries
- ✅ **Content Validation**: Built-in validation rules
- ✅ **Performance**: CDN caching and optimized queries
- ✅ **Maintainability**: Well-documented and organized

The system is designed to grow with the business while maintaining code quality and performance.

---

**Document Version**: 1.0.0  
**Last Updated**: October 15, 2025  
**Maintained By**: Development Team  
**Next Review**: November 15, 2025
