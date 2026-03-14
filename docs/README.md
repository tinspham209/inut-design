# 📚 Inut Design Documentation

Comprehensive technical documentation for the Inut Design e-commerce platform.

---

## 📋 Available Documents

### 1. **Analytics & Tracking**

#### [ANALYTICS_GUIDE.md](./ANALYTICS_GUIDE.md)
Complete guide for Google Analytics 4 (GA4) integration and event tracking.

**Topics covered:**
- GA4 setup and configuration
- E-commerce event tracking
- Conversion tracking
- Custom event implementation
- Best practices

---

#### [implement__track_event_umami.md](./implement__track_event_umami.md)
Dual tracking implementation guide for Umami.is analytics alongside GA4.

**Topics covered:**
- Privacy-focused analytics with Umami
- Dual tracking strategy (GA4 + Umami)
- Event naming conventions
- Implementation plan
- Testing and verification

**Status:** ✅ Implemented

---

### 3. **Notifications & Integrations**

#### [implement_tele_webhook_send_noti.md](./implement_tele_webhook_send_noti.md)
Complete implementation guide for Telegram order notifications.

**Topics covered:**
- Architecture design and data flow
- Telegram Bot setup
- API route implementation
- Error handling & retry logic

**Status:** ✅ Implemented

---

#### [SHIPPING_FEE_FEATURE.md](./SHIPPING_FEE_FEATURE.md)
Dynamic shipping fee detection and management for the checkout flow.

**Topics covered:**
- Sanity schema for shipping fees
- Region detection (Đà Nẵng vs. nationwide)
- Frontend integration and state management

**Status:** ✅ Implemented

---

### 2. **Performance & Optimization**

#### [ISR-REVALIDATION.md](./ISR-REVALIDATION.md)
Guide for Incremental Static Regeneration (ISR) and on-demand revalidation.

**Topics covered:**
- ISR configuration in Next.js
- On-demand revalidation strategies
- Cache management
- Content freshness optimization

---

### 4. **AI Assistant & Workflow**

#### [ai/DUAL_EDITOR_WORKFLOW.md](./ai/DUAL_EDITOR_WORKFLOW.md)
Guide for multi-IDE (VS Code, Trae, Antigravity) collaboration and consistency.

#### [ai/PORTABLE_PROMPTS.md](./ai/PORTABLE_PROMPTS.md)
A library of editor-agnostic prompt templates for common tasks.

#### [ai/MCP_TOOLING_GUIDE.md](./ai/MCP_TOOLING_GUIDE.md)
How to use Model Context Protocol (MCP) tools within AI-native editors.

#### [ai/DEVELOPER_EFFECTIVENESS.md](./ai/DEVELOPER_EFFECTIVENESS.md)
Best practices for leveraging AI assistants to improve development speed and quality.

#### [ai/DEPLOYMENT_ROLLBACK.md](./ai/DEPLOYMENT_ROLLBACK.md)
Procedures for deploying and rolling back changes safely.

---

## 🗺️ Document Structure

```
docs/
├── README.md                              # This file
├── ANALYTICS_GUIDE.md                     # GA4 analytics guide
├── implement__track_event_umami.md        # Umami tracking guide
├── implement_tele_webhook_send_noti.md    # Telegram notification guide
├── SHIPPING_FEE_FEATURE.md                # Shipping fee logic
├── ISR-REVALIDATION.md                    # ISR and revalidation guide
└── ai/                                    # AI Assistant documentation
    ├── DEPLOYMENT_ROLLBACK.md
    ├── DEVELOPER_EFFECTIVENESS.md
    ├── DUAL_EDITOR_WORKFLOW.md
    ├── MCP_TOOLING_GUIDE.md
    └── PORTABLE_PROMPTS.md
```

---

## 🚀 Quick Start Guides

### For New Developers

1. **Start here:** Read [ANALYTICS_GUIDE.md](./ANALYTICS_GUIDE.md) to understand tracking
2. **Performance:** Review [ISR-REVALIDATION.md](./ISR-REVALIDATION.md) for caching strategies
3. **Privacy:** Check [implement__track_event_umami.md](./implement__track_event_umami.md) for dual analytics

### For Feature Implementation

