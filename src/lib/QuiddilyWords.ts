import wordList from "./words.json"

type QuiddilyWordDictionary = { [word: string]: string[] }

/**
 * The word list in "words.json" is a good format for maintaining
 * synonyms but a bad format for performance.
 * To look up synonyms for a word, every item and every "replaces"
 * array needs to be looped through, making loopup O(n).
 *
 * This class converts the word list into a dictionary object with
 * the replaceable word being the key - making loopups O(1) and
 * drastically improving Quiddly's performance.
 */
export default class QuiddilyWords {
  private wordDictionary: QuiddilyWordDictionary = {}

  constructor() {
    this.convertWordListToDictionary()
  }

  private convertWordListToDictionary() {
    for (const wordItem of wordList) {
      for (const replacesWord of wordItem.replaces) {
        if (!this.wordDictionary[replacesWord]) {
          this.wordDictionary[replacesWord] = []
        }

        this.wordDictionary[replacesWord].push(wordItem.word)
      }
    }
  }

  public getSynonymsForWord(word: string) {
    return this.wordDictionary[word] ?? null
  }
}
