import { times, gt, lte, isInteger } from './math'
import { format, is } from '../utils'
import BN from 'bignumber.js'

const between = ({
  input,
  range: [min, max],
  label = 'Amount',
  formatAmount
}: {
  input?: BN.Value
  range: BN.Value[]
  label?: string
  formatAmount?: boolean
}): string => {
  const amount = formatAmount ? times(input || 0, 1e6) : input || 0
  return !input
    ? `${label} is required`
    : !(gt(amount, min) && lte(amount, max))
    ? formatAmount
      ? `${label} must be between ${format.amount(1)} and ${format.amount(max)}`
      : `${label} must be between ${min} and ${max}`
    : ''
}

export default {
  between,

  input: (input: string, max: string): string => {
    const amount = times(input || 0, 1e6)
    return !gt(max, 0)
      ? 'Insufficient balance'
      : !isInteger(amount)
      ? 'Amount must be within 6 decimal points'
      : between({ input, range: [0, max], formatAmount: true })
  },

  address: (to: string) =>
    !to ? 'Address is required' : !is.address(to) ? 'Address is invalid' : ''
}
