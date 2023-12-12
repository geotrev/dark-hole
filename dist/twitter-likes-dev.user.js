// ==UserScript==
// @name        Dark Hole - Twitter Likes (Beta)
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://twitter.com/*/likes
// @version     1.0.0-beta.22
// @downloadURL https://github.com/geotrev/dark-hole/raw/develop/dist/twitter-likes-dev.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/develop/dist/twitter-likes-dev.user.js
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

  async function initialize({
    urlPaths,
    handler,
    message,
    actionLabel = "🧹 Begin Removal",
  }) {
    const pathname = window?.location?.pathname;

    // Only run this script on posts, replies, or media profile page tabs
    if (!urlPaths.some((v) => pathname === v)) return

    // If one of the paths matches, alert the user to begin
    notify.render({
      message,
      actions: [{ label: actionLabel, handler }],
      delay: 60000,
    });
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
     * Timing can sometimes be sensitive on lower end PCs/Macs. If that's the case, increase this number in increments of 100 until the script is stable.
     *
     * NOTE: 500 = 500 milliseconds = 0.5 seconds
     */
    let INTERACTION_DELAY = 150;

    async function wait() {
      return new Promise((done) =>
        setTimeout(() => requestAnimationFrame(done), INTERACTION_DELAY)
      )
    }

    function queryCells() {
      return [...document.querySelectorAll('[data-testid="tweet"]')]
    }

    let cells = _cells.length ? _cells : queryCells();
    console.log("🧹 Removing likes...");

    for (const cell of cells) {
      if (SHOULD_STOP) {
        stopScript("Twitter Likes");
        document.removeEventListener("keydown", escapeHandler, true);

        return
      }

      let cellContainer = cell.closest('[data-testid="cellInnerDiv"]');
      let unlikeBtn = cell.querySelector('[data-testid="unlike"]');

      if (unlikeBtn) {
        unlikeBtn.click();
        await wait();
      }

      cellContainer.parentNode.removeChild(cellContainer);

      cellContainer = undefined;
      unlikeBtn = undefined;

      await wait();
    }

    cells = queryCells();
    INTERACTION_DELAY = undefined;

    if (cells.length) {
      console.log("🧲 There are more likes to remove");
      return handler(cells)
    } else {
      console.log("✨ Done!");
    }
  }
  (async function () {
    // This may take a few seconds to load depending on the internet connection. We need to wait for an async page render to resolve.
    const twitterHandle = await load(getTwitterHandle);

    if (!twitterHandle) return

    initialize({
      title: "Twitter Likes",
      message:
        "Ready to clean up your data?\nNOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",
      handler,
      urlPaths: [`/${twitterHandle}/likes`],
    });
  })();

})();
