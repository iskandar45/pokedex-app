import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home"
import Detail from "./Detail"
import Navbar from "./Navbar"
import Footer from "./Footer"

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:name" element={<Detail />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
