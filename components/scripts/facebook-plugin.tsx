import * as React from "react";

declare global {
	interface Window {
		fbAsyncInit?: () => void;
		FB?: {
			init: (config: { xfbml: boolean; version: string }) => void;
		};
	}
}

/**
 * Facebook Customer Chat Plugin wrapper.
 * Loads the SDK client-side with fallback locale & error handling.
 */
export function FacebookChatPlugin() {
	React.useEffect(() => {
		if (typeof window === "undefined") return; // SSR guard
		const enabled = process.env.NEXT_PUBLIC_ENABLE_FB_CHAT !== "false";
		if (!enabled) return;

		const PAGE_ID = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID;
		const chatbox = document.getElementById("fb-customer-chat");
		if (chatbox) {
			chatbox.setAttribute("page_id", PAGE_ID);
			chatbox.setAttribute("attribution", "biz_inbox");
		}

		// Setup async init each time (idempotent)
		window.fbAsyncInit = function () {
			try {
				window.FB?.init({
					xfbml: true,
					version: "v19.0", // Update to newer Graph API version
				});
				// eslint-disable-next-line no-console
				console.info("[FB Chat] FB.init called");
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error("[FB Chat] FB.init error", e);
			}
		};

		function loadSdk(locale = "vi_VN") {
			return new Promise<void>((resolve, reject) => {
				if (document.getElementById("facebook-jssdk")) {
					resolve();
					return;
				}
				const js = document.createElement("script");
				js.id = "facebook-jssdk";
				js.src = `https://connect.facebook.net/${locale}/sdk/xfbml.customerchat.js`;
				js.async = true;
				js.crossOrigin = "anonymous";
				js.onload = () => {
					// eslint-disable-next-line no-console
					console.info(`[FB Chat] SDK loaded locale=${locale}`);
					resolve();
				};
				js.onerror = (err) => {
					// eslint-disable-next-line no-console
					console.error(`[FB Chat] Failed to load SDK locale=${locale}`, err);
					reject(err instanceof Error ? err : new Error("Failed to load FB SDK"));
				};
				document.body.appendChild(js);
			});
		}

		// Try primary locale then fallback to en_US if 500 / network errors
		loadSdk().catch(() =>
			loadSdk("en_US").catch(() => {
				// final failure
				// eslint-disable-next-line no-console
				console.error("[FB Chat] All locale loads failed");
			})
		);
	}, []);

	return (
		<>
			<div id="fb-root" />
			<div id="fb-customer-chat" className="fb-customerchat" />
		</>
	);
}
