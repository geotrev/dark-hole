// ==UserScript==
// @name        Dark Hole - Twitter Bookmarks (Beta)
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://www.twitter.com/i/bookmarks
// @version     1.0.0-beta.16
// @downloadURL https://github.com/geotrev/dark-hole/raw/develop/dist/bookmarks-dev.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/develop/dist/bookmarks-dev.user.js
// @grant       none
// ==/UserScript==
(function () {
  'use strict';

  /**
    * Page: twitter.com/i/bookmarks
    * Run from: Dev tools console
    */

  (async function exec(_cells = []) {
    /**
      * Timing can sometimes be sensitive on lower end PCs/Macs. If that's the case, increase this number in increments of 100 until the script is stable.
      *
      * NOTE: 500 = 500 milliseconds = 0.5 seconds
      */
    let INTERACTION_DELAY = 500;
   
    async function wait() {
      return new Promise((done) =>
        setTimeout(() => requestAnimationFrame(done), INTERACTION_DELAY)
      );
    }
    
    function queryCells() {
      return [...document.querySelectorAll('[data-testid="tweet"]')];
    }

    let cells = _cells.length ? _cells : queryCells();
    console.log("🧹 Deleting tweets");

    for (const cell of cells) {
      let unbookmarkItem = document.querySelector(
        '[data-testid="removeBookmark"]'
      );

      unbookmarkItem.click();
      unbookmarkItem = undefined;
     
      await wait();
    }

    cells = queryCells();
    INTERACTION_DELAY = undefined;

    if (cells.length) {
      console.log("🧲 There are more tweets to delete");
      return exec(cells);
    } else {
      console.log("✨ Done!");
    }
  })();

})();
