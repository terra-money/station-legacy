import { useQuery } from 'react-query'
import axios from 'axios'
import { TERRA_ASSETS } from '../constants'

const config = { baseURL: TERRA_ASSETS }

const useTerraAssets = <T = any>(path: string) => {
  return useQuery(
    ['TerraAssets', path],
    async () => {
      const { data } = await axios.get<T>(path, config)
      return data
    },
    { staleTime: Infinity }
  )
}

export default useTerraAssets
