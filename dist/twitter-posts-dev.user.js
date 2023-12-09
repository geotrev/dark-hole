// ==UserScript==
// @name        Dark Hole - Twitter Posts (Beta)
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://twitter.com/*
// @version     1.0.0-beta.8
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

  function Notify() {
    const notifyWrapperTemp = document.createElement("div");
    const notifyElTemp = document.createElement("div");

    notifyWrapperTemp.innerHTML =
      '<div style="position: fixed;top: 0px;right: 0px;bottom: unset;left: 0px;z-index: 4000;padding: 48px 16px;pointer-events: none;display: flex;flex-direction: column;align-items: flex-end;"></div>';
    notifyElTemp.innerHTML =
      '<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 12px 16px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;"><h3 style="margin-bottom: 8px;margin-top:0;padding: 0;font-weight: bold;font-size: 12px;">[Dark Hole]</h3><p style="font-size: 16px;line-height: 22px;padding: 0;margin:0;" data-notify-content></p></section>';

    const notifyWrapper = notifyWrapperTemp.firstElementChild;
    const notifyEl = notifyElTemp.firstElementChild;
    let queue = 0;

    const DEFAULT_DELAY = 2000;

    function queueIsEmpty() {
      return queue <= 0
    }

    function dismiss() {
      if (queueIsEmpty()) return

      notifyWrapper.removeChild(notifyWrapper.firstElementChild);
      queue -= 1;
    }

    function handleKeydown(e) {
      if (queueIsEmpty() || e.key !== "Escape") return

      e.preventDefault();
      dismiss();
    }

    function trigger({ content, delay = DEFAULT_DELAY, actions = [] }) {
      const notify = notifyEl.cloneNode(true);

      if (content) {
        notify.querySelector("p").innerText = content;
      }

      if (actions.length > 0) {
        for (const action of actions) {
          const actionEl = document.createElement("button");
          actionEl.style.marginInlineEnd = "8px";
          actionEl.innerText = action.label;

          actionEl.addEventListener("click", () => {
            action.handler();
            dismiss();
          });

          notify.appendChild(actionEl);
        }
      }

      notifyWrapper.appendChild(notify);
      queue += 1;
      setTimeout(dismiss, delay);
    }

    document.body.appendChild(notifyWrapper);
    document.addEventListener("keydown", handleKeydown, true);

    return trigger
  }

  const notify = new Notify();

  /**
   * Given a DOM state, repeatedly call the given callback condition until it returns truthy.
   *
   * @param {*} callback
   * @param {string} failMsg
   * @param {{tries: number, interval: number}} timing
   * @returns {*}
   */
  async function load(callback, failMsg, timing = {}) {
    const tries = timing.tries || 10;
    const interval = timing.interval || 100;
    const message =
      failMsg ||
      "Unable to resolve value after " + String(tries * interval) + "ms.";

    return new Promise((resolve, reject) => {
      let i = 0;

      const int = setInterval(() => {
        const value = callback();
        if (value) {
          clearInterval(int);
          resolve(value);
        }

        if (++i === tries) {
          clearInterval(int);
          if (failMsg) {
            notify({ content: message });
          }
          reject();
        }
      }, interval);
    })
  }

  async function exec(_cells = []) {
    /**
     * Specify your Twitter handle:
     */
    let TWITTER_HANDLE = getTwitterHandle();

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

  async function init() {
    const pathname = window?.location?.pathname;

    // This may take a few seconds to load depending on the internet connection. We need to wait for an async page render to resolve.
    const handle = await load(getTwitterHandle);

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
