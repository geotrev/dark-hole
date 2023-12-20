import { notify } from "./notify"

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
    delay: 60000,
  })
}
