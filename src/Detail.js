import axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function Detail() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const { name } = useParams()
  // console.log(name)

  const fetchData = async () => {
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      setData(res.data)
      setLoading(false)
      // console.log(res.data)
    } catch (err) {
      console.log(err.response.data)
      setLoading(false)
    }
  }

  const padNumber = (num) => {
    return String(num).padStart(3, "0")
  }

  useEffect(() => {
    fetchData()
  }, [])

  // console.log(data)
  return (
    <div className="min-h-full">
      {loading ? (
        <div className="flex justify-center items-center h-[82vh]">
          <div className="animate-spin rounded-full h-52 w-52 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-center text-3xl font-bold">Detail Pokemon</h1>
          <h1 className="capitalize text-center">- {data.name} -</h1>
          <div className="border bg-white p-5 my-8 rounded-lg shadow-lg">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 mb-5 gap-5">
              <div className="flex justify-center">
                <img
                  src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${padNumber(
                    data.id
                  )}.png`}
                  alt={data.name}
                />
              </div>
              <div>
                <h2 className="capitalize text-center text-3xl font-bold">{data.name}</h2>
                <h3 className="text-2xl mt-5">Type:</h3>
                <ul className="flex gap-2">
                  {data.types.map((item, i) => (
                    <li className="capitalize  my-3" key={i}>
                      <span className="bg-green-500 px-3 py-2 rounded-xl text-white font-semibold">
                        {item.type.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-2xl mt-5">Abilities:</h3>
                <ul className="flex gap-2">
                  {data.abilities.map((item, i) => (
                    <li className="capitalize  my-3" key={i}>
                      <span className="bg-cyan-500 px-3 py-2 rounded-xl text-white font-semibold">
                        {item.ability.name.split("-").join(" ")}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="sm:grid-cols-1 grid md:grid-cols-2">
                  <div>
                    <h3 className="text-2xl mt-5">Weight:</h3>
                    <p className="text-xl font-semibold">{data.weight} g</p>
                  </div>
                  <div>
                    <h3 className="text-2xl mt-5">Height:</h3>
                    <p className="text-xl font-semibold">{data.height} cm</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3>Stats: </h3>
              <ul>
                {data.stats.map((item, i) => (
                  <li className="capitalize" key={i}>
                    - {item.stat.name.split("-").join(" ")}: {item.base_stat}
                    <div className="w-full rounded-lg bg-neutral-200 dark:bg-neutral-600">
                      <div
                        className="bg-blue-400 rounded-lg p-0.5 text-center text-md font-medium leading-none"
                        style={{ width: `${item.base_stat}%` }}
                      >
                        {item.base_stat}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Detail
