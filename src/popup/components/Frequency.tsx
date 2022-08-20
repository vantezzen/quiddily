import React from "react"

import { useStorage } from "@plasmohq/storage"

const FREQUENCY_DESCRIPTIONS = {
  0: "Almost never",
  0.2: "Sometimes",
  0.5: "Frequently",
  0.7: "Often",
  0.9: "Most of the time",
  0.99: "Always"
}

function Frequency() {
  const [frequency, setFrequency] = useStorage("frequency", 0.5)
  const descriptionIndex = Object.keys(FREQUENCY_DESCRIPTIONS).reduce(
    (acc, value) => {
      if (Number(value) <= frequency) {
        return value
      }
      return acc
    },
    0
  )

  return (
    <div className="p-5">
      <h1 className="text-slate-600 font-bold text-lg">Frequency</h1>
      <p className="text-slate-500 text-sm">
        Change how often Quiddily replaces words on the page with other
        vocabulary.
      </p>

      <input
        type="range"
        name="frequency"
        id="frequency"
        min={0.05}
        max={1}
        step={0.05}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        value={frequency}
        onChange={(e) => {
          setFrequency(+e.target.value)
        }}
      />
      <p className="text-right text-slate-500">
        {FREQUENCY_DESCRIPTIONS[descriptionIndex]}
      </p>
    </div>
  )
}

export default Frequency
