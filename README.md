# Inut Design

**E-commerce platform for custom laptop skins, stickers, and printing services in Da Nang, Vietnam.**

- 🌐 Website: https://inutdesign.com
- 🛠️ CMS Studio: https://inut-design.sanity.studio/

## 🎯 Key Features

- 🛍️ E-commerce for laptop skins and custom products
- 📦 Shopping cart with tiered pricing
- 🔄 Telegram Notifications when new order arrived
- 💳 Order management via Sanity CMS
- 📱 Responsive design (mobile-first)
- 🎨 Custom product visualization
- 📧 Contact forms and quote requests
- 📊 Comprehensive analytics tracking
- 🌐 SEO optimized
- 📝 Blog system with markdown

## Tech Stack

- NextJS 12
- Sanity v2
- MUI v5
- Framer Motion
- unified, Rehype
- SWR
- zustand
- react-hook-form
- Vercel
- Umami.js
- Google Analytics 4
- Google Tag Manager
- Telegram Bot API

## 🛣️ Routing Update (2026-03-17)

The application routing structure has been systematically updated to align with the new product and service hierarchy.

### Key Changes:
- **Product Routes**: Moved from `/products`, `/macnut`, and `/lighters` to `/san-pham/skin-laptop`, `/san-pham/skin-nut-phim`, and `/san-pham/lighters` respectively.
- **Service Routes**: Moved various landing pages (Stickers, Marketing, Office, etc.) into the `/services/` subfolder.
- **Typo Fixes**: Corrected `arcylic-magnet` to `acrylic-magnet` in all paths and references.
- **Redirects**: Implemented 301 (permanent) redirects in `next.config.js` to preserve SEO and existing links.
- **Internal Links**: Updated all `Link` components and `router.push` calls to use the new paths.

For full details, see [APP_ROUTING.md](file:///Users/tin.phamv/work/personal/inut-design/APP_ROUTING.md).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm 9+ (package manager)

### Environment Variables

Create `.env` file in project root:
- See `.env.example` for template.

### Install & Run

**Main Application:**
```bash
pnpm i
pnpm dev
# → http://localhost:3000
```

**Sanity Studio:**
```bash
# Install Sanity CLI v2 globally if needed
npm install -g @sanity/cli@^2

# Setup studio
cd ./sanity
pnpm i
sanity install
pnpm start
# → http://localhost:3333
```

## 📦 Deployment

### Webapp (Vercel)
```bash
git push origin main
# Automatic deployment via Vercel CI/CD
```

### Sanity Studio
```bash
cd sanity
sanity login
sanity deploy
```

## 📚 Documentation

### Analytics & Tracking
- [Analytics Guide](./docs/ANALYTICS_GUIDE.md) - All-in-one setup, implementation, and troubleshooting

### Project Documentation
- [AGENTS Playbook](./AGENTS.md) - AI Agent baseline for multi-editor support
- [App Routing](./APP_ROUTING.md) - Application route structure
- [Analytics Guide](./docs/ANALYTICS_GUIDE.md) - Tracking setup and troubleshooting
- [Sanity Architecture](./sanity/docs/ARCHITECTURE.md) - CMS documentation

### AI Assistant Toolkit
- [Global Rules](./.agents/instructions/global-rules.md) - Core behavior for AI assistants
- [Maintainer Agent](./.agents/agents/inut-maintainer.agent.md) - Specialized agent for large tasks
- [Portable Prompt Pack](./docs/ai/PORTABLE_PROMPTS.md) - Reusable prompt templates
- [Dual Editor Workflow](./docs/ai/DUAL_EDITOR_WORKFLOW.md) - Multi-IDE collaboration guide
- [Scoped Instructions](./.agents/instructions/) - Context-specific AI rules
- [Content Writer Agent](./.agents/agents/inut-content-writer.agent.md) - Specialized agent for Vietnamese SEO copy
 - [Project Skill](./.agents/skills/inut-design-workflow/SKILL.md) - Repeatable implementation workflow
 - [Content Writer Skill](./.agents/skills/inut-content-writer/SKILL.md) - Vietnamese SEO product-content writing system
 - [Prompt Templates](./.agents/prompts/) - Reusable prompts for feature work, bug fixing, and content
- [Write Product Content Prompt](./.agents/prompts/write-product-content.prompt.md) - Guided prompt for content generation
- [Antigravity Workflows](./.agents/workflows/) - Slash-command workflows for Antigravity editor
- [Antigravity Agent Mirrors](./.agents/) - Native agent/skill/prompt files for Antigravity ingestion
- [MCP Tooling Guide](./docs/ai/MCP_TOOLING_GUIDE.md) - Tool/MCP usage playbook for this repo
- [Developer Effectiveness Playbook](./docs/ai/DEVELOPER_EFFECTIVENESS.md) - Fast QA and productivity recommendations

## 🏗️ Project Structure

```
├── api-client/         # API clients (Sanity, Axios)
├── blog/               # Markdown blog posts
├── components/         # React components
│   ├── cart/          # Shopping cart components
│   ├── common/        # Shared components
│   ├── layout/        # Layout components
│   └── product/       # Product components
├── docs/              # Documentation
├── pages/             # Next.js pages
├── public/            # Static assets
├── sanity/            # Sanity CMS config & schemas
├── store/             # Zustand state management
├── styles/            # Global styles
└── utils/             # Utility functions
    └── analytics.ts   # Analytics tracking utilities
```

## 🔧 Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # Lint code
pnpm sanity       # Start Sanity Studio (from root)
```

## 📈 Analytics Events Tracked

See [Analytics Guide](./docs/ANALYTICS_GUIDE.md) for implementation examples and patterns.

## 🤝 Contributing

This is a private project. For development guidelines, see [Copilot Instructions](./.github/copilot-instructions.md).

## 📄 License

Private - All Rights Reserved