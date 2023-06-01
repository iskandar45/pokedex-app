import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { sliceData } from "./utils/sliceNumber"

export default function Home() {
  const [data, setData] = useState([])
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(20)
  const [pokemon, setPokemon] = useState("")
  const [loading, setLoading] = useState(true)
  const history = useHistory()

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      )
      setData(res.data)
      setLoading(false)
    } catch (err) {
      console.log(err.response.data)
      setLoading(false)
    }
  }

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      setPokemon(e.target.value)
      history.push(`/detail/${pokemon}`)
      setPokemon("")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [offset])

  return (
    <div className="min-h-full">
      <div className="text-center">
        <input
          className="border border-slate-300 w-1/2 shadow-md bg-white px-3 py-3 rounded-lg focus:outline-violet-500"
          placeholder="Enter pokemon name..."
          type="text"
          value={pokemon}
          onKeyPress={handleKeyPress}
          onChange={(e) => setPokemon(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[77vh]">
          <div className="animate-spin rounded-full h-52 w-52 border-t-2 border-b-2 border-gray-900"></div>
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
