// ==UserScript==
// @name        Dark Hole - Reddit Saved (Beta)
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://old.reddit.com/user/*/saved
// @version     1.0.0-beta.46
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/reddit-saved-dev.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/reddit-saved-dev.user.js
// @grant       none
// ==/UserScript==
(function () {
	'use strict';

	/**
	  * Page: reddit.com/user/<USERNAME>/saved
	  *
	  * Run from: Dev tools console
	  */

	(async function exec(_entries = []) {
		/**
	    * Timing can sometimes be sensitive on lower end PCs/Macs. If that's the case, increase this number in increments of 100 until the script is stable.
	    *
	    * NOTE: 500 = 500 milliseconds = 0.5 seconds
	    */
	  let INTERACTION_DELAY = 100;
		
		async function wait(ms = INTERACTION_DELAY) {
		  return new Promise((done) =>
		    setTimeout(() => requestAnimationFrame(done), ms)
		  );
		}
		
		function queryEntries() {
			return [...document.querySelectorAll('[data-oc]')]
		}
		
		let entries = _entries.length ? _entries : queryEntries();

		if (entries.length) {
			console.log("🧹 Deleting saved items...");

			for (const entry of entries) {
				let saveBtn = entry.querySelector('.save-button > a');

				if (saveBtn.innerText === 'unsave') {
					saveBtn.click();
					
					await wait(250);
				}

				saveBtn = undefined;
				entry.parentNode.removeChild(entry);
				await wait();
			}
		}

		entries = queryEntries();
		INTERACTION_DELAY = undefined;

		if (entries.length > 0) {
			console.log("🧲 There are more saved posts/comments to remove");
			return exec(entries)
		} else {
			console.log("✨ Done");
		}
	})();

})();
