import { Storage } from "@plasmohq/storage"

import Quiddily from "~src/lib/Quiddily"
import QuiddilyPopups from "~src/lib/QuiddilyPopups"

;(async () => {
  const currentHost = window.location.host
  const storage = new Storage()
  const disabledHosts = (await storage.get<string[]>("disabledHosts")) ?? []

  if (!disabledHosts.includes(currentHost)) {
    const frequency = (await storage.get<number>("frequency")) ?? 0.5
    const quiddily = new Quiddily()
    quiddily.replaceWords(document.body, frequency)

    new QuiddilyPopups()
  }
})()

export default {}
