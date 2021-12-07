import { Dictionary } from 'ramda'
import { useCurrentChainName } from '../data/chain'
import useTerraAssets from '../hooks/useTerraAssets'
import { NFTContracts } from '../types'

const useCW721Whitelist = () => {
  const name = useCurrentChainName()
  const response = useTerraAssets<Dictionary<NFTContracts>>(
    'cw721/contracts.json'
  )

  return { ...response, whitelist: response.data?.[name] }
}

export default useCW721Whitelist
