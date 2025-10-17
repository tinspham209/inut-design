# Inut Design

Web: https://inutdesign.com
Web-admin: https://inut-design.sanity.studio/

# Tech-stack
- NextJS 12
- Sanity v2
- MUI v5
- Framer Motion
- React Three Fiber
- unified, Rehype
- SWR
- zustand
- react-hook-form
- Vercel

# Setup

- create `.env` file

- then run scrip:
```bash
pnpm i
pnpm dev

// localhost:3000
```

- Sanity
  - install sanity/cli v2 if you don't have it: `npm install -g @sanity/cli@^2` 
```bash
cd ./sanity
pnpm i
sanity install
pnpm start

// localhost:3333
```


# Deployment

- Sanity

```
cd sanity
sanity login
sanity deploy
```

- Webapp
  - push code to `main`, the CI/CD will run in vercel