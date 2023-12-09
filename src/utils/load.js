import { notify } from "./notify"

/**
 * Given a DOM state, repeatedly call the given callback condition until it returns truthy.
 *
 * @param {*} callback
 * @param {string} failMsg
 * @param {{tries: number, interval: number}} timing
 * @returns {*}
 */
export async function load(callback, failMsg, timing = {}) {
  const tries = timing.tries || 10
  const interval = timing.interval || 100
  const message =
    failMsg ||
    "Unable to resolve value after" + " " + String(tries * interval) + "ms."

  return new Promise((resolve, reject) => {
    let i = 0

    const int = setInterval(() => {
      const value = callback()
      if (value) {
        clearInterval(int)
        resolve(value)
      }

      if (++i === tries) {
        clearInterval(int)
        if (failMsg) {
          notify({ content: message })
        }
        reject()
      }
    }, interval)
  })
}
