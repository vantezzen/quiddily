import React, { useEffect, useState } from "react"
import browser from "webextension-polyfill"

function DisableCurrent({
  host,
  disable
}: {
  host: string | null
  disable: () => void
}) {
  if (host === null) return null

  return (
    <button
      className="rounded bg-slate-200 hover:bg-slate-300 duration-75 p-3 my-6 w-full"
      onClick={disable}>
      Disable for "{host}"
    </button>
  )
}

export default DisableCurrent
