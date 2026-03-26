/**
 * Speculation Rules Script Component
 * Injects <script type="speculationrules"> into the document head
 * @see https://developer.chrome.com/docs/web-platform/implementing-speculation-rules
 */

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	getSpeculationRules,
	serializeSpeculationRules,
	supportsSpeculationRules,
} from "@/utils/speculation-rules";

/**
 * Speculation Rules Script Component
 * Renders a <script type="speculationrules"> tag with prefetch and prerender rules
 */
export function SpeculationRulesScript() {
	const router = useRouter();
	const [rulesScript, setRulesScript] = useState<string | null>(null);

	useEffect(() => {
		// Only inject if browser supports speculation rules
		if (!supportsSpeculationRules()) {
			if (process.env.NODE_ENV === "development") {
				console.log("[SpeculationRules] Browser does not support speculation rules");
			}
			return;
		}

		// Get rules based on current path
		const rules = getSpeculationRules(router.pathname);
		const scriptContent = serializeSpeculationRules(rules);

		setRulesScript(scriptContent);

		if (process.env.NODE_ENV === "development") {
			console.log("[SpeculationRules] Injected rules for path:", router.pathname);
		}
	}, [router.pathname]);

	// Don't render if browser doesn't support speculation rules
	if (!rulesScript) return null;

	return <script type="speculationrules" dangerouslySetInnerHTML={{ __html: rulesScript }} />;
}

/**
 * Static Speculation Rules for SSR
 * Use this in _document.tsx for initial page load
 */
export function StaticSpeculationRules() {
	// During SSR, we can't detect browser support, so we include the script
	// Browsers that don't support it will simply ignore it
	const rules = getSpeculationRules();
	const scriptContent = serializeSpeculationRules(rules);

	return <script type="speculationrules" dangerouslySetInnerHTML={{ __html: scriptContent }} />;
}

/**
 * Prefetch Link Component
 * Alternative approach using <link rel="prefetch"> for browsers without speculation rules
 */
export function PrefetchLinks({ urls }: { urls: string[] }) {
	return (
		<>
			{urls.map((url) => (
				<link key={url} rel="prefetch" href={url} as="document" />
			))}
		</>
	);
}

export default SpeculationRulesScript;
