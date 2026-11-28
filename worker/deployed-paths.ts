const families = ["/san-pham/lighters/", "/san-pham/skin-laptop/", "/san-pham/skin-nut-phim/", "/creativa/skin-laptop/"];

export function isUndeployedProductPath(pathname: string, deployed: ReadonlySet<string> | null): boolean {
	if (!deployed) return false;
	let path = pathname;
	const data = path.match(/^\/_next\/data\/[^/]+(\/.*)\.json$/);
	if (data) path = data[1];
	const rawPath = path.replace(/\/+$/, "") || "/";
	try { path = decodeURIComponent(path); } catch { return false; }
	path = path.replace(/\/+$/, "") || "/";
	if (deployed.has(path)) return false;
	return families.some((prefix) => path.startsWith(prefix) && (!path.slice(prefix.length).includes("/") || /%2f/i.test(rawPath)));
}
