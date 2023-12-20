import {
  buildNotification,
  buildNotifyContainer,
  setActionStyles,
} from "./notify-dom.js"

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
    this.notifyWrapper = buildNotifyContainer()
    this.notifyEl = buildNotification()

    document.body.appendChild(this.notifyWrapper)
    document.addEventListener("keydown", this.handleKeyDown, true)
  }

  queueIsEmpty = () => {
    return this.queue <= 0
  }

  handleKeyDown = (e) => {
    if (this.queueIsEmpty() || e.key !== "Escape") return

    e.preventDefault()
    this.dismiss()
  }

  dismiss = () => {
    if (this.queueIsEmpty()) return

    this.notifyWrapper.removeChild(this.notifyWrapper.firstElementChild)
    this.queue -= 1
  }

  dismissAll = () => {
    while (!this.queueIsEmpty()) {
      this.dismiss()
    }
  }

  render = ({
    title = "",
    message,
    delay = this.DEFAULT_DELAY,
    actions = [],
  }) => {
    const notification = this.notifyEl.cloneNode(true)

    const titleEl = notification.querySelector("[data-dh-notify-heading]")
    titleEl.innerText = `[Dark Hole] ${title}`

    // Assign message to content node
    if (message) {
      const notifyContentEl = notification.querySelector(
        "[data-dh-notify-message"
      )

      notifyContentEl.innerText = message
    }

    // Attach action callbacks to DOM nodes
    if (actions.length > 0) {
      for (const action of actions) {
        const actionEl = document.createElement("button")

        setActionStyles(actionEl)

        actionEl.dataset.dhNotifyAction = true
        actionEl.innerText = action.label

        actionEl.addEventListener("click", () => {
          action.handler?.()
          this.dismiss()
        })

        notification.appendChild(actionEl)
      }
    }

    this.notifyWrapper.appendChild(notification)
    this.queue += 1
    setTimeout(this.dismiss, delay)
  }
}

export const notify = new Notify()
