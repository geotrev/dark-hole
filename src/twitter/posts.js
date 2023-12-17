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
   * Specify your Twitter handle:
   */
  let TWITTER_HANDLE = getTwitterHandle()

  /**
   * Timing can sometimes be sensitive on lower end PCs/Macs. If that's the case, increase this number in increments of 100 until the script is stable.
   *
   * NOTE: 500 = 500 milliseconds = 0.5 seconds
   */
  let INTERACTION_DELAY = 500

  async function wait(ms = INTERACTION_DELAY) {
    return new Promise((done) =>
      setTimeout(() => requestAnimationFrame(done), ms)
    )
  }

  /**
   * BEGIN SCRTIPT
   */

  function queryCells() {
    return [...document.querySelectorAll('[data-testid="tweet"]')]
  }

  let cells = _cells.length ? _cells : queryCells()
  console.log("🧹 Deleting tweets")

  for (const cell of cells) {
    if (SHOULD_STOP) {
      stopScript("Twitter Posts")
      document.removeEventListener("keydown", escapeHandler, true)

      return
    }

    let cellContainer = cell.closest('[data-testid="cellInnerDiv"]')
    let isSelfTweet = !!cell
      .querySelector('[data-testid="User-Name"]')
      ?.innerText.includes(`@${TWITTER_HANDLE}`)
    let isRetweet = !!cell.querySelector('[data-testid="socialContext"]')
    let overflowBtn = cell.querySelector('[data-testid="caret"]')

    if (isRetweet) {
      let untweetBtn = cell.querySelector('[data-testid="unretweet"]')
      untweetBtn.click()
      await wait()

      let undoBtn = document.querySelector(
        '[data-testid="Dropdown"] > [data-testid="unretweetConfirm"]'
      )
      undoBtn.click()
    } else {
      if (!isSelfTweet) continue

      overflowBtn.click()
      await wait()

      // first menu item is the "delete" button
      let deleteBtn = document.querySelector(
        '[data-testid="Dropdown"] > [role="menuitem"]'
      )

      deleteBtn.click()

      await wait()

      let confirmDialogBtn = document.querySelector(
        '[data-testid="confirmationSheetDialog"] [data-testid="confirmationSheetConfirm"]'
      )
      confirmDialogBtn.click()

      await wait()

      // Cleanup all tweets above the removed tweet.
      // Unfortunately Twitter doesn't automatically purge these. :/
      let timelineCells = [...cellContainer.parentNode.children]
      let cellIndex = timelineCells.indexOf(cellContainer)
      timelineCells
        .slice(0, cellIndex)
        .forEach((child) => child.parentNode.removeChild(child))
    }

    await wait()
  }

  cells = queryCells()

  if (cells.length) {
    console.log("🧲 There are more tweets to delete")
    await handler(cells)
  } else {
    console.log("✨ Done!")
  }
}

;(async function () {
  // This may take a few seconds to load depending on the internet connection. We need to wait for an async page render to resolve.
  const twitterHandle = await load(getTwitterHandle)

  if (!twitterHandle) return

  initialize({
    title: "Twitter Posts",
    message:
      "Ready to clean up your data?\nNOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",
    handler,
    urlPaths: [`/${twitterHandle}/with_replies`, `/${twitterHandle}/media`],
  })
})()
