import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Navbar from "./Navbar"

const renderNavbar = (initialPath = "/") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar />
      <Routes>
        <Route path="/" element={<p>home route</p>} />
        <Route path="/detail/:name" element={<p>detail route</p>} />
      </Routes>
    </MemoryRouter>
  )

describe("Navbar", () => {
  it("renders the app title", () => {
    renderNavbar()

    expect(screen.getByRole("button", { name: /pokedex/ })).toBeInTheDocument()
  })

  it("navigates back to the home route when the title is clicked", async () => {
    const user = userEvent.setup()
    renderNavbar("/detail/pikachu")

    expect(screen.getByText("detail route")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /pokedex/ }))

    expect(screen.getByText("home route")).toBeInTheDocument()
  })
})
