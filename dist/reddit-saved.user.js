// ==UserScript==
// @name        Dark Hole - Reddit Saved
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://old.reddit.com/user/*/saved
// @version     1.0.0
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/reddit-saved.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/reddit-saved.user.js
// @grant       none
// ==/UserScript==
!function(){"use strict";!async function e(t=[]){let o=100;async function n(e=o){return new Promise((t=>setTimeout((()=>requestAnimationFrame(t)),e)))}function r(){return[...document.querySelectorAll("[data-oc]")]}let i=t.length?t:r();if(i.length){console.log("🧹 Deleting saved items...");for(const e of i){let t=e.querySelector(".save-button > a");"unsave"===t.innerText&&(t.click(),await n(250)),t=void 0,e.parentNode.removeChild(e),await n()}}if(i=r(),o=void 0,i.length>0)return console.log("🧲 There are more saved posts/comments to remove"),e(i);console.log("✨ Done")}()}();
