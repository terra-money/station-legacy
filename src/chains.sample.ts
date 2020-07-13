import { Dictionary } from 'ramda'
import { ChainOptions } from '@terra-money/use-station'

export const Chains: Dictionary<ChainOptions> = {
  columbus: {
    key: 'columbus',
    name: 'columbus-3',
    fcd: 'fcd.terra.dev',
    hostname: 'fcd.terra.dev',
    port: 443,
    secure: true,
  },
}

export const list: { title: string; list: string[] }[] = [
  { title: 'Mainnet', list: ['columbus'] },
]
