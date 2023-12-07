# Dark Hole 🕳

Scripts to remove your social media presence.

## About

Protecting your social media presence can be challenging. What happens when Twitter (now X) becomes unsafe, or Reddit destroys its open source community by pricing out third party apps?

Dark Hole tool allows you to vote with your data and remove your posts, likes, bookmarks, and the like from your account, thus slowly reducing the value of these platforms as more people indulge their data rights.

As should be expected, **none of these scripts store, process, or send any data to a third party (or me).** Please view the scripts for yourself - they are written to be as plain and understandable as possible. The only data exchange that ever happens is on the platform itself (e.g., deletion of data).

## Usage

When a script is installed, it only runs on a specific page (for instance, Twitter Bookmarks). You will see a popup with a ( `🧹 Begin Removal` ) button. Press the button and sit back. Leave the page / tab open so it can run. To exit the script, press <kbd>␛</kbd> (escape key).

## Install

Add the [tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) extension to Chrome.

### Twitter

1. [Install Dark Hole – Twitter Posts](https://github.com/geotrev/dark-hole/raw/main/dist/posts.user.js)
2. [Install Dark Hole – Twitter Bookmarks](https://github.com/geotrev/dark-hole/raw/main/dist/bookmarks.user.js)
3. [Install Dark Hole – Twitter Likes](https://github.com/geotrev/dark-hole/raw/main/dist/likes.user.js)

#### Requirements

- You must be on the desktop site.

### Reddit

1. [Install Dark Hole – Reddit Submissions](https://github.com/geotrev/dark-hole/raw/main/dist/submissions.user.js)
2. [Install Dark Hole – Reddit Saved](https://github.com/geotrev/dark-hole/raw/main/dist/saved.user.js)
3. [Install Dark Hole – Reddit Votes](https://github.com/geotrev/dark-hole/raw/main/dist/votes.user.js)

#### Requirements

- You must use `https://old.reddit.com`. Navigate to that URL while logged in or opt out of the reddit redesign in preferences.
- You must be on the desktop site.
- Install [RES](https://redditenhancementsuite.com/) to make this process the least painful. It will automatically load in more posts/comments so the loop may continue checking & deleting data seamlessly.

## Operational Shortcuts

The below shortcuts allow you to change the script as it runs.

| Key Command                      | Page | Description       |
| -------------------------------- | ---- | ----------------- |
| <kbd>␛</kbd> / <kbd>Escape</kbd> | `*`  | Stops the script. |
