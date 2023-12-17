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
    this.notifyWrapper = this.buildNotifyContainer()
    this.notifyEl = this.buildNotification()

    document.body.appendChild(this.notifyWrapper)
    document.addEventListener("keydown", this.handleKeyDown, true)
  }

  handleKeyDown = (e) => {
    if (this.queueIsEmpty() || e.key !== "Escape") return

    e.preventDefault()
    this.dismiss()
  }

  queueIsEmpty = () => {
    return this.queue <= 0
  }

  buildNotifyContainer = () => {
    const container = document.createElement("div")

    container.style.fontFamily =
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    container.style.position = "fixed"
    container.style.top = "0px"
    container.style.right = "0px"
    container.style.bottom = "unset"
    container.style.left = "0px"
    container.style.zIndex = "4000"
    container.style.padding = "32px"
    container.style.pointerEvents = "none"
    container.style.display = "flex"
    container.style.flexDirection = "column"
    container.style.alignItems = "flex-end"
    container.dataset.dhNotifyContainer = true

    return container
  }

  buildNotification = () => {
    const notification = document.createElement("section")

    notification.style.pointerEvents = "auto"
    notification.style.flexWrap = "wrap"
    notification.style.backgroundColor = "#333"
    notification.style.margin = "0px"
    notification.style.color = "#dedede"
    notification.style.padding = "20px"
    notification.style.borderRadius = "8px"
    notification.style.maxWidth = "280px"
    notification.style.boxShadow = "0 5px 10px rgba(0,0,0,0.5)"
    notification.style.marginBottom = "12px"

    const title = document.createElement("h3")

    title.style.marginBottom = "8px"
    title.style.marginTop = "0"
    title.style.padding = "0"
    title.style.fontWeight = "bold"
    title.style.fontSize = "12px"

    const message = document.createElement("p")

    message.style.fontSize = "16px"
    message.style.lineHeight = "22px"
    message.style.padding = "0"
    message.style.margin = "0 0 12px 0"

    notification.dataset.dhNotify = true
    title.dataset.dhNotifyHeading = true
    message.dataset.dhNotifyMessage = true

    notification.appendChild(title)
    notification.appendChild(message)

    return notification
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

  render = ({ title, message, delay = this.DEFAULT_DELAY, actions = [] }) => {
    const notification = this.notifyEl.cloneNode(true)

    const titleEl = notification.querySelector("[data-dh-notify-heading]")
    titleEl.innerText = title ? `[Dark Hole] ${title}` : "[Dark Hole]"

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

        actionEl.dataset.dhNotifyAction = true
        actionEl.style.marginInlineEnd = "8px"
        actionEl.innerText = action.label

        actionEl.addEventListener("click", () => {
          action.handler()
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
