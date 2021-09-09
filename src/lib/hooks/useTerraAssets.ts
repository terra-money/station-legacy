import axios from 'axios'
import { useEffect, useState } from 'react'

const config = { baseURL: 'https://assets.terra.money' }

const useTerraAssets = <T = any>(path: string) => {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(path, config)
        setData(data)
      } catch (error) {
        setError(error)
      }
      setLoading(false)
    }

    fetch()
  }, [path])

  return { data, loading, error }
}

export default useTerraAssets
