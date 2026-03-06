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

## 🚀 Setup

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
- [Copilot Instructions](./.github/copilot-instructions.md) - Development guidelines
- [Sanity Architecture](./sanity/docs/ARCHITECTURE.md) - CMS documentation

### AI Assistant Toolkit
- [Copilot Repo Instructions](./.github/copilot-instructions.md) - Global agent behavior for this codebase
- [Scoped Instructions](./.github/instructions/) - File-pattern specific instructions (frontend, Sanity, analytics, blog)
- [Maintainer Agent](./.github/agents/inut-maintainer.agent.md) - Specialized agent mode for medium/large tasks
- [Content Writer Agent](./.github/agents/inut-content-writer.agent.md) - Specialized agent mode for Vietnamese SEO product/marketing copy
- [Project Skill](./.github/skills/inut-design-workflow/SKILL.md) - Repeatable implementation workflow
- [Content Writer Skill](./.github/skills/inut-content-writer/SKILL.md) - Vietnamese SEO product-content writing system prompt for INUT Design
- [Prompt Templates](./.github/prompts/) - Reusable prompts for feature work, bug fixing, regression checks, and content writing
- [Write Product Content Prompt](./.github/prompts/write-product-content.prompt.md) - Guided prompt for product name + keyword + audience
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