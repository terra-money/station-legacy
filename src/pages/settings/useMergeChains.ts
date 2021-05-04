import { Dictionary } from 'ramda'
import { ChainOptions } from '../../use-station/src'
import { localSettings } from '../../utils/localStorage'
import { Chains } from '../../chains'

export default () => {
  const { customNetworks = [] } = localSettings.get()

  const mergedChains = {
    ...Chains,
    ...customNetworks.reduce<Dictionary<ChainOptions>>(
      (acc, item) =>
        Object.assign({}, acc, validateNetwork(item) && { [item.name]: item }),
      {}
    ),
  }

  return mergedChains
}

const keys: (keyof ChainOptions)[] = ['name', 'chainID', 'lcd', 'fcd']
export const validateNetwork = (item: ChainOptions) =>
  keys.every((key) => typeof item[key] === 'string')
