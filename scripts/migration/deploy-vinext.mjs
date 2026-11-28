import { spawnSync } from 'node:child_process';

const extra = process.argv.slice(2).filter((arg) => arg !== '--');
function run(args) {
  const result = spawnSync('pnpm', ['exec', ...args], { stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (process.env.INUT_LOCAL_PREBUILT === '1') {
  if (process.env.DEPLOYMENT_CHANNEL !== 'production') throw new Error('Local prebuilt release requires DEPLOYMENT_CHANNEL=production');
  for (const script of ['check-prerender-routes.mjs', 'check-asset-routing.mjs', 'check-prerender-output.mjs', 'generate-static-manifest.mjs']) {
    const result = spawnSync(process.execPath, [`scripts/migration/${script}`], { stdio: 'inherit', env: process.env });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
  run(['cf', 'deploy', '--prebuilt', ...extra]);
} else {
  run(['vinext-cloudflare', 'deploy', ...extra]);
}
