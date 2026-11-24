import { bindings, defineConfig, defineWorker } from "cf/config";

const deploymentChannel =
  process.env.DEPLOYMENT_CHANNEL === "preview" ? "preview" : "production";
const previewSiteUrl = process.env.PREVIEW_SITE_URL || "";

export default defineConfig({
  accountId: "2b0715e3577db65f2693d4dc58fd3b61",
  worker: defineWorker({
    name: "inutdesign-web",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-24",
    workersDev: true,
    previewUrls: true,
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      SPX_SYNC_SECRET: bindings.secret(),
      SPX_SYNC_TELEGRAM_BOT_TOKEN: bindings.secret(),
      SPX_SYNC_TELEGRAM_CHAT_ID: bindings.secret(),
      SANITY_TOKEN: bindings.secret(),
      TELEGRAM_BOT_TOKEN: bindings.secret(),
      TELEGRAM_CHAT_ID: bindings.secret(),
      CREATIVA_TELEGRAM_BOT_TOKEN: bindings.secret(),
      DEPLOYMENT_CHANNEL: bindings.text(deploymentChannel),
      PREVIEW_SITE_URL: bindings.text(previewSiteUrl),
    },
  }),
});