#### Implementing Telegram Notifications
→ Follow [implement_tele_webhook_send_noti.md](./implement_tele_webhook_send_noti.md)

**Prerequisites:**
- Telegram account
- Access to BotFather
- Vercel environment variables access

**Steps:**
1. Create Telegram Bot (15 min)
2. Configure environment variables (5 min)
3. Implement utilities and API routes (60 min)
4. Update frontend integration (30 min)
5. Test and deploy (20 min)

---

## 📊 Documentation Status

| Document                            | Status        | Last Updated | Priority |
| ----------------------------------- | ------------- | ------------ | -------- |
| ANALYTICS_GUIDE.md                  | ✅ Active      | Oct 2025     | High     |
| implement__track_event_umami.md     | ✅ Implemented | Oct 2025     | Medium   |
| ISR-REVALIDATION.md                 | ✅ Active      | Oct 2025     | Medium   |
| implement_tele_webhook_send_noti.md | 📝 Planned     | Oct 2025     | High     |

---

## 🔗 Related Documentation

### Project Root Documents
- [/.github/copilot-instructions.md](../.github/copilot-instructions.md) - Project overview and conventions
- [/AGENTS.md](../AGENTS.md) - Editor-agnostic AI rules and multi-editor workflow baseline
- [/docs/ai/DUAL_EDITOR_WORKFLOW.md](../docs/ai/DUAL_EDITOR_WORKFLOW.md) - Unified AI workflow across editors
- [/sanity/docs/ARCHITECTURE.md](../sanity/docs/ARCHITECTURE.md) - Sanity CMS architecture
- [/sanity/docs/shopping-cart.md](../sanity/docs/shopping-cart.md) - Shopping cart implementation

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Material-UI Documentation](https://mui.com/material-ui/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

## 🤝 Contributing to Documentation

### Adding New Documentation

1. **Create the document** in `/docs` folder
2. **Follow naming convention**: `implement_<feature>_<description>.md` or `<TOPIC>_GUIDE.md`
3. **Update this README** with document reference
4. **Include these sections**:
   - Overview (Current state, Goals, Expected outcome)
   - Architecture/Design
   - Implementation plan with phases
   - Testing strategy
   - Deployment checklist
   - Troubleshooting
   - Future enhancements

### Documentation Template

```markdown
# 📄 [Feature Name] Implementation

[Brief description]

---

## 🎯 Overview

**Current State:**
- [List current state]

**Goals:**
1. [Goal 1]
2. [Goal 2]

**Expected Outcome:**
- [Expected results]

---

## 🏗️ Architecture Design

[Diagrams and explanations]

---

## 📋 Implementation Plan

### Phase 1: [Phase Name] (Time estimate)
[Steps]

---

## 🧪 Testing Strategy
[Testing approach]

---

## 🚀 Deployment
[Deployment steps]

---

## 🆘 Troubleshooting
[Common issues and solutions]
```

---

## 📝 Document Maintenance

### Review Schedule
- **Monthly**: Review implementation status
- **Quarterly**: Update best practices
- **After major updates**: Revise affected documents

### Deprecation Policy
- Mark outdated sections with ⚠️ WARNING
- Provide migration guide
- Archive old documents to `/docs/archive/`

---

## 🎯 Roadmap

### Planned Documentation

- [ ] **implement_sanity_webhooks.md** - Sanity webhooks for real-time updates
- [ ] **implement_payment_gateway.md** - VNPay/Momo payment integration
- [ ] **implement_inventory_management.md** - Stock tracking system
- [ ] **implement_email_notifications.md** - Sendgrid/Mailgun email system
- [ ] **implement_seo_optimization.md** - SEO best practices
- [ ] **implement_image_optimization.md** - Cloudinary/Next.js Image optimization
- [ ] **DEPLOYMENT_GUIDE.md** - Complete deployment procedures
- [ ] **API_REFERENCE.md** - API routes documentation
- [ ] **SECURITY_GUIDE.md** - Security best practices

---

## 💬 Questions & Support

- **Technical questions:** Check individual document's troubleshooting section
- **Feature requests:** Create GitHub issue with `[docs]` prefix
- **Updates needed:** Submit PR or contact development team

---

**Last Updated:** October 23, 2025  
**Maintained By:** Development Team  
**Version:** 1.0.0
