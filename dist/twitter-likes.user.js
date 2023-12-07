// ==UserScript==
// @name        Dark Hole - Twitter Likes
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://www.twitter.com/*/likes
// @version     1.0.0
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/likes.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/likes.user.js
// @grant       none
// ==/UserScript==
!function(){"use strict";!async function e(t=[]){let o=150;async function n(){return new Promise((e=>setTimeout((()=>requestAnimationFrame(e)),o)))}function i(){return[...document.querySelectorAll('[data-testid="tweet"]')]}let l=t.length?t:i();console.log("🧹 Removing likes...");for(const e of l){let t=e.closest('[data-testid="cellInnerDiv"]'),o=e.querySelector('[data-testid="unlike"]');o&&(o.click(),await n()),t.parentNode.removeChild(t),t=void 0,o=void 0,await n()}if(l=i(),o=void 0,l.length)return console.log("🧲 There are more likes to remove"),e(l);console.log("✨ Done!")}()}();
