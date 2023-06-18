import * as React from "react";

export function FacebookChatPlugin() {
	return (
		<>
			<div id="fb-root"></div>
			<div id="fb-customer-chat" className="fb-customerchat"></div>
		</>
	);
}

export const scriptFacebookChatPlugin = `
var chatbox = document.getElementById('fb-customer-chat');
chatbox.setAttribute("page_id", "inutdesign");
chatbox.setAttribute("attribution", "biz_inbox");
window.fbAsyncInit = function() {
  FB.init({
    xfbml            : true,
    version          : 'v15.0'
  });
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
`;
