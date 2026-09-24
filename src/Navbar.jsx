import { useNavigate } from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <nav className="bg-white text-black shadow-lg mb-10 fixed w-full z-10 top-0">
      <div className="container mx-auto flex justify-center py-3">
        <div className="text-4xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          PokéDex
        </div>
      </div>
    </nav>
  )
}

export default Navbar
