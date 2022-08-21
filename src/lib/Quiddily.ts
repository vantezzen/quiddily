import "./quiddily.css"

import QuiddilyWords from "./QuiddilyWords"
import { canCrawlElement } from "./utils"

export default class Quiddily {
  private words = new QuiddilyWords()
  public replaceWords(container: HTMLElement, frequency: number) {
    this.traverseElement(container, frequency)
  }

  private traverseElement(element: HTMLElement, frequency: number) {
    if (!canCrawlElement(element)) return

    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        this.replaceWordsInTextNode(child, frequency)
      } else if (
        child.nodeType === Node.ELEMENT_NODE ||
        child.nodeType === Node.DOCUMENT_NODE
      ) {
        this.traverseElement(child as HTMLElement, frequency)
      }
    }
  }

  private replaceWordsInTextNode(node: ChildNode, frequency: number) {
    if (node.textContent.trim() === "") return
    const words = node.textContent.split(" ")
    const finalWords = this.replaceWordsInString(words, frequency)
    this.replaceTextNodeWithUpdatedText(node, finalWords)
  }

  private replaceTextNodeWithUpdatedText(
    node: ChildNode,
    finalWords: string[]
  ) {
    if (finalWords.join(" ") === node.textContent) {
      // No change needed
      return
    }

    // TODO: Is this secure? Does this break sites?
    if (node.parentElement.childNodes.length === 1) {
      // Text is the only contents of the element so simply replace its contents
      node.parentElement.innerHTML = node.parentElement.innerHTML.replace(
        node.textContent,
        finalWords.join(" ")
      )
    } else {
      // Element contains other elements than this text so add a "<quiddily-text>" node
      // and replace the text with it
      const textContent = document.createElement("quiddily-text")
      textContent.innerHTML = finalWords.join(" ")
      node.parentElement.insertBefore(textContent, node)
      node.parentElement.removeChild(node)
    }
  }

  private replaceWordsInString(words: string[], frequency: number) {
    const finalWords = []
    for (const word of words) {
      const randomPossibility = Math.random() < frequency
      if (!randomPossibility) {
        finalWords.push(word)
        continue
      }

      const [prefix, wordContent, postfix] = this.getWordComponents(word)
      const possibleReplaceMents = this.words.getSynonymsForWord(wordContent)

      if (possibleReplaceMents.length) {
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
    const replacementWithHtmlElement = `${prefix}<quiddily-vocab data-original="${wordContent}">${replacement}</quiddily-vocab>${postfix}`
    return replacementWithHtmlElement
  }

  getWordComponents(word: string): [string, string, string] {
    const [, prefix, wordContent, postfix] = /(\W*)(\w*)(\W*)/i.exec(word)
    return [prefix, wordContent.toLowerCase().trim(), postfix]
  }
}
