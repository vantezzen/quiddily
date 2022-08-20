import React, { useEffect, useState } from "react"
import browser from "webextension-polyfill"

import { useStorage } from "@plasmohq/storage"

import DisableCurrent from "./DisableCurrent"

function DisabledList() {
  const [disabledHosts, setDisabledHosts] = useStorage<string[]>(
    "disabledHosts",
    []
  )

  const [currentHost, setCurrentHost] = useState<string | null>(null)
  useEffect(() => {
    browser.tabs.query({ currentWindow: true, active: true }).then((tab) => {
      if (tab.length === 0) {
        return
      }

      const url = new URL(tab[0].url)
      setCurrentHost(url.host)
    })
  }, [])

  const isCurrentHostDisabled = disabledHosts.includes(currentHost)

  return (
    <div className="p-5">
      <h1 className="text-slate-600 font-bold text-lg">Disabled sites</h1>
      <p className="text-slate-500 text-sm">
        Quiddly will not try to replace vocabulary on these pages.
        <br />
        You can disable for the current site if you have problems using the page
        while Quiddly is enabled.
      </p>

      {!isCurrentHostDisabled && (
        <DisableCurrent
          host={currentHost}
          disable={() => {
            setDisabledHosts([...disabledHosts, currentHost])
          }}
        />
      )}

      <div className="flex flex-col gap-3 mt-3">
        {disabledHosts.map((host) => (
          <div
            key={host}
            className="rounded bg-slate-200 p-3 flex gap-3 items-center justify-between">
            {host}
            <button
              className="text-2xl mr-2 rounded py-1 px-3 hover:bg-slate-300 duration-75"
              title="Reenable this host"
              onClick={() => {
                setDisabledHosts(disabledHosts.filter((h) => h !== host))
              }}>
              &times;
            </button>
          </div>
        ))}
      </div>

      {disabledHosts.length === 0 && (
        <div className="rounded bg-slate-100 text-center p-4">
          <h2 className="font-bold mb-2 text-xl">No disabled sites</h2>
          <p className="text-slate-500 text-sm">
            You haven't deactivated Quiddly on any page yet
          </p>
        </div>
      )}
    </div>
  )
}

export default DisabledList
