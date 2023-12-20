// ==UserScript==
// @name        Dark Hole - Twitter Likes
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://twitter.com/*/likes
// @version     0.0.0
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/twitter-likes.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/twitter-likes.user.js
// @grant       none
// ==/UserScript==
!function(){"use strict";const e=e=>{[["display","inline-block"],["border","none"],["margin","0"],["textDecoration","none"],["fontFamily","inherit"],["fontSize","inherit"],["lineHeight","1"],["cursor","pointer"],["textAlign","center"]].forEach((([t,n])=>{e.style[t]=n})),[["transition","background 0.2s ease-in-out"],["marginInlineEnd","8px"],["backgroundColor","white"],["color","#222"],["appearance","none"],["borderRadius","2px"],["padding","6px 10px"]].forEach((([t,n])=>{e.style[t]=n}))};const t=new class{static queue=0;static DEFAULT_DELAY=2e3;constructor(){this.notifyWrapper=(()=>{const e=document.createElement("div");return e.style.fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",e.style.position="fixed",e.style.top="0px",e.style.right="0px",e.style.bottom="unset",e.style.left="0px",e.style.zIndex="4000",e.style.padding="32px",e.style.pointerEvents="none",e.style.display="flex",e.style.flexDirection="column",e.style.alignItems="flex-end",e.dataset.dhNotifyContainer=!0,e})(),this.notifyEl=(()=>{const e=document.createElement("section");e.style.pointerEvents="auto",e.style.flexWrap="wrap",e.style.backgroundColor="#333",e.style.margin="0px",e.style.color="#dedede",e.style.padding="20px",e.style.borderRadius="8px",e.style.maxWidth="280px",e.style.boxShadow="0 5px 10px rgba(0,0,0,0.5)",e.style.marginBottom="12px";const t=document.createElement("h3");t.style.marginBottom="8px",t.style.marginTop="0",t.style.padding="0",t.style.fontWeight="bold",t.style.fontSize="12px";const n=document.createElement("p");return n.style.fontSize="16px",n.style.lineHeight="22px",n.style.padding="0",n.style.margin="0 0 12px 0",e.dataset.dhNotify=!0,t.dataset.dhNotifyHeading=!0,n.dataset.dhNotifyMessage=!0,e.appendChild(t),e.appendChild(n),e})(),document.body.appendChild(this.notifyWrapper),document.addEventListener("keydown",this.handleKeyDown,!0)}queueIsEmpty=()=>this.queue<=0;handleKeyDown=e=>{this.queueIsEmpty()||"Escape"!==e.key||(e.preventDefault(),this.dismiss())};dismiss=()=>{this.queueIsEmpty()||(this.notifyWrapper.removeChild(this.notifyWrapper.firstElementChild),this.queue-=1)};dismissAll=()=>{for(;!this.queueIsEmpty();)this.dismiss()};render=({title:t="",message:n,delay:i=this.DEFAULT_DELAY,actions:s=[]})=>{const o=this.notifyEl.cloneNode(!0);if(o.querySelector("[data-dh-notify-heading]").innerText=`[Dark Hole] ${t}`,n){o.querySelector("[data-dh-notify-message").innerText=n}if(s.length>0)for(const t of s){const n=document.createElement("button");e(n),n.dataset.dhNotifyAction=!0,n.innerText=t.label,n.addEventListener("click",(()=>{t.handler?.(),this.dismiss()})),o.appendChild(n)}this.notifyWrapper.appendChild(o),this.queue+=1,setTimeout(this.dismiss,i)}};function n(){return document.querySelector('[data-testid="UserName"]')?.innerText.split("\n")?.[1]?.slice(1)||null}function i(e){const n=`🛑 Stopped script: Dark Hole - ${e}`;console.log({content:n}),t({content:n})}let s=!1;const o=e=>{"Escape"===e.key&&(s=!0)};async function a(e=[]){document.addEventListener("keydown",o,!0);let n=150;async function l(){return new Promise((e=>setTimeout((()=>requestAnimationFrame(e)),n)))}function r(){return[...document.querySelectorAll('[data-testid="tweet"]')]}let d=e.length?e:r();t.render({message:"🧹 Removing likes",delay:3e3,actions:[{label:"OK"}]});for(const e of d){if(s)return i("Twitter Likes"),void document.removeEventListener("keydown",o,!0);let t=e.closest('[data-testid="cellInnerDiv"]'),n=e.querySelector('[data-testid="unlike"]');n&&(n.click(),await l()),t.parentNode.removeChild(t),t=void 0,n=void 0,await l()}if(d=r(),n=void 0,d.length)return t.render({message:"🧲 There are more Likes to remove, hold on...",delay:2e3,actions:[{label:"Stop now",handler:()=>{s=!0}}]}),a(d);t.render({message:"✨ Done!",delay:5e3,actions:[{label:"OK"}]})}!async function(){const e=await async function(e,n,i={}){const s=i.tries||10,o=i.interval||100,a=n||"Unable to resolve value after "+String(s*o)+"ms.";return new Promise(((i,l)=>{let r=0;const d=setInterval((()=>{const o=e();o&&(clearInterval(d),i(o)),++r===s&&(clearInterval(d),n&&t({content:a}),l())}),o)}))}(n);e&&async function({pathname:e,title:n,urlPaths:i,handler:s,message:o="Ready to clean up your data?\nNOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",actionLabel:a="🧹 Begin Removal"}){i.some((t=>e===t))&&t.render({title:n,message:o,actions:[{label:a,handler:s}],delay:6e4})}({pathname:window?.location?.pathname,title:"Twitter Likes",handler:a,urlPaths:[`/${e}/likes`]})}()}();
