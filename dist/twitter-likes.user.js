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
!function(){"use strict";const e=e=>{[["display","inline-block"],["border","none"],["margin","0"],["textDecoration","none"],["fontFamily","inherit"],["fontSize","inherit"],["lineHeight","1"],["cursor","pointer"],["textAlign","center"]].forEach((([t,n])=>{e.style[t]=n})),[["transition","background 0.2s ease-in-out"],["marginInlineEnd","8px"],["backgroundColor","white"],["color","#222"],["appearance","none"],["borderRadius","2px"],["padding","6px 10px"]].forEach((([t,n])=>{e.style[t]=n}))};let t=0;const n=new class{constructor(){this.notifyWrapper=(()=>{const e=document.createElement("div");return e.style.fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",e.style.position="fixed",e.style.top="0px",e.style.right="0px",e.style.bottom="unset",e.style.left="0px",e.style.zIndex="4000",e.style.padding="32px",e.style.pointerEvents="none",e.style.display="flex",e.style.flexDirection="column",e.style.alignItems="flex-end",e.dataset.dhNotifyContainer=!0,e})(),this.notifyEl=(()=>{const e=document.createElement("section");e.style.pointerEvents="auto",e.style.flexWrap="wrap",e.style.backgroundColor="#333",e.style.margin="0px",e.style.color="#dedede",e.style.padding="20px",e.style.borderRadius="8px",e.style.maxWidth="280px",e.style.boxShadow="0 5px 10px rgba(0,0,0,0.5)",e.style.marginBottom="12px";const t=document.createElement("h3");t.style.marginBottom="8px",t.style.marginTop="0",t.style.padding="0",t.style.fontWeight="bold",t.style.fontSize="12px";const n=document.createElement("p");return n.style.fontSize="16px",n.style.lineHeight="22px",n.style.padding="0",n.style.margin="0 0 12px 0",e.dataset.dhNotify=!0,t.dataset.dhNotifyHeading=!0,n.dataset.dhNotifyMessage=!0,e.appendChild(t),e.appendChild(n),e})(),this.DEFAULT_TIMER=3e3,this.queue=[],document.body.appendChild(this.notifyWrapper),document.addEventListener("keydown",this.handleKeyDown,!0)}queueIsEmpty=()=>0===this.queue.length;handleKeyDown=e=>{this.queueIsEmpty()||"Escape"!==e.key||(e.preventDefault(),this.dismiss(this.queue[0]))};dismiss=e=>{this.queueIsEmpty()||(this.notifyWrapper.removeChild(this.notifyWrapper.querySelector(`[data-dh-notify="${e}"]`)),this.queue.splice(this.queue.findIndex((t=>t===e)),1))};dismissAll=()=>{this.queue.forEach((e=>this.dismiss(e)))};render=({title:n="",message:i,timer:o=this.DEFAULT_TIMER,actions:s=[{label:"OK"}]})=>{const a=t++,r=this.notifyEl.cloneNode(!0);r.dataset.dhNotify=a;if(r.querySelector("[data-dh-notify-heading]").innerText=`[Dark Hole] ${n}`,i){r.querySelector("[data-dh-notify-message]").innerText=i}if(s.length>0)for(const t of s){const n=document.createElement("button");e(n),n.dataset.dhNotifyAction=!0,n.innerText=t.label,n.addEventListener("click",(e=>{t.handler?.(e),this.dismiss(a)})),r.appendChild(n)}return this.notifyWrapper.appendChild(r),this.queue.push(a),setTimeout((()=>this.dismiss(a)),o),a}};function i(){return document.querySelector('[data-testid="UserName"]')?.innerText.split("\n")?.[1]?.slice(1)||null}function o(e){const t=`🛑 Stopped script: Dark Hole - ${e}`;console.log({content:t}),n({content:t})}const s=window?.location?.href;async function a(){await new Promise((e=>setTimeout(e,200))),s!==window?.location?.href&&(n.dismissAll(),document.removeEventListener("click",a,!0))}async function r({pathname:e,title:t,urlPaths:i,handler:o,message:s="Ready to clean up your data?\nNOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",actionLabel:r="🧹 Begin Removal"}){i.some((t=>e===t))&&(n.render({title:t,message:s,actions:[{label:r,handler:o}],timer:6e4}),document.addEventListener("click",a,!0))}let l=!1;const d=e=>{"Escape"===e.key&&(l=!0)};async function c(e=[]){document.addEventListener("keydown",d,!0);let t=150;async function i(){return new Promise((e=>setTimeout((()=>requestAnimationFrame(e)),t)))}function s(){return[...document.querySelectorAll('[data-testid="tweet"]')]}let a=e.length?e:s();for(const e of a){if(n.render({message:"🧹 Removing likes"}),l)return o("Twitter Likes"),void document.removeEventListener("keydown",d,!0);let t=e.closest('[data-testid="cellInnerDiv"]'),s=e.querySelector('[data-testid="unlike"]');s&&(s.click(),await i()),t.parentNode.removeChild(t),t=void 0,s=void 0,await i()}if(a=s(),t=void 0,a.length)return n.render({message:"🧲 There are more Likes to remove, hold on...",actions:[{label:"Stop now",handler:()=>{l=!0}}]}),c(a);n.render({message:"✨ Done!"})}!async function(){const e=await async function(e,t,i={}){const o=i.tries||10,s=i.interval||100,a=t||"Unable to resolve value after "+String(o*s)+"ms.";return new Promise(((i,r)=>{let l=0;const d=setInterval((()=>{const s=e();s&&(clearInterval(d),i(s)),++l===o&&(clearInterval(d),t&&n({content:a}),r())}),s)}))}(i);e&&r({pathname:window?.location?.pathname,title:"Twitter Likes",handler:c,urlPaths:[`/${e}/likes`]})}()}();
