import { Dictionary } from 'ramda'
import useTerraAssets from './useTerraAssets'

const useValidators = () => {
  return useTerraAssets<Dictionary<string>>('validators.json')
}

export default useValidators
