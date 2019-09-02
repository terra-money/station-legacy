import BigNumber from 'bignumber.js'
import { DateTime } from 'luxon'

const formatDecimal = (number: BigNumber.Value, p: number = 6): string =>
  new BigNumber(number).decimalPlaces(p, BigNumber.ROUND_DOWN).toFormat(p)

const formatAmount = (amount: BigNumber.Value, p: number = 6): string =>
  new BigNumber(amount)
    .div(1e6)
    .decimalPlaces(p, BigNumber.ROUND_DOWN)
    .toFormat(p)

const formatDenom = (denom: string): string => {
  const f = denom.slice(1)
  return f && (f === 'luna' ? 'Luna' : f.slice(0, 2).toUpperCase() + 'T')
}

const formatCoin = ({ amount, denom }: Coin): string =>
  [formatAmount(amount), formatDenom(denom)].join(' ')

export default {
  decimal: formatDecimal,
  amount: formatAmount,
  denom: formatDenom,
  coin: formatCoin,
  coins: (coins: Coin[]): string[] => coins.map(formatCoin),

  date: (
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
  },

  truncate: (address: string = '', [h, t]: number[]) => {
    const head = address.slice(0, h)
    const tail = address.slice(-1 * t, address.length)
    return !address
      ? ''
      : address.length > h + t
      ? [head, tail].join('…')
      : address
  }
}
