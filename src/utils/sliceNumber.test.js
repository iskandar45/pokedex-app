import { describe, expect, it } from "vitest"
import { sliceData } from "./sliceNumber"

describe("sliceData", () => {
  it("pads a single digit PokéAPI id to three digits", () => {
    expect(sliceData("https://pokeapi.co/api/v2/pokemon/1/")).toBe("001")
  })

  it("pads a two digit id to three digits", () => {
    expect(sliceData("https://pokeapi.co/api/v2/pokemon/25/")).toBe("025")
  })

  it("leaves a three digit id untouched", () => {
    expect(sliceData("https://pokeapi.co/api/v2/pokemon/151/")).toBe("151")
  })

  it("does not truncate ids longer than three digits", () => {
    expect(sliceData("https://pokeapi.co/api/v2/pokemon/1000/")).toBe("1000")
  })

  it("reads the id from the second to last path segment", () => {
    expect(sliceData("https://pokeapi.co/api/v2/pokemon-form/10001/")).toBe("10001")
  })
})
