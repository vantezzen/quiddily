import html from "nanohtml"
import raw from "nanohtml/raw"

import "./popups.css"

/**
 * Manager for popups.
 *
 * This handles opening and closing suggestion popups.
 * Based on https://github.com/vantezzen/quill-languagetool/blob/master/src/PopupManager.ts
 */
export default class QuiddilyPopups {
  private openPopup?: HTMLElement
  private currentSuggestionElement?: HTMLElement

  constructor() {
    this.closePopup = this.closePopup.bind(this)
    this.addEventHandler()
  }

  private addEventHandler() {
    document.body.addEventListener("click", (e) => {
      const target = e.target as HTMLElement
      if (target.tagName === "QUIDDILY-VOCAB") {
        this.handleSuggestionClick(target)
      }
    })

    window.addEventListener("resize", () => {
      if (this.currentSuggestionElement) {
        this.handleSuggestionClick(this.currentSuggestionElement)
      }
    })
  }

  private closePopup() {
    if (this.openPopup) {
      this.openPopup.remove()
      this.openPopup = undefined
    }
    this.currentSuggestionElement = undefined
    document.body.removeEventListener("click", this.closePopup)
  }

  private handleSuggestionClick(suggestion: HTMLElement) {
    const originalText = suggestion.getAttribute("data-original")
    this.createSuggestionPopup(originalText, suggestion)
  }

  private createSuggestionPopup(originalText: string, suggestion: HTMLElement) {
    if (this.openPopup) {
      this.closePopup()

      if (suggestion === this.currentSuggestionElement) {
        return
      }
    }
    this.currentSuggestionElement = suggestion

    const popupPositionStyle = this.getIdealPopupPositionStyle(suggestion)
    document.body.addEventListener("click", this.closePopup)

    const popup = html`
      <div class="quiddily-vocab-popup" style="${popupPositionStyle}">
        <div class="quiddily-vocab-popup-header">
          <button
            class="quiddily-vocab-popup-close"
            onclick="${this.closePopup}">
            ${raw("&times;")}
          </button>
        </div>
        <div class="quiddily-vocab-popup-title">
          You may replace "${originalText}" with "${suggestion.textContent}"
        </div>
        <div class="quiddily-vocab-powered-by">Quiddily</div>
      </div>
    `

    document.body.appendChild(popup)
    this.openPopup = popup
  }

  private getIdealPopupPositionStyle(suggestion: HTMLElement) {
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth

    const suggestionPosition = suggestion.getBoundingClientRect()
    let popupPosition: { [item: string]: number } = {}

    if (suggestionPosition.top > windowHeight / 2) {
      popupPosition.bottom = windowHeight - suggestionPosition.top
    } else {
      popupPosition.top = suggestionPosition.top + suggestionPosition.height
    }

    if (suggestionPosition.left > 400) {
      // Position  popup left of suggestion
      popupPosition.right = windowWidth - suggestionPosition.right
    } else {
      // Position popup right of suggestion
      popupPosition.left = suggestionPosition.left

      if (!this.hasEnoughSpaceForPopup(popupPosition.left, windowWidth)) {
        // If there is enough space to the right, position the popup centrally
        popupPosition.left = Math.max(10, popupPosition.left - 200)
      }
    }
    const popupPositionStyle = Object.keys(popupPosition)
      .map((key) => `${key}: ${popupPosition[key]}px`)
      .join(";")
    return popupPositionStyle
  }

  private hasEnoughSpaceForPopup(border: number, maximum: number) {
    return maximum - border > 400
  }
}
