// ==UserScript==
// @name        Dark Hole - Twitter Posts
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://twitter.com/*
// @version     1.0.0
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/posts.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/posts.user.js
// @grant       none
// ==/UserScript==
!function(){"use strict";function e(){return document.querySelector('[data-testid="UserName"]')?.innerText.split("\n")?.[1]?.slice(1)||null}const t=new function(){const e=document.createElement("div"),t=document.createElement("div");e.innerHTML='<div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;position: fixed;top: 0px;right: 0px;bottom: unset;left: 0px;z-index: 4000;padding: 32px;pointer-events: none;display: flex;flex-direction: column;align-items: flex-end;"></div>',t.innerHTML='<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 12px 16px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;"><h3 style="margin-bottom: 8px;margin-top:0;padding: 0;font-weight: bold;font-size: 12px;">[Dark Hole]</h3><p style="font-size: 16px;line-height: 22px;padding: 0;margin:0;" data-notify-content></p></section>';const n=e.firstElementChild,o=t.firstElementChild;let i=0;function a(){return i<=0}function r(){a()||(n.removeChild(n.firstElementChild),i-=1)}return document.body.appendChild(n),document.addEventListener("keydown",(function(e){a()||"Escape"!==e.key||(e.preventDefault(),r())}),!0),function({content:e,delay:t=2e3,actions:a=[]}){const l=o.cloneNode(!0);if(e&&(l.querySelector("p").innerText=e,l.querySelector("p").style.marginBlockEnd="12px"),a.length>0)for(const e of a){const t=document.createElement("button");t.style.marginInlineEnd="8px",t.innerText=e.label,t.addEventListener("click",(()=>{e.handler(),r()})),l.appendChild(t)}n.appendChild(l),i+=1,setTimeout(r,t)}};async function n(t=[]){let o=e();async function i(e=500){return new Promise((t=>setTimeout((()=>requestAnimationFrame(t)),e)))}function a(){return[...document.querySelectorAll('[data-testid="tweet"]')]}let r=t.length?t:a();console.log("🧹 Deleting tweets");for(const e of r){let t=e.closest('[data-testid="cellInnerDiv"]'),n=!!e.querySelector('[data-testid="User-Name"]')?.innerText.includes(`@${o}`),a=!!e.querySelector('[data-testid="socialContext"]'),r=e.querySelector('[data-testid="caret"]');if(a){e.querySelector('[data-testid="unretweet"]').click(),await i(),document.querySelector('[data-testid="Dropdown"] > [data-testid="unretweetConfirm"]').click()}else{if(!n)continue;r.click(),await i(),document.querySelector('[data-testid="Dropdown"] > [role="menuitem"]').click(),await i(),document.querySelector('[data-testid="confirmationSheetDialog"] [data-testid="confirmationSheetConfirm"]').click(),await i();let e=[...t.parentNode.children],o=e.indexOf(t);e.slice(0,o).forEach((e=>e.parentNode.removeChild(e)))}await i()}r=a(),r.length?(console.log("🧲 There are more tweets to delete"),await n(r)):console.log("✨ Done!")}!async function(){const o=await async function(e,n,o={}){const i=o.tries||10,a=o.interval||100,r=n||"Unable to resolve value after "+String(i*a)+"ms.";return new Promise(((o,l)=>{let c=0;const d=setInterval((()=>{const a=e();a&&(clearInterval(d),o(a)),++c===i&&(clearInterval(d),n&&t({content:r}),l())}),a)}))}(e);!async function({urlPaths:e,handler:n,message:o,actionLabel:i="🧹 Begin Removal"}){const a=window?.location?.pathname;e.some((e=>a===e))&&t({content:o,actions:[{label:i,handler:n}],delay:6e4})}({message:"Ready to clean up your data?\nNOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",handler:n,urlPaths:[`/${o}`,`/${o}/with_replies`,`/${o}/media`]})}()}();
