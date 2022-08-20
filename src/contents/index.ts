import { Storage } from "@plasmohq/storage"

import QuiddlyManager from "~src/lib/QuiddlyManager"
import QuiddlyPopups from "~src/lib/QuiddlyPopups"

;(async () => {
  const currentHost = window.location.host
  const storage = new Storage()
  const disabledHosts = (await storage.get<string[]>("disabledHosts")) ?? []

  if (!disabledHosts.includes(currentHost)) {
    const frequency = (await storage.get<number>("frequency")) ?? 0.5
    const quiddly = new QuiddlyManager()
    quiddly.replaceWords(document.body, frequency)

    new QuiddlyPopups()
  }
})()

export default {}
