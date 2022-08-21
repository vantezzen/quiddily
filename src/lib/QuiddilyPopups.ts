import { createPopper } from "@popperjs/core"
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

    document.body.addEventListener("click", this.closePopup)

    const popup = html`
      <quiddily-popup role="tooltip">
        <div class="quiddily-vocab-popup">
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
        <div class="quiddily-vocab-popup-arrow" data-popper-arrow></div>
      </quiddily-popup>
    `

    document.body.appendChild(popup)

    createPopper(suggestion, popup, {
      placement: "bottom-end",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 8]
          }
        }
      ]
    })

    this.openPopup = popup
  }
}
