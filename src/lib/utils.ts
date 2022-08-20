export const ALLOWED_ELEMENTS = [
  "body",
  "html",
  "div",
  "span",
  "p",
  "section",
  "header",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "table",
  "tbody",
  "thead",
  "tr",
  "td"
]

// Prevents quiddily from replacing nodes like inputs and textareas
export function canCrawlElement(element: HTMLElement) {
  const elementTagName = element.tagName.toLowerCase()
  return (
    ALLOWED_ELEMENTS.includes(elementTagName) ||
    // Custom WebComponent elements often contain dashes
    elementTagName.includes("-")
  )
}
