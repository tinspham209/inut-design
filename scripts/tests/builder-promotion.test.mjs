import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [builders, hero, analytics, promotion] = await Promise.all([
	read("../../data/builders.ts"),
	read("../../components/home/hero.tsx"),
	read("../../utils/builderAnalytics.ts").catch(() => ""),
	read("../../components/home/builder-promotion.tsx").catch(() => ""),
]);

const definitions = [...builders.matchAll(/\bid:\s*["'](keychain|lighter)["'][\s\S]*?href:\s*["']([^"']+)["']/g)];
assert.equal(definitions.length, 2, "exactly two canonical Builder definitions are required");
assert.deepEqual(
	definitions.map(([, id, href]) => [id, href]),
	[
		["keychain", "/builder/keychain"],
		["lighter", "/builder/lighters"],
	],
	"canonical Builder order and destinations must remain fixed"
);
assert.match(builders, /badge:\s*["']Mới["']/u, "Keychain must have a text New badge");
assert.ok(/priority:\s*1/u.test(builders) && /priority:\s*2/u.test(builders), "canonical priority values must be defined");

assert.ok(/ctaPrimaryHref\s*=\s*["']\/builder["']/u.test(hero), "Hero primary CTA must default to /builder");
assert.ok(/Tự thiết kế ngay/u.test(hero), "Hero primary CTA must use the approved label");
assert.ok(/builder_promotion_click/u.test(hero), "Hero must emit the promotion click event");
assert.ok(/builder_id:\s*["']overview["']/u.test(hero), "Hero click must use the overview Builder ID");
assert.ok(/placement:\s*["']home_hero["']/u.test(hero), "Hero click must use the home_hero placement");

assert.match(analytics, /builder_promotion_view/u);
assert.match(analytics, /builder_promotion_click/u);
assert.match(analytics, /builder_id/u);
assert.match(analytics, /placement/u);
assert.match(analytics, /action/u);
assert.match(analytics, /trackUmamiEvent/u);
assert.match(analytics, /trackEvent/u);
assert.match(promotion, /IntersectionObserver/u);
assert.match(promotion, /home_feature|builder_index/u);

const allowList = [...analytics.matchAll(/(?:"|')([a-z_]+)(?:"|')/g)]
	.map(([, value]) => value)
	.filter((value) => ["builder_id", "placement", "action"].includes(value));
assert.deepEqual(new Set(allowList), new Set(["builder_id", "placement", "action"]));
assert.match(analytics, /\["builder_id",\s*"placement",\s*"action"\]/u);
assert.match(analytics, /Object\.keys\(input\)\.length !== ALLOWED_PROPERTIES\.length/u);
assert.match(analytics, /const payload: BuilderPromotionProperties = \{\s*builder_id: properties\.builder_id,\s*placement: properties\.placement,\s*action: properties\.action,/u);

console.log("Builder promotion static contracts passed.");
