import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes, useParams } from "react-router-dom"
import axios from "axios"
import Home from "./Home"

vi.mock("axios", () => ({
  __esModule: true,
  default: { get: vi.fn() },
}))

const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon"
const TOTAL = 1302

const buildPage = (offset = 0) => ({
  count: TOTAL,
  next: offset + 20 < TOTAL ? `${POKEMON_URL}?offset=${offset + 20}&limit=20` : null,
  previous: offset > 0 ? `${POKEMON_URL}?offset=${offset - 20}&limit=20` : null,
  results: [
    { name: "bulbasaur", url: `${POKEMON_URL}/1/` },
    { name: "ivysaur", url: `${POKEMON_URL}/2/` },
  ],
})

const respondWithPage = (offset = 0) => axios.get.mockResolvedValue({ data: buildPage(offset) })

function DetailProbe() {
  const { name } = useParams()
  return <p>detail page for {name}</p>
}

const renderHome = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:name" element={<DetailProbe />} />
      </Routes>
    </MemoryRouter>
  )

const searchInput = () => screen.getByPlaceholderText("search pokemon...")

const fullSpinner = () => document.querySelector(".h-52.animate-spin")
const inlineSpinner = () => document.querySelector(".h-8.animate-spin")

describe("Home", () => {
  beforeEach(() => {
    axios.get.mockReset()
  })

  it("shows a loading spinner before the first page resolves", () => {
    axios.get.mockReturnValue(new Promise(() => {}))
    const { container } = renderHome()

    expect(container.querySelector(".animate-spin")).toBeInTheDocument()
  })

  it("requests the first page of 20 pokemon", async () => {
    respondWithPage(0)
    renderHome()

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(`${POKEMON_URL}?offset=0&limit=20`)
    )
  })

  it("renders a card per pokemon with padded artwork urls", async () => {
    respondWithPage(0)
    renderHome()

    expect(await screen.findByText("bulbasaur")).toBeInTheDocument()
    expect(screen.getByText("ivysaur")).toBeInTheDocument()
    expect(screen.getByAltText("bulbasaur")).toHaveAttribute(
      "src",
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png"
    )
    expect(screen.getAllByRole("link", { name: "./detail" })).toHaveLength(2)
  })

  it("disables prev on the first page and enables next", async () => {
    respondWithPage(0)
    renderHome()
    await screen.findByText("bulbasaur")

    expect(screen.getByRole("button", { name: "< prev" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "next >" })).toBeEnabled()
  })

  it("loads the next page when Next is clicked", async () => {
    const user = userEvent.setup()
    respondWithPage(0)
    renderHome()
    await screen.findByText("bulbasaur")

    respondWithPage(20)
    await user.click(screen.getByRole("button", { name: "next >" }))

    await waitFor(() =>
      expect(axios.get).toHaveBeenLastCalledWith(`${POKEMON_URL}?offset=20&limit=20`)
    )
    await waitFor(() => expect(screen.getByRole("button", { name: "< prev" })).toBeEnabled())
  })

  it("returns to the previous page when prev is clicked", async () => {
    const user = userEvent.setup()
    respondWithPage(0)
    renderHome()
    await screen.findByText("bulbasaur")

    respondWithPage(20)
    await user.click(screen.getByRole("button", { name: "next >" }))
    await waitFor(() =>
      expect(axios.get).toHaveBeenLastCalledWith(`${POKEMON_URL}?offset=20&limit=20`)
    )

    respondWithPage(0)
    await user.click(screen.getByRole("button", { name: "< prev" }))

    await waitFor(() =>
      expect(axios.get).toHaveBeenLastCalledWith(`${POKEMON_URL}?offset=0&limit=20`)
    )
    expect(screen.getByRole("button", { name: "< prev" })).toBeDisabled()
  })

  it("disables next on the last page", async () => {
    axios.get.mockResolvedValue({
      data: {
        count: TOTAL,
        next: null,
        previous: `${POKEMON_URL}?offset=1280&limit=20`,
        results: [{ name: "miraidon", url: `${POKEMON_URL}/1008/` }],
      },
    })

    renderHome()
    await screen.findByText("miraidon")

    expect(screen.getByRole("button", { name: "next >" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "< prev" })).toBeEnabled()
  })

  it("keeps the grid visible with an inline spinner while a page change is in flight", async () => {
    const user = userEvent.setup()
    respondWithPage(0)
    renderHome()
    await screen.findByText("bulbasaur")

    let resolveNext
    axios.get.mockReturnValue(
      new Promise((resolve) => {
        resolveNext = resolve
      })
    )
    await user.click(screen.getByRole("button", { name: "next >" }))

    // old page stays on screen, no full-height spinner overlay
    expect(screen.getByText("bulbasaur")).toBeInTheDocument()
    expect(fullSpinner()).toBeNull()
    expect(inlineSpinner()).not.toBeNull()

    resolveNext({ data: buildPage(20) })
    await waitFor(() => expect(screen.getByRole("button", { name: "< prev" })).toBeEnabled())
    expect(inlineSpinner()).toBeNull()
  })

  it("shows an inline error but keeps the current page when a page change fails", async () => {
    const user = userEvent.setup()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    respondWithPage(0)
    renderHome()
    await screen.findByText("bulbasaur")

    axios.get.mockRejectedValueOnce(new Error("network down"))
    await user.click(screen.getByRole("button", { name: "next >" }))

    expect(await screen.findByText(/Failed to load the Pokemon list/)).toBeInTheDocument()
    expect(screen.getByText("bulbasaur")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "next >" })).toBeEnabled()
    consoleError.mockRestore()
  })

  it("navigates to the detail route when Enter is pressed", async () => {
    const user = userEvent.setup()
    respondWithPage(0)
    renderHome()
    await screen.findByText("bulbasaur")

    await user.type(searchInput(), "Pikachu{Enter}")

    expect(await screen.findByText("detail page for pikachu")).toBeInTheDocument()
  })

  it("lowercases and trims the query before navigating", async () => {
    const user = userEvent.setup()
    respondWithPage(0)
    renderHome()
    await screen.findByText("bulbasaur")

    await user.type(searchInput(), "  EEVEE  {Enter}")

    expect(await screen.findByText("detail page for eevee")).toBeInTheDocument()
  })

  it("does not navigate when Enter is pressed with a blank query", async () => {
    const user = userEvent.setup()
    respondWithPage(0)
    renderHome()
    await screen.findByText("bulbasaur")

    await user.type(searchInput(), "   {Enter}")

    expect(screen.queryByText(/detail page for/)).not.toBeInTheDocument()
    expect(screen.getByText("bulbasaur")).toBeInTheDocument()
  })

  it("shows an error state and retries the request", async () => {
    const user = userEvent.setup()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    axios.get.mockRejectedValueOnce(new Error("network down"))

    renderHome()

    expect(await screen.findByText(/Failed to load the Pokemon list/)).toBeInTheDocument()

    respondWithPage(0)
    await user.click(screen.getByRole("button", { name: "retry" }))

    expect(await screen.findByText("bulbasaur")).toBeInTheDocument()
    consoleError.mockRestore()
  })
})
