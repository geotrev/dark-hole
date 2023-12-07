// ==UserScript==
// @name        Dark Hole - Twitter Posts
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://www.twitter.com*
// @version     1.0.0
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/posts.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/posts.user.js
// @grant       none
// ==/UserScript==
!function(){"use strict";async function e(t=[]){let a="TWITTER_HANDLE";async function i(e=500){return new Promise((t=>setTimeout((()=>requestAnimationFrame(t)),e)))}const o=window?.location?.pathname;if(!(o.startsWith(`/${a}`)||o.startsWith(`/${a}/with_replies`)||o.startsWith(`/${a}/media`)))return;function n(){return[...document.querySelectorAll('[data-testid="tweet"]')]}let r=t.length?t:n();console.log("🧹 Deleting tweets");for(const e of r){let t=e.closest('[data-testid="cellInnerDiv"]'),o=!!e.querySelector('[data-testid="User-Name"]')?.innerText.includes(`@${a}`),n=!!e.querySelector('[data-testid="socialContext"]'),r=e.querySelector('[data-testid="caret"]');if(n){e.querySelector('[data-testid="unretweet"]').click(),await i(),document.querySelector('[data-testid="Dropdown"] > [data-testid="unretweetConfirm"]').click()}else{if(!o)continue;r.click(),await i(),document.querySelector('[data-testid="Dropdown"] > [role="menuitem"]').click(),await i(),document.querySelector('[data-testid="confirmationSheetDialog"] [data-testid="confirmationSheetConfirm"]').click(),await i();let e=[...t.parentNode.children],a=e.indexOf(t);e.slice(0,a).forEach((e=>e.parentNode.removeChild(e)))}await i()}r=n(),r.length?(console.log("🧲 There are more tweets to delete"),await e(r)):console.log("✨ Done!")}!function(){const t=window?.location?.pathname,a=document.querySelector('[data-testid="UserName"]')?.innerText.split("\n")?.[1]?.slice(1)||null;t!==`/${a}`&&t!==`/${a}/with_replies`&&t!==`/${a}/media`||notify({content:"Ready to clean up your data? NOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",actions:[{label:"🧹 Begin Removal",handler:e}],delay:6e4})}()}();
