import logo from "data-base64:~assets/icon.svg"
import React from "react"

function Header() {
  return (
    <h1 className="bg-slate-100 text-slate-700 font-bold w-full p-4 flex items-center gap-3 text-xl">
      <img src={logo} alt="Quiddly logo" className="h-6" />
      Quiddly
    </h1>
  )
}

export default Header
