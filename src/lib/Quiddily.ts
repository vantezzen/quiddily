import "./quiddily.css"

import QuiddilyWords from "./QuiddilyWords"
import { canCrawlElement } from "./utils"

export default class Quiddily {
  private words = new QuiddilyWords()
  private cooldown?: NodeJS.Timeout

  constructor(protected frequency: number) {
    this.addMutationObserverToPage()
  }

  private preventLoop() {
    if (this.cooldown) {
      clearTimeout(this.cooldown)
    }
    this.cooldown = setTimeout(() => {
      this.cooldown = undefined
    }, 100)
  }

  private addMutationObserverToPage() {
    const observer = new MutationObserver((mutations, observer) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const addedNode of mutation.addedNodes) {
            this.addQuiddilyToNode(addedNode)
          }
        } else if (mutation.type === "characterData") {
          this.addQuiddilyToNode(mutation.target)
        }
      }
    })

    observer.observe(document, {
      subtree: true,
      characterData: true,
      childList: true
    })
  }

  public replaceWords(container: HTMLElement) {
    this.traverseElement(container)
  }

  private traverseElement(element: HTMLElement) {
    if (this.cooldown) return
    this.preventLoop()

    if (!canCrawlElement(element)) return

    for (const child of element.childNodes) {
      this.addQuiddilyToNode(child)
    }
  }

  private addQuiddilyToNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      this.replaceWordsInTextNode(node)
    } else if (
      node.nodeType === Node.ELEMENT_NODE ||
      node.nodeType === Node.DOCUMENT_NODE
    ) {
      this.traverseElement(node as HTMLElement)
    }
  }

  private replaceWordsInTextNode(node: Node) {
    if (node.textContent.trim() === "") return
    const words = node.textContent.split(" ")
    const finalWords = this.replaceWordsInString(words)
    this.replaceTextNodeWithUpdatedText(node, finalWords)
  }

  private replaceTextNodeWithUpdatedText(node: Node, finalWords: string[]) {
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

  private replaceWordsInString(words: string[]) {
    const finalWords = []
    for (const word of words) {
      const randomPossibility = Math.random() < this.frequency
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
