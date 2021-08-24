import { Dictionary } from 'ramda'
import useTerraAssets from '../hooks/useTerraAssets'
import { Whitelist } from '../types'

const useWhitelist = (name: string) => {
  const response = useTerraAssets<Dictionary<Whitelist>>('cw20/tokens.json')
  return { ...response, whitelist: response.data?.[name] }
}

export default useWhitelist
