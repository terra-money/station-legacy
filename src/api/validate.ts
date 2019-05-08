import { times, gt, lte, isInteger } from './math'
import { format, is } from '../utils'

export default {
  input: (input: string, max: string): string => {
    const amount = times(input || 0, 1e6)
    return !input
      ? 'Amount is required'
      : !gt(max, 0)
      ? 'Not enough balance'
      : !(gt(amount, 0) && lte(amount, max))
      ? `Amount must be between ${format.amount('1')} and ${format.amount(max)}`
      : !isInteger(amount)
      ? 'Amount must be within 6 decimal points'
      : ''
  },

  address: (to: string) =>
    !to ? 'Address is required' : !is.address(to) ? 'Address is invalid' : ''
}
