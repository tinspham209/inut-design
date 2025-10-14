# Inut Design Sanity CMS

Web-admin: https://inut-design.sanity.studio/

# Tech-stack
- Sanity v2

# Setup

```
nvm use 22
pnpm i
pnpm start

// localhost:3000
```

# Change dataset
- access to [./sanity.json](./sanity.json)
- update field `api.dataset` to `dev|production`

# Deployment

```
sanity login
sanity deploy
```

