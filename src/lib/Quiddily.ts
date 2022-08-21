import "./quiddily.css"

import NodeHandler from "./NodeHandler"
import WordReplacer from "./WordReplacer"

export default class Quiddily {
  public wordReplacer: WordReplacer
  public nodeHandler = new NodeHandler(this)
  private cooldown?: NodeJS.Timeout

  constructor(protected frequency: number) {
    this.wordReplacer = new WordReplacer(frequency)
    this.addMutationObserverToPage()
  }

  public preventLoop() {
    if (this.cooldown) {
      clearTimeout(this.cooldown)
    }
    this.cooldown = setTimeout(() => {
      this.cooldown = undefined
    }, 100)
  }

  private addMutationObserverToPage() {
    const observer = new MutationObserver((mutations) => {
      if (this.cooldown) return

      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const addedNode of mutation.addedNodes) {
            this.nodeHandler.addQuiddilyToNode(addedNode)
          }
        } else if (mutation.type === "characterData") {
          this.nodeHandler.addQuiddilyToNode(mutation.target)
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
    this.nodeHandler.traverseElement(container)
  }
}
