import { notify } from "./notify"

const pageArgs = new Map()
let sessionIsInitialized = false

function beginScript({ handler, title, message, actionLabel }) {
  notify.render({
    title,
    message,
    actions: [{ label: actionLabel, handler }],
    delay: 60000,
  })
}

/**
 * Create event to watch for page navigation, clear existing operations,
 * then re-initialize the script on the subsequent page.
 */
function watchNavigation() {
  if (sessionIsInitialized) return

  // START monkey patch history state

  const pushState = history.pushState

  history.pushState = function () {
    pushState.apply(history, arguments)
  }

  // END monkey patch history state

  window?.addEventListener("popstate", () => {
    notify.dismissAll()

    const pathname = window?.location?.pathname

    if (pageArgs.has(pathname)) {
      initialize({ ...pageArgs.get(pathname) })
    }
  })
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
  if (pageArgs.has(pathname)) {
    return beginScript({ ...pageArgs.get(pathname) })
  }

  sessionIsInitialized = true

  // Only run this script on posts, replies, or media profile page tabs
  if (urlPaths.some((v) => pathname === v)) {
    // Cache the initializing data for dynamic navigation
    pageArgs.set(pathname, {
      pathname,
      urlPaths,
      handler,
      title,
      message,
      actionLabel,
    })

    // Kick off the script, remove any preexisting
    beginScript({ urlPaths, title, handler, message, actionLabel })

    // Watch for page navigation to re-initialize
    watchNavigation()
  }
}
