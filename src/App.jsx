import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home"
import Detail from "./Detail"
import Navbar from "./Navbar"
import Footer from "./Footer"

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-screen flex flex-col">
        <div className="flex-1 pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:name" element={<Detail />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </BrowserRouter>
  )
}

export default App
