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
!function(){"use strict";function e(){return document.querySelector('[data-testid="UserName"]')?.innerText.split("\n")?.[1]?.slice(1)||null}const t=new class{static queue=0;static DEFAULT_DELAY=2e3;constructor(){const e=document.createElement("div"),t=document.createElement("div");e.innerHTML='<div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;position: fixed;top: 0px;right: 0px;bottom: unset;left: 0px;z-index: 4000;padding: 32px;pointer-events: none;display: flex;flex-direction: column;align-items: flex-end;" data-dh-notify-container></div>',t.innerHTML='<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 24px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;" data-dh-notify><h3 style="margin-bottom: 8px;margin-top:0;padding: 0;font-weight: bold;font-size: 12px;" data-dh-notify-heading>[Dark Hole]</h3><p style="font-size: 16px;line-height: 22px;padding: 0;margin:0 0 12px 0;" data-dh-notify-message></p></section>',this.notifyWrapper=e.firstElementChild,this.notifyEl=t.firstElementChild,document.body.appendChild(this.notifyWrapper),document.addEventListener("keydown",this.handleKeyDown,!0)}handleKeyDown=e=>{this.queueIsEmpty()||"Escape"!==e.key||(e.preventDefault(),this.dismiss())};queueIsEmpty=()=>this.queue<=0;dismiss=()=>{this.queueIsEmpty()||(this.notifyWrapper.removeChild(this.notifyWrapper.firstElementChild),this.queue-=1)};render=({message:e,delay:t=this.DEFAULT_DELAY,actions:n=[]})=>{const i=this.notifyEl.cloneNode(!0);if(e){i.querySelector("[data-dh-notify-message").innerText=e}if(n.length>0)for(const e of n){const t=document.createElement("button");t.dataset.dhNotifyAction=!0,t.style.marginInlineEnd="8px",t.innerText=e.label,t.addEventListener("click",(()=>{e.handler(),this.dismiss()})),i.appendChild(t)}this.notifyWrapper.appendChild(i),this.queue+=1,setTimeout(this.dismiss,t)}};function n(e){const n=`🛑 Stopped script: Dark Hole - ${e}`;console.log({content:n}),t({content:n})}let i=!1;const o=e=>{"Escape"===e.key&&(i=!0)};async function s(e=[]){document.addEventListener("keydown",o,!0);let t=150;async function a(){return new Promise((e=>setTimeout((()=>requestAnimationFrame(e)),t)))}function r(){return[...document.querySelectorAll('[data-testid="tweet"]')]}let l=e.length?e:r();console.log("🧹 Removing likes...");for(const e of l){if(i)return n("Twitter Likes"),void document.removeEventListener("keydown",o,!0);let t=e.closest('[data-testid="cellInnerDiv"]'),s=e.querySelector('[data-testid="unlike"]');s&&(s.click(),await a()),t.parentNode.removeChild(t),t=void 0,s=void 0,await a()}if(l=r(),t=void 0,l.length)return console.log("🧲 There are more likes to remove"),s(l);console.log("✨ Done!")}!async function(){const n=await async function(e,n,i={}){const o=i.tries||10,s=i.interval||100,a=n||"Unable to resolve value after "+String(o*s)+"ms.";return new Promise(((i,r)=>{let l=0;const d=setInterval((()=>{const s=e();s&&(clearInterval(d),i(s)),++l===o&&(clearInterval(d),n&&t({content:a}),r())}),s)}))}(e);n&&async function({urlPaths:e,handler:n,message:i,actionLabel:o="🧹 Begin Removal"}){const s=window?.location?.pathname;e.some((e=>s===e))&&t.render({message:i,actions:[{label:o,handler:n}],delay:6e4})}({message:"Ready to clean up your data?\nNOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",handler:s,urlPaths:[`/${n}/likes`]})}()}();
