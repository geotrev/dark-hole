function Notify() {
  const notifyWrapperTemp = document.createElement("div")
  const notifyElTemp = document.createElement("div")

  notifyWrapperTemp.innerHTML =
    '<div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;position: fixed;top: 0px;right: 0px;bottom: unset;left: 0px;z-index: 4000;padding: 48px 16px;pointer-events: none;display: flex;flex-direction: column;align-items: flex-end;"></div>'
  notifyElTemp.innerHTML =
    '<section role="region" style="pointer-events: auto;flex-wrap: wrap;background-color: #333;margin: 0px;color: #dedede;padding: 12px 16px;border-radius: 8px;max-width: 280px;box-shadow: 0 5px 10px rgba(0,0,0,0.5);margin-bottom: 12px;"><h3 style="margin-bottom: 8px;margin-top:0;padding: 0;font-weight: bold;font-size: 12px;">[Dark Hole]</h3><p style="font-size: 16px;line-height: 22px;padding: 0;margin:0;" data-notify-content></p></section>'

  const notifyWrapper = notifyWrapperTemp.firstElementChild
  const notifyEl = notifyElTemp.firstElementChild
  let queue = 0

  const DEFAULT_DELAY = 2000

  function queueIsEmpty() {
    return queue <= 0
  }

  function dismiss() {
    if (queueIsEmpty()) return

    notifyWrapper.removeChild(notifyWrapper.firstElementChild)
    queue -= 1
  }

  function handleKeydown(e) {
    if (queueIsEmpty() || e.key !== "Escape") return

    e.preventDefault()
    dismiss()
  }

  function trigger({ content, delay = DEFAULT_DELAY, actions = [] }) {
    const notify = notifyEl.cloneNode(true)

    if (content) {
      notify.querySelector("p").innerText = content
      notify.querySelector("p").style.marginBlockEnd = "12px"
    }

    if (actions.length > 0) {
      for (const action of actions) {
        const actionEl = document.createElement("button")
        actionEl.style.marginInlineEnd = "8px"
        actionEl.innerText = action.label

        actionEl.addEventListener("click", () => {
          action.handler()
          dismiss()
        })

        notify.appendChild(actionEl)
      }
    }

    notifyWrapper.appendChild(notify)
    queue += 1
    setTimeout(dismiss, delay)
  }

  document.body.appendChild(notifyWrapper)
  document.addEventListener("keydown", handleKeydown, true)

  return trigger
}

export const notify = new Notify()
