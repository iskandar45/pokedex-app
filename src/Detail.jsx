import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

function Detail() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { name } = useParams()

  // Reset stale state synchronously during render so switching between two
  // /detail/:name routes never paints the previous pokemon (React docs:
  // "adjusting state when a prop changes").
  const [prevName, setPrevName] = useState(name)
  if (prevName !== name) {
    setPrevName(name)
    setData(null)
    setError("")
    setLoading(true)
  }

  useEffect(() => {
    let isActive = true

    const fetchData = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        if (!isActive) return
        setData(res.data)
      } catch (err) {
        if (!isActive) return
        if (err.response && err.response.status === 404) {
          setError(`Pokemon "${name}" was not found. Please check the spelling and try again.`)
        } else {
          setError("Failed to load Pokemon data. Please check your internet connection and try again.")
        }
      } finally {
        if (isActive) setLoading(false)
      }
    }

    fetchData()

    return () => {
      isActive = false
    }
  }, [name])

  const padNumber = (num) => {
    return String(num).padStart(3, "0")
  }

  return (
    <div className="min-h-full">
      {loading ? (
        <div className="flex justify-center items-center h-[82vh]">
          <div className="animate-spin rounded-full h-52 w-52 border-t-2 border-b-2 border-term-green"></div>
        </div>
      ) : error ? (
        <div className="container max-w-4xl mx-auto">
          <div className="glass p-10 my-8 rounded-xl text-center">
            <p className="font-mono text-5xl mb-4">404</p>
            <h1 className="font-mono text-2xl font-bold mb-3 text-term-amber">[not found]</h1>
            <p className="text-slate-400 mb-6">{error}</p>
            <Link
              to="/"
              className="glass-btn font-mono inline-block rounded-lg px-6 py-3 font-semibold text-term-green"
            >
              cd ..
            </Link>
          </div>
        </div>
      ) : (
        <div className="container max-w-4xl mx-auto">
          <h1 className="font-mono text-center text-2xl text-slate-500">
            <span className="text-term-green">~$</span> ./detail --name={data.name}
          </h1>
          <div className="glass p-5 my-8 rounded-xl">
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
                <h2 className="capitalize text-center text-3xl font-bold text-term-green">
                  {data.name}
                </h2>
                <h3 className="font-mono text-lg mt-5 text-term-cyan">type:</h3>
                <ul className="flex gap-2">
                  {data.types.map((item, i) => (
                    <li className="capitalize my-3" key={i}>
                      <span className="glass-btn font-mono px-3 py-2 rounded-lg text-term-green font-semibold">
                        {item.type.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <h3 className="font-mono text-lg mt-5 text-term-cyan">abilities:</h3>
                <ul className="flex flex-wrap gap-2">
                  {data.abilities.map((item, i) => (
                    <li className="capitalize my-3" key={i}>
                      <span className="glass-btn font-mono px-3 py-2 rounded-lg text-term-amber font-semibold">
                        {item.ability.name.split("-").join(" ")}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="sm:grid-cols-1 grid md:grid-cols-2">
                  <div>
                    <h3 className="font-mono text-lg mt-5 text-term-cyan">weight:</h3>
                    <p className="font-mono text-xl font-semibold">
                      {(data.weight / 10).toFixed(1)} kg
                    </p>
                  </div>
                  <div>
                    <h3 className="font-mono text-lg mt-5 text-term-cyan">height:</h3>
                    <p className="font-mono text-xl font-semibold">
                      {(data.height / 10).toFixed(1)} m
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-mono text-lg text-term-cyan">stats:</h3>
              <ul>
                {data.stats.map((item, i) => (
                  <li className="capitalize" key={i}>
                    <span className="font-mono text-sm text-slate-400">
                      {item.stat.name.split("-").join(" ")}
                    </span>
                    <span className="float-right font-mono text-sm text-term-green">
                      {item.base_stat}
                    </span>
                    <div className="w-full rounded-lg bg-white/10 overflow-hidden my-1">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-term-cyan to-term-green"
                        style={{ width: `${Math.min(100, (item.base_stat / 255) * 100)}%` }}
                      ></div>
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
