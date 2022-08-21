import React from "react"

import "@fontsource/inter/variable.css"
import "./style.css"

import DisabledList from "./components/DisabledList"
import Frequency from "./components/Frequency"
import Header from "./components/Header"
import ReloadInfo from "./components/ReloadInfo"

function Popup() {
  return (
    <div className="text-sans font-medium bg-slate-50 w-full h-full">
      <Header />
      <Frequency />
      <DisabledList />
      <ReloadInfo />
    </div>
  )
}

export default Popup
