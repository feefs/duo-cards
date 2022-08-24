# [Duo-cards](https://feefs.me/duo-cards)

Duo-cards is a flashcard web app that complements Duolingo with curated decks generated from the user's Duolingo activity.

I built this to replace Tinycards, which I was using until Duolingo [discontinued](https://twitter.com/duolingo/status/1275404093201149952) it in September 2020.

Since Duolingo's Japanese translation data is still incomplete, Duo-cards can fill in missing translations using Google Translate. In addition, curated deck generation responds to adjustable parameters such as word strength from Duolingo's API and the range of time in which words were last practiced.

Built with React, TypeScript, Sass, Flask, and Firebase.

<p align="center">
    <img src="demo.gif" alt="demo">
<p>

## Local installation for curated cards

Curated cards are not available on the website since the curation process uses an unofficial Duolingo API [duolingo-api](https://github.com/KartikTalwar/Duolingo).

You can still run the feature locally by installing and running the React app + servers:

Make a .env file like the [example](servers/duolingo/.env.example) and set CURATED_ENABLED to `true` + configure a curated deck of your own in [curated.ts](src/data/curated.ts)

---

Start the react app with

```
npm run start
```

and start the webservers (Docker needs to be installed) by running

```
cd servers
./run.sh
```
