// ==UserScript==
// @name        Dark Hole - Twitter Posts (Beta)
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://twitter.com/*
// @version     1.0.0-beta.26
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/twitter-posts-dev.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/twitter-posts-dev.user.js
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

  class Notify {
    /**
     * The current notifications queue. it is incremented and
     * decremented as notifications are added and removed.
     */
    static queue = 0

    /**
     * The default delay for notifications to be dismissed.
     */
    static DEFAULT_DELAY = 2000

    constructor() {
      const notifyWrapperTemp = document.createElement("div");
      const notifyElTemp = document.createElement("div");

      notifyWrapperTemp.innerHTML =
        '<div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;position: fixed;top: 0px;right: 0px;bottom: unset;left: 0px;z-index: 4000;padding: 32px;pointer-events: none;display: flex;flex-direction: column;align-items: flex-end;" data-dh-notify-container></div>';
      notifyElTemp.innerHTML =
        '<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 20px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;" data-dh-notify><h3 style="margin-bottom: 8px;margin-top:0;padding: 0;font-weight: bold;font-size: 12px;" data-dh-notify-heading></h3><p style="font-size: 16px;line-height: 22px;padding: 0;margin:0 0 12px 0;" data-dh-notify-message></p></section>';

      this.notifyWrapper = notifyWrapperTemp.firstElementChild;
      this.notifyEl = notifyElTemp.firstElementChild;

      document.body.appendChild(this.notifyWrapper);
      document.addEventListener("keydown", this.handleKeyDown, true);
    }

    handleKeyDown = (e) => {
      if (this.queueIsEmpty() || e.key !== "Escape") return

      e.preventDefault();
      this.dismiss();
    }

    queueIsEmpty = () => {
      return this.queue <= 0
    }

    dismiss = () => {
      if (this.queueIsEmpty()) return

      this.notifyWrapper.removeChild(this.notifyWrapper.firstElementChild);
      this.queue -= 1;
    }

    dismissAll = () => {
      while (!this.queueIsEmpty()) {
        this.dismiss();
      }
    }

    render = ({
      title = "",
      message,
      delay = this.DEFAULT_DELAY,
      actions = [],
    }) => {
      const notify = this.notifyEl.cloneNode(true);

      const titleEl = notify.querySelector("[data-dh-notify-heading]");
      titleEl.innerText = title ? `[Dark Hole] ${title}` : "[Dark Hole]";

      // Assign message to content node
      if (message) {
        const notifyContentEl = notify.querySelector("[data-dh-notify-message");

        notifyContentEl.innerText = message;
      }

      // Attach action callbacks to DOM nodes
      if (actions.length > 0) {
        for (const action of actions) {
          const actionEl = document.createElement("button");

          actionEl.dataset.dhNotifyAction = true;
          actionEl.style.marginInlineEnd = "8px";
          actionEl.innerText = action.label;

          actionEl.addEventListener("click", () => {
            action.handler();
            this.dismiss();
          });

          notify.appendChild(actionEl);
        }
      }

      this.notifyWrapper.appendChild(notify);
      this.queue += 1;
      setTimeout(this.dismiss, delay);
    }
  }

  const notify = new Notify();

  /**
   * Given a DOM state, repeatedly call the given callback until it returns truthy.
   * Show a message if unable to resolve.
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

  function stopScript(name) {
    const content = `🛑 Stopped script: Dark Hole - ${name}`;

    console.log({ content });
    notify({ content });
  }

  const pageArgs = new Map();
  let sessionIsInitialized = false;

  function beginScript({ handler, message, actionLabel }) {
    notify.render({
      message,
      actions: [{ label: actionLabel, handler }],
      delay: 60000,
    });
  }

  /**
   * Create event to watch for page navigation, clear existing operations,
   * then re-initialize the script on the subsequent page.
   */
  function watchNavigation() {
    if (sessionIsInitialized) return

    // START monkey patch history state

    const pushState = history.pushState;

    history.pushState = function () {
      pushState.apply(history, arguments);
    };

    // END monkey patch history state

    window?.addEventListener("popstate", () => {
      notify.dismissAll();

      const pathname = window?.location?.pathname;

      if (pageArgs.has(pathname)) {
        initialize({ ...pageArgs.get(pathname) });
      }
    });
  }

  /**
   * This function will initialize the script on a fresh page load.
   */
  async function initialize({
    pathname,
    urlPaths,
    handler,
    message = "Ready to clean up your data?\nNOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",
    actionLabel = "🧹 Begin Removal",
  }) {
    if (pageArgs.has(pathname)) {
      return beginScript({ ...pageArgs.get(pathname) })
    }

    sessionIsInitialized = true;

    // Only run this script on posts, replies, or media profile page tabs
    if (urlPaths.some((v) => pathname === v)) {
      // Cache the initializing data for dynamic navigation
      pageArgs.set(pathname, {
        pathname,
        urlPaths,
        handler,
        message,
        actionLabel,
      });

      // Kick off the script, remove any preexisting
      beginScript({ urlPaths, handler, message, actionLabel });

      // Watch for page navigation to re-initialize
      watchNavigation();
    }
  }

  let SHOULD_STOP = false;

  const escapeHandler = (e) => {
    if (e.key === "Escape") {
      SHOULD_STOP = true;
    }
  };

  async function handler(_cells = []) {
    document.addEventListener("keydown", escapeHandler, true);

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
      if (SHOULD_STOP) {
        stopScript("Twitter Posts");
        document.removeEventListener("keydown", escapeHandler, true);

        return
      }

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
      await handler(cells);
    } else {
      console.log("✨ Done!");
    }
  }
  (async function () {
    // This may take a few seconds to load depending on the internet connection. We need to wait for an async page render to resolve.
    const twitterHandle = await load(getTwitterHandle);

    if (!twitterHandle) return

    initialize({
      pathname: window?.location?.pathname,
      title: "Twitter Posts",
      handler,
      urlPaths: [
        `/${twitterHandle}`,
        `/${twitterHandle}/with_replies`,
        `/${twitterHandle}/media`,
      ],
    });
  })();

})();
