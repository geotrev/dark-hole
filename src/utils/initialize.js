import { notify } from "./notify"

export async function initialize({
  urlPaths,
  handler,
  message,
  actionLabel = "🧹 Begin Removal",
}) {
  const pathname = window?.location?.pathname

  // Only run this script on posts, replies, or media profile page tabs
  if (!urlPaths.some((v) => pathname === v)) return

  // If one of the paths matches, alert the user to begin
  notify.render({
    message,
    actions: [{ label: actionLabel, handler }],
    delay: 60000,
  })
}
