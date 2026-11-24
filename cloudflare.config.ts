import { bindings, defineConfig, defineWorker } from "cf/config";

const deploymentChannel =
  process.env.DEPLOYMENT_CHANNEL === "preview" ? "preview" : "production";

export default defineConfig({
  worker: defineWorker({
    name: "inutdesign-web",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-24",
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      SPX_SYNC_SECRET: bindings.secret(),
      DEPLOYMENT_CHANNEL: bindings.text(deploymentChannel),
    },
  }),
});
