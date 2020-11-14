import { Dictionary } from 'ramda'
import { ChainOptions } from '@terra-money/use-station'
import { localSettings } from '../../utils/localStorage'
import { Chains, list } from '../../chains'

export default () => {
  const { customNetworks = [] } = localSettings.get()

  const mergedChains = {
    ...Chains,
    ...customNetworks.reduce<Dictionary<ChainOptions>>(
      (acc, item) => ({ ...acc, [item.key]: item }),
      {}
    ),
  }

  const mergedList = [
    ...list,
    { title: 'Custom', list: customNetworks.map(({ key }) => key) },
  ]

  return { chains: mergedChains, list: mergedList }
}
