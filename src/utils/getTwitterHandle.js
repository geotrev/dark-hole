/**
 * Returns the Twitter handle if it exists on the page, or null.
 *
 * @returns string
 */
export function getTwitterHandle() {
  return (
    document
      .querySelector('[data-testid="UserName"]')
      ?.innerText.split("\n")?.[1]
      ?.slice(1) || null
  )
}
