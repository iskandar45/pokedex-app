import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import Footer from "./Footer"

describe("Footer", () => {
  it("links to React and Vercel", () => {
    render(<Footer />)

    expect(screen.getByRole("link", { name: "React" })).toHaveAttribute(
      "href",
      "http://reactjs.org"
    )
    expect(screen.getByRole("link", { name: "Vercel" })).toHaveAttribute(
      "href",
      "http://vercel.com"
    )
  })

  it("renders the author profile link safely", () => {
    render(<Footer />)

    const profileLink = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href")?.includes("iskandar45"))

    expect(profileLink).toBeDefined()
    expect(profileLink).toHaveAttribute("href", "https://github.com/iskandar45")
    expect(profileLink).toHaveAttribute("target", "_blank")
    expect(profileLink).toHaveAttribute("rel", "noreferrer")
    expect(profileLink).toHaveAccessibleName("Author's GitHub profile")
  })

  it("renders within a footer landmark", () => {
    const { container } = render(<Footer />)

    expect(container.querySelector("footer")).toBeInTheDocument()
    expect(container.querySelector("footer")).toHaveTextContent("built with")
  })
})
