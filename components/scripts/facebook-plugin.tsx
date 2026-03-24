import envConst from "@/utils/env-const";
import Script from "next/script";

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
	const enabled = envConst.ENABLE_FB_CHAT !== "false";
	const PAGE_ID = envConst.FACEBOOK_PAGE_ID;

	if (!enabled) return null;

	return (
		<>
			<div id="fb-root" />
			<div
				id="fb-customer-chat"
				className="fb-customerchat"
				dangerouslySetInnerHTML={{
					__html: ``,
				}}
				{...({ page_id: PAGE_ID, attribution: "biz_inbox" } as any)}
			/>
			<Script
				id="facebook-jssdk-loader"
				strategy="lazyOnload"
				dangerouslySetInnerHTML={{
					__html: `
						window.fbAsyncInit = function() {
							if (window.FB) {
								window.FB.init({
									xfbml: true,
									version: 'v19.0'
								});
							}
						};

						(function(d, s, id) {
							var js, fjs = d.getElementsByTagName(s)[0];
							if (d.getElementById(id)) return;
							js = d.createElement(s); js.id = id;
							js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
							fjs.parentNode.insertBefore(js, fjs);
						}(document, 'script', 'facebook-jssdk'));
					`,
				}}
			/>
		</>
	);
}
