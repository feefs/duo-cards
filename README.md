# [Duo-cards](https://feefs.me/duo-cards)
Duo-cards is a flashcard web app that complements Duolingo with curated decks from a custom REST API.

Duolingo discontinued [Tinycards](https://support.duolingo.com/hc/en-us/articles/360043909772-UPDATE-Tinycards-Announcement) in September 2020, and as of recently their Japanese JSON data is still incomplete. I made this app to fix both problems (for me at least).

Built with React, TypeScript, Flask, Firebase, [duolingo-api](https://github.com/KartikTalwar/Duolingo), and [Googletrans](https://github.com/ssut/py-googletrans)

<p align="center">
    <img src="demo.gif" alt="demo">
<p>

## Local installation for curated cards
Curated cards are not available on the website, since a part of curation uses an unofficial Duolingo API called [duolingo-api](https://github.com/KartikTalwar/Duolingo).

Regardless, you can try the feature by installing and running the React app + servers locally:

Make a .env file like the [example](servers/duolingo/.env.example), set CURATED_ENABLED to `true` in [local.ts](src/ts/local.ts), and configure a curated deck of your own in [local.ts](src/ts/local.ts)

---

Start the react app with
```
npm run start
```
Start the webservers with Docker by running
```
cd servers
./dev.sh
```
