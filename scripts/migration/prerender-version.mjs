export function assertPrerenderVersion(version) {
  if (version !== '1.4.6') throw new Error(`Re-review Vinext prerender classification before upgrading: ${version}`);
}
