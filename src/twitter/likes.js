import { notify } from "../utils/notify.js"
import { getTwitterHandle } from "../utils/get-twitter-handle.js"
import { load } from "../utils/load.js"
import { stopScript } from "../utils/stop-script.js"
import { initialize } from "../utils/initialize.js"

let SHOULD_STOP = false

const escapeHandler = (e) => {
  if (e.key === "Escape") {
    SHOULD_STOP = true
  }
}

async function handler(_cells = []) {
  document.addEventListener("keydown", escapeHandler, true)

  /**
   * Timing can sometimes be sensitive on lower end PCs/Macs. If that's the case, increase this number in increments of 100 until the script is stable.
   *
   * NOTE: 500 = 500 milliseconds = 0.5 seconds
   */
  let INTERACTION_DELAY = 150

  async function wait() {
    return new Promise((done) =>
      setTimeout(() => requestAnimationFrame(done), INTERACTION_DELAY)
    )
  }

  function queryCells() {
    return [...document.querySelectorAll('[data-testid="tweet"]')]
  }

  let cells = _cells.length ? _cells : queryCells()

  notify.render({ message: "🧹 Removing likes" })

  for (const cell of cells) {
    if (SHOULD_STOP) {
      stopScript("Twitter Likes")
      document.removeEventListener("keydown", escapeHandler, true)

      return
    }

    let cellContainer = cell.closest('[data-testid="cellInnerDiv"]')
    let unlikeBtn = cell.querySelector('[data-testid="unlike"]')

    if (unlikeBtn) {
      unlikeBtn.click()
      await wait()
    }

    cellContainer.parentNode.removeChild(cellContainer)

    cellContainer = undefined
    unlikeBtn = undefined

    await wait()
  }

  cells = queryCells()
  INTERACTION_DELAY = undefined

  if (cells.length) {
    notify.render({
      message: "🧲 There are more Likes to remove, hold on...",
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
    notify.render({ message: "✨ Done!" })
  }
}

;(async function () {
  // This may take a few seconds to load depending on the internet connection. We need to wait for an async page render to resolve.
  const twitterHandle = await load(getTwitterHandle)

  if (!twitterHandle) return

  initialize({
    pathname: window?.location?.pathname,
    title: "Twitter Likes",
    handler,
    urlPaths: [`/${twitterHandle}/likes`],
  })
})()
