# Inut Design

**Production commerce and product-design platform for custom printing in Da Nang, Vietnam.**

- 🌐 Website: https://inutdesign.com
- 🛠️ CMS Studio: https://inut-design.sanity.studio/
- ☁️ Hosting: Cloudflare Workers (`inutdesign-web`)
- 📦 Runtime: Next.js Pages Router + Vinext/Vite on Cloudflare

## 🎯 Key Features

- 🛍️ Commerce for laptop skins, lighter products, Creativa and custom goods
- 📦 Shopping cart with tiered pricing
- 🎨 Lighter and keychain design builders
- 🔄 Telegram notifications for approved order/contact flows
- 💳 Order management via Sanity CMS
- 📱 Responsive design (mobile-first)
- 📧 Contact forms and quote requests
- 📊 GA4/GTM and Umami tracking with privacy allow-lists
- 🌐 Static SEO, sitemap and redirect contracts
- 🔎 Build-time static search index
- 📝 Markdown blog pipeline

## Tech Stack

- Next.js 15.5.29 / React 19.3.1
- Vinext 1.4.6 / Vite 8
- Sanity v2 Studio and `@sanity/client` 7
- MUI 5, Emotion, Zustand, SWR, React Hook Form
- Markdown processing with unified/remark/rehype
- Cloudflare Workers and static assets
- Google Analytics 4, Google Tag Manager and optional Umami
- Telegram Bot API

## Routing

- Products: `/san-pham/skin-laptop`, `/san-pham/skin-nut-phim`,
  `/san-pham/lighters`
- Creativa: `/creativa` and `/creativa/skin-laptop/*`
- Builders: `/builder/lighters` and `/builder/keychain`
- Services: `/services/*`
- Redirects and headers are defined in `next.config.js`; generated routes are
  reconciled by the migration manifest scripts.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>=22 <26`
- pnpm `11.5.3`
- Cloudflare authentication only for local/CI deploys

### Environment Variables

Create `.env` file in project root:
- See `.env.example` for template.

### Install & Run

**Main application:**

```bash
pnpm install --frozen-lockfile
pnpm dev
# → http://localhost:3000
```

**Vinext local development:**

```bash
pnpm dev:vinext
# → http://localhost:3001
```

**Sanity Studio:**

```bash
cd sanity
pnpm install
pnpm start
# → http://localhost:3333
```

## 📦 Deployment

### Webapp (Cloudflare Workers)

Production is served from `inutdesign.com` and `www.inutdesign.com` through the
Worker `inutdesign-web`. Workers Paid remains a pending owner-controlled
upgrade; the accepted current state runs on Workers Free until Cloudflare
reports plan/quota/CPU pressure or another approved trigger occurs.

```bash
pnpm exec cf auth login
export DEPLOYMENT_CHANNEL=production
export NEXT_PUBLIC_SITE_URL=https://inutdesign.com
pnpm release:local
pnpm deploy:vinext
```

GitHub Actions also exposes the owner-triggered
`preview | production` deployment workflow.

### Sanity Studio

```bash
cd sanity
sanity login
sanity deploy
```

## 📚 Documentation

### Analytics & Tracking
- [Analytics Guide](./docs/ANALYTICS_GUIDE.md) - All-in-one setup, implementation, and troubleshooting
- [Analytics Event Map](./docs/ANALYTICS_EVENT_MAP.md) - Current event contract overview

### Project Documentation
- [Documentation Index](./docs/README.md) - Current, operational and historical document map
- [Project Constitution](./.specify/memory/constitution.md) - Governing engineering
  principles, protected contracts, privacy rules, and quality gates
- [AGENTS Playbook](./AGENTS.md) - AI Agent baseline for multi-editor support
- [Cloudflare Release Runbook](./docs/operations/cloudflare-release.md) - Production deploy, verify and rollback
- [Sanity Architecture](./sanity/docs/ARCHITECTURE.md) - CMS documentation

### AI Assistant Toolkit
- [AI Bootstrap](./AGENTS.md) - Safety and routing to canonical project skills
- [Skill Usage Index](./docs/ai/PORTABLE_PROMPTS.md) - Task routing, not a second prompt tree
- [Multi-Editor Operation](./docs/ai/DUAL_EDITOR_WORKFLOW.md) - Explicit-path fallback when discovery is unavailable
- [Project Skill](./.agents/skills/inut-design-workflow/SKILL.md) - Engineering conventions, feature/bug recipes and checkout audits
- [Content Writer](./.agents/skills/inut-content-writer/SKILL.md) - Grounded Vietnamese copy and compact blog batches
- [New Product Page](./.agents/skills/inut-product-page-automation/SKILL.md) - Draft-first landing page automation
- [Existing Content Generator](./.agents/skills/product-page-generator/SKILL.md) - Centralized typed data/template routes
- [Local Cloudflare Deploy](./.agents/skills/inut-cloudflare-local-deploy/SKILL.md) - Guarded local production release, deploy and smoke verification
- [Migration Manifest](./docs/ai/SKILLS_MIGRATION_MANIFEST.json) - Source mapping, backup and exact removal inventory
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
├── scripts/migration/ # Vinext/Cloudflare verification and release tooling
├── specs/             # Feature specifications and migration evidence plans
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
pnpm dev                         # Next.js development server
pnpm dev:vinext                  # Vinext development server
pnpm build                       # Standard Next production build
pnpm build:vinext                # Vinext/Cloudflare production build
pnpm lint                        # Lint
pnpm exec tsc --noEmit           # Type-check
pnpm regression:safe             # Safe 22-route/flow regression
pnpm release:local               # Full local release gate and deploy dry-run
pnpm deploy:vinext               # Deploy current build to Cloudflare
pnpm sanity                      # Start Sanity Studio
```

## 📈 Analytics Events Tracked

See [Analytics Guide](./docs/ANALYTICS_GUIDE.md) and
[Analytics Event Map](./docs/ANALYTICS_EVENT_MAP.md) for current wrappers,
privacy rules and event contracts.

## 🤝 Contributing

This is a private project. For development guidelines, start with [AGENTS.md](./AGENTS.md) and the relevant canonical skill.

## 📄 License

Private - All Rights Reserved