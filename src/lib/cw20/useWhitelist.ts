import { Dictionary } from 'ramda'
import { useCurrentChainName } from '../contexts/ConfigContext'
import useTerraAssets from '../hooks/useTerraAssets'
import { Whitelist } from '../types'

const useWhitelist = () => {
  const name = useCurrentChainName()
  const response = useTerraAssets<Dictionary<Whitelist>>('cw20/tokens.json')
  return { ...response, whitelist: response.data?.[name] }
}

export default useWhitelist
