import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { sliceData } from "./utils/sliceNumber"

export default function Home() {
  const [data, setData] = useState({})
  const [offset, setOffset] = useState(0)
  const [limit] = useState(20)
  const [pokemon, setPokemon] = useState("")
  const [loading, setLoading] = useState(true)
  const [refetching, setRefetching] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const fetchData = async (isRefetch = false) => {
    setError("")
    if (isRefetch) {
      setRefetching(true)
    } else {
      setLoading(true)
    }
    try {
      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      )
      setData(res.data)
    } catch (err) {
      console.error(err)
      setError("Failed to load the Pokemon list. Please check your connection and try again.")
    } finally {
      setLoading(false)
      setRefetching(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.trim().toLowerCase()
      if (!query) return
      navigate(`/detail/${query}`)
      setPokemon("")
    }
  }

  useEffect(() => {
    fetchData(Boolean(data.results))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset])

  const hasResults = Boolean(data.results)

  return (
    <div className="min-h-full">
      <div className="text-center px-4">
        <label htmlFor="pokemon-search" className="sr-only">
          Search a Pokemon by name
        </label>
        <div className="inline-flex items-center glass rounded-xl overflow-hidden w-full max-w-xl">
          <span className="font-mono text-term-green pl-4 select-none" aria-hidden="true">
            &gt;_
          </span>
          <input
            id="pokemon-search"
            className="font-mono bg-transparent w-full px-3 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0"
            placeholder="search pokemon..."
            type="text"
            value={pokemon}
            onKeyDown={handleKeyDown}
            onChange={(e) => setPokemon(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
      {!hasResults && loading ? (
        <div className="flex justify-center items-center h-[77vh]">
          <div className="animate-spin rounded-full h-52 w-52 border-t-2 border-b-2 border-term-green"></div>
        </div>
      ) : error && !hasResults ? (
        <div className="container mx-auto my-20 text-center">
          <p className="font-mono text-term-red text-xl mb-6">
            [error] {error}
          </p>
          <button
            onClick={() => fetchData()}
            className="glass-btn font-mono rounded-lg px-6 py-3 text-term-green text-lg font-semibold"
          >
            retry
          </button>
        </div>
      ) : (
        <div className="container mx-auto my-10">
          {error && hasResults ? (
            <p className="font-mono text-center text-term-red font-semibold mb-4">
              [warn] {error}
            </p>
          ) : null}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center">
            {data.results?.map((item) => {
              const urlImgPokemon = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${sliceData(
                item.url
              )}.png`
              return (
                <div
                  key={item.name}
                  className="glass p-5 w-full rounded-xl hover:border-term-green/50 transition-colors"
                >
                  <h2 className="font-mono capitalize text-center font-semibold text-xl text-slate-100">
                    <span className="text-slate-500">#</span>
                    {item.name}
                  </h2>
                  <img src={urlImgPokemon} alt={item.name} className="w-full" loading="lazy" />
                  <Link to={`/detail/${item.name}`}>
                    <button className="glass-btn font-mono rounded-lg text-term-green w-full px-3 py-2 font-semibold">
                      ./detail
                    </button>
                  </Link>
                </div>
              )
            })}
          </div>
          {refetching ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-term-green"></div>
            </div>
          ) : null}
          <div className="py-7 text-center">
            <button
              disabled={!data.previous}
              onClick={() => setOffset(offset - limit)}
              className="glass-btn font-mono mr-5 rounded-lg px-6 py-3 text-term-cyan text-lg w-1/4"
            >
              &lt; prev
            </button>
            <button
              disabled={!data.next}
              onClick={() => setOffset(offset + limit)}
              className="glass-btn font-mono rounded-lg px-6 py-3 text-term-cyan text-lg w-1/4"
            >
              next &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
