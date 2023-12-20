// ==UserScript==
// @name        Dark Hole - Reddit Votes (Beta)
// @description Automated content deletion
// @namespace   https://github.com/geotrev/dark-hole
// @author      George Treviranus
// @run-at      document-idle
// @match       https://old.reddit.com/user/*/(upvoted|downvoted)
// @version     1.0.0-beta.33
// @downloadURL https://github.com/geotrev/dark-hole/raw/main/dist/reddit-votes-dev.user.js
// @updateURL   https://github.com/geotrev/dark-hole/raw/main/dist/reddit-votes-dev.user.js
// @grant       none
// ==/UserScript==
(function () {
	'use strict';

	/**
	  * Page:
	  * - https://old.reddit.com/user/<USERNAME>/upvoted
	  * - https://old.reddit.com/user/<USERNAME>/downvoted
	  * 
	  * Runs from: Dev tools console
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
			console.log("🧹 Removing votes...");
			
			for (const entry of entries) {
				if (entry.querySelector('.archived')) {
					entry.parentNode.removeChild(entry);
				} else {
					let btn = entry.querySelector('.upmod') || entry.querySelector('.downmod');	

					if (btn) btn.click();

					await wait(250);

					btn = undefined;
					entry.parentNode.removeChild(entry);
				}
				
				await wait();
			}	
		}
		
		entries = queryEntries();
		INTERACTION_DELAY = undefined;
		
		if (entries.length > 0) {
			console.log("🧲 There are more posts to unvote");
			return exec(entries);
		} else {
			console.log("✨ Done");
		}
	})();

})();
