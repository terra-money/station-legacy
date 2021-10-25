import { AccAddress, Coin } from '@terra-money/terra.js'
import BigNumber from 'bignumber.js'
import { DateTime } from 'luxon'
import { CoinItem, DisplayCoin, Whitelist } from '../types'
import is from './is'
import currencies from './currencies.json'

interface Config {
  integer?: boolean
}

export const decimal = (number: string = '0', decimals: number = 6): string =>
  new BigNumber(number)
    .decimalPlaces(decimals, BigNumber.ROUND_DOWN)
    .toFormat(decimals)

export const decimalN = (number: string = '0', decimals: number = 6): number =>
  new BigNumber(number).decimalPlaces(decimals, BigNumber.ROUND_DOWN).toNumber()

export const amount = (
  amount: string,
  decimals = 6,
  config?: Config
): string => {
  const number = new BigNumber(amount || 0).div(new BigNumber(10).pow(decimals))
  return decimal(number.toString(), config?.integer ? 0 : decimals)
}

export const amountN = (
  amount: string,
  decimals = 6,
  config?: Config
): number => {
  const number = new BigNumber(amount || 0).div(new BigNumber(10).pow(decimals))
  return decimalN(number.toString(), config?.integer ? 0 : decimals)
}

export const denom = (denom = '', whitelist?: Whitelist): string => {
  const unit = denom.slice(1).toUpperCase()
  const isValidTerra = is.nativeTerra(denom) && currencies.includes(unit)
  const symbol = AccAddress.validate(denom) && whitelist?.[denom]?.symbol

  if (!isValidTerra && !AccAddress.validate(denom)) {
    return denom.startsWith('ibc')
      ? ''
      : denom === 'uluna'
      ? 'Luna'
      : denom.replace('u', '').toUpperCase()
  }

  return symbol || (isValidTerra ? unit.slice(0, 2) + 'T' : '')
}

export const display = (
  coin: CoinItem,
  decimals = 6,
  config?: Config,
  whitelist?: Whitelist
): DisplayCoin => {
  const value = amount(coin.amount, decimals, config)
  const unit = denom(coin.denom, whitelist)
  return { value, unit }
}

export const coin = (
  coin: CoinItem,
  decimals = 6,
  config?: Config,
  whitelist?: Whitelist
): string => {
  const { value, unit } = display(coin, decimals, config, whitelist)
  return [value, unit].join(' ')
}

export const toAmount = (input: string, decimals = 6): string => {
  const number = new BigNumber(input ?? 0).times(
    new BigNumber(10).pow(decimals)
  )

  return input ? number.decimalPlaces(0, BigNumber.ROUND_DOWN).toString() : '0'
}

export const toInput = (amount: string, decimals = 6): string => {
  const number = new BigNumber(amount ?? 0).div(new BigNumber(10).pow(decimals))
  return amount ? number.decimalPlaces(6, BigNumber.ROUND_DOWN).toString() : '0'
}

export const date = (
  param: string | Date,
  config: { toLocale?: boolean; short?: boolean } = {}
): string => {
  const dt =
    typeof param === 'string'
      ? DateTime.fromISO(param)
      : DateTime.fromJSDate(param)

  const formatted = config.short
    ? dt.setLocale('en').toLocaleString(DateTime.DATE_MED)
    : config.toLocale
    ? dt.setLocale('en').toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
    : dt.toFormat('yyyy.MM.dd HH:mm:ss')

  return param
    ? formatted + (!config.short ? ` (${dt.offsetNameShort || 'Local'})` : '')
    : ''
}

export const truncate = (address: string, [h, t] = [6, 6]) => {
  if (!address) return ''

  const head = address.slice(0, h)
  const tail = address.slice(-1 * t, address.length)
  return address.length > h + t ? [head, tail].join('...') : address
}

export const sanitizeJSON = (string: string): string => {
  try {
    return JSON.stringify(JSON.parse(string))
  } catch {
    return ''
  }
}

export const parseJSON = (string?: string) => {
  if (string) {
    try {
      return JSON.parse(string)
    } catch {
      return undefined
    }
  } else {
    return undefined
  }
}

export const toStationCoin = ({ amount, denom }: Coin) => ({
  amount: amount.toString(),
  denom: denom.toString(),
})
