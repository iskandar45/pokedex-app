import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { sliceData } from "./utils/sliceNumber"

export default function Home() {
  const [data, setData] = useState({})
  const [offset, setOffset] = useState(0)
  const [limit] = useState(20)
  const [pokemon, setPokemon] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const history = useHistory()

  const fetchData = async () => {
    setLoading(true)
    setError("")
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
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.trim().toLowerCase()
      if (!query) return
      history.push(`/detail/${query}`)
      setPokemon("")
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset])

  return (
    <div className="min-h-full">
      <div className="text-center">
        <input
          className="border border-slate-300 w-1/2 shadow-md bg-white px-3 py-3 rounded-lg focus:outline-violet-500"
          placeholder="Enter pokemon name..."
          type="text"
          value={pokemon}
          onKeyDown={handleKeyDown}
          onChange={(e) => setPokemon(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[77vh]">
          <div className="animate-spin rounded-full h-52 w-52 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="container mx-auto my-20 text-center">
          <p className="text-6xl mb-4">😵</p>
          <p className="text-xl font-semibold text-red-600 mb-6">{error}</p>
          <button
            onClick={() => fetchData()}
            className="rounded-lg px-6 py-3 border border-slate-300 shadow-md bg-blue-600 text-white hover:bg-blue-700 text-lg font-semibold"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="container mx-auto my-10">
          <div className="grid sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center ">
            {data.results?.map((item, index) => {
              const urlImgPokemon = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${sliceData(
                item.url
              )}.png`
              return (
                <div
                  key={index}
                  className="border p-5 border-slate-300 w-full rounded shadow-lg bg-white hover:bg-slate-100"
                >
                  <h2 className="capitalize text-center font-semibold text-2xl">{item.name}</h2>
                  <img src={urlImgPokemon} alt={item.name} className="w-full" />
                  <Link to={`/detail/${item.name}`}>
                    <button className="border bg-blue-600 rounded text-white border-slate-500 w-full px-3 py-2 hover:invert font-semibold">
                      Detail
                    </button>
                  </Link>
                </div>
              )
            })}
          </div>
          <div className="py-7 text-center">
            <button
              disabled={!data.previous}
              onClick={() => setOffset(offset - limit)}
              className={`mr-5 rounded-lg px-6 py-3 border border-slate-300 shadow-md bg-green-500 w-1/4 hover:invert text-lg ${
                !data.previous ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              prev
            </button>
            <button
              disabled={!data.next}
              onClick={() => setOffset(offset + limit)}
              className={`rounded-lg px-6 py-3 border border-slate-300 shadow-md bg-green-500 w-1/4 hover:invert text-lg ${
                !data.next ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
