import Detail from "./Detail"
import Home from "./Home"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/detail/:name" component={Detail} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
