import { useNavigate } from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <nav className="glass fixed w-full z-10 top-0 border-x-0 border-t-0">
      <div className="container mx-auto flex justify-center py-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="font-mono text-2xl font-bold cursor-pointer tracking-tight text-term-green hover:text-white transition-colors bg-transparent border-0"
        >
          <span className="text-slate-500">~$</span> pokedex
          <span className="cursor-blink" aria-hidden="true"></span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
