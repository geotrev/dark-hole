export const buildNotification = () => {
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

export const buildNotifyContainer = () => {
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

/**
 * Reset & assign custom styles to notification button
 */
export const setActionStyles = (actionEl) => {
  // Reset styles
  ;[
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
    actionEl.style[prop] = value
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
    actionEl.style[prop] = value
  })
}
