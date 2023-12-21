import { notify } from "./notify"

const pageUrl = window?.location?.href

function snooze() {
  return new Promise((resolve) => setTimeout(resolve, 200))
}

async function handleNavigate() {
  await snooze()

  if (pageUrl !== window?.location?.href) {
    notify.dismissAll()

    document.removeEventListener("click", handleNavigate, true)
  }
}

function watchNavigation() {
  document.addEventListener("click", handleNavigate, true)
}

/**
 * This function will initialize the script on a fresh page load.
 */
export async function initialize({
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
  })

  watchNavigation()
}
