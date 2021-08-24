import { Coin, Balance } from '..'
import { find, plus, lte } from '../utils'

interface Params {
  amount: string
  denom: string
  fee: Coin
  tax?: Coin
}

type Validate = (params: Params, balance: Balance[]) => boolean

export const isAvailable: Validate = (params, balance) => {
  const { amount, denom, fee, tax } = params
  const total = plus(amount, tax?.amount ?? '0')
  const available = find(`${denom}:available`, balance) || '0'

  return fee.denom === denom
    ? lte(plus(total, fee.amount), available)
    : lte(total, available) && isFeeAvailable(fee, balance)
}

export const isDelegatable: Validate = (params, balance) => {
  const { amount, denom, fee } = params
  const available = (denom && find(`${denom}:available`, balance)) ?? '0'
  const delegatable = (denom && find(`${denom}:delegatable`, balance)) ?? '0'
  return denom === fee.denom
    ? lte(plus(amount, fee.amount), delegatable) && lte(fee.amount, available)
    : lte(amount, delegatable) && isFeeAvailable(params, balance)
}

export const isFeeAvailable = (fee: Coin, balance: Balance[]) => {
  const available = find(`${fee.denom}:available`, balance) || '0'
  return lte(fee.amount, available)
}

export const getFeeDenomList = (balance: Balance[]) =>
  balance.map(({ denom }) => denom)
