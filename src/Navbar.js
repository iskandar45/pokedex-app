import React from "react"
import { useHistory } from "react-router-dom"

const Navbar = () => {
  const history = useHistory()
  return (
    <nav className="bg-white text-black shadow-lg mb-10 fixed w-full z-10 top-0">
      <div className="container mx-auto flex justify-center py-3">
        <div className="text-4xl font-bold cursor-pointer" onClick={() => history.push("/")}>
          PokéDex
        </div>
      </div>
    </nav>
  )
}

export default Navbar
