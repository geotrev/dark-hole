// ==UserScript==
// @name        Dark Hole - Reddit Votes
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://old.reddit.com/user/*/(upvoted|downvoted)
// @version     1.0.0
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/votes.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/votes.user.js
// @grant       none
// ==/UserScript==
!function(){"use strict";!async function e(o=[]){let t=100;async function n(e=t){return new Promise((o=>setTimeout((()=>requestAnimationFrame(o)),e)))}function r(){return[...document.querySelectorAll("[data-oc]")]}let l=o.length?o:r();if(l.length){console.log("🧹 Removing votes...");for(const e of l){if(e.querySelector(".archived"))e.parentNode.removeChild(e);else{let o=e.querySelector(".upmod")||e.querySelector(".downmod");o&&o.click(),await n(250),o=void 0,e.parentNode.removeChild(e)}await n()}}if(l=r(),t=void 0,l.length>0)return console.log("🧲 There are more posts to unvote"),e(l);console.log("✨ Done")}()}();
