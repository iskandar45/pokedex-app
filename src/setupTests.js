import "@testing-library/jest-dom/vitest"
import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

// Vitest runs without globals, so RTL cannot auto-register its cleanup hook.
afterEach(() => {
  cleanup()
})
