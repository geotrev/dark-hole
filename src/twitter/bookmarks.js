import { stopScript } from "../utils/stop-script.js"
import { initialize } from "../utils/initialize.js"

let SHOULD_STOP = false

const cancelOnEscape = (e) => {
  if (e.key === "Escape") {
    SHOULD_STOP = true
  }
}

async function handler(_cells = []) {
  document.addEventListener("keydown", cancelOnEscape, true)

  /**
   * Timing can sometimes be sensitive on lower end PCs/Macs. If that's the case, increase this number in increments of 100 until the script is stable.
   *
   * NOTE: 500 = 500 milliseconds = 0.5 seconds
   */
  let INTERACTION_DELAY = 500

  async function wait() {
    return new Promise((done) =>
      setTimeout(() => requestAnimationFrame(done), INTERACTION_DELAY)
    )
  }

  function queryCells() {
    return [...document.querySelectorAll('[data-testid="tweet"]')]
  }

  let cells = _cells.length ? _cells : queryCells()
  console.log("🧹 Deleting bookmarks")

  for (const cell of cells) {
    if (SHOULD_STOP) {
      stopScript("Twitter Bookmarks")
      document.removeEventListener("keydown", cancelOnEscape, true)

      return
    }

    let unbookmarkItem = cell.querySelector('[data-testid="removeBookmark"]')

    unbookmarkItem.click()
    unbookmarkItem = undefined

    await wait()
  }

  cells = queryCells()
  INTERACTION_DELAY = undefined

  if (cells.length) {
    console.log("🧲 There are more tweets to delete")
    return handler(cells)
  } else {
    console.log("✨ Done!")
  }
}

initialize({
  title: "Twitter Bookmarks",
  message:
    "Ready to clean up your data?\nNOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",
  handler,
  urlPaths: ["/i/bookmarks"],
})
