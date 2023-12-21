import {
  buildNotification,
  buildNotifyContainer,
  setActionStyles,
} from "./notify-dom.js"

let idCounter = 0

/**
 * Global notification utility to display messages to the user.
 */
class Notify {
  constructor() {
    this.notifyWrapper = buildNotifyContainer()
    this.notifyEl = buildNotification()

    /**
     * The default timer for notifications to be dismissed.
     */
    this.DEFAULT_TIMER = 3000

    /**
     * The current notifications queue. it is incremented and
     * decremented as notifications are added and removed.
     */
    this.queue = []

    document.body.appendChild(this.notifyWrapper)
    document.addEventListener("keydown", this.handleKeyDown, true)
  }

  queueIsEmpty = () => {
    return this.queue.length === 0
  }

  handleKeyDown = (e) => {
    if (this.queueIsEmpty() || e.key !== "Escape") return

    e.preventDefault()
    this.dismiss(this.queue[0])
  }

  dismiss = (targetId) => {
    if (this.queueIsEmpty()) return

    this.notifyWrapper.removeChild(
      this.notifyWrapper.querySelector(`[data-dh-notify="${targetId}"]`)
    )
    this.queue.splice(
      this.queue.findIndex((id) => id === targetId),
      1
    )
  }

  dismissAll = () => {
    this.queue.forEach((id) => this.dismiss(id))
  }

  render = ({
    title = "",
    message,
    timer = this.DEFAULT_TIMER,
    actions = [{ label: "OK" }],
  }) => {
    const notifyId = idCounter++
    const notification = this.notifyEl.cloneNode(true)

    notification.dataset.dhNotify = notifyId

    const titleEl = notification.querySelector("[data-dh-notify-heading]")
    titleEl.innerText = `[Dark Hole] ${title}`

    // Assign message to content node
    if (message) {
      const notifyContentEl = notification.querySelector(
        "[data-dh-notify-message]"
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

        actionEl.addEventListener("click", (e) => {
          action.handler?.(e)
          this.dismiss(notifyId)
        })

        notification.appendChild(actionEl)
      }
    }

    this.notifyWrapper.appendChild(notification)
    this.queue.push(notifyId)
    setTimeout(() => this.dismiss(notifyId), timer)

    return notifyId
  }
}

export const notify = new Notify()
