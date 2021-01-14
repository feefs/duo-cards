# [Duo-cards](https://feefs.me/duo-cards)
Duo-cards is a flashcard web app that complements Duolingo with curated decks from a custom API.

Duolingo discontinued [Tinycards](https://support.duolingo.com/hc/en-us/articles/360043909772-UPDATE-Tinycards-Announcement) in September 2020, and as of recently their Japanese JSON data is still incomplete. I made this app to fix both problems (for me at least).

Built with React, TypeScript, Flask, Firebase, [duolingo-api](https://github.com/KartikTalwar/Duolingo), and [Googletrans](https://github.com/ssut/py-googletrans)

<p align="center">
    <img src="demo.gif" alt="demo">
<p>

## Local installation for curated cards
Curated cards are not available on the website, since part of the curation uses an unofficial Duolingo API called [duolingo-api](https://github.com/KartikTalwar/Duolingo). With no API key offered by Duolingo, a hard-coded username and password in a .env file is necessary for the curator webserver to work.

Even so, you can try the feature by installing and running the React app + Flask webserver locally:

Make a .env file like the [example](.env.example), set CURATED_ENABLED to `true` in [configs.ts](src/ts/configs.ts), and configure a curated deck of your own in [curated.ts](src/ts/curated.ts)

---

Create a virtual environment, enter it, and install the requirements with
```
~ python3 -m venv env
~ source env/bin/activate
~ pip3 install -r requirements.txt
```
Then, start the webserver using
```
~ python3 server/server.py
```
To start the React app, install the packages and run the `start` script with either yarn or npm.
