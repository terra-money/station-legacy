import { Dictionary } from 'ramda'
import useTerraAssets from './useTerraAssets'
import { Contracts } from '../types'

const useContracts = (name: string) => {
  const response = useTerraAssets<Dictionary<Contracts>>('cw20/contracts.json')
  return { ...response, contracts: response.data?.[name] }
}

export default useContracts
