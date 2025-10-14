# 📚 Sanity Documentation

This directory contains comprehensive documentation for the Sanity CMS integration and shopping cart system.

---

## 📄 Documents

### 1. [ARCHITECTURE.md](./ARCHITECTURE.md) 🏗️
**Purpose**: Sanity CMS architecture and schema documentation  
**Status**: ✅ Up-to-date (October 15, 2025)

**Contents**:
- Complete system architecture overview
- Project configuration details
- Schema documentation (9 content types)
- Data relationships and ERD
- API structure and integration
- GROQ query examples
- Deployment guide
- Best practices and troubleshooting

**Key Sections**:
1. **Overview** - System architecture and purpose
2. **Project Configuration** - Setup and config files
3. **Schema Architecture** - All 9 content types documented
4. **Content Types** - Detailed field documentation
5. **Data Relationships** - ERD and reference diagrams
6. **API Structure** - Frontend integration guide
7. **Deployment** - CI/CD and environment management
8. **Best Practices** - Security, optimization, data integrity

**When to Use**:
- ✅ Understanding Sanity CMS structure
- ✅ Adding new schemas
- ✅ Planning data relationships
- ✅ Optimizing queries
- ✅ Deployment procedures

---

### 3. [shopping-cart.md](./shopping-cart.md) ✨
**Purpose**: Shopping cart implementation guide  
**Status**: ✅ Up-to-date (October 15, 2025)

**Contents**:
- Complete system architecture overview
- Database schema documentation
- Cart store implementation details
- Order submission flow
- Bank transfer integration
- Testing guide
- Troubleshooting guide
- API reference
- Future enhancement plans

**Key Sections**:
1. **System Overview** - High-level architecture
2. **Database Schema** - Sanity schemas for orders and bank info
3. **Cart Store** - Zustand implementation with persistence
4. **Order Flow** - Complete checkout to confirmation process
5. **Bank Transfer** - QR code and copy-to-clipboard features
6. **Key Features** - All implemented features with status
7. **Implementation Details** - File organization and code structure
8. **Testing Guide** - Comprehensive test checklist
9. **Future Enhancements** - Roadmap for upcoming features

**When to Use**:
- ✅ Reference for current implementation
- ✅ Onboarding new developers
- ✅ Understanding data flow
- ✅ Troubleshooting issues
- ✅ Planning future features

---

## 🏗️ Current Implementation Status

### Implemented ✅
- **Lighters Cart System** - Fully functional
- **Order Management** - Complete CRUD operations
- **Bank Transfer Integration** - QR codes and instructions
- **Order Confirmation** - Professional display page
- **TypeScript Types** - Full type safety
- **localStorage Persistence** - Cart survives refresh
- **Tiered Pricing** - Automatic calculation
- **Form Validation** - React Hook Form integration

### Planned 🔮
- Email notifications
- SMS notifications  
- Payment gateway integration (VNPay, MoMo)
- Admin dashboard
- Order tracking system
- Multiple product category carts

---

## 🚀 Quick Start

### For Developers

1. **Read Architecture Decision**:
   ```bash
   # Understand why separate carts were chosen
   cat ARCHITECTURE-COMPARISON.md
   ```

2. **Review Current Implementation**:
   ```bash
   # Get complete system overview
   cat shopping-cart.md
   ```

3. **Check Implementation Files**:
   ```
   /pages/checkout/lighters.tsx
   /pages/order-confirmation/lighters.tsx
   /store/cart/lightersCart.ts
   /api-client/sanity-client.ts
   /sanity/schemas/ordersLighter.js
   ```

### For Administrators

1. **Set Up Bank Transfer**:
   - Go to Sanity Studio
   - Create new Bank Info document
   - Set `isPrimary: true` and `isActive: true`
   - Upload QR code image
   - Fill in bank details

2. **Manage Orders**:
   - Access Sanity Studio
   - Navigate to "Orders - Lighters 🔥"
   - View, update, or export orders

3. **Monitor System**:
   - Check order submissions daily
   - Update order statuses
   - Respond to customer inquiries
   - Review payment confirmations

---

## 📊 System Architecture

```
Frontend (Next.js)
    ↓
Cart Store (Zustand)
    ↓
Checkout Form (React Hook Form)
    ↓
API Client (Sanity Client)
    ↓
Sanity CMS (Database)
    ↓
Order Confirmation
```

---

## 🔑 Key Concepts

### 1. Separate Carts by Route
Each product category has its own independent cart:
- `/lighters` → Lighters Cart
- `/products` → Skin Laptop Cart (future)
- `/macnut` → MacNut Cart (future)

### 2. Zustand State Management
- Centralized cart state
- localStorage persistence
- Automatic rehydration
- Type-safe actions

### 3. Tiered Pricing
- Quantity-based pricing
- Automatic recalculation
- Real-time updates

### 4. Order Submission
- Transform cart items to Sanity format
- Add unique `_key` to array items
- Generate order number (LIGHT-xxxxx)
- Save to CMS

### 5. Bank Transfer
- Primary account selection
- QR code display
- Copy-to-clipboard functionality
- Step-by-step instructions

---

## 🐛 Common Issues

| Issue                   | Document         | Section                   |
| ----------------------- | ---------------- | ------------------------- |
| Missing keys warning    | shopping-cart.md | §8.2 Technical Highlights |
| Cart not persisting     | shopping-cart.md | §11 Troubleshooting       |
| Wrong price calculation | shopping-cart.md | §4.4 Price Calculation    |
| Bank info not showing   | shopping-cart.md | §11 Troubleshooting       |
| Order creation fails    | shopping-cart.md | §11 Troubleshooting       |

---

## 📝 Document Maintenance

### Update Schedule
- **Weekly**: Review for accuracy
- **Monthly**: Update implementation status
- **Quarterly**: Major version updates

### Version History
- **v1.0.0** (Oct 15, 2025) - Initial comprehensive documentation
  - Current implementation documented
  - Architecture comparison added
  - Testing guide included

### Contributing
When updating documentation:
1. Update the "Last Updated" date
2. Increment version number if major changes
3. Update status indicators (✅, 🔮, ❌)
4. Keep code examples accurate
5. Update troubleshooting section with new issues

---

## 🔗 Related Resources

### Internal
- `/ORDER-SUBMISSION-GUIDE.md` - Order submission implementation
- `/models/cart.ts` - TypeScript type definitions
- `/utils/priceCalculator.ts` - Price calculation utilities

### External
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Sanity Documentation](https://www.sanity.io/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 📞 Support

For questions or issues:
1. Check [shopping-cart.md](./shopping-cart.md) troubleshooting section
2. Review [ARCHITECTURE-COMPARISON.md](./ARCHITECTURE-COMPARISON.md) for design decisions
3. Check implementation files for code examples
4. Contact development team for assistance

---

**Last Updated**: October 15, 2025  
**Documentation Status**: ✅ Current  
**Next Review**: October 22, 2025
