import { Dictionary } from 'ramda'
import { ChainOptions } from '@terra-money/use-station'

export const Chains: Dictionary<ChainOptions> = {
  columbus: {
    key: 'columbus',
    name: 'columbus-3',
    hostname: 'fcd.terra.dev',
    port: 443,
    secure: true
  }
}

export const list: string[] = ['columbus']
