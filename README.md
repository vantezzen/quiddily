<p align="center">
  <img src="./assets/icon512.png" height="200" />
</p>

# Quiddily

> Learn advanced english vocabulary while browsing the web.

Quiddily replaces words on websites with more advances synonyms to help you learn new words.

## Getting Started

1. Clone this repository
2. Install dependencies using `pnpm i`
3. Run `pnpm dev` to start the development server

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

For further guidance, [visit the Plasmo docs](https://docs.plasmo.com/).

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

## Contributing words

To add a new word to Quiddily:

1. Create a fork of this repository
2. Edit the file `./src/lib/words.json` in your fork to add the new word to the bottom
3. Create a pull request to this repository to merge your changes

Words contain these fields:

- `word` (required): Advanced english vocabulary word
- `replaces`: Array of words your word can replace. All words in here should be **lowercase** even if they are normally captialized in a certain way.

Example:

```JSON
{
  "word": "acquire",
  "replaces": ["get"]
}
```

This instructs Quiddily to replace "get" with "aquire" in texts.

If a word can be replaced with multiple other words (e.g. "get" can be replaced with "obtain" or "acquire"), Quiddily randomly chooses one of the possible values while replacing.

## License

MIT License

---

This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).
