// ==UserScript==
// @name        Dark Hole - Twitter Posts
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://www.twitter.com*
// @version     1.0.0-beta.1
// @downloadURL https://github.com/geotrev/dark-hole/raw/develop/dist/posts-dev.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/develop/dist/posts-dev.user.js
// @grant       none
// ==/UserScript==
(function () {
  'use strict';

  /**
   * Returns the Twitter handle if it exists on the page, or null.
   *
   * @returns string
   */
  function getTwitterHandle() {
    return (
      document
        .querySelector('[data-testid="UserName"]')
        ?.innerText.split("\n")?.[1]
        ?.slice(1) || null
    )
  }

  async function exec(_cells = []) {
    /**
     * Specify your Twitter handle:
     */
    let TWITTER_HANDLE = "TWITTER_HANDLE";

    /**
     * Timing can sometimes be sensitive on lower end PCs/Macs. If that's the case, increase this number in increments of 100 until the script is stable.
     *
     * NOTE: 500 = 500 milliseconds = 0.5 seconds
     */
    let INTERACTION_DELAY = 500;

    async function wait(ms = INTERACTION_DELAY) {
      return new Promise((done) =>
        setTimeout(() => requestAnimationFrame(done), ms)
      )
    }

    /**
     * BEGIN SCRTIPT
     */

    const pathname = window?.location?.pathname;
    const isProfilePageWithPosts =
      pathname.startsWith(`/${TWITTER_HANDLE}`) ||
      pathname.startsWith(`/${TWITTER_HANDLE}/with_replies`) ||
      pathname.startsWith(`/${TWITTER_HANDLE}/media`);

    /**
     * Only procede in this script if we're on a profile page
     */
    if (!isProfilePageWithPosts) {
      return
    }

    function queryCells() {
      return [...document.querySelectorAll('[data-testid="tweet"]')]
    }

    let cells = _cells.length ? _cells : queryCells();
    console.log("🧹 Deleting tweets");

    for (const cell of cells) {

      let cellContainer = cell.closest('[data-testid="cellInnerDiv"]');
      let isSelfTweet = !!cell
        .querySelector('[data-testid="User-Name"]')
        ?.innerText.includes(`@${TWITTER_HANDLE}`);
      let isRetweet = !!cell.querySelector('[data-testid="socialContext"]');
      let overflowBtn = cell.querySelector('[data-testid="caret"]');

      if (isRetweet) {
        let untweetBtn = cell.querySelector('[data-testid="unretweet"]');
        untweetBtn.click();
        await wait();

        let undoBtn = document.querySelector(
          '[data-testid="Dropdown"] > [data-testid="unretweetConfirm"]'
        );
        undoBtn.click();
      } else {
        if (!isSelfTweet) continue

        overflowBtn.click();
        await wait();

        // first menu item is the "delete" button
        let deleteBtn = document.querySelector(
          '[data-testid="Dropdown"] > [role="menuitem"]'
        );

        deleteBtn.click();

        await wait();

        let confirmDialogBtn = document.querySelector(
          '[data-testid="confirmationSheetDialog"] [data-testid="confirmationSheetConfirm"]'
        );
        confirmDialogBtn.click();

        await wait();

        // Cleanup all tweets above the removed tweet.
        // Unfortunately Twitter doesn't automatically purge these. :/
        let timelineCells = [...cellContainer.parentNode.children];
        let cellIndex = timelineCells.indexOf(cellContainer);
        timelineCells
          .slice(0, cellIndex)
          .forEach((child) => child.parentNode.removeChild(child));
      }

      await wait();
    }

    cells = queryCells();

    if (cells.length) {
      console.log("🧲 There are more tweets to delete");
      await exec(cells);
    } else {
      console.log("✨ Done!");
    }
  }

  function init() {
    const pathname = window?.location?.pathname;
    const handle = getTwitterHandle();

    // Only run this script on posts, replies, or media profile page tabs

    if (
      pathname === `/${handle}` ||
      pathname === `/${handle}/with_replies` ||
      pathname === `/${handle}/media`
    ) {
      notify({
        content:
          "Ready to clean up your data? NOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",
        actions: [{ label: "🧹 Begin Removal", handler: exec }],
        delay: 60000,
      });
    }
  }

  init();

})();
