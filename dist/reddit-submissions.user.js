// ==UserScript==
// @name        Dark Hole - Reddit Submissions
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://old.reddit.com/user/*/(comments|submitted)
// @version     0.0.0
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/reddit-submissions.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/reddit-submissions.user.js
// @grant       none
// ==/UserScript==
!function(){"use strict";!async function e(o=[]){let t=500;async function n(){return new Promise((e=>setTimeout((()=>requestAnimationFrame(e)),t)))}function l(){return[...document.querySelectorAll("[data-oc]"),...document.querySelectorAll('[data-type="comment"]')]}let r=o.length?o:l();if(r.length){console.log("🧹 Deleting submissions...");for(const e of r){let o=e.querySelector(".del-button .option.error .yes");o&&o.click(),o=void 0,await n()}}if(r=l(),t=void 0,r.length>0)return console.log("🧲 There are more submissions to delete"),e(r);console.log("✨ Done")}()}();
