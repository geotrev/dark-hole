// ==UserScript==
// @name        Dark Hole - Twitter Bookmarks
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://www.twitter.com/i/bookmarks
// @version     1.0.0
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/bookmarks.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/bookmarks.user.js
// @grant       none
// ==/UserScript==
!function(){"use strict";!async function e(t=[]){let o=500;async function n(){return new Promise((e=>setTimeout((()=>requestAnimationFrame(e)),o)))}function r(){return[...document.querySelectorAll('[data-testid="tweet"]')]}let l=t.length?t:r();console.log("🧹 Deleting tweets");for(const e of l){let e=document.querySelector('[data-testid="removeBookmark"]');e.click(),e=void 0,await n()}if(l=r(),o=void 0,l.length)return console.log("🧲 There are more tweets to delete"),e(l);console.log("✨ Done!")}()}();
