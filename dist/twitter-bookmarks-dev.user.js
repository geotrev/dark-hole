// ==UserScript==
// @name        Dark Hole - Twitter Bookmarks (Beta)
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://twitter.com/i/bookmarks
// @version     1.0.0-beta.47
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/twitter-bookmarks-dev.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/twitter-bookmarks-dev.user.js
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
    notification.style.minWidth = "200px";
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

  let idCounter = 0;

  /**
   * Global notification utility to display messages to the user.
   */
  class Notify {
    constructor() {
      this.notifyWrapper = buildNotifyContainer();
      this.notifyEl = buildNotification();

      /**
       * The default timer for notifications to be dismissed.
       */
      this.DEFAULT_TIMER = 3000;

      /**
       * The current notifications queue. it is incremented and
       * decremented as notifications are added and removed.
       */
      this.queue = [];

      document.body.appendChild(this.notifyWrapper);
      document.addEventListener("keydown", this.handleKeyDown, true);
    }

    queueIsEmpty = () => {
      return this.queue.length === 0
    }

    handleKeyDown = (e) => {
      if (this.queueIsEmpty() || e.key !== "Escape") return

      e.preventDefault();
      this.dismiss(this.queue[0]);
    }

    dismiss = (targetId) => {
      if (this.queueIsEmpty()) return

      this.notifyWrapper.removeChild(
        this.notifyWrapper.querySelector(`[data-dh-notify="${targetId}"]`)
      );
      this.queue.splice(
        this.queue.findIndex((id) => id === targetId),
        1
      );
    }

    dismissAll = () => {
      this.queue.forEach((id) => this.dismiss(id));
    }

    render = ({
      title = "",
      message,
      timer = this.DEFAULT_TIMER,
      actions = [{ label: "OK" }],
    }) => {
      const notifyId = idCounter++;
      const notification = this.notifyEl.cloneNode(true);

      notification.dataset.dhNotify = notifyId;

      const titleEl = notification.querySelector("[data-dh-notify-heading]");
      titleEl.innerText = `[Dark Hole] ${title}`;

      // Assign message to content node
      if (message) {
        const notifyContentEl = notification.querySelector(
          "[data-dh-notify-message]"
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

          actionEl.addEventListener("click", (e) => {
            action.handler?.(e);
            this.dismiss(notifyId);
          });

          notification.appendChild(actionEl);
        }
      }

      this.notifyWrapper.appendChild(notification);
      this.queue.push(notifyId);
      setTimeout(() => this.dismiss(notifyId), timer);

      return notifyId
    }
  }

  const notify = new Notify();

  function stopScript(name) {
    const content = `🛑 Stopped script: Dark Hole - ${name}`;

    console.log({ content });
    notify({ content });
  }

  const pageUrl = window?.location?.href;

  function snooze() {
    return new Promise((resolve) => setTimeout(resolve, 200))
  }

  async function handleNavigate() {
    await snooze();

    if (pageUrl !== window?.location?.href) {
      notify.dismissAll();

      document.removeEventListener("click", handleNavigate, true);
    }
  }

  function watchNavigation() {
    document.addEventListener("click", handleNavigate, true);
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
      timer: 60000,
    });

    watchNavigation();
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

    for (const cell of cells) {
      notify.render({ message: "🧹 Removing bookmarks" });

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
      notify.render({
        message: "🧲 There are more Bookmarks to remove, hold on...",
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
      notify.render({ message: "✨ Done!" });
    }
  }
  (function () {
    initialize({
      pathname: window?.location?.pathname,
      title: "Twitter Bookmarks",
      handler,
      urlPaths: ["/i/bookmarks"],
    });
  })();

})();
