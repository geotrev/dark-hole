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
    const notifyWrapperTemp = document.createElement("div")
    const notifyElTemp = document.createElement("div")

    notifyWrapperTemp.innerHTML =
      '<div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;position: fixed;top: 0px;right: 0px;bottom: unset;left: 0px;z-index: 4000;padding: 32px;pointer-events: none;display: flex;flex-direction: column;align-items: flex-end;" data-dh-notify-container></div>'
    notifyElTemp.innerHTML =
      '<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 20px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;" data-dh-notify><h3 style="margin-bottom: 8px;margin-top:0;padding: 0;font-weight: bold;font-size: 12px;" data-dh-notify-heading></h3><p style="font-size: 16px;line-height: 22px;padding: 0;margin:0 0 12px 0;" data-dh-notify-message></p></section>'

    this.notifyWrapper = notifyWrapperTemp.firstElementChild
    this.notifyEl = notifyElTemp.firstElementChild

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

  dismiss = () => {
    if (this.queueIsEmpty()) return

    this.notifyWrapper.removeChild(this.notifyWrapper.firstElementChild)
    this.queue -= 1
  }

  render = ({
    title = "",
    message,
    delay = this.DEFAULT_DELAY,
    actions = [],
  }) => {
    const notify = this.notifyEl.cloneNode(true)

    const titleEl = notify.querySelector("[data-dh-notify-heading]")
    titleEl.innerText = title ? `[Dark Hole] ${title}` : "[Dark Hole]"

    // Assign message to content node
    if (message) {
      const notifyContentEl = notify.querySelector("[data-dh-notify-message")

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

        notify.appendChild(actionEl)
      }
    }

    this.notifyWrapper.appendChild(notify)
    this.queue += 1
    setTimeout(this.dismiss, delay)
  }
}

export const notify = new Notify()
