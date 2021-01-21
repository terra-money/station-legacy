import { Dictionary } from 'ramda'
import { ChainOptions } from './use-station/src'

export const Chains: Dictionary<ChainOptions> = {
  mainnet: {
    name: 'mainnet',
    chainID: 'columbus-4',
    lcd: 'https://lcd.terra.dev',
    fcd: 'https://fcd.terra.dev',
    ws: 'wss://fcd.terra.dev',
  },
}
