import { notify } from "../utils/notify.js"
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

  notify.render({
    message: "🧹 Removing bookmarks",
    delay: 3000,
  })

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
    notify.render({
      message: "🧲 There are more Bookmarks to remove, hold on...",
      delay: 2000,
      actions: [
        {
          label: "Stop now",
          handler: () => {
            SHOULD_STOP = true
          },
        },
      ],
    })

    return handler(cells)
  } else {
    notify.render({
      message: "✨ Done!",
      delay: 5000,
    })
  }
}

;(function () {
  initialize({
    pathname: window?.location?.pathname,
    title: "Twitter Bookmarks",
    handler,
    urlPaths: ["/i/bookmarks"],
  })
})()
