import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import axios from "axios"
import App from "./App"

vi.mock("axios", () => ({
  __esModule: true,
  default: { get: vi.fn() },
}))

const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon"

const listResponse = {
  data: {
    count: 1302,
    next: `${POKEMON_URL}?offset=20&limit=20`,
    previous: null,
    results: [{ name: "bulbasaur", url: `${POKEMON_URL}/1/` }],
  },
}

const detailResponse = {
  data: {
    id: 25,
    name: "pikachu",
    types: [{ type: { name: "electric" } }],
    abilities: [{ ability: { name: "static" } }],
    weight: 60,
    height: 4,
    stats: [{ base_stat: 35, stat: { name: "hp" } }],
  },
}

describe("App", () => {
  beforeEach(() => {
    axios.get.mockReset()
  })

  it("renders the navbar, the pokemon list and the footer on the home route", async () => {
    window.history.pushState({}, "", "/")
    axios.get.mockResolvedValue(listResponse)

    render(<App />)

    expect(screen.getByText("PokéDex")).toBeInTheDocument()
    expect(await screen.findByText("bulbasaur")).toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
  })

  it("renders the detail view for /detail/:name", async () => {
    window.history.pushState({}, "", "/detail/pikachu")
    axios.get.mockResolvedValue(detailResponse)

    render(<App />)

    expect(await screen.findByText("- pikachu -")).toBeInTheDocument()
    expect(axios.get).toHaveBeenCalledWith(`${POKEMON_URL}/pikachu`)
  })

  it("renders the not found state for an unknown pokemon", async () => {
    window.history.pushState({}, "", "/detail/notarealpokemon")
    axios.get.mockRejectedValue({ response: { status: 404 } })

    render(<App />)

    expect(await screen.findByText(/was not found/)).toBeInTheDocument()
  })
})
