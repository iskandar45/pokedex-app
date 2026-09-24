import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom"
import axios from "axios"
import Detail from "./Detail"

vi.mock("axios", () => ({
  __esModule: true,
  default: { get: vi.fn() },
}))

const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon"

const pikachu = {
  id: 25,
  name: "pikachu",
  types: [{ type: { name: "electric" } }],
  abilities: [{ ability: { name: "static" } }, { ability: { name: "lightning-rod" } }],
  weight: 60,
  height: 4,
  stats: [
    { base_stat: 35, stat: { name: "hp" } },
    { base_stat: 55, stat: { name: "attack" } },
  ],
}

const eevee = {
  ...pikachu,
  id: 133,
  name: "eevee",
  types: [{ type: { name: "normal" } }],
}

function NavigateToEevee() {
  const navigate = useNavigate()
  return <button onClick={() => navigate("/detail/eevee")}>go to eevee</button>
}

const renderDetail = (name) =>
  render(
    <MemoryRouter initialEntries={[`/detail/${name}`]}>
      <NavigateToEevee />
      <Routes>
        <Route path="/detail/:name" element={<Detail />} />
      </Routes>
    </MemoryRouter>
  )

describe("Detail", () => {
  beforeEach(() => {
    axios.get.mockReset()
  })

  it("shows a loading spinner while the request is in flight", () => {
    axios.get.mockReturnValue(new Promise(() => {}))
    const { container } = renderDetail("pikachu")

    expect(container.querySelector(".animate-spin")).toBeInTheDocument()
  })

  it("fetches the pokemon from the route param", async () => {
    axios.get.mockResolvedValue({ data: pikachu })
    renderDetail("pikachu")

    await screen.findByText("pikachu", { selector: "h2" })

    expect(axios.get).toHaveBeenCalledWith(`${POKEMON_URL}/pikachu`)
  })

  it("renders the pokemon details", async () => {
    axios.get.mockResolvedValue({ data: pikachu })
    renderDetail("pikachu")

    expect(await screen.findByText("pikachu", { selector: "h2" })).toBeInTheDocument()
    expect(screen.getByAltText("pikachu")).toHaveAttribute(
      "src",
      "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png"
    )
    expect(screen.getByText("electric")).toBeInTheDocument()
    expect(screen.getByText("static")).toBeInTheDocument()
    expect(screen.getByText("lightning rod")).toBeInTheDocument()
    expect(screen.getByText("6.0 kg")).toBeInTheDocument()
    expect(screen.getByText("0.4 m")).toBeInTheDocument()
    expect(screen.getByText("hp", { exact: false })).toBeInTheDocument()
    expect(screen.getByText("attack", { exact: false })).toBeInTheDocument()
    expect(screen.getByText("35")).toBeInTheDocument()
    expect(screen.getByText("55")).toBeInTheDocument()
  })

  it("shows a not found message for a 404 response", async () => {
    axios.get.mockRejectedValue({ response: { status: 404 } })
    renderDetail("eevee")

    expect(
      await screen.findByText(
        'Pokemon "eevee" was not found. Please check the spelling and try again.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText("[not found]")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "cd .." })).toHaveAttribute("href", "/")
  })

  it("shows a connection message when the request fails without a response", async () => {
    axios.get.mockRejectedValue(new Error("offline"))
    renderDetail("pikachu")

    expect(
      await screen.findByText(
        "Failed to load Pokemon data. Please check your internet connection and try again."
      )
    ).toBeInTheDocument()
  })

  it("ignores a stale response from a previous route param", async () => {
    const user = userEvent.setup()
    let resolvePikachu
    const pendingPikachu = new Promise((resolve) => {
      resolvePikachu = resolve
    })

    axios.get.mockImplementation((url) =>
      url.endsWith("pikachu") ? pendingPikachu : Promise.resolve({ data: eevee })
    )

    renderDetail("pikachu")
    await user.click(screen.getByRole("button", { name: "go to eevee" }))

    expect(await screen.findByText("eevee", { selector: "h2" })).toBeInTheDocument()

    resolvePikachu({ data: pikachu })

    await waitFor(() => expect(screen.getByText("eevee", { selector: "h2" })).toBeInTheDocument())
    expect(screen.queryByText("pikachu", { selector: "h2" })).not.toBeInTheDocument()
  })

  it("ignores a stale error from a previous route param", async () => {
    const user = userEvent.setup()
    let rejectPikachu
    const pendingPikachu = new Promise((_resolve, reject) => {
      rejectPikachu = reject
    })

    axios.get.mockImplementation((url) =>
      url.endsWith("pikachu") ? pendingPikachu : Promise.resolve({ data: eevee })
    )

    renderDetail("pikachu")
    await user.click(screen.getByRole("button", { name: "go to eevee" }))

    expect(await screen.findByText("eevee", { selector: "h2" })).toBeInTheDocument()

    rejectPikachu({ response: { status: 404 } })

    await waitFor(() => expect(screen.getByText("eevee", { selector: "h2" })).toBeInTheDocument())
    expect(screen.queryByText(/was not found/)).not.toBeInTheDocument()
  })

  it("clears stale data and shows a spinner immediately when the param changes", async () => {
    const user = userEvent.setup()
    axios.get.mockImplementation((url) =>
      url.endsWith("eevee") ? new Promise(() => {}) : Promise.resolve({ data: pikachu })
    )

    renderDetail("pikachu")
    expect(await screen.findByText("pikachu", { selector: "h2" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "go to eevee" }))

    // old pokemon never repaints; loading state takes over right away
    expect(screen.queryByText("pikachu", { selector: "h2" })).not.toBeInTheDocument()
    expect(document.querySelector(".animate-spin")).not.toBeNull()
    expect(axios.get).toHaveBeenLastCalledWith(`${POKEMON_URL}/eevee`)
  })

  it("refetches when the route param changes", async () => {
    const user = userEvent.setup()
    axios.get.mockImplementation((url) =>
      Promise.resolve({ data: url.endsWith("eevee") ? eevee : pikachu })
    )

    renderDetail("pikachu")
    expect(await screen.findByText("pikachu", { selector: "h2" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "go to eevee" }))

    expect(await screen.findByText("eevee", { selector: "h2" })).toBeInTheDocument()
    expect(axios.get).toHaveBeenLastCalledWith(`${POKEMON_URL}/eevee`)
    expect(screen.getByText("normal")).toBeInTheDocument()
  })
})
