import { getTwitterHandle } from "../utils/get-twitter-handle.js"
import { notify } from "../utils/notify.js"
import { stopScript } from "../utils/stop-script.js"

let SHOULD_STOP = false

async function exec(_cells = []) {
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
    await exec(cells)
  } else {
    console.log("✨ Done!")
  }
}

function init() {
  const pathname = window?.location?.pathname
  const handle = getTwitterHandle()

  console.log("Initializing Twitter Posts script...")

  // Only run this script on posts, replies, or media profile page tabs

  if (
    pathname === `/${handle}` ||
    pathname === `/${handle}/with_replies` ||
    pathname === `/${handle}/media`
  ) {
    console.log("Notifying...")
    notify({
      content:
        "Ready to clean up your data? NOTE: this is a destructive action. Make sure you have a backup of your data before proceeding.",
      actions: [{ label: "🧹 Begin Removal", handler: exec }],
      delay: 60000,
    })
  }
}

init()
