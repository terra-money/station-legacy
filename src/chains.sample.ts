import { Dictionary } from 'ramda'
import { ChainOptions } from '@terra-money/use-station'

export const Chains: Dictionary<ChainOptions> = {
  columbus: {
    key: 'columbus',
    name: 'columbus-4',
    lcd: 'https://lcd.terra.dev',
    fcd: 'https://fcd.terra.dev',
    ws: { hostname: 'fcd.terra.dev', port: 443, secure: true },
  },
}

export const list: { title: string; list: string[] }[] = [
  { title: 'Mainnet', list: ['columbus'] },
]
