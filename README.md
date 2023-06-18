# Inut Design

Web: https://inutdesign.com
Web-admin: https://inut-design.sanity.studio/

# Tech-stack
- NextJS 12
- Sanity
- MUI v5
- Framer Motion
- React Three Fiber
- unified, Rehype
- SWR
- zustand
- react-hook-form
- Vercel
- Next-auth
- MongoDB

# Setup

- create `.env` file

```
yarn
yarn start

// localhost:3000
```

- Sanity

```
cd sanity
yarn
yarn start

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