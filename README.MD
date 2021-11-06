# d1-pvp-csv-dump

This is a simple Node/Typescript based command line program for downloading a CSV (or JSON) report of every PVE game you played in Destiny 1.

## Installation

1. This requires a recent version of Node.js, you can [download a copy here](https://nodejs.org/en/download/).
2. Clone this repo, run `npm install` at the root.

## Running

Once you have it installed things above, visit the `dist` folder and create your own `.env` file based on the `sample.env` included. You'll need to set: 

- `D1_API_KEY`=[supply your own, visit https://www.bungie.net/en/Application for more info]
- `D1_PLATFORM`=[1 for xbox, 2 for psn, etc]
- `D1_ACCOUNT_ID`=[if you don't know this, visit d2checklist.com for DIM and load your account and grab it from the URL]

Then you can simply run by typing `node index`. This will save a local copy of `matches.csv` and `matches.json` upon completion, enjoy!

## License
[MIT](https://choosealicense.com/licenses/mit/)