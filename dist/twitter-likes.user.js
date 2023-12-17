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
!function(){"use strict";function e(){return document.querySelector('[data-testid="UserName"]')?.innerText.split("\n")?.[1]?.slice(1)||null}const t=new class{static queue=0;static DEFAULT_DELAY=2e3;constructor(){this.notifyWrapper=this.buildNotifyContainer(),this.notifyEl=this.buildNotification(),document.body.appendChild(this.notifyWrapper),document.addEventListener("keydown",this.handleKeyDown,!0)}handleKeyDown=e=>{this.queueIsEmpty()||"Escape"!==e.key||(e.preventDefault(),this.dismiss())};queueIsEmpty=()=>this.queue<=0;buildNotifyContainer=()=>{const e=document.createElement("div");return e.style.fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",e.style.position="fixed",e.style.top="0px",e.style.right="0px",e.style.bottom="unset",e.style.left="0px",e.style.zIndex="4000",e.style.padding="32px",e.style.pointerEvents="none",e.style.display="flex",e.style.flexDirection="column",e.style.alignItems="flex-end",e.dataset.dhNotifyContainer=!0,e};buildNotification=()=>{const e=document.createElement("section");e.style.pointerEvents="auto",e.style.flexWrap="wrap",e.style.backgroundColor="#333",e.style.margin="0px",e.style.color="#dedede",e.style.padding="20px",e.style.borderRadius="8px",e.style.maxWidth="280px",e.style.boxShadow="0 5px 10px rgba(0,0,0,0.5)",e.style.marginBottom="12px";const t=document.createElement("h3");t.style.marginBottom="8px",t.style.marginTop="0",t.style.padding="0",t.style.fontWeight="bold",t.style.fontSize="12px";const n=document.createElement("p");return n.style.fontSize="16px",n.style.lineHeight="22px",n.style.padding="0",n.style.margin="0 0 12px 0",e.dataset.dhNotify=!0,t.dataset.dhNotifyHeading=!0,n.dataset.dhNotifyMessage=!0,e.appendChild(t),e.appendChild(n),e};dismiss=()=>{this.queueIsEmpty()||(this.notifyWrapper.removeChild(this.notifyWrapper.firstElementChild),this.queue-=1)};dismissAll=()=>{for(;!this.queueIsEmpty();)this.dismiss()};render=({title:e,message:t,delay:n=this.DEFAULT_DELAY,actions:s=[]})=>{const i=this.notifyEl.cloneNode(!0);if(i.querySelector("[data-dh-notify-heading]").innerText=e?`[Dark Hole] ${e}`:"[Dark Hole]",t){i.querySelector("[data-dh-notify-message").innerText=t}if(s.length>0)for(const e of s){const t=document.createElement("button");t.dataset.dhNotifyAction=!0,t.style.marginInlineEnd="8px",t.innerText=e.label,t.addEventListener("click",(()=>{e.handler(),this.dismiss()})),i.appendChild(t)}this.notifyWrapper.appendChild(i),this.queue+=1,setTimeout(this.dismiss,n)}};function n(e){const n=`🛑 Stopped script: Dark Hole - ${e}`;console.log({content:n}),t({content:n})}const s=new Map;let i=!1;function o({handler:e,message:n,actionLabel:s}){t.render({message:n,actions:[{label:s,handler:e}],delay:6e4})}async function a({pathname:e,urlPaths:n,handler:l,message:r="Ready to clean up your data?\nNOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",actionLabel:d="🧹 Begin Removal"}){if(s.has(e))return o({...s.get(e)});i=!0,n.some((t=>e===t))&&(s.set(e,{pathname:e,urlPaths:n,handler:l,message:r,actionLabel:d}),o({urlPaths:n,handler:l,message:r,actionLabel:d}),function(){if(i)return;const e=history.pushState;history.pushState=function(){e.apply(history,arguments)},window?.addEventListener("popstate",(()=>{t.dismissAll();const e=window?.location?.pathname;s.has(e)&&a({...s.get(e)})}))}())}let l=!1;const r=e=>{"Escape"===e.key&&(l=!0)};async function d(e=[]){document.addEventListener("keydown",r,!0);let t=150;async function s(){return new Promise((e=>setTimeout((()=>requestAnimationFrame(e)),t)))}function i(){return[...document.querySelectorAll('[data-testid="tweet"]')]}let o=e.length?e:i();console.log("🧹 Removing likes...");for(const e of o){if(l)return n("Twitter Likes"),void document.removeEventListener("keydown",r,!0);let t=e.closest('[data-testid="cellInnerDiv"]'),i=e.querySelector('[data-testid="unlike"]');i&&(i.click(),await s()),t.parentNode.removeChild(t),t=void 0,i=void 0,await s()}if(o=i(),t=void 0,o.length)return console.log("🧲 There are more likes to remove"),d(o);console.log("✨ Done!")}!async function(){const n=await async function(e,n,s={}){const i=s.tries||10,o=s.interval||100,a=n||"Unable to resolve value after "+String(i*o)+"ms.";return new Promise(((s,l)=>{let r=0;const d=setInterval((()=>{const o=e();o&&(clearInterval(d),s(o)),++r===i&&(clearInterval(d),n&&t({content:a}),l())}),o)}))}(e);n&&a({pathname:window?.location?.pathname,title:"Twitter Likes",handler:d,urlPaths:[`/${n}/likes`]})}()}();
