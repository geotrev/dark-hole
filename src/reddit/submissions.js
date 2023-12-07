/**
  * Page:
  * - reddit.com/user/<USERNAME>/comments
  * - reddit.com/user/<USERNAME>/submitted
  *
  * Run from: Dev tools console
  */

(async function exec(_entries = []) {
	/**
    * Timing can sometimes be sensitive on lower end PCs/Macs. If that's the case, increase this number in increments of 100 until the script is stable.
    *
    * NOTE: 500 = 500 milliseconds = 0.5 seconds
    */
  let INTERACTION_DELAY = 500
  
  async function wait() {
    return new Promise((done) =>
      setTimeout(() => requestAnimationFrame(done), INTERACTION_DELAY)
    );
  }
	
	function queryEntries() {
		return [...document.querySelectorAll('[data-oc]'), ...document.querySelectorAll('[data-type="comment"]')]
	}
	
	let entries = _entries.length ? _entries : queryEntries()

	if (entries.length) {
		console.log("🧹 Deleting submissions...")
		
		for (const entry of entries) {
			let delBtn = entry.querySelector('.del-button .option.error .yes')
			if (delBtn) delBtn.click()

			delBtn = undefined
			await wait()
		}
	}

	entries = queryEntries()
	INTERACTION_DELAY = undefined
	
	if (entries.length > 0) {
		console.log("🧲 There are more submissions to delete")
		return exec(entries)
	} else {
		console.log("✨ Done")
	}
})()
