import { Storage } from "@plasmohq/storage"

import Quiddily from "~src/lib/Quiddily"
import QuiddilyPopups from "~src/lib/QuiddilyPopups"

;(async () => {
  const currentHost = window.location.host
  const storage = new Storage()
  const disabledHosts = (await storage.get<string[]>("disabledHosts")) ?? []

  if (!disabledHosts.includes(currentHost)) {
    const frequency = (await storage.get<number>("frequency")) ?? 0.5
    const quiddily = new Quiddily(frequency)

    // Wait to prevent Quiddily from impacting the site's loading speed.
    setTimeout(() => {
      quiddily.replaceWords(document.body)
    }, 1000)

    new QuiddilyPopups()
  }
})()

export default {}
