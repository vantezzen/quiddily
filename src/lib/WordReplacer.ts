import QuiddilyWords from "./QuiddilyWords"

export default class WordReplacer {
  private words = new QuiddilyWords()

  constructor(private frequency: number) {}

  public replaceWordsInString(words: string[]) {
    const finalWords = []
    for (const word of words) {
      const randomPossibility = Math.random() < this.frequency
      if (!randomPossibility) {
        finalWords.push(word)
        continue
      }

      const [prefix, wordContent, postfix] = this.getWordComponents(word)
      const possibleReplaceMents = this.words.getSynonymsForWord(
        wordContent.toLowerCase()
      )

      if (possibleReplaceMents && possibleReplaceMents.length) {
        const replacementWithHtmlElement = this.replaceWordWithReplacement(
          possibleReplaceMents,
          prefix,
          wordContent,
          postfix
        )
        finalWords.push(replacementWithHtmlElement)
      } else {
        finalWords.push(word)
      }
    }
    return finalWords
  }

  private replaceWordWithReplacement(
    possibleReplaceMents: string[],
    prefix: string,
    wordContent: string,
    postfix: string
  ) {
    const replacement =
      possibleReplaceMents[
        Math.floor(Math.random() * possibleReplaceMents.length)
      ]
    const replacementWithHtmlElement = `${prefix}<quiddily-vocab data-original="${wordContent}">${this.matchWordCase(
      wordContent,
      replacement
    )}</quiddily-vocab>${postfix}`
    return replacementWithHtmlElement
  }

  getWordComponents(word: string): [string, string, string] {
    const [, prefix, wordContent, postfix] = /(\W*)(\w*)(\W*)/i.exec(word)
    return [prefix, wordContent.trim(), postfix]
  }

  private matchWordCase(word: string, replacement: string) {
    if (word.toLowerCase() === word) {
      return replacement.toLowerCase()
    }
    if (word.toUpperCase() === word) {
      return replacement.toUpperCase()
    }
    if (
      `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}` === word
    ) {
      return (
        replacement.slice(0, 1).toUpperCase() +
        replacement.slice(1).toLowerCase()
      )
    }
    return replacement
  }
}
