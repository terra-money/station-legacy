import { bech32 } from 'bech32'
import Currencies from './currencies.json'

const isBech32 = (value: string) => {
  try {
    const words = bech32.decode(value)
    return words.prefix === `terra`
  } catch (error) {
    return false
  }
}

const nativeTerra = (string = '') =>
  string.startsWith('u') &&
  string.length === 4 &&
  Currencies.includes(string.slice(1).toUpperCase())

export default {
  address: (string: string = ''): boolean =>
    string.length === 44 && string.startsWith('terra') && isBech32(string),

  nativeTerra,
  nativeDenom: (string = '') => string === 'uluna' || nativeTerra(string),
  ibcDenom: (string = '') => string.startsWith('ibc/'),

  json: (param: any) => {
    try {
      JSON.parse(param)
      return true
    } catch {
      return false
    }
  },
}
