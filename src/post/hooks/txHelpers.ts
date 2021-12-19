import { Dictionary } from 'ramda'
import { ParsedRaw, ParsedLog, PostError } from '../../types'
import { times, div, ceil, floor } from '../../utils/math'
import { decimal } from '../../utils/format'
// import useFCD from '../../api/useFCD'

export const config = { headers: { 'Content-Type': 'application/json' } }
const data: Record<string, string> = {
  uluna: '0.01133',
  uusd: '0.888945',
  uaud: '1.125998',
  ucad: '1.125998',
  uchf: '0.829682',
  ucny: '5.807779',
  udkk: '5.333674',
  ueur: '0.740788',
  ugbp: '0.651893',
  uhkd: '6.933777',
  uidr: '12919.345720',
  uinr: '64.478202',
  ujpy: '97.013619',
  ukrw: '1006.108863',
  umnt: '2539.842621',
  unok: '7.407881',
  uphp: '45.039920',
  usdr: '0.621894',
  usek: '7.407881',
  usgd: '1.185261',
  uthb: '27.379530',
}

export const useCalcFee = () => {
  // const url = '/v1/txs/gas_prices'
  // const { data } = useFCD<Dictionary<string>>({ url })

  const getGasPrice = (denom: string) => data?.[denom] ?? '0'

  const calcFeeFromGas = (gas: string, denom: string) =>
    ceil(times(gas, getGasPrice(denom)))

  const calcGasFromFee = (fee: string, denom: string) =>
    floor(div(fee, getGasPrice(denom)))

  const gasPrices = Object.entries(data ?? {}).reduce<Dictionary<string>>(
    (acc, [denom, value]) => ({ ...acc, [denom]: decimal(value) }),
    {}
  )

  return !data
    ? undefined
    : {
        gasPrices,
        gasPrice: getGasPrice,
        feeFromGas: calcFeeFromGas,
        gasFromFee: calcGasFromFee,
      }
}

/* error */
export const parseError = (
  e: PostError,
  defaultMessage: string = ''
): string => {
  try {
    if ('response' in e) {
      // API Error
      const { data } = e.response!

      if ('message' in data) {
        return data.message!
      } else if ('error' in data) {
        const { error } = data
        return typeof error === 'string'
          ? checkError(error!)
          : getMessage(error!)
      }
    }

    console.error(e)
    return defaultMessage
  } catch (e) {
    console.error(e)
    return defaultMessage
  }
}

export const checkError = (raw?: string): string => {
  if (!raw) {
    return ''
  } else {
    try {
      const parsed: ParsedRaw = JSON.parse(raw)
      return getMessage(parsed)
    } catch {
      return raw
    }
  }
}

const getMessage = (parsed: ParsedRaw): string => {
  if (Array.isArray(parsed)) {
    const { log } = parsed.find(({ success }) => !success) ?? {}
    const { message = '' }: ParsedLog = log ? JSON.parse(log) : {}
    return message
  } else if (typeof parsed === 'object') {
    const { message = '' } = parsed
    return message
  }

  return ''
}

export const stringify = (object: object): string | undefined => {
  const string = JSON.stringify(compact(object))
  return string === '{}' ? undefined : string
}

const compact = (object: object): object =>
  Object.entries(object).reduce(
    (acc, [key, value]) => Object.assign({}, acc, value && { [key]: value }),
    {}
  )
