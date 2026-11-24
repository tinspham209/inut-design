import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
for (const envFile of [".env", ".env.local", ".env.development", ".env.development.local"]) {
	const absolutePath = path.join(root, envFile);
	if (existsSync(absolutePath)) process.loadEnvFile(absolutePath);
}

const requirements = {
	build: ["NEXT_PUBLIC_SANITY_PROJECT_ID", "NEXT_PUBLIC_SANITY_DATASET"],
	worker: ["SANITY_TOKEN", "TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"],
	scheduler: ["SPX_SYNC_SECRET", "SPX_SYNC_TELEGRAM_BOT_TOKEN", "SPX_SYNC_TELEGRAM_CHAT_ID"],
};
const stageArgument = process.argv.find((argument) => argument.startsWith("--stage="));
const stage = stageArgument?.slice("--stage=".length) ?? "build";
const stages = stage === "all" ? Object.keys(requirements) : [stage];

if (!stages.every((candidate) => candidate in requirements)) {
	console.error("Environment validation stage must be build, worker, scheduler, or all.");
	process.exit(1);
}

const requiredNames = [...new Set(stages.flatMap((candidate) => requirements[candidate]))];
const missing = requiredNames.filter((name) => !process.env[name]?.trim());
if (missing.length) {
	console.error(`Missing required environment variable names: ${missing.sort().join(", ")}`);
	process.exit(1);
}

console.log(`Validated ${requiredNames.length} required environment name(s) for ${stages.join(", ")}; values redacted.`);
