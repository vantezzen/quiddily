import type Quiddily from "./Quiddily"
import { canCrawlElement } from "./utils"

export default class NodeHandler {
  constructor(private quiddily: Quiddily) {}

  public traverseElement(element: HTMLElement) {
    if (!canCrawlElement(element)) return

    for (const child of element.childNodes) {
      this.addQuiddilyToNode(child)
    }
  }

  public addQuiddilyToNode(node: Node) {
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
    const finalWords = this.quiddily.wordReplacer.replaceWordsInString(words)
    this.replaceTextNodeWithUpdatedText(node, finalWords)
  }

  private replaceTextNodeWithUpdatedText(node: Node, finalWords: string[]) {
    if (finalWords.join(" ") === node.textContent) {
      // No change needed
      return
    }

    this.quiddily.preventLoop()

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
}
