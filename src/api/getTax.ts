import { times, min, ceil } from './math'
import api from './api'

export default async ({ amount, denom }: Coin): Promise<string> => {
  const { data: taxRate } = await api.get('/treasury/tax-rate')
  const { data: taxCap } = await api.get(`/treasury/tax-cap/${denom}`)
  return ceil(min([times(amount, taxRate.tax_rate), taxCap.tax_cap]))
}
