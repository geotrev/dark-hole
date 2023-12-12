// ==UserScript==
// @name        Dark Hole - Twitter Bookmarks
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://twitter.com/i/bookmarks
// @version     0.0.0
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/twitter-bookmarks.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/twitter-bookmarks.user.js
// @grant       none
// ==/UserScript==
!function(){"use strict";const e=new class{static queue=0;static DEFAULT_DELAY=2e3;constructor(){const e=document.createElement("div"),t=document.createElement("div");e.innerHTML='<div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;position: fixed;top: 0px;right: 0px;bottom: unset;left: 0px;z-index: 4000;padding: 32px;pointer-events: none;display: flex;flex-direction: column;align-items: flex-end;" data-dh-notify-container></div>',t.innerHTML='<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 20px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;" data-dh-notify><h3 style="margin-bottom: 8px;margin-top:0;padding: 0;font-weight: bold;font-size: 12px;" data-dh-notify-heading></h3><p style="font-size: 16px;line-height: 22px;padding: 0;margin:0 0 12px 0;" data-dh-notify-message></p></section>',this.notifyWrapper=e.firstElementChild,this.notifyEl=t.firstElementChild,document.body.appendChild(this.notifyWrapper),document.addEventListener("keydown",this.handleKeyDown,!0)}handleKeyDown=e=>{this.queueIsEmpty()||"Escape"!==e.key||(e.preventDefault(),this.dismiss())};queueIsEmpty=()=>this.queue<=0;dismiss=()=>{this.queueIsEmpty()||(this.notifyWrapper.removeChild(this.notifyWrapper.firstElementChild),this.queue-=1)};render=({title:e="",message:t,delay:n=this.DEFAULT_DELAY,actions:o=[]})=>{const i=this.notifyEl.cloneNode(!0);if(i.querySelector("[data-dh-notify-heading]").innerText="[Dark Hole] "+e,t){i.querySelector("[data-dh-notify-message").innerText=t}if(o.length>0)for(const e of o){const t=document.createElement("button");t.dataset.dhNotifyAction=!0,t.style.marginInlineEnd="8px",t.innerText=e.label,t.addEventListener("click",(()=>{e.handler(),this.dismiss()})),i.appendChild(t)}this.notifyWrapper.appendChild(i),this.queue+=1,setTimeout(this.dismiss,n)}};function t(t){const n=`🛑 Stopped script: Dark Hole - ${t}`;console.log({content:n}),e({content:n})}let n=!1;const o=e=>{"Escape"===e.key&&(n=!0)};!async function({urlPaths:t,handler:n,message:o,actionLabel:i="🧹 Begin Removal"}){const s=window?.location?.pathname;t.some((e=>s===e))&&e.render({message:o,actions:[{label:i,handler:n}],delay:6e4})}({title:"Twitter Bookmarks",message:"Ready to clean up your data?\nNOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",handler:async function e(i=[]){document.addEventListener("keydown",o,!0);let s=500;async function a(){return new Promise((e=>setTimeout((()=>requestAnimationFrame(e)),s)))}function r(){return[...document.querySelectorAll('[data-testid="tweet"]')]}let d=i.length?i:r();console.log("🧹 Deleting bookmarks");for(const e of d){if(n)return t("Twitter Bookmarks"),void document.removeEventListener("keydown",o,!0);let i=e.querySelector('[data-testid="removeBookmark"]');i.click(),i=void 0,await a()}if(d=r(),s=void 0,d.length)return console.log("🧲 There are more tweets to delete"),e(d);console.log("✨ Done!")},urlPaths:["/i/bookmarks"]})}();
