// ==UserScript==
// @name        Dark Hole - Twitter Bookmarks (Beta)
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://twitter.com/i/bookmarks
// @version     1.0.0-beta.25
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/twitter-bookmarks-dev.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/twitter-bookmarks-dev.user.js
// @grant       none
// ==/UserScript==
(function () {
  'use strict';

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

  function stopScript(name) {
    const content = `🛑 Stopped script: Dark Hole - ${name}`;

    console.log({ content });
    notify({ content });
  }

  const pageArgs = new Map();
  let sessionIsInitialized = false;

  async function beginScript({ handler, message, actionLabel }) {
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
  async function watchNavigation() {
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

  const cancelOnEscape = (e) => {
    if (e.key === "Escape") {
      SHOULD_STOP = true;
    }
  };

  async function handler(_cells = []) {
    document.addEventListener("keydown", cancelOnEscape, true);

    /**
     * Timing can sometimes be sensitive on lower end PCs/Macs. If that's the case, increase this number in increments of 100 until the script is stable.
     *
     * NOTE: 500 = 500 milliseconds = 0.5 seconds
     */
    let INTERACTION_DELAY = 500;

    async function wait() {
      return new Promise((done) =>
        setTimeout(() => requestAnimationFrame(done), INTERACTION_DELAY)
      )
    }

    function queryCells() {
      return [...document.querySelectorAll('[data-testid="tweet"]')]
    }

    let cells = _cells.length ? _cells : queryCells();
    console.log("🧹 Deleting bookmarks");

    for (const cell of cells) {
      if (SHOULD_STOP) {
        stopScript("Twitter Bookmarks");
        document.removeEventListener("keydown", cancelOnEscape, true);

        return
      }

      let unbookmarkItem = cell.querySelector('[data-testid="removeBookmark"]');

      unbookmarkItem.click();
      unbookmarkItem = undefined;

      await wait();
    }

    cells = queryCells();
    INTERACTION_DELAY = undefined;

    if (cells.length) {
      console.log("🧲 There are more tweets to delete");
      return handler(cells)
    } else {
      console.log("✨ Done!");
    }
  }
  (function () {
    initialize({
      title: "Twitter Bookmarks",
      handler,
      urlPaths: ["/i/bookmarks"],
    });
  })();

})();
