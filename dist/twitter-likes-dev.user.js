// ==UserScript==
// @name        Dark Hole - Twitter Likes (Beta)
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://twitter.com/*/likes
// @version     1.0.0-beta.37
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/twitter-likes-dev.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/twitter-likes-dev.user.js
// @grant       none
// ==/UserScript==
(function () {
  'use strict';

  const buildNotification = () => {
    const notification = document.createElement("section");

    notification.style.pointerEvents = "auto";
    notification.style.flexWrap = "wrap";
    notification.style.backgroundColor = "#333";
    notification.style.margin = "0px";
    notification.style.color = "#dedede";
    notification.style.padding = "20px";
    notification.style.borderRadius = "8px";
    notification.style.maxWidth = "280px";
    notification.style.boxShadow = "0 5px 10px rgba(0,0,0,0.5)";
    notification.style.marginBottom = "12px";

    const title = document.createElement("h3");

    title.style.marginBottom = "8px";
    title.style.marginTop = "0";
    title.style.padding = "0";
    title.style.fontWeight = "bold";
    title.style.fontSize = "12px";

    const message = document.createElement("p");

    message.style.fontSize = "16px";
    message.style.lineHeight = "22px";
    message.style.padding = "0";
    message.style.margin = "0 0 12px 0";

    notification.dataset.dhNotify = true;
    title.dataset.dhNotifyHeading = true;
    message.dataset.dhNotifyMessage = true;

    notification.appendChild(title);
    notification.appendChild(message);

    return notification
  };

  const buildNotifyContainer = () => {
    const container = document.createElement("div");

    container.style.fontFamily =
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif";
    container.style.position = "fixed";
    container.style.top = "0px";
    container.style.right = "0px";
    container.style.bottom = "unset";
    container.style.left = "0px";
    container.style.zIndex = "4000";
    container.style.padding = "32px";
    container.style.pointerEvents = "none";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "flex-end";
    container.dataset.dhNotifyContainer = true;

    return container
  };

  /**
   * Reset & assign custom styles to notification button
   */
  const setActionStyles = (actionEl) => {
  [
      ["display", "inline-block"],
      ["border", "none"],
      ["margin", "0"],
      ["textDecoration", "none"],
      ["fontFamily", "inherit"],
      ["fontSize", "inherit"],
      ["lineHeight", "1"],
      ["cursor", "pointer"],
      ["textAlign", "center"],
    ].forEach(([prop, value]) => {
      actionEl.style[prop] = value;
    })

    // Set custom styles
    ;[
      ["transition", "background 0.2s ease-in-out"],
      ["marginInlineEnd", "8px"],
      ["backgroundColor", "white"],
      ["color", "#222"],
      ["appearance", "none"],
      ["borderRadius", "2px"],
      ["padding", "6px 10px"],
    ].forEach(([prop, value]) => {
      actionEl.style[prop] = value;
    });
  };

  /**
   * Global notification utility to display messages to the user.
   */
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
      this.notifyWrapper = buildNotifyContainer();
      this.notifyEl = buildNotification();

      document.body.appendChild(this.notifyWrapper);
      document.addEventListener("keydown", this.handleKeyDown, true);
    }

    queueIsEmpty = () => {
      return this.queue <= 0
    }

    handleKeyDown = (e) => {
      if (this.queueIsEmpty() || e.key !== "Escape") return

      e.preventDefault();
      this.dismiss();
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
      const notification = this.notifyEl.cloneNode(true);

      const titleEl = notification.querySelector("[data-dh-notify-heading]");
      titleEl.innerText = `[Dark Hole] ${title}`;

      // Assign message to content node
      if (message) {
        const notifyContentEl = notification.querySelector(
          "[data-dh-notify-message"
        );

        notifyContentEl.innerText = message;
      }

      // Attach action callbacks to DOM nodes
      if (actions.length > 0) {
        for (const action of actions) {
          const actionEl = document.createElement("button");

          setActionStyles(actionEl);

          actionEl.dataset.dhNotifyAction = true;
          actionEl.innerText = action.label;

          actionEl.addEventListener("click", () => {
            action.handler?.();
            this.dismiss();
          });

          notification.appendChild(actionEl);
        }
      }

      this.notifyWrapper.appendChild(notification);
      this.queue += 1;
      setTimeout(this.dismiss, delay);
    }
  }

  const notify = new Notify();

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

  /**
   * This function will initialize the script on a fresh page load.
   */
  async function initialize({
    pathname,
    title,
    urlPaths,
    handler,
    message = "Ready to clean up your data?\nNOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",
    actionLabel = "🧹 Begin Removal",
  }) {
    if (!urlPaths.some((v) => pathname === v)) return

    // Kick off the script

    notify.render({
      title,
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

    notify.render({
      message: "🧹 Removing likes",
      delay: 3000,
      actions: [{ label: "OK" }],
    });

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
      notify.render({
        message: "🧲 There are more Likes to remove, hold on...",
        delay: 2000,
        actions: [
          {
            label: "Stop now",
            handler: () => {
              SHOULD_STOP = true;
            },
          },
        ],
      });

      return handler(cells)
    } else {
      notify.render({
        message: "✨ Done!",
        delay: 5000,
        actions: [{ label: "OK" }],
      });
    }
  }
  (async function () {
    // This may take a few seconds to load depending on the internet connection. We need to wait for an async page render to resolve.
    const twitterHandle = await load(getTwitterHandle);

    if (!twitterHandle) return

    initialize({
      pathname: window?.location?.pathname,
      title: "Twitter Likes",
      handler,
      urlPaths: [`/${twitterHandle}/likes`],
    });
  })();

})();
