import { has } from 'ramda'
import bech32 from 'bech32'

const isCoins = (target: any): boolean =>
  Array.isArray(target) && target.every(isCoin)

const isCoin = (target: any): boolean =>
  !!target && has('amount')(target) && has('denom')(target)

const isBech32 = (value: string = '') => {
  try {
    const words = bech32.decode(value)
    return words.prefix === `terra`
  } catch (error) {
    return false
  }
}

export default {
  coin: (target: any): boolean =>
    target === null || isCoins(target) || isCoin(target),

  address: (string: string = ''): boolean =>
    string.length === 44 && string.startsWith('terra') && isBech32(string),

  bech32: isBech32
}
